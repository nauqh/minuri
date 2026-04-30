"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { motion } from "motion/react";

type ServiceCard = {
	title: string;
	description: string;
	rotate: number;
	floatPhase: number;
};

const serviceCards: ServiceCard[] = [
	{
		title: "First-time guides",
		description: "We provide simple guides for daily independent life.",
		rotate: -4,
		floatPhase: 0,
	},
	{
		title: "Near-me support",
		description: "We help you find nearby services quickly.",
		rotate: 3,
		floatPhase: 0.8,
	},
	{
		title: "Your next steps",
		description: "We help you know what's the next step to take.",
		rotate: -2,
		floatPhase: 1.4,
	},
	{
		title: "Your progress",
		description:
			"We help you track your progress and what you have achieved.",
		rotate: 4,
		floatPhase: 0.4,
	},
];

const easeOut = [0.22, 1, 0.36, 1] as const;

export function LandingServicesSection() {
	return (
		<section
			id="services"
			className="scroll-mt-24 flex min-h-[115vh] items-center bg-minuri-ocean py-24 text-minuri-white md:min-h-[120vh] md:scroll-mt-28 md:py-32"
			aria-labelledby="services-heading"
		>
			<div className="mx-auto my-auto w-full max-w-screen px-5 md:px-8">
				<div className="mx-auto max-w-7xl space-y-6 text-center md:space-y-7">
					<p className="mx-auto inline-flex rounded-lg bg-minuri-white/90 px-3 py-2 text-xs font-black uppercase tracking-[0.08em] text-minuri-ocean">
						What Minuri provides
					</p>
					<motion.h2
						id="services-heading"
						className="landing-section-heading text-4xl text-minuri-white md:text-5xl"
						initial={{ opacity: 0, y: 16 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.7 }}
						transition={{
							duration: 1.1,
							ease: easeOut,
						}}
					>
						Practical support you can use today
					</motion.h2>
					<p className="landing-section-subheading text-xs text-minuri-mint md:text-sm">
						Tools and steps for independent life.
					</p>
					<div>
						<Link
							href="/journey"
							className="group inline-flex h-11 items-center gap-1.5 rounded-full border border-minuri-white/70 px-5 text-sm font-medium text-minuri-white transition-colors duration-200 hover:bg-minuri-white hover:text-minuri-ocean"
						>
							Start your journey
							<ChevronRight
								className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-1"
								aria-hidden
							/>
						</Link>
					</div>
				</div>

				<div className="mt-16 md:mt-20">
					<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
						{serviceCards.map((card, index) => (
							<motion.div
								key={card.title}
								initial={{ opacity: 0, y: 18 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true, amount: 0.45 }}
								transition={{
									duration: 0.5,
									delay: index * 0.08,
									ease: easeOut,
								}}
							>
								<motion.article
									style={{
										rotate: card.rotate,
									}}
									className="relative rounded-2xl border border-minuri-mint/55 bg-minuri-ocean/70 p-5 text-left shadow-[0_16px_32px_-10px_rgba(2,24,25,0.35)] backdrop-blur-[1px] md:p-6"
									animate={{ y: [0, -8, 0] }}
									transition={{
										duration: 3.2 + card.floatPhase * 0.28,
										ease: "easeInOut",
										repeat: Infinity,
										delay: card.floatPhase,
									}}
								>
									<h3 className="text-xl font-black uppercase tracking-tight text-minuri-mint">
										{card.title}
									</h3>
									<p className="mt-2 text-base leading-relaxed text-minuri-white">
										{card.description}
									</p>
								</motion.article>
							</motion.div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
