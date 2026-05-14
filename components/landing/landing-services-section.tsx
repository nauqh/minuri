"use client";

import Link from "next/link";
import { ChevronRight, MapPin, BookOpen } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

// ─── Guide note cards (left panel) ────────────────────────────────────────

const GUIDE_NOTES = [
	{
		topic: "Health & Wellbeing",
		accentColor: "#fcf300",
		title: "Getting a Medicare Card",
		steps: [
			"Visit a Services Australia centre",
			"Bring your passport & visa",
			"Free for eligible visa holders",
		],
		rotate: -6,
		floatPhase: 0,
	},
	{
		topic: "Getting Around",
		accentColor: "#5dd6ff",
		title: "Using Myki",
		steps: [
			"$6 card · top up at 7-Eleven",
			"Works on trains, trams & buses",
			"Register online to protect balance",
		],
		rotate: 5,
		floatPhase: 0.9,
	},
	{
		topic: "Home & Admin",
		accentColor: "#ffc2d1",
		title: "Rental Bond Rules",
		steps: [
			"Max 4 weeks rent as bond",
			"Lodged with RTBA, not landlord",
			"Refunded at end of tenancy",
		],
		rotate: -3,
		floatPhase: 1.6,
	},
];

// ─── Original 4 service cards ──────────────────────────────────────────────

type ServiceCard = {
	title: string;
	description: string;
	rotate: number;
	floatPhase: number;
};

const serviceCards: ServiceCard[] = [
	{
		title: "First-time guides",
		description:
			"Plain guides to Medicare, Myki, rental bonds, and more — before you need to ask.",
		rotate: -4,
		floatPhase: 0,
	},
	{
		title: "Near-me support",
		description:
			"GP, food bank, mental health services near you — with costs and eligibility.",
		rotate: 3,
		floatPhase: 0.8,
	},
	{
		title: "Your next steps",
		description: "We walk you through what comes next, step by step.",
		rotate: -2,
		floatPhase: 1.4,
	},
	{
		title: "Your progress",
		description: "Track what's done. See what's still waiting.",
		rotate: 4,
		floatPhase: 0.4,
	},
];

const easeOut = [0.22, 1, 0.36, 1] as const;

// ─── Section ───────────────────────────────────────────────────────────────

