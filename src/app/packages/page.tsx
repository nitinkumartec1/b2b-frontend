'use client';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SlidersHorizontal } from 'lucide-react';
import { api } from '@/lib/api';
import PackageCard from '@/components/PackageCard';

function PackagesInner() {
  const sp = useSearchParams();
  const router = useRouter();
  const [data, setData] = useState<any>({ items: [], total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    q: sp.get('q') || '', type: sp.get('type') || '', theme: sp.get('theme') || '',
    minPrice: sp.get('minPrice') || '', maxPrice: sp.get('maxPrice') || '',
    hotelRating: sp.get('hotelRating') || '', fixedDeparture: sp.get('fixedDeparture') || '',
    sort: sp.get('sort') || 'popularity', page: Number(sp.get('page') || 1)
  });

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, String(v)); });
    api.get(`/packages?${params.toString()}`).then(r => setData(r.data)).finally(() => setLoading(false));
  }, [filters]);

  const upd = (k: string, v: any) => setFilters(f => ({ ...f, [k]: v, page: 1 }));

  return (
    <div className="container-x py-10">
      <h1 className="text-3xl font-extrabold text-slate-800">Holiday Packages</h1>
      <p className="mt-1 text-slate-500">{data.total} packages found</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-4">
        {/* Filters */}
        <aside className="card h-fit p-5 lg:col-span-1">
          <div className="mb-4 flex items-center gap-2 font-bold text-slate-700"><SlidersHorizontal size={18} /> Filters</div>
          <label className="mb-1 block text-sm font-medium">Search</label>
          <input value={filters.q} onChange={e => upd('q', e.target.value)} placeholder="Keyword" className="mb-4 w-full rounded-xl border px-3 py-2 text-sm" />

          <label className="mb-1 block text-sm font-medium">Type</label>
          <select value={filters.type} onChange={e => upd('type', e.target.value)} className="mb-4 w-full rounded-xl border px-3 py-2 text-sm">
            <option value="">All</option><option value="domestic">Domestic</option><option value="international">International</option>
          </select>

          <label className="mb-1 block text-sm font-medium">Theme</label>
          <select value={filters.theme} onChange={e => upd('theme', e.target.value)} className="mb-4 w-full rounded-xl border px-3 py-2 text-sm">
            <option value="">Any</option>
            {['luxury','family','honeymoon','adventure','corporate','pilgrimage','weekend','cruise'].map(t => <option key={t} value={t}>{t}</option>)}
          </select>

          <label className="mb-1 block text-sm font-medium">Max Budget (₹)</label>
          <input type="number" value={filters.maxPrice} onChange={e => upd('maxPrice', e.target.value)} placeholder="e.g. 50000" className="mb-4 w-full rounded-xl border px-3 py-2 text-sm" />

          <label className="mb-1 block text-sm font-medium">Min Hotel Rating</label>
          <select value={filters.hotelRating} onChange={e => upd('hotelRating', e.target.value)} className="mb-4 w-full rounded-xl border px-3 py-2 text-sm">
            <option value="">Any</option><option value="3">3★+</option><option value="4">4★+</option><option value="5">5★</option>
          </select>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={filters.fixedDeparture === 'true'} onChange={e => upd('fixedDeparture', e.target.checked ? 'true' : '')} />
            Fixed Departures only
          </label>
        </aside>

        {/* Results */}
        <div className="lg:col-span-3">
          <div className="mb-4 flex items-center justify-end">
            <select value={filters.sort} onChange={e => upd('sort', e.target.value)} className="rounded-xl border px-3 py-2 text-sm">
              <option value="popularity">Popularity</option>
              <option value="rating">Rating</option>
              <option value="newest">Newest</option>
              <option value="duration">Duration</option>
            </select>
          </div>
          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{Array.from({length:6}).map((_,i)=><div key={i} className="h-72 animate-pulse rounded-xl bg-slate-100" />)}</div>
          ) : data.items.length ? (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{data.items.map((p: any) => <PackageCard key={p._id} pkg={p} />)}</div>
              {data.pages > 1 && (
                <div className="mt-8 flex justify-center gap-2">
                  {Array.from({ length: data.pages }).map((_, i) => (
                    <button key={i} onClick={() => setFilters(f => ({ ...f, page: i + 1 }))} className={`h-9 w-9 rounded-lg text-sm font-semibold ${filters.page === i+1 ? 'bg-primary text-white' : 'bg-slate-100'}`}>{i + 1}</button>
                  ))}
                </div>
              )}
            </>
          ) : <div className="card p-10 text-center text-slate-500">No packages match your filters.</div>}
        </div>
      </div>
    </div>
  );
}

export default function PackagesPage() {
  return <Suspense fallback={<div className="container-x py-20 text-center">Loading…</div>}><PackagesInner /></Suspense>;
}
