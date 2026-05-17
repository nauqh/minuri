"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

type Props = {
	suburb: string;
	body: string;
	signOff: string;
	onComplete?: () => void;
	skipStream?: boolean;
};

export function MelbourneLetter({
	suburb,
	body,
	signOff,
	onComplete,
	skipStream = false,
}: Props) {
	const [visibleCount, setVisibleCount] = useState(
		skipStream ? body.length : 0,
	);
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const onCompleteRef = useRef(onComplete);
	onCompleteRef.current = onComplete;
	const calledRef = useRef(false);

	// Fire onComplete in its own effect — never inside a state updater
	useEffect(() => {
		if (
			visibleCount >= body.length &&
			body.length > 0 &&
			!calledRef.current
		) {
			calledRef.current = true;
			onCompleteRef.current?.();
		}
	}, [visibleCount, body.length]);

	useEffect(() => {
		calledRef.current = false;
		if (skipStream) {
			setVisibleCount(body.length);
			return;
		}

		setVisibleCount(0);
		const CHARS_PER_TICK = 3;
		const TICK_MS = 40;

		intervalRef.current = setInterval(() => {
			setVisibleCount((prev) => {
				const next = Math.min(prev + CHARS_PER_TICK, body.length);
				if (next >= body.length && intervalRef.current) {
					clearInterval(intervalRef.current);
				}
				return next;
			});
		}, TICK_MS);

		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current);
		};
	}, [body, skipStream]);

	const visibleBody = body.slice(0, visibleCount);
	const done = visibleCount >= body.length;

	return (
		<motion.div
			className="rounded-2xl border bg-white/90 backdrop-blur-sm px-6 py-6 shadow-lg"
			style={{
				borderColor: "rgba(74,144,217,0.2)",
				fontFamily: "var(--font-handwriting, Georgia, serif)",
				maxWidth: 480,
				width: "100%",
			}}
			initial={{ opacity: 0, y: 32 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
		>
			<p className="text-sm font-semibold text-minuri-slate mb-3">
				Dear {suburb},
			</p>

			<p
				className="text-sm leading-relaxed text-minuri-ocean min-h-[80px]"
				aria-live="polite"
				aria-label="Letter from Melbourne"
			>
				{visibleBody}
				{!done && (
					<span
						className="inline-block w-0.5 h-3.5 bg-minuri-teal align-middle ml-0.5 animate-pulse"
						aria-hidden
					/>
				)}
			</p>

			{done && (
				<motion.p
					className="mt-4 text-right text-sm font-semibold text-minuri-slate"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.5, delay: 0.3 }}
				>
					{signOff}
				</motion.p>
			)}
		</motion.div>
	);
}
