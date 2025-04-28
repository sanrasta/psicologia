"use client";

import { useState, useEffect, useRef, ReactNode, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { motion, AnimatePresence, useAnimation, useInView, useScroll, useTransform } from "framer-motion";
import Loading from "@/components/Loading";
import { submitContactForm } from "@/server/actions/contact";

// Color scheme definition
const colors = {
  primary: '#4A6FA5',    // Professional Blue
  secondary: '#6B8C6E',  // Calming Green
  accent: '#E8D5B5',     // Warm Beige
  dark: '#8B5E3C',       // Earth Brown
  text: '#2E2E2E',       // Dark Text
  background: {
    start: '#F8F9FA',    // Light Background Start
    end: '#FFFFFF'       // White Background End
  }
} as const;

// Updated Logo component with professional colors
function Logo() {
  return (
    <div className="flex flex-col items-center space-y-3">
      <div className="flex items-center space-x-1">
        <div className="w-5 h-5 bg-[#4A6FA5] rounded-sm"></div> {/* Professional Blue */}
        <div className="w-5 h-5 bg-[#6B8C6E] rounded-sm"></div> {/* Calming Green */}
        <div className="w-5 h-5 bg-[#E8D5B5] rounded-sm"></div> {/* Warm Beige */}
        <div className="w-5 h-5 bg-[#8B5E3C] rounded-sm"></div> {/* Earth Brown */}
      </div>
      <div className="flex flex-col items-center">
        <span className="text-2xl font-bold text-[#4A6FA5]">
          Blanca <span className="text-[#6B8C6E]">Stella</span>
        </span>
        <span className="text-sm text-[#2E2E2E]/70">Psicóloga Clínica</span>
      </div>
    </div>
  );
}

// Updated AnimatedText component with professional colors
function AnimatedText() {
  return (
    <div className="relative h-20 overflow-hidden">
      <h1 className="text-center text-4xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-br from-[#4A6FA5] via-[#6B8C6E] to-[#4A6FA5] tracking-tight">
        BLANCA STELLA
      </h1>
      <h2 className="text-center text-2xl md:text-3xl font-medium text-[#4A6FA5] mt-4">
        Psicóloga Clínica
      </h2>
    </div>
  );
}

// Scroll-triggered animation section - optimized for performance with reduced scroll impact
function AnimatedSection({ children, delay = 0, className = "", id = "" }: { children: ReactNode; delay?: number; className?: string; id?: string }) {
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
      id={id}
    >
      {children}
    </motion.div>
  );
}

