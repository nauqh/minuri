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
					initial={{ opacity: 0, y: 12 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: 12 }}
					transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
					className="fixed bottom-6 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-4 rounded-2xl border border-minuri-silver/60 bg-minuri-white px-4 py-3 shadow-lg"
				>
					<div className="min-w-0">
						<p className="text-sm font-semibold text-minuri-ocean">
							{hasJourney ? "Added to your story" : "Saved"}
						</p>
						<p className="mt-0.5 text-xs text-minuri-slate">
							{hasJourney
								? "Showing in your journey plan."
								: "Build your first week to put this in context."}
						</p>
					</div>
					<Link
						href={hasJourney ? "/journey/plan" : "/journey"}
						onClick={onDone}
						className="shrink-0 whitespace-nowrap rounded-full bg-minuri-teal px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-minuri-ocean"
					>
						{hasJourney ? "View journey →" : "Start journey →"}
					</Link>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
