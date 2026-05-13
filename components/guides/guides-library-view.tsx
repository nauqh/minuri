"use client";

import { startTransition, useDeferredValue } from "react";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import { GUIDE_TOPICS, GUIDES } from "@/content/guides";
import { GuideCard } from "@/components/guides/guide-card";
import { GuidesShell } from "@/components/guides/guides-shell";
import { useGuideBookmarks } from "@/hooks/use-guide-bookmarks";
import {
	buildGuideHref,
	filterGuides,
	parseGuideTopicFilter,
} from "@/lib/guides";
import { cn } from "@/lib/utils";

export function GuidesLibraryView() {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const { isBookmarked, toggleBookmark } = useGuideBookmarks();

	const activeTopicFilter = parseGuideTopicFilter(searchParams.get("topic"));
	const rawQuery = searchParams.get("q") ?? "";
	const deferredQuery = useDeferredValue(rawQuery);
	const filterQuery = deferredQuery;

	const visibleGuides = filterGuides(GUIDES, activeTopicFilter, filterQuery);

	function updateParams(updater: (params: URLSearchParams) => void) {
		startTransition(() => {
			const nextParams = new URLSearchParams(searchParams.toString());
			updater(nextParams);
			const nextQuery = nextParams.toString();
			const nextHref = nextQuery ? `${pathname}?${nextQuery}` : pathname;
			window.history.replaceState(null, "", nextHref);
		});
	}

	// ── Combined search + topic filter bar ──
	const guidesSearchFilter = (
		<div className="mb-12 mt-8 px-12 overflow-hidden rounded-2xl bg-minuri-white xl:mb-14 xl:mt-10 2xl:mb-16 2xl:mt-12">
			{/* Search row */}
			<div className="flex items-center gap-6 px-8 pt-6 pb-3 xl:px-10 xl:pt-8 xl:pb-4 2xl:px-14 2xl:pt-10 2xl:pb-5">
				<input
					id="guide-search"
					type="search"
					value={rawQuery}
					placeholder="Search"
					className="flex-1 bg-transparent text-5xl font-bold leading-tight text-minuri-ocean outline-none placeholder:text-minuri-ocean/30 xl:text-6xl 2xl:text-7xl"
					onChange={(e) =>
						updateParams((params) => {
							const v = e.target.value.trimStart();
							if (v) params.set("q", v);
							else params.delete("q");
						})
					}
				/>
				<div className="flex h-12 shrink-0 items-center justify-center rounded-2xl bg-minuri-ocean px-6 text-white xl:h-14 xl:px-8 2xl:h-16 2xl:px-10">
					<ArrowRight className="size-5 xl:size-6 2xl:size-7" />
				</div>
			</div>

			{/* Divider — full width */}
			<div className="mx-8 h-px bg-minuri-silver/30 xl:mx-10 2xl:mx-14" />

			{/* Topic filter row */}
			<div className="flex items-center gap-2 overflow-x-auto px-8 py-4 scrollbar-none xl:gap-3 xl:px-10 xl:py-5 2xl:gap-4 2xl:px-14 2xl:py-6">
				<button
					type="button"
					onClick={() =>
						updateParams((params) => params.delete("topic"))
					}
					className={cn(
						"shrink-0 rounded-lg px-5 py-2 text-[11px] font-semibold uppercase tracking-widest transition-colors xl:px-6 xl:py-2.5 xl:text-xs 2xl:px-8 2xl:py-3 2xl:text-sm",
						activeTopicFilter === "all"
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
						onClick={() =>
							updateParams((params) =>
								params.set("topic", topic.slug),
							)
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
		visibleGuides.length > 0 ? (
			<section>
				<div className="grid grid-cols-1 gap-x-4 gap-y-12 sm:grid-cols-2">
					{visibleGuides.map((guide, index) => (
						<GuideCard
							key={guide.slug}
							guide={guide}
							href={buildGuideHref(guide, {
								topicFilter: activeTopicFilter,
								query: rawQuery,
								from: "library",
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
					{rawQuery.trim()
						? "Try a different search, or adjust your topic filters."
						: "Try a different topic."}
				</p>
			</section>
		);

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
			title="Your Guides"
			description="Every topic, one guide at a time."
			headerStart={libraryBackHome}
		>
			<div className="space-y-8">
				{guidesSearchFilter}
				{guidesListBody}
			</div>
		</GuidesShell>
	);
}
