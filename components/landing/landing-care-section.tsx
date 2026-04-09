"use client";

import { motion } from "motion/react";

import { FadeUp } from "@/components/landing/home-shared";

export function LandingCareSection() {
	return (
		<section
			id="care"
			className="flex min-h-[88dvh] flex-col justify-center bg-minuri-ocean py-20 text-minuri-ice md:py-28"
		>
			<div className="mx-auto w-full max-w-6xl px-5 md:px-8">
				<div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start lg:gap-16">
					<div>
						<FadeUp>
							<p className="text-xs font-medium tracking-[0.22em] text-minuri-pale">
								Near Me
							</p>
						</FadeUp>
						<FadeUp delay={0.06}>
							<h2 className="mt-4 text-3xl font-semibold tracking-tight text-minuri-white md:text-4xl">
								Find nearby support and essentials when you need
								them.
							</h2>
						</FadeUp>
						<FadeUp delay={0.12}>
							<p className="mt-6 max-w-xl text-base leading-relaxed text-minuri-ice/95">
								From GP clinics to everyday services, Near Me
								helps new Melburnians navigate a suburb with
								less stress and clearer next steps.
							</p>
						</FadeUp>
					</div>
					<motion.aside
						className="rounded-minuri border border-minuri-mid bg-minuri-mid/25 p-6 md:p-8"
						initial={{ opacity: 0, y: 28, rotate: -0.5 }}
						whileInView={{ opacity: 1, y: 0, rotate: 0 }}
						whileHover={{ scale: 1.01 }}
						viewport={{ once: true, margin: "-10%" }}
						transition={{
							type: "spring",
							stiffness: 260,
							damping: 22,
						}}
					>
						<p className="inline-block rounded-minuri bg-minuri-coral px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-minuri-white">
							Designed for day one
						</p>
						<p className="mt-5 text-sm leading-relaxed text-minuri-mist/95 md:text-base">
							Built around common first-month questions: where to
							get help, what to do first, and how to settle into
							independent life.
						</p>
						<div className="mt-8 space-y-3 border-t border-minuri-mid pt-6 text-xs text-minuri-pale">
							<p className="font-medium text-minuri-ice">
								Core paths
							</p>
							<p>
								Browse First Time Guides · Find Services Near Me
								· Mobile-first navigation
							</p>
						</div>
					</motion.aside>
				</div>
			</div>
		</section>
	);
}
