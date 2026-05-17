"use client";

import { motion } from "motion/react";
import type { PaletteColor } from "@/lib/journey/identity";

type Props = {
  palette: [PaletteColor, PaletteColor, PaletteColor];
  saturation?: number;
  animate?: boolean;
  size?: "sm" | "md" | "lg";
};

const SIZES = {
  sm: { circle: 28, text: "text-[10px]" },
  md: { circle: 36, text: "text-xs" },
  lg: { circle: 48, text: "text-sm" },
};

export function PaletteSwatch({ palette, saturation = 100, animate = true, size = "md" }: Props) {
  const { circle, text } = SIZES[size];

  return (
    <div className="flex flex-col gap-2">
      {palette.map((color, i) => (
        <motion.div
          key={color.hex}
          className="flex items-center gap-2.5"
          initial={animate ? { opacity: 0, scale: 0.5 } : { opacity: 1, scale: 1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.5,
            delay: animate ? i * 0.12 : 0,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <div
            className="shrink-0 rounded-full shadow-sm ring-1 ring-black/10"
            style={{
              width: circle,
              height: circle,
              backgroundColor: color.hex,
              filter: `saturate(${saturation}%)`,
            }}
            aria-hidden
          />
          <span className={`${text} font-medium text-current opacity-70`}>
            {color.name}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
