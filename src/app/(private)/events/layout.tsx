"use client";

import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import Script from "next/script";

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const { userId } = useAuth();

  useEffect(() => {
    if (!userId) {
      redirect("/sign-in");
    }
    setIsLoading(false);
  }, [userId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5C4033]"></div>
      </div>
    );
  }

  return (
    <>
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="beforeInteractive"
      />
      {children}
    </>
  );
} 