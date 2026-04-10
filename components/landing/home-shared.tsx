"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

import { easeOut } from "@/components/landing/home-constants";

export function FadeUp({
	children,
	className,
	delay = 0,
}: {
	children: ReactNode;
	className?: string;
	delay?: number;
}) {
	const reduce = useReducedMotion();
	return (
		<motion.div
			className={className}
			initial={reduce ? false : { opacity: 0, y: 32 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-10% 0px -8% 0px" }}
			transition={
				reduce
					? { duration: 0 }
					: { duration: 0.65, delay, ease: easeOut }
			}
		>
			{children}
		</motion.div>
	);
}

export function PillNavLink({
	href,
	children,
}: {
	href: string;
	children: ReactNode;
}) {
	return (
		<Link
			href={href}
			className="whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-medium text-foreground/75 transition-colors hover:bg-foreground/6 hover:text-foreground"
		>
			{children}
		</Link>
	);
}

export function MenuNavLink({
	href,
	children,
	onNavigate,
}: {
	href: string;
	children: ReactNode;
	onNavigate?: () => void;
}) {
	return (
		<Link
			href={href}
			className="rounded-minuri px-1 py-0.5 text-sm text-minuri-slate transition-colors hover:text-minuri-teal"
			onClick={onNavigate}
		>
			{children}
		</Link>
	);
}

export function LandingFooterCurve() {
	return (
		<div
			className="pointer-events-none absolute inset-x-0 top-0 z-10 h-14 w-full -translate-y-[calc(100%-1px)] md:h-20"
			aria-hidden
		>
			<svg
				className="h-full w-full text-minuri-mist"
				viewBox="0 0 1440 120"
				preserveAspectRatio="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<title>Curved border</title>
				<path
					fill="currentColor"
					d="M0 120V68C164 30 332 30 496 68C660 106 780 106 944 68C1108 30 1276 30 1440 68V120H0z"
				/>
			</svg>
		</div>
	);
}
