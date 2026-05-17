"use client";

import { useCallback, useId, useRef, useState } from "react";
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
	type LucideIcon,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import Image from "next/image";
import { GUIDES, GUIDE_TOPICS, type GuideTopicSlug } from "@/content/guides";
import { normalizeSuburbName, type SuburbOption } from "@/lib/suburbs";
import { cn } from "@/lib/utils";
import { useJourneyState } from "@/hooks/use-journey-state";
import { useIdentityState } from "@/hooks/use-identity-state";
import {
	buildMockIdentity,
	buildIdentityFromLLM,
} from "@/lib/journey/identity";
import {
	saveWeekPlan,
	type JourneyAPIResponse,
} from "@/lib/journey/week-plan-store";

const easeOut = [0.22, 1, 0.36, 1] as const;

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

const JOURNEY_STICKY_CARDS: Array<{
	id: string;
	topic: string;
	title: string;
	note: string;
	bg: string;
	rotate: number;
	left?: string;
	right?: string;
	top: string;
}> = [
	{
		id: "myki",
		topic: "Getting Around",
		title: "Get a Myki card",
		note: "$6 at 7-Eleven. Top up before boarding — no cash on trams.",
		bg: "#5dd6ff",
		rotate: 2,
		left: "2%",
		top: "3%",
	},
	{
		id: "aldi",
		topic: "Food & Eating",
		title: "Cheapest groceries",
		note: "ALDI → IGA → Woolies. Saturday market = fresh & cheap.",
		bg: "#00f5c8",
		rotate: -4,
		left: "20%",
		top: "18%",
	},
	{
		id: "medicare",
		topic: "Health & Wellbeing",
		title: "Medicare card",
		note: "Free for eligible visas. Bring passport + visa to Services Australia.",
		bg: "#fcf300",
		rotate: 3,
		right: "23%",
		top: "15%",
	},
	{
		id: "meetpeople",
		topic: "Social & Belonging",
		title: "Meet people",
		note: "Uni clubs, Meetup.com, Bumble BFF. Locals are friendlier than you think.",
		bg: "#cae9ff",
		rotate: -2,
		right: "2%",
		top: "3%",
	},
	{
		id: "bond",
		topic: "Home & Admin",
		title: "Rental bond",
		note: "Max 4 weeks rent. Paid to RTBA — NOT your landlord.",
		bg: "#ffc2d1",
		rotate: -6,
		left: "2%",
		top: "74%",
	},
	{
		id: "tram",
		topic: "Getting Around",
		title: "Free tram zone",
		note: "CBD trams are free! No tap-on needed inside the city loop.",
		bg: "#5dd6ff",
		rotate: 5,
		right: "2%",
		top: "80%",
	},
];

const MIN_MOMENT_LENGTH = 30;

const MOMENT_PRESETS = [
	{
		id: 1,
		icon: "🎓",
		headline: "Just started uni",
		preview:
			"Everything feels new and a bit overwhelming — classes, a new city, figuring out the basics all at once.",
		fullText:
			"I've just moved to Melbourne to start university and I don't know where to begin. I need to sort out a GP, figure out public transport, find affordable food — all while adjusting to a completely new city and starting classes.",
	},
	{
		id: 2,
		icon: "💼",
		headline: "First job in the city",
		preview:
			"I've started working and need the practical stuff sorted — budget, transport, getting home safely.",
		fullText:
			"I've just started my first real job in Melbourne and need to get the basics sorted quickly. I want a budget that actually works, utilities set up properly, and to understand how to get around the city without overpaying.",
	},
	{
		id: 3,
		icon: "🎒",
		headline: "First year of uni",
		preview:
			"Everything is still pretty new — classes, the city, living away from home. I'm trying to build a routine while getting the basics sorted.",
		fullText:
			"I'm in my first year of university in Melbourne and things still feel pretty overwhelming. I want to sort out a GP, understand public transport, find affordable places to eat, and figure out how to manage my budget — so I can focus on actually enjoying this chapter.",
	},
	{
		id: 4,
		icon: "🏙️",
		headline: "Moved from another city",
		preview:
			"Melbourne is bigger and busier than I expected — I want to find my feet and stop feeling like a visitor.",
		fullText:
			"I've just moved to Melbourne from another city in Australia and it's more complex than I expected. I want to build a proper routine, find affordable places to eat, and stop feeling like a tourist in a place I'm supposed to call home.",
	},
] as const;

