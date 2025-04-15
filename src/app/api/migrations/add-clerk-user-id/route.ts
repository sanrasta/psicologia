import { NextResponse } from "next/server";
import { addClerkUserIdColumn } from "@/drizzle/migrations/add_clerk_user_id";

export async function POST() {
  try {
    const result = await addClerkUserIdColumn();
    
    if (result.error) {
      return NextResponse.json(
        { success: false, error: result.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error adding clerk_user_id column:", error);
    return NextResponse.json(
      { success: false, error: "Failed to add clerk_user_id column" },
      { status: 500 }
    );
  }
} 