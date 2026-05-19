"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, X } from "lucide-react";
import {
	AnimatePresence,
	motion,
	useReducedMotion,
} from "motion/react";
import Lenis from "lenis";
import { useLenis } from "lenis/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { PERSONAS, type Persona } from "@/content/personas";
import { getGuidesFromSlugs } from "@/lib/guides";
import { loadWeekPlan, resolveWeekPlan } from "@/lib/journey/week-plan-store";
import type { DayPlan } from "@/lib/journey-week";
import { GuideCard } from "@/components/guides/guide-card";
import { GuidesShell } from "@/components/guides/guides-shell";
import { GuidesTabNav } from "@/components/guides/guides-tab-nav";
import { useGuideBookmarks } from "@/hooks/use-guide-bookmarks";
import { useJourneyState } from "@/hooks/use-journey-state";

const DOT_PATTERN = `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='1.5' fill='white' fill-opacity='0.18'/%3E%3C/svg%3E")`;

const COIL_PATTERN = `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='26' viewBox='0 0 40 26'><path d='M 5,13 A 15,9 0 0,0 35,13' fill='none' stroke='%23b8b3ac' stroke-width='2' stroke-linecap='round'/><path d='M 5,13 A 15,9 0 0,1 35,13' fill='none' stroke='%2382807a' stroke-width='3' stroke-linecap='round'/></svg>")`;

function PersonaPickerCard({
	persona,
	onSelect,
	animationDelay,
	matched,
}: {
	persona: Persona;
	onSelect: (p: Persona) => void;
	animationDelay: number;
}) {
	const prefersReducedMotion = useReducedMotion();

	return (
		<motion.div
			initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 24 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, amount: 0.12 }}
			transition={{
				duration: prefersReducedMotion ? 0.01 : 0.5,
				delay: prefersReducedMotion ? 0 : animationDelay,
				ease: [0.22, 1, 0.36, 1],
			}}
			whileHover={prefersReducedMotion ? {} : { scale: 1.02, borderRadius: "8px" }}
			style={{ borderRadius: "16px", border: "2px solid #000" }}
		>
			<button
				type="button"
				onClick={() => onSelect(persona)}
				className="block w-full overflow-hidden text-left focus-visible:outline-none"
				style={{ borderRadius: "14px" }}
			>
				{/* Image */}
				<div
					className="relative flex aspect-[3/4] items-end justify-start"
					style={{ backgroundColor: `${persona.accentColor}18` }}
				>
					<Image
						src={persona.imageUrl}
						alt={persona.name}
						fill
						sizes="(max-width: 640px) 50vw, 33vw"
						className="object-contain object-bottom"
					/>

					{/* Bottom info bar */}
					<div className="relative z-10 w-full px-3 pb-3 pt-8 bg-gradient-to-t from-black/60 to-transparent">
						<div className="flex items-end justify-between gap-2">
							<div>
								<p
									className="text-xs font-black uppercase tracking-widest"
									style={{ color: persona.accentColor }}
								>
									{persona.role}
								</p>
								<h3
									className="text-lg font-bold text-white"
									style={{ fontFamily: "var(--font-hero-serif)" }}
								>
									{persona.name}
								</h3>
							</div>
						</div>
					</div>
				</div>
			</button>
		</motion.div>
	);
}

function JournalNote({ text, name }: { text: string; name: string }) {
	const LINE_H = 32;
	return (
		<div>
			<p className="mb-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-gray-400">
				{name}&rsquo;s journal
			</p>
			<div
				style={{
					backgroundColor: "#fbf9f5",
					backgroundImage: [
						"linear-gradient(90deg, transparent 40px, #d4807055 40px, #d4807055 41px, transparent 41px)",
						`repeating-linear-gradient(#e2ddd6, #e2ddd6 1px, transparent 1px, transparent ${LINE_H}px)`,
					].join(", "),
					backgroundSize: `100% 100%, 100% ${LINE_H}px`,
					backgroundPositionY: `0, 0`,
					padding: `8px 20px 16px 56px`,
					boxShadow:
						"0 1px 4px rgba(0,0,0,0.06), inset 0 0 0 1px rgba(0,0,0,0.05)",
					borderRadius: "2px",
				}}
			>
				<p
					style={{
						fontFamily: "var(--font-hero-serif)",
						fontSize: "1.05rem",
						lineHeight: `${LINE_H}px`,
						color: "#374151",
						fontStyle: "italic",
					}}
				>
					&ldquo;{text}&rdquo;
				</p>
			</div>
		</div>
	);
}

