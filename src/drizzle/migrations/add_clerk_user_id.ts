"use server"

import { db } from "@/drizzle/db";
import { sql } from "drizzle-orm";

export async function addClerkUserIdColumn() {
  try {
    // First, add the column as nullable
    await db.execute(sql`
      ALTER TABLE events 
      ADD COLUMN IF NOT EXISTS clerk_user_id varchar(255);
    `);
    
    // Then update existing records with a default value
    await db.execute(sql`
      UPDATE events 
      SET clerk_user_id = 'default_user'
      WHERE clerk_user_id IS NULL;
    `);
    
    // Finally, make the column NOT NULL
    await db.execute(sql`
      ALTER TABLE events 
      ALTER COLUMN clerk_user_id SET NOT NULL;
    `);
    
    console.log("Successfully added clerk_user_id column");
    return { success: true };
  } catch (error) {
    console.error("Error adding clerk_user_id column:", error);
    return { error: true, message: error instanceof Error ? error.message : String(error) };
  }
} 