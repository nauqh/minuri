"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ChevronRight, X } from "lucide-react";
import {
	AnimatePresence,
	motion,
	useReducedMotion,
	useScroll,
	useTransform,
} from "motion/react";
import Lenis from "lenis";
import { useLenis } from "lenis/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { PERSONAS, type Persona } from "@/content/personas";
import { getGuidesFromSlugs } from "@/lib/guides";
import { GuideCard } from "@/components/guides/guide-card";
import { GuidesShell } from "@/components/guides/guides-shell";
import { GuidesTabNav } from "@/components/guides/guides-tab-nav";
import { useGuideBookmarks } from "@/hooks/use-guide-bookmarks";

const DOT_PATTERN = `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='1.5' fill='white' fill-opacity='0.18'/%3E%3C/svg%3E")`;

const COIL_PATTERN = `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='26' viewBox='0 0 40 26'><path d='M 5,13 A 15,9 0 0,0 35,13' fill='none' stroke='%23b8b3ac' stroke-width='2' stroke-linecap='round'/><path d='M 5,13 A 15,9 0 0,1 35,13' fill='none' stroke='%2382807a' stroke-width='3' stroke-linecap='round'/></svg>")`;

function PersonaPickerCard({
	persona,
	onSelect,
	animationDelay,
}: {
	persona: Persona;
	onSelect: (p: Persona) => void;
	animationDelay: number;
}) {
	const prefersReducedMotion = useReducedMotion();

	return (
		<motion.button
			type="button"
			onClick={() => onSelect(persona)}
			className="group relative overflow-hidden rounded-2xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-minuri-teal/50"
			initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 24 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, amount: 0.12 }}
			transition={{
				duration: prefersReducedMotion ? 0.01 : 0.5,
				delay: prefersReducedMotion ? 0 : animationDelay,
				ease: [0.22, 1, 0.36, 1],
			}}
			whileHover={{ scale: prefersReducedMotion ? 1 : 1.015 }}
		>
			<Image
				src={persona.imageUrl}
				alt={persona.name}
				fill
				sizes="(max-width: 640px) 50vw, 33vw"
				className="object-cover"
			/>
			<div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/15" />

			<div className="relative flex aspect-[3/4] flex-col justify-between p-5 sm:p-6">
				{/* Top — role + age */}
				<div className="flex items-start justify-between gap-2">
					<span className="rounded-full border border-white/25 bg-white/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-sm">
						{persona.role}
					</span>
					<span className="text-[10px] text-white/50">
						{persona.age} · {persona.origin}
					</span>
				</div>

				{/* Bottom — name + tagline */}
				<div className="relative">
					<h3
						className="text-xl font-bold text-white sm:text-2xl"
						style={{ fontFamily: "var(--font-hero-serif)" }}
					>
						{persona.name}
					</h3>
					<p className="mt-1 line-clamp-2 text-xs italic leading-snug text-white/70 sm:text-sm">
						&ldquo;{persona.tagline}&rdquo;
					</p>
				</div>
			</div>
		</motion.button>
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

			{/* Right — journal + week arc */}
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

function FlipPanel({
	children,
	flipIndex,
	numFlips,
	scrollYProgress,
	prefersReducedMotion,
}: {
	children: React.ReactNode;
	flipIndex: number;
	numFlips: number;
	scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
	prefersReducedMotion: boolean | null;
}) {
	const start = flipIndex / numFlips;
	const end = (flipIndex + 1) / numFlips;

	const x = useTransform(
		scrollYProgress,
		[start, end],
		prefersReducedMotion ? ["0%", "0%"] : ["100%", "0%"],
	);

	return (
		<motion.div
			className="absolute inset-0"
			style={{
				x,
				zIndex: flipIndex + 2,
				backgroundColor: "#f0ede8",
			}}
		>
			{children}
		</motion.div>
	);
}

