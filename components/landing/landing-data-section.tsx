"use client";

import { motion } from "motion/react";
import { LandingStatCard } from "./landing-stat-card";
import { LandingInsightChart } from "./landing-insight-chart";
import { LandingDotGrid } from "./landing-dot-grid";

const STAT_CARDS = [
	{
		stat: "1 in 4",
		label: "Young Australians experience high psychological distress during a major life transition",
		source: "Mission Australia Youth Survey, 2024",
		fullCitation:
			"Mission Australia Youth Survey 2024. Psychological distress rates among Australians aged 15–24 during significant life transitions.",
		accentClass: "bg-minuri-teal",
	},
	{
		stat: "98%",
		label: "Of international students report anxiety in their first semester — 86% report financial stress",
		source: "Monash Intl Student Health Survey, 2023",
		fullCitation:
			"Monash University International Student Health and Wellbeing Survey 2023. Prevalence of anxiety and financial stress among first-semester international students.",
		accentClass: "bg-minuri-coral",
		countTo: 98,
		countSuffix: "%",
	},
	{
		stat: "#1",
		label: "Loneliness is the top self-reported issue for Australians aged 15–24 starting independent life",
		source: "University of Melbourne, 2023",
		fullCitation:
			"University of Melbourne Loneliness Research Group 2023. Self-reported wellbeing issues among Australians aged 15–24.",
		accentClass: "bg-minuri-sky",
	},
];

const easeOut: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function LandingDataSection() {
	return (
		<section
			id="why-it-matters"
			className="scroll-mt-24 bg-minuri-white md:scroll-mt-28"
			aria-labelledby="why-it-matters-heading"
		>
			{/* Constrained: heading + stat cards + lead-in */}
			<div className="mx-auto w-full max-w-screen px-5 pb-0 pt-24 md:px-8 md:pt-32">
				<div className="mx-auto max-w-[1400px]">
					<div className="text-center">
						<p className="landing-section-kicker">
							The numbers behind your experience
						</p>
						<motion.h2
							id="why-it-matters-heading"
							className="landing-section-heading"
							initial={{ opacity: 0, y: 16 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, amount: 0.7 }}
							transition={{ duration: 0.6, ease: easeOut }}
						>
							Independent living is hard
						</motion.h2>
						<motion.p
							className="landing-section-subheading mt-4 max-w-2xl"
							initial={{ opacity: 0, y: 14 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, amount: 0.7 }}
							transition={{
								duration: 0.55,
								delay: 0.08,
								ease: easeOut,
							}}
						>
							The systems that support you — healthcare, housing,
							transport, community — assume you already know how
							they work.
						</motion.p>
					</div>

					<div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5 md:mt-16">
						{STAT_CARDS.map((card, i) => (
							<LandingStatCard
								key={card.stat}
								stat={card.stat}
								label={card.label}
								source={card.source}
								fullCitation={card.fullCitation}
								accentClass={card.accentClass}
								countTo={card.countTo}
								countSuffix={card.countSuffix}
								delay={i * 0.1}
							/>
						))}
					</div>

					<motion.div
						className="mt-16 text-center md:mt-20"
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						viewport={{ once: true, amount: 0.7 }}
						transition={{ duration: 0.5, ease: easeOut }}
					>
						<p className="text-sm font-medium uppercase tracking-widest text-minuri-ocean/40">
							Break it down by area
						</p>
					</motion.div>
				</div>
			</div>

			{/* Full-bleed chart — intentionally outside max-w-7xl */}
			<div className="mt-6">
				<LandingInsightChart />
			</div>

			{/* Dot grid — help-seeking gap */}
			<LandingDotGrid />

			{/* Bottom breathing room */}
			<div className="pb-24 md:pb-32" />
		</section>
	);
}
