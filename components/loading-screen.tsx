"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const PAUSE_AT = 38;
const PHASE1_MS = 950;
const PHASE2_MS = 1250;

type Phase = "phase1" | "phase2" | "done";

export function LoadingScreen({ onComplete }: { onComplete?: () => void }) {
	const [progress, setProgress] = useState(0);
	const [phase, setPhase] = useState<Phase>("phase1");
	const rafRef = useRef<number | null>(null);

	// Phase 1: 0 → PAUSE_AT
	useEffect(() => {
		if (phase !== "phase1") return;
		const start = performance.now();

		const tick = (now: number) => {
			const pct = Math.min(
				Math.floor(((now - start) / PHASE1_MS) * PAUSE_AT),
				PAUSE_AT,
			);
			setProgress(pct);

			if (pct < PAUSE_AT) {
				rafRef.current = requestAnimationFrame(tick);
			} else {
				setPhase("phase2");
			}
		};

		rafRef.current = requestAnimationFrame(tick);
		return () => {
			if (rafRef.current) cancelAnimationFrame(rafRef.current);
		};
	}, [phase]);

	// Phase 2: PAUSE_AT → 100
	useEffect(() => {
		if (phase !== "phase2") return;
		const start = performance.now();

		const tick = (now: number) => {
			const pct = Math.min(
				PAUSE_AT +
					Math.floor(((now - start) / PHASE2_MS) * (100 - PAUSE_AT)),
				100,
			);
			setProgress(pct);

			if (pct < 100) {
				rafRef.current = requestAnimationFrame(tick);
			} else {
				setTimeout(() => setPhase("done"), 160);
			}
		};

		rafRef.current = requestAnimationFrame(tick);
		return () => {
			if (rafRef.current) cancelAnimationFrame(rafRef.current);
		};
	}, [phase]);

	return (
		<AnimatePresence onExitComplete={onComplete}>
			{phase !== "done" && (
				<motion.div
					key="loading"
					className="fixed inset-0 z-200 overflow-hidden select-none"
					style={{
						backgroundColor: "var(--minuri-white)",
						pointerEvents: "none",
					}}
					exit={{ y: "-100%" }}
					transition={{ duration: 0.72, ease: [0.76, 0, 0.24, 1] }}
				>
					{/* Notebook grid background */}
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
						<div
							className="absolute inset-0"
							style={{
								background:
									"radial-gradient(ellipse 80% 75% at 50% 50%, transparent 30%, rgba(255,255,255,0.55) 60%, white 82%)",
							}}
						/>
					</div>

					{/* Top: label + progress line */}
					<div className="relative z-10 flex items-center gap-5 px-7 pt-8">
						<span
							className="shrink-0 text-sm font-light uppercase tracking-[0.22em]"
							style={{ color: "var(--minuri-ocean)" }}
						>
							Loading..
						</span>
						<div
							className="flex-1 overflow-hidden rounded-full h-[3px]"
							style={{ backgroundColor: "rgba(2,24,25,0.12)" }}
						>
							<div
								className="h-full rounded-full"
								style={{
									width: `${progress}%`,
									backgroundColor: "var(--minuri-ocean)",
								}}
							/>
						</div>
					</div>

					{/* Bottom-right: huge counter */}
					<div className="absolute right-4 bottom-0 leading-none">
						<span
							className="block font-light tabular-nums"
							style={{
								fontSize: "clamp(120px, 27vw, 520px)",
								lineHeight: 0.82,
								color: "var(--minuri-ocean)",
							}}
						>
							{progress}%
						</span>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
