"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import {
	ArrowUpRight,
	CheckCircle2,
	ChevronsLeft,
	Loader2,
	MapPin,
	Search,
	X,
} from "lucide-react";

import {
	LANDING_KEYS,
	readLandingJourneyState,
	saveLifeMoment,
	type LandingJourneyState,
} from "@/components/landing/landing-local-state";
import {
	normalizeSuburbName,
	rankAndFilterSuburbs,
	type SuburbOption,
} from "@/lib/suburbs";
import { cn } from "@/lib/utils";

type LifeMoment = {
	id: string;
	title: string;
	entryArc: "Week 1" | "Month 1" | "Month 3";
};

type FocusTopic = {
	id: string;
	label: string;
};

const LIFE_MOMENTS: LifeMoment[] = [
	{
		id: "i-just-arrived",
		title: "I just arrived",
		entryArc: "Week 1",
	},
	{
		id: "im-getting-set-up",
		title: "I'm getting set up",
		entryArc: "Month 1",
	},
	{
		id: "im-looking-for-my-people",
		title: "I'm looking for my people",
		entryArc: "Month 3",
	},
];

const FOCUS_TOPICS: FocusTopic[] = [
	{ id: "food-and-eating", label: "Food & Eating" },
	{ id: "getting-around", label: "Getting Around" },
	{ id: "health-and-wellbeing", label: "Health & Wellbeing" },
	{ id: "home-and-admin", label: "Home & Admin" },
	{ id: "social-and-belonging", label: "Social & Belonging" },
];

const LEGACY_MOMENT_ID_MAP: Record<string, string> = {
	"just-moved-in": "i-just-arrived",
	"starting-uni": "im-looking-for-my-people",
	"first-job-melbourne": "im-getting-set-up",
	"between-homes": "im-getting-set-up",
};

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

function resolveMomentId(value: string | null) {
	if (!value) return null;
	return LEGACY_MOMENT_ID_MAP[value] ?? value;
}

function findLifeMoment(value: string | null) {
	const resolved = resolveMomentId(value);
	if (!resolved) return null;
	return LIFE_MOMENTS.find((moment) => moment.id === resolved) ?? null;
}

export type LandingHubSidebarProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

