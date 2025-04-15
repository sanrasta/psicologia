import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";
import { EventTable } from "@/drizzle/schema";

export async function POST() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Delete all existing events for this user
    await db.delete(EventTable)
      .where(eq(EventTable.clerkUserId, userId));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error resetting events:", error);
    return NextResponse.json(
      { error: "Failed to reset events" },
      { status: 500 }
    );
  }
} 