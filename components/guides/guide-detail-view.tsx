"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
	ArrowLeft,
	Bookmark,
	BookmarkCheck,
	Copy,
	Check,
	Download,
	ExternalLink,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import type { Guide } from "@/content/guides";
import type { GuideOrigin, GuideTopicFilter } from "@/lib/guides";
import { BookmarkButton } from "@/components/guides/bookmark-button";
import { GuideMarkdown } from "@/components/guides/guide-markdown";
import { GuideSectionLabel } from "@/components/guides/guide-section-label";
import { getNextGuide, getTopicMeta } from "@/lib/guides";
import { useGuideBookmarks } from "@/hooks/use-guide-bookmarks";
import { cn } from "@/lib/utils";
import { GuideShareModal } from "@/components/guides/guide-share-modal";
import { BookmarkToast } from "@/components/guides/bookmark-toast";

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
	const { isBookmarked, toggleBookmark } = useGuideBookmarks();
	const topicMeta = getTopicMeta(guide.topic);
	const nextGuide = getNextGuide(guide);
	const articleRef = useRef<HTMLElement | null>(null);
	const [readingProgress, setReadingProgress] = useState(0);
	const [markdownContent, setMarkdownContent] = useState<string | null>(null);
	const [headerVisible, setHeaderVisible] = useState(true);
	const [sourcesOpen, setSourcesOpen] = useState(false);
	const [copied, setCopied] = useState(false);
	const [shareOpen, setShareOpen] = useState(false);
	const [hasJourney, setHasJourney] = useState(false);
	const [bookmarkToastVisible, setBookmarkToastVisible] = useState(false);
	const lastScrollY = useRef(0);
	const prefersReducedMotion = useReducedMotion();

	useEffect(() => {
		setHasJourney(!!window.localStorage.getItem("minuri:journey:v2"));
	}, []);
	const sectionAnim = {
		initial: {
			opacity: 0,
			y: prefersReducedMotion ? 0 : 20,
			filter: prefersReducedMotion ? "blur(0px)" : "blur(3px)",
		},
		whileInView: { opacity: 1, y: 0, filter: "blur(0px)" } as const,
		viewport: { once: true, amount: 0.08 } as const,
		transition: {
			duration: prefersReducedMotion ? 0.01 : 0.38,
			ease: SECTION_ENTER_EASE,
		},
	};

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

	function handleBookmarkToggle() {
		const wasBookmarked = isBookmarked(guide.slug);
		toggleBookmark(guide.slug);
		if (!wasBookmarked) {
			setBookmarkToastVisible(true);
		}
	}

	return (
		<div className="min-h-screen bg-minuri-white text-minuri-ink">
			<div className="fixed inset-x-0 top-0 z-50 h-[2px] bg-minuri-white">
				<div
					className="h-full bg-minuri-teal transition-all duration-300"
					style={{ width: `${readingProgress}%` }}
				/>
			</div>
			<header
				className={cn(
					"fixed inset-x-0 top-[2px] z-40 bg-minuri-white/95 backdrop-blur transition-transform duration-300",
					headerVisible ? "translate-y-0" : "-translate-y-full",
				)}
			>
				<div className="mx-auto max-w-screen-xl px-6">
					<div className="flex h-18 w-full items-center justify-between">
						<Link
							href={backHref}
							className="inline-flex items-center gap-2 text-sm font-medium text-minuri-slate transition-colors hover:text-minuri-teal"
						>
							<ArrowLeft className="size-4" aria-hidden="true" />
							{from === "journey" ? "Back to your plan" : "Back to guides"}
						</Link>
						<div className="flex items-center gap-2">
							<BookmarkButton
								active={isBookmarked(guide.slug)}
								onToggle={handleBookmarkToggle}
								className="size-9 border-minuri-silver/80 text-minuri-teal hover:bg-minuri-fog"
							/>
							{hasJourney ? (
								<Link
									href="/journey/plan"
									className="inline-flex items-center gap-2 rounded-full border border-minuri-silver/80 px-4 py-2 text-sm font-medium text-minuri-slate transition-colors hover:border-minuri-teal/50 hover:text-minuri-teal"
								>
									<span
										className="size-2 shrink-0 rounded-full"
										style={{ backgroundColor: "var(--vibe-accent, var(--color-minuri-teal))" }}
									/>
									My Journey · {readingProgress}%
								</Link>
							) : (
								<Link
									href="/journey"
									className="inline-flex items-center gap-2 rounded-full border border-minuri-silver/80 px-4 py-2 text-sm font-medium text-minuri-slate transition-colors hover:border-minuri-teal/50 hover:text-minuri-teal"
								>
									Build your week →
								</Link>
							)}
						</div>
					</div>
				</div>
			</header>

			<main className="mx-auto max-w-screen-2xl px-4 pt-20 md:px-8 md:pt-24">
				<div className="mx-auto flex w-full max-w-368 items-start">
					<article
						ref={articleRef}
						className="min-w-0 flex-1"
					>
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

							{feelingSection || revealSection ? (
								<div className="flex flex-col gap-6 md:flex-row md:items-stretch">
									{feelingSection ? (
										<motion.section
											{...sectionAnim}
											initial={{
												opacity: 0,
												x: prefersReducedMotion
													? 0
													: -60,
												filter: prefersReducedMotion
													? "blur(0px)"
													: "blur(4px)",
											}}
											whileInView={{
												opacity: 1,
												x: 0,
												filter: "blur(0px)",
											}}
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
											initial={{
												opacity: 0,
												x: prefersReducedMotion
													? 0
													: 60,
												filter: prefersReducedMotion
													? "blur(0px)"
													: "blur(4px)",
											}}
											whileInView={{
												opacity: 1,
												x: 0,
												filter: "blur(0px)",
											}}
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
									<h2
										className="text-2xl font-semibold leading-tight text-minuri-ocean md:text-3xl"
										style={{
											fontFamily:
												"var(--font-hero-serif)",
										}}
									>
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
															~{step.estimateMin}{" "}
															min
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
													{
														getTopicMeta(
															nextGuide.topic,
														)?.name
													}
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
													{nextGuide.readingTimeMin}{" "}
													min read
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
										onClick={() =>
											setSourcesOpen((o) => !o)
										}
										className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-minuri-slate transition-colors hover:text-minuri-teal"
									>
										<span>
											{sourcesOpen ? "Hide" : "Show"}{" "}
											{guide.sourceLinks.length} source
											{guide.sourceLinks.length !== 1
												? "s"
												: ""}
										</span>
										<span className="text-minuri-silver">
											{sourcesOpen ? "↑" : "↓"}
										</span>
									</button>

									<AnimatePresence initial={false}>
										{sourcesOpen && (
											<motion.div
												key="sources-list"
												initial={{
													height: 0,
													opacity: 0,
												}}
												animate={{
													height: "auto",
													opacity: 1,
												}}
												exit={{ height: 0, opacity: 0 }}
												transition={{
													duration:
														prefersReducedMotion
															? 0.01
															: 0.28,
													ease: [0.22, 1, 0.36, 1],
												}}
												style={{ overflow: "hidden" }}
											>
												<div className="mt-4 divide-y divide-minuri-silver/30 rounded-sm border border-minuri-silver/40 bg-minuri-fog/30">
													{guide.sourceLinks.map(
														(link, i) => {
															let domain = "";
															try {
																domain =
																	new URL(
																		link.href,
																	).hostname.replace(
																		"www.",
																		"",
																	);
															} catch {}
															return (
																<motion.a
																	key={
																		link.href
																	}
																	href={
																		link.href
																	}
																	target="_blank"
																	rel="noreferrer"
																	initial={{
																		opacity: 0,
																		x: -8,
																	}}
																	animate={{
																		opacity: 1,
																		x: 0,
																	}}
																	transition={{
																		duration:
																			prefersReducedMotion
																				? 0.01
																				: 0.2,
																		delay: prefersReducedMotion
																			? 0
																			: i *
																				0.04,
																	}}
																	className="group flex items-start gap-3 px-4 py-3 transition-colors hover:bg-minuri-fog/60"
																>
																	<span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-minuri-teal/10 text-[10px] font-bold text-minuri-teal">
																		{i + 1}
																	</span>
																	<div className="min-w-0 flex-1">
																		<p className="text-sm font-medium text-minuri-ink group-hover:text-minuri-teal">
																			{
																				link.label
																			}
																		</p>
																		{domain && (
																			<p className="mt-0.5 text-xs text-minuri-slate">
																				{
																					domain
																				}
																			</p>
																		)}
																	</div>
																	<ExternalLink className="mt-0.5 size-3.5 shrink-0 text-minuri-silver group-hover:text-minuri-teal" />
																</motion.a>
															);
														},
													)}
												</div>
											</motion.div>
										)}
									</AnimatePresence>
								</motion.section>
							) : null}
						</div>
						{/* end sections container */}

						{/* Guide footer — full-bleed, content constrained to match sections above */}
						<motion.footer
							{...sectionAnim}
							className="guide-footer-end"
						>
							<div className="relative z-10 mx-auto w-full px-4 text-center md:max-w-3xl md:px-8 lg:max-w-4xl xl:max-w-5xl min-[1500px]:max-w-6xl">
								{/* Ornament + title */}
								<p className="mb-5 text-lg text-minuri-seafoam/25">
									✦
								</p>
								<h2
									className="text-xl font-semibold leading-snug text-white/75 md:text-2xl"
									style={{
										fontFamily: "var(--font-hero-serif)",
									}}
								>
									{guide.title}
								</h2>
								<p className="mt-2 text-xs uppercase tracking-widest text-white/25">
									{topicMeta?.name} · {guide.readingTimeMin}{" "}
									min read
								</p>

								{/* Actions */}
								<div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
									<button
										type="button"
										onClick={handleBookmarkToggle}
										className={cn(
											"inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition-all duration-200",
											isBookmarked(guide.slug)
												? "border-minuri-seafoam/50 bg-minuri-seafoam/10 text-minuri-seafoam"
												: "border-white/15 text-white/60 hover:border-white/30 hover:text-white",
										)}
									>
										{isBookmarked(guide.slug) ? (
											<>
												<BookmarkCheck className="size-4" />{" "}
												Saved
											</>
										) : (
											<>
												<Bookmark className="size-4" />{" "}
												Save
											</>
										)}
									</button>
									<button
										type="button"
										onClick={() => {
											navigator.clipboard.writeText(
												window.location.href,
											);
											setCopied(true);
											setTimeout(
												() => setCopied(false),
												2000,
											);
										}}
										className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-white/60 transition-all duration-200 hover:border-white/30 hover:text-white"
									>
										{copied ? (
											<>
												<Check className="size-4" />{" "}
												Copied
											</>
										) : (
											<>
												<Copy className="size-4" /> Copy
												link
											</>
										)}
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
										style={{
											fontFamily:
												"var(--font-hero-serif)",
										}}
									>
										Minuri
									</p>
								</div>
							</div>
						</motion.footer>
				</article>
				</div>
			</main>

			<BookmarkToast
				visible={bookmarkToastVisible}
				hasJourney={hasJourney}
				onDone={() => setBookmarkToastVisible(false)}
			/>
			<GuideShareModal
				guide={guide}
				isOpen={shareOpen}
				onClose={() => setShareOpen(false)}
			/>
		</div>
	);
}
