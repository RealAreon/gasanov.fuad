"use client";

import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import type { ReactNode } from "react";

export function PageTransition({ children }: { children: ReactNode }) {
  const locale = useLocale();

  return (
    <motion.div
      key={locale}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
