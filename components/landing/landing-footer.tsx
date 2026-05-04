"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";

import { easeOut } from "@/components/landing/home-constants";
import { LandingFooterCurve } from "@/components/landing/home-shared";
import { scrollToTopAndHighlightLandingCta } from "@/lib/scroll-to-top-and-highlight-cta";

function TramIllustration() {
	return (
		<svg
			viewBox="0 0 380 220"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.4"
			strokeLinecap="round"
			strokeLinejoin="round"
			className="w-full max-w-sm text-minuri-white/20"
			aria-hidden
		>
			{/* Overhead wire */}
			<line x1="0" y1="18" x2="380" y2="18" />
			{/* Pantograph */}
			<line x1="120" y1="58" x2="158" y2="20" />
			<line x1="230" y1="58" x2="192" y2="20" />
			<line x1="150" y1="20" x2="200" y2="20" />
			{/* Body */}
			<rect x="12" y="58" width="356" height="124" rx="10" />
			{/* Destination board */}
			<rect x="30" y="64" width="120" height="14" rx="3" />
			<line x1="44" y1="71" x2="136" y2="71" />
			{/* Windows */}
			<rect x="30" y="86" width="66" height="44" rx="5" />
			<rect x="112" y="86" width="66" height="44" rx="5" />
			<rect x="194" y="86" width="66" height="44" rx="5" />
			{/* Door */}
			<rect x="286" y="90" width="56" height="92" rx="3" />
			<line x1="314" y1="90" x2="314" y2="182" strokeDasharray="4 3" />
			<circle cx="294" cy="137" r="3" fill="currentColor" stroke="none" />
			{/* Undercarriage bar */}
			<line x1="12" y1="182" x2="368" y2="182" />
			{/* Wheels */}
			<circle cx="88" cy="198" r="19" />
			<circle cx="88" cy="198" r="8" />
			<circle cx="280" cy="198" r="19" />
			<circle cx="280" cy="198" r="8" />
			{/* Rails */}
			<line x1="0" y1="213" x2="380" y2="213" />
			<line x1="0" y1="219" x2="380" y2="219" />
			{[30, 80, 130, 180, 230, 280, 330].map((x) => (
				<line key={x} x1={x} y1="211" x2={x} y2="220" />
			))}
		</svg>
	);
}

const exploreLinks = [
	{ label: "Guides", href: "/guides" },
	{ label: "Near Me", href: "/near-me" },
	{ label: "Journey", href: "/journey" },
];

const topicLinks = [
	{ label: "Food & Eating", href: "/guides" },
	{ label: "Getting Around", href: "/guides" },
	{ label: "Health & Wellbeing", href: "/guides" },
	{ label: "Home & Admin", href: "/guides" },
	{ label: "Social & Belonging", href: "/guides" },
];

