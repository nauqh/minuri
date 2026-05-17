"use client";

import { motion } from "motion/react";

type Props = {
  memoryLines: Record<number, string>;
  daysCompleted: number[];
};

const FALLBACK_LINES: Record<number, string> = {
  1: "The evening you figured out what was in the fridge.",
  2: "The afternoon you got your Medicare card sorted.",
  3: "The morning you found a coffee spot that felt like yours.",
  4: "The day you stopped checking Google Maps every five minutes.",
  5: "The afternoon you actually cooked something from scratch.",
  6: "The first time you said hi to someone at the café.",
  7: "The week you became a Melburnian.",
};

export function IdentityCardBack({ memoryLines, daysCompleted }: Props) {
  return (
    <div className="flex h-full flex-col px-5 py-5">
      <p className="text-[11px] font-black uppercase tracking-[0.14em] opacity-40">
        Your Week
      </p>
      <div className="mt-3 h-px w-full bg-current opacity-10" />

      <ol className="mt-4 flex flex-1 flex-col gap-2.5">
        {Array.from({ length: 7 }, (_, i) => {
          const day = i + 1;
          const isComplete = daysCompleted.includes(day);
          const line = memoryLines[day] ?? FALLBACK_LINES[day];

          return (
            <motion.li
              key={day}
              className="flex items-start gap-2.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
            >
              <span className="mt-0.5 text-[10px] font-black opacity-30 shrink-0">
                D{day}
              </span>
              {isComplete ? (
                <p className="text-[11px] leading-relaxed opacity-75">{line}</p>
              ) : (
                <div
                  className="mt-1 h-2.5 w-full max-w-[180px] rounded-full bg-current opacity-10 blur-[1px]"
                  aria-label={`Day ${day} memory locked`}
                  aria-hidden
                />
              )}
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
}
