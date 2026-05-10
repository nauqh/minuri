"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";

interface LandingStatCardProps {
	stat: string;
	label: string;
	source: string;
	fullCitation: string;
	delay?: number;
	accentClass?: string;
	countTo?: number;
	countSuffix?: string;
}

function useCountUp(to: number, active: boolean, duration = 1400) {
	const [value, setValue] = useState(0);
	useEffect(() => {
		if (!active) return;
		let rafId: number;
		let start: number | null = null;
		const step = (ts: number) => {
			if (!start) start = ts;
			const progress = Math.min((ts - start) / duration, 1);
			const eased = 1 - Math.pow(1 - progress, 3);
			setValue(Math.round(eased * to));
			if (progress < 1) {
				rafId = requestAnimationFrame(step);
			}
		};
		rafId = requestAnimationFrame(step);
		return () => cancelAnimationFrame(rafId);
	}, [to, active, duration]);
	return value;
}

export function LandingStatCard({
	stat,
	label,
	source,
	fullCitation,
	delay = 0,
	accentClass = "bg-minuri-teal",
	countTo,
	countSuffix = "",
}: LandingStatCardProps) {
	const ref = useRef<HTMLDivElement>(null);
	const isInView = useInView(ref, { once: true, amount: 0.4 });
	const counted = useCountUp(countTo ?? 0, countTo !== undefined && isInView);
	const displayStat =
		countTo !== undefined ? `${counted}${countSuffix}` : stat;

	return (
		<motion.div
			ref={ref}
			data-source={fullCitation}
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, amount: 0.4 }}
			transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
			className="flex h-full"
		>
			<div className="group flex h-full w-full flex-col rounded-2xl bg-minuri-fog/60 p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg md:p-8">
				<div className={`mb-5 h-[3px] w-10 rounded-full ${accentClass}`} />
				<p className="text-[3.25rem] font-black leading-none tracking-tight text-minuri-ocean">
					{displayStat}
				</p>
				<p className="mt-3 flex-1 text-sm leading-relaxed text-minuri-ocean/70">
					{label}
				</p>
				<p className="mt-6 border-t border-minuri-silver/40 pt-4 text-[11px] uppercase tracking-wide text-minuri-ocean/40">
					{source}
				</p>
			</div>
		</motion.div>
	);
}
