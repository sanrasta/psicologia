"use server"
import { db } from "@/db"
import { EventTable } from "@/drizzle/schema"
import { eq } from "drizzle-orm"
import { auth } from "@clerk/nextjs/server"

export async function createMeeting(data: {
  name: string
  duration: string
  calendlyUrl: string
  description?: string
  locationType: string
}) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return { success: false, error: "User not authenticated" }
    }

    const result = await db.insert(EventTable).values({
      ...data,
      clerkUserId: userId,
      isActive: true
    }).returning()
    
    return { success: true, data: result[0] }
  } catch (error: unknown) {
    console.error("Error creating meeting:", error)
    return { success: false, error: "Failed to create meeting" }
  }
}

export async function getMeetings() {
  try {
    const result = await db.select().from(EventTable)
    return { success: true, data: result }
  } catch (error: unknown) {
    console.error("Error getting meetings:", error)
    return { success: false, error: "Failed to get meetings" }
  }
}

export async function deleteMeeting(id: number) {
  try {
    await db.delete(EventTable).where(eq(EventTable.id, id))
    return { success: true }
  } catch (error: unknown) {
    console.error("Error deleting meeting:", error)
    return { success: false, error: "Failed to delete meeting" }
  }
}
