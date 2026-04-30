"use client";

import Link from "next/link";
import { CheckCircle, ChevronRight, Menu, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const heroHighlights = [
	"REAL-LIFE GUIDES, NOT FLUFF",
	"LOCAL SUPPORT THAT IS ACTUALLY NEARBY",
	"CLEAR NEXT STEPS YOU CAN DO TODAY",
];

const HERO_TOPIC_CARDS = [
	{
		title: "Food & Eating",
		desc: "Groceries, cheap meals & cooking basics.",
		bg: "#00f5d4",
		rotate: -6,
		floatPhase: 0,
		word: "eat",
		wordColor: "#00957f",
	},
	{
		title: "Getting Around",
		desc: "Trams, buses & cycling Melbourne.",
		bg: "#7fdcff",
		rotate: 5,
		floatPhase: 1.1,
		word: "travel",
		wordColor: "#1a7ab3",
	},
	{
		title: "Health & Wellbeing",
		desc: "GPs, Medicare & mental health.",
		bg: "#fff14a",
		rotate: -2,
		floatPhase: 0.5,
		word: "heal",
		wordColor: "#9a8000",
	},
	{
		title: "Home & Admin",
		desc: "Renting, utilities & paperwork.",
		bg: "#ff7ecb",
		rotate: 6,
		floatPhase: 0.8,
		word: "settle",
		wordColor: "#c4246e",
	},
	{
		title: "Social & Belonging",
		desc: "Community, friendships & finding your place.",
		bg: "#dcf5ee",
		rotate: -3,
		floatPhase: 1.4,
		word: "belong",
		wordColor: "#1a7a54",
	},
];

function HeroTopicCard({
	card,
	index,
	isActive,
	onHover,
	prefersReducedMotion,
	entranceEase,
	className = "",
}: {
	card: (typeof HERO_TOPIC_CARDS)[0];
	index: number;
	isActive: boolean;
	onHover: () => void;
	prefersReducedMotion: boolean;
	entranceEase: [number, number, number, number];
	className?: string;
}) {
	return (
		<motion.div
			className={className}
			initial={{ opacity: 0, y: 32, scale: 0.94 }}
			animate={{ opacity: 1, y: 0, scale: isActive ? 1.05 : 1 }}
			transition={{
				opacity: {
					duration: prefersReducedMotion ? 0.01 : 0.6,
					delay: prefersReducedMotion ? 0 : 0.5 + index * 0.07,
					ease: entranceEase,
				},
				y: {
					duration: prefersReducedMotion ? 0.01 : 0.6,
					delay: prefersReducedMotion ? 0 : 0.5 + index * 0.07,
					ease: entranceEase,
				},
				scale: {
					duration: prefersReducedMotion ? 0.01 : 0.2,
					ease: "easeOut",
				},
			}}
			onHoverStart={onHover}
		>
			<motion.div
				style={{ rotate: card.rotate, backgroundColor: card.bg }}
				className="flex h-32 flex-col justify-between rounded-2xl p-4 shadow-md md:p-5"
				animate={prefersReducedMotion ? {} : { y: [0, -7, 0] }}
				transition={{
					duration: 3.2 + card.floatPhase * 0.28,
					ease: "easeInOut",
					repeat: Infinity,
					delay: card.floatPhase,
				}}
			>
				<h3 className="text-base font-black uppercase leading-tight tracking-tight text-[#05292a] md:text-[1.05rem]">
					{card.title}
				</h3>
				<p className="mt-3 text-[0.75rem] leading-snug text-[#163a3a]/70 md:text-[0.8rem]">
					{card.desc}
				</p>
			</motion.div>
		</motion.div>
	);
}

export function LandingHeroSectionV2({
	onHeroReveal,
	headerVisible = true,
}: {
	onHeroReveal?: () => void;
	headerVisible?: boolean;
}) {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [activeIndex, setActiveIndex] = useState(0);
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const prefersReducedMotion = useReducedMotion();
	const entranceEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

	const restartCycle = () => {
		if (intervalRef.current) clearInterval(intervalRef.current);
		intervalRef.current = setInterval(() => {
			setActiveIndex((i) => (i + 1) % HERO_TOPIC_CARDS.length);
		}, 2500);
	};

	useEffect(() => {
		onHeroReveal?.();
	}, [onHeroReveal]);

	useEffect(() => {
		restartCycle();
		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") setMobileMenuOpen(false);
		};

		document.addEventListener("keydown", onKeyDown);
		const previousOverflow = document.body.style.overflow;
		if (mobileMenuOpen) document.body.style.overflow = "hidden";

		return () => {
			document.removeEventListener("keydown", onKeyDown);
			document.body.style.overflow = previousOverflow;
		};
	}, [mobileMenuOpen]);

	return (
		<section className="relative flex min-h-screen flex-col overflow-hidden bg-minuri-white text-minuri-ink">
			<div className="relative flex flex-1 flex-col mx-auto w-full max-w-screen-2xl px-6 pb-10 pt-4 md:px-10 md:pt-0">
				<div className="relative">
					<motion.header
						className="mx-auto flex w-full items-center justify-between bg-minuri-white py-2 md:min-h-21 md:rounded-full md:py-0"
						initial={{
							opacity: 0,
							y: prefersReducedMotion ? 0 : -18,
						}}
						animate={
							headerVisible
								? { opacity: 1, y: 0 }
								: { opacity: 0, y: -14 }
						}
						transition={{
							duration: prefersReducedMotion ? 0.01 : 0.55,
							ease: entranceEase,
						}}
						onAnimationComplete={() => {
							if (headerVisible) onHeroReveal?.();
						}}
					>
						<motion.div
							className="flex items-center gap-8 md:gap-12"
							initial={{
								opacity: 0,
								y: prefersReducedMotion ? 0 : 12,
							}}
							animate={{ opacity: headerVisible ? 1 : 0, y: 0 }}
							transition={{
								duration: prefersReducedMotion ? 0.01 : 0.45,
								delay: prefersReducedMotion ? 0 : 0.12,
								ease: entranceEase,
							}}
						>
							<Link
								href="/"
								className="flex items-center gap-2 text-2xl font-black tracking-tight text-minuri-ocean md:text-[2.1rem]"
							>
								<span className="uppercase">Minuri</span>
							</Link>

							<nav className="hidden items-center gap-10 text-base font-medium text-minuri-ocean md:flex">
								<Link
									href="#services"
									className="minuri-link-underline inline-flex h-12 items-center whitespace-nowrap"
								>
									Services
								</Link>
								<Link
									href="#service"
									className="minuri-link-underline inline-flex h-12 items-center whitespace-nowrap"
								>
									How it works
								</Link>
								<Link
									href="#care"
									className="minuri-link-underline inline-flex h-12 items-center whitespace-nowrap"
								>
									Topics
								</Link>
								<Link
									href="#contact"
									className="minuri-link-underline inline-flex h-12 items-center whitespace-nowrap"
								>
									Get support
								</Link>
							</nav>
						</motion.div>

						<motion.div
							className="ml-auto flex items-center gap-2.5 md:gap-3.5"
							initial={{
								opacity: 0,
								x: prefersReducedMotion ? 0 : 12,
							}}
							animate={{ opacity: headerVisible ? 1 : 0, x: 0 }}
							transition={{
								duration: prefersReducedMotion ? 0.01 : 0.45,
								delay: prefersReducedMotion ? 0 : 0.2,
								ease: entranceEase,
							}}
						>
							<Link
								href="/journey"
								className="group hidden h-12 items-center gap-1.5 rounded-full bg-minuri-teal px-6 text-base font-medium text-primary-foreground transition-transform duration-200 ease-out hover:scale-105 md:inline-flex"
							>
								Start your journey
								<ChevronRight
									className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-1"
									strokeWidth={2.25}
									aria-hidden
								/>
							</Link>
							<button
								type="button"
								className="inline-flex size-10 items-center justify-center rounded-full text-minuri-ocean transition-colors hover:bg-minuri-ice/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-minuri-ocean/35 md:hidden"
								aria-expanded={mobileMenuOpen}
								aria-controls="landing-mobile-menu-v2"
								aria-label={
									mobileMenuOpen ? "Close menu" : "Open menu"
								}
								onClick={() =>
									setMobileMenuOpen((open) => !open)
								}
							>
								{mobileMenuOpen ? (
									<X
										className="size-8"
										strokeWidth={2}
										aria-hidden
									/>
								) : (
									<Menu
										className="size-8"
										strokeWidth={2}
										aria-hidden
									/>
								)}
							</button>
						</motion.div>
					</motion.header>
					<div className="-mx-4 mt-2 h-px bg-minuri-silver/65 md:hidden" />
					<div
						id="landing-mobile-menu-v2"
						className={`fixed inset-x-0 bottom-0 top-[calc(env(safe-area-inset-top)+4.5rem)] z-40 overflow-y-auto bg-minuri-white transition-[opacity,transform] duration-300 ease-out md:hidden ${
							mobileMenuOpen
								? "translate-y-0 opacity-100 pointer-events-auto"
								: "-translate-y-1 opacity-0 pointer-events-none"
						}`}
						aria-hidden={!mobileMenuOpen}
					>
						<div className="flex h-full flex-col px-4 pt-3">
							<nav>
								<Link
									href="#services"
									className="flex items-center justify-between py-4 text-[2rem] font-medium tracking-tight text-minuri-ocean"
									onClick={() => setMobileMenuOpen(false)}
								>
									<span>Services</span>
									<ChevronRight
										className="size-6"
										aria-hidden
									/>
								</Link>
								<Link
									href="#service"
									className="flex items-center justify-between py-4 text-[2rem] font-medium tracking-tight text-minuri-ocean"
									onClick={() => setMobileMenuOpen(false)}
								>
									<span>How it works</span>
									<ChevronRight
										className="size-6"
										aria-hidden
									/>
								</Link>
								<Link
									href="#care"
									className="flex items-center justify-between py-4 text-[2rem] font-medium tracking-tight text-minuri-ocean"
									onClick={() => setMobileMenuOpen(false)}
								>
									<span>Topics</span>
									<ChevronRight
										className="size-6"
										aria-hidden
									/>
								</Link>
								<Link
									href="#contact"
									className="flex items-center justify-between py-4 text-[2rem] font-medium tracking-tight text-minuri-ocean"
									onClick={() => setMobileMenuOpen(false)}
								>
									<span>Get support</span>
									<ChevronRight
										className="size-6"
										aria-hidden
									/>
								</Link>
							</nav>

							<div className="mt-auto border-t border-minuri-silver/70 bg-minuri-white pb-[max(1rem,env(safe-area-inset-bottom))] pt-4">
								<p className="text-xs font-semibold uppercase tracking-[0.14em] text-minuri-slate">
									Quick start
								</p>
								<div className="mt-3">
									<Link
										href="/journey"
										className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-minuri-teal px-5 py-2 text-sm font-semibold text-primary-foreground"
										onClick={() => setMobileMenuOpen(false)}
									>
										Start your journey
										<ChevronRight
											className="size-4"
											aria-hidden
										/>
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>

				<motion.div
					className="flex flex-1 flex-col pb-10 pt-10 md:pb-16 md:pt-12"
					initial="hidden"
					animate="visible"
					variants={{
						hidden: {},
						visible: {
							transition: {
								staggerChildren: prefersReducedMotion ? 0 : 0.1,
								delayChildren: prefersReducedMotion ? 0 : 0.08,
							},
						},
					}}
				>
					<div className="w-full">
						<motion.span
							className="inline-flex rounded-sm bg-[#e2ffef] p-2 text-sm font-black uppercase text-minuri-ocean"
							variants={{
								hidden: {
									opacity: 0,
									y: prefersReducedMotion ? 0 : 8,
								},
								visible: {
									opacity: 1,
									y: 0,
									transition: {
										duration: prefersReducedMotion
											? 0.01
											: 0.45,
										ease: entranceEase,
									},
								},
							}}
						>
							Living independently
						</motion.span>
						<motion.h1
							className="mt-5 w-full text-5xl font-black uppercase tracking-tight text-minuri-teal md:text-7xl"
							variants={{
								hidden: {
									opacity: 0,
									y: prefersReducedMotion ? 0 : 22,
								},
								visible: {
									opacity: 1,
									y: 0,
									transition: {
										duration: prefersReducedMotion
											? 0.01
											: 0.7,
										ease: entranceEase,
									},
								},
							}}
						>
							Feeling at home, wherever
							{" you "}
							<AnimatePresence mode="wait">
								<motion.span
									key={HERO_TOPIC_CARDS[activeIndex].word}
									initial={{
										opacity: 0,
										y: prefersReducedMotion ? 0 : 14,
									}}
									animate={{ opacity: 1, y: 0 }}
									exit={{
										opacity: 0,
										y: prefersReducedMotion ? 0 : -10,
									}}
									transition={{
										duration: prefersReducedMotion
											? 0.01
											: 0.28,
										ease: entranceEase,
									}}
									style={{
										color: HERO_TOPIC_CARDS[activeIndex].bg,
										filter: "brightness(0.85)",
									}}
									className="inline-block"
								>
									{HERO_TOPIC_CARDS[activeIndex].word}
								</motion.span>
							</AnimatePresence>
						</motion.h1>
					</div>

					<div className="mt-0 grid flex-1 gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-stretch md:gap-10">
						<div className="flex flex-col md:h-full">
							<motion.p
								className="mt-4 text-2xl font-bold text-minuri-ocean"
								variants={{
									hidden: {
										opacity: 0,
										y: prefersReducedMotion ? 0 : 14,
									},
									visible: {
										opacity: 1,
										y: 0,
										transition: {
											duration: prefersReducedMotion
												? 0.01
												: 0.5,
											ease: entranceEase,
										},
									},
								}}
							>
								Your everyday support system
							</motion.p>
							<motion.div
								className="mt-7 md:mt-auto md:mb-4"
								variants={{
									hidden: {
										opacity: 0,
										y: prefersReducedMotion ? 0 : 14,
									},
									visible: {
										opacity: 1,
										y: 0,
										transition: {
											duration: prefersReducedMotion
												? 0.01
												: 0.55,
											ease: entranceEase,
										},
									},
								}}
							>
								<p className="max-w-xl leading-relaxed text-minuri-ocean font-medium">
									Get plain-language guides, find nearby
									services, and follow clear next steps for
									day-to-day independent life.
								</p>
								<motion.div
									className="my-6 flex flex-wrap items-center gap-3"
									variants={{
										hidden: {
											opacity: 0,
											y: prefersReducedMotion ? 0 : 10,
										},
										visible: {
											opacity: 1,
											y: 0,
											transition: {
												duration: prefersReducedMotion
													? 0.01
													: 0.45,
												ease: entranceEase,
												delay: prefersReducedMotion
													? 0
													: 0.05,
											},
										},
									}}
								>
									<Link
										href="/near-me"
										className="group inline-flex h-12 items-center gap-1.5 rounded-full bg-minuri-teal px-6 text-base font-medium text-primary-foreground transition-transform duration-200 ease-out hover:scale-105"
									>
										Find nearby support
										<ChevronRight
											aria-hidden
											className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-1"
										/>
									</Link>
									<Link
										href="/guides"
										className="group inline-flex h-12 items-center gap-1.5 rounded-full border border-minuri-ocean bg-minuri-white px-6 text-base font-medium text-minuri-ocean transition-transform duration-200 ease-out hover:scale-105"
									>
										Start with guides
										<ChevronRight
											aria-hidden
											className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-1"
										/>
									</Link>
								</motion.div>
							</motion.div>
						</div>

						<div className="flex w-full flex-col justify-end md:pb-4">
							<div className="grid grid-cols-2 gap-2.5 md:gap-3">
								{HERO_TOPIC_CARDS.slice(0, 4).map((card, i) => (
									<HeroTopicCard
										key={card.title}
										card={card}
										index={i}
										isActive={activeIndex === i}
										onHover={() => {
											setActiveIndex(i);
											restartCycle();
										}}
										prefersReducedMotion={
											!!prefersReducedMotion
										}
										entranceEase={entranceEase}
										className=""
									/>
								))}
								<HeroTopicCard
									card={HERO_TOPIC_CARDS[4]}
									index={4}
									isActive={activeIndex === 4}
									onHover={() => {
										setActiveIndex(4);
										restartCycle();
									}}
									prefersReducedMotion={
										!!prefersReducedMotion
									}
									entranceEase={entranceEase}
									className="col-span-2"
								/>
							</div>
						</div>
					</div>
				</motion.div>

				{/* <motion.div
					className="grid gap-4 pb-8 md:grid-cols-3 md:gap-6"
					initial="hidden"
					animate="visible"
					variants={{
						hidden: {},
						visible: {
							transition: {
								staggerChildren: prefersReducedMotion
									? 0
									: 0.08,
								delayChildren: prefersReducedMotion ? 0 : 0.55,
							},
						},
					}}
				>
					{heroHighlights.map((highlight) => (
						<motion.div
							key={highlight}
							className="flex items-center gap-3 rounded-md bg-minuri-fog p-5"
							variants={{
								hidden: {
									opacity: 0,
									y: prefersReducedMotion ? 0 : 12,
								},
								visible: {
									opacity: 1,
									y: 0,
									transition: {
										duration: prefersReducedMotion
											? 0.01
											: 0.45,
										ease: entranceEase,
									},
								},
							}}
						>
							<CheckCircle
								className="size-4 shrink-0 text-minuri-ocean"
								strokeWidth={2.4}
								aria-hidden
							/>
							<p className="text-sm font-black uppercase tracking-[0.03em] text-minuri-ocean">
								{highlight}
							</p>
						</motion.div>
					))}
				</motion.div> */}
			</div>
		</section>
	);
}
