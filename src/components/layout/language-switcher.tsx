"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Globe } from "lucide-react";
import { useLocale } from "next-intl";
import { useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import {
  localeFlags,
  localeNames,
  locales,
  type Locale,
} from "@/i18n/routing";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onPointerDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, []);

  const switchLocale = (next: Locale) => {
    if (next === locale) {
      setOpen(false);
      return;
    }
    startTransition(() => {
      router.replace(pathname, { locale: next });
      setOpen(false);
    });
  };

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <motion.button
        type="button"
        aria-label="Language"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.97 }}
        className={cn(
          "inline-flex h-10 items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 text-xs font-medium tracking-wide text-zinc-300 transition-colors hover:border-accent/35 hover:bg-accent/10 hover:text-accent",
          pending && "opacity-70",
        )}
      >
        <Globe size={14} />
        <span>{localeFlags[locale]}</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-[calc(100%+10px)] right-0 z-50 min-w-[190px] overflow-hidden rounded-2xl border border-white/10 bg-[#0B0B0F]/95 p-1.5 shadow-[0_20px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl"
          >
            {locales.map((code) => {
              const active = code === locale;
              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => switchLocale(code)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition-colors",
                    active
                      ? "bg-accent/12 text-accent"
                      : "text-zinc-300 hover:bg-white/5 hover:text-white",
                  )}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="w-6 text-[11px] tracking-wide text-zinc-500">
                      {localeFlags[code]}
                    </span>
                    {localeNames[code]}
                  </span>
                  {active && <Check size={14} />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
