"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";

import { easeOut } from "@/components/landing/home-constants";
import { LandingFooterCurve } from "@/components/landing/home-shared";

export function LandingFooter() {
	return (
		<footer className="relative z-10 min-h-[50vh] bg-minuri-mist text-minuri-ocean">
			<LandingFooterCurve />
			<div className="relative z-20 mx-auto max-w-6xl px-5 pb-16 pt-14 md:px-8 md:pb-20 md:pt-16">
				<div className="flex flex-col items-start gap-5">
					<Link
						href="#contact"
						className="group max-w-4xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-minuri-teal focus-visible:ring-offset-2 focus-visible:ring-offset-minuri-mist"
					>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, ease: easeOut }}
						>
							<h2 className="minuri-link-underline w-fit pb-1 text-[clamp(2.4rem,7vw,5.2rem)] font-bold leading-[1.03] tracking-tight text-minuri-teal">
								Let's get started
								<span
									className="inline-block translate-y-px transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
									aria-hidden
								>
									<ArrowUpRight
										className="inline-block size-20"
										aria-hidden
									/>
								</span>
							</h2>
							<p className="mt-3 text-[0.95rem] font-medium leading-relaxed text-minuri-ocean/70 md:text-base">
								Reach out — wherever you are, we&apos;re happy
								to help.
							</p>
						</motion.div>
					</Link>
				</div>
			</div>

			<div className="relative z-20 border-t border-minuri-silver/70">
				<div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-8 text-[0.78rem] tracking-[0.01em] text-minuri-ocean/70 md:flex-row md:items-center md:justify-between md:px-8 md:py-9 md:text-[0.84rem]">
					<p className="font-medium">
						© {new Date().getFullYear()} Minuri · Melbourne,
						Australia
					</p>
					<div className="flex items-center gap-5">
						<Link
							href="mailto:hello@minuri.app"
							className="minuri-link-underline font-semibold text-minuri-ocean/80 transition-colors hover:text-minuri-teal"
						>
							Email
						</Link>
						<Link
							href="#"
							className="minuri-link-underline font-semibold text-minuri-ocean/80 transition-colors hover:text-minuri-teal"
						>
							LinkedIn
						</Link>
						<Link
							href="#"
							className="minuri-link-underline font-semibold text-minuri-ocean/80 transition-colors hover:text-minuri-teal"
						>
							Instagram
						</Link>
						<Link
							href="#contact"
							className="minuri-link-underline font-semibold text-minuri-ocean/80 transition-colors hover:text-minuri-teal"
						>
							Contact
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}
