"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ChevronRight, BookOpen, MapPin } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
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

	return (
		<div className="bg-minuri-ocean text-minuri-white">
			{/* ── Page header — cream canvas (mirrors left panel) ── */}
			<div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-minuri-white px-6 py-24 text-center">
				{/* Back button */}
				<Link
					href="/"
					className="absolute left-6 top-6 z-20 inline-flex items-center gap-2 rounded-sm border border-minuri-ocean/20 bg-minuri-white/80 px-6 py-2 text-base font-semibold text-minuri-ocean shadow-xs backdrop-blur-sm transition-colors duration-200 hover:bg-minuri-ocean hover:text-minuri-white"
				>
					<ArrowLeft className="size-3.5" aria-hidden />
					Back to home
				</Link>
				{/* Grid — dark lines matching left panel */}
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

				{/* Radial fade — soften grid at edges */}
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
					Browse guides, find nearby support, or build a 7-day plan —
					all built for your first weeks in Melbourne.
				</motion.p>

				{/* Scroll indicator */}
				<motion.div
					className="absolute bottom-8 left-1/2 flex -translate-x-1/2 cursor-pointer flex-col items-center gap-2"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.6, delay: 0.4 }}
					onClick={() =>
						lenis?.scrollTo(window.scrollY + window.innerHeight, {
							duration: 1.2,
							easing: (t) => 1 - Math.pow(1 - t, 4),
						})
					}
					aria-label="Scroll down"
				>
					<motion.span
						className="text-xs font-semibold uppercase tracking-widest text-minuri-ocean/60"
						animate={{ opacity: [0.5, 1, 0.5] }}
						transition={{
							duration: 2,
							repeat: Infinity,
							ease: "easeInOut",
						}}
					>
						Scroll to explore
					</motion.span>
					<div className="relative flex h-10 w-6 items-start justify-center rounded-full border-2 border-minuri-ocean/40 pt-1.5">
						<motion.div
							className="h-1.5 w-1 rounded-full bg-minuri-teal"
							animate={{ y: [0, 14, 0], opacity: [1, 0, 1] }}
							transition={{
								duration: 1.5,
								repeat: Infinity,
								ease: "easeInOut",
							}}
						/>
					</div>
				</motion.div>
			</div>

			{/* ── Combined: heading + split screen + closing ── */}
			<section
				className="px-4 py-8 md:px-8 md:py-16"
				style={{ background: "oklch(0.18 0.042 228)" }}
			>
				{/* Top heading */}
				<motion.div
					className="px-6 pb-10 pt-16 text-center"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.5 }}
					transition={{ duration: 0.7, ease: easeOut }}
				>
					<h2 className="mt-4 text-3xl font-black tracking-wider leading-snug text-minuri-white md:text-4xl">
						Start with what you need right now —
						<br className="hidden md:block" />
						<span className="text-minuri-ice"> Guides</span> or{" "}
						<span className="text-minuri-ice">Near-me</span>{" "}
						support.
					</h2>
				</motion.div>

				{/* Split screen — contained like a lens */}
				<div className="relative mx-auto max-w-[90rem] flex h-auto min-h-[85vh] flex-col overflow-hidden rounded-2xl md:h-[85vh] md:flex-row">
					{/* ─── Guides panel ─── */}
					<div
						className="relative min-h-[75vh] overflow-hidden md:min-h-0"
						style={{
							width: guidesWidth,
							transition: panelTransition,
							background: "oklch(0.96 0.022 75)",
						}}
						onMouseEnter={() => handlePanelEnter("guides")}
						onMouseLeave={handlePanelLeave}
					>
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
									{/* Pushpin */}
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
							<BookOpen
								className="size-4 text-white"
								aria-hidden
							/>
							<span className="text-xs font-black uppercase tracking-widest text-white">
								Guides
							</span>
						</div>

						{/* Hover drawer */}
						<motion.div
							className="absolute bottom-6 left-6 z-30 max-w-sm rounded-2xl bg-minuri-mid p-6 shadow-xl"
							animate={{ y: hovered === "guides" ? 0 : "100%" }}
							transition={{ duration: 0.45, ease: easeOut }}
						>
							<div className="mb-5 inline-flex items-center gap-2 rounded-full bg-minuri-white/15 px-3.5 py-1.5 backdrop-blur-sm">
								<BookOpen
									className="size-3.5 text-minuri-white"
									aria-hidden
								/>
								<span className="text-xs font-black uppercase tracking-widest text-minuri-white">
									Guides
								</span>
							</div>
							<h3 className="mt-1 text-base font-medium leading-snug text-minuri-white">
								Step-by-step guides for Medicare, Myki, rental
								bonds, banking, and more — everything you need
								to settle in.
							</h3>
							<div className="group relative mt-7 inline-flex overflow-hidden rounded-sm bg-minuri-ice">
								<Link
									href="/guides"
									className="relative z-10 inline-flex h-12 items-center gap-2 px-7 text-sm font-bold uppercase tracking-wider text-minuri-ocean transition-colors duration-300 group-hover:text-minuri-ocean"
								>
									Explore first-time guides
									<ChevronRight
										className="size-4 transition-transform duration-200 group-hover:translate-x-1"
										aria-hidden
									/>
								</Link>
								<span className="absolute inset-0 -translate-x-full bg-minuri-white transition-transform duration-[500ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0" />
							</div>
						</motion.div>
					</div>

					{/* ─── Divider ─── */}
					<div
						className="h-6 w-full md:h-full md:w-px md:shrink-0"
						style={{ background: "oklch(0.18 0.042 228)" }}
					/>

					{/* ─── Near Me panel ─── */}
					<div
						className="relative min-h-[75vh] overflow-hidden md:min-h-0"
						style={{
							width: nearbyWidth,
							transition: panelTransition,
						}}
						onMouseEnter={() => handlePanelEnter("nearby")}
						onMouseLeave={handlePanelLeave}
					>
						{/* Full-bleed map */}
						<Image
							src="/map-preview.png"
							alt="Map preview"
							fill
							sizes="(max-width: 768px) 100vw, 50vw"
							className="object-cover"
							priority={false}
						/>

						{/* Persistent label */}
						<div className="absolute right-6 top-6 z-20 inline-flex items-center gap-2 rounded-lg bg-minuri-white px-4 py-2.5 shadow-md">
							<MapPin
								className="size-4 text-minuri-ocean"
								aria-hidden
							/>
							<span className="text-xs font-black uppercase tracking-widest text-minuri-ocean">
								Near Me
							</span>
						</div>

						{/* Hover drawer */}
						<motion.div
							className="absolute bottom-6 left-6 z-30 max-w-sm rounded-2xl bg-minuri-mid p-6 shadow-xl"
							animate={{ y: hovered === "nearby" ? 0 : "100%" }}
							transition={{ duration: 0.45, ease: easeOut }}
						>
							<div className="mb-5 inline-flex items-center gap-2 rounded-full bg-minuri-white/15 px-3.5 py-1.5 backdrop-blur-sm">
								<MapPin
									className="size-3.5 text-minuri-white"
									aria-hidden
								/>
								<span className="text-xs font-black uppercase tracking-widest text-minuri-white">
									Near Me
								</span>
							</div>
							<h3 className="mt-1 text-base font-medium leading-snug text-minuri-white">
								GP clinics, food banks, legal aid, community
								centres — filtered by your suburb and what you
								need right now.
							</h3>
							<div className="group relative mt-7 inline-flex overflow-hidden rounded-sm bg-minuri-ice">
								<Link
									href="/near-me"
									className="relative z-10 inline-flex h-12 items-center gap-2 px-7 text-sm font-bold uppercase tracking-wider text-minuri-ocean transition-colors duration-300 group-hover:text-minuri-ocean"
								>
									Find nearby support
									<ChevronRight
										className="size-4 transition-transform duration-200 group-hover:translate-x-1"
										aria-hidden
									/>
								</Link>
								<span className="absolute inset-0 -translate-x-full bg-minuri-white transition-transform duration-[500ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0" />
							</div>
						</motion.div>
					</div>
				</div>
				{/* end split screen */}

				{/* Bottom closing */}
				<motion.div
					className="px-6 pt-10 pb-16 text-center"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.5 }}
					transition={{ duration: 0.7, ease: easeOut }}
				>
					<h2 className="mt-20 text-3xl tracking-wider font-black leading-snug text-minuri-white md:text-4xl">
						or, want us to design the{" "}
						<span className="text-minuri-ice">Journey</span> for
						you?
					</h2>
					<div className="group relative mt-8 inline-flex overflow-hidden rounded-sm bg-minuri-teal">
						<Link
							href="/journey"
							className="relative z-10 inline-flex h-12 items-center gap-2 px-7 text-sm font-bold uppercase tracking-wider text-white group-hover:text-minuri-ocean"
						>
							Build my journey
							<ChevronRight
								className="size-4 transition-transform duration-200 group-hover:translate-x-1"
								aria-hidden
							/>
						</Link>
						<span className="absolute inset-0 -translate-x-full bg-minuri-white transition-transform duration-[500ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0" />
					</div>
				</motion.div>
			</section>
		</div>
	);
}
