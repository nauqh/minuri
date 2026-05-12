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
import { PERSONAS } from "@/content/personas";
import { cn } from "@/lib/utils";

type TopicVisual = {
	icon: LucideIcon;
	heroBg: string;  // bright card color from landing hero
	accent: string;  // icon/badge color when unselected
	description: string;
};

const TOPIC_VISUALS: Record<GuideTopicSlug, TopicVisual> = {
	"food-eating": {
		icon: Sandwich,
		heroBg: "#00f5c8",
		accent: "#007a64",
		description: "Eat well on any budget",
	},
	"getting-around": {
		icon: Compass,
		heroBg: "#5dd6ff",
		accent: "#0077a8",
		description: "Navigate the city with confidence",
	},
	"health-wellbeing": {
		icon: HeartPulse,
		heroBg: "#fcf300",
		accent: "#7a7100",
		description: "Stay healthy and supported",
	},
	"home-admin": {
		icon: Home,
		heroBg: "#ffc2d1",
		accent: "#b04070",
		description: "Handle rent, bills and admin",
	},
	"social-belonging": {
		icon: Users,
		heroBg: "#cae9ff",
		accent: "#2a6fa8",
		description: "Build connections from scratch",
	},
};

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function GuidesIntroView() {
	const router = useRouter();
	const prefersReducedMotion = useReducedMotion();
	const [selected, setSelected] = useState<Set<GuideTopicSlug>>(new Set());

	const guideCounts = new Map(
		GUIDE_TOPICS.map((t) => [t.slug, GUIDES.filter((g) => g.topic === t.slug).length]),
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

	return (
		<div
			className="min-h-screen"
			style={{ backgroundColor: "#faf9f7" }}
		>
			{/* ── Header ── */}
			<div className="mx-auto flex max-w-screen-2xl items-center justify-between px-6 py-4">
				<Link
					href="/"
					className="inline-flex items-center gap-2 rounded-full border border-minuri-silver/80 bg-white px-3.5 py-1.5 text-xs font-medium text-minuri-slate transition-transform hover:scale-105"
				>
					<ArrowLeft className="size-3.5" aria-hidden />
					Back to home
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
			<div className="mx-auto max-w-screen-2xl px-6 pb-10 pt-6 text-center">
				<motion.span
					className="landing-section-kicker"
					initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 8 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4, ease: EASE }}
				>
					First-time guides
				</motion.span>

				<motion.h1
					className="mt-4 text-4xl font-black uppercase tracking-tight text-minuri-ocean md:text-5xl lg:text-6xl"
					style={{ fontFamily: "var(--font-hero-serif)" }}
					initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 16 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.06, ease: EASE }}
				>
					What do you need
					<br />
					<span className="text-minuri-teal">most right now?</span>
				</motion.h1>

				<motion.p
					className="mx-auto mt-4 max-w-md text-sm font-medium text-minuri-slate"
					initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4, delay: 0.16, ease: EASE }}
				>
					Pick one or more topics. We&apos;ll open those guides first.
				</motion.p>
			</div>

			{/* ── Topic cards ── */}
			<div className="mx-auto max-w-screen-2xl px-6 pb-8">
				<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-4">
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
									"group relative flex min-h-[10rem] flex-col gap-3 rounded-2xl border-2 p-5 text-left outline-none transition-shadow duration-200",
									"focus-visible:ring-2 focus-visible:ring-minuri-teal/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#faf9f7]",
									isSelected
										? "shadow-md"
										: "border-minuri-silver/50 bg-white hover:border-minuri-silver hover:shadow-sm",
								)}
								style={
									isSelected
										? {
												backgroundColor: visual.heroBg,
												borderColor: "#05292a30",
												boxShadow: `0 6px 28px -6px ${visual.heroBg}cc`,
											}
										: undefined
								}
								initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{
									duration: 0.45,
									delay: prefersReducedMotion ? 0 : i * 0.07,
									ease: EASE,
								}}
								whileHover={{ scale: prefersReducedMotion ? 1 : 1.02 }}
								whileTap={{ scale: prefersReducedMotion ? 1 : 0.97 }}
							>
								{/* Checkmark badge */}
								<AnimatePresence>
									{isSelected && (
										<motion.div
											className="absolute right-3 top-3 flex size-6 items-center justify-center rounded-full"
											style={{ backgroundColor: "#05292a" }}
											initial={{ scale: 0, opacity: 0 }}
											animate={{ scale: 1, opacity: 1 }}
											exit={{ scale: 0, opacity: 0 }}
											transition={{ type: "spring", stiffness: 420, damping: 22 }}
										>
											<Check className="size-3.5 text-white" strokeWidth={2.5} aria-hidden />
										</motion.div>
									)}
								</AnimatePresence>

								<Icon
									className="size-9 shrink-0 transition-transform duration-200 group-hover:scale-110"
									style={{ color: isSelected ? "#05292a" : visual.accent }}
									aria-hidden
								/>

								<div className="flex-1">
									<h3
										className="font-semibold leading-tight text-minuri-ocean"
										style={{ color: isSelected ? "#05292a" : undefined }}
									>
										{topic.name}
									</h3>
									<p
										className="mt-1 text-xs leading-snug text-minuri-slate"
										style={{ color: isSelected ? "#05292ab0" : undefined }}
									>
										{visual.description}
									</p>
								</div>

								<span
									className="mt-auto text-xs font-semibold"
									style={{ color: isSelected ? "#05292a" : visual.accent }}
								>
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
						whileHover={{ scale: selected.size > 0 && !prefersReducedMotion ? 1.05 : 1 }}
						whileTap={{ scale: selected.size > 0 && !prefersReducedMotion ? 0.97 : 1 }}
						transition={{ duration: 0.12, ease: [0.22, 1, 0.36, 1] }}
					>
						{selected.size === 0 ? (
							"Select a topic to continue"
						) : (
							<>
								Explore {totalSelected} {totalSelected === 1 ? "guide" : "guides"}
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
						Choose someone like you — we&apos;ll open their curated week of guides.
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
							initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 14 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{
								duration: 0.4,
								delay: prefersReducedMotion ? 0 : 0.28 + i * 0.06,
								ease: EASE,
							}}
						>
							<Link
								href={`/guides/journeys?persona=${persona.id}`}
								className="group relative block overflow-hidden rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-minuri-teal/50"
							>
								<div className="relative aspect-[3/4]">
									<Image
										src={persona.imageUrl}
										alt={persona.name}
										fill
										sizes="(max-width: 640px) 50vw, 33vw"
										className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
									/>

									{/* Base gradient */}
									<div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />
									{/* Extra darkness on hover */}
									<div className="absolute inset-0 bg-black/0 transition-[background-color] duration-300 group-hover:bg-black/15" />

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
											className="text-xl font-bold leading-tight text-white sm:text-2xl"
											style={{ fontFamily: "var(--font-hero-serif)" }}
										>
											{persona.name}
										</h3>
										<p className="mt-1.5 line-clamp-2 text-xs italic leading-snug text-white/80 sm:text-sm">
											&ldquo;{persona.tagline}&rdquo;
										</p>

										{/* Situation + CTA — slides in on hover */}
										<div className="mt-0 max-h-0 overflow-hidden opacity-0 transition-all duration-300 ease-out group-hover:mt-3 group-hover:max-h-32 group-hover:opacity-100">
											<p className="line-clamp-3 text-xs leading-relaxed text-white/70 sm:text-sm">
												{persona.situation}
											</p>
											<p className="mt-2 flex items-center gap-1 text-xs font-semibold text-white sm:text-sm">
												Follow journey
												<ArrowRight className="size-3.5" aria-hidden />
											</p>
										</div>
									</div>
								</div>
							</Link>
						</motion.div>
					))}
				</div>
			</div>
		</div>
	);
}
