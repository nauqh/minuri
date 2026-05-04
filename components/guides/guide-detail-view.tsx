"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowLeft, ExternalLink, Map as MapIcon, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { GUIDE_ARCS, GUIDES, type Guide } from "@/content/guides";
import type {
	GuideArcFilter,
	GuideOrigin,
	GuideTopicFilter,
} from "@/lib/guides";
import { BookmarkButton } from "@/components/guides/bookmark-button";
import { GuideCard } from "@/components/guides/guide-card";
import { GuideMarkdown } from "@/components/guides/guide-markdown";
import { JourneyNearbyPanel } from "@/components/journey/journey-nearby-panel";
import {
	buildGuideHref,
	getArcMeta,
	getNextGuide,
	getTopicMeta,
} from "@/lib/guides";
import { useGuideBookmarks } from "@/hooks/use-guide-bookmarks";
import { cn } from "@/lib/utils";

type GuideDetailViewProps = {
	guide: Guide;
	backHref: string;
	arcFilter: GuideArcFilter;
	topicFilter: GuideTopicFilter;
	query: string;
	from: GuideOrigin;
	suburb?: string;
};

type GuideContentJsonSection = {
	sectionKey: Guide["sections"][number]["sectionKey"];
	title?: string;
	value: string;
};

type GuideContentJson = {
	sections: GuideContentJsonSection[];
};

const SECTION_ENTER_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const UPDATED_LABEL = "Updated Apr 2026";
const HEADING_TO_SECTION_KEY: Record<
	string,
	Guide["sections"][number]["sectionKey"]
> = {
	"the moment": "moment",
	"the feeling": "feeling",
	"what nobody told you": "reveal",
	"the reveal": "reveal",
	"how it actually works": "how-it-works",
	"how it actually works.": "how-it-works",
	"the four options, clearly": "how-it-works",
	"the bridge": "bridge",
	"when you're ready": "bridge",
	"next chapter": "next-chapter",
	"up next": "next-chapter",
};

function toPlainCardText(value: string | undefined): string {
	if (!value) return "";

	return (
		value
			// Convert markdown links to plain label text.
			.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
			// Remove strong/emphasis markers while preserving content.
			.replace(/\*\*([^*]+)\*\*/g, "$1")
			.replace(/\*([^*]+)\*/g, "$1")
			.replace(/__([^_]+)__/g, "$1")
			.replace(/_([^_]+)_/g, "$1")
			// Normalize whitespace.
			.replace(/\s+/g, " ")
			.trim()
	);
}

