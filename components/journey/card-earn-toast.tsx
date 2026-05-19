"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

type Props = {
  day: number;
  visible: boolean;
  onDone: () => void;
};

export function CardEarnToast({ day, visible, onDone }: Props) {
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(onDone, 4500);
    return () => clearTimeout(t);
  }, [visible, onDone]);

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
          <div
            data-no-scale
            className="guide-sticky guide-sticky-b block w-full text-left"
          >
            <motion.p
              className="text-2xl leading-none"
              animate={{ scale: [1, 1.5, 0.9, 1.2, 1], rotate: [0, -10, 10, -5, 0] }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              🌱
            </motion.p>
            <p className="mt-2 text-[10px] font-black uppercase tracking-[0.16em] text-[#05292a]/50">
              Day {day} complete
            </p>
            <p className="mt-1.5 text-sm font-bold leading-snug text-[#05292a]">
              Your plant just grew
            </p>
            <p className="mt-1 text-xs leading-snug text-[#05292a]/70">
              {day} of 7 days — keep going
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
