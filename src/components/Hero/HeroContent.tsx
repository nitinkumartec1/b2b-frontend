'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin } from 'lucide-react';

interface HeroContentProps {
  location: string;
  title: string;
  subtitle: string;
  isActive: boolean;
}

export default function HeroContent({ location, title, subtitle, isActive }: HeroContentProps) {
  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          key={title}
          className="max-w-[800px] text-center md:text-left flex flex-col items-center md:items-start z-20 relative"
        >
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/30 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6 shadow-sm"
          >
            <MapPin size={16} className="text-accent" /> {location}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-[38px] md:text-[56px] lg:text-[72px] font-extrabold text-white leading-[1.1] drop-shadow-lg mb-6"
          >
            {title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[16px] md:text-[18px] lg:text-[20px] text-white/90 max-w-[600px] drop-shadow-md font-medium leading-relaxed"
          >
            {subtitle}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
