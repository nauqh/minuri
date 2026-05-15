"use client";

import { startTransition, useDeferredValue } from "react";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";

import { GUIDE_TOPICS, GUIDES } from "@/content/guides";
import { BookmarkButton } from "@/components/guides/bookmark-button";
import { GuidesShell } from "@/components/guides/guides-shell";
import { useGuideBookmarks } from "@/hooks/use-guide-bookmarks";
import {
	buildGuideHref,
	filterGuides,
	getTopicMeta,
	parseGuideTopicFilter,
} from "@/lib/guides";
import { cn } from "@/lib/utils";

const TOPIC_COLORS: Record<string, string> = {
	"food-eating": "#00f5c8",
	"getting-around": "#5dd6ff",
	"health-wellbeing": "#fcf300",
	"home-admin": "#ffc2d1",
	"social-belonging": "#cae9ff",
};

export function GuidesLibraryView() {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const { isBookmarked, toggleBookmark } = useGuideBookmarks();

	const prefersReducedMotion = useReducedMotion();
	const springTransition = { type: "spring" as const, bounce: 0.15, duration: prefersReducedMotion ? 0 : 0.35 };
	const entranceEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

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
			<LayoutGroup id="guide-topic-filter">
				<div className="flex items-center gap-2 overflow-x-auto px-8 py-4 scrollbar-none xl:gap-3 xl:px-10 xl:py-5 2xl:gap-4 2xl:px-14 2xl:py-6">
					<motion.button
						type="button"
						onClick={() =>
							updateParams((params) => params.delete("topic"))
						}
						initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 6 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: prefersReducedMotion ? 0 : 0.3, delay: 0, ease: entranceEase }}
						className={cn(
							"relative shrink-0 rounded-lg px-5 py-2 text-[11px] font-semibold uppercase tracking-widest transition-colors xl:px-6 xl:py-2.5 xl:text-xs 2xl:px-8 2xl:py-3 2xl:text-sm",
							activeTopicFilter === "all"
								? "text-white"
								: "text-minuri-slate/50 hover:text-minuri-ocean",
						)}
					>
						{activeTopicFilter === "all" && (
							<motion.span
								layoutId="active-filter-pill"
								className="absolute inset-0 rounded-lg bg-minuri-ocean"
								transition={springTransition}
							/>
						)}
						<span className="relative z-10">All</span>
					</motion.button>
					{GUIDE_TOPICS.map((topic, index) => (
						<motion.button
							key={topic.slug}
							type="button"
							onClick={() =>
								updateParams((params) =>
									params.set("topic", topic.slug),
								)
							}
							initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 6 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: prefersReducedMotion ? 0 : 0.3, delay: prefersReducedMotion ? 0 : (index + 1) * 0.05, ease: entranceEase }}
							className={cn(
								"relative shrink-0 rounded-lg px-5 py-2 text-[11px] font-semibold uppercase tracking-widest transition-colors xl:px-6 xl:py-2.5 xl:text-xs 2xl:px-8 2xl:py-3 2xl:text-sm",
								activeTopicFilter === topic.slug
									? "text-white"
									: "text-minuri-slate/50 hover:text-minuri-ocean",
							)}
						>
							{activeTopicFilter === topic.slug && (
								<motion.span
									layoutId="active-filter-pill"
									className="absolute inset-0 rounded-lg bg-minuri-ocean"
									transition={springTransition}
								/>
							)}
							<span className="relative z-10">{topic.name}</span>
						</motion.button>
					))}
				</div>
			</LayoutGroup>
		</div>
	);

	const getBentoClass = (i: number) => {
		const p = i % 5;
		if (p === 0) return "md:col-span-2 md:row-span-2";
		if (p === 4) return "md:col-span-2";
		return "";
	};

	const guidesListBody =
		visibleGuides.length > 0 ? (
			<section
				className="grid grid-cols-1 gap-5 md:grid-cols-3 md:[grid-auto-rows:220px]"
			>
				{visibleGuides.map((guide, i) => {
					const meta = getTopicMeta(guide.topic);
					const accent = TOPIC_COLORS[guide.topic] ?? "#00f5c8";
					const href = buildGuideHref(guide, { topicFilter: activeTopicFilter, query: rawQuery, from: "library" });
					const isLarge = i % 5 === 0;
					const isWide = i % 5 === 4;

					return (
						<motion.article
							key={guide.slug}
							className={cn(
								"group relative h-52 overflow-hidden rounded-2xl bg-minuri-fog md:h-auto",
								getBentoClass(i),
							)}
							initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.96 }}
							whileInView={{ opacity: 1, scale: 1 }}
							viewport={{ once: true, amount: 0.1 }}
							transition={{
								duration: prefersReducedMotion ? 0.01 : 0.4,
								delay: prefersReducedMotion ? 0 : (i % 3) * 0.07,
								ease: entranceEase,
							}}
						>
							<Link
								href={href}
								className="absolute inset-0 z-10 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-minuri-teal/60"
								aria-label={`Read guide: ${guide.title}`}
							/>
							<Image
								src={guide.thumbnailUrl}
								alt={guide.title}
								fill
								sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
								className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
								priority={i < 3}
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-[#021819]/90 via-[#021819]/30 to-transparent" />

							<div className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 p-4 md:p-5">
								<div className="mb-2 flex items-center gap-2">
									<span
										className="rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase tracking-[0.18em]"
										style={{ backgroundColor: accent, color: "#021819" }}
									>
										{meta?.name ?? guide.topic}
									</span>
									<span className="text-[10px] text-white/50">{guide.readingTimeMin} min</span>
								</div>
								<h3
									className={cn(
										"font-black leading-tight text-white",
										isLarge ? "text-xl md:text-2xl" : "text-sm md:text-base",
									)}
									style={{ fontFamily: "var(--font-hero-serif)" }}
								>
									{guide.title}
								</h3>
								{(isLarge || isWide) && (
									<p className="mt-2 line-clamp-2 text-xs leading-relaxed text-white/60 md:text-sm">
										{guide.summary}
									</p>
								)}
							</div>

							<div className="absolute right-3 top-3 z-20">
								<BookmarkButton
									active={isBookmarked(guide.slug)}
									onToggle={() => toggleBookmark(guide.slug)}
									className="bg-black/30 backdrop-blur-sm border-white/25 text-white hover:bg-black/50"
								/>
							</div>
						</motion.article>
					);
				})}
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
			href="/guides"
			className="inline-flex items-center gap-2 rounded-sm border border-minuri-ocean/20 bg-minuri-white/80 px-6 py-2 text-base font-semibold text-minuri-ocean shadow-xs backdrop-blur-sm transition-colors duration-200 hover:bg-minuri-ocean hover:text-minuri-white"
		>
			<ArrowLeft className="size-3.5" aria-hidden />
			Back
		</Link>
	);

	return (
		<GuidesShell
			title="Your Guides"
			description="Every topic, one guide at a time."
			headerStart={libraryBackHome}
		>
			<div className="mx-auto w-full max-w-screen-2xl">
				{guidesSearchFilter}
			</div>
			<div className="mx-auto w-full max-w-6xl px-12">
				{guidesListBody}
			</div>
		</GuidesShell>
	);
}
