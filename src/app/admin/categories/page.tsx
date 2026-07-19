'use client';
import { useEffect, useState } from 'react';
import SafeImage from '@/components/SafeImage';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { api } from '@/lib/api';
import AdminModal, { Field, inputCls } from '@/components/admin/AdminModal';

const blank = { name: '', slug: '', image: '', description: '', startingPrice: 0, displayOrder: 0, featured: false };
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export default function AdminCategories() {
  const [items, setItems] = useState<any[]>([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>(blank);

  const load = () => api.get('/categories').then(r => setItems(r.data.items));
  useEffect(() => { load(); }, []);
  const openNew = () => { setEditing(null); setForm(blank); setModal(true); };
  const openEdit = (c: any) => { setEditing(c); setForm({ ...blank, ...c }); setModal(true); };
  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));
  const save = async () => {
    const payload = { ...form, slug: form.slug || slugify(form.name) };
    if (editing) await api.put(`/categories/${editing._id}`, payload); else await api.post('/categories', payload);
    setModal(false); load();
  };
  const remove = async (id: string) => { if (confirm('Delete this category?')) { await api.delete(`/categories/${id}`); load(); } };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between"><h1 className="text-2xl font-extrabold text-slate-800 dark:text-white">Categories</h1><button onClick={openNew} className="btn-primary px-4 py-2 text-sm"><Plus size={16} /> Add Category</button></div>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500 dark:bg-slate-800"><tr><th className="p-3">Category</th><th className="p-3">Packages</th><th className="p-3">From</th><th className="p-3">Order</th><th className="p-3 text-right">Actions</th></tr></thead>
          <tbody>
            {items.map(c => (
              <tr key={c._id} className="border-t dark:border-slate-800">
                <td className="p-3"><div className="flex items-center gap-3"><div className="relative h-10 w-14 overflow-hidden rounded-lg">{c.image && <SafeImage src={c.image} alt="" fill className="object-cover" />}</div><span className="font-semibold text-slate-800 dark:text-white">{c.name}</span></div></td>
                <td className="p-3">{c.packageCount}</td>
                <td className="p-3">₹{c.startingPrice?.toLocaleString('en-IN')}</td>
                <td className="p-3">{c.displayOrder}</td>
                <td className="p-3"><div className="flex justify-end gap-2"><button onClick={() => openEdit(c)} className="rounded-lg p-2 text-primary hover:bg-primary/10"><Pencil size={15} /></button><button onClick={() => remove(c._id)} className="rounded-lg p-2 text-red-500 hover:bg-red-50"><Trash2 size={15} /></button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modal && (
        <AdminModal title={editing ? 'Edit Category' : 'New Category'} onClose={() => setModal(false)} onSubmit={save}>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Name"><input required className={inputCls} value={form.name} onChange={e => set('name', e.target.value)} /></Field>
            <Field label="Slug (auto)"><input className={inputCls} value={form.slug} onChange={e => set('slug', e.target.value)} /></Field>
            <Field label="Starting Price"><input type="number" className={inputCls} value={form.startingPrice} onChange={e => set('startingPrice', +e.target.value)} /></Field>
            <Field label="Display Order"><input type="number" className={inputCls} value={form.displayOrder} onChange={e => set('displayOrder', +e.target.value)} /></Field>
          </div>
          <Field label="Image URL"><input className={inputCls} value={form.image} onChange={e => set('image', e.target.value)} /></Field>
          <Field label="Description"><textarea rows={2} className={inputCls} value={form.description} onChange={e => set('description', e.target.value)} /></Field>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} /> Featured</label>
        </AdminModal>
      )}
    </div>
  );
}
