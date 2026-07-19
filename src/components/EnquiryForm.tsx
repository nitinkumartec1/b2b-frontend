'use client';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Check, X, Send } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { api } from '@/lib/api';

const enquirySchema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z.string().regex(/^\+?[\d\s-]{10,15}$/, 'Valid mobile number required'),
  email: z.string().email('Valid email required'),
  travelDate: z.string().min(1, 'Travel date is required'),
  travelers: z.number().min(1, 'Minimum 1 traveler required'),
  destination: z.string().min(1, 'Destination is required'),
  specialRequirements: z.string().optional()
});

interface EnquiryFormProps {
  destinationName?: string;
  packageName?: string;
  packageId?: string;
}

export default function EnquiryForm({ destinationName = 'General', packageName = 'Custom Package', packageId }: EnquiryFormProps) {
  const { user } = useAuth();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [destList, setDestList] = useState<any[]>([]);

  useEffect(() => {
    api.get('/destinations?limit=100').then(r => setDestList(r.data.items)).catch(() => {});
  }, []);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      name: user?.name || '',
      phone: '',
      email: user?.email || '',
      travelDate: '',
      travelers: 2,
      destination: destinationName !== 'General' ? destinationName : '',
      specialRequirements: ''
    }
  });

  const onSubmit = async (data: any) => {
    setStatus('loading');
    setErrorMsg('');
    try {
      await api.post('/enquiries', {
        ...data,
        packageName,
        packageId
      });
      setStatus('success');
    } catch (e: any) {
      setStatus('idle');
      setErrorMsg(e.response?.data?.message || 'Failed to send enquiry. Please try again.');
    }
  };

  return (
    <div className="card z-10 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-[20px] bg-white border border-slate-100 dark:bg-slate-900 dark:border-slate-800">
      {status === 'success' ? (
        <div className="py-12 text-center text-green-600 flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Check size={32} />
          </div>
          <h3 className="text-xl font-extrabold text-slate-800 dark:text-white">Your enquiry has been submitted successfully.</h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">We will contact you shortly.</p>
          <button onClick={() => setStatus('idle')} className="mt-6 text-sm text-primary font-bold hover:underline">Send another enquiry</button>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white">Send an Enquiry</h3>
            <p className="text-sm text-slate-500 mt-1">Our travel expert will contact you shortly.</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">Destination</label>
              <select {...register('destination')} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all dark:bg-slate-800 dark:border-slate-700 dark:text-white">
                <option value="">Select a Destination</option>
                {destList.map(d => (
                  <option key={d._id} value={d.name}>{d.name}</option>
                ))}
                {/* Fallback option if current destination isn't in list */}
                {destinationName !== 'General' && !destList.find(d => d.name === destinationName) && (
                  <option value={destinationName}>{destinationName}</option>
                )}
                <option value="Other">Other / General</option>
              </select>
              {errors.destination && <p className="mt-1 text-xs text-red-500">{errors.destination.message?.toString()}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">Full Name</label>
              <input {...register('name')} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all dark:bg-slate-800 dark:border-slate-700 dark:text-white" placeholder="John Doe" />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message?.toString()}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">Phone</label>
                <input {...register('phone')} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all dark:bg-slate-800 dark:border-slate-700 dark:text-white" placeholder="+1234567890" />
                {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message?.toString()}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">Travel Date</label>
                <input type="date" {...register('travelDate')} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all dark:bg-slate-800 dark:border-slate-700 dark:text-white" />
                {errors.travelDate && <p className="mt-1 text-xs text-red-500">{errors.travelDate.message?.toString()}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">Email</label>
                <input type="email" {...register('email')} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all dark:bg-slate-800 dark:border-slate-700 dark:text-white" placeholder="john@example.com" />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message?.toString()}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">Travellers</label>
                <input type="number" {...register('travelers', { valueAsNumber: true })} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all dark:bg-slate-800 dark:border-slate-700 dark:text-white" placeholder="2" />
                {errors.travelers && <p className="mt-1 text-xs text-red-500">{errors.travelers.message?.toString()}</p>}
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">Special Requirements</label>
              <textarea {...register('specialRequirements')} rows={3} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none dark:bg-slate-800 dark:border-slate-700 dark:text-white" placeholder="Tell us your travel preferences..." />
            </div>
            
            {errorMsg && (
              <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600 border border-red-100 flex items-start gap-2">
                <X size={16} className="mt-0.5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button disabled={status === 'loading'} type="submit" className="flex w-full items-center justify-center gap-2 rounded-[14px] bg-[#1E4D8B] h-[52px] text-white font-bold hover:bg-[#163b6b] transition-colors disabled:opacity-70 mt-2 shadow-md">
              {status === 'loading' ? 'Sending...' : 'Send Enquiry'} <Send size={18} />
            </button>
          </form>
        </>
      )}
    </div>
  );
}
