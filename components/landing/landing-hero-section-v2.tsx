"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, CornerDownRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useRive, Layout, Fit } from "@rive-app/react-canvas";

import { LandingHeader } from "@/components/landing/landing-header";

const HERO_TOPIC_CARDS: {
	title: string;
	desc: string;
	bg: string;
	floatPhase: number;
	word: string;
}[] = [
	{
		title: "Food & Eating",
		desc: "Eat well on any budget",
		bg: "#00f5c8",
		floatPhase: 0,
		word: "eat",
	},
	{
		title: "Getting Around",
		desc: "Navigate with confidence",
		bg: "#5dd6ff",
		floatPhase: 1.1,
		word: "travel",
	},
	{
		title: "Health & Wellbeing",
		desc: "Stay healthy and supported",
		bg: "#fcf300",
		floatPhase: 0.5,
		word: "thrive",
	},
	{
		title: "Home & Admin",
		desc: "Handle rent, bills & utilities",
		bg: "#ffc2d1",
		floatPhase: 0.8,
		word: "settle",
	},
	{
		title: "Social & Belonging",
		desc: "Build connection & community",
		bg: "#cae9ff",
		floatPhase: 1.4,
		word: "belong",
	},
];

const STICKY_ROTATE = [-1.5, 0.8, -0.6, 1.2];

function CatRive() {
	const { rive, RiveComponent } = useRive({
		src: "/cat-follow-cursor.riv",
		artboard: "Artboard 2",
		stateMachines: "State Machine 1",
		layout: new Layout({ fit: Fit.Contain }),
		autoplay: true,
		autoBind: true,
	});

	useEffect(() => {
		if (!rive) return;

		// Patch canvas 2D context to skip artboard background fill.
		// Rive render order per frame: clearRect → fillRect (bg) → draw cat.
		// We intercept: after clearRect, drop the next fillRect call.
		const canvas = (
			rive as unknown as { canvas: HTMLCanvasElement | undefined }
		).canvas;
		let restoreCtx: (() => void) | undefined;
		if (canvas) {
			const ctx = canvas.getContext("2d");
			if (ctx) {
				const originalClearRect = ctx.clearRect.bind(ctx);
				const originalFillRect = ctx.fillRect.bind(ctx);
				let justCleared = false;
				ctx.clearRect = (...args: Parameters<typeof ctx.clearRect>) => {
					justCleared = true;
					return originalClearRect(...args);
				};
				ctx.fillRect = (...args: Parameters<typeof ctx.fillRect>) => {
					if (justCleared) {
						justCleared = false;
						return;
					}
					return originalFillRect(...args);
				};
				restoreCtx = () => {
					ctx.clearRect = originalClearRect;
					ctx.fillRect = originalFillRect;
				};
			}
		}

		const vmi = rive.viewModelInstance;
		if (vmi) {
			const xProp = vmi.number("xPos");
			const yProp = vmi.number("yPos");
			if (xProp) xProp.value = 50;
			if (yProp) yProp.value = 50;

			const handleMouseMove = (e: MouseEvent) => {
				if (xProp) xProp.value = (e.clientX / window.innerWidth) * 100;
				if (yProp) yProp.value = (e.clientY / window.innerHeight) * 100;
			};
			const handleMouseLeave = () => {
				if (xProp) xProp.value = 50;
				if (yProp) yProp.value = 50;
			};
			const handleCatLook = (e: Event) => {
				const { x, y } = (e as CustomEvent<{ x: number; y: number }>).detail;
				if (xProp) xProp.value = x;
				if (yProp) yProp.value = y;
			};
			window.addEventListener("mousemove", handleMouseMove);
			document.addEventListener("mouseleave", handleMouseLeave);
			window.addEventListener("minuri:cat-look", handleCatLook);

			return () => {
				restoreCtx?.();
				window.removeEventListener("mousemove", handleMouseMove);
				document.removeEventListener("mouseleave", handleMouseLeave);
				window.removeEventListener("minuri:cat-look", handleCatLook);
			};
		}

		return () => restoreCtx?.();
	}, [rive]);

	return <RiveComponent style={{ width: "100%", height: "100%" }} />;
}

