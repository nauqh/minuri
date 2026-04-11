"use client";

import type { FocusEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";
import { easeOut } from "@/components/landing/home-constants";
import { LandingHeader } from "@/components/landing/landing-header";

const HOVER_GROW_WIDE = 1.35;
const HOVER_GROW_NARROW = 1;
const TYPEWRITER_TOTAL_DURATION_SECONDS = 3;

const heroIntersectGlassClass =
	"relative rounded-2xl border-[0.5px] border-minuri-white/70 bg-minuri-white/45 p-4 shadow-[0_8px_40px_-10px_color-mix(in_oklch,var(--minuri-ocean)_22%,transparent)] ring-[0.5px] ring-inset ring-minuri-white/40 backdrop-blur-2xl backdrop-saturate-150 md:p-5";

const heroIntersectCtaClass =
	"mt-4 inline-flex w-full origin-center items-center justify-center gap-2 rounded-full bg-minuri-ink py-3 text-sm font-semibold text-minuri-white transition-transform duration-200 ease-out hover:scale-105 md:w-auto md:px-8";

function TwoStepTypewriter({
	firstText,
	secondText,
	className,
	secondClassName,
	charDelay = 85,
	startDelay = 300,
	stepPause = 2000,
	onFirstComplete,
	onSecondStart,
	onComplete,
}: {
	firstText: string;
	secondText: string;
	className?: string;
	secondClassName?: string;
	charDelay?: number;
	startDelay?: number;
	stepPause?: number;
	onFirstComplete?: () => void;
	onSecondStart?: () => void;
	onComplete?: () => void;
}) {
	const [firstDisplay, setFirstDisplay] = useState("");
	const [secondDisplay, setSecondDisplay] = useState("");
	const onFirstCompleteRef = useRef(onFirstComplete);
	const onSecondStartRef = useRef(onSecondStart);
	const onCompleteRef = useRef(onComplete);

	useEffect(() => {
		onFirstCompleteRef.current = onFirstComplete;
		onSecondStartRef.current = onSecondStart;
		onCompleteRef.current = onComplete;
	}, [onFirstComplete, onSecondStart, onComplete]);

	useEffect(() => {
		let timer: ReturnType<typeof setTimeout> | null = null;

		const typeSecond = (index = 0) => {
			if (index === 0) {
				onSecondStartRef.current?.();
			}
			const next = index + 1;
			setSecondDisplay(secondText.slice(0, next));
			if (next < secondText.length) {
				timer = setTimeout(() => typeSecond(next), charDelay);
			} else {
				onCompleteRef.current?.();
			}
		};

		const typeFirst = (index = 0) => {
			const next = index + 1;
			setFirstDisplay(firstText.slice(0, next));
			if (next < firstText.length) {
				timer = setTimeout(() => typeFirst(next), charDelay);
				return;
			}
			onFirstCompleteRef.current?.();
			timer = setTimeout(() => typeSecond(), stepPause);
		};

		timer = setTimeout(() => typeFirst(), startDelay);

		return () => {
			if (timer) {
				clearTimeout(timer);
			}
		};
	}, [firstText, secondText, charDelay, startDelay, stepPause]);

	return (
		<span className={className}>
			{firstDisplay}
			{firstDisplay.length === firstText.length && (
				<>
					<br />
					<span className={secondClassName}>{secondDisplay}</span>
				</>
			)}
		</span>
	);
}

function HeroIntersectCards() {
	const [focus, setFocus] = useState<"left" | "right" | null>(null);
	const [isMd, setIsMd] = useState(false);
	const rowRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const mq = window.matchMedia("(min-width: 768px)");
		const upd = () => setIsMd(mq.matches);
		upd();
		mq.addEventListener("change", upd);
		return () => mq.removeEventListener("change", upd);
	}, []);

	const handleRowBlur = useCallback((e: FocusEvent<HTMLDivElement>) => {
		if (!rowRef.current?.contains(e.relatedTarget as Node | null)) {
			setFocus(null);
		}
	}, []);

	const handleRowMouseLeave = useCallback(() => {
		if (rowRef.current?.contains(document.activeElement)) return;
		setFocus(null);
	}, []);

	const spring = { type: "spring" as const, stiffness: 280, damping: 38 };

	const leftGrow = !isMd
		? 1
		: focus === "left"
			? HOVER_GROW_WIDE
			: focus === "right"
				? HOVER_GROW_NARROW
				: 1;
	const rightGrow = !isMd
		? 1
		: focus === "right"
			? HOVER_GROW_WIDE
			: focus === "left"
				? HOVER_GROW_NARROW
				: 1;

	const showLeftInner = !isMd || focus === "left";
	const showRightInner = !isMd || focus === "right";

	return (
		<>
			<p className="text-sm font-semibold text-foreground">
				Choose your starting point
			</p>
			<div
				ref={rowRef}
				className="mt-6 flex flex-col gap-5 md:h-112 md:flex-row md:gap-5"
				onMouseLeave={handleRowMouseLeave}
				onBlur={handleRowBlur}
			>
				<motion.div
					className="min-w-0 md:flex md:h-full md:flex-col"
					initial={false}
					animate={{ flexGrow: leftGrow }}
					transition={spring}
					style={{ flexBasis: 0, flexShrink: 1 }}
					onMouseEnter={() => isMd && setFocus("left")}
				>
					<Link
						href="/guides"
						className="landing-hero-card-mint-a group relative flex min-h-96 w-full flex-col overflow-hidden rounded-lg border border-minuri-white/35 p-4 transition-transform duration-300 ease-out md:min-h-0 md:h-full md:flex-1 md:hover:-translate-y-1"
						onMouseEnter={() => {
							if (isMd) setFocus("left");
						}}
						onFocus={() => {
							if (isMd) setFocus("left");
						}}
					>
						<h2 className="relative w-fit pb-0.5 text-2xl font-medium text-foreground md:text-3xl">
							Alex - Uni Student
						</h2>
						<div className="pointer-events-none relative mt-4 flex min-h-44 flex-1 items-end justify-center md:min-h-52">
							<Image
								src="/amico.svg"
								alt=""
								aria-hidden
								loading="eager"
								width={320}
								height={320}
								className="h-full w-auto object-contain opacity-95"
							/>
						</div>
						<div
							className={cn(
								"absolute bottom-4 left-4 z-20 w-[min(34rem,calc(100%-2rem))] transition-transform ease-[cubic-bezier(0.22,1,0.36,1)]",
								showLeftInner
									? "translate-y-0 duration-260 delay-180"
									: "translate-y-[120%] duration-160 delay-0",
								!showLeftInner && isMd && "pointer-events-none",
							)}
						>
							<div className={heroIntersectGlassClass}>
								<p className="text-sm leading-relaxed text-foreground/90">
									&quot;I moved for uni and suddenly had to
									figure out groceries, appointments, and
									getting around by myself.&quot; Start with
									first-time guides built for that shift.
								</p>
								<span className={heroIntersectCtaClass}>
									Browse First Time Guides
								</span>
							</div>
						</div>
					</Link>
				</motion.div>
				<motion.div
					className="min-w-0 md:flex md:h-full md:flex-col"
					initial={false}
					animate={{ flexGrow: rightGrow }}
					transition={spring}
					style={{ flexBasis: 0, flexShrink: 1 }}
					onMouseEnter={() => isMd && setFocus("right")}
				>
					<Link
						href="/near-me"
						className="landing-hero-card-mint-b group relative flex min-h-96 w-full flex-col overflow-hidden rounded-lg border border-minuri-white/35 p-4 transition-transform duration-300 ease-out md:min-h-0 md:h-full md:flex-1 md:hover:-translate-y-1"
						onMouseEnter={() => {
							if (isMd) setFocus("right");
						}}
						onFocus={() => {
							if (isMd) setFocus("right");
						}}
					>
						<h2 className="relative w-fit pb-0.5 text-2xl font-medium text-foreground md:text-3xl">
							Jordan - First Jobber
						</h2>
						<div className="pointer-events-none relative mt-4 flex min-h-44 flex-1 items-end justify-center md:min-h-52">
							<Image
								src="/pana.svg"
								alt=""
								aria-hidden
								loading="eager"
								width={320}
								height={320}
								className="h-full w-auto object-contain opacity-95"
							/>
						</div>
						<div
							className={cn(
								"absolute bottom-4 left-4 z-20 w-[min(34rem,calc(100%-2rem))] transition-transform ease-[cubic-bezier(0.22,1,0.36,1)]",
								showRightInner
									? "translate-y-0 duration-260 delay-180"
									: "translate-y-[120%] duration-160 delay-0",
								!showRightInner &&
									isMd &&
									"pointer-events-none",
							)}
						>
							<div className={heroIntersectGlassClass}>
								<p className="text-sm leading-relaxed text-foreground/90">
									&quot;I started my first full-time job and
									didn&apos;t know where to find reliable
									local help outside work hours.&quot; Use
									Near Me to find services and essentials
									fast.
								</p>
								<span className={heroIntersectCtaClass}>
									Find services near me
								</span>
							</div>
						</div>
					</Link>
				</motion.div>
			</div>
		</>
	);
}

