'use client';
import { useEffect, useState } from 'react';
import SafeImage from '@/components/SafeImage';
import Link from 'next/link';
import { Star, ExternalLink, ArrowUpDown, Eye, EyeOff, TrendingUp, Award, Heart, Sparkles, Plus } from 'lucide-react';
import { api } from '@/lib/api';

type Pkg = any;

export default function AdminHolidayPackages() {
  const [items, setItems] = useState<Pkg[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'bestSelling' | 'popular' | 'featured' | 'trending'>('all');

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/packages?limit=200');
      // Only show packages that have at least one "homepage" flag
      const homepage = data.items.filter((p: Pkg) => p.bestSelling || p.popular || p.featured || p.trending);
      setItems(homepage);
    } catch { /* handled silently */ }
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const toggleFlag = async (pkg: Pkg, flag: string) => {
    try {
      await api.put(`/packages/${pkg._id}`, { [flag]: !pkg[flag] });
      setItems(prev => prev.map(p => p._id === pkg._id ? { ...p, [flag]: !p[flag] } : p));
    } catch { /* handled silently */ }
  };

  const updateOrder = async (pkg: Pkg, newOrder: number) => {
    try {
      await api.put(`/packages/${pkg._id}`, { displayOrder: newOrder });
      setItems(prev => prev.map(p => p._id === pkg._id ? { ...p, displayOrder: newOrder } : p).sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)));
    } catch { /* handled silently */ }
  };

  const filtered = filter === 'all' ? items : items.filter(p => p[filter]);
  const sorted = [...filtered].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  const flagButtons = [
    { key: 'all', label: 'All', icon: Sparkles, color: 'text-slate-600' },
    { key: 'bestSelling', label: 'Best Sellers', icon: Award, color: 'text-blue-600' },
    { key: 'popular', label: 'Popular', icon: Heart, color: 'text-pink-600' },
    { key: 'featured', label: 'Featured', icon: Star, color: 'text-amber-600' },
    { key: 'trending', label: 'Trending', icon: TrendingUp, color: 'text-purple-600' }
  ] as const;

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white">Holiday Packages</h1>
          <p className="mt-1 text-sm text-slate-500">Manage packages displayed on the homepage. Toggle flags and reorder to control visibility.</p>
        </div>
        <Link href="/admin/packages" className="btn-primary px-4 py-2 text-sm shrink-0">
          <Plus size={16} /> Add Holiday Package
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="mb-4 flex flex-wrap gap-2">
        {flagButtons.map(f => (
          <button key={f.key} onClick={() => setFilter(f.key as any)}
            className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-all ${filter === f.key ? 'bg-primary text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'}`}>
            <f.icon size={14} />
            {f.label}
            <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${filter === f.key ? 'bg-white/20' : 'bg-slate-200 dark:bg-slate-700'}`}>
              {f.key === 'all' ? items.length : items.filter(p => p[f.key]).length}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card overflow-x-auto">
        {loading ? (
          <div className="p-10 text-center text-slate-500">Loading holiday packages…</div>
        ) : sorted.length === 0 ? (
          <div className="p-10 text-center text-slate-500">
            <p className="text-lg font-semibold">No holiday packages found</p>
            <p className="mt-1 text-sm">Mark packages as Best Selling, Popular, Featured, or Trending from the <Link href="/admin/packages" className="text-primary underline">Packages</Link> page.</p>
          </div>
        ) : (
          <table className="w-full min-w-[900px] text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500 dark:bg-slate-800">
              <tr>
                <th className="p-3 w-10"><ArrowUpDown size={13} /></th>
                <th className="p-3">Package</th>
                <th className="p-3">Category</th>
                <th className="p-3">Price</th>
                <th className="p-3">Duration</th>
                <th className="p-3 text-center">Best Seller</th>
                <th className="p-3 text-center">Popular</th>
                <th className="p-3 text-center">Featured</th>
                <th className="p-3 text-center">Trending</th>
                <th className="p-3 text-right">Edit</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map(p => (
                <tr key={p._id} className="border-t dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  {/* Order */}
                  <td className="p-3">
                    <input
                      type="number" min="0"
                      className="w-12 rounded-lg border border-slate-200 bg-white px-2 py-1 text-center text-xs font-bold outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-800"
                      value={p.displayOrder || 0}
                      onChange={e => updateOrder(p, +e.target.value)}
                    />
                  </td>
                  {/* Package Info */}
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded-lg">
                        {(p.thumbnail || p.images?.[0]) && <SafeImage src={p.thumbnail || p.images[0]} alt="" fill className="object-cover" />}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800 dark:text-white line-clamp-1">{p.title}</div>
                        <div className="text-xs text-slate-400">{p.destination?.name || p.city}{p.country ? `, ${p.country}` : ''}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-slate-500">{p.category?.name || p.categorySlug || '—'}</td>
                  <td className="p-3 font-semibold">₹{p.price?.toLocaleString('en-IN')}</td>
                  <td className="p-3 text-slate-500">{p.durationDays}D/{p.durationNights}N</td>
                  {/* Toggle Flags */}
                  {(['bestSelling', 'popular', 'featured', 'trending'] as const).map(flag => (
                    <td key={flag} className="p-3 text-center">
                      <button onClick={() => toggleFlag(p, flag)}
                        className={`rounded-lg p-1.5 transition-all ${p[flag] ? 'bg-primary/10 text-primary hover:bg-primary/20' : 'text-slate-300 hover:text-slate-500 hover:bg-slate-100'}`}
                        title={`Toggle ${flag}`}>
                        {p[flag] ? <Eye size={16} /> : <EyeOff size={16} />}
                      </button>
                    </td>
                  ))}
                  {/* Edit Link */}
                  <td className="p-3 text-right">
                    <Link href="/admin/packages" className="rounded-lg p-2 text-primary hover:bg-primary/10 inline-flex">
                      <ExternalLink size={15} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Stats Footer */}
      {!loading && items.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-500">
          <span>Total: <strong className="text-slate-700">{items.length}</strong></span>
          <span>Best Sellers: <strong className="text-blue-600">{items.filter(p => p.bestSelling).length}</strong></span>
          <span>Popular: <strong className="text-pink-600">{items.filter(p => p.popular).length}</strong></span>
          <span>Featured: <strong className="text-amber-600">{items.filter(p => p.featured).length}</strong></span>
          <span>Trending: <strong className="text-purple-600">{items.filter(p => p.trending).length}</strong></span>
        </div>
      )}
    </div>
  );
}
