"use client";

import { useState, useEffect, useCallback } from "react";
import { UserButton } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import { Home, Calendar } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  
  const isEventsPage = pathname === "/events";

  // Optimize scroll event with useCallback and passive listener
  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 100);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Optimize mobile menu toggle with useCallback
  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);

  // Handle navigation with proper link
  const handleNavClick = useCallback((path: string) => {
    router.push(path);
    setMobileMenuOpen(false);
  }, [router]);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/80 backdrop-blur-md shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-[#5C4033]">Elite Dog Training</span>
            </Link>

            {/* Desktop Navigation */}
            <motion.nav
              className="hidden md:flex space-x-6 text-lg items-center text-[#2E2E2E]"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {!isEventsPage && (
                <Link href="/events" className="hover:text-[#9B5DE5] relative group font-medium">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <span className="text-[#2E2E2E] group-hover:text-[#9B5DE5]">Training Sessions</span>
                  </div>
                  <motion.span 
                    className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#9B5DE5] to-[#F15BB5] group-hover:w-full transition-all duration-300"
                    initial={{ width: "0%" }}
                    whileHover={{ width: "100%" }}
                  />
                </Link>
              )}
              <div className="flex items-center">
                <UserButton afterSignOutUrl="/" />
              </div>
            </motion.nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-[#2E2E2E]"
              onClick={toggleMobileMenu}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <motion.div
        className={`fixed inset-0 z-40 bg-[#F5F5F5] md:hidden ${
          mobileMenuOpen ? "block" : "hidden"
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: mobileMenuOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-8">
          {!isEventsPage && (
            <motion.button
              onClick={() => handleNavClick('/events')}
              className="hover:text-white transition-all duration-300 flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <Calendar className="w-7 h-7" />
              <span>Training Sessions</span>
            </motion.button>
          )}
          <motion.button 
            onClick={() => handleNavClick('/')}
            className="hover:text-white transition-all duration-300 flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <Home className="w-7 h-7" />
            <span>Home</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Main Content */}
      <main className="container mx-auto pt-28 px-4 pb-12">{children}</main>
    </div>
  );
}
