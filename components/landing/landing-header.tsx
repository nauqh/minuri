"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";

import { easeOut } from "@/components/landing/home-constants";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
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
		label: "Why we're here",
		description: "Our story and who we help",
		href: "#our-story",
	},
];

export function LandingHeader({ isVisible = true }: { isVisible?: boolean }) {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), []);

	useEffect(() => {
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") setMobileMenuOpen(false);
		};
		document.addEventListener("keydown", onKeyDown);
		const { overflow } = document.body.style;
		if (mobileMenuOpen) document.body.style.overflow = "hidden";
		return () => {
			document.removeEventListener("keydown", onKeyDown);
			document.body.style.overflow = overflow;
		};
	}, [mobileMenuOpen]);

	return (
		<>
			<header className="relative z-50">
				<motion.div
					className={cn(
						"relative z-50 mx-2 rounded-lg bg-minuri-ocean px-2.5 py-2.5 shadow-[0_10px_26px_-18px_color-mix(in_oklch,var(--minuri-ocean)_42%,transparent)] md:mx-4 md:px-3 md:py-3",
						isVisible
							? "pointer-events-auto"
							: "pointer-events-none",
					)}
					initial={false}
					animate={
						isVisible
							? { opacity: 1, y: 0 }
							: { opacity: 0, y: -18 }
					}
					transition={{ duration: 0.35, ease: easeOut }}
				>
					<div className="relative mx-auto flex h-12 max-w-full items-center md:h-14">
						<Link
							href="/"
							className="z-10 flex w-fit shrink-0 items-center justify-center gap-2 md:gap-2.5"
						>
							<Image
								src="/icon.png"
								alt="Minuri"
								width={400}
								height={400}
								priority
								className="mx-auto h-9 w-auto shrink-0 object-contain md:h-10"
							/>
						</Link>

						<motion.nav
							className="z-10 ml-10 hidden items-center gap-9 md:flex"
							aria-label="Primary"
							initial={{ opacity: 0, y: -14 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, ease: easeOut }}
						>
							<Link
								href="#our-story"
								className="minuri-link-underline inline-flex h-10 items-center whitespace-nowrap text-sm font-medium text-minuri-white transition-colors duration-200 hover:text-minuri-white"
							>
								Why we&apos;re here
							</Link>
							<Link
								href="#service"
								className="minuri-link-underline inline-flex h-10 items-center whitespace-nowrap text-sm font-medium text-minuri-white transition-colors duration-200 hover:text-minuri-white"
							>
								How we help
							</Link>
							<Link
								href="#contact"
								className="minuri-link-underline inline-flex h-10 items-center whitespace-nowrap text-sm font-medium text-minuri-white transition-colors duration-200 hover:text-minuri-white"
							>
								Get in touch
							</Link>
						</motion.nav>

						<div className="z-10 ml-auto flex items-center gap-2.5 md:gap-3">
							<Link
								href="/guides"
								className="group hidden h-11 items-center gap-1.5 rounded-full bg-minuri-white px-6 py-1.5 text-sm font-medium text-minuri-ocean shadow-[0_1px_2px_color-mix(in_oklch,var(--minuri-ocean)_30%,transparent)] transition-transform duration-200 ease-out hover:scale-105 md:inline-flex"
							>
								First-time guides
								<ChevronRight
									className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-1 group-focus-visible:translate-x-1"
									strokeWidth={2.25}
									aria-hidden
								/>
							</Link>
							<Link
								href="/near-me"
								className="group hidden h-11 items-center gap-1.5 rounded-full bg-minuri-teal px-6 py-1.5 text-sm font-medium text-primary-foreground transition-transform duration-200 ease-out hover:scale-105 md:inline-flex"
							>
								Near me
								<ChevronRight
									className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-1 group-focus-visible:translate-x-1"
									strokeWidth={2.25}
									aria-hidden
								/>
							</Link>
							<div className="relative md:hidden">
								<button
									type="button"
									className="relative z-50 flex size-9 cursor-pointer items-center justify-center rounded-full bg-minuri-ice text-foreground transition-opacity duration-200 ease-out hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-minuri-ocean/45 focus-visible:ring-offset-2 focus-visible:ring-offset-minuri-ice active:opacity-85"
									aria-expanded={mobileMenuOpen}
									aria-haspopup="true"
									aria-controls="landing-mobile-menu"
									aria-label={
										mobileMenuOpen
											? "Close menu"
											: "Open menu"
									}
									onClick={() => setMobileMenuOpen((o) => !o)}
								>
									<span
										className="relative size-5"
										aria-hidden
									>
										<X
											strokeWidth={2.25}
											className={cn(
												"absolute top-0 left-0 size-5 stroke-foreground text-foreground transition-all duration-300 ease-in-out",
												mobileMenuOpen
													? "rotate-0 opacity-100"
													: "rotate-90 opacity-0",
											)}
										/>
										<Menu
											strokeWidth={2.25}
											className={cn(
												"absolute top-0 left-0 size-5 stroke-foreground text-foreground transition-all duration-300 ease-in-out",
												mobileMenuOpen
													? "-rotate-90 opacity-0"
													: "rotate-0 opacity-100",
											)}
										/>
									</span>
								</button>
							</div>
						</div>
					</div>
				</motion.div>
			</header>

			{/* Mobile full-screen drawer */}
			<AnimatePresence>
				{mobileMenuOpen && (
					<>
						{/* Backdrop */}
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

						{/* Drawer */}
						<motion.div
							key="drawer"
							id="landing-mobile-menu"
							className="fixed inset-x-0 bottom-0 z-50 flex max-h-[92dvh] flex-col rounded-t-3xl md:hidden"
							style={{
								background:
									"radial-gradient(ellipse 120% 80% at 10% 0%, color-mix(in oklch, var(--minuri-teal) 18%, var(--minuri-ocean)) 0%, var(--minuri-ocean) 60%)",
							}}
							initial={{ y: "100%" }}
							animate={{ y: 0 }}
							exit={{ y: "100%" }}
							transition={{ duration: 0.38, ease: easeOut }}
							aria-modal="true"
							role="dialog"
							aria-label="Navigation menu"
						>
							{/* Drag handle */}
							<div className="flex shrink-0 justify-center pt-3 pb-1">
								<div className="h-1 w-10 rounded-full bg-minuri-white/20" />
							</div>

							<div className="flex-1 overflow-y-auto px-6 pt-4 pb-8">
								{/* Greeting */}
								<motion.div
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{
										delay: 0.12,
										duration: 0.3,
										ease: easeOut,
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

								{/* Nav items */}
								<nav aria-label="Mobile navigation">
									<ul className="flex flex-col gap-2">
										{NAV_ITEMS.map((item, i) => (
											<motion.li
												key={item.href}
												initial={{ opacity: 0, x: -16 }}
												animate={{ opacity: 1, x: 0 }}
												transition={{
													delay: 0.16 + i * 0.06,
													duration: 0.3,
													ease: easeOut,
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
													<span className="flex-1 min-w-0">
														<span className="block text-base font-semibold text-minuri-white">
															{item.label}
														</span>
														<span className="block text-sm text-minuri-slate/80 mt-0.5">
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

								{/* CTA card */}
								<motion.div
									initial={{ opacity: 0, y: 12 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{
										delay: 0.42,
										duration: 0.32,
										ease: easeOut,
									}}
									className="mt-6 rounded-2xl bg-minuri-teal/20 border border-minuri-teal/30 px-5 py-5"
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
		</>
	);
}
