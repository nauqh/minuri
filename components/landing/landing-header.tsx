"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";

import { easeOut } from "@/components/landing/home-constants";
import { PillNavLink } from "@/components/landing/home-shared";
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

	return (
		<header className="relative z-50 w-full bg-minuri-ocean px-4 py-2 md:px-8 md:py-3">
			<motion.div
				className={cn(
					isVisible ? "pointer-events-auto" : "pointer-events-none",
				)}
				initial={false}
				animate={
					isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: -18 }
				}
				transition={{ duration: 3, ease: easeOut }}
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
							className="mx-auto h-30 w-auto shrink-0 object-contain"
						/>
					</Link>

					<motion.nav
						className="absolute left-1/2 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-full border border-minuri-white/65 bg-minuri-white py-1.5 pl-2.5 pr-2 shadow-[inset_0_1px_0_0_color-mix(in_oklch,var(--minuri-white)_82%,transparent),0_0_0_1px_color-mix(in_oklch,var(--minuri-ocean)_14%,transparent),0_20px_50px_-18px_color-mix(in_oklch,var(--minuri-ocean)_32%,transparent)] md:flex"
						aria-label="Primary"
						initial={{ opacity: 0, y: -14 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, ease: easeOut }}
					>
						<PillNavLink href="#our-story">
							Why we&apos;re here
						</PillNavLink>
						<PillNavLink href="#service">How we help</PillNavLink>
						<PillNavLink href="#contact">Get in touch</PillNavLink>
						<Link
							href="/guides"
							className="ml-0.5 whitespace-nowrap rounded-full bg-minuri-teal px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-transform duration-200 ease-out hover:scale-105"
						>
							Browse first-time guides
						</Link>
					</motion.nav>

					<div className="z-10 ml-auto flex items-center gap-2">
						<Link
							href="/near-me"
							className="hidden rounded-full bg-minuri-teal px-4 py-2 pb-2.5 text-sm font-medium text-primary-foreground transition-transform duration-200 ease-out hover:scale-105 md:inline-flex"
						>
							Find services near me
						</Link>
						<Link
							href="#"
							className="hidden rounded-full border border-minuri-silver/55 bg-minuri-white/95 px-4 py-2 pb-2.5 text-sm font-medium text-minuri-slate shadow-[0_1px_2px_color-mix(in_oklch,var(--minuri-ocean)_10%,transparent)] backdrop-blur-sm transition-transform duration-200 ease-out hover:scale-105 md:inline-flex"
						>
							Log in
						</Link>
						<div className="relative md:hidden">
							<button
								type="button"
								className="relative z-50 flex size-9 cursor-pointer items-center justify-center rounded-full bg-minuri-ice text-foreground transition-opacity duration-200 ease-out hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-minuri-ocean/45 focus-visible:ring-offset-2 focus-visible:ring-offset-minuri-ice active:opacity-85"
								aria-expanded={mobileMenuOpen}
								aria-haspopup="true"
								aria-controls="landing-mobile-menu"
								aria-label={
									mobileMenuOpen ? "Close menu" : "Open menu"
								}
								onClick={() => setMobileMenuOpen((o) => !o)}
							>
								<span className="relative size-5" aria-hidden>
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
					"fixed inset-x-0 bottom-0 top-16 z-40 bg-minuri-ocean/95 backdrop-blur-sm transition-all duration-300 md:hidden",
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
	);
}
