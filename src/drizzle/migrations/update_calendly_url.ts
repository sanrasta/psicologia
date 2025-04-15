"use server"

import { db } from "@/drizzle/db";
import { sql } from "drizzle-orm";

export async function updateCalendlyUrlColumn() {
  try {
    // Make calendly_url column not null and add default value
    await db.execute(sql`
      ALTER TABLE events 
      ALTER COLUMN calendly_url SET NOT NULL,
      ALTER COLUMN calendly_url SET DEFAULT 'https://calendly.com/your-calendly-username/default';
    `);
    
    console.log("Successfully updated calendly_url column");
    return { success: true };
  } catch (error) {
    console.error("Error updating calendly_url column:", error);
    return { error: true, message: error instanceof Error ? error.message : String(error) };
  }
} 