export function LandingFooter() {
	return (
		<footer className="relative z-10 bg-minuri-ocean text-minuri-white">
			<LandingFooterCurve color="text-minuri-ocean" />

			{/* Section 1 — giant wordmark + contact info */}
			<div className="relative z-20 mx-auto max-w-screen-2xl px-5 pt-16 md:px-8 md:pt-24">
				<div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
					<motion.div
						initial={{ opacity: 0, y: 28 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6, ease: easeOut }}
					>
						<p className="mb-3 text-[0.62rem] font-black uppercase tracking-[0.18em] text-minuri-white/35">
							We are
						</p>
						<h2 className="text-[clamp(6rem,17vw,15rem)] font-black leading-none text-minuri-mint">
							Minuri
						</h2>
					</motion.div>

					<motion.div
						className="flex flex-col gap-8 lg:pb-4 lg:text-right"
						initial={{ opacity: 0, y: 16 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{
							duration: 0.5,
							delay: 0.15,
							ease: easeOut,
						}}
					>
						<div>
							<p className="mb-2 text-[0.61rem] font-black uppercase tracking-[0.16em] text-minuri-white/35">
								Based in
							</p>
							<p className="text-[1rem] font-semibold text-minuri-white">
								Melbourne, Australia
							</p>
							<p className="mt-1 text-[0.88rem] text-minuri-white/55">
								Supporting young adult in Melbourne
							</p>
						</div>
						<div>
							<p className="mb-2 text-[0.61rem] font-black uppercase tracking-[0.16em] text-minuri-white/35">
								Say hello
							</p>
							<Link
								href="mailto:hello@minuri.app"
								className="text-[1rem] font-semibold text-minuri-white transition-colors hover:text-minuri-mint"
							>
								hello@minuri.app
							</Link>
						</div>
					</motion.div>
				</div>
			</div>

			{/* Section 2 — tram illustration + nav columns */}
			<div className="relative z-20 mx-auto max-w-screen-2xl px-5 py-14 md:px-8 md:py-20">
				<div className="grid grid-cols-1 gap-14 lg:grid-cols-[1fr_160px_280px] lg:items-end lg:gap-12 xl:grid-cols-[1fr_180px_320px]">
					{/* Illustration */}
					<motion.div
						className="flex items-end"
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						viewport={{ once: true }}
						transition={{
							duration: 0.9,
							delay: 0.05,
							ease: easeOut,
						}}
					>
						<TramIllustration />
					</motion.div>

					{/* Explore */}
					<motion.div
						initial={{ opacity: 0, y: 14 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{
							duration: 0.5,
							delay: 0.1,
							ease: easeOut,
						}}
					>
						<p className="mb-6 text-[0.61rem] font-black uppercase tracking-[0.17em] text-minuri-white/35">
							Explore
						</p>
						<ul className="flex flex-col gap-4">
							{exploreLinks.map((link) => (
								<li key={link.label}>
									<Link
										href={link.href}
										className="text-[1.4rem] font-semibold leading-none text-minuri-white/75 transition-colors hover:text-minuri-mint"
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</motion.div>

					{/* Topics */}
					<motion.div
						initial={{ opacity: 0, y: 14 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{
							duration: 0.5,
							delay: 0.18,
							ease: easeOut,
						}}
					>
						<p className="mb-6 text-[0.61rem] font-black uppercase tracking-[0.17em] text-minuri-white/35">
							Topics
						</p>
						<ul className="flex flex-col gap-4">
							{topicLinks.map((link) => (
								<li key={link.label}>
									<Link
										href={link.href}
										className="text-[1.4rem] font-semibold leading-none text-minuri-white/75 transition-colors hover:text-minuri-mint"
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</motion.div>
				</div>
			</div>

			{/* Divider */}
			<div className="relative z-20 mx-auto max-w-screen-2xl px-5 md:px-8">
				<div className="border-t border-minuri-seafoam/25" />
			</div>

			{/* Bottom bar */}
			<div className="relative z-20 mx-auto max-w-screen-2xl px-5 py-7 md:px-8 md:py-8">
				<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
					<p className="text-[0.78rem] font-medium text-minuri-white/40">
						© {new Date().getFullYear()} Minuri
					</p>
					<div className="flex flex-wrap items-center gap-6">
						{[
							{ label: "LinkedIn", href: "#" },
							{ label: "Instagram", href: "#" },
							{ label: "Email", href: "mailto:hello@minuri.app" },
						].map((link) => (
							<Link
								key={link.label}
								href={link.href}
								className="text-[0.78rem] font-semibold text-minuri-white/45 transition-colors hover:text-minuri-mint"
							>
								{link.label}
							</Link>
						))}
					</div>
					<button
						type="button"
						onClick={scrollToTopAndHighlightLandingCta}
						className="group flex items-center gap-1 text-[0.78rem] font-semibold text-minuri-white/45 transition-colors hover:text-minuri-mint"
					>
						Start where you are
						<ArrowUpRight
							className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
							aria-hidden
						/>
					</button>
				</div>
			</div>
		</footer>
	);
}
