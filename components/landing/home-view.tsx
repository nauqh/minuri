"use client";

import type { FocusEvent, ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Menu } from "lucide-react";

import { cn } from "@/lib/utils";
import { SpotlightScrollSection } from "@/components/landing/spotlight-scroll-section";

const steps = [
	{
		title: "First Time Guides",
		line: "Practical, plain-language guides for food, health, transport, and social connection while you settle into independent life.",
	},
	{
		title: "Local Services Near You",
		line: "Find nearby essentials and support without guesswork, mapped to where you already live, study, and commute.",
	},
	{
		title: "Clear Next Steps",
		line: "Know what to do first when family support is no longer close by, from booking a GP to setting up your first routine.",
	},
];

const easeOut = [0.22, 1, 0.36, 1] as const;

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
		setFirstDisplay("");
		setSecondDisplay("");
		setIsDone(false);

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

function FadeUp({
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

function PillNavLink({
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

function MenuNavLink({
	href,
	children,
}: {
	href: string;
	children: ReactNode;
}) {
	return (
		<Link
			href={href}
			className="rounded-minuri px-1 py-0.5 text-sm text-minuri-slate transition-colors hover:text-minuri-teal"
		>
			{children}
		</Link>
	);
}

/** Single soft curve at footer top edge. */
function LandingFooterCurve() {
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

/** Subtle hover skew (~57 / 43); 50/50 at rest. */
const HOVER_GROW_WIDE = 1.35;
const HOVER_GROW_NARROW = 1;

/** Glass inner panel + solid CTA — reference: frosted strip + pill button (hover scales only). */
const heroIntersectGlassClass =
	"relative rounded-2xl border-[0.5px] border-minuri-white/70 bg-minuri-white/45 p-4 shadow-[0_8px_40px_-10px_color-mix(in_oklch,var(--minuri-ocean)_22%,transparent)] ring-[0.5px] ring-inset ring-minuri-white/40 backdrop-blur-2xl backdrop-saturate-150 md:p-5";

const heroIntersectCtaClass =
	"mt-4 inline-flex w-full origin-center items-center justify-center gap-2 rounded-full bg-minuri-ink py-3 text-sm font-semibold text-minuri-white transition-transform duration-200 ease-out hover:scale-105 md:w-auto md:px-8";

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
							isMd && setFocus("left");
							triggerHoverScroll();
						}}
						onFocus={() => {
							isMd && setFocus("left");
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
							isMd && setFocus("right");
							triggerHoverScroll();
						}}
						onFocus={() => {
							isMd && setFocus("right");
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

export function HomeView() {
	return (
		<div className="min-h-screen bg-minuri-fog text-foreground">
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
									<MenuNavLink href="#our-story">
										Our story
									</MenuNavLink>
									<MenuNavLink href="#flow">
										Guides
									</MenuNavLink>
									<MenuNavLink href="#care">
										Near Me
									</MenuNavLink>
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

			{/* Concept §9 — Deep Ocean hero + white band; shell centered on the seam */}
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
					{/* Keep shell 50/50 across the seam between hero and white band */}
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
					{/* White band below shell — clamp separates two-card shell from Our story below */}
					<div
						className="h-[clamp(11rem,26vmin,20rem)] md:h-[clamp(13rem,30vmin,24rem)]"
						aria-hidden
					/>
				</div>
			</div>

			<main>
				<SpotlightScrollSection />

				<section
					id="flow"
					className="flex min-h-[88dvh] flex-col justify-center bg-[#f4f5f7] py-20 md:py-28"
				>
					<div className="mx-auto w-full max-w-6xl px-5 md:px-8">
						<div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
							<div className="space-y-8">
								<div className="-mt-4 mx-auto max-w-2xl text-center">
									<FadeUp delay={0.06}>
										<h2 className="mt-2 text-5xl font-semibold tracking-tight text-minuri-mid md:text-6xl md:leading-[1.03]">
											Settle in, faster.
										</h2>
									</FadeUp>
									<FadeUp
										delay={0.1}
										className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-minuri-slate md:text-base"
									>
										<p>
											Wherever you are in your move, start
											with first-time guides or jump
											straight to nearby services.
										</p>
									</FadeUp>
								</div>

								<FadeUp
									delay={0.14}
									className="relative h-[340px] w-full max-w-[520px]"
								>
									<Image
										src="/homescreen.svg"
										alt="Minuri homescreen preview"
										fill
										className="object-contain"
										sizes="(max-width: 768px) 90vw, 420px"
									/>
								</FadeUp>
							</div>

							<ol className="space-y-0">
								{steps.map((step, i) => (
									<motion.li
										key={step.title}
										className={cn(
											"grid gap-3 py-7 md:grid-cols-[3.5rem_1fr] md:items-start md:gap-7 md:py-8",
											i === 0
												? "border-t-0"
												: "border-t border-minuri-silver/80",
										)}
										initial={{ opacity: 0, x: -20 }}
										whileInView={{ opacity: 1, x: 0 }}
										viewport={{ once: true, margin: "-8%" }}
										transition={{
											duration: 0.5,
											delay: i * 0.05,
											ease: easeOut,
										}}
									>
										<span className="inline-block text-3xl font-semibold leading-none tracking-tight text-minuri-teal md:text-4xl">
											{String(i + 1).padStart(2, "0")}
										</span>
										<div>
											<h3 className="text-2xl font-medium tracking-tight text-minuri-mid md:text-[2rem] md:leading-[1.1]">
												{step.title}
											</h3>
											<p className="mt-2 max-w-2xl text-sm leading-relaxed text-minuri-slate/95 md:text-base">
												{step.line}
											</p>
										</div>
									</motion.li>
								))}
							</ol>
						</div>
					</div>
				</section>

				<section
					id="care"
					className="flex min-h-[88dvh] flex-col justify-center bg-minuri-ocean py-20 text-minuri-ice md:py-28"
				>
					<div className="mx-auto w-full max-w-6xl px-5 md:px-8">
						<div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:items-start">
							<div>
								<FadeUp>
									<p className="text-xs font-medium tracking-[0.22em] text-minuri-pale">
										Near Me
									</p>
								</FadeUp>
								<FadeUp delay={0.06}>
									<h2 className="mt-4 text-3xl font-semibold tracking-tight text-minuri-white md:text-4xl">
										Find nearby support and essentials when
										you need them.
									</h2>
								</FadeUp>
								<FadeUp delay={0.12}>
									<p className="mt-6 max-w-xl text-base leading-relaxed text-minuri-ice/95">
										From GP clinics to everyday services,
										Near Me helps new Melburnians navigate a
										suburb with less stress and clearer next
										steps.
									</p>
								</FadeUp>
							</div>
							<motion.aside
								className="rounded-minuri border border-minuri-mid bg-minuri-mid/25 p-6 md:p-8"
								initial={{ opacity: 0, y: 28, rotate: -0.5 }}
								whileInView={{ opacity: 1, y: 0, rotate: 0 }}
								whileHover={{ scale: 1.01 }}
								viewport={{ once: true, margin: "-10%" }}
								transition={{
									type: "spring",
									stiffness: 260,
									damping: 22,
								}}
							>
								<p className="inline-block rounded-minuri bg-minuri-coral px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-minuri-white">
									Designed for day one
								</p>
								<p className="mt-5 text-sm leading-relaxed text-minuri-mist/95 md:text-base">
									Built around common first-month questions:
									where to get help, what to do first, and how
									to settle into independent life.
								</p>
								<div className="mt-8 space-y-3 border-t border-minuri-mid pt-6 text-xs text-minuri-pale">
									<p className="font-medium text-minuri-ice">
										Core paths
									</p>
									<p>
										Browse First Time Guides · Find Services
										Near Me · Mobile-first navigation
									</p>
								</div>
							</motion.aside>
						</div>
					</div>
				</section>

				<section
					id="proof"
					className="flex min-h-[88dvh] flex-col justify-center py-20 md:py-24"
				>
					<div className="mx-auto w-full max-w-6xl px-5 md:px-8">
						<FadeUp>
							<p className="text-xs font-medium tracking-[0.22em] text-minuri-teal">
								Open data &amp; place
							</p>
						</FadeUp>
						<FadeUp delay={0.06}>
							<h2 className="mt-4 max-w-2xl text-2xl font-semibold tracking-tight md:text-3xl">
								Local relevance from Census-informed signals —
								starting with suburbs like Clayton and
								Parkville.
							</h2>
						</FadeUp>
						<div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
							{[
								{
									title: "ABS & AIHW",
									body: "Demographics and youth health context shape what we surface — not generic articles alone.",
									tint: "bg-minuri-white",
								},
								{
									title: "Prevention-first",
									body: "Routines before crisis. Lower friction to help-seeking than waiting for an emergency.",
									tint: "bg-minuri-mist/50",
								},
								{
									title: "Safe by default",
									body: "JWT auth, encryption at rest, and Care Circle boundaries per the security plan — coral stays semantic.",
									tint: "bg-minuri-white sm:col-span-2 lg:col-span-1",
								},
							].map((card, i) => (
								<motion.div
									key={card.title}
									className={`rounded-minuri border border-minuri-silver/90 p-6 ${card.tint}`}
									initial={{ opacity: 0, y: 24 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true, margin: "-6%" }}
									whileHover={{ y: -3 }}
									transition={{
										duration: 0.5,
										delay: i * 0.07,
										ease: easeOut,
									}}
								>
									<h3 className="font-semibold text-minuri-mid">
										{card.title}
									</h3>
									<p className="mt-2 text-sm leading-relaxed text-minuri-slate">
										{card.body}
									</p>
								</motion.div>
							))}
						</div>
					</div>
				</section>

				<section
					id="access"
					className="flex min-h-[70dvh] flex-col justify-center bg-minuri-white py-20 md:py-24"
				>
					<div className="mx-auto w-full max-w-4xl px-5 text-center md:px-8">
						<FadeUp>
							<p className="text-xs font-medium tracking-[0.22em] text-minuri-teal">
								Early access
							</p>
						</FadeUp>
						<FadeUp delay={0.06}>
							<h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
								Be first when Melbourne onboarding opens.
							</h2>
						</FadeUp>
						<FadeUp delay={0.12}>
							<p className="mt-4 text-sm leading-relaxed text-minuri-slate md:text-base">
								Leave your email for launch updates. No spam —
								just the product when it&apos;s ready.
							</p>
						</FadeUp>
						<FadeUp
							delay={0.18}
							className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row sm:items-stretch"
						>
							<label htmlFor="email-landing" className="sr-only">
								Email
							</label>
							<input
								id="email-landing"
								type="email"
								name="email"
								placeholder="you@example.com"
								autoComplete="email"
								className="min-h-11 flex-1 rounded-minuri border border-minuri-silver bg-minuri-fog/40 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-minuri-teal focus:outline-none"
							/>
							<motion.button
								type="button"
								className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-minuri bg-minuri-teal px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-minuri-seafoam"
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.97 }}
							>
								Notify me
								<ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
							</motion.button>
						</FadeUp>
					</div>
				</section>
			</main>

			<footer className="relative z-10 min-h-[50vh] bg-minuri-mist text-minuri-ocean">
				<LandingFooterCurve />
				<div className="relative z-20 mx-auto max-w-6xl px-5 pb-16 pt-14 md:px-8 md:pb-20 md:pt-16">
					<div className="flex flex-col items-start gap-5">
						<Link
							href="#access"
							className="group max-w-4xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-minuri-teal focus-visible:ring-offset-2 focus-visible:ring-offset-minuri-mist"
						>
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.5, ease: easeOut }}
							>
								<h2 className="minuri-link-underline w-fit pb-1 font-hero-serif text-[clamp(2.4rem,7vw,5.2rem)] font-medium leading-[1.03] tracking-tight text-minuri-ocean">
									Let&apos;s work together{" "}
									<span
										className="inline-block transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
										aria-hidden
									>
										↗
									</span>
								</h2>
								<p className="mt-3 text-sm text-minuri-slate md:text-base">
									Tell us about your project and we will get
									back to you.
								</p>
							</motion.div>
						</Link>
					</div>
				</div>

				<div className="relative z-20 border-t border-minuri-silver/90">
					<div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-8 text-xs text-minuri-slate md:flex-row md:items-center md:justify-between md:px-8 md:py-9 md:text-sm">
						<p>
							© {new Date().getFullYear()} Minuri · Melbourne,
							Australia
						</p>
						<div className="flex items-center gap-5">
							<Link
								href="mailto:hello@minuri.app"
								className="minuri-link-underline transition-colors hover:text-minuri-teal"
							>
								Email
							</Link>
							<Link
								href="#"
								className="minuri-link-underline transition-colors hover:text-minuri-teal"
							>
								LinkedIn
							</Link>
							<Link
								href="#"
								className="minuri-link-underline transition-colors hover:text-minuri-teal"
							>
								Instagram
							</Link>
							<Link
								href="#access"
								className="minuri-link-underline transition-colors hover:text-minuri-teal"
							>
								Contact
							</Link>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
}
