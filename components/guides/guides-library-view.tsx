"use client";

import {
	FormEvent,
	startTransition,
	useDeferredValue,
	useEffect,
	useId,
	useMemo,
	useState,
} from "react";
import {
	ArrowLeft,
	Compass,
	HeartPulse,
	Home,
	ListFilter,
	Sandwich,
	Search,
	Users,
	X,
	type LucideIcon,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { easeOut } from "@/components/landing/home-constants";
import { GUIDE_TOPICS, GUIDES, type GuideTopicSlug } from "@/content/guides";
import { PERSONAS } from "@/content/personas";
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

const TOPIC_ICONS: Record<GuideTopicSlug, LucideIcon> = {
	"food-eating": Sandwich,
	"getting-around": Compass,
	"health-wellbeing": HeartPulse,
	"home-admin": Home,
	"social-belonging": Users,
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
		isStoryReady &&
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

	const mobileFiltersPanelId = useId();
	const [mobileLibraryFiltersOpen, setMobileLibraryFiltersOpen] =
		useState(false);

	useEffect(() => {
		const shouldLockBody = mobileLibraryFiltersOpen || showStoryOverlay;
		if (!shouldLockBody) return;
		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = previousOverflow;
		};
	}, [mobileLibraryFiltersOpen, showStoryOverlay]);

	useEffect(() => {
		if (!mobileLibraryFiltersOpen) return;
		function onKeyDown(event: KeyboardEvent) {
			if (event.key === "Escape") {
				setMobileLibraryFiltersOpen(false);
			}
		}
		document.addEventListener("keydown", onKeyDown);
		return () => {
			document.removeEventListener("keydown", onKeyDown);
		};
	}, [mobileLibraryFiltersOpen]);

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

	function renderLibraryFilters(onSelect?: () => void) {
		const afterSelect = () => {
			onSelect?.();
		};

		return (
			<div className="space-y-2">
				<button
					type="button"
					className={cn(
						"w-full rounded-[0.85rem] border px-4 py-3 text-left transition-colors",
						activeTopicFilter === "all" && !shouldApplyStoryNeedsFilter
							? "border-minuri-teal/70 bg-minuri-mist"
							: "border-minuri-silver/60 bg-minuri-white hover:bg-minuri-fog",
					)}
					onClick={() => {
						updateParams((params) => params.delete("topic"));
						afterSelect();
					}}
				>
					<div className="flex items-center justify-between gap-3">
						<span className="text-sm font-semibold text-minuri-ocean">All guides</span>
						<span className="text-xs tabular-nums text-minuri-slate">{GUIDES.length}</span>
					</div>
				</button>

				{GUIDE_TOPICS.map((topic) => {
					const stats = topicStats.get(topic.slug);
					const total = stats?.total ?? 0;
					const saved = stats?.saved ?? 0;
					const percent = total === 0 ? 0 : Math.round((saved / total) * 100);
					const isActive = isStoryTopicChipActive(topic.slug);
					const Icon = TOPIC_ICONS[topic.slug];

					return (
						<button
							key={topic.slug}
							type="button"
							className={cn(
								"w-full rounded-[0.85rem] border px-4 py-3.5 text-left transition-colors",
								isActive
									? "border-minuri-teal/70 bg-minuri-mist"
									: "border-minuri-silver/60 bg-minuri-white hover:bg-minuri-fog",
							)}
							onClick={() => {
								updateParams((params) => params.set("topic", topic.slug));
								afterSelect();
							}}
						>
							<div className="flex items-center gap-2.5">
								<Icon
									className={cn(
										"size-4 shrink-0",
										isActive ? "text-minuri-teal" : "text-minuri-mid",
									)}
									aria-hidden
								/>
								<span className="text-sm font-semibold text-minuri-ocean">
									{topic.name}
								</span>
							</div>
							<div className="mt-2.5 flex items-center gap-3">
								<div className="h-1 flex-1 overflow-hidden rounded-full bg-minuri-silver/50">
									<div
										className="h-full rounded-full bg-minuri-teal transition-[width] duration-300"
										style={{ width: `${percent}%` }}
									/>
								</div>
								<span className="shrink-0 text-[11px] tabular-nums text-minuri-slate">
									{saved}/{total}
								</span>
							</div>
						</button>
					);
				})}
			</div>
		);
	}

	const librarySidebar = !isBookmarksMode ? (
		<motion.aside
			className="hidden lg:col-start-2 lg:row-start-1 lg:block lg:sticky lg:top-8 lg:self-start"
			aria-label="Moment progress and topics"
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
								Topics
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
								onChange={(event) =>
									setStoryMomentDraft(event.target.value)
								}
								placeholder="Example: I arrived this week, still figuring out transport, and I am worried about affordable food and settling in."
								className="mt-3 h-36 w-full resize-none overflow-y-auto rounded-[1rem] border border-minuri-silver/80 bg-minuri-white p-4 text-sm leading-6 text-minuri-ocean outline-none ring-0 placeholder:text-minuri-slate/65 focus:border-minuri-teal"
							/>
							<p className="mt-2 text-xs font-normal text-minuri-slate">
								{remainingStoryChars > 0
									? `Add ${remainingStoryChars} more character${
											remainingStoryChars === 1 ? "" : "s"
										} to continue.`
									: "Great, your moment is long enough."}
							</p>
						</label>
						<div className="mt-7">
							<p className="text-sm font-medium text-minuri-ocean">
								What do you need most right now?
							</p>
							<p className="mt-2 text-xs text-minuri-slate">
								Choose one or more areas so we can prioritize
								your guide path.
							</p>
							<div className="mt-4 flex flex-wrap gap-2">
								{GUIDE_TOPICS.map((topic) => {
									const selected = storyNeedsDraft.includes(
										topic.slug,
									);
									return (
										<button
											key={topic.slug}
											type="button"
											onClick={() =>
												onToggleStoryNeed(topic.slug)
											}
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

	const guideSearchField = (
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
						const nextValue = event.target.value.trimStart();
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
	);

	const bookmarksSearchAndFilters = (
		<section className="rounded-[1.5rem] bg-minuri-white p-6 md:p-8">
			<div className="grid gap-6">
				{guideSearchField}

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

	const storyContextBanner =
		!isBookmarksMode && (storyMoment || storyNeedsLabels.length > 0) ? (
			<section className="border-l-4 border-minuri-teal/60 px-4 py-2 md:px-5">
				<p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-minuri-mid">
					Your story-guided path
				</p>
				{storyMoment ? (
					<p className="mt-2 text-sm leading-6 text-minuri-slate">
						{storyMoment}
					</p>
				) : null}
				{storyNeedsLabels.length > 0 ? (
					<p className="mt-3 text-xs text-minuri-slate">
						Prioritizing: {storyNeedsLabels.join(" • ")}
					</p>
				) : null}
			</section>
		) : null;

	const libraryHeaderFiltersButton = !isBookmarksMode ? (
		<button
			type="button"
			className="relative z-50 flex size-10 items-center justify-center rounded-full border border-minuri-silver/70 bg-minuri-white text-minuri-ocean shadow-[0_1px_2px_color-mix(in_oklch,var(--minuri-ocean)_12%,transparent)] transition-colors hover:bg-minuri-fog focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-minuri-teal/45 focus-visible:ring-offset-2 focus-visible:ring-offset-minuri-white lg:hidden"
			aria-expanded={mobileLibraryFiltersOpen}
			aria-controls={mobileFiltersPanelId}
			aria-label={
				mobileLibraryFiltersOpen
					? "Topic filters open"
					: "Open topic filters"
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
			headerEnd={libraryHeaderFiltersButton}
		>
			<GuidesTabNav />
			{!isBookmarksMode ? (
				<>
					{storyOverlay}
					{mobileLibraryFiltersPortal}
					<div className="grid items-start gap-x-10 lg:grid-cols-[minmax(0,1fr)_18.5rem] xl:grid-cols-[minmax(0,1fr)_20rem] xl:gap-x-14">
						{librarySidebar}
						<div className="min-w-0 space-y-8 lg:col-start-1 lg:row-start-1">
							{storyContextBanner}

							{/* Journey strip */}
							<section>
								<div className="mb-5 flex items-center justify-between">
									<p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-minuri-mid">
										Follow a journey
									</p>
									<Link
										href="/guides/journeys"
										className="text-xs font-medium text-minuri-teal transition-colors hover:text-minuri-ocean"
									>
										Browse all →
									</Link>
								</div>
								<div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
									{PERSONAS.map((persona) => (
										<Link
											key={persona.id}
											href={`/guides/journeys?persona=${persona.id}`}
											className="group relative block overflow-hidden rounded-xl"
										>
											<div className="relative aspect-[3/4]">
												<Image
													src={persona.imageUrl}
													alt={persona.name}
													fill
													sizes="(max-width: 640px) 33vw, 16vw"
													className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
												/>
												<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
												<div className="absolute bottom-0 left-0 right-0 p-2.5">
													<p className="text-xs font-bold text-white">{persona.name}</p>
													<p className="mt-0.5 text-[10px] text-white/60">{persona.role}</p>
												</div>
											</div>
										</Link>
									))}
								</div>
							</section>

							{!isBookmarksMode ? guideSearchField : null}
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
