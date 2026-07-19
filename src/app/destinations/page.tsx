'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import DestinationCard from '@/components/DestinationCard';
import { SkeletonGrid } from '@/components/Skeletons';

export default function Destinations() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState('');
  const [sort, setSort] = useState('order');

  useEffect(() => {
    setLoading(true);
    const p = new URLSearchParams(); if (type) p.set('type', type); p.set('sort', sort); p.set('limit', '24');
    api.get(`/destinations?${p.toString()}`).then(r => setItems(r.data.items)).finally(() => setLoading(false));
  }, [type, sort]);

  return (
    <div className="container-x py-10">
      <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white">Explore Destinations</h1>
      <p className="mt-4 inline-block bg-black text-white dark:bg-white dark:text-black px-6 py-2.5 rounded-full text-lg font-bold shadow-md">
        Domestic & international destinations curated for your clients
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <select value={type} onChange={e => setType(e.target.value)} className="rounded-xl border border-slate-300 bg-white text-black dark:bg-white dark:text-black font-semibold px-4 py-2.5 text-sm shadow-sm cursor-pointer hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1E4D8B] transition-all"><option value="">All Types</option><option value="domestic">Domestic</option><option value="international">International</option></select>
        <select value={sort} onChange={e => setSort(e.target.value)} className="rounded-xl border border-slate-300 bg-white text-black dark:bg-white dark:text-black font-semibold px-4 py-2.5 text-sm shadow-sm cursor-pointer hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1E4D8B] transition-all"><option value="order">Featured</option><option value="rating">Rating</option><option value="newest">Newest</option></select>
      </div>
      {loading ? <div className="mt-8"><SkeletonGrid count={8} /></div> : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{items.map((d, i) => <DestinationCard key={d._id} dest={d} index={i} />)}</div>
      )}
    </div>
  );
}
