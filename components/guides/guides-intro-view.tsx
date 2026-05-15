"use client";

import { useState } from "react";
import {
	ArrowLeft,
	ArrowRight,
	Check,
	Compass,
	HeartPulse,
	Home,
	Sandwich,
	Users,
	type LucideIcon,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { GUIDE_TOPICS, GUIDES, type GuideTopicSlug } from "@/content/guides";
import { PERSONAS, type Persona } from "@/content/personas";
import { PersonaDetailFullscreen } from "@/components/guides/persona-journey-view";
import { cn } from "@/lib/utils";

type TopicVisual = {
	icon: LucideIcon;
	heroBg: string;
	description: string;
};

const TOPIC_VISUALS: Record<GuideTopicSlug, TopicVisual> = {
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

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const CARD_SIZE = 180;
const CONTAINER_W = 880;
const CONTAINER_H = 820;

const PENTAGON_POS = [
	{ x: 350, y: 50 },
	{ x: 607, y: 237 },
	{ x: 509, y: 538 },
	{ x: 191, y: 538 },
	{ x: 93, y: 237 },
];

const SCATTER_POS = [
	{ x: 315, y: 18 },
	{ x: 656, y: 260 },
	{ x: 522, y: 582 },
	{ x: 138, y: 568 },
	{ x: 30, y: 248 },
];

const FLOAT_AMP = [14, 16, 12, 15, 13];
const FLOAT_DUR = [3.2, 2.8, 3.6, 3.0, 2.5];
const FLOAT_DEL = [0, 0.9, 1.5, 0.4, 1.2];

export function GuidesIntroView() {
	const router = useRouter();
	const prefersReducedMotion = useReducedMotion();
	const [selected, setSelected] = useState<Set<GuideTopicSlug>>(new Set());
	const [activating, setActivating] = useState<Persona | null>(null);
	const [selectedPersona, setSelectedPersona] = useState<Persona | null>(
		null,
	);
	const [isHovered, setIsHovered] = useState(false);

	const guideCounts = new Map(
		GUIDE_TOPICS.map((t) => [
			t.slug,
			GUIDES.filter((g) => g.topic === t.slug).length,
		]),
	);

	const totalSelected = [...selected].reduce(
		(sum, t) => sum + (guideCounts.get(t) ?? 0),
		0,
	);

	function toggle(slug: GuideTopicSlug) {
		setSelected((prev) => {
			const next = new Set(prev);
			next.has(slug) ? next.delete(slug) : next.add(slug);
			return next;
		});
	}

	function handleExplore() {
		const params = new URLSearchParams({ ready: "1" });
		const topics = [...selected];
		if (topics.length === 1) params.set("topic", topics[0]);
		else if (topics.length > 1) params.set("needs", topics.join(","));
		router.push(`/guides?${params}`);
	}

	function handleSkip() {
		router.push("/guides?ready=1");
	}

	function handlePersonaClick(persona: Persona) {
		if (activating) return;
		setActivating(persona);
		setTimeout(() => {
			setSelectedPersona(persona);
			setActivating(null);
		}, 150);
	}

	function handlePersonaBack() {
		setSelectedPersona(null);
	}

	return (
		<div className="min-h-screen bg-minuri-white">
			{/* ── Header ── */}
			<div className="mx-auto flex max-w-screen-2xl items-center justify-between px-6 py-4">
				<Link
					href="/start"
					className="inline-flex items-center gap-2 rounded-sm border border-minuri-ocean/20 bg-minuri-white/80 px-6 py-2 text-base font-semibold text-minuri-ocean shadow-xs backdrop-blur-sm transition-colors duration-200 hover:bg-minuri-ocean hover:text-minuri-white"
				>
					<ArrowLeft className="size-3.5" aria-hidden />
					Back
				</Link>
				<button
					type="button"
					onClick={handleSkip}
					className="text-xs font-medium text-minuri-slate transition-colors hover:text-minuri-ocean"
				>
					Browse all {GUIDES.length} guides →
				</button>
			</div>

			{/* ── Hero ── */}
			<div className="mx-auto max-w-full px-6 pb-10 pt-6 text-center">
				<motion.span
					className="landing-section-kicker"
					initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 8 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4, ease: EASE }}
				>
					First-time guides
				</motion.span>

				<motion.h1
					className="landing-section-heading"
					initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 16 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.06, ease: EASE }}
				>
					What do you need
					<br />
					most right now?
				</motion.h1>

				<motion.p
					className="text-sm font-semibold uppercase tracking-[0.14em] text-minuri-mid mt-20"
					initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4, delay: 0.16, ease: EASE }}
				>
					Tap a topic below to select it, we&apos;ll curate those
					guides for you.
				</motion.p>
			</div>

			{/* ── Topic cards ── */}
			<div className="mx-auto max-w-screen-2xl px-6 pb-8">
				{/* Desktop — magnetic cluster */}
				<div
					className="relative mx-auto hidden md:block"
					style={{ width: CONTAINER_W, height: CONTAINER_H }}
					onMouseEnter={() => setIsHovered(true)}
					onMouseLeave={() => setIsHovered(false)}
				>
					{/* Center CTA */}
					<motion.button
						type="button"
						onClick={handleExplore}
						disabled={selected.size === 0}
						className={cn(
							"absolute z-10 flex flex-col items-center justify-center gap-2 rounded-full text-center transition-colors duration-300",
							selected.size > 0
								? "cursor-pointer bg-minuri-teal text-white shadow-[0_8px_24px_-6px_rgba(0,200,168,0.45)]"
								: "cursor-pointer bg-minuri-silver/40 text-minuri-slate",
						)}
						style={{
							width: 150,
							height: 150,
							left: (CONTAINER_W - 150) / 2,
							top: (CONTAINER_H - 150) / 2,
						}}
						animate={
							selected.size > 0
								? { scale: [1, 1.06, 1] }
								: { scale: 1 }
						}
						transition={
							selected.size > 0
								? {
										duration: 1.8,
										repeat: Infinity,
										ease: "easeInOut",
									}
								: { duration: 0.3 }
						}
						whileHover={selected.size > 0 ? { scale: 1.1 } : {}}
						whileTap={selected.size > 0 ? { scale: 0.95 } : {}}
					>
						{selected.size === 0 ? (
							<span className="px-4 text-sm font-semibold leading-snug">
								Pick a topic
							</span>
						) : (
							<>
								<ArrowRight className="size-7" aria-hidden />
								<span className="text-3xl font-black leading-none">
									{totalSelected}
								</span>
								<span className="text-sm font-medium">
									{totalSelected === 1 ? "guide" : "guides"}
								</span>
							</>
						)}
					</motion.button>

					{/* Orbiting cards */}
					{GUIDE_TOPICS.map((topic, i) => {
						const visual = TOPIC_VISUALS[topic.slug];
						const Icon = visual.icon;
						const isSelected = selected.has(topic.slug);
						const count = guideCounts.get(topic.slug) ?? 0;
						const shouldSnap = isHovered || isSelected;
						const target = shouldSnap
							? PENTAGON_POS[i]
							: SCATTER_POS[i];

						return (
							<motion.div
								key={topic.slug}
								className="absolute"
								style={{
									width: CARD_SIZE,
									height: CARD_SIZE,
									left: 0,
									top: 0,
								}}
								initial={{
									x: SCATTER_POS[i].x,
									y: SCATTER_POS[i].y,
									opacity: 0,
								}}
								animate={{
									x: target.x,
									y: target.y,
									opacity: 1,
								}}
								transition={{
									x: {
										type: "spring",
										stiffness: 180,
										damping: 22,
									},
									y: {
										type: "spring",
										stiffness: 180,
										damping: 22,
									},
									opacity: {
										duration: 0.4,
										delay: prefersReducedMotion
											? 0
											: i * 0.08,
										ease: EASE,
									},
								}}
							>
								<motion.button
									type="button"
									onClick={() => toggle(topic.slug)}
									aria-pressed={isSelected}
									className={cn(
										"group relative flex h-full w-full cursor-pointer flex-col items-center justify-center gap-1.5 rounded-2xl border-2 p-3 text-center outline-none",
										"focus-visible:ring-2 focus-visible:ring-minuri-teal/50 focus-visible:ring-offset-2",
										isSelected
											? "shadow-[0_12px_32px_-8px_rgba(2,24,25,0.30)] ring-[2.5px] ring-[#05292a]/25 ring-offset-2"
											: "shadow-md hover:shadow-lg",
									)}
									style={{
										backgroundColor: visual.heroBg,
										borderColor: visual.heroBg,
									}}
									animate={{
										y: !isSelected
											? [0, -FLOAT_AMP[i], 0]
											: 0,
									}}
									transition={
										!isSelected
											? {
													duration: FLOAT_DUR[i],
													repeat: Infinity,
													ease: "easeInOut",
													delay: FLOAT_DEL[i],
												}
											: { duration: 0.4, ease: EASE }
									}
									whileTap={{
										scale: prefersReducedMotion ? 1 : 0.95,
									}}
								>
									{isSelected && (
										<div
											className="absolute right-2 top-2 flex size-5 items-center justify-center rounded-full bg-[#05292a]"
											aria-hidden
										>
											<Check
												className="size-3 text-white"
												strokeWidth={3}
											/>
										</div>
									)}
									<Icon
										className="size-11 shrink-0 text-[#05292a]"
										aria-hidden
									/>
									<p className="text-base font-bold leading-tight text-[#05292a]">
										{topic.name}
									</p>
									<p className="text-xs font-medium text-[#05292a]/60">
										{count} guides
									</p>
								</motion.button>
							</motion.div>
						);
					})}
				</div>

				{/* Mobile — grid */}
				<div className="md:hidden">
					<div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
						{GUIDE_TOPICS.map((topic, i) => {
							const visual = TOPIC_VISUALS[topic.slug];
							const Icon = visual.icon;
							const isSelected = selected.has(topic.slug);
							const count = guideCounts.get(topic.slug) ?? 0;

							return (
								<motion.button
									key={topic.slug}
									type="button"
									onClick={() => toggle(topic.slug)}
									aria-pressed={isSelected}
									className={cn(
										"group relative flex min-h-[10rem] flex-col gap-3 rounded-2xl border p-5 text-left outline-none",
										"focus-visible:ring-2 focus-visible:ring-minuri-teal/50 focus-visible:ring-offset-2 focus-visible:ring-offset-minuri-white",
										isSelected
											? "ring-[2.5px] ring-[#05292a]/30 ring-offset-2 shadow-[0_16px_32px_-12px_rgba(2,24,25,0.28)]"
											: "hover:shadow-sm",
									)}
									style={{
										backgroundColor: visual.heroBg,
										borderColor: visual.heroBg,
									}}
									initial={{
										opacity: 0,
										y: prefersReducedMotion ? 0 : 20,
									}}
									animate={{
										opacity: 1,
										y: 0,
										scale:
											isSelected && !prefersReducedMotion
												? 1.03
												: 1,
									}}
									transition={{
										opacity: {
											duration: 0.45,
											delay: prefersReducedMotion
												? 0
												: i * 0.07,
											ease: EASE,
										},
										y: {
											duration: 0.45,
											delay: prefersReducedMotion
												? 0
												: i * 0.07,
											ease: EASE,
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
										scale: prefersReducedMotion ? 1 : 0.97,
									}}
								>
									<div
										className={cn(
											"absolute right-3 top-3 flex size-5 items-center justify-center rounded-full border-2 transition-all duration-200",
											isSelected
												? "border-[#05292a] bg-[#05292a]"
												: "border-[#05292a]/30 bg-white/20",
										)}
										aria-hidden
									>
										{isSelected && (
											<Check
												className="size-3 text-white"
												strokeWidth={3}
											/>
										)}
									</div>
									<Icon
										className="size-9 shrink-0 text-[#05292a] transition-transform duration-200 group-hover:scale-110"
										aria-hidden
									/>
									<div className="flex-1">
										<h3 className="font-semibold leading-tight text-[#05292a]">
											{topic.name}
										</h3>
										<p className="mt-1 text-xs leading-snug text-[#163a3a]">
											{visual.description}
										</p>
									</div>
									<span className="mt-auto text-xs font-semibold text-[#05292a]">
										{count}{" "}
										{count === 1 ? "guide" : "guides"}
									</span>
								</motion.button>
							);
						})}
					</div>

					{/* Mobile CTA */}
					<div className="mt-8 flex flex-col items-center gap-3">
						<motion.button
							type="button"
							onClick={handleExplore}
							disabled={selected.size === 0}
							className={cn(
								"inline-flex min-h-12 items-center gap-2 rounded-full px-8 text-sm font-semibold transition-all duration-300",
								selected.size > 0
									? "cursor-pointer bg-minuri-teal text-white shadow-lg hover:shadow-xl"
									: "cursor-not-allowed bg-minuri-silver/40 text-minuri-slate",
							)}
							whileHover={{
								scale:
									selected.size > 0 && !prefersReducedMotion
										? 1.05
										: 1,
							}}
							whileTap={{
								scale:
									selected.size > 0 && !prefersReducedMotion
										? 0.97
										: 1,
							}}
							transition={{ duration: 0.12, ease: EASE }}
						>
							{selected.size === 0 ? (
								"Select a topic to continue"
							) : (
								<>
									Explore {totalSelected}{" "}
									{totalSelected === 1 ? "guide" : "guides"}
									<ArrowRight
										className="size-4"
										aria-hidden
									/>
								</>
							)}
						</motion.button>
					</div>
				</div>
			</div>

			{/* ── Divider ── */}
			<div className="mx-auto max-w-screen-2xl mt-12 px-6 py-6">
				<div className="flex items-center gap-4">
					<div className="h-px flex-1 bg-minuri-silver/60" />
					<span className="text-sm font-semibold uppercase tracking-[0.14em] text-minuri-mid">
						or follow a journey
					</span>
					<div className="h-px flex-1 bg-minuri-silver/60" />
				</div>
			</div>

			{/* ── Persona grid ── */}
			<div className="mx-auto max-w-screen-2xl px-2 pb-16">
				<div className="mb-6">
					<p className="text-sm text-minuri-slate">
						Choose someone like you — we&apos;ll open their curated
						week of guides.
					</p>
				</div>
				<div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-2 lg:grid-cols-6">
					{PERSONAS.map((persona, i) => (
						<motion.div
							key={persona.id}
							initial={{
								opacity: 0,
								y: prefersReducedMotion ? 0 : 14,
							}}
							animate={
								(activating && activating.id !== persona.id) ||
								(selectedPersona &&
									selectedPersona.id !== persona.id)
									? {
											opacity: 0,
											scale: 0.93,
											y: 0,
											filter: "blur(6px)",
										}
									: activating?.id === persona.id
										? {
												opacity: 1,
												scale: 1.05,
												y: -8,
												filter: "blur(0px)",
											}
										: {
												opacity: 1,
												y: 0,
												scale: 1,
												filter: "blur(0px)",
											}
							}
							transition={
								activating || selectedPersona
									? { duration: 0.28, ease: EASE }
									: {
											duration: 0.4,
											delay: prefersReducedMotion
												? 0
												: 0.28 + i * 0.06,
											ease: EASE,
										}
							}
						>
							<motion.button
								type="button"
								onClick={() => handlePersonaClick(persona)}
								className={cn(
									"group relative block w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-minuri-teal/50",
									activating?.id !== persona.id
										? "overflow-hidden"
										: "",
								)}
								style={{ borderRadius: 16 }}
								whileHover={
									activating?.id !== persona.id &&
									!prefersReducedMotion
										? { borderRadius: 32 }
										: {}
								}
								transition={{
									duration: 0.5,
									ease: [0.22, 1, 0.36, 1],
								}}
							>
								<div className="relative aspect-[2/3]">
									<motion.div
										layoutId={`persona-photo-${persona.id}`}
										className="absolute inset-0"
										style={{ borderRadius: 16 }}
										transition={{
											duration: 0.68,
											ease: [0.22, 1, 0.36, 1],
										}}
									>
										<Image
											src={persona.imageUrl}
											alt={persona.name}
											fill
											sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
											className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
										/>
									</motion.div>

									{/* Name + role */}
									<div
										className={cn(
											"pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-transparent px-3 py-3 text-left transition-opacity duration-100 sm:px-4 sm:py-4",
											activating?.id === persona.id &&
												"opacity-0",
										)}
									>
										<p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-white/70 sm:text-[10px]">
											[{persona.role}]
										</p>
										<p className="mt-0.5 text-xs font-bold leading-snug text-white sm:text-sm">
											{persona.name}
										</p>
									</div>
								</div>
							</motion.button>
						</motion.div>
					))}
				</div>
			</div>

			{/* Persona fullscreen overlay — mounted on this page, no navigation */}
			<AnimatePresence>
				{selectedPersona && (
					<PersonaDetailFullscreen
						key={selectedPersona.id}
						persona={selectedPersona}
						onBack={handlePersonaBack}
					/>
				)}
			</AnimatePresence>
		</div>
	);
}
