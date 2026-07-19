'use client';
import Link from 'next/link';
import SafeImage from '@/components/SafeImage';
import { Star, Clock, MapPin } from 'lucide-react';
import { resolveImage } from '@/lib/imageResolver';

export default function PackageCard({ pkg }: { pkg: any }) {
  return (
    <Link href={`/packages/${pkg.slug}`} className="card group overflow-hidden hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-48 w-full overflow-hidden rounded-t-xl bg-slate-100 dark:bg-slate-800">
        <SafeImage src={resolveImage('package', pkg.slug || pkg.title, pkg.images?.[0])} alt={pkg.title} fill className="object-cover transition duration-500 group-hover:scale-110" sizes="(max-width:768px) 100vw, 33vw" />
        <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-xs font-semibold text-primary"><Star size={12} className="fill-accent text-accent" />{pkg.rating?.toFixed(1)}</span>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-1 text-xs text-slate-500"><MapPin size={12} />{pkg.city}, {pkg.country}</div>
        <h3 className="mt-1 line-clamp-1 font-bold text-slate-800 group-hover:text-primary">{pkg.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-slate-500">{pkg.summary}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="flex items-center gap-1 text-xs text-slate-500"><Clock size={12} />{pkg.durationNights}N / {pkg.durationDays}D</span>
          <span className="text-xs font-bold text-primary hover:underline">View Details</span>
        </div>
      </div>
    </Link>
  );
}
