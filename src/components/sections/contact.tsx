"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import type { MouseEvent } from "react";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { Reveal, staggerContainer, staggerItem } from "@/components/ui/reveal";
import { useSmoothScrollTo } from "@/hooks/use-smooth-scroll-to";
import { siteConfig, socials } from "@/lib/data";

export function Contact() {
  const t = useTranslations("contact");
  const tSocials = useTranslations("socials");
  const scrollTo = useSmoothScrollTo();

  const handleBackToTop = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    scrollTo("#top", { offset: 0 });
  };

  return (
    <section
      id="contact"
      className="relative overflow-hidden pt-24 pb-10 md:pt-32"
    >
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-[radial-gradient(ellipse_at_bottom,rgba(94,234,212,0.12),transparent_60%)]" />

      <div className="relative mx-auto max-w-6xl px-5 md:px-6">
        <Reveal>
          <p className="mb-3 text-[11px] tracking-[0.24em] text-accent uppercase">
            {t("eyebrow")}
          </p>
          <h2 className="font-display max-w-3xl text-4xl leading-[1.05] tracking-tight text-zinc-50 md:text-6xl lg:text-7xl">
            {t("title")}
            <span className="text-zinc-500"> {t("titleAccent")}</span>
          </h2>
        </Reveal>

        <Reveal delay={0.1} className="mt-8 flex flex-wrap items-center gap-4">
          <MagneticButton
            href={`mailto:${siteConfig.email}`}
            className="bg-accent text-[#041512] shadow-[0_0_40px_rgba(94,234,212,0.22)] hover:bg-accent-soft"
          >
            {siteConfig.email}
          </MagneticButton>
          <p className="text-sm text-zinc-500">{t("location")}</p>
        </Reveal>

        <motion.ul
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10% 0px" }}
          className="mt-16 border-t border-white/10 md:mt-24"
        >
          {socials.map((social) => (
            <motion.li
              key={social.key}
              variants={staggerItem}
              className="border-b border-white/10"
            >
              <a
                href={social.href}
                target={social.href.startsWith("http") ? "_blank" : undefined}
                rel={
                  social.href.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
                className="group flex items-center justify-between gap-4 py-6 md:py-8"
              >
                <div>
                  <p className="text-[11px] tracking-[0.2em] text-zinc-500 uppercase">
                    {tSocials(social.key)}
                  </p>
                  <p className="font-display mt-2 text-2xl text-zinc-100 transition-colors duration-300 group-hover:text-accent md:text-4xl">
                    {social.handle}
                  </p>
                </div>
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/12 text-zinc-400 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:border-accent/50 group-hover:bg-accent/10 group-hover:text-accent">
                  <ArrowUpRight size={18} />
                </span>
              </a>
            </motion.li>
          ))}
        </motion.ul>

        <footer className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-white/8 py-8 text-sm text-zinc-500 md:flex-row md:items-center">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. {t("copyright")}
          </p>
          <a
            href="#top"
            onClick={handleBackToTop}
            className="text-zinc-400 transition-colors hover:text-accent"
          >
            {t("backToTop")} ↑
          </a>
        </footer>
      </div>
    </section>
  );
}
