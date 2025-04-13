"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/drizzle/db";
import { EventTable } from "@/drizzle/schema";
import { eq, count } from "drizzle-orm";
import { v4 as uuidv4 } from 'uuid';

// Create default events for a user
export async function createDefaultEvents() {
  const { userId } = await auth();
  if (!userId) return { error: true };

  try {
    // Check if user already has exactly 4 events - if so, don't recreate them
    const eventCount = await db.select({ count: count() })
      .from(EventTable)
      .where(eq(EventTable.clerkUserId, userId));
    
    if (eventCount[0].count === 4) {
      console.log(`User ${userId} already has 4 events, skipping creation`);
      return { error: false };
    }
    
    // Delete all existing events for this user
    await db.delete(EventTable)
      .where(eq(EventTable.clerkUserId, userId));
    
    console.log(`Deleted existing events for user ${userId}`);
    
    // Create the 4 default events with dynamically generated IDs
    const defaultEvents = [
      {
        id: uuidv4(),
        name: "Initial Consultation",
        description: "A 15-minute consultation to discuss your dog's training needs and goals",
        durationInMinutes: 15,
        clerkUserId: userId,
        isActive: true,
        locationType: "virtual"
      },
      {
        id: uuidv4(),
        name: "Behavior Assessment",
        description: "30-minute session to evaluate your dog's behavior and create a personalized training plan",
        durationInMinutes: 30,
        clerkUserId: userId,
        isActive: true,
        locationType: "in-person"
      },
      {
        id: uuidv4(),
        name: "Training Session",
        description: "60-minute hands-on training session for you and your dog",
        durationInMinutes: 60,
        clerkUserId: userId,
        isActive: true,
        locationType: "in-person"
      },
      {
        id: uuidv4(),
        name: "Virtual Check-in",
        description: "45-minute online session to review progress and adjust training techniques",
        durationInMinutes: 45,
        clerkUserId: userId,
        isActive: true,
        locationType: "virtual"
      }
    ];

    // Insert all default events
    await db.insert(EventTable).values(defaultEvents);
    
    console.log(`Created 4 default events for user ${userId}`);
    
    return { error: false };
  } catch (error) {
    console.error("Error creating default events:", error);
    return { error: true };
  }
}