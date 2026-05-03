"use client";

import Link from "next/link";
import {
	ChevronRight,
	Heart,
	Home,
	Menu,
	MapPin,
	Users,
	Utensils,
	X,
	type LucideIcon,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

const HERO_TOPIC_CARDS: {
	title: string;
	desc: string;
	bg: string;
	rotate: number;
	floatPhase: number;
	word: string;
	wordColor: string;
	icon: LucideIcon;
}[] = [
	{
		title: "Food & Eating",
		desc: "Groceries, cheap meals & cooking basics.",
		bg: "#00f5c8",
		rotate: -6,
		floatPhase: 0,
		word: "eat",
		wordColor: "#00957f",
		icon: Utensils,
	},
	{
		title: "Getting Around",
		desc: "Trams, buses & cycling Melbourne.",
		bg: "#5dd6ff",
		rotate: 5,
		floatPhase: 1.1,
		word: "travel",
		wordColor: "#0077a8",
		icon: MapPin,
	},
	{
		title: "Health & Wellbeing",
		desc: "GPs, Medicare & mental health.",
		bg: "#fcf300",
		rotate: -2,
		floatPhase: 0.5,
		word: "heal",
		wordColor: "#9a7000",
		icon: Heart,
	},
	{
		title: "Home & Admin",
		desc: "Renting, utilities & paperwork.",
		bg: "#ffc2d1",
		rotate: 6,
		floatPhase: 0.8,
		word: "settle",
		wordColor: "#c4246e",
		icon: Home,
	},
	{
		title: "Social & Belonging",
		desc: "Community, friendships & finding your place.",
		bg: "#cae9ff",
		rotate: -3,
		floatPhase: 1.4,
		word: "belong",
		wordColor: "#7a1ac4",
		icon: Users,
	},
];

const MOBILE_NAV_ITEMS = [
	{
		emoji: "🗺️",
		label: "Start my journey",
		description: "Your personalised first-week plan",
		href: "/journey",
	},
	{
		emoji: "📖",
		label: "First-time guides",
		description: "Practical guides for every topic",
		href: "/guides",
	},
	{
		emoji: "📍",
		label: "Near me",
		description: "Find services in your suburb",
		href: "/near-me",
	},
	{
		emoji: "💬",
		label: "Get support",
		description: "Our story and who we help",
		href: "#contact",
	},
];

function HeroTopicCard({
	card,
	index,
	isActive,
	onHover,
	entranceEase,
	className = "",
}: {
	card: (typeof HERO_TOPIC_CARDS)[0];
	index: number;
	isActive: boolean;
	onHover: () => void;
	entranceEase: [number, number, number, number];
	className?: string;
}) {
	return (
		<motion.div
			className={className}
			initial={{ opacity: 0, y: -800 }}
			animate={{ opacity: 1, y: 0, scale: isActive ? 1.05 : 1 }}
			transition={{
				opacity: {
					duration: 0.35,
					delay: 0.5 + index * 0.12,
					ease: "easeOut",
				},
				y: {
					type: "spring",
					stiffness: 120,
					damping: 18,
					delay: 0.5 + index * 0.15,
				},
				scale: { duration: 0.2, ease: "easeOut" },
			}}
			onHoverStart={onHover}
		>
			<motion.div
				style={{ rotate: card.rotate, backgroundColor: card.bg }}
				className="flex h-full flex-col justify-between rounded-2xl p-4 shadow-md md:p-5"
				animate={{ y: [0, -7, 0] }}
				transition={{
					duration: 3.2 + card.floatPhase * 0.28,
					ease: "easeInOut",
					repeat: Infinity,
					delay: card.floatPhase,
				}}
			>
				<div className="flex items-start justify-between gap-2">
					<h3 className="text-base font-black uppercase leading-tight tracking-tight text-[#05292a] md:text-[1.05rem]">
						{card.title}
					</h3>
					<card.icon
						aria-hidden
						className="mt-0.5 size-5 shrink-0 text-[#05292a]/60"
						strokeWidth={2.5}
					/>
				</div>
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
	const [hasStartedWordCycle, setHasStartedWordCycle] = useState(false);
	const [ctaHighlighted, setCtaHighlighted] = useState(false);
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const entranceEase: [number, number, number, number] = [0.22, 1, 0.36, 1];
	const headlineWord = hasStartedWordCycle
		? HERO_TOPIC_CARDS[activeIndex].word
		: "are";
	const headlineWordColor = hasStartedWordCycle
		? HERO_TOPIC_CARDS[activeIndex].bg
		: "#0f766e";
	const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), []);

	const restartCycle = () => {
		if (intervalRef.current) clearInterval(intervalRef.current);
		intervalRef.current = setInterval(() => {
			setHasStartedWordCycle(true);
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
		const handler = () => {
			setCtaHighlighted(true);
			setTimeout(() => setCtaHighlighted(false), 1600);
		};
		window.addEventListener("minuri:highlight-cta", handler);
		return () =>
			window.removeEventListener("minuri:highlight-cta", handler);
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
							y: -18,
						}}
						animate={
							headerVisible
								? { opacity: 1, y: 0 }
								: { opacity: 0, y: -14 }
						}
						transition={{
							duration: 0.55,
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
								y: 12,
							}}
							animate={{ opacity: headerVisible ? 1 : 0, y: 0 }}
							transition={{
								duration: 0.45,
								delay: 0.12,
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
								x: 12,
							}}
							animate={{ opacity: headerVisible ? 1 : 0, x: 0 }}
							transition={{
								duration: 0.45,
								delay: 0.2,
								ease: entranceEase,
							}}
						>
							<motion.div
								className="hidden md:block"
								animate={
									ctaHighlighted
										? {
												scale: [1, 1.13, 0.97, 1.1, 1],
												boxShadow: [
													"0 0 0 0px rgba(20,184,166,0)",
													"0 0 0 12px rgba(20,184,166,0.6)",
													"0 0 0 4px rgba(20,184,166,0.15)",
													"0 0 0 12px rgba(20,184,166,0.55)",
													"0 0 0 0px rgba(20,184,166,0)",
												],
											}
										: {
												scale: 1,
												boxShadow:
													"0 0 0 0px rgba(20,184,166,0)",
											}
								}
								transition={{
									duration: 2,
									ease: "easeInOut",
									times: [0, 0.25, 0.5, 0.75, 1],
								}}
								style={{ borderRadius: 9999 }}
							>
								<Link
									href="/journey"
									className="group inline-flex h-12 items-center gap-1.5 rounded-full bg-minuri-teal px-6 text-base font-medium text-primary-foreground transition-transform duration-200 ease-out hover:scale-105"
								>
									Start your journey
									<ChevronRight
										className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-1"
										strokeWidth={2.25}
										aria-hidden
									/>
								</Link>
							</motion.div>
							<div className="relative md:hidden">
								<button
									type="button"
									className="relative z-50 flex size-10 cursor-pointer items-center justify-center rounded-full text-foreground transition-opacity duration-200 ease-out hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-minuri-ocean/45 active:opacity-85"
									aria-expanded={mobileMenuOpen}
									aria-haspopup="true"
									aria-controls="landing-mobile-menu-v2"
									aria-label={
										mobileMenuOpen
											? "Close menu"
											: "Open menu"
									}
									onClick={() =>
										setMobileMenuOpen((open) => !open)
									}
								>
									<span className="relative size-5" aria-hidden>
										<X
											strokeWidth={2.25}
											className={`absolute left-0 top-0 size-5 stroke-foreground text-foreground transition-all duration-300 ease-in-out ${
												mobileMenuOpen
													? "rotate-0 opacity-100"
													: "rotate-90 opacity-0"
											}`}
										/>
										<Menu
											strokeWidth={2.25}
											className={`absolute left-0 top-0 size-5 stroke-foreground text-foreground transition-all duration-300 ease-in-out ${
												mobileMenuOpen
													? "-rotate-90 opacity-0"
													: "rotate-0 opacity-100"
											}`}
										/>
									</span>
								</button>
							</div>
						</motion.div>
					</motion.header>
					<div className="-mx-4 mt-2 h-px bg-minuri-silver/65 md:hidden" />
					<AnimatePresence>
						{mobileMenuOpen && (
							<>
								<motion.div
									key="backdrop"
									className="fixed inset-0 z-40 bg-black/40 md:hidden"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									transition={{ duration: 0.25 }}
									onClick={closeMobileMenu}
									aria-hidden
								/>
								<motion.div
									key="drawer"
									id="landing-mobile-menu-v2"
									className="fixed inset-x-0 bottom-0 z-50 flex max-h-[92dvh] flex-col rounded-t-3xl md:hidden"
									style={{
										background:
											"radial-gradient(ellipse 120% 80% at 10% 0%, color-mix(in oklch, var(--minuri-teal) 18%, var(--minuri-ocean)) 0%, var(--minuri-ocean) 60%)",
									}}
									initial={{ y: "100%" }}
									animate={{ y: 0 }}
									exit={{ y: "100%" }}
									transition={{ duration: 0.38, ease: "easeOut" }}
									aria-modal="true"
									role="dialog"
									aria-label="Navigation menu"
								>
									<div className="flex shrink-0 justify-center pb-1 pt-3">
										<div className="h-1 w-10 rounded-full bg-minuri-white/20" />
									</div>
									<div className="flex-1 overflow-y-auto px-6 pb-8 pt-4">
										<motion.div
											initial={{ opacity: 0, y: 10 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{
												delay: 0.12,
												duration: 0.3,
												ease: "easeOut",
											}}
											className="mb-6"
										>
											<p className="text-xs font-semibold uppercase tracking-[0.15em] text-minuri-teal">
												Hey there 👋
											</p>
											<p className="mt-1 text-2xl font-bold tracking-tight text-minuri-white">
												Where to?
											</p>
										</motion.div>
										<nav aria-label="Mobile navigation">
											<ul className="flex flex-col gap-2">
												{MOBILE_NAV_ITEMS.map((item, i) => (
													<motion.li
														key={item.href}
														initial={{ opacity: 0, x: -16 }}
														animate={{ opacity: 1, x: 0 }}
														transition={{
															delay: 0.16 + i * 0.06,
															duration: 0.3,
															ease: "easeOut",
														}}
													>
														<Link
															href={item.href}
															onClick={closeMobileMenu}
															className="group flex items-center gap-4 rounded-2xl px-4 py-3.5 transition-colors duration-150 hover:bg-minuri-white/10 active:bg-minuri-white/15"
														>
															<span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-minuri-white/10 text-xl">
																{item.emoji}
															</span>
															<span className="min-w-0 flex-1">
																<span className="block text-base font-semibold text-minuri-white">
																	{item.label}
																</span>
																<span className="mt-0.5 block text-sm text-minuri-slate/80">
																	{item.description}
																</span>
															</span>
															<ChevronRight
																className="size-4 shrink-0 text-minuri-slate/50 transition-transform duration-200 group-hover:translate-x-0.5"
																strokeWidth={2}
																aria-hidden
															/>
														</Link>
													</motion.li>
												))}
											</ul>
										</nav>
										<motion.div
											initial={{ opacity: 0, y: 12 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{
												delay: 0.42,
												duration: 0.32,
												ease: "easeOut",
											}}
											className="mt-6 rounded-2xl border border-minuri-teal/30 bg-minuri-teal/20 px-5 py-5"
										>
											<p className="text-xs font-semibold uppercase tracking-[0.13em] text-minuri-teal">
												Ready to start?
											</p>
											<p className="mt-1 text-sm text-minuri-white/80">
												We&apos;ll build your personalised
												week-one plan in under a minute.
											</p>
											<Link
												href="/journey"
												onClick={closeMobileMenu}
												className="mt-4 flex items-center justify-center gap-1.5 rounded-full bg-minuri-teal px-5 py-3 text-sm font-semibold text-primary-foreground transition-transform duration-200 ease-out active:scale-95"
											>
												Start my journey
												<ChevronRight
													className="size-4"
													strokeWidth={2.25}
													aria-hidden
												/>
											</Link>
										</motion.div>
									</div>
								</motion.div>
							</>
						)}
					</AnimatePresence>
				</div>

				<motion.div
					className="flex flex-1 flex-col pb-10 pt-10 md:pb-16 md:pt-12"
					initial="hidden"
					animate="visible"
					variants={{
						hidden: {},
						visible: {
							transition: {
								staggerChildren: 0.1,
								delayChildren: 0.08,
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
									y: 8,
								},
								visible: {
									opacity: 1,
									y: 0,
									transition: {
										duration: 0.45,
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
									y: 22,
								},
								visible: {
									opacity: 1,
									y: 0,
									transition: {
										duration: 0.7,
										ease: entranceEase,
									},
								},
							}}
						>
							Feeling at home, wherever
							{" you "} <br />
							<AnimatePresence mode="wait">
								<motion.span
									key={headlineWord}
									initial={{
										opacity: 0,
										y: 0,
									}}
									animate={{ opacity: 1, y: 0 }}
									exit={{
										opacity: 0,
										y: -10,
									}}
									transition={{
										duration: 0.28,
										ease: entranceEase,
									}}
									style={{
										color: headlineWordColor,
									}}
									className="inline-block"
								>
									{headlineWord}
								</motion.span>
							</AnimatePresence>
						</motion.h1>
					</div>

					<div className="mt-0 grid flex-1 gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-stretch md:gap-10">
						<div className="flex h-full flex-col">
							<motion.p
								className="mt-4 text-2xl font-semibold text-minuri-ocean"
								variants={{
									hidden: {
										opacity: 0,
										y: 14,
									},
									visible: {
										opacity: 1,
										y: 0,
										transition: {
											duration: 0.5,
											ease: entranceEase,
										},
									},
								}}
							>
								Your everyday support system to start living
								independently
							</motion.p>
							<motion.div
								className="mt-auto"
								variants={{
									hidden: {
										opacity: 0,
										y: 14,
									},
									visible: {
										opacity: 1,
										y: 0,
										transition: {
											duration: 0.55,
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
											y: 10,
										},
										visible: {
											opacity: 1,
											y: 0,
											transition: {
												duration: 0.45,
												ease: entranceEase,
												delay: 0.05,
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

						<div className="relative z-10 flex h-full w-full flex-col md:pb-4 min-[1500px]:origin-top min-[1500px]:scale-[1.18]">
							<div
								className="grid h-full max-h-[520px] grid-cols-2 gap-2.5 md:gap-3"
								style={{ gridAutoRows: "1fr" }}
							>
								{HERO_TOPIC_CARDS.slice(0, 4).map((card, i) => (
									<HeroTopicCard
										key={card.title}
										card={card}
										index={i}
										isActive={activeIndex === i}
										onHover={() => {
											setHasStartedWordCycle(true);
											setActiveIndex(i);
											restartCycle();
										}}
										entranceEase={entranceEase}
										className=""
									/>
								))}
								<HeroTopicCard
									card={HERO_TOPIC_CARDS[4]}
									index={4}
									isActive={activeIndex === 4}
									onHover={() => {
										setHasStartedWordCycle(true);
										setActiveIndex(4);
										restartCycle();
									}}
									entranceEase={entranceEase}
									className="col-span-2 mx-auto w-[calc(50%-5px)] md:w-[calc(50%-6px)]"
								/>
							</div>
						</div>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
