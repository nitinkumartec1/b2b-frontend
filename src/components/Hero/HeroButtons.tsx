'use client';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface HeroButtonsProps {
  onPrev: () => void;
  onNext: () => void;
  currentIndex: number;
  totalSlides: number;
  onDotClick?: (index: number) => void;
}

export default function HeroButtons({ onPrev, onNext, currentIndex, totalSlides, onDotClick }: HeroButtonsProps) {
  const router = useRouter();

  return (
    <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-6">
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        onClick={() => router.push('/packages')}
        className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-400 text-white px-8 py-4 rounded-full font-bold text-[16px] flex items-center justify-center gap-2 hover:scale-105 hover:shadow-[0_10px_40px_-10px_rgba(37,99,235,0.8)] transition-all duration-300 group shrink-0"
      >
        Explore More 
        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
      </motion.button>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="flex flex-col sm:flex-row items-center sm:justify-start gap-4"
      >
        <div className="flex items-center gap-4">
          <button 
            onClick={onPrev}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white transition-all hover:bg-white hover:text-slate-900 group"
            aria-label="Previous Slide"
          >
            <ChevronLeft size={24} className="group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <button 
            onClick={onNext}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white transition-all hover:bg-white hover:text-slate-900 group"
            aria-label="Next Slide"
          >
            <ChevronRight size={24} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
        
        <div className="flex items-center gap-2 ml-2">
          {Array.from({ length: totalSlides }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => onDotClick && onDotClick(idx)}
              className={`transition-all duration-300 rounded-full ${
                currentIndex === idx 
                  ? 'w-6 h-2 bg-white' 
                  : 'w-2 h-2 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