function parseGuideMarkdownSections(markdown: string): Guide["sections"] {
	const lines = markdown.split(/\r?\n/);
	const sections: Guide["sections"] = [];
	let activeTitle: string | null = null;
	let activeKey: Guide["sections"][number]["sectionKey"] | null = null;
	let chunk: string[] = [];

	function flush() {
		if (!activeTitle || !activeKey) return;
		const content = chunk.join("\n").trim();
		sections.push({
			sectionKey: activeKey,
			title: activeTitle,
			body: content ? [content] : [],
		});
	}

	for (const line of lines) {
		const headingMatch = line.match(/^#{2,3}\s+(.+)$/);
		if (headingMatch) {
			const rawTitle = headingMatch[1].trim();
			const normalizedTitle = rawTitle
				.replace(/^\d+\.\s*/, "")
				.toLowerCase();
			const mapped = HEADING_TO_SECTION_KEY[normalizedTitle] ?? null;

			if (mapped) {
				flush();
				activeTitle = rawTitle;
				activeKey = mapped;
				chunk = [];
			} else if (activeKey) {
				// Keep unknown subheadings (e.g. "The bit nobody mentions") within active section markdown.
				chunk.push(`### ${rawTitle}`);
			}
			continue;
		}
		chunk.push(line);
	}

	flush();
	return sections;
}

function parseGuideJsonSections(rawContent: string): Guide["sections"] {
	try {
		const parsed = JSON.parse(rawContent) as GuideContentJson;
		if (!parsed || !Array.isArray(parsed.sections)) {
			return [];
		}

		return parsed.sections
			.filter((section): section is GuideContentJsonSection =>
				Boolean(
					section &&
					section.sectionKey &&
					typeof section.value === "string",
				),
			)
			.map((section) => ({
				sectionKey: section.sectionKey,
				title: section.title?.trim() || section.sectionKey,
				body: [section.value.trim()],
			}));
	} catch {
		return [];
	}
}

export function GuideDetailView({
	guide,
	backHref,
	arcFilter,
	topicFilter,
	query,
	from,
	suburb,
}: GuideDetailViewProps) {
	const { isBookmarked, toggleBookmark, bookmarks, hasHydrated } =
		useGuideBookmarks();
	const pathname = usePathname();
	const arcMeta = getArcMeta(guide.arc);
	const topicMeta = getTopicMeta(guide.topic);
	const nextGuide = getNextGuide(guide);
	const articleRef = useRef<HTMLElement | null>(null);
	const [readingProgress, setReadingProgress] = useState(0);
	const [markdownContent, setMarkdownContent] = useState<string | null>(null);
	const [isJourneySidebarOpen, setIsJourneySidebarOpen] = useState(false);
	const prefersReducedMotion = useReducedMotion();
	const links = [
		{
			href: "/",
			label: "Home",
			active: pathname === "/",
		},
		{
			href: "/guides",
			label: "Guides",
			active:
				pathname === "/guides" ||
				(pathname.startsWith("/guides/") &&
					pathname !== "/guides/bookmarks"),
		},
		{
			href: "/guides/bookmarks",
			label: "My Bookmarks",
			active: pathname === "/guides/bookmarks",
		},
		{
			href: "/near-me",
			label: "Near Me",
			active: pathname === "/near-me",
		},
	] as const;

	useEffect(() => {
		let isCancelled = false;
		if (!guide.markdownPath) {
			setMarkdownContent(null);
			return;
		}

		fetch(guide.markdownPath)
			.then((response) =>
				response.ok
					? response.text()
					: Promise.reject(new Error("Failed to load markdown")),
			)
			.then((text) => {
				if (!isCancelled) {
					setMarkdownContent(text);
				}
			})
			.catch(() => {
				if (!isCancelled) {
					setMarkdownContent(null);
				}
			});

		return () => {
			isCancelled = true;
		};
	}, [guide.markdownPath]);

	const resolvedSections = useMemo(() => {
		if (markdownContent) {
			const parsedJson = parseGuideJsonSections(markdownContent);
			if (parsedJson.length > 0) {
				return parsedJson;
			}

			const parsed = parseGuideMarkdownSections(markdownContent);
			if (parsed.length > 0) {
				return parsed;
			}
		}
		return guide.sections;
	}, [guide.sections, markdownContent]);

	const momentSection = resolvedSections.find(
		(section) => section.sectionKey === "moment",
	);
	const feelingSection = resolvedSections.find(
		(section) => section.sectionKey === "feeling",
	);
	const revealSection = resolvedSections.find(
		(section) => section.sectionKey === "reveal",
	);
	const bodySection = resolvedSections.find(
		(section) => section.sectionKey === "how-it-works",
	);
	const bridgeSection = resolvedSections.find(
		(section) => section.sectionKey === "bridge",
	);
	const nextChapterSection = resolvedSections.find(
		(section) => section.sectionKey === "next-chapter",
	);
	const bridgeCardText = toPlainCardText(bridgeSection?.body[0]);
	const nextChapterCardText = toPlainCardText(nextChapterSection?.body[0]);
	const journeyGuides = useMemo(() => {
		const arcSort = new Map(
			GUIDE_ARCS.map((arc) => [arc.slug, arc.sortOrder]),
		);
		return [...GUIDES].sort((a, b) => {
			const arcDelta =
				(arcSort.get(a.arc) ?? Number.MAX_SAFE_INTEGER) -
				(arcSort.get(b.arc) ?? Number.MAX_SAFE_INTEGER);
			if (arcDelta !== 0) return arcDelta;
			if (a.arcOrder !== b.arcOrder) return a.arcOrder - b.arcOrder;
			return a.title.localeCompare(b.title);
		});
	}, []);
	const currentGuideJourneyIndex = journeyGuides.findIndex(
		(item) => item.slug === guide.slug,
	);
	const currentArcGuides = useMemo(() => {
		return journeyGuides.filter((item) => item.arc === guide.arc);
	}, [guide.arc, journeyGuides]);
	const currentArcGuideIndex = currentArcGuides.findIndex(
		(item) => item.slug === guide.slug,
	);
	const arcJourneySummary = useMemo(() => {
		return GUIDE_ARCS.map((arc) => {
			const guidesInArc = journeyGuides.filter(
				(item) => item.arc === arc.slug,
			);
			const completed = guidesInArc.filter((item) =>
				isBookmarked(item.slug),
			).length;
			return {
				arc,
				total: guidesInArc.length,
				completed,
			};
		});
	}, [isBookmarked, journeyGuides]);
	const journeyMapBody = (
		<div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-4">
			<div className="rounded-[0.85rem] border border-minuri-silver/70 bg-minuri-fog/40 px-3.5 py-3">
				<p className="text-xs text-minuri-slate">
					{currentArcGuideIndex + 1} of {currentArcGuides.length} in{" "}
					{arcMeta?.name ?? "this moment"}
				</p>
			</div>

			<div className="grid gap-2.5">
				{arcJourneySummary.map(({ arc, total, completed }) => {
					const isCurrentArc = arc.slug === guide.arc;
					const isDoneArc = completed === total && total > 0;
					return (
						<div
							key={arc.slug}
							className={cn(
								"rounded-[0.85rem] border px-3.5 py-3",
								isCurrentArc
									? "border-minuri-teal/70 bg-minuri-mist"
									: "border-minuri-silver/70 bg-minuri-white",
							)}
						>
							<p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-minuri-mid">
								{arc.timeframeLabel}
							</p>
							<p className="mt-1 text-sm font-semibold text-minuri-ocean">
								{arc.name}
							</p>
							<p className="mt-1 text-xs text-minuri-slate">
								{completed}/{total} saved{" "}
								{isDoneArc
									? "· complete"
									: isCurrentArc
										? "· you are here"
										: ""}
							</p>
						</div>
					);
				})}
			</div>

			<div>
				<p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-minuri-mid">
					Current moment steps
				</p>
				<ol className="mt-3 space-y-2">
					{currentArcGuides.map((item, index) => {
						const isCurrent = item.slug === guide.slug;
						const isSaved = isBookmarked(item.slug);
						return (
							<li key={item.slug}>
								<Link
									href={buildGuideHref(
										{
											arc: item.arc,
											slug: item.slug,
										},
										{
											arcFilter,
											topicFilter,
											query,
											from,
										},
									)}
									className={cn(
										"flex items-center justify-between gap-3 rounded-[0.8rem] border px-3 py-2 text-sm transition-colors",
										isCurrent
											? "border-minuri-teal/70 bg-minuri-teal text-primary-foreground"
											: isSaved
												? "border-minuri-teal/40 bg-minuri-mist text-minuri-ocean hover:bg-minuri-ice"
												: "border-minuri-silver/70 bg-minuri-white text-minuri-slate hover:bg-minuri-fog",
									)}
									aria-current={isCurrent ? "step" : undefined}
									onClick={() => setIsJourneySidebarOpen(false)}
								>
									<span className="truncate">
										{index + 1}. {item.title}
									</span>
									{isCurrent ? (
										<span className="text-xs">Now</span>
									) : null}
								</Link>
							</li>
						);
					})}
				</ol>
			</div>
		</div>
	);

	useEffect(() => {
		if (!isJourneySidebarOpen) return;
		function onKeyDown(event: KeyboardEvent) {
			if (event.key === "Escape") {
				setIsJourneySidebarOpen(false);
			}
		}
		document.addEventListener("keydown", onKeyDown);
		return () => {
			document.removeEventListener("keydown", onKeyDown);
		};
	}, [isJourneySidebarOpen]);

	useEffect(() => {
		function updateProgress() {
			const article = articleRef.current;
			if (!article) return;

			const rect = article.getBoundingClientRect();
			const viewportHeight = window.innerHeight;
			const totalScrollable = Math.max(
				article.scrollHeight - viewportHeight,
				1,
			);
			const progressed = Math.min(
				Math.max(viewportHeight - rect.top, 0),
				totalScrollable,
			);
			const percent = Math.round((progressed / totalScrollable) * 100);
			setReadingProgress(
				Number.isFinite(percent)
					? Math.min(Math.max(percent, 0), 100)
					: 0,
			);
		}

		updateProgress();
		window.addEventListener("scroll", updateProgress, { passive: true });
		window.addEventListener("resize", updateProgress);

		return () => {
			window.removeEventListener("scroll", updateProgress);
			window.removeEventListener("resize", updateProgress);
		};
	}, [guide.slug]);

	useEffect(() => {
		if (!hasHydrated || readingProgress < 100) return;
		if (bookmarks.includes(guide.slug)) return;
		toggleBookmark(guide.slug);
	}, [
		bookmarks,
		guide.slug,
		hasHydrated,
		readingProgress,
		toggleBookmark,
	]);

	return (
		<div className="min-h-screen bg-minuri-white text-minuri-ink">
			<div className="fixed inset-x-0 top-0 z-50 h-[2px] bg-minuri-white">
				<div
					className="h-full bg-minuri-teal transition-all duration-300"
					style={{ width: `${readingProgress}%` }}
				/>
			</div>
			<header className="sticky top-[2px] z-40 bg-minuri-white backdrop-blur">
				<div className="mx-auto max-w-screen-2xl px-6">
					<div className="mx-auto flex min-h-21 w-full items-center justify-between bg-minuri-white">
						<Link
							href="/"
							className="z-10 flex items-center gap-2 text-2xl font-black tracking-tight text-minuri-ocean md:text-[2.1rem]"
						>
							<span className="uppercase">Minuri</span>
						</Link>
						<div className="z-10 ml-10 flex items-center gap-4 md:gap-6">
							<nav
								aria-label="Guides navigation"
								className="hidden items-center gap-10 text-base font-medium text-minuri-ocean md:flex"
							>
								{links.map((link) => (
									<Link
										key={link.href}
										href={link.href}
										className={cn(
											"minuri-link-underline inline-flex h-12 items-center whitespace-nowrap",
											link.active
												? "text-minuri-ocean"
												: "text-minuri-ocean/70 transition-colors duration-200 hover:text-minuri-ocean",
										)}
									>
										{link.label}
									</Link>
								))}
							</nav>
							<span className="text-xs font-semibold text-minuri-slate">
								{readingProgress}% complete
							</span>
						</div>
					</div>
				</div>
			</header>

			<main className="mx-auto max-w-screen-2xl px-6 py-8 md:py-10">
				<div className="mx-auto flex w-full max-w-368 items-start">
					<motion.article
						ref={articleRef}
						className="min-w-0 flex-1"
						initial={false}
						animate={{ x: 0 }}
						transition={{
							duration: prefersReducedMotion ? 0.01 : 0.3,
						}}
					>
						<div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
							<Link
								href={backHref}
								className="inline-flex items-center gap-2 text-xs text-minuri-slate transition-colors hover:text-minuri-teal"
							>
								<ArrowLeft
									className="size-4"
									aria-hidden="true"
								/>
								Back to guides
							</Link>
							<div className="flex items-center gap-2">
								<button
									type="button"
									onClick={() =>
										setIsJourneySidebarOpen(
											(current) => !current,
										)
									}
									className={cn(
										"inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
										isJourneySidebarOpen
											? "border-minuri-teal/70 bg-minuri-mist text-minuri-ocean hover:bg-minuri-ice"
											: "border-minuri-silver/80 text-minuri-ocean hover:bg-minuri-fog",
									)}
									aria-expanded={isJourneySidebarOpen}
								>
									<MapIcon
										className="size-3.5"
										aria-hidden="true"
									/>
									{isJourneySidebarOpen
										? "Hide map"
										: "Journey map"}
								</button>
								<BookmarkButton
									active={isBookmarked(guide.slug)}
									onToggle={() => toggleBookmark(guide.slug)}
									className="size-8 border-minuri-silver/80 text-minuri-teal hover:bg-minuri-fog"
								/>
							</div>
						</div>

						<section className="mx-auto mt-8 max-w-184">
							<p className="text-xs uppercase tracking-[0.14em] text-minuri-slate">
								{topicMeta?.name?.toUpperCase()} ·{" "}
								{arcMeta?.timeframeLabel?.toUpperCase()}
							</p>
							<h1 className="mt-4 text-4xl font-black leading-tight text-minuri-ocean md:text-5xl">
								{guide.title}
							</h1>
							<p className="mt-5 max-w-3xl text-lg leading-relaxed text-minuri-slate md:text-xl md:leading-[1.45]">
								{guide.summary}
							</p>
							<div className="mt-6">
								<p className="text-sm text-minuri-slate">
									{guide.readingTimeMin} minute read ·{" "}
									{UPDATED_LABEL}
								</p>
							</div>
							<div className="relative mt-8 h-[280px] overflow-hidden rounded-sm bg-minuri-fog md:h-[360px]">
								<Image
									src={guide.thumbnailUrl}
									alt={`${guide.title} hero artwork`}
									fill
									priority
									sizes="(max-width: 768px) 100vw, 900px"
									className="object-cover"
								/>
							</div>
						</section>

						<div className="mx-auto mt-10 max-w-184 space-y-12 md:mt-14">
							<motion.section
								initial={{
									opacity: 0,
									y: prefersReducedMotion ? 0 : 10,
								}}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true, amount: 0.2 }}
								transition={{
									duration: prefersReducedMotion ? 0.01 : 0.3,
									ease: SECTION_ENTER_EASE,
								}}
							>
								{momentSection ? (
									<GuideMarkdown
										markdown={momentSection.body.join(
											"\n\n",
										)}
										paragraphClassName="text-[1.06rem] leading-8 text-minuri-ink md:text-[1.15rem] md:leading-9"
									/>
								) : null}
								<div className="mt-5 space-y-5">
									{feelingSection ? (
										<GuideMarkdown
											markdown={feelingSection.body.join(
												"\n\n",
											)}
											paragraphClassName="text-[1.06rem] leading-8 text-minuri-ink md:text-[1.15rem] md:leading-9"
										/>
									) : null}
								</div>
							</motion.section>

							{revealSection ? (
								<motion.section
									initial={{
										opacity: 0,
										y: prefersReducedMotion ? 0 : 10,
									}}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true, amount: 0.2 }}
									transition={{
										duration: prefersReducedMotion
											? 0.01
											: 0.3,
										ease: SECTION_ENTER_EASE,
									}}
								>
									<h2 className="text-2xl font-semibold leading-tight text-minuri-ocean md:text-3xl">
										{revealSection.title}
									</h2>
									<div className="mt-6 border-l-2 border-minuri-silver pl-5">
										<GuideMarkdown
											markdown={revealSection.body.join(
												"\n\n",
											)}
											className="space-y-4"
											paragraphClassName="text-[1.04rem] leading-8 text-minuri-ink md:text-[1.12rem] md:leading-9"
										/>
									</div>
								</motion.section>
							) : null}

							{bodySection ? (
								<motion.section
									initial={{
										opacity: 0,
										y: prefersReducedMotion ? 0 : 10,
									}}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true, amount: 0.2 }}
									transition={{
										duration: prefersReducedMotion
											? 0.01
											: 0.3,
										ease: SECTION_ENTER_EASE,
									}}
								>
									<h2 className="text-2xl font-semibold leading-tight text-minuri-ocean md:text-3xl">
										{bodySection.title}
									</h2>
									<GuideMarkdown
										markdown={bodySection.body.join("\n\n")}
										className="mt-6 space-y-4"
										paragraphClassName="text-[1.04rem] leading-8 text-minuri-ink md:text-[1.1rem] md:leading-9"
									/>
								</motion.section>
							) : null}

							{guide.firstSteps && guide.firstSteps.length > 0 ? (
								<motion.section
									initial={{
										opacity: 0,
										y: prefersReducedMotion ? 0 : 10,
									}}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true, amount: 0.2 }}
									transition={{
										duration: prefersReducedMotion ? 0.01 : 0.3,
										ease: SECTION_ENTER_EASE,
									}}
									className="rounded-[0.85rem] border border-minuri-silver/70 bg-minuri-fog/50 px-6 py-7 md:px-8 md:py-8"
								>
									<h2 className="text-xl font-semibold text-minuri-ocean md:text-2xl">
										Your first steps
									</h2>
									<ol className="mt-5 space-y-3">
										{guide.firstSteps.map((step, index) => (
											<li
												key={index}
												className="flex items-start gap-4"
											>
												<span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-minuri-teal/15 text-xs font-bold text-minuri-teal">
													{index + 1}
												</span>
												<div className="flex min-w-0 flex-1 items-baseline justify-between gap-3">
													<span className="text-sm leading-relaxed text-minuri-ink">
														{step.label}
													</span>
													{step.estimateMin > 0 && (
														<span className="shrink-0 rounded-full bg-minuri-silver/40 px-2 py-0.5 text-xs text-minuri-slate">
															{step.estimateMin} min
														</span>
													)}
												</div>
											</li>
										))}
									</ol>
								</motion.section>
							) : null}

							{suburb ? (
								<motion.div
									initial={{
										opacity: 0,
										y: prefersReducedMotion ? 0 : 10,
									}}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true, amount: 0.1 }}
									transition={{
										duration: prefersReducedMotion ? 0.01 : 0.3,
										ease: SECTION_ENTER_EASE,
									}}
								>
									<JourneyNearbyPanel suburb={suburb} />
								</motion.div>
							) : null}

							{bridgeSection ? (
								<motion.section
									initial={{
										opacity: 0,
										y: prefersReducedMotion ? 0 : 10,
									}}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true, amount: 0.2 }}
									transition={{
										duration: prefersReducedMotion
											? 0.01
											: 0.3,
										ease: SECTION_ENTER_EASE,
									}}
									className="rounded-[0.85rem] border border-minuri-silver/80 bg-minuri-fog px-6 py-8 text-minuri-ink md:px-8 md:py-9"
								>
									<div className="mx-auto max-w-2xl">
										<p className="text-xs uppercase tracking-[0.14em] text-minuri-slate">
											Next step
										</p>
										<Link
											href={guide.nearMeDeeplink}
											className="mt-2 inline-flex text-lg font-semibold leading-tight text-minuri-ocean underline-offset-4 transition hover:text-minuri-teal hover:underline md:text-xl"
										>
											→ Find support near you
										</Link>
										<p className="mt-3 text-sm text-minuri-slate">
											{bridgeCardText}
										</p>
									</div>
								</motion.section>
							) : null}

							{nextGuide ? (
								<section>
									<p className="text-xs uppercase tracking-[0.14em] text-minuri-slate">
										Up next
									</p>
									<div className="mt-4">
										<GuideCard
											guide={nextGuide}
											href={`/guides/${nextGuide.arc}/${nextGuide.slug}`}
											bookmarked={isBookmarked(
												nextGuide.slug,
											)}
											onToggleBookmark={toggleBookmark}
										/>
									</div>
									<p className="mt-4 text-sm leading-7 text-minuri-slate">
										{nextChapterCardText ||
											"Continue the next guide in your moment."}
									</p>
								</section>
							) : null}

							{guide.sourceLinks.length > 0 ? (
								<section>
									<h2 className="text-2xl font-semibold text-minuri-ocean md:text-3xl">
										Sources and references
									</h2>
									<div className="mt-4 grid gap-2">
										{guide.sourceLinks.map((link) => (
											<a
												key={link.href}
												href={link.href}
												target="_blank"
												rel="noreferrer"
												className="inline-flex items-center gap-2 text-sm text-minuri-teal underline-offset-4 hover:underline"
											>
												{link.label}
												<ExternalLink
													className="size-4"
													aria-hidden="true"
												/>
											</a>
										))}
									</div>
								</section>
							) : null}
						</div>
					</motion.article>
					<motion.div
						className="hidden shrink-0 xl:block"
						animate={{
							width: isJourneySidebarOpen ? "26rem" : "0rem",
							marginLeft: isJourneySidebarOpen
								? "1.25rem"
								: "0rem",
							opacity: isJourneySidebarOpen ? 1 : 0,
						}}
						transition={{
							duration: prefersReducedMotion ? 0.01 : 0.28,
						}}
						style={{
							pointerEvents: isJourneySidebarOpen
								? "auto"
								: "none",
							overflow: "hidden",
						}}
					>
						<aside
							aria-label="Journey map"
							className="sticky top-24 h-[calc(100vh-7rem)] w-104 overflow-hidden rounded-[1rem] border border-minuri-silver/80 bg-minuri-white shadow-[-8px_10px_30px_-20px_color-mix(in_oklch,var(--minuri-ocean)_45%,transparent)]"
						>
							<div className="flex h-full min-w-0 flex-1 flex-col">
								<div className="flex items-center justify-between border-b border-minuri-silver/70 px-4 py-3">
									<div>
										<p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-minuri-mid">
											Your journey map
										</p>
										<p className="mt-1 text-xs text-minuri-slate">
											Guide {currentGuideJourneyIndex + 1}{" "}
											of {journeyGuides.length}
										</p>
									</div>
									<button
										type="button"
										onClick={() =>
											setIsJourneySidebarOpen(false)
										}
										className="flex size-9 items-center justify-center rounded-full bg-minuri-fog text-minuri-slate transition-colors hover:bg-minuri-mist"
										aria-label="Hide journey map"
									>
										<X
											className="size-4"
											aria-hidden="true"
										/>
									</button>
								</div>
								{journeyMapBody}
							</div>
						</aside>
					</motion.div>
				</div>
			</main>
			<AnimatePresence>
				{isJourneySidebarOpen ? (
					<motion.div
						className="fixed inset-0 z-60 xl:hidden"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: prefersReducedMotion ? 0.01 : 0.22 }}
					>
						<button
							type="button"
							className="absolute inset-0 bg-minuri-ocean/35 backdrop-blur-[1px]"
							onClick={() => setIsJourneySidebarOpen(false)}
							aria-label="Close journey map"
						/>
						<motion.aside
							aria-label="Journey map"
							className="absolute inset-x-0 bottom-0 flex h-[min(82vh,44rem)] flex-col overflow-hidden rounded-t-[1.25rem] border-t border-minuri-silver/70 bg-minuri-white shadow-[0_-12px_36px_-24px_color-mix(in_oklch,var(--minuri-ocean)_50%,transparent)]"
							initial={{ y: "100%" }}
							animate={{ y: 0 }}
							exit={{ y: "100%" }}
							transition={{ duration: prefersReducedMotion ? 0.01 : 0.28 }}
						>
							<div className="flex items-center justify-between border-b border-minuri-silver/70 px-4 py-3">
								<div>
									<p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-minuri-mid">
										Your journey map
									</p>
									<p className="mt-1 text-xs text-minuri-slate">
										Guide {currentGuideJourneyIndex + 1} of {journeyGuides.length}
									</p>
								</div>
								<button
									type="button"
									onClick={() => setIsJourneySidebarOpen(false)}
									className="flex size-9 items-center justify-center rounded-full bg-minuri-fog text-minuri-slate transition-colors hover:bg-minuri-mist"
									aria-label="Hide journey map"
								>
									<X className="size-4" aria-hidden="true" />
								</button>
							</div>
							{journeyMapBody}
						</motion.aside>
					</motion.div>
				) : null}
			</AnimatePresence>
		</div>
	);
}