type PresetId = (typeof MOMENT_PRESETS)[number]["id"];

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
	const { saveJourney } = useJourneyState();
	const { initIdentity } = useIdentityState();
	const prefersReducedMotion = useReducedMotion();

	const [yourMoment, setYourMoment] = useState("");
	const [selectedPreset, setSelectedPreset] = useState<PresetId | null>(null);
	const [showTextarea, setShowTextarea] = useState(false);

	const [suburbQuery, setSuburbQuery] = useState("");
	const [suburbOptions, setSuburbOptions] = useState<SuburbOption[]>([]);
	const [selectedSuburb, setSelectedSuburb] = useState<SuburbOption | null>(
		null,
	);
	const [activeSuburbIndex, setActiveSuburbIndex] = useState(-1);
	const [suburbLoading, setSuburbLoading] = useState(false);
	const [suburbError, setSuburbError] = useState("");
	const [selectedTopics, setSelectedTopics] = useState<GuideTopicSlug[]>([]);
	const [stage, setStage] = useState<"intro" | "form" | "loading">("intro");

	const guideCounts = new Map(
		GUIDE_TOPICS.map((t) => [
			t.slug,
			GUIDES.filter((g) => g.topic === t.slug).length,
		]),
	);

	const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const listboxId = useId();

	const fetchSuburbs = useCallback((value: string) => {
		if (debounceRef.current !== null) clearTimeout(debounceRef.current);
		debounceRef.current = setTimeout(() => {
			const normalized = normalizeSuburbName(value);
			if (!normalized || normalized.length < 3) {
				setSuburbOptions([]);
				setSuburbLoading(false);
				return;
			}
			setSuburbLoading(true);
			setSuburbError("");
			fetch(`/api/suburbs?q=${encodeURIComponent(normalized)}`)
				.then((r) => r.json() as Promise<{ suburbs?: SuburbOption[] }>)
				.then((data) => {
					setSuburbOptions(data.suburbs ?? []);
					setSuburbLoading(false);
				})
				.catch(() => {
					setSuburbError("Could not load suburbs right now.");
					setSuburbLoading(false);
				});
		}, 250);
	}, []);

	function handleSuburbChange(value: string) {
		setSuburbQuery(value);
		setSelectedSuburb(null);
		setActiveSuburbIndex(-1);
		fetchSuburbs(value);
	}

	function selectSuburb(option: SuburbOption) {
		setSelectedSuburb(option);
		setSuburbQuery(option.locality);
		setSuburbOptions([]);
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
		saveJourney({
			yourMoment,
			suburb: selectedSuburb.locality,
			selectedTopics,
		});
		setStage("loading");
		try {
			const res = await fetch("https://minuri-server-production.up.railway.app/journey", {
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
			saveWeekPlan(data.week_plan);
			initIdentity(buildIdentityFromLLM(data.identity));
		} catch {
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
			{stage === "intro" ? (
				<motion.section
					key="intro"
					className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-24 journey-notebook-bg"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{
						opacity: 0,
						transition: {
							duration: prefersReducedMotion ? 0.01 : 0.15,
						},
					}}
				>
					<button
						type="button"
						onClick={() => router.back()}
						className="absolute left-6 top-6 z-20 inline-flex items-center gap-2 rounded-sm border border-minuri-ocean/20 bg-minuri-white/80 px-6 py-2 text-base font-semibold text-minuri-ocean shadow-xs backdrop-blur-sm transition-colors duration-200 hover:bg-minuri-ocean hover:text-minuri-white"
					>
						<ArrowLeft className="size-3.5" aria-hidden />
						Back to Start
					</button>

					{/* Notebook red margin line */}
					<div
						aria-hidden
						className="pointer-events-none absolute inset-y-0"
						style={{
							left: "clamp(3rem, 8vw, 7rem)",
							width: "2px",
							background: "oklch(0.68 0.13 15 / 0.22)",
						}}
					/>

					{/* Radial fade */}
					<div
						aria-hidden
						className="pointer-events-none absolute inset-0"
						style={{
							background:
								"radial-gradient(ellipse 80% 70% at 50% 50%, transparent 30%, rgba(255,255,255,0.55) 60%, white 82%)",
						}}
					/>

					{/* Ghost word */}
					<span
						aria-hidden
						className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 select-none whitespace-nowrap font-black uppercase leading-none text-minuri-ocean"
						style={{
							fontSize: "clamp(6rem, 20vw, 18rem)",
							opacity: 0.04,
							letterSpacing: "-0.03em",
						}}
					>
						JOURNEY
					</span>

					{/* Floating sticky cards */}
					<div className="pointer-events-none absolute inset-0 overflow-hidden">
						{JOURNEY_STICKY_CARDS.map((card) => (
							<div
								key={card.id}
								className="absolute"
								style={{
									left: card.left,
									right: card.right,
									top: card.top,
								}}
							>
								<motion.div
									className="guide-sticky flex flex-col gap-1.5"
									style={{
										rotate: card.rotate,
										backgroundColor: card.bg,
										width: "18rem",
										padding: "1.25rem 1.5rem",
									}}
									animate={{ y: [0, -8, 0] }}
									transition={{
										duration: 3.4,
										ease: "easeInOut",
										repeat: Infinity,
									}}
								>
									<p
										className="text-[10px] font-black uppercase tracking-[0.16em]"
										style={{ color: "rgba(2,18,20,0.45)" }}
									>
										{card.topic}
									</p>
									<p
										className="text-base font-black leading-snug"
										style={{ color: "#05292a" }}
									>
										{card.title}
									</p>
									<p
										className="text-xs leading-snug"
										style={{ color: "rgba(2,18,20,0.65)" }}
									>
										{card.note}
									</p>
								</motion.div>
							</div>
						))}
					</div>

					{/* Centered content */}
					<motion.div
						className="relative z-10 flex flex-col items-center text-center"
						initial={{ opacity: 0, y: 24 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, ease: easeOut }}
					>
						<h2 className="max-w-4xl text-4xl font-black uppercase leading-tight tracking-tight text-minuri-teal md:text-6xl">
							Your personal starter kit
						</h2>

						<p className="mt-6 max-w-2xl text-base leading-relaxed text-minuri-ocean md:text-lg">
							A curated 7-day plan — guides + nearby services —
							built around your moment, your suburb, and what you
							still need to sort.
						</p>

						<div className="group relative mt-10 inline-flex overflow-hidden rounded-sm">
							<button
								type="button"
								onClick={() => setStage("form")}
								className="relative z-10 inline-flex h-16 items-center rounded-sm border border-minuri-ocean/70 px-14 text-lg font-semibold text-minuri-ocean transition-colors duration-300 group-hover:text-minuri-white hover:cursor-pointer"
							>
								Build my plan
							</button>
							<span className="absolute inset-0 translate-y-full bg-minuri-teal transition-transform duration-[500ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
						</div>
					</motion.div>
				</motion.section>
			) : stage === "loading" ? (
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
					<div className="w-full max-w-4xl">
						{/* Spinner + heading */}
						<div className="text-center">
							<motion.span
								className="mx-auto block text-5xl"
								animate={{
									scale: [1, 1.15, 1],
									rotate: [0, 5, -5, 0],
								}}
								transition={{
									duration: 2.4,
									repeat: Infinity,
									ease: "easeInOut",
								}}
							>
								🌱
							</motion.span>
							<p className="mt-6 text-2xl font-bold text-minuri-ocean md:text-3xl">
								Reading your story...
							</p>
							<p className="mt-3 text-sm text-minuri-slate">
								Crafting your Melbourne identity for{" "}
								<span className="font-semibold text-minuri-teal">
									{selectedSuburb?.locality}
								</span>
							</p>
						</div>

						{/* Guide thumbnail grid */}
						{(() => {
							const previewGuides = GUIDES.filter(
								(g) =>
									g.isPublished &&
									(selectedTopics.length === 0 ||
										selectedTopics.includes(g.topic)),
							).slice(0, 8);
							return (
								<div className="mt-10 grid grid-cols-4 gap-3">
									{previewGuides.map((guide, i) => (
										<motion.div
											key={guide.slug}
											initial={{
												opacity: 0,
												y: prefersReducedMotion
													? 0
													: 14,
											}}
											animate={{ opacity: 1, y: 0 }}
											transition={{
												duration: prefersReducedMotion
													? 0.01
													: 0.32,
												delay: prefersReducedMotion
													? 0
													: 0.25 + i * 0.07,
												ease: [0.22, 1, 0.36, 1],
											}}
											className="overflow-hidden rounded-2xl bg-minuri-fog"
										>
											<div className="relative aspect-[4/3] w-full">
												<Image
													src={guide.thumbnailUrl}
													alt={guide.title}
													fill
													className="object-cover"
													sizes="(max-width: 640px) 40vw, 200px"
												/>
											</div>
											<p className="line-clamp-2 px-2.5 py-2 text-[11px] font-medium leading-snug text-minuri-ocean">
												{guide.title}
											</p>
										</motion.div>
									))}
								</div>
							);
						})()}
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
					{/* Notebook red margin line */}
					<div
						aria-hidden
						className="pointer-events-none absolute inset-y-0"
						style={{
							left: "clamp(2.5rem, 7vw, 6rem)",
							width: "2px",
							background: "oklch(0.68 0.13 15 / 0.2)",
						}}
					/>

					{/* How it works — sticky note pinned to right */}
					<div className="pointer-events-none absolute right-16 top-44 hidden w-72 select-none xl:block min-[1500px]:right-20 2xl:right-24 2xl:w-80">
						<div className="guide-sticky guide-sticky-a">
							<p
								className="text-xs font-black uppercase tracking-[0.16em]"
								style={{ color: "rgba(2,18,20,0.45)" }}
							>
								How it works
							</p>
							<ol className="mt-3 space-y-4">
								{HOW_IT_WORKS_STEPS.map((step, index) => (
									<li
										key={step.title}
										className="flex items-start gap-2.5"
									>
										<span
											className="flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
											style={{
												background: "rgba(2,18,20,0.1)",
												color: "#05292a",
											}}
										>
											{index + 1}
										</span>
										<div>
											<p
												className="text-xs font-bold leading-snug"
												style={{ color: "#05292a" }}
											>
												{step.title}
											</p>
											<p
												className="mt-1 text-[11px] leading-snug"
												style={{
													color: "rgba(2,18,20,0.55)",
												}}
											>
												{step.body}
											</p>
										</div>
									</li>
								))}
							</ol>
						</div>
					</div>
					<div
						className="max-w-4xl min-[1500px]:max-w-5xl pl-0 pr-6 py-8 md:py-10 xl:mr-[5%]"
						style={{
							marginLeft:
								"max(1.5rem, calc(clamp(2.5rem, 7vw, 6rem) + 48px))",
						}}
					>
						<motion.div
							className="flex flex-col"
							initial={{
								opacity: 0,
								y: prefersReducedMotion ? 0 : 20,
							}}
							animate={{ opacity: 1, y: 0 }}
							transition={revealTransition}
						>
							{/* ── Header ── */}
							<div className="flex items-center">
								<button
									type="button"
									onClick={() => setStage("intro")}
									className="inline-flex items-center gap-2 rounded-sm border border-minuri-ocean/20 bg-minuri-white/80 px-6 py-2 text-base font-semibold text-minuri-ocean shadow-xs backdrop-blur-sm transition-colors duration-200 hover:bg-minuri-ocean hover:text-minuri-white"
								>
									<ArrowLeft
										className="size-3.5"
										aria-hidden
									/>
									Back
								</button>
							</div>

							{/* ── Page intro ── */}
							<div className="pt-5 pb-4">
								<p className="text-xs font-semibold uppercase tracking-[0.14em] text-minuri-teal">
									Your guide journey
								</p>
								<h1 className="mt-3 text-2xl font-black leading-tight text-minuri-ocean md:text-3xl min-[1500px]:text-4xl">
									Where are you and what do you need?
								</h1>
								<p className="mt-3 text-base leading-relaxed text-minuri-slate md:text-lg min-[1500px]:text-xl">
									Tell us what&apos;s going on. We&apos;ll
									build a personalised week plan around your
									situation.
								</p>
							</div>

							{/* ── Form sections ── */}
							<div>
								<motion.div
									className="space-y-12"
									initial={{
										opacity: 0,
										y: prefersReducedMotion ? 0 : 20,
									}}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{
										once: true,
										margin: "-8% 0px -6% 0px",
									}}
									transition={{
										...revealTransition,
										delay: prefersReducedMotion ? 0 : 0.06,
									}}
								>
									{/* ── Your moment ── */}
									<div>
										<div className="mb-4 flex items-center gap-3">
											<span
												className={cn(
													"flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-black transition-all duration-300",
													yourMoment.length >=
														MIN_MOMENT_LENGTH
														? "bg-minuri-teal text-white shadow-[0_2px_8px_-2px_rgba(61,191,184,0.5)]"
														: "border-2 border-minuri-teal/50 text-minuri-teal",
												)}
											>
												{yourMoment.length >=
												MIN_MOMENT_LENGTH ? (
													<Check
														className="size-3.5"
														strokeWidth={3}
													/>
												) : (
													"1"
												)}
											</span>
											<div>
												<p className="text-base font-bold text-minuri-ocean">
													Your moment
												</p>
												<p className="text-xs text-minuri-slate">
													Pick a preset that sounds
													like you, or write your own
												</p>
											</div>
										</div>

										{/* Preset cards */}
										<div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
											{MOMENT_PRESETS.map((preset) => {
												const isActive =
													selectedPreset ===
													preset.id;
												return (
													<motion.button
														key={preset.id}
														type="button"
														onClick={() =>
															handleSelectPreset(
																preset,
															)
														}
														whileHover={
															prefersReducedMotion
																? undefined
																: { y: -2 }
														}
														whileTap={
															prefersReducedMotion
																? undefined
																: {
																		scale: 0.98,
																	}
														}
														transition={{
															duration: 0.15,
														}}
														className={cn(
															"relative flex gap-3.5 rounded-2xl border p-4 text-left transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-minuri-teal/60",
															isActive
																? "border-minuri-teal bg-minuri-mist/60 shadow-sm"
																: "border-minuri-silver/70 bg-minuri-white hover:border-minuri-teal/40 hover:bg-minuri-fog/60",
														)}
														aria-pressed={isActive}
													>
														<span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-white text-xl shadow-sm">
															{preset.icon}
														</span>
														<div className="min-w-0 pr-4">
															<p className="text-sm font-semibold text-minuri-ocean">
																{
																	preset.headline
																}
															</p>
															<p className="mt-0.5 line-clamp-2 text-base italic leading-relaxed text-minuri-slate">
																{preset.preview}
															</p>
														</div>
														<AnimatePresence>
															{isActive && (
																<motion.span
																	initial={{
																		opacity: 0,
																		scale: 0.5,
																	}}
																	animate={{
																		opacity: 1,
																		scale: 1,
																	}}
																	exit={{
																		opacity: 0,
																		scale: 0.5,
																	}}
																	transition={{
																		duration: 0.18,
																	}}
																	className="absolute right-3 top-3"
																>
																	<CheckCircle2 className="size-4 text-minuri-teal" />
																</motion.span>
															)}
														</AnimatePresence>
													</motion.button>
												);
											})}
										</div>

										{/* Write your own */}
										<button
											type="button"
											onClick={handleWriteOwn}
											className={cn(
												"mt-3 inline-flex items-center gap-1.5 text-xs transition-colors",
												showTextarea &&
													selectedPreset === null
													? "font-semibold text-minuri-teal"
													: "text-minuri-slate hover:text-minuri-teal",
											)}
										>
											<Pencil
												className="size-3"
												aria-hidden
											/>
											Something else? Write your own
										</button>

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
															backgroundColor:
																"var(--minuri-white)",
															backgroundImage:
																"repeating-linear-gradient(transparent, transparent 1.5rem, oklch(0.72 0.03 220 / 0.18) 1.5rem, oklch(0.72 0.03 220 / 0.18) calc(1.5rem + 1px))",
															lineHeight:
																"1.5rem",
															paddingTop:
																"0.6rem",
														}}
														className={cn(
															"w-full resize-none rounded-2xl border px-4 pb-3 text-sm outline-none transition",
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
												</motion.div>
											)}
										</AnimatePresence>
									</div>

									{/* ── Suburb ── */}
									<div>
										<div className="mb-4 flex items-center gap-3">
											<span
												className={cn(
													"flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-black transition-all duration-300",
													hasConfirmedSuburb
														? "bg-minuri-teal text-white shadow-[0_2px_8px_-2px_rgba(61,191,184,0.5)]"
														: "border-2 border-minuri-teal/50 text-minuri-teal",
												)}
											>
												{hasConfirmedSuburb ? (
													<Check
														className="size-3.5"
														strokeWidth={3}
													/>
												) : (
													"2"
												)}
											</span>
											<div>
												<label
													htmlFor="suburb-input"
													className="block cursor-pointer text-base font-bold text-minuri-ocean"
												>
													Your Melbourne suburb
												</label>
												<p className="text-xs text-minuri-slate">
													Type to search and confirm
													your suburb
												</p>
											</div>
										</div>
										<div className="relative mt-2.5">
											<Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-minuri-silver" />
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
													"h-12 w-full rounded-xl border pl-10 pr-3 text-sm outline-none transition",
													hasConfirmedSuburb
														? "cursor-not-allowed border-minuri-teal/60 bg-minuri-mist/30"
														: "border-minuri-silver bg-minuri-fog/30 focus:border-minuri-teal",
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
														setSuburbOptions([]);
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
												className="mt-2 max-h-64 overflow-y-auto rounded-xl border border-minuri-silver/40 bg-minuri-white shadow-sm"
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
																	"flex w-full items-start gap-2 px-3 py-2.5 text-left text-sm transition hover:bg-minuri-fog",
																	activeSuburbIndex ===
																		index
																		? "bg-minuri-teal/10 ring-1 ring-inset ring-minuri-teal/30"
																		: "",
																)}
															>
																<MapPin className="mt-0.5 size-3.5 shrink-0 text-minuri-teal" />
																<span>
																	<span className="font-medium text-minuri-mid">
																		{
																			option.locality
																		}
																	</span>
																	<span className="ml-1 text-minuri-slate">
																		{
																			option.state
																		}{" "}
																		{
																			option.postcode
																		}
																	</span>
																</span>
															</button>
														),
													)}
											</div>
										)}
									</div>

									{/* ── Topic cards ── */}
									<div>
										<div className="mb-4 flex items-center gap-3">
											<span
												className={cn(
													"flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-black transition-all duration-300",
													selectedTopics.length >= 1
														? "bg-minuri-teal text-white shadow-[0_2px_8px_-2px_rgba(61,191,184,0.5)]"
														: "border-2 border-minuri-teal/50 text-minuri-teal",
												)}
											>
												{selectedTopics.length >= 1 ? (
													<Check
														className="size-3.5"
														strokeWidth={3}
													/>
												) : (
													"3"
												)}
											</span>
											<div>
												<p className="text-base font-bold text-minuri-ocean">
													What matters most right now?
												</p>
												<p className="text-xs text-minuri-slate">
													Select at least one topic to
													focus your plan
												</p>
											</div>
										</div>
										<div
											className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5"
											role="group"
											aria-label="Topic selection"
										>
											{GUIDE_TOPICS.map((topic, i) => {
												const visual =
													TOPIC_VISUALS[topic.slug];
												const Icon = visual.icon;
												const isSelected =
													selectedTopics.includes(
														topic.slug,
													);
												const count =
													guideCounts.get(
														topic.slug,
													) ?? 0;
												return (
													<motion.button
														key={topic.slug}
														type="button"
														role="checkbox"
														aria-checked={
															isSelected
														}
														onClick={() =>
															toggleTopic(
																topic.slug,
															)
														}
														className={cn(
															"group relative flex min-h-[8rem] flex-col gap-2 rounded-2xl border p-4 text-left outline-none",
															"focus-visible:ring-2 focus-visible:ring-minuri-teal/50 focus-visible:ring-offset-2",
															isSelected
																? "shadow-[0_16px_32px_-12px_rgba(2,24,25,0.28)]"
																: "hover:shadow-sm",
														)}
														style={{
															backgroundColor:
																visual.heroBg,
															borderColor:
																visual.heroBg,
														}}
														initial={{
															opacity: 0,
															y: prefersReducedMotion
																? 0
																: 16,
														}}
														animate={{
															opacity: 1,
															y: 0,
															scale:
																isSelected &&
																!prefersReducedMotion
																	? 1.03
																	: 1,
														}}
														transition={{
															opacity: {
																duration: 0.4,
																delay: prefersReducedMotion
																	? 0
																	: i * 0.06,
																ease: [
																	0.22, 1,
																	0.36, 1,
																],
															},
															y: {
																duration: 0.4,
																delay: prefersReducedMotion
																	? 0
																	: i * 0.06,
																ease: [
																	0.22, 1,
																	0.36, 1,
																],
															},
															scale: {
																type: "spring",
																stiffness: 380,
																damping: 26,
															},
														}}
														whileHover={{
															scale: prefersReducedMotion
																? 1
																: isSelected
																	? 1.03
																	: 1.02,
														}}
														whileTap={{
															scale: prefersReducedMotion
																? 1
																: 0.97,
														}}
													>
														<div
															className={cn(
																"absolute right-2 top-2 flex size-5 items-center justify-center rounded-full border-2 transition-all duration-200",
																isSelected
																	? "border-[#05292a] bg-[#05292a]"
																	: "border-[#05292a]/30 bg-white/20",
															)}
															aria-hidden
														>
															{isSelected && (
																<Check
																	className="size-3 text-white"
																	strokeWidth={
																		3
																	}
																/>
															)}
														</div>
														<Icon
															className="size-8 shrink-0 text-[#05292a] transition-transform duration-200 group-hover:scale-110"
															aria-hidden
														/>
														<div className="flex-1">
															<h3 className="text-sm font-semibold leading-tight text-[#05292a]">
																{topic.name}
															</h3>
														</div>
														<span className="mt-auto text-xs font-semibold text-[#05292a]">
															{count}{" "}
															{count === 1
																? "guide"
																: "guides"}
														</span>
													</motion.button>
												);
											})}
										</div>
									</div>
								</motion.div>
							</div>

							{/* ── Footer submit ── */}
							<div className="relative mt-12 pt-8 text-center">
								{/* Scissors tear-off line */}
								<div
									aria-hidden
									className="pointer-events-none absolute inset-x-0 top-0 flex items-center"
								>
									<span
										className="pr-1.5 text-sm text-minuri-slate/40"
										style={{ background: "white" }}
									>
										✂
									</span>
									<div className="flex-1 border-t border-dashed border-minuri-slate/25" />
								</div>
								<p className="mb-6 text-sm text-minuri-slate">
									Ready to generate your personalised guide?
								</p>
								<button
									type="button"
									onClick={handleSubmit}
									disabled={!isFormValid}
									className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-minuri-teal px-12 py-4 text-base font-bold text-primary-foreground shadow-lg transition-transform duration-200 ease-out hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 md:w-auto"
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
							</div>
						</motion.div>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
