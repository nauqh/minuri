"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

import { easeOut } from "@/components/landing/home-constants";
import { cn } from "@/lib/utils";

const SHOW_AFTER_PX = 360;
const SCROLL_UP_INTENT_PX = 10;
const SCROLL_DOWN_HIDE_PX = 10;
export function ScrollToTopButton() {
	const [visible, setVisible] = useState(false);
	const previousScrollYRef = useRef(0);

	useEffect(() => {
		const onScroll = () => {
			const currentScrollY = window.scrollY;
			const scrollDelta = previousScrollYRef.current - currentScrollY;
			const scrollingUp = scrollDelta > SCROLL_UP_INTENT_PX;
			const scrollingDown = scrollDelta < -SCROLL_DOWN_HIDE_PX;
			const canShow = currentScrollY > SHOW_AFTER_PX;

			setVisible((previousVisible) => {
				if (!canShow) return false;
				if (scrollingUp) return true;
				if (scrollingDown) return false;
				return previousVisible;
			});
			previousScrollYRef.current = currentScrollY;
		};

		previousScrollYRef.current = window.scrollY;
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	const scrollToTop = useCallback(() => {
		window.scrollTo({ top: 0, behavior: "smooth" });

		// Remove hash from URL
		if (window.location.hash) {
			window.history.replaceState(
				null,
				"",
				`${window.location.pathname}${window.location.search}`,
			);
		}
	}, []);

	return (
		<AnimatePresence>
			{visible ? (
				<motion.div
					className="fixed top-5 left-1/2 z-60 -translate-x-1/2 md:top-6"
					initial={{ opacity: 0, y: -12, scale: 0.92 }}
					animate={{ opacity: 1, y: 0, scale: 1 }}
					exit={{ opacity: 0, y: -12, scale: 0.92 }}
					transition={{ duration: 0.25, ease: easeOut }}
				>
					<button
						type="button"
						onClick={scrollToTop}
						className={cn(
							"minuri-button-motion flex size-11 cursor-pointer items-center justify-center rounded-full bg-minuri-teal text-xl leading-none font-semibold text-minuri-white shadow-[0_10px_30px_-10px_color-mix(in_oklch,var(--minuri-ocean)_58%,transparent)] backdrop-blur-sm hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-minuri-teal/60 focus-visible:ring-offset-2 focus-visible:ring-offset-minuri-fog active:scale-95",
						)}
						aria-label="Back to top"
					>
						<span aria-hidden="true">↑</span>
					</button>
				</motion.div>
			) : null}
		</AnimatePresence>
	);
}
