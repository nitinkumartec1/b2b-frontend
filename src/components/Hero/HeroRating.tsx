'use client';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import SafeImage from '@/components/SafeImage';

export default function HeroRating() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.8 }}
      className="hidden md:flex absolute bottom-24 right-0 z-20 items-center gap-4 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl shadow-2xl"
    >
      {/* Note: In a real app, use a local google logo asset or highly reliable CDN. Using text for now if image fails. */}
      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-bold text-blue-600 shadow-sm shrink-0">
        G
      </div>
      <div>
        <div className="flex items-center gap-1 mb-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star key={s} size={14} className="fill-accent text-accent" />
          ))}
          <span className="text-white font-bold text-sm ml-1">4.5/5 Rating</span>
        </div>
        <p className="text-white/80 text-xs font-medium uppercase tracking-wider">
          1000+ Happy Travellers
        </p>
      </div>
    </motion.div>
  );
}