export function LandingHubSidebar({
	open: isOpen,
	onOpenChange,
}: LandingHubSidebarProps) {
	const router = useRouter();
	const [journey, setJourney] = useState<LandingJourneyState>(EMPTY_STATE);
	const [suburbInput, setSuburbInput] = useState("");
	const [suburbOptions, setSuburbOptions] = useState<SuburbOption[]>([]);
	const [selectedSuburb, setSelectedSuburb] = useState<SuburbOption | null>(
		null,
	);
	const [activeSuburbIndex, setActiveSuburbIndex] = useState(-1);
	const [suburbLoading, setSuburbLoading] = useState(false);
	const [suburbError, setSuburbError] = useState("");
	const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
	const [debouncedSuburbQuery, setDebouncedSuburbQuery] = useState("");
	const skipNextSuburbSearchRef = useRef(false);
	const suburbListboxId = useId();

	useEffect(() => {
		const next = readLandingJourneyState();
		setJourney(next);
		setSuburbInput(next.selectedSuburb ?? "");
		setSelectedTopics(next.topicHistory.slice(0, 5));
	}, []);

	useEffect(() => {
		const timer = window.setTimeout(() => {
			setDebouncedSuburbQuery(suburbInput);
		}, 250);
		return () => {
			window.clearTimeout(timer);
		};
	}, [suburbInput]);

	useEffect(() => {
		let cancelled = false;
		const normalizedQuery = normalizeSuburbName(debouncedSuburbQuery);

		if (skipNextSuburbSearchRef.current) {
			skipNextSuburbSearchRef.current = false;
			setSuburbLoading(false);
			setSuburbError("");
			return;
		}

		if (!normalizedQuery || normalizedQuery.length < 3) {
			setSuburbOptions([]);
			setSuburbLoading(false);
			setSuburbError("");
			return;
		}

		async function loadSuburbs() {
			setSuburbLoading(true);
			setSuburbError("");
			try {
				const suburbsParams = new URLSearchParams({
					q: normalizedQuery,
				});
				const suburbsResponse = await fetch(
					`/api/suburbs?${suburbsParams.toString()}`,
				);
				if (!suburbsResponse.ok) {
					throw new Error("Failed to fetch suburb data");
				}
				const suburbsPayload = (await suburbsResponse.json()) as {
					suburbs?: SuburbOption[];
				};
				if (!cancelled) {
					setSuburbOptions(suburbsPayload.suburbs ?? []);
				}
			} catch {
				if (!cancelled) {
					setSuburbError("Could not load suburbs right now.");
				}
			} finally {
				if (!cancelled) {
					setSuburbLoading(false);
				}
			}
		}

		void loadSuburbs();
		return () => {
			cancelled = true;
		};
	}, [debouncedSuburbQuery]);

	useEffect(() => {
		const resolved = resolveMomentId(journey.lifeMoment);
		if (!resolved || resolved === journey.lifeMoment) return;
		saveLifeMoment(resolved);
		setJourney((current) => ({ ...current, lifeMoment: resolved }));
	}, [journey.lifeMoment]);

	useEffect(() => {
		if (!isOpen) return;

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") onOpenChange(false);
		};

		document.addEventListener("keydown", onKeyDown);
		return () => {
			document.removeEventListener("keydown", onKeyDown);
		};
	}, [isOpen, onOpenChange]);

	const reflection = useMemo(() => {
		const suburb = journey.selectedSuburb || "Melbourne";
		const totalReads =
			journey.arcProgress.week1 +
			journey.arcProgress.month1 +
			journey.arcProgress.month3;
		const selectedMoment = findLifeMoment(journey.lifeMoment);
		const momentText = selectedMoment
			? selectedMoment.title
			: "your current chapter";
		const chosenTopics = selectedTopics;
		const topicsSummary =
			chosenTopics.length > 0
				? ` · ${chosenTopics.length} topic${chosenTopics.length === 1 ? "" : "s"} selected (${chosenTopics.join(", ")})`
				: " · no topics selected yet";
		return `${suburb} · ${momentText} · ${totalReads} guides completed${topicsSummary}.`;
	}, [journey, selectedTopics]);

	const isIntroComplete = Boolean(
		journey.selectedSuburb &&
		journey.lifeMoment &&
		selectedTopics.length > 0,
	);

	function refreshJourneyFromStorage() {
		const next = readLandingJourneyState();
		setJourney(next);
		setSuburbInput(next.selectedSuburb ?? "");
		setActiveSuburbIndex(-1);
		setSelectedTopics(next.topicHistory.slice(0, 5));
	}

	function applySuburbSelection(nextSuburbRaw: string) {
		const nextSuburb = normalizeSuburbName(nextSuburbRaw);
		if (!nextSuburb || typeof window === "undefined") return;
		window.localStorage.setItem(LANDING_KEYS.selectedSuburb, nextSuburb);
		window.localStorage.setItem(LANDING_KEYS.stateVersion, "1");
		refreshJourneyFromStorage();
	}

	function resetSuburbSelection() {
		if (typeof window === "undefined") return;
		window.localStorage.removeItem(LANDING_KEYS.selectedSuburb);
		window.localStorage.setItem(LANDING_KEYS.stateVersion, "1");
		setSelectedSuburb(null);
		setSuburbInput("");
		setSuburbOptions([]);
		setActiveSuburbIndex(-1);
		refreshJourneyFromStorage();
	}

	const suburbSuggestions = useMemo(
		() => rankAndFilterSuburbs(suburbOptions, suburbInput),
		[suburbOptions, suburbInput],
	);
	const normalizedSuburbQuery = normalizeSuburbName(suburbInput);
	const hasConfirmedSuburbSelection =
		selectedSuburb !== null &&
		normalizeSuburbName(selectedSuburb.locality).toLowerCase() ===
			normalizedSuburbQuery.toLowerCase();
	const hasSavedSuburb = Boolean(journey.selectedSuburb);
	const shouldShowSuburbSuggestionsPanel =
		suburbLoading ||
		Boolean(suburbError) ||
		(normalizedSuburbQuery.length > 0 && !hasConfirmedSuburbSelection);
	const activeSuburbOption =
		activeSuburbIndex >= 0 && activeSuburbIndex < suburbSuggestions.length
			? suburbSuggestions[activeSuburbIndex]
			: null;

	function chooseLifeMoment(momentId: string) {
		saveLifeMoment(momentId);
		refreshJourneyFromStorage();
	}

	function toggleFocusTopic(topicLabel: string) {
		const exists = selectedTopics.includes(topicLabel);
		const nextTopics = exists
			? selectedTopics.filter((topic) => topic !== topicLabel)
			: selectedTopics.length >= 5
				? [...selectedTopics.slice(1), topicLabel]
				: [...selectedTopics, topicLabel];
		setSelectedTopics(nextTopics);
		if (typeof window === "undefined") return;
		const latestTopic =
			nextTopics.length > 0 ? nextTopics[nextTopics.length - 1] : null;
		window.localStorage.setItem(
			LANDING_KEYS.topicHistory,
			JSON.stringify(nextTopics),
		);
		if (latestTopic) {
			window.localStorage.setItem(LANDING_KEYS.lastTopic, latestTopic);
		} else {
			window.localStorage.removeItem(LANDING_KEYS.lastTopic);
		}
		window.localStorage.setItem(LANDING_KEYS.stateVersion, "1");
		refreshJourneyFromStorage();
	}

	function goToUserPage() {
		onOpenChange(false);
		router.push("/user");
	}

	function clearJourney() {
		if (typeof window === "undefined") return;
		Object.values(LANDING_KEYS).forEach((key) => {
			window.localStorage.removeItem(key);
		});
		window.localStorage.removeItem("minuri:guide-bookmarks:v1");
		setJourney(EMPTY_STATE);
		setSuburbInput("");
		setSelectedTopics([]);
	}

	return (
		<>
			{!isOpen ? (
				<button
					type="button"
					aria-controls="landing-hub-sidebar"
					aria-expanded={false}
					onClick={() => onOpenChange(true)}
					className="fixed right-0 top-1/2 z-40 hidden h-50 w-12 -translate-y-1/2 cursor-pointer transform-none rounded-l-[0.9rem] bg-minuri-teal px-2 py-4 text-minuri-ocean shadow-[0_16px_30px_-22px_color-mix(in_oklch,var(--minuri-mid)_45%,transparent)] hover:bg-minuri-teal/90 md:flex md:flex-col md:items-center md:justify-between"
				>
					<span className="[writing-mode:vertical-rl] text-[0.78rem] font-black uppercase tracking-[0.18em] text-minuri-white">
						Wellnest
					</span>
					<ChevronsLeft
						className="mb-1 size-4 text-minuri-white/95"
						aria-hidden
					/>
				</button>
			) : null}

			<div
				className={cn(
					"fixed inset-0 z-30 hidden bg-minuri-ocean/12 transition-opacity duration-150 md:block",
					isOpen
						? "pointer-events-auto opacity-100"
						: "pointer-events-none opacity-0",
				)}
				aria-hidden
				onClick={() => onOpenChange(false)}
			/>

			<aside
				id="landing-hub-sidebar"
				aria-label="Your Minuri hub"
				className={cn(
					"fixed bottom-4 right-4 z-40 hidden h-[calc(100dvh-2rem)] w-[40vw] overflow-hidden rounded-[1.35rem] border border-minuri-silver/85 bg-minuri-white shadow-[0_20px_52px_-34px_color-mix(in_oklch,var(--minuri-mid)_42%,transparent)] transition-transform duration-150 md:flex",
					isOpen
						? "translate-x-0"
						: "translate-x-[calc(100%+1.2rem)]",
				)}
			>
				<div className="flex h-full w-full flex-col">
					<div className="border-b border-minuri-silver/65 px-5 py-4">
						<div className="flex items-start justify-between gap-3">
							<div>
								<h2 className="text-xl font-black uppercase tracking-tight text-minuri-ocean">
									Your Wellnest
								</h2>
								<p className="mt-1 text-xs leading-relaxed text-minuri-slate">
									Your nest of wellbeing, wherever you are.
								</p>
							</div>
							<button
								type="button"
								onClick={() => onOpenChange(false)}
								aria-label="Close Minuri hub"
								className="inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full border border-minuri-silver/70 bg-minuri-white text-minuri-ocean transition-colors hover:border-minuri-teal/50 hover:text-minuri-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-minuri-teal/60 focus-visible:ring-offset-2 focus-visible:ring-offset-minuri-white"
							>
								<X className="size-4.5" aria-hidden />
							</button>
						</div>
					</div>

					<div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
						<>
							<section className="border-b border-minuri-silver/55 pb-3">
								<p className="text-[0.66rem] font-black uppercase tracking-[0.14em] text-minuri-teal">
									Step 1 of 3
								</p>
								<p className="text-sm leading-relaxed text-minuri-ocean">
									Welcome to Minuri. Let&apos;s get you set
									up.
								</p>
								<p className="mt-1 text-[0.72rem] text-minuri-slate">
									Start with your suburb so we can shape your
									local Wellnest.
								</p>
							</section>

							<section className="pt-1">
								<h3 className="text-[0.68rem] font-black uppercase tracking-[0.14em] text-minuri-teal">
									Where are you living right now?
								</h3>
								<div className="relative mt-2">
									<Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-minuri-silver" />
									<input
										value={suburbInput}
										disabled={hasSavedSuburb}
										onChange={(event) => {
											setSuburbInput(event.target.value);
											setSelectedSuburb(null);
											setActiveSuburbIndex(-1);
										}}
										onKeyDown={(event) => {
											if (event.key === "ArrowDown") {
												event.preventDefault();
												setActiveSuburbIndex((prev) => {
													if (
														suburbSuggestions.length ===
														0
													)
														return -1;
													return Math.min(
														prev + 1,
														suburbSuggestions.length -
															1,
													);
												});
												return;
											}
											if (event.key === "ArrowUp") {
												event.preventDefault();
												setActiveSuburbIndex((prev) =>
													Math.max(prev - 1, 0),
												);
												return;
											}
											if (event.key === "Escape") {
												event.preventDefault();
												setActiveSuburbIndex(-1);
												return;
											}
											if (
												event.key === "Enter" &&
												activeSuburbOption
											) {
												event.preventDefault();
												setSelectedSuburb(
													activeSuburbOption,
												);
												skipNextSuburbSearchRef.current = true;
												setSuburbInput(
													activeSuburbOption.locality,
												);
												setActiveSuburbIndex(-1);
												applySuburbSelection(
													activeSuburbOption.locality,
												);
											}
										}}
										placeholder="Type your suburb or postcode"
										role="combobox"
										aria-autocomplete="list"
										aria-expanded={
											!hasSavedSuburb &&
											!suburbLoading &&
											!suburbError &&
											suburbSuggestions.length > 0
										}
										aria-controls={suburbListboxId}
										aria-activedescendant={
											activeSuburbOption
												? `landing-suburb-option-${activeSuburbOption.id}`
												: undefined
										}
										className={cn(
											"min-w-0 w-full rounded-full border pl-10 pr-3 py-2 text-sm text-minuri-ocean outline-none transition",
											hasSavedSuburb
												? "cursor-not-allowed border-minuri-teal/70 bg-minuri-teal/5 focus:border-minuri-teal"
												: "border-minuri-silver bg-minuri-white focus:border-minuri-teal",
										)}
									/>
								</div>
								{hasSavedSuburb ? (
									<div className="mt-2 flex items-center justify-between gap-2">
										<span className="inline-flex items-center gap-1.5 text-[0.72rem] font-semibold text-minuri-teal">
											<CheckCircle2
												className="size-3.5"
												aria-hidden
											/>
											Suburb set to{" "}
											{journey.selectedSuburb}
										</span>
										<button
											type="button"
											onClick={resetSuburbSelection}
											className="rounded-full border border-minuri-silver/80 bg-minuri-white px-2.5 py-1 text-[0.68rem] font-semibold text-minuri-slate transition-colors hover:border-minuri-teal/45 hover:text-minuri-teal"
										>
											Reset
										</button>
									</div>
								) : null}
								{shouldShowSuburbSuggestionsPanel && (
									<div
										id={suburbListboxId}
										role="listbox"
										className="mt-2 max-h-40 overflow-y-auto rounded-xl border border-minuri-silver/50 bg-minuri-white"
									>
										{suburbLoading ? (
											<div className="flex items-center gap-2 px-3 py-2.5 text-xs text-minuri-slate">
												<Loader2 className="size-3.5 animate-spin" />
												Loading suburbs...
											</div>
										) : null}
										{!suburbLoading && suburbError ? (
											<div className="px-3 py-2.5 text-xs text-rose-700">
												{suburbError}
											</div>
										) : null}
										{!suburbLoading &&
										!suburbError &&
										suburbSuggestions.length === 0 ? (
											<div className="px-3 py-2.5 text-xs text-minuri-slate">
												{normalizedSuburbQuery.length >
													0 &&
												normalizedSuburbQuery.length < 3
													? "Keep typing to search suburbs."
													: "No matching suburb yet."}
											</div>
										) : null}
										{!suburbLoading &&
											!suburbError &&
											suburbSuggestions.map((option) => (
												<button
													key={option.id}
													type="button"
													role="option"
													id={`landing-suburb-option-${option.id}`}
													aria-selected={
														selectedSuburb?.id ===
															option.id ||
														activeSuburbOption?.id ===
															option.id
													}
													onMouseDown={(event) => {
														event.preventDefault();
													}}
													onClick={() => {
														setSelectedSuburb(
															option,
														);
														skipNextSuburbSearchRef.current = true;
														setSuburbInput(
															option.locality,
														);
														setActiveSuburbIndex(
															-1,
														);
														applySuburbSelection(
															option.locality,
														);
													}}
													className={cn(
														"flex w-full items-start gap-2 px-3 py-2 text-left text-xs transition hover:bg-minuri-fog",
														selectedSuburb?.id ===
															option.id ||
															activeSuburbOption?.id ===
																option.id
															? "bg-minuri-teal/10"
															: "bg-transparent",
													)}
												>
													<MapPin className="mt-0.5 size-3.5 shrink-0 text-minuri-teal" />
													<span>
														<span className="font-semibold text-minuri-mid">
															{option.locality}
														</span>
														<span className="ml-1 text-minuri-slate">
															{option.state}{" "}
															{option.postcode}
														</span>
													</span>
												</button>
											))}
									</div>
								)}
							</section>

							<section
								className={cn(
									"border-t border-minuri-silver/55 pt-3",
									journey.selectedSuburb
										? "opacity-100"
										: "opacity-70",
								)}
							>
								<div className="flex items-start justify-between gap-2">
									<h3 className="text-[0.68rem] font-black uppercase tracking-[0.14em] text-minuri-teal">
										Step 2 of 3: Pick a moment
									</h3>
									{journey.lifeMoment ? (
										<span className="rounded-full bg-minuri-teal/10 px-2 py-0.5 text-[0.62rem] font-semibold text-minuri-teal">
											Selected
										</span>
									) : null}
								</div>
								{!journey.selectedSuburb ? (
									<p className="mt-2 text-[0.72rem] text-minuri-slate">
										Set your suburb first to unlock your
										starting moment.
									</p>
								) : null}
								<div className="mt-2.5 space-y-2">
									{LIFE_MOMENTS.map((moment) => (
										<div
											key={moment.id}
											className={cn(
												"rounded-minuri border p-2.5",
												journey.lifeMoment === moment.id
													? "border-minuri-teal/50 bg-minuri-teal/6"
													: "border-minuri-silver/55",
											)}
										>
											<div className="flex items-center justify-between gap-2">
												<p className="text-sm font-semibold text-minuri-ocean">
													{moment.title}
												</p>
												<button
													type="button"
													onClick={() =>
														chooseLifeMoment(
															moment.id,
														)
													}
													disabled={
														!journey.selectedSuburb
													}
													className="cursor-pointer rounded-full border border-minuri-silver bg-minuri-white px-2 py-1 text-[0.68rem] font-semibold text-minuri-ocean transition-colors hover:border-minuri-teal/45 hover:text-minuri-teal disabled:cursor-not-allowed disabled:opacity-60"
												>
													Choose
												</button>
											</div>
										</div>
									))}
								</div>
							</section>

							<section
								className={cn(
									"border-t border-minuri-silver/55 pt-3",
									journey.lifeMoment
										? "opacity-100"
										: "opacity-70",
								)}
							>
								<div className="flex items-start justify-between gap-2">
									<h3 className="text-[0.68rem] font-black uppercase tracking-[0.14em] text-minuri-teal">
										Step 3 of 3: Focus topics
									</h3>
									{selectedTopics.length > 0 ? (
										<span className="rounded-full bg-minuri-teal/10 px-2 py-0.5 text-[0.62rem] font-semibold text-minuri-teal">
											{selectedTopics.length}/5
										</span>
									) : null}
								</div>
								{!journey.lifeMoment ? (
									<p className="mt-2 text-[0.72rem] text-minuri-slate">
										Pick your life moment first, then choose
										up to 5 areas to focus on.
									</p>
								) : (
									<p className="mt-2 text-[0.72rem] text-minuri-slate">
										Choose up to 5 topics so we can tailor
										your page.
									</p>
								)}
								<div className="mt-2.5 flex flex-wrap gap-1.5">
									{FOCUS_TOPICS.map((topic) => {
										const isSelected =
											selectedTopics.includes(
												topic.label,
											);
										const isDisabled =
											!isSelected &&
											selectedTopics.length >= 5;
										return (
											<button
												key={topic.id}
												type="button"
												onClick={() =>
													toggleFocusTopic(
														topic.label,
													)
												}
												disabled={
													!journey.lifeMoment ||
													isDisabled
												}
												className={cn(
													"cursor-pointer rounded-full border px-2.5 py-1 text-[0.7rem] font-semibold transition-colors",
													isSelected
														? "border-minuri-teal bg-minuri-teal/10 text-minuri-teal"
														: "border-minuri-silver/70 bg-minuri-white text-minuri-ocean hover:border-minuri-teal/45",
													(!journey.lifeMoment ||
														isDisabled) &&
														"cursor-not-allowed opacity-55",
												)}
											>
												{topic.label}
											</button>
										);
									})}
								</div>
							</section>

							<section className="border-t border-minuri-silver/55 pt-3">
								<p className="text-[0.68rem] font-black uppercase tracking-[0.14em] text-minuri-teal">
									Starter recommendation
								</p>
								<p className="mt-1 text-sm leading-relaxed text-minuri-ocean">
									{journey.lifeMoment
										? `Start with ${findLifeMoment(journey.lifeMoment)?.title ?? sentenceCaseMoment(journey.lifeMoment)} in Guides for a quick first step.`
										: "Choose a life moment above and we will suggest your best first guide."}
								</p>
							</section>

							<section className="pt-1 text-[0.68rem] text-minuri-slate">
								<p>
									Your journey stays on this device. Minuri
									never sees it.
								</p>
							</section>
							<section className="border-t border-minuri-silver/55 pt-3">
								{isIntroComplete ? (
									<>
										<p className="text-sm leading-relaxed text-minuri-ocean">
											You&apos;re all set. We have enough
											context to personalize your page.
										</p>
										<p className="mt-1 text-[0.75rem] leading-relaxed text-minuri-slate">
											{reflection}
										</p>
									</>
								) : (
									<p className="text-[0.75rem] leading-relaxed text-minuri-slate">
										Complete all 3 steps to continue to your
										personalized page.
									</p>
								)}
							</section>
							<div className="flex flex-wrap items-center gap-2">
								<button
									type="button"
									onClick={goToUserPage}
									disabled={!isIntroComplete}
									className="inline-flex cursor-pointer items-center gap-1 rounded-full bg-minuri-teal px-3.5 py-2 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-55"
								>
									Continue to your page
									<ArrowUpRight
										className="size-3.5"
										aria-hidden
									/>
								</button>
								<button
									type="button"
									onClick={clearJourney}
									className="inline-flex cursor-pointer rounded-full border border-minuri-silver bg-minuri-white px-3 py-1.5 text-xs font-semibold text-minuri-ocean transition-colors hover:border-minuri-teal/45"
								>
									Restart setup
								</button>
							</div>
						</>
					</div>
				</div>
			</aside>
		</>
	);
}