function WeekArc({
	allDays,
	currentDayIndex,
	accentColor,
}: {
	allDays: { dayIndex: number; hasGuides: boolean }[];
	currentDayIndex: number;
	accentColor: string;
}) {
	return (
		<div>
			<p className="mb-4 text-[9px] font-semibold uppercase tracking-[0.2em] text-gray-400">
				Week journey
			</p>
			<div className="relative">
				<div className="absolute left-1.5 right-1.5 top-[5px] h-px bg-black/10" />
				<div className="relative flex justify-between">
					{allDays.map(({ dayIndex, hasGuides }) => {
						const isPast = dayIndex < currentDayIndex;
						const isCurrent = dayIndex === currentDayIndex;
						const isFuture = dayIndex > currentDayIndex;
						return (
							<div
								key={dayIndex}
								className="flex flex-col items-center gap-2"
							>
								<div
									className="size-[11px] rounded-full"
									style={{
										backgroundColor: isFuture
											? "transparent"
											: accentColor,
										opacity: isPast ? 0.35 : 1,
										border: isFuture
											? "1.5px solid #d1d5db"
											: "none",
										outline: isCurrent
											? `2px solid ${accentColor}40`
											: "none",
										outlineOffset: isCurrent ? "2px" : "0",
										filter:
											!hasGuides && !isFuture
												? "grayscale(1)"
												: "none",
									}}
								/>
								<span
									style={{
										fontSize: "8px",
										color: isCurrent ? "#4b5563" : "#9ca3af",
										fontWeight: isCurrent ? 600 : 400,
										opacity: !hasGuides ? 0.4 : 1,
									}}
								>
									{dayIndex + 1}
								</span>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}

function DayPageContent({
	dayIndex,
	guides,
	panelNumber,
	totalPanels,
	persona,
	isBookmarked,
	toggleBookmark,
	validDays,
}: {
	dayIndex: number;
	guides: ReturnType<typeof getGuidesFromSlugs>;
	panelNumber: number;
	totalPanels: number;
	persona: Persona;
	isBookmarked: (slug: string) => boolean;
	toggleBookmark: (slug: string) => void;
	validDays: { dayIndex: number }[];
}) {
	const allDaysForArc = persona.journey.map((_, i) => ({
		dayIndex: i,
		hasGuides: validDays.some((d) => d.dayIndex === i),
	}));
	return (
		<>
			{/* Left — day header + guide cards */}
			<div
				className="flex flex-1 flex-col justify-between px-6 py-10 md:flex-none md:w-[52%] md:px-12 md:py-14 lg:px-20"
				style={{ boxShadow: "inset -12px 0 18px -8px rgba(0,0,0,0.06)" }}
			>
				<div className="flex items-start justify-between">
					<div>
						<p
							className="text-[10px] font-bold uppercase tracking-[0.2em]"
							style={{ color: persona.accentColor }}
						>
							{persona.name} · Day {dayIndex + 1}
						</p>
						<h2
							className="mt-1 text-3xl font-black text-gray-900 md:text-4xl lg:text-5xl"
							style={{
								fontFamily: "var(--font-hero-serif)",
								letterSpacing: "-0.03em",
							}}
						>
							{dayIndex === 0
								? "First day"
								: dayIndex === 6
									? "End of week"
									: `Day ${dayIndex + 1}`}
						</h2>
					</div>
					<span className="text-xs text-gray-400">
						{panelNumber} / {totalPanels}
					</span>
				</div>

				<div className="flex gap-4 overflow-x-auto pb-2 md:gap-6 md:overflow-visible md:pb-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
					{guides.map((guide, index) => (
						<div key={guide.slug} className="w-64 shrink-0 md:w-72">
							<GuideCard
								guide={guide}
								href={`/guides/${guide.slug}`}
								bookmarked={isBookmarked(guide.slug)}
								onToggleBookmark={toggleBookmark}
								animationDelay={index * 0.06}
							/>
						</div>
					))}
				</div>
			</div>

			{/* Spine — spiral coil binding */}
			<div
				className="hidden shrink-0 w-10 overflow-hidden md:block"
				style={{
					background:
						"linear-gradient(to right, #e8e3db, #cec9c0 35%, #cec9c0 65%, #e8e3db)",
				}}
			>
				<div
					className="h-full w-full"
					style={{
						backgroundImage: COIL_PATTERN,
						backgroundRepeat: "repeat-y",
						backgroundPosition: "center top",
						backgroundSize: "40px 26px",
					}}
				/>
			</div>

			{/* Right — journal + week arc + plant */}
			<div
				className="hidden flex-1 flex-col justify-between px-10 py-14 md:flex lg:px-14"
				style={{ boxShadow: "inset 12px 0 18px -8px rgba(0,0,0,0.06)" }}
			>
				<JournalNote
					text={persona.dayNarratives[dayIndex]}
					name={persona.name}
				/>
				<WeekArc
					allDays={allDaysForArc}
					currentDayIndex={dayIndex}
					accentColor={persona.accentColor}
				/>
			</div>
		</>
	);
}

export function PersonaDetailFullscreen({
	persona,
	onBack,
}: {
	persona: Persona;
	onBack: () => void;
}) {
	const prefersReducedMotion = useReducedMotion();
	const { isBookmarked, toggleBookmark } = useGuideBookmarks();
	const rootLenis = useLenis();
	const scrollRef = useRef<HTMLDivElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);

	const validDays = persona.journey
		.map((slugs, i) => ({ dayIndex: i, guides: getGuidesFromSlugs(slugs) }))
		.filter((d) => d.guides.length > 0);

	useEffect(() => {
		function onKeyDown(e: KeyboardEvent) {
			if (e.key === "Escape") onBack();
		}
		document.addEventListener("keydown", onKeyDown);
		return () => document.removeEventListener("keydown", onKeyDown);
	}, [onBack]);

	useEffect(() => {
		const prev = document.documentElement.style.overflow;
		document.documentElement.style.overflow = "hidden";
		rootLenis?.stop();

		const wrapper = scrollRef.current;
		const content = contentRef.current;
		if (!wrapper || !content || prefersReducedMotion) {
			return () => {
				document.documentElement.style.overflow = prev;
				rootLenis?.start();
			};
		}

		const lenis = new Lenis({
			wrapper,
			content,
			orientation: "horizontal",
			lerp: 0.068,
			smoothWheel: true,
		});

		const onPointerDown = (e: PointerEvent) => {
			const target = e.target as Element;
			if (target.closest("button, a, [role='button'], [role='link']")) {
				lenis.stop();
				requestAnimationFrame(() => lenis.start());
			}
		};
		wrapper.addEventListener("pointerdown", onPointerDown);

		let rafId: number;
		const raf = (time: number) => {
			lenis.raf(time);
			rafId = requestAnimationFrame(raf);
		};
		rafId = requestAnimationFrame(raf);

		return () => {
			wrapper.removeEventListener("pointerdown", onPointerDown);
			cancelAnimationFrame(rafId);
			lenis.destroy();
			document.documentElement.style.overflow = prev;
			rootLenis?.start();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [prefersReducedMotion]);

	return (
		<motion.div
			className="fixed inset-0 z-50 overflow-hidden"
			exit={{ opacity: 0 }}
			transition={{ duration: prefersReducedMotion ? 0.01 : 0.25 }}
		>
			{/* Background */}
			<motion.div
				className="pointer-events-none absolute inset-0"
				style={{ backgroundColor: "#f0ede8" }}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{
					duration: prefersReducedMotion ? 0.01 : 0.32,
					ease: [0.22, 1, 0.36, 1],
				}}
			/>

			{/* Sticky close button */}
			<button
				type="button"
				onClick={onBack}
				className="absolute right-6 top-6 z-10 flex size-9 items-center justify-center rounded-full border border-gray-300/60 bg-white/70 text-gray-700 backdrop-blur-sm transition-transform hover:scale-105"
				aria-label="Close"
			>
				<X className="size-4" aria-hidden />
			</button>

			{/* Horizontal scroll container */}
			<div ref={scrollRef} className="h-full w-full overflow-x-auto overflow-y-hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
				<div ref={contentRef} className="flex h-full">
				{/* Persona panel */}
				<div
					className="relative flex h-screen w-screen shrink-0 flex-col md:flex-row"
					style={{ backgroundColor: "#f0ede8" }}
				>
					{/* Far left — huge vertical name */}
					<motion.div
						className="hidden md:flex w-24 shrink-0 items-center justify-center px-2 ml-6 mr-4 md:w-32 md:px-3 md:ml-10 md:mr-6"
						initial={{ y: prefersReducedMotion ? 0 : 70, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{
							duration: 0.6,
							delay: 0.38,
							ease: [0.22, 1, 0.36, 1],
						}}
					>
						<span
							className="select-none font-black leading-none text-gray-900"
							style={{
								fontFamily: "var(--font-hero-serif)",
								fontSize: "clamp(5rem, 12vw, 10rem)",
								writingMode: "vertical-rl",
								transform: "rotate(180deg)",
								letterSpacing: "-0.05em",
							}}
							aria-hidden
						>
							{persona.name}
						</span>
					</motion.div>

					{/* Center — persona photo (layoutId shared element from intro card) */}
					<motion.div
						className="relative h-[45vh] w-full shrink-0 md:h-auto md:w-[42%]"
						layoutId={`persona-photo-${persona.id}`}
						transition={{
							duration: 0.68,
							ease: [0.22, 1, 0.36, 1],
						}}
					>
						<Image
							src={persona.imageUrl}
							alt={persona.name}
							fill
							sizes="42vw"
							priority
							className="object-cover"
						/>
					</motion.div>

					{/* Right — role / hint / quote */}
					<motion.div
						className="flex flex-1 flex-col justify-between px-6 py-5 md:px-8 md:py-10 lg:px-10 lg:py-12"
						style={{ backgroundColor: "#f0ede8" }}
						initial={{ x: prefersReducedMotion ? 0 : 55, opacity: 0 }}
						animate={{ x: 0, opacity: 1 }}
						transition={{
							duration: 0.55,
							delay: 0.48,
							ease: [0.22, 1, 0.36, 1],
						}}
					>
						<div className="flex items-start">
							<p
								className="text-lg font-black uppercase tracking-[0.18em]"
								style={{ color: persona.accentColor }}
							>
								{persona.role}
							</p>
						</div>

						<p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-gray-400">
							Scroll for more
						</p>

						<div>
							<p
								className="text-base font-medium leading-relaxed text-gray-800 md:text-2xl lg:text-3xl"
								style={{ fontFamily: "var(--font-hero-serif)" }}
							>
								&ldquo;{persona.tagline}&rdquo;
							</p>
							<p className="mt-8 text-md leading-6 text-gray-500">
								{persona.situation}
							</p>
							<p className="mt-3 text-sm text-gray-400">
								{persona.name}, {persona.age} ·{" "}
								{persona.origin}
							</p>
						</div>
					</motion.div>
				</div>

				{/* Day panels */}
				{validDays.map(({ dayIndex, guides }, i) => (
					<div
						key={dayIndex}
						className="relative flex h-screen w-screen shrink-0 flex-col md:flex-row"
						style={{ backgroundColor: "#f0ede8" }}
					>
						<DayPageContent
							dayIndex={dayIndex}
							guides={guides}
							panelNumber={i + 1}
							totalPanels={validDays.length}
							persona={persona}
							isBookmarked={isBookmarked}
							toggleBookmark={toggleBookmark}
							validDays={validDays}
						/>
					</div>
				))}
				</div>
			</div>
		</motion.div>
	);
}

const TOPIC_COLOR: Record<string, string> = {
	"food-eating":      "#00c49a",
	"getting-around":   "#38bdf8",
	"health-wellbeing": "#facc15",
	"home-admin":       "#f9a8d4",
	"social-belonging": "#a5f3fc",
};

function YourPlanStrip({ days }: { days: DayPlan[] }) {
	return (
		<div className="mb-8 rounded-2xl border border-black/8 bg-white/60 px-5 py-4 backdrop-blur-sm">
			<div className="mb-3 flex items-center justify-between">
				<p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-500">
					Your 7-day plan
				</p>
				<Link
					href="/journey/plan"
					className="text-[10px] font-semibold text-gray-400 underline-offset-2 hover:underline"
				>
					View full plan →
				</Link>
			</div>
			<div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
				{days.map((day) => (
					<div
						key={day.day}
						className="flex w-20 shrink-0 flex-col gap-1 rounded-xl px-2.5 py-2.5"
						style={{ backgroundColor: `${TOPIC_COLOR[day.topicSlug] ?? "#e5e7eb"}22` }}
					>
						<span
							className="text-[8px] font-bold uppercase tracking-[0.14em]"
							style={{ color: TOPIC_COLOR[day.topicSlug] ?? "#6b7280" }}
						>
							Day {day.day}
						</span>
						<span className="text-[11px] font-semibold leading-tight text-gray-800">
							{day.shortLabel}
						</span>
						<span className="line-clamp-2 text-[9px] leading-tight text-gray-500">
							{day.theme}
						</span>
					</div>
				))}
			</div>
		</div>
	);
}

export function PersonaJourneyView({
	initialPersonaId,
}: {
	initialPersonaId: string | null;
}) {
	const router = useRouter();
	const [selectedPersona, setSelectedPersona] = useState<Persona | null>(
		() =>
			initialPersonaId
				? (PERSONAS.find((p) => p.id === initialPersonaId) ?? null)
				: null,
	);
	const prefersReducedMotion = useReducedMotion();
	const { journeyState } = useJourneyState();
	const [weekDays, setWeekDays] = useState<DayPlan[] | null>(null);

	useEffect(() => {
		const raw = loadWeekPlan();
		if (raw) setWeekDays(resolveWeekPlan(raw));
	}, []);

	function handleBack() {
		setSelectedPersona(null);
		router.push("/guides");
	}

	const headerStart = (
		<Link
			href="/"
			className="mt-4 inline-flex items-center gap-2 rounded-full border border-minuri-silver/80 bg-minuri-white px-3.5 py-1.5 text-xs font-medium text-minuri-slate transition-transform duration-200 ease-out hover:scale-105"
		>
			<ArrowLeft className="size-3.5" aria-hidden />
			Back to home
		</Link>
	);

	return (
		<>
			<GuidesShell
				title="Choose your journey"
				description="Pick the situation closest to yours. We'll open a curated week of guides."
				headerStart={headerStart}
			>
				<GuidesTabNav />

				{weekDays && weekDays.length > 0 && (
					<YourPlanStrip days={weekDays} />
				)}

				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: prefersReducedMotion ? 0.01 : 0.2 }}
				>
					<div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
						{PERSONAS.map((persona, index) => (
							<PersonaPickerCard
								key={persona.id}
								persona={persona}
								onSelect={setSelectedPersona}
								animationDelay={(index % 3) * 0.08}
								/>
						))}
					</div>
				</motion.div>
			</GuidesShell>

			{/* Full-screen overlay — renders above everything */}
			<AnimatePresence>
				{selectedPersona && (
					<PersonaDetailFullscreen
						key={selectedPersona.id}
						persona={selectedPersona}
						onBack={handleBack}
					/>
				)}
			</AnimatePresence>
		</>
	);
}
