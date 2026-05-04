"use client";

import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
	CalendarDays,
	CheckCircle2,
	ChevronDown,
	Compass,
	HeartPulse,
	Home,
	RotateCcw,
	Sandwich,
	Square,
	Users,
	X,
	type LucideIcon,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import type { Guide, GuideTopicSlug } from "@/content/guides";
import { cn } from "@/lib/utils";
import { useJourneyState } from "@/hooks/use-journey-state";
import { JourneyDayPlaces } from "@/components/journey/journey-day-places";
import { buildWeekPlan, type DayPlan } from "@/lib/journey-week";
import { getVibe, DEFAULT_VIBE_ID, type Vibe } from "@/lib/vibes";
import { LANDING_KEYS } from "@/components/landing/landing-local-state";

const TOPIC_ICONS: Record<GuideTopicSlug, LucideIcon> = {
	"food-eating": Sandwich,
	"getting-around": Compass,
	"health-wellbeing": HeartPulse,
	"home-admin": Home,
	"social-belonging": Users,
};

const TOPIC_COLORS: Record<
	GuideTopicSlug,
	{ text: string; iconBg: string; divider: string }
> = {
	"food-eating": {
		text: "text-orange-700",
		iconBg: "bg-orange-100",
		divider: "bg-orange-300",
	},
	"getting-around": {
		text: "text-sky-700",
		iconBg: "bg-sky-100",
		divider: "bg-sky-300",
	},
	"health-wellbeing": {
		text: "text-emerald-700",
		iconBg: "bg-emerald-100",
		divider: "bg-emerald-300",
	},
	"home-admin": {
		text: "text-violet-700",
		iconBg: "bg-violet-100",
		divider: "bg-violet-300",
	},
	"social-belonging": {
		text: "text-rose-700",
		iconBg: "bg-rose-100",
		divider: "bg-rose-300",
	},
};

function isDayDone(plan: DayPlan, completedTasks: Set<string>) {
	return (
		plan.tasks.length > 0 &&
		plan.tasks.every((_, i) => completedTasks.has(`${plan.day}-${i}`))
	);
}

// ─── Day Stepper ─────────────────────────────────────────────────────────────

function DayStepperNav({
	weekPlan,
	activeDay,
	completedTasks,
	onSelect,
}: {
	weekPlan: DayPlan[];
	activeDay: number;
	completedTasks: Set<string>;
	onSelect: (day: number) => void;
}) {
	return (
		<div
			className="flex w-full items-start"
			role="tablist"
			aria-label="Week days"
		>
			{weekPlan.map((plan, idx) => {
				const isActive = plan.day === activeDay;
				const isDone = isDayDone(plan, completedTasks);
				return (
					<Fragment key={plan.day}>
						<button
							type="button"
							role="tab"
							aria-selected={isActive}
							onClick={() => onSelect(plan.day)}
							className="flex flex-col items-center gap-2 px-2 focus-visible:outline-none"
						>
							<span
								className={cn(
									"flex size-8 items-center justify-center rounded-full text-xs font-bold transition-all",
									isDone
										? "bg-minuri-teal text-white"
										: isActive
											? "text-white"
											: "bg-minuri-fog text-minuri-slate",
								)}
								style={
									isActive && !isDone
										? {
												backgroundColor:
													"var(--vibe-accent)",
											}
										: undefined
								}
							>
								{isDone ? (
									<CheckCircle2
										className="size-4"
										aria-hidden
									/>
								) : (
									plan.day
								)}
							</span>
							<span
								className={cn(
									"text-[10px] leading-tight",
									isActive
										? "font-semibold text-minuri-ocean"
										: "text-minuri-slate",
								)}
							>
								{plan.shortLabel}
							</span>
						</button>

						{idx < weekPlan.length - 1 && (
							<div className="mt-4 h-px flex-1 bg-minuri-silver/50" />
						)}
					</Fragment>
				);
			})}
		</div>
	);
}

// ─── Guide Accordion ─────────────────────────────────────────────────────────

