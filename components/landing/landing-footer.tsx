"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { useState, useRef, useEffect, useCallback } from "react";

import { easeOut } from "@/components/landing/home-constants";
import { scrollToTopAndHighlightLandingCta } from "@/lib/scroll-to-top-and-highlight-cta";

const exploreLinks = [
	{ label: "Guides", href: "/guides" },
	{ label: "Near Me", href: "/near-me" },
	{ label: "Journey", href: "/journey" },
];

const topicLinks = [
	{ label: "Food & Eating", href: "/guides" },
	{ label: "Getting Around", href: "/guides" },
	{ label: "Health & Wellbeing", href: "/guides" },
	{ label: "Home & Admin", href: "/guides" },
	{ label: "Social & Belonging", href: "/guides" },
];

const SCRAMBLE_CHARS =
	"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%";
const ORIGINAL = "Minuri";

export function LandingFooter() {
	const [displayText, setDisplayText] = useState(ORIGINAL);
	const frameRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const iterationRef = useRef(0);
	const h2Ref = useRef<HTMLHeadingElement>(null);

	const startScramble = useCallback(() => {
		if (frameRef.current) clearInterval(frameRef.current);
		iterationRef.current = 0;
		frameRef.current = setInterval(() => {
			setDisplayText(
				ORIGINAL.split("")
					.map((c, i) =>
						i < iterationRef.current
							? ORIGINAL[i]
							: SCRAMBLE_CHARS[
									Math.floor(
										Math.random() * SCRAMBLE_CHARS.length,
									)
								],
					)
					.join(""),
			);
			if (iterationRef.current >= ORIGINAL.length) {
				clearInterval(frameRef.current!);
			}
			iterationRef.current += 0.4;
		}, 30);
	}, []);

	const stopScramble = useCallback(() => {
		if (frameRef.current) clearInterval(frameRef.current);
		setDisplayText(ORIGINAL);
	}, []);

	useEffect(() => {
		const el = h2Ref.current;
		if (!el) return;
		document.fonts.ready.then(() => {
			if (h2Ref.current) {
				h2Ref.current.style.width = `${h2Ref.current.offsetWidth}px`;
			}
		});
	}, []);

	useEffect(() => {
		const el = h2Ref.current;
		if (!el) return;
		const observer = new IntersectionObserver(
			([entry]) => {
				if (!entry.isIntersecting) return;
				observer.disconnect();
				startScramble();
			},
			{ threshold: 0.5 },
		);
		observer.observe(el);
		return () => observer.disconnect();
	}, [startScramble]);

	return (
		<footer className="relative z-10 bg-minuri-white text-minuri-ink">
			{/* Main grid — brand + nav columns */}
			<div className="mx-auto w-full max-w-screen min-[1500px]:max-w-[1600px] px-5 pb-14 pt-20 md:px-8 md:pt-28">
				<div className="grid grid-cols-1 gap-14 md:grid-cols-[2fr_1fr_1fr] md:gap-8 lg:gap-12">
					{/* Brand */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.55, ease: easeOut }}
					>
						<h2
							ref={h2Ref}
							className="cursor-default text-[clamp(3.5rem,7vw,6rem)] font-black leading-none text-minuri-ocean"
							onMouseEnter={startScramble}
							onMouseLeave={stopScramble}
						>
							{displayText}
						</h2>
						<p className="mt-4 text-[1rem] font-medium text-minuri-ink/50">
							Melbourne, Australia
						</p>
						<Link
							href="mailto:hello@minuri.app"
							className="mt-1.5 block text-[1rem] font-medium text-minuri-ink/50 transition-colors hover:text-minuri-teal"
						>
							hello@minuri.app
						</Link>
					</motion.div>

					{/* Explore */}
					<motion.div
						initial={{ opacity: 0, y: 14 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5, delay: 0.08, ease: easeOut }}
					>
						<p className="mb-6 text-[0.65rem] font-black uppercase tracking-[0.17em] text-minuri-ink/30">
							Explore
						</p>
						<ul className="flex flex-col gap-4">
							{exploreLinks.map((link) => (
								<li key={link.label}>
									<Link
										href={link.href}
										className="text-[1.25rem] font-semibold text-minuri-ink/65 transition-colors hover:text-minuri-teal"
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</motion.div>

					{/* Topics */}
					<motion.div
						initial={{ opacity: 0, y: 14 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5, delay: 0.14, ease: easeOut }}
					>
						<p className="mb-6 text-[0.65rem] font-black uppercase tracking-[0.17em] text-minuri-ink/30">
							Topics
						</p>
						<ul className="flex flex-col gap-4">
							{topicLinks.map((link) => (
								<li key={link.label}>
									<Link
										href={link.href}
										className="text-[1.25rem] font-semibold text-minuri-ink/65 transition-colors hover:text-minuri-teal"
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</motion.div>
				</div>
			</div>

			{/* Divider */}
			<div className="mx-auto w-full max-w-screen min-[1500px]:max-w-[1600px] px-5 md:px-8">
				<div className="border-t border-minuri-ink/10" />
			</div>

			{/* Bottom bar */}
			<div className="mx-auto w-full max-w-screen min-[1500px]:max-w-[1600px] px-5 py-7 md:px-8">
				<div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
					<p className="text-[0.85rem] font-medium text-minuri-ink/35">
						© {new Date().getFullYear()} Minuri
					</p>
					<div className="group relative">
						<div className="absolute inset-0 translate-x-[10px] translate-y-[10px] rounded-lg bg-minuri-ocean/18" />
						<div className="absolute inset-0 translate-x-[5px] translate-y-[5px] rounded-lg bg-minuri-ocean/35 transition-transform duration-200 ease-out group-hover:translate-x-[8px] group-hover:translate-y-[8px]" />
						<button
							type="button"
							onClick={scrollToTopAndHighlightLandingCta}
							className="relative z-10 flex items-center gap-1.5 rounded-lg bg-minuri-ocean px-4 py-2 text-[0.85rem] font-black uppercase tracking-widest text-white transition-transform duration-200 ease-out group-hover:translate-x-[7px] group-hover:translate-y-[7px]"
						>
							Start where you are
							<ArrowUpRight className="size-3.5" aria-hidden />
						</button>
					</div>
				</div>
			</div>
		</footer>
	);
}
