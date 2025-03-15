import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Slide {
  imageSrc: string;
  heading: string;
  subheading: string;
  actionLink?: string;
  actionText?: string;
}

interface HeroCarouselProps {
  slides: Slide[];
  autoplaySpeed?: number;
}

export default function HeroCarousel({
  slides,
  autoplaySpeed = 6000,
}: HeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);

  // Handle autoplay
  useEffect(() => {
    if (!isAutoplay) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, autoplaySpeed);
    
    return () => clearInterval(interval);
  }, [isAutoplay, autoplaySpeed, slides.length]);

  // Pause autoplay on hover
  const pauseAutoplay = () => setIsAutoplay(false);
  const resumeAutoplay = () => setIsAutoplay(true);

  // Navigate to next/previous slide
  const nextSlide = useCallback(() => {
    setIsAutoplay(false);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setIsAutoplay(false);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide]);

  return (
    <section 
      className="relative w-full h-[80vh] overflow-hidden bg-richEbony"
      onMouseEnter={pauseAutoplay}
      onMouseLeave={resumeAutoplay}
    >
      {/* Main Content Area */}
      <div className="flex h-full">
        {/* Left: Text Content (40% width on desktop) */}
        <div className="hidden md:flex w-2/5 h-full relative bg-brandIvory">
          <div className="absolute inset-0 bg-[url('/images/subtle-pattern.png')] opacity-10" />
          
          <div className="relative w-full h-full flex flex-col justify-center pl-8 lg:pl-16 xl:pl-24 pr-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={`text-${currentSlide}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col items-start"
              >
                {/* Decorative gold line */}
                <div className="h-0.5 w-16 bg-brandGold mb-6" />
                
                <h1 className="text-3xl lg:text-4xl xl:text-5xl font-serif text-richEbony mb-4">
                  {slides[currentSlide].heading}
                </h1>
                
                <p className="text-lg text-platinumGray mb-8 max-w-md">
                  {slides[currentSlide].subheading}
                </p>
                
                {slides[currentSlide].actionLink && (
                  <Link href={slides[currentSlide].actionLink || "/collections"}>
                    <button className="px-8 py-3 bg-transparent border border-brandGold text-brandGold hover:bg-brandGold hover:text-brandIvory transition-colors duration-300">
                      {slides[currentSlide].actionText || "Découvrir"}
                    </button>
                  </Link>
                )}
              </motion.div>
            </AnimatePresence>
            
            {/* Slide indicators */}
            <div className="absolute bottom-12 flex space-x-3">
              {slides.map((_, index) => (
                <button
                  key={`dot-${index}`}
                  onClick={() => {
                    setIsAutoplay(false);
                    setCurrentSlide(index);
                  }}
                  className={`h-[3px] w-6 transition-all duration-300 ${
                    index === currentSlide ? "bg-brandGold" : "bg-gray-300"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
          
          {/* Decorative corner element */}
          <div className="absolute top-8 right-8 h-12 w-12 border-t-2 border-r-2 border-brandGold/40" />
          <div className="absolute bottom-8 left-8 h-12 w-12 border-b-2 border-l-2 border-brandGold/40" />
        </div>
        
        {/* Right: Image (60% width on desktop, full width on mobile) */}
        <div className="w-full md:w-3/5 h-full relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={`image-${currentSlide}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full h-full relative"
            >
              <Image
                src={slides[currentSlide].imageSrc}
                alt={slides[currentSlide].heading}
                fill
                sizes="(max-width: 768px) 100vw, 60vw"
                priority
                className="object-cover object-center"
              />
              
              {/* Mobile text overlay (visible on mobile only) */}
              <div className="md:hidden absolute inset-0 bg-gradient-to-t from-richEbony/80 to-transparent flex flex-col justify-end p-6">
                <h1 className="text-2xl font-serif text-brandIvory mb-2">
                  {slides[currentSlide].heading}
                </h1>
                <p className="text-sm text-brandIvory/90 mb-4">
                  {slides[currentSlide].subheading}
                </p>
                {slides[currentSlide].actionLink && (
                  <Link href={slides[currentSlide].actionLink || "/collections"}>
                    <button className="px-6 py-2 bg-brandGold text-richEbony text-sm">
                      {slides[currentSlide].actionText || "Découvrir"}
                    </button>
                  </Link>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
          
          {/* Navigation arrows - semi-transparent on hover */}
          <button 
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center bg-richEbony/20 text-brandIvory hover:bg-richEbony/40 transition-all duration-300"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center bg-richEbony/20 text-brandIvory hover:bg-richEbony/40 transition-all duration-300"
            aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  );
}