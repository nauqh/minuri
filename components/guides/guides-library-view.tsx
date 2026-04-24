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

	const sourceGuides =
		mode === "bookmarks" ? getGuidesFromSlugs(bookmarks) : GUIDES;

	const visibleGuides = filterGuides(
		sourceGuides,
		effectiveArcFilter,
		activeTopicFilter,
		deferredQuery,
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

	const isBookmarksMode = mode === "bookmarks";
	const title = isBookmarksMode ? "My Bookmarks" : "Your Guides Journey";
	const description = isBookmarksMode
		? "Saved chapters from every arc, all in one place."
		: "Follow your arc, filter by topic, and continue where you left off.";

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

	return (
		<GuidesShell title={title} description={description}>
			{!isBookmarksMode ? (
				<section className="border-b border-minuri-silver/70 pb-8">
					<p className="text-[11px] font-medium uppercase tracking-[0.18em] text-minuri-mid">
						Arc Progress
					</p>
					<div className="mt-4 grid gap-3 md:grid-cols-3">
						{arcProgress.map(({ arc, progress }) => (
							<button
								key={arc.slug}
								type="button"
								className={cn(
									"rounded-[0.85rem] border px-4 py-4 text-left transition-colors",
									effectiveArcFilter === arc.slug
										? "border-minuri-teal/70 bg-minuri-mist"
										: "border-minuri-silver/70 bg-minuri-white hover:bg-minuri-fog",
								)}
								onClick={() =>
									updateParams((params) => {
										params.set("arc", arc.slug);
									})
								}
							>
								<p className="text-[11px] uppercase tracking-[0.16em] text-minuri-mid">
									{arc.timeframeLabel}
								</p>
								<p className="mt-1 text-base font-semibold text-minuri-ocean">
									{arc.name}
								</p>
								<p className="mt-2 text-xs text-minuri-slate">
									{progress.readCount}/{progress.total} saved
									· {progress.completionPercent}%
								</p>
							</button>
						))}
					</div>
				</section>
			) : null}

			<section className="mt-8 rounded-[1.5rem] border border-minuri-silver/70 bg-minuri-white p-6 md:p-8">
				<div className="grid gap-6">
					<div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
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

						<p className="text-xs font-medium text-minuri-slate">
							{visibleGuides.length} guide
							{visibleGuides.length === 1 ? "" : "s"}
						</p>
					</div>

					<div className="flex flex-wrap gap-2">
						{!isBookmarksMode ? (
							<button
								type="button"
								className={cn(
									"min-h-10 rounded-full px-4 py-2 text-xs font-medium transition-colors",
									effectiveArcFilter === "all"
										? "bg-minuri-teal text-primary-foreground"
										: "bg-minuri-mist text-minuri-slate hover:bg-minuri-ice",
								)}
								onClick={() =>
									updateParams((params) => {
										params.delete("arc");
									})
								}
							>
								All arcs
							</button>
						) : null}
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

			{isBookmarksMode && !hasHydrated ? (
				<section className="mt-8 rounded-[2rem] bg-minuri-white p-6 shadow-sm ring-1 ring-minuri-silver/40">
					<p className="text-sm leading-6 text-minuri-slate">
						Loading bookmarks...
					</p>
				</section>
			) : visibleGuides.length > 0 ? (
				<section className="mt-8">
					{!isBookmarksMode ? (
						<div className="mb-5 flex items-center justify-between border-b border-minuri-silver/70 pb-3">
							<p className="text-[11px] uppercase tracking-[0.16em] text-minuri-mid">
								Featured Chapters
							</p>
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
									query: rawQuery,
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
				<section className="mt-8 rounded-[2rem] bg-minuri-white p-8 text-center shadow-sm ring-1 ring-minuri-silver/40">
					<h2 className="text-xl font-semibold tracking-tight text-minuri-ocean">
						No guides found
					</h2>
					<p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-minuri-slate">
						Try another arc, topic, or a broader keyword.
					</p>
				</section>
			)}
		</GuidesShell>
	);
}
