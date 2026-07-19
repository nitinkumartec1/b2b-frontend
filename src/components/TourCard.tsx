'use client';
import { useState } from 'react';
import Link from 'next/link';
import SafeImage from '@/components/SafeImage';
import { useRouter } from 'next/navigation';
import { Star, Clock, Hotel, Utensils, Plane, Heart, Share2, ShieldAlert } from 'lucide-react';
import { resolveImage } from '@/lib/imageResolver';

export default function TourCard({ pkg }: { pkg: any }) {
  const router = useRouter();
  const [wish, setWish] = useState(false);
  const stop = (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); };
  const share = (e: React.MouseEvent) => { stop(e); if (navigator.share) navigator.share({ title: pkg.title, url: `/packages/${pkg.slug}` }).catch(()=>{}); };

  return (
    <Link href={`/packages/${pkg.slug}`} className="group block w-full h-full min-h-[450px] md:min-h-[470px] lg:min-h-[500px] xl:min-h-[520px] rounded-[24px] bg-white shadow-[0_4px_20px_rgb(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-[10px] hover:shadow-[0_20px_40px_-12px_rgba(30,77,139,0.15)] overflow-hidden flex flex-col relative dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
      
      {/* IMAGE SECTION */}
      <div className="relative h-[220px] md:h-[240px] shrink-0 overflow-hidden rounded-t-[24px]">
        <SafeImage src={resolveImage('package', pkg.slug || pkg.title, pkg.images?.[0])} alt={pkg.title} fill sizes="(max-width: 768px) 100vw, 400px" className="object-cover transition-transform duration-300 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        
        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
          <div>
            {pkg.bestSelling && (
              <span className="flex items-center gap-1 bg-white/20 backdrop-blur-md border border-white/30 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-sm">
                🔥 Best Seller
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <button onClick={(e) => { stop(e); setWish(!wish); }} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white transition-transform hover:scale-110 active:scale-95 shadow-sm">
              <Heart size={18} className={wish ? 'fill-red-500 text-red-500' : ''} />
            </button>
            <button onClick={share} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white transition-transform hover:scale-110 active:scale-95 shadow-sm">
              <Share2 size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* DETAILS SECTION */}
      <div className="flex flex-col flex-grow p-[24px]">
        
        <div className="flex justify-between items-start mb-1">
          <span className="text-[14px] text-slate-500 font-medium uppercase tracking-wider">{pkg.city || pkg.destination?.name || pkg.country}</span>
          <div className="flex items-center gap-1 font-bold text-slate-700 dark:text-slate-200 text-sm">
            <Star size={14} className="fill-accent text-accent" /> {pkg.rating?.toFixed(1)} <span className="text-slate-400 font-normal">({pkg.reviewCount})</span>
          </div>
        </div>

        <h3 className="text-[20px] lg:text-[22px] font-bold text-slate-900 dark:text-white leading-tight line-clamp-2 mb-3 group-hover:text-primary transition-colors">
          {pkg.title}
        </h3>

        {/* Features Row */}
        <div className="flex flex-wrap gap-x-3 gap-y-2 text-[13px] text-slate-600 dark:text-slate-400 font-medium mb-auto">
          <span className="flex items-center gap-1"><Clock size={14} className="text-primary/70" /> {pkg.durationNights}N/{pkg.durationDays}D</span>
          <span className="flex items-center gap-1"><Hotel size={14} className="text-primary/70" /> {pkg.hotelRating}★</span>
          <span className="flex items-center gap-1"><Utensils size={14} className="text-primary/70" /> {pkg.mealPlan || pkg.meals || 'Meals'}</span>
          {pkg.flightIncluded && <span className="flex items-center gap-1"><Plane size={14} className="text-primary/70" /> Flight</span>}
          {pkg.visaIncluded && <span className="flex items-center gap-1"><ShieldAlert size={14} className="text-primary/70" /> Visa</span>}
        </div>

        {/* Price & Buttons */}
        <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex gap-2">
            <button onClick={(e) => { stop(e); router.push(`/packages/${pkg.slug}`); }} className="flex-1 h-[46px] rounded-[14px] border border-primary/30 text-[16px] font-semibold text-primary transition-all duration-300 hover:bg-primary/5 active:scale-95 flex items-center justify-center">
              View Details
            </button>
            <button onClick={(e) => { stop(e); router.push(`/packages/${pkg.slug}`); }} className="flex-[1.5] h-[50px] rounded-[14px] bg-primary text-[16px] font-semibold text-white transition-all duration-300 hover:bg-primary-dark active:scale-95 flex items-center justify-center shadow-md">
              Send Enquiry
            </button>
          </div>
        </div>

      </div>
    </Link>
  );
}
