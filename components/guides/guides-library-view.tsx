"use client";

import { startTransition, useDeferredValue } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { LayoutGroup, motion, useReducedMotion } from "motion/react";

import { GUIDE_TOPICS, GUIDES } from "@/content/guides";
import type { Guide } from "@/content/guides";
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

type BentoVariant = "xl" | "tall" | "wide" | "sm" | "color";

// One fixed variant per guide (by position in the full GUIDES array).
// Filtered subsets retain their per-guide identity — no repeating pattern visible.
const GUIDE_LAYOUT: Array<{ cols: number; rows: number; variant: BentoVariant }> = [
	{ cols: 2, rows: 2, variant: "xl" },    // 0
	{ cols: 1, rows: 1, variant: "color" }, // 1
	{ cols: 1, rows: 2, variant: "tall" },  // 2
	{ cols: 1, rows: 1, variant: "sm" },    // 3
	{ cols: 2, rows: 1, variant: "wide" },  // 4
	{ cols: 1, rows: 1, variant: "color" }, // 5
	{ cols: 1, rows: 1, variant: "sm" },    // 6
	{ cols: 1, rows: 2, variant: "tall" },  // 7
	{ cols: 1, rows: 1, variant: "sm" },    // 8
	{ cols: 2, rows: 1, variant: "wide" },  // 9
	{ cols: 1, rows: 1, variant: "color" }, // 10
	{ cols: 1, rows: 2, variant: "tall" },  // 11
	{ cols: 2, rows: 1, variant: "wide" },  // 12
	{ cols: 1, rows: 1, variant: "sm" },    // 13
	{ cols: 1, rows: 1, variant: "color" }, // 14
	{ cols: 2, rows: 2, variant: "xl" },    // 15
	{ cols: 1, rows: 1, variant: "sm" },    // 16
	{ cols: 1, rows: 1, variant: "color" }, // 17
	{ cols: 1, rows: 2, variant: "tall" },  // 18
	{ cols: 2, rows: 1, variant: "wide" },  // 19
	{ cols: 1, rows: 1, variant: "sm" },    // 20
	{ cols: 1, rows: 1, variant: "color" }, // 21
	{ cols: 1, rows: 1, variant: "sm" },    // 22
	{ cols: 1, rows: 1, variant: "color" }, // 23
	{ cols: 2, rows: 1, variant: "wide" },  // 24
	{ cols: 1, rows: 2, variant: "tall" },  // 25
	{ cols: 1, rows: 1, variant: "sm" },    // 26
	{ cols: 2, rows: 2, variant: "xl" },    // 27
	{ cols: 1, rows: 1, variant: "color" }, // 28
	{ cols: 1, rows: 2, variant: "tall" },  // 29
	{ cols: 1, rows: 1, variant: "sm" },    // 30
	{ cols: 2, rows: 1, variant: "wide" },  // 31
];

// O(1) lookup: guide slug → index in full GUIDES array
const GUIDE_INDEX_MAP = new Map(GUIDES.map((g, i) => [g.slug, i]));

// ─── Card sub-components ──────────────────────────────────────────────────────

type ImageCardProps = {
	guide: Guide;
	href: string;
	accent: string;
	meta: ReturnType<typeof getTopicMeta>;
	variant: "xl" | "tall" | "sm";
	isBookmarked: boolean;
	onToggleBookmark: () => void;
	prefersReducedMotion: boolean;
};

