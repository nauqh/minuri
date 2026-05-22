"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { LandingStatCard } from "./landing-stat-card";
import { LandingInsightChart } from "./landing-insight-chart";
import { LandingDotGrid } from "./landing-dot-grid";

const STAT_CARDS = [
	{
		stat: "2 in 5",
		label: "Young Australians report stress directly linked to their mental health — affecting school attendance, confidence and daily motivation",
		source: "Mission Australia Youth Survey, 2025",
		fullCitation:
			"Mission Australia Youth Survey 2025. Stress and mental health impacts on school attendance, confidence and daily motivation among young Australians.",
		accentClass: "bg-minuri-teal",
	},
	{
		stat: "98%",
		label: "Of first-year students report anxiety in their first semester — 86% report financial stress",
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
	const [open, setOpen] = useState(false);

	return (
		<section
			id="why-it-matters"
			className="scroll-mt-24 bg-minuri-white md:scroll-mt-28"
			aria-labelledby="why-it-matters-heading"
		>
			<div className="mx-auto w-full max-w-screen px-5 pb-0 pt-24 md:px-8 md:pt-32">
				<div className="mx-auto max-w-[1400px]">

					{/* Heading */}
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
							transition={{ duration: 0.55, delay: 0.08, ease: easeOut }}
						>
							Nobody gives you the manual — you&apos;re just expected to know.
						</motion.p>
					</div>

					{/* Always visible: original grid */}
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
								The systems that support you assume you already know how they work.
							</p>
							<p className="mt-6 text-sm leading-relaxed text-white/50">
								For young Australians stepping into independent life — this gap is
								real, and it&apos;s measurable.
							</p>
						</motion.div>

						<LandingStatCard
							stat={STAT_CARDS[0].stat}
							label={STAT_CARDS[0].label}
							source={STAT_CARDS[0].source}
							fullCitation={STAT_CARDS[0].fullCitation}
							accentClass={STAT_CARDS[0].accentClass}
							delay={0.1}
						/>

						<LandingStatCard
							stat={STAT_CARDS[1].stat}
							label={STAT_CARDS[1].label}
							source={STAT_CARDS[1].source}
							fullCitation={STAT_CARDS[1].fullCitation}
							accentClass={STAT_CARDS[1].accentClass}
							countTo={STAT_CARDS[1].countTo}
							countSuffix={STAT_CARDS[1].countSuffix}
							delay={0.15}
						/>

						<motion.div
							className="flex items-center rounded-2xl bg-minuri-teal/10 p-8 md:p-10"
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, amount: 0.3 }}
							transition={{ duration: 0.5, delay: 0.2, ease: easeOut }}
						>
							<p className="text-xl font-medium leading-snug text-minuri-ocean md:text-2xl">
								&ldquo;Loneliness. Anxiety. Financial stress. These
								aren&apos;t personal failures — they&apos;re systemic gaps.&rdquo;
							</p>
						</motion.div>

						<LandingStatCard
							stat={STAT_CARDS[2].stat}
							label={STAT_CARDS[2].label}
							source={STAT_CARDS[2].source}
							fullCitation={STAT_CARDS[2].fullCitation}
							accentClass={STAT_CARDS[2].accentClass}
							delay={0.25}
						/>
					</div>

					{/* Toggle — expand chart + dot grid */}
					<motion.div
						className="mt-16 flex flex-col items-center gap-4 md:mt-20"
						initial={{ opacity: 0, y: 8 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.5 }}
						transition={{ duration: 0.4, delay: 0.2, ease: easeOut }}
					>
						<p className="text-sm text-minuri-slate/60">
							{open
								? "Showing breakdown across 5 life areas"
								: "Want to see how this breaks down across 5 life areas?"}
						</p>
						<button
							type="button"
							onClick={() => setOpen((o) => !o)}
							className="group inline-flex items-center gap-3 rounded-2xl border border-minuri-silver/60 bg-minuri-fog px-8 py-4 text-base font-semibold text-minuri-ocean transition-all duration-200 hover:border-minuri-teal/40 hover:bg-minuri-teal/5 hover:text-minuri-teal"
						>
							<span>{open ? "Hide breakdown" : "See breakdown by area"}</span>
							<motion.span
								animate={{ rotate: open ? 180 : 0 }}
								transition={{ duration: 0.3, ease: easeOut }}
								className="flex shrink-0"
							>
								<ChevronDown className="size-5" />
							</motion.span>
						</button>
					</motion.div>
				</div>
			</div>

			{/* Collapsible: chart + dot grid */}
			<AnimatePresence initial={false}>
				{open && (
					<motion.div
						key="breakdown"
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: "auto", opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.55, ease: easeOut }}
						style={{ overflow: "hidden" }}
					>
						<div className="mx-auto w-full max-w-screen px-5 md:px-8">
							<div className="mx-auto max-w-[1400px]">
								<motion.div
									initial={{ opacity: 0, y: 8 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.4, delay: 0.15, ease: easeOut }}
									className="mt-10 text-center"
								>
									<p className="text-sm font-medium uppercase tracking-widest text-minuri-ocean/40">
										Break it down by area
									</p>
								</motion.div>
							</div>
						</div>

						<motion.div
							initial={{ opacity: 0, y: 12 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.45, delay: 0.2, ease: easeOut }}
						>
							<div className="mt-6">
								<LandingInsightChart />
							</div>
							<LandingDotGrid />
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>

			<div className="pb-24 md:pb-32" />
		</section>
	);
}
