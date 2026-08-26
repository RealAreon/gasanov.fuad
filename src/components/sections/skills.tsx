"use client";

import { motion } from "framer-motion";
import {
  Boxes,
  Code2,
  Component,
  Layers3,
  Palette,
  PenTool,
  Sparkles,
  Wind,
  Zap,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Marquee } from "@/components/ui/marquee";
import { Reveal } from "@/components/ui/reveal";
import { skills } from "@/lib/data";

const iconMap = [
  Code2,
  Wind,
  PenTool,
  Palette,
  Sparkles,
  Layers3,
  Boxes,
  Zap,
  Component,
];

function SkillChip({
  name,
  category,
  index,
}: {
  name: string;
  category: string;
  index: number;
}) {
  const t = useTranslations("skillCategories");
  const Icon = iconMap[index % iconMap.length];

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.04 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      className="group relative flex min-w-[180px] items-center gap-3 rounded-2xl border border-white/10 bg-[#111116] px-4 py-3.5 md:bg-[#111116]/80 md:backdrop-blur-sm"
    >
      <span className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100 [background:radial-gradient(circle_at_30%_20%,rgba(94,234,212,0.18),transparent_55%)]" />
      <span className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-accent transition-colors duration-300 group-hover:border-accent/40">
        <Icon size={18} />
      </span>
      <span className="relative">
        <span className="block text-sm font-medium text-zinc-100">{name}</span>
        <span className="block text-[11px] tracking-wide text-zinc-500">
          {t(category as "Frontend")}
        </span>
      </span>
    </motion.div>
  );
}

export function Skills() {
  const t = useTranslations("skills");
  const rowA = skills.slice(0, 6);
  const rowB = skills.slice(6);

  return (
    <section id="stack" className="relative py-24 md:py-32">
      <div className="mx-auto mb-12 max-w-6xl px-5 md:mb-16 md:px-6">
        <Reveal>
          <p className="mb-3 text-[11px] tracking-[0.24em] text-accent uppercase">
            {t("eyebrow")}
          </p>
          <h2 className="font-display max-w-2xl text-3xl tracking-tight text-zinc-50 md:text-5xl">
            {t("title")}
          </h2>
        </Reveal>
      </div>

      <div className="space-y-4">
        <Marquee speed={38}>
          {rowA.map((skill, i) => (
            <SkillChip
              key={skill.name}
              name={skill.name}
              category={skill.category}
              index={i}
            />
          ))}
        </Marquee>
        <Marquee speed={42} reverse>
          {rowB.map((skill, i) => (
            <SkillChip
              key={skill.name}
              name={skill.name}
              category={skill.category}
              index={i + 3}
            />
          ))}
        </Marquee>
      </div>
    </section>
  );
}
