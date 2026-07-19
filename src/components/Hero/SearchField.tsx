'use client';
import { ReactNode } from 'react';

interface SearchFieldProps {
  icon: ReactNode;
  placeholder?: string;
  value: string;
  onChange: (val: string) => void;
  type?: string;
  label: string;
}

export default function SearchField({ icon, placeholder, value, onChange, type = 'text', label }: SearchFieldProps) {
  return (
    <div className="flex-1 w-full bg-slate-50/50 hover:bg-slate-50 transition-colors border border-slate-200 hover:border-primary/50 focus-within:border-primary rounded-xl px-4 py-3 flex flex-col justify-center relative group">
      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">{label}</label>
      <div className="flex items-center gap-3">
        <div className="text-primary/70 group-focus-within:text-primary transition-colors">
          {icon}
        </div>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-slate-800 font-semibold placeholder:text-slate-400 focus:outline-none"
        />
      </div>
    </div>
  );
}
