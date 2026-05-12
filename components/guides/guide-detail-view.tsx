"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowLeft, Bookmark, BookmarkCheck, Copy, Check, Download, ExternalLink, Map as MapIcon, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { GUIDE_TOPICS, GUIDES, type Guide } from "@/content/guides";
import type {
	GuideOrigin,
	GuideTopicFilter,
} from "@/lib/guides";
import { BookmarkButton } from "@/components/guides/bookmark-button";
import { GuideCard } from "@/components/guides/guide-card";
import { GuideMarkdown } from "@/components/guides/guide-markdown";
import { GuideSectionLabel } from "@/components/guides/guide-section-label";
import {
	buildGuideHref,
	getNextGuide,
	getTopicMeta,
} from "@/lib/guides";
import { useGuideBookmarks } from "@/hooks/use-guide-bookmarks";
import { cn } from "@/lib/utils";
import { GuideShareModal } from "@/components/guides/guide-share-modal";

type GuideDetailViewProps = {
	guide: Guide;
	backHref: string;
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
	topicFilter,
	query,
	from,
	suburb,
}: GuideDetailViewProps) {
	const { isBookmarked, toggleBookmark, bookmarks, hasHydrated } =
		useGuideBookmarks();
	const pathname = usePathname();
	const topicMeta = getTopicMeta(guide.topic);
	const nextGuide = getNextGuide(guide);
	const articleRef = useRef<HTMLElement | null>(null);
	const [readingProgress, setReadingProgress] = useState(0);
	const [markdownContent, setMarkdownContent] = useState<string | null>(null);
	const [isJourneySidebarOpen, setIsJourneySidebarOpen] = useState(false);
	const [headerVisible, setHeaderVisible] = useState(true);
	const [sourcesOpen, setSourcesOpen] = useState(false);
	const [copied, setCopied] = useState(false);
	const [shareOpen, setShareOpen] = useState(false);
	const lastScrollY = useRef(0);
	const prefersReducedMotion = useReducedMotion();
	const sectionAnim = {
		initial: {
			opacity: 0,
			y: prefersReducedMotion ? 0 : 52,
			filter: prefersReducedMotion ? "blur(0px)" : "blur(6px)",
		},
		whileInView: { opacity: 1, y: 0, filter: "blur(0px)" } as const,
		viewport: { once: true, amount: 0.08 } as const,
		transition: {
			duration: prefersReducedMotion ? 0.01 : 0.7,
			ease: SECTION_ENTER_EASE,
		},
	};
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
	const nextChapterSection = resolvedSections.find(
		(section) => section.sectionKey === "next-chapter",
	);
	const nextChapterCardText = toPlainCardText(nextChapterSection?.body[0]);
	const journeyGuides = useMemo(() => {
		return [...GUIDES].sort((a, b) => a.title.localeCompare(b.title));
	}, []);
	const currentGuideJourneyIndex = journeyGuides.findIndex(
		(item) => item.slug === guide.slug,
	);
	const currentTopicGuides = useMemo(() => {
		return journeyGuides.filter((item) => item.topic === guide.topic);
	}, [guide.topic, journeyGuides]);
	const currentTopicGuideIndex = currentTopicGuides.findIndex(
		(item) => item.slug === guide.slug,
	);
	const topicJourneySummary = useMemo(() => {
		return GUIDE_TOPICS.map((topic) => {
			const guidesInTopic = journeyGuides.filter(
				(item) => item.topic === topic.slug,
			);
			const completed = guidesInTopic.filter((item) =>
				isBookmarked(item.slug),
			).length;
			return {
				topic,
				total: guidesInTopic.length,
				completed,
			};
		});
	}, [isBookmarked, journeyGuides]);
	const journeyMapBody = (
		<div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-4">
			<div className="rounded-[0.85rem] border border-minuri-silver/70 bg-minuri-fog/40 px-3.5 py-3">
				<p className="text-xs text-minuri-slate">
					{currentTopicGuideIndex + 1} of {currentTopicGuides.length} in{" "}
					{topicMeta?.name ?? "this topic"}
				</p>
			</div>

			<div className="grid gap-2.5">
				{topicJourneySummary.map(({ topic, total, completed }) => {
					const isCurrentTopic = topic.slug === guide.topic;
					const isDone = completed === total && total > 0;
					return (
						<div
							key={topic.slug}
							className={cn(
								"rounded-[0.85rem] border px-3.5 py-3",
								isCurrentTopic
									? "border-minuri-teal/70 bg-minuri-mist"
									: "border-minuri-silver/70 bg-minuri-white",
							)}
						>
							<p className="mt-1 text-sm font-semibold text-minuri-ocean">
								{topic.name}
							</p>
							<p className="mt-1 text-xs text-minuri-slate">
								{completed}/{total} saved{" "}
								{isDone
									? "· complete"
									: isCurrentTopic
										? "· you are here"
										: ""}
							</p>
						</div>
					);
				})}
			</div>

			<div>
				<p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-minuri-mid">
					More in this topic
				</p>
				<ol className="mt-3 space-y-2">
					{currentTopicGuides.map((item, index) => {
						const isCurrent = item.slug === guide.slug;
						const isSaved = isBookmarked(item.slug);
						return (
							<li key={item.slug}>
								<Link
									href={buildGuideHref(
										{ slug: item.slug },
										{ topicFilter, query, from },
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
		const handleScroll = () => {
			const currentY = window.scrollY;
			if (currentY < 80) {
				setHeaderVisible(true);
			} else if (currentY < lastScrollY.current) {
				setHeaderVisible(true);
			} else if (currentY > lastScrollY.current + 4) {
				setHeaderVisible(false);
			}
			lastScrollY.current = currentY;
		};
		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);



	return (
		<div className="min-h-screen bg-minuri-white text-minuri-ink">
			<div className="fixed inset-x-0 top-0 z-50 h-[2px] bg-minuri-white">
				<div
					className="h-full bg-minuri-teal transition-all duration-300"
					style={{ width: `${readingProgress}%` }}
				/>
			</div>
			<header className={cn(
					"fixed inset-x-0 top-[2px] z-40 bg-minuri-white/95 backdrop-blur transition-transform duration-300",
					headerVisible ? "translate-y-0" : "-translate-y-full",
				)}>
				<div className="mx-auto max-w-screen-2xl px-4 md:px-8">
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

			<main className="mx-auto max-w-screen-2xl px-4 pt-28 md:px-8 md:pt-32">
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
						<div className="mx-auto flex w-full items-center justify-between gap-3 md:max-w-3xl lg:max-w-4xl xl:max-w-5xl min-[1500px]:max-w-6xl">
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

						<section className="mx-auto mt-6 w-full md:mt-8 md:max-w-3xl lg:max-w-4xl xl:max-w-5xl min-[1500px]:max-w-6xl">
							<p className="text-xs uppercase tracking-[0.14em] text-minuri-slate">
								{topicMeta?.name?.toUpperCase()}
							</p>
							<h1 className="mt-3 text-2xl font-black leading-tight text-minuri-ocean md:mt-4 md:text-4xl min-[1500px]:text-5xl">
								{guide.title}
							</h1>
							<p className="mt-3 text-base leading-relaxed text-minuri-slate md:mt-5 md:text-lg md:leading-[1.45] min-[1500px]:text-xl">
								{guide.summary}
							</p>
							<div className="mt-6">
								<p className="text-sm text-minuri-slate">
									{guide.readingTimeMin} minute read ·{" "}
									{UPDATED_LABEL}
								</p>
							</div>
							<div className="relative mt-6 h-[180px] overflow-hidden rounded-sm bg-minuri-fog md:mt-8 md:h-[300px] min-[1500px]:h-[400px]">
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

						<div className="mx-auto mt-8 w-full space-y-8 md:mt-12 md:max-w-3xl md:space-y-12 lg:max-w-4xl xl:max-w-5xl min-[1500px]:max-w-6xl">
							<motion.section
								{...sectionAnim}
								className="guide-section-moment"
							>
								<GuideSectionLabel label="The Moment" />
								{momentSection ? (
									<GuideMarkdown
										markdown={momentSection.body.join(
											"\n\n",
										)}
										paragraphClassName="leading-[2.1] text-minuri-ink"
									/>
								) : null}
							</motion.section>

							{(feelingSection || revealSection) ? (
								<div className="flex flex-col gap-6 md:flex-row md:items-stretch">
									{feelingSection ? (
										<motion.section
											{...sectionAnim}
											initial={{ opacity: 0, x: prefersReducedMotion ? 0 : -60, filter: prefersReducedMotion ? "blur(0px)" : "blur(4px)" }}
											whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
											className="guide-section-feeling md:flex-1"
											style={{ paddingTop: "2rem" }}
										>
											<GuideSectionLabel label="The Feeling" />
											<GuideMarkdown
												markdown={feelingSection.body.join(
													"\n\n",
												)}
												paragraphClassName="leading-[2.1]"
											/>
										</motion.section>
									) : null}

									{revealSection ? (
										<motion.section
											{...sectionAnim}
											initial={{ opacity: 0, x: prefersReducedMotion ? 0 : 60, filter: prefersReducedMotion ? "blur(0px)" : "blur(4px)" }}
											whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
											className="guide-section-reveal md:flex-1"
											style={{ paddingTop: "2rem" }}
										>
											<div className="relative z-10">
												<GuideSectionLabel
													label={revealSection.title}
													dark
												/>
												<GuideMarkdown
													markdown={revealSection.body.join(
														"\n\n",
													)}
													paragraphClassName="text-[1.05rem] font-semibold leading-8 text-white"
												/>
											</div>
										</motion.section>
									) : null}
								</div>
							) : null}

							{bodySection ? (
								<motion.section
									{...sectionAnim}
									className="guide-section-body"
								>
									<GuideSectionLabel label="How It Works" />
									<h2 className="text-2xl font-semibold leading-tight text-minuri-ocean md:text-3xl" style={{ fontFamily: "var(--font-hero-serif)" }}>
										{bodySection.title}
									</h2>
									<GuideMarkdown
										markdown={bodySection.body.join("\n\n")}
										className="mt-6 space-y-4"
										paragraphClassName="text-[1.05rem] leading-8 text-minuri-ink"
									/>
								</motion.section>
							) : null}

							{guide.firstSteps && guide.firstSteps.length > 0 ? (
								<motion.section {...sectionAnim}>
									<GuideSectionLabel label="First Steps" />
									<h2 className="text-xl font-semibold text-minuri-ocean md:text-2xl">
										Your first steps
									</h2>
									<ol className="mt-8 grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
										{guide.firstSteps.map((step, index) => {
											const stickyClass = [
												"guide-sticky guide-sticky-a",
												"guide-sticky guide-sticky-b",
												"guide-sticky guide-sticky-c",
												"guide-sticky guide-sticky-d",
											][index % 4];
											return (
												<li
													key={index}
													className={stickyClass}
												>
													<span className="mb-3 flex size-6 items-center justify-center rounded-full bg-minuri-teal/20 text-xs font-bold text-minuri-teal">
														{index + 1}
													</span>
													<p className="text-sm font-medium leading-relaxed text-minuri-ink">
														{step.label}
													</p>
													{step.estimateMin > 0 && (
														<p className="mt-2 text-xs text-minuri-slate">
															~{step.estimateMin} min
														</p>
													)}
												</li>
											);
										})}
									</ol>
								</motion.section>
							) : null}


							{nextGuide ? (
								<motion.section {...sectionAnim}>
									<GuideSectionLabel label="Up Next" />
									<div className="relative mx-auto mt-8 max-w-md">
										{/* Pushpin */}
										<div className="absolute -top-3.5 left-1/2 z-10 flex size-7 -translate-x-1/2 items-center justify-center rounded-full bg-minuri-coral shadow-[0_3px_8px_rgba(0,0,0,0.22)]">
											<div className="size-2.5 rounded-full bg-white/80" />
										</div>
										{/* Index card */}
										<Link
											href={`/guides/${nextGuide.slug}`}
											className="guide-next-card group block overflow-hidden rounded-sm bg-[oklch(0.975_0.022_80)]"
										>
											{/* Polaroid thumbnail */}
											<div className="relative aspect-[16/8] overflow-hidden border-b-4 border-white/60">
												<Image
													src={nextGuide.thumbnailUrl}
													alt={nextGuide.title}
													fill
													className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
												/>
												<div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
												<p className="absolute bottom-2.5 left-3.5 text-[0.6rem] uppercase tracking-[0.18em] text-white/70">
													{getTopicMeta(nextGuide.topic)?.name}
												</p>
											</div>
											{/* Card body */}
											<div className="px-5 py-4">
												<p
													className="text-xl leading-snug text-minuri-ink"
													style={{
														fontFamily:
															"var(--font-hero-serif)",
													}}
												>
													{nextGuide.title}
												</p>
												<p className="mt-1 text-xs text-minuri-slate">
													{nextGuide.readingTimeMin} min read
												</p>
												<p className="mt-3 text-sm font-medium text-minuri-teal transition-colors group-hover:text-minuri-ocean">
													Continue reading →
												</p>
											</div>
										</Link>
									</div>
								</motion.section>
							) : null}

							{/* Sources */}
							{guide.sourceLinks.length > 0 ? (
								<motion.section {...sectionAnim}>
									<button
										type="button"
										onClick={() => setSourcesOpen((o) => !o)}
										className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-minuri-slate transition-colors hover:text-minuri-teal"
									>
										<span>{sourcesOpen ? "Hide" : "Show"} {guide.sourceLinks.length} source{guide.sourceLinks.length !== 1 ? "s" : ""}</span>
										<span className="text-minuri-silver">{sourcesOpen ? "↑" : "↓"}</span>
									</button>

									<AnimatePresence initial={false}>
										{sourcesOpen && (
											<motion.div
												key="sources-list"
												initial={{ height: 0, opacity: 0 }}
												animate={{ height: "auto", opacity: 1 }}
												exit={{ height: 0, opacity: 0 }}
												transition={{ duration: prefersReducedMotion ? 0.01 : 0.28, ease: [0.22, 1, 0.36, 1] }}
												style={{ overflow: "hidden" }}
											>
												<div className="mt-4 divide-y divide-minuri-silver/30 rounded-sm border border-minuri-silver/40 bg-minuri-fog/30">
													{guide.sourceLinks.map((link, i) => {
														let domain = "";
														try { domain = new URL(link.href).hostname.replace("www.", ""); } catch {}
														return (
															<motion.a
																key={link.href}
																href={link.href}
																target="_blank"
																rel="noreferrer"
																initial={{ opacity: 0, x: -8 }}
																animate={{ opacity: 1, x: 0 }}
																transition={{ duration: prefersReducedMotion ? 0.01 : 0.2, delay: prefersReducedMotion ? 0 : i * 0.04 }}
																className="group flex items-start gap-3 px-4 py-3 transition-colors hover:bg-minuri-fog/60"
															>
																<span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-minuri-teal/10 text-[10px] font-bold text-minuri-teal">
																	{i + 1}
																</span>
																<div className="min-w-0 flex-1">
																	<p className="text-sm font-medium text-minuri-ink group-hover:text-minuri-teal">
																		{link.label}
																	</p>
																	{domain && (
																		<p className="mt-0.5 text-xs text-minuri-slate">
																			{domain}
																		</p>
																	)}
																</div>
																<ExternalLink className="mt-0.5 size-3.5 shrink-0 text-minuri-silver group-hover:text-minuri-teal" />
															</motion.a>
														);
													})}
												</div>
											</motion.div>
										)}
									</AnimatePresence>
								</motion.section>
							) : null}

						</div>{/* end sections container */}

						{/* Guide footer — full-bleed, content constrained to match sections above */}
						<motion.footer
							{...sectionAnim}
							className="guide-footer-end"
						>
							<div className="relative z-10 mx-auto w-full px-4 text-center md:max-w-3xl md:px-8 lg:max-w-4xl xl:max-w-5xl min-[1500px]:max-w-6xl">

									{/* Ornament + title */}
									<p className="mb-5 text-lg text-minuri-seafoam/25">✦</p>
									<h2
										className="text-xl font-semibold leading-snug text-white/75 md:text-2xl"
										style={{ fontFamily: "var(--font-hero-serif)" }}
									>
										{guide.title}
									</h2>
									<p className="mt-2 text-xs uppercase tracking-widest text-white/25">
										{topicMeta?.name} · {guide.readingTimeMin} min read
									</p>

									{/* Actions */}
									<div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
										<button
											type="button"
											onClick={() => toggleBookmark(guide.slug)}
											className={cn(
												"inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition-all duration-200",
												isBookmarked(guide.slug)
													? "border-minuri-seafoam/50 bg-minuri-seafoam/10 text-minuri-seafoam"
													: "border-white/15 text-white/60 hover:border-white/30 hover:text-white",
											)}
										>
											{isBookmarked(guide.slug)
												? <><BookmarkCheck className="size-4" /> Saved</>
												: <><Bookmark className="size-4" /> Save</>
											}
										</button>
										<button
											type="button"
											onClick={() => {
												navigator.clipboard.writeText(window.location.href);
												setCopied(true);
												setTimeout(() => setCopied(false), 2000);
											}}
											className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-white/60 transition-all duration-200 hover:border-white/30 hover:text-white"
										>
											{copied
												? <><Check className="size-4" /> Copied</>
												: <><Copy className="size-4" /> Copy link</>
											}
										</button>
										<button
											type="button"
											onClick={() => setShareOpen(true)}
											className="inline-flex items-center gap-2 rounded-full bg-minuri-seafoam/10 border border-minuri-seafoam/30 px-5 py-2.5 text-sm font-medium text-minuri-seafoam transition-all duration-200 hover:bg-minuri-seafoam/20"
										>
											<Download className="size-4" />
											Download guide
										</button>
									</div>

									{/* Bottom bar */}
									<div className="mt-10 flex items-center justify-between border-t border-white/[0.07] pt-6">
										<Link
											href={backHref}
											className="inline-flex items-center gap-1.5 text-xs text-white/30 transition-colors hover:text-white/60"
										>
											<ArrowLeft className="size-3.5" />
											All guides
										</Link>
										<p
											className="text-xs font-black uppercase tracking-widest text-white/15"
											style={{ fontFamily: "var(--font-hero-serif)" }}
										>
											Minuri
										</p>
									</div>
								</div>
							</motion.footer>
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

			<GuideShareModal
				guide={guide}
				isOpen={shareOpen}
				onClose={() => setShareOpen(false)}
			/>
		</div>
	);
}
