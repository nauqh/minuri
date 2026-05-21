"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
	ArrowLeft,
	Check,
	CheckCircle2,
	ChevronRight,
	Compass,
	HeartPulse,
	Home,
	Loader2,
	MapPin,
	Pencil,
	Sandwich,
	Search,
	Users,
	X,
	type LucideIcon,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import Image from "next/image";
import { GUIDES, GUIDE_TOPICS, type GuideTopicSlug } from "@/content/guides";
import {
	normalizeSuburbName,
	preloadSuburbs,
	rankAndFilterSuburbs,
	type SuburbOption,
} from "@/lib/suburbs";
import { cn } from "@/lib/utils";
import { useJourneyState } from "@/hooks/use-journey-state";
import { useIdentityState } from "@/hooks/use-identity-state";
import {
	buildMockIdentity,
	buildIdentityFromLLM,
	clearIdentityStore,
} from "@/lib/journey/identity";
import {
	saveWeekPlan,
	type JourneyAPIResponse,
} from "@/lib/journey/week-plan-store";
import { buildStaticWeekPlan } from "@/lib/journey/static-plans";

type TopicVisual = {
	icon: LucideIcon;
	heroBg: string;
	description: string;
};

const TOPIC_VISUALS: Record<string, TopicVisual> = {
	"food-eating": {
		icon: Sandwich,
		heroBg: "#00f5c8",
		description: "Eat well on any budget",
	},
	"getting-around": {
		icon: Compass,
		heroBg: "#5dd6ff",
		description: "Navigate the city with confidence",
	},
	"health-wellbeing": {
		icon: HeartPulse,
		heroBg: "#fcf300",
		description: "Stay healthy and supported",
	},
	"home-admin": {
		icon: Home,
		heroBg: "#ffc2d1",
		description: "Handle rent, bills and admin",
	},
	"social-belonging": {
		icon: Users,
		heroBg: "#cae9ff",
		description: "Build connections from scratch",
	},
};

const TOPIC_URGENCY: Record<string, string> = {
	"food-eating": "I need to sort groceries and eating on a budget",
	"getting-around": "I need to figure out transport and getting around",
	"health-wellbeing": "I need a GP and to understand the health system",
	"home-admin": "I need to sort rent, bills, and admin paperwork",
	"social-belonging": "I want to meet people and stop feeling isolated",
};

const MIN_MOMENT_LENGTH = 30;

const CARD_SIZE = 180;
const CENTER_SIZE = 120;
const CONTAINER_W = 760;
const CONTAINER_H = 640;
const FLOAT_AMP = [14, 16, 12, 15, 13];
const FLOAT_DUR = [3.2, 2.8, 3.6, 3.0, 2.5];
const FLOAT_DEL = [0, 0.9, 1.5, 0.4, 1.2];

const PENTAGON_POS = [
  { x: 315, y: 44 },
  { x: 539, y: 198 },
  { x: 453, y: 430 },
  { x: 173, y: 433 },
  { x: 82, y: 197 },
];

const SCATTER_POS = [
  { x: 283, y: 27 },
  { x: 572, y: 217 },
  { x: 459, y: 457 },
  { x: 132, y: 448 },
  { x: 38, y: 207 },
];

const MOMENT_PRESETS = [
	{
		id: 1,
		label: "Just started uni",
		persona: "/persona/mei.svg",
		personaBg: "#e8f9f5",
		fullText:
			"I've just moved to Melbourne to start university and I don't know where to begin. I need to sort out a GP, figure out public transport, find affordable food — all while adjusting to a completely new city and starting classes.",
	},
	{
		id: 2,
		label: "First job here",
		persona: "/persona/jordan.svg",
		personaBg: "#e8f3fb",
		fullText:
			"I've just started my first real job in Melbourne and need to get the basics sorted quickly. I want a budget that actually works, utilities set up properly, and to understand how to get around the city without overpaying.",
	},
	{
		id: 3,
		label: "From overseas",
		persona: "/persona/priya.svg",
		personaBg: "#fef9e8",
		fullText:
			"I've just moved to Melbourne from overseas and there's a lot I don't understand yet. I need to get a local SIM, figure out Medicare and whether I'm eligible, open a bank account, and learn how to get around — all while adjusting to a completely different city and system.",
	},
	{
		id: 4,
		label: "New to Melbourne",
		persona: "/persona/chloe.svg",
		personaBg: "#fdeef2",
		fullText:
			"I've just moved to Melbourne from another city in Australia and it's more complex than I expected. I want to build a proper routine, find affordable places to eat, and stop feeling like a tourist in a place I'm supposed to call home.",
	},
];

type PresetId = number;

const HOW_IT_WORKS_STEPS = [
	{
		title: "Tell us your moment",
		body: "Pick what sounds like you — or write your own. The more specific you are, the more useful your plan will be.",
	},
	{
		title: "Name what you need right now",
		body: "Pick your Melbourne suburb and the topics that matter most to you today.",
	},
	{
		title: "Start your guide journey",
		body: "We put together a personalised week plan built around your situation and location.",
	},
];

