"use client";

import { motion, useReducedMotion } from "motion/react";

const easeOut = [0.22, 1, 0.36, 1] as const;

type HowItWorksCard = {
	step: string;
	title: string;
	body: string;
	color: string;
	optionLabel: string;
	options: Array<{
		title: string;
		description?: string;
	}>;
};

const cards: HowItWorksCard[] = [
	{
		step: "Step one",
		title: "Pick a moment that sounds like your life right now",
		body: "Start from a real moment, not a generic category. Minuri opens the right first step based on where you actually are.",
		color: "#00f5d4",
		optionLabel: "Moment",
		options: [
			{
				title: "I just arrived",
				description: "Day 1: essentials and health support.",
			},
			{
				title: "I'm getting set up",
				description: "Week 1: home admin, health basics, and orientation.",
			},
			{
				title: "I'm looking for my people",
				description: "Month 1: rhythm, connection, and sustaining habits.",
			},
		],
	},
	{
		step: "Step two",
		title: "Navigate with five everyday topics",
		body: "One shared language across guides and Near Me keeps things easy to follow and less overwhelming.",
		color: "#7fdcff",
		optionLabel: "Topic",
		options: [
			{ title: "Food & Eating" },
			{ title: "Getting Around" },
			{ title: "Health & Wellbeing" },
			{ title: "Home & Admin" },
			{ title: "Social & Belonging" },
		],
	},
	{
		step: "Step three",
		title: "Finish with real places near you",
		body: "When you are ready to act, Minuri takes you to real local places in your suburb instead of making you search from scratch.",
		color: "#fff14a",
		optionLabel: "Near me",
		options: [
			{
				title: "Suburb-aware results",
				description: "Everything filters to where you are.",
			},
			{
				title: "Save useful places",
				description: "Keep spots you want to return to.",
			},
			{
				title: "No sign-up required",
				description: "Your journey stays on your device.",
			},
		],
	},
];

type SpotlightScrollSectionProps = {
	onOpenMinuriHub?: () => void;
};

export function SpotlightScrollSection({
	onOpenMinuriHub,
}: SpotlightScrollSectionProps) {
	const shouldReduceMotion = useReducedMotion();

	return (
		<section
			id="service"
			className="scroll-mt-24 bg-minuri-white py-18 md:scroll-mt-28 md:py-22"
			aria-labelledby="how-it-works-heading"
		>
			<div className="mx-auto w-full max-w-3xl px-5 md:px-8">
				<div className="mb-8 text-center md:mb-10">
					<p className="landing-section-kicker">How Minuri works</p>
					<h2
						id="how-it-works-heading"
						className="landing-section-heading"
					>
						The three steps.
					</h2>
					<p className="landing-section-subheading mt-4">
						Path from your current moment to action you can take
						today.
					</p>
				</div>

				<div
					className="relative mx-auto flex w-full max-w-xl flex-col gap-8 sm:max-w-184 md:gap-12 md:pl-13"
					role="list"
				>
					<div
						aria-hidden
						className="absolute bottom-6 left-4 top-6 hidden w-px bg-linear-to-b from-minuri-silver/20 via-minuri-silver/70 to-minuri-silver/20 md:block"
					/>
					{cards.map((card, i) => (
						<motion.article
							key={card.step}
							role="listitem"
							className="relative w-full transform-3d"
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
							<span
								aria-hidden
								className="absolute -left-11.5 top-10 hidden size-5 rounded-full border-2 border-minuri-white md:block"
								style={{
									backgroundColor: card.color,
									boxShadow: `0 0 0 4px color-mix(in srgb, ${card.color} 35%, transparent)`,
								}}
							/>
							<div className="flex flex-col rounded-[1.5rem] border border-minuri-silver/55 bg-minuri-white p-6 shadow-[0_18px_36px_-30px_color-mix(in_oklch,var(--minuri-mid)_42%,transparent)] md:rounded-[1.75rem] md:p-8">
								<div className="flex flex-col gap-2.5">
									<span
										className="inline-flex w-fit rounded-full border px-2.5 py-1 font-serif text-[0.77rem] italic tracking-[0.08em] text-minuri-ocean"
										style={{
											backgroundColor: `color-mix(in srgb, ${card.color} 90%, white)`,
											borderColor: `color-mix(in srgb, ${card.color} 78%, var(--minuri-silver))`,
										}}
									>
										{card.step}
									</span>
									<h3 className="max-w-2xl text-xl font-semibold leading-snug tracking-tight text-minuri-ocean md:text-[1.6rem]">
										{card.title}
									</h3>
								</div>
								<p className="mt-5 text-sm leading-relaxed text-minuri-slate md:mt-6 md:text-[0.9375rem]">
									{card.body}
								</p>
								<div className="mt-5 grid gap-2.5 sm:grid-cols-2 md:gap-3">
									{card.options.map((option) => (
										<div
											key={option.title}
											className="relative overflow-hidden rounded-[0.9rem] border bg-minuri-white/82 px-4 py-3 text-minuri-ocean"
											style={{
												borderColor: `color-mix(in srgb, ${card.color} 60%, var(--minuri-silver))`,
												boxShadow:
													"0 10px 20px -20px color-mix(in oklch, var(--minuri-mid) 55%, transparent)",
											}}
										>
											<span
												aria-hidden
												className="absolute inset-y-0 left-0 w-1.5"
												style={{
													backgroundColor: `color-mix(in srgb, ${card.color} 76%, white)`,
												}}
											/>
											<p className="text-[0.63rem] font-semibold uppercase tracking-[0.15em] opacity-80">
												{card.optionLabel}
											</p>
											<p className="mt-1 text-[1.08rem] font-semibold leading-snug">
												{option.title}
											</p>
											{option.description ? (
												<p className="mt-1 text-xs leading-relaxed opacity-85">
													{option.description}
												</p>
											) : null}
										</div>
									))}
								</div>
							</div>
						</motion.article>
					))}
				</div>

				<motion.div
					className="mx-auto mt-7 w-full max-w-xl sm:max-w-184 md:mt-9 md:pl-13"
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
					<button
						type="button"
						onClick={() => onOpenMinuriHub?.()}
						aria-label="Open Minuri hub"
						className="group relative block h-19 w-full cursor-pointer overflow-hidden rounded-[1.25rem] border border-minuri-silver/60 bg-[linear-gradient(120deg,color-mix(in_oklch,var(--minuri-seafoam)_58%,var(--minuri-teal))_0%,color-mix(in_oklch,var(--minuri-teal)_78%,var(--minuri-seafoam))_100%)] text-left shadow-[0_18px_34px_-26px_color-mix(in_oklch,var(--minuri-mid)_38%,transparent)] transition-[background,box-shadow,transform] duration-650 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-minuri-white hover:bg-none hover:border-minuri-silver/80 hover:shadow-[0_20px_38px_-30px_color-mix(in_oklch,var(--minuri-mid)_28%,transparent)] focus-visible:bg-minuri-white focus-visible:bg-none focus-visible:border-minuri-silver/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-minuri-teal/65 focus-visible:ring-offset-2 focus-visible:ring-offset-minuri-white motion-reduce:transition-none"
					>
						<span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[clamp(1.45rem,3.4vw,1.85rem)] tracking-[-0.04em] text-minuri-white transition-all duration-650 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:left-8 group-hover:translate-x-0 group-hover:text-foreground group-focus-visible:left-8 group-focus-visible:translate-x-0 group-focus-visible:text-foreground motion-reduce:transition-none">
							Let's Get Started
						</span>
						<span className="absolute right-4 top-1/2 -translate-y-1/2">
							<span className="pointer-events-auto inline-flex cursor-pointer items-center rounded-full border border-minuri-silver/60 bg-[linear-gradient(120deg,color-mix(in_oklch,var(--minuri-seafoam)_58%,var(--minuri-teal))_0%,color-mix(in_oklch,var(--minuri-teal)_78%,var(--minuri-seafoam))_100%)] px-5 py-2.5 text-sm font-semibold tracking-tight text-minuri-white opacity-0 shadow-[0_12px_20px_-14px_color-mix(in_oklch,var(--minuri-mid)_45%,transparent)] transition-all duration-650 ease-[cubic-bezier(0.22,1,0.36,1)] translate-y-[140%] scale-90 group-hover:translate-y-0 group-hover:scale-[1.08] group-hover:opacity-100 hover:scale-[1.12] focus-visible:scale-[1.12] group-focus-visible:translate-y-0 group-focus-visible:scale-[1.08] group-focus-visible:opacity-100 motion-reduce:transition-none">
								Open Minuri hub
							</span>
						</span>
					</button>
				</motion.div>
			</div>
		</section>
	);
}
