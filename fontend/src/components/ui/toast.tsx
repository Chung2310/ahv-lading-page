import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { __INTERNAL_TOAST_EVENT_NAME__, NotifyPayload } from "../../lib/notify";

type ToastType = "success" | "error" | "info";

export type ToastItem = {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  durationMs?: number;
};

type ToastContextValue = {
  push: (t: Omit<ToastItem, "id">) => void;
  remove: (id: string) => void;
  success: (message: string, opts?: { title?: string; durationMs?: number }) => void;
  error: (message: string, opts?: { title?: string; durationMs?: number }) => void;
  info: (message: string, opts?: { title?: string; durationMs?: number }) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

function iconFor(type: ToastType) {
  if (type === "success") return "✓";
  if (type === "error") return "!";
  return "i";
}

function stylesFor(type: ToastType) {
  switch (type) {
    case "success":
      return {
        ring: "ring-emerald-500/30",
        icon: "bg-emerald-500 text-white",
        title: "text-emerald-50",
        message: "text-emerald-100/90",
        bg: "bg-emerald-950/70 border-emerald-500/20",
      };
    case "error":
      return {
        ring: "ring-red-500/30",
        icon: "bg-red-500 text-white",
        title: "text-red-50",
        message: "text-red-100/90",
        bg: "bg-red-950/70 border-red-500/20",
      };
    default:
      return {
        ring: "ring-sky-500/30",
        icon: "bg-sky-500 text-white",
        title: "text-sky-50",
        message: "text-sky-100/90",
        bg: "bg-slate-950/70 border-slate-400/20",
      };
  }
}

export const ToastProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timers = useRef(new Map<string, number>());

  const remove = useCallback((id: string) => {
    const t = timers.current.get(id);
    if (t) window.clearTimeout(t);
    timers.current.delete(id);
    setToasts((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const push = useCallback(
    (t: Omit<ToastItem, "id">) => {
      const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      const durationMs = t.durationMs ?? (t.type === "error" ? 7000 : 4500);
      setToasts((prev) => [{ ...t, id }, ...prev].slice(0, 4));
      const timer = window.setTimeout(() => remove(id), durationMs);
      timers.current.set(id, timer);
    },
    [remove]
  );

  const api = useMemo<ToastContextValue>(
    () => ({
      push,
      remove,
      success: (message, opts) => push({ type: "success", message, ...opts }),
      error: (message, opts) => push({ type: "error", message, ...opts }),
      info: (message, opts) => push({ type: "info", message, ...opts }),
    }),
    [push, remove]
  );

  useEffect(() => {
    const onToast = (e: Event) => {
      const evt = e as CustomEvent<NotifyPayload>;
      if (!evt.detail?.message || !evt.detail?.type) return;
      api.push({
        type: evt.detail.type,
        message: evt.detail.message,
        title: evt.detail.title,
        durationMs: evt.detail.durationMs,
      });
    };
    window.addEventListener(__INTERNAL_TOAST_EVENT_NAME__, onToast);
    return () => window.removeEventListener(__INTERNAL_TOAST_EVENT_NAME__, onToast);
  }, [api]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        className="pointer-events-none fixed right-3 top-3 z-[9999] w-[min(420px,calc(100vw-24px))] space-y-2"
        aria-live="polite"
        aria-relevant="additions"
      >
        {toasts.map((t) => {
          const s = stylesFor(t.type);
          return (
            <div
              key={t.id}
              className={`pointer-events-auto flex items-start gap-3 rounded-2xl border px-3 py-3 shadow-lg shadow-slate-950/20 backdrop-blur ${s.bg} ring-1 ${s.ring}`}
              role="status"
            >
              <div
                className={`mt-0.5 inline-flex h-7 w-7 flex-none items-center justify-center rounded-full text-xs font-bold ${s.icon}`}
                aria-hidden="true"
              >
                {iconFor(t.type)}
              </div>
              <div className="min-w-0 flex-1">
                {t.title && (
                  <p className={`text-xs font-semibold leading-5 ${s.title}`}>{t.title}</p>
                )}
                <p className={`text-xs leading-5 ${s.message}`}>{t.message}</p>
              </div>
              <button
                type="button"
                onClick={() => api.remove(t.id)}
                className="rounded-full px-2 py-1 text-xs font-semibold text-white/80 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                aria-label="Đóng thông báo"
              >
                ×
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return ctx;
}

