"use client";

import { useState, useEffect, useRef, ReactNode, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { motion, AnimatePresence, useAnimation, useInView } from "framer-motion";
import Loading from "@/components/Loading";
import { submitContactForm } from "@/server/actions/contact";

// Updated Logo component with purple colors
function Logo() {
  return (
    <div className="flex flex-col items-center space-y-3">
      <div className="flex items-center space-x-1">
        <div className="w-5 h-5 bg-[#9B5DE5] rounded-sm"></div> {/* Purple */}
        <div className="w-5 h-5 bg-[#F15BB5] rounded-sm"></div> {/* Pink */}
        <div className="w-5 h-5 bg-[#00BBF9] rounded-sm"></div> {/* Light Blue */}
        <div className="w-5 h-5 bg-[#00F5D4] rounded-sm"></div> {/* Teal */}
      </div>
    </div>
  );
}

// Updated AnimatedText component with purple gradient
function AnimatedText() {
  return (
    <div className="relative h-20 overflow-hidden">
      <h1 className="text-center text-4xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#9B5DE5] via-[#F15BB5] to-[#00BBF9] tracking-tight">
        TRANSFORM YOUR DOG
      </h1>
    </div>
  );
}

// Scroll-triggered animation section - optimized for performance with reduced scroll impact
function AnimatedSection({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once: true, 
    amount: 0.1 // Reduce the visible amount needed to trigger
  });
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
      className={className}
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 15 }, // Reduced distance to improve performance
        visible: { opacity: 1, y: 0 }
      }}
      transition={{ 
        duration: 0.4, // Faster animations
        delay, 
        ease: "easeOut" 
      }}
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
  const [isLoading, setIsLoading] = useState(false);
  const [formStatus, setFormStatus] = useState<{
    success?: boolean;
    message?: string;
    errors?: Record<string, string[]>;
  } | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Only redirect on initial sign in
  useEffect(() => {
    if (isLoaded && isSignedIn && window.location.pathname === '/') {
      const hasVisitedHome = sessionStorage.getItem('hasVisitedHome');
      if (!hasVisitedHome) {
        sessionStorage.setItem('hasVisitedHome', 'true');
        setIsLoading(true);
        router.push("/events");
      }
    }
  }, [isSignedIn, isLoaded, router]);

  // For navigation to events page
  const navigateToEvents = useCallback(() => {
    setIsLoading(true);
    router.push("/events");
  }, [router]);

  // Use useCallback for the scroll handler with debounce technique
  const handleScroll = useCallback(() => {
    // Use requestAnimationFrame to optimize scroll performance
    window.requestAnimationFrame(() => {
      setScrolled(window.scrollY > 100);
    });
  }, []);

  // Update scroll effect with useCallback, passive event listener and throttling
  useEffect(() => {
    let isScrolling = false;
    
    const throttledScrollHandler = () => {
      if (!isScrolling) {
        isScrolling = true;
        
        // Use requestAnimationFrame to align with browser refresh cycle
        window.requestAnimationFrame(() => {
          handleScroll();
          isScrolling = false;
        });
      }
    };
    
    window.addEventListener("scroll", throttledScrollHandler, { passive: true });
    return () => window.removeEventListener("scroll", throttledScrollHandler);
  }, [handleScroll]);

  // Use useCallback for toggle function
  const toggleMobileMenu = useCallback(() => 
    setMobileMenuOpen(prev => !prev), []);
    
  // Use useCallback for scroll function
  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    if (window.location.hash) {
      history.pushState('', document.title, window.location.pathname + window.location.search);
    }
  }, []);

  return (
    <>
      {isLoading && <Loading />}
      <div className="bg-gradient-to-b from-[#F8F0FF] to-white overflow-auto">
        {/* Navbar */}
        <motion.header
          className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
            scrolled ? "bg-white/90 backdrop-blur-sm shadow-lg" : "bg-transparent"
          }`}
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            {/* Left Side: Show UserButton if signed in, otherwise show Logo */}
            <motion.div 
              className="flex items-center space-x-2 cursor-pointer"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              onClick={scrollToTop}
            >
              {isSignedIn ? <UserButton /> : <Image src="/doggy.png" alt="Logo" width={50} height={50} className="rounded-full" />}
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
              {["Training", "Programs", "Testimonials", "Contact"].map((item, index) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="hover:text-[#9B5DE5] relative group font-medium"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                >
                  {item}
                  <motion.span 
                    className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#9B5DE5] group-hover:w-full transition-all duration-300"
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
                  <button 
                    onClick={navigateToEvents}
                    className="bg-gradient-to-r from-[#9B5DE5] to-[#F15BB5] hover:from-[#F15BB5] hover:to-[#9B5DE5] text-white px-6 py-2 rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Classes
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                >
                  <SignInButton>
                    <button className="bg-gradient-to-r from-[#9B5DE5] to-[#F15BB5] hover:from-[#F15BB5] hover:to-[#9B5DE5] text-white px-6 py-2 rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-xl">
                      Book Training
                    </button>
                  </SignInButton>
                </motion.div>
              )}
            </motion.nav>

            {/* Mobile Hamburger */}
            <motion.div 
              className="md:hidden"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <button onClick={toggleMobileMenu} className="focus:outline-none text-[#FAF3E0]">
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
              className="fixed inset-0 bg-[#2E2E2E] text-[#FAF3E0] flex flex-col items-center justify-center z-50"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              {/* Close Button */}
              <motion.button 
                onClick={toggleMobileMenu} 
                className="absolute top-5 right-5 text-3xl text-[#FAF3E0]"
                whileHover={{ rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                ✕
              </motion.button>

              {/* Navigation Links */}
              <nav className="flex flex-col space-y-6 text-3xl">
                <motion.button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    scrollToTop();
                  }}
                  className="hover:text-[#9B5DE5] transition-all duration-300 text-3xl font-medium"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0, duration: 0.4 }}
                  whileHover={{ scale: 1.1, x: 10 }}
                >
                  Home
                </motion.button>
                
                {["Training", "Programs", "Testimonials", "Contact"].map((item, index) => (
                  <motion.a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="hover:text-[#9B5DE5] transition-all duration-300"
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
                    <button 
                      onClick={() => {
                        setMobileMenuOpen(false);
                        navigateToEvents();
                      }}
                      className="hover:text-[#9B5DE5] transition-all duration-300"
                    >
                      Classes
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                  >
                    <SignInButton>
                      <button 
                        className="hover:text-[#9B5DE5] transition-all duration-300" 
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Book Training
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
          {/* Background elements */}
          <div className="absolute inset-0 bg-gradient-radial from-[#9B5DE5]/20 to-transparent z-0"></div>
          
          <Image
            src="/doggy.png"
            alt="Hero Background"
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
            quality={75}
            style={{ objectFit: "cover" }}
            className="opacity-20"
            loading="eager"
            fetchPriority="high"
          />
          
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-[#F8F0FF]"></div>

          {/* Content restructured for better positioning */}
          <div className="relative z-10 flex flex-col items-center justify-between h-full w-full px-4 max-w-5xl mx-auto">
            {/* Empty space at top to push logo to center */}
            <div className="flex-grow"></div>
            
            {/* Logo in center of screen */}
            <div className="mb-12">
              <Logo />
            </div>
            
            {/* Lower text section */}
            <div className="flex flex-col items-center mb-16">
              <div className="mb-8">
                <AnimatedText />
              </div>
              
              <p className="text-xl md:text-2xl text-[#2E2E2E] mb-12 max-w-3xl text-center">
                Exceptional dog training that transforms challenging behaviors into confident companionship through proven methods and personalized approaches.
              </p>
              
              <div className="flex flex-col md:flex-row gap-4 items-center">
          
                <div className="hover:scale-105 transition-transform duration-300">
                  <SignInButton>
                    <Button className="bg-gradient-to-r from-[#9B5DE5] to-[#F15BB5] hover:from-[#F15BB5] hover:to-[#9B5DE5] text-white text-lg md:text-2xl px-8 md:px-10 py-6 md:py-7 rounded-xl shadow-lg hover:shadow-xl font-bold transition-all duration-300">
                      Start Dog Training Today!
                    </Button>
                  </SignInButton>
                </div>

                <Link href="/courses">
                  <Button className="bg-gradient-to-r from-[#00BBF9] to-[#00F5D4] hover:from-[#00F5D4] hover:to-[#00BBF9] text-white text-lg md:text-2xl px-8 md:px-10 py-6 md:py-7 rounded-xl shadow-lg hover:shadow-xl font-bold transition-all duration-300">
                    View Courses
                  </Button>
                </Link>

                <Link href="/games-club">
                  <Button className="bg-gradient-to-r from-[#F15BB5] to-[#9B5DE5] hover:from-[#9B5DE5] hover:to-[#F15BB5] text-white text-lg md:text-2xl px-8 md:px-10 py-6 md:py-7 rounded-xl shadow-lg hover:shadow-xl font-bold transition-all duration-300">
                    Join Games Club
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Conversion Section with animations - optimized for performance */}
        <section id="conversion" className="py-28 relative overflow-hidden">
          <div 
            className="absolute -top-20 -left-20 w-80 h-80 bg-[#00BBF9]/30 rounded-full blur-3xl"
          />
          <div
            className="absolute -bottom-40 -right-20 w-96 h-96 bg-[#F15BB5]/30 rounded-full blur-3xl"
          />
          
          <div className="container mx-auto px-4 text-center relative z-10">
            <AnimatedSection>
              <h2 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight text-[#2E2E2E]">
                Transform Your <span className="text-[#9B5DE5] relative">Dog&apos;s Behavior
                  <span 
                    className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-[#9B5DE5] to-[#F15BB5]"
                  />
                </span>
              </h2>
            </AnimatedSection>
            
            <AnimatedSection delay={0.2}>
              <p className="max-w-2xl mx-auto text-[#2E2E2E] text-xl mb-12 leading-relaxed">
                Discover proven dog training strategies that turn challenging behaviors into 
                obedient responses. Our personalized training system is designed to help your 
                canine companion achieve their full potential and strengthen your bond.
              </p>
            </AnimatedSection>
            
            <AnimatedSection delay={0.4}>
              <div className="hover:scale-105 hover:-translate-y-1 transition-all duration-200">
                <Link href="#contact">
                  <Button className="bg-gradient-to-br from-[#9B5DE5] to-[#F15BB5] hover:from-[#F15BB5] hover:to-[#9B5DE5] text-[#FAF3E0] py-6 px-4 md:px-10 rounded-full text-base md:text-xl font-semibold shadow-lg transition-all duration-300 w-full md:w-auto">
                    <span className="block px-2 md:px-0">
                      <span className="hidden md:inline">Schedule Your Free Evaluation Session</span>
                      <span className="md:hidden">Free Evaluation Session</span>
                    </span>
                  </Button>
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Training Programs Section with animations */}
        <section id="training" className="py-28 bg-gradient-to-b from-white to-[#F8F0FF] relative overflow-hidden">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="text-center mb-16">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8 }}
                >
                  <h2 className="text-4xl md:text-6xl font-bold relative inline-block text-[#2E2E2E]">
                    Our <span className="text-[#9B5DE5]">Training Programs</span>
                    <motion.div 
                      className="absolute -bottom-3 left-0 h-1 bg-gradient-to-r from-[#9B5DE5] to-[#F15BB5]"
                      initial={{ width: 0 }}
                      whileInView={{ width: "100%" }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </h2>
                </motion.div>
                <p className="text-[#2E2E2E] text-xl mt-6">
                  Elevate your dog&apos;s behavior with personalized training designed for{" "}
                  <span className="font-semibold text-[#9B5DE5]">lasting results</span>.
                </p>
              </div>
            </AnimatedSection>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Basic Obedience",
                  description: "Foundation training for puppies and adult dogs focusing on essential commands and good manners.",
                  color: "#9B5DE5",
                  rgbColor: "155, 93, 229"
                },
                {
                  title: "Behavior Modification",
                  description: "Specialized training to address anxiety, aggression, fear, and other challenging behaviors.",
                  color: "#F15BB5",
                  rgbColor: "241, 91, 181"
                },
                {
                  title: "Advanced Training",
                  description: "Take your dog&apos;s skills to the next level with complex commands, off-leash reliability, and tricks.",
                  color: "#00BBF9",
                  rgbColor: "0, 187, 249"
                }
              ].map((service, index) => (
                <AnimatedSection key={service.title} delay={0.2 * index}>
                  <motion.div 
                    className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl h-full group cursor-pointer shadow-lg hover:shadow-xl"
                    whileHover={{ 
                      y: -10,
                      boxShadow: `0 10px 30px -5px rgba(${service.rgbColor},0.3)`
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div 
                      className="w-16 h-16 rounded-xl mb-6 flex items-center justify-center"
                      style={{ backgroundColor: `${service.color}20` }}
                      animate={{ rotate: [0, 10, 0, -10, 0] }}
                      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: service.color }}></div>
                    </motion.div>
                    
                    <h3 className="text-2xl font-bold mb-4 text-[#2E2E2E]">
                      <span className="inline-block transition-all duration-300 first-word" style={{ color: service.color }}>
                        {service.title.split(" ")[0]}
                      </span>{" "}
                      <span>
                        {service.title.split(" ").slice(1).join(" ")}
                      </span>
                    </h3>
                    <p className="text-[#2E2E2E]/70 text-lg">
                      {service.description}
                    </p>
                  </motion.div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section - Professional Design */}
        <section id="testimonials" className="py-28 relative overflow-hidden">
          {/* Subtle background element */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#9B5DE5]/10 to-[#F8F0FF] z-0"></div>
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#9B5DE5]/20 to-transparent"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <AnimatedSection>
              <div className="flex flex-col items-center mb-16">
                <div className="inline-block mb-3">
                  <div className="w-10 h-1 bg-[#9B5DE5] mx-auto"></div>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-[#2E2E2E]">
                  Client <span className="text-[#9B5DE5]">Testimonials</span>
                </h2>
                <p className="text-[#2E2E2E]/80 text-lg mt-4 max-w-2xl text-center">
                  Discover what dog owners have to say about their transformative experiences with our professional training services.
                </p>
              </div>
            </AnimatedSection>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <AnimatedSection delay={0.1}>
                <motion.div 
                  className="bg-gradient-to-br from-white to-[#F8F0FF] rounded-xl p-8 relative overflow-hidden border border-[#9B5DE5]/10 shadow-xl"
                  whileHover={{ y: -5, boxShadow: "0 20px 40px -15px rgba(155, 93, 229, 0.15)" }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="absolute top-0 right-0 w-40 h-40 -m-16 opacity-10">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-[#9B5DE5]">
                      <path d="M9 7.5l-4.5 4.5h3l-6 9h7.5l6-9h-3l4.5-4.5h-7.5z" fill="currentColor"/>
                    </svg>
                  </div>
                  
                  <div className="text-xl text-[#2E2E2E]/80 font-light italic leading-relaxed mb-8">
                    "<span className="text-[#2E2E2E] font-medium">The personalized approach</span> at <span className="text-[#9B5DE5]">Elite Dog Training</span> helped transform my anxious rescue into a confident, obedient companion. The trainers&apos; patience and expertise made all the difference in our lives."
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#9B5DE5]/20 flex-shrink-0">
                      <Image
                        src="/doggy.png"
                        alt="Client 1"
                        width={56}
                        height={56}
                        className="object-cover"
                      />
                    </div>
                    <div className="ml-4">
                      <p className="font-semibold text-[#2E2E2E] text-lg">Sarah Johnson</p>
                      <div className="flex items-center">
                        <p className="text-[#2E2E2E]/60 text-sm">Dog Owner • German Shepherd</p>
                        <div className="flex ml-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg key={star} className="w-3 h-3 text-[#F15BB5]" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                            </svg>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatedSection>
              
              <AnimatedSection delay={0.3}>
                <motion.div 
                  className="bg-gradient-to-br from-white to-[#F8F0FF] rounded-xl p-8 relative overflow-hidden border border-[#9B5DE5]/10 shadow-xl"
                  whileHover={{ y: -5, boxShadow: "0 20px 40px -15px rgba(155, 93, 229, 0.15)" }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="absolute top-0 right-0 w-40 h-40 -m-16 opacity-10">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-[#9B5DE5]">
                      <path d="M9 7.5l-4.5 4.5h3l-6 9h7.5l6-9h-3l4.5-4.5h-7.5z" fill="currentColor"/>
                    </svg>
                  </div>
                  
                  <div className="text-xl text-[#2E2E2E]/80 font-light italic leading-relaxed mb-8">
                    "Their <span className="text-[#2E2E2E] font-medium">advanced training techniques</span> completely transformed my stubborn Golden Retriever. <span className="text-[#9B5DE5]">Elite Dog Training</span> gave us the tools to communicate effectively and establish clear boundaries. Now our walks are enjoyable for both of us!"
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#9B5DE5]/20 flex-shrink-0">
                      <Image
                        src="/doggy.png"
                        alt="Client 2"
                        width={56}
                        height={56}
                        className="object-cover"
                      />
                    </div>
                    <div className="ml-4">
                      <p className="font-semibold text-[#2E2E2E] text-lg">Michael Thompson</p>
                      <div className="flex items-center">
                        <p className="text-[#2E2E2E]/60 text-sm">Dog Owner • Golden Retriever</p>
                        <div className="flex ml-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg key={star} className="w-3 h-3 text-[#F15BB5]" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                            </svg>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Contact Section - Premium Design */}
        <section id="contact" className="py-32 relative overflow-hidden">
          {/* Premium background elements */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#00BBF9]/20 to-[#F8F0FF] z-0"></div>
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#9B5DE5]/20 to-transparent"></div>
          
          {/* Animated accent elements - optimized for scroll performance */}
          <motion.div 
            className="absolute -top-40 right-0 w-96 h-96 rounded-full bg-[#9B5DE5]/5 blur-3xl"
            initial={{ opacity: 0.3 }}
            animate={{ opacity: 0.5 }}
            transition={{ duration: 5, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
          />
          <motion.div 
            className="absolute bottom-0 -left-40 w-96 h-96 rounded-full bg-[#F15BB5]/10 blur-3xl"
            initial={{ opacity: 0.2 }}
            animate={{ opacity: 0.4 }}
            transition={{ duration: 6, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
          />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-[#2E2E2E]">
                Get <span className="text-[#9B5DE5]">Started</span>
              </h2>
              <p className="mt-4 text-[#2E2E2E]/70 max-w-xl mx-auto">
                Ready to transform your dog&apos;s behavior? Reach out to us today to discuss your training goals and schedule your free evaluation session.
              </p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-8 items-start">
              {/* Left side info cards */}
              <AnimatedSection delay={0.1} className="md:col-span-2">
                <motion.div 
                  className="bg-gradient-to-br from-white to-[#F8F0FF] backdrop-blur-sm p-8 rounded-xl border border-[#9B5DE5]/10 h-full shadow-xl"
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-xl font-semibold text-[#2E2E2E] mb-2 flex items-center">
                        <motion.div 
                          initial={{ rotateY: 0 }}
                          animate={{ rotateY: 360 }}
                          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                          className="mr-3 text-[#9B5DE5]"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </motion.div>
                        Why Choose Us
                      </h3>
                      <p className="text-[#2E2E2E]/80 leading-relaxed">
                        Our elite dog training team brings over 20 years of canine behavior experience with a personalized approach that guarantees lasting results for dogs of all ages and breeds.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold text-[#2E2E2E] mb-2 flex items-center">
                        <motion.div 
                          animate={{ rotate: [0, 5, -5, 5, 0] }}
                          transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
                          className="mr-3 text-[#9B5DE5]"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </motion.div>
                        Get in Touch
                      </h3>
                      <div className="space-y-3 pl-9">
                        <p className="text-[#2E2E2E]">contact@elitedogtraining.com</p>
                        <p className="text-[#2E2E2E]">+1 (555) 123-4567</p>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <h3 className="text-xl font-semibold text-[#2E2E2E] mb-3 flex items-center">
                        <motion.div 
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="mr-3 text-[#9B5DE5]"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </motion.div>
                        Response Time
                      </h3>
                      <div className="flex items-center gap-2 pl-9">
                        <div className="w-full bg-[#00BBF9]/50 rounded-full h-2">
                          <motion.div 
                            className="bg-gradient-to-r from-[#9B5DE5] to-[#F15BB5] h-2 rounded-full"
                            initial={{ width: "0%" }}
                            whileInView={{ width: "90%" }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                          />
                        </div>
                        <span className="text-[#2E2E2E] font-medium">24h</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatedSection>
              
              {/* Right side form */}
              <AnimatedSection delay={0.3} className="md:col-span-3">
                <motion.form 
                  ref={formRef}
                  action={async (formData) => {
                    const result = await submitContactForm(formData);
                    setFormStatus(result);
                    if (result.success) {
                      formRef.current?.reset();
                    }
                  }}
                  className="bg-gradient-to-br from-white to-[#F8F0FF] backdrop-blur-sm p-8 rounded-xl border border-[#9B5DE5]/10 shadow-xl"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  {formStatus && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 mb-6 rounded-lg ${
                        formStatus.success 
                          ? "bg-green-50 text-green-700 border border-green-200" 
                          : "bg-red-50 text-red-700 border border-red-200"
                      }`}
                    >
                      <p className="font-medium text-sm">{formStatus.message}</p>
                    </motion.div>
                  )}
                  
                  <div className="space-y-6">
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <label htmlFor="name" className="block text-sm font-medium text-[#2E2E2E] mb-1">
                        Full Name
                      </label>
                      <motion.div 
                        whileHover={{ scale: 1.01 }} 
                        whileTap={{ scale: 0.99 }}
                        className="relative"
                      >
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#2E2E2E]/60">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                        </span>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          placeholder="Your Name"
                          className="pl-10 block w-full rounded-md border-[#9B5DE5]/20 bg-white px-4 py-3 text-[#2E2E2E] placeholder-[#2E2E2E]/40 focus:border-[#9B5DE5] focus:ring-1 focus:ring-[#9B5DE5] transition-all duration-200"
                          required
                        />
                        {formStatus?.errors?.name && (
                          <p className="text-red-600 text-xs mt-1">{formStatus.errors.name[0]}</p>
                        )}
                      </motion.div>
                    </motion.div>
                    
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                    >
                      <label htmlFor="email" className="block text-sm font-medium text-[#2E2E2E] mb-1">
                        Email Address
                      </label>
                      <motion.div 
                        whileHover={{ scale: 1.01 }} 
                        whileTap={{ scale: 0.99 }}
                        className="relative"
                      >
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#2E2E2E]/60">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                          </svg>
                        </span>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          placeholder="you@example.com"
                          className="pl-10 block w-full rounded-md border-[#9B5DE5]/20 bg-white px-4 py-3 text-[#2E2E2E] placeholder-[#2E2E2E]/40 focus:border-[#9B5DE5] focus:ring-1 focus:ring-[#9B5DE5] transition-all duration-200"
                          required
                        />
                        {formStatus?.errors?.email && (
                          <p className="text-red-600 text-xs mt-1">{formStatus.errors.email[0]}</p>
                        )}
                      </motion.div>
                    </motion.div>
                    
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <label htmlFor="phone" className="block text-sm font-medium text-[#2E2E2E] mb-1">
                        Phone (Optional)
                      </label>
                      <motion.div 
                        whileHover={{ scale: 1.01 }} 
                        whileTap={{ scale: 0.99 }}
                        className="relative"
                      >
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#2E2E2E]/60">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.948.684l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                          </svg>
                        </span>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          placeholder="(555) 123-4567"
                          className="pl-10 block w-full rounded-md border-[#9B5DE5]/20 bg-white px-4 py-3 text-[#2E2E2E] placeholder-[#2E2E2E]/40 focus:border-[#9B5DE5] focus:ring-1 focus:ring-[#9B5DE5] transition-all duration-200"
                        />
                      </motion.div>
                    </motion.div>
                    
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      <label htmlFor="message" className="block text-sm font-medium text-[#2E2E2E] mb-1">
                        Message
                      </label>
                      <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                        <textarea
                          id="message"
                          name="message"
                          rows={4}
                          placeholder="Tell us about your dog and your training goals"
                          className="block w-full rounded-md border-[#9B5DE5]/20 bg-white px-4 py-3 text-[#2E2E2E] placeholder-[#2E2E2E]/40 focus:border-[#9B5DE5] focus:ring-1 focus:ring-[#9B5DE5] transition-all duration-200"
                          required
                        ></textarea>
                        {formStatus?.errors?.message && (
                          <p className="text-red-600 text-xs mt-1">{formStatus.errors.message[0]}</p>
                        )}
                      </motion.div>
                    </motion.div>
                    
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      className="pt-4"
                    >
                      <motion.button
                        type="submit"
                        whileHover={{ 
                          scale: 1.03, 
                          boxShadow: "0 10px 25px -5px rgba(155, 93, 229, 0.4)" 
                        }}
                        whileTap={{ scale: 0.97 }}
                        className="w-full bg-gradient-to-r from-[#9B5DE5] to-[#F15BB5] hover:from-[#F15BB5] hover:to-[#9B5DE5] py-4 rounded-xl font-semibold text-lg shadow-lg transition-all duration-300 relative overflow-hidden group text-[#FAF3E0]"
                      >
                        <motion.span
                          className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#9B5DE5]/90 to-[#F15BB5]/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        />
                        <motion.span 
                          className="relative flex items-center justify-center"
                        >
                          Send Message
                          <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </motion.span>
                      </motion.button>
                      
                      <p className="text-center text-sm text-[#2E2E2E]/60 mt-4">
                        We&apos;ll respond to your inquiry within 24 hours
                      </p>
                    </motion.div>
                  </div>
                </motion.form>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#2E2E2E]">
              About <span className="text-[#9B5DE5]">Us</span>
            </h2>
            <p className="max-w-2xl mx-auto text-[#2E2E2E]/80 text-lg">
              At <span className="font-semibold text-[#9B5DE5]">Elite Dog Training</span>, we blend expert canine behavior knowledge with a passion for strengthening the human-dog bond.
              Our mission is to empower both dogs and their owners to achieve harmonious relationships through proven training techniques.
              Experience a transformative approach to dog training that delivers real, lasting results.
            </p>
          </div>
        </section>

         {/* Footer */}
         <footer className="py-8 bg-[#2E2E2E]">
          <div className="container mx-auto px-4 text-center text-[#FAF3E0]/70">
            &copy; {new Date().getFullYear()} Elite Dog Training. All rights reserved.
          </div>
        </footer>
              
      </div>
    </>
  );
}