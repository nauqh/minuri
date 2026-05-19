"use client";

import Link from "next/link";
import {
	ArrowRight,
	BookOpen,
	CalendarDays,
	Compass,
	LifeBuoy,
	MapPin,
	Menu,
	X,
	type LucideIcon,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";

const MOBILE_NAV_ITEMS: { icon: LucideIcon; label: string; href: string }[] = [
	{ icon: Compass, label: "Start my journey", href: "/journey" },
	{ icon: BookOpen, label: "First-time guides", href: "/guides" },
	{ icon: MapPin, label: "Near me", href: "/near-me" },
	{ icon: LifeBuoy, label: "Get support", href: "#contact" },
];

const entranceEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function LandingHeader({
	headerVisible = true,
	onHeroReveal,
}: {
	headerVisible?: boolean;
	onHeroReveal?: () => void;
}) {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [ctaHighlighted, setCtaHighlighted] = useState(false);
	const [hasActiveJourney, setHasActiveJourney] = useState(false);
	const [journeyIdentity, setJourneyIdentity] = useState<{
		symbol: string;
		archetype: string;
		accentHex: string;
	} | null>(null);
	const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), []);

	useEffect(() => {
		try {
			const hasJourney = !!localStorage.getItem("minuri:journey:v2");
			setHasActiveJourney(hasJourney);
			if (hasJourney) {
				const raw = localStorage.getItem("minuri:journey:identity:v1");
				if (raw) {
					const parsed = JSON.parse(raw);
					const id = parsed?.identity;
					if (id?.symbol && id?.archetype) {
						setJourneyIdentity({
							symbol: id.symbol,
							archetype: id.archetype,
							accentHex: id.palette?.[0]?.hex ?? "#14b8a6",
						});
					}
				}
			}
		} catch { /* ignore */ }
	}, []);

	useEffect(() => {
		let clearHighlight: ReturnType<typeof setTimeout> | undefined;
		const handler = () => {
			setCtaHighlighted(true);
			if (clearHighlight) clearTimeout(clearHighlight);
			clearHighlight = setTimeout(() => setCtaHighlighted(false), 2800);
		};
		window.addEventListener("minuri:highlight-cta", handler);
		return () => {
			window.removeEventListener("minuri:highlight-cta", handler);
			if (clearHighlight) clearTimeout(clearHighlight);
		};
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
		<div className="relative">
			<motion.header
				className="flex w-full max-w-none items-stretch overflow-hidden bg-transparent md:mx-auto md:w-full md:max-w-full md:min-h-24 min-[1500px]:min-h-32 md:items-center md:justify-between md:overflow-visible md:rounded-full md:bg-minuri-white md:py-0"
				initial={{ opacity: 0, y: -18 }}
				animate={
					headerVisible
						? { opacity: 1, y: 0 }
						: { opacity: 0, y: -14 }
				}
				transition={{ duration: 0.55, ease: entranceEase }}
				onAnimationComplete={() => {
					if (headerVisible) onHeroReveal?.();
				}}
			>
				<motion.div
					className="flex min-h-14 flex-1 items-center justify-start gap-8 border-r border-minuri-ocean/15 bg-minuri-white pl-0 pr-3 md:min-h-0 md:flex-initial md:border-0 md:bg-transparent md:px-0 md:gap-12 min-[1500px]:gap-20"
					initial={{ opacity: 0, y: 12 }}
					animate={{ opacity: headerVisible ? 1 : 0, y: 0 }}
					transition={{
						duration: 0.45,
						delay: 0.12,
						ease: entranceEase,
					}}
				>
					<Link
						href="/"
						className="flex items-center gap-2 text-2xl font-black tracking-tight text-minuri-ocean md:text-[2.1rem] min-[1500px]:text-[3rem]"
					>
						<span className="uppercase">Minuri</span>
					</Link>

					<nav className="hidden items-center gap-10 text-base min-[1500px]:gap-16 min-[1500px]:text-xl font-medium text-minuri-ocean">
						<Link
							href="#services"
							className="minuri-link-underline inline-flex h-12 min-[1500px]:h-16 items-center whitespace-nowrap"
						>
							Services
						</Link>
						<Link
							href="#service"
							className="minuri-link-underline inline-flex h-12 min-[1500px]:h-16 items-center whitespace-nowrap"
						>
							How it works
						</Link>
						<Link
							href="#care"
							className="minuri-link-underline inline-flex h-12 min-[1500px]:h-16 items-center whitespace-nowrap"
						>
							Topics
						</Link>
						<Link
							href="#contact"
							className="minuri-link-underline inline-flex h-12 min-[1500px]:h-16 items-center whitespace-nowrap"
						>
							Get support
						</Link>
					</nav>
				</motion.div>

				<motion.div
					className="flex items-stretch gap-2.5 md:ml-auto md:items-center md:gap-3.5 min-[1500px]:gap-5"
					initial={{ opacity: 0, x: 12 }}
					animate={{ opacity: headerVisible ? 1 : 0, x: 0 }}
					transition={{
						duration: 0.45,
						delay: 0.2,
						ease: entranceEase,
					}}
				>
					<AnimatePresence mode="wait" initial={false}>
						{hasActiveJourney ? (
							<motion.div
								key="journey-cta"
								initial={{ opacity: 0, x: 10 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: 10 }}
								transition={{ duration: 0.28, ease: entranceEase }}
								className="hidden md:flex items-center"
							>
								<Link
									href="/journey/plan"
									className="group relative inline-flex h-12 min-[1500px]:h-16 items-center gap-2.5 rounded-sm bg-gradient-to-br from-minuri-teal to-minuri-seafoam px-5 min-[1500px]:px-7 text-sm min-[1500px]:text-lg font-semibold text-white shadow-sm shadow-minuri-teal/20 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg hover:shadow-minuri-teal/35"
								>
									<span className="relative z-10 text-base min-[1500px]:text-xl leading-none transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-0.5">
										{journeyIdentity?.symbol ?? "🌱"}
									</span>
									<span className="relative z-10">My week</span>
									<ArrowRight className="relative z-10 size-4 min-[1500px]:size-5 transition-all duration-300 group-hover:translate-x-1 group-hover:scale-110" strokeWidth={2} aria-hidden />
								</Link>
							</motion.div>
						) : (
							<motion.div
								key="default-cta"
								initial={{ opacity: 0, x: 10 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: 10 }}
								transition={{ duration: 0.28, ease: entranceEase }}
								className="hidden md:flex items-center gap-2"
							>
								<Link
									href="/guides"
									className="inline-flex h-12 min-[1500px]:h-16 items-center gap-2 rounded-sm border border-minuri-ocean/25 px-5 min-[1500px]:px-7 text-sm min-[1500px]:text-lg font-semibold text-minuri-ocean transition-all duration-200 ease-out hover:bg-minuri-ocean/5 hover:border-minuri-ocean/50"
								>
									<BookOpen className="size-4 min-[1500px]:size-5" strokeWidth={2} aria-hidden />
									Guides
								</Link>
								<motion.div
									className="inline-flex rounded-sm"
									animate={
										ctaHighlighted
											? { scale: [1, 1.13, 0.97, 1.1, 1] }
											: { scale: 1 }
									}
									transition={{
										duration: 2.5,
										ease: "easeInOut",
										times: [0, 0.25, 0.5, 0.75, 1],
									}}
								>
									<Link
										href="/near-me"
										className="group inline-flex h-12 min-[1500px]:h-16 items-center gap-2 rounded-sm bg-minuri-ocean px-5 min-[1500px]:px-7 text-sm min-[1500px]:text-lg font-semibold text-minuri-white transition-all duration-200 ease-out hover:scale-[1.04]"
									>
										<MapPin
											className="size-4 min-[1500px]:size-5 transition-transform duration-200 group-hover:scale-110"
											strokeWidth={2}
											aria-hidden
										/>
										Near me
									</Link>
								</motion.div>
							</motion.div>
						)}
					</AnimatePresence>
					<div className="relative flex self-stretch md:hidden">
						<button
							type="button"
							className="relative z-50 flex h-full min-h-14 w-[3.35rem] shrink-0 cursor-pointer items-center justify-center rounded-none bg-minuri-ocean text-minuri-white transition-opacity duration-200 ease-out hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-minuri-white/35 focus-visible:ring-offset-2 focus-visible:ring-offset-minuri-ocean active:opacity-90"
							aria-expanded={mobileMenuOpen}
							aria-haspopup="true"
							aria-controls="landing-mobile-menu-v2"
							aria-label={
								mobileMenuOpen ? "Close menu" : "Open menu"
							}
							onClick={() => setMobileMenuOpen((open) => !open)}
						>
							<span className="relative size-5" aria-hidden>
								<X
									strokeWidth={2.25}
									className={`absolute left-0 top-0 size-5 stroke-minuri-white text-minuri-white transition-all duration-300 ease-in-out ${
										mobileMenuOpen
											? "rotate-0 opacity-100"
											: "rotate-90 opacity-0"
									}`}
								/>
								<Menu
									strokeWidth={2.25}
									className={`absolute left-0 top-0 size-5 stroke-minuri-white text-minuri-white transition-all duration-300 ease-in-out ${
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
							<div className="flex-1 overflow-y-auto px-6 pb-8 pt-2">
								<nav aria-label="Mobile navigation">
									<ul>
										{(hasActiveJourney
											? [
												{ icon: CalendarDays, label: "My week", href: "/journey/plan" },
												{ icon: BookOpen, label: "First-time guides", href: "/guides" },
												{ icon: MapPin, label: "Near me", href: "/near-me" },
												{ icon: LifeBuoy, label: "Get support", href: "#contact" },
											]
											: MOBILE_NAV_ITEMS
										).map((item, i) => (
											<motion.li
												key={item.href}
												initial={{ opacity: 0, y: 10 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{
													delay: 0.1 + i * 0.055,
													duration: 0.28,
													ease: "easeOut",
												}}
												className="border-b border-minuri-white/[0.08]"
											>
												<Link
													href={item.href}
													onClick={closeMobileMenu}
													className="group flex items-center gap-4 py-[1.1rem] transition-opacity duration-150 active:opacity-60"
												>
													<item.icon
														className="size-[1.1rem] shrink-0 text-minuri-teal/70"
														strokeWidth={1.75}
														aria-hidden
													/>
													<span className="flex-1 text-[1.1rem] font-semibold tracking-tight text-minuri-white">
														{item.label}
													</span>
													<ArrowRight
														className="size-4 shrink-0 text-minuri-white/20 transition-transform duration-200 group-hover:translate-x-1"
														strokeWidth={1.75}
														aria-hidden
													/>
												</Link>
											</motion.li>
										))}
									</ul>
								</nav>
								<motion.div
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{
										delay: 0.42,
										duration: 0.28,
										ease: "easeOut",
									}}
									className="mt-6"
								>
									{hasActiveJourney ? (
										<Link
											href="/journey/plan"
											onClick={closeMobileMenu}
											className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/10 px-4 py-3.5 transition-all active:scale-[0.97]"
										>
											<span
												className="flex size-8 shrink-0 items-center justify-center rounded-full text-sm"
												style={{
													backgroundColor: journeyIdentity?.accentHex
														? `${journeyIdentity.accentHex}40`
														: "rgba(255,255,255,0.2)",
												}}
											>
												{journeyIdentity?.symbol ?? "🌱"}
											</span>
											<span className="flex min-w-0 flex-1 flex-col">
												<span className="truncate text-[10px] font-semibold uppercase tracking-[0.12em] text-white/50">
													{journeyIdentity?.archetype ?? "My Journey"}
												</span>
												<span className="text-sm font-bold text-white">My week →</span>
											</span>
										</Link>
									) : (
										<Link
											href="/journey"
											onClick={closeMobileMenu}
											className="flex h-14 items-center justify-center gap-2 rounded-sm bg-minuri-teal text-base font-semibold text-primary-foreground transition-transform duration-200 ease-out active:scale-[0.97]"
										>
											Start your journey
											<ArrowRight
												className="size-4"
												strokeWidth={2.25}
												aria-hidden
											/>
										</Link>
									)}
								</motion.div>
							</div>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</div>
	);
}
