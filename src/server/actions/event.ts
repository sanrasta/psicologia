"use server";

import "server-only";
import { EventFormSchema } from "@/schema/events";
import { z } from "zod";
import { EventTable } from "@/drizzle/schema";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/drizzle/db";
import { redirect } from "next/navigation";
import { eq, and } from "drizzle-orm";


export async function createEvent(
  unsafeData: z.infer<typeof EventFormSchema>
): Promise<{ error: boolean } | undefined> {
  const { userId } = await auth();

  const { success, data } = EventFormSchema.safeParse(unsafeData);

  if (!success || userId == null) {
    return { error: true };
  }

  const { durationInMinutes, ...rest } = data;
  const transformedData = {
    ...rest,
    duration: durationInMinutes.toString(),
    clerkUserId: userId
  };

  await db.insert(EventTable).values(transformedData);

  redirect("/events");
}

export async function updateEvent(
    id: number,
    unsafeData: z.infer<typeof EventFormSchema>
  ): Promise<{ error: boolean } | undefined> {
    const { userId } = await auth();
  
    const { success, data } = EventFormSchema.safeParse(unsafeData);
  
    if (!success || userId == null) {
      return { error: true };
    }

    const { durationInMinutes, ...rest } = data;
    const transformedData = {
      ...rest,
      duration: durationInMinutes.toString()
    };

    const result = await db
      .update(EventTable)
      .set(transformedData)
      .where(and(eq(EventTable.id, id), eq(EventTable.clerkUserId, userId)));
  
    if (!result) {
        return { error: true };
    }
  
    redirect("/events");
}

export async function deleteEvent(
  id: number,
): Promise<{ error: boolean } | undefined> {
  const { userId } = await auth();

  if (userId == null) {
    return { error: true };
  }

  const result = await db
    .delete(EventTable)
    .where(and(eq(EventTable.id, id), eq(EventTable.clerkUserId, userId)));

  if (!result) {
    return { error: true };
  }

  redirect("/events");
}