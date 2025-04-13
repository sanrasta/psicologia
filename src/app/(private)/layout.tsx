"use client";

import { useState, useEffect, useCallback } from "react";
import { UserButton } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import { Home, MessageSquare, Calendar } from "lucide-react";
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
  const isContactsPage = pathname === "/contacts";

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
    <div className="bg-gradient-to-b from-[#F8F0FF] to-white overflow-auto min-h-screen">
      <motion.header
        className={`fixed top-0 left-0 right-0 z-[100] transition-colors duration-300 ${
          scrolled ? "bg-white/90 backdrop-blur-sm shadow-lg" : "bg-transparent"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          {/* Left Side: Logo and UserButton */}
          <motion.div 
            className="flex items-center space-x-2 cursor-pointer"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <UserButton />
            <span className="text-2xl font-bold text-[#2E2E2E]">
              Elite <span className="text-[#9B5DE5]">Dog Training</span>
            </span>
          </motion.div>

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
            {!isContactsPage && (
              <Link href="/contacts" className="hover:text-[#9B5DE5] relative group font-medium">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  <span className="text-[#2E2E2E] group-hover:text-[#9B5DE5]">Contact Requests</span>
                </div>
                <motion.span 
                  className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#9B5DE5] to-[#F15BB5] group-hover:w-full transition-all duration-300"
                  initial={{ width: "0%" }}
                  whileHover={{ width: "100%" }}
                />
              </Link>
            )}
            <Link href="/" className="hover:text-[#9B5DE5] relative group font-medium">
              <div className="flex items-center gap-2">
                <Home className="w-5 h-5" />
                <span className="text-[#2E2E2E] group-hover:text-[#9B5DE5]">Home</span>
              </div>
              <motion.span 
                className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#9B5DE5] to-[#F15BB5] group-hover:w-full transition-all duration-300"
                initial={{ width: "0%" }}
                whileHover={{ width: "100%" }}
              />
            </Link>
          </motion.nav>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button 
              onClick={toggleMobileMenu} 
              className="focus:outline-none text-[#2E2E2E]"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Fullscreen Mobile Menu */}
      <motion.div
        className={`fixed inset-0 bg-gradient-to-b from-[#9B5DE5] to-[#F15BB5] text-white flex flex-col items-center justify-center z-[200] transform transition-all duration-500 ${
          mobileMenuOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
        }`}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: mobileMenuOpen ? 1 : 0, scale: mobileMenuOpen ? 1 : 0.95 }}
        transition={{ duration: 0.5 }}
      >
        <button 
          onClick={toggleMobileMenu} 
          className="absolute top-5 right-5 text-3xl text-white"
        >
          ✕
        </button>
        <nav className="flex flex-col space-y-6 text-3xl">
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
          {!isContactsPage && (
            <motion.button 
              onClick={() => handleNavClick('/contacts')} 
              className="hover:text-white transition-all duration-300 flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <MessageSquare className="w-7 h-7" />
              <span>Contact Requests</span>
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
        </nav>
      </motion.div>

      {/* Main Content */}
      <main className="container mx-auto pt-28 px-4 pb-12">{children}</main>
    </div>
  );
}
