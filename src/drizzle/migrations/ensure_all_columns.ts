"use server"

import { db } from "@/drizzle/db";
import { sql } from "drizzle-orm";

export async function ensureAllColumns() {
  try {
    // Add name column if it doesn't exist
    await db.execute(sql`
      ALTER TABLE events 
      ADD COLUMN IF NOT EXISTS name varchar(255) NOT NULL DEFAULT 'Untitled Event';
    `);

    // Add description column if it doesn't exist
    await db.execute(sql`
      ALTER TABLE events 
      ADD COLUMN IF NOT EXISTS description text;
    `);

    // Add duration column if it doesn't exist
    await db.execute(sql`
      ALTER TABLE events 
      ADD COLUMN IF NOT EXISTS duration varchar(50) NOT NULL DEFAULT '30';
    `);

    // Add calendly_url column if it doesn't exist
    await db.execute(sql`
      ALTER TABLE events 
      ADD COLUMN IF NOT EXISTS calendly_url varchar(255);
    `);

    // Add is_active column if it doesn't exist
    await db.execute(sql`
      ALTER TABLE events 
      ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true;
    `);

    // Add location_type column if it doesn't exist
    await db.execute(sql`
      ALTER TABLE events 
      ADD COLUMN IF NOT EXISTS location_type varchar(50) NOT NULL DEFAULT 'in-person';
    `);

    // Add created_at column if it doesn't exist
    await db.execute(sql`
      ALTER TABLE events 
      ADD COLUMN IF NOT EXISTS created_at timestamp NOT NULL DEFAULT now();
    `);

    // Add updated_at column if it doesn't exist
    await db.execute(sql`
      ALTER TABLE events 
      ADD COLUMN IF NOT EXISTS updated_at timestamp NOT NULL DEFAULT now();
    `);
    
    console.log("Successfully ensured all columns exist");
    return { success: true };
  } catch (error) {
    console.error("Error ensuring columns:", error);
    return { error: true, message: error instanceof Error ? error.message : String(error) };
  }
} 