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

export function GuidesIntroView() {
	const router = useRouter();
	const prefersReducedMotion = useReducedMotion();
	const [selected, setSelected] = useState<Set<GuideTopicSlug>>(new Set());
	const [activating, setActivating] = useState<Persona | null>(null);
	const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);

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
					Tap a topic below to select it — we&apos;ll open those guides first.
				</motion.p>
			</div>

			{/* ── Topic cards ── */}
			<div className="mx-auto max-w-screen-2xl px-6 pb-8">
				<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 lg:gap-6">
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
									scale: isSelected && !prefersReducedMotion ? 1.03 : 1,
								}}
								transition={{
									opacity: { duration: 0.45, delay: prefersReducedMotion ? 0 : i * 0.07, ease: EASE },
									y: { duration: 0.45, delay: prefersReducedMotion ? 0 : i * 0.07, ease: EASE },
									scale: { type: "spring", stiffness: 380, damping: 26 },
								}}
								whileHover={{
									scale: prefersReducedMotion ? 1 : isSelected ? 1.03 : 1.02,
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
										<Check className="size-3 text-white" strokeWidth={3} />
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
									{count} {count === 1 ? "guide" : "guides"}
								</span>
							</motion.button>
						);
					})}
				</div>

				{/* ── CTA ── */}
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
						transition={{
							duration: 0.12,
							ease: [0.22, 1, 0.36, 1],
						}}
					>
						{selected.size === 0 ? (
							"Select a topic to continue"
						) : (
							<>
								Explore {totalSelected}{" "}
								{totalSelected === 1 ? "guide" : "guides"}
								<ArrowRight className="size-4" aria-hidden />
							</>
						)}
					</motion.button>

					<button
						type="button"
						onClick={handleSkip}
						className="text-xs text-minuri-slate transition-colors hover:text-minuri-ocean"
					>
						or browse all guides
					</button>
				</div>
			</div>

			{/* ── Divider ── */}
			<div className="mx-auto max-w-screen-2xl px-6 py-6">
				<div className="flex items-center gap-4">
					<div className="h-px flex-1 bg-minuri-silver/60" />
					<span className="text-xs font-semibold uppercase tracking-[0.14em] text-minuri-mid">
						or follow a journey
					</span>
					<div className="h-px flex-1 bg-minuri-silver/60" />
				</div>
			</div>

			{/* ── Persona grid ── */}
			<div className="mx-auto max-w-screen-2xl px-6 pb-16">
				<div className="mb-6 flex items-end justify-between">
					<p className="text-sm text-minuri-slate">
						Choose someone like you — we&apos;ll open their curated
						week of guides.
					</p>
					<Link
						href="/guides/journeys"
						className="shrink-0 text-xs font-medium text-minuri-teal transition-colors hover:text-minuri-ocean"
					>
						Browse all →
					</Link>
				</div>
				<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5">
					{PERSONAS.map((persona, i) => (
						<motion.div
							key={persona.id}
							initial={{
								opacity: 0,
								y: prefersReducedMotion ? 0 : 14,
							}}
							animate={
								(activating && activating.id !== persona.id) || (selectedPersona && selectedPersona.id !== persona.id)
									? { opacity: 0, scale: 0.93, y: 0, filter: "blur(6px)" }
									: activating?.id === persona.id
										? { opacity: 1, scale: 1.05, y: -8, filter: "blur(0px)" }
										: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }
							}
							transition={
								activating || selectedPersona
									? { duration: 0.28, ease: EASE }
									: {
											duration: 0.4,
											delay: prefersReducedMotion ? 0 : 0.28 + i * 0.06,
											ease: EASE,
										}
							}
						>
							<button
								type="button"
								onClick={() => handlePersonaClick(persona)}
								className={cn(
									"group relative block w-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-minuri-teal/50",
									activating?.id !== persona.id && "overflow-hidden",
								)}
							>
								<div className="relative aspect-[3/4]">
									{/* Image — layoutId for shared-element morph into fullscreen */}
									<motion.div
										layoutId={`persona-photo-${persona.id}`}
										className="absolute inset-0"
										style={{ borderRadius: 16 }}
										transition={{ duration: 0.68, ease: [0.22, 1, 0.36, 1] }}
									>
										<Image
											src={persona.imageUrl}
											alt={persona.name}
											fill
											sizes="(max-width: 640px) 50vw, 33vw"
											className="object-cover"
										/>
									</motion.div>

									{/* Overlays — fade out instantly when this card activates */}
									<div
									className={cn(
										"pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/15 transition-opacity duration-100",
										activating?.id === persona.id && "opacity-0",
									)}
									>
										{/* Top: role badge + age · origin */}
										<div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3 sm:p-4">
											<span className="rounded-full border border-white/25 bg-white/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.13em] text-white backdrop-blur-sm sm:text-xs">
												{persona.role}
											</span>
											<span className="text-[10px] tabular-nums text-white/55 sm:text-xs">
												{persona.age} · {persona.origin}
											</span>
										</div>

										{/* Bottom: name + tagline + reveal */}
										<div className="absolute inset-x-0 bottom-0 p-3 sm:p-5">
											<h3
												className="text-left text-xl font-bold leading-tight text-white sm:text-2xl"
												style={{
													fontFamily: "var(--font-hero-serif)",
												}}
											>
												{persona.name}
											</h3>
											<p className="mt-1.5 line-clamp-2 text-left text-xs italic leading-snug text-white/80 sm:text-sm">
												&ldquo;{persona.tagline}&rdquo;
											</p>

											{/* Situation + CTA — slides in on hover */}
											<div className="mt-0 max-h-0 overflow-hidden opacity-0 transition-all duration-300 ease-out group-hover:mt-3 group-hover:max-h-32 group-hover:opacity-100">
												<p className="line-clamp-3 text-left text-xs leading-relaxed text-white/70 sm:text-sm">
													{persona.situation}
												</p>
											</div>
										</div>
									</div>
								</div>
							</button>
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
