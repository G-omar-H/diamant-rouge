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

  const getTextPosition = (position = "right") => {
    switch(position) {
      case "left": return "left-12 md:left-24 lg:left-36 items-start text-left";
      case "center": return "left-1/2 -translate-x-1/2 items-center text-center";
      case "right": return "right-12 md:right-24 lg:right-36 items-end text-right";
      default: return "right-12 md:right-24 lg:right-36 items-end text-right";
    }
  };

  return (
    <section 
      className="relative w-full h-[90vh] overflow-hidden bg-richEbony"
      onMouseEnter={pauseAutoplay}
      onMouseLeave={resumeAutoplay}
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
              sizes="100vw"
              className="object-cover object-center" 
            />
          </motion.div>
        </AnimatePresence>
        
        {/* Navigation controls - minimal and elegant */}
        <div className="absolute inset-x-0 top-1/2 -mt-6 flex justify-between px-8 z-20">
          <motion.button 
            onClick={prevSlide}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-12 h-12 flex items-center justify-center rounded-full border border-brandGold/40 hover:border-brandGold transition-colors duration-300"
            aria-label="Previous slide"
          >
            <ChevronLeft className="text-brandIvory" size={20} />
          </motion.button>
          <motion.button 
            onClick={nextSlide}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-12 h-12 flex items-center justify-center rounded-full border border-brandGold/40 hover:border-brandGold transition-colors duration-300"
            aria-label="Next slide"
          >
            <ChevronRight className="text-brandIvory" size={20} />
          </motion.button>
        </div>
        
        {/* Minimal text content - no background overlay */}
        <div className={`absolute bottom-24 z-20 max-w-lg ${getTextPosition(slides[currentSlide].position)}`}>
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
                className="h-px bg-brandGold mb-6"
              />
              
              <motion.h2 
                className="text-3xl md:text-5xl font-serif text-brandIvory mb-4 drop-shadow-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                {slides[currentSlide].heading}
              </motion.h2>
              
              <motion.p 
                className="text-lg text-brandIvory mb-8 max-w-md drop-shadow-md"
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
                    <button className="px-8 py-3 border border-brandGold text-brandIvory hover:bg-brandGold transition-colors duration-300">
                      {slides[currentSlide].actionText || "Découvrir"}
                    </button>
                  </Link>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Minimal slide indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4 z-20">
          {slides.map((_, index) => (
            <button
              key={`indicator-${index}`}
              onClick={() => {
                setIsAutoplay(false);
                setCurrentSlide(index);
              }}
              aria-label={`Go to slide ${index + 1}`}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentSlide ? "bg-brandGold scale-125" : "bg-brandIvory/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}