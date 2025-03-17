import { DAYS_OF_WEEK_IN_ORDER } from "@/data/constants"
import { db } from "@/drizzle/db"
import { ScheduleAvailabilityTable } from "@/drizzle/schema"
import { getCalendarEventTimes } from "@/server/googleCalendar"
import { 
  fromZonedTime, 
  toZonedTime 
} from "date-fns-tz"
import {
  addMinutes,
  areIntervalsOverlapping,
  format,
  isFriday,
  isMonday,
  isSaturday,
  isSunday,
  isThursday,
  isTuesday,
  isWednesday,
  isWithinInterval,
  setHours,
  setMinutes,
} from "date-fns"

export async function getValidTimesFromSchedule(
  timesInOrder: Date[],
  event: { clerkUserId: string; durationInMinutes: number }
) {
  console.log("Getting valid times for event:", event);
  
  const start = timesInOrder[0]
  const end = timesInOrder.at(-1)

  if (start == null || end == null) return []

  // Fetch the user's schedule
  const schedule = await db.query.ScheduleTable.findFirst({
    where: ({ clerkUserId: userIdCol }, { eq }) =>
      eq(userIdCol, event.clerkUserId),
    with: { availabilities: true },
  })

  if (schedule == null || !schedule.availabilities.length) {
    console.log("No schedule or availabilities found");
    return []
  }

  console.log("Found schedule with timezone:", schedule.timezone);
  console.log("Availabilities:", schedule.availabilities.map(a => a.dayOfWeek));

  // Get calendar events to block out times
  const eventTimes = await getCalendarEventTimes(event.clerkUserId, {
    start,
    end,
  })
  console.log(`Found ${eventTimes.length} existing calendar events`);

  // Get valid times based on schedule
  return timesInOrder.filter(time => {
    // Convert to user's timezone for availability checking
    const timeInScheduleTz = toZonedTime(time, schedule.timezone)
    
    // The duration of the event must fit within availability slots
    const timeWithDuration = addMinutes(time, event.durationInMinutes)

    // Check if this time is within any of the availability slots
    const availableSlots = getAvailabilityIntervalsForDate(
      timeInScheduleTz,
      schedule.availabilities,
      schedule.timezone
    )
    
    if (availableSlots.length === 0) {
      return false
    }

    // Check if the time + duration fits within an availability slot
    const fitsIntoSlot = availableSlots.some(slot =>
      isWithinInterval(time, slot) &&
      isWithinInterval(addMinutes(time, event.durationInMinutes - 1), slot)
    )
    
    if (!fitsIntoSlot) {
      return false
    }

    // Check if there are overlapping calendar events
    const hasOverlappingEvents = eventTimes.some(eventTime =>
      areIntervalsOverlapping(
        { start: time, end: timeWithDuration },
        eventTime
      )
    )

    return !hasOverlappingEvents
  })
}

function getAvailabilityIntervalsForDate(
  date: Date,
  availabilities: typeof ScheduleAvailabilityTable.$inferSelect[],
  timezone: string
) {
  // Get day name but handle the typo in the database (wendesday vs wednesday)
  const dayName = format(date, 'EEEE').toLowerCase();
  const dayOfWeek = dayName === 'wednesday' ? 'wendesday' : dayName;
  
  // Find availabilities that match this day
  const dayAvailabilities = availabilities.filter(a => 
    a.dayOfWeek.toLowerCase() === dayOfWeek
  );

  if (dayAvailabilities.length === 0) {
    return []
  }

  // Convert availability time strings to actual intervals for this date
  return dayAvailabilities.map(({ startTime, endTime }) => {
    const start = fromZonedTime(
      setMinutes(
        setHours(date, parseInt(startTime.split(":")[0])),
        parseInt(startTime.split(":")[1])
      ),
      timezone
    )

    const end = fromZonedTime(
      setMinutes(
        setHours(date, parseInt(endTime.split(":")[0])),
        parseInt(endTime.split(":")[1])
      ),
      timezone
    )

    return { start, end }
  })
}