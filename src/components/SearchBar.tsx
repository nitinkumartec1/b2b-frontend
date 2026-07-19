'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Search, MapPin, Wallet, Sparkles } from 'lucide-react';

export default function SearchBar() {
  const router = useRouter();
  const [q, setQ] = useState('');
  const [type, setType] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [theme, setTheme] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (type) params.set('type', type);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (theme) params.set('theme', theme);
    router.push(`/packages?${params.toString()}`);
  };

  return (
    <form onSubmit={submit} className="glass mx-auto grid w-full max-w-5xl gap-3 rounded-2xl p-4 shadow-premium md:grid-cols-5">
      <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2.5 md:col-span-2">
        <MapPin size={18} className="text-primary" />
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Destination or keyword" className="w-full bg-transparent text-sm outline-none" />
      </div>
      <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2.5">
        <Sparkles size={18} className="text-primary" />
        <select value={theme} onChange={e => setTheme(e.target.value)} className="w-full bg-transparent text-sm outline-none">
          <option value="">Any Theme</option>
          {['luxury','family','honeymoon','adventure','corporate','pilgrimage','weekend','cruise'].map(t => <option key={t} value={t}>{t[0].toUpperCase()+t.slice(1)}</option>)}
        </select>
      </div>
      <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2.5">
        <Wallet size={18} className="text-primary" />
        <select value={maxPrice} onChange={e => setMaxPrice(e.target.value)} className="w-full bg-transparent text-sm outline-none">
          <option value="">Budget</option>
          <option value="25000">Under ₹25k</option>
          <option value="50000">Under ₹50k</option>
          <option value="100000">Under ₹1L</option>
          <option value="200000">Under ₹2L</option>
        </select>
      </div>
      <button className="btn-primary md:col-span-5 md:mx-auto md:w-56"><Search size={18} /> Search Holidays</button>
    </form>
  );
}
