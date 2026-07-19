'use client';
import Link from 'next/link';
import SafeImage from '@/components/SafeImage';
import { motion } from 'framer-motion';
import { Heart, Star, Flame, Palmtree, Navigation } from 'lucide-react';
import { resolveImage } from '@/lib/imageResolver';

interface PackageProps {
  slug: string;
  images?: string[];
  title: string;
  country?: string;
  city?: string;
  destination?: { name: string };
  durationNights: number;
  durationDays: number;
  rating?: number;
  bestSelling?: boolean;
}

export default function MasonryPackageCard({ pkg, index }: { pkg: PackageProps; index: number }) {
  // Cycle through 4 different heights to create the masonry effect
  const heights = [340, 420, 280, 500];
  const cardHeight = heights[index % 4];

  const destinationName = pkg.city || pkg.destination?.name || pkg.country || "Multiple Destinations";

  return (
    <motion.article 
      initial={{ opacity: 0, y: 30 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      viewport={{ once: true, margin: "-50px" }} 
      transition={{ delay: (index % 4) * 0.1, duration: 0.6, ease: "easeOut" }}
      className="mb-6 break-inside-avoid"
    >
      <Link 
        href={`/packages/${pkg.slug}`} 
        className="group relative block w-full overflow-hidden rounded-[22px] bg-white shadow-[0_10px_30px_rgb(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-[10px] hover:shadow-[0_20px_40px_rgb(0,0,0,0.2)] cursor-pointer"
        style={{ height: `${cardHeight}px` }}
      >
        {/* Background Image */}
        <SafeImage 
          src={resolveImage('package', pkg.slug || pkg.title, pkg.images?.[0])} 
          alt={pkg.title}  
          fill 
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-110" 
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.85)] via-[rgba(0,0,0,0.4)] to-transparent transition-opacity duration-300 opacity-90 group-hover:opacity-100" />
        
        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
          <div>
            {pkg.bestSelling ? (
              <span className="flex items-center gap-1 bg-white/20 backdrop-blur-md border border-white/30 text-white px-3 py-1.5 rounded-full text-[11px] font-bold shadow-sm uppercase tracking-wider">
                <Flame size={12} className="text-accent" /> Best Seller
              </span>
            ) : index % 3 === 0 ? (
              <span className="flex items-center gap-1 bg-white/20 backdrop-blur-md border border-white/30 text-white px-3 py-1.5 rounded-full text-[11px] font-bold shadow-sm uppercase tracking-wider">
                <Palmtree size={12} className="text-accent" /> Luxury
              </span>
            ) : null}
          </div>
          
          <button onClick={(e) => { e.preventDefault(); }} className="w-9 h-9 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white transition-transform hover:scale-110 active:scale-95 shadow-sm">
            <Heart size={16} />
          </button>
        </div>
        
        {/* Bottom Aligned Content */}
        <div className="absolute inset-x-0 bottom-0 p-5 text-white flex flex-col justify-end">
          
          {/* Destination & Duration */}
          <div className="flex items-center justify-between mb-2 drop-shadow-md">
            <div className="flex items-center gap-1 text-[13px] font-medium text-white/90 bg-black/20 backdrop-blur-sm px-2 py-1 rounded-md">
              <Navigation size={12} className="text-accent" /> {destinationName}
            </div>
            <div className="text-[13px] font-medium text-white/80 bg-black/20 backdrop-blur-sm px-2 py-1 rounded-md">
              {pkg.durationNights}N/{pkg.durationDays}D
            </div>
          </div>

          {/* Package Name */}
          <h3 className="text-[20px] leading-tight font-bold drop-shadow-lg mb-3 line-clamp-2">
            {pkg.title}
          </h3>
          
          {/* Glassmorphism Info Panel */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[16px] p-4 shadow-lg transition-colors duration-300 group-hover:bg-white/15">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-1 text-[13px] font-bold">
                <Star size={14} className="fill-accent text-accent" /> {pkg.rating?.toFixed(1) || '4.5'}
              </div>
            </div>
            
            {/* Book Now Button */}
            <button className="w-full h-[48px] bg-[#1E4D8B] hover:bg-[#163B6E] text-white rounded-[14px] font-bold text-[15px] shadow-md transition-all duration-300 hover:shadow-lg flex items-center justify-center translate-y-1 opacity-90 group-hover:translate-y-0 group-hover:opacity-100">
              Send Enquiry
            </button>
          </div>

        </div>
      </Link>
    </motion.article>
  );
}
