'use client';
import { motion } from 'framer-motion';
import PremiumDestCard from './PremiumDestCard';
import CTACard from './CTACard';
import { SkeletonGrid } from '@/components/Skeletons';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function PopularDestinations({ destinations, loading }: { destinations: any[]; loading: boolean }) {
  // Take exactly 5 destinations for the 3x2 grid layout
  const gridDestinations = destinations.slice(0, 5);

  return (
    <section className="bg-white py-[80px]">
      <div className="w-full max-w-[1280px] mx-auto px-4 md:px-6">
        
        {/* Section Header */}
        <div className="text-center mb-[50px]">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[14px] uppercase text-slate-500 tracking-[0.35em] font-semibold"
          >
            ← Let us take you →
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[28px] md:text-[36px] lg:text-[48px] font-bold text-[#111827] mt-[12px] leading-[1.2]"
          >
            Explore India&apos;s Most Loved Destinations
          </motion.h2>
        </div>

        {/* 3x2 Grid */}
        {loading ? (
          <SkeletonGrid count={6} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px]">
            {gridDestinations.map((dest, index) => (
              <PremiumDestCard key={dest._id} dest={dest} index={index} featured={index === 0} />
            ))}
            {/* The 6th CTA Card */}
            <CTACard index={gridDestinations.length} />
          </div>
        )}

        {/* View All Button */}
        <div className="mt-12 flex justify-center">
          <Link href="/destinations">
            <button className="bg-white border border-slate-200 text-slate-700 hover:text-primary hover:border-primary/50 font-bold px-8 py-3 rounded-full shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2 group">
              View All Destinations
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>
        
      </div>
    </section>
  );
}
