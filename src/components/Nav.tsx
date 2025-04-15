"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Nav() {
  const pathname = usePathname();
  
  return (
    <nav className="flex items-center space-x-4">
      <Link 
        href="/" 
        className={`text-sm font-medium transition-colors hover:text-primary ${
          pathname === "/" ? "text-primary" : "text-muted-foreground"
        }`}
      >
        Home
      </Link>
      <Link 
        href="/courses" 
        className={`text-sm font-medium transition-colors hover:text-primary ${
          pathname === "/courses" ? "text-primary" : "text-muted-foreground"
        }`}
      >
        Courses
      </Link>
      <Link 
        href="/games-club" 
        className={`text-sm font-medium transition-colors hover:text-primary ${
          pathname === "/games-club" ? "text-primary" : "text-muted-foreground"
        }`}
      >
        Games Club
      </Link>
    </nav>
  );
} 