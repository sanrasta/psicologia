"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function GamesClubPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Dog Games Club</h1>
          <p className="text-muted-foreground">
            Join our fun and interactive dog games sessions
          </p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Agility Training</CardTitle>
              <CardDescription>
                Fun obstacle courses for dogs of all sizes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative h-48 w-full">
                  <Image
                    src="/doggy.png"
                    alt="Agility Training"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <p className="text-muted-foreground">
                  Our agility training sessions are perfect for dogs who love to run, jump, and play. 
                  It&apos;s a great way to build confidence and strengthen the bond between you and your dog.
                </p>
                <div className="flex justify-end">
                  <Button>Join Session</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Social Playtime</CardTitle>
              <CardDescription>
                Group play sessions for socialization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative h-48 w-full">
                  <Image
                    src="/doggy.png"
                    alt="Social Playtime"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <p className="text-muted-foreground">
                  Let your dog make new friends in our supervised play sessions. 
                  Perfect for dogs who need to work on their social skills or just want to have fun.
                </p>
                <div className="flex justify-end">
                  <Button>Join Session</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 