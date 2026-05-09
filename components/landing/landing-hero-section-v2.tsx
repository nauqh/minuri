"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useLenis } from "lenis/react";

import { LandingHeader } from "@/components/landing/landing-header";

const HERO_TOPIC_CARDS: {
	title: string;
	desc: string;
	bg: string;
	rotate: number;
	floatPhase: number;
	word: string;
}[] = [
	{
		title: "Food & Eating",
		desc: "Groceries, cheap meals & cooking basics.",
		bg: "#00f5c8",
		rotate: -6,
		floatPhase: 0,
		word: "eat",
	},
	{
		title: "Getting Around",
		desc: "Trams, buses & cycling Melbourne.",
		bg: "#5dd6ff",
		rotate: 5,
		floatPhase: 1.1,
		word: "travel",
	},
	{
		title: "Health & Wellbeing",
		desc: "GPs, Medicare & mental health.",
		bg: "#fcf300",
		rotate: -2,
		floatPhase: 0.5,
		word: "heal",
	},
	{
		title: "Home & Admin",
		desc: "Renting, utilities & paperwork.",
		bg: "#ffc2d1",
		rotate: 6,
		floatPhase: 0.8,
		word: "settle",
	},
	{
		title: "Social & Belonging",
		desc: "Community, friendships & finding your place.",
		bg: "#cae9ff",
		rotate: -3,
		floatPhase: 1.4,
		word: "belong",
	},
];

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
				style={{ rotate: card.rotate, backgroundColor: card.bg }}
				className="flex h-full flex-col rounded-2xl p-4 shadow-md md:p-5"
				animate={{ y: [0, -7, 0] }}
				transition={{
					duration: 3.2 + card.floatPhase * 0.28,
					ease: "easeInOut",
					repeat: Infinity,
					delay: card.floatPhase,
				}}
			>
				{/* Label */}
				<p className="text-[0.58rem] font-black uppercase tracking-[0.18em] text-[#05292a]/60">
					{card.title}
				</p>

				{/* Big editorial word */}
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

				{/* Description */}
				<p className="text-[0.7rem] leading-snug text-[#163a3a]/60 md:text-[0.75rem]">
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
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const lenis = useLenis();
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
		<section className="relative flex h-screen flex-col overflow-hidden bg-minuri-white text-minuri-ink">
			<div className="relative flex flex-1 flex-col mx-auto w-full max-w-screen px-8 pb-10 pt-4 sm:px-10 md:px-6 md:pt-0 min-[1500px]:max-w-[1600px]">
				<LandingHeader
					headerVisible={headerVisible}
					onHeroReveal={onHeroReveal}
				/>

				<motion.div
					className="flex flex-1 flex-col pb-12 pt-8 sm:pb-14 sm:pt-10 md:pb-16 md:pt-12 min-[1500px]:pb-20 min-[1500px]:pt-20"
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
							className="mt-5 w-full text-4xl font-black uppercase leading-snug tracking-tight text-minuri-teal md:text-7xl md:leading-none min-[1500px]:mt-8 min-[1500px]:text-9xl"
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
							<motion.p
								className="hidden text-2xl font-semibold leading-snug text-minuri-ocean md:mt-4 md:block md:leading-tight min-[1500px]:text-4xl"
								variants={{
									hidden: {
										opacity: 0,
										y: 14,
									},
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
								<p className="max-w-xl text-sm leading-[1.6] text-minuri-ocean font-medium md:text-xl md:leading-relaxed min-[1500px]:text-2xl">
									Get plain-language guides, find nearby
									services, and follow clear next steps for
									day-to-day independent life.
								</p>
								<motion.div
									className="flex flex-wrap items-center gap-4 md:my-6 md:gap-3 max-md:flex-col max-md:items-stretch pt-2 md:pt-0 min-[1500px]:my-10 min-[1500px]:gap-5"
									variants={{
										hidden: {
											opacity: 0,
											y: 10,
										},
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
									<Link
										href="/near-me"
										className="group inline-flex h-12 w-full items-center justify-center gap-1.5 rounded-full bg-minuri-teal px-7 text-base font-medium text-primary-foreground transition-transform duration-200 ease-out hover:scale-105 md:w-auto md:justify-start md:px-6 min-[1500px]:h-16 min-[1500px]:px-10 min-[1500px]:text-xl"
									>
										Find nearby support
										<ChevronRight
											aria-hidden
											className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-1"
										/>
									</Link>
									<Link
										href="/guides"
										className="group inline-flex h-12 w-full items-center justify-center gap-1.5 rounded-full border border-minuri-ocean bg-minuri-white px-7 text-base font-medium text-minuri-ocean transition-transform duration-200 ease-out hover:scale-105 md:w-auto md:justify-start md:px-6 min-[1500px]:h-16 min-[1500px]:px-10 min-[1500px]:text-xl"
									>
										Start with guides
										<ChevronRight
											aria-hidden
											className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-1"
										/>
									</Link>
								</motion.div>
							</motion.div>
						</div>

						<div className="relative z-10 flex w-full flex-col md:ml-auto md:pb-4 md:max-w-[460px] min-[1500px]:max-w-[600px]">
							<div
								className="relative grid grid-cols-2 gap-2.5 md:gap-3 h-[350px] min-[1500px]:h-[380px]"
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
									className="absolute right-[calc(100%+10px)] top-[calc(50%+5px)] h-[calc(50%-5px)] w-[calc(50%-5px)]"
								/>
							</div>
						</div>
					</div>
				</motion.div>
			</div>

			<motion.div
				className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 cursor-pointer"
				initial={{ opacity: 0, y: -8 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 1.2, duration: 0.6, ease: "easeOut" }}
				onClick={() =>
					lenis?.scrollTo(window.scrollY + window.innerHeight, {
						duration: 1.2,
						easing: (t) => 1 - Math.pow(1 - t, 4),
					})
				}
				aria-label="Scroll down"
			>
				<motion.span
					className="text-xs font-semibold uppercase tracking-widest text-minuri-ocean/60"
					animate={{ opacity: [0.5, 1, 0.5] }}
					transition={{
						duration: 2,
						repeat: Infinity,
						ease: "easeInOut",
					}}
				>
					Scroll to explore
				</motion.span>
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
		</section>
	);
}
