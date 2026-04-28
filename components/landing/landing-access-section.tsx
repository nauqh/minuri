"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";

import { FadeUp } from "@/components/landing/home-shared";

export function LandingAccessSection() {
	return (
		<section
			id="contact"
			className="flex min-h-[88dvh] flex-col justify-center bg-minuri-white py-28 md:py-32"
		>
			<div className="mx-auto w-full px-5 text-center md:px-8">
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
						className="min-h-13 w-full flex-1 rounded-minuri border border-minuri-silver bg-minuri-fog/60 px-5 py-3.5 text-base text-foreground placeholder:text-muted-foreground shadow-sm transition focus:border-minuri-teal focus:outline-none focus:ring-2 focus:ring-minuri-teal/20 sm:min-w-[25rem]"
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
			</div>
		</section>
	);
}
