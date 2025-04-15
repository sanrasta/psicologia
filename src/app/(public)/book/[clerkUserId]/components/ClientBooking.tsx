"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ClientBookingProps {
  children: React.ReactNode;
  event: {
    name: string;
    description: string | null;
  };
  userName: string | null;
}

export default function ClientBooking({ children, event, userName }: ClientBookingProps) {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>
              Book {event.name} with {userName}
            </CardTitle>
            {event.description && (
              <CardDescription>{event.description}</CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {children}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 