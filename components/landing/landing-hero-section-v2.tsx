"use client";

import Link from "next/link";
import {
	ChevronRight,
	Heart,
	Home,
	MapPin,
	Users,
	Utensils,
	type LucideIcon,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { LandingHeader } from "@/components/landing/landing-header";

const HERO_TOPIC_CARDS: {
	title: string;
	desc: string;
	bg: string;
	rotate: number;
	floatPhase: number;
	word: string;
	wordColor: string;
	icon: LucideIcon;
}[] = [
	{
		title: "Food & Eating",
		desc: "Groceries, cheap meals & cooking basics.",
		bg: "#00f5c8",
		rotate: -6,
		floatPhase: 0,
		word: "eat",
		wordColor: "#00957f",
		icon: Utensils,
	},
	{
		title: "Getting Around",
		desc: "Trams, buses & cycling Melbourne.",
		bg: "#5dd6ff",
		rotate: 5,
		floatPhase: 1.1,
		word: "travel",
		wordColor: "#0077a8",
		icon: MapPin,
	},
	{
		title: "Health & Wellbeing",
		desc: "GPs, Medicare & mental health.",
		bg: "#fcf300",
		rotate: -2,
		floatPhase: 0.5,
		word: "heal",
		wordColor: "#9a7000",
		icon: Heart,
	},
	{
		title: "Home & Admin",
		desc: "Renting, utilities & paperwork.",
		bg: "#ffc2d1",
		rotate: 6,
		floatPhase: 0.8,
		word: "settle",
		wordColor: "#c4246e",
		icon: Home,
	},
	{
		title: "Social & Belonging",
		desc: "Community, friendships & finding your place.",
		bg: "#cae9ff",
		rotate: -3,
		floatPhase: 1.4,
		word: "belong",
		wordColor: "#7a1ac4",
		icon: Users,
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
				className="flex h-full flex-col justify-between rounded-2xl p-4 shadow-md md:p-5"
				animate={{ y: [0, -7, 0] }}
				transition={{
					duration: 3.2 + card.floatPhase * 0.28,
					ease: "easeInOut",
					repeat: Infinity,
					delay: card.floatPhase,
				}}
			>
				<div className="flex items-start justify-between gap-2">
					<h3 className="text-base font-black uppercase leading-tight tracking-tight text-[#05292a] md:text-[1.05rem]">
						{card.title}
					</h3>
					<card.icon
						aria-hidden
						className="mt-0.5 size-5 shrink-0 text-[#05292a]/60"
						strokeWidth={2.5}
					/>
				</div>
				<p className="mt-3 text-[0.75rem] leading-snug text-[#163a3a]/70 md:text-[0.8rem]">
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
		<section className="relative flex min-h-screen flex-col overflow-hidden md:overflow-visible bg-minuri-white text-minuri-ink">
			<div className="relative flex flex-1 flex-col mx-auto w-full max-w-screen-2xl px-8 pb-10 pt-4 sm:px-10 md:px-6 md:pt-0">
				<LandingHeader
					headerVisible={headerVisible}
					onHeroReveal={onHeroReveal}
				/>

				<motion.div
					className="flex flex-1 flex-col pb-12 pt-8 sm:pb-14 sm:pt-10 md:pb-16 md:pt-12"
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
							className="inline-flex rounded-sm bg-[#e2ffef] p-2 text-sm font-black uppercase text-minuri-ocean"
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
							className="mt-5 w-full text-4xl font-black uppercase leading-snug tracking-tight text-minuri-teal md:text-7xl md:leading-none"
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

					<div className="mt-0 grid flex-1 gap-10 md:grid-cols-[1.2fr_0.8fr] md:items-stretch md:gap-10">
						<div className="flex h-full flex-col">
							<motion.p
								className="hidden text-2xl font-semibold leading-snug text-minuri-ocean md:mt-4 md:block md:leading-tight"
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
								<p className="max-w-xl text-[1.0625rem] leading-[1.6] text-minuri-ocean font-medium md:text-base md:leading-relaxed">
									Get plain-language guides, find nearby
									services, and follow clear next steps for
									day-to-day independent life.
								</p>
								<motion.div
									className="flex flex-wrap items-center gap-4 md:my-6 md:gap-3 max-md:flex-col max-md:items-stretch pt-2 md:pt-0"
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
										className="group inline-flex h-12 w-full items-center justify-center gap-1.5 rounded-full bg-minuri-teal px-7 text-base font-medium text-primary-foreground transition-transform duration-200 ease-out hover:scale-105 md:w-auto md:justify-start md:px-6"
									>
										Find nearby support
										<ChevronRight
											aria-hidden
											className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-1"
										/>
									</Link>
									<Link
										href="/guides"
										className="group inline-flex h-12 w-full items-center justify-center gap-1.5 rounded-full border border-minuri-ocean bg-minuri-white px-7 text-base font-medium text-minuri-ocean transition-transform duration-200 ease-out hover:scale-105 md:w-auto md:justify-start md:px-6"
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

						<div className="relative z-10 flex h-full w-full flex-col md:-ml-8 md:pb-4 min-[1500px]:origin-top min-[1500px]:scale-[1.18]">
							<div
								className="grid h-full max-h-[520px] grid-cols-2 gap-2.5 md:gap-3"
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
									className="col-span-2 mx-auto w-[calc(50%-5px)] md:w-[calc(50%-6px)]"
								/>
							</div>
						</div>
					</div>
				</motion.div>
			</div>

			<motion.div
				className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer"
				initial={{ opacity: 0, y: -8 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 1.2, duration: 0.6, ease: "easeOut" }}
				onClick={() => window.scrollBy({ top: window.innerHeight, behavior: "smooth" })}
				aria-label="Scroll down"
			>
				<motion.span
					className="text-xs font-semibold uppercase tracking-widest text-minuri-ocean/60"
					animate={{ opacity: [0.5, 1, 0.5] }}
					transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
				>
					Scroll to explore
				</motion.span>
				<div className="relative flex h-10 w-6 items-start justify-center rounded-full border-2 border-minuri-ocean/40 pt-1.5">
					<motion.div
						className="h-1.5 w-1 rounded-full bg-minuri-teal"
						animate={{ y: [0, 14, 0], opacity: [1, 0, 1] }}
						transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
					/>
				</div>
			</motion.div>
		</section>
	);
}
