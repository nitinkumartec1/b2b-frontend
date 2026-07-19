'use client';
import { motion } from 'framer-motion';
import MasonryPackageCard from './MasonryPackageCard';
import { SkeletonGrid } from '@/components/Skeletons';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function HolidayPackages({ packages, loading }: { packages: any[]; loading: boolean }) {
  // Take exactly 8 packages for the masonry grid
  const displayPackages = packages.slice(0, 8);

  return (
    <section className="bg-white py-[90px]">
      <div className="w-full max-w-[1280px] mx-auto px-4 md:px-6">
        
        {/* Section Header */}
        <div className="text-center mb-[60px]">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[14px] uppercase text-slate-500 tracking-[0.35em] font-bold"
          >
            ✈ EXPLORE HOLIDAYS ✈
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[30px] md:text-[36px] lg:text-[48px] font-bold text-[#111827] mt-[12px] leading-[1.2]"
          >
            Choose Your Perfect Holiday Package
          </motion.h2>
        </div>

        {/* Masonry Grid */}
        {loading ? (
          <SkeletonGrid count={8} />
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-4 gap-6 space-y-6">
            {displayPackages.map((pkg, index) => (
              <MasonryPackageCard key={pkg._id} pkg={pkg} index={index} />
            ))}
          </div>
        )}

        {/* View All Button */}
        <div className="mt-14 flex justify-center">
          <Link href="/packages">
            <button className="bg-white border border-slate-200 text-slate-700 hover:text-[#1E4D8B] hover:border-[#1E4D8B]/50 font-bold px-8 py-3 rounded-full shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2 group">
              View All Packages
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>
        
      </div>
    </section>
  );
}
