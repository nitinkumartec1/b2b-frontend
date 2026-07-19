'use client';
import { useState } from 'react';
import { X, Plus, Trash2, GripVertical } from 'lucide-react';

/* ─── Modal Shell ─── */
export default function AdminModal({ title, onClose, children, onSubmit }: { title: string; onClose: () => void; children: React.ReactNode; onSubmit: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm">
      <div className="my-8 w-full max-w-4xl rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900">
        <div className="mb-4 flex items-center justify-between"><h3 className="text-lg font-extrabold text-slate-800 dark:text-white">{title}</h3><button onClick={onClose}><X className="text-slate-400 hover:text-slate-700" /></button></div>
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-4">{children}<div className="flex justify-end gap-2 pt-2"><button type="button" onClick={onClose} className="btn-outline px-5 py-2 text-sm">Cancel</button><button type="submit" className="btn-primary px-5 py-2 text-sm">Save</button></div></form>
      </div>
    </div>
  );
}

/* ─── Shared primitives ─── */
export const Field = ({ label, children, span }: any) => <div className={span ? `col-span-${span}` : ''}><label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">{label}</label>{children}</div>;
export const inputCls = "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-800";

/* ─── Tab Bar ─── */
export function TabBar({ tabs, active, onChange }: { tabs: string[]; active: number; onChange: (i: number) => void }) {
  return (
    <div className="flex gap-1 overflow-x-auto rounded-xl bg-slate-100 p-1 dark:bg-slate-800 no-scrollbar">
      {tabs.map((t, i) => (
        <button key={t} type="button" onClick={() => onChange(i)}
          className={`whitespace-nowrap rounded-lg px-4 py-2 text-xs font-bold transition-all ${active === i ? 'bg-white text-primary shadow-sm dark:bg-slate-700 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}>
          {t}
        </button>
      ))}
    </div>
  );
}

/* ─── Array of strings (inclusions, exclusions, highlights, etc.) ─── */
export function ArrayField({ label, items, onChange, placeholder }: { label: string; items: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  const add = () => onChange([...items, '']);
  const update = (i: number, v: string) => { const a = [...items]; a[i] = v; onChange(a); };
  const remove = (i: number) => onChange(items.filter((_, k) => k !== i));

  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">{label}</label>
        <button type="button" onClick={add} className="flex items-center gap-1 rounded-lg bg-primary/10 px-2 py-1 text-[11px] font-bold text-primary hover:bg-primary/20 transition">
          <Plus size={12} /> Add
        </button>
      </div>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <GripVertical size={14} className="shrink-0 text-slate-300" />
            <input className={inputCls} value={item} onChange={e => update(i, e.target.value)} placeholder={placeholder || `Item ${i + 1}`} />
            <button type="button" onClick={() => remove(i)} className="shrink-0 rounded-lg p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600 transition"><Trash2 size={14} /></button>
          </div>
        ))}
        {items.length === 0 && <p className="text-xs text-slate-400 italic">No items added yet</p>}
      </div>
    </div>
  );
}

/* ─── Itinerary Builder (day, title, description) ─── */
export function ItineraryBuilder({ items, onChange }: { items: { day: number; title: string; description: string }[]; onChange: (v: any[]) => void }) {
  const add = () => onChange([...items, { day: items.length + 1, title: '', description: '' }]);
  const update = (i: number, k: string, v: any) => { const a = [...items]; a[i] = { ...a[i], [k]: v }; onChange(a); };
  const remove = (i: number) => onChange(items.filter((_, k) => k !== i));

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Itinerary</label>
        <button type="button" onClick={add} className="flex items-center gap-1 rounded-lg bg-primary/10 px-2 py-1 text-[11px] font-bold text-primary hover:bg-primary/20 transition">
          <Plus size={12} /> Add Day
        </button>
      </div>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="rounded-xl border border-slate-200 bg-slate-50/50 p-3 dark:border-slate-700 dark:bg-slate-800/50">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-bold text-primary">Day {item.day}</span>
              <button type="button" onClick={() => remove(i)} className="rounded-lg p-1 text-red-400 hover:bg-red-50 hover:text-red-600 transition"><Trash2 size={13} /></button>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-4">
              <input type="number" className={inputCls} value={item.day} onChange={e => update(i, 'day', +e.target.value)} placeholder="Day #" />
              <input className={`${inputCls} sm:col-span-3`} value={item.title} onChange={e => update(i, 'title', e.target.value)} placeholder="Day title" />
            </div>
            <textarea rows={2} className={`${inputCls} mt-2`} value={item.description} onChange={e => update(i, 'description', e.target.value)} placeholder="Day description..." />
          </div>
        ))}
        {items.length === 0 && <p className="text-xs text-slate-400 italic">No itinerary days added yet</p>}
      </div>
    </div>
  );
}

/* ─── FAQ Builder (question, answer) ─── */
export function FAQBuilder({ items, onChange }: { items: { question: string; answer: string }[]; onChange: (v: any[]) => void }) {
  const add = () => onChange([...items, { question: '', answer: '' }]);
  const update = (i: number, k: string, v: string) => { const a = [...items]; a[i] = { ...a[i], [k]: v }; onChange(a); };
  const remove = (i: number) => onChange(items.filter((_, k) => k !== i));

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">FAQs</label>
        <button type="button" onClick={add} className="flex items-center gap-1 rounded-lg bg-primary/10 px-2 py-1 text-[11px] font-bold text-primary hover:bg-primary/20 transition">
          <Plus size={12} /> Add FAQ
        </button>
      </div>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="rounded-xl border border-slate-200 bg-slate-50/50 p-3 dark:border-slate-700 dark:bg-slate-800/50">
            <div className="mb-2 flex items-end justify-between">
              <span className="text-[11px] font-bold text-slate-500">FAQ #{i + 1}</span>
              <button type="button" onClick={() => remove(i)} className="rounded-lg p-1 text-red-400 hover:bg-red-50 hover:text-red-600 transition"><Trash2 size={13} /></button>
            </div>
            <input className={inputCls} value={item.question} onChange={e => update(i, 'question', e.target.value)} placeholder="Question" />
            <textarea rows={2} className={`${inputCls} mt-2`} value={item.answer} onChange={e => update(i, 'answer', e.target.value)} placeholder="Answer" />
          </div>
        ))}
        {items.length === 0 && <p className="text-xs text-slate-400 italic">No FAQs added yet</p>}
      </div>
    </div>
  );
}

/* ─── Attraction Builder (name, image, description) ─── */
export function AttractionBuilder({ items, onChange }: { items: { name: string; image: string; description: string }[]; onChange: (v: any[]) => void }) {
  const add = () => onChange([...items, { name: '', image: '', description: '' }]);
  const update = (i: number, k: string, v: string) => { const a = [...items]; a[i] = { ...a[i], [k]: v }; onChange(a); };
  const remove = (i: number) => onChange(items.filter((_, k) => k !== i));

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Top Attractions</label>
        <button type="button" onClick={add} className="flex items-center gap-1 rounded-lg bg-primary/10 px-2 py-1 text-[11px] font-bold text-primary hover:bg-primary/20 transition">
          <Plus size={12} /> Add Attraction
        </button>
      </div>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="rounded-xl border border-slate-200 bg-slate-50/50 p-3 dark:border-slate-700 dark:bg-slate-800/50">
            <div className="mb-2 flex items-end justify-between">
              <span className="text-[11px] font-bold text-slate-500">Attraction #{i + 1}</span>
              <button type="button" onClick={() => remove(i)} className="rounded-lg p-1 text-red-400 hover:bg-red-50 hover:text-red-600 transition"><Trash2 size={13} /></button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input className={inputCls} value={item.name} onChange={e => update(i, 'name', e.target.value)} placeholder="Attraction name" />
              <input className={inputCls} value={item.image} onChange={e => update(i, 'image', e.target.value)} placeholder="Image URL" />
            </div>
            <textarea rows={2} className={`${inputCls} mt-2`} value={item.description} onChange={e => update(i, 'description', e.target.value)} placeholder="Description" />
          </div>
        ))}
        {items.length === 0 && <p className="text-xs text-slate-400 italic">No attractions added yet</p>}
      </div>
    </div>
  );
}

/* ─── Weather Builder (month, temp, note) ─── */
export function WeatherBuilder({ items, onChange }: { items: { month: string; temp: string; note: string }[]; onChange: (v: any[]) => void }) {
  const add = () => onChange([...items, { month: '', temp: '', note: '' }]);
  const update = (i: number, k: string, v: string) => { const a = [...items]; a[i] = { ...a[i], [k]: v }; onChange(a); };
  const remove = (i: number) => onChange(items.filter((_, k) => k !== i));

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Weather Info</label>
        <button type="button" onClick={add} className="flex items-center gap-1 rounded-lg bg-primary/10 px-2 py-1 text-[11px] font-bold text-primary hover:bg-primary/20 transition">
          <Plus size={12} /> Add Month
        </button>
      </div>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <input className={inputCls} value={item.month} onChange={e => update(i, 'month', e.target.value)} placeholder="Month" style={{ maxWidth: 120 }} />
            <input className={inputCls} value={item.temp} onChange={e => update(i, 'temp', e.target.value)} placeholder="Temp (e.g. 25°C)" style={{ maxWidth: 120 }} />
            <input className={`${inputCls} flex-1`} value={item.note} onChange={e => update(i, 'note', e.target.value)} placeholder="Note" />
            <button type="button" onClick={() => remove(i)} className="shrink-0 rounded-lg p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600 transition"><Trash2 size={14} /></button>
          </div>
        ))}
        {items.length === 0 && <p className="text-xs text-slate-400 italic">No weather data added yet</p>}
      </div>
    </div>
  );
}