function GuideAccordionRow({
	guide,
	suburb,
	open,
	onToggle,
}: {
	guide: Guide;
	suburb: string;
	open: boolean;
	onToggle: () => void;
}) {
	const prefersReducedMotion = useReducedMotion();
	const duration = prefersReducedMotion ? 0.01 : 0.35;
	const ease = [0.22, 1, 0.36, 1] as const;

	return (
		<div className="border-b border-minuri-silver/40 py-4 last:border-b-0">
			<div className="flex gap-4">
				{/* Left: fixed-width image — height grows with content */}
				<motion.div
					animate={{ height: open ? 180 : 76 }}
					transition={{ duration, ease }}
					className="relative w-28 shrink-0 overflow-hidden rounded-xl bg-minuri-fog sm:w-32"
				>
					{guide.thumbnailUrl && (
						<Image
							src={guide.thumbnailUrl}
							alt=""
							fill
							className="object-cover"
							sizes="128px"
						/>
					)}
				</motion.div>

				{/* Right: flex column — spreads content to fill image height */}
				<motion.div
					className="min-w-0 flex-1 flex flex-col"
					initial={{ minHeight: 76 }}
					animate={{ minHeight: open ? 180 : 76 }}
					transition={{ duration, ease }}
				>
					<button
						type="button"
						onClick={onToggle}
						className="flex w-full items-start justify-between gap-2 text-left"
						aria-expanded={open}
					>
						<div className="min-w-0">
							<span className="block text-base font-semibold leading-snug text-minuri-ocean">
								{guide.title}
							</span>
							<span className="mt-1 block text-[11px] text-minuri-slate">
								{guide.readingTimeMin} min read
							</span>
						</div>
						<ChevronDown
							className={cn(
								"mt-0.5 size-4 shrink-0 text-minuri-slate transition-transform duration-200",
								open && "rotate-180",
							)}
							aria-hidden
						/>
					</button>

					<AnimatePresence initial={false}>
						{open && (
							<motion.div
								key="body"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{
									duration: prefersReducedMotion ? 0.01 : 0.2,
									ease,
								}}
								className="flex flex-1 flex-col overflow-hidden"
							>
								<p className="mt-3 flex-1 text-sm leading-relaxed text-minuri-slate">
									{guide.summary}
								</p>
								<Link
									href={`/guides/${guide.arc}/${guide.slug}?suburb=${encodeURIComponent(suburb)}&from=journey`}
									className="mt-3 inline-flex text-sm font-medium text-minuri-teal hover:underline"
								>
									Read guide →
								</Link>
							</motion.div>
						)}
					</AnimatePresence>
				</motion.div>
			</div>
		</div>
	);
}

// ─── Week Drawer ──────────────────────────────────────────────────────────────

