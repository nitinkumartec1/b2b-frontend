'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SafeImage from '@/components/SafeImage';
import { heroData } from '@/data/heroData';
import HeroContent from './HeroContent';
import HeroButtons from './HeroButtons';
import HeroRating from './HeroRating';

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const totalSlides = heroData.length;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === totalSlides - 1 ? 0 : prevIndex + 1));
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? totalSlides - 1 : prevIndex - 1));
  }, [totalSlides]);

  useEffect(() => {
    resetTimeout();
    if (!isPaused) {
      timeoutRef.current = setTimeout(() => nextSlide(), 5000);
    }
    return () => resetTimeout();
  }, [currentIndex, isPaused, nextSlide, resetTimeout]);

  return (
    <section 
      className="relative h-screen w-full overflow-hidden bg-slate-900"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      
      {/* Background Images */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <SafeImage               src={heroData[currentIndex].image}
              alt={heroData[currentIndex].location}
              fill
              priority={true}
              className="object-cover"
              sizes="100vw"
            />
          </motion.div>
        </AnimatePresence>
        
        {/* Dark Overlay (Black 50% opacity + gradient for bottom text) */}
        <div className="absolute inset-0 bg-black/50 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10" />
      </div>

      {/* Main Content */}
      <div className="relative z-20 h-full w-full">
        <div className="container-x h-full flex flex-col justify-center relative">
          
          <div className="flex flex-col h-full justify-center mt-20">
            {heroData.map((slide, index) => (
              <div key={slide.id} className={index === currentIndex ? 'block' : 'hidden'}>
                <HeroContent 
                  location={slide.location}
                  title={slide.title}
                  subtitle={slide.subtitle}
                  isActive={index === currentIndex}
                />
              </div>
            ))}

            <HeroButtons 
              onPrev={() => { prevSlide(); resetTimeout(); }}
              onNext={() => { nextSlide(); resetTimeout(); }}
              currentIndex={currentIndex}
              totalSlides={totalSlides}
              onDotClick={(index) => { setCurrentIndex(index); resetTimeout(); }}
            />
          </div>

          <HeroRating />
          
        </div>
      </div>
    </section>
  );
}
