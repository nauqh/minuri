"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";

type BookmarkToastProps = {
	visible: boolean;
	hasJourney: boolean;
	onDone: () => void;
};

export function BookmarkToast({ visible, hasJourney, onDone }: BookmarkToastProps) {
	useEffect(() => {
		if (!visible) return;
		const timer = setTimeout(onDone, 4000);
		return () => clearTimeout(timer);
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
					className="fixed right-6 top-20 z-[60] w-56"
				>
					<div className="guide-sticky guide-sticky-a">
						<p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#05292a]/50">
							{hasJourney ? "Your Story" : "Guides"}
						</p>
						<p className="mt-1.5 text-sm font-bold leading-snug text-[#05292a]">
							{hasJourney ? "Added to your story" : "Guide saved"}
						</p>
						<p className="mt-1 text-xs leading-snug text-[#05292a]/70">
							{hasJourney
								? "Showing in your journey plan."
								: "Build your first week to put this in context."}
						</p>
						<Link
							href={hasJourney ? "/journey/plan" : "/journey"}
							onClick={onDone}
							className="mt-3 inline-flex text-xs font-semibold text-[#05292a] hover:underline"
						>
							{hasJourney ? "View journey →" : "Start journey →"}
						</Link>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