export default function HomePage() {
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false);
  const router = useRouter();
  const [desplazado, setDesplazado] = useState(false);
  const { isSignedIn, isLoaded } = useUser();
  const heroRef = useRef(null);
  const [cargando, setCargando] = useState(false);
  const [estadoFormulario, setEstadoFormulario] = useState<{
    success?: boolean;
    message?: string;
    errors?: Record<string, string[]>;
  } | null>(null);
  const referenciaFormulario = useRef<HTMLFormElement>(null);
  const { scrollY } = useScroll();
  const scale = useTransform(scrollY, [0, 500], [1, 1.2]);
  const y = useTransform(scrollY, [0, 500], [-48, 52]);
  const opacity = useTransform(scrollY, [0, 300], [0.15, 0.05]);

  // Only redirect on initial sign in
  useEffect(() => {
    if (isLoaded && isSignedIn && window.location.pathname === '/') {
      const hasVisitedHome = sessionStorage.getItem('hasVisitedHome');
      if (!hasVisitedHome) {
        sessionStorage.setItem('hasVisitedHome', 'true');
        setCargando(true);
        router.push("/events");
      }
    }
  }, [isSignedIn, isLoaded, router]);

  // For navigation to events page
  const navigateToEvents = useCallback(() => {
    setCargando(true);
    router.push("/events");
  }, [router]);

  // Use useCallback for the scroll handler with debounce technique
  const handleScroll = useCallback(() => {
    // Use requestAnimationFrame to optimize scroll performance
    window.requestAnimationFrame(() => {
      setDesplazado(window.scrollY > 100);
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
    setMenuMovilAbierto(prev => !prev), []);
    
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

  // Update scroll functions for all sections
  const scrollToSection = useCallback((sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      const headerHeight = 80; // Height of the fixed header
      const sectionPosition = section.offsetTop - headerHeight;
      window.scrollTo({
        top: sectionPosition,
        behavior: 'smooth'
      });
    }
  }, []);

  // Update the scrollToContact function to match
  const scrollToContact = useCallback(() => {
    const contactSection = document.getElementById('contacto');
    if (contactSection) {
      const headerHeight = 80; // Height of the fixed header
      const sectionPosition = contactSection.offsetTop - headerHeight;
      window.scrollTo({
        top: sectionPosition,
        behavior: 'smooth'
      });
    }
  }, []);

  // Add this effect to handle scroll after sign-in
  useEffect(() => {
    if (isSignedIn && sessionStorage.getItem('scrollToContact') === 'true') {
      scrollToContact();
      sessionStorage.removeItem('scrollToContact');
    }
  }, [isSignedIn, scrollToContact]);

  return (
    <>
      {cargando && <Loading />}
      <div className="bg-gradient-to-b from-[#F8F9FA] to-[#FFFFFF] overflow-auto">
        {/* Navbar */}
        <motion.header
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            desplazado ? "bg-white/95 backdrop-blur-sm shadow-lg" : "bg-transparent"
          }`}
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <motion.div 
              className="flex items-center space-x-2 cursor-pointer"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              onClick={scrollToTop}
            >
              {isSignedIn ? (
                <div className="flex items-center space-x-3">
                  <UserButton />
                  <span className="text-xl font-bold text-[#4A6FA5]">
                    Blanca <span className="text-[#6B8C6E]">Stella</span>
                  </span>
                </div>
              ) : (
                <Logo />
              )}
            </motion.div>

            {/* Desktop Navigation */}
            <motion.nav 
              className="hidden md:flex space-x-6 text-lg items-center text-[#4A6FA5]"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {["Sobre Mí", "Servicios", "Especialidades", "Recursos", "Contacto"].map((item, index) => {
                const sectionId = item.toLowerCase().replace(/\s+/g, '-');
                return (
                  <motion.a
                    key={item}
                    href={`#${sectionId}`}
                    className="hover:text-[#6B8C6E] relative group font-medium"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(sectionId);
                    }}
                  >
                    {item}
                    <motion.span 
                      className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#6B8C6E] group-hover:w-full transition-all duration-300"
                      initial={{ width: "0%" }}
                      whileHover={{ width: "100%" }}
                    />
                  </motion.a>
                );
              })}
              
              {isSignedIn ? (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                >
                  <button 
                    onClick={navigateToEvents}
                    className="bg-gradient-to-r from-[#4A6FA5] to-[#6B8C6E] hover:from-[#6B8C6E] hover:to-[#4A6FA5] text-white px-6 py-2 rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Mis Citas
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                >
                  <SignInButton>
                    <button 
                      onClick={() => {
                        // Store the contact section in session storage
                        sessionStorage.setItem('scrollToContact', 'true');
                      }}
                      className="bg-gradient-to-r from-[#4A6FA5] to-[#6B8C6E] hover:from-[#6B8C6E] hover:to-[#4A6FA5] text-white px-6 py-2 rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      Agendar Cita
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
              <button onClick={toggleMobileMenu} className="focus:outline-none text-[#4A6FA5]">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {menuMovilAbierto ? (
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
          {menuMovilAbierto && (
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
                    setMenuMovilAbierto(false);
                    scrollToTop();
                  }}
                  className="hover:text-[#9B5DE5] transition-all duration-300 text-3xl font-medium"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0, duration: 0.4 }}
                  whileHover={{ scale: 1.1, x: 10 }}
                >
                  Inicio
                </motion.button>
                
                {["Sobre Mí", "Servicios", "Especialidades", "Recursos", "Contacto"].map((item, index) => {
                  const sectionId = item.toLowerCase().replace(/\s+/g, '-');
                  return (
                    <motion.button
                      key={item}
                      onClick={() => {
                        setMenuMovilAbierto(false);
                        scrollToSection(sectionId);
                      }}
                      className="hover:text-[#9B5DE5] transition-all duration-300 text-3xl font-medium"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.4 }}
                      whileHover={{ scale: 1.1, x: 10 }}
                    >
                      {item}
                    </motion.button>
                  );
                })}
                
                {isSignedIn ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                  >
                    <button 
                      onClick={() => {
                        setMenuMovilAbierto(false);
                        navigateToEvents();
                      }}
                      className="hover:text-[#9B5DE5] transition-all duration-300"
                    >
                      Mis Citas
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
                        onClick={() => {
                          setMenuMovilAbierto(false);
                          sessionStorage.setItem('scrollToContact', 'true');
                        }}
                      >
                        Agendar Cita
                      </button>
                    </SignInButton>
                  </motion.div>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero Section */}
        <section ref={heroRef} className="min-h-screen flex flex-col justify-center items-center px-4 pt-32 pb-20 relative overflow-hidden">
          <motion.div 
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 0.5 }}
            style={{ scale, y }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-[#F8F9FA] to-[#FFFFFF]" />
            <motion.div 
              className="relative w-[400px] h-[400px]"
              style={{ opacity }}
            >
              <Image 
                src="/logo_nkd.png" 
                alt="Blanca Stella" 
                fill
                className="object-contain"
                style={{ 
                  mixBlendMode: 'multiply',
                  backgroundColor: 'transparent'
                }}
              />
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="relative z-10 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <AnimatedText />
            <motion.p 
              className="text-center text-lg md:text-xl text-[#4A6FA5] max-w-2xl mx-auto mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Ofreciendo servicios psicológicos compasivos y profesionales para ayudarte a navegar los desafíos de la vida y lograr crecimiento personal.
            </motion.p>
            <motion.div 
              className="mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <SignInButton>
                <button className="bg-gradient-to-r from-[#4A6FA5] to-[#6B8C6E] hover:from-[#6B8C6E] hover:to-[#4A6FA5] text-white px-8 py-3 rounded-full text-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl">
                  Agenda Tu Primera Sesión
                </button>
              </SignInButton>
            </motion.div>
          </motion.div>
        </section>

       

        {/* Services Section */}
        <AnimatedSection id="servicios" className="py-20 bg-[#F8F9FA]">
          <div className="container mx-auto px-4 max-w-6xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-[#4A6FA5] mb-12">Servicios</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                {
                  title: "Terapia Individual",
                  description: "Sesiones individuales enfocadas en el crecimiento personal, salud mental y bienestar emocional.",
                  color: "#4A6FA5" // Professional Blue
                },
                {
                  title: "Terapia de Pareja",
                  description: "Apoyo para parejas que buscan mejorar la comunicación, resolver conflictos y fortalecer su relación.",
                  color: "#6B8C6E" // Calming Green
                },
                {
                  title: "Terapia Familiar",
                  description: "Ayudando a las familias a navegar desafíos y mejorar sus relaciones y dinámicas.",
                  color: "#E8D5B5" // Warm Beige
                },
                {
                  title: "Terapia Grupal",
                  description: "Sesiones grupales que fomentan el apoyo mutuo y el crecimiento colectivo en un ambiente seguro.",
                  color: "#8B5E3C" // Earth Brown
                }
              ].map((service, index) => (
                <motion.div
                  key={service.title}
                  className="bg-white p-6 rounded-xl shadow-lg group hover:shadow-2xl transition-all duration-300 flex flex-col items-center text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="relative mb-4">
                    <motion.div 
                      className="w-12 h-12 rounded-lg"
                      style={{ backgroundColor: service.color }}
                      whileHover={{ 
                        scale: 1.05,
                        transition: { 
                          duration: 0.2,
                          ease: "easeOut"
                        }
                      }}
                    />
                    <motion.div 
                      className="absolute top-0 left-0 w-12 h-12 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      style={{ 
                        backgroundColor: service.color,
                        filter: 'blur(8px)',
                        transform: 'translate(4px, 4px)'
                      }}
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-[#4A6FA5] mb-2 group-hover:text-[#6B8C6E] transition-colors duration-200">{service.title}</h3>
                  <p className="text-sm text-[#2E2E2E]">{service.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Specializations Section */}
        <AnimatedSection id="especialidades" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-[#4A6FA5] mb-12">Especialidades</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                "Ansiedad y Depresión",
                "Problemas de Relación",
                "Trauma y TEPT",
                "Transiciones de Vida",
                "Manejo del Estrés",
                "Autoestima y Crecimiento Personal"
              ].map((specialization, index) => (
                <motion.div
                  key={specialization}
                  className="bg-[#F8F9FA] p-6 rounded-lg"
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-lg font-medium text-[#6B8C6E]">{specialization}</h3>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Resources Section */}
        <AnimatedSection id="recursos" className="py-20 bg-[#F8F9FA]">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-[#4A6FA5] mb-12">Recursos</h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-center text-lg text-[#2E2E2E]">
                Próximamente: Artículos, recursos y herramientas para apoyar tu bienestar mental.
              </p>
            </div>
          </div>
        </AnimatedSection>

        {/* Contact Section */}
        <AnimatedSection id="contacto" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-[#4A6FA5] mb-12">Contáctame</h2>
            <div className="max-w-2xl mx-auto">
              {isSignedIn ? (
                <form ref={referenciaFormulario} onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const result = await submitContactForm(formData);
                  setEstadoFormulario(result);
                  if (result.success) {
                    referenciaFormulario.current?.reset();
                  }
                }} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-[#4A6FA5] mb-2">Nombre</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className="w-full px-4 py-2 rounded-lg border border-[#4A6FA5]/20 focus:border-[#4A6FA5] focus:ring-1 focus:ring-[#4A6FA5] outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-[#4A6FA5] mb-2">Correo Electrónico</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full px-4 py-2 rounded-lg border border-[#4A6FA5]/20 focus:border-[#4A6FA5] focus:ring-1 focus:ring-[#4A6FA5] outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-[#4A6FA5] mb-2">Mensaje</label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={4}
                      className="w-full px-4 py-2 rounded-lg border border-[#4A6FA5]/20 focus:border-[#4A6FA5] focus:ring-1 focus:ring-[#4A6FA5] outline-none transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#4A6FA5] to-[#6B8C6E] hover:from-[#6B8C6E] hover:to-[#4A6FA5] text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Enviar Mensaje
                  </button>
                </form>
              ) : (
                <div className="text-center space-y-4">
                  <p className="text-lg text-[#4A6FA5]">Por favor, inicia sesión para enviar un mensaje.</p>
                  <SignInButton>
                    <button 
                      onClick={() => {
                        // Store the contact section in session storage
                        sessionStorage.setItem('scrollToContact', 'true');
                      }}
                      className="bg-gradient-to-r from-[#4A6FA5] to-[#6B8C6E] hover:from-[#6B8C6E] hover:to-[#4A6FA5] text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      Iniciar Sesión
                    </button>
                  </SignInButton>
                </div>
              )}
              {estadoFormulario && (
                <div className={`mt-4 p-4 rounded-lg ${estadoFormulario.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {estadoFormulario.message}
                </div>
              )}
            </div>
          </div>
        </AnimatedSection>


         {/* About Section */}
        <AnimatedSection id="sobre-mí" className="py-20 bg-[#F8F9FA]">
          <div className="container mx-auto px-4">
            <h2 className={`text-3xl md:text-4xl font-bold text-center text-[${colors.primary}] mb-12`}>Sobre Mí</h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <p className={`text-lg text-[${colors.text}]`}>
                  Soy Blanca Stella, psicóloga licenciada con más de 15 años de experiencia ayudando a individuos y parejas a navegar los desafíos de la vida. Mi enfoque combina terapias basadas en evidencia con un estilo cálido y empático que crea un espacio seguro para la sanación y el crecimiento.
                </p>
                <p className={`text-lg text-[${colors.text}]`}>
                  Creo en el poder de la relación terapéutica y trabajo colaborativamente con mis clientes para desarrollar planes de tratamiento personalizados que aborden sus necesidades y objetivos únicos.
                </p>
              </div>
              <motion.div 
                className="relative h-96"
                whileHover={{ scale: 1.02 }}
              >
                <div className={`absolute inset-0 bg-gradient-to-b from-[${colors.background.start}] to-[${colors.background.end}]`} />
                <Image
                  src="/logo_nkd.png"
                  alt="Blanca Stella"
                  fill
                  className="object-contain transition-transform duration-300 hover:scale-105 relative z-10"
                  style={{ mixBlendMode: 'multiply' }}
                />
              </motion.div>
            </div>
          </div>
        </AnimatedSection>

        {/* Footer */}
        <footer className="bg-[#4A6FA5] text-white py-12">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div 
                    className="w-[65px] h-[65px] rounded-full bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: 'url("/logo_round.png")' }}
                  />
                  <h3 className="text-xl font-semibold">Blanca Stella</h3>
                </div>
                <p className="text-white/80">Psicóloga Clínica</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Contacto</h3>
                <p className="text-white/80">Correo: contacto@blancastella.com</p>
                <p className="text-white/80">Teléfono: (555) 123-4567</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Ubicación</h3>
                <p className="text-white/80">Calle Terapia 123</p>
                <p className="text-white/80">Ciudad, Estado 12345</p>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-white/20 text-center text-white/60">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div 
                  className="w-[45px] h-[45px] rounded-full bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: 'url("/logo_round.png")' }}
                />
                <p>&copy; {new Date().getFullYear()} Blanca Stella. Todos los derechos reservados.</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}