export function LandingServicesSection() {
	const [hovered, setHovered] = useState<"guides" | "nearby" | null>(null);
	const [isMobile, setIsMobile] = useState(false);
	const rafRef = useRef<number | null>(null);
	const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const handlePanelEnter = (panel: "guides" | "nearby") => {
		if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
		hoverTimerRef.current = setTimeout(() => setHovered(panel), 250);
	};

	const handlePanelLeave = () => {
		if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
		setHovered(null);
	};

	useEffect(() => {
		const check = () => setIsMobile(window.innerWidth < 768);
		check();
		const onResize = () => {
			if (rafRef.current) cancelAnimationFrame(rafRef.current);
			rafRef.current = requestAnimationFrame(check);
		};
		window.addEventListener("resize", onResize);
		return () => {
			window.removeEventListener("resize", onResize);
			if (rafRef.current) cancelAnimationFrame(rafRef.current);
		};
	}, []);

	const guidesWidth = isMobile
		? "100%"
		: hovered === "nearby"
			? "38%"
			: hovered === "guides"
				? "62%"
				: "50%";

	const nearbyWidth = isMobile
		? "100%"
		: hovered === "guides"
			? "38%"
			: hovered === "nearby"
				? "62%"
				: "50%";

	const panelTransition = "width 0.6s cubic-bezier(0.22, 1, 0.36, 1)";

	return (
		<section
			id="services"
			className="flex min-h-[115vh] flex-col justify-between scroll-mt-24 bg-minuri-ocean text-minuri-white md:scroll-mt-28"
			aria-labelledby="services-heading"
		>
			{/* ── Original header ── */}
			<div className="mx-auto w-full max-w-screen px-5 py-14 md:px-8 md:py-20">
				<div className="mx-auto max-w-7xl space-y-6 text-center md:space-y-7">
					<p className="mx-auto inline-flex rounded-sm bg-minuri-white/90 px-3 py-2 text-xs font-black uppercase tracking-[0.08em] text-minuri-ocean">
						What Minuri provides
					</p>
					<motion.h2
						id="services-heading"
						className="landing-section-heading text-4xl text-minuri-white md:text-5xl"
						initial={{ opacity: 0, y: 16 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.7 }}
						transition={{ duration: 1.1, ease: easeOut }}
					>
						Everything you need to settle in
					</motion.h2>
					<p className="landing-section-subheading text-xs text-minuri-mint md:text-sm">
						From your first GP visit to your first lease — the local
						knowledge you don&apos;t arrive with.
					</p>
				</div>
			</div>

			{/* ── Marquee + CTA ── */}
			<div className="relative flex flex-col items-center gap-0 overflow-hidden py-4">
				{/* Marquee row 1 → */}
				<div className="flex w-full overflow-hidden py-4 md:py-6">
					<motion.div
						className="flex shrink-0 gap-10 md:gap-16"
						animate={{ x: ["0%", "-50%"] }}
						transition={{ duration: 22, ease: "linear", repeat: Infinity }}
					>
						{[
							"Medicare",
							"Myki",
							"Rental Bond",
							"GP Visits",
							"Bank Account",
							"Community",
							"Medicare",
							"Myki",
							"Rental Bond",
							"GP Visits",
							"Bank Account",
							"Community",
						].map((t, i) => (
							<span
								key={i}
								className="whitespace-nowrap text-[clamp(2rem,4vw,3.5rem)] font-black uppercase tracking-tight text-minuri-white/10"
							>
								{t}
								<span className="ml-10 md:ml-16 text-minuri-teal/30">·</span>
							</span>
						))}
					</motion.div>
				</div>

				{/* CTA */}
				<div className="relative z-10 flex flex-col items-center gap-4 py-6">
					<p className="text-xs font-black uppercase tracking-[0.18em] text-minuri-teal/70">
						Your settlement journey
					</p>
					<div className="group relative inline-flex overflow-hidden rounded-sm">
						<Link
							href="/start"
							className="relative z-10 inline-flex h-16 items-center gap-3 rounded-sm border border-minuri-white/70 px-12 text-lg font-semibold text-minuri-white shadow-md transition-colors duration-300 group-hover:text-minuri-ocean md:h-20 md:px-16 md:text-xl"
						>
							Start your journey
							<ChevronRight
								className="size-5 transition-transform duration-200 ease-out group-hover:translate-x-1"
								aria-hidden
							/>
						</Link>
						<span className="absolute inset-0 translate-y-full bg-minuri-white transition-transform duration-[500ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
					</div>
				</div>

				{/* Marquee row 2 ← */}
				<div className="flex w-full overflow-hidden py-4 md:py-6">
					<motion.div
						className="flex shrink-0 gap-10 md:gap-16"
						animate={{ x: ["-50%", "0%"] }}
						transition={{ duration: 26, ease: "linear", repeat: Infinity }}
					>
						{[
							"Transport",
							"Food Banks",
							"Housing",
							"Utilities",
							"Mental Health",
							"Education",
							"Transport",
							"Food Banks",
							"Housing",
							"Utilities",
							"Mental Health",
							"Education",
						].map((t, i) => (
							<span
								key={i}
								className="whitespace-nowrap text-[clamp(2rem,4vw,3.5rem)] font-black uppercase tracking-tight text-minuri-white/10"
							>
								{t}
								<span className="ml-10 md:ml-16 text-minuri-teal/30">·</span>
							</span>
						))}
					</motion.div>
				</div>
			</div>

			{/* ── Original 4-card grid ── */}
			<div className="mx-auto w-full max-w-screen px-5 py-16 md:px-8 md:py-20">
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
								style={{ rotate: card.rotate }}
								className="relative flex h-40 flex-col justify-center rounded-2xl border border-minuri-mint/55 bg-minuri-ocean/70 p-5 text-left shadow-[0_16px_32px_-10px_rgba(2,24,25,0.35)] backdrop-blur-[1px] md:h-40 md:p-6"
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
		</section>
	);
}
