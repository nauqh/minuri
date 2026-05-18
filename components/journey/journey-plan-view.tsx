"use client";

import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
	CheckCircle2,
	ChevronRight,
	UserCircle,
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
import { useJourneyState } from "@/hooks/use-journey-state";
import { useIdentityState } from "@/hooks/use-identity-state";
import { useGuideBookmarks } from "@/hooks/use-guide-bookmarks";
import { JourneyDayPlaces } from "@/components/journey/journey-day-places";
import { JourneyNearbyEvents } from "@/components/journey/journey-nearby-events";
import { buildWeekPlan, type DayPlan } from "@/lib/journey-week";
import { loadWeekPlan, resolveWeekPlan } from "@/lib/journey/week-plan-store";
import { getVibe, DEFAULT_VIBE_ID, type Vibe } from "@/lib/vibes";
import { LANDING_KEYS } from "@/components/landing/landing-local-state";
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

// ─── Week Drawer ──────────────────────────────────────────────────────────────

function WeekDrawer({
	open,
	weekPlan,
	activeDay,
	completedTasks,
	vibe,
	identity,
	cardState,
	suburb,
	onSelectDay,
	onClose,
}: {
	open: boolean;
	weekPlan: DayPlan[];
	activeDay: number;
	completedTasks: Set<string>;
	vibe: Vibe;
	identity: import("@/lib/journey/identity").JourneyIdentity | null;
	cardState: import("@/lib/journey/identity").IdentityCardState | null;
	suburb: string;
	onSelectDay: (day: number) => void;
	onClose: () => void;
}) {
	const prefersReducedMotion = useReducedMotion();
	const { bookmarks } = useGuideBookmarks();
	const savedGuides = bookmarks
		.map((slug) => GUIDES.find((g) => g.slug === slug))
		.filter((g): g is Guide => Boolean(g));

	useEffect(() => {
		if (!open) return;
		function onKey(e: KeyboardEvent) {
			if (e.key === "Escape") onClose();
		}
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [open, onClose]);

	useEffect(() => {
		if (!open) document.body.style.overflow = "";
		return () => { document.body.style.overflow = ""; };
	}, [open]);

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
						className="fixed inset-y-0 right-0 z-50 flex w-full flex-col bg-minuri-white shadow-2xl sm:max-w-md"
						role="dialog"
						aria-label="Your week"
						onMouseEnter={() => { document.body.style.overflow = "hidden"; }}
						onMouseLeave={() => { document.body.style.overflow = ""; }}
					>
						{/* Sticky close bar */}
						<div className="flex shrink-0 items-center justify-end px-4 py-3">
							<button
								type="button"
								onClick={onClose}
								data-no-scale
								className="rounded-lg p-1.5 text-minuri-slate transition-colors hover:text-minuri-ocean"
								aria-label="Close drawer"
							>
								<X className="size-4" />
							</button>
						</div>

						{/* Scrollable body */}
						<div className="flex-1 overflow-y-auto overscroll-contain">
							<div className="px-5 py-5">
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

							{identity && cardState && (
								<div className="border-t border-minuri-silver/40 px-5 pb-5 pt-4">
									<IdentityCard identity={identity} cardState={cardState} />
								</div>
							)}

							{savedGuides.length > 0 && (
								<div className="border-t border-minuri-silver/40 px-5 pb-6 pt-4">
									<p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-minuri-mid">
										Saved guides
									</p>
									<div className="space-y-2">
										{savedGuides.map((guide) => {
											const topicMeta = getTopicMeta(guide.topic);
											return (
												<Link
													key={guide.slug}
													href={`/guides/${guide.slug}?suburb=${encodeURIComponent(suburb)}&from=journey`}
													onClick={onClose}
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
	const { identity, cardState, earnDay, hydrated: identityHydrated } = useIdentityState();
	const prefersReducedMotion = useReducedMotion();
	const scrollRef = useRef<HTMLDivElement>(null);
	const earnedDaysRef = useRef<Set<number>>(new Set());

	const [activeDay, setActiveDay] = useState(1);
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [vibe, setVibe] = useState<Vibe>(() => getVibe(DEFAULT_VIBE_ID));
	const [letterExpanded, setLetterExpanded] = useState(false);
	const [planStage, setPlanStage] = useState<"letter" | "plan">("letter");
	const [toastDay, setToastDay] = useState<number | null>(null);
	const [toastVisible, setToastVisible] = useState(false);
	const [hasCardNotif, setHasCardNotif] = useState(false);

	useEffect(() => {
		const stored =
			typeof window !== "undefined"
				? (window.localStorage.getItem(LANDING_KEYS.vibe) ??
					DEFAULT_VIBE_ID)
				: DEFAULT_VIBE_ID;
		setVibe(getVibe(stored));
	}, []);

	useEffect(() => {
		if (!identity) return;
		const color = identity.palette[0].hex;
		document.documentElement.style.setProperty("--vibe-accent", color);
		setVibe((v) => ({ ...v, hex: color }));
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
				onContinue={() => setPlanStage("plan")}
			/>
		);
	}
	const weekPlan = (() => {
		const stored = loadWeekPlan();
		if (stored) return resolveWeekPlan(stored);
		return buildWeekPlan(selectedTopics, yourMoment);
	})();
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
		<motion.div
			className="min-h-screen overflow-x-hidden bg-minuri-white text-minuri-ink min-[1500px]:origin-top min-[1500px]:scale-[1.18]"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
		>
			<WeekDrawer
				open={drawerOpen}
				weekPlan={weekPlan}
				activeDay={activeDay}
				completedTasks={completedTasks}
				vibe={vibe}
				identity={identity}
				cardState={cardState}
				suburb={suburb}
				onSelectDay={selectDay}
				onClose={() => setDrawerOpen(false)}
			/>

			{toastDay !== null && (
				<CardEarnToast
					day={toastDay}
					visible={toastVisible}
					onDone={() => setToastVisible(false)}
					onOpenCard={() => {
						setDrawerOpen(true);
						setHasCardNotif(false);
					}}
				/>
			)}

			{/* Header */}
			<header className="px-6 py-4">
				<div className="mx-auto flex max-w-screen-xl items-center justify-between">
					<Link
						href="/"
						className="text-2xl font-black uppercase tracking-tight text-minuri-ocean"
					>
						Minuri
					</Link>
					<div className="flex items-center gap-2">
						<motion.button
							type="button"
							data-no-scale
							onClick={() => {
								setDrawerOpen((o) => !o);
								setHasCardNotif(false);
							}}
							className="relative inline-flex items-center gap-2 rounded-full border border-minuri-silver/80 px-4 py-2 text-sm font-medium text-minuri-slate transition-colors hover:border-minuri-teal/50 hover:text-minuri-teal"
							animate={
								hasCardNotif && !drawerOpen
									? { scale: [1, 1.13, 0.97, 1.1, 1] }
									: { scale: 1 }
							}
							transition={{
								duration: 2.5,
								ease: "easeInOut",
								times: [0, 0.25, 0.5, 0.75, 1],
								repeat: hasCardNotif && !drawerOpen ? Infinity : 0,
								repeatDelay: 1.2,
							}}
						>
							{hasCardNotif && !drawerOpen && (
								<span className="absolute -right-1 -top-1 size-2.5 rounded-full bg-minuri-teal ring-2 ring-white" />
							)}
							{drawerOpen ? (
								<X className="size-3.5" aria-hidden />
							) : (
								<UserCircle
									className="size-3.5"
									aria-hidden
								/>
							)}
							{drawerOpen ? "Close" : "My card"}
						</motion.button>
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

			<main className="mx-auto max-w-screen-xl px-6 py-10 md:py-12">
				<div className="flex gap-10 items-start">
					{/* ── Left: main plan content ── */}
					<div className="min-w-0 flex-1 min-w-0">
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

							{identity?.letter?.body && (
								<motion.div
									initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 8 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{
										duration: prefersReducedMotion ? 0.01 : 0.45,
										delay: 0.18,
									}}
									className="mt-5 rounded-2xl border border-minuri-silver/50 bg-minuri-fog/60 px-5 py-4"
								>
									<p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-minuri-teal">
										A letter for you
									</p>
									<p className="text-sm leading-relaxed text-minuri-slate">
										{letterExpanded
											? identity.letter.body
											: identity.letter.body.slice(0, 160).trimEnd() + "…"}
									</p>
									<button
										type="button"
										onClick={() => setLetterExpanded((v) => !v)}
										className="mt-2 text-xs font-medium text-minuri-teal hover:underline"
									>
										{letterExpanded ? "Show less" : "Read more"}
									</button>
								</motion.div>
							)}

							<p className="mt-4 text-sm text-minuri-slate">
								Guides, tasks, and places near{" "}
								{suburb} — one day at a time.
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

						{/* Community near you */}
						<div className="mt-12">
							<JourneyNearbyEvents suburb={suburb} />
						</div>
					</div>

				</div>
			</main>
		</motion.div>
	);
}
