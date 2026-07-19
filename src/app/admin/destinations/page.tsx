'use client';
import { useEffect, useState } from 'react';
import SafeImage from '@/components/SafeImage';
import { Plus, Pencil, Trash2, Star } from 'lucide-react';
import { api } from '@/lib/api';
import AdminModal, { Field, inputCls, TabBar, ArrayField, FAQBuilder, AttractionBuilder, WeatherBuilder } from '@/components/admin/AdminModal';

const blank: any = {
  name: '', slug: '', country: '', state: '', type: 'domestic',
  image: '', banner: '', heroImage: '', gallery: [],
  shortDescription: '', overview: '',
  tourCount: 0, startingPrice: 0, rating: 4.5, reviewCount: 0,
  bestTimeToVisit: '', displayOrder: 0,
  weather: [], topAttractions: [], thingsToDo: [], travelTips: [],
  mapEmbed: '', faqs: [],
  featured: false, popular: true
};
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export default function AdminDestinations() {
  const [items, setItems] = useState<any[]>([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>(blank);
  const [tab, setTab] = useState(0);
  const [galleryStr, setGalleryStr] = useState('');

  const load = () => api.get('/destinations?limit=100').then(r => setItems(r.data.items));
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm(blank); setGalleryStr(''); setTab(0); setModal(true); };
  const openEdit = (d: any) => {
    setEditing(d);
    setForm({
      ...blank, ...d,
      gallery: d.gallery || [],
      weather: d.weather || [],
      topAttractions: d.topAttractions || [],
      thingsToDo: d.thingsToDo || [],
      travelTips: d.travelTips || [],
      faqs: d.faqs || []
    });
    setGalleryStr((d.gallery || []).join('\n'));
    setTab(0);
    setModal(true);
  };
  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));

  const save = async () => {
    const payload = {
      ...form,
      slug: form.slug || slugify(form.name),
      gallery: galleryStr.split('\n').map((s: string) => s.trim()).filter(Boolean)
    };
    if (editing) await api.put(`/destinations/${editing._id}`, payload);
    else await api.post('/destinations', payload);
    setModal(false); load();
  };
  const remove = async (id: string) => { if (confirm('Delete this destination?')) { await api.delete(`/destinations/${id}`); load(); } };

  const tabs = ['Basic Info', 'Content', 'Media', 'Settings'];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between"><h1 className="text-2xl font-extrabold text-slate-800 dark:text-white">Destinations</h1><button onClick={openNew} className="btn-primary px-4 py-2 text-sm"><Plus size={16} /> Add Destination</button></div>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500 dark:bg-slate-800"><tr><th className="p-3">Destination</th><th className="p-3">Country</th><th className="p-3">Tours</th><th className="p-3">From</th><th className="p-3">Rating</th><th className="p-3">Flags</th><th className="p-3 text-right">Actions</th></tr></thead>
          <tbody>
            {items.map(d => (
              <tr key={d._id} className="border-t dark:border-slate-800">
                <td className="p-3"><div className="flex items-center gap-3"><div className="relative h-10 w-14 overflow-hidden rounded-lg">{d.image && <SafeImage src={d.image} alt="" fill className="object-cover" />}</div><span className="font-semibold text-slate-800 dark:text-white">{d.name}</span></div></td>
                <td className="p-3 text-slate-500">{d.country}</td>
                <td className="p-3">{d.tourCount}</td>
                <td className="p-3">₹{d.startingPrice?.toLocaleString('en-IN')}</td>
                <td className="p-3"><div className="flex items-center gap-1"><Star size={13} className="fill-amber-400 text-amber-400" /><span className="text-xs font-semibold">{d.rating}</span></div></td>
                <td className="p-3"><div className="flex gap-1">{d.featured && <span className="rounded bg-accent/20 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">Featured</span>}{d.popular && <span className="rounded bg-secondary/20 px-1.5 py-0.5 text-[10px] font-semibold text-secondary">Popular</span>}</div></td>
                <td className="p-3"><div className="flex justify-end gap-2"><button onClick={() => openEdit(d)} className="rounded-lg p-2 text-primary hover:bg-primary/10"><Pencil size={15} /></button><button onClick={() => remove(d._id)} className="rounded-lg p-2 text-red-500 hover:bg-red-50"><Trash2 size={15} /></button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <AdminModal title={editing ? 'Edit Destination' : 'New Destination'} onClose={() => setModal(false)} onSubmit={save}>
          <TabBar tabs={tabs} active={tab} onChange={setTab} />

          {/* TAB 0: Basic Info */}
          {tab === 0 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Name"><input required className={inputCls} value={form.name} onChange={e => set('name', e.target.value)} /></Field>
                <Field label="Slug (auto)"><input className={inputCls} value={form.slug} onChange={e => set('slug', e.target.value)} placeholder="auto from name" /></Field>
                <Field label="Country"><input required className={inputCls} value={form.country} onChange={e => set('country', e.target.value)} /></Field>
                <Field label="State"><input className={inputCls} value={form.state} onChange={e => set('state', e.target.value)} /></Field>
                <Field label="Type">
                  <select className={inputCls} value={form.type} onChange={e => set('type', e.target.value)}>
                    <option value="domestic">Domestic</option><option value="international">International</option>
                  </select>
                </Field>
                <Field label="Display Order"><input type="number" className={inputCls} value={form.displayOrder} onChange={e => set('displayOrder', +e.target.value)} /></Field>
                <Field label="Tour Count"><input type="number" className={inputCls} value={form.tourCount} onChange={e => set('tourCount', +e.target.value)} /></Field>
                <Field label="Starting Price (₹)"><input type="number" className={inputCls} value={form.startingPrice} onChange={e => set('startingPrice', +e.target.value)} /></Field>
                <Field label="Rating"><input type="number" step="0.1" min="0" max="5" className={inputCls} value={form.rating} onChange={e => set('rating', +e.target.value)} /></Field>
                <Field label="Review Count"><input type="number" className={inputCls} value={form.reviewCount} onChange={e => set('reviewCount', +e.target.value)} /></Field>
                <Field label="Best Time to Visit"><input className={inputCls} value={form.bestTimeToVisit} onChange={e => set('bestTimeToVisit', e.target.value)} placeholder="e.g. Oct – Mar" /></Field>
              </div>
            </div>
          )}

          {/* TAB 1: Content */}
          {tab === 1 && (
            <div className="space-y-5">
              <Field label="Short Description"><input className={inputCls} value={form.shortDescription} onChange={e => set('shortDescription', e.target.value)} /></Field>
              <Field label="Overview"><textarea rows={4} className={inputCls} value={form.overview} onChange={e => set('overview', e.target.value)} /></Field>
              <ArrayField label="Things to Do" items={form.thingsToDo || []} onChange={v => set('thingsToDo', v)} placeholder="Activity or experience" />
              <ArrayField label="Travel Tips" items={form.travelTips || []} onChange={v => set('travelTips', v)} placeholder="Tip for travelers" />
              <AttractionBuilder items={form.topAttractions || []} onChange={v => set('topAttractions', v)} />
              <WeatherBuilder items={form.weather || []} onChange={v => set('weather', v)} />
              <FAQBuilder items={form.faqs || []} onChange={v => set('faqs', v)} />
            </div>
          )}

          {/* TAB 2: Media */}
          {tab === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Card Image URL"><input className={inputCls} value={form.image} onChange={e => set('image', e.target.value)} placeholder="https://..." /></Field>
                <Field label="Banner Image URL"><input className={inputCls} value={form.banner} onChange={e => set('banner', e.target.value)} placeholder="https://..." /></Field>
                <Field label="Hero Image URL"><input className={inputCls} value={form.heroImage} onChange={e => set('heroImage', e.target.value)} placeholder="https://..." /></Field>
                <Field label="Map Embed"><input className={inputCls} value={form.mapEmbed} onChange={e => set('mapEmbed', e.target.value)} placeholder="lat,lng or embed URL" /></Field>
              </div>
              {/* Preview images if set */}
              <div className="flex gap-3 flex-wrap">
                {form.image && <div className="relative"><SafeImage src={form.image} alt="Card" width={120} height={80} className="rounded-lg object-cover" /><span className="absolute bottom-1 left-1 rounded bg-black/60 px-1 text-[9px] text-white">Card</span></div>}
                {form.banner && <div className="relative"><SafeImage src={form.banner} alt="Banner" width={120} height={80} className="rounded-lg object-cover" /><span className="absolute bottom-1 left-1 rounded bg-black/60 px-1 text-[9px] text-white">Banner</span></div>}
                {form.heroImage && <div className="relative"><SafeImage src={form.heroImage} alt="Hero" width={120} height={80} className="rounded-lg object-cover" /><span className="absolute bottom-1 left-1 rounded bg-black/60 px-1 text-[9px] text-white">Hero</span></div>}
              </div>
              <Field label="Gallery Image URLs (one per line)"><textarea rows={4} className={inputCls} value={galleryStr} onChange={e => setGalleryStr(e.target.value)} placeholder="https://image1.jpg&#10;https://image2.jpg" /></Field>
            </div>
          )}

          {/* TAB 3: Settings */}
          {tab === 3 && (
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
                <p className="mb-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Visibility Flags</p>
                <div className="flex flex-wrap gap-6">
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary" /> Featured
                  </label>
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <input type="checkbox" checked={form.popular} onChange={e => set('popular', e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary" /> Popular
                  </label>
                </div>
              </div>
            </div>
          )}
        </AdminModal>
      )}
    </div>
  );
}
