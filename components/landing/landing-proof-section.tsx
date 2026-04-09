"use client";

import { motion } from "motion/react";

import { easeOut } from "@/components/landing/home-constants";
import { FadeUp } from "@/components/landing/home-shared";

const proofCards = [
	{
		title: "ABS & AIHW",
		body: "Demographics and youth health context shape what we surface — not generic articles alone.",
		tint: "bg-minuri-white",
	},
	{
		title: "Prevention-first",
		body: "Routines before crisis. Lower friction to help-seeking than waiting for an emergency.",
		tint: "bg-minuri-mist/50",
	},
	{
		title: "Safe by default",
		body: "JWT auth, encryption at rest, and Care Circle boundaries per the security plan — coral stays semantic.",
		tint: "bg-minuri-white sm:col-span-2 lg:col-span-1",
	},
];

export function LandingProofSection() {
	return (
		<section
			id="proof"
			className="flex min-h-[88dvh] flex-col justify-center py-20 md:py-24"
		>
			<div className="mx-auto w-full max-w-6xl px-5 md:px-8">
				<FadeUp>
					<p className="text-xs font-medium tracking-[0.22em] text-minuri-teal">
						Open data &amp; place
					</p>
				</FadeUp>
				<FadeUp delay={0.06}>
					<h2 className="mt-4 max-w-2xl text-2xl font-semibold tracking-tight md:text-3xl">
						Local relevance from Census-informed signals — starting
						with suburbs like Clayton and Parkville.
					</h2>
				</FadeUp>
				<div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{proofCards.map((card, i) => (
						<motion.div
							key={card.title}
							className={`rounded-minuri border border-minuri-silver/90 p-6 ${card.tint}`}
							initial={{ opacity: 0, y: 24 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, margin: "-6%" }}
							whileHover={{ y: -3 }}
							transition={{
								duration: 0.5,
								delay: i * 0.07,
								ease: easeOut,
							}}
						>
							<h3 className="font-semibold text-minuri-mid">
								{card.title}
							</h3>
							<p className="mt-2 text-sm leading-relaxed text-minuri-slate">
								{card.body}
							</p>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
