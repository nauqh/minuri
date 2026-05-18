"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Loader2 } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";

import type { NearbyEventRecord } from "@/lib/near-me-api";

type Props = { suburb: string };
type LoadState = "loading" | "success" | "empty" | "error";

const FALLBACK_GRADIENTS = [
	"from-teal-300 to-cyan-400",
	"from-violet-300 to-purple-400",
	"from-rose-300 to-pink-400",
	"from-amber-300 to-orange-400",
	"from-sky-300 to-blue-400",
	"from-emerald-300 to-green-400",
];

function upscale(url: string): string {
	return `https://wsrv.nl/?url=${encodeURIComponent(url)}&w=240&h=240&fit=cover&output=webp&q=90&sharp=3`;
}

function parseWhen(when: string): { dayTime: string; date: string } {
	const m = when.match(/(\w{3}),\s+(\d+\s+\w+),\s+(.+)/);
	if (!m) return { dayTime: when, date: "" };
	return { dayTime: `${m[1]} · ${m[3]}`, date: m[2] };
}

export function JourneyNearbyEvents({ suburb }: Props) {
	const prefersReducedMotion = useReducedMotion();
	const [events, setEvents] = useState<NearbyEventRecord[]>([]);
	const [loadState, setLoadState] = useState<LoadState>("loading");

	useEffect(() => {
		let cancelled = false;
		setLoadState("loading");
		fetch(`/api/nearby-events?suburb=${encodeURIComponent(suburb)}`)
			.then((r) => r.json() as Promise<NearbyEventRecord[]>)
			.then((data) => {
				if (cancelled) return;
				const results = Array.isArray(data) ? data.slice(0, 8) : [];
				setEvents(results);
				setLoadState(results.length > 0 ? "success" : "empty");
			})
			.catch(() => {
				if (!cancelled) setLoadState("error");
			});
		return () => {
			cancelled = true;
		};
	}, [suburb]);

	return (
		<motion.section
			aria-label={`Community events near ${suburb}`}
			initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-8% 0px" }}
			transition={{
				duration: prefersReducedMotion ? 0.01 : 0.45,
				ease: [0.22, 1, 0.36, 1],
			}}
		>
			{/* Header */}
			<div className="mb-3 flex items-center gap-3">
				<div
					className="h-7 w-1 rounded-full bg-minuri-teal"
					aria-hidden
				/>
				<h2 className="text-xl font-black text-minuri-ocean md:text-2xl">
					Community events near {suburb}
				</h2>
			</div>
			<p className="mb-6 max-w-xl text-sm leading-relaxed text-minuri-slate">
				Feeling settled takes time — but it starts with showing up
				somewhere. These events are happening near you this week. You
				don&apos;t need to know anyone to go.
			</p>

			{loadState === "loading" && (
				<div className="flex items-center gap-2 py-4 text-sm text-minuri-slate">
					<Loader2 className="size-4 animate-spin" />
					Finding events near {suburb}...
				</div>
			)}
			{loadState === "error" && (
				<p className="py-4 text-sm text-minuri-slate">
					Could not load events right now.
				</p>
			)}
			{loadState === "empty" && (
				<p className="py-4 text-sm text-minuri-slate">
					No events found near {suburb} this week.
				</p>
			)}

			{loadState === "success" && (
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					{events.map((event, i) => {
						const { dayTime, date } = parseWhen(event.date.when);
						const venue =
							event.venue?.name ?? event.address[0] ?? "";
						const fallback =
							FALLBACK_GRADIENTS[i % FALLBACK_GRADIENTS.length];

						return (
							<motion.a
								key={`${event.title}-${i}`}
								href={event.link ?? "#"}
								target={event.link ? "_blank" : undefined}
								rel="noopener noreferrer"
								initial={{ opacity: 0 }}
								whileInView={{ opacity: 1 }}
								viewport={{ once: true }}
								transition={{
									duration: prefersReducedMotion
										? 0.01
										: 0.25,
									delay: prefersReducedMotion ? 0 : i * 0.04,
								}}
								className="group flex items-start gap-5 rounded-xl p-4 transition-colors hover:bg-minuri-fog/60"
							>
								{/* Small thumbnail */}
								<div className="relative size-24 shrink-0 overflow-hidden rounded-xl sm:size-28">
									{event.thumbnail ? (
										<Image
											src={upscale(event.thumbnail)}
											alt=""
											fill
											className="object-cover"
											sizes="112px"
										/>
									) : (
										<div
											className={`absolute inset-0 bg-gradient-to-br ${fallback}`}
										/>
									)}
								</div>

								{/* Content */}
								<div className="min-w-0 flex-1">
									{date && (
										<p className="mb-0.5 text-[11px] font-bold uppercase tracking-wider text-minuri-teal">
											{date}
										</p>
									)}
									<div className="flex items-start gap-1.5">
										<p className="line-clamp-2 text-base font-bold leading-snug text-minuri-ocean transition-colors group-hover:text-minuri-teal">
											{event.title}
										</p>
										<ArrowUpRight
											className="mt-0.5 size-5 shrink-0 text-minuri-silver transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-minuri-teal"
											aria-hidden
										/>
									</div>
									<p className="mt-0.5 text-xs text-minuri-slate">
										{dayTime}
									</p>
									{venue && (
										<p className="mt-0.5 truncate text-xs text-minuri-slate/60">
											{venue}
										</p>
									)}
									{event.description && (
										<p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-minuri-mid">
											{event.description}
										</p>
									)}
								</div>
							</motion.a>
						);
					})}
				</div>
			)}
		</motion.section>
	);
}
