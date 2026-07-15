export function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10">
      <div className="relative h-10 w-10">
        <div className="absolute inset-0 rounded-full border-2 border-indigo-500/20" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-indigo-400 border-r-emerald-400 animate-spin" />
      </div>
      {label && <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>}
    </div>
  );
}

export function FullScreenLoader({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-[#0B0F19]">
      <Spinner label={label} />
    </div>
  );
}
