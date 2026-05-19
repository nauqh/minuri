"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

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
        <motion.div
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: -48 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -24, scale: 0.95 }}
          transition={{
            opacity: { duration: 0.28, ease: "easeOut" },
            y: { type: "spring", stiffness: 280, damping: 24 },
            scale: { duration: 0.2, ease: "easeIn" },
          }}
          className="fixed right-6 top-24 z-[60] w-52"
        >
          <button
            type="button"
            data-no-scale
            onClick={handleClick}
            aria-label={`Day ${day} complete — tap to see your card`}
            className="guide-sticky guide-sticky-b block w-full cursor-pointer text-left outline-none"
          >
            <motion.p
              className="text-xl leading-none"
              animate={{ rotate: [0, -14, 14, -7, 0], scale: [1, 1.45, 1] }}
              transition={{ duration: 0.65, ease: "easeOut" }}
            >
              ✦
            </motion.p>
            <p className="mt-2 text-[10px] font-black uppercase tracking-[0.16em] text-[#05292a]/50">
              Day {day} done
            </p>
            <p className="mt-1.5 text-sm font-bold leading-snug text-[#05292a]">
              Your card just updated
            </p>
            <p className="mt-1 text-xs leading-snug text-[#05292a]/70">
              Tap to open your identity card →
            </p>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
