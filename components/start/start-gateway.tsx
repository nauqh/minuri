"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ChevronDown, BookOpen, MapPin, Route } from "lucide-react";
import { motion } from "motion/react";

import { useLenis } from "lenis/react";

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
		href: "/guides",
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
		href: "/guides",
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
		href: "/guides",
	},
];

const easeOut = [0.22, 1, 0.36, 1] as const;
const panelTransition = "width 0.6s cubic-bezier(0.22, 1, 0.36, 1)";

export function StartGateway() {
	const lenis = useLenis();

	return (
		<div className="bg-minuri-ocean text-minuri-white">
			{/* ── Screen 1: Hero + Journey CTA ── */}
			<div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-minuri-white px-6 py-24 text-center">
				{/* Back button */}
				<Link
					href="/"
					className="absolute left-6 top-6 z-20 inline-flex items-center gap-2 rounded-sm border border-minuri-ocean/20 bg-minuri-white/80 px-6 py-2 text-base font-semibold text-minuri-ocean shadow-xs backdrop-blur-sm transition-colors duration-200 hover:bg-minuri-ocean hover:text-minuri-white"
				>
					<ArrowLeft className="size-3.5" aria-hidden />
					Back to Home
				</Link>

				{/* Grid */}
				<div
					aria-hidden
					className="pointer-events-none absolute inset-0"
					style={{
						backgroundImage: [
							"linear-gradient(to right, rgba(2,18,20,0.055) 1px, transparent 1px)",
							"linear-gradient(to bottom, rgba(2,18,20,0.055) 1px, transparent 1px)",
						].join(", "),
						backgroundSize: "72px 72px",
					}}
				/>
				<div
					aria-hidden
					className="pointer-events-none absolute inset-0"
					style={{
						background:
							"radial-gradient(ellipse 80% 70% at 50% 50%, transparent 30%, rgba(255,255,255,0.55) 60%, white 82%)",
					}}
				/>

				{/* Heading */}
				<motion.h1
					className="relative mx-auto max-w-4xl font-black leading-[1.05] tracking-tight text-minuri-ocean"
					style={{ fontSize: "clamp(2.8rem, 7vw, 6rem)" }}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.75, ease: easeOut, delay: 0.08 }}
				>
					You&apos;ve arrived. <br className="hidden md:block" />
					Now let&apos;s make it{" "}
					<span className="text-minuri-teal">feel like home.</span>
				</motion.h1>

				{/* Subtext */}
				<motion.p
					className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-minuri-ocean/55 md:text-lg"
					initial={{ opacity: 0, y: 16 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.7, ease: easeOut, delay: 0.18 }}
				>
					Tell us a little about yourself and we&apos;ll build a
					personalised 7-day plan for your first week in Melbourne.
				</motion.p>

				{/* Journey CTA */}
				<motion.div
					className="mt-10 flex flex-col items-center gap-4"
					initial={{ opacity: 0, y: 14 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.65, ease: easeOut, delay: 0.28 }}
				>
					<div className="group relative mb-3 mr-3">
						<div className="absolute inset-0 translate-x-[12px] translate-y-[12px] rounded-xl bg-minuri-ocean/18" />
						<div className="absolute inset-0 translate-x-[6px] translate-y-[6px] rounded-xl bg-minuri-ocean/38 transition-transform duration-200 ease-out group-hover:translate-x-[10px] group-hover:translate-y-[10px]" />
						<Link
							href="/journey"
							className="relative z-10 inline-flex h-14 cursor-pointer items-center gap-3 rounded-xl bg-minuri-ocean px-10 text-base font-black uppercase tracking-widest text-white transition-transform duration-200 ease-out group-hover:translate-x-[9px] group-hover:translate-y-[9px]"
						>
							<Route className="size-5" aria-hidden />
							Build my journey
						</Link>
					</div>
				</motion.div>

				{/* Scroll hint */}
				<motion.div
					className="absolute bottom-8 left-1/2 flex -translate-x-1/2 cursor-pointer flex-col items-center gap-3"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.6, delay: 0.6 }}
					onClick={() =>
						lenis?.scrollTo(window.scrollY + window.innerHeight, {
							duration: 1.2,
							easing: (t) => 1 - Math.pow(1 - t, 4),
						})
					}
					aria-label="Scroll to explore individual features"
				>
					<span className="text-sm font-semibold uppercase tracking-widest text-minuri-ocean/50">
						Or scroll to explore individual features
					</span>
					<motion.div
						animate={{ y: [0, 6, 0] }}
						transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
					>
						<ChevronDown className="size-8 text-minuri-ocean/60" aria-hidden />
					</motion.div>
				</motion.div>
			</div>

			{/* ── Screen 2: Guides + Near Me ── */}
			<section
				className="px-4 py-8 md:px-8 md:py-16"
				style={{ background: "oklch(0.18 0.042 228)" }}
			>
				<motion.div
					className="px-6 pb-10 pt-16 text-center"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.5 }}
					transition={{ duration: 0.7, ease: easeOut }}
				>
					<h2 className="mt-4 text-3xl font-black tracking-wider leading-snug text-minuri-white md:text-4xl">
						Or start with what you need right now —
						<br className="hidden md:block" />
						<span className="text-minuri-ice"> Guides</span> or{" "}
						<span className="text-minuri-ice">Near-me</span>{" "}
						support.
					</h2>
				</motion.div>

				{/* Split screen */}
				<div className="relative mx-auto max-w-[90rem] flex h-auto min-h-[85vh] flex-col overflow-hidden rounded-2xl md:h-[85vh] md:flex-row">
					{/* ─── Guides panel ─── */}
					<div
						className="relative min-h-[75vh] flex-1 overflow-hidden md:min-h-0"
						style={{ background: "oklch(0.96 0.022 75)" }}
					>
						<div
							aria-hidden
							className="pointer-events-none absolute inset-0"
							style={{
								backgroundImage: [
									"linear-gradient(to right, rgba(2,18,20,0.055) 1px, transparent 1px)",
									"linear-gradient(to bottom, rgba(2,18,20,0.055) 1px, transparent 1px)",
								].join(", "),
								backgroundSize: "72px 72px",
							}}
						/>

						{/* Floating cards */}
						<div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
							{GUIDE_NOTES.map((note, i) => (
								<motion.div
									key={note.title}
									className="absolute w-64 md:w-80"
									style={{
										rotate: note.rotate,
										left: `${2 + i * 26}%`,
										top: `${4 + i * 20}%`,
										transformOrigin: "50% 0%",
										pointerEvents: "auto",
										cursor: "pointer",
									}}
									animate={{ y: [0, -8, 0] }}
									transition={{
										y: {
											duration: 3.6,
											repeat: Infinity,
											ease: "easeInOut",
										},
									}}
									whileHover={{
										rotate: [
											note.rotate,
											note.rotate - 5,
											note.rotate + 3.5,
											note.rotate - 2,
											note.rotate + 0.5,
											note.rotate,
										],
										transition: {
											duration: 0.65,
											ease: [0.36, 0.07, 0.19, 0.97],
										},
									}}
								>
									<div className="absolute -top-3.5 left-1/2 z-10 flex size-7 -translate-x-1/2 items-center justify-center rounded-full bg-minuri-coral shadow-[0_3px_8px_rgba(0,0,0,0.28)]">
										<div className="size-2.5 rounded-full bg-white/80" />
									</div>
									<div className="overflow-hidden rounded-xl shadow-xl">
										<div
											className="px-4 py-3"
											style={{
												backgroundColor:
													note.accentColor,
											}}
										>
											<p
												className="text-[9px] font-black uppercase tracking-[0.14em]"
												style={{
													color: "rgba(2,18,20,0.55)",
												}}
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
										<div
											className="h-px w-full"
											style={{
												backgroundColor:
													note.accentColor,
												filter: "brightness(0.88)",
											}}
										/>
										<div className="space-y-1.5 bg-white px-4 py-3">
											{note.steps.map((step, j) => (
												<div
													key={j}
													className="flex items-start gap-2"
												>
													<span
														className="mt-px flex size-4 flex-shrink-0 items-center justify-center rounded-full text-[9px] font-black"
														style={{
															backgroundColor:
																note.accentColor +
																"55",
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
									</div>
								</motion.div>
							))}
						</div>

						{/* Persistent label */}
						<div className="absolute right-6 top-6 z-20 inline-flex items-center gap-2 rounded-lg bg-minuri-ocean px-4 py-2.5 shadow-md">
							<BookOpen className="size-4 text-white" aria-hidden />
							<span className="text-xs font-black uppercase tracking-widest text-white">Guides</span>
						</div>

						{/* Static card */}
						<div className="absolute bottom-6 left-6 z-30 w-4/5 rounded-2xl bg-minuri-mid p-6 shadow-xl">
							<div className="mb-5 inline-flex items-center gap-2 rounded-full bg-minuri-white/15 px-3.5 py-1.5 backdrop-blur-sm">
								<BookOpen className="size-3.5 text-minuri-white" aria-hidden />
								<span className="text-xs font-black uppercase tracking-widest text-minuri-white">Guides</span>
							</div>
							<h3 className="mt-1 text-base font-medium leading-snug text-minuri-white">
								Step-by-step guides for Medicare, Myki, rental bonds, banking, and more — everything you need to settle in.
							</h3>
							<div className="group relative mt-7 inline-flex overflow-hidden rounded-sm bg-minuri-ice">
								<Link
									href="/guides"
									className="relative z-10 inline-flex h-12 items-center gap-2 px-7 text-sm font-bold uppercase tracking-wider text-minuri-ocean"
								>
									Explore first-time guides
									<ChevronDown className="size-4 -rotate-90 transition-transform duration-200 group-hover:translate-x-1" aria-hidden />
								</Link>
								<span className="absolute inset-0 -translate-x-full bg-minuri-white transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0" />
							</div>
						</div>

					</div>

					{/* Divider */}
					<div
						className="h-px w-full md:h-full md:w-px md:shrink-0"
						style={{ background: "oklch(0.18 0.042 228)" }}
					/>

					{/* ─── Near Me panel ─── */}
					<div className="relative min-h-[75vh] flex-1 overflow-hidden md:min-h-0">
						<Image
							src="/map-preview.png"
							alt="Map preview"
							fill
							sizes="(max-width: 768px) 100vw, 50vw"
							className="object-cover"
							priority={true}
						/>
						{/* Persistent label */}
						<div className="absolute right-6 top-6 z-20 inline-flex items-center gap-2 rounded-lg bg-minuri-white px-4 py-2.5 shadow-md">
							<MapPin className="size-4 text-minuri-ocean" aria-hidden />
							<span className="text-xs font-black uppercase tracking-widest text-minuri-ocean">Near Me</span>
						</div>

						{/* Static card */}
						<div className="absolute bottom-6 left-6 z-30 w-4/5 rounded-2xl bg-minuri-mid p-6 shadow-xl">
							<div className="mb-5 inline-flex items-center gap-2 rounded-full bg-minuri-white/15 px-3.5 py-1.5 backdrop-blur-sm">
								<MapPin className="size-3.5 text-minuri-white" aria-hidden />
								<span className="text-xs font-black uppercase tracking-widest text-minuri-white">Near Me</span>
							</div>
							<h3 className="mt-1 text-base font-medium leading-snug text-minuri-white">
								GP clinics, food banks, legal aid, community centres — filtered by your suburb and what you need right now.
							</h3>
							<div className="group relative mt-7 inline-flex overflow-hidden rounded-sm bg-minuri-ice">
								<Link
									href="/near-me"
									className="relative z-10 inline-flex h-12 items-center gap-2 px-7 text-sm font-bold uppercase tracking-wider text-minuri-ocean"
								>
									Find nearby support
									<ChevronDown className="size-4 -rotate-90 transition-transform duration-200 group-hover:translate-x-1" aria-hidden />
								</Link>
								<span className="absolute inset-0 -translate-x-full bg-minuri-white transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0" />
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
