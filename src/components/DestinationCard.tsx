'use client';
import Link from 'next/link';
import SafeImage from '@/components/SafeImage';
import { motion } from 'framer-motion';
import { Star, MapPin, ArrowRight } from 'lucide-react';
import { resolveImage } from '@/lib/imageResolver';

export default function DestinationCard({ dest, index = 0 }: { dest: any; index?: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (index % 4) * 0.06 }}>
      <Link href={`/destinations/${dest.slug}`} className="group relative block overflow-hidden rounded-2xl shadow-premium ring-1 ring-slate-100 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl dark:ring-slate-800">
        <div className="relative h-64 overflow-hidden">
          <SafeImage src={resolveImage('destination', dest.slug || dest.name, dest.image)} alt={dest.name} fill sizes="(max-width:768px) 100vw, 25vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent transition group-hover:from-primary-dark/90" />
          <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-primary dark:bg-slate-900/90">
            <Star size={12} className="fill-accent text-accent" />{dest.rating?.toFixed(1)}
          </span>
          <span className="absolute right-3 top-3 rounded-full bg-secondary/90 px-2.5 py-1 text-xs font-semibold text-white">{dest.tourCount} tours</span>
          <div className="absolute inset-x-0 bottom-0 p-4 text-white">
            <div className="flex items-center gap-1 text-xs text-white/80"><MapPin size={12} />{dest.country}</div>
            <h3 className="mt-0.5 text-xl font-extrabold">{dest.name}</h3>
            <p className="mt-1 line-clamp-2 text-xs text-white/75">{dest.shortDescription}</p>
            <div className="mt-3 flex items-center justify-end">
              <span className="flex translate-y-2 items-center gap-1 rounded-xl bg-accent px-3 py-1.5 text-xs font-bold text-slate-900 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">Explore <ArrowRight size={13} /></span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
