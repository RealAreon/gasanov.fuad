"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  type HTMLMotionProps,
} from "framer-motion";
import { useRef, type MouseEvent, type ReactNode } from "react";
import {
  isHashHref,
  useSmoothScrollTo,
} from "@/hooks/use-smooth-scroll-to";
import { cn } from "@/lib/utils";

type MagneticButtonProps = {
  children: ReactNode;
  className?: string;
  strength?: number;
} & Omit<HTMLMotionProps<"a">, "children" | "ref">;

export function MagneticButton({
  children,
  className,
  strength = 0.35,
  href,
  onClick,
  ...props
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const scrollTo = useSmoothScrollTo();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 260, damping: 20, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 260, damping: 20, mass: 0.4 });

  const handleMove = (e: MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const offsetX = e.clientX - (rect.left + rect.width / 2);
    const offsetY = e.clientY - (rect.top + rect.height / 2);
    x.set(offsetX * strength);
    y.set(offsetY * strength);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (isHashHref(href)) {
      e.preventDefault();
      scrollTo(href!);
    }
    onClick?.(e);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={handleClick}
      whileTap={{ scale: 0.97 }}
      className={cn(
        "group relative inline-flex items-center justify-center gap-1 overflow-hidden rounded-full px-7 py-3.5 text-sm font-medium tracking-wide transition-colors",
        className,
      )}
      {...props}
    >
      <span className="relative z-10">{children}</span>
    </motion.a>
  );
}
