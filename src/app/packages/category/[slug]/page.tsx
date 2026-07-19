'use client';
import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import SafeImage from '@/components/SafeImage';
import { api } from '@/lib/api';
import PackageCard from '@/components/PackageCard';
import Filters from '@/components/Filters';
import { SkeletonGrid } from '@/components/Skeletons';

const emptyFilters = { q: '', country: '', state: '', type: '', theme: '', maxPrice: '', duration: '', month: '', hotelRating: '', mealPlan: '', flightIncluded: '', visaIncluded: '', fixedDeparture: '' };

export default function CategoryPage() {
  const { slug } = useParams();
  const [data, setData] = useState<any>({ items: [], total: 0, pages: 1, category: null });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<any>(emptyFilters);
  const [sort, setSort] = useState('popularity');
  const [page, setPage] = useState(1);

  const load = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, String(v)); });
    params.set('sort', sort); params.set('page', String(page));
    api.get(`/packages/category/${slug}?${params.toString()}`).then(r => setData(r.data)).finally(() => setLoading(false));
  }, [slug, filters, sort, page]);
  useEffect(() => { load(); }, [load]);

  const onChange = (k: string, v: any) => { setFilters((f: any) => ({ ...f, [k]: v })); setPage(1); };
  const cat = data.category;

  return (
    <div>
      <section className="relative h-56 overflow-hidden">
        {cat?.image && <SafeImage src={cat.image} alt={cat.name} fill className="object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/90 to-primary/40" />
        <div className="container-x absolute inset-x-0 bottom-0 pb-8 text-white">
          <h1 className="text-4xl font-extrabold">{cat?.name || 'Packages'}</h1>
          <p className="mt-1 text-white/85">{cat?.description}</p>
          <p className="mt-1 text-sm text-white/70">{data.total} packages available</p>
        </div>
      </section>

      <div className="container-x grid gap-8 py-10 lg:grid-cols-4">
        <div className="lg:col-span-1"><Filters filters={filters} onChange={onChange} onReset={() => setFilters(emptyFilters)} /></div>
        <div className="lg:col-span-3">
          <div className="mb-4 flex items-center justify-end">
            <select value={sort} onChange={e => setSort(e.target.value)} className="rounded-xl border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900">
              <option value="popularity">Popularity</option><option value="rating">Rating</option><option value="newest">Newest</option><option value="duration">Duration</option>
            </select>
          </div>
          {loading ? <SkeletonGrid count={6} /> : data.items.length ? (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{data.items.map((p: any) => <PackageCard key={p._id} pkg={p} />)}</div>
              {data.pages > 1 && <div className="mt-8 flex justify-center gap-2">{Array.from({ length: data.pages }).map((_, i) => <button key={i} onClick={() => setPage(i + 1)} className={`h-9 w-9 rounded-lg text-sm font-semibold ${page === i + 1 ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800'}`}>{i + 1}</button>)}</div>}
            </>
          ) : <div className="card p-10 text-center text-slate-500">No packages match your filters.</div>}
        </div>
      </div>
    </div>
  );
}
