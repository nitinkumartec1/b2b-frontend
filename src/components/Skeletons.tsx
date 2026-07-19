export function CardSkeleton() {
  return <div className="animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800"><div className="h-52 rounded-t-2xl bg-slate-200 dark:bg-slate-700" /><div className="space-y-3 p-4"><div className="h-3 w-1/3 rounded bg-slate-200 dark:bg-slate-700" /><div className="h-4 w-2/3 rounded bg-slate-200 dark:bg-slate-700" /><div className="h-3 w-full rounded bg-slate-200 dark:bg-slate-700" /><div className="h-9 w-full rounded-xl bg-slate-200 dark:bg-slate-700" /></div></div>;
}
export function SkeletonGrid({ count = 8 }: { count?: number }) {
  return <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: count }).map((_, i) => <CardSkeleton key={i} />)}</div>;
}