function ImageCard({
	guide,
	href,
	accent,
	meta,
	variant,
	isBookmarked,
	onToggleBookmark,
	prefersReducedMotion,
}: ImageCardProps) {
	const isXl = variant === "xl";

	return (
		<motion.article
			className="group relative h-full w-full overflow-hidden shadow-sm"
			style={{ borderRadius: 16 }}
			whileHover={prefersReducedMotion ? {} : { borderRadius: 32 }}
			transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
		>
			<Link
				href={href}
				className="absolute inset-0 z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-minuri-teal/60"
				aria-label={`Read guide: ${guide.title}`}
			/>
			{/* Clip wrapper inherits animated border-radius — prevents 1-frame lag */}
			<div className="absolute inset-0 overflow-hidden" style={{ borderRadius: "inherit" }}>
				<Image
					src={guide.thumbnailUrl}
					alt={guide.title}
					fill
					sizes={
						isXl
							? "(max-width: 1024px) 100vw, 50vw"
							: "(max-width: 1024px) 50vw, 25vw"
					}
					className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
					priority={isXl}
				/>
			</div>
			{/* Gradient overlay */}
			<div
				className="absolute inset-0"
				style={{
					background: isXl
						? `linear-gradient(135deg, ${accent}55 0%, transparent 40%), linear-gradient(to top, rgba(2,24,25,0.94) 0%, rgba(2,24,25,0.22) 50%, transparent 75%)`
						: `linear-gradient(to top, rgba(2,24,25,0.92) 0%, rgba(2,24,25,0.12) 55%, transparent 80%)`,
				}}
			/>
			{/* Topic color accent line */}
			<div
				className="absolute top-0 left-0 right-0 h-0.5"
				style={{ backgroundColor: accent }}
			/>
			{/* Card content */}
			<div
				className={cn(
					"absolute bottom-0 left-0 right-0 z-20",
					isXl ? "p-7" : "p-4",
				)}
			>
				<div className="mb-2 flex items-center gap-2">
					<span
						className={cn(
							"rounded-full font-black uppercase tracking-[0.15em]",
							isXl
								? "px-3 py-1 text-[10px]"
								: "px-2 py-0.5 text-[9px]",
						)}
						style={{ backgroundColor: accent, color: "#021819" }}
					>
						{meta?.name ?? guide.topic}
					</span>
					<span
						className={cn(
							"text-white/45",
							isXl ? "text-xs" : "text-[10px]",
						)}
					>
						{guide.readingTimeMin} min
					</span>
				</div>
				<h3
					className={cn(
						"font-black leading-tight text-white",
						isXl
							? "max-w-2xl text-3xl md:text-4xl"
							: "line-clamp-2 text-sm",
					)}
					style={{ fontFamily: "var(--font-hero-serif)" }}
				>
					{guide.title}
				</h3>
				{isXl && guide.summary && (
					<p className="mt-2 max-w-lg text-sm leading-relaxed text-white/50 line-clamp-2">
						{guide.summary}
					</p>
				)}
			</div>
			<div className="absolute right-3 top-3 z-20">
				<BookmarkButton
					active={isBookmarked}
					onToggle={onToggleBookmark}
					className="border-white/20 bg-black/25 text-white backdrop-blur-sm hover:bg-black/45"
				/>
			</div>
		</motion.article>
	);
}

type WideCardProps = {
	guide: Guide;
	href: string;
	accent: string;
	meta: ReturnType<typeof getTopicMeta>;
	isBookmarked: boolean;
	onToggleBookmark: () => void;
	prefersReducedMotion: boolean;
};

function WideCard({
	guide,
	href,
	accent,
	meta,
	isBookmarked,
	onToggleBookmark,
	prefersReducedMotion,
}: WideCardProps) {
	return (
		<motion.article
			className="group relative flex h-full w-full overflow-hidden shadow-sm"
			style={{ borderRadius: 16 }}
			whileHover={prefersReducedMotion ? {} : { borderRadius: 32 }}
			transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
		>
			<Link
				href={href}
				className="absolute inset-0 z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-minuri-teal/60"
				aria-label={`Read guide: ${guide.title}`}
			/>
			{/* Left: solid topic color panel with text */}
			<div
				className="flex w-2/5 shrink-0 flex-col justify-between p-5"
				style={{ backgroundColor: accent }}
			>
				<span className="text-[9px] font-black uppercase tracking-widest text-black/40">
					{meta?.name ?? guide.topic}
				</span>
				<div>
					<h3
						className="line-clamp-3 text-base font-black leading-snug text-minuri-ocean"
						style={{ fontFamily: "var(--font-hero-serif)" }}
					>
						{guide.title}
					</h3>
					<p className="mt-1.5 text-[10px] text-black/45">
						{guide.readingTimeMin} min read
					</p>
				</div>
			</div>
			{/* Right: image — no inner overflow-hidden; outer article handles the clip */}
			<div className="relative flex-1">
				<Image
					src={guide.thumbnailUrl}
					alt={guide.title}
					fill
					sizes="33vw"
					className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
				/>
			</div>
			<div className="absolute right-3 top-3 z-20">
				<BookmarkButton
					active={isBookmarked}
					onToggle={onToggleBookmark}
					className="border-white/20 bg-black/25 text-white backdrop-blur-sm hover:bg-black/45"
				/>
			</div>
		</motion.article>
	);
}

