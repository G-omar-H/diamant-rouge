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
      case "left": return "items-start text-left left-16 md:left-24";
      case "center": return "items-center text-center left-1/2 -translate-x-1/2";
      case "right": return "items-end text-right right-16 md:right-24";
      default: return "items-end text-right right-16 md:right-24";
    }
  };

  return (
    <section 
      className="relative w-full h-[85vh] overflow-hidden bg-richEbony"
      onMouseEnter={pauseAutoplay}
      onMouseLeave={resumeAutoplay}
    >
      {/* Decorative diamond shapes - position absolute */}
      <div className="absolute z-10 top-12 left-12 w-32 h-32 border-2 border-brandGold/30 rotate-45 opacity-70" />
      <div className="absolute z-10 bottom-12 right-12 w-24 h-24 border-2 border-brandGold/30 rotate-45 opacity-70" />
      
      {/* Background pattern - subtle geometry */}
      <div className="absolute inset-0 bg-[url('/images/subtle-pattern.png')] bg-repeat opacity-10 z-10"></div>
      
      {/* Full-width image container */}
      <div className="relative w-full h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={`image-${currentSlide}`}
            initial={{ opacity: 0.4, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0.4 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="w-full h-full relative"
          >
            {/* Main image */}
            <Image
              src={slides[currentSlide].imageSrc}
              alt={slides[currentSlide].heading}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-richEbony/60 via-transparent to-richEbony/60 z-10" />
            
            {/* Golden diamond frame - decorative element */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[85%] border border-brandGold/20 z-20"></div>
          </motion.div>
        </AnimatePresence>
        
        {/* Navigation controls with translucent backgrounds */}
        <div className="absolute inset-x-0 top-1/2 -mt-6 flex justify-between px-4 z-30">
          <motion.button 
            onClick={prevSlide}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-richEbony/30 backdrop-blur-sm border border-brandGold/30"
            aria-label="Previous slide"
          >
            <ChevronLeft className="text-brandGold" size={24} />
          </motion.button>
          <motion.button 
            onClick={nextSlide}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-richEbony/30 backdrop-blur-sm border border-brandGold/30"
            aria-label="Next slide"
          >
            <ChevronRight className="text-brandGold" size={24} />
          </motion.button>
        </div>
        
        {/* Text content with dynamic positioning */}
        <div className={`absolute bottom-16 z-30 max-w-lg ${getTextPosition(slides[currentSlide].position)}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={`text-${currentSlide}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              {/* Decorative elements */}
              <div className="relative mb-4">
                <div className="h-[2px] w-16 bg-brandGold mb-2" />
                <div className="h-[1px] w-24 bg-brandGold/60" />
              </div>
              
              <motion.h2 
                className="text-4xl md:text-5xl lg:text-6xl font-serif text-brandIvory mb-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {slides[currentSlide].heading}
              </motion.h2>
              
              <motion.p 
                className="text-xl text-brandIvory/90 mb-6 max-w-md"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                {slides[currentSlide].subheading}
              </motion.p>
              
              {slides[currentSlide].actionLink && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                >
                  <Link href={slides[currentSlide].actionLink || "/collections"}>
                    <button className="px-8 py-3 bg-transparent border border-brandGold text-brandGold hover:bg-brandGold hover:text-richEbony transition-all duration-300 group relative overflow-hidden">
                      <span className="relative z-10">{slides[currentSlide].actionText || "Découvrir"}</span>
                      <span className="absolute inset-0 bg-brandGold transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
                    </button>
                  </Link>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Slide indicators with animated active state */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30">
          {slides.map((_, index) => (
            <button
              key={`indicator-${index}`}
              onClick={() => {
                setIsAutoplay(false);
                setCurrentSlide(index);
              }}
              className="group"
              aria-label={`Go to slide ${index + 1}`}
            >
              <div className="h-1 w-8 bg-brandGold/30 overflow-hidden">
                <motion.div
                  className="h-full bg-brandGold"
                  initial={{ width: index === currentSlide ? "100%" : "0%" }}
                  animate={{ width: index === currentSlide ? "100%" : "0%" }}
                  transition={index === currentSlide ? { duration: autoplaySpeed / 1000 } : { duration: 0.3 }}
                />
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}