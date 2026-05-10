"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";

type ContextRun = { text: string; bold?: boolean };

const STRIP_DATA: {
	value: number;
	displayStat: string;
	source: string;
	context: ContextRun[];
	color: string;
	sourceUrl: string;
}[] = [
	{
		value: 65,
		displayStat: "65%",
		source: "headspace National Survey · 2025",
		context: [
			{ text: "65% of young Australians aged 18–25 are experiencing " },
			{ text: "high or very high psychological distress", bold: true },
			{ text: " — a mental health crisis hiding in plain sight." },
		],
		color: "#fcf300",
		sourceUrl:
			"https://headspace.org.au/our-organisation/media-releases/nearly-half-of-young-australians-experiencing-high-levels-of-psychological-distress-but-more-are-seeking-support/",
	},
	{
		value: 56,
		displayStat: "56%",
		source: "Mission Australia Youth Survey · 2024",
		context: [
			{ text: "56% of young people named " },
			{
				text: "cost of living as Australia's #1 national concern",
				bold: true,
			},
			{
				text: " — the highest proportion ever recorded across all issues.",
			},
		],
		color: "#cae9ff",
		sourceUrl:
			"https://www.missionaustralia.com.au/media-centre/media-releases/youth-survey-cost-living-number-one-for-young-people",
	},
	{
		value: 40,
		displayStat: "2 in 5",
		source: "Mission Australia Youth Survey · 2025",
		context: [
			{ text: "2 in 5 young Australians report stress " },
			{ text: "directly linked to their mental health", bold: true },
			{
				text: " — affecting school attendance, confidence and daily motivation.",
			},
		],
		color: "#ffc2d1",
		sourceUrl:
			"https://www.missionaustralia.com.au/what-we-do/research-and-resources/youth-survey",
	},
	{
		value: 67,
		displayStat: "2 in 3",
		source: "AIHW · Housing Assistance in Australia · 2024",
		context: [
			{ text: "2 in 3 young Australian remain in " },
			{
				text: "housing stress even after receiving government rent assistance",
				bold: true,
			},
			{
				text: " — the system assumes they already know how to navigate it.",
			},
		],
		color: "#00f5c8",
		sourceUrl:
			"https://www.aihw.gov.au/reports/housing-assistance/housing-assistance-in-australia-2024/contents/financial-assistance",
	},
];

function useCountUp(to: number, active: boolean, delayMs = 0, duration = 1000) {
	const [value, setValue] = useState(0);
	useEffect(() => {
		if (!active) return;
		let rafId: number;
		const timeoutId = setTimeout(() => {
			let start: number | null = null;
			const step = (ts: number) => {
				if (!start) start = ts;
				const progress = Math.min((ts - start) / duration, 1);
				const eased = 1 - Math.pow(1 - progress, 3);
				setValue(Math.round(eased * to));
				if (progress < 1) rafId = requestAnimationFrame(step);
			};
			rafId = requestAnimationFrame(step);
		}, delayMs);
		return () => {
			clearTimeout(timeoutId);
			cancelAnimationFrame(rafId);
		};
	}, [to, active, delayMs, duration]);
	return value;
}

const ANIM: [number, number, number, number] = [0.22, 1, 0.36, 1];

function StripBar({ entry }: { entry: (typeof STRIP_DATA)[number] }) {
	const ref = useRef<HTMLDivElement>(null);
	const isInView = useInView(ref, { once: true, amount: 0 });
	const count = useCountUp(entry.value, isInView, 150, 1050);
	return (
		<div
			ref={ref}
			role="button"
			tabIndex={0}
			aria-label={`${entry.displayStat}: ${entry.context.map((r) => r.text).join("")}. View source.`}
			onClick={() => {
				if (entry.sourceUrl)
					window.open(
						entry.sourceUrl,
						"_blank",
						"noopener,noreferrer",
					);
			}}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					if (entry.sourceUrl)
						window.open(
							entry.sourceUrl,
							"_blank",
							"noopener,noreferrer",
						);
				}
			}}
			className="group relative flex min-h-[200px] w-full cursor-pointer items-stretch overflow-hidden border-t border-white/[0.08] md:min-h-[220px] 2xl:min-h-[300px]"
		>
			{/* ── Colored fill ── */}
			<motion.div
				className="pointer-events-none absolute inset-y-0 left-0"
				style={{ backgroundColor: entry.color }}
				initial={{ width: "0%" }}
				animate={{ width: isInView ? `${entry.value}%` : "0%" }}
				transition={{ duration: 1.2, ease: ANIM }}
			/>

			{/* ── Number — just outside the fill tip, in dark zone ── */}
			<motion.div
				className="pointer-events-none absolute inset-y-0 flex items-center"
				initial={{ left: "0%", opacity: 0 }}
				animate={{
					left: isInView ? `${entry.value}%` : "0%",
					opacity: isInView ? 1 : 0,
				}}
				transition={{ duration: 1.2, ease: ANIM }}
			>
				<span
					className="whitespace-nowrap pl-3 font-black tabular-nums leading-none text-minuri-white md:pl-4"
					style={{ fontSize: "clamp(3.5rem, 12vw, 8rem)" }}
				>
					{entry.displayStat.includes("%")
						? `${count}%`
						: entry.displayStat}
				</span>
			</motion.div>

			{/* ── Context text ── */}
			<div className="relative z-10 flex w-full items-center px-5 md:px-10 lg:px-16">
				<div className="w-[40%] shrink-0 pr-4 md:w-[36%] md:pr-8 lg:w-[32%]">
					<p className="text-[9px] font-bold uppercase tracking-[0.18em] text-minuri-ocean/50 md:text-[10px]">
						{entry.source}
					</p>
					<p className="mt-2.5 text-base leading-relaxed text-minuri-ocean md:text-lg">
						{entry.context.map((run, i) =>
							run.bold ? (
								<strong
									key={i}
									className="font-black text-minuri-ocean"
								>
									{run.text}
								</strong>
							) : (
								<span key={i}>{run.text}</span>
							),
						)}
					</p>
				</div>
			</div>

			{/* ── Hover hint ── */}
			<span className="absolute bottom-3 right-5 text-[9px] font-semibold uppercase tracking-widest text-white/0 transition-[color] duration-200 group-hover:text-white/35 md:right-10">
				View source →
			</span>
		</div>
	);
}

export function LandingInsightChart() {
	return (
		<div
			className="bg-minuri-ocean"
			style={{
				backgroundImage:
					"linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px)",
				backgroundSize: "10% 100%",
			}}
		>
			{/* Header */}
			<div className="px-5 pb-4 pt-10 md:px-10 md:pt-12 lg:px-16">
				<p className="text-xs font-black uppercase tracking-[0.15em] text-white/35">
					The evidence
				</p>
				<p className="mt-2 text-xl font-bold text-white md:text-2xl lg:text-3xl">
					The gaps are specific. The confusion is real.
				</p>
			</div>

			{/* Strips — keyed by displayStat to avoid duplicate-key warning */}
			{STRIP_DATA.map((entry) => (
				<StripBar key={entry.source} entry={entry} />
			))}

			{/* Footer */}
			<div className="px-5 py-5 md:px-10 lg:px-16">
				<p className="text-xs text-white/25">
					Click any strip to explore Minuri guides for that area
				</p>
			</div>
		</div>
	);
}
