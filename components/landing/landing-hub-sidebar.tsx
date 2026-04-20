"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
	ArrowUpRight,
	ChevronsLeft,
	ChevronsRight,
	Download,
} from "lucide-react";

import {
	LANDING_KEYS,
	exportJourneyState,
	readLandingJourneyState,
	saveLifeMoment,
	type LandingJourneyState,
} from "@/components/landing/landing-local-state";
import { cn } from "@/lib/utils";

type LifeMoment = {
	id: string;
	title: string;
	entryArc: "Week 1" | "Month 1";
	guideHref: string;
	nearMeHref: string;
};

type TopicEntry = {
	label: string;
	description: string;
	guideHref: string;
	nearMeHref: string;
	color: string;
};

const LIFE_MOMENTS: LifeMoment[] = [
	{
		id: "just-moved-in",
		title: "Just moved in",
		entryArc: "Week 1",
		guideHref: "/guides?category=setup",
		nearMeHref: "/near-me?category=survive",
	},
	{
		id: "starting-uni",
		title: "Starting uni",
		entryArc: "Week 1",
		guideHref: "/guides?category=connect",
		nearMeHref: "/near-me?category=health",
	},
	{
		id: "first-job-melbourne",
		title: "First job in Melbourne",
		entryArc: "Month 1",
		guideHref: "/guides?category=get-around",
		nearMeHref: "/near-me?category=setup",
	},
	{
		id: "between-homes",
		title: "Between homes",
		entryArc: "Month 1",
		guideHref: "/guides?category=health",
		nearMeHref: "/near-me?category=connect",
	},
];

const TOPICS: TopicEntry[] = [
	{
		label: "Food & Eating",
		description: "Groceries, cheap meals, and everyday food decisions.",
		guideHref: "/guides?category=survive",
		nearMeHref: "/near-me?category=survive",
		color: "#00f5d4",
	},
	{
		label: "Getting Around",
		description: "Transport, routes, and daily movement through Melbourne.",
		guideHref: "/guides?category=get-around",
		nearMeHref: "/near-me?category=get-around",
		color: "#7fdcff",
	},
	{
		label: "Health & Wellbeing",
		description:
			"GPs, Medicare pathways, pharmacies, and mental health support.",
		guideHref: "/guides?category=health",
		nearMeHref: "/near-me?category=health",
		color: "#fff14a",
	},
	{
		label: "Home & Admin",
		description:
			"Renting, utilities, paperwork, and practical setup tasks.",
		guideHref: "/guides?category=setup",
		nearMeHref: "/near-me?category=setup",
		color: "#ff7ecb",
	},
	{
		label: "Social & Belonging",
		description:
			"Friendships, community, loneliness, and finding your place.",
		guideHref: "/guides?category=connect",
		nearMeHref: "/near-me?category=connect",
		color: "var(--minuri-mist)",
	},
];

const ARC_OVERVIEW = [
	{ id: "week1", label: "Week 1" },
	{ id: "month1", label: "Month 1" },
	{ id: "month3", label: "Month 3" },
] as const;

const MOOD_OPTIONS = [
	{ id: "settled", label: "settled", emoji: "🙂" },
	{ id: "figuring-it-out", label: "figuring it out", emoji: "🤔" },
	{ id: "overwhelmed", label: "overwhelmed", emoji: "😵" },
	{ id: "lonely", label: "lonely", emoji: "💙" },
] as const;

const EMPTY_STATE: LandingJourneyState = {
	version: 1,
	lastGuideSlug: null,
	activeArc: null,
	selectedSuburb: null,
	lastTopic: null,
	lifeMoment: null,
	savedLocationsCount: 0,
	savedLocations: [],
	topicHistory: [],
	readGuides: [],
	arcProgress: { week1: 0, month1: 0, month3: 0 },
};

function sentenceCaseMoment(value: string) {
	return value
		.replace(/-/g, " ")
		.replace(/\b\w/g, (char) => char.toUpperCase());
}

