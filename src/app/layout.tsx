// src/app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'CoachingAI.com | Get full body transformation guaranteed',
  description: 'Dark themed personal coaching website guaranteed to show significant results or we give your money back',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body>{children}</body>
    </html>
    </ClerkProvider>
  );
}