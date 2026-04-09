"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { Menu } from "lucide-react";

import { easeOut } from "@/components/landing/home-constants";
import {
	MenuNavLink,
	PillNavLink,
} from "@/components/landing/home-shared";

export function LandingHeader() {
	return (
		<header className="fixed top-0 right-0 left-0 z-50 bg-transparent px-4 py-3 md:px-8 md:py-4">
			<div className="relative mx-auto flex h-14 max-w-full items-center">
				<Link
					href="/"
					className="z-10 flex w-fit shrink-0 items-center gap-2 md:gap-2.5"
				>
					<Image
						src="https://cdn-icons-png.flaticon.com/512/6959/6959474.png"
						alt="Minuri"
						width={200}
						height={200}
						priority
						className="h-10 w-auto shrink-0 object-contain"
					/>
					<p className="text-xl font-bold tracking-wide text-minuri-ice">
						Minuri
					</p>
				</Link>

				<motion.nav
					className="absolute left-1/2 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-full border border-minuri-white/65 bg-minuri-white py-1.5 pl-2.5 pr-2 shadow-[inset_0_1px_0_0_color-mix(in_oklch,var(--minuri-white)_82%,transparent),0_0_0_1px_color-mix(in_oklch,var(--minuri-ocean)_14%,transparent),0_20px_50px_-18px_color-mix(in_oklch,var(--minuri-ocean)_32%,transparent)] backdrop-blur-xl md:flex"
					aria-label="Primary"
					initial={{ opacity: 0, y: -14 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, ease: easeOut }}
				>
					<PillNavLink href="#our-story">Our story</PillNavLink>
					<PillNavLink href="/guides">Guides</PillNavLink>
					<PillNavLink href="/near-me">Near Me</PillNavLink>
					<Link
						href="/guides"
						className="ml-0.5 whitespace-nowrap rounded-full bg-minuri-teal px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-transform duration-200 ease-out hover:scale-105"
					>
						Browse Guides
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
					<details className="relative md:hidden">
						<summary
							className="flex size-11 cursor-pointer list-none items-center justify-center rounded-full border border-minuri-ice/35 bg-minuri-white/12 text-minuri-ice backdrop-blur-sm [&::-webkit-details-marker]:hidden"
							aria-label="Open menu"
						>
							<Menu className="size-5" />
						</summary>
						<div className="absolute right-0 z-30 mt-2 w-56 rounded-minuri border border-minuri-silver/50 bg-minuri-white/95 p-4 shadow-[0_0_0_1px_color-mix(in_oklch,var(--minuri-ocean)_10%,transparent),0_18px_44px_-14px_color-mix(in_oklch,var(--minuri-ocean)_26%,transparent)] backdrop-blur-md">
							<nav className="flex flex-col gap-1">
								<MenuNavLink href="#our-story">Our story</MenuNavLink>
								<MenuNavLink href="#flow">Guides</MenuNavLink>
								<MenuNavLink href="#care">Near Me</MenuNavLink>
								<hr className="my-2 border-minuri-silver/80" />
								<Link
									href="/guides"
									className="mt-1 whitespace-nowrap rounded-full bg-minuri-teal py-2.5 text-center text-sm font-medium text-primary-foreground transition-transform duration-200 ease-out hover:scale-105"
								>
									Browse Guides
								</Link>
							</nav>
						</div>
					</details>
				</div>
			</div>
		</header>
	);
}
