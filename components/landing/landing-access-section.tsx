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
					<p className="landing-section-kicker">Ask Minuri</p>
				</FadeUp>
				<FadeUp delay={0.06}>
					<h2 className="landing-section-heading md:text-5xl">
						Stop adulting alone
					</h2>
				</FadeUp>
				<FadeUp delay={0.12}>
					<p className="landing-section-subheading">
						Reach out - wherever you are, we&apos;re happy to help.
					</p>
				</FadeUp>
				<FadeUp
					delay={0.18}
					className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row sm:items-stretch"
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
						className="min-h-11 flex-1 rounded-minuri border border-minuri-silver bg-minuri-fog/40 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-minuri-teal focus:outline-none"
					/>
					<motion.button
						type="button"
						className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-minuri bg-minuri-teal px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-minuri-seafoam"
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.97 }}
					>
						Get next steps
						<ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
					</motion.button>
				</FadeUp>
			</div>
		</section>
	);
}