export function PersonaDetailFullscreen({
	persona,
	onBack,
}: {
	persona: Persona;
	onBack: () => void;
}) {
	const scrollRef = useRef<HTMLDivElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);
	const prefersReducedMotion = useReducedMotion();
	const { isBookmarked, toggleBookmark } = useGuideBookmarks();
	const rootLenis = useLenis();
	const { scrollYProgress } = useScroll({ container: scrollRef });

	const validDays = persona.journey
		.map((slugs, i) => ({ dayIndex: i, guides: getGuidesFromSlugs(slugs) }))
		.filter((d) => d.guides.length > 0);

	// 1 description panel + one panel per day
	const numPanels = 1 + validDays.length;
	const numFlips = validDays.length;
	const trackHeight = `${numPanels * 100}vh`;

	const scrollHintOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);

	const day1 = validDays[0] ?? null;
	const flipDays = validDays.slice(1);
	const stripX = useTransform(
		scrollYProgress,
		[0, 1 / numFlips],
		prefersReducedMotion ? ["0vw", "0vw"] : ["0vw", "-100vw"],
	);

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
			{/* Background — fades in separately so layoutId image morphs at full opacity */}
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

			{/* Scroll container — ref here, scrollbar fully hidden */}
			<div
				ref={scrollRef}
				className="h-full w-full overflow-x-hidden overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
			>
				{/* Tall scroll track — height = numPanels × 100vh */}
				<div ref={contentRef} style={{ height: trackHeight }}>
					{/* Sticky viewport */}
					<div
						className="sticky top-0 h-screen overflow-hidden"
					>
						{/* Sliding strip: Persona → Day 1 */}
						<motion.div
							className="flex h-full"
							style={{ x: stripX, width: "200vw" }}
						>
						{/* ── Persona panel ── */}
						<div
							className="relative flex h-screen w-screen shrink-0 flex-col md:flex-row"
							style={{ backgroundColor: "#f0ede8" }}
						>
								{/* Far left — huge vertical name */}
								<motion.div
									className="hidden md:flex w-24 shrink-0 items-center justify-center px-2 ml-6 mr-4 md:w-32 md:px-3 md:ml-10 md:mr-6"
									initial={{
										y: prefersReducedMotion ? 0 : 70,
										opacity: 0,
									}}
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
											fontFamily:
												"var(--font-hero-serif)",
											fontSize:
												"clamp(5rem, 12vw, 10rem)",
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
									initial={{
										x: prefersReducedMotion ? 0 : 55,
										opacity: 0,
									}}
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
											style={{
												color: persona.accentColor,
											}}
										>
											{persona.role}
										</p>
									</div>

									<motion.p
										style={{ opacity: scrollHintOpacity }}
										className="text-[9px] font-semibold uppercase tracking-[0.2em] text-gray-400"
									>
										Scroll for more
									</motion.p>

									<div>
										<p
											className="text-base font-medium leading-relaxed text-gray-800 md:text-2xl lg:text-3xl"
											style={{
												fontFamily:
													"var(--font-hero-serif)",
											}}
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

							{/* Day 1 in the strip */}
							{day1 && (
								<div
									className="relative flex h-screen w-screen shrink-0 flex-col md:flex-row"
									style={{ backgroundColor: "#f0ede8" }}
								>
									<DayPageContent
										dayIndex={day1.dayIndex}
										guides={day1.guides}
										panelNumber={1}
										totalPanels={validDays.length}
										persona={persona}
										isBookmarked={isBookmarked}
										toggleBookmark={toggleBookmark}
										validDays={validDays}
									/>
								</div>
							)}
						</motion.div>

						{/* Days 2+: flip in on top */}
						{flipDays.map(({ dayIndex, guides }, i) => (
							<FlipPanel
								key={dayIndex}
								flipIndex={i + 1}
								numFlips={numFlips}
								scrollYProgress={scrollYProgress}
								prefersReducedMotion={prefersReducedMotion}
							>
								<div
									className="absolute inset-0 flex flex-col md:flex-row"
									style={{ backgroundColor: "#f0ede8" }}
								>
									<DayPageContent
										dayIndex={dayIndex}
										guides={guides}
										panelNumber={i + 2}
										totalPanels={validDays.length}
										persona={persona}
										isBookmarked={isBookmarked}
										toggleBookmark={toggleBookmark}
										validDays={validDays}
									/>
								</div>
							</FlipPanel>
						))}
					</div>
				</div>
			</div>
		</motion.div>
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
