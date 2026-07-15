import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

type ToastKind = "success" | "error" | "info";
interface Toast {
  id: number;
  kind: ToastKind;
  msg: string;
}

const Ctx = createContext<(kind: ToastKind, msg: string) => void>(() => {});

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback((kind: ToastKind, msg: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, kind, msg }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200);
  }, []);

  return (
    <Ctx.Provider value={push}>
      {children}
      <div className="fixed top-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto min-w-[260px] max-w-sm rounded-xl border backdrop-blur-xl px-4 py-3 text-sm font-medium shadow-2xl animate-in slide-in-from-right-4 fade-in ${
              t.kind === "success"
                ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
                : t.kind === "error"
                ? "border-red-400/40 bg-red-500/10 text-red-200"
                : "border-indigo-400/40 bg-indigo-500/10 text-indigo-200"
            }`}
          >
            {t.msg}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}

export const useToast = () => useContext(Ctx);
