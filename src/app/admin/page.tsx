'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  useEffect(() => { api.get('/admin/stats').then(r => setStats(r.data)).catch(() => {}); }, []);
  if (!stats) return <div className="card p-10 text-center text-slate-500">Loading…</div>;
  const s = stats.stats;
  const cards = [['Bookings', s.bookings], ['Packages', s.packages], ['Users', s.users], ['Agents', s.agents]];
  return (
    <div>
      <h1 className="mb-6 text-2xl font-extrabold text-slate-800 dark:text-white">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {cards.map(([l, v]) => <div key={l} className="card p-5"><div className="text-sm text-slate-500">{l}</div><div className="mt-1 text-2xl font-extrabold text-primary">{v}</div></div>)}
      </div>
      <h2 className="mb-3 mt-8 font-bold text-slate-800 dark:text-white">Recent Bookings</h2>
      <div className="space-y-2">{stats.recentBookings.map((b: any) => <div key={b._id} className="card flex items-center justify-between p-3 text-sm"><span>{b.package?.title} · {b.user?.name}</span></div>)}</div>
    </div>
  );
}
