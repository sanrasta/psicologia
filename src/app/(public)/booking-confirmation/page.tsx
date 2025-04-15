"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function BookingConfirmationPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Booking Confirmed!</CardTitle>
            <CardDescription>
              Your training session has been successfully scheduled.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                You&apos;ll receive a confirmation email with all the details of your session.
              </p>
              <p className="text-muted-foreground">
                If you need to make any changes to your booking, please contact us directly.
              </p>
              <div className="flex justify-end">
                <Button asChild>
                  <Link href="/">Return to Home</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 