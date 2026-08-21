"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type MarqueeProps = {
  children: React.ReactNode;
  className?: string;
  speed?: number;
  reverse?: boolean;
  pauseOnHover?: boolean;
};

export function Marquee({
  children,
  className,
  speed = 40,
  reverse = false,
  pauseOnHover = true,
}: MarqueeProps) {
  return (
    <div
      className={cn(
        "group relative flex overflow-hidden",
        "[mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]",
        className,
      )}
    >
      <motion.div
        className={cn(
          "flex min-w-full shrink-0 items-center gap-4 py-2",
          pauseOnHover && "group-hover:[animation-play-state:paused]",
        )}
        animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: speed,
            ease: "linear",
          },
        }}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}
