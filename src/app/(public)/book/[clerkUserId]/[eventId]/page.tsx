"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface BookEventParams {
  clerkUserId: string;
  eventId: string;
}

interface BookEventPageProps {
  params: Promise<BookEventParams>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default function BookEventPage({ params }: BookEventPageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [event, setEvent] = useState<{
    name: string;
    description: string | null;
    durationInMinutes: number;
    calendlyUrl: string;
  } | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const resolvedParams = await params;
        const response = await fetch(`/api/events/${resolvedParams.clerkUserId}/${resolvedParams.eventId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch event");
        }
        const data = await response.json();
        setEvent(data);
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [params]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5C4033]"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">
              Event not found or no longer available.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>{event.name}</CardTitle>
            {event.description && (
              <CardDescription>{event.description}</CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                {event.durationInMinutes} minutes
              </span>
              <a
                href={event.calendlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md bg-[#5C4033] px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-[#5C4033]/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#5C4033] disabled:pointer-events-none disabled:opacity-50"
              >
                Book Now
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}