'use client';
import { SlidersHorizontal, X } from 'lucide-react';

const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const themesList = ['luxury','family','honeymoon','adventure','corporate','pilgrimage','weekend','cruise'];

export default function Filters({ filters, onChange, onReset }: { filters: any; onChange: (k: string, v: any) => void; onReset: () => void }) {
  const F = ({ label, children }: any) => <div className="mb-4"><label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">{label}</label>{children}</div>;
  const inputCls = "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-900";
  return (
    <aside className="card h-fit p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-200"><SlidersHorizontal size={18} /> Filters</div>
        <button onClick={onReset} className="flex items-center gap-1 text-xs text-slate-400 hover:text-primary"><X size={12} /> Reset</button>
      </div>
      <F label="Search"><input value={filters.q} onChange={e => onChange('q', e.target.value)} placeholder="Keyword" className={inputCls} /></F>
      <F label="Country"><input value={filters.country} onChange={e => onChange('country', e.target.value)} placeholder="e.g. India" className={inputCls} /></F>
      <F label="State"><input value={filters.state} onChange={e => onChange('state', e.target.value)} placeholder="e.g. Kerala" className={inputCls} /></F>
      <F label="Type"><select value={filters.type} onChange={e => onChange('type', e.target.value)} className={inputCls}><option value="">All</option><option value="domestic">Domestic</option><option value="international">International</option></select></F>
      <F label="Theme"><select value={filters.theme} onChange={e => onChange('theme', e.target.value)} className={inputCls}><option value="">Any</option>{themesList.map(t => <option key={t} value={t}>{t}</option>)}</select></F>
      <F label="Max Budget (₹)"><input type="number" value={filters.maxPrice} onChange={e => onChange('maxPrice', e.target.value)} placeholder="e.g. 50000" className={inputCls} /></F>
      <F label="Duration (max days)"><input type="number" value={filters.duration} onChange={e => onChange('duration', e.target.value)} placeholder="e.g. 7" className={inputCls} /></F>
      <F label="Month"><select value={filters.month} onChange={e => onChange('month', e.target.value)} className={inputCls}><option value="">Any</option>{months.map(m => <option key={m} value={m}>{m}</option>)}</select></F>
      <F label="Hotel Rating"><select value={filters.hotelRating} onChange={e => onChange('hotelRating', e.target.value)} className={inputCls}><option value="">Any</option><option value="3">3★+</option><option value="4">4★+</option><option value="5">5★</option></select></F>
      <F label="Meal Plan"><select value={filters.mealPlan} onChange={e => onChange('mealPlan', e.target.value)} className={inputCls}><option value="">Any</option><option value="Breakfast">Breakfast</option><option value="Dinner">Breakfast + Dinner</option><option value="All">All Meals / Inclusive</option></select></F>
      <label className="mb-2 flex items-center gap-2 text-sm"><input type="checkbox" checked={filters.flightIncluded === 'true'} onChange={e => onChange('flightIncluded', e.target.checked ? 'true' : '')} /> Flights Included</label>
      <label className="mb-2 flex items-center gap-2 text-sm"><input type="checkbox" checked={filters.visaIncluded === 'true'} onChange={e => onChange('visaIncluded', e.target.checked ? 'true' : '')} /> Visa Included</label>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={filters.fixedDeparture === 'true'} onChange={e => onChange('fixedDeparture', e.target.checked ? 'true' : '')} /> Fixed Departures</label>
    </aside>
  );
}
