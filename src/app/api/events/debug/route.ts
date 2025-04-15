import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/drizzle/db";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if the events table exists
    const tableExists = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'events'
      );
    `);

    // Get all events for the user
    const events = await db.execute(sql`
      SELECT * FROM events 
      WHERE clerk_user_id = ${userId}
    `);

    // Get the table structure
    const tableStructure = await db.execute(sql`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'events'
    `);

    return NextResponse.json({
      tableExists: tableExists[0].exists,
      events: events,
      tableStructure: tableStructure
    });
  } catch (error) {
    console.error("Debug error:", error);
    return NextResponse.json(
      { error: "Debug failed", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 