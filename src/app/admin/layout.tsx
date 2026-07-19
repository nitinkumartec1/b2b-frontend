'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, MapPinned, Package, Tags, ArrowLeft, Mail, Palmtree } from 'lucide-react';
import { useAuth } from '@/lib/auth';

const nav = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/enquiries', label: 'Enquiries', icon: Mail },
  { href: '/admin/destinations', label: 'Destinations', icon: MapPinned },
  { href: '/admin/packages', label: 'Packages', icon: Package },
  { href: '/admin/holiday-packages', label: 'Holiday Packages', icon: Palmtree },
  { href: '/admin/categories', label: 'Categories', icon: Tags }
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const path = usePathname();
  useEffect(() => { if (!loading && (!user || user.role !== 'admin')) router.push('/login'); }, [loading, user, router]);
  if (!user || user.role !== 'admin') return <div className="container-x py-20 text-center">Checking admin access…</div>;

  return (
    <div className="container-x grid gap-6 py-8 lg:grid-cols-5">
      <aside className="card h-fit p-4 lg:col-span-1">
        <div className="mb-4 border-b pb-3 font-extrabold text-primary dark:border-slate-800">Admin Panel</div>
        {nav.map(n => (
          <Link key={n.href} href={n.href} className={`mb-1 flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium ${path === n.href ? 'bg-primary text-white' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'}`}><n.icon size={16} />{n.label}</Link>
        ))}
        <Link href="/" className="mt-2 flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-400 hover:text-primary"><ArrowLeft size={16} /> Back to app</Link>
      </aside>
      <div className="lg:col-span-4">{children}</div>
    </div>
  );
}
