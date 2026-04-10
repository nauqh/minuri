"use client";

import Link from "next/link";
import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import {
	Activity,
	BookOpen,
	HeartPulse,
	Sparkles,
	UsersRound,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

const easeOut = [0.22, 1, 0.36, 1] as const;

type VisualKind = "mist" | "ocean" | "seafoam" | "fog";

const cards: {
	icon: LucideIcon;
	title: string;
	body: string;
	href: string;
	linkLabel: string;
	visual: VisualKind;
}[] = [
	{
		icon: HeartPulse,
		title: "Where we started",
		body: "We built Minuri because moving into independent life — uni, a first lease, a new job — can feel isolating. We wanted one calm place that acknowledges that reality and points you toward practical next steps, not generic advice.",
		href: "#flow",
		linkLabel: "See how guides help",
		visual: "mist",
	},
	{
		icon: BookOpen,
		title: "Who we’re here for",
		body: "If you’re new to Melbourne or going through a big change, this is for you. We write in plain language about real situations: renting, study, work, and staying connected — so you’re not decoding jargon when you already have enough on your plate.",
		href: "#flow",
		linkLabel: "Browse the library",
		visual: "fog",
	},
	{
		icon: Activity,
		title: "What we believe",
		body: "Help should feel reachable, not like another project. That’s why the homepage stays simple: browse first-time guides or find services near you — no long onboarding or pressure to “do everything at once.”",
		href: "/guides",
		linkLabel: "Go to guides",
		visual: "seafoam",
	},
	{
		icon: UsersRound,
		title: "Why this matters",
		body: "Starting independent life often means figuring out everything at once — housing, study or work, money, and support — while information is scattered and overwhelming. Our problem statement is simple: people need one clear, local starting point that turns uncertainty into practical next steps.",
		href: "/near-me",
		linkLabel: "Find services nearby",
		visual: "ocean",
	},
];

/** Large display title: muted base + teal “highlight” sweep (cf. Services wordmark). */
function OurStoryWordmark({ reduce }: { reduce: boolean }) {
	const gradient =
		"linear-gradient(90deg, color-mix(in oklch, var(--minuri-silver) 88%, var(--minuri-white)) 0%, color-mix(in oklch, var(--minuri-silver) 72%, var(--minuri-fog)) 10%, var(--minuri-teal) 24%, color-mix(in oklch, var(--minuri-teal) 92%, var(--minuri-seafoam)) 100%)";

	return (
		<motion.div
			className="flex w-full max-w-[100vw] select-none items-baseline justify-center px-3 pb-16 pt-4 md:pb-20 md:pt-6"
			initial={reduce ? false : { opacity: 0.92 }}
			animate={{ opacity: 1 }}
			transition={{ duration: reduce ? 0 : 0.45, ease: easeOut }}
		>
			<motion.span
				className="inline-block bg-clip-text pb-[0.12em] pt-[0.06em] font-sans text-[clamp(3.75rem,20vw,24rem)] font-bold leading-[0.92] tracking-[-0.055em] text-transparent md:text-[clamp(4.25rem,22vw,26rem)]"
				style={{
					backgroundImage: gradient,
					backgroundSize: reduce ? "100% 100%" : "220% 100%",
					backgroundPosition: reduce ? "0% 50%" : undefined,
					WebkitBackgroundClip: "text",
					backgroundClip: "text",
				}}
				initial={reduce ? false : { backgroundPositionX: "88%" }}
				animate={reduce ? undefined : { backgroundPositionX: "0%" }}
				transition={{
					duration: reduce ? 0 : 1.35,
					ease: easeOut,
				}}
				aria-hidden
			>
				Our story
			</motion.span>
		</motion.div>
	);
}

function CardVisual({ kind }: { kind: VisualKind }) {
	const base =
		"relative mt-5 h-64 w-full overflow-hidden rounded-xl md:mt-6 md:h-80";
	const images: Record<VisualKind, { src: string; alt: string }> = {
		mist: {
			src: "where-we-start.svg",
			alt: "Starting out with Minuri",
		},
		fog: {
			src: "/who-we-for.svg",
			alt: "Readers and everyday life",
		},
		seafoam: {
			src: "/what-we-believe.svg",
			alt: "Simple choices on the homepage",
		},
		ocean: {
			src: "/why-this-matter.svg",
			alt: "Community and place in Melbourne",
		},
	};
	return (
		<div
			className={cn(
				base,
				"border border-minuri-silver/60 bg-minuri-fog/35",
			)}
		>
			<div className="relative h-full w-full overflow-hidden rounded-lg bg-minuri-white/70">
				<Image
					src={images[kind].src}
					alt={images[kind].alt}
					fill
					className="object-contain"
					sizes="(max-width: 768px) 90vw, 640px"
				/>
			</div>
		</div>
	);
}

export function SpotlightScrollSection() {
	const reduce = useReducedMotion();

	return (
		<section
			id="our-story"
			className="relative isolate scroll-mt-24 overflow-x-clip bg-minuri-white pt-26 pb-20 md:scroll-mt-28 md:pt-34 md:pb-28"
			aria-labelledby="our-story-heading"
		>
			{/*
			  Grid overlay: sticky layer + content share one cell so row height = cards.
			  Watermark stays pinned (top-0, h-screen) until the section scrolls away after the last card.

			  First viewport: large “Our story” display type; intro + module cards follow after scroll.
			*/}
			<div className="grid grid-cols-1">
				<div
					className="pointer-events-none sticky top-0 z-1 col-start-1 row-start-1 flex h-screen w-full max-w-none items-center justify-center self-start px-0"
					aria-hidden
				>
					<OurStoryWordmark reduce={reduce ?? false} />
				</div>

				<div className="relative z-10 col-start-1 row-start-1 mx-auto w-full max-w-2xl px-5 md:px-8">
					{/* Reserve ~one screen so the watermark reads before cards enter */}
					<div
						className="min-h-[min(92svh,56rem)] w-full"
						aria-hidden
					/>

					{/* Slightly narrower than page grid so watermark reads large; still wider than pill nav */}
					<div
						className="mx-auto flex w-full max-w-xl flex-col gap-10 sm:max-w-2xl"
						role="list"
					>
						<motion.article
							role="listitem"
							className="w-full"
							initial={reduce ? false : { opacity: 0, y: 96 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{
								once: true,
								margin: "0% 0px -12% 0px",
								amount: 0.2,
							}}
							transition={{
								duration: reduce ? 0 : 0.65,
								delay: 0,
								ease: easeOut,
							}}
						>
							<div
								className={cn(
									"rounded-[1.5rem] border border-minuri-silver/45 bg-minuri-white p-6 shadow-[0_20px_50px_-44px_color-mix(in_oklch,var(--minuri-mid)_22%,transparent)] md:rounded-[1.75rem] md:p-8",
								)}
							>
								<div className="flex flex-col gap-2.5 sm:flex-row sm:items-start sm:gap-3">
									<span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-minuri-teal/15 text-minuri-mid md:size-11">
										<Sparkles
											className="size-4 md:size-5"
											strokeWidth={1.75}
											aria-hidden
										/>
									</span>
									<div className="min-w-0 flex-1">
										<p className="text-xs font-medium tracking-[0.22em] text-minuri-teal">
											For new visitors
										</p>
										<h2
											id="our-story-heading"
											className="mt-3 text-xl font-semibold tracking-tight text-foreground md:text-2xl"
										>
											Here’s our story — and why Minuri
											exists.
										</h2>
									</div>
								</div>
								<p className="mt-5 text-sm leading-relaxed text-minuri-slate md:mt-6 md:text-[0.9375rem]">
									Scroll to learn who we’re for, what we
									believe, and how we help you take a clear
									first step.
								</p>
							</div>
						</motion.article>

						{cards.map((card, i) => {
							const Icon = card.icon;
							return (
								<motion.article
									key={card.title}
									role="listitem"
									className="w-full"
									initial={
										reduce ? false : { opacity: 0, y: 96 }
									}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{
										once: true,
										margin: "0% 0px -12% 0px",
										amount: 0.2,
									}}
									transition={{
										duration: reduce ? 0 : 0.65,
										delay: reduce ? 0 : (i + 1) * 0.06,
										ease: easeOut,
									}}
								>
									<div
										className={cn(
											"flex min-h-104 flex-col rounded-[1.5rem] border border-minuri-silver/45 bg-minuri-white p-6 shadow-[0_20px_50px_-44px_color-mix(in_oklch,var(--minuri-mid)_22%,transparent)] sm:min-h-112 md:min-h-120 md:rounded-[1.75rem] md:p-8",
										)}
									>
										<div className="flex flex-col gap-2.5 sm:flex-row sm:items-start sm:gap-3">
											<span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-minuri-teal/15 text-minuri-mid md:size-11">
												<Icon
													className="size-4 md:size-5"
													strokeWidth={1.75}
													aria-hidden
												/>
											</span>
											<h3 className="text-lg font-semibold leading-snug tracking-tight text-foreground md:text-xl">
												{card.title}
											</h3>
										</div>
										<CardVisual kind={card.visual} />
										<p className="mt-5 flex-1 text-sm leading-relaxed text-minuri-slate md:mt-6 md:text-[0.9375rem]">
											{card.body}
										</p>
										<Link
											href={card.href}
											className="mt-6 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-minuri-teal transition-colors hover:text-minuri-mid md:mt-8"
										>
											{card.linkLabel}
											<span aria-hidden>→</span>
										</Link>
									</div>
								</motion.article>
							);
						})}

						<motion.div
							className="w-full"
							initial={reduce ? false : { opacity: 0, y: 72 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{
								once: true,
								margin: "0% 0px -12% 0px",
								amount: 0.2,
							}}
							transition={{
								duration: reduce ? 0 : 0.55,
								delay: reduce ? 0 : 0.24,
								ease: easeOut,
							}}
						>
							<div className="group relative block h-19 w-full overflow-hidden rounded-[1.25rem] border border-minuri-silver/60 bg-[linear-gradient(120deg,color-mix(in_oklch,var(--minuri-seafoam)_58%,var(--minuri-teal))_0%,color-mix(in_oklch,var(--minuri-teal)_78%,var(--minuri-seafoam))_100%)] shadow-[0_18px_34px_-26px_color-mix(in_oklch,var(--minuri-mid)_38%,transparent)] transition-[background,box-shadow,transform] duration-650 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-minuri-white hover:bg-none hover:border-minuri-silver/80 hover:shadow-[0_20px_38px_-30px_color-mix(in_oklch,var(--minuri-mid)_28%,transparent)] focus-visible:bg-minuri-white focus-visible:bg-none focus-visible:border-minuri-silver/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-minuri-teal/65 focus-visible:ring-offset-2 focus-visible:ring-offset-minuri-white motion-reduce:transition-none">
								<span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[clamp(1.45rem,3.4vw,1.85rem)] tracking-[-0.04em] text-minuri-white transition-all duration-650 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:left-8 group-hover:translate-x-0 group-hover:text-foreground group-focus-visible:left-8 group-focus-visible:translate-x-0 group-focus-visible:text-foreground motion-reduce:transition-none">
									Let&apos;s Get Start
								</span>
								<span className="absolute right-4 top-1/2 -translate-y-1/2">
									<button
										type="button"
										className="pointer-events-auto inline-flex cursor-pointer items-center rounded-full border border-minuri-silver/60 bg-[linear-gradient(120deg,color-mix(in_oklch,var(--minuri-seafoam)_58%,var(--minuri-teal))_0%,color-mix(in_oklch,var(--minuri-teal)_78%,var(--minuri-seafoam))_100%)] px-5 py-2.5 text-sm font-semibold tracking-tight text-minuri-white opacity-0 shadow-[0_12px_20px_-14px_color-mix(in_oklch,var(--minuri-mid)_45%,transparent)] transition-all duration-650 ease-[cubic-bezier(0.22,1,0.36,1)] translate-y-[140%] scale-90 group-hover:translate-y-0 group-hover:scale-[1.08] group-hover:opacity-100 hover:scale-[1.12] focus-visible:scale-[1.12] motion-reduce:transition-none"
										aria-label="Create your account"
									>
										Create your account
									</button>
								</span>
							</div>
						</motion.div>
					</div>
				</div>
			</div>
		</section>
	);
}
