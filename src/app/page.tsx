"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs"; // Import Clerk components

// Custom Logo: Four irregular boxes (each a different color)
function Logo() {
  return (
    <div className="flex flex-col items-center space-y-3 py-10">
      <div className="flex items-center space-x-1">
        <div className="w-5 h-5 bg-red-500 transform rotate-[-5deg] skew-x-3 rounded-sm"></div>
        <div className="w-5 h-5 bg-blue-500 transform rotate-3 skew-y-2 rounded-sm"></div>
        <div className="w-5 h-5 bg-green-500 transform rotate-[-3deg] skew-x-2 rounded-sm"></div>
        <div className="w-5 h-5 bg-yellow-500 transform rotate-2 skew-y-3 rounded-sm"></div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isSignedIn } = useUser(); // Get sign-in status

  // Update navbar background when scrolling past 100px.
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);

  return (
    <div className="bg-black overflow-auto"> {/* Ensures scrolling works */}
      {/* Navbar */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
          scrolled ? "bg-gray-800" : "bg-black"
        }`}
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          {/* Left Side: Show UserButton if signed in, otherwise show Logo */}
          <div className="flex items-center space-x-2">
            {isSignedIn ? <UserButton /> : <Image src="/rio.png" alt="Logo" width={50} height={50} />}
            <span className="text-2xl font-bold">
              Your <span className="text-red-500">Coaching</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6 text-lg">
            <a href="#hero" className="hover:text-red-500">Home</a>
            <a href="#services" className="hover:text-red-500">Services</a>
            <a href="#testimonials" className="hover:text-red-500">Testimonials</a>
            <a href="#contact" className="hover:text-red-500">Contact</a>
          </nav>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button onClick={toggleMobileMenu} className="focus:outline-none text-white">
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
      </header>

      {/* Fullscreen Mobile Menu with Smooth Transition */}
      <div
        className={`fixed inset-0 bg-black text-white flex flex-col items-center justify-center z-50 transform transition-all duration-500 ${
          mobileMenuOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        {/* Close Button */}
        <button onClick={toggleMobileMenu} className="absolute top-5 right-5 text-3xl text-white">
          ✕
        </button>

        {/* Navigation Links */}
        <nav className="flex flex-col space-y-6 text-3xl">
          <a href="#hero" className="hover:text-red-500 transition-all duration-300" onClick={() => setMobileMenuOpen(false)}>Home</a>
          <a href="#services" className="hover:text-red-500 transition-all duration-300" onClick={() => setMobileMenuOpen(false)}>Services</a>
          <a href="#testimonials" className="hover:text-red-500 transition-all duration-300" onClick={() => setMobileMenuOpen(false)}>Testimonials</a>
          <a href="#contact" className="hover:text-red-500 transition-all duration-300" onClick={() => setMobileMenuOpen(false)}>Contact</a>
        </nav>
      </div>

      {/* Hero Section: Fullscreen background image with only the logo */}
      <section id="hero" className="relative h-screen">
        <Image
          src="/rio.png"
          alt="Hero Background"
          fill
          style={{ objectFit: "cover" }}
          className="filter grayscale"
        />

        {/* Centered Logo */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Logo />
        </div>

        {/* Sign In & Book Button Moved to Bottom Center */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
          <SignInButton>
            <Button className="bg-red-500 hover:bg-red-900 text-white text-2xl px-10 py-5 rounded-xl shadow-2xl font-bold">
              Sign In & Book NOW!
            </Button>
          </SignInButton>
        </div>
      </section>

      

{/* Conversion Section: Persuasive copy to convert cold visitors */}
<section id="conversion" className="py-20">
  <div className="container mx-auto px-4 text-center">
    <h2 className="text-4xl md:text-5xl font-bold mb-4">
      Transform Your <span className="text-red-500">Body & Life</span>
    </h2>
    <p className="max-w-2xl mx-auto text-gray-300 text-lg mb-8">
      Discover the proven fitness strategies that turn hard work into rapid results.
      Our personalized coaching system is designed to help you achieve peak performance
      and unlock your ultimate potential. With our expert guidance, every workout propels you closer to your dream physique.
    </p>
    <Link
      href="#contact"
      className="inline-block bg-red-500 hover:bg-red-600 text-white py-3 px-8 rounded-full text-xl font-semibold"
    >
      Book Your Free Consultation Now
    </Link>
  </div>
</section>



{/* Services Section */}
<section id="services" className="py-20 bg-gray-900">
  <div className="container mx-auto px-4">
    <div className="text-center mb-12">
      <h2 className="text-4xl md:text-5xl font-bold">
        Our <span className="text-red-500">Services</span>
      </h2>
      <p className="text-gray-300 text-lg">
        Elevate your training with personalized programs designed for{" "}
        <span className="font-semibold text-red-500">optimal results</span>.
      </p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="bg-gray-800 p-6 rounded-lg">
        <h3 className="text-2xl font-bold mb-2">
          Personal <span className="text-red-500">Training</span>
        </h3>
        <p className="text-gray-400">
          Customized one-on-one sessions focused on your unique fitness goals.
        </p>
      </div>
      <div className="bg-gray-800 p-6 rounded-lg">
        <h3 className="text-2xl font-bold mb-2">
          Group <span className="text-red-500">Classes</span>
        </h3>
        <p className="text-gray-400">
          High-energy group workouts that keep you motivated and accountable.
        </p>
      </div>
      <div className="bg-gray-800 p-6 rounded-lg">
        <h3 className="text-2xl font-bold mb-2">
          Nutrition <span className="text-red-500">Coaching</span>
        </h3>
        <p className="text-gray-400">
          Expert nutritional advice tailored to fuel your workouts and accelerate recovery.
        </p>
      </div>
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

{/* Footer */}
<footer className="py-8 bg-black">
  <div className="container mx-auto px-4 text-center text-gray-500">
    &copy; {new Date().getFullYear()} Your Coaching. All rights reserved.
  </div>
</footer>

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

    </div>
  );
}