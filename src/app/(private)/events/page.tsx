import { db } from "@/drizzle/db";
import { auth } from "@clerk/nextjs/server";
import { createDefaultEvents } from "@/server/actions/defaultEvents";
import { EventsPageClient } from "./client-page";

export const revalidate = 0;

export default async function EventsPage() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return null; // The middleware will handle redirection
    }

    try {
      // Try to create default events, but continue even if it fails
      await createDefaultEvents();
    } catch (createError) {
      console.error("Error creating default events:", createError);
      // We'll continue and just try to fetch existing events
    }
    
    try {
      const events = await db.query.EventTable.findMany({
        where: ({ clerkUserId }, { eq }) => eq(clerkUserId, userId),
        orderBy: ({ createdAt }, { desc }) => [desc(createdAt)],
        columns: {
          id: true,
          name: true, 
          description: true,
          durationInMinutes: true,
          isActive: true,
          clerkUserId: true,
          locationType: true,
        }
      });

      console.log("Found events:", events);
      return <EventsPageClient events={events} />;
    } catch (dbError) {
      console.error("Database query error:", dbError);
      // If db query fails, return client with empty events array
      return <EventsPageClient events={[]} />;
    }
  } catch (error) {
    console.error("Error in events page:", error);
    // Return a fallback UI instead of throwing an error
    return (
      <div className="p-10 bg-[#FAF3E0] min-h-screen">
        <h1 className="text-3xl font-bold text-[#5C4033] mb-4">Error Loading Training Sessions</h1>
        <p className="text-[#2E2E2E] mb-4">We encountered an error while loading your training sessions.</p>
        <pre className="bg-[#2E2E2E]/10 p-4 rounded overflow-auto text-[#2E2E2E]">
          {error instanceof Error ? error.message : "Unknown error"}
        </pre>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 bg-[#5C4033] hover:bg-[#5C4033]/80 text-[#FAF3E0] px-4 py-2 rounded"
        >
          Try Again
        </button>
      </div>
    );
  }
}