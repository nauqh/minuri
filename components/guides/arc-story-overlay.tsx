"use client";

import { AnimatePresence, motion, type Transition } from "motion/react";
import { X } from "lucide-react";

import { easeOut } from "@/components/landing/home-constants";
import { GUIDE_ARCS, GUIDES, type GuideArcSlug } from "@/content/guides";
import { cn } from "@/lib/utils";

type ArcStoryOverlayProps = {
	isOpen: boolean;
	onClose: () => void;
	selectedArcSlug: GuideArcSlug;
	onSelectArc: (slug: GuideArcSlug) => void;
	prefersReducedMotion: boolean;
};

export function ArcStoryOverlay({
	isOpen,
	onClose,
	selectedArcSlug,
	onSelectArc,
	prefersReducedMotion,
}: ArcStoryOverlayProps) {
	const backdropTransition: Transition = {
		duration: prefersReducedMotion ? 0.01 : 0.28,
		ease: easeOut,
	};
	const drawerTransition: Transition = {
		duration: prefersReducedMotion ? 0.01 : 0.36,
		ease: easeOut,
	};

	const selectedArc =
		GUIDE_ARCS.find((arc) => arc.slug === selectedArcSlug) ?? GUIDE_ARCS[0];
	const selectedLeadGuide =
		GUIDES.find((guide) => guide.arc === selectedArc.slug) ?? null;

	return (
		<AnimatePresence>
			{isOpen ? (
				<motion.div
					key="arc-help-overlay"
					className="fixed inset-0 z-70 flex items-center justify-center px-3 py-4 sm:px-5 sm:py-6 md:px-8"
					role="presentation"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={backdropTransition}
				>
					<button
						type="button"
						className="absolute inset-0 bg-minuri-ocean/45 backdrop-blur-[3px]"
						aria-label="Close arc help"
						onClick={onClose}
					/>
					<motion.div
						role="dialog"
						aria-modal="true"
						aria-labelledby="arc-help-title"
						className="relative z-10 flex h-[min(92vh,54rem)] w-full max-w-5xl flex-col overflow-hidden rounded-[2rem] bg-minuri-white shadow-[0_38px_100px_-38px_color-mix(in_oklch,var(--minuri-ocean)_60%,transparent)]"
						initial={{
							opacity: 0,
							y: prefersReducedMotion ? 0 : 20,
							scale: prefersReducedMotion ? 1 : 0.985,
						}}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{
							opacity: 0,
							y: prefersReducedMotion ? 0 : 12,
							scale: prefersReducedMotion ? 1 : 0.99,
						}}
						transition={drawerTransition}
					>
						<div className="relative border-b border-minuri-silver/70 bg-minuri-white px-5 pb-5 pt-6 md:px-8 md:pb-7 md:pt-8">
							<div className="relative flex items-start justify-between gap-4">
								<div className="space-y-2">
									<p className="text-[11px] font-medium uppercase tracking-[0.12em] text-minuri-mid">
										Arc story guide
									</p>
									<h2
										id="arc-help-title"
										className="text-2xl font-semibold tracking-tight text-minuri-ocean md:text-[2.25rem]"
									>
										Choose the arc that matches where you
										are
									</h2>
									<p className="max-w-2xl text-sm leading-6 text-minuri-slate">
										Each arc is a chapter of your
										first-month journey. Pick the one that
										feels closest to your current moment.
									</p>
								</div>
								<button
									type="button"
									className="flex size-10 shrink-0 items-center justify-center rounded-full bg-minuri-white/90 text-minuri-slate transition-colors hover:bg-minuri-fog"
									aria-label="Close arc help"
									onClick={onClose}
								>
									<X className="size-4" aria-hidden />
								</button>
							</div>
						</div>
						<div className="min-h-0 flex-1 overflow-y-auto">
							<div className="px-4 py-4 md:px-6">
								<div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-minuri-silver/70 bg-minuri-fog/80 p-1">
									{GUIDE_ARCS.map((arc) => (
										<button
											key={arc.slug}
											type="button"
											className={cn(
												"rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition-colors",
												selectedArcSlug === arc.slug
													? "bg-minuri-white text-minuri-ocean shadow-sm"
													: "text-minuri-mid hover:bg-minuri-white/70",
											)}
											onClick={() => {
												onSelectArc(arc.slug);
											}}
										>
											{arc.timeframeLabel}
										</button>
									))}
								</div>
							</div>
							<div className="p-4 md:p-6">
								<motion.article
									key={selectedArc.slug}
									className="overflow-hidden border border-minuri-silver/70 bg-minuri-white"
									initial={{
										opacity: 0,
										y: prefersReducedMotion ? 0 : 12,
									}}
									animate={{ opacity: 1, y: 0 }}
									transition={{
										duration: prefersReducedMotion
											? 0.01
											: 0.28,
										ease: easeOut,
									}}
								>
									{selectedLeadGuide ? (
										<img
											src={selectedLeadGuide.thumbnailUrl}
											alt={selectedArc.name}
											className="h-48 w-full object-cover md:h-64"
										/>
									) : null}
									<div className="space-y-4 p-5 md:p-7">
										<p className="text-[11px] font-medium uppercase tracking-[0.16em] text-minuri-mid">
											{selectedArc.timeframeLabel}
										</p>
										<h3 className="text-3xl font-semibold tracking-tight text-minuri-ocean md:text-4xl">
											{selectedArc.name}
										</h3>
										<p className="max-w-4xl text-base leading-8 text-minuri-slate">
											{selectedArc.story}
										</p>
										<div className="border-l-2 border-minuri-teal/40 pl-4">
											<p className="text-xs font-semibold uppercase tracking-[0.14em] text-minuri-mid">
												By the end
											</p>
											<p className="mt-1 text-sm leading-7 text-minuri-ocean/90">
												{selectedArc.outcome}
											</p>
										</div>
									</div>
								</motion.article>
							</div>
						</div>
					</motion.div>
				</motion.div>
			) : null}
		</AnimatePresence>
	);
}
