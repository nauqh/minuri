"use client";

import Link from "next/link";
import { useRef } from "react";
import { Compass, LayoutGrid, MapPin, type LucideIcon } from "lucide-react";
import {
	motion,
	useReducedMotion,
	useScroll,
	useTransform,
	type MotionValue,
} from "motion/react";
import { cn } from "@/lib/utils";

const easeOut = [0.22, 1, 0.36, 1] as const;

type HowItWorksCard = {
	step: string;
	title: string;
	body: string;
	color: string;
	icon: LucideIcon;
	options: Array<{ title: string; description?: string }>;
};

const cards: HowItWorksCard[] = [
	{
		step: "Step one",
		title: "Start with what is happening this week",
		body: "Choose the moment that matches your life right now so you can skip generic advice and begin with the right first move.",
		color: "#00f5d4",
		icon: Compass,
		options: [
			{
				title: "I just arrived",
				description: "Day 1: essentials and health support.",
			},
			{
				title: "I'm getting set up",
				description:
					"Week 1: home admin, health basics, and orientation.",
			},
			{
				title: "I'm looking for my people",
				description:
					"Month 1: rhythm, connection, and sustaining habits.",
			},
		],
	},
	{
		step: "Step two",
		title: "Follow one simple structure",
		body: "Use the same five topics across the app, so each guide and local result feels familiar and easy to act on.",
		color: "#7fdcff",
		icon: LayoutGrid,
		options: [
			{ title: "Food & Eating" },
			{ title: "Getting Around" },
			{ title: "Health & Wellbeing" },
			{ title: "Home & Admin" },
			{ title: "Social & Belonging" },
		],
	},
	{
		step: "Step three",
		title: "Take action with nearby options",
		body: "When you are ready, switch from planning to doing with practical places and services near your suburb.",
		color: "#fff14a",
		icon: MapPin,
		options: [
			{
				title: "Suburb-aware results",
				description: "Everything filters to where you are.",
			},
			{
				title: "Save useful places",
				description: "Keep spots you want to return to.",
			},
			{
				title: "No sign-up required",
				description: "Your journey stays on your device.",
			},
		],
	},
];