function WeekDrawer({
	open,
	weekPlan,
	activeDay,
	completedTasks,
	vibe,
	onSelectDay,
	onClose,
}: {
	open: boolean;
	weekPlan: DayPlan[];
	activeDay: number;
	completedTasks: Set<string>;
	vibe: Vibe;
	onSelectDay: (day: number) => void;
	onClose: () => void;
}) {
	const prefersReducedMotion = useReducedMotion();

	useEffect(() => {
		if (!open) return;
		function onKey(e: KeyboardEvent) {
			if (e.key === "Escape") onClose();
		}
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [open, onClose]);

	return (
		<AnimatePresence>
			{open && (
				<>
					<motion.div
						key="backdrop"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{
							duration: prefersReducedMotion ? 0.01 : 0.2,
						}}
						className="fixed inset-0 z-40 bg-black/30"
						onClick={onClose}
						aria-hidden
					/>

					<motion.div
						key="panel"
						initial={{ x: "100%" }}
						animate={{ x: 0 }}
						exit={{ x: "100%" }}
						transition={{
							duration: prefersReducedMotion ? 0.01 : 0.3,
							ease: [0.22, 1, 0.36, 1],
						}}
						className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-minuri-white shadow-2xl sm:max-w-md"
						role="dialog"
						aria-label="Your week"
					>
						<div className="flex items-center justify-between border-b border-minuri-silver/40 px-5 py-4">
							<p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-minuri-mid">
								Your week at a glance
							</p>
							<button
								type="button"
								onClick={onClose}
								className="rounded-lg p-1.5 text-minuri-slate transition-colors hover:text-minuri-ocean"
								aria-label="Close drawer"
							>
								<X className="size-4" />
							</button>
						</div>

						<ol className="px-3 py-3">
							{weekPlan.map((plan) => {
								const Icon = TOPIC_ICONS[plan.topicSlug];
								const colors = TOPIC_COLORS[plan.topicSlug];
								const isActive = plan.day === activeDay;
								const isDone = isDayDone(plan, completedTasks);
								return (
									<li key={plan.day}>
										<button
											type="button"
											onClick={() => {
												onSelectDay(plan.day);
												onClose();
											}}
											className={cn(
												"flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors",
												isActive
													? "bg-minuri-teal/10 text-minuri-ocean"
													: "text-minuri-slate hover:bg-minuri-silver/20",
											)}
										>
											<span
												className={cn(
													"flex size-6 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold",
													isDone
														? "bg-minuri-teal text-white"
														: isActive
															? "bg-minuri-teal text-white"
															: cn(
																	colors.iconBg,
																	colors.text,
																),
												)}
											>
												{isDone ? (
													<CheckCircle2
														className="size-3.5"
														aria-hidden
													/>
												) : (
													plan.day
												)}
											</span>
											<span className="min-w-0">
												<span
													className={cn(
														"block text-xs font-semibold",
														isDone || isActive
															? "text-minuri-teal"
															: "text-minuri-ocean",
													)}
												>
													{plan.theme}
												</span>
												<span className="block truncate text-[11px] text-minuri-slate">
													{plan.guides[0]?.title}
												</span>
											</span>
										</button>
									</li>
								);
							})}
						</ol>

						<div className="border-t border-minuri-silver/40 px-5 py-5">
							<p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-minuri-mid">
								Your vibe
							</p>
							<div className="mt-3 flex items-center gap-3">
								<span
									className="size-8 shrink-0 rounded-xl"
									style={{ backgroundColor: vibe.hex }}
								/>
								<div>
									<p className="text-sm font-bold text-minuri-ocean">
										{vibe.name}
									</p>
									<p className="font-mono text-[11px] text-minuri-slate">
										{vibe.hex}
									</p>
								</div>
							</div>
							<p className="mt-3 text-xs leading-relaxed text-minuri-slate">
								{vibe.traits}
							</p>
						</div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
}

// ─── Day Content ──────────────────────────────────────────────────────────────

function DayContent({
	plan,
	suburb,
	completedTasks,
	toggleTaskComplete,
}: {
	plan: DayPlan;
	suburb: string;
	completedTasks: Set<string>;
	toggleTaskComplete: (key: string) => void;
}) {
	const prefersReducedMotion = useReducedMotion();
	const colors = TOPIC_COLORS[plan.topicSlug];
	const Icon = TOPIC_ICONS[plan.topicSlug];
	const [openGuides, setOpenGuides] = useState<Set<string>>(new Set());

	function toggleGuide(slug: string) {
		setOpenGuides((prev) => {
			const next = new Set(prev);
			if (next.has(slug)) next.delete(slug);
			else next.add(slug);
			return next;
		});
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 12 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -8 }}
			transition={{
				duration: prefersReducedMotion ? 0.01 : 0.28,
				ease: [0.22, 1, 0.36, 1],
			}}
		>
			{/* Day header */}
			<div className="mb-6 flex items-start gap-4">
				<div
					className={cn(
						"flex size-12 shrink-0 items-center justify-center rounded-2xl",
						colors.iconBg,
					)}
				>
					<Icon className={cn("size-5", colors.text)} aria-hidden />
				</div>
				<div>
					<p
						className={cn(
							"text-xs font-semibold uppercase tracking-[0.13em]",
							colors.text,
						)}
					>
						Day {plan.day} · {plan.theme}
					</p>
					<p className="mt-1.5 text-base leading-relaxed text-minuri-slate md:text-[1.06rem] md:leading-8">
						{plan.narrative}
					</p>
				</div>
			</div>

			{/* Vibe-accent section divider */}
			<div
				className="mb-6 h-0.5 rounded-full"
				style={{ backgroundColor: "var(--vibe-accent)" }}
			/>

			{/* Guides + Tasks — side by side */}
			<div className="mb-8 flex gap-8 items-start">
				{/* Guides accordion */}
				<div className="flex-1 min-w-0">
					<p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-minuri-mid">
						Guides
					</p>
					<div>
						{plan.guides.map((guide, index) => (
							<GuideAccordionRow
								key={guide.slug}
								guide={guide}
								suburb={suburb}
								open={
									index === 0 || openGuides.has(guide.slug)
								}
								onToggle={() => {
									if (index === 0) return;
									toggleGuide(guide.slug);
								}}
							/>
						))}
					</div>
				</div>

				{/* Task list — flat, no outer border box */}
				{plan.tasks.length > 0 && (
					<div className="w-72 shrink-0">
						<p
							className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em]"
							style={{ color: "var(--vibe-accent)" }}
						>
							Your tasks today
						</p>
						<div className="divide-y divide-minuri-silver/40">
							{plan.tasks.map((task, i) => {
								const key = `${plan.day}-${i}`;
								const done = completedTasks.has(key);
								return (
									<button
										key={key}
										type="button"
										onClick={() => toggleTaskComplete(key)}
										className="flex w-full items-start gap-3 py-3.5 text-left transition-colors hover:bg-minuri-fog/50"
										aria-pressed={done}
									>
										{done ? (
											<CheckCircle2
												className="mt-0.5 size-4.5 shrink-0 text-minuri-teal"
												aria-hidden
											/>
										) : (
											<Square
												className="mt-0.5 size-4.5 shrink-0 text-minuri-silver"
												aria-hidden
											/>
										)}
										<span
											className={cn(
												"text-sm leading-relaxed",
												done
													? "text-minuri-teal line-through"
													: "text-minuri-ocean",
											)}
										>
											{task}
										</span>
									</button>
								);
							})}
						</div>
					</div>
				)}
			</div>
			{/* end flex row */}

			<JourneyDayPlaces suburb={suburb} topicSlug={plan.topicSlug} />
		</motion.div>
	);
}

