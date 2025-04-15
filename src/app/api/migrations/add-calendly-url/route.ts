import { NextResponse } from "next/server";
import { addCalendlyUrlColumn } from "@/drizzle/migrations/add_calendly_url";

export async function POST() {
  try {
    const result = await addCalendlyUrlColumn();
    
    if (result.error) {
      return NextResponse.json(
        { success: false, error: result.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error adding calendly_url column:", error);
    return NextResponse.json(
      { success: false, error: "Failed to add calendly_url column" },
      { status: 500 }
    );
  }
} 