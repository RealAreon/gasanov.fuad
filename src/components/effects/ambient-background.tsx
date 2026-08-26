"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useIsDesktop } from "@/hooks/use-media-query";

const orbs = [
  {
    className:
      "top-[-8%] left-[-6%] h-[42vw] max-h-[520px] w-[42vw] max-w-[520px] bg-accent/25",
    duration: 22,
  },
  {
    className:
      "top-[18%] right-[-8%] h-[36vw] max-h-[460px] w-[36vw] max-w-[460px] bg-sky-400/20",
    duration: 28,
  },
  {
    className:
      "top-[55%] left-[8%] h-[28vw] max-h-[380px] w-[28vw] max-w-[380px] bg-fuchsia-400/16",
    duration: 26,
  },
  {
    className:
      "bottom-[-6%] right-[12%] h-[34vw] max-h-[440px] w-[34vw] max-w-[440px] bg-amber-300/14",
    duration: 24,
  },
];

export function AmbientBackground() {
  const isDesktop = useIsDesktop();
  const reduceMotion = useReducedMotion();
  const animate = isDesktop && !reduceMotion;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[#050507]" />

      {/* Mobile: soft radial washes — no animated blur filters (GPU killers). */}
      {!animate && (
        <>
          <div className="absolute top-[-10%] left-[-15%] h-[55vmax] w-[55vmax] rounded-full bg-[radial-gradient(circle,rgba(94,234,212,0.18),transparent_68%)]" />
          <div className="absolute top-[20%] right-[-20%] h-[45vmax] w-[45vmax] rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.12),transparent_70%)]" />
          <div className="absolute bottom-[-15%] left-[10%] h-[40vmax] w-[40vmax] rounded-full bg-[radial-gradient(circle,rgba(232,121,249,0.08),transparent_70%)]" />
        </>
      )}

      {animate &&
        orbs.map((orb, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full blur-3xl ${orb.className}`}
            animate={{
              x: [0, 40, -20, 0],
              y: [0, -30, 25, 0],
              scale: [1, 1.12, 0.94, 1],
            }}
            transition={{
              duration: orb.duration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

      {animate && (
        <>
          <motion.div
            className="absolute top-[12%] left-[45%] h-64 w-64 rounded-full border border-accent/20"
            animate={{ rotate: 360 }}
            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute top-[16%] left-[48%] h-40 w-40 rounded-full border border-dashed border-white/10"
            animate={{ rotate: -360 }}
            transition={{ duration: 36, repeat: Infinity, ease: "linear" }}
          />
        </>
      )}

      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[72px_72px] opacity-40 md:opacity-50 [mask-image:radial-gradient(ellipse_75%_65%_at_50%_30%,black,transparent)]" />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(94,234,212,0.12),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(167,139,250,0.08),transparent_40%)]" />
    </div>
  );
}
