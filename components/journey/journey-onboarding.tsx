"use client";

import { useCallback, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
	ArrowLeft,
	Check,
	CheckCircle2,
	ChevronRight,
	Loader2,
	MapPin,
	Pencil,
	Search,
} from "lucide-react";
import {
	AnimatePresence,
	LayoutGroup,
	motion,
	useReducedMotion,
} from "motion/react";

import Image from "next/image";
import { GUIDES, GUIDE_TOPICS, type GuideTopicSlug } from "@/content/guides";
import { normalizeSuburbName, type SuburbOption } from "@/lib/suburbs";
import { cn } from "@/lib/utils";
import { useJourneyState } from "@/hooks/use-journey-state";
import { ALREADY_SORTED_ITEMS } from "@/lib/journey-week";

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
		icon: "✈️",
		headline: "New to Australia",
		preview:
			"I'm navigating a new country — I don't fully understand Medicare, banking, or how things work here yet.",
		fullText:
			"I'm an international student who's just arrived in Australia and I'm still figuring out how things work here. I need to understand Medicare, how banking works, and how to navigate public transport — so I can focus on my studies.",
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
		body: "Pick what sounds like you — or write your own. The more specific you are, the more useful your plan.",
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
	const [alreadySorted, setAlreadySorted] = useState<string[]>([]);
	const [stage, setStage] = useState<"form" | "loading">("form");
	const [showSidebar, setShowSidebar] = useState(true);

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

	function toggleAlreadySorted(id: string) {
		setAlreadySorted((prev) =>
			prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
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

	const showMomentPrompt =
		yourMoment.length > 0 && yourMoment.length < MIN_MOMENT_LENGTH;

	function handleSubmit() {
		if (!isFormValid || !selectedSuburb) return;
		saveJourney({
			yourMoment,
			suburb: selectedSuburb.locality,
			selectedTopics,
			alreadySorted,
		});
		setStage("loading");
		setTimeout(() => {
			router.push("/journey/plan");
		}, 2200);
	}

	const revealTransition = {
		duration: prefersReducedMotion ? 0.01 : 0.45,
		ease: [0.22, 1, 0.36, 1] as const,
	};

	const layoutTransition = {
		duration: prefersReducedMotion ? 0.01 : 0.2,
		ease: [0.22, 1, 0.36, 1] as const,
	};

	return (
		<AnimatePresence mode="wait">
			{stage === "loading" ? (
				<motion.div
					key="loading"
					className="flex min-h-screen flex-col items-center justify-center bg-minuri-white px-6 py-16"
					initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.97 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{
						duration: prefersReducedMotion ? 0.01 : 0.35,
						ease: [0.22, 1, 0.36, 1],
					}}
				>
					<div className="w-full max-w-2xl">
						{/* Spinner + heading */}
						<div className="text-center">
							<Loader2 className="mx-auto size-10 animate-spin text-minuri-teal" />
							<p className="mt-6 text-2xl font-bold text-minuri-ocean md:text-3xl">
								Putting together your Melbourne starter kit...
							</p>
							<p className="mt-3 text-sm text-minuri-slate">
								Personalising your guide path for{" "}
								{selectedSuburb?.locality}
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
											initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 14 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{
												duration: prefersReducedMotion ? 0.01 : 0.32,
												delay: prefersReducedMotion ? 0 : 0.25 + i * 0.07,
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
					className="h-screen overflow-hidden bg-minuri-white text-minuri-ink min-[1500px]:origin-top min-[1500px]:scale-[1.18]"
					exit={{
						opacity: 0,
						transition: {
							duration: prefersReducedMotion ? 0.01 : 0.15,
						},
					}}
				>
					<div className="mx-auto h-full max-w-screen-xl px-6 py-8 md:px-10 md:py-10">
						<LayoutGroup>
							<div
								className={cn(
									"h-full flex",
									showSidebar
										? "gap-8 lg:gap-10"
										: "lg:justify-center",
								)}
							>
								{/* ── Form ── */}
								<motion.div
									layout
									className={cn(
										"min-h-0 flex flex-col",
										showSidebar
											? "flex-1 min-w-0"
											: "w-full lg:max-w-2xl",
									)}
									initial={{
										opacity: 0,
										y: prefersReducedMotion ? 0 : 20,
									}}
									animate={{ opacity: 1, y: 0 }}
									transition={{
										...revealTransition,
										layout: layoutTransition,
									}}
								>
									<div className="flex items-center justify-between">
										<button
											type="button"
											onClick={() => router.push("/")}
											className="inline-flex items-center gap-2 rounded-full border border-minuri-silver/80 bg-minuri-white px-3.5 py-1.5 text-xs font-medium text-minuri-slate transition-transform duration-200 ease-out hover:scale-105"
										>
											<ArrowLeft
												className="size-3.5"
												aria-hidden
											/>
											Back to home
										</button>
										<button
											type="button"
											onClick={() =>
												setShowSidebar((v) => !v)
											}
											className="hidden lg:inline-flex items-center gap-1.5 rounded-full border border-minuri-silver/80 bg-minuri-white px-3.5 py-1.5 text-xs font-medium text-minuri-slate transition-[transform,color,border-color] duration-200 ease-out hover:scale-105 hover:border-minuri-teal/45 hover:text-minuri-teal"
										>
											<span className="overflow-hidden">
												<AnimatePresence
													mode="wait"
													initial={false}
												>
													<motion.span
														key={
															showSidebar
																? "hide"
																: "show"
														}
														initial={{
															opacity: 0,
															y: prefersReducedMotion
																? 0
																: 6,
														}}
														animate={{
															opacity: 1,
															y: 0,
														}}
														exit={{
															opacity: 0,
															y: prefersReducedMotion
																? 0
																: -6,
														}}
														transition={{
															duration:
																prefersReducedMotion
																	? 0.01
																	: 0.14,
															ease: "easeOut",
														}}
														className="block"
													>
														{showSidebar
															? "Hide guide"
															: "How it works"}
													</motion.span>
												</AnimatePresence>
											</span>
										</button>
									</div>
									<div className="pt-5 pb-4 pr-4 md:pr-6 shrink-0">
										<p className="text-xs font-semibold uppercase tracking-[0.14em] text-minuri-teal">
											Your guide journey
										</p>
										<h1 className="mt-3 text-3xl font-black leading-tight text-minuri-ocean md:text-4xl">
											Where are you and what do you need?
										</h1>
										<p className="mt-3 text-base leading-relaxed text-minuri-slate md:text-lg">
											Tell us what&apos;s going on.
											We&apos;ll build a personalised week
											plan around your situation.
										</p>
									</div>

									<div className="flex-1 overflow-y-auto pr-4 md:pr-6">
										<motion.div
											className="mt-10 space-y-10"
											initial={{
												opacity: 0,
												y: prefersReducedMotion
													? 0
													: 20,
											}}
											whileInView={{ opacity: 1, y: 0 }}
											viewport={{
												once: true,
												margin: "-8% 0px -6% 0px",
											}}
											transition={{
												...revealTransition,
												delay: prefersReducedMotion
													? 0
													: 0.06,
											}}
										>
											{/* ── Your moment ── */}
											<div>
												<p className="text-sm font-semibold text-minuri-ocean">
													Your moment
													<span className="ml-1.5 text-xs font-normal text-minuri-slate">
														— pick what sounds like
														you
													</span>
												</p>

												{/* Preset cards */}
												<div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
													{MOMENT_PRESETS.map(
														(preset) => {
															const isActive =
																selectedPreset ===
																preset.id;
															return (
																<motion.button
																	key={
																		preset.id
																	}
																	type="button"
																	onClick={() =>
																		handleSelectPreset(
																			preset,
																		)
																	}
																	whileHover={
																		prefersReducedMotion
																			? undefined
																			: {
																					y: -2,
																				}
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
																	aria-pressed={
																		isActive
																	}
																>
																	<span
																		className={cn(
																			"flex size-11 shrink-0 items-center justify-center rounded-xl text-xl transition-colors duration-200",
																			isActive
																				? "bg-minuri-teal/15"
																				: "bg-minuri-fog",
																		)}
																	>
																		{
																			preset.icon
																		}
																	</span>
																	<div className="min-w-0 pr-4">
																		<p className="text-sm font-semibold text-minuri-ocean">
																			{
																				preset.headline
																			}
																		</p>
																		<p className="mt-0.5 line-clamp-2 text-xs italic leading-relaxed text-minuri-slate">
																			{
																				preset.preview
																			}
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
														},
													)}
												</div>

												{/* Write your own */}
												<button
													type="button"
													onClick={handleWriteOwn}
													className={cn(
														"mt-3 inline-flex items-center gap-1.5 text-xs transition-colors",
														showTextarea &&
															selectedPreset ===
																null
															? "font-semibold text-minuri-teal"
															: "text-minuri-slate hover:text-minuri-teal",
													)}
												>
													<Pencil
														className="size-3"
														aria-hidden
													/>
													Something else? Write your
													own
												</button>

												{/* Textarea — reveals after preset select or write own */}
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
																	0.22, 1,
																	0.36, 1,
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
																{selectedPreset !==
																null
																	? "Edit this to match your situation"
																	: "Describe your situation in your own words"}
															</p>
															<textarea
																id="your-moment"
																value={
																	yourMoment
																}
																onChange={(
																	e,
																) => {
																	setYourMoment(
																		e.target
																			.value,
																	);
																}}
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
																className={cn(
																	"w-full resize-none rounded-2xl border bg-minuri-white px-4 py-3 text-sm leading-relaxed outline-none transition",
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
																		A little
																		more
																		detail
																		helps us
																		personalise
																		your
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
												<label
													htmlFor="suburb-input"
													className="block text-sm font-semibold text-minuri-ocean"
												>
													Where are you settling in?
													<span className="ml-1.5 text-xs font-normal text-minuri-slate">
														— Melbourne suburb
													</span>
												</label>
												<div className="relative mt-2.5">
													<Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-minuri-silver" />
													<input
														id="suburb-input"
														value={suburbQuery}
														disabled={
															hasConfirmedSuburb
														}
														onChange={(e) =>
															handleSuburbChange(
																e.target.value,
															)
														}
														onKeyDown={(e) => {
															if (
																e.key ===
																"ArrowDown"
															) {
																e.preventDefault();
																setActiveSuburbIndex(
																	(prev) =>
																		Math.min(
																			prev +
																				1,
																			suburbOptions.length -
																				1,
																		),
																);
															}
															if (
																e.key ===
																"ArrowUp"
															) {
																e.preventDefault();
																setActiveSuburbIndex(
																	(prev) =>
																		Math.max(
																			prev -
																				1,
																			0,
																		),
																);
															}
															if (
																e.key ===
																"Escape"
															)
																setActiveSuburbIndex(
																	-1,
																);
															if (
																e.key ===
																	"Enter" &&
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
															suburbOptions.length >
																0
														}
														aria-controls={
															listboxId
														}
														aria-activedescendant={
															activeSuburbIndex >=
															0
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
															{
																selectedSuburb?.locality
															}
														</span>
														<button
															type="button"
															onClick={() => {
																setSelectedSuburb(
																	null,
																);
																setSuburbQuery(
																	"",
																);
																setSuburbOptions(
																	[],
																);
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
																Loading
																suburbs...
															</div>
														)}
														{!suburbLoading &&
															suburbError && (
																<div className="px-3 py-3 text-sm text-rose-700">
																	{
																		suburbError
																	}
																</div>
															)}
														{!suburbLoading &&
															!suburbError &&
															suburbOptions.length ===
																0 &&
															normalizedQuery.length >=
																3 && (
																<div className="px-3 py-3 text-sm text-minuri-slate">
																	No matching
																	suburb
																	found.
																</div>
															)}
														{!suburbLoading &&
															!suburbError &&
															suburbOptions.map(
																(
																	option,
																	index,
																) => (
																	<button
																		key={
																			option.id
																		}
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

											{/* ── Already sorted checklist ── */}
											<div>
												<p className="text-sm font-semibold text-minuri-ocean">
													Already sorted?
													<span className="ml-1.5 text-xs font-normal text-minuri-slate">
														— we&apos;ll skip what
														you&apos;ve done
													</span>
												</p>
												<div className="mt-3 flex flex-wrap gap-2">
													{ALREADY_SORTED_ITEMS.map(
														(item) => {
															const checked =
																alreadySorted.includes(
																	item.id,
																);
															return (
																<button
																	key={
																		item.id
																	}
																	type="button"
																	role="checkbox"
																	aria-checked={
																		checked
																	}
																	onClick={() =>
																		toggleAlreadySorted(
																			item.id,
																		)
																	}
																	className={cn(
																		"inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-minuri-teal/60",
																		checked
																			? "border-minuri-teal bg-minuri-mist/60 text-minuri-teal"
																			: "border-minuri-silver bg-minuri-white text-minuri-slate hover:border-minuri-teal/40 hover:text-minuri-ocean",
																	)}
																>
																	{checked && (
																		<Check
																			className="size-3.5"
																			aria-hidden
																		/>
																	)}
																	{item.label}
																</button>
															);
														},
													)}
												</div>
											</div>

											{/* ── Topic chips ── */}
											<div>
												<p className="text-sm font-semibold text-minuri-ocean">
													What matters most right now?
													<span className="ml-1.5 text-xs font-normal text-minuri-slate">
														— select at least one
													</span>
												</p>
												<div
													className="mt-3 flex flex-wrap gap-2.5"
													role="group"
													aria-label="Topic selection"
												>
													{GUIDE_TOPICS.map(
														(topic) => {
															const isSelected =
																selectedTopics.includes(
																	topic.slug,
																);
															return (
																<button
																	key={
																		topic.slug
																	}
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
																		"rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-minuri-teal/60",
																		isSelected
																			? "border-minuri-teal bg-minuri-teal text-primary-foreground"
																			: "border-minuri-silver bg-minuri-white text-minuri-ocean hover:border-minuri-teal/50 hover:bg-minuri-fog",
																	)}
																>
																	{topic.name}
																</button>
															);
														},
													)}
												</div>
											</div>

											{/* ── Submit (mobile) ── */}
											<div className="pt-2 lg:hidden">
												<button
													type="button"
													onClick={handleSubmit}
													disabled={!isFormValid}
													className="group inline-flex h-12 items-center gap-2 rounded-full bg-minuri-teal px-8 text-base font-semibold text-primary-foreground transition-transform duration-200 ease-out hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
												>
													Continue to my guide journey
													<ChevronRight
														className="size-4 transition-transform duration-200 group-hover:translate-x-1"
														aria-hidden
													/>
												</button>
											</div>
										</motion.div>
									</div>
								</motion.div>

								{/* ── How this works sidebar (desktop only) ── */}
								<AnimatePresence mode="popLayout">
									{showSidebar && (
										<motion.aside
											key="sidebar"
											aria-label="How this works"
											className="hidden lg:flex lg:w-56 xl:w-64 shrink-0 flex-col gap-4"
											initial={{
												opacity: 0,
												x: prefersReducedMotion ? 0 : 32,
											}}
											animate={{ opacity: 1, x: 0 }}
											exit={{
												opacity: 0,
												x: prefersReducedMotion ? 0 : 32,
											}}
											transition={{
												...layoutTransition,
												delay: !prefersReducedMotion ? 0.06 : 0,
											}}
										>
											<div className="sticky top-8 flex flex-col gap-5 rounded-2xl border border-minuri-silver/50 bg-minuri-fog/30 px-5 py-6">
												<p className="text-[10px] font-bold uppercase tracking-widest text-minuri-mid">
													How it works
												</p>
												<ol className="space-y-5">
													{HOW_IT_WORKS_STEPS.map(
														(step, index) => (
															<li
																key={step.title}
																className="flex gap-3"
															>
																<span className="mt-px flex size-5 shrink-0 items-center justify-center rounded-full bg-minuri-teal/10 text-[10px] font-bold text-minuri-teal">
																	{index + 1}
																</span>
																<div>
																	<p className="text-xs font-semibold leading-snug text-minuri-ocean">
																		{step.title}
																	</p>
																	<p className="mt-1 text-xs leading-relaxed text-minuri-slate">
																		{step.body}
																	</p>
																</div>
															</li>
														),
													)}
												</ol>
												<div className="border-t border-minuri-silver/50 pt-4">
													<button
														type="button"
														onClick={handleSubmit}
														disabled={!isFormValid}
														className="group inline-flex h-10 w-full items-center justify-center gap-2 rounded-full bg-minuri-teal px-5 text-sm font-semibold text-primary-foreground transition-transform duration-200 ease-out hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
													>
														Continue
														<ChevronRight
															className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
															aria-hidden
														/>
													</button>
												</div>
											</div>
										</motion.aside>
									)}
								</AnimatePresence>
							</div>
						</LayoutGroup>
					</div>
			</motion.div>
			)}
		</AnimatePresence>
	);
}
