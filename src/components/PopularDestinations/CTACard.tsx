'use client';
import { motion } from 'framer-motion';
import { Plane, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CTACard({ index }: { index: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      viewport={{ once: true }} 
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="h-[300px] rounded-[18px] bg-gradient-to-br from-blue-50 to-white border border-blue-100 flex flex-col items-center justify-center text-center p-8 shadow-sm transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl"
    >
      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <Plane className="text-primary" size={28} />
      </div>
      
      <h3 className="text-2xl font-bold text-slate-900 mb-2">Discover Your Dream Holiday</h3>
      <p className="text-slate-500 text-sm mb-6 max-w-[200px] leading-relaxed">
        Explore curated packages across India and international destinations.
      </p>
      
      <Link href="/packages">
        <button className="h-[50px] w-[180px] bg-[#1E4D8B] hover:bg-[#153a6a] text-white rounded-full font-bold text-sm shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex items-center justify-center gap-2 group">
          Explore Packages
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </Link>
    </motion.div>
  );
}
