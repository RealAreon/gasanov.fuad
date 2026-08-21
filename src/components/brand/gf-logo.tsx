"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type GfLogoProps = {
  className?: string;
  size?: number;
};

export function GfLogo({ className, size = 40 }: GfLogoProps) {
  return (
    <motion.span
      aria-label="GF — Fuad Gasanov"
      className={cn(
        "group relative inline-flex items-center justify-center overflow-hidden rounded-2xl border border-white/12 bg-[#0C0C10]",
        className,
      )}
      style={{ width: size, height: size }}
      whileHover={{ scale: 1.06 }}
      transition={{ type: "spring", stiffness: 320, damping: 20 }}
    >
      <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(94,234,212,0.28),transparent_58%)]" />
      <span className="pointer-events-none absolute inset-px rounded-[14px] border border-white/5" />

      <span
        className="relative z-10 flex items-end justify-center gap-[1px] font-display font-bold leading-none tracking-[-0.08em]"
        style={{ fontSize: size * 0.38 }}
      >
        <span className="text-zinc-50">G</span>
        <span className="text-accent">F</span>
      </span>
    </motion.span>
  );
}