function HeroTopicCard({
	card,
	index,
	isActive,
	onHover,
	onRef,
	entranceEase,
	className = "",
}: {
	card: (typeof HERO_TOPIC_CARDS)[0];
	index: number;
	isActive: boolean;
	onHover: () => void;
	onRef?: (el: HTMLDivElement | null) => void;
	entranceEase: [number, number, number, number];
	className?: string;
}) {
	return (
		<motion.div
			ref={onRef}
			className={`aspect-[5/4] ${className}`}
			initial={{ opacity: 0, y: -800 }}
			animate={{ opacity: 1, y: 0, scale: isActive ? 1.05 : 1 }}
			transition={{
				opacity: {
					duration: 0.35,
					delay: 0.5 + index * 0.12,
					ease: "easeOut",
				},
				y: {
					type: "spring",
					stiffness: 120,
					damping: 18,
					delay: 0.5 + index * 0.15,
				},
				scale: { duration: 0.2, ease: "easeOut" },
			}}
			onHoverStart={onHover}
		>
			<motion.div
				style={{
					rotate: STICKY_ROTATE[index % 4],
					backgroundColor: card.bg,
				}}
				className="guide-sticky flex h-full flex-col"
				animate={{ y: [0, -7, 0] }}
				transition={{
					duration: 3.2 + card.floatPhase * 0.28,
					ease: "easeInOut",
					repeat: Infinity,
					delay: card.floatPhase,
				}}
			>
				<p className="text-xs font-black uppercase tracking-[0.18em] text-[#05292a]">
					{card.title}
				</p>

				<div className="flex flex-1 items-center py-1">
					<span
						className="font-hero-serif italic leading-none transition-opacity duration-300 text-5xl md:text-5xl min-[1500px]:text-6xl"
						style={{
							color: "#05292a",
							opacity: isActive ? 1 : 0.18,
							fontVariationSettings: "'opsz' 144",
						}}
					>
						{card.word}
					</span>
				</div>

				<p className="text-[0.8rem] leading-snug text-[#163a3a]">
					{card.desc}
				</p>
			</motion.div>
		</motion.div>
	);
}

