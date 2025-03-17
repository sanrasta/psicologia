import { boolean, integer, pgTable, text, uuid, timestamp, index, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { DAYS_OF_WEEK_IN_ORDER } from "@/data/constants";
import { serial } from "drizzle-orm/pg-core";

// Common columns
const createdAt = timestamp("createdAt").notNull().defaultNow();
const updatedAt = timestamp("updatedAt").notNull().defaultNow().$onUpdate(() => new Date());

// Create the day enum type to match your database
export const dayEnum = pgEnum('day', DAYS_OF_WEEK_IN_ORDER)

// Events Table
export const EventTable = pgTable("events", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    description: text("description"),
    durationInMinutes: integer("durationInMinutes").notNull(),
    clerkUserId: text("clerkUserId").notNull(),
    isActive: boolean("isActive").default(true).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
}, (table) => ({
    clerkUserIdIndex: index("clerkUserIdIndex").on(table.clerkUserId)
}));

// Schedules Table
export const ScheduleTable = pgTable("schedules", {
    id: uuid("id").primaryKey().defaultRandom(),
    clerkUserId: text("clerkUserId").notNull().unique(),
    timezone: text("timezone").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const scheduleRelations = relations(ScheduleTable, ({many}) => ({
    availabilities: many(ScheduleAvailabilityTable)
}))

// Schedule Availability Table
export const ScheduleAvailabilityTable = pgTable("schedule_availabilities", {
    id: uuid("id").primaryKey().defaultRandom(),
    scheduleId: uuid("scheduleId")
        .notNull()
        .references(() => ScheduleTable.id, { onDelete: "cascade" }),
    dayOfWeek: dayEnum("dayOfWeek").notNull(),
    startTime: text("startTime").notNull(),
    endTime: text("endTime").notNull(),
});

export const ScheduleAvailabilityRelations = relations(ScheduleAvailabilityTable, ({one}) =>({
    schedule: one(ScheduleTable, {
        fields: [ScheduleAvailabilityTable.scheduleId],
        references: [ScheduleTable.id]
    })
}))