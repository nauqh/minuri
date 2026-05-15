"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CornerDownRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useLenis } from "lenis/react";

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
		word: "heal",
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

function HeroTopicCard({
	card,
	index,
	isActive,
	onHover,
	entranceEase,
	className = "",
}: {
	card: (typeof HERO_TOPIC_CARDS)[0];
	index: number;
	isActive: boolean;
	onHover: () => void;
	entranceEase: [number, number, number, number];
	className?: string;
}) {
	return (
		<motion.div
			className={className}
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
	const [showConfirm, setShowConfirm] = useState(false);
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const lenis = useLenis();
	const router = useRouter();

	const handleStartClick = () => {
		if (showConfirm) {
			router.push("/start");
			return;
		}
		setShowConfirm(true);
	};
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
		restartCycle();
		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<section className="relative flex h-auto min-h-svh flex-col bg-minuri-white text-minuri-ink md:h-svh md:overflow-hidden">
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

			<div className="relative flex flex-1 flex-col mx-auto w-full max-w-screen px-4 pt-4 sm:px-6 md:px-6 md:pt-0 md:pb-40 min-[1500px]:max-w-[1600px] min-[1500px]:pb-48">
				<LandingHeader
					headerVisible={headerVisible}
					onHeroReveal={onHeroReveal}
				/>

				<motion.div
					className="flex flex-1 flex-col pb-12 pt-8 sm:pb-14 sm:pt-10 md:pb-0 md:pt-4"
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
					<div className="w-full">
						<motion.span
							className="inline-flex rounded-sm bg-[#e2ffef] p-2 text-sm font-black uppercase text-minuri-ocean min-[1500px]:p-3 min-[1500px]:text-base"
							variants={{
								hidden: {
									opacity: 0,
									y: 8,
								},
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
							className="mt-5 w-full text-4xl font-black uppercase leading-snug tracking-tight text-minuri-teal md:text-7xl md:leading-none min-[1500px]:mt-4 min-[1500px]:text-8xl"
							variants={{
								hidden: {
									opacity: 0,
									y: 22,
								},
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
									initial={{
										opacity: 0,
										y: 0,
									}}
									animate={{ opacity: 1, y: 0 }}
									exit={{
										opacity: 0,
										y: -10,
									}}
									transition={{
										duration: 0.28,
										ease: entranceEase,
									}}
									style={{
										color: headlineWordColor,
									}}
									className="inline-block"
								>
									{headlineWord}
								</motion.span>
							</AnimatePresence>
						</motion.h1>
					</div>

					<div className="mt-0 grid flex-1 gap-10 md:grid-cols-[1.2fr_0.8fr] md:items-start md:gap-10">
						<div className="flex flex-col md:h-[350px] min-[1500px]:h-[380px]">
							<motion.div
								className="mt-auto space-y-6 pt-10 md:space-y-0 md:pt-0"
								variants={{
									hidden: {
										opacity: 0,
										y: 14,
									},
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
								<p className="max-w-xl text-sm leading-[1.6] text-minuri-ocean font-medium md:hidden">
									Get instructive guides, find nearby
									services, and follow clear next steps for
									day-to-day independent life.
								</p>
								{/* Mobile CTAs only */}
								<motion.div
									className="flex flex-row items-center gap-5 pt-2 md:hidden"
									variants={{
										hidden: { opacity: 0, y: 10 },
										visible: {
											opacity: 1,
											y: 0,
											transition: {
												duration: 0.45,
												ease: entranceEase,
												delay: 0.05,
											},
										},
									}}
								>
									{/* Primary: Let's get started */}
									<div className="group relative mb-2 mr-2">
										<div className="absolute inset-0 translate-x-[8px] translate-y-[8px] rounded-xl border border-minuri-ocean/15 bg-minuri-fog" />
										<div
											className="absolute inset-0 translate-x-[4px] translate-y-[4px] rounded-xl transition-transform duration-200 ease-out group-hover:translate-x-[7px] group-hover:translate-y-[7px]"
											style={{
												backgroundColor:
													"oklch(0.38 0.07 228)",
											}}
										/>
										<button
											onClick={handleStartClick}
											className="relative z-10 inline-flex h-12 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl bg-minuri-ocean px-7 text-sm font-black uppercase tracking-widest text-white transition-transform duration-200 ease-out group-hover:translate-x-[6px] group-hover:translate-y-[6px]"
										>
											<AnimatePresence
												mode="wait"
												initial={false}
											>
												<motion.span
													key={
														showConfirm
															? "confirm"
															: "start"
													}
													initial={{
														opacity: 0,
														filter: "blur(10px)",
														scale: 0.82,
													}}
													animate={{
														opacity: 1,
														filter: "blur(0px)",
														scale: 1,
													}}
													exit={{
														opacity: 0,
														filter: "blur(10px)",
														scale: 1.18,
													}}
													transition={{
														duration: 0.38,
														ease: [
															0.22, 1, 0.36, 1,
														],
													}}
												>
													{showConfirm
														? "Are you sure?"
														: "Let’s get started"}
												</motion.span>
											</AnimatePresence>
										</button>
									</div>

									{/* Secondary: About us */}
									<div className="group relative mb-2 mr-2">
										<div className="absolute inset-0 translate-x-[8px] translate-y-[8px] rounded-xl bg-minuri-ocean/10" />
										<div className="absolute inset-0 translate-x-[4px] translate-y-[4px] rounded-xl transition-transform duration-200 ease-out group-hover:translate-x-[7px] group-hover:translate-y-[7px] bg-minuri-ocean/25" />
										<Link
											href="/about"
											className="relative z-10 inline-flex h-12 cursor-pointer items-center justify-center rounded-xl border border-minuri-ocean/30 bg-minuri-white px-7 text-sm font-black uppercase tracking-widest text-minuri-ocean transition-transform duration-200 ease-out group-hover:translate-x-[6px] group-hover:translate-y-[6px]"
										>
											About us
										</Link>
									</div>
								</motion.div>

								{/* Desktop subheading */}
								<motion.p
									className="hidden max-w-sm text-2xl font-medium leading-snug text-minuri-ocean md:block md:leading-tight md:pb-6 min-[1500px]:max-w-md min-[1500px]:text-4xl"
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

								{/* Desktop CTAs — 3-layer press */}
								<motion.div
									className="relative hidden md:flex items-center gap-5 pt-2"
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
									{/* Primary: Let's get started */}
									<div className="group relative mb-2 mr-2">
										<div className="absolute inset-0 translate-x-[8px] translate-y-[8px] rounded-xl border border-minuri-ocean/15 bg-minuri-fog" />
										<div
											className="absolute inset-0 translate-x-[4px] translate-y-[4px] rounded-xl transition-transform duration-200 ease-out group-hover:translate-x-[7px] group-hover:translate-y-[7px]"
											style={{
												backgroundColor:
													"oklch(0.38 0.07 228)",
											}}
										/>
										<button
											onClick={handleStartClick}
											className="relative z-10 inline-flex h-12 cursor-pointer items-center gap-2 overflow-hidden rounded-xl bg-minuri-ocean px-7 text-sm font-black uppercase tracking-widest text-white transition-transform duration-200 ease-out group-hover:translate-x-[6px] group-hover:translate-y-[6px]"
										>
											<AnimatePresence
												mode="wait"
												initial={false}
											>
												<motion.span
													key={
														showConfirm
															? "confirm"
															: "start"
													}
													initial={{
														opacity: 0,
														filter: "blur(10px)",
														scale: 0.82,
													}}
													animate={{
														opacity: 1,
														filter: "blur(0px)",
														scale: 1,
													}}
													exit={{
														opacity: 0,
														filter: "blur(10px)",
														scale: 1.18,
													}}
													transition={{
														duration: 0.38,
														ease: [
															0.22, 1, 0.36, 1,
														],
													}}
												>
													{showConfirm
														? "Are you sure?"
														: "Let’s get started"}
												</motion.span>
											</AnimatePresence>
										</button>
									</div>

									{/* Secondary: About us */}
									<div className="group relative mb-2 mr-2">
										<div className="absolute inset-0 translate-x-[8px] translate-y-[8px] rounded-xl bg-minuri-ocean/10" />
										<div className="absolute inset-0 translate-x-[4px] translate-y-[4px] rounded-xl transition-transform duration-200 ease-out group-hover:translate-x-[7px] group-hover:translate-y-[7px] bg-minuri-ocean/25" />
										<Link
											href="/about"
											className="relative z-10 inline-flex h-12 cursor-pointer items-center rounded-xl border border-minuri-ocean/30 bg-minuri-white px-7 text-sm font-black uppercase tracking-widest text-minuri-ocean transition-transform duration-200 ease-out group-hover:translate-x-[6px] group-hover:translate-y-[6px]"
										>
											About us
										</Link>
									</div>

									<AnimatePresence>
										{showConfirm && (
											<motion.div
												className="hidden md:flex absolute top-full left-0 items-center gap-1.5 pt-2 text-minuri-ocean/50"
												initial={{ opacity: 0, y: -6 }}
												animate={{ opacity: 1, y: 0 }}
												exit={{ opacity: 0, y: -4 }}
												transition={{
													duration: 0.22,
													ease: "easeOut",
												}}
											>
												<CornerDownRight
													className="size-4"
													strokeWidth={2}
												/>
												<span className="text-xs font-semibold uppercase tracking-widest">
													or scroll to explore first
												</span>
											</motion.div>
										)}
									</AnimatePresence>
								</motion.div>
							</motion.div>
						</div>

						<div className="relative z-10 flex w-full flex-col md:ml-auto md:pb-4 md:max-w-[460px] min-[1500px]:max-w-[600px]">
							<div
								className="relative grid grid-cols-2 gap-4 md:gap-5 h-[350px] min-[1500px]:h-[380px]"
								style={{ gridAutoRows: "1fr" }}
							>
								{HERO_TOPIC_CARDS.slice(0, 4).map((card, i) => (
									<HeroTopicCard
										key={card.title}
										card={card}
										index={i}
										isActive={activeIndex === i}
										onHover={() => {
											setHasStartedWordCycle(true);
											setActiveIndex(i);
											restartCycle();
										}}
										entranceEase={entranceEase}
										className=""
									/>
								))}
								{/* Card 5: sits at row-2 level, extends left into text column */}
								<HeroTopicCard
									card={HERO_TOPIC_CARDS[4]}
									index={4}
									isActive={activeIndex === 4}
									onHover={() => {
										setHasStartedWordCycle(true);
										setActiveIndex(4);
										restartCycle();
									}}
									entranceEase={entranceEase}
									className="hidden md:block md:absolute right-[calc(100%+20px)] top-[calc(50%+5px)] h-[calc(50%-5px)] w-[calc(50%-5px)]"
								/>
							</div>
						</div>
					</div>
				</motion.div>
			</div>

			{/* Desktop bottom bar — absolute on section, content-div pb reserves the space */}
			<motion.div
				className="absolute bottom-0 left-0 right-0 hidden md:flex pb-8"
				initial={{ opacity: 0, y: -8 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 1.2, duration: 0.6, ease: "easeOut" }}
			>
				{/* Same max-width constraint as the content div above */}
				<div className="relative mx-auto flex w-full max-w-screen items-end px-6 md:px-6 min-[1500px]:max-w-[1600px] min-[1500px]:px-8">
					{/* Scroll indicator — centered within the constrained container */}
					<motion.div
						className="absolute bottom-0 left-1/2 -translate-x-1/2 flex cursor-pointer flex-col items-center gap-2"
						onClick={() =>
							lenis?.scrollTo(
								window.scrollY + window.innerHeight,
								{
									duration: 1.2,
									easing: (t) => 1 - Math.pow(1 - t, 4),
								},
							)
						}
						animate={
							showConfirm
								? { scale: [1, 1.13, 0.97, 1.1, 1] }
								: { scale: 1 }
						}
						transition={{
							duration: 2.5,
							ease: "easeInOut",
							times: [0, 0.25, 0.5, 0.75, 1],
						}}
						aria-label="Scroll down"
					>
						<span className="text-xs font-semibold uppercase tracking-widest text-minuri-ocean/60">
							Scroll to explore
						</span>
						<div className="relative flex h-10 w-6 items-start justify-center rounded-full border-2 border-minuri-ocean/40 pt-1.5">
							<motion.div
								className="h-1.5 w-1 rounded-full bg-minuri-teal"
								animate={{ y: [0, 14, 0], opacity: [1, 0, 1] }}
								transition={{
									duration: 1.5,
									repeat: Infinity,
									ease: "easeInOut",
								}}
							/>
						</div>
					</motion.div>
				</div>
			</motion.div>
		</section>
	);
}