/* ─── single card face ─────────────────────────────────────────── */
function CardFace({
	card,
	index,
	y,
}: {
	card: HowItWorksCard;
	index: number;
	y: MotionValue<string> | number;
}) {
	const visualOnRight = index % 2 === 0;
	const Icon = card.icon;

	return (
		<motion.div
			className="absolute inset-0 flex items-center bg-minuri-white"
			style={{
				y,
				zIndex: index + 1,
			}}
		>
			{/* coloured half panel — desktop only; on mobile it splits the single-column layout */}
			<div
				aria-hidden
				className={cn(
					"pointer-events-none absolute inset-y-0 hidden w-1/2 md:block",
					visualOnRight ? "right-0" : "left-0",
				)}
				style={{ background: card.color }}
			/>

			<div className="relative z-10 mx-auto grid w-full max-w-screen-xl items-center gap-8 px-6 py-8 sm:px-10 sm:py-14 md:grid-cols-2 md:gap-12 md:px-14 md:py-20 xl:px-16">
				{/* ── text ── */}
				<div
					className={cn(
						"flex flex-col justify-center",
						!visualOnRight
							? "md:order-2 md:pl-14 lg:pl-20"
							: "md:pr-14 lg:pr-20",
					)}
				>
					<div className="w-full max-w-136 rounded-[1.7rem] border border-minuri-silver/55 bg-minuri-white/85 p-5 shadow-[0_20px_44px_-34px_rgba(4,30,43,0.35)] backdrop-blur-[2px] sm:p-6 md:p-8">
						<div className="mb-4 inline-flex items-center gap-2.5 rounded-full border border-minuri-silver/60 bg-minuri-white px-3.5 py-1.5 sm:mb-6">
							<span
								aria-hidden
								className="size-2.5 rounded-full"
								style={{ background: card.color }}
							/>
							<span
								className="text-[0.68rem] font-bold uppercase tracking-[0.2em]"
								style={{
									color: `color-mix(in srgb, ${card.color} 60%, #0c1e2e)`,
								}}
							>
								{card.step}
							</span>
						</div>

						<h3 className="text-[1.75rem] font-bold leading-[1.12] tracking-tight text-minuri-ocean sm:text-[2rem] md:text-[2.35rem]">
							{card.title}
						</h3>

						<p className="mt-3 text-[0.98rem] leading-relaxed text-minuri-slate sm:mt-5 md:text-[1.08rem]">
							{card.body}
						</p>

						<div className="mt-4 space-y-2.5 sm:mt-6 sm:space-y-3.5">
							{card.options.map((opt, optionIndex) => (
								<div
									key={opt.title}
									className="flex items-start gap-3 rounded-xl border border-minuri-silver/55 bg-minuri-white/80 px-3 py-3 transition-transform duration-300 ease-out hover:-translate-y-0.5 sm:gap-3.5 sm:px-3.5 sm:py-3.5"
								>
									<span
										aria-hidden
										className="inline-flex h-7 min-w-7 items-center justify-center rounded-full px-1.5 text-[0.72rem] font-black tabular-nums"
										style={{
											background: `color-mix(in srgb, ${card.color} 34%, white)`,
											color: "#0c1e2e",
										}}
									>
										{String(optionIndex + 1).padStart(
											2,
											"0",
										)}
									</span>
									<div>
										<p className="text-[0.95rem] font-semibold text-minuri-ocean sm:text-[1rem]">
											{opt.title}
										</p>
										{opt.description && (
											<p className="mt-0.5 text-[0.85rem] leading-relaxed text-minuri-slate sm:text-[0.9rem]">
												{opt.description}
											</p>
										)}
									</div>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* ── visual — hidden on mobile to prevent overflow in h-screen sticky stage ── */}
				<div
					className={cn(
						"relative hidden items-center justify-center md:flex md:min-h-screen",
						!visualOnRight && "md:order-1",
					)}
				>
					<span
						aria-hidden
						className="pointer-events-none absolute select-none font-black leading-none tabular-nums text-minuri-ocean/10"
						style={{ fontSize: "clamp(10rem, 26vw, 20rem)" }}
					>
						0{index + 1}
					</span>
					<Icon
						aria-hidden
						className="relative z-10 text-minuri-ocean/70"
						style={{
							width: "clamp(5.5rem, 13vw, 9.5rem)",
							height: "clamp(5.5rem, 13vw, 9.5rem)",
							strokeWidth: 1,
						}}
					/>
				</div>
			</div>
		</motion.div>
	);
}

/* ─── main section ─────────────────────────────────────────────── */
export function SpotlightScrollSection() {
	const shouldReduceMotion = useReducedMotion();
	const containerRef = useRef<HTMLDivElement>(null);

	/*
	 * Single shared scroll progress over the tall container (below).
	 * progress = 0  →  container top at viewport top
	 * progress = 1  →  container bottom at viewport bottom
	 *
	 * Five equal progress segments (dwell / slide / dwell / slide / dwell):
	 *
	 * Card 0 dwell:       0.00 – 0.20
	 * Slide 0→1:          0.20 – 0.40  — card 1 slides up
	 * Card 1 dwell:       0.40 – 0.60
	 * Slide 1→2:          0.60 – 0.80  — card 2 slides up
	 * Card 2 dwell:       0.80 – 1.00
	 */
	const { scrollYProgress } = useScroll({
		target: containerRef,
		offset: ["start start", "end end"],
	});

	// card 0 stays fixed; cards 1 and 2 each slide up from below
	const y1 = useTransform(scrollYProgress, [0.2, 0.4], ["100%", "0%"]);
	const y2 = useTransform(scrollYProgress, [0.6, 0.8], ["100%", "0%"]);

	const yValues: (MotionValue<string> | number)[] = [
		0,
		shouldReduceMotion ? 0 : y1,
		shouldReduceMotion ? 0 : y2,
	];

	return (
		<div id="service" className="scroll-mt-24 md:scroll-mt-28">
			{/* ── heading ── */}
			<div className="bg-minuri-white py-16 text-center md:py-20">
				<p className="landing-section-kicker">How Minuri works</p>
				<h2
					id="how-it-works-heading"
					className="landing-section-heading"
				>
					From confusion to clear action
				</h2>
				<p className="landing-section-subheading mt-4">
					A fast path from where you are now to the next thing you can
					do today.
				</p>
			</div>

			{/*
			 * 400 vh container  →  ~300 vh of scroll travel with a 100 vh sticky stage.
			 * Shorter than extra-tall pin sections so wheel/trackpad scroll feels normal.
			 * The stage holds all 3 cards stacked; scroll drives the transitions.
			 */}
			<div
				ref={containerRef}
				className="relative"
				style={{ height: "400vh" }}
			>
				<div className="sticky top-0 h-screen overflow-hidden bg-minuri-white">
					{cards.map((card, i) => (
						<CardFace
							key={card.step}
							card={card}
							index={i}
							y={yValues[i]}
						/>
					))}
				</div>
			</div>

			{/* CTA button */}
			<div className="bg-minuri-white px-6 pb-20 pt-12 sm:px-10 md:pt-16">
				<motion.div
					className="mx-auto mt-16 w-full max-w-2xl md:mt-24"
					initial={{ opacity: 0, y: 28 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{
						once: true,
						margin: "0% 0px -12% 0px",
						amount: 0.35,
					}}
					transition={{ duration: 0.55, delay: 0.12, ease: easeOut }}
				>
					<button
						type="button"
						onClick={() => {
							if (window.scrollY <= 5) {
								window.dispatchEvent(new CustomEvent("minuri:highlight-cta"));
								return;
							}
							window.scrollTo({ top: 0, behavior: "smooth" });
							const onScroll = () => {
								if (window.scrollY <= 5) {
									window.removeEventListener("scroll", onScroll);
									window.dispatchEvent(new CustomEvent("minuri:highlight-cta"));
								}
							};
							window.addEventListener("scroll", onScroll);
						}}
						className="group relative flex h-22 w-full cursor-pointer items-center overflow-hidden rounded-[1.35rem] border border-minuri-silver/60 bg-[linear-gradient(120deg,color-mix(in_oklch,var(--minuri-seafoam)_58%,var(--minuri-teal))_0%,color-mix(in_oklch,var(--minuri-teal)_78%,var(--minuri-seafoam))_100%)] text-left shadow-[0_18px_34px_-26px_color-mix(in_oklch,var(--minuri-mid)_38%,transparent)] transition-[background,box-shadow,transform] duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-minuri-white hover:bg-none hover:border-minuri-silver/80 hover:shadow-[0_20px_38px_-30px_color-mix(in_oklch,var(--minuri-mid)_28%,transparent)] focus-visible:bg-minuri-white focus-visible:bg-none focus-visible:border-minuri-silver/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-minuri-teal/65 focus-visible:ring-offset-2 focus-visible:ring-offset-minuri-white"
					>
						<span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[clamp(1.65rem,3.8vw,2.1rem)] tracking-[-0.04em] text-minuri-white transition-all duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:left-9 group-hover:translate-x-0 group-hover:text-foreground group-focus-visible:left-9 group-focus-visible:translate-x-0 group-focus-visible:text-foreground">
							Let's Get Started
						</span>
						<span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 translate-x-6 opacity-0 transition-[transform,opacity] duration-[500ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:pointer-events-auto group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:pointer-events-auto group-focus-visible:translate-x-0 group-focus-visible:opacity-100">
							<span className="inline-flex items-center rounded-full border border-minuri-silver/50 bg-[linear-gradient(120deg,color-mix(in_oklch,var(--minuri-seafoam)_58%,var(--minuri-teal))_0%,color-mix(in_oklch,var(--minuri-teal)_78%,var(--minuri-seafoam))_100%)] px-7 py-3 text-lg font-semibold tracking-tight text-minuri-white shadow-[0_12px_20px_-14px_color-mix(in_oklch,var(--minuri-mid)_45%,transparent)] transition-transform duration-[500ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:scale-105 focus-visible:-translate-y-0.5 focus-visible:scale-105">
								Start your journey
							</span>
						</span>
					</button>
				</motion.div>
			</div>
		</div>
	);
}
