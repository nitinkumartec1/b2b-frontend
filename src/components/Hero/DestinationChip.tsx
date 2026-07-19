'use client';
import { motion } from 'framer-motion';

interface DestinationChipProps {
  icon: string;
  label: string;
  onClick: () => void;
}

export default function DestinationChip({ icon, label, onClick }: DestinationChipProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={(e) => { e.preventDefault(); onClick(); }}
      className="inline-flex items-center gap-1.5 bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-primary/30 px-3 py-1.5 rounded-full text-sm font-semibold text-slate-700 transition-all duration-200"
    >
      <span className="text-base leading-none">{icon}</span>
      <span>{label}</span>
    </motion.button>
  );
}
