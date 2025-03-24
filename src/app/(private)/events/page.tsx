import { Button } from "@/components/ui/button";
import Link from "next/link";
import { db } from "@/drizzle/db";
import { auth } from "@clerk/nextjs/server";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { formatEventDescription } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { createDefaultEvents } from "@/server/actions/defaultEvents";
import { Clock, ArrowRight } from "lucide-react";

export const revalidate = 0;

export default async function EventsPage() {
  const { userId } = await auth();
  
  if (!userId) {
    return null; // The middleware will handle redirection
  }

  // Ensure default events exist
  await createDefaultEvents();
  
  const events = await db.query.EventTable.findMany({
    where: ({ clerkUserId }, { eq }) => eq(clerkUserId, userId),
    orderBy: ({ createdAt }, { desc }) => [desc(createdAt)],
  });

  return (
    <>
      <div className="flex justify-center items-center mb-8">
        <h1 className="text-3xl lg:text-4xl xl:text-5xl font-semibold">
          <span className="text-red-400">Event Types</span>
        </h1>
      </div>
      
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
        {events.map((event, index) => (
          <EventCard 
            key={event.id} 
            {...event} 
          />
        ))}
      </div>
    </>
  );
}

// Add interface near the top of the file
interface EventCardProps {
  id: string;
  isActive: boolean;
  name: string;
  durationInMinutes: number;
  description: string | null;
  clerkUserId: string;
}

// Then update the function signature
function EventCard({
  id,
  isActive,
  name,
  durationInMinutes,
  description,
  clerkUserId,
}: EventCardProps) {
  return (
    <Card className={cn(
      "flex flex-col h-full transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-gray-700/90 border-red-500/30",
      !isActive && "opacity-70"
    )}>
      <CardHeader className={cn("bg-gradient-to-r from-gray-700 to-gray-600 rounded-t-lg", !isActive && "opacity-50")}>
        <CardTitle className="flex items-center text-xl text-white">
          <span className="text-red-400 mr-2">•</span> {name}
        </CardTitle>
        <CardDescription className="flex items-center mt-2 text-gray-200">
          <Clock className="mr-2 h-4 w-4 text-red-300" />
          {formatEventDescription(durationInMinutes)}
        </CardDescription>
      </CardHeader>
      
      {description != null && (
        <CardContent className={cn("py-4 flex-grow", !isActive && "opacity-50")}>
          <p className="text-white">{description}</p>
        </CardContent>
      )}
      
      <CardFooter className="flex justify-end gap-2 mt-auto p-4">
        <Button 
          asChild
          size="lg"
          className="bg-red-500 hover:bg-red-600 text-white font-medium px-6 py-2 rounded-full flex items-center gap-2 transition-all duration-300 group shadow-md"
        >
          <Link href={`/book/${clerkUserId}/${id}`}>
            Book Now!
            <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}