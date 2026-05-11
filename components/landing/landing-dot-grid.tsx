"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";

type DotKind = "idle" | "seeking" | "waiting";

function classify(i: number): DotKind {
	const v = (i * 37 + (i * i) % 97) % 100;
	if (v < 35) return "idle";
	if (v < 68) return "seeking";
	return "waiting";
}

function isMedical(i: number): boolean {
	return (i * 43 + (i * i) % 89) % 100 < 22;
}

const DOTS = Array.from({ length: 100 }, (_, i) => ({
	kind: classify(i),
	medical: isMedical(i),
	enterDelay: Math.floor(i / 10) * 55 + (i % 10) * 35,
}));

function dotBg(dot: (typeof DOTS)[number], step: number): string {
	if (step >= 3 && dot.medical) return "bg-minuri-coral";
	if (dot.kind === "idle" || step === 0) return "bg-white/[0.08]";
	if (step === 1) return "bg-[#fcf300]";
	return dot.kind === "seeking" ? "bg-[#fcf300]" : "bg-[#fcf300]/[0.12]";
}

function dotDuration(step: number): string {
	if (step === 1) return "450ms";
	if (step === 2) return "700ms";
	return "500ms";
}

function dotDelay(dot: (typeof DOTS)[number], step: number): string {
	if (step === 1) return `${dot.enterDelay}ms`;
	if (step === 3 && dot.medical) return `${dot.enterDelay % 300}ms`;
	return "0ms";
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const STEPS = [
	{
		nav: "65 in 100",
		stat: "65",
		unit: "in 100",
		body: "young Australians aged 18–25 are experiencing high or very high psychological distress",
		source: "headspace National Survey · 2025",
	},
	{
		nav: "1 in 2",
		stat: "1 in 2",
		unit: "",
		body: "won't reach out for support until they're at crisis point — when the window to help is already closing",
		source: "headspace National Survey · 2024",
	},
	{
		nav: "22 in 100",
		stat: "22",
		unit: "in 100",
		body: "skipped or delayed medical care last year — not because they didn't need it, but because they couldn't afford it",
		source: "Brotherhood of St Laurence · 2024",
	},
];

const LEGEND = [
	{ cls: "bg-[#fcf300]", label: "In distress, reached out for support", showFrom: 1 },
	{ cls: "bg-[#fcf300]/[0.12]", label: "In distress, not yet sought help", showFrom: 2 },
	{ cls: "bg-minuri-coral", label: "Skipped medical care due to cost", showFrom: 3 },
	{ cls: "bg-white/[0.08]", label: "Not currently in high distress", showFrom: 1 },
];

export function LandingDotGrid() {
	const ref = useRef<HTMLElement>(null);
	const isInView = useInView(ref, { once: true, amount: 0.25 });
	const [step, setStep] = useState(0);
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const userControlled = useRef(false);

	useEffect(() => {
		if (!isInView || userControlled.current) return;
		setStep(1);
		let current = 1;
		intervalRef.current = setInterval(() => {
			current = current >= 3 ? 1 : current + 1;
			setStep(current);
		}, 2600);
		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current);
		};
	}, [isInView]);

	function goToStep(s: number) {
		if (intervalRef.current) clearInterval(intervalRef.current);
		userControlled.current = true;
		setStep(s);
	}

	function nextStep() {
		const next = step <= 0 || step >= 3 ? 1 : step + 1;
		goToStep(next);
	}

	const labelIdx = step >= 3 ? 2 : step >= 2 ? 1 : 0;
	const label = STEPS[labelIdx];

	return (
		<section
			ref={ref}
			className="bg-minuri-ocean px-5 py-20 md:px-10 md:py-24 lg:px-16"
		>
			<div className="mx-auto flex max-w-7xl flex-col items-center">
				<p className="mb-10 text-center text-xs font-black uppercase tracking-[0.15em] text-white/35">
					Out of 100 young Australians
				</p>

				<div className="flex flex-col gap-12 md:flex-row md:items-center md:gap-16 lg:gap-24">
					{/* 10×10 dot grid */}
					<div className="grid shrink-0 grid-cols-10 gap-1.5 md:gap-2 lg:gap-3">
						{DOTS.map((dot, i) => (
							<div
								key={i}
								className={`h-5 w-5 rounded-full transition-colors md:h-6 md:w-6 lg:h-9 lg:w-9 ${dotBg(dot, step)}`}
								style={{
									transitionDuration: dotDuration(step),
									transitionDelay: dotDelay(dot, step),
								}}
							/>
						))}
					</div>

					{/* Label + next chevron grouped tightly */}
					<div className="flex min-w-0 items-center gap-6">
						<div className="min-w-0">
							<motion.div
								key={labelIdx}
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, ease: EASE }}
							>
								<p
									className="font-black leading-none text-white"
									style={{ fontSize: "clamp(3rem, 8vw, 6rem)" }}
								>
									{label.stat}
									{label.unit && (
										<span className="ml-3 text-2xl font-bold text-white/40 md:text-3xl">
											{label.unit}
										</span>
									)}
								</p>
								<p className="mt-4 max-w-sm text-base leading-relaxed text-white/60 md:text-lg">
									{label.body}
								</p>
								<p className="mt-6 text-[10px] font-bold uppercase tracking-[0.18em] text-white/25">
									{label.source}
								</p>
							</motion.div>
						</div>

						{step >= 1 && (
							<button
								onClick={nextStep}
								aria-label="Next view"
								className="shrink-0 rounded-full border border-white/20 p-3 text-white/35 transition-colors duration-200 hover:border-white/40 hover:text-white/55"
							>
								<svg
									width="18"
									height="18"
									viewBox="0 0 16 16"
									fill="none"
									aria-hidden="true"
								>
									<path
										d="M6 3l5 5-5 5"
										stroke="currentColor"
										strokeWidth="1.5"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</button>
						)}
					</div>
				</div>

				{/* Step navigation */}
				{step >= 1 && (
					<motion.div
						className="mt-10 flex flex-wrap justify-center gap-2 md:mt-12"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.4 }}
					>
						{STEPS.map((s, i) => {
							const isCurrentLabel = labelIdx === i;
							return (
								<button
									key={s.nav}
									onClick={() => goToStep(i + 1)}
									className={`rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-widest transition-colors duration-200 ${
										isCurrentLabel
											? "bg-white text-minuri-ocean"
											: "border border-white/20 text-white/35 hover:border-white/40 hover:text-white/55"
									}`}
								>
									{s.nav}
								</button>
							);
						})}
					</motion.div>
				)}

				{/* Legend + next chevron */}
				<div className="mt-6 flex w-full flex-wrap items-center justify-center gap-x-8 gap-y-3">
					{LEGEND.filter((item) => step >= item.showFrom).map((item) => (
						<motion.div
							key={item.label}
							className="flex items-center gap-2.5"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.4 }}
						>
							<div className={`h-4 w-4 shrink-0 rounded-full ${item.cls}`} />
							<span className="text-sm text-white/50 md:text-base">{item.label}</span>
						</motion.div>
					))}

				</div>
			</div>
		</section>
	);
}
