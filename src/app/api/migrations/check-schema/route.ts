import { db } from "@/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await db.execute<{ current_schema: string }>("SELECT current_schema()");
    return NextResponse.json({ schema: result[0].current_schema });
  } catch (error) {
    return NextResponse.json({ 
      error: "Failed to check schema",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
} 