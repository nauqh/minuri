"use client";

import { ChevronUp } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

import { easeOut } from "@/components/landing/home-constants";
import { cn } from "@/lib/utils";

const SHOW_AFTER_PX = 360;
const TRACKED_SECTION_IDS = ["service", "care", "contact"] as const;

type ScrollToTopButtonProps = {
	trackedSectionIds?: readonly string[];
};

export function ScrollToTopButton({
	trackedSectionIds = TRACKED_SECTION_IDS,
}: ScrollToTopButtonProps) {
	const [visible, setVisible] = useState(false);
	const previousScrollYRef = useRef(0);

	useEffect(() => {
		const isInTrackedSection = () => {
			if (trackedSectionIds.length === 0) {
				return true;
			}

			const viewportCenterY = window.innerHeight * 0.5;

			return trackedSectionIds.some((id) => {
				const section = document.getElementById(id);
				if (!section) return false;

				const rect = section.getBoundingClientRect();
				return (
					rect.top <= viewportCenterY &&
					rect.bottom >= viewportCenterY
				);
			});
		};

		const onScroll = () => {
			const currentScrollY = window.scrollY;
			const scrollingUp = currentScrollY < previousScrollYRef.current;
			const shouldShow =
				currentScrollY > SHOW_AFTER_PX &&
				scrollingUp &&
				isInTrackedSection();

			setVisible(shouldShow);
			previousScrollYRef.current = currentScrollY;
		};

		previousScrollYRef.current = window.scrollY;
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, [trackedSectionIds]);

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
							"minuri-button-motion flex size-11 cursor-pointer items-center justify-center rounded-full border border-minuri-teal/70 bg-minuri-teal text-minuri-white shadow-[0_10px_30px_-10px_color-mix(in_oklch,var(--minuri-ocean)_58%,transparent)] backdrop-blur-sm hover:scale-115 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-minuri-teal/60 focus-visible:ring-offset-2 focus-visible:ring-offset-minuri-fog active:scale-95",
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
