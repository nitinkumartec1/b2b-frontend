'use client';
import { useRouter } from 'next/navigation';

export default function PopularSearches() {
  const router = useRouter();
  
  const searches = [
    'Luxury Packages',
    'Honeymoon',
    'Family Trip',
    'Adventure',
    'Weekend Getaway'
  ];

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
      <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Popular Searches:</span>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {searches.map((search) => (
          <button
            key={search}
            onClick={(e) => {
              e.preventDefault();
              const param = search.split(' ')[0].toLowerCase();
              router.push(`/packages?theme=${param}`);
            }}
            className="text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-primary/10 hover:text-primary transition-colors px-3 py-1.5 rounded-full"
          >
            {search}
          </button>
        ))}
      </div>
    </div>
  );
}