export function LandingHeroSection({
	onHeroReveal,
	headerVisible = true,
}: {
	onHeroReveal?: () => void;
	headerVisible?: boolean;
}) {
	const heroRevealNotified = useRef(false);
	const cardsRevealNotified = useRef(false);
	const [cardsVisible, setCardsVisible] = useState(false);

	const handleCardsReveal = useCallback(() => {
		if (cardsRevealNotified.current) return;
		cardsRevealNotified.current = true;
		setCardsVisible(true);
	}, []);

	const handleHeroReveal = useCallback(() => {
		if (heroRevealNotified.current) return;
		heroRevealNotified.current = true;
		window.setTimeout(() => {
			onHeroReveal?.();
		}, 240);
	}, [onHeroReveal]);

	return (
		<div className="relative overflow-x-clip">
			{/* Anchor tagline near the top third of the viewport. */}
			<div className="relative flex h-screen flex-col bg-minuri-ocean max-h-200">
				<LandingHeader isVisible={headerVisible} />
				<div className="relative z-10 mx-auto flex min-h-0 w-full max-w-3xl flex-1 flex-col items-start justify-start gap-3 px-4 pt-[20vh] text-left max-md:min-h-0 md:items-center md:gap-5 md:px-8 md:text-center">
					<motion.h1
						className="w-full max-w-3xl font-sans text-5xl font-bold leading-[1.08] tracking-tight text-minuri-white md:text-7xl"
						initial={{ opacity: 0, y: 24 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.55, ease: easeOut }}
					>
						<TwoStepTypewriter
							firstText="Still feeling home, "
							secondText="wherever you are"
							stepPause={1000}
							secondClassName="font-hero-serif font-normal italic text-minuri-ice"
							onFirstComplete={handleCardsReveal}
							onSecondStart={handleHeroReveal}
						/>
					</motion.h1>
				</div>
			</div>

			<div className="relative bg-minuri-white">
				<div className="absolute inset-x-0 top-0 z-20 flex -translate-y-[32%] justify-center px-4 max-md:max-w-[100vw] md:-translate-y-1/2 md:px-8">
					<div className="pointer-events-none mx-auto w-full max-w-6xl">
						<motion.div
							className="pointer-events-auto rounded-minuri border border-minuri-silver/25 bg-minuri-white px-4 py-6 md:px-6 md:py-8"
							initial={false}
							animate={
								cardsVisible
									? { opacity: 1, y: 0 }
									: { opacity: 0, y: 44 }
							}
							transition={{
								duration: TYPEWRITER_TOTAL_DURATION_SECONDS,
								ease: easeOut,
							}}
						>
							<HeroIntersectCards />
						</motion.div>
					</div>
				</div>
				<div
					className="h-[clamp(11rem,26vmin,20rem)] md:h-[clamp(13rem,30vmin,24rem)]"
					aria-hidden
				/>
			</div>
		</div>
	);
}
