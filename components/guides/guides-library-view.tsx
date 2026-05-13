"use client";

import {
	FormEvent,
	startTransition,
	useDeferredValue,
	useEffect,
	useMemo,
	useState,
} from "react";
import {
	ArrowLeft,
	ArrowRight,
	X,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { easeOut } from "@/components/landing/home-constants";
import { GUIDE_TOPICS, GUIDES, type GuideTopicSlug } from "@/content/guides";
import { GuideCard } from "@/components/guides/guide-card";
import { GuidesShell } from "@/components/guides/guides-shell";
import { GuidesTabNav } from "@/components/guides/guides-tab-nav";
import { useGuideBookmarks } from "@/hooks/use-guide-bookmarks";
import {
	buildGuideHref,
	filterGuides,
	getGuidesFromSlugs,
	parseGuideTopicFilter,
	type GuideOrigin,
	type GuideTopicFilter,
} from "@/lib/guides";
import { cn } from "@/lib/utils";

type GuidesLibraryViewProps = {
	mode: GuideOrigin;
};

const STORY_BEATS = [
	{
		label: "Step 01",
		title: "Tell us your moment",
		body: "Share what happened recently so we can shape a practical path forward.",
	},
	{
		label: "Step 02",
		title: "Name what you need right now",
		body: "Pick the themes that feel urgent and we will bring the right guides first.",
	},
	{
		label: "Step 03",
		title: "Start your guide journey",
		body: "We open your guide library with your story context in place.",
	},
] as const;
const STORY_MIN_CHARS = 16;

export function GuidesLibraryView({ mode }: GuidesLibraryViewProps) {
	const router = useRouter();
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
	const activeTopicFilter = parseGuideTopicFilter(searchParams.get("topic"));
	const rawQuery = searchParams.get("q") ?? "";
	const storyMoment = searchParams.get("moments")?.trim() ?? "";
	const storyNeeds =
		searchParams
			.get("needs")
			?.split(",")
			.map((value) => value.trim())
			.filter(Boolean) ?? [];
	const storyNeedsSet = new Set(storyNeeds);
	const deferredQuery = useDeferredValue(rawQuery);
	const isBookmarksMode = mode === "bookmarks";
	const isStoryReady = searchParams.get("story") === "ready";
	const showStoryOverlay = false;
	const filterQuery = deferredQuery;
	const [storyMomentDraft, setStoryMomentDraft] = useState(storyMoment);
	const [storyNeedsDraft, setStoryNeedsDraft] =
		useState<string[]>(storyNeeds);
	const storyMomentLength = storyMomentDraft.trim().length;
	const remainingStoryChars = Math.max(
		0,
		STORY_MIN_CHARS - storyMomentLength,
	);
	const canContinueStory =
		storyMomentLength >= STORY_MIN_CHARS && storyNeedsDraft.length > 0;

	const sourceGuides =
		mode === "bookmarks" ? getGuidesFromSlugs(bookmarks) : GUIDES;
	const shouldApplyStoryNeedsFilter =
		!isBookmarksMode &&
		activeTopicFilter === "all" &&
		storyNeedsSet.size > 0;
	const storyScopedGuides = shouldApplyStoryNeedsFilter
		? sourceGuides.filter((guide) => storyNeedsSet.has(guide.topic))
		: sourceGuides;

	const baseVisibleGuides = filterGuides(
		storyScopedGuides,
		activeTopicFilter,
		filterQuery,
	);
	const visibleGuides = baseVisibleGuides;

	function updateParams(updater: (params: URLSearchParams) => void) {
		startTransition(() => {
			const nextParams = new URLSearchParams(searchParams.toString());
			updater(nextParams);
			const nextQuery = nextParams.toString();
			const nextHref = nextQuery ? `${pathname}?${nextQuery}` : pathname;
			window.history.replaceState(null, "", nextHref);
		});
	}

	const topicStats = useMemo(() => {
		const bookmarkSet = new Set(bookmarks);
		return new Map(
			GUIDE_TOPICS.map((topic) => {
				const topicGuides = GUIDES.filter((g) => g.topic === topic.slug);
				const saved = topicGuides.filter((g) => bookmarkSet.has(g.slug)).length;
				return [topic.slug, { total: topicGuides.length, saved }];
			}),
		);
	}, [bookmarks]);

	const topicOptions = [
		{ slug: "all" as GuideTopicFilter, name: "All topics" },
		...GUIDE_TOPICS.map((topic) => ({
			slug: topic.slug,
			name: topic.name,
		})),
	];

	const storyNeedsLabels = storyNeeds
		.map((slug) => GUIDE_TOPICS.find((topic) => topic.slug === slug)?.name)
		.filter((value): value is string => Boolean(value));
	const activeTopicLabel = shouldApplyStoryNeedsFilter
		? `Story topics: ${storyNeedsLabels.join(" + ")}`
		: (topicOptions.find((t) => t.slug === activeTopicFilter)?.name ??
			"All topics");
	const isStoryTopicChipActive = (topicSlug: GuideTopicFilter) =>
		shouldApplyStoryNeedsFilter
			? topicSlug !== "all" && storyNeedsSet.has(topicSlug)
			: activeTopicFilter === topicSlug;

	useEffect(() => {
		if (!showStoryOverlay) return;
		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = previousOverflow;
		};
	}, [showStoryOverlay]);

	function onToggleStoryNeed(topicSlug: string) {
		setStoryNeedsDraft((current) =>
			current.includes(topicSlug)
				? current.filter((value) => value !== topicSlug)
				: [...current, topicSlug],
		);
	}

	function onSubmitStory(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!canContinueStory) return;
		const nextParams = new URLSearchParams(searchParams.toString());
		nextParams.set("story", "ready");
		nextParams.set("moments", storyMomentDraft.trim());
		nextParams.set("needs", storyNeedsDraft.join(","));
		nextParams.delete("topic");
		router.replace(`${pathname}?${nextParams.toString()}`);
	}

	// ── Combined search + topic filter bar ──
	const guidesSearchFilter = (
		<div className="overflow-hidden rounded-2xl bg-minuri-white">
			{/* Search row */}
			<div className="flex items-center gap-6 px-8 py-6 xl:px-10 xl:py-8 2xl:px-14 2xl:py-10">
				<input
					id="guide-search"
					type="search"
					value={rawQuery}
					placeholder="Search"
					className="flex-1 bg-transparent text-[2.5rem] font-normal leading-none text-minuri-ocean outline-none placeholder:text-minuri-ocean/30 xl:text-[3.5rem] 2xl:text-[4.5rem]"
					onChange={(e) =>
						updateParams((params) => {
							const v = e.target.value.trimStart();
							if (v) params.set("q", v);
							else params.delete("q");
						})
					}
				/>
				{rawQuery ? (
					<button
						type="button"
						aria-label="Clear search"
						onClick={() => updateParams((params) => params.delete("q"))}
						className="flex h-14 shrink-0 items-center justify-center rounded-2xl border border-minuri-silver/50 px-6 text-minuri-slate transition hover:bg-minuri-fog xl:h-16 xl:px-8 2xl:h-20 2xl:px-10"
					>
						<X className="size-5 xl:size-6" />
					</button>
				) : (
					<div className="flex h-14 shrink-0 items-center justify-center rounded-2xl bg-minuri-ocean px-8 text-white xl:h-16 xl:px-10 2xl:h-20 2xl:px-12">
						<ArrowRight className="size-6 xl:size-7 2xl:size-8" />
					</div>
				)}
			</div>

			{/* Divider — full width */}
			<div className="mx-8 h-px bg-minuri-silver/30 xl:mx-10 2xl:mx-14" />

			{/* Topic filter row */}
			<div className="flex items-center gap-4 overflow-x-auto px-8 py-4 scrollbar-none xl:gap-6 xl:px-10 xl:py-5 2xl:gap-8 2xl:px-14 2xl:py-6">
				<button
					type="button"
					onClick={() => updateParams((params) => params.delete("topic"))}
					className={cn(
						"shrink-0 rounded-lg px-5 py-2 text-[11px] font-semibold uppercase tracking-widest transition-colors xl:px-6 xl:py-2.5 xl:text-xs 2xl:px-8 2xl:py-3 2xl:text-sm",
						activeTopicFilter === "all" && !shouldApplyStoryNeedsFilter
							? "bg-minuri-ocean text-white"
							: "text-minuri-slate/50 hover:bg-minuri-fog hover:text-minuri-ocean",
					)}
				>
					All
				</button>
				{GUIDE_TOPICS.map((topic) => (
					<button
						key={topic.slug}
						type="button"
						onClick={() => updateParams((params) => params.set("topic", topic.slug))}
						className={cn(
							"shrink-0 rounded-lg px-5 py-2 text-[11px] font-semibold uppercase tracking-widest transition-colors xl:px-6 xl:py-2.5 xl:text-xs 2xl:px-8 2xl:py-3 2xl:text-sm",
							isStoryTopicChipActive(topic.slug)
								? "bg-minuri-ocean text-white"
								: "text-minuri-slate/50 hover:bg-minuri-fog hover:text-minuri-ocean",
						)}
					>
						{topic.name}
					</button>
				))}
			</div>
		</div>
	);

	const bookmarksSearchAndFilters = (
		<div className="overflow-hidden rounded-2xl bg-minuri-white">
			<div className="flex items-center gap-6 px-8 py-6 xl:px-10 xl:py-8 2xl:px-14 2xl:py-10">
				<input
					type="search"
					value={rawQuery}
					placeholder="Search"
					className="flex-1 bg-transparent text-[2.5rem] font-normal leading-none text-minuri-ocean outline-none placeholder:text-minuri-ocean/30 xl:text-[3.5rem] 2xl:text-[4.5rem]"
					onChange={(e) =>
						updateParams((params) => {
							const v = e.target.value.trimStart();
							if (v) params.set("q", v);
							else params.delete("q");
						})
					}
				/>
				{rawQuery ? (
					<button
						type="button"
						aria-label="Clear search"
						onClick={() => updateParams((params) => params.delete("q"))}
						className="flex h-14 shrink-0 items-center justify-center rounded-2xl border border-minuri-silver/50 px-6 text-minuri-slate transition hover:bg-minuri-fog xl:h-16 xl:px-8 2xl:h-20 2xl:px-10"
					>
						<X className="size-5 xl:size-6" />
					</button>
				) : (
					<div className="flex h-14 shrink-0 items-center justify-center rounded-2xl bg-minuri-ocean px-8 text-white xl:h-16 xl:px-10 2xl:h-20 2xl:px-12">
						<ArrowRight className="size-6 xl:size-7 2xl:size-8" />
					</div>
				)}
			</div>
			<div className="mx-8 h-px bg-minuri-silver/30 xl:mx-10 2xl:mx-14" />
			<div className="flex items-center gap-4 overflow-x-auto px-8 py-4 xl:gap-6 xl:px-10 xl:py-5 2xl:gap-8 2xl:px-14 2xl:py-6">
				{topicOptions.map((topic) => (
					<button
						key={topic.slug}
						type="button"
						onClick={() =>
							updateParams((params) => {
								if (topic.slug === "all") params.delete("topic");
								else params.set("topic", topic.slug);
							})
						}
						className={cn(
							"shrink-0 rounded-lg px-5 py-2 text-[11px] font-semibold uppercase tracking-widest transition-colors xl:px-6 xl:py-2.5 xl:text-xs 2xl:px-8 2xl:py-3 2xl:text-sm",
							activeTopicFilter === topic.slug
								? "bg-minuri-ocean text-white"
								: "text-minuri-slate/50 hover:bg-minuri-fog hover:text-minuri-ocean",
						)}
					>
						{topic.name}
					</button>
				))}
			</div>
		</div>
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
					<div className="mb-8">
						<h2 className="text-2xl font-bold tracking-tight text-minuri-ocean xl:text-3xl">
							{activeTopicLabel}
						</h2>
					</div>
				) : null}
				<div className="grid grid-cols-1 gap-x-4 gap-y-12 sm:grid-cols-2">
					{visibleGuides.map((guide, index) => (
						<GuideCard
							key={guide.slug}
							guide={guide}
							href={buildGuideHref(guide, {
								topicFilter: activeTopicFilter,
								query: rawQuery,
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
						: rawQuery.trim()
							? "Try a different search, or adjust your topic or moment filters."
							: "Try another moment or topic."}
				</p>
			</section>
		);

	const storyOverlay = showStoryOverlay ? (
		<AnimatePresence>
			<motion.div
				key="guides-story-intake-overlay"
				className="fixed inset-0 z-70 overflow-y-auto bg-minuri-ocean/45 px-4 py-6 backdrop-blur-[2px] md:px-6 md:py-10"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				transition={backdropTransition}
			>
				<motion.form
					onSubmit={onSubmitStory}
					className="mx-auto grid w-full max-w-5xl gap-6 rounded-[1.7rem] border border-minuri-silver/70 bg-minuri-white p-6 md:grid-cols-[minmax(0,1fr)_20rem] md:p-8"
					initial={{ y: 18, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					exit={{ y: 12, opacity: 0 }}
					transition={drawerTransition}
				>
					<div>
						<p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-minuri-mid">
							Your next chapter starts here
						</p>
						<h2 className="mt-3 text-2xl font-semibold tracking-tight text-minuri-ocean md:text-[2rem]">
							Before we begin, tell us your moment
						</h2>
						<p className="mt-3 max-w-3xl text-sm leading-6 text-minuri-slate">
							This is a story-led start, not a questionnaire. We
							use your words to shape what you see first.
						</p>
						<label className="mt-6 block text-sm font-medium text-minuri-ocean">
							Your moment
							<textarea
								value={storyMomentDraft}
								onChange={(e) => setStoryMomentDraft(e.target.value)}
								placeholder="Example: I arrived this week, still figuring out transport, and I am worried about affordable food and settling in."
								className="mt-3 h-36 w-full resize-none overflow-y-auto rounded-[1rem] border border-minuri-silver/80 bg-minuri-white p-4 text-sm leading-6 text-minuri-ocean outline-none ring-0 placeholder:text-minuri-slate/65 focus:border-minuri-teal"
							/>
							<p className="mt-2 text-xs font-normal text-minuri-slate">
								{remainingStoryChars > 0
									? `Add ${remainingStoryChars} more character${remainingStoryChars === 1 ? "" : "s"} to continue.`
									: "Great, your moment is long enough."}
							</p>
						</label>
						<div className="mt-7">
							<p className="text-sm font-medium text-minuri-ocean">
								What do you need most right now?
							</p>
							<p className="mt-2 text-xs text-minuri-slate">
								Choose one or more areas so we can prioritize your guide path.
							</p>
							<div className="mt-4 flex flex-wrap gap-2">
								{GUIDE_TOPICS.map((topic) => {
									const selected = storyNeedsDraft.includes(topic.slug);
									return (
										<button
											key={topic.slug}
											type="button"
											onClick={() => onToggleStoryNeed(topic.slug)}
											className={cn(
												"min-h-10 rounded-full px-4 py-2 text-xs font-medium transition-colors",
												selected
													? "bg-minuri-teal text-primary-foreground"
													: "bg-minuri-fog text-minuri-slate hover:bg-minuri-mist",
											)}
										>
											{topic.name}
										</button>
									);
								})}
							</div>
						</div>
						<button
							type="submit"
							disabled={!canContinueStory}
							className="mt-8 inline-flex min-h-11 items-center justify-center rounded-full bg-minuri-teal px-6 text-sm font-semibold text-primary-foreground transition-opacity disabled:cursor-not-allowed disabled:opacity-45"
						>
							Continue to my guide journey
						</button>
					</div>
					<aside className="border-l border-minuri-silver/70 pl-5">
						<p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-minuri-mid">
							How this works
						</p>
						<ul className="mt-4 space-y-4">
							{STORY_BEATS.map((beat) => (
								<li
									key={beat.label}
									className="border-b border-minuri-silver/60 pb-3 last:border-b-0"
								>
									<p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-minuri-mid">
										{beat.label}
									</p>
									<h3 className="mt-2 text-sm font-semibold text-minuri-ocean">
										{beat.title}
									</h3>
									<p className="mt-2 text-xs leading-5 text-minuri-slate">
										{beat.body}
									</p>
								</li>
							))}
						</ul>
					</aside>
				</motion.form>
			</motion.div>
		</AnimatePresence>
	) : null;

	const title = isBookmarksMode ? "My Bookmarks" : "Your Guides";
	const description = isBookmarksMode
		? "Saved chapters from every moment, all in one place."
		: "Every topic, one guide at a time.";

	const libraryBackHome = (
		<Link
			href="/"
			className="mt-4 inline-flex items-center gap-2 rounded-full border border-minuri-silver/80 bg-minuri-white px-3.5 py-1.5 text-xs font-medium text-minuri-slate transition-transform duration-200 ease-out hover:scale-105"
		>
			<ArrowLeft className="size-3.5" aria-hidden />
			Back to home
		</Link>
	);

	return (
		<GuidesShell
			title={title}
			description={description}
			headerStart={libraryBackHome}
		>
			<GuidesTabNav />
			{!isBookmarksMode ? (
				<>
					{storyOverlay}
					<div className="space-y-8">
						{guidesSearchFilter}
						{guidesListBody}
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
