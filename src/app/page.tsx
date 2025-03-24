"use client";

import { useState, useEffect, useRef, ReactNode, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { motion, AnimatePresence, useAnimation, useInView } from "framer-motion";

// Custom Logo: Four irregular boxes (each a different color) with animation
function Logo() {
  return (
    <div className="flex flex-col items-center space-y-3 mt-24 sm:mt-0">
      <motion.div 
        className="flex items-center space-x-1"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div 
          className="w-5 h-5 bg-red-500 transform rotate-[-5deg] skew-x-3 rounded-sm"
          whileHover={{ scale: 1.2, rotate: 0 }}
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          whileInView={{ 
            scale: [1, 1.1, 1],
            rotate: ["-5deg", "-3deg", "-5deg"]
          }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity, 
            repeatType: "mirror",
            ease: "easeInOut",
            times: [0, 0.5, 1] 
          }}
        ></motion.div>
        <motion.div 
          className="w-5 h-5 bg-blue-500 transform rotate-3 skew-y-2 rounded-sm"
          whileHover={{ scale: 1.2, rotate: 0 }}
          initial={{ y: -10 }}
          animate={{ y: 0 }}
          whileInView={{ 
            scale: [1, 1.1, 1],
            rotate: ["3deg", "5deg", "3deg"]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            repeatType: "mirror",
            ease: "easeInOut",
            delay: 0.2,
            times: [0, 0.5, 1] 
          }}
        ></motion.div>
        <motion.div 
          className="w-5 h-5 bg-green-500 transform rotate-[-3deg] skew-x-2 rounded-sm"
          whileHover={{ scale: 1.2, rotate: 0 }}
          initial={{ y: -15 }}
          animate={{ y: 0 }}
          whileInView={{ 
            scale: [1, 1.1, 1],
            rotate: ["-3deg", "-1deg", "-3deg"]
          }}
          transition={{ 
            duration: 1.8, 
            repeat: Infinity, 
            repeatType: "mirror",
            ease: "easeInOut",
            delay: 0.4,
            times: [0, 0.5, 1] 
          }}
        ></motion.div>
        <motion.div 
          className="w-5 h-5 bg-yellow-500 transform rotate-2 skew-y-3 rounded-sm"
          whileHover={{ scale: 1.2, rotate: 0 }}
          initial={{ y: -5 }}
          animate={{ y: 0 }}
          whileInView={{ 
            scale: [1, 1.1, 1],
            rotate: ["2deg", "4deg", "2deg"]
          }}
          transition={{ 
            duration: 2.2, 
            repeat: Infinity, 
            repeatType: "mirror",
            ease: "easeInOut",
            delay: 0.6,
            times: [0, 0.5, 1] 
          }}
        ></motion.div>
      </motion.div>
    </div>
  );
}

// Dynamic text that animates between different phrases |NOT USED
function AnimatedText() {
  const phrases = [
    "CHANGE YOUR LIFE NOW",
    "TRANSFORM YOUR FITNESS",
    "UNLEASH YOUR POTENTIAL",
    "ELEVATE YOUR GAME"
  ];
  const [currentPhrase, setCurrentPhrase] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhrase((prev) => (prev + 1) % phrases.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="relative h-20 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.h1 
          key={currentPhrase}
          className="absolute w-full text-center text-4xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-white to-red-500 tracking-tight"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {phrases[currentPhrase]}
        </motion.h1>
      </AnimatePresence>
    </div>
  );
}

