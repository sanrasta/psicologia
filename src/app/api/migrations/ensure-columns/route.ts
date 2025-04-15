import { NextResponse } from "next/server";
import { ensureAllColumns } from "@/drizzle/migrations/ensure_all_columns";

export async function POST() {
  try {
    const result = await ensureAllColumns();
    
    if (result.error) {
      return NextResponse.json(
        { success: false, error: result.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error ensuring columns:", error);
    return NextResponse.json(
      { success: false, error: "Failed to ensure columns" },
      { status: 500 }
    );
  }
} 