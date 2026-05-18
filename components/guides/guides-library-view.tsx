"use client";

import { startTransition, useDeferredValue } from "react";
import { ArrowLeft } from "lucide-react";
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
	type GuideTopicFilter,
} from "@/lib/guides";
import { cn } from "@/lib/utils";

const TOPIC_COLORS: Record<string, string> = {
	"food-eating": "#00f5c8",
	"getting-around": "#5dd6ff",
	"health-wellbeing": "#fcf300",
	"home-admin": "#ffc2d1",
	"social-belonging": "#cae9ff",
};

// ─── Card sub-components ──────────────────────────────────────────────────────

type SharedCardProps = {
	guide: Guide;
	href: string;
	accent: string;
	meta: ReturnType<typeof getTopicMeta>;
};

type BookmarkProps = {
	isBookmarked: boolean;
	onToggleBookmark: () => void;
};

function TopicBadge({ accent, label }: { accent: string; label: string }) {
	return (
		<span
			className="inline-block rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest"
			style={{ backgroundColor: accent, color: "#021819" }}
		>
			{label}
		</span>
	);
}

function HeroCard({
	guide,
	href,
	accent,
	meta,
	isBookmarked,
	onToggleBookmark,
}: SharedCardProps & BookmarkProps) {
	return (
		<article className="group minuri-link-underline-trigger">
			<div className="relative aspect-[16/9] overflow-hidden rounded-2xl">
				<Link
					href={href}
					className="absolute inset-0 z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-minuri-teal/60"
					aria-label={`Read guide: ${guide.title}`}
				/>
				<Image
					src={guide.thumbnailUrl}
					alt={guide.title}
					fill
					sizes="(max-width: 1024px) 100vw, 66vw"
					className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
					priority
				/>
				<div className="absolute right-3 top-3 z-20">
					<BookmarkButton
						active={isBookmarked}
						onToggle={onToggleBookmark}
						className="border-white/20 bg-black/25 text-white backdrop-blur-sm hover:bg-black/45"
					/>
				</div>
			</div>
			<div className="mt-4">
				<div className="mb-2 flex items-center gap-2.5">
					<TopicBadge accent={accent} label={meta?.name ?? guide.topic} />
					<span className="text-xs text-minuri-slate">
						{guide.readingTimeMin} min read
					</span>
				</div>
				<Link href={href} tabIndex={-1} aria-hidden>
					<h3
						className="w-fit pb-1 text-2xl font-semibold leading-tight text-minuri-ocean md:text-3xl"
						style={{ fontFamily: "var(--font-hero-serif)" }}
					>
						<span className="minuri-link-underline-multiline">{guide.title}</span>
					</h3>
					{guide.summary && (
						<p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-minuri-slate">
							{guide.summary}
						</p>
					)}
				</Link>
			</div>
		</article>
	);
}

function ListItem({ guide, href, accent, meta }: SharedCardProps) {
	return (
		<article className="group minuri-link-underline-trigger flex gap-3">
			<Link
				href={href}
				className="flex w-full gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-minuri-teal/60 focus-visible:ring-offset-2"
				aria-label={`Read guide: ${guide.title}`}
			>
				<div className="relative h-[72px] w-28 shrink-0 overflow-hidden rounded-lg">
					<Image
						src={guide.thumbnailUrl}
						alt={guide.title}
						fill
						sizes="112px"
						className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
					/>
				</div>
				<div className="min-w-0 flex-1 py-0.5">
					<TopicBadge accent={accent} label={meta?.name ?? guide.topic} />
					<h4
						className="mt-1 w-fit pb-1 line-clamp-2 text-sm font-medium leading-snug text-minuri-ocean"
						style={{ fontFamily: "var(--font-hero-serif)" }}
					>
						<span className="minuri-link-underline-multiline">{guide.title}</span>
					</h4>
					<p className="mt-0.5 text-[10px] text-minuri-slate">
						{guide.readingTimeMin} min read
					</p>
				</div>
			</Link>
		</article>
	);
}

