"use client";

import Image from "next/image";
import { Caveat } from "next/font/google";
import Link from "next/link";
import { CheckCircle, ChevronDown, ChevronRight, Menu, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

const heroHighlights = [
	"WE SPEAK YOUR LANGUAGE",
	"PROACTIVE AND PERSONABLE",
	"YOU KEEP MORE IN YOUR POCKET",
];

const heroImages = [
	{
		src: "/landing/amico.svg",
		alt: "Young adult getting support from Minuri",
	},
	{
		src: "/landing/pana.svg",
		alt: "Young adult feeling confident at home",
	},
];

const bubbleHandwriting = Caveat({
	subsets: ["latin"],
	weight: ["400"],
});

export function LandingHeroSectionV2({
	onHeroReveal,
	headerVisible = true,
}: {
	onHeroReveal?: () => void;
	headerVisible?: boolean;
}) {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [heroImageIndex, setHeroImageIndex] = useState(0);
	const prefersReducedMotion = useReducedMotion();
	const entranceEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

	useEffect(() => {
		onHeroReveal?.();
	}, [onHeroReveal]);

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

	useEffect(() => {
		const intervalId = window.setInterval(() => {
			setHeroImageIndex((current) => (current + 1) % heroImages.length);
		}, 3200);

		return () => {
			window.clearInterval(intervalId);
		};
	}, []);

	return (
		<section className="relative overflow-hidden bg-minuri-white text-minuri-ink">
			<div className="relative mx-auto max-w-7xl px-4 pb-10 pt-4 md:px-8">
				<div className="relative">
					<motion.header
						className="mx-auto flex w-full items-center justify-between bg-minuri-white md:rounded-full"
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
								className="flex items-center gap-2 text-2xl font-black tracking-tight text-minuri-ocean"
							>
								<span className="uppercase">Minuri</span>
							</Link>

							<nav className="hidden items-center gap-9 text-sm font-medium text-minuri-ocean md:flex">
								<Link
									href="#service"
									className="minuri-link-underline inline-flex h-10 items-center whitespace-nowrap"
								>
									Services
								</Link>
								<Link
									href="#our-story"
									className="minuri-link-underline inline-flex h-10 items-center whitespace-nowrap"
								>
									Company
								</Link>
								<Link
									href="#contact"
									className="minuri-link-underline inline-flex h-10 items-center whitespace-nowrap"
								>
									Resources
								</Link>
							</nav>
						</motion.div>

						<motion.div
							className="ml-auto flex items-center gap-2.5 md:gap-3"
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
								href="/guides"
								className="group hidden h-10 items-center gap-1.5 rounded-full border border-minuri-ocean bg-minuri-white px-5 text-sm font-medium text-minuri-ocean transition-transform duration-200 ease-out hover:scale-105 md:inline-flex"
							>
								First-time guides
								<ChevronRight
									className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-1"
									strokeWidth={2.25}
									aria-hidden
								/>
							</Link>
							<Link
								href="/near-me"
								className="group hidden h-10 items-center gap-1.5 rounded-full bg-minuri-teal px-5 text-sm font-medium text-primary-foreground transition-transform duration-200 ease-out hover:scale-105 md:inline-flex"
							>
								Near me
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
						className={`absolute left-0 right-0 top-full z-40 h-screen overflow-y-auto bg-minuri-white transition-[opacity,transform] duration-300 ease-out md:hidden ${
							mobileMenuOpen
								? "mt-3 translate-y-0 opacity-100 pointer-events-auto"
								: "-translate-y-1 opacity-0 pointer-events-none"
						}`}
						aria-hidden={!mobileMenuOpen}
					>
						<nav className="px-4 py-4">
							<Link
								href="#service"
								className="flex items-center justify-between py-2.5 text-2xl font-medium tracking-tight text-minuri-ocean"
								onClick={() => setMobileMenuOpen(false)}
							>
								<span>Services</span>
								<ChevronDown className="size-6" aria-hidden />
							</Link>
							<Link
								href="#our-story"
								className="flex items-center justify-between py-2.5 text-2xl font-medium tracking-tight text-minuri-ocean"
								onClick={() => setMobileMenuOpen(false)}
							>
								<span>Company</span>
								<ChevronDown className="size-6" aria-hidden />
							</Link>
							<Link
								href="#contact"
								className="flex items-center justify-between py-2.5 text-2xl font-medium tracking-tight text-minuri-ocean"
								onClick={() => setMobileMenuOpen(false)}
							>
								<span>Resources</span>
							</Link>
						</nav>

						<div className="mx-4 mb-4 mt-2 rounded-2xl bg-[#d9f2e5] p-4">
							<p className="text-3xl font-black uppercase leading-[0.95] tracking-tight text-minuri-ocean">
								Pitch us your problem
							</p>
							<div className="mt-3 space-y-2.5">
								<Link
									href="/guides"
									className="inline-flex w-full items-center justify-center rounded-full border border-black bg-minuri-white px-5 py-2 text-sm font-medium text-minuri-ocean"
									onClick={() => setMobileMenuOpen(false)}
								>
									View pricing
								</Link>
								<Link
									href="/near-me"
									className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-minuri-ocean px-5 py-2 text-sm font-semibold text-minuri-white"
									onClick={() => setMobileMenuOpen(false)}
								>
									Talk to us
									<ChevronRight
										className="size-4"
										aria-hidden
									/>
								</Link>
							</div>
						</div>
					</div>
				</div>

				<motion.div
					className="pb-10 pt-10 md:pb-14 md:pt-12"
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
							Feeling at home, wherever you are
						</motion.h1>
					</div>

					<div className="mt-0 grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-stretch md:gap-10">
						<div className="flex flex-col md:h-full">
							<motion.p
								className="mt-4 text-2xl font-black uppercase tracking-tight text-minuri-ocean md:text-3xl"
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
								Practical support that never quits
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
								<p className="max-w-2xl text-base leading-relaxed text-minuri-ocean/82 md:text-lg">
									We help young adults feel confident living
									independently for the first time.
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
										className="group inline-flex items-center gap-1.5 rounded-full bg-minuri-teal px-5 py-2.5 text-sm font-medium text-primary-foreground transition-transform duration-200 ease-out hover:scale-105"
									>
										Near me
										<ChevronRight
											aria-hidden
											className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-1"
										/>
									</Link>
									<Link
										href="/guides"
										className="group inline-flex items-center gap-1.5 rounded-full border border-minuri-ocean bg-minuri-white px-5 py-2.5 text-sm font-medium text-minuri-ocean transition-transform duration-200 ease-out hover:scale-105"
									>
										First-time guides
										<ChevronRight
											aria-hidden
											className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-1"
										/>
									</Link>
								</motion.div>
							</motion.div>
						</div>

						<motion.div
							className="relative mx-auto w-full max-w-md md:-mt-20"
							variants={{
								hidden: {
									opacity: 0,
									x: prefersReducedMotion ? 0 : 24,
									scale: prefersReducedMotion ? 1 : 0.985,
								},
								visible: {
									opacity: 1,
									x: 0,
									scale: 1,
									transition: {
										duration: prefersReducedMotion
											? 0.01
											: 0.75,
										ease: entranceEase,
									},
								},
							}}
						>
							<div className="group relative mx-auto aspect-square w-full">
								<AnimatePresence mode="sync">
									<motion.div
										key={heroImages[heroImageIndex].src}
										className="absolute inset-0"
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										transition={{
											duration: 0.7,
											ease: "easeInOut",
										}}
									>
										<Image
											src={heroImages[heroImageIndex].src}
											alt={heroImages[heroImageIndex].alt}
											fill
											sizes="(max-width: 768px) 90vw, 520px"
											className="h-full w-full object-contain"
											priority={heroImageIndex === 0}
										/>
									</motion.div>
								</AnimatePresence>
								<div className="pointer-events-none absolute -top-20 right-0 z-20 max-w-64 translate-y-2 scale-95 rounded-4xl border border-minuri-ocean bg-minuri-white/96 px-5 py-4 text-minuri-ocean opacity-0 backdrop-blur-sm transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100">
									<p
										className={`${bubbleHandwriting.className} text-3xl leading-[1.05] text-minuri-ocean/80`}
									>
										I can do this. I just need support that
										fits my day
									</p>
									<span
										aria-hidden
										className="absolute -bottom-2.5 left-8 h-5 w-5 rotate-45 border-b border-r border-minuri-ocean bg-minuri-white"
									/>
								</div>
							</div>
						</motion.div>
					</div>
				</motion.div>

				<motion.div
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
				</motion.div>
			</div>
		</section>
	);
}
