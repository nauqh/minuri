"use client";

import { motion } from "motion/react";
import { TraitRadar } from "./trait-radar";
import type { JourneyIdentity } from "@/lib/journey/identity";

type Props = {
  memoryLines: Record<number, string>;
  daysCompleted: number[];
  traits: JourneyIdentity["traits"];
  primaryColor: string;
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

export function IdentityCardBack({ memoryLines, daysCompleted, traits, primaryColor }: Props) {
  const fullyUnlocked = daysCompleted.length >= 7;
  return (
    <div className="flex h-full flex-col px-5 py-5 text-minuri-ocean">
      {fullyUnlocked && memoryLines[0] && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="mb-4 rounded-lg bg-minuri-fog px-3 py-2.5"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-minuri-slate">
            You wanted to feel
          </p>
          <p className="mt-1 text-[12px] italic leading-relaxed text-minuri-ocean">
            &ldquo;{memoryLines[0]}&rdquo;
          </p>
        </motion.div>
      )}
      <p className="text-[11px] font-black uppercase tracking-[0.14em] text-minuri-slate">
        Your Week
      </p>
      <div className="mt-3 h-px w-full bg-minuri-silver" />

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
              <span className="mt-0.5 text-[10px] font-black text-minuri-slate shrink-0">
                D{day}
              </span>
              {isComplete ? (
                <p className="text-[11px] leading-relaxed text-minuri-ocean">{line}</p>
              ) : (
                <div
                  className="mt-1 h-2.5 w-full max-w-[180px] rounded-full bg-minuri-fog blur-[1px]"
                  aria-label={`Day ${day} memory locked`}
                  aria-hidden
                />
              )}
            </motion.li>
          );
        })}
      </ol>

      <div className="mt-4 pt-3 border-t border-minuri-silver">
        <p className="text-[9px] font-black uppercase tracking-[0.18em] text-minuri-slate mb-1">
          Traits
        </p>
        <div className="flex justify-center">
          <TraitRadar traits={traits} size={170} color={primaryColor} animate={false} />
        </div>
      </div>
    </div>
  );
}
