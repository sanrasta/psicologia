"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Our Training Courses</h1>
          <p className="text-lg text-gray-600 mb-8">
            Our expert trainers use positive reinforcement techniques to ensure your dog learns in a safe and enjoyable environment. Book a session today and start your journey to a well-behaved companion.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Basic Obedience</CardTitle>
              <CardDescription>
                Perfect for puppies and dogs new to training
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Learn essential commands like sit, stay, and come. Build a strong foundation for your dog&apos;s training journey.
                </p>
                <div className="flex justify-end">
                  <Button>Learn More</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Advanced Training</CardTitle>
              <CardDescription>
                For dogs ready to take their skills to the next level
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-lg text-gray-600 mb-8">
                  Take your dog&apos;s training to the next level with our advanced courses. Perfect for dogs who have mastered basic obedience and are ready for more challenging exercises.
                </p>
                <div className="flex justify-end">
                  <Button>Learn More</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 