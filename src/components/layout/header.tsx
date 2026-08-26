"use client";

import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import type { MouseEvent } from "react";
import { useState } from "react";
import { GfLogo } from "@/components/brand/gf-logo";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { useSmoothScrollTo } from "@/hooks/use-smooth-scroll-to";
import { navLinks } from "@/lib/data";
import { cn } from "@/lib/utils";

export function Header() {
  const t = useTranslations("nav");
  const scrollTo = useSmoothScrollTo();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (value) => {
    setScrolled(value > 24);
  });

  const handleNavClick =
    (href: string, closeMenu = false) =>
    (e: MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      if (closeMenu) setOpen(false);
      // slight delay so mobile menu can close first
      requestAnimationFrame(() => scrollTo(href));
    };

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-6"
    >
      <div
        className={cn(
          "mx-auto flex max-w-6xl items-center justify-between rounded-2xl border px-3 py-2.5 transition-all duration-500 md:px-4",
          scrolled
            ? "border-white/10 bg-[#0A0A0C]/85 shadow-[0_8px_40px_rgba(0,0,0,0.45)] backdrop-blur-md md:bg-[#0A0A0C]/70 md:backdrop-blur-xl"
            : "border-transparent bg-transparent",
        )}
      >
        <a
          href="#top"
          onClick={handleNavClick("#top")}
          className="inline-flex items-center gap-3"
        >
          <GfLogo size={42} />
        </a>

        <nav className="hidden items-center gap-1.5 md:flex">
          {navLinks.map((link) => (
            <motion.a
              key={link.href}
              href={link.href}
              onClick={handleNavClick(link.href)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="group relative rounded-full px-4 py-2 text-sm text-zinc-400 transition-colors duration-300 hover:text-zinc-50"
            >
              <span className="absolute inset-0 rounded-full bg-white/0 transition-colors duration-300 group-hover:bg-white/[0.06]" />
              <span className="absolute inset-x-3 bottom-1 h-px origin-left scale-x-0 bg-accent transition-transform duration-300 ease-out group-hover:scale-x-100" />
              <span className="relative">{t(link.key)}</span>
            </motion.a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <LanguageSwitcher />
          <MagneticButton
            href="#contact"
            strength={0.4}
            className="border border-accent/30 bg-accent/10 text-accent hover:bg-accent/20"
          >
            {t("write")}
          </MagneticButton>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitcher />
          <button
            type="button"
            aria-label={open ? t("closeMenu") : t("openMenu")}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-zinc-200"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto mt-2 max-w-6xl rounded-2xl border border-white/10 bg-[#0A0A0C]/90 p-3 backdrop-blur-xl md:hidden"
        >
          <div className="flex flex-col gap-1.5">
            {navLinks.map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                onClick={handleNavClick(link.href, true)}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl px-3 py-3 text-sm text-zinc-300 transition-colors hover:bg-white/5 hover:text-white"
              >
                {t(link.key)}
              </motion.a>
            ))}
            <a
              href="#contact"
              onClick={handleNavClick("#contact", true)}
              className="mt-1 rounded-xl bg-accent/15 px-3 py-3 text-center text-sm text-accent"
            >
              {t("write")}
            </a>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
