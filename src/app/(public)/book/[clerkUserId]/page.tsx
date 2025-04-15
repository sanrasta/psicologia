"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface BookPageParams {
  clerkUserId: string;
}

interface BookPageProps {
  params: Promise<BookPageParams>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default function BookPage({ params }: BookPageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState<Array<{
    id: string;
    name: string;
    description: string | null;
    durationInMinutes: number;
    calendlyUrl: string;
  }>>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const resolvedParams = await params;
        const response = await fetch(`/api/events/${resolvedParams.clerkUserId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [params]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5C4033]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Available Training Sessions</CardTitle>
            <CardDescription>
              Choose a session that works best for you
            </CardDescription>
          </CardHeader>
          <CardContent>
            {events.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No training sessions available at the moment.
              </p>
            ) : (
              <div className="grid gap-6">
                {events.map((event) => (
                  <Card key={event.id} className="overflow-hidden">
                    <CardHeader>
                      <CardTitle className="text-xl">{event.name}</CardTitle>
                      {event.description && (
                        <CardDescription>{event.description}</CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          {event.durationInMinutes} minutes
                        </span>
                        <Button asChild>
                          <Link href={event.calendlyUrl} target="_blank" rel="noopener noreferrer">
                            Book Now
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}