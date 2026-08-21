"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState, useRef } from "react";
import { ProjectModal } from "@/components/sections/project-modal";
import { Reveal, staggerContainer, staggerItem } from "@/components/ui/reveal";
import { projects, type Project } from "@/lib/data";
import { cn } from "@/lib/utils";

function ProjectCard({
  project,
  index,
  onOpen,
}: {
  project: Project;
  index: number;
  onOpen: (project: Project) => void;
}) {
  const t = useTranslations("projects");
  const tWorks = useTranslations("works");
  const ref = useRef<HTMLButtonElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  const glow = useMotionTemplate`radial-gradient(280px circle at ${mouseX}px ${mouseY}px, ${project.accent}33, transparent 55%)`;

  const handleMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <motion.button
      type="button"
      ref={ref}
      variants={staggerItem}
      onMouseMove={handleMove}
      onClick={() => onOpen(project)}
      className={cn(
        "group relative isolate flex min-h-[280px] w-full flex-col justify-between overflow-hidden rounded-[1.6rem] border border-white/10 bg-[#0F0F14] p-4 text-left [transform:translateZ(0)] md:min-h-[320px] md:p-5",
        project.span,
      )}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: glow }}
      />
      <div
        className="pointer-events-none absolute inset-0 rounded-[1.6rem] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          boxShadow: `inset 0 0 0 1px ${project.accent}55, 0 0 48px ${project.accent}22`,
        }}
      />

      {/* Clip layer for parallax image — keeps radius at any zoom */}
      <div className="relative mb-5 isolate overflow-hidden rounded-2xl border border-white/8 bg-[#16161C] [transform:translateZ(0)] [mask-image:radial-gradient(white,black)]">
        <div className="relative aspect-[16/10] overflow-hidden rounded-2xl">
          <motion.div
            className="absolute inset-[-12%] will-change-transform"
            style={{ y: imageY }}
          >
            <div className="relative h-full w-full">
              <Image
                src={project.image}
                alt={t(`${project.id}.title`)}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                priority={index < 2}
              />
            </div>
          </motion.div>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0F0F14]/70 via-transparent to-transparent opacity-80" />
          <div className="absolute top-4 left-4 font-display text-xs tracking-[0.2em] text-white/70 uppercase">
            0{index + 1}
          </div>
        </div>
      </div>

      <div className="relative z-10 px-1 pb-1">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-[11px] tracking-[0.18em] text-zinc-500 uppercase">
            {t(`${project.id}.category`)} · {project.year}
          </p>
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-zinc-400 transition-all duration-300 group-hover:rotate-12 group-hover:border-accent/40 group-hover:text-accent">
            <ArrowUpRight size={15} />
          </span>
        </div>
        <h3 className="font-display text-xl text-zinc-50 md:text-2xl">
          {t(`${project.id}.title`)}
        </h3>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-zinc-400">
          {t(`${project.id}.description`)}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/8 bg-white/[0.03] px-2.5 py-1 text-[11px] text-zinc-400"
            >
              {tag}
            </span>
          ))}
          <span className="ml-auto text-[11px] tracking-wide text-zinc-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            {tWorks("viewProject")}
          </span>
        </div>
      </div>
    </motion.button>
  );
}

export function Works() {
  const t = useTranslations("works");
  const [active, setActive] = useState<Project | null>(null);

  return (
    <section id="works" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5 md:px-6">
        <Reveal className="mb-12 md:mb-16">
          <p className="mb-3 text-[11px] tracking-[0.24em] text-accent uppercase">
            {t("eyebrow")}
          </p>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <h2 className="font-display max-w-xl text-3xl tracking-tight text-zinc-50 md:text-5xl">
              {t("title")}
            </h2>
            <p className="max-w-sm text-sm leading-relaxed text-zinc-400 md:text-base">
              {t("subtitle")}
            </p>
          </div>
        </Reveal>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-8% 0px" }}
          className="grid grid-cols-1 gap-4 md:auto-rows-[minmax(320px,auto)] md:grid-cols-3 md:gap-5"
        >
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              onOpen={setActive}
            />
          ))}
        </motion.div>
      </div>

      <ProjectModal project={active} onClose={() => setActive(null)} />
    </section>
  );
}
