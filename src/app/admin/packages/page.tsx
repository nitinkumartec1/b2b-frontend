'use client';
import { useEffect, useState } from 'react';
import SafeImage from '@/components/SafeImage';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { api } from '@/lib/api';
import AdminModal, { Field, inputCls, TabBar, ArrayField, ItineraryBuilder } from '@/components/admin/AdminModal';

const blank: any = {
  title: '', slug: '', country: '', city: '', type: 'domestic',
  categorySlug: '', category: '', destination: '',
  theme: [], tags: [],
  price: 0, discountPrice: 0,
  durationDays: 5, durationNights: 4, hotelRating: 4,
  mealPlan: 'Breakfast', meals: '', transport: '',
  flightIncluded: false, visaIncluded: false, fixedDeparture: false,
  featured: false, popular: false, bestSelling: true, trending: false,
  displayOrder: 0, rating: 0, reviewCount: 0,
  summary: '', description: '', cancellationPolicy: '',
  highlights: [], itinerary: [], inclusions: [], exclusions: [], terms: [],
  thumbnail: '', coverImage: '', gallery: [], images: [], video: '',
  availableDates: [],
  seo: { metaTitle: '', metaDescription: '', keywords: [] }
};
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export default function AdminPackages() {
  const [items, setItems] = useState<any[]>([]);
  const [cats, setCats] = useState<any[]>([]);
  const [dests, setDests] = useState<any[]>([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>(blank);
  const [tab, setTab] = useState(0);
  const [imagesStr, setImagesStr] = useState('');
  const [galleryStr, setGalleryStr] = useState('');
  const [datesStr, setDatesStr] = useState('');

  const load = () => api.get('/packages?limit=100').then(r => setItems(r.data.items));
  useEffect(() => { load(); api.get('/categories').then(r => setCats(r.data.items)); api.get('/destinations?limit=100').then(r => setDests(r.data.items)); }, []);

  const openNew = () => { setEditing(null); setForm(blank); setImagesStr(''); setGalleryStr(''); setDatesStr(''); setTab(0); setModal(true); };
  const openEdit = (p: any) => {
    setEditing(p);
    setForm({
      ...blank, ...p,
      seo: p.seo || blank.seo,
      destination: p.destination?._id || p.destination || '',
      highlights: p.highlights || [],
      itinerary: p.itinerary || [],
      inclusions: p.inclusions || [],
      exclusions: p.exclusions || [],
      terms: p.terms || [],
      theme: p.theme || [],
      tags: p.tags || [],
      gallery: p.gallery || [],
      images: p.images || [],
      availableDates: p.availableDates || []
    });
    setImagesStr((p.images || []).join('\n'));
    setGalleryStr((p.gallery || []).join('\n'));
    setDatesStr((p.availableDates || []).map((d: string) => d.split('T')[0]).join(', '));
    setTab(0);
    setModal(true);
  };
  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));

  const save = async () => {
    const payload = {
      ...form,
      slug: form.slug || slugify(form.title),
      images: imagesStr.split('\n').map((s: string) => s.trim()).filter(Boolean),
      gallery: galleryStr.split('\n').map((s: string) => s.trim()).filter(Boolean),
      theme: Array.isArray(form.theme) ? form.theme : String(form.theme).split(',').map((s: string) => s.trim()).filter(Boolean),
      tags: Array.isArray(form.tags) ? form.tags : String(form.tags).split(',').map((s: string) => s.trim()).filter(Boolean),
      availableDates: datesStr.split(',').map((s: string) => s.trim()).filter(Boolean).map((s: string) => new Date(s)),
      seo: {
        ...form.seo,
        keywords: Array.isArray(form.seo?.keywords) ? form.seo.keywords : String(form.seo?.keywords || '').split(',').map((s: string) => s.trim()).filter(Boolean)
      }
    };
    if (!payload.destination) delete payload.destination;
    if (editing) await api.put(`/packages/${editing._id}`, payload);
    else await api.post('/packages', payload);
    setModal(false); load();
  };
  const remove = async (id: string) => { if (confirm('Delete this package?')) { await api.delete(`/packages/${id}`); load(); } };

  const tabs = ['Basic Info', 'Content', 'Media', 'SEO & Tags', 'Settings'];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between"><h1 className="text-2xl font-extrabold text-slate-800 dark:text-white">Packages</h1><button onClick={openNew} className="btn-primary px-4 py-2 text-sm"><Plus size={16} /> Add Package</button></div>
      <div className="card overflow-x-auto">
        <table className="w-full min-w-[800px] text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500 dark:bg-slate-800">
            <tr><th className="p-3">Package</th><th className="p-3">Category</th><th className="p-3">Price</th><th className="p-3">Duration</th><th className="p-3">Type</th><th className="p-3">Flags</th><th className="p-3 text-right">Actions</th></tr>
          </thead>
          <tbody>
            {items.map(p => (
              <tr key={p._id} className="border-t dark:border-slate-800">
                <td className="p-3"><div className="flex items-center gap-3"><div className="relative h-10 w-14 overflow-hidden rounded-lg">{(p.thumbnail || p.images?.[0]) && <SafeImage src={p.thumbnail || p.images[0]} alt="" fill className="object-cover" />}</div><div><div className="font-semibold text-slate-800 dark:text-white">{p.title}</div><div className="text-xs text-slate-400">{p.city}{p.city && p.country ? ', ' : ''}{p.country}</div></div></div></td>
                <td className="p-3 text-slate-500">{p.category?.name || p.categorySlug}</td>
                <td className="p-3">
                  <div className="font-semibold">₹{p.price?.toLocaleString('en-IN')}</div>
                  {p.discountPrice > 0 && <div className="text-xs text-green-600">₹{p.discountPrice?.toLocaleString('en-IN')}</div>}
                </td>
                <td className="p-3 text-slate-500">{p.durationDays}D/{p.durationNights}N</td>
                <td className="p-3"><span className={`rounded-full px-2 py-1 text-xs font-semibold ${p.type === 'domestic' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{p.type}</span></td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-1">
                    {p.bestSelling && <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700">Best Seller</span>}
                    {p.trending && <span className="rounded bg-purple-100 px-1.5 py-0.5 text-[10px] font-semibold text-purple-700">Trending</span>}
                    {p.featured && <span className="rounded bg-accent/20 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">Featured</span>}
                    {p.popular && <span className="rounded bg-secondary/20 px-1.5 py-0.5 text-[10px] font-semibold text-secondary">Popular</span>}
                  </div>
                </td>
                <td className="p-3"><div className="flex justify-end gap-2"><button onClick={() => openEdit(p)} className="rounded-lg p-2 text-primary hover:bg-primary/10"><Pencil size={15} /></button><button onClick={() => remove(p._id)} className="rounded-lg p-2 text-red-500 hover:bg-red-50"><Trash2 size={15} /></button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <AdminModal title={editing ? 'Edit Package' : 'New Package'} onClose={() => setModal(false)} onSubmit={save}>
          <TabBar tabs={tabs} active={tab} onChange={setTab} />

          {/* TAB 0: Basic Info */}
          {tab === 0 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Title"><input required className={inputCls} value={form.title} onChange={e => set('title', e.target.value)} /></Field>
                <Field label="Slug (auto)"><input className={inputCls} value={form.slug} onChange={e => set('slug', e.target.value)} placeholder="auto from title" /></Field>
                <Field label="Category">
                  <select className={inputCls} value={form.categorySlug} onChange={e => { const c = cats.find(x => x.slug === e.target.value); set('categorySlug', e.target.value); if (c) set('category', c._id); }}>
                    <option value="">Select</option>{cats.map(c => <option key={c._id} value={c.slug}>{c.name}</option>)}
                  </select>
                </Field>
                <Field label="Destination">
                  <select className={inputCls} value={form.destination} onChange={e => set('destination', e.target.value)}>
                    <option value="">Select</option>{dests.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                  </select>
                </Field>
                <Field label="Country"><input className={inputCls} value={form.country} onChange={e => set('country', e.target.value)} /></Field>
                <Field label="City"><input className={inputCls} value={form.city} onChange={e => set('city', e.target.value)} /></Field>
                <Field label="Type">
                  <select className={inputCls} value={form.type} onChange={e => set('type', e.target.value)}>
                    <option value="domestic">Domestic</option><option value="international">International</option>
                  </select>
                </Field>
                <Field label="Theme (comma sep)"><input className={inputCls} value={Array.isArray(form.theme) ? form.theme.join(', ') : form.theme} onChange={e => set('theme', e.target.value)} placeholder="luxury, family, honeymoon" /></Field>
              </div>
              <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
                <p className="mb-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Pricing & Duration</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <Field label="Price (₹) *"><input required type="number" className={inputCls} value={form.price} onChange={e => set('price', +e.target.value)} /></Field>
                  <Field label="Discount Price (₹)"><input type="number" className={inputCls} value={form.discountPrice} onChange={e => set('discountPrice', +e.target.value)} /></Field>
                  <Field label="Days"><input type="number" className={inputCls} value={form.durationDays} onChange={e => set('durationDays', +e.target.value)} /></Field>
                  <Field label="Nights"><input type="number" className={inputCls} value={form.durationNights} onChange={e => set('durationNights', +e.target.value)} /></Field>
                  <Field label="Hotel Rating"><input type="number" min="1" max="5" className={inputCls} value={form.hotelRating} onChange={e => set('hotelRating', +e.target.value)} /></Field>
                  <Field label="Meal Plan"><input className={inputCls} value={form.mealPlan} onChange={e => set('mealPlan', e.target.value)} placeholder="Breakfast" /></Field>
                  <Field label="Meals"><input className={inputCls} value={form.meals} onChange={e => set('meals', e.target.value)} placeholder="e.g. MAP" /></Field>
                  <Field label="Transport"><input className={inputCls} value={form.transport} onChange={e => set('transport', e.target.value)} placeholder="e.g. AC Car" /></Field>
                  <Field label="Display Order"><input type="number" className={inputCls} value={form.displayOrder} onChange={e => set('displayOrder', +e.target.value)} /></Field>
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: Content */}
          {tab === 1 && (
            <div className="space-y-5">
              <Field label="Summary"><input className={inputCls} value={form.summary} onChange={e => set('summary', e.target.value)} /></Field>
              <Field label="Description"><textarea rows={3} className={inputCls} value={form.description} onChange={e => set('description', e.target.value)} /></Field>
              <ArrayField label="Highlights" items={form.highlights || []} onChange={v => set('highlights', v)} placeholder="Package highlight" />
              <ItineraryBuilder items={form.itinerary || []} onChange={v => set('itinerary', v)} />
              <ArrayField label="Inclusions" items={form.inclusions || []} onChange={v => set('inclusions', v)} placeholder="What's included" />
              <ArrayField label="Exclusions" items={form.exclusions || []} onChange={v => set('exclusions', v)} placeholder="What's not included" />
              <ArrayField label="Terms & Conditions" items={form.terms || []} onChange={v => set('terms', v)} placeholder="Term" />
              <Field label="Cancellation Policy"><textarea rows={3} className={inputCls} value={form.cancellationPolicy} onChange={e => set('cancellationPolicy', e.target.value)} placeholder="Cancellation policy details..." /></Field>
            </div>
          )}

          {/* TAB 2: Media */}
          {tab === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Thumbnail URL"><input className={inputCls} value={form.thumbnail} onChange={e => set('thumbnail', e.target.value)} placeholder="https://..." /></Field>
                <Field label="Cover Image URL"><input className={inputCls} value={form.coverImage} onChange={e => set('coverImage', e.target.value)} placeholder="https://..." /></Field>
                <Field label="Video URL"><input className={inputCls} value={form.video} onChange={e => set('video', e.target.value)} placeholder="https://youtube.com/..." /></Field>
              </div>
              {/* Preview images */}
              <div className="flex gap-3 flex-wrap">
                {form.thumbnail && <div className="relative"><SafeImage src={form.thumbnail} alt="Thumb" width={120} height={80} className="rounded-lg object-cover" /><span className="absolute bottom-1 left-1 rounded bg-black/60 px-1 text-[9px] text-white">Thumb</span></div>}
                {form.coverImage && <div className="relative"><SafeImage src={form.coverImage} alt="Cover" width={120} height={80} className="rounded-lg object-cover" /><span className="absolute bottom-1 left-1 rounded bg-black/60 px-1 text-[9px] text-white">Cover</span></div>}
              </div>
              <Field label="Gallery Image URLs (one per line)"><textarea rows={3} className={inputCls} value={galleryStr} onChange={e => setGalleryStr(e.target.value)} placeholder="https://image1.jpg&#10;https://image2.jpg" /></Field>
              <Field label="Legacy Image URLs (one per line)"><textarea rows={3} className={inputCls} value={imagesStr} onChange={e => setImagesStr(e.target.value)} placeholder="https://image1.jpg&#10;https://image2.jpg" /></Field>
            </div>
          )}

          {/* TAB 3: SEO & Tags */}
          {tab === 3 && (
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
                <p className="mb-3 text-xs font-bold text-slate-500 uppercase tracking-wider">SEO</p>
                <div className="space-y-3">
                  <Field label="Meta Title"><input className={inputCls} value={form.seo?.metaTitle} onChange={e => set('seo', { ...form.seo, metaTitle: e.target.value })} /></Field>
                  <Field label="Meta Description"><textarea rows={2} className={inputCls} value={form.seo?.metaDescription} onChange={e => set('seo', { ...form.seo, metaDescription: e.target.value })} /></Field>
                  <Field label="Keywords (comma sep)"><input className={inputCls} value={Array.isArray(form.seo?.keywords) ? form.seo.keywords.join(', ') : (form.seo?.keywords || '')} onChange={e => set('seo', { ...form.seo, keywords: e.target.value })} placeholder="keyword1, keyword2" /></Field>
                </div>
              </div>
              <Field label="Tags (comma sep)"><input className={inputCls} value={Array.isArray(form.tags) ? form.tags.join(', ') : (form.tags || '')} onChange={e => set('tags', e.target.value)} placeholder="tag1, tag2, tag3" /></Field>
            </div>
          )}

          {/* TAB 4: Settings */}
          {tab === 4 && (
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
                <p className="mb-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Visibility Flags</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[
                    ['flightIncluded', 'Flights Included'],
                    ['visaIncluded', 'Visa Included'],
                    ['fixedDeparture', 'Fixed Departure'],
                    ['bestSelling', 'Best Seller'],
                    ['trending', 'Trending'],
                    ['featured', 'Featured'],
                    ['popular', 'Popular']
                  ].map(([k, l]) => (
                    <label key={k} className="flex items-center gap-2 text-sm font-medium">
                      <input type="checkbox" checked={!!form[k]} onChange={e => set(k, e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary" /> {l}
                    </label>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Rating"><input type="number" step="0.1" min="0" max="5" className={inputCls} value={form.rating} onChange={e => set('rating', +e.target.value)} /></Field>
                <Field label="Review Count"><input type="number" className={inputCls} value={form.reviewCount} onChange={e => set('reviewCount', +e.target.value)} /></Field>
              </div>
              <Field label="Available Dates (comma sep, YYYY-MM-DD)"><input className={inputCls} value={datesStr} onChange={e => setDatesStr(e.target.value)} placeholder="2026-01-15, 2026-02-01" /></Field>
            </div>
          )}
        </AdminModal>
      )}
    </div>
  );
}
