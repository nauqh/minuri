"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ChevronDown, BookOpen, MapPin, Route } from "lucide-react";
import { motion } from "motion/react";

import { useLenis } from "lenis/react";


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

			{/* ── Row 1: Guides ── */}
			<section className="flex flex-col-reverse md:flex-row" style={{ background: "oklch(0.97 0.018 75)" }}>
				{/* Text */}
				<motion.div
					className="flex flex-1 flex-col justify-center px-8 py-16 md:px-14 lg:px-20"
					initial={{ opacity: 0, x: -24 }}
					whileInView={{ opacity: 1, x: 0 }}
					viewport={{ once: true, amount: 0.4 }}
					transition={{ duration: 0.65, ease: easeOut }}
				>
					<span className="inline-flex w-fit items-center gap-2 rounded-full border border-minuri-ocean/15 bg-minuri-ocean/8 px-3.5 py-1.5 text-[0.65rem] font-black uppercase tracking-[0.15em] text-minuri-ocean">
						<BookOpen className="size-3" aria-hidden />
						Guides
					</span>
					<h2 className="mt-6 max-w-sm text-3xl font-black leading-tight tracking-tight text-minuri-ocean md:text-4xl lg:text-[2.75rem]">
						Everything you need, step by step.
					</h2>
					<p className="mt-5 max-w-sm text-base leading-relaxed text-minuri-ocean/55 md:text-[1.05rem]">
						Medicare, Myki, rental bonds, banking — clear guides built for people starting fresh in Melbourne.
					</p>
					<Link
						href="/guides"
						className="group mt-9 inline-flex w-fit items-center gap-2.5 rounded-sm border border-minuri-ocean/30 bg-minuri-white px-6 py-3 text-sm font-black uppercase tracking-widest text-minuri-ocean shadow-md transition-colors duration-200 hover:bg-minuri-ocean hover:text-white hover:border-minuri-ocean hover:shadow-lg"
					>
						Explore first-time guides
						<ChevronDown className="size-4 -rotate-90 transition-transform duration-200 group-hover:translate-x-1" aria-hidden />
					</Link>
				</motion.div>

				{/* Visual */}
				<div
					className="relative flex min-h-[560px] flex-1 items-center justify-center overflow-hidden"
					style={{ background: "oklch(0.92 0.032 75)" }}
				>
					<motion.div
						className="relative"
						style={{ width: 460, height: 560 }}
						initial={{ opacity: 0, y: 28 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.3 }}
						transition={{ duration: 0.7, ease: easeOut, delay: 0.12 }}
					>
						{/* Notebook */}
						<motion.div
							className="absolute overflow-hidden rounded-xl bg-white shadow-xl"
							style={{ width: 284, height: 400, top: 84, left: 92, rotate: "-1.5deg" }}
							animate={{ y: [0, -4, 0] }}
							transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
						>
							{/* Spiral binding */}
							<div className="absolute inset-y-0 left-0 flex w-10 flex-col items-center gap-4 pt-6" style={{ background: "oklch(0.88 0.02 75)" }}>
								{Array.from({ length: 8 }).map((_, i) => (
									<div key={i} className="size-4 rounded-full border-2 border-[#b8ae9e] bg-white" />
								))}
							</div>
							{/* Page content */}
							<div className="absolute inset-0 left-10 flex flex-col px-5 pt-5">
								<p className="mb-4 text-[10px] font-black uppercase tracking-widest text-[#021214]/35">First Week Checklist</p>
								{[
									{ done: true,  text: "Register for Medicare" },
									{ done: true,  text: "Get Myki card" },
									{ done: false, text: "Open bank account" },
									{ done: false, text: "Find nearest GP" },
									{ done: false, text: "Lodge rental bond" },
									{ done: false, text: "Join local community group" },
								].map((item, i) => (
									<div key={i} className="flex items-center gap-2.5 border-b border-[#021214]/06 py-2.5">
										<div
											className="flex size-4 shrink-0 items-center justify-center rounded-sm border"
											style={{
												backgroundColor: item.done ? "#0d9488" : "transparent",
												borderColor: item.done ? "#0d9488" : "rgba(2,18,20,0.2)",
											}}
										>
											{item.done && <span className="text-[8px] font-black text-white">✓</span>}
										</div>
										<p className={`text-[11px] leading-snug ${item.done ? "line-through text-[#021214]/30" : "text-[#021214]/60"}`}>{item.text}</p>
									</div>
								))}
								{Array.from({ length: 3 }).map((_, i) => (
									<div key={i} className="border-b border-[#021214]/05 py-3" />
								))}
							</div>
						</motion.div>

						{/* Sticky — yellow, top right */}
						<motion.div
							className="absolute rounded-sm px-3.5 py-3 shadow-md"
							style={{ backgroundColor: "#fcf300", width: 155, top: 10, right: 10, rotate: "6deg", zIndex: 10 }}
							animate={{ y: [0, -5, 0] }}
							transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
						>
							<div aria-hidden className="absolute left-1/2 -top-3 -translate-x-1/2 rounded-[1px]" style={{ width: 48, height: 14, background: "rgba(253,230,138,0.85)", boxShadow: "0 1px 2px rgba(0,0,0,0.08)" }} />
							<p className="mb-0.5 text-[9px] font-black uppercase tracking-widest text-[#021214]/45">Health</p>
							<p className="text-xs font-bold leading-tight text-[#021214]">Medicare Card</p>
							<p className="mt-1 text-[10px] leading-snug text-[#021214]/55">Free for eligible visa holders</p>
						</motion.div>

						{/* Sticky — blue, right */}
						<motion.div
							className="absolute rounded-sm px-3.5 py-3 shadow-md"
							style={{ backgroundColor: "#5dd6ff", width: 148, top: 228, right: 0, rotate: "-5deg", zIndex: 10 }}
							animate={{ y: [0, -6, 0] }}
							transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut", delay: 1.0 }}
						>
							<div aria-hidden className="absolute left-1/2 -top-3 -translate-x-1/2 rounded-[1px]" style={{ width: 48, height: 14, background: "rgba(253,230,138,0.85)", boxShadow: "0 1px 2px rgba(0,0,0,0.08)" }} />
							<p className="mb-0.5 text-[9px] font-black uppercase tracking-widest text-[#021214]/45">Transport</p>
							<p className="text-xs font-bold leading-tight text-[#021214]">Myki Card</p>
							<p className="mt-1 text-[10px] leading-snug text-[#021214]/55">$6 · top up at 7-Eleven</p>
						</motion.div>

						{/* Sticky — pink, bottom left */}
						<motion.div
							className="absolute rounded-sm px-3.5 py-3 shadow-md"
							style={{ backgroundColor: "#ffc2d1", width: 152, bottom: 24, left: 24, rotate: "-4deg", zIndex: 10 }}
							animate={{ y: [0, -5, 0] }}
							transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
						>
							<div aria-hidden className="absolute left-1/2 -top-3 -translate-x-1/2 rounded-[1px]" style={{ width: 48, height: 14, background: "rgba(253,230,138,0.85)", boxShadow: "0 1px 2px rgba(0,0,0,0.08)" }} />
							<p className="mb-0.5 text-[9px] font-black uppercase tracking-widest text-[#021214]/45">Housing</p>
							<p className="text-xs font-bold leading-tight text-[#021214]">Rental Bond</p>
							<p className="mt-1 text-[10px] leading-snug text-[#021214]/55">Max 4 weeks rent</p>
						</motion.div>

						{/* Sticky — teal, left */}
						<motion.div
							className="absolute rounded-sm px-3.5 py-3 shadow-md"
							style={{ backgroundColor: "#00f5c8", width: 138, top: 122, left: 0, rotate: "4deg", zIndex: 5 }}
							animate={{ y: [0, -4, 0] }}
							transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut", delay: 1.4 }}
						>
							<div aria-hidden className="absolute left-1/2 -top-3 -translate-x-1/2 rounded-[1px]" style={{ width: 48, height: 14, background: "rgba(253,230,138,0.85)", boxShadow: "0 1px 2px rgba(0,0,0,0.08)" }} />
							<p className="mb-0.5 text-[9px] font-black uppercase tracking-widest text-[#021214]/45">Social</p>
							<p className="text-xs font-bold leading-tight text-[#021214]">Community</p>
							<p className="mt-1 text-[10px] leading-snug text-[#021214]/55">Find local groups nearby</p>
						</motion.div>
					</motion.div>
				</div>
			</section>

			{/* ── Row 2: Near Me ── */}
			<section className="flex flex-col md:flex-row" style={{ background: "oklch(0.14 0.038 228)" }}>
				{/* Map visual */}
				<div className="relative min-h-[340px] flex-1 overflow-hidden md:min-h-0">
					<Image
						src="/map-preview.png"
						alt="Map preview"
						fill
						sizes="(max-width: 768px) 100vw, 50vw"
						className="object-cover"
						priority={false}
					/>
				</div>

				{/* Text */}
				<motion.div
					className="flex flex-1 flex-col justify-center px-8 py-16 md:px-14 lg:px-20"
					initial={{ opacity: 0, x: 24 }}
					whileInView={{ opacity: 1, x: 0 }}
					viewport={{ once: true, amount: 0.4 }}
					transition={{ duration: 0.65, ease: easeOut }}
				>
					<span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/12 bg-white/8 px-3.5 py-1.5 text-[0.65rem] font-black uppercase tracking-[0.15em] text-white">
						<MapPin className="size-3" aria-hidden />
						Near Me
					</span>
					<h2 className="mt-6 max-w-sm text-3xl font-black leading-tight tracking-tight text-white md:text-4xl lg:text-[2.75rem]">
						Find support near you, right now.
					</h2>
					<p className="mt-5 max-w-sm text-base leading-relaxed text-white/50 md:text-[1.05rem]">
						GP clinics, food banks, legal aid, community centres — filtered by your suburb and what you need right now.
					</p>
					<Link
						href="/near-me"
						className="group mt-9 inline-flex w-fit items-center gap-2.5 rounded-sm border border-white/25 bg-white/10 px-6 py-3 text-sm font-black uppercase tracking-widest text-white shadow-md shadow-black/30 transition-colors duration-200 hover:bg-white hover:text-minuri-ocean hover:border-white hover:shadow-lg"
					>
						Find nearby support
						<ChevronDown className="size-4 -rotate-90 transition-transform duration-200 group-hover:translate-x-1" aria-hidden />
					</Link>
				</motion.div>
			</section>
		</div>
	);
}
