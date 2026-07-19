'use client';
import { useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
export default function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <div className="container-x py-14">
      <h1 className="text-4xl font-extrabold text-slate-800">Contact Us</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <p className="text-slate-600">Have a question or need partner support? Our team is here to help 24/7.</p>
          <div className="flex items-center gap-3 text-slate-600"><Mail className="text-primary" /> info@theb2bholidays.com</div>
          <div className="flex items-center gap-3 text-slate-600"><Phone className="text-primary" /> +91 97165 51594</div>
          <div className="flex items-center gap-3 text-slate-600"><MapPin className="text-primary" /> New Delhi, India</div>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="card space-y-4 p-6">
          {sent && <div className="rounded-xl bg-secondary/10 px-4 py-2 text-sm text-secondary">Thanks! We&apos;ll get back to you shortly.</div>}
          <input required placeholder="Your Name" className="w-full rounded-xl border px-4 py-3 text-sm" />
          <input required type="email" placeholder="Email" className="w-full rounded-xl border px-4 py-3 text-sm" />
          <textarea required placeholder="Message" rows={4} className="w-full rounded-xl border px-4 py-3 text-sm" />
          <button className="btn-primary w-full">Send Message</button>
        </form>
      </div>
    </div>
  );
}
