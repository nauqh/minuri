"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";

import { FadeUp } from "@/components/landing/home-shared";

const STATS = [
	{ value: "5", label: "Life topics covered" },
	{ value: "Free", label: "No sign-up needed" },
	{ value: "1", label: "Focused reply per ask" },
	{ value: "Melb.", label: "Local knowledge" },
] as const;

export function LandingAccessSection() {
	return (
		<section
			id="contact"
			className="flex min-h-screen flex-col justify-center bg-minuri-fog py-36 md:py-52"
		>
			<div className="mx-auto w-full max-w-screen-2xl px-5 text-center md:px-8">
				<FadeUp>
					<p className="landing-section-kicker">Get support</p>
				</FadeUp>
				<FadeUp delay={0.06}>
					<h2 className="landing-section-heading md:text-5xl">
						Get your next practical steps
					</h2>
				</FadeUp>
				<FadeUp delay={0.12}>
					<p className="landing-section-subheading">
						Tell us where you are stuck and we will send a focused
						starting plan.
					</p>
				</FadeUp>
				<FadeUp
					delay={0.18}
					className="mx-auto mt-10 flex w-full max-w-3xl flex-col gap-3 sm:flex-row sm:items-stretch sm:gap-4"
				>
					<label htmlFor="email-landing" className="sr-only">
						Email
					</label>
					<input
						id="email-landing"
						type="email"
						name="email"
						placeholder="you@example.com"
						autoComplete="email"
						className="min-h-13 w-full flex-1 rounded-minuri border border-minuri-silver bg-minuri-white px-5 py-3.5 text-base text-foreground placeholder:text-muted-foreground shadow-sm transition focus:border-minuri-teal focus:outline-none focus:ring-2 focus:ring-minuri-teal/20 sm:min-w-[25rem]"
					/>
					<motion.button
						type="button"
						className="group inline-flex min-h-13 w-full shrink-0 items-center justify-center gap-2 rounded-minuri bg-minuri-teal px-8 py-3.5 text-base font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-minuri-seafoam sm:w-auto sm:min-w-[16rem]"
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.97 }}
					>
						Send me my next steps
						<ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
					</motion.button>
				</FadeUp>
				<FadeUp delay={0.24}>
					<p className="mt-3 text-sm text-muted-foreground">
						No spam. Just one focused email with practical next
						steps.
					</p>
				</FadeUp>

				<div className="mx-auto mt-20 grid max-w-2xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-minuri-silver bg-minuri-silver md:grid-cols-4">
					{STATS.map((stat, i) => (
						<motion.div
							key={stat.label}
							className="flex flex-col items-center gap-1.5 bg-minuri-white px-6 py-8"
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{
								duration: 0.5,
								delay: 0.3 + i * 0.07,
								ease: [0.22, 1, 0.36, 1],
							}}
						>
							<span className="text-[2.2rem] font-black leading-none tracking-tight text-minuri-teal">
								{stat.value}
							</span>
							<span className="text-center text-sm text-muted-foreground">
								{stat.label}
							</span>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
