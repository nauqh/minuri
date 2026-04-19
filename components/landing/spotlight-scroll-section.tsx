"use client";

import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import { Activity, BookOpen, HeartPulse, UsersRound } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

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
		imageSrc: "/landing/where-we-start.svg",
	},
	{
		icon: BookOpen,
		title: "Who we’re here for",
		body: "If you’re new to Melbourne or going through a big change, this is for you. We write in plain language about real situations: renting, study, work, and staying connected.",
		imageSrc: "/landing/who-we-for.svg",
	},
	{
		icon: Activity,
		title: "What we believe",
		body: "Help should feel reachable, not like another project. That’s why the homepage stays simple: browse first-time guides or find services near you — no long onboarding or pressure to “do everything at once.”",
		imageSrc: "/landing/what-we-believe.svg",
	},
	{
		icon: UsersRound,
		title: "Why this matters",
		body: "Starting independent life often means figuring out everything at once — housing, study or work, money, and support — while information is scattered and overwhelming.",
		imageSrc: "/landing/why-this-matter.svg",
	},
];

function CardVisual({ src }: { src: string }) {
	return (
		<div className="relative mt-5 h-64 w-full overflow-hidden rounded-xl border border-minuri-silver/60 bg-minuri-fog/35 md:mt-6 md:h-80">
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
	const shouldReduceMotion = useReducedMotion();

	return (
		<section
			id="our-story"
			className="scroll-mt-24 bg-minuri-white py-18 md:scroll-mt-28 md:py-22"
			aria-labelledby="our-story-heading"
		>
			<div className="mx-auto w-full max-w-3xl px-5 md:px-8">
				<div className="mb-8 text-center md:mb-10">
					<p className="landing-section-kicker">About Us</p>
					<h2
						id="our-story-heading"
						className="landing-section-heading"
					>
						Who is Minuri
					</h2>
				</div>

				<div
					className="mx-auto flex w-full max-w-xl flex-col gap-6 sm:max-w-2xl md:gap-8"
					role="list"
				>
					{cards.map((card, i) => {
						const Icon = card.icon;
						return (
							<motion.article
								key={card.title}
								role="listitem"
								className="w-full transform-3d"
								style={{ perspective: 1200 }}
								initial={
									shouldReduceMotion
										? { opacity: 0, y: 22 }
										: {
												opacity: 0,
												rotateX: -84,
												y: 46,
												scale: 0.975,
											}
								}
								whileInView={
									shouldReduceMotion
										? { opacity: 1, y: 0 }
										: {
												opacity: 1,
												rotateX: 0,
												y: 0,
												scale: 1,
											}
								}
								viewport={{
									once: true,
									margin: "0% 0px -10% 0px",
									amount: 0.45,
								}}
								transition={{
									duration: shouldReduceMotion ? 0.4 : 0.74,
									delay: i * 0.08,
									ease: easeOut,
								}}
							>
								<div className="flex min-h-104 flex-col rounded-[1.5rem] border border-minuri-silver/45 bg-minuri-white p-6 shadow-[0_20px_50px_-44px_color-mix(in_oklch,var(--minuri-mid)_22%,transparent)] sm:min-h-112 md:min-h-120 md:h-120 md:rounded-[1.75rem] md:p-8">
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
				</div>

				<motion.div
					className="mx-auto mt-7 w-full max-w-xl sm:max-w-2xl md:mt-9"
					initial={{ opacity: 0, y: 28 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{
						once: true,
						margin: "0% 0px -12% 0px",
						amount: 0.35,
					}}
					transition={{
						duration: 0.55,
						delay: 0.12,
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
		</section>
	);
}
