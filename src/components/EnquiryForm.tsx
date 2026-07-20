'use client';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Check, X, Send, Mail, Lock, Loader2, LogOut } from 'lucide-react';
import { api } from '@/lib/api';
import { 
  getFirebaseAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut
} from '@/lib/firebase';

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
  // Auth state
  const [firebaseUser, setFirebaseUser] = useState<any>(null);
  const [firebaseToken, setFirebaseToken] = useState('');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Form state
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [destList, setDestList] = useState<any[]>([]);

  useEffect(() => {
    api.get('/destinations?limit=100').then(r => setDestList(r.data.items)).catch(() => {});
    
    // Check if user is already logged in to Firebase
    try {
      const auth = getFirebaseAuth();
      const unsubscribe = auth.onAuthStateChanged(async (user) => {
        if (user) {
          setFirebaseUser(user);
          const token = await user.getIdToken();
          setFirebaseToken(token);
        } else {
          setFirebaseUser(null);
          setFirebaseToken('');
        }
      });
      return () => unsubscribe();
    } catch (e) {
      console.error('Firebase init error', e);
    }
  }, []);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      travelDate: '',
      travelers: 2,
      destination: destinationName !== 'General' ? destinationName : '',
      specialRequirements: ''
    }
  });

  // Auto-fill form when user logs in
  useEffect(() => {
    if (firebaseUser) {
      reset({
        name: firebaseUser.displayName || '',
        email: firebaseUser.email || '',
        phone: '',
        travelDate: '',
        travelers: 2,
        destination: destinationName !== 'General' ? destinationName : '',
        specialRequirements: ''
      });
    }
  }, [firebaseUser, destinationName, reset]);

  const handleGoogleLogin = async () => {
    setAuthLoading(true);
    setAuthError('');
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(getFirebaseAuth(), provider);
      const token = await result.user.getIdToken();
      setFirebaseUser(result.user);
      setFirebaseToken(token);
    } catch (error: any) {
      setAuthError(error.message || 'Google Sign-In failed');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setAuthError('Please enter email and password');
      return;
    }
    setAuthLoading(true);
    setAuthError('');
    try {
      const auth = getFirebaseAuth();
      let result;
      if (authMode === 'login') {
        result = await signInWithEmailAndPassword(auth, email, password);
      } else {
        result = await createUserWithEmailAndPassword(auth, email, password);
      }
      const token = await result.user.getIdToken();
      setFirebaseUser(result.user);
      setFirebaseToken(token);
    } catch (error: any) {
      setAuthError(error.message || 'Authentication failed');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(getFirebaseAuth());
    setFirebaseUser(null);
    setFirebaseToken('');
  };

  const onSubmit = async (data: any) => {
    setStatus('loading');
    setErrorMsg('');
    try {
      await api.post('/enquiries', {
        ...data,
        packageName,
        packageId
      }, {
        headers: { Authorization: `Bearer ${firebaseToken}` }
      });
      setStatus('success');
    } catch (e: any) {
      setStatus('idle');
      setErrorMsg(e.response?.data?.message || 'Failed to send enquiry. Please try again.');
    }
  };

  return (
    <div className="card z-10 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-[20px] bg-white border border-slate-100 dark:bg-slate-900 dark:border-slate-800">
      
      {/* --- NOT LOGGED IN VIEW --- */}
      {!firebaseUser ? (
        <div className="space-y-6">
          <div>
            <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white">Sign in to Enquire</h3>
            <p className="text-sm text-slate-500 mt-1">Please log in to send a travel enquiry.</p>
          </div>

          {authError && (
            <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600 border border-red-100 flex items-start gap-2">
              <X size={16} className="mt-0.5 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <button 
            onClick={handleGoogleLogin} 
            disabled={authLoading}
            className="flex w-full items-center justify-center gap-3 rounded-[14px] border border-slate-200 bg-white h-[52px] text-slate-700 font-bold hover:bg-slate-50 transition-colors shadow-sm dark:bg-slate-800 dark:border-slate-700 dark:text-white"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700"></div>
            <span className="text-xs font-semibold text-slate-400">OR</span>
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700"></div>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:bg-slate-800 dark:border-slate-700 dark:text-white" 
                  placeholder="Email address" 
                />
              </div>
            </div>
            <div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:bg-slate-800 dark:border-slate-700 dark:text-white" 
                  placeholder="Password" 
                />
              </div>
            </div>
            <button 
              disabled={authLoading} 
              type="submit" 
              className="flex w-full items-center justify-center gap-2 rounded-[14px] bg-slate-800 h-[52px] text-white font-bold hover:bg-slate-700 transition-colors disabled:opacity-70 dark:bg-slate-700 dark:hover:bg-slate-600"
            >
              {authLoading ? <Loader2 size={18} className="animate-spin" /> : (authMode === 'login' ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <div className="text-center text-sm text-slate-500">
            {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')} className="font-bold text-primary hover:underline">
              {authMode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </div>
        </div>
      ) : status === 'success' ? (
        /* --- SUCCESS VIEW --- */
        <div className="py-12 text-center text-green-600 flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Check size={32} />
          </div>
          <h3 className="text-xl font-extrabold text-slate-800 dark:text-white">Your enquiry has been submitted successfully.</h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">We will contact you shortly.</p>
          <button onClick={() => setStatus('idle')} className="mt-6 text-sm text-primary font-bold hover:underline">Send another enquiry</button>
        </div>
      ) : (
        /* --- ENQUIRY FORM VIEW --- */
        <>
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white">Send an Enquiry</h3>
              <p className="text-sm text-slate-500 mt-1">
                Signed in as <span className="font-bold text-slate-700 dark:text-slate-300">{firebaseUser.email}</span>
              </p>
            </div>
            <button onClick={handleLogout} className="text-xs font-semibold text-red-500 flex items-center gap-1 hover:underline">
              <LogOut size={14} /> Sign Out
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">Destination</label>
              <select {...register('destination')} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all dark:bg-slate-800 dark:border-slate-700 dark:text-white">
                <option value="">Select a Destination</option>
                {destList.map(d => (
                  <option key={d._id} value={d.name}>{d.name}</option>
                ))}
                {destinationName !== 'General' && !destList.find(d => d.name === destinationName) && (
                  <option value={destinationName}>{destinationName}</option>
                )}
                <option value="Other">Other / General</option>
              </select>
              {errors.destination && <p className="mt-1 text-xs text-red-500">{errors.destination.message?.toString()}</p>}
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">Full Name</label>
                <input {...register('name')} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all dark:bg-slate-800 dark:border-slate-700 dark:text-white" placeholder="John Doe" />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message?.toString()}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">Email (Verified)</label>
                <input {...register('email')} disabled className="w-full rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700 outline-none dark:bg-green-900/20 dark:border-green-800 dark:text-green-400" />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message?.toString()}</p>}
              </div>
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

            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">Travellers</label>
              <input type="number" {...register('travelers', { valueAsNumber: true })} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all dark:bg-slate-800 dark:border-slate-700 dark:text-white" placeholder="2" />
              {errors.travelers && <p className="mt-1 text-xs text-red-500">{errors.travelers.message?.toString()}</p>}
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
