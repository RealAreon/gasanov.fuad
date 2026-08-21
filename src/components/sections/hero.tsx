"use client";

import { motion } from "framer-motion";
import { ArrowDownRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { MagneticButton } from "@/components/ui/magnetic-button";

const lineOne = "Fuad";
const lineTwo = "Gasanov";

function KineticWord({
  word,
  delay = 0,
  className,
}: {
  word: string;
  delay?: number;
  className?: string;
}) {
  return (
    <span className={className} aria-label={word}>
      {word.split("").map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          className="inline-block"
          initial={{ y: "110%", opacity: 0, rotateX: 40 }}
          animate={{ y: "0%", opacity: 1, rotateX: 0 }}
          transition={{
            duration: 0.85,
            delay: delay + i * 0.045,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
}

export function Hero() {
  const t = useTranslations("hero");

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-end overflow-hidden pb-16 pt-28 md:items-center md:pb-24 md:pt-32"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(94,234,212,0.14),transparent_55%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-size-[72px_72px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,black,transparent)]" />
        <motion.div
          aria-hidden
          className="absolute top-[18%] right-[8%] h-40 w-40 rounded-full border border-accent/25 md:h-56 md:w-56"
          animate={{ rotate: 360 }}
          transition={{ duration: 48, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          aria-hidden
          className="absolute top-[22%] right-[12%] h-24 w-24 rounded-full border border-dashed border-white/15 md:h-32 md:w-32"
          animate={{ rotate: -360 }}
          transition={{ duration: 36, repeat: Infinity, ease: "linear" }}
        />
        <div className="absolute top-[35%] left-[12%] h-2 w-2 rounded-full bg-accent/80 shadow-[0_0_24px_rgba(94,234,212,0.7)]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 md:px-6">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] tracking-[0.22em] text-zinc-400 uppercase"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          {t("badge")}
        </motion.p>

        <h1 className="font-display leading-[0.88] tracking-[-0.04em]">
          <span className="block overflow-hidden text-[clamp(3.6rem,14vw,9.5rem)] text-zinc-50">
            <KineticWord word={lineOne} />
          </span>
          <span className="mt-1 block overflow-hidden text-[clamp(3.6rem,14vw,9.5rem)] text-zinc-50">
            <KineticWord word={lineTwo} delay={0.28} />
            <motion.span
              className="ml-2 inline-block align-top text-accent"
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 1.05,
                type: "spring",
                stiffness: 220,
                damping: 16,
              }}
            >
              ✦
            </motion.span>
          </span>
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.85 }}
          className="mt-8 max-w-xl md:mt-10"
        >
          <p className="text-base leading-relaxed text-zinc-400 md:text-lg">
            <span className="text-zinc-200">{t("role")}</span>
            <span className="mx-2 text-zinc-600">—</span>
            {t("description")}
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <MagneticButton
              href="#works"
              className="bg-accent text-[#041512] shadow-[0_0_40px_rgba(94,234,212,0.25)] hover:bg-accent-soft"
            >
              {t("ctaPrimary")}
              <ArrowDownRight className="ml-1 inline size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
            </MagneticButton>
            <MagneticButton
              href="#contact"
              strength={0.3}
              className="border border-white/12 bg-white/[0.04] text-zinc-100 hover:border-white/25 hover:bg-white/[0.08]"
            >
              {t("ctaSecondary")}
            </MagneticButton>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