function sentenceCaseSlug(value: string) {
	return value
		.replace(/-/g, " ")
		.replace(/\b\w/g, (char) => char.toUpperCase());
}

type LiveStat = {
	status: "loading" | "ready" | "empty" | "error";
	location: string;
	population: number | null;
	year: string | null;
};

export type LandingHubSidebarProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

export function LandingHubSidebar({
	open: isOpen,
	onOpenChange,
}: LandingHubSidebarProps) {
	const [journey, setJourney] = useState<LandingJourneyState>(EMPTY_STATE);
	const [suburbInput, setSuburbInput] = useState("");
	const [selectedMood, setSelectedMood] = useState<string | null>(null);
	const [showTopics, setShowTopics] = useState(false);
	const [liveStat, setLiveStat] = useState<LiveStat>({
		status: "loading",
		location: "Melbourne",
		population: null,
		year: null,
	});

	useEffect(() => {
		const next = readLandingJourneyState();
		setJourney(next);
		setSuburbInput(next.selectedSuburb ?? "");
	}, []);

	useEffect(() => {
		const location = (journey.selectedSuburb || "Melbourne").trim();
		let isSubscribed = true;

		async function loadPopulation() {
			setLiveStat({
				status: "loading",
				location,
				population: null,
				year: null,
			});

			try {
				const response = await fetch(
					`/api/population?location=${encodeURIComponent(location)}`,
					{
						cache: "no-store",
					},
				);
				if (!response.ok) {
					throw new Error("Population request failed");
				}

				const payload = (await response.json()) as {
					population?: number;
					location?: string;
					year?: string | null;
				};

				if (!isSubscribed) return;
				if (!Number.isFinite(payload.population)) {
					setLiveStat({
						status: "empty",
						location: payload.location || location,
						population: null,
						year: payload.year ?? null,
					});
					return;
				}

				setLiveStat({
					status: "ready",
					location: payload.location || location,
					population: payload.population ?? null,
					year: payload.year ?? null,
				});
			} catch {
				if (!isSubscribed) return;
				setLiveStat({
					status: "error",
					location,
					population: null,
					year: null,
				});
			}
		}

		void loadPopulation();
		return () => {
			isSubscribed = false;
		};
	}, [journey.selectedSuburb]);

	const isReturningUser = useMemo(() => {
		const totalArcReads =
			journey.arcProgress.week1 +
			journey.arcProgress.month1 +
			journey.arcProgress.month3;

		return Boolean(
			journey.lastGuideSlug ||
			journey.activeArc ||
			journey.selectedSuburb ||
			journey.lastTopic ||
			journey.lifeMoment ||
			journey.savedLocationsCount > 0 ||
			journey.topicHistory.length > 0 ||
			journey.readGuides.length > 0 ||
			totalArcReads > 0,
		);
	}, [journey]);

	const reflection = useMemo(() => {
		if (!isReturningUser) return null;

		const suburb = journey.selectedSuburb || "Melbourne";
		const weekOneReads = journey.arcProgress.week1;
		const momentText = journey.lifeMoment
			? sentenceCaseMoment(journey.lifeMoment)
			: "your current chapter";
		const topic =
			journey.lastTopic ||
			(journey.topicHistory.length > 0 ? journey.topicHistory[0] : null);
		const moodNudge =
			selectedMood === "overwhelmed"
				? "We'll keep the next step short and practical."
				: selectedMood === "lonely"
					? "You are not doing this alone, and support is close by."
					: selectedMood === "figuring-it-out"
						? "You're learning your rhythm one step at a time."
						: "You are building steady momentum.";

		return `You're settling into ${suburb}. You've read ${weekOneReads} of 5 Week 1 guides, and your journey is centred on ${momentText}${topic ? ` with extra focus on ${topic}` : ""}. ${moodNudge}`;
	}, [isReturningUser, journey, selectedMood]);

	const activeMoment = useMemo(() => {
		if (!journey.lifeMoment) return LIFE_MOMENTS[0];
		return (
			LIFE_MOMENTS.find((moment) => moment.id === journey.lifeMoment) ??
			LIFE_MOMENTS[0]
		);
	}, [journey.lifeMoment]);

	const continueGuideTitle = useMemo(() => {
		if (journey.lastGuideSlug) {
			return sentenceCaseSlug(journey.lastGuideSlug);
		}
		if (journey.activeArc) {
			return `${sentenceCaseSlug(journey.activeArc)} essentials`;
		}
		return "Crisis lines you can actually call";
	}, [journey.activeArc, journey.lastGuideSlug]);

	const populationLabel = useMemo(() => {
		if (liveStat.status !== "ready") return null;
		return new Intl.NumberFormat("en-AU").format(liveStat.population ?? 0);
	}, [liveStat]);

	function refreshJourneyFromStorage() {
		const next = readLandingJourneyState();
		setJourney(next);
		setSuburbInput(next.selectedSuburb ?? "");
	}

	function persistSuburb() {
		const nextSuburb = suburbInput.trim();
		if (!nextSuburb || typeof window === "undefined") return;
		window.localStorage.setItem(LANDING_KEYS.selectedSuburb, nextSuburb);
		window.localStorage.setItem(LANDING_KEYS.stateVersion, "1");
		refreshJourneyFromStorage();
	}

	function clearJourney() {
		if (typeof window === "undefined") return;
		Object.values(LANDING_KEYS).forEach((key) => {
			window.localStorage.removeItem(key);
		});
		window.localStorage.removeItem("minuri:guide-bookmarks:v1");
		setSelectedMood(null);
		setShowTopics(false);
		setJourney(EMPTY_STATE);
		setSuburbInput("");
	}

	return (
		<>
			<button
				type="button"
				aria-controls="landing-hub-sidebar"
				aria-expanded={isOpen}
				onClick={() => onOpenChange(!isOpen)}
				className={cn(
					"fixed top-1/2 z-40 hidden h-50 w-12 -translate-y-1/2 cursor-pointer transform-none rounded-l-[0.9rem] bg-minuri-teal px-2 py-4 text-minuri-ocean shadow-[0_16px_30px_-22px_color-mix(in_oklch,var(--minuri-mid)_45%,transparent)] transition-[right,background-color] duration-300 hover:scale-100 hover:bg-minuri-teal/90 md:flex md:flex-col md:items-center md:justify-between",
					isOpen ? "right-[calc(40vw+1rem)]" : "right-0",
				)}
			>
				<span className="[writing-mode:vertical-rl] text-[0.78rem] font-black uppercase tracking-[0.18em] text-minuri-white">
					Well nest
				</span>
				{isOpen ? (
					<ChevronsRight
						className="mb-1 size-4 text-minuri-white/95"
						aria-hidden
					/>
				) : (
					<ChevronsLeft
						className="mb-1 size-4 text-minuri-white/95"
						aria-hidden
					/>
				)}
			</button>

			<aside
				id="landing-hub-sidebar"
				aria-label="Your Minuri hub"
				className={cn(
					"fixed bottom-4 right-4 z-40 hidden h-[calc(100dvh-2rem)] w-[40vw] overflow-hidden rounded-[1.35rem] border border-minuri-silver/85 bg-minuri-white/96 shadow-[0_20px_52px_-34px_color-mix(in_oklch,var(--minuri-mid)_42%,transparent)] backdrop-blur transition-transform duration-300 md:flex",
					isOpen
						? "translate-x-0"
						: "translate-x-[calc(100%+1.2rem)]",
				)}
			>
				<div className="flex h-full w-full flex-col">
					<div className="border-b border-minuri-silver/65 px-5 py-4">
						<h2 className="text-xl font-black uppercase tracking-tight text-minuri-ocean">
							Your Well nest
						</h2>
						<p className="mt-1 text-xs leading-relaxed text-minuri-slate">
							Your nest of wellbeing, wherever you are.
						</p>
					</div>

					<div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
						{isReturningUser ? (
							<>
								{reflection ? (
									<section>
										<p className="text-sm leading-relaxed text-minuri-ocean">
											{reflection}
										</p>
									</section>
								) : null}

								<section className="rounded-minuri border border-minuri-silver/60 bg-minuri-white p-3">
									<p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-minuri-slate">
										How&apos;s this week?
									</p>
									<div className="mt-2 flex flex-wrap gap-1.5">
										{MOOD_OPTIONS.map((mood) => (
											<button
												key={mood.id}
												type="button"
												onClick={() =>
													setSelectedMood(mood.id)
												}
												className={cn(
													"cursor-pointer transform-none rounded-full border px-2.5 py-1 text-[0.72rem] font-semibold transition-colors hover:scale-100",
													selectedMood === mood.id
														? "border-minuri-teal bg-minuri-teal/10 text-minuri-teal"
														: "border-minuri-silver/70 bg-minuri-white text-minuri-ocean hover:border-minuri-teal/45",
												)}
											>
												<span className="mr-1">
													{mood.emoji}
												</span>
												{mood.label}
											</button>
										))}
									</div>
								</section>

								<section className="rounded-minuri border border-minuri-teal/45 bg-minuri-teal p-4 text-minuri-white shadow-[0_18px_35px_-22px_color-mix(in_oklch,var(--minuri-teal)_65%,transparent)]">
									<p className="text-[0.68rem] font-black uppercase tracking-[0.14em] text-minuri-white/85">
										Continue reading
									</p>
									<h3 className="mt-1 text-base font-black leading-snug">
										Moment:{" "}
										{sentenceCaseMoment(activeMoment.id)}
									</h3>
									<p className="mt-1 text-sm text-minuri-white/95">
										&quot;{continueGuideTitle}&quot; · 3 min
										read
									</p>
									<Link
										href={activeMoment.guideHref}
										className="mt-3 inline-flex cursor-pointer items-center gap-1 rounded-full bg-minuri-white px-3 py-1.5 text-xs font-semibold text-minuri-ocean transition-transform duration-200 ease-out hover:scale-105"
									>
										Continue
										<ArrowUpRight
											className="size-3.5"
											aria-hidden
										/>
									</Link>
								</section>

								<section className="rounded-minuri border border-minuri-silver/60 p-3">
									<h3 className="text-[0.68rem] font-black uppercase tracking-[0.14em] text-minuri-slate">
										Your journey
									</h3>
									<p className="mt-1 text-[0.68rem] leading-relaxed text-minuri-slate">
										Week 1 and Month 1 are entry arcs. Month
										3 opens as you progress.
									</p>
									<div className="mt-2 grid grid-cols-3 gap-2">
										{ARC_OVERVIEW.map((arc) => {
											const completed =
												journey.arcProgress[
													arc.id as keyof typeof journey.arcProgress
												];
											const progress = Math.min(
												100,
												(completed / 5) * 100,
											);

											return (
												<Link
													key={arc.id}
													href="/guides"
													className="cursor-pointer transform-none rounded-md bg-minuri-fog/65 px-2 py-2 text-center text-minuri-ocean transition-colors hover:scale-100 hover:bg-minuri-fog/90"
												>
													<div
														className="mx-auto grid size-11 place-items-center rounded-full"
														style={{
															background: `conic-gradient(var(--minuri-teal) ${progress}%, color-mix(in oklch, var(--minuri-mid) 20%, white) 0)`,
														}}
													>
														<div className="grid size-8 place-items-center rounded-full bg-minuri-white text-[0.63rem] font-bold">
															{completed}/5
														</div>
													</div>
													<p className="mt-1 text-[0.66rem] font-semibold">
														{arc.label}
													</p>
												</Link>
											);
										})}
									</div>
								</section>

								<section className="rounded-minuri border border-minuri-silver/60 p-3">
									<h3 className="text-[0.68rem] font-black uppercase tracking-[0.14em] text-minuri-slate">
										Your suburb
									</h3>
									<div className="mt-2 flex items-center gap-2">
										<input
											value={suburbInput}
											onChange={(event) =>
												setSuburbInput(
													event.target.value,
												)
											}
											placeholder="Update suburb"
											className="min-w-0 flex-1 rounded-full border border-minuri-silver bg-minuri-white px-3 py-1.5 text-xs text-minuri-ocean outline-none transition focus:border-minuri-teal"
										/>
										<button
											type="button"
											onClick={persistSuburb}
											className="cursor-pointer rounded-full border border-minuri-silver bg-minuri-fog px-3 py-1.5 text-xs font-semibold text-minuri-ocean transition-transform duration-200 ease-out hover:scale-105"
										>
											Save
										</button>
									</div>
									<div className="mt-2 rounded-md bg-minuri-fog/55 px-2.5 py-2 text-[0.7rem] text-minuri-ocean">
										{liveStat.status === "loading" ? (
											<p>Loading local context...</p>
										) : null}
										{liveStat.status === "error" ? (
											<p>
												Local data is unavailable right
												now.
											</p>
										) : null}
										{liveStat.status === "empty" ? (
											<p>
												No current data for{" "}
												{liveStat.location}.
											</p>
										) : null}
										{liveStat.status === "ready" ? (
											<p>
												About{" "}
												<strong>
													{populationLabel}
												</strong>{" "}
												people live in{" "}
												{liveStat.location}
												{liveStat.year
													? ` (${liveStat.year})`
													: ""}
												.
											</p>
										) : null}
									</div>
									{journey.savedLocationsCount > 0 ? (
										<div className="mt-2 flex flex-wrap gap-1.5">
											{journey.savedLocations
												.slice(0, 3)
												.map((location, index) => (
													<span
														key={`${index}-${String(location)}`}
														className="rounded-full border border-minuri-silver/70 bg-minuri-white px-2 py-1 text-[0.66rem] text-minuri-ocean"
													>
														{typeof location ===
														"string"
															? location
															: `Saved place ${index + 1}`}
													</span>
												))}
											<Link
												href="/near-me"
												className="cursor-pointer transform-none rounded-full border border-minuri-silver/70 bg-minuri-fog px-2 py-1 text-[0.66rem] font-semibold text-minuri-teal transition-colors hover:scale-100 hover:border-minuri-teal/45 hover:bg-minuri-fog/80"
											>
												See all
											</Link>
										</div>
									) : null}
								</section>

								<section className="rounded-minuri border border-minuri-silver/60 p-3">
									<button
										type="button"
										onClick={() =>
											setShowTopics((current) => !current)
										}
										className="flex w-full cursor-pointer transform-none items-center justify-between text-left transition-colors hover:scale-100 hover:text-minuri-teal"
									>
										<span className="text-[0.68rem] font-black uppercase tracking-[0.14em] text-minuri-slate">
											Jump to a topic
										</span>
										<span className="text-xs font-semibold text-minuri-teal">
											{showTopics ? "Hide" : "Show"}
										</span>
									</button>
									{showTopics ? (
										<div className="mt-2 space-y-1.5">
											{TOPICS.map((topic) => (
												<Link
													key={topic.label}
													href={topic.guideHref}
													className="block cursor-pointer transform-none rounded-md border px-2.5 py-2 text-xs text-minuri-ocean transition-opacity hover:scale-100 hover:opacity-90"
													style={{
														backgroundColor:
															topic.color,
														borderColor:
															topic.color,
													}}
												>
													<p className="font-semibold">
														{topic.label}
													</p>
													<p className="mt-0.5 text-[0.68rem] leading-relaxed text-minuri-slate">
														{topic.description}
													</p>
												</Link>
											))}
										</div>
									) : null}
								</section>

								<section className="rounded-minuri border border-minuri-silver/50 bg-minuri-white p-3 text-[0.68rem] text-minuri-slate">
									<p>
										Your journey stays on this device.
										Minuri never sees it.
									</p>
									<div className="mt-2 flex flex-wrap items-center gap-2">
										<button
											type="button"
											onClick={exportJourneyState}
											className="inline-flex cursor-pointer transform-none items-center gap-1 rounded-full border border-minuri-silver bg-minuri-fog px-2.5 py-1 font-semibold text-minuri-ocean transition-colors hover:scale-100 hover:border-minuri-teal/45 hover:bg-minuri-fog/80"
										>
											<Download
												className="size-3.5"
												aria-hidden
											/>
											Export
										</button>
										<button
											type="button"
											onClick={clearJourney}
											className="cursor-pointer transform-none rounded-full border border-minuri-silver bg-minuri-white px-2.5 py-1 font-semibold text-minuri-ocean transition-colors hover:scale-100 hover:border-minuri-teal/45 hover:bg-minuri-fog/45"
										>
											Clear local data
										</button>
									</div>
								</section>
							</>
						) : (
							<>
								<section className="rounded-minuri border border-minuri-silver/65 bg-minuri-fog/60 p-3">
									<p className="text-sm leading-relaxed text-minuri-ocean">
										Welcome to Minuri. Let&apos;s get you
										set up.
									</p>
								</section>

								<section className="rounded-minuri border border-minuri-teal/40 bg-minuri-white p-3">
									<h3 className="text-[0.68rem] font-black uppercase tracking-[0.14em] text-minuri-teal">
										Where are you living right now?
									</h3>
									<div className="mt-2 flex items-center gap-2">
										<input
											value={suburbInput}
											onChange={(event) =>
												setSuburbInput(
													event.target.value,
												)
											}
											placeholder="Enter your suburb"
											className="min-w-0 flex-1 rounded-full border border-minuri-silver bg-minuri-white px-3 py-2 text-sm text-minuri-ocean outline-none transition focus:border-minuri-teal"
										/>
										<button
											type="button"
											onClick={persistSuburb}
											className="cursor-pointer transform-none rounded-full bg-minuri-teal px-3.5 py-2 text-xs font-semibold text-primary-foreground transition-opacity hover:scale-100 hover:opacity-90"
										>
											Set suburb
										</button>
									</div>
								</section>

								<section className="rounded-minuri border border-minuri-silver/65 p-3">
									<h3 className="text-[0.68rem] font-black uppercase tracking-[0.14em] text-minuri-teal">
										Pick a moment
									</h3>
									<div className="mt-2.5 space-y-2">
										{LIFE_MOMENTS.map((moment) => (
											<div
												key={moment.id}
												className="rounded-minuri border border-minuri-silver/55 bg-minuri-fog/40 p-2.5"
											>
												<p className="text-sm font-semibold text-minuri-ocean">
													{moment.title}
												</p>
												<p className="mt-1 text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-minuri-slate">
													Opens {moment.entryArc}
												</p>
												<div className="mt-2 flex items-center gap-2 text-xs">
													<Link
														href={moment.guideHref}
														onClick={() =>
															saveLifeMoment(
																moment.id,
															)
														}
														className="inline-flex cursor-pointer transform-none items-center gap-1 rounded-full bg-minuri-teal px-3 py-1.5 font-semibold text-primary-foreground transition-opacity hover:scale-100 hover:opacity-90"
													>
														Start with guides
														<ArrowUpRight
															className="size-3.5"
															aria-hidden
														/>
													</Link>
													<Link
														href={moment.nearMeHref}
														onClick={() =>
															saveLifeMoment(
																moment.id,
															)
														}
														className="inline-flex cursor-pointer transform-none items-center gap-1 rounded-full border border-minuri-silver bg-minuri-white px-3 py-1.5 font-semibold text-minuri-ocean transition-colors hover:scale-100 hover:border-minuri-teal/45 hover:bg-minuri-fog/45"
													>
														Near Me
														<ArrowUpRight
															className="size-3.5"
															aria-hidden
														/>
													</Link>
												</div>
											</div>
										))}
									</div>
								</section>

								<section className="rounded-minuri border border-minuri-silver/50 bg-minuri-white p-3 text-[0.68rem] text-minuri-slate">
									<p>
										Your journey stays on this device.
										Minuri never sees it.
									</p>
								</section>
							</>
						)}
					</div>
				</div>
			</aside>
		</>
	);
}
