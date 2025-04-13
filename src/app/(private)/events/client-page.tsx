'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import EventCard from "@/components/EventCard";
import Loading from "@/components/Loading";
import { Home } from "lucide-react";

interface EventsPageClientProps {
  events: Array<{
    id: string;
    isActive: boolean;
    name: string;
    durationInMinutes: number;
    description: string | null;
    clerkUserId: string;
    locationType?: string;
  }>;
}

export function EventsPageClient({ events }: EventsPageClientProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  const navigateToHome = () => {
    setIsLoading(true);
    router.push("/");
  };

  // Add a fallback if events is undefined
  if (!events) {
    console.error("Events array is undefined");
    return (
      <div className="bg-[#F8F0FF] min-h-screen -mt-28 pt-28 pb-12">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-[#9B5DE5] mb-4">No Training Sessions Found</h2>
            <p className="text-[#2E2E2E] mb-6">We couldn't find any training sessions. Please try again later.</p>
            <Button
              onClick={navigateToHome}
              className="bg-gradient-to-r from-[#9B5DE5] to-[#F15BB5] hover:from-[#F15BB5] hover:to-[#9B5DE5] text-white"
            >
              <Home className="mr-2 h-4 w-4" />
              Return Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {isLoading && <Loading />}
      <div className="bg-[#F8F0FF] min-h-screen -mt-28 pt-28 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center mb-12">
            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold text-center mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#9B5DE5] via-[#F15BB5] to-[#9B5DE5] animate-gradient">
                Training Sessions
              </span>
            </h1>
            <div className="flex items-center justify-center w-full max-w-xl">
              <div className="h-1 bg-gradient-to-r from-transparent via-[#9B5DE5] to-transparent w-full opacity-30 rounded-full"></div>
            </div>
            
            <div className="mt-6 flex justify-end w-full">
              <Button
                onClick={navigateToHome}
                variant="outline"
                className="border-[#9B5DE5]/30 text-[#2E2E2E] hover:bg-[#9B5DE5]/20"
              >
                <Home className="mr-2 h-4 w-4" />
                Home
              </Button>
            </div>
          </div>
          
          {error ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-[#9B5DE5] mb-4">Error Loading Sessions</h2>
              <p className="text-[#2E2E2E] mb-6">{error}</p>
              <Button
                onClick={() => window.location.reload()}
                className="bg-gradient-to-r from-[#9B5DE5] to-[#F15BB5] hover:from-[#F15BB5] hover:to-[#9B5DE5] text-white"
              >
                Try Again
              </Button>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-[#9B5DE5] mb-4">No Training Sessions Found</h2>
              <p className="text-[#2E2E2E]">You don't have any training sessions yet.</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
              {events.map((event) => (
                <EventCard 
                  key={event.id} 
                  {...event} 
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
} 