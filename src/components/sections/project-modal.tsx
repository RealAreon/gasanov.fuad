"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { useLenis } from "lenis/react";
import type { Project } from "@/lib/data";
import { cn } from "@/lib/utils";

type ProjectModalProps = {
  project: Project | null;
  onClose: () => void;
};

function preloadAspects(sources: string[]) {
  return Promise.all(
    sources.map(
      (src) =>
        new Promise<number>((resolve) => {
          const img = new window.Image();
          img.onload = () => {
            resolve(
              img.naturalWidth && img.naturalHeight
                ? img.naturalWidth / img.naturalHeight
                : 16 / 10,
            );
          };
          img.onerror = () => resolve(16 / 10);
          img.src = src;
        }),
    ),
  );
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const t = useTranslations("projects");
  const tWorks = useTranslations("works");
  const lenis = useLenis();
  const [activeScreen, setActiveScreen] = useState(0);
  const [aspects, setAspects] = useState<number[]>([16 / 10, 16 / 10, 16 / 10]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!project) return;

    setActiveScreen(0);
    setReady(false);
    lenis?.stop();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    let cancelled = false;
    preloadAspects([...project.screens]).then((ratios) => {
      if (cancelled) return;
      setAspects(ratios);
      setReady(true);
    });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") {
        setActiveScreen((v) => Math.min(2, v + 1));
      }
      if (e.key === "ArrowLeft") {
        setActiveScreen((v) => Math.max(0, v - 1));
      }
    };
    window.addEventListener("keydown", onKey);

    return () => {
      cancelled = true;
      lenis?.start();
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [project, onClose, lenis]);

  // Keep one stable frame size for the whole project — no resize on thumbnail click
  const aspect = aspects[0] ?? 16 / 10;

  const frameStyle = useMemo(
    () => ({
      aspectRatio: aspect,
      maxHeight: "calc(92dvh - 7.5rem)",
      width: `min(100%, calc((92dvh - 7.5rem) * ${aspect}))`,
    }),
    [aspect],
  );

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28 }}
        >
          <motion.button
            type="button"
            aria-label={tWorks("close")}
            className="absolute inset-0 bg-black/65 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={t(`${project.id}.title`)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex max-h-[92dvh] w-full max-w-4xl flex-col items-center gap-3"
            data-lenis-prevent
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute top-2 right-2 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/55 text-zinc-200 backdrop-blur-md transition-colors hover:border-accent/40 hover:text-accent"
              aria-label={tWorks("close")}
            >
              <X size={18} />
            </button>

            <motion.div
              className="relative max-w-full overflow-hidden rounded-[1.5rem] border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.55)] [transform:translateZ(0)] [isolation:isolate] sm:rounded-[1.75rem]"
              style={frameStyle}
              initial={false}
              animate={{ opacity: ready ? 1 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {project.screens.map((src, i) => (
                <div
                  key={src}
                  className={cn(
                    "absolute inset-0 overflow-hidden rounded-[inherit] transition-opacity duration-200",
                    i === activeScreen
                      ? "opacity-100"
                      : "pointer-events-none opacity-0",
                  )}
                >
                  <Image
                    src={src}
                    alt={`${t(`${project.id}.title`)} ${i + 1}`}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 100vw, 900px"
                    priority={i === 0}
                  />
                </div>
              ))}
            </motion.div>

            <div className="mx-auto grid w-full max-w-xl shrink-0 grid-cols-3 gap-2 sm:gap-3">
              {project.screens.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setActiveScreen(i)}
                  className={cn(
                    "relative h-[4.5rem] w-full overflow-hidden rounded-xl border transition-all [transform:translateZ(0)] [isolation:isolate] sm:h-24 sm:rounded-2xl",
                    activeScreen === i
                      ? "border-accent shadow-[0_0_0_1px_rgba(94,234,212,0.35)]"
                      : "border-white/20 opacity-85 hover:opacity-100",
                  )}
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    className="object-cover object-top"
                    sizes="180px"
                  />
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
