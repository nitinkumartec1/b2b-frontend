'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import SafeImage from '@/components/SafeImage';
import { motion } from 'framer-motion';
import { ShieldCheck, Headphones, Wallet, ArrowRight, Quote, Star, Mail, Send, CheckCircle2 } from 'lucide-react';
import { api } from '@/lib/api';
import TourSlider from '@/components/TourSlider';
import CategoryCard from '@/components/CategoryCard';
import { SkeletonGrid } from '@/components/Skeletons';
import Hero from '@/components/Hero/Hero';
import SearchContainer from '@/components/Hero/SearchContainer';
import PreviewCards from '@/components/Hero/PreviewCards';
import PopularDestinations from '@/components/PopularDestinations/PopularDestinations';
import HolidayPackages from '@/components/HolidayPackages/HolidayPackages';

const testimonials = [
  { name: 'Rahul Mehta', agency: 'Wanderlust Tours', text: 'THE B2B HOLIDAYS transformed our margins. Instant vouchers and the best trade rates in the market.', dest: 'Maldives', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150' },
  { name: 'Priya Sharma', agency: 'Blue Sky Travels', text: 'The wallet and credit system makes bookings effortless. My clients love the curated packages.', dest: 'Dubai', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150' },
  { name: 'Arjun Nair', agency: 'Coastal Holidays', text: 'Support is phenomenal and the admin panel gives me full control over every booking.', dest: 'Switzerland', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150' },
  { name: 'Sneha Patel', agency: 'Dream Getaways', text: 'The fixed departure deals are incredibly competitive. Highly recommended for agents.', dest: 'Bali', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150' }
];

export default function Home() {
  const [destinations, setDestinations] = useState<any[]>([]);
  const [bestSellers, setBestSellers] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [trending, setTrending] = useState<any[]>([]);
  const [fixedDeps, setFixedDeps] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    api.get('/homepage').then(r => {
      setDestinations(r.data.destinations || []);
      setBestSellers(r.data.bestSellers || []);
      setCategories(r.data.categories || []);
      setTrending(r.data.trending || []);
      setFixedDeps(r.data.fixedDeps || []);
      setBlogs(r.data.blogs || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white dark:bg-slate-950">
      <Hero />
      <div className="px-4 md:px-6">
        <SearchContainer />
      </div>
      <PreviewCards />

      {/* 3. POPULAR DESTINATIONS */}
      <PopularDestinations destinations={destinations} loading={loading} />

      {/* 4. BEST SELLING TOURS (Now Holiday Packages) */}
      <HolidayPackages packages={bestSellers} loading={loading} />

      {/* 5. HOLIDAY PACKAGE CATEGORIES */}
      <section className="container-x py-24">
        <SectionHead title="Holiday Packages" subtitle="Browse by the experience your travelers are dreaming of" href="/packages" />
        {loading ? <SkeletonGrid count={8} /> : (
          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {categories.slice(0, 8).map((c, i) => (
               <motion.div key={c._id} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                 <CategoryCard cat={c} index={i} />
               </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* 6. WHY CHOOSE B2BHOLIDAYS */}
      <section className="bg-primary py-24 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-secondary opacity-20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-accent opacity-10 rounded-full blur-3xl"></div>
        <div className="container-x relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl font-extrabold tracking-tight">Why Choose THE B2B HOLIDAYS</h2>
            <p className="mt-4 text-white/80">Partner with India&apos;s most trusted B2B platform, designed exclusively for travel agents to maximize profits and deliver exceptional experiences.</p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: ShieldCheck, t: 'Trusted B2B Network', d: 'Join 12,000+ verified travel agents nationwide.' },
              { icon: Wallet, t: 'Best Price Guarantee', d: 'Exclusive net rates maximizing your margins.' },
              { icon: Headphones, t: '24×7 Support', d: 'Dedicated partner support for on-trip queries.' },
              { icon: Star, t: 'Verified Hotels', d: 'Handpicked properties with strict quality checks.' },
              { icon: ShieldCheck, t: 'Secure Payments', d: 'Wallet, Credit Line and encrypted transactions.' },
              { icon: CheckCircle2, t: 'Instant Confirmation', d: 'Generate vouchers instantly for your clients.' }
            ].map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="group relative bg-white/5 backdrop-blur-lg border border-white/10 hover:bg-white/10 transition-all rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-2">
                <div className="h-16 w-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                  <f.icon className="text-accent" size={32} />
                </div>
                <h3 className="text-xl font-bold">{f.t}</h3>
                <p className="mt-3 text-white/70 leading-relaxed">{f.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>



      {/* 9. TESTIMONIALS */}
      <section className="container-x py-24 relative overflow-hidden">
        <h2 className="text-center text-4xl font-extrabold text-slate-900 dark:text-white">Partner Testimonials</h2>
        <p className="text-center mt-3 text-slate-500 max-w-2xl mx-auto">Hear from our network of successful travel partners growing their businesses with THE B2B HOLIDAYS.</p>
        
        <div className="mt-16 max-w-4xl mx-auto relative min-h-[300px]">
          {testimonials.map((t, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, x: 50 }} 
              animate={{ opacity: activeTestimonial === i ? 1 : 0, x: activeTestimonial === i ? 0 : (activeTestimonial > i ? -50 : 50), zIndex: activeTestimonial === i ? 10 : 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className={`absolute top-0 left-0 w-full glass rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center gap-8 ${activeTestimonial !== i ? 'pointer-events-none' : ''}`}
            >
              <div className="shrink-0 relative">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <SafeImage src={t.image} alt={t.name} width={128} height={128} className="object-cover w-full h-full" />
                </div>
                <div className="absolute -bottom-3 -right-3 bg-accent text-white p-2 rounded-full shadow-md">
                  <Quote size={20} className="fill-white" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1 text-accent mb-4">
                  {Array.from({ length: 5 }).map((_, k) => <Star key={k} size={18} className="fill-accent" />)}
                </div>
                <p className="text-xl md:text-2xl font-medium text-slate-700 dark:text-slate-200 leading-relaxed italic">&quot;{t.text}&quot;</p>
                <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between border-t border-slate-200 dark:border-slate-700 pt-4">
                  <div>
                    <h4 className="font-bold text-lg text-primary">{t.name}</h4>
                    <p className="text-slate-500 text-sm">{t.agency}</p>
                  </div>
                  <div className="mt-2 sm:mt-0 text-sm bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full text-slate-600 dark:text-slate-300 font-medium">
                    Visited {t.dest}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 flex gap-3">
             {testimonials.map((_, i) => (
               <button key={i} onClick={() => setActiveTestimonial(i)} className={`w-3 h-3 rounded-full transition-all ${activeTestimonial === i ? 'bg-primary scale-125' : 'bg-slate-300'}`} aria-label={`Go to testimonial ${i + 1}`} />
             ))}
          </div>
        </div>
      </section>

      {/* 10. TRAVEL BLOGS */}
      {blogs.length > 0 && (
        <section className="bg-slate-50 py-24 dark:bg-slate-900/40">
          <div className="container-x">
            <SectionHead title="Travel Blogs & Guides" subtitle="Insights, tips, and the latest trends in the travel industry" href="/blogs" />
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
              {blogs.map((b, i) => (
                <motion.div key={b._id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-100 dark:border-slate-800 flex flex-col h-full">
                  <div className="relative h-60 overflow-hidden shrink-0">
                    <SafeImage src={b.cover} alt={b.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">{b.category}</div>
                  </div>
                  <div className="p-8 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-primary transition-colors line-clamp-2">{b.title}</h3>
                    <p className="text-slate-500 line-clamp-3 mb-6 flex-grow">{b.excerpt}</p>
                    <Link href={`/blogs/${b.slug}`} className="inline-flex items-center gap-2 font-bold text-primary group-hover:text-secondary transition-colors mt-auto">
                      Read More <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 11. NEWSLETTER */}
      <section className="container-x py-24">
        <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl">
          <div className="absolute inset-0">
            <SafeImage src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80" alt="Newsletter Background" fill className="object-cover" />
            <div className="absolute inset-0 bg-primary/90 mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-transparent" />
          </div>
          <div className="relative z-10 p-12 md:p-20 lg:w-2/3">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-md">
              <Mail className="text-white" size={32} />
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-sm">Exclusive Deals In Your Inbox</h2>
            <p className="text-lg text-white/80 mb-10 max-w-xl">Subscribe to our agent newsletter for the latest B2B rates, fixed departures, and new destinations before anyone else.</p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-xl" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Enter your email address" className="flex-1 px-6 py-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-accent transition-all" required />
              <button type="submit" className="px-8 py-4 bg-accent hover:bg-accent/90 text-primary font-extrabold rounded-full transition-all flex items-center justify-center gap-2 hover:scale-105 hover:shadow-lg">
                Subscribe <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionHead({ title, subtitle, href }: { title: string; subtitle: string; href: string }) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div className="max-w-2xl">
        <motion.h2 initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">{title}</motion.h2>
        <motion.p initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="mt-3 text-lg text-slate-500 dark:text-slate-400">{subtitle}</motion.p>
      </div>
      <Link href={href} className="inline-flex items-center gap-2 font-bold text-primary bg-primary/5 hover:bg-primary/10 px-5 py-2.5 rounded-full transition-all hover:scale-105 shrink-0 self-start md:self-auto">
        View all <ArrowRight size={18} />
      </Link>
    </div>
  );
}
