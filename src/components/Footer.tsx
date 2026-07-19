import Link from 'next/link';
import { Plane, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 bg-primary-dark text-white/90">
      <div className="container-x grid gap-10 py-14 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 text-xl font-extrabold text-white">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-secondary"><Plane size={18} /></span>
            THE B2B HOLIDAYS
          </div>
          <p className="mt-4 text-sm text-white/70">India&apos;s premium B2B travel booking platform for agents and partners. Curated holidays, instant vouchers and unbeatable trade rates.</p>
        </div>
        <div>
          <h4 className="mb-4 font-semibold text-white">Company</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/blogs">Blogs</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-4 font-semibold text-white">Explore</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link href="/packages">Packages</Link></li>
            <li><Link href="/destinations">Destinations</Link></li>
            <li><Link href="/packages?fixedDeparture=true">Fixed Departures</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-4 font-semibold text-white">Get in touch</h4>
          <ul className="space-y-3 text-sm text-white/70">
            <li className="flex items-center gap-2"><Mail size={16} /> info@theb2bholidays.com</li>
            <li className="flex items-center gap-2"><Phone size={16} /> +91 97165 51594</li>
            <li className="flex items-center gap-2"><MapPin size={16} /> New Delhi, India</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-sm text-white/60">
        © {new Date().getFullYear()} THE B2B HOLIDAYS. All rights reserved.
      </div>
    </footer>
  );
}
