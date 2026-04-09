"use client";

import type { FocusEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";
import { easeOut } from "@/components/landing/home-constants";

const HOVER_GROW_WIDE = 1.35;
const HOVER_GROW_NARROW = 1;

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
	cursor = true,
}: {
	firstText: string;
	secondText: string;
	className?: string;
	secondClassName?: string;
	charDelay?: number;
	startDelay?: number;
	stepPause?: number;
	cursor?: boolean;
}) {
	const [firstDisplay, setFirstDisplay] = useState("");
	const [secondDisplay, setSecondDisplay] = useState("");
	const [isDone, setIsDone] = useState(false);

	useEffect(() => {
		let timer: ReturnType<typeof setTimeout> | null = null;

		const typeSecond = (index = 0) => {
			const next = index + 1;
			setSecondDisplay(secondText.slice(0, next));
			if (next < secondText.length) {
				timer = setTimeout(() => typeSecond(next), charDelay);
			} else {
				setIsDone(true);
			}
		};

		const typeFirst = (index = 0) => {
			const next = index + 1;
			setFirstDisplay(firstText.slice(0, next));
			if (next < firstText.length) {
				timer = setTimeout(() => typeFirst(next), charDelay);
				return;
			}
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
				<span className={secondClassName}>{secondDisplay}</span>
			)}
			{cursor && !isDone && (
				<span className="ml-px inline-block animate-pulse" aria-hidden>
					|
				</span>
			)}
		</span>
	);
}

function HeroIntersectCards() {
	const [focus, setFocus] = useState<"left" | "right" | null>(null);
	const [isMd, setIsMd] = useState(false);
	const reduce = useReducedMotion();
	const rowRef = useRef<HTMLDivElement>(null);
	const lastHoverScrollAtRef = useRef(0);

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

	const triggerHoverScroll = useCallback(() => {
		const now = Date.now();
		if (now - lastHoverScrollAtRef.current < 900) return;
		const row = rowRef.current;
		if (!row) return;
		const rect = row.getBoundingClientRect();
		const viewportBottom = window.innerHeight;
		const bottomGap = 24;
		const needed = rect.bottom - (viewportBottom - bottomGap);
		if (needed <= 0) return;
		lastHoverScrollAtRef.current = now;
		window.scrollBy({
			top: needed,
			behavior: reduce ? "auto" : "smooth",
		});
	}, [reduce]);

	const spring = reduce
		? { duration: 0.2 }
		: { type: "spring" as const, stiffness: 280, damping: 38 };

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

	const showLeftInner = reduce || !isMd || focus === "left";
	const showRightInner = reduce || !isMd || focus === "right";

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
						className="landing-hero-card-mint-a group relative flex min-h-96 w-full flex-col overflow-hidden rounded-lg border border-minuri-white/35 p-4 transition-transform duration-300 ease-out hover:-translate-y-1 md:min-h-0 md:h-full md:flex-1"
						onMouseEnter={() => {
							if (isMd) setFocus("left");
							triggerHoverScroll();
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
								reduce && "duration-75 delay-0",
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
						className="landing-hero-card-mint-b group relative flex min-h-96 w-full flex-col overflow-hidden rounded-lg border border-minuri-white/35 p-4 transition-transform duration-300 ease-out hover:-translate-y-1 md:min-h-0 md:h-full md:flex-1"
						onMouseEnter={() => {
							if (isMd) setFocus("right");
							triggerHoverScroll();
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
								reduce && "duration-75 delay-0",
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

export function LandingHeroSection() {
	return (
		<div className="relative overflow-x-clip">
			<div className="landing-hero-dots relative flex min-h-[84dvh] flex-col pt-24 md:min-h-[92dvh] md:pt-28">
				<div className="absolute inset-x-0 top-[30%] z-10 mx-auto flex w-full max-w-3xl justify-center px-4 text-center md:px-8">
					<motion.h1
						className="font-sans text-[clamp(2.25rem,7vw,4rem)] font-bold leading-[1.08] tracking-tight text-minuri-white"
						initial={{ opacity: 0, y: 24 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.55, ease: easeOut }}
					>
						<TwoStepTypewriter
							firstText="You leave home. "
							secondText="Still"
							stepPause={1000}
							secondClassName="font-hero-serif font-normal italic text-minuri-ice"
						/>
					</motion.h1>
				</div>
				<div className="absolute inset-x-0 top-[48%] z-10 mx-auto w-full max-w-3xl px-5 text-center md:top-[46%] md:px-8">
					<motion.p
						className="mx-auto max-w-2xl text-sm leading-relaxed text-minuri-ice/90 md:text-base"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{
							duration: 0.55,
							delay: 0.2,
							ease: easeOut,
						}}
					>
						Minuri helps you navigate independent life with
						practical support for food, health, transport, and
						connection.
					</motion.p>
				</div>
			</div>

			<div className="relative bg-minuri-white">
				<div className="absolute inset-x-0 top-0 z-20 flex -translate-y-1/2 justify-center px-4 md:px-8">
					<div className="pointer-events-none mx-auto w-full max-w-6xl">
						<motion.div
							className="pointer-events-auto rounded-minuri border border-minuri-silver/25 bg-minuri-white px-4 py-6 md:px-6 md:py-8"
							initial={{ opacity: 0, y: 44 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{
								duration: 0.65,
								delay: 0.08,
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