type ColorCardProps = {
	guide: Guide;
	href: string;
	accent: string;
	meta: ReturnType<typeof getTopicMeta>;
	prefersReducedMotion: boolean;
};

function ColorCard({ guide, href, accent, meta, prefersReducedMotion }: ColorCardProps) {
	return (
		<motion.article
			className="group relative flex h-full w-full flex-col justify-between overflow-hidden p-5 shadow-sm"
			style={{ backgroundColor: accent, borderRadius: 16 }}
			whileHover={prefersReducedMotion ? {} : { borderRadius: 32 }}
			transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
		>
			<Link
				href={href}
				className="absolute inset-0 z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-minuri-ocean/40"
				aria-label={`Read guide: ${guide.title}`}
			/>
			<span className="relative z-20 text-[9px] font-black uppercase tracking-widest text-black/40">
				{meta?.name ?? guide.topic}
			</span>
			<div className="relative z-20">
				<h3
					className="line-clamp-3 text-lg font-black leading-snug text-minuri-ocean"
					style={{ fontFamily: "var(--font-hero-serif)" }}
				>
					{guide.title}
				</h3>
				<div className="mt-3 flex items-center justify-between">
					<span className="text-[10px] text-black/45">
						{guide.readingTimeMin} min read
					</span>
					<div className="flex size-7 items-center justify-center rounded-full bg-minuri-ocean transition-transform duration-200 group-hover:translate-x-0.5">
						<ArrowRight className="size-3 text-white" />
					</div>
				</div>
			</div>
		</motion.article>
	);
}

// ─── Main view ────────────────────────────────────────────────────────────────

