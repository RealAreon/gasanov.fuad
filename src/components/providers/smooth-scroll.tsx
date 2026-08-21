"use client";

import { ReactLenis } from "lenis/react";
import type { ReactNode } from "react";

export function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.075,
        duration: 1.35,
        smoothWheel: true,
        syncTouch: false,
        anchors: false,
        prevent: (node) => node.closest("[data-lenis-prevent]") !== null,
      }}
    >
      {children}
    </ReactLenis>
  );
}
