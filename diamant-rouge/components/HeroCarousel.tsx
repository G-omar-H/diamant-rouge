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
  position?: "left" | "right" | "center";
}

interface HeroCarouselProps {
  slides: Slide[];
  autoplaySpeed?: number;
}

export default function HeroCarousel({
  slides,
  autoplaySpeed = 7000,
}: HeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

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

  // Touch handlers for swipe functionality
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isSwipe = Math.abs(distance) > 50; // minimum distance for a swipe
    
    if (isSwipe) {
      if (distance > 0) {
        // swipe left
        nextSlide();
      } else {
        // swipe right
        prevSlide();
      }
    }
    
    setTouchStart(0);
    setTouchEnd(0);
  };

  const getTextPosition = (position = "right") => {
    switch(position) {
      case "left": return "left-6 md:left-12 lg:left-36 items-start text-left";
      case "center": return "left-1/2 -translate-x-1/2 items-center text-center";
      case "right": return "right-6 md:right-12 lg:right-36 items-end text-right";
      default: return "right-6 md:right-12 lg:right-36 items-end text-right";
    }
  };

  return (
    <section 
      className="relative w-full h-[90vh] md:h-[100vh] overflow-hidden bg-richEbony home-hero-section"
      style={{ marginTop: 'calc(-1 * var(--current-header-height))' }}
      onMouseEnter={pauseAutoplay}
      onMouseLeave={resumeAutoplay}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Full-width image container */}
      <div className="relative w-full h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={`image-${currentSlide}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="w-full h-full relative"
          >
            {/* Main image - full width, no cropping */}
            <Image
              src={slides[currentSlide].imageSrc}
              alt={slides[currentSlide].heading}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 100vw"
              className="object-cover object-center" 
            />
            {/* Mobile-friendly subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-richEbony/60 via-transparent to-transparent md:bg-none"></div>
          </motion.div>
        </AnimatePresence>
        
        {/* Navigation controls - minimal and elegant */}
        <div className="absolute inset-x-0 top-1/2 -mt-6 flex justify-between px-4 md:px-8 z-20">
          <motion.button 
            onClick={prevSlide}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-brandIvory/10 backdrop-blur-sm border border-brandGold/40 hover:border-brandGold transition-colors duration-300"
            aria-label="Previous slide"
          >
            <ChevronLeft className="text-brandIvory" size={18} />
          </motion.button>
          <motion.button 
            onClick={nextSlide}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-brandIvory/10 backdrop-blur-sm border border-brandGold/40 hover:border-brandGold transition-colors duration-300"
            aria-label="Next slide"
          >
            <ChevronRight className="text-brandIvory" size={18} />
          </motion.button>
        </div>
        
        {/* Text content - adjusted for mobile */}
        <div className={`absolute bottom-20 md:bottom-24 z-20 max-w-xs sm:max-w-sm md:max-w-lg px-5 md:px-0 ${getTextPosition(slides[currentSlide].position)}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={`text-${currentSlide}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              {/* Gold accent line */}
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "3rem" }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="h-px bg-brandGold mb-4 md:mb-6"
              />
              
              <motion.h2 
                className="text-2xl sm:text-3xl md:text-5xl font-serif text-brandIvory mb-3 md:mb-4 drop-shadow-md text-shadow-dark"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                {slides[currentSlide].heading}
              </motion.h2>
              
              <motion.p 
                className="text-base sm:text-lg text-brandIvory mb-6 md:mb-8 max-w-md drop-shadow-md text-shadow-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                {slides[currentSlide].subheading}
              </motion.p>
              
              {slides[currentSlide].actionLink && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <Link href={slides[currentSlide].actionLink || "/collections"}>
                    <button className="px-6 md:px-8 py-2.5 md:py-3 border border-brandGold text-brandIvory hover:bg-brandGold transition-colors duration-300 text-sm md:text-base backdrop-blur-sm bg-richEbony/10">
                      {slides[currentSlide].actionText || "Découvrir"}
                    </button>
                  </Link>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Slide indicators - enhanced for mobile */}
        <div className="absolute bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 md:space-x-4 z-20">
          {slides.map((_, index) => (
            <button
              key={`indicator-${index}`}
              onClick={() => {
                setIsAutoplay(false);
                setCurrentSlide(index);
              }}
              aria-label={`Go to slide ${index + 1}`}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentSlide ? "bg-brandGold w-4 h-2" : "bg-brandIvory/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}