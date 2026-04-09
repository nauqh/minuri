"use client";

import Link from "next/link";
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
						href="#access"
						className="group max-w-4xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-minuri-teal focus-visible:ring-offset-2 focus-visible:ring-offset-minuri-mist"
					>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, ease: easeOut }}
						>
							<h2 className="minuri-link-underline w-fit pb-1 font-hero-serif text-[clamp(2.4rem,7vw,5.2rem)] font-medium leading-[1.03] tracking-tight text-minuri-ocean">
								Let&apos;s work together{" "}
								<span
									className="inline-block transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
									aria-hidden
								>
									↗
								</span>
							</h2>
							<p className="mt-3 text-sm text-minuri-slate md:text-base">
								Tell us about your project and we will get back
								to you.
							</p>
						</motion.div>
					</Link>
				</div>
			</div>

			<div className="relative z-20 border-t border-minuri-silver/90">
				<div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-8 text-xs text-minuri-slate md:flex-row md:items-center md:justify-between md:px-8 md:py-9 md:text-sm">
					<p>
						© {new Date().getFullYear()} Minuri · Melbourne,
						Australia
					</p>
					<div className="flex items-center gap-5">
						<Link
							href="mailto:hello@minuri.app"
							className="minuri-link-underline transition-colors hover:text-minuri-teal"
						>
							Email
						</Link>
						<Link
							href="#"
							className="minuri-link-underline transition-colors hover:text-minuri-teal"
						>
							LinkedIn
						</Link>
						<Link
							href="#"
							className="minuri-link-underline transition-colors hover:text-minuri-teal"
						>
							Instagram
						</Link>
						<Link
							href="#access"
							className="minuri-link-underline transition-colors hover:text-minuri-teal"
						>
							Contact
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}
