"use client";

import Link from "next/link";
import { ChevronRight, MapPin, BookOpen } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { NearMeMap } from "@/components/near-me/near-me-map";
import type { NearMePlace } from "@/lib/near-me";

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

// ─── Showcase map data (right panel) ──────────────────────────────────────

const SHOWCASE_PLACES: NearMePlace[] = [
	{
		id: "showcase-rmh",
		name: "Royal Melbourne Hospital",
		address: "300 Grattan St, Parkville VIC 3050",
		lat: -37.7995,
		lng: 144.955,
		topic: "health-wellbeing",
		subtype: "hospital",
		type: "Public Hospital",
		rating: 3.9,
		reviewCount: 1240,
		openNow: true,
	},
	{
		id: "showcase-headspace",
		name: "headspace Melbourne",
		address: "Level 2, 13-15 Batman St, West Melbourne VIC 3003",
		lat: -37.8118,
		lng: 144.949,
		topic: "health-wellbeing",
		subtype: "mental-health",
		type: "Mental Health Service",
		rating: 4.2,
		reviewCount: 89,
		openNow: true,
		price: "Free",
	},
	{
		id: "showcase-cbd-medical",
		name: "Melbourne CBD Medical Centre",
		address: "197 Elizabeth St, Melbourne VIC 3000",
		lat: -37.8132,
		lng: 144.961,
		topic: "health-wellbeing",
		subtype: "gp",
		type: "General Practitioner",
		rating: 4.0,
		reviewCount: 312,
		openNow: true,
	},
	{
		id: "showcase-carlton",
		name: "Carlton Clinic",
		address: "186 Faraday St, Carlton VIC 3053",
		lat: -37.802,
		lng: 144.966,
		topic: "health-wellbeing",
		subtype: "gp",
		type: "General Practitioner",
		rating: 4.5,
		reviewCount: 156,
		openNow: false,
		hours: "Closes 5 pm",
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
			className="scroll-mt-24 bg-minuri-ocean text-minuri-white md:scroll-mt-28"
			aria-labelledby="services-heading"
		>
			{/* ── Original header ── */}
			<div className="mx-auto w-full max-w-screen px-5 py-24 md:px-8 md:py-32">
				<div className="mx-auto max-w-7xl space-y-6 text-center md:space-y-7">
					<p className="mx-auto inline-flex rounded-lg bg-minuri-white/90 px-3 py-2 text-xs font-black uppercase tracking-[0.08em] text-minuri-ocean">
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
					<div>
						<Link
							href="/journey"
							className="group inline-flex h-11 items-center gap-1.5 rounded-full border border-minuri-white/70 px-5 text-sm font-medium text-minuri-white transition-colors duration-200 hover:bg-minuri-white hover:text-minuri-ocean"
						>
							Start your journey
							<ChevronRight
								className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-1"
								aria-hidden
							/>
						</Link>
					</div>
				</div>
			</div>

			{/* ── Split-screen showcase ── */}
			<div className="flex flex-col overflow-hidden md:flex-row md:min-h-[82vh]">
				{/* ─── GUIDES panel ─── */}
				<div
					className="relative flex min-h-[60vh] flex-col justify-end overflow-hidden md:min-h-0"
					style={{ width: guidesWidth, transition: panelTransition }}
					onMouseEnter={() => setHovered("guides")}
					onMouseLeave={() => setHovered(null)}
				>
					{/* Dark bg + grid texture */}
					<div
						className="absolute inset-0"
						style={{ background: "oklch(0.14 0.042 228)" }}
					/>
					<div
						aria-hidden
						className="pointer-events-none absolute inset-0"
						style={{
							backgroundImage: [
								"linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px)",
								"linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)",
							].join(", "),
							backgroundSize: "72px 72px",
						}}
					/>

					{/* Ghost word */}
					<span
						aria-hidden
						className="pointer-events-none absolute bottom-0 left-0 select-none font-black uppercase leading-none text-minuri-white"
						style={{
							fontSize: "clamp(5rem, 18vw, 16rem)",
							opacity: 0.04,
							letterSpacing: "-0.02em",
						}}
					>
						GUIDES
					</span>

					{/* Note cards — floating in right half of panel */}
					<div className="pointer-events-none absolute inset-0 overflow-hidden">
						{GUIDE_NOTES.map((note, i) => (
							<motion.div
								key={note.title}
								className="absolute w-52 overflow-hidden rounded-xl shadow-2xl md:w-60"
								style={{
									rotate: note.rotate,
									left: `${4 + i * 30}%`,
									top: `${8 + (i === 1 ? 0 : i * 10)}%`,
								}}
								animate={{ y: [0, -8, 0] }}
								transition={{
									duration: 3.6 + note.floatPhase * 0.3,
									repeat: Infinity,
									ease: "easeInOut",
									delay: note.floatPhase,
								}}
							>
								{/* Colored header strip */}
								<div
									className="px-4 py-3"
									style={{
										backgroundColor: note.accentColor,
									}}
								>
									<p
										className="text-[9px] font-black uppercase tracking-[0.14em]"
										style={{ color: "rgba(2,18,20,0.55)" }}
									>
										{note.topic}
									</p>
									<p
										className="mt-1 text-sm font-black leading-snug"
										style={{ color: "#021214" }}
									>
										{note.title}
									</p>
								</div>

								{/* White body with steps */}
								<div className="bg-white px-4 py-3 space-y-1.5">
									{note.steps.map((step, j) => (
										<div
											key={j}
											className="flex items-start gap-2"
										>
											<span
												className="mt-px flex size-4 flex-shrink-0 items-center justify-center rounded-full text-[9px] font-black"
												style={{
													backgroundColor:
														note.accentColor + "55",
													color: "#021214",
												}}
											>
												{j + 1}
											</span>
											<p className="text-[11px] leading-snug text-[#1e3a4a]/75">
												{step}
											</p>
										</div>
									))}
								</div>
							</motion.div>
						))}
					</div>

					{/* Gradient: note cards fade into content below */}
					<div
						aria-hidden
						className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2"
						style={{
							background:
								"linear-gradient(to top, oklch(0.14 0.042 228) 45%, oklch(0.14 0.042 228 / 0.75) 70%, transparent 100%)",
						}}
					/>

					{/* Content */}
					<motion.div
						className="relative z-10 p-8 md:p-14"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.4 }}
						transition={{ duration: 0.7, ease: easeOut }}
					>
						<div className="mb-5 inline-flex items-center gap-2 rounded-full bg-minuri-white/15 px-3.5 py-1.5">
							<BookOpen
								className="size-3.5 text-minuri-white"
								aria-hidden
							/>
							<span className="text-xs font-black uppercase tracking-widest text-minuri-white">
								Guides
							</span>
						</div>
						<h3 className="mt-1 max-w-lg text-xl font-semibold leading-snug text-minuri-white md:text-2xl">
							Guides to Medicare, Myki, rental bonds — before you
							need to ask.
						</h3>
						<Link
							href="/guides"
							className="group/cta mt-7 inline-flex items-center gap-2 rounded-full border border-minuri-white/30 bg-minuri-white/10 px-5 py-2.5 text-sm font-semibold text-minuri-white transition-colors duration-200 hover:bg-minuri-white hover:text-minuri-ocean"
						>
							Explore guides
							<ChevronRight
								className="size-4 transition-transform duration-200 group-hover/cta:translate-x-0.5"
								aria-hidden
							/>
						</Link>
					</motion.div>
				</div>

				{/* ─── Seam ─── */}
				<div
					className="relative z-20 hidden items-stretch md:flex"
					aria-hidden
				>
					<div className="w-px bg-minuri-white/10" />
					<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex size-9 items-center justify-center rounded-full border border-minuri-white/15 bg-minuri-ocean shadow-xl">
						<span className="text-[10px] font-black uppercase tracking-widest text-minuri-white/50">
							&
						</span>
					</div>
				</div>

				{/* ─── NEAR ME panel ─── */}
				<div
					className="relative flex min-h-[60vh] flex-col justify-end overflow-hidden md:min-h-0"
					style={{ width: nearbyWidth, transition: panelTransition }}
					onMouseEnter={() => setHovered("nearby")}
					onMouseLeave={() => setHovered(null)}
				>
					{/* Real NearMeMap fills entire panel */}
					<div className="absolute inset-0">
						<NearMeMap
							places={SHOWCASE_PLACES}
							selectedPlaceId={null}
							onSelectPlace={() => {}}
							topic="health-wellbeing"
							hoveredPlaceId={null}
							onHoverPlace={() => {}}
						/>
					</div>

					{/* Gradient: map fades into content below */}
					<div
						aria-hidden
						className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2"
						style={{
							background:
								"linear-gradient(to top, oklch(0.96 0.012 210) 45%, oklch(0.96 0.012 210 / 0.75) 70%, transparent 100%)",
						}}
					/>

					{/* Content */}
					<motion.div
						className="relative z-10 p-8 md:p-14"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.4 }}
						transition={{
							duration: 0.7,
							ease: easeOut,
							delay: 0.08,
						}}
					>
						<div className="mb-5 inline-flex items-center gap-2 rounded-full bg-minuri-ocean/12 px-3.5 py-1.5 backdrop-blur-sm">
							<MapPin
								className="size-3.5 text-minuri-teal"
								aria-hidden
							/>
							<span className="text-xs font-black uppercase tracking-widest text-minuri-ocean">
								Near Me
							</span>
						</div>
						<h3 className="mt-1 max-w-lg text-xl font-semibold leading-snug text-minuri-ocean md:text-2xl">
							Support services near you — with costs and
							eligibility.
						</h3>
						<Link
							href="/near-me"
							className="group/cta mt-7 inline-flex items-center gap-2 rounded-full border border-minuri-ocean/25 bg-minuri-ocean px-5 py-2.5 text-sm font-semibold text-minuri-white transition-colors duration-200 hover:bg-minuri-mid"
						>
							Find nearby support
							<ChevronRight
								className="size-4 transition-transform duration-200 group-hover/cta:translate-x-0.5"
								aria-hidden
							/>
						</Link>
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
