"use client";

import Image from "next/image";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";
import { easeOut, steps } from "@/components/landing/home-constants";
import { FadeUp } from "@/components/landing/home-shared";

export function LandingFlowSection() {
	return (
		<section
			id="service"
			className="flex min-h-[88dvh] flex-col justify-center bg-minuri-ocean py-20 md:py-28"
		>
			<div className="mx-auto w-full max-w-screen-2xl px-5 md:px-8">
				<div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
					<div className="space-y-8">
						<div className="-mt-4 mx-auto max-w-2xl text-center">
							<FadeUp>
								<p className="mx-auto inline-block rounded-sm bg-minuri-mid/55 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-minuri-mist">
									How Minuri works
								</p>
							</FadeUp>
							<FadeUp delay={0.06}>
								<h2 className="mt-4 text-4xl font-black uppercase tracking-tight text-minuri-white md:text-6xl">
									Settle in, faster.
								</h2>
							</FadeUp>
							<FadeUp
								delay={0.1}
								className="mx-auto my-2 max-w-2xl text-xs font-semibold uppercase tracking-[0.12em] text-minuri-ice/85 md:text-sm"
							>
								<p>
									Start with first-time guides or jump
									straight to nearby services.
								</p>
							</FadeUp>
						</div>

						<FadeUp
							delay={0.14}
							className="relative h-[340px] w-full max-w-[520px]"
						>
							<Image
								src="/landing/homescreen.svg"
								alt="Minuri homescreen preview"
								fill
								className="object-contain"
								sizes="(max-width: 768px) 90vw, 420px"
							/>
						</FadeUp>
					</div>

					<ol className="space-y-0">
						{steps.map((step, i) => (
							<motion.li
								key={step.title}
								className={cn(
									"grid gap-3 py-7 md:grid-cols-[3.5rem_1fr] md:items-start md:gap-7 md:py-8",
									i === 0
										? "border-t-0"
										: "border-t border-minuri-mid/55",
								)}
								initial={{ opacity: 0, x: -20 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true, margin: "-8%" }}
								transition={{
									duration: 0.5,
									delay: i * 0.05,
									ease: easeOut,
								}}
							>
								<span className="inline-block text-3xl font-semibold leading-none tracking-tight text-minuri-seafoam md:text-4xl">
									{String(i + 1).padStart(2, "0")}
								</span>
								<div>
									<h3 className="text-2xl font-medium tracking-tight text-minuri-white md:text-[2rem] md:leading-[1.1]">
										{step.title}
									</h3>
									<p className="mt-2 max-w-2xl text-sm leading-relaxed text-minuri-ice/90 md:text-base">
										{step.line}
									</p>
								</div>
							</motion.li>
						))}
					</ol>
				</div>
			</div>
		</section>
	);
}
