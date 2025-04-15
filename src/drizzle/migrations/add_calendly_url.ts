"use server"

import { db } from "@/drizzle/db";
import { sql } from "drizzle-orm";

export async function addCalendlyUrlColumn() {
  try {
    // Add the calendly_url column if it doesn't exist
    await db.execute(sql`
      ALTER TABLE events 
      ADD COLUMN IF NOT EXISTS calendly_url varchar(255) DEFAULT 'https://calendly.com/your-calendly-username/default';
    `);
    
    console.log("Successfully added calendly_url column");
    return { success: true };
  } catch (error) {
    console.error("Error adding calendly_url column:", error);
    return { error: true, message: error instanceof Error ? error.message : String(error) };
  }
} 