function StackedCard({
	guide,
	href,
	accent,
	meta,
	isBookmarked,
	onToggleBookmark,
	aspectClass = "aspect-[4/3]",
}: SharedCardProps &
	BookmarkProps & {
		aspectClass?: string;
	}) {
	return (
		<article className="group minuri-link-underline-trigger">
			<div className={cn("relative overflow-hidden rounded-xl", aspectClass)}>
				<Link
					href={href}
					className="absolute inset-0 z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-minuri-teal/60"
					aria-label={`Read guide: ${guide.title}`}
				/>
				<Image
					src={guide.thumbnailUrl}
					alt={guide.title}
					fill
					sizes="(max-width: 1024px) 50vw, 25vw"
					className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
				/>
				<div className="absolute right-2 top-2 z-20">
					<BookmarkButton
						active={isBookmarked}
						onToggle={onToggleBookmark}
						className="border-white/20 bg-black/25 text-white backdrop-blur-sm hover:bg-black/45"
					/>
				</div>
			</div>
			<div className="mt-2.5">
				<div className="mb-1.5 flex items-center gap-2">
					<TopicBadge accent={accent} label={meta?.name ?? guide.topic} />
					<span className="text-[10px] text-minuri-slate">
						{guide.readingTimeMin} min
					</span>
				</div>
				<Link href={href} tabIndex={-1} aria-hidden>
					<h3
						className="w-fit pb-1 line-clamp-2 text-sm font-medium leading-snug text-minuri-ocean"
						style={{ fontFamily: "var(--font-hero-serif)" }}
					>
						<span className="minuri-link-underline-multiline">{guide.title}</span>
					</h3>
				</Link>
			</div>
		</article>
	);
}

// ─── Per-topic Forbes section ─────────────────────────────────────────────────

type TopicSectionProps = {
	topicSlug: string;
	topicName: string;
	guides: Guide[];
	activeTopicFilter: GuideTopicFilter;
	rawQuery: string;
	isBookmarked: (slug: string) => boolean;
	toggleBookmark: (slug: string) => void;
	prefersReducedMotion: boolean;
	entranceEase: [number, number, number, number];
	showHeader: boolean;
};

function TopicSection({
	topicSlug,
	topicName,
	guides,
	activeTopicFilter,
	rawQuery,
	isBookmarked,
	toggleBookmark,
	prefersReducedMotion,
	entranceEase,
	showHeader,
}: TopicSectionProps) {
	const accent = TOPIC_COLORS[topicSlug] ?? "#00f5c8";
	const [hero, ...rest] = guides;
	const sidebarItems = rest.slice(0, 2);
	const listItems = rest.slice(2, 6);
	const gridItems = rest.slice(6);

	function href(guide: Guide) {
		return buildGuideHref(guide, {
			topicFilter: activeTopicFilter,
			query: rawQuery,
			from: "library",
		});
	}

	return (
		<section>
			{showHeader && (
				<div className="mb-6 flex items-center gap-3 border-b border-minuri-silver/30 pb-3">
					<span
						className="h-3 w-3 rounded-full"
						style={{ backgroundColor: accent }}
					/>
					<h2 className="text-xs font-black uppercase tracking-[0.18em] text-minuri-ocean">
						{topicName}
					</h2>
				</div>
			)}

			{/* Hero + sidebar */}
			<div className="lg:grid lg:grid-cols-3 lg:gap-8">
				{/* Left 2/3: hero + list */}
				<div className="lg:col-span-2">
					<motion.div
						initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.05 }}
						transition={{ duration: 0.5, ease: entranceEase }}
					>
						<HeroCard
							guide={hero}
							href={href(hero)}
							accent={accent}
							meta={getTopicMeta(hero.topic)}
							isBookmarked={isBookmarked(hero.slug)}
							onToggleBookmark={() => toggleBookmark(hero.slug)}
						/>
					</motion.div>

					{listItems.length > 0 && (
						<div className="mt-6 border-t border-minuri-silver/20 pt-5">
							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
								{listItems.map((guide, i) => (
									<motion.div
										key={guide.slug}
										initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 12 }}
										whileInView={{ opacity: 1, y: 0 }}
										viewport={{ once: true, amount: 0.1 }}
										transition={{
											duration: 0.4,
											delay: prefersReducedMotion ? 0 : i * 0.06,
											ease: entranceEase,
										}}
									>
										<ListItem
											guide={guide}
											href={href(guide)}
											accent={accent}
											meta={getTopicMeta(guide.topic)}
										/>
									</motion.div>
								))}
							</div>
						</div>
					)}
				</div>

				{/* Right 1/3: sidebar — desktop only */}
				{sidebarItems.length > 0 && (
					<div className="hidden lg:col-span-1 lg:flex lg:flex-col lg:gap-6 lg:border-l lg:border-minuri-silver/30 lg:pl-8">
						{sidebarItems.map((guide, i) => (
							<motion.div
								key={guide.slug}
								initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 12 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true, amount: 0.1 }}
								transition={{
									duration: 0.4,
									delay: prefersReducedMotion ? 0 : i * 0.08,
									ease: entranceEase,
								}}
							>
								<StackedCard
									guide={guide}
									href={href(guide)}
									accent={accent}
									meta={getTopicMeta(guide.topic)}
									isBookmarked={isBookmarked(guide.slug)}
									onToggleBookmark={() => toggleBookmark(guide.slug)}
								/>
							</motion.div>
						))}
					</div>
				)}
			</div>

			{/* Overflow grid */}
			{gridItems.length > 0 && (
				<div className="mt-8 border-t border-minuri-silver/20 pt-6">
					<div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
						{gridItems.map((guide, i) => (
							<motion.div
								key={guide.slug}
								initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 14 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true, amount: 0.1 }}
								transition={{
									duration: 0.4,
									delay: prefersReducedMotion ? 0 : (i % 4) * 0.05,
									ease: entranceEase,
								}}
							>
								<StackedCard
									guide={guide}
									href={href(guide)}
									accent={accent}
									meta={getTopicMeta(guide.topic)}
									aspectClass="aspect-[16/9]"
									isBookmarked={isBookmarked(guide.slug)}
									onToggleBookmark={() => toggleBookmark(guide.slug)}
								/>
							</motion.div>
						))}
					</div>
				</div>
			)}
		</section>
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

	const visibleGuides = filterGuides(GUIDES, activeTopicFilter, deferredQuery);

	// Group by topic, preserving GUIDE_TOPICS order
	const topicSections = GUIDE_TOPICS.map((topic) => ({
		slug: topic.slug,
		name: topic.name,
		guides: visibleGuides.filter((g) => g.topic === topic.slug),
	})).filter(({ guides }) => guides.length > 0);

	const showHeaders = topicSections.length > 1;

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
							initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 6 }}
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
								initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 6 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{
									duration: prefersReducedMotion ? 0 : 0.3,
									delay: prefersReducedMotion ? 0 : (index + 1) * 0.04,
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
								<span className="relative z-10">{topic.name}</span>
							</motion.button>
						))}
					</div>
				</LayoutGroup>
			</div>
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
					<div className="space-y-16 px-6 pb-20 md:px-8">
						{topicSections.map((section) => (
							<TopicSection
								key={section.slug}
								topicSlug={section.slug}
								topicName={section.name}
								guides={section.guides}
								activeTopicFilter={activeTopicFilter}
								rawQuery={rawQuery}
								isBookmarked={isBookmarked}
								toggleBookmark={toggleBookmark}
								prefersReducedMotion={!!prefersReducedMotion}
								entranceEase={entranceEase}
								showHeader={showHeaders}
							/>
						))}
					</div>
				)}
			</div>
		</GuidesShell>
	);
}
