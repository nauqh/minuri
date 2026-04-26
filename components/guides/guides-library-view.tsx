"use client";

import {
	startTransition,
	useDeferredValue,
	useEffect,
	useId,
	useMemo,
	useState,
} from "react";
import { CircleHelp, ListFilter, Search, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { usePathname, useSearchParams } from "next/navigation";

import { ArcStoryOverlay } from "@/components/guides/arc-story-overlay";
import { easeOut } from "@/components/landing/home-constants";
import { GUIDE_ARCS, GUIDE_TOPICS, GUIDES } from "@/content/guides";
import { GuideCard } from "@/components/guides/guide-card";
import { GuidesShell } from "@/components/guides/guides-shell";
import { useGuideBookmarks } from "@/hooks/use-guide-bookmarks";
import {
	buildGuideHref,
	filterGuides,
	getArcProgress,
	getGuidesFromSlugs,
	parseGuideArcFilter,
	parseGuideTopicFilter,
	type GuideArcFilter,
	type GuideOrigin,
	type GuideTopicFilter,
} from "@/lib/guides";
import { cn } from "@/lib/utils";

type GuidesLibraryViewProps = {
	mode: GuideOrigin;
};

export function GuidesLibraryView({ mode }: GuidesLibraryViewProps) {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const prefersReducedMotion = useReducedMotion();
	const { bookmarks, hasHydrated, isBookmarked, toggleBookmark } =
		useGuideBookmarks();

	const drawerTransition = {
		duration: prefersReducedMotion ? 0.01 : 0.36,
		ease: easeOut,
	};
	const backdropTransition = {
		duration: prefersReducedMotion ? 0.01 : 0.28,
		ease: easeOut,
	};

	const effectiveArcFilter = parseGuideArcFilter(searchParams.get("arc"));

	const libraryWideProgress = useMemo(() => {
		const readCount = GUIDES.filter((g) =>
			bookmarks.includes(g.slug),
		).length;
		const total = GUIDES.length;
		const completionPercent =
			total === 0 ? 0 : Math.round((readCount / total) * 100);
		return { readCount, total, completionPercent };
	}, [bookmarks]);
	const activeTopicFilter = parseGuideTopicFilter(searchParams.get("topic"));
	const rawQuery = searchParams.get("q") ?? "";
	const deferredQuery = useDeferredValue(rawQuery);
	const isBookmarksMode = mode === "bookmarks";
	const filterQuery = isBookmarksMode ? deferredQuery : "";

	const sourceGuides =
		mode === "bookmarks" ? getGuidesFromSlugs(bookmarks) : GUIDES;

	const visibleGuides = filterGuides(
		sourceGuides,
		effectiveArcFilter,
		activeTopicFilter,
		filterQuery,
	);

	function updateParams(updater: (params: URLSearchParams) => void) {
		startTransition(() => {
			const nextParams = new URLSearchParams(searchParams.toString());
			updater(nextParams);

			const nextQuery = nextParams.toString();
			const nextHref = nextQuery ? `${pathname}?${nextQuery}` : pathname;
			window.history.replaceState(null, "", nextHref);
		});
	}

	const title = isBookmarksMode ? "My Bookmarks" : "Your Guides Journey";
	const description = isBookmarksMode
		? "Saved chapters from every arc, all in one place."
		: "Day 1 through your first month — every topic has a first step.";

	const arcProgress = GUIDE_ARCS.map((arc) => ({
		arc,
		progress: getArcProgress(arc.slug, bookmarks),
	}));

	const topicOptions = [
		{ slug: "all" as GuideTopicFilter, name: "All topics" },
		...GUIDE_TOPICS.map((topic) => ({
			slug: topic.slug,
			name: topic.name,
		})),
	];

	const activeTopicLabel =
		topicOptions.find((t) => t.slug === activeTopicFilter)?.name ??
		"All topics";

	const mobileFiltersPanelId = useId();
	const [mobileLibraryFiltersOpen, setMobileLibraryFiltersOpen] =
		useState(false);
	const [arcHelpOpen, setArcHelpOpen] = useState(false);
	const [selectedArcHelpSlug, setSelectedArcHelpSlug] = useState(
		GUIDE_ARCS[0]?.slug ?? "day-1",
	);

	useEffect(() => {
		const shouldLockBody = mobileLibraryFiltersOpen || arcHelpOpen;
		if (!shouldLockBody) return;
		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = previousOverflow;
		};
	}, [arcHelpOpen, mobileLibraryFiltersOpen]);

	useEffect(() => {
		if (!mobileLibraryFiltersOpen && !arcHelpOpen) return;
		function onKeyDown(event: KeyboardEvent) {
			if (event.key === "Escape") {
				if (arcHelpOpen) {
					setArcHelpOpen(false);
					return;
				}
				setMobileLibraryFiltersOpen(false);
			}
		}
		document.addEventListener("keydown", onKeyDown);
		return () => {
			document.removeEventListener("keydown", onKeyDown);
		};
	}, [arcHelpOpen, mobileLibraryFiltersOpen]);

	function renderLibraryFilters(onSelect?: () => void) {
		const afterSelect = () => {
			onSelect?.();
		};

		return (
			<>
				<div>
					<div className="flex items-center justify-between gap-3">
						<h2 className="text-lg font-semibold tracking-tight text-minuri-ocean">
							Arc progress
						</h2>
						<button
							type="button"
							className="inline-flex h-8 items-center gap-1.5 rounded-full border border-minuri-silver/70 bg-minuri-white px-3 text-[11px] font-medium uppercase tracking-widest text-minuri-mid transition-colors hover:bg-minuri-fog"
							onClick={() => {
								setSelectedArcHelpSlug(
									effectiveArcFilter === "all"
										? GUIDE_ARCS[0].slug
										: effectiveArcFilter,
								);
								setArcHelpOpen(true);
							}}
						>
							<CircleHelp className="size-3.5" aria-hidden />
							Arc help
						</button>
					</div>
					<p className="mt-1 text-sm leading-snug text-minuri-slate">
						Browse everything or focus on one timeline.
					</p>
					<div className="mt-5 flex flex-col gap-3">
						<button
							type="button"
							className={cn(
								"rounded-[0.85rem] border px-4 py-3.5 text-left transition-colors",
								effectiveArcFilter === "all"
									? "border-minuri-teal/70 bg-minuri-mist shadow-sm shadow-minuri-teal/10"
									: "border-minuri-silver/70 bg-minuri-white hover:bg-minuri-fog",
							)}
							onClick={() => {
								updateParams((params) => {
									params.delete("arc");
								});
								afterSelect();
							}}
						>
							<p className="text-[11px] font-medium uppercase tracking-[0.16em] text-minuri-mid">
								First day to first month
							</p>
							<p className="mt-1 text-[15px] font-semibold leading-snug text-minuri-ocean">
								Give me everything I need
							</p>
							<p className="mt-2 text-xs text-minuri-slate">
								{libraryWideProgress.readCount}/
								{libraryWideProgress.total} saved ·{" "}
								{libraryWideProgress.completionPercent}%
							</p>
						</button>
						{arcProgress.map(({ arc, progress }) => (
							<button
								key={arc.slug}
								type="button"
								className={cn(
									"rounded-[0.85rem] border px-4 py-3.5 text-left transition-colors",
									effectiveArcFilter === arc.slug
										? "border-minuri-teal/70 bg-minuri-mist shadow-sm shadow-minuri-teal/10"
										: "border-minuri-silver/70 bg-minuri-white hover:bg-minuri-fog",
								)}
								onClick={() => {
									updateParams((params) => {
										params.set("arc", arc.slug);
									});
									afterSelect();
								}}
							>
								<p className="text-[11px] font-medium uppercase tracking-[0.16em] text-minuri-mid">
									{arc.timeframeLabel}
								</p>
								<p className="mt-1 text-[15px] font-semibold leading-snug text-minuri-ocean">
									{arc.name}
								</p>
								<p className="mt-2 text-xs text-minuri-slate">
									{progress.readCount}/{progress.total} saved
									· {progress.completionPercent}%
								</p>
							</button>
						))}
					</div>
				</div>

				<div className="mt-10">
					<h2 className="text-lg font-semibold tracking-tight text-minuri-ocean">
						Topics
					</h2>
					<div className="mt-4 flex flex-wrap gap-2">
						{topicOptions.map((topic) => (
							<button
								key={topic.slug}
								type="button"
								className={cn(
									"rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors",
									activeTopicFilter === topic.slug
										? "bg-minuri-teal text-primary-foreground"
										: "bg-minuri-fog text-minuri-slate hover:bg-minuri-mist",
								)}
								onClick={() => {
									updateParams((params) => {
										if (topic.slug === "all") {
											params.delete("topic");
										} else {
											params.set("topic", topic.slug);
										}
									});
									afterSelect();
								}}
							>
								{topic.name}
							</button>
						))}
					</div>
				</div>
			</>
		);
	}

	const librarySidebar = !isBookmarksMode ? (
		<motion.aside
			className="hidden lg:col-start-2 lg:row-start-1 lg:block lg:sticky lg:top-8 lg:self-start"
			aria-label="Arc progress and topics"
			initial={{
				opacity: 0,
				x: prefersReducedMotion ? 0 : 18,
			}}
			animate={{ opacity: 1, x: 0 }}
			transition={{
				duration: prefersReducedMotion ? 0.01 : 0.5,
				delay: prefersReducedMotion ? 0 : 0.06,
				ease: easeOut,
			}}
		>
			{renderLibraryFilters()}
		</motion.aside>
	) : null;

	const mobileLibraryFiltersPortal = !isBookmarksMode ? (
		<AnimatePresence>
			{mobileLibraryFiltersOpen ? (
				<motion.div
					key="guides-library-filters-sheet"
					className="fixed inset-0 z-60 flex justify-end lg:hidden"
					role="presentation"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={backdropTransition}
				>
					<button
						type="button"
						className="absolute inset-0 bg-minuri-ocean/40 backdrop-blur-[2px]"
						aria-label="Close filters"
						onClick={() => {
							setMobileLibraryFiltersOpen(false);
						}}
					/>
					<motion.div
						id={mobileFiltersPanelId}
						role="dialog"
						aria-modal="true"
						aria-labelledby={`${mobileFiltersPanelId}-title`}
						className="relative z-10 flex h-full w-[min(100%,22rem)] flex-col border-l border-minuri-silver/70 bg-minuri-white shadow-[-12px_0_40px_-20px_color-mix(in_oklch,var(--minuri-ocean)_45%,transparent)]"
						initial={{ x: "100%" }}
						animate={{ x: 0 }}
						exit={{ x: "100%" }}
						transition={drawerTransition}
						onClick={(event) => {
							event.stopPropagation();
						}}
					>
						<div className="flex shrink-0 items-center justify-between gap-3 border-b border-minuri-silver/70 px-4 py-3">
							<h2
								id={`${mobileFiltersPanelId}-title`}
								className="text-base font-semibold tracking-tight text-minuri-ocean"
							>
								Arcs &amp; topics
							</h2>
							<button
								type="button"
								className="flex size-9 items-center justify-center rounded-full bg-minuri-fog text-minuri-slate transition-colors hover:bg-minuri-mist"
								aria-label="Close side panel"
								onClick={() => {
									setMobileLibraryFiltersOpen(false);
								}}
							>
								<X className="size-4" aria-hidden="true" />
							</button>
						</div>
						<div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-5">
							{renderLibraryFilters(() => {
								setMobileLibraryFiltersOpen(false);
							})}
						</div>
					</motion.div>
				</motion.div>
			) : null}
		</AnimatePresence>
	) : null;

	const bookmarksSearchAndFilters = (
		<section className="rounded-[1.5rem] border border-minuri-silver/70 bg-minuri-white p-6 md:p-8">
			<div className="grid gap-6">
				<div className="relative">
					<label htmlFor="guide-search" className="sr-only">
						Search guides
					</label>
					<Search
						className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-minuri-slate"
						aria-hidden="true"
					/>
					<input
						id="guide-search"
						type="search"
						value={rawQuery}
						placeholder="Search topics like bulk billing, Myki or rent"
						className="h-12 w-full rounded-[0.85rem] border border-minuri-silver/80 bg-minuri-white pl-12 pr-12 text-sm text-minuri-ocean outline-none ring-0 placeholder:text-minuri-slate focus:border-minuri-teal"
						onChange={(event) =>
							updateParams((params) => {
								const nextValue =
									event.target.value.trimStart();
								if (nextValue) {
									params.set("q", nextValue);
								} else {
									params.delete("q");
								}
							})
						}
					/>
					{rawQuery ? (
						<button
							type="button"
							className="absolute right-3 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-minuri-fog text-minuri-slate hover:bg-minuri-mist"
							aria-label="Clear search"
							onClick={() =>
								updateParams((params) => {
									params.delete("q");
								})
							}
						>
							<X className="size-4" aria-hidden="true" />
						</button>
					) : null}
				</div>

				<div className="flex flex-wrap gap-2">
					{topicOptions.map((topic) => (
						<button
							key={topic.slug}
							type="button"
							className={cn(
								"min-h-10 rounded-full px-4 py-2 text-xs font-medium transition-colors",
								activeTopicFilter === topic.slug
									? "bg-minuri-teal text-primary-foreground"
									: "bg-minuri-mist text-minuri-slate hover:bg-minuri-ice",
							)}
							onClick={() =>
								updateParams((params) => {
									if (topic.slug === "all") {
										params.delete("topic");
									} else {
										params.set("topic", topic.slug);
									}
								})
							}
						>
							{topic.name}
						</button>
					))}
				</div>
			</div>
		</section>
	);

	const guidesListBody =
		isBookmarksMode && !hasHydrated ? (
			<section className="rounded-[2rem] bg-minuri-white p-6 shadow-sm ring-1 ring-minuri-silver/40">
				<p className="text-sm leading-6 text-minuri-slate">
					Loading bookmarks...
				</p>
			</section>
		) : visibleGuides.length > 0 ? (
			<section>
				{!isBookmarksMode ? (
					<div className="mb-5 flex flex-col gap-1 border-b border-minuri-silver/70 pb-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
						<h2 className="text-lg font-semibold tracking-tight text-minuri-ocean">
							{activeTopicLabel}
						</h2>
						<p className="text-xs text-minuri-slate">
							Read in sequence, one step at a time
						</p>
					</div>
				) : null}
				<div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
					{visibleGuides.map((guide, index) => (
						<GuideCard
							key={guide.slug}
							guide={guide}
							href={buildGuideHref(guide, {
								arcFilter: effectiveArcFilter,
								topicFilter: activeTopicFilter,
								query: isBookmarksMode ? rawQuery : "",
								from: mode,
							})}
							bookmarked={isBookmarked(guide.slug)}
							onToggleBookmark={toggleBookmark}
							animationDelay={(index % 3) * 0.06}
						/>
					))}
				</div>
			</section>
		) : (
			<section className="rounded-[2rem] bg-minuri-white p-8 text-center shadow-sm ring-1 ring-minuri-silver/40">
				<h2 className="text-xl font-semibold tracking-tight text-minuri-ocean">
					No guides found
				</h2>
				<p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-minuri-slate">
					{isBookmarksMode
						? "Try another topic or a different search."
						: "Try another arc or topic."}
				</p>
			</section>
		);

	const libraryHeaderFiltersButton = !isBookmarksMode ? (
		<button
			type="button"
			className="relative z-50 flex size-10 items-center justify-center rounded-full border border-minuri-silver/70 bg-minuri-white text-minuri-ocean shadow-[0_1px_2px_color-mix(in_oklch,var(--minuri-ocean)_12%,transparent)] transition-colors hover:bg-minuri-fog focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-minuri-teal/45 focus-visible:ring-offset-2 focus-visible:ring-offset-minuri-white lg:hidden"
			aria-expanded={mobileLibraryFiltersOpen}
			aria-controls={mobileFiltersPanelId}
			aria-label={
				mobileLibraryFiltersOpen
					? "Arcs and topics filters open"
					: "Open arcs and topics filters"
			}
			onClick={() => {
				setMobileLibraryFiltersOpen(true);
			}}
		>
			<ListFilter
				className="size-[1.15rem] shrink-0"
				strokeWidth={2}
				aria-hidden
			/>
		</button>
	) : null;

	return (
		<GuidesShell
			title={title}
			description={description}
			headerEnd={libraryHeaderFiltersButton}
		>
			{!isBookmarksMode ? (
				<>
					<ArcStoryOverlay
						isOpen={arcHelpOpen}
						onClose={() => {
							setArcHelpOpen(false);
						}}
						selectedArcSlug={selectedArcHelpSlug}
						onSelectArc={setSelectedArcHelpSlug}
						prefersReducedMotion={Boolean(prefersReducedMotion)}
					/>
					{mobileLibraryFiltersPortal}
					<div className="grid items-start gap-x-10 lg:grid-cols-[minmax(0,1fr)_18.5rem] xl:grid-cols-[minmax(0,1fr)_20rem] xl:gap-x-14">
						{librarySidebar}
						<div className="min-w-0 space-y-8 lg:col-start-1 lg:row-start-1">
							{guidesListBody}
						</div>
					</div>
				</>
			) : (
				<div className="space-y-8">
					{bookmarksSearchAndFilters}
					{guidesListBody}
				</div>
			)}
		</GuidesShell>
	);
}