// Scroll-triggered animation section
function AnimatedSection({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });
  const controls = useAnimation();
  
  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);
  
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 }
      }}
      transition={{ duration: 0.8, delay: delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const { isSignedIn, isLoaded } = useUser();
  const heroRef = useRef(null);

  // Only redirect on initial sign in
  useEffect(() => {
    if (isLoaded && isSignedIn && window.location.pathname === '/') {
      const hasVisitedHome = sessionStorage.getItem('hasVisitedHome');
      if (!hasVisitedHome) {
        sessionStorage.setItem('hasVisitedHome', 'true');
        router.push("/events");
      }
    }
  }, [isSignedIn, isLoaded, router]);

  // Update navbar background when scrolling past 100px.
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);

  // First, let's update the scrollToTop function to be more robust
  const scrollToTop = () => {
    // Scroll to the absolute top of the page
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    // Also update the URL to remove any hash fragments
    if (window.location.hash) {
      history.pushState('', document.title, window.location.pathname + window.location.search);
    }
  };

  return (
    <>
      <div className="bg-black overflow-auto">
        {/* Navbar */}
        <motion.header
          className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
            scrolled ? "bg-gray-800/90 backdrop-blur-sm" : "bg-black/50"
          }`}
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            {/* Left Side: Show UserButton if signed in, otherwise show Logo */}
            <motion.div 
              className="flex items-center space-x-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {isSignedIn ? <UserButton /> : <Image src="/rio.png" alt="Logo" width={50} height={50} className="rounded-full" />}
              <span className="text-2xl font-bold">
                Your <span className="text-red-500">Coaching</span>
              </span>
            </motion.div>

            {/* Desktop Navigation */}
            <motion.nav 
              className="hidden md:flex space-x-6 text-lg items-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {["Services", "Testimonials", "Contact"].map((item, index) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="hover:text-red-500 relative group"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                >
                  {item}
                  <motion.span 
                    className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-500 group-hover:w-full transition-all duration-300"
                    initial={{ width: "0%" }}
                    whileHover={{ width: "100%" }}
                  />
                </motion.a>
              ))}
              
              {isSignedIn ? (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                >
                  <Link href="/events" className="hover:text-red-500 relative group">
                    Events
                    <motion.span 
                      className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-500 group-hover:w-full transition-all duration-300"
                      initial={{ width: "0%" }}
                      whileHover={{ width: "100%" }}
                    />
                  </Link>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                >
                  <SignInButton>
                    <button className="hover:text-red-500 relative group">
                      Bookings
                      <motion.span 
                        className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-500 group-hover:w-full transition-all duration-300"
                        initial={{ width: "0%" }}
                        whileHover={{ width: "100%" }}
                      />
                    </button>
                  </SignInButton>
                </motion.div>
              )}
              <button 
                className="hover:text-red-500 relative group"
                onClick={scrollToTop}
              >
                Home
                <motion.span 
                  className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-500 group-hover:w-full transition-all duration-300"
                  initial={{ width: "0%" }}
                  whileHover={{ width: "100%" }}
                />
              </button>
            </motion.nav>

            {/* Mobile Hamburger */}
            <motion.div 
              className="md:hidden"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <button onClick={toggleMobileMenu} className="focus:outline-none text-white">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </motion.div>
          </div>
        </motion.header>

        {/* Fullscreen Mobile Menu with Smooth Transition */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className="fixed inset-0 bg-black text-white flex flex-col items-center justify-center z-50"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              {/* Close Button */}
              <motion.button 
                onClick={toggleMobileMenu} 
                className="absolute top-5 right-5 text-3xl text-white"
                whileHover={{ rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                ✕
              </motion.button>

              {/* Navigation Links */}
              <nav className="flex flex-col space-y-6 text-3xl">
                {["Services", "Testimonials", "Contact"].map((item, index) => (
                  <motion.a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="hover:text-red-500 transition-all duration-300"
                    onClick={() => setMobileMenuOpen(false)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    whileHover={{ scale: 1.1, x: 10 }}
                  >
                    {item}
                  </motion.a>
                ))}
                
                {isSignedIn ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                  >
                    <Link 
                      href="/events" 
                      className="hover:text-red-500 transition-all duration-300" 
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Events
                    </Link>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                  >
                    <SignInButton>
                      <button 
                        className="hover:text-red-500 transition-all duration-300" 
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Bookings
                      </button>
                    </SignInButton>
                  </motion.div>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero Section: Fullscreen background with animated text and particles */}
        <section id="hero" ref={heroRef} className="relative h-screen flex flex-col items-center justify-between py-24 overflow-hidden">
          {/* Background elements remain the same */}
          <div className="absolute inset-0 bg-gradient-radial from-gray-800/20 to-black/50 z-0"></div>
          
          <Image
            src="/rio.png"
            alt="Hero Background"
            fill
            style={{ objectFit: "cover" }}
            className="filter: grayscale opacity-100"
          />
          
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black"></div>

          {/* Content restructured for better positioning */}
          <div className="relative z-10 flex flex-col items-center justify-between h-full w-full px-4 max-w-5xl mx-auto">
            {/* Empty space at top to push logo to center */}
            <div className="flex-grow"></div>
            
            {/* Logo in center of screen */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="mb-12"
            >
              <Logo />
            </motion.div>
            
            {/* Lower text section */}
            <div className="flex flex-col items-center mb-16">
              <motion.div
                className="mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
              >
                <AnimatedText />
              </motion.div>
              
              <motion.p
                className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
              >
                Elite coaching that transforms your fitness journey through personalized training and proven results.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.6 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <SignInButton>
                  <Button className="bg-red-500 hover:bg-red-700 text-white text-lg md:text-2xl px-8 md:px-10 py-6 md:py-7 rounded-xl shadow-[0_0_15px_rgba(220,38,38,0.5)] font-bold transition-all duration-300 ease-in-out w-full md:w-auto">
                    <span className="relative">
                      Sign In & Book NOW!
                      <motion.span 
                        className="absolute -bottom-1 left-0 w-full h-0.5 bg-white"
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 1, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                      />
                    </span>
                  </Button>
                </SignInButton>
              </motion.div>
            </div>
          </div>
          
          {/* Scroll indicator at the very bottom */}
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
          >
            <motion.a
              href="#conversion"
              className="text-white flex flex-col items-center"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <span className="mb-2 text-sm uppercase tracking-widest">Discover More</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19M12 19L5 12M12 19L19 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.a>
          </motion.div>
        </section>

        {/* Conversion Section with animations */}
        <section id="conversion" className="py-28 relative overflow-hidden">
          <motion.div 
            className="absolute -top-20 -left-20 w-80 h-80 bg-red-500/10 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              x: [0, 20, 0],
              y: [0, 30, 0],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute -bottom-40 -right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.3, 1],
              x: [0, -30, 0],
              y: [0, -20, 0],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          
          <div className="container mx-auto px-4 text-center relative z-10">
            <AnimatedSection>
              <h2 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
                Transform Your <span className="text-red-500 relative">Body & Life
                  <motion.span 
                    className="absolute -bottom-2 left-0 w-full h-1 bg-red-500/50"
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </span>
              </h2>
            </AnimatedSection>
            
            <AnimatedSection delay={0.2}>
              <p className="max-w-2xl mx-auto text-gray-300 text-xl mb-12 leading-relaxed">
                Discover the proven fitness strategies that turn hard work into rapid results.
                Our personalized coaching system is designed to help you achieve peak performance
                and unlock your ultimate potential.
              </p>
            </AnimatedSection>
            
            <AnimatedSection delay={0.4}>
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <Link href="#contact">
                  <Button className="bg-gradient-to-br from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white py-6 px-4 md:px-10 rounded-full text-base md:text-xl font-semibold shadow-lg transition-all duration-300 w-full md:w-auto">
                    <motion.span
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="block px-2 md:px-0"
                    >
                      <span className="hidden md:inline">Book Your Free Consultation Now</span>
                      <span className="md:hidden">Book Free Consultation</span>
                    </motion.span>
                  </Button>
                </Link>
              </motion.div>
            </AnimatedSection>
          </div>
        </section>

        {/* Services Section with animations */}
        <section id="services" className="py-28 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="text-center mb-16">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8 }}
                >
                  <h2 className="text-4xl md:text-6xl font-bold relative inline-block">
                    Our <span className="text-red-500">Services</span>
                    <motion.div 
                      className="absolute -bottom-3 left-0 h-1 bg-red-500/30"
                      initial={{ width: 0 }}
                      whileInView={{ width: "100%" }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </h2>
                </motion.div>
                <p className="text-gray-300 text-xl mt-6">
                  Elevate your training with personalized programs designed for{" "}
                  <span className="font-semibold text-red-500">optimal results</span>.
                </p>
              </div>
            </AnimatedSection>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Personal Training",
                  description: "Customized one-on-one sessions focused on your unique fitness goals.",
                  color: "red"
                },
                {
                  title: "Group Classes",
                  description: "High-energy group workouts that keep you motivated and accountable.",
                  color: "blue"
                },
                {
                  title: "Nutrition Coaching",
                  description: "Expert nutritional advice tailored to fuel your workouts and accelerate recovery.",
                  color: "green"
                }
              ].map((service, index) => (
                <AnimatedSection key={service.title} delay={0.2 * index}>
                  <motion.div 
                    className="bg-gray-800/80 backdrop-blur-sm p-8 rounded-2xl h-full"
                    whileHover={{ 
                      y: -10,
                      boxShadow: `0 10px 30px -5px rgba(${service.color === "red" ? "239,68,68" : service.color === "blue" ? "59,130,246" : "34,197,94"},0.5)`
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div 
                      className={`w-16 h-16 rounded-xl mb-6 flex items-center justify-center bg-${service.color}-500/20`}
                      animate={{ rotate: [0, 10, 0, -10, 0] }}
                      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <div className={`w-8 h-8 bg-${service.color}-500 rounded-lg`}></div>
                    </motion.div>
                    
                    <h3 className="text-2xl font-bold mb-4">
                      {service.title.split(" ")[0]}{" "}
                      <span className={`text-${service.color}-500`}>
                        {service.title.split(" ")[1]}
                      </span>
                    </h3>
                    <p className="text-gray-400 text-lg">
                      {service.description}
                    </p>
                  </motion.div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold">
                What They <span className="text-red-500">Say</span>
              </h2>
              <p className="text-gray-300 text-lg">
                Hear from our clients who have transformed their lives.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-800 p-6 rounded-lg">
                <p className="text-gray-400 italic mb-4">
                  "The personalized approach at <span className="font-semibold text-red-500">Your Coaching</span> helped me break through my plateau and achieve the body I've always wanted."
                </p>
                <div className="flex items-center">
                  <Image
                    src="/rio.png"
                    alt="Client 1"
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                  <div className="ml-4">
                    <p className="font-bold">John Doe</p>
                    <p className="text-gray-500 text-sm">Fitness Enthusiast</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg">
                <p className="text-gray-400 italic mb-4">
                  "Their coaching transformed not just my physique, but my mindset. I now believe in achieving the impossible."
                </p>
                <div className="flex items-center">
                  <Image
                    src="/rio.png"
                    alt="Client 2"
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                  <div className="ml-4">
                    <p className="font-bold">Jane Smith</p>
                    <p className="text-gray-500 text-sm">Athlete</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold">
                Get in <span className="text-red-500">Touch</span>
              </h2>
              <p className="text-gray-300 text-lg">
                Ready to unlock your ultimate potential? Contact us now for a free consultation.
              </p>
            </div>
            <form className="max-w-xl mx-auto space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="Your Name"
                  className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 px-3 py-2 text-white"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="you@example.com"
                  className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 px-3 py-2 text-white"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  placeholder="Your message"
                  className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 px-3 py-2 text-white"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-red-500 hover:bg-red-600 py-3 rounded-full font-semibold"
              >
                Send Message
              </button>
            </form>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              About <span className="text-red-500">Us</span>
            </h2>
            <p className="max-w-2xl mx-auto text-gray-300 text-lg">
              At <span className="font-semibold text-red-500">Your Coaching</span>, we blend expert fitness training with a passion for health.
              Our mission is to empower you to reach new heights, both physically and mentally.
              Experience a revolutionary approach to fitness that drives real, measurable results.
            </p>
          </div>
        </section>

         {/* Footer */}
         <footer className="py-8 bg-black">
          <div className="container mx-auto px-4 text-center text-gray-500">
            &copy; {new Date().getFullYear()} Your Coaching. All rights reserved.
          </div>
        </footer>
              
      </div>
    </>
  );
}