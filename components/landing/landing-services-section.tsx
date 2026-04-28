"use client";

import { motion, useReducedMotion } from "motion/react";

type ServiceCard = {
	title: string;
	value: string;
	example: string;
	accent: string;
};

const serviceCards: ServiceCard[] = [
	{
		title: "First-time guides",
		value: "Step-by-step help for food, health, transport, home admin, and social life.",
		example: "Example: what to do in your first 48 hours in a new suburb.",
		accent: "#00f5d4",
	},
	{
		title: "Near-me support",
		value: "Find useful places near your suburb, campus, or daily route.",
		example: "Example: compare nearby bulk-billing GPs and pharmacies in minutes.",
		accent: "#7fdcff",
	},
	{
		title: "Clear next steps",
		value: "Short action lists so you know what to do first, then next.",
		example: "Example: set up rent, utilities, and essentials without missing steps.",
		accent: "#fff14a",
	},
];

const easeOut = [0.22, 1, 0.36, 1] as const;

export function LandingServicesSection() {
	const shouldReduceMotion = useReducedMotion();

	return (
		<section
			id="services"
			className="scroll-mt-24 bg-minuri-fog py-16 md:scroll-mt-28 md:py-20"
			aria-labelledby="services-heading"
		>
			<div className="mx-auto w-full max-w-screen-2xl px-5 md:px-8">
				<div className="mx-auto max-w-3xl text-center">
					<p className="landing-section-kicker">What Minuri provides</p>
					<h2 id="services-heading" className="landing-section-heading">
						Practical support you can use today
					</h2>
					<p className="landing-section-subheading mt-4">
						Two tools and one clear path to help you handle
						independent life with less guesswork.
					</p>
				</div>

				<div className="mt-10 grid gap-4 md:mt-12 md:grid-cols-3 md:gap-6">
					{serviceCards.map((card, index) => (
						<motion.article
							key={card.title}
							className="rounded-[1.2rem] border border-minuri-silver/65 bg-minuri-white p-6 shadow-[0_18px_34px_-28px_color-mix(in_oklch,var(--minuri-mid)_42%,transparent)]"
							initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 18 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, amount: 0.45 }}
							transition={{
								duration: shouldReduceMotion ? 0.01 : 0.5,
								delay: shouldReduceMotion ? 0 : index * 0.06,
								ease: easeOut,
							}}
						>
							<span
								className="mb-4 block h-1.5 w-12 rounded-full"
								style={{ backgroundColor: card.accent }}
								aria-hidden
							/>
							<h3 className="text-xl font-semibold tracking-tight text-minuri-ocean">
								{card.title}
							</h3>
							<p className="mt-3 text-sm leading-relaxed text-minuri-slate">
								{card.value}
							</p>
							<p className="mt-4 border-t border-minuri-silver/50 pt-4 text-xs leading-relaxed text-minuri-ocean/80">
								{card.example}
							</p>
						</motion.article>
					))}
				</div>
			</div>
		</section>
	);
}
