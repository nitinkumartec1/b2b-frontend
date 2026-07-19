'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log to an error reporting service
  }, [error]);

  return (
    <div className="container-x flex min-h-[60vh] flex-col items-center justify-center text-center py-20">
      <div className="grid h-20 w-20 place-items-center rounded-2xl bg-red-50 mb-6">
        <span className="text-4xl">⚠️</span>
      </div>
      <h2 className="text-3xl font-extrabold text-slate-800">Something went wrong</h2>
      <p className="mt-3 text-slate-500">
        An unexpected error occurred. Please try again.
      </p>
      <button
        onClick={() => reset()}
        className="btn-primary mt-8"
      >
        Try Again
      </button>
    </div>
  );
}
