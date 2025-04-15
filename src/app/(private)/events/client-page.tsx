"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { InlineWidget } from "react-calendly";
import { Home } from "lucide-react";

interface Event {
  id: number;
  name: string;
  description: string | null;
  duration: string;
  calendlyUrl?: string;
  isActive: boolean;
  clerkUserId: string;
  locationType: string;
}

interface EventsPageClientProps {
  events: Event[];
}

export function EventsPageClient({ events }: EventsPageClientProps) {
  const [localEvents, setLocalEvents] = useState<Event[]>(events);
  const [isLoading] = useState(false);

  useEffect(() => {
    console.log("Client events:", JSON.stringify(events, null, 2));
    setLocalEvents(events);
  }, [events]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Events</h1>
        <Link href="/">
          <Button 
            variant="default" 
            className="flex items-center gap-2 bg-[#5C4033] hover:bg-[#5C4033]/90 text-white"
          >
            <Home className="h-4 w-4" />
            Home
          </Button>
        </Link>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {localEvents.map((event) => {
          console.log("Rendering event:", event);
          return (
            <Card key={event.id} className="w-full">
              <CardHeader>
                <CardTitle>{event.name}</CardTitle>
                <CardDescription>{event.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Duration: {event.duration}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Location: {event.locationType}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Status: {event.isActive ? "Active" : "Inactive"}
                  </p>
                </div>
                <div className="mt-4">
                  {event.calendlyUrl && (
                    <div className="w-full h-[630px] overflow-hidden rounded-lg">
                      <InlineWidget
                        url={event.calendlyUrl}
                        styles={{
                          height: '100%',
                          width: '100%',
                          minHeight: '630px'
                        }}
                        prefill={{
                          name: '',
                          email: '',
                          customAnswers: {
                            a1: event.name,
                            a2: event.description || '',
                            a3: event.duration,
                            a4: event.locationType
                          }
                        }}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
} 