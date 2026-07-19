'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock } from 'lucide-react';
import { useAuth } from '@/lib/auth';

export default function Login() {
  const { login } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading'>('idle');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); 
    setStatus('loading');
    try { 
      await login(form.email, form.password); 
      router.push('/admin'); 
    }
    catch (err: any) { 
      setError(err.response?.data?.message || 'Login failed'); 
      setStatus('idle'); 
    }
  };

  return (
    <div className="container-x grid min-h-[80vh] place-items-center py-10">
      <div className="card w-full max-w-md p-8">
        <h1 className="mt-6 text-3xl font-extrabold text-slate-800">Admin Portal</h1>
        <p className="mt-2 text-sm text-slate-500">Sign in to manage packages and enquiries</p>

        {error && <div className="mt-6 rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-600">{error}</div>}

        <form onSubmit={handleLogin} className="mt-8 space-y-4 text-left">
          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-700">Email address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="email" required className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm font-medium outline-none focus:border-primary focus:ring-1 focus:ring-primary" placeholder="info@theb2bholidays.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-700">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="password" required className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm font-medium outline-none focus:border-primary focus:ring-1 focus:ring-primary" placeholder="••••••••" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
            </div>
          </div>
          <button disabled={status === 'loading'} className="btn-primary mt-6 w-full py-3">
            {status === 'loading' ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-4 rounded-xl bg-slate-50 p-3 text-xs text-slate-500">
          <b>Demo:</b> info@theb2bholidays.com / admin123<br />agent@theb2bholidays.com / agent123<br />user@theb2bholidays.com / user123
        </div>
      </div>
    </div>
  );
}
