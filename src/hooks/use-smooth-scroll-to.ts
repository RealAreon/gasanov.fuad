"use client";

import { useLenis } from "lenis/react";
import { useCallback } from "react";

export function useSmoothScrollTo() {
  const lenis = useLenis();

  return useCallback(
    (target: string | number | HTMLElement, options?: { offset?: number }) => {
      const offset = options?.offset ?? -96;

      if (lenis) {
        lenis.scrollTo(target, {
          offset,
          duration: 1.35,
          easing: (t: number) =>
            t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
        });
        return;
      }

      if (typeof target === "string" && target.startsWith("#")) {
        const el = document.querySelector(target);
        if (el) {
          const top =
            el.getBoundingClientRect().top + window.scrollY + offset;
          window.scrollTo({ top, behavior: "smooth" });
        }
      }
    },
    [lenis],
  );
}

export function isHashHref(href?: string | null) {
  return Boolean(href && href.startsWith("#"));
}
