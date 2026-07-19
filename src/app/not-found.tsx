import Link from 'next/link';
import { Plane } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="container-x flex min-h-[60vh] flex-col items-center justify-center text-center py-20">
      <div className="grid h-20 w-20 place-items-center rounded-2xl bg-primary/10 mb-6">
        <Plane size={40} className="text-primary" />
      </div>
      <h1 className="text-5xl font-extrabold text-slate-800">404</h1>
      <p className="mt-3 text-lg text-slate-500">
        Oops! The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="btn-primary mt-8"
      >
        Back to Home
      </Link>
    </div>
  );
}
