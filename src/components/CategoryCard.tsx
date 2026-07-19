'use client';
import Link from 'next/link';
import SafeImage from '@/components/SafeImage';
import { resolveImage } from '@/lib/imageResolver';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function CategoryCard({ cat, index = 0 }: { cat: any; index?: number }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: (index % 4) * 0.05 }}>
      <Link href={`/packages/category/${cat.slug}`} className="group relative block h-44 overflow-hidden rounded-2xl shadow-premium">
        <SafeImage src={resolveImage('category', cat.slug || cat.name, cat.image)} alt={cat.name} fill sizes="(max-width:768px) 50vw, 25vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/90 via-primary/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-4 text-white">
          <h3 className="text-lg font-extrabold leading-tight">{cat.name}</h3>
          <div className="mt-1 flex items-center justify-between text-xs">
            <span className="text-white/80">{cat.packageCount} packages</span>
          </div>
          <span className="mt-2 flex w-fit items-center gap-1 rounded-lg bg-white/15 px-2.5 py-1 text-xs font-semibold backdrop-blur transition group-hover:bg-accent group-hover:text-slate-900">Explore <ArrowRight size={12} /></span>
        </div>
      </Link>
    </motion.div>
  );
}