export function GuidesLibraryView() {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const { isBookmarked, toggleBookmark } = useGuideBookmarks();

	const prefersReducedMotion = useReducedMotion();
	const springTransition = {
		type: "spring" as const,
		bounce: 0.15,
		duration: prefersReducedMotion ? 0 : 0.35,
	};
	const entranceEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

	const activeTopicFilter = parseGuideTopicFilter(searchParams.get("topic"));
	const rawQuery = searchParams.get("q") ?? "";
	const deferredQuery = useDeferredValue(rawQuery);

	const visibleGuides = filterGuides(
		GUIDES,
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

	const guidesSearchFilter = (
		<div className="mb-10 mt-6 px-6 md:px-8 xl:mb-12 xl:mt-8">
			<div className="overflow-hidden rounded-2xl bg-minuri-white ring-1 ring-minuri-silver/30">
				<div className="flex items-center px-6 pt-6 pb-3 xl:px-8 xl:pt-8 xl:pb-4">
					<input
						id="guide-search"
						type="search"
						value={rawQuery}
						placeholder="Search guides…"
						className="flex-1 bg-transparent text-4xl font-bold leading-tight text-minuri-ocean outline-none placeholder:text-minuri-ocean/20 xl:text-5xl 2xl:text-6xl"
						onChange={(e) =>
							updateParams((params) => {
								const v = e.target.value.trimStart();
								if (v) params.set("q", v);
								else params.delete("q");
							})
						}
					/>
				</div>
				<div className="mx-6 h-px bg-minuri-silver/20 xl:mx-8" />
				<LayoutGroup id="guide-topic-filter">
					<div className="flex items-center gap-2 overflow-x-auto px-6 py-3 scrollbar-none xl:gap-3 xl:px-8 xl:py-4">
						<motion.button
							type="button"
							onClick={() =>
								updateParams((params) => params.delete("topic"))
							}
							initial={{
								opacity: 0,
								y: prefersReducedMotion ? 0 : 6,
							}}
							animate={{ opacity: 1, y: 0 }}
							transition={{
								duration: prefersReducedMotion ? 0 : 0.3,
								ease: entranceEase,
							}}
							className={cn(
								"relative shrink-0 rounded-lg px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest transition-colors xl:px-5 xl:py-2",
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
								initial={{
									opacity: 0,
									y: prefersReducedMotion ? 0 : 6,
								}}
								animate={{ opacity: 1, y: 0 }}
								transition={{
									duration: prefersReducedMotion ? 0 : 0.3,
									delay: prefersReducedMotion
										? 0
										: (index + 1) * 0.04,
									ease: entranceEase,
								}}
								className={cn(
									"relative shrink-0 rounded-lg px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest transition-colors xl:px-5 xl:py-2",
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
								<span className="relative z-10">
									{topic.name}
								</span>
							</motion.button>
						))}
					</div>
				</LayoutGroup>
			</div>
		</div>
	);

	const bentoGrid = (
		<div className="grid grid-cols-2 gap-3 pb-20 lg:grid-cols-4 lg:gap-4 [grid-auto-flow:dense] auto-rows-[185px] lg:auto-rows-[230px]">
			{visibleGuides.map((guide, i) => {
				const guideIndex = GUIDE_INDEX_MAP.get(guide.slug) ?? i;
				const { cols, rows, variant } = GUIDE_LAYOUT[guideIndex % GUIDE_LAYOUT.length];
				const rotation = prefersReducedMotion ? 0 : Math.sin(guideIndex * 2.399) * 0.4;
				const accent = TOPIC_COLORS[guide.topic] ?? "#00f5c8";
				const meta = getTopicMeta(guide.topic);
				const href = buildGuideHref(guide, {
					topicFilter: activeTopicFilter,
					query: rawQuery,
					from: "library",
				});

				const colSpanClass = cols === 2 ? "col-span-2" : "col-span-1";
				const rowSpanClass = rows === 2 ? "row-span-2" : "row-span-1";

				return (
					<motion.div
						key={guide.slug}
						className={cn(colSpanClass, rowSpanClass)}
						initial={{
							opacity: 0,
							y: prefersReducedMotion ? 0 : 20,
						}}
						whileInView={{ opacity: 1, y: 0, rotate: rotation }}
						viewport={{ once: true, amount: 0.05 }}
						transition={{
							duration: 0.45,
							delay: prefersReducedMotion ? 0 : (i % 6) * 0.05,
							ease: entranceEase,
						}}
					>
						{variant === "color" ? (
							<ColorCard
								guide={guide}
								href={href}
								accent={accent}
								meta={meta}
								prefersReducedMotion={!!prefersReducedMotion}
							/>
						) : variant === "wide" ? (
							<WideCard
								guide={guide}
								href={href}
								accent={accent}
								meta={meta}
								isBookmarked={isBookmarked(guide.slug)}
								onToggleBookmark={() =>
									toggleBookmark(guide.slug)
								}
								prefersReducedMotion={!!prefersReducedMotion}
							/>
						) : (
							<ImageCard
								guide={guide}
								href={href}
								accent={accent}
								meta={meta}
								variant={variant}
								isBookmarked={isBookmarked(guide.slug)}
								onToggleBookmark={() =>
									toggleBookmark(guide.slug)
								}
								prefersReducedMotion={!!prefersReducedMotion}
							/>
						)}
					</motion.div>
				);
			})}
		</div>
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
			title="Your First-Time Guides"
			description="Every topic, one guide at a time."
			headerStart={libraryBackHome}
		>
			<div className="mx-auto w-full max-w-screen-2xl">
				{guidesSearchFilter}
				{visibleGuides.length === 0 ? (
					<div className="px-6 md:px-8">
						<section className="rounded-[2rem] bg-minuri-white p-8 text-center ring-1 ring-minuri-silver/40">
							<h2 className="text-xl font-semibold tracking-tight text-minuri-ocean">
								No guides found
							</h2>
							<p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-minuri-slate">
								{rawQuery.trim()
									? "Try a different search, or adjust your topic filters."
									: "Try a different topic."}
							</p>
						</section>
					</div>
				) : (
					<div className="px-6 md:px-8">{bentoGrid}</div>
				)}
			</div>
		</GuidesShell>
	);
}
