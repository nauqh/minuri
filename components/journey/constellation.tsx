"use client";

import { motion } from "motion/react";

type Props = {
  total?: number;
  lit: number;
  size?: number;
};

export function Constellation({ total = 7, lit, size = 16 }: Props) {
  return (
    <div
      className="flex items-center gap-1.5"
      aria-label={`${lit} of ${total} stars lit`}
      role="img"
    >
      {Array.from({ length: total }, (_, i) => {
        const isLit = i < lit;
        return (
          <motion.span
            key={i}
            initial={{ scale: 0.6, opacity: 0.3 }}
            animate={
              isLit
                ? { scale: 1, opacity: 1 }
                : { scale: 0.7, opacity: 0.25 }
            }
            transition={{
              duration: 0.4,
              delay: isLit ? i * 0.08 : 0,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{ fontSize: size, lineHeight: 1 }}
            aria-hidden
          >
            {isLit ? "✦" : "✧"}
          </motion.span>
        );
      })}
    </div>
  );
}
