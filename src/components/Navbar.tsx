'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, X, Plane, ChevronDown, Phone } from 'lucide-react';
import { useAuth } from '@/lib/auth';

const links = [
  { label: 'Home', href: '/' },
  { label: 'Destinations', href: '/destinations' },
  { label: 'Packages', href: '/packages' },
  { label: 'Fixed Departure', href: '/packages?fixedDeparture=true' },
  { label: 'Group Tours', href: '/packages?theme=corporate' },
  { label: 'Blogs', href: '/blogs' },
  { label: 'Admin Login', href: '/login' }
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();

  const isActive = (href: string) => {
    const baseHref = href.split('?')[0];
    if (baseHref === '/') return pathname === '/';
    return pathname.startsWith(baseHref);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-all ${scrolled ? 'glass shadow-premium' : 'bg-white'}`}>
      <nav className="container-x flex items-center justify-between py-3">
        <Link href="/" className="flex items-center gap-2 font-extrabold text-primary text-xl">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-white"><Plane size={18} /></span>
          THE B2B <span className="text-secondary">HOLIDAYS</span>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-700">
          {links.slice(0, 3).map(l => (
            <Link key={l.label} href={l.href} className={`transition font-semibold ${isActive(l.href) ? 'text-primary border-b-2 border-primary py-4' : 'hover:text-primary py-4 border-b-2 border-transparent'}`}>{l.label}</Link>
          ))}

          <div className="relative group py-4 -my-4">
            <button className="flex items-center gap-1 hover:text-primary transition font-semibold">
              More <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
            </button>
            <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-slate-100 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 flex flex-col overflow-hidden z-50">
              {links.slice(3).map(l => (
                <Link key={l.label} href={l.href} className={`px-5 py-3 hover:bg-slate-50 transition text-sm ${isActive(l.href) ? 'text-primary font-bold bg-blue-50/50' : 'hover:text-primary text-slate-700'}`}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-4">
          {!user || user.role !== 'admin' ? (
            <Link href="/enquiry" className="btn-primary py-2 px-5 text-sm rounded-xl font-bold shadow-sm hover:shadow-md transition-all">Send Enquiry</Link>
          ) : null}
          <a href="tel:9716551594" className="flex items-center gap-1.5 text-sm font-extrabold text-slate-700 hover:text-primary transition">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-slate-100 text-primary"><Phone size={14} /></span>
            9716551594
          </a>
          {user && (
            <>
              {user.role === 'admin' && (
                <Link href="/admin" className="btn-outline py-2 px-4 text-sm">Admin Panel</Link>
              )}
              <button onClick={logout} className="btn-outline py-2 px-4 text-sm">Logout</button>
            </>
          )}
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      </nav>

      {open && (
        <div className="md:hidden border-t bg-white px-4 py-3 space-y-2">
          {links.map(l => (
            <Link key={l.label} href={l.href} className={`block py-2 ${isActive(l.href) ? 'text-primary font-bold' : 'text-slate-700'}`} onClick={() => setOpen(false)}>{l.label}</Link>
          ))}
          {!user || user.role !== 'admin' ? (
            <div className="pt-2 flex flex-col gap-2">
              <Link href="/enquiry" className="btn-primary block w-full text-center py-2.5 text-sm font-bold rounded-xl" onClick={() => setOpen(false)}>Send Enquiry</Link>
              <a href="tel:9716551594" className="flex items-center justify-center gap-2 py-2.5 text-sm font-extrabold text-slate-700 bg-slate-50 rounded-xl border border-slate-100">
                <Phone size={16} className="text-primary" /> 9716551594
              </a>
            </div>
          ) : null}
          {user && (
            <div className="flex gap-2 pt-2">
              {user.role === 'admin' && (
                <Link href="/admin" className="btn-outline flex-1 py-2 text-sm" onClick={() => setOpen(false)}>Admin Panel</Link>
              )}
              <button onClick={() => { logout(); setOpen(false); }} className="btn-outline flex-1 py-2 text-sm">Logout</button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
