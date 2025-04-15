"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/drizzle/db";
import { EventTable } from "@/drizzle/schema";
import { eq, count } from "drizzle-orm";

// Create default events for a user
export async function createDefaultEvents() {
  const { userId } = await auth();
  console.log("Creating default events for user:", userId);
  
  if (!userId) return { error: true };

  try {
    // Check if user already has exactly 4 events - if so, don't recreate them
    const eventCount = await db.select({ count: count() })
      .from(EventTable)
      .where(eq(EventTable.clerkUserId, userId));
    
    console.log("Current event count:", eventCount[0].count);
    
    if (eventCount[0].count === 4) {
      console.log(`User ${userId} already has 4 events, skipping creation`);
      return { error: false };
    }
    
    // Delete all existing events for this user
    await db.delete(EventTable)
      .where(eq(EventTable.clerkUserId, userId));
    
    console.log(`Deleted existing events for user ${userId}`);
    
    // Create the 4 default events
    const defaultEvents = [
      {
        name: "Initial Consultation",
        description: "A 15-minute consultation to discuss your dog's training needs and goals",
        duration: "15",
        clerkUserId: userId,
        isActive: true,
        locationType: "virtual",
        calendlyUrl: "https://calendly.com/18e9aa18-284e-49fa-8cab-1d97b5c10a0f/15min"
      },
      {
        name: "Behavior Assessment",
        description: "30-minute session to evaluate your dog's behavior and create a personalized training plan",
        duration: "30",
        clerkUserId: userId,
        isActive: true,
        locationType: "in-person",
        calendlyUrl: "https://calendly.com/18e9aa18-284e-49fa-8cab-1d97b5c10a0f/30min"
      },
      {
        name: "Basic Obedience Training",
        description: "60-minute session focusing on basic commands and good behavior",
        duration: "60",
        clerkUserId: userId,
        isActive: true,
        locationType: "in-person",
        calendlyUrl: "https://calendly.com/18e9aa18-284e-49fa-8cab-1d97b5c10a0f/60min"
      },
      {
        name: "Advanced Training",
        description: "90-minute session for advanced commands and complex behaviors",
        duration: "90",
        clerkUserId: userId,
        isActive: true,
        locationType: "in-person",
        calendlyUrl: "https://calendly.com/18e9aa18-284e-49fa-8cab-1d97b5c10a0f/90min"
      }
    ];
    
    console.log("Creating default events:", JSON.stringify(defaultEvents, null, 2));
    
    // Insert all default events
    await db.insert(EventTable).values(defaultEvents);
    
    console.log(`Created 4 default events for user ${userId}`);
    return { error: false };
  } catch (error) {
    console.error("Error creating default events:", error);
    return { error: true };
  }
}