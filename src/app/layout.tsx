// src/app/layout.tsx
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";

// Optimize font loading
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Elite Dog Training",
  description: "Professional dog training services to transform your canine companion",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${inter.variable} bg-[#F8F0FF]`} suppressHydrationWarning>
        <head>
          {/* Add preload for critical resources */}
          <link
            rel="preload"
            href="/doggy.png"
            as="image"
            type="image/png"
          />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </head>
        <body className="min-h-screen bg-[#F8F0FF] text-[#2E2E2E]">
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}