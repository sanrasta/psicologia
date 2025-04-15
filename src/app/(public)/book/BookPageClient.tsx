"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface BookPageClientProps {
  userId: string;
}

export default function BookPageClient({ userId }: BookPageClientProps) {
  const [bookingUrl, setBookingUrl] = useState("");

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBookingUrl(`${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/book/${userId}`);
    }
  }, [userId]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Booking Links</h1>
      
      <div className="flex flex-col gap-4">
        <Button asChild className="w-fit">
          <Link href="/events">Manage My Events</Link>
        </Button>
        
        <p className="text-muted-foreground">
          Share your booking link with others to let them schedule meetings with you.
        </p>
        
        <div className="text-sm mt-4">
          <p className="font-medium">Your booking link:</p>
          <p className="text-muted-foreground mt-1">
            {bookingUrl}
          </p>
        </div>
      </div>
    </div>
  );
} 