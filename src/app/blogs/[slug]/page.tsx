'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import SafeImage from '@/components/SafeImage';
import { api } from '@/lib/api';

export default function BlogDetail() {
  const { slug } = useParams();
  const [blog, setBlog] = useState<any>(null);
  useEffect(() => { api.get(`/blogs/${slug}`).then(r => setBlog(r.data.blog)); }, [slug]);
  if (!blog) return <div className="container-x py-20 text-center">Loading…</div>;
  return (
    <article className="container-x max-w-3xl py-10">
      <span className="text-sm font-semibold text-secondary">{blog.category}</span>
      <h1 className="mt-2 text-4xl font-extrabold text-slate-800">{blog.title}</h1>
      <p className="mt-2 text-slate-500">By {blog.author}</p>
      <div className="relative mt-6 h-80 overflow-hidden rounded-xl"><SafeImage src={blog.cover} alt={blog.title} fill className="object-cover" /></div>
      <p className="mt-6 text-lg text-slate-600">{blog.excerpt}</p>
      <div className="mt-4 whitespace-pre-line text-slate-600">{blog.content}</div>
    </article>
  );
}
