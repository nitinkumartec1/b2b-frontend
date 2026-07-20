'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Check, X, Send, Phone, ShieldCheck, ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { api } from '@/lib/api';
import { getFirebaseAuth, RecaptchaVerifier, signInWithPhoneNumber } from '@/lib/firebase';

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

type Step = 'phone-input' | 'otp-input' | 'form';

export default function EnquiryForm({ destinationName = 'General', packageName = 'Custom Package', packageId }: EnquiryFormProps) {
  const { user } = useAuth();
  const [step, setStep] = useState<Step>('phone-input');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [confirmResult, setConfirmResult] = useState<any>(null);
  const [firebaseToken, setFirebaseToken] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [otpSending, setOtpSending] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [destList, setDestList] = useState<any[]>([]);
  const recaptchaRef = useRef<HTMLDivElement>(null);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    api.get('/destinations?limit=100').then(r => setDestList(r.data.items)).catch(() => {});
  }, []);

  // Countdown timer for resend OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const setupRecaptcha = useCallback(() => {
    if (!(window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier = new RecaptchaVerifier(getFirebaseAuth(), 'recaptcha-container', {
        size: 'invisible',
        callback: () => { /* reCAPTCHA solved */ },
      });
    }
  }, []);

  const handleSendOTP = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      setErrorMsg('Please enter a valid phone number with country code (e.g. +91XXXXXXXXXX)');
      return;
    }

    setOtpSending(true);
    setErrorMsg('');

    try {
      setupRecaptcha();
      const appVerifier = (window as any).recaptchaVerifier;
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
      const result = await signInWithPhoneNumber(getFirebaseAuth(), formattedPhone, appVerifier);
      setConfirmResult(result);
      setStep('otp-input');
      setCountdown(60);
      // Focus first OTP input
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (error: any) {
      setErrorMsg(error.message || 'Failed to send OTP. Please check your phone number and try again.');
      // Reset recaptcha on error
      if ((window as any).recaptchaVerifier) {
        (window as any).recaptchaVerifier.clear();
        (window as any).recaptchaVerifier = null;
      }
    } finally {
      setOtpSending(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // only digits

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Only take the last digit
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i];
    }
    setOtp(newOtp);
    // Focus the input after the last pasted digit
    const focusIdx = Math.min(pasted.length, 5);
    otpRefs.current[focusIdx]?.focus();
  };

  const handleVerifyOTP = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setErrorMsg('Please enter the 6-digit OTP');
      return;
    }

    setOtpVerifying(true);
    setErrorMsg('');

    try {
      const result = await confirmResult!.confirm(otpCode);
      const token = await result.user.getIdToken();
      setFirebaseToken(token);
      setStep('form');
    } catch {
      setErrorMsg('Invalid OTP. Please check and try again.');
    } finally {
      setOtpVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;
    // Reset recaptcha
    if ((window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier.clear();
      (window as any).recaptchaVerifier = null;
    }
    setOtp(['', '', '', '', '', '']);
    await handleSendOTP();
  };

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
        phone: phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`,
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
      {/* Invisible reCAPTCHA container */}
      <div id="recaptcha-container" ref={recaptchaRef} />

      {status === 'success' ? (
        <div className="py-12 text-center text-green-600 flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Check size={32} />
          </div>
          <h3 className="text-xl font-extrabold text-slate-800 dark:text-white">Your enquiry has been submitted successfully.</h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">We will contact you shortly.</p>
          <button onClick={() => { setStatus('idle'); setStep('phone-input'); setPhoneNumber(''); setOtp(['', '', '', '', '', '']); setFirebaseToken(''); }} className="mt-6 text-sm text-primary font-bold hover:underline">Send another enquiry</button>
        </div>
      ) : step === 'phone-input' ? (
        <>
          <div className="mb-6">
            <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white">Verify Your Phone</h3>
            <p className="text-sm text-slate-500 mt-1">Enter your mobile number to receive a one-time verification code.</p>
          </div>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">Mobile Number</label>
              <div className="flex gap-2">
                <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300">
                  <Phone size={14} /> +91
                </div>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  placeholder="XXXXXXXXXX"
                  maxLength={10}
                />
              </div>
            </div>

            {errorMsg && (
              <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600 border border-red-100 flex items-start gap-2">
                <X size={16} className="mt-0.5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              onClick={handleSendOTP}
              disabled={otpSending || phoneNumber.length < 10}
              className="flex w-full items-center justify-center gap-2 rounded-[14px] bg-[#1E4D8B] h-[52px] text-white font-bold hover:bg-[#163b6b] transition-colors disabled:opacity-70 mt-2 shadow-md"
            >
              {otpSending ? <><Loader2 size={18} className="animate-spin" /> Sending OTP...</> : <><Phone size={18} /> Send OTP</>}
            </button>
          </div>
        </>
      ) : step === 'otp-input' ? (
        <>
          <div className="mb-6">
            <button onClick={() => { setStep('phone-input'); setErrorMsg(''); }} className="text-sm text-primary font-semibold flex items-center gap-1 mb-3 hover:underline">
              <ArrowLeft size={14} /> Change number
            </button>
            <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white">Enter OTP</h3>
            <p className="text-sm text-slate-500 mt-1">
              A 6-digit code has been sent to <span className="font-bold text-slate-700 dark:text-slate-300">+91{phoneNumber}</span>
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex justify-center gap-2" onPaste={handleOtpPaste}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { otpRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  className="w-12 h-14 text-center text-xl font-bold rounded-xl border-2 border-slate-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                />
              ))}
            </div>

            {errorMsg && (
              <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600 border border-red-100 flex items-start gap-2">
                <X size={16} className="mt-0.5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              onClick={handleVerifyOTP}
              disabled={otpVerifying || otp.join('').length !== 6}
              className="flex w-full items-center justify-center gap-2 rounded-[14px] bg-[#1E4D8B] h-[52px] text-white font-bold hover:bg-[#163b6b] transition-colors disabled:opacity-70 shadow-md"
            >
              {otpVerifying ? <><Loader2 size={18} className="animate-spin" /> Verifying...</> : <><ShieldCheck size={18} /> Verify OTP</>}
            </button>

            <div className="text-center">
              {countdown > 0 ? (
                <p className="text-sm text-slate-400">Resend OTP in <span className="font-bold text-slate-600 dark:text-slate-300">{countdown}s</span></p>
              ) : (
                <button onClick={handleResendOTP} className="text-sm text-primary font-bold hover:underline">Resend OTP</button>
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <Check size={14} className="text-green-600" />
              </div>
              <span className="text-sm font-semibold text-green-600">Phone verified: +91{phoneNumber}</span>
            </div>
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
                <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">Phone (Verified)</label>
                <input
                  value={`+91${phoneNumber}`}
                  disabled
                  className="w-full rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700 outline-none dark:bg-green-900/20 dark:border-green-800 dark:text-green-400"
                />
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
