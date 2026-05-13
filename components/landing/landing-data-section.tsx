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
						{/* Insight text — spans 2 cols on sm+ */}
						<motion.div
							className="flex flex-col justify-between rounded-2xl bg-minuri-ocean p-8 sm:col-span-2 md:p-10"
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, amount: 0.3 }}
							transition={{ duration: 0.5, ease: easeOut }}
						>
							<p className="text-xs font-medium uppercase tracking-widest text-white/40">
								The reality
							</p>
							<p className="mt-6 text-2xl font-bold leading-snug text-white md:text-3xl lg:text-[2.25rem]">
								The systems that support you assume you already
								know how they work.
							</p>
							<p className="mt-6 text-sm leading-relaxed text-white/50">
								For young Australians stepping into independent
								life — this gap is real, and it&apos;s
								measurable.
							</p>
						</motion.div>

						{/* 1 in 4 */}
						<LandingStatCard
							key={STAT_CARDS[0].stat}
							stat={STAT_CARDS[0].stat}
							label={STAT_CARDS[0].label}
							source={STAT_CARDS[0].source}
							fullCitation={STAT_CARDS[0].fullCitation}
							accentClass={STAT_CARDS[0].accentClass}
							delay={0.1}
						/>

						{/* 98% */}
						<LandingStatCard
							key={STAT_CARDS[1].stat}
							stat={STAT_CARDS[1].stat}
							label={STAT_CARDS[1].label}
							source={STAT_CARDS[1].source}
							fullCitation={STAT_CARDS[1].fullCitation}
							accentClass={STAT_CARDS[1].accentClass}
							countTo={STAT_CARDS[1].countTo}
							countSuffix={STAT_CARDS[1].countSuffix}
							delay={0.15}
						/>

						{/* Quote cell */}
						<motion.div
							className="flex items-center rounded-2xl bg-minuri-teal/10 p-8 md:p-10"
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, amount: 0.3 }}
							transition={{
								duration: 0.5,
								delay: 0.2,
								ease: easeOut,
							}}
						>
							<p className="text-xl font-bold leading-snug text-minuri-ocean md:text-2xl">
								Loneliness. Anxiety. Financial stress. These
								aren&apos;t personal failures — they&apos;re
								systemic gaps.
							</p>
						</motion.div>

						{/* #1 */}
						<LandingStatCard
							key={STAT_CARDS[2].stat}
							stat={STAT_CARDS[2].stat}
							label={STAT_CARDS[2].label}
							source={STAT_CARDS[2].source}
							fullCitation={STAT_CARDS[2].fullCitation}
							accentClass={STAT_CARDS[2].accentClass}
							delay={0.25}
						/>
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
