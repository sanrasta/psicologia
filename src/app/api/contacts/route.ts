import { db } from "@/drizzle/db";
import { ContactTable } from "@/drizzle/schema";
import { desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const contacts = await db.query.ContactTable.findMany({
      orderBy: [desc(ContactTable.createdAt)],
    });

    return NextResponse.json(contacts);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return NextResponse.json(
      { error: "Failed to fetch contacts" },
      { status: 500 }
    );
  }
} 