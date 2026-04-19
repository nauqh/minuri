"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Menu, X } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";

import { easeOut } from "@/components/landing/home-constants";
import { cn } from "@/lib/utils";

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

	const shouldShowHeader = isVisible;

	return (
		<>
			<header className="relative z-50">
				<motion.div
					className={cn(
						"relative z-50 mx-2 rounded-lg bg-minuri-ocean px-2.5 py-2.5 shadow-[0_10px_26px_-18px_color-mix(in_oklch,var(--minuri-ocean)_42%,transparent)] md:mx-4 md:px-3 md:py-3",
						shouldShowHeader
							? "pointer-events-auto"
							: "pointer-events-none",
					)}
					initial={false}
					animate={
						shouldShowHeader
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
				<div
					id="landing-mobile-menu"
					className={cn(
						"absolute inset-x-0 top-full z-40 mt-2 max-h-[calc(100dvh-5rem)] bg-minuri-ocean/95 backdrop-blur-sm transition-all duration-300 md:hidden",
						mobileMenuOpen
							? "pointer-events-auto visible translate-y-0 opacity-100 ease-out"
							: "pointer-events-none invisible -translate-y-2 opacity-0 ease-in",
					)}
					aria-hidden={!mobileMenuOpen}
					inert={mobileMenuOpen ? undefined : true}
				>
					<div className="h-full overflow-y-auto px-8 pt-12 pb-10">
						<nav className="flex flex-col items-center gap-8 text-center">
							<Link
								href="/"
								className="text-5xl font-semibold tracking-tight text-minuri-slate transition-colors duration-200 hover:text-minuri-teal"
								onClick={closeMobileMenu}
							>
								Home
							</Link>
							<Link
								href="#our-story"
								className="text-5xl font-semibold tracking-tight text-minuri-slate transition-colors duration-200 hover:text-minuri-teal"
								onClick={closeMobileMenu}
							>
								Why we&apos;re here
							</Link>
							<Link
								href="#service"
								className="text-5xl font-semibold tracking-tight text-minuri-slate transition-colors duration-200 hover:text-minuri-teal"
								onClick={closeMobileMenu}
							>
								How we help
							</Link>
							<Link
								href="#contact"
								className="text-5xl font-semibold tracking-tight text-minuri-slate transition-colors duration-200 hover:text-minuri-teal"
								onClick={closeMobileMenu}
							>
								Get in touch
							</Link>
							<Link
								href="/guides"
								className="mt-2 rounded-full bg-minuri-teal px-6 py-3 text-base font-semibold text-primary-foreground transition-transform duration-200 ease-out hover:scale-105"
								onClick={closeMobileMenu}
							>
								Browse first-time guides
							</Link>
							<Link
								href="/near-me"
								className="rounded-full border border-minuri-white/40 bg-minuri-white/10 px-6 py-3 text-base font-semibold text-minuri-white transition-transform duration-200 ease-out hover:scale-105"
								onClick={closeMobileMenu}
							>
								Find services near me
							</Link>
						</nav>
					</div>
				</div>
			</header>
		</>
	);
}
