"use client";

import { ChevronUp } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";

import { easeOut } from "@/components/landing/home-constants";
import { cn } from "@/lib/utils";

const SHOW_AFTER_PX = 360;

export function ScrollToTopButton() {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const onScroll = () => setVisible(window.scrollY > SHOW_AFTER_PX);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	const scrollToTop = useCallback(() => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	}, []);

	return (
		<AnimatePresence>
			{visible ? (
				<motion.div
					className="fixed right-4 bottom-6 z-60 md:right-8 md:bottom-8"
					initial={{ opacity: 0, y: 12, scale: 0.92 }}
					animate={{ opacity: 1, y: 0, scale: 1 }}
					exit={{ opacity: 0, y: 12, scale: 0.92 }}
					transition={{ duration: 0.25, ease: easeOut }}
				>
					<button
						type="button"
						onClick={scrollToTop}
						className={cn(
							"flex size-11 cursor-pointer items-center justify-center rounded-full border border-minuri-silver/40 bg-minuri-white/95 text-minuri-slate shadow-[0_8px_28px_-8px_color-mix(in_oklch,var(--minuri-ocean)_28%,transparent)] backdrop-blur-sm transition-transform duration-200 ease-out hover:scale-105 hover:border-minuri-teal/35 hover:text-minuri-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-minuri-teal/40 focus-visible:ring-offset-2 focus-visible:ring-offset-minuri-fog active:scale-95",
						)}
						aria-label="Back to top"
					>
						<ChevronUp className="size-5" aria-hidden />
					</button>
				</motion.div>
			) : null}
		</AnimatePresence>
	);
}