// ─── Main View ────────────────────────────────────────────────────────────────

export function JourneyPlanView() {
	const router = useRouter();
	const {
		journeyState,
		hydrated,
		clearJourney,
		completedTasks,
		toggleTaskComplete,
	} = useJourneyState();
	const prefersReducedMotion = useReducedMotion();
	const scrollRef = useRef<HTMLDivElement>(null);

	const [activeDay, setActiveDay] = useState(1);
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [vibe, setVibe] = useState<Vibe>(() => getVibe(DEFAULT_VIBE_ID));

	useEffect(() => {
		const stored =
			typeof window !== "undefined"
				? (window.localStorage.getItem(LANDING_KEYS.vibe) ??
					DEFAULT_VIBE_ID)
				: DEFAULT_VIBE_ID;
		setVibe(getVibe(stored));
	}, []);

	const revealTransition = {
		duration: prefersReducedMotion ? 0.01 : 0.45,
		ease: [0.22, 1, 0.36, 1] as const,
	};

	useEffect(() => {
		if (!hydrated) return;
		if (!journeyState) router.replace("/journey");
	}, [hydrated, journeyState, router]);

	if (!hydrated || !journeyState) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-minuri-white">
				<div className="size-8 animate-spin rounded-full border-2 border-minuri-silver border-t-minuri-teal" />
			</div>
		);
	}

	const {
		suburb,
		selectedTopics,
		yourMoment,
		alreadySorted = [],
	} = journeyState;
	const weekPlan = buildWeekPlan(selectedTopics, yourMoment, alreadySorted);
	const currentDay = weekPlan.find((d) => d.day === activeDay) ?? weekPlan[0];

	const truncatedMoment =
		yourMoment.length > 120
			? yourMoment.slice(0, 117).trimEnd() + "..."
			: yourMoment;

	function selectDay(day: number) {
		setActiveDay(day);
		scrollRef.current?.scrollIntoView({
			behavior: "smooth",
			block: "start",
		});
	}

	function handleStartOver() {
		clearJourney();
		router.push("/journey");
	}

	const prevDay = weekPlan.find((d) => d.day === activeDay - 1);
	const nextDay = weekPlan.find((d) => d.day === activeDay + 1);

	return (
		<div className="min-h-screen overflow-x-hidden bg-minuri-white text-minuri-ink min-[1500px]:origin-top min-[1500px]:scale-[1.18]">
			<WeekDrawer
				open={drawerOpen}
				weekPlan={weekPlan}
				activeDay={activeDay}
				completedTasks={completedTasks}
				vibe={vibe}
				onSelectDay={selectDay}
				onClose={() => setDrawerOpen(false)}
			/>

			{/* Header */}
			<header className="px-6 py-4 md:px-10">
				<div className="mx-auto flex max-w-screen-xl items-center justify-between">
					<Link
						href="/"
						className="text-2xl font-black uppercase tracking-tight text-minuri-ocean"
					>
						Minuri
					</Link>
					<div className="flex items-center gap-2">
						<button
							type="button"
							onClick={() => setDrawerOpen((o) => !o)}
							className="inline-flex items-center gap-2 rounded-full border border-minuri-silver/80 px-4 py-2 text-sm font-medium text-minuri-slate transition-colors hover:border-minuri-teal/50 hover:text-minuri-teal"
						>
							{drawerOpen ? (
								<X className="size-3.5" aria-hidden />
							) : (
								<CalendarDays
									className="size-3.5"
									aria-hidden
								/>
							)}
							{drawerOpen ? "Close" : "Week"}
						</button>
						<button
							type="button"
							onClick={handleStartOver}
							className="inline-flex items-center gap-2 rounded-full border border-minuri-silver/80 px-4 py-2 text-sm font-medium text-minuri-slate transition-colors hover:border-minuri-teal/50 hover:text-minuri-teal"
						>
							<RotateCcw className="size-3.5" aria-hidden />
							Start over
						</button>
					</div>
				</div>
			</header>

			<main className="mx-auto max-w-screen-xl px-6 py-10 md:px-10 md:py-12">
				{/* Hero */}
				<motion.div
					initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 18 }}
					className="mb-10"
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: "-10% 0px -8% 0px" }}
					transition={revealTransition}
				>
					<p className="text-xs font-semibold uppercase tracking-[0.14em] text-minuri-teal">
						Your guide journey
					</p>
					<h1 className="mt-2 text-4xl font-black leading-tight text-minuri-ocean md:text-5xl">
						Your first week in{" "}
						<span style={{ color: "var(--vibe-accent)" }}>
							{suburb}
						</span>
					</h1>

					{truncatedMoment && (
						<motion.div
							initial={{
								opacity: 0,
								y: prefersReducedMotion ? 0 : 6,
							}}
							animate={{ opacity: 1, y: 0 }}
							transition={{
								duration: prefersReducedMotion ? 0.01 : 0.4,
								delay: 0.1,
							}}
							className="mt-4 py-2 pl-4"
							style={{
								borderLeftWidth: "3px",
								borderLeftStyle: "solid",
								borderLeftColor: "var(--vibe-accent)",
							}}
						>
							<p className="text-sm italic leading-relaxed text-minuri-slate">
								{truncatedMoment}
							</p>
						</motion.div>
					)}

					<p className="mt-4 text-sm text-minuri-slate">
						One guide per day. One task to do. Places to go near{" "}
						{suburb} — all in one place.
					</p>
				</motion.div>

				{/* Day stepper */}
				<div ref={scrollRef} className="mb-8">
					<DayStepperNav
						weekPlan={weekPlan}
						activeDay={activeDay}
						completedTasks={completedTasks}
						onSelect={selectDay}
					/>
				</div>

				{/* Day content — no outer card wrapper */}
				<AnimatePresence mode="wait">
					{currentDay && (
						<DayContent
							key={currentDay.day}
							plan={currentDay}
							suburb={suburb}
							completedTasks={completedTasks}
							toggleTaskComplete={toggleTaskComplete}
						/>
					)}
				</AnimatePresence>

				{/* Prev / next — plain text links */}
				<div className="mt-10 flex items-center justify-between border-t border-minuri-silver/40 pt-6">
					{prevDay ? (
						<button
							type="button"
							onClick={() => selectDay(prevDay.day)}
							className="text-sm text-minuri-slate transition-colors hover:text-minuri-ocean"
						>
							← Day {prevDay.day} · {prevDay.shortLabel}
						</button>
					) : (
						<span />
					)}
					{nextDay ? (
						<button
							type="button"
							onClick={() => selectDay(nextDay.day)}
							className="text-sm text-minuri-slate transition-colors hover:text-minuri-ocean"
						>
							Day {nextDay.day} · {nextDay.shortLabel} →
						</button>
					) : (
						<span />
					)}
				</div>
			</main>
		</div>
	);
}
