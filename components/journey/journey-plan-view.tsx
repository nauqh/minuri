"use client";

import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, useRef, useState, type RefObject } from "react";
import { useRouter } from "next/navigation";
import {
	CheckCircle2,
	ChevronRight,
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

import { GUIDES, type Guide, type GuideTopicSlug } from "@/content/guides";
import { cn } from "@/lib/utils";
import { getTopicMeta } from "@/lib/guides";
import { useJourneyState, LETTER_SEEN_KEY } from "@/hooks/use-journey-state";
import { useIdentityState } from "@/hooks/use-identity-state";
import { useGuideBookmarks } from "@/hooks/use-guide-bookmarks";
import { JourneyDayPlaces } from "@/components/journey/journey-day-places";
import { JourneyNearbyEvents } from "@/components/journey/journey-nearby-events";
import { buildWeekPlan, type DayPlan } from "@/lib/journey-week";
import { loadWeekPlan, resolveWeekPlan } from "@/lib/journey/week-plan-store";
import { IdentityCard } from "@/components/journey/identity-card";
import { CardEarnToast } from "@/components/journey/card-earn-toast";
import { MelbourneLetter } from "@/components/journey/melbourne-letter";

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

const GUIDE_LABEL: Record<GuideTopicSlug, string> = {
	"food-eating":      "Find your feed",
	"getting-around":   "Find your way",
	"health-wellbeing": "Look after yourself",
	"home-admin":       "Get settled",
	"social-belonging": "Meet your people",
};

const WHY_TODAY: Record<GuideTopicSlug, string> = {
	"food-eating":
		"Sorting food early means one less daily decision while you're still finding your feet.",
	"getting-around":
		"Getting mobile early opens up everything else — guides, places, people.",
	"health-wellbeing":
		"Registering a GP while you're well is much easier than waiting until you need one.",
	"home-admin":
		"Admin sorted early means you stop carrying it through the rest of the week.",
	"social-belonging":
		"One connection made now compounds over the weeks ahead.",
};

// ─── Letter Reveal ───────────────────────────────────────────────────────────

function LetterReveal({
	identity,
	suburb,
	onContinue,
}: {
	identity: import("@/lib/journey/identity").JourneyIdentity;
	suburb: string;
	onContinue: (seedIntent?: string) => void;
}) {
	const prefersReducedMotion = useReducedMotion();
	const [leaving, setLeaving] = useState(false);
	const [letterDone, setLetterDone] = useState(false);
	const [showLetter, setShowLetter] = useState(false);

	const accent = identity.palette[0].hex;

	const SEED_OF: Record<string, string> = {
		"The First-Timer":       "New Beginnings",
		"The Far-From-Home":     "Belonging",
		"The Solo Arrival":      "Connection",
		"The Reluctant Grownup": "Becoming",
		"The Quiet Pioneer":     "Quiet Courage",
	};
	const seedOf = SEED_OF[identity.archetype] ?? "New Beginnings";

	const d = (ms: number) => (prefersReducedMotion ? 0 : ms / 1000);

	useEffect(() => {
		if (prefersReducedMotion) {
			setShowLetter(true);
			return;
		}
		const t = setTimeout(() => setShowLetter(true), 2200);
		return () => clearTimeout(t);
	}, [prefersReducedMotion]);

	async function handleContinue() {
		setLeaving(true);
		await new Promise<void>((r) => setTimeout(r, 450));
		onContinue();
	}

	return (
		<motion.div
			className="journey-notebook-bg relative flex h-screen flex-col overflow-hidden"
			initial={{ opacity: 0 }}
			animate={{ opacity: leaving ? 0 : 1, y: leaving ? -16 : 0 }}
			transition={{
				duration: leaving ? 0.4 : 0.5,
				ease: [0.22, 1, 0.36, 1],
			}}
		>
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

			{/* Soft radial fade at edges */}
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0"
				style={{
					background:
						"radial-gradient(ellipse 80% 70% at 50% 50%, transparent 30%, rgba(255,255,255,0.55) 60%, white 82%)",
				}}
			/>

			<div className="relative z-10 flex flex-1 flex-col items-center overflow-y-auto px-6 pt-[4rem] pb-10">
				<div className="w-full max-w-3xl">
					{/* Symbol */}
					<div className="mb-8 flex justify-center">
						<motion.div
							initial={{ scale: 0, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							transition={{
								duration: 0.7,
								delay: d(0),
								ease: [0.22, 1, 0.36, 1],
							}}
						>
							<motion.div
								animate={
									prefersReducedMotion
										? undefined
										: { scale: [1, 1.1, 1] }
								}
								transition={{
									duration: 3,
									repeat: Infinity,
									repeatDelay: 1,
									ease: "easeInOut",
								}}
								className="flex size-20 items-center justify-center rounded-full text-4xl"
								style={{
									backgroundColor: `${accent}28`,
									boxShadow: `0 0 32px ${accent}50`,
								}}
							>
								{identity.symbol}
							</motion.div>
						</motion.div>
					</div>

					{/* "A letter for you" */}
					<motion.p
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.5, delay: d(400) }}
						className="mb-3 text-center text-[11px] font-semibold uppercase tracking-[0.2em]"
						style={{ color: accent }}
					>
						A letter for you
					</motion.p>

					{/* Archetype */}
					<motion.h1
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{
							duration: 0.6,
							delay: d(600),
							ease: [0.22, 1, 0.36, 1],
						}}
						className="text-center text-3xl font-black text-minuri-ocean md:text-4xl"
					>
						{identity.archetype}
					</motion.h1>

					{/* Divider */}
					<motion.div
						initial={{ scaleX: 0, opacity: 0 }}
						animate={{ scaleX: 1, opacity: 1 }}
						transition={{
							duration: 0.55,
							delay: d(850),
							ease: [0.22, 1, 0.36, 1],
						}}
						className="mx-auto my-6 h-px w-20 origin-center"
						style={{ backgroundColor: accent }}
					/>

					{/* Letter — mounts after 2.2s so identity renders first */}
					<AnimatePresence>
						{showLetter && (
							<div className="mt-4 flex justify-center">
								<MelbourneLetter
									suburb={suburb}
									body={`${identity.letter.body}\n\nHere is your seed of ${seedOf}. Complete each day and watch it grow — finish all seven and see what you've built in ${suburb}.`}
									signOff={identity.letter.sign_off}
									skipStream={prefersReducedMotion ?? false}
									onComplete={() => setLetterDone(true)}
									paragraphClassName="text-xl leading-[3rem] tracking-wide text-minuri-ocean min-[1500px]:text-2xl"
									className="max-w-3xl"
								/>
							</div>
						)}
					</AnimatePresence>

					{/* Sticky note + CTA — appear after letter finishes */}
					<AnimatePresence>
						{letterDone && (
							<motion.div
								initial={{ opacity: 0, y: 16 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
								className="-mt-4 flex flex-col items-center gap-8"
							>
								{/* Sticky note */}
								<div
									className="relative flex flex-col items-center px-4 py-5 w-72"
									style={{
										backgroundColor: "#FFFDE7",
										transform: "rotate(-1.5deg)",
										boxShadow: "2px 6px 24px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.06)",
									}}
								>
									{/* Tape strip */}
									<div
										className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-12 h-7 rounded-sm"
										style={{ backgroundColor: `${accent}40` }}
									/>

									{/* Title */}
									<span
										className="text-base font-semibold tracking-wide pt-1 text-minuri-ocean"
									>
										Seed of <span style={{ color: accent, fontFamily: "var(--font-handwriting, serif)" }} className="font-bold text-3xl">{seedOf}</span>
									</span>

									{/* Seed SVG */}
									<motion.svg
										width="200"
										height="200"
										viewBox="0 0 90 90"
										aria-label="A seed, not yet grown"
										animate={prefersReducedMotion ? undefined : { scale: [1, 1.06, 1] }}
										transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
									>
										<ellipse cx="45" cy="78" rx="26" ry="7" fill={accent} opacity="0.12" />
										<ellipse cx="45" cy="46" rx="15" ry="22" fill={accent} opacity="0.9" transform="rotate(-10 45 46)" />
										<path d="M 43 27 Q 47 46 43 65" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.22" transform="rotate(-10 45 46)" />
										<ellipse cx="38" cy="35" rx="4" ry="7" fill="white" opacity="0.2" transform="rotate(-10 38 35)" />
									</motion.svg>
								</div>

								{/* CTA */}
								<button
									type="button"
									onClick={handleContinue}
									className="group inline-flex items-center gap-3 rounded-xl px-16 py-5 text-lg font-bold text-white transition-all duration-200 hover:scale-[1.03] active:scale-95"
									style={{ backgroundColor: accent }}
								>
									Begin my week
									<ChevronRight
										className="size-4 transition-transform duration-200 group-hover:translate-x-1"
										aria-hidden
									/>
								</button>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</div>
		</motion.div>
	);
}

function LetterOverlay({
	identity,
	suburb,
	onClose,
}: {
	identity: import("@/lib/journey/identity").JourneyIdentity;
	suburb: string;
	onClose: () => void;
}) {
	const prefersReducedMotion = useReducedMotion();
	const accent = identity.palette[0].hex;

	useEffect(() => {
		const prevBody = document.body.style.overflow;
		const prevHtml = document.documentElement.style.overflow;
		document.body.style.overflow = "hidden";
		document.documentElement.style.overflow = "hidden";
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", onKey);
		return () => {
			document.body.style.overflow = prevBody;
			document.documentElement.style.overflow = prevHtml;
			window.removeEventListener("keydown", onKey);
		};
	}, [onClose]);

	return (
		<motion.div
			className="journey-notebook-bg fixed inset-0 z-50 flex flex-col overflow-hidden"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{
				duration: prefersReducedMotion ? 0 : 0.35,
				ease: [0.22, 1, 0.36, 1],
			}}
		>
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
			{/* Soft radial fade */}
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0"
				style={{
					background:
						"radial-gradient(ellipse 80% 70% at 50% 50%, transparent 30%, rgba(255,255,255,0.55) 60%, white 82%)",
				}}
			/>
			{/* Close button */}
			<div className="relative z-10 flex shrink-0 justify-end px-6 pt-5">
				<button
					type="button"
					onClick={onClose}
					className="flex items-center gap-2 rounded-full bg-minuri-ocean px-4 py-2 text-sm font-semibold text-white shadow-md transition-opacity hover:opacity-90"
					aria-label="Close letter"
				>
					<X className="size-4" aria-hidden />
					Close
				</button>
			</div>
			<div className="relative z-10 flex flex-1 flex-col items-center overflow-y-auto px-6 pb-10">
				<div className="w-full max-w-3xl">
					<div className="mb-8 flex justify-center">
						<div
							className="flex size-20 items-center justify-center rounded-full text-4xl"
							style={{
								backgroundColor: `${accent}28`,
								boxShadow: `0 0 32px ${accent}50`,
							}}
						>
							{identity.symbol}
						</div>
					</div>
					<p
						className="mb-3 text-center text-[11px] font-semibold uppercase tracking-[0.2em]"
						style={{ color: accent }}
					>
						A letter for you
					</p>
					<h2 className="text-center text-3xl font-black text-minuri-ocean md:text-4xl">
						{identity.archetype}
					</h2>
					<div
						className="mx-auto my-6 h-px w-20"
						style={{ backgroundColor: accent }}
					/>
					<div className="flex justify-center">
						<MelbourneLetter
							suburb={suburb}
							body={identity.letter.body}
							signOff={identity.letter.sign_off}
							skipStream
							onComplete={() => {}}
							paragraphClassName="text-xl leading-[3rem] tracking-wide text-minuri-slate min-[1500px]:text-2xl"
							className="max-w-3xl"
						/>
					</div>
					<div className="mt-6 text-center">
						<p className="text-base italic text-minuri-slate">
							&ldquo;{identity.mantra}&rdquo;
						</p>
					</div>
				</div>
			</div>
		</motion.div>
	);
}

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
									isDone || isActive
										? "text-white"
										: "bg-minuri-fog text-minuri-slate",
								)}
								style={
									isDone || isActive
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
					animate={{ height: open ? 220 : 96 }}
					transition={{ duration, ease }}
					className="relative w-36 shrink-0 overflow-hidden rounded-xl bg-minuri-fog sm:w-40"
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
					initial={{ minHeight: 96 }}
					animate={{ minHeight: open ? 220 : 96 }}
					transition={{ duration, ease }}
				>
					<button
						type="button"
						onClick={onToggle}
						className="flex w-full items-start justify-between gap-2 text-left"
						aria-expanded={open}
						data-no-scale
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
									href={`/guides/${guide.slug}?suburb=${encodeURIComponent(suburb)}&from=journey`}
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

// ─── Plan Sidebar ─────────────────────────────────────────────────────────────

function PlanSidebar({
	identity,
	cardState,
	weekPlan,
	activeDay,
	completedTasks,
	suburb,
	plantRef,
	highlightPlant = 0,
}: {
	identity: import("@/lib/journey/identity").JourneyIdentity;
	cardState: import("@/lib/journey/identity").IdentityCardState;
	weekPlan: DayPlan[];
	activeDay: number;
	completedTasks: Set<string>;
	suburb: string;
	plantRef?: RefObject<HTMLDivElement | null>;
	highlightPlant?: number;
}) {
	const { bookmarks } = useGuideBookmarks();
	const savedGuides = bookmarks
		.map((slug) => GUIDES.find((g) => g.slug === slug))
		.filter((g): g is Guide => Boolean(g));

	const dayPlan = weekPlan.find((d) => d.day === activeDay);
	const taskTotal = dayPlan?.tasks.length ?? 0;
	const taskDone =
		taskTotal > 0
			? dayPlan!.tasks.filter((_, i) =>
					completedTasks.has(`${activeDay}-${i}`),
				).length
			: 0;
	const accent = identity.palette[0].hex;
	const [cardFlipped, setCardFlipped] = useState(false);

	return (
		<div className="space-y-6">
			{/* Identity card section */}
			<div ref={plantRef}>
				{/* Section heading */}
				<div className="mb-4 flex items-center gap-2.5">
					<div className="h-7 w-1 rounded-full bg-minuri-teal" aria-hidden />
					<p className="text-xl font-black text-minuri-ocean">Your identity card</p>
				</div>

				<IdentityCard
					identity={identity}
					cardState={cardState}
					plantDelay={0}
					highlight={highlightPlant}
					onFlipChange={setCardFlipped}
				/>

				{/* Symbol + growth status — hidden when card is flipped */}
				{!cardFlipped && (
					<div className="mt-4 flex items-center gap-3">
						<div
							className="flex size-12 shrink-0 items-center justify-center rounded-full text-2xl"
							style={{ backgroundColor: `${accent}22` }}
						>
							{identity.symbol}
						</div>
						<div className="flex-1 min-w-0">
							<p className="text-base font-black text-minuri-ocean">
								{cardState.daysCompleted.length} of {weekPlan.length} days grown
							</p>
							{taskTotal > 0 && (
								<p className="text-xs text-minuri-slate mt-0.5">
									{taskDone}/{taskTotal} tasks
								</p>
							)}
							<div className="mt-2 flex gap-1">
								{weekPlan.map((day) => {
									const grown = cardState.daysCompleted.includes(day.day);
									const isToday = day.day === activeDay;
									return (
										<div
											key={day.day}
											className="h-1.5 flex-1 rounded-full transition-all duration-300"
											style={{
												backgroundColor: accent,
												opacity: grown ? 1 : isToday ? 0.35 : 0.12,
											}}
										/>
									);
								})}
							</div>
						</div>
					</div>
				)}
			</div>

			{/* Saved guides */}
			{savedGuides.length > 0 && (
				<div>
					<div className="mb-3 flex items-center gap-2.5">
						<div className="h-7 w-1 rounded-full bg-minuri-teal" aria-hidden />
						<p className="text-xl font-black text-minuri-ocean">Saved guides</p>
					</div>
					<div className="space-y-2">
						{savedGuides.map((guide) => {
							const topicMeta = getTopicMeta(guide.topic);
							return (
								<Link
									key={guide.slug}
									href={`/guides/${guide.slug}?suburb=${encodeURIComponent(suburb)}&from=journey`}
									className="flex items-start gap-3 rounded-xl border border-minuri-silver/40 px-3 py-2.5 transition-colors hover:bg-minuri-fog"
								>
									<div className="min-w-0 flex-1">
										<p className="text-sm font-medium leading-snug text-minuri-ocean">
											{guide.title}
										</p>
										<p className="mt-0.5 text-[11px] text-minuri-slate">
											{topicMeta?.name} · {guide.readingTimeMin} min
										</p>
									</div>
								</Link>
							);
						})}
					</div>
				</div>
			)}
		</div>
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
	const [openGuides, setOpenGuides] = useState<Set<string>>(
		() => new Set(plan.guides[0] ? [plan.guides[0].slug] : []),
	);

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
			<div className="mb-6">
				{/* Badges row */}
				<div className="mb-3 flex items-center gap-2">
					<span className="rounded-full border border-minuri-silver/60 px-3 py-1 text-xs font-semibold text-minuri-slate">
						Day {plan.day}
					</span>
					<span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold", colors.iconBg, colors.text)}>
						<Icon className="size-3" aria-hidden />
						{plan.theme}
					</span>
				</div>

				{/* Narrative as headline */}
				<p className="text-base leading-relaxed text-minuri-ocean">
					{plan.narrative}
				</p>

				{WHY_TODAY[plan.topicSlug] && (
					<p className="mt-3 text-sm italic text-minuri-slate">
						{WHY_TODAY[plan.topicSlug]}
					</p>
				)}
			</div>

			{/* Vibe-accent section divider */}
			<div
				className="mb-6 h-0.5 rounded-full"
				style={{ backgroundColor: "var(--vibe-accent)" }}
			/>

			{/* Guides + Tasks — stacked on mobile, side by side on md+ */}
			<div className="mb-8 flex flex-col gap-6 md:flex-row md:gap-8 items-start">
				{/* Guides accordion */}
				<div className="flex-1 min-w-0">
					<div className="mb-3 flex items-center gap-2.5">
						<div
							className="h-7 w-1 rounded-full bg-minuri-teal"
							aria-hidden
						/>
						<p className="text-xl font-black md:text-2xl text-minuri-ocean">
							{GUIDE_LABEL[plan.topicSlug]}
						</p>
					</div>
					<div>
						{plan.guides.map((guide, index) => (
							<GuideAccordionRow
								key={guide.slug}
								guide={guide}
								suburb={suburb}
								open={openGuides.has(guide.slug)}
								onToggle={() => toggleGuide(guide.slug)}
							/>
						))}
					</div>
				</div>

				{/* Task list — flat, no outer border box */}
				{plan.tasks.length > 0 && (
					<div className="w-full md:w-72 md:shrink-0">
						<p
							className="mb-1 text-[11px] font-semibold uppercase tracking-[0.12em]"
							style={{ color: "var(--vibe-accent)" }}
						>
							Your tasks today
						</p>
						<p className="mb-3 text-xs text-minuri-slate">Tick each one to complete the day.</p>
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
	const {
		identity,
		cardState,
		earnDay,
		saveSeedIntent,
		hydrated: identityHydrated,
	} = useIdentityState();
	const prefersReducedMotion = useReducedMotion();
	const scrollRef = useRef<HTMLDivElement>(null);
	const earnedDaysRef = useRef<Set<number>>(new Set());

	const [activeDay, setActiveDay] = useState(1);
	const [letterOverlayOpen, setLetterOverlayOpen] = useState(false);
	const [planStage, setPlanStage] = useState<"letter" | "plan">("letter");

	useEffect(() => {
		if (
			typeof window !== "undefined" &&
			localStorage.getItem(LETTER_SEEN_KEY) === "1"
		) {
			setPlanStage("plan");
		}
	}, []);
	const [toastDay, setToastDay] = useState<number | null>(null);
	const [toastVisible, setToastVisible] = useState(false);
	const [hasCardNotif, setHasCardNotif] = useState(false);
	const [highlightPlant, setHighlightPlant] = useState(0);
	const plantRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!identity) return;
		const color = identity.palette[0].hex;
		document.documentElement.style.setProperty("--vibe-accent", color);
	}, [identity]);

	useEffect(() => {
		if (!hydrated || !journeyState) return;
		if (!identity || !cardState) return;

		// Seed earnedDaysRef from already-earned days so we don't re-fire
		for (const d of cardState.daysCompleted) {
			earnedDaysRef.current.add(d);
		}
	}, [identityHydrated, identity, cardState, hydrated, journeyState]);

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

	const { suburb, selectedTopics, yourMoment } = journeyState;

	if (planStage === "letter" && identity) {
		return (
			<LetterReveal
				identity={identity}
				suburb={suburb}
				onContinue={(seedIntent) => {
					try {
						localStorage.setItem(LETTER_SEEN_KEY, "1");
					} catch {
						/* ignore */
					}
					if (seedIntent) saveSeedIntent(seedIntent);
					setPlanStage("plan");
				}}
			/>
		);
	}
	const weekPlan = (() => {
		const stored = loadWeekPlan();
		if (stored) return resolveWeekPlan(stored);
		return buildWeekPlan(selectedTopics, yourMoment);
	})();
	const currentDay = weekPlan.find((d) => d.day === activeDay) ?? weekPlan[0];

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

	function handleToggleTask(key: string) {
		toggleTaskComplete(key);

		// Check day completion after toggle (optimistic: assume the toggle succeeds)
		const [dayStr] = key.split("-");
		const day = parseInt(dayStr, 10);
		const plan = weekPlan.find((p) => p.day === day);
		if (!plan || !identity || !cardState) return;

		// Build the next completed set
		const nextCompleted = new Set(completedTasks);
		if (nextCompleted.has(key)) nextCompleted.delete(key);
		else nextCompleted.add(key);

		const dayNowDone =
			plan.tasks.length > 0 &&
			plan.tasks.every((_, i) => nextCompleted.has(`${plan.day}-${i}`));

		if (dayNowDone && !earnedDaysRef.current.has(day)) {
			earnedDaysRef.current.add(day);
			earnDay(day, plan.memoryLine);
			setToastDay(day);
			setToastVisible(true);
			setHasCardNotif(true);
		}
	}

	const prevDay = weekPlan.find((d) => d.day === activeDay - 1);
	const nextDay = weekPlan.find((d) => d.day === activeDay + 1);

	return (
		<>
			{/* Letter overlay */}
			<AnimatePresence>
				{letterOverlayOpen && identity && (
					<LetterOverlay
						key="letter-overlay"
						identity={identity}
						suburb={suburb}
						onClose={() => setLetterOverlayOpen(false)}
					/>
				)}
			</AnimatePresence>

			{toastDay !== null && (
				<CardEarnToast
					day={toastDay}
					visible={toastVisible}
					onDone={() => setToastVisible(false)}
					onHighlight={() => {
						plantRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
						setHighlightPlant((n) => n + 1);
					}}
				/>
			)}

			<motion.div
				className="min-h-screen overflow-x-clip bg-minuri-white text-minuri-ink min-[1500px]:origin-top min-[1500px]:scale-[1.18]"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
			>
				{/* Header */}
				<header className="px-6 py-4">
					<div className="mx-auto flex max-w-screen-xl items-center justify-between">
						<Link
							href="/"
							className="inline-flex items-center gap-2 rounded-full border border-minuri-silver/80 px-4 py-2 text-sm font-medium text-minuri-slate transition-colors hover:border-minuri-teal/50 hover:text-minuri-teal"
						>
							<Home className="size-3.5" aria-hidden />
							Home
						</Link>
						<button
							type="button"
							onClick={handleStartOver}
							className="inline-flex items-center gap-2 rounded-full border border-minuri-silver/80 px-4 py-2 text-sm font-medium text-minuri-slate transition-colors hover:border-minuri-teal/50 hover:text-minuri-teal"
						>
							<RotateCcw className="size-3.5" aria-hidden />
							Start over
						</button>
					</div>
				</header>

				<main className="mx-auto max-w-screen-xl px-6 py-10 md:py-12">
					{/* Hero — full width */}
					<motion.div
						initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 18 }}
						className="mb-10"
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, margin: "-10% 0px -8% 0px" }}
						transition={revealTransition}
					>
						<h1 className="text-4xl font-black leading-tight text-minuri-ocean md:text-5xl">
							Your first week in{" "}
							<span className="inline-flex rounded-sm px-2 py-1 font-bold text-5xl md:text-6xl text-minuri-ocean" style={{ backgroundColor: "color-mix(in srgb, var(--vibe-accent) 18%, transparent)", fontFamily: "var(--font-handwriting, serif)" }}>
								{suburb}
							</span>
						</h1>
						{identity?.letter?.body && (
							<button
								type="button"
								onClick={() => setLetterOverlayOpen(true)}
								className="mt-4 text-sm font-medium text-minuri-teal hover:underline"
							>
								Read your letter →
							</button>
						)}
					</motion.div>

					{/* Day stepper — full width */}
					<div ref={scrollRef} className="mb-8">
						<DayStepperNav
							weekPlan={weekPlan}
							activeDay={activeDay}
							completedTasks={completedTasks}
							onSelect={selectDay}
						/>
					</div>

					{/* Split: day content + sidebar */}
					<div className="flex gap-10 items-start">
						{/* ── Left: day content ── */}
						<div className="min-w-0 flex-1">
							<AnimatePresence mode="wait">
								{currentDay && (
									<DayContent
										key={currentDay.day}
										plan={currentDay}
										suburb={suburb}
										completedTasks={completedTasks}
										toggleTaskComplete={handleToggleTask}
									/>
								)}
							</AnimatePresence>

							{/* Prev / next */}
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
						</div>

						{/* ── Right: sticky sidebar ── */}
						{identity && cardState && (
							<aside className="hidden lg:block w-80 shrink-0 sticky top-6">
								<PlanSidebar
									identity={identity}
									cardState={cardState}
									weekPlan={weekPlan}
									activeDay={activeDay}
									completedTasks={completedTasks}
									suburb={suburb}
									plantRef={plantRef}
									highlightPlant={highlightPlant}
								/>
							</aside>
						)}
					</div>

					{/* Places to go — full width */}
					{currentDay && (
						<div key={activeDay} className="mt-10">
							<JourneyDayPlaces
								suburb={suburb}
								topicSlug={currentDay.topicSlug}
							/>
						</div>
					)}

					{/* Community near you — full width */}
					<div className="mt-12">
						<JourneyNearbyEvents suburb={suburb} />
					</div>
				</main>
			</motion.div>
		</>
	);
}
