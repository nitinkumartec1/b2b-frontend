'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import SafeImage from '@/components/SafeImage';
import { api } from '@/lib/api';

export default function Blogs() {
  const [blogs, setBlogs] = useState<any[]>([]);
  useEffect(() => { api.get('/blogs').then(r => setBlogs(r.data.items)); }, []);
  return (
    <div className="container-x py-10">
      <h1 className="text-3xl font-extrabold text-slate-800">Travel Blogs</h1>
      <p className="mt-1 text-slate-500">Insights, guides and tips for travel partners</p>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {blogs.map(b => (
          <Link key={b._id} href={`/blogs/${b.slug}`} className="card group overflow-hidden">
            <div className="relative h-48"><SafeImage src={b.cover} alt={b.title} fill className="object-cover transition group-hover:scale-105" sizes="33vw" /></div>
            <div className="p-4"><span className="text-xs font-semibold text-secondary">{b.category}</span><h3 className="mt-1 font-bold text-slate-800 group-hover:text-primary">{b.title}</h3><p className="mt-1 line-clamp-2 text-sm text-slate-500">{b.excerpt}</p><span className="mt-2 block text-xs text-slate-400">By {b.author}</span></div>
          </Link>
        ))}
      </div>
    </div>
  );
}