export function JourneyOnboarding() {
	const router = useRouter();
	const { saveJourney, clearJourney } = useJourneyState();
	const { initIdentity } = useIdentityState();
	const prefersReducedMotion = useReducedMotion();

	const [yourMoment, setYourMoment] = useState("");
	const [selectedPreset, setSelectedPreset] = useState<PresetId | null>(null);
	const [showTextarea, setShowTextarea] = useState(false);
	const [howItWorksOpen, setHowItWorksOpen] = useState(false);

	const [suburbQuery, setSuburbQuery] = useState("");
	const [selectedSuburb, setSelectedSuburb] = useState<SuburbOption | null>(
		null,
	);
	const [activeSuburbIndex, setActiveSuburbIndex] = useState(-1);
	const [suburbLoading, setSuburbLoading] = useState(true);
	const [suburbError, setSuburbError] = useState("");
	const [allSuburbs, setAllSuburbs] = useState<SuburbOption[]>([]);
	const [selectedTopics, setSelectedTopics] = useState<GuideTopicSlug[]>([]);
	const [stage, setStage] = useState<"form" | "loading">("form");
	const [isHovered, setIsHovered] = useState(false);

	const listboxId = useId();

	useEffect(() => {
		preloadSuburbs()
			.then((suburbs) => {
				setAllSuburbs(suburbs);
				setSuburbLoading(false);
			})
			.catch(() => {
				setSuburbError("Could not load suburbs right now.");
				setSuburbLoading(false);
			});
	}, []);

	const suburbOptions = useMemo(() => {
		const normalized = normalizeSuburbName(suburbQuery);
		if (!normalized || normalized.length < 3) return [];
		return rankAndFilterSuburbs(allSuburbs, suburbQuery);
	}, [allSuburbs, suburbQuery]);

	function handleSuburbChange(value: string) {
		setSuburbQuery(value);
		setSelectedSuburb(null);
		setActiveSuburbIndex(-1);
	}

	function selectSuburb(option: SuburbOption) {
		setSelectedSuburb(option);
		setSuburbQuery(option.locality);
		setActiveSuburbIndex(-1);
	}

	function toggleTopic(topic: GuideTopicSlug) {
		setSelectedTopics((prev) =>
			prev.includes(topic)
				? prev.filter((t) => t !== topic)
				: [...prev, topic],
		);
	}

	function handleSelectPreset(preset: (typeof MOMENT_PRESETS)[number]) {
		setSelectedPreset(preset.id);
		setYourMoment(preset.fullText);
		setShowTextarea(true);
	}

	function handleWriteOwn() {
		setSelectedPreset(null);
		setYourMoment("");
		setShowTextarea(true);
	}

	const normalizedQuery = normalizeSuburbName(suburbQuery);
	const hasConfirmedSuburb =
		selectedSuburb !== null &&
		normalizeSuburbName(selectedSuburb.locality).toLowerCase() ===
			normalizedQuery.toLowerCase();

	const shouldShowDropdown =
		!hasConfirmedSuburb &&
		(suburbLoading || Boolean(suburbError) || normalizedQuery.length > 0);

	const isFormValid =
		yourMoment.length >= MIN_MOMENT_LENGTH &&
		hasConfirmedSuburb &&
		selectedTopics.length >= 1;

	const missingCount = [
		yourMoment.length >= MIN_MOMENT_LENGTH,
		hasConfirmedSuburb,
		selectedTopics.length >= 1,
	].filter((v) => !v).length;

	const showMomentPrompt =
		yourMoment.length > 0 && yourMoment.length < MIN_MOMENT_LENGTH;

	async function handleSubmit() {
		if (!isFormValid || !selectedSuburb) return;
		clearJourney();
		clearIdentityStore();
		saveJourney({
			yourMoment,
			suburb: selectedSuburb.locality,
			selectedTopics,
		});
		setStage("loading");
		try {
			const res = await fetch("/api/journey", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					suburb: selectedSuburb.locality,
					your_moment: yourMoment,
					selected_topics: selectedTopics,
				}),
			});
			if (!res.ok) throw new Error("API error");
			const data = (await res.json()) as JourneyAPIResponse;
			saveWeekPlan(
				buildStaticWeekPlan(data.identity.archetype, selectedTopics),
			);
			initIdentity(buildIdentityFromLLM(data.identity));
		} catch {
			saveWeekPlan(buildStaticWeekPlan("first-timer", selectedTopics));
			initIdentity(
				buildMockIdentity(selectedSuburb.locality, selectedTopics),
			);
		}
		router.push("/journey/plan");
	}

	const revealTransition = {
		duration: prefersReducedMotion ? 0.01 : 0.45,
		ease: [0.22, 1, 0.36, 1] as const,
	};

	return (
		<AnimatePresence mode="wait">
			{stage === "loading" ? (
				<motion.div
					key="loading"
					className="flex min-h-screen flex-col items-center justify-center journey-notebook-bg px-6 py-16"
					initial={{
						opacity: 0,
						scale: prefersReducedMotion ? 1 : 0.97,
					}}
					animate={{ opacity: 1, scale: 1 }}
					transition={{
						duration: prefersReducedMotion ? 0.01 : 0.35,
						ease: [0.22, 1, 0.36, 1],
					}}
				>
					<div className="w-full max-w-lg">
						<div className="mb-10 flex items-center gap-5">
							<div className="h-[3px] w-12 bg-minuri-teal" />
							<span className="text-[10px] font-black uppercase tracking-[0.2em] text-minuri-ocean/40">Building your plan</span>
						</div>
						<p className="text-[clamp(2.5rem,6vw,4.5rem)] font-black leading-[0.92] tracking-tight text-minuri-ocean">
							Reading<br />your story...
						</p>
						<p className="mt-8 text-base text-minuri-slate">
							Crafting a week plan for{" "}
							<span className="font-semibold text-minuri-teal">{selectedSuburb?.locality}</span>
						</p>
						<p className="mt-1 text-xs uppercase tracking-[0.14em] text-minuri-slate/40">This can take up to 30 seconds</p>
						<div className="mt-10 h-[2px] w-full overflow-hidden bg-minuri-ocean/10">
							<motion.div
								className="h-full w-1/3 bg-minuri-ocean"
								animate={{ x: ["-100%", "400%"] }}
								transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
							/>
						</div>
					</div>
				</motion.div>
			) : (
				<motion.div
					key="form"
					className="relative min-h-screen journey-notebook-bg text-minuri-ink"
					exit={{
						opacity: 0,
						transition: {
							duration: prefersReducedMotion ? 0.01 : 0.15,
						},
					}}
				>
					<div className="mx-auto max-w-4xl min-[1500px]:max-w-5xl px-6 py-8 md:py-12">
						<motion.div
							className="flex flex-col"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={revealTransition}
						>
							{/* ── Header ── */}
							<motion.div
								className="relative flex items-center justify-between"
								initial={{
									opacity: 0,
									y: prefersReducedMotion ? 0 : -10,
								}}
								animate={{ opacity: 1, y: 0 }}
								transition={{
									...revealTransition,
									delay: prefersReducedMotion ? 0 : 0.45,
								}}
							>
								<button
									type="button"
									onClick={() => router.back()}
									className="inline-flex items-center gap-2 text-base font-semibold text-minuri-ocean/50 transition-colors duration-200 hover:text-minuri-ocean"
								>
									<ArrowLeft className="size-4" aria-hidden />
									Back
								</button>
								<button
									type="button"
									onClick={() => setHowItWorksOpen((v) => !v)}
									className="inline-flex items-center gap-1.5 rounded-full bg-minuri-ocean px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
								>
									How it works
								</button>

								{/* Sticky note popover — no backdrop, floats over content */}
								<AnimatePresence>
									{howItWorksOpen && (
										<motion.div
											key="hiw-card"
											className="absolute right-0 top-full z-20 mt-3 w-96"
											initial={{ opacity: 0, y: prefersReducedMotion ? 0 : -8, scale: 0.97 }}
											animate={{ opacity: 1, y: 0, scale: 1 }}
											exit={{ opacity: 0, y: -6, scale: 0.97 }}
											transition={{ duration: prefersReducedMotion ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
										>
											<div className="guide-sticky guide-sticky-a">
												<div className="mb-3 flex justify-end">
													<button
														type="button"
														onClick={() => setHowItWorksOpen(false)}
														className="rounded-full p-1 text-[#05292a]/40 transition-colors hover:text-[#05292a]"
														aria-label="Close"
													>
														<X className="size-4" />
													</button>
												</div>
												<ol className="space-y-4">
													{HOW_IT_WORKS_STEPS.map((step, index) => (
														<li key={step.title} className="flex items-start gap-2.5">
															<span
																className="flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
																style={{ background: "rgba(2,18,20,0.1)", color: "#05292a" }}
															>
																{index + 1}
															</span>
															<div>
																<p className="text-sm font-bold leading-snug" style={{ color: "#05292a" }}>
																	{step.title}
																</p>
																<p className="mt-1 text-xs leading-snug" style={{ color: "rgba(2,18,20,0.55)" }}>
																	{step.body}
																</p>
															</div>
														</li>
													))}
												</ol>
											</div>
										</motion.div>
									)}
								</AnimatePresence>
							</motion.div>

							{/* ── Page intro ── */}
							<motion.div
								className="pt-5 pb-4"
								initial={{
									opacity: 0,
									y: prefersReducedMotion ? 0 : 16,
								}}
								animate={{ opacity: 1, y: 0 }}
								transition={{
									...revealTransition,
									delay: prefersReducedMotion ? 0 : 0.55,
								}}
							>
								<h1 className="text-2xl font-black leading-tight text-minuri-ocean md:text-3xl min-[1500px]:text-4xl">
									Where are you and what do you need?
								</h1>
								<p className="mt-3 text-base leading-relaxed text-minuri-slate md:text-lg min-[1500px]:text-xl">
									Tell us what&apos;s going on. We&apos;ll
									build a personalised week plan around your
									situation.
								</p>
							</motion.div>

							{/* ── Form sections ── */}
							<div className="mt-10">
								<div className="space-y-12">
									{/* ── Your moment ── */}
									<motion.div
										initial={{
											opacity: 0,
											y: prefersReducedMotion ? 0 : 24,
										}}
										animate={{ opacity: 1, y: 0 }}
										transition={{
											...revealTransition,
											delay: prefersReducedMotion ? 0 : 0.7,
										}}
									>
										<div className={cn("mb-6 flex items-start gap-4 border-l-[3px] pl-4 transition-colors duration-300", yourMoment.length >= MIN_MOMENT_LENGTH ? "border-minuri-teal" : "border-minuri-ocean/15")}>
											<div className="flex-1">
												<p className="text-[10px] font-black uppercase tracking-[0.16em] text-minuri-ocean/40 min-[1500px]:text-xs">Step 01</p>
												<p className="mt-0.5 text-2xl font-black text-minuri-ocean min-[1500px]:text-3xl">Your moment</p>
												<p className="mt-1 text-sm text-minuri-slate min-[1500px]:text-base">Pick who sounds like you</p>
											</div>
											{yourMoment.length >= MIN_MOMENT_LENGTH && (
												<Check className="mt-1 size-4 shrink-0 text-minuri-teal" strokeWidth={2.5} aria-hidden />
											)}
										</div>

										{/* Persona cards */}
										<div className="mt-4 flex gap-3 overflow-x-auto pb-2">
											{MOMENT_PRESETS.map((preset) => {
												const isActive = selectedPreset === preset.id;
												return (
													<motion.button
														key={preset.id}
														type="button"
														data-no-scale
														onClick={() => handleSelectPreset(preset)}
														whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
														className={cn(
															"relative shrink-0 flex flex-col overflow-hidden rounded-2xl border-2 transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-minuri-teal/60",
															isActive
																? "border-minuri-teal shadow-md"
																: "border-transparent hover:border-minuri-teal/30",
														)}
														style={{ width: 152, height: 210 }}
														aria-pressed={isActive}
													>
														<div
															className="relative w-full flex-1 overflow-hidden"
															style={{ backgroundColor: preset.personaBg }}
														>
															<Image
																src={preset.persona}
																alt=""
																fill
																className="object-contain object-bottom"
																sizes="152px"
															/>
														</div>
														<div className={cn(
															"w-full px-3 py-2.5 transition-colors duration-200",
															isActive ? "bg-minuri-teal" : "bg-white",
														)}>
															<p className={cn(
																"text-sm font-semibold leading-tight",
																isActive ? "text-white" : "text-minuri-ocean",
															)}>
																{preset.label}
															</p>
														</div>
														{isActive && (
															<CheckCircle2 className="absolute right-2 top-2 size-4 text-minuri-teal drop-shadow-sm" aria-hidden />
														)}
													</motion.button>
												);
											})}

											{/* Write my own */}
											<motion.button
												type="button"
												data-no-scale
												onClick={handleWriteOwn}
												whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
												className={cn(
													"relative shrink-0 flex flex-col items-center justify-center gap-3 rounded-2xl border-2 transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-minuri-teal/60",
													showTextarea && selectedPreset === null
														? "border-minuri-teal bg-minuri-mist/40"
														: "border-dashed border-minuri-silver hover:border-minuri-teal/40",
												)}
												style={{ width: 152, height: 210 }}
											>
												<Pencil className="size-6 text-minuri-slate" aria-hidden />
												<p className="px-4 text-sm font-semibold leading-tight text-center text-minuri-slate">
													Write my own
												</p>
											</motion.button>
										</div>

										{/* Textarea */}
										<AnimatePresence>
											{showTextarea && (
												<motion.div
													initial={{
														opacity: 0,
														height: 0,
														marginTop: 0,
													}}
													animate={{
														opacity: 1,
														height: "auto",
														marginTop: 16,
													}}
													exit={{
														opacity: 0,
														height: 0,
														marginTop: 0,
													}}
													transition={{
														duration:
															prefersReducedMotion
																? 0.01
																: 0.28,
														ease: [
															0.22, 1, 0.36, 1,
														],
													}}
													className="space-y-2"
												>
													<p
														className={cn(
															"text-xs font-medium transition-colors duration-200",
															selectedPreset !==
																null
																? "text-minuri-teal"
																: "text-minuri-slate",
														)}
													>
														{selectedPreset !== null
															? "Edit this to match your situation"
															: "Describe your situation in your own words"}
													</p>
													<textarea
														id="your-moment"
														value={yourMoment}
														onChange={(e) =>
															setYourMoment(
																e.target.value,
															)
														}
														rows={4}
														placeholder={
															selectedPreset !==
															null
																? undefined
																: "I just moved to Melbourne and I'm trying to figure out..."
														}
														aria-describedby={
															showMomentPrompt
																? "moment-hint"
																: undefined
														}
														style={{
															paddingTop: "0.6rem",
														}}
														className={cn(
															"w-full resize-none rounded-md border bg-minuri-white px-4 pb-3 text-base outline-none transition min-[1500px]:text-lg",
															showMomentPrompt
																? "border-amber-300 focus:border-amber-400"
																: yourMoment.length >=
																	  MIN_MOMENT_LENGTH
																	? "border-minuri-teal/50 focus:border-minuri-teal"
																	: "border-minuri-silver/80 focus:border-minuri-teal",
														)}
													/>
													<AnimatePresence>
														{showMomentPrompt && (
															<motion.p
																id="moment-hint"
																role="status"
																initial={{
																	opacity: 0,
																	y: -4,
																}}
																animate={{
																	opacity: 1,
																	y: 0,
																}}
																exit={{
																	opacity: 0,
																}}
																transition={{
																	duration: 0.15,
																}}
																className="text-xs text-amber-700"
															>
																A little more
																detail helps us
																personalise your
																plan (
																{
																	yourMoment.length
																}
																/
																{
																	MIN_MOMENT_LENGTH
																}{" "}
																characters)
															</motion.p>
														)}
													</AnimatePresence>
												<p className="text-sm text-minuri-slate">
													Your story is used to shape your plan — we don&apos;t keep it.
												</p>
												</motion.div>
											)}
										</AnimatePresence>
									</motion.div>

									{/* ── Suburb ── */}
									<motion.div
										initial={{
											opacity: 0,
											y: prefersReducedMotion ? 0 : 24,
										}}
										animate={{ opacity: 1, y: 0 }}
										transition={{
											...revealTransition,
											delay: prefersReducedMotion ? 0 : 0.95,
										}}
									>
										<div className={cn("mb-6 flex items-start gap-4 border-l-[3px] pl-4 transition-colors duration-300", hasConfirmedSuburb ? "border-minuri-teal" : "border-minuri-ocean/15")}>
											<div className="flex-1">
												<p className="text-[10px] font-black uppercase tracking-[0.16em] text-minuri-ocean/40 min-[1500px]:text-xs">Step 02</p>
												<label htmlFor="suburb-input" className="mt-0.5 block cursor-pointer text-2xl font-black text-minuri-ocean min-[1500px]:text-3xl">Your Melbourne suburb</label>
												<p className="mt-1 text-sm text-minuri-slate min-[1500px]:text-base">Type to search and confirm your suburb</p>
											</div>
											{hasConfirmedSuburb && (
												<Check className="mt-1 size-4 shrink-0 text-minuri-teal" strokeWidth={2.5} aria-hidden />
											)}
										</div>
										<div className="relative mt-2.5">
											<Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-minuri-silver" />
											<input
												id="suburb-input"
												value={suburbQuery}
												disabled={hasConfirmedSuburb}
												onChange={(e) =>
													handleSuburbChange(
														e.target.value,
													)
												}
												onKeyDown={(e) => {
													if (e.key === "ArrowDown") {
														e.preventDefault();
														setActiveSuburbIndex(
															(prev) =>
																Math.min(
																	prev + 1,
																	suburbOptions.length -
																		1,
																),
														);
													}
													if (e.key === "ArrowUp") {
														e.preventDefault();
														setActiveSuburbIndex(
															(prev) =>
																Math.max(
																	prev - 1,
																	0,
																),
														);
													}
													if (e.key === "Escape")
														setActiveSuburbIndex(
															-1,
														);
													if (
														e.key === "Enter" &&
														suburbOptions[
															activeSuburbIndex
														]
													) {
														e.preventDefault();
														selectSuburb(
															suburbOptions[
																activeSuburbIndex
															],
														);
													}
												}}
												placeholder="Type your suburb or postcode"
												role="combobox"
												aria-autocomplete="list"
												aria-expanded={
													!hasConfirmedSuburb &&
													suburbOptions.length > 0
												}
												aria-controls={listboxId}
												aria-activedescendant={
													activeSuburbIndex >= 0
														? `suburb-opt-${suburbOptions[activeSuburbIndex]?.id}`
														: undefined
												}
												className={cn(
													"h-16 w-full rounded-md border pl-12 pr-4 text-lg outline-none transition",
													hasConfirmedSuburb
														? "cursor-not-allowed border-minuri-teal/60 bg-minuri-mist/30"
														: "border-minuri-silver bg-minuri-white focus:border-minuri-teal",
												)}
											/>
										</div>

										{hasConfirmedSuburb ? (
											<div className="mt-2 flex items-center justify-between gap-2">
												<span className="inline-flex items-center gap-1.5 text-xs font-semibold text-minuri-teal">
													<CheckCircle2
														className="size-3.5"
														aria-hidden
													/>
													Set to{" "}
													{selectedSuburb?.locality}
												</span>
												<button
													type="button"
													onClick={() => {
														setSelectedSuburb(null);
														setSuburbQuery("");
													}}
													className="rounded-full border border-minuri-silver/80 bg-minuri-white px-2.5 py-1 text-[0.68rem] font-semibold text-minuri-slate transition-colors hover:border-minuri-teal/45 hover:text-minuri-teal"
												>
													Change
												</button>
											</div>
										) : (
											<p className="mt-2 text-xs text-minuri-slate">
												Start typing at least 3
												characters to see suburb
												matches.
											</p>
										)}

										{shouldShowDropdown && (
											<div
												id={listboxId}
												role="listbox"
												className="mt-2 max-h-64 overflow-y-auto rounded-md border border-minuri-silver/40 bg-minuri-white shadow-sm"
											>
												{suburbLoading && (
													<div className="flex items-center gap-2 px-3 py-3 text-sm text-minuri-slate">
														<Loader2 className="size-4 animate-spin" />
														Loading suburbs...
													</div>
												)}
												{!suburbLoading &&
													suburbError && (
														<div className="px-3 py-3 text-sm text-rose-700">
															{suburbError}
														</div>
													)}
												{!suburbLoading &&
													!suburbError &&
													suburbOptions.length ===
														0 &&
													normalizedQuery.length >=
														3 && (
														<div className="px-3 py-3 text-sm text-minuri-slate">
															No matching suburb
															found.
														</div>
													)}
												{!suburbLoading &&
													!suburbError &&
													suburbOptions.map(
														(option, index) => (
															<button
																key={option.id}
																type="button"
																role="option"
																id={`suburb-opt-${option.id}`}
																aria-selected={
																	activeSuburbIndex ===
																	index
																}
																data-no-scale
																onMouseDown={(
																	e,
																) =>
																	e.preventDefault()
																}
																onClick={() =>
																	selectSuburb(
																		option,
																	)
																}
																className={cn(
																	"flex w-full items-center gap-3 px-4 py-3.5 text-left text-base transition-colors hover:bg-minuri-fog",
																	activeSuburbIndex ===
																		index
																		? "bg-minuri-teal/10 ring-1 ring-inset ring-minuri-teal/30"
																		: "",
																)}
															>
																<MapPin className="size-4.5 shrink-0 text-minuri-teal" />
																<span>
																	<span className="font-medium text-minuri-mid">
																		{option.locality}
																	</span>
																	<span className="ml-1.5 text-sm text-minuri-slate">
																		{option.state}{" "}
																		{option.postcode}
																	</span>
																</span>
															</button>
														),
													)}
											</div>
										)}
									</motion.div>

									{/* ── Topic cards ── */}
									<motion.div
										initial={{
											opacity: 0,
											y: prefersReducedMotion ? 0 : 24,
										}}
										animate={{ opacity: 1, y: 0 }}
										transition={{
											...revealTransition,
											delay: prefersReducedMotion ? 0 : 1.2,
										}}
									>
										<div className={cn("mb-6 flex items-start gap-4 border-l-[3px] pl-4 transition-colors duration-300", selectedTopics.length >= 1 ? "border-minuri-teal" : "border-minuri-ocean/15")}>
											<div className="flex-1">
												<p className="text-[10px] font-black uppercase tracking-[0.16em] text-minuri-ocean/40 min-[1500px]:text-xs">Step 03</p>
												<p className="mt-0.5 text-2xl font-black text-minuri-ocean min-[1500px]:text-3xl">What matters most right now?</p>
												<p className="mt-1 text-sm text-minuri-slate min-[1500px]:text-base">Select at least one topic to focus your plan</p>
											</div>
											{selectedTopics.length >= 1 && (
												<Check className="mt-1 size-4 shrink-0 text-minuri-teal" strokeWidth={2.5} aria-hidden />
											)}
										</div>
										{/* Desktop — pentagon orbit */}
										<div
											className="relative mx-auto mt-3 hidden md:block"
											style={{ width: CONTAINER_W, height: CONTAINER_H }}
											onMouseEnter={() => setIsHovered(true)}
											onMouseLeave={() => setIsHovered(false)}
										>
											{/* Ripple rings */}
											{selectedTopics.length === 0 && [0, 0.7, 1.4].map((delay) => (
												<motion.div
													key={delay}
													className="absolute rounded-full border border-minuri-ocean/20 pointer-events-none"
													style={{
														width: CENTER_SIZE,
														height: CENTER_SIZE,
														left: (CONTAINER_W - CENTER_SIZE) / 2,
														top: (CONTAINER_H - CENTER_SIZE) / 2,
													}}
													animate={{ scale: [1, 1.9], opacity: [0.5, 0] }}
													transition={{ duration: 2.1, repeat: Infinity, ease: "easeOut", delay }}
												/>
											))}

											{/* Center circle */}
											<div
												className="absolute z-10 flex flex-col items-center justify-center rounded-full text-center transition-colors duration-300"
												style={{
													width: CENTER_SIZE,
													height: CENTER_SIZE,
													left: (CONTAINER_W - CENTER_SIZE) / 2,
													top: (CONTAINER_H - CENTER_SIZE) / 2,
													backgroundColor: selectedTopics.length > 0 ? "#05292a" : "transparent",
													border: selectedTopics.length > 0 ? "none" : "2px dashed rgba(2,24,25,0.25)",
												}}
											>
												{selectedTopics.length === 0 ? (
													<span className="px-3 text-xs font-bold uppercase tracking-widest leading-snug text-minuri-ocean/50">
														Tap a card
													</span>
												) : (
													<>
														<span className="text-3xl font-black text-white leading-none">
															{selectedTopics.length}
														</span>
														<span className="text-xs font-medium text-white/80">
															{selectedTopics.length === 1 ? "topic" : "topics"}
														</span>
													</>
												)}
											</div>

											{/* Orbiting topic circles */}
											{GUIDE_TOPICS.map((topic, i) => {
												const visual = TOPIC_VISUALS[topic.slug];
												const Icon = visual.icon;
												const isSelected = selectedTopics.includes(topic.slug);
												const shouldSnap = isHovered || isSelected;
												const target = shouldSnap ? PENTAGON_POS[i] : SCATTER_POS[i];
												return (
													<motion.div
														key={topic.slug}
														className="absolute"
														style={{ width: CARD_SIZE, height: CARD_SIZE, left: 0, top: 0 }}
														initial={{ x: SCATTER_POS[i].x, y: SCATTER_POS[i].y, opacity: 0 }}
														animate={{ x: target.x, y: target.y, opacity: 1 }}
														transition={{
															x: { type: "spring", stiffness: 180, damping: 22 },
															y: { type: "spring", stiffness: 180, damping: 22 },
															opacity: { duration: 0.4, delay: prefersReducedMotion ? 0 : i * 0.08, ease: [0.22, 1, 0.36, 1] },
														}}
													>
														<motion.button
															type="button"
															role="checkbox"
															aria-checked={isSelected}
															onClick={() => toggleTopic(topic.slug)}
															className={cn(
																"group relative flex h-full w-full cursor-pointer flex-col items-center justify-center gap-1.5 rounded-2xl border-2 p-3 text-center outline-none",
																"focus-visible:ring-2 focus-visible:ring-minuri-teal/50 focus-visible:ring-offset-2",
																isSelected
																	? "shadow-[0_12px_32px_-8px_rgba(2,24,25,0.30)] ring-[2.5px] ring-[#05292a]/25 ring-offset-2"
																	: "shadow-md hover:shadow-lg",
															)}
															style={{ backgroundColor: visual.heroBg, borderColor: visual.heroBg }}
															animate={{ y: !isSelected && !prefersReducedMotion ? [0, -FLOAT_AMP[i], 0] : 0 }}
															transition={
																!isSelected && !prefersReducedMotion
																	? { duration: FLOAT_DUR[i], repeat: Infinity, ease: "easeInOut", delay: FLOAT_DEL[i] }
																	: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
															}
															whileTap={{ scale: prefersReducedMotion ? 1 : 0.95 }}
														>
															{isSelected && (
																<div className="absolute right-2 top-2 flex size-5 items-center justify-center rounded-full bg-[#05292a]" aria-hidden>
																	<Check className="size-3 text-white" strokeWidth={3} />
																</div>
															)}
															<Icon className="size-11 shrink-0 text-[#05292a]" aria-hidden />
															<p className="text-base font-medium leading-tight text-[#05292a]">{topic.name}</p>
															<p className="text-xs font-normal leading-snug text-[#05292a] px-1">{TOPIC_URGENCY[topic.slug]}</p>
														</motion.button>
													</motion.div>
												);
											})}
										</div>

										{/* Mobile — 3+2 stacked rows */}
										<div className="mt-3 flex flex-col items-center gap-4 md:hidden">
											<div className="flex gap-4">
												{GUIDE_TOPICS.slice(0, 3).map((topic, i) => {
													const visual = TOPIC_VISUALS[topic.slug];
													const Icon = visual.icon;
													const isSelected = selectedTopics.includes(topic.slug);
													return (
														<motion.div
															key={topic.slug}
															initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 16 }}
															animate={{ opacity: 1, y: 0 }}
															transition={{ duration: 0.4, delay: prefersReducedMotion ? 0 : i * 0.06, ease: [0.22, 1, 0.36, 1] }}
														>
															<motion.button
																type="button"
																role="checkbox"
																aria-checked={isSelected}
																onClick={() => toggleTopic(topic.slug)}
																className={cn(
																	"group relative flex flex-col cursor-pointer items-center justify-center gap-1.5 rounded-2xl border-2 p-3 text-center outline-none",
																	"focus-visible:ring-2 focus-visible:ring-minuri-teal/50 focus-visible:ring-offset-2",
																	isSelected
																		? "shadow-[0_12px_32px_-8px_rgba(2,24,25,0.30)] ring-[2.5px] ring-[#05292a]/25 ring-offset-2"
																		: "shadow-md hover:shadow-lg",
																)}
																style={{ backgroundColor: visual.heroBg, borderColor: visual.heroBg, width: CARD_SIZE, height: CARD_SIZE }}
																animate={{ y: !isSelected && !prefersReducedMotion ? [0, -FLOAT_AMP[i], 0] : 0 }}
																transition={
																	!isSelected && !prefersReducedMotion
																		? { duration: FLOAT_DUR[i], repeat: Infinity, ease: "easeInOut", delay: FLOAT_DEL[i] }
																		: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
																}
																whileTap={{ scale: prefersReducedMotion ? 1 : 0.95 }}
															>
																{isSelected && (
																	<div className="absolute right-2 top-2 flex size-5 items-center justify-center rounded-full bg-[#05292a]" aria-hidden>
																		<Check className="size-3 text-white" strokeWidth={3} />
																	</div>
																)}
																<Icon className="size-11 shrink-0 text-[#05292a]" aria-hidden />
																<p className="text-base font-medium leading-tight text-[#05292a]">{topic.name}</p>
																<p className="text-xs font-normal leading-snug text-[#05292a] px-1">{TOPIC_URGENCY[topic.slug]}</p>
															</motion.button>
														</motion.div>
													);
												})}
											</div>
											<div className="flex gap-4">
												{GUIDE_TOPICS.slice(3).map((topic, i) => {
													const globalI = i + 3;
													const visual = TOPIC_VISUALS[topic.slug];
													const Icon = visual.icon;
													const isSelected = selectedTopics.includes(topic.slug);
													return (
														<motion.div
															key={topic.slug}
															initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 16 }}
															animate={{ opacity: 1, y: 0 }}
															transition={{ duration: 0.4, delay: prefersReducedMotion ? 0 : globalI * 0.06, ease: [0.22, 1, 0.36, 1] }}
														>
															<motion.button
																type="button"
																role="checkbox"
																aria-checked={isSelected}
																onClick={() => toggleTopic(topic.slug)}
																className={cn(
																	"group relative flex flex-col cursor-pointer items-center justify-center gap-1.5 rounded-2xl border-2 p-3 text-center outline-none",
																	"focus-visible:ring-2 focus-visible:ring-minuri-teal/50 focus-visible:ring-offset-2",
																	isSelected
																		? "shadow-[0_12px_32px_-8px_rgba(2,24,25,0.30)] ring-[2.5px] ring-[#05292a]/25 ring-offset-2"
																		: "shadow-md hover:shadow-lg",
																)}
																style={{ backgroundColor: visual.heroBg, borderColor: visual.heroBg, width: CARD_SIZE, height: CARD_SIZE }}
																animate={{ y: !isSelected && !prefersReducedMotion ? [0, -FLOAT_AMP[globalI], 0] : 0 }}
																transition={
																	!isSelected && !prefersReducedMotion
																		? { duration: FLOAT_DUR[globalI], repeat: Infinity, ease: "easeInOut", delay: FLOAT_DEL[globalI] }
																		: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
																}
																whileTap={{ scale: prefersReducedMotion ? 1 : 0.95 }}
															>
																{isSelected && (
																	<div className="absolute right-2 top-2 flex size-5 items-center justify-center rounded-full bg-[#05292a]" aria-hidden>
																		<Check className="size-3 text-white" strokeWidth={3} />
																	</div>
																)}
																<Icon className="size-11 shrink-0 text-[#05292a]" aria-hidden />
																<p className="text-base font-medium leading-tight text-[#05292a]">{topic.name}</p>
																<p className="text-xs font-normal leading-snug text-[#05292a] px-1">{TOPIC_URGENCY[topic.slug]}</p>
															</motion.button>
														</motion.div>
													);
												})}
											</div>
										</div>

										{selectedTopics.length >= 1 && (
											<motion.p
												initial={{ opacity: 0, y: -4 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{ duration: 0.2 }}
												className="mt-3 text-sm text-minuri-teal"
											>
												Your 7-day plan will cover{" "}
												{selectedTopics.length}{" "}
												{selectedTopics.length === 1 ? "topic" : "topics"}{" "}
												— guides, tasks, and nearby places per day.
											</motion.p>
										)}
									</motion.div>
								</div>
							</div>

							{/* ── Footer submit ── */}
							<motion.div
								className="relative mt-12 pt-8 text-center"
								initial={{
									opacity: 0,
									y: prefersReducedMotion ? 0 : 20,
								}}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true, margin: "-5% 0px" }}
								transition={{
									...revealTransition,
									delay: prefersReducedMotion ? 0 : 0.05,
								}}
							>
								<p className="mb-6 text-sm text-minuri-slate min-[1500px]:text-base">
									Ready to generate your personalised guide?
								</p>
								<button
									type="button"
									onClick={handleSubmit}
									disabled={!isFormValid}
									className="group inline-flex w-full items-center justify-center gap-2 rounded-sm bg-minuri-ocean px-12 py-4 text-base font-bold text-minuri-white transition-transform duration-200 ease-out hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 md:w-auto min-[1500px]:text-lg min-[1500px]:px-16 min-[1500px]:py-5"
								>
									Build My Guide Journey
									{missingCount > 0 ? (
										<span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-semibold">
											{missingCount} left
										</span>
									) : (
										<ChevronRight
											className="size-4 transition-transform duration-200 group-hover:translate-x-1"
											aria-hidden
										/>
									)}
								</button>
							</motion.div>
						</motion.div>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
