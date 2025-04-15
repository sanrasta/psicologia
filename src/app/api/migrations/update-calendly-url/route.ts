import { NextResponse } from "next/server";
import { updateCalendlyUrlColumn } from "@/drizzle/migrations/update_calendly_url";

export async function POST() {
  try {
    const result = await updateCalendlyUrlColumn();
    
    if (result.error) {
      return NextResponse.json(
        { success: false, error: result.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating calendly_url column:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update calendly_url column" },
      { status: 500 }
    );
  }
} 