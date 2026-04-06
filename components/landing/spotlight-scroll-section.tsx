"use client";

import Link from "next/link";
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
		title: "Start with practical guides",
		body: "First-time guidance for uni life, renting, and daily routines so independent living in Melbourne feels manageable from day one.",
		href: "#flow",
		linkLabel: "Browse guide topics",
		visual: "mist",
	},
	{
		icon: BookOpen,
		title: "Plain language, local context",
		body: "Guides are written for Alex, Chloe, and Jordan-style transitions: uni, first rental, and first full-time job in a new suburb.",
		href: "#flow",
		linkLabel: "Explore the library",
		visual: "fog",
	},
	{
		icon: Activity,
		title: "Two clear actions",
		body: "Use one of two homepage paths: Browse First Time Guides or Find Services Near Me. No setup friction, no heavy onboarding.",
		href: "/guides",
		linkLabel: "Go to guides",
		visual: "seafoam",
	},
	{
		icon: UsersRound,
		title: "Melbourne-first support",
		body: "Homepage messaging is grounded in local context and open data so new residents can make decisions faster with less guesswork.",
		href: "/near-me",
		linkLabel: "Find services nearby",
		visual: "ocean",
	},
];

/** Large display title: muted base + teal “highlight” sweep (cf. Services wordmark). */
function SpotlightWordmark({ reduce }: { reduce: boolean }) {
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
				Wellbeing
			</motion.span>
		</motion.div>
	);
}

function CardVisual({ kind }: { kind: VisualKind }) {
	const base =
		"relative mt-5 h-52 w-full overflow-hidden rounded-xl md:mt-6 md:h-64";
	const layers: Record<VisualKind, string> = {
		mist: "bg-[radial-gradient(ellipse_at_30%_20%,color-mix(in_oklch,var(--minuri-teal)_22%,transparent)_0%,transparent_55%),linear-gradient(145deg,color-mix(in_oklch,var(--minuri-mist)_65%,var(--minuri-white))_0%,var(--minuri-white)_45%,color-mix(in_oklch,var(--minuri-seafoam)_35%,var(--minuri-white))_100%)]",
		fog: "bg-[linear-gradient(165deg,color-mix(in_oklch,var(--minuri-fog)_40%,var(--minuri-white))_0%,var(--minuri-white)_50%,color-mix(in_oklch,var(--minuri-mid)_12%,var(--minuri-white))_100%)]",
		seafoam:
			"bg-[radial-gradient(circle_at_80%_80%,color-mix(in_oklch,var(--minuri-teal)_28%,transparent)_0%,transparent_50%),linear-gradient(135deg,var(--minuri-white)_0%,color-mix(in_oklch,var(--minuri-seafoam)_45%,var(--minuri-white))_100%)]",
		ocean: "bg-[radial-gradient(ellipse_at_50%_120%,color-mix(in_oklch,var(--minuri-teal)_35%,transparent)_0%,transparent_55%),linear-gradient(180deg,var(--minuri-ocean)_0%,color-mix(in_oklch,var(--minuri-mid)_85%,var(--minuri-ocean))_100%)]",
	};
	return (
		<div className={cn(base, layers[kind])} aria-hidden>
			<div
				className="absolute inset-0 opacity-[0.35]"
				style={{
					backgroundImage:
						"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
				}}
			/>
			{kind === "ocean" && (
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,color-mix(in_oklch,var(--minuri-ice)_25%,transparent)_0%,transparent_65%)]" />
			)}
		</div>
	);
}

export function SpotlightScrollSection() {
	const reduce = useReducedMotion();

	return (
		<section
			id="spotlight"
			className="relative isolate scroll-mt-24 overflow-x-clip bg-minuri-white pt-26 pb-20 md:scroll-mt-28 md:pt-34 md:pb-28"
			aria-labelledby="spotlight-heading"
		>
			{/*
			  Grid overlay: sticky layer + content share one cell so row height = cards.
			  Watermark stays pinned (top-0, h-screen) until the section scrolls away after the last card.

			  First viewport: mostly the “Spotlight” display type; intro + module cards follow after scroll.
			*/}
			<div className="grid grid-cols-1">
				<div
					className="pointer-events-none sticky top-0 z-1 col-start-1 row-start-1 flex h-screen w-full max-w-none items-center justify-center self-start px-0"
					aria-hidden
				>
					<SpotlightWordmark reduce={reduce ?? false} />
				</div>

				<div className="relative z-10 col-start-1 row-start-1 mx-auto w-full max-w-6xl px-5 md:px-8">
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
											Closer look
										</p>
										<h2
											id="spotlight-heading"
											className="mt-3 text-xl font-semibold tracking-tight text-foreground md:text-2xl"
										>
											Four ways Minuri helps you start.
										</h2>
									</div>
								</div>
								<p className="mt-5 text-sm leading-relaxed text-minuri-slate md:mt-6 md:text-[0.9375rem]">
									Scroll for the core homepage message before
									choosing your next action.
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
									Let's Get Start
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
