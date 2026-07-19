'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import SafeImage from '@/components/SafeImage';
import { motion } from 'framer-motion';
import { Star, MapPin, Calendar, CloudSun, Compass, Lightbulb, HelpCircle, ChevronDown, Map as MapIcon } from 'lucide-react';
import { api } from '@/lib/api';
import PackageCard from '@/components/PackageCard';
import DestinationCard from '@/components/DestinationCard';
import EnquiryForm from '@/components/EnquiryForm';

export default function DestinationDetail() {
  const { slug } = useParams();
  const [data, setData] = useState<any>(null);
  const [gi, setGi] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => { api.get(`/destinations/${slug}`).then(r => setData(r.data)).catch(() => {}); }, [slug]);
  if (!data) return <div className="container-x py-20 text-center">Loading…</div>;
  const d = data.destination;

  return (
    <div>
      {/* HERO BANNER */}
      <section className="relative h-[60vh] min-h-[420px] overflow-hidden">
        <SafeImage src={d.banner || d.image} alt={d.name} fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />
        <div className="container-x absolute inset-x-0 bottom-0 pb-10 text-white">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 text-sm text-white/80"><MapPin size={16} />{d.country}</div>
            <h1 className="mt-1 text-4xl font-extrabold md:text-6xl">{d.name}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
              <span className="flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 backdrop-blur"><Star size={14} className="fill-accent text-accent" />{d.rating?.toFixed(1)} ({d.reviewCount})</span>
              <span className="rounded-full bg-secondary/90 px-3 py-1 font-semibold">{d.tourCount} tours available</span>
              <span className="rounded-full bg-accent/90 px-3 py-1 font-semibold text-slate-900">from ₹{d.startingPrice?.toLocaleString('en-IN')}</span>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container-x grid gap-10 py-12 lg:grid-cols-3">
        <div className="space-y-12 lg:col-span-2">
          {/* OVERVIEW */}
          <Section title="Overview" icon={Compass}><p className="leading-relaxed text-slate-600 dark:text-slate-300">{d.overview}</p></Section>

          {/* GALLERY */}
          <Section title="Image Gallery" icon={MapIcon}>
            <div className="relative h-80 overflow-hidden rounded-2xl"><SafeImage src={d.gallery?.[gi] || d.image} alt="" fill className="object-cover" /></div>
            <div className="mt-3 grid grid-cols-5 gap-2">
              {(d.gallery || []).slice(0, 5).map((im: string, i: number) => (
                <button key={i} onClick={() => setGi(i)} className={`relative h-16 overflow-hidden rounded-lg ${gi === i ? 'ring-2 ring-primary' : ''}`}><SafeImage src={im} alt="" fill className="object-cover" /></button>
              ))}
            </div>
          </Section>

          {/* BEST TIME + WEATHER */}
          <Section title="Best Time to Visit" icon={Calendar}>
            <p className="mb-4 text-slate-600 dark:text-slate-300">Recommended season: <span className="font-semibold text-primary">{d.bestTimeToVisit}</span></p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {(d.weather || []).map((w: any, i: number) => (
                <div key={i} className="card p-4 text-center"><CloudSun className="mx-auto text-accent" /><div className="mt-2 font-bold text-slate-800 dark:text-white">{w.month}</div><div className="text-sm text-primary">{w.temp}</div><div className="mt-1 text-xs text-slate-500">{w.note}</div></div>
              ))}
            </div>
          </Section>

          {/* TOP ATTRACTIONS */}
          <Section title="Top Attractions" icon={Star}>
            <div className="grid gap-4 sm:grid-cols-2">
              {(d.topAttractions || []).map((a: any, i: number) => (
                <div key={i} className="card overflow-hidden"><div className="relative h-36"><SafeImage src={a.image} alt={a.name} fill className="object-cover" /></div><div className="p-3"><div className="font-bold text-slate-800 dark:text-white">{a.name}</div><p className="mt-1 text-xs text-slate-500">{a.description}</p></div></div>
              ))}
            </div>
          </Section>

          {/* THINGS TO DO + TIPS */}
          <div className="grid gap-8 sm:grid-cols-2">
            <Section title="Things To Do" icon={Compass}><ul className="space-y-2">{(d.thingsToDo || []).map((t: string, i: number) => <li key={i} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300"><span className="h-1.5 w-1.5 rounded-full bg-secondary" />{t}</li>)}</ul></Section>
            <Section title="Travel Tips" icon={Lightbulb}><ul className="space-y-2">{(d.travelTips || []).map((t: string, i: number) => <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300"><Lightbulb size={14} className="mt-0.5 text-accent" />{t}</li>)}</ul></Section>
          </div>

          {/* MAP */}
          <Section title="Location Map" icon={MapIcon}>
            <iframe title="map" className="h-72 w-full rounded-2xl border-0" loading="lazy" src={`https://maps.google.com/maps?q=${encodeURIComponent(d.mapEmbed || d.name)}&output=embed`} />
          </Section>

          {/* FAQs */}
          <Section title="Frequently Asked Questions" icon={HelpCircle}>
            <div className="space-y-2">
              {(d.faqs || []).map((f: any, i: number) => (
                <div key={i} className="card overflow-hidden">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="flex w-full items-center justify-between p-4 text-left font-semibold text-slate-800 dark:text-white"><span>{f.question}</span><ChevronDown className={`transition ${openFaq === i ? 'rotate-180 text-primary' : ''}`} size={18} /></button>
                  {openFaq === i && <p className="px-4 pb-4 text-sm text-slate-600 dark:text-slate-300">{f.answer}</p>}
                </div>
              ))}
            </div>
          </Section>
        </div>

        {/* SIDEBAR: available packages & enquiry */}
        <aside className="space-y-6 sticky top-24 h-fit">
          <EnquiryForm destinationName={d.name} />
          
          <div className="card p-5">
            <h3 className="mb-4 font-extrabold text-slate-800 dark:text-white">Available Holiday Packages</h3>
            <div className="space-y-4">
              {data.packages.length ? data.packages.slice(0, 4).map((p: any) => <PackageCard key={p._id} pkg={p} />) : <p className="text-sm text-slate-500">No packages yet for this destination.</p>}
            </div>
          </div>
        </aside>
      </div>

      {/* REVIEWS */}
      {data.reviews?.length > 0 && (
        <section className="bg-slate-50 py-14 dark:bg-slate-900/40">
          <div className="container-x">
            <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white">Customer Reviews</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {data.reviews.map((r: any) => (
                <div key={r._id} className="card p-5"><div className="flex items-center justify-between"><span className="font-bold text-slate-800 dark:text-white">{r.name}</span><span className="flex gap-0.5">{Array.from({ length: r.rating }).map((_, i) => <Star key={i} size={14} className="fill-accent text-accent" />)}</span></div><p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{r.comment}</p></div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* RELATED DESTINATIONS */}
      {data.related?.length > 0 && (
        <section className="container-x py-14">
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white">Related Destinations</h2>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">{data.related.map((rd: any, i: number) => <DestinationCard key={rd._id} dest={rd} index={i} />)}</div>
        </section>
      )}
    </div>
  );
}

function Section({ title, icon: Icon, children }: any) {
  return (
    <motion.section initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
      <h2 className="mb-4 flex items-center gap-2 text-2xl font-extrabold text-slate-800 dark:text-white"><Icon className="text-primary" size={22} />{title}</h2>
      {children}
    </motion.section>
  );
}
