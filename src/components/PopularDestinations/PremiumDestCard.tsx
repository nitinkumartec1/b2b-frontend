'use client';
import Link from 'next/link';
import SafeImage from '@/components/SafeImage';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Flame } from 'lucide-react';
import { resolveImage } from '@/lib/imageResolver';

interface DestProps {
  slug: string;
  image: string;
  name: string;
  country: string;
  tourCount: number;
}

export default function PremiumDestCard({ dest, index, featured = false }: { dest: DestProps; index: number; featured?: boolean }) {
  const cardRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });
  const yParallax = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <motion.article 
      ref={cardRef} 
      initial={{ opacity: 0, y: 20 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      viewport={{ once: true }} 
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <Link 
        href={`/destinations/${dest.slug}`} 
        className="group relative block h-[300px] w-full overflow-hidden rounded-[18px] transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer"
      >
        <motion.div style={{ y: yParallax }} className="absolute inset-[-15%] w-[130%] h-[130%]">
          <SafeImage 
            src={resolveImage('destination', dest.slug || dest.name, dest.image)} 
            alt={dest.name} 
            fill 
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105" 
          />
        </motion.div>
        
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/10 opacity-70 group-hover:opacity-90 transition-opacity duration-300" />
        
        {/* Featured Badge */}
        {featured && (
          <div className="absolute top-4 left-4 bg-accent/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-slate-900 text-xs font-bold flex items-center gap-1 shadow-md">
            <Flame size={14} /> Popular
          </div>
        )}
        
        {/* Bottom Aligned Content */}
        <div className="absolute inset-x-0 bottom-0 p-5 flex flex-col justify-end">
          <p className="text-xs font-bold text-white/90 drop-shadow-md uppercase tracking-wider mb-1">
            {dest.country}
          </p>
          <h3 className="text-2xl font-extrabold text-white drop-shadow-lg mb-4">
            {dest.name}
          </h3>
          
          {/* Frosted Glass Footer */}
          <div className="flex items-center justify-between text-sm bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 shadow-lg group-hover:bg-white/20 transition-colors duration-300">
            <span className="font-semibold text-white/95">{dest.tourCount} Packages</span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
