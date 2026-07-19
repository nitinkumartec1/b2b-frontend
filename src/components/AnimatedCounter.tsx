'use client';
import { useEffect, useRef, useState } from 'react';
export default function AnimatedCounter({ end, suffix = '', duration = 1500 }: { end: number; suffix?: string; duration?: number }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const t0 = performance.now();
        const tick = (t: number) => { const p = Math.min((t - t0) / duration, 1); setVal(Math.floor(p * end)); if (p < 1) requestAnimationFrame(tick); };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.4 });
    io.observe(el); return () => io.disconnect();
  }, [end, duration]);
  return <span ref={ref}>{val.toLocaleString('en-IN')}{suffix}</span>;
}
