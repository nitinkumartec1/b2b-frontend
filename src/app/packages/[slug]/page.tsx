'use client';
import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import SafeImage from '@/components/SafeImage';
import { motion } from 'framer-motion';
import { Star, Clock, MapPin, Check, X, Share2, Hotel, Utensils, Plane, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { api } from '@/lib/api';
import PackageCard from '@/components/PackageCard';
import EnquiryForm from '@/components/EnquiryForm';


export default function PackageDetail() {
  const { slug } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [pkg, setPkg] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [active, setActive] = useState(0);
  const [tab, setTab] = useState('overview');

  useEffect(() => {
    api.get(`/packages/${slug}`).then(r => { setPkg(r.data.package); setRelated(r.data.related); });
  }, [slug]);

  if (!pkg) return <div className="container-x py-20 text-center">Loading…</div>;
  
  // Resolve the gallery strictly from the API payload
  const resolvedGallery = (pkg.gallery && pkg.gallery.length > 0) 
    ? pkg.gallery 
    : (pkg.images && pkg.images.length > 0 ? pkg.images : []);

  const heroImage = resolvedGallery[0] || pkg.thumbnail || pkg.coverImage || pkg.destination?.heroImage || pkg.destination?.image;

  const tabs = ['overview','itinerary','inclusions','reviews'];

  return (
    <div className="container-x py-8">
      {/* Gallery */}
      <div className="grid gap-3 md:grid-cols-4">
        <div className="relative col-span-4 h-80 overflow-hidden rounded-xl md:col-span-3 md:h-[420px]">
          <SafeImage src={resolvedGallery[active] || heroImage} alt={pkg.title} fill className="object-cover" />
        </div>
        {resolvedGallery.length > 1 && (
          <div className="col-span-4 grid grid-cols-4 gap-3 md:col-span-1 md:grid-cols-1">
            {resolvedGallery.slice(0, 4).map((im: string, i: number) => (
              <button key={i} onClick={() => setActive(i)} className={`relative h-20 overflow-hidden rounded-lg md:h-24 ${active===i?'ring-2 ring-primary':''}`}>
                <SafeImage src={im} alt="" fill className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1 rounded-full bg-secondary/10 px-3 py-1 text-sm font-semibold text-secondary"><Star size={14} className="fill-secondary" />{pkg.rating?.toFixed(1)} ({pkg.reviewCount})</span>
            <span className="flex items-center gap-1 text-sm text-slate-500"><MapPin size={14} />{pkg.city}, {pkg.country}</span>
            <span className="flex items-center gap-1 text-sm text-slate-500"><Clock size={14} />{pkg.durationNights}N / {pkg.durationDays}D</span>
            <span className="flex items-center gap-1 text-sm text-slate-500"><Hotel size={14} />{pkg.hotelRating}★ Hotels</span>
          </div>
          <h1 className="mt-3 text-3xl font-extrabold text-slate-800">{pkg.title}</h1>
          <div className="mt-2 flex gap-3">
            <button className="btn-outline py-2 px-4 text-sm"><Share2 size={16} /> Share</button>
          </div>

          {/* Tabs */}
          <div className="mt-6 flex gap-2 border-b">
            {tabs.map(t => (
              <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm font-semibold capitalize ${tab===t?'border-b-2 border-primary text-primary':'text-slate-500'}`}>{t}</button>
            ))}
          </div>

          <div className="mt-6">
            {tab === 'overview' && (
              <div>
                <p className="text-slate-600">{pkg.description}</p>
                <h3 className="mt-6 font-bold text-slate-800">Highlights</h3>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {pkg.highlights.map((h: string) => <div key={h} className="flex items-center gap-2 text-sm text-slate-600"><Check size={16} className="text-secondary" />{h}</div>)}
                </div>
                <div className="mt-6 flex flex-wrap gap-4 text-sm text-slate-600">
                  <span className="flex items-center gap-1"><Utensils size={16} className="text-primary" />{pkg.meals}</span>
                  <span className="flex items-center gap-1"><Plane size={16} className="text-primary" />{pkg.transport}</span>
                  {pkg.visaIncluded && <span className="flex items-center gap-1"><ShieldCheck size={16} className="text-primary" />Visa Assistance</span>}
                </div>
              </div>
            )}
            {tab === 'itinerary' && (
              <div className="space-y-4">
                {pkg.itinerary.map((d: any) => (
                  <div key={d.day} className="card p-4">
                    <div className="font-bold text-primary">{d.title}</div>
                    <p className="mt-1 text-sm text-slate-600">{d.description}</p>
                  </div>
                ))}
              </div>
            )}
            {tab === 'inclusions' && (
              <div className="grid gap-6 sm:grid-cols-2">
                <div><h3 className="mb-2 font-bold text-secondary">Inclusions</h3>{pkg.inclusions.map((i: string) => <div key={i} className="flex items-center gap-2 py-1 text-sm text-slate-600"><Check size={16} className="text-secondary" />{i}</div>)}</div>
                <div><h3 className="mb-2 font-bold text-red-500">Exclusions</h3>{pkg.exclusions.map((i: string) => <div key={i} className="flex items-center gap-2 py-1 text-sm text-slate-600"><X size={16} className="text-red-400" />{i}</div>)}</div>
                <div className="sm:col-span-2"><h3 className="mb-2 font-bold text-slate-800">Cancellation Policy</h3><p className="text-sm text-slate-600">{pkg.cancellationPolicy}</p></div>
              </div>
            )}
            {tab === 'reviews' && <ReviewsBlock packageId={pkg._id} />}
          </div>
        </div>

        {/* Enquiry Form Widget */}
        <div className="lg:col-span-1 sticky top-24 h-fit">
          <EnquiryForm 
            packageName={pkg.title} 
            destinationName={pkg.destination?.name || pkg.city || ''} 
            packageId={pkg._id} 
          />
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-extrabold text-slate-800">Related Packages</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{related.map(p => <PackageCard key={p._id} pkg={p} />)}</div>
        </section>
      )}
    </div>
  );
}

function ReviewsBlock({ packageId }: { packageId: string }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<any[]>([]);
  const [form, setForm] = useState({ rating: 5, comment: '' });
  const load = useCallback(() => api.get(`/reviews/${packageId}`).then(r => setReviews(r.data.items)), [packageId]);
  useEffect(() => { load(); }, [load]);
  const submit = async () => { await api.post(`/reviews/${packageId}`, form); setForm({ rating: 5, comment: '' }); load(); };
  return (
    <div>
      {user && (
        <div className="card mb-6 p-4">
          <div className="flex gap-1">{Array.from({length:5}).map((_,i)=><button key={i} onClick={()=>setForm(f=>({...f,rating:i+1}))}><Star size={20} className={i<form.rating?'fill-accent text-accent':'text-slate-300'} /></button>)}</div>
          <textarea value={form.comment} onChange={e=>setForm(f=>({...f,comment:e.target.value}))} placeholder="Share your experience" className="mt-3 w-full rounded-xl border px-3 py-2 text-sm" />
          <button onClick={submit} className="btn-primary mt-2 py-2 px-4 text-sm">Post Review</button>
        </div>
      )}
      {reviews.length ? reviews.map(r => (
        <div key={r._id} className="card mb-3 p-4">
          <div className="flex items-center justify-between"><span className="font-bold text-slate-800">{r.name}</span><span className="flex gap-0.5">{Array.from({length:r.rating}).map((_,i)=><Star key={i} size={14} className="fill-accent text-accent" />)}</span></div>
          <p className="mt-1 text-sm text-slate-600">{r.comment}</p>
        </div>
      )) : <p className="text-slate-500">No reviews yet. Be the first!</p>}
    </div>
  );
}
