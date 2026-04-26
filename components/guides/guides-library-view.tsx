"use client";

import { startTransition, useDeferredValue, useMemo } from "react";
import { Search, X } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";

import {
	GUIDE_ARCS,
	GUIDE_TOPICS,
	GUIDES,
	type GuideArcSlug,
} from "@/content/guides";
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
	initialArc?: string;
};

export function GuidesLibraryView({
	mode,
	initialArc,
}: GuidesLibraryViewProps) {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const { bookmarks, hasHydrated, isBookmarked, toggleBookmark } =
		useGuideBookmarks();

	const defaultArcFilter: GuideArcFilter = useMemo(() => {
		if (!initialArc) return "all";
		return GUIDE_ARCS.some((arc) => arc.slug === initialArc)
			? (initialArc as GuideArcSlug)
			: "all";
	}, [initialArc]);

	const activeArcFilter =
		parseGuideArcFilter(searchParams.get("arc")) ?? defaultArcFilter;
	const effectiveArcFilter =
		activeArcFilter === "all" ? defaultArcFilter : activeArcFilter;
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

	const librarySidebar = !isBookmarksMode ? (
		<aside
			className="lg:sticky lg:top-28 lg:col-start-2 lg:row-start-1 lg:self-start"
			aria-label="Arc progress and topics"
		>
			<div>
				<h2 className="text-lg font-semibold tracking-tight text-minuri-ocean">
					Arc progress
				</h2>
				<p className="mt-1 text-sm leading-snug text-minuri-slate">
					Your three beats—tap one to filter the library.
				</p>
				<div className="mt-5 flex flex-col gap-3">
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
							onClick={() =>
								updateParams((params) => {
									params.set("arc", arc.slug);
								})
							}
						>
							<p className="text-[11px] font-medium uppercase tracking-[0.16em] text-minuri-mid">
								{arc.timeframeLabel}
							</p>
							<p className="mt-1 text-[15px] font-semibold leading-snug text-minuri-ocean">
								{arc.name}
							</p>
							<p className="mt-2 text-xs text-minuri-slate">
								{progress.readCount}/{progress.total} saved ·{" "}
								{progress.completionPercent}%
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
		</aside>
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
				<div className="grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
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
							animationDelay={(index % 4) * 0.06}
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

	return (
		<GuidesShell title={title} description={description}>
			{!isBookmarksMode ? (
				<div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_18.5rem] xl:grid-cols-[minmax(0,1fr)_20rem] xl:gap-14">
					{librarySidebar}
					<div className="min-w-0 space-y-8 lg:col-start-1 lg:row-start-1">
						{guidesListBody}
					</div>
				</div>
			) : (
				<div className="space-y-8">
					{bookmarksSearchAndFilters}
					{guidesListBody}
				</div>
			)}
		</GuidesShell>
	);
}