export function LandingHeroSectionV2({
	onHeroReveal,
	headerVisible = true,
}: {
	onHeroReveal?: () => void;
	headerVisible?: boolean;
}) {
	const [activeIndex, setActiveIndex] = useState(0);
	const [hasStartedWordCycle, setHasStartedWordCycle] = useState(false);
	const [hasActiveJourney, setHasActiveJourney] = useState(false);

	useEffect(() => {
		try {
			setHasActiveJourney(!!localStorage.getItem("minuri:journey:v2"));
		} catch {
			/* ignore */
		}
	}, []);
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const cardRefs = useRef<(HTMLDivElement | null)[]>([null, null, null, null, null]);
	const lastMouseMoveRef = useRef(0);
	const router = useRouter();
	const entranceEase: [number, number, number, number] = [0.22, 1, 0.36, 1];
	const headlineWord = hasStartedWordCycle
		? HERO_TOPIC_CARDS[activeIndex].word
		: "are";
	const headlineWordColor = hasStartedWordCycle
		? HERO_TOPIC_CARDS[activeIndex].bg
		: "#0f766e";

	const restartCycle = () => {
		if (intervalRef.current) clearInterval(intervalRef.current);
		intervalRef.current = setInterval(() => {
			setHasStartedWordCycle(true);
			setActiveIndex((i) => (i + 1) % HERO_TOPIC_CARDS.length);
		}, 2500);
	};

	useEffect(() => {
		onHeroReveal?.();
	}, [onHeroReveal]);

	useEffect(() => {
		const onMove = () => { lastMouseMoveRef.current = Date.now(); };
		window.addEventListener("mousemove", onMove);
		return () => window.removeEventListener("mousemove", onMove);
	}, []);

	useEffect(() => {
		if (!hasStartedWordCycle) return;
		const isIdle = Date.now() - lastMouseMoveRef.current > 1000;
		if (!isIdle) return;
		const el = cardRefs.current[activeIndex];
		if (!el) return;
		const rect = el.getBoundingClientRect();
		const cx = rect.left + rect.width / 2;
		const cy = rect.top + rect.height / 2;
		window.dispatchEvent(
			new CustomEvent("minuri:cat-look", {
				detail: {
					x: (cx / window.innerWidth) * 100,
					y: (cy / window.innerHeight) * 100,
				},
			})
		);
	}, [activeIndex, hasStartedWordCycle]);

	useEffect(() => {
		restartCycle();
		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<section className="relative flex min-h-[600px] flex-col bg-minuri-white text-minuri-ink md:h-svh md:max-h-[1100px] md:overflow-hidden">
			{/* Grid background — lines + radial fade to white at edges */}
			<div aria-hidden className="pointer-events-none absolute inset-0">
				<div
					className="absolute inset-0"
					style={{
						backgroundImage: [
							"linear-gradient(to right, rgba(2,24,25,0.07) 1px, transparent 1px)",
							"linear-gradient(to bottom, rgba(2,24,25,0.07) 1px, transparent 1px)",
						].join(", "),
						backgroundSize: "96px 96px",
					}}
				/>
				{/* Fade grid to white at all four edges */}
				<div
					className="absolute inset-0"
					style={{
						background:
							"radial-gradient(ellipse 75% 70% at 50% 42%, transparent 25%, rgba(255,255,255,0.6) 55%, white 78%)",
					}}
				/>
			</div>

			<div className="relative flex flex-1 flex-col mx-auto w-full max-w-screen px-4 pt-4 sm:px-6 md:px-6 md:pt-0 md:pb-10 min-[1500px]:max-w-[1600px] min-[1500px]:pb-12">
				<LandingHeader
					headerVisible={headerVisible}
					onHeroReveal={onHeroReveal}
				/>

				<motion.div
					className="grid flex-1 grid-cols-1 md:grid-cols-[2fr_2fr] gap-6 pb-12 pt-8 sm:pb-14 sm:pt-10 md:gap-10 md:pb-0 md:pt-4 min-[1500px]:gap-16"
					initial="hidden"
					animate="visible"
					variants={{
						hidden: {},
						visible: {
							transition: {
								staggerChildren: 0.1,
								delayChildren: 0.08,
							},
						},
					}}
				>
					{/* LEFT: headline + subheading + CTAs — justify-between pins CTAs to bottom */}
					<div className="flex flex-col justify-between pb-10 min-[1500px]:pb-12">
						<div className="w-full">
							<motion.span
								className="inline-flex rounded-sm bg-[#e2ffef] p-2 text-sm font-black uppercase text-minuri-ocean min-[1500px]:p-3 min-[1500px]:text-base"
								variants={{
									hidden: { opacity: 0, y: 8 },
									visible: {
										opacity: 1,
										y: 0,
										transition: {
											duration: 0.45,
											ease: entranceEase,
										},
									},
								}}
							>
								Living independently
							</motion.span>
							<motion.h1
								className="mt-5 w-full text-4xl font-black uppercase leading-snug tracking-tight text-minuri-teal md:text-[clamp(4.5rem,5.5vw,5.75rem)] md:leading-none min-[1500px]:mt-4"
								variants={{
									hidden: { opacity: 0, y: 22 },
									visible: {
										opacity: 1,
										y: 0,
										transition: {
											duration: 0.7,
											ease: entranceEase,
										},
									},
								}}
							>
								Feeling at home, wherever
								{" you "} <br />
								<AnimatePresence mode="wait">
									<motion.span
										key={headlineWord}
										initial={{ opacity: 0, y: 0 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -10 }}
										transition={{
											duration: 0.28,
											ease: entranceEase,
										}}
										style={{ color: headlineWordColor }}
										className="inline-block"
									>
										{headlineWord}
									</motion.span>
								</AnimatePresence>
							</motion.h1>
						</div>

						<motion.div
							className="space-y-0"
							variants={{
								hidden: { opacity: 0, y: 14 },
								visible: {
									opacity: 1,
									y: 0,
									transition: {
										duration: 0.55,
										ease: entranceEase,
									},
								},
							}}
						>
							<motion.p
								className="max-w-md pb-6 text-2xl font-medium leading-tight text-minuri-ocean lg:text-xl xl:text-xl min-[1500px]:max-w-2xl min-[1500px]:text-2xl"
								variants={{
									hidden: { opacity: 0, y: 14 },
									visible: {
										opacity: 1,
										y: 0,
										transition: {
											duration: 0.5,
											ease: entranceEase,
										},
									},
								}}
							>
								Your everyday support system to start living
								independently
							</motion.p>

							<motion.div
								className="relative flex items-center gap-5 pt-2"
								variants={{
									hidden: { opacity: 0, y: 10 },
									visible: {
										opacity: 1,
										y: 0,
										transition: {
											duration: 0.5,
											ease: entranceEase,
											delay: 0.12,
										},
									},
								}}
							>
								<div className="group relative mb-3 mr-3">
									<div className="absolute inset-0 translate-x-[12px] translate-y-[12px] rounded-xl bg-minuri-ocean/18" />
									<div className="absolute inset-0 translate-x-[6px] translate-y-[6px] rounded-xl transition-transform duration-200 ease-out group-hover:translate-x-[10px] group-hover:translate-y-[10px] bg-minuri-ocean/38" />
									<button
										onClick={() => router.push("/start")}
										className="relative z-10 inline-flex h-12 cursor-pointer items-center rounded-xl bg-minuri-ocean px-7 text-sm font-black uppercase tracking-widest text-white transition-transform duration-200 ease-out group-hover:translate-x-[9px] group-hover:translate-y-[9px] lg:h-14 lg:px-9 lg:text-base min-[1500px]:h-16 min-[1500px]:px-11 min-[1500px]:text-lg"
									>
										{hasActiveJourney
											? "Start new journey"
											: "Let’s get started"}
									</button>
								</div>
								<div className="group relative mb-3 mr-3">
									<div className="absolute inset-0 translate-x-[12px] translate-y-[12px] rounded-xl bg-minuri-ocean/18" />
									<div className="absolute inset-0 translate-x-[6px] translate-y-[6px] rounded-xl transition-transform duration-200 ease-out group-hover:translate-x-[10px] group-hover:translate-y-[10px] bg-minuri-ocean/38" />
									<Link
										href="/about"
										className="relative z-10 inline-flex h-12 cursor-pointer items-center rounded-xl border border-minuri-ocean/30 bg-minuri-white px-7 text-sm font-black uppercase tracking-widest text-minuri-ocean transition-transform duration-200 ease-out group-hover:translate-x-[9px] group-hover:translate-y-[9px] lg:h-14 lg:px-9 lg:text-base min-[1500px]:h-16 min-[1500px]:px-11 min-[1500px]:text-lg"
									>
										About us
									</Link>
								</div>
								<div className="absolute top-full left-0 hidden md:flex items-center gap-1.5 pt-2 text-minuri-ocean/50">
									<CornerDownRight
										className="size-4"
										strokeWidth={2}
									/>
									<span className="text-xs font-semibold uppercase tracking-widest">
										or scroll to explore first
									</span>
								</div>
							</motion.div>
						</motion.div>
					</div>

					{/* RIGHT: 3-column staggered card layout */}
					<div className="relative z-10 flex h-full pb-4 min-[1500px]:pb-0">
						<div className="flex w-full h-full gap-4 md:gap-5">
							{/* Col 1 — cards at top */}
							<div className="flex h-full flex-1 flex-col justify-start gap-4 md:gap-5">
								<motion.div
									className="aspect-[5/4]"
									initial={{ opacity: 0, y: -800 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{
										opacity: {
											duration: 0.35,
											delay: 0.5 + 5 * 0.12,
											ease: "easeOut",
										},
										y: {
											type: "spring",
											stiffness: 120,
											damping: 18,
											delay: 0.5 + 5 * 0.15,
										},
									}}
								>
									<motion.div
										style={{ rotate: STICKY_ROTATE[5 % 4] }}
										className="relative h-full"
										animate={{ y: [0, -7, 0] }}
										transition={{
											duration: 3.2 + 0.3 * 0.28,
											ease: "easeInOut",
											repeat: Infinity,
											delay: 0.3,
										}}
									>
										<div
											className="absolute left-1/2 z-10 rounded-[1px]"
											style={{
												top: -10,
												width: 44,
												height: 18,
												transform:
													"translateX(-50%) rotate(-1.5deg)",
												background:
													"rgba(253, 230, 138, 0.72)",
												boxShadow:
													"0 1px 3px rgba(0,0,0,0.1)",
											}}
										/>
										<div className="relative h-full overflow-hidden rounded-[2px]">
											<CatRive />
										</div>
									</motion.div>
								</motion.div>
								<HeroTopicCard
									key={HERO_TOPIC_CARDS[2].title}
									card={HERO_TOPIC_CARDS[2]}
									index={2}
									isActive={activeIndex === 2}
									onHover={() => {
										setHasStartedWordCycle(true);
										setActiveIndex(2);
										restartCycle();
									}}
									onRef={(el) => { cardRefs.current[2] = el; }}
									entranceEase={entranceEase}
									className=""
								/>
							</div>

							{/* Col 2 — cards centered */}
							<div className="flex h-full flex-1 flex-col justify-center gap-4 md:gap-5">
								<HeroTopicCard
									key={HERO_TOPIC_CARDS[0].title}
									card={HERO_TOPIC_CARDS[0]}
									index={0}
									isActive={activeIndex === 0}
									onHover={() => {
										setHasStartedWordCycle(true);
										setActiveIndex(0);
										restartCycle();
									}}
									onRef={(el) => { cardRefs.current[0] = el; }}
									entranceEase={entranceEase}
									className=""
								/>
								<HeroTopicCard
									key={HERO_TOPIC_CARDS[3].title}
									card={HERO_TOPIC_CARDS[3]}
									index={3}
									isActive={activeIndex === 3}
									onHover={() => {
										setHasStartedWordCycle(true);
										setActiveIndex(3);
										restartCycle();
									}}
									onRef={(el) => { cardRefs.current[3] = el; }}
									entranceEase={entranceEase}
									className=""
								/>
							</div>

							{/* Col 3 — cards at bottom */}
							<div className="flex h-full flex-1 flex-col justify-end gap-4 md:gap-5">
								<HeroTopicCard
									key={HERO_TOPIC_CARDS[1].title}
									card={HERO_TOPIC_CARDS[1]}
									index={1}
									isActive={activeIndex === 1}
									onHover={() => {
										setHasStartedWordCycle(true);
										setActiveIndex(1);
										restartCycle();
									}}
									onRef={(el) => { cardRefs.current[1] = el; }}
									entranceEase={entranceEase}
									className=""
								/>
								<HeroTopicCard
									key={HERO_TOPIC_CARDS[4].title}
									card={HERO_TOPIC_CARDS[4]}
									index={4}
									isActive={activeIndex === 4}
									onHover={() => {
										setHasStartedWordCycle(true);
										setActiveIndex(4);
										restartCycle();
									}}
									onRef={(el) => { cardRefs.current[4] = el; }}
									entranceEase={entranceEase}
									className=""
								/>
							</div>
						</div>
					</div>
				</motion.div>
			</div>

			{/* Scroll indicator — center bottom */}
			<motion.button
				type="button"
				aria-label="Scroll to next section"
				onClick={() =>
					document
						.getElementById("services")
						?.scrollIntoView({ behavior: "smooth" })
				}
				className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 cursor-pointer flex-col items-center gap-1.5 md:flex"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 1.2, duration: 0.6 }}
				whileHover={{ opacity: 0.7 }}
			>
				<span className="text-xs font-semibold uppercase tracking-[0.2em] text-minuri-ocean">
					Scroll to explore
				</span>
				<motion.div
					animate={{ y: [0, 5, 0] }}
					transition={{
						duration: 1.6,
						repeat: Infinity,
						ease: "easeInOut",
					}}
				>
					<ChevronDown
						className="size-5 text-minuri-ocean"
						strokeWidth={1.5}
					/>
				</motion.div>
			</motion.button>
		</section>
	);
}
