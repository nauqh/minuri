"use client";

import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import { Activity, BookOpen, HeartPulse, UsersRound } from "lucide-react";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";

const easeOut = [0.22, 1, 0.36, 1] as const;

const cards: {
	icon: LucideIcon;
	title: string;
	body: string;
	imageSrc: string;
}[] = [
	{
		icon: HeartPulse,
		title: "Where we started",
		body: "We built Minuri because moving into independent life — uni, a first lease, a new job — can feel isolating. We wanted one calm place that acknowledges that reality and points you toward practical next steps, not generic advice.",
		imageSrc: "/where-we-start.svg",
	},
	{
		icon: BookOpen,
		title: "Who we’re here for",
		body: "If you’re new to Melbourne or going through a big change, this is for you. We write in plain language about real situations: renting, study, work, and staying connected — so you’re not decoding jargon when you already have enough on your plate.",
		imageSrc: "/who-we-for.svg",
	},
	{
		icon: Activity,
		title: "What we believe",
		body: "Help should feel reachable, not like another project. That’s why the homepage stays simple: browse first-time guides or find services near you — no long onboarding or pressure to “do everything at once.”",
		imageSrc: "/what-we-believe.svg",
	},
	{
		icon: UsersRound,
		title: "Why this matters",
		body: "Starting independent life often means figuring out everything at once — housing, study or work, money, and support — while information is scattered and overwhelming. Our problem statement is simple: people need one clear, local starting point that turns uncertainty into practical next steps.",
		imageSrc: "/why-this-matter.svg",
	},
];

/** Large display title: gradient fill on text. */
function OurStoryWordmark() {
	const gradient =
		"linear-gradient(90deg, color-mix(in oklch, var(--minuri-silver) 88%, var(--minuri-white)) 0%, color-mix(in oklch, var(--minuri-silver) 72%, var(--minuri-fog)) 10%, var(--minuri-teal) 24%, color-mix(in oklch, var(--minuri-teal) 92%, var(--minuri-seafoam)) 100%)";

	return (
		<motion.div
			className="flex w-full min-w-0 max-w-full select-none items-baseline justify-center overflow-x-hidden px-3 pb-16 pt-4 md:pb-20 md:pt-6"
			initial={{ opacity: 0, y: 40 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, amount: 0.35, margin: "0px 0px -8% 0px" }}
			transition={{ duration: 1, ease: easeOut }}
		>
			<span
				className="inline-block max-w-full whitespace-nowrap bg-clip-text text-[clamp(2.75rem,15vw,24rem)] font-bold text-transparent md:text-[clamp(3.5rem,17vw,26rem)]"
				style={{
					backgroundImage: gradient,
					WebkitBackgroundClip: "text",
					backgroundClip: "text",
				}}
				aria-hidden
			>
				Our story
			</span>
		</motion.div>
	);
}

function CardVisual({ src }: { src: string }) {
	const base =
		"relative mt-5 h-64 w-full overflow-hidden rounded-xl md:mt-6 md:h-80";
	return (
		<div
			className={cn(
				base,
				"border border-minuri-silver/60 bg-minuri-fog/35",
			)}
		>
			<div className="relative h-full w-full overflow-hidden rounded-lg bg-minuri-white/70">
				<Image
					src={src}
					alt=""
					fill
					className="object-contain"
					sizes="(max-width: 768px) 90vw, 640px"
				/>
			</div>
		</div>
	);
}

export function SpotlightScrollSection() {
	return (
		<section
			id="our-story"
			className="relative isolate scroll-mt-24 overflow-x-clip bg-minuri-white md:scroll-mt-28 pb-20"
			aria-labelledby="our-story-heading"
		>
			{/*
			  Grid overlay: sticky layer + content share one cell so row height = cards.
			  Watermark stays pinned (top-0, h-screen) until the section scrolls away after the last card.

			  First viewport: large “Our story” display type; story cards follow after scroll.
			*/}
			<div className="grid grid-cols-1">
				<div
					className="pointer-events-none sticky top-0 z-1 col-start-1 row-start-1 flex h-screen w-full max-w-none items-center justify-center self-start px-0"
					aria-hidden
				>
					<OurStoryWordmark />
				</div>

				<div className="relative z-10 col-start-1 row-start-1 mx-auto w-full max-w-2xl px-5 md:px-8">
					{/* Reserve ~one screen so the watermark reads before cards enter */}
					<div
						className="min-h-[min(92svh,56rem)] w-full"
						aria-hidden
					/>

					{/* Slightly narrower than page grid so watermark reads large; still wider than pill nav */}
					<h2 id="our-story-heading" className="sr-only">
						Here&apos;s our story — and why Minuri exists.
					</h2>
					<div
						className="mx-auto flex w-full max-w-xl flex-col gap-10 sm:max-w-2xl"
						role="list"
					>
						{cards.map((card, i) => {
							const Icon = card.icon;
							return (
								<motion.article
									key={card.title}
									role="listitem"
									className="w-full"
									initial={{ opacity: 0, y: 96 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{
										once: true,
										margin: "0% 0px -12% 0px",
										amount: 0.2,
									}}
									transition={{
										duration: 0.65,
										delay: i * 0.06,
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
										<CardVisual src={card.imageSrc} />
										<p className="mt-5 flex-1 text-sm leading-relaxed text-minuri-slate md:mt-6 md:text-[0.9375rem]">
											{card.body}
										</p>
									</div>
								</motion.article>
							);
						})}

						<motion.div
							className="w-full"
							initial={{ opacity: 0, y: 72 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{
								once: true,
								margin: "0% 0px -12% 0px",
								amount: 0.2,
							}}
							transition={{
								duration: 0.55,
								delay: 0.24,
								ease: easeOut,
							}}
						>
							<div className="group relative block h-19 w-full overflow-hidden rounded-[1.25rem] border border-minuri-silver/60 bg-[linear-gradient(120deg,color-mix(in_oklch,var(--minuri-seafoam)_58%,var(--minuri-teal))_0%,color-mix(in_oklch,var(--minuri-teal)_78%,var(--minuri-seafoam))_100%)] shadow-[0_18px_34px_-26px_color-mix(in_oklch,var(--minuri-mid)_38%,transparent)] transition-[background,box-shadow,transform] duration-650 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-minuri-white hover:bg-none hover:border-minuri-silver/80 hover:shadow-[0_20px_38px_-30px_color-mix(in_oklch,var(--minuri-mid)_28%,transparent)] focus-visible:bg-minuri-white focus-visible:bg-none focus-visible:border-minuri-silver/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-minuri-teal/65 focus-visible:ring-offset-2 focus-visible:ring-offset-minuri-white motion-reduce:transition-none">
								<span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[clamp(1.45rem,3.4vw,1.85rem)] tracking-[-0.04em] text-minuri-white transition-all duration-650 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:left-8 group-hover:translate-x-0 group-hover:text-foreground group-focus-visible:left-8 group-focus-visible:translate-x-0 group-focus-visible:text-foreground motion-reduce:transition-none">
									Let&apos;s Get Started
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
