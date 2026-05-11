"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const PAUSE_AT = 38;
const PHASE1_MS = 950;
const PHASE2_MS = 1250;
const PASSWORD = "minuri";
const STORAGE_KEY = "minuri-password-gate";

type Phase = "phase1" | "paused" | "phase2" | "done";

export function LoadingScreen({ onComplete }: { onComplete?: () => void }) {
	const [progress, setProgress] = useState(0);
	const [phase, setPhase] = useState<Phase>("phase1");
	const [pwValue, setPwValue] = useState("");
	const [pwError, setPwError] = useState(false);
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
				try {
					if (sessionStorage.getItem(STORAGE_KEY) === "1") {
						setPhase("phase2");
						return;
					}
				} catch {
					/* ignore */
				}
				setPhase("paused");
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

	function submitPassword(e: React.FormEvent) {
		e.preventDefault();
		if (pwValue === PASSWORD) {
			try {
				sessionStorage.setItem(STORAGE_KEY, "1");
			} catch {
				/* ignore */
			}
			setPwError(false);
			setPhase("phase2");
		} else {
			setPwError(true);
		}
	}

	return (
		<AnimatePresence onExitComplete={onComplete}>
			{phase !== "done" && (
				<motion.div
					key="loading"
					className="fixed inset-0 z-200 overflow-hidden select-none"
					style={{
						backgroundColor: "var(--minuri-ocean)",
						pointerEvents: phase === "paused" ? "auto" : "none",
					}}
					exit={{ y: "-100%" }}
					transition={{ duration: 0.72, ease: [0.76, 0, 0.24, 1] }}
				>
					{/* Top: label + progress line */}
					<div className="flex items-center gap-5 px-7 pt-8">
						<span
							className="shrink-0 text-sm font-light uppercase tracking-[0.22em]"
							style={{ color: "var(--minuri-white)" }}
						>
							Loading..
						</span>
						<div className="flex-1 overflow-hidden">
							<div
								className="h-[3px] rounded-full"
								style={{
									width: `${progress}%`,
									backgroundColor: "var(--minuri-white)",
								}}
							/>
						</div>
					</div>

					{/* Bottom-right: huge counter — dims while waiting */}
					<div
						className="absolute right-4 bottom-0 leading-none transition-opacity duration-700"
						style={{ opacity: phase === "paused" ? 0.12 : 1 }}
					>
						<span
							className="block font-light tabular-nums"
							style={{
								fontSize: "clamp(120px, 27vw, 520px)",
								lineHeight: 0.82,
								color: "var(--minuri-white)",
							}}
						>
							{progress}%
						</span>
					</div>

					{/* Password prompt — fades in while paused */}
					<AnimatePresence>
						{phase === "paused" && (
							<motion.div
								key="pw-prompt"
								className="absolute inset-0 flex items-center justify-center px-6"
								initial={{ opacity: 0, y: 16 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								transition={{ duration: 0.45, ease: "easeOut" }}
							>
								<form
									onSubmit={submitPassword}
									className="w-full max-w-md flex flex-col gap-5"
								>
									<div className="flex flex-col gap-1.5">
										<p
											className="text-xs font-semibold tracking-[0.14em] uppercase"
											style={{
												color: "var(--minuri-seafoam)",
											}}
										>
											Minuri Preview
										</p>
										<h2
											className="text-2xl font-semibold leading-snug tracking-tight"
											style={{
												color: "var(--minuri-white)",
											}}
										>
											One sec — drop your invite password
										</h2>
										<p
											className="text-sm font-light leading-relaxed"
											style={{
												color: "rgba(255,255,255,0.55)",
											}}
										>
											Enter the password to keep loading
											and unlock everything.
										</p>
									</div>

									<div className="flex flex-col gap-2">
										<input
											type="password"
											autoFocus
											autoComplete="current-password"
											placeholder="Invite password"
											value={pwValue}
											onChange={(e) => {
												setPwValue(e.target.value);
												if (pwError) setPwError(false);
											}}
											className="h-12 w-full rounded-xl border px-4 text-base outline-none transition-colors"
											style={{
												backgroundColor:
													"rgba(255,255,255,0.08)",
												borderColor: pwError
													? "var(--minuri-coral)"
													: "rgba(255,255,255,0.2)",
												color: "var(--minuri-white)",
											}}
										/>
										{pwError && (
											<p
												className="text-sm font-medium"
												style={{
													color: "var(--minuri-coral)",
												}}
											>
												Wrong password — try once more.
											</p>
										)}
									</div>

									<button
										type="submit"
										className="h-12 w-full rounded-xl text-base font-semibold transition-opacity hover:opacity-90 active:opacity-75"
										style={{
											backgroundColor:
												"var(--minuri-teal)",
											color: "var(--minuri-white)",
										}}
									>
										Enter minuri
									</button>
								</form>
							</motion.div>
						)}
					</AnimatePresence>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
