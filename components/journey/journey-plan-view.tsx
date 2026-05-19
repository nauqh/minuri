"use client";

import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, useRef, useState } from "react";
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

const WHY_TODAY: Record<GuideTopicSlug, string> = {
	"food-eating": "Sorting food early means one less daily decision while you're still finding your feet.",
	"getting-around": "Getting mobile early opens up everything else — guides, places, people.",
	"health-wellbeing": "Registering a GP while you're well is much easier than waiting until you need one.",
	"home-admin": "Admin sorted early means you stop carrying it through the rest of the week.",
	"social-belonging": "One connection made now compounds over the weeks ahead.",
};

// ─── Letter Reveal ───────────────────────────────────────────────────────────

function LetterReveal({
	identity,
	suburb,
	onContinue,
}: {
	identity: import("@/lib/journey/identity").JourneyIdentity;
	suburb: string;
	onContinue: () => void;
}) {
	const prefersReducedMotion = useReducedMotion();
	const [leaving, setLeaving] = useState(false);
	const [letterDone, setLetterDone] = useState(false);
	const [showLetter, setShowLetter] = useState(false);

	const accent = identity.palette[0].hex;

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
			transition={{ duration: leaving ? 0.4 : 0.5, ease: [0.22, 1, 0.36, 1] }}
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
						transition={{ duration: 0.7, delay: d(0), ease: [0.22, 1, 0.36, 1] }}
					>
						<motion.div
							animate={prefersReducedMotion ? undefined : { scale: [1, 1.1, 1] }}
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
					transition={{ duration: 0.6, delay: d(600), ease: [0.22, 1, 0.36, 1] }}
					className="text-center text-3xl font-black text-minuri-ocean md:text-4xl"
				>
					{identity.archetype}
				</motion.h1>

				{/* Divider */}
				<motion.div
					initial={{ scaleX: 0, opacity: 0 }}
					animate={{ scaleX: 1, opacity: 1 }}
					transition={{ duration: 0.55, delay: d(850), ease: [0.22, 1, 0.36, 1] }}
					className="mx-auto my-6 h-px w-20 origin-center"
					style={{ backgroundColor: accent }}
				/>

				{/* Letter — mounts after 2.2s so identity renders first */}
				<AnimatePresence>
					{showLetter && (
						<div className="mt-4 flex justify-center">
							<MelbourneLetter
								suburb={suburb}
								body={identity.letter.body}
								signOff={identity.letter.sign_off}
								skipStream={prefersReducedMotion ?? false}
								onComplete={() => setLetterDone(true)}
								paragraphClassName="text-xl leading-[3rem] tracking-wide text-minuri-slate min-[1500px]:text-2xl"
								className="max-w-3xl"
							/>
						</div>
					)}
				</AnimatePresence>

				{/* Mantra + CTA — appear after letter finishes */}
				<AnimatePresence>
					{letterDone && (
						<>
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.5, delay: 0.3 }}
								className="mt-6 text-center"
							>
								<p className="text-base italic text-minuri-slate">
									&ldquo;{identity.mantra}&rdquo;
								</p>
							</motion.div>

							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
								className="mt-10 flex justify-center"
							>
								<button
									type="button"
									onClick={handleContinue}
									className="group inline-flex items-center gap-2.5 rounded-xl px-12 py-4 text-base font-bold text-white transition-all duration-200 hover:scale-[1.03] active:scale-95"
									style={{ backgroundColor: accent }}
								>
									Begin my week
									<ChevronRight
										className="size-4 transition-transform duration-200 group-hover:translate-x-1"
										aria-hidden
									/>
								</button>
							</motion.div>
						</>
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
		const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
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
			transition={{ duration: prefersReducedMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
		>
			{/* Notebook red margin line */}
			<div
				aria-hidden
				className="pointer-events-none absolute inset-y-0"
				style={{ left: "clamp(3rem, 8vw, 7rem)", width: "2px", background: "oklch(0.68 0.13 15 / 0.22)" }}
			/>
			{/* Soft radial fade */}
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0"
				style={{ background: "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 30%, rgba(255,255,255,0.55) 60%, white 82%)" }}
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
							style={{ backgroundColor: `${accent}28`, boxShadow: `0 0 32px ${accent}50` }}
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
					<div className="mx-auto my-6 h-px w-20" style={{ backgroundColor: accent }} />
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
						<p className="text-base italic text-minuri-slate">&ldquo;{identity.mantra}&rdquo;</p>
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
										? { backgroundColor: "var(--vibe-accent)" }
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
}: {
	identity: import("@/lib/journey/identity").JourneyIdentity;
	cardState: import("@/lib/journey/identity").IdentityCardState;
	weekPlan: DayPlan[];
	activeDay: number;
	completedTasks: Set<string>;
	suburb: string;
}) {
	const { bookmarks } = useGuideBookmarks();
	const savedGuides = bookmarks
		.map((slug) => GUIDES.find((g) => g.slug === slug))
		.filter((g): g is Guide => Boolean(g));

	const dayPlan = weekPlan.find((d) => d.day === activeDay);
	const taskTotal = dayPlan?.tasks.length ?? 0;
	const taskDone =
		taskTotal > 0
			? dayPlan!.tasks.filter((_, i) => completedTasks.has(`${activeDay}-${i}`)).length
			: 0;
	const allDone = taskTotal > 0 && taskDone === taskTotal;
	const accent = identity.palette[0].hex;

	return (
		<div className="divide-y divide-minuri-silver/40 overflow-hidden rounded-2xl">
			{/* Plant hero */}
			<div className="px-5 pb-5 pt-4">
				<div className="flex items-center gap-4">
					<div
						className="flex size-14 shrink-0 items-center justify-center rounded-full text-3xl"
						style={{ backgroundColor: `${accent}22` }}
					>
						{identity.symbol}
					</div>
					<div className="flex-1 min-w-0">
						<p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-minuri-slate/50">Your plant</p>
						<p className="text-xl font-black text-minuri-ocean">
							{cardState.daysCompleted.length} of {weekPlan.length} days grown
						</p>
						<div className="mt-2 flex gap-1">
							{weekPlan.map((day) => {
								const grown = cardState.daysCompleted.includes(day.day);
								const isToday = day.day === activeDay;
								return (
									<div
										key={day.day}
										className="h-1.5 flex-1 rounded-full transition-all duration-300"
										style={{ backgroundColor: accent, opacity: grown ? 1 : isToday ? 0.35 : 0.12 }}
									/>
								);
							})}
						</div>
					</div>
				</div>
				{taskTotal > 0 && (
					<div className="mt-4 flex items-center justify-between gap-3 rounded-md bg-minuri-fog/70 px-3 py-2.5">
						<p className="text-xs text-minuri-slate">
							<span className="font-semibold text-minuri-ocean">Day {activeDay}</span>
							{" · "}
							{allDone ? (
								<span className="font-semibold text-minuri-teal">All done ✓</span>
							) : (
								<>{taskDone}/{taskTotal} tasks done</>
							)}
						</p>
						{!allDone && (
							<div className="h-1 w-16 overflow-hidden rounded-full bg-minuri-ocean/10">
								<div
									className="h-full rounded-full transition-all duration-500"
									style={{ width: `${Math.round((taskDone / taskTotal) * 100)}%`, backgroundColor: accent }}
								/>
							</div>
						)}
					</div>
				)}
				<p className="mt-3 text-[11px] leading-relaxed text-minuri-slate/55">
					Tick every task on a day → day complete → your plant grows.
				</p>
			</div>

			{/* Identity card */}
			<div className="px-5 pb-5 pt-4">
				<div className="mb-3 flex items-center gap-2.5">
					<div className="h-5 w-1 rounded-full bg-minuri-teal" aria-hidden />
					<p className="text-xl font-black text-minuri-ocean">Your identity card</p>
				</div>
				<IdentityCard identity={identity} cardState={cardState} plantDelay={0} />
			</div>

			{/* Saved guides */}
			{savedGuides.length > 0 && (
				<div className="px-5 pb-6 pt-4">
					<div className="mb-3 flex items-center gap-2.5">
						<div className="h-5 w-1 rounded-full bg-minuri-teal" aria-hidden />
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
										<p className="text-sm font-medium leading-snug text-minuri-ocean">{guide.title}</p>
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
					{WHY_TODAY[plan.topicSlug] && (
						<p className="mt-2 text-xs italic text-minuri-slate/60">
							{WHY_TODAY[plan.topicSlug]}
						</p>
					)}
				</div>
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
						<div className="h-7 w-1 rounded-full bg-minuri-teal" aria-hidden />
						<p className="text-xl font-black md:text-2xl text-minuri-ocean">Guides</p>
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
	const { identity, cardState, earnDay, hydrated: identityHydrated } = useIdentityState();
	const prefersReducedMotion = useReducedMotion();
	const scrollRef = useRef<HTMLDivElement>(null);
	const earnedDaysRef = useRef<Set<number>>(new Set());

	const [activeDay, setActiveDay] = useState(1);
	const [letterOverlayOpen, setLetterOverlayOpen] = useState(false);
	const [planStage, setPlanStage] = useState<"letter" | "plan">("letter");

	useEffect(() => {
		if (typeof window !== "undefined" && localStorage.getItem(LETTER_SEEN_KEY) === "1") {
			setPlanStage("plan");
		}
	}, []);
	const [toastDay, setToastDay] = useState<number | null>(null);
	const [toastVisible, setToastVisible] = useState(false);
	const [hasCardNotif, setHasCardNotif] = useState(false);

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
				onContinue={() => {
					try { localStorage.setItem(LETTER_SEEN_KEY, "1"); } catch { /* ignore */ }
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
				/>
			)}

		<motion.div
			className="min-h-screen overflow-x-hidden bg-minuri-white text-minuri-ink min-[1500px]:origin-top min-[1500px]:scale-[1.18]"
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
				<div className="flex gap-10 items-start">
					{/* ── Left: main plan content ── */}
					<div className="min-w-0 flex-1">
						{/* Hero */}
						<motion.div
							initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 18 }}
							className="mb-10"
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, margin: "-10% 0px -8% 0px" }}
							transition={revealTransition}
						>
							<span className="inline-flex rounded-sm bg-[#e2ffef] px-2 py-1.5 text-sm font-black uppercase text-minuri-ocean">
								Your guide journey
							</span>
							<h1 className="mt-2 text-4xl font-black leading-tight text-minuri-ocean md:text-5xl">
								Your first week in{" "}
								<span style={{ color: "var(--vibe-accent)" }}>
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

						{/* Day stepper */}
						<div ref={scrollRef} className="mb-8">
							<DayStepperNav
								weekPlan={weekPlan}
								activeDay={activeDay}
								completedTasks={completedTasks}
								onSelect={selectDay}
							/>
						</div>

						{/* Day content */}
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
							/>
						</aside>
					)}
				</div>

				{/* Places to go — full width */}
				{currentDay && (
					<div key={activeDay} className="mt-10">
						<JourneyDayPlaces suburb={suburb} topicSlug={currentDay.topicSlug} />
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
