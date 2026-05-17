"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpFromLine } from "lucide-react";

type Props = {
  day: number;
  visible: boolean;
  onDone: () => void;
  onOpenCard: () => void;
};

export function CardEarnToast({ day, visible, onDone, onOpenCard }: Props) {
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(onDone, 4000);
    return () => clearTimeout(t);
  }, [visible, onDone]);

  function handleClick() {
    onDone();
    onOpenCard();
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          data-no-scale
          className="fixed left-1/2 top-6 z-[60] -translate-x-1/2 cursor-pointer outline-none"
          initial={{ opacity: 0, y: -28, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.96 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          onClick={handleClick}
          role="status"
          aria-live="polite"
          aria-label={`Day ${day} complete — tap to see your card`}
        >
          <div className="flex items-center gap-3.5 rounded-2xl border border-minuri-teal/25 bg-white px-5 py-3.5 shadow-lg shadow-black/8">
            <motion.span
              className="text-xl leading-none"
              animate={{ rotate: [0, -14, 14, -7, 0], scale: [1, 1.45, 1] }}
              transition={{ duration: 0.65, ease: "easeOut" }}
            >
              ✦
            </motion.span>
            <div className="text-left">
              <p className="text-sm font-black text-minuri-ocean">
                Day {day} complete!
              </p>
              <p className="mt-0.5 text-xs font-semibold text-minuri-teal">
                Your card updated — tap to see <ArrowUpFromLine className="inline size-3 translate-y-[-1px]" />
              </p>
            </div>
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
