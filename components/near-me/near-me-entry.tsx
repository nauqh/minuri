"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, CheckCircle2, Loader2, MapPin, Search } from "lucide-react";

import { cn } from "@/lib/utils";
import {
	normalizeSuburbName,
	rankAndFilterSuburbs,
	type SuburbOption,
} from "@/lib/suburbs";
import { getAllTopicsMeta, type NearMeTopic } from "@/lib/near-me";

const ALL_TOPICS = getAllTopicsMeta();
const EASE_OUT = [0.22, 1, 0.36, 1] as const;

// Match landing hero section colors exactly
const ENTRY_COLORS: Record<NearMeTopic, string> = {
	"food-eating": "#00f5c8",
	"getting-around": "#5dd6ff",
	"health-wellbeing": "#fcf300",
	"home-admin": "#ffc2d1",
	"social-belonging": "#cae9ff",
};

const TOPIC_WORDS: Record<NearMeTopic, string> = {
	"food-eating": "eat",
	"getting-around": "travel",
	"health-wellbeing": "heal",
	"home-admin": "settle",
	"social-belonging": "belong",
};

export function NearMeEntry() {
	const router = useRouter();
	const [selectedTopic, setSelectedTopic] =
		useState<NearMeTopic>("food-eating");
	const [query, setQuery] = useState("");
	const [options, setOptions] = useState<SuburbOption[]>([]);
	const [selected, setSelected] = useState<SuburbOption | null>(null);
	const [activeIndex, setActiveIndex] = useState(-1);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const skipNextSearchRef = useRef(false);
	const listboxId = useId();
	const [debouncedQuery, setDebouncedQuery] = useState("");

	useEffect(() => {
		const t = window.setTimeout(() => setDebouncedQuery(query), 250);
		return () => window.clearTimeout(t);
	}, [query]);

	useEffect(() => {
		let cancelled = false;
		const normalizedQuery = normalizeSuburbName(debouncedQuery);

		if (skipNextSearchRef.current) {
			skipNextSearchRef.current = false;
			setLoading(false);
			setError("");
			return;
		}

		if (!normalizedQuery || normalizedQuery.length < 3) {
			setOptions([]);
			setLoading(false);
			setError("");
			return;
		}

		async function loadSuburbs() {
			setLoading(true);
			setError("");
			try {
				const res = await fetch(
					`/api/suburbs?q=${encodeURIComponent(normalizedQuery)}`,
				);
				if (!res.ok) throw new Error("Failed");
				const payload = (await res.json()) as {
					suburbs?: SuburbOption[];
				};
				if (!cancelled) setOptions(payload.suburbs ?? []);
			} catch {
				if (!cancelled) setError("Could not load suburbs right now.");
			} finally {
				if (!cancelled) setLoading(false);
			}
		}

		void loadSuburbs();
		return () => {
			cancelled = true;
		};
	}, [debouncedQuery]);

	const suggestions = useMemo(
		() => rankAndFilterSuburbs(options, query),
		[options, query],
	);
	const normalizedQuery = normalizeSuburbName(query);
	const hasConfirmedSelection =
		selected !== null &&
		normalizeSuburbName(selected.locality).toLowerCase() ===
			normalizedQuery.toLowerCase();
	const shouldShowSuggestionsPanel =
		!hasConfirmedSelection &&
		(loading || Boolean(error) || normalizedQuery.length > 0);
	const activeOption =
		activeIndex >= 0 && activeIndex < suggestions.length
			? suggestions[activeIndex]
			: null;

	function resetSelection() {
		setSelected(null);
		setQuery("");
		setActiveIndex(-1);
		setError("");
	}

	function submitWithSuburb(value: string) {
		const normalized = normalizeSuburbName(value);
		if (!normalized) return;
		router.push(
			`/near-me?suburb=${encodeURIComponent(normalized)}&category=${selectedTopic}`,
		);
	}

	const topicMeta = ALL_TOPICS.find((t) => t.slug === selectedTopic)!;
	const suburbLabel = selected?.locality ?? "";
	const submitLabel = suburbLabel
		? `Find ${topicMeta.label} near ${suburbLabel}`
		: `Find ${topicMeta.label} near me`;

	return (
		<div className="flex h-screen flex-col overflow-hidden lg:flex-row">
			{/* ── Brand panel ── */}
			<div className="hidden h-full lg:flex lg:w-[42%] xl:w-[44%] flex-col justify-between bg-minuri-ocean px-10 py-8 xl:px-14 xl:py-12">
				<Link
					href="/"
					className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 px-3.5 py-1.5 text-xs font-medium text-white/60 transition hover:border-white/30 hover:text-white/80"
				>
					<ArrowLeft className="size-3.5" aria-hidden />
					Back to home
				</Link>

				<div>
					<p className="mb-4 text-xs font-semibold uppercase tracking-widest text-minuri-teal/70 2xl:text-sm">
						Near Me
					</p>
					<h2 className="text-[2.75rem] xl:text-[3.25rem] 2xl:text-[4rem] font-black leading-[1.06] tracking-tight text-white">
						What you need, <br />
						<span className="text-white/40">
							right where you are.
						</span>
					</h2>

					{/* Animated topic word */}
					<div className="mt-8 flex items-baseline gap-3">
						<span className="text-sm text-white/35 2xl:text-base">
							Right now, you need to
						</span>
						<div className="relative h-9 overflow-hidden 2xl:h-11">
							<AnimatePresence mode="wait">
								<motion.span
									key={selectedTopic}
									initial={{ y: 20, opacity: 0 }}
									animate={{ y: 0, opacity: 1 }}
									exit={{ y: -20, opacity: 0 }}
									transition={{
										duration: 0.28,
										ease: EASE_OUT,
									}}
									className="block text-[1.65rem] font-black leading-none 2xl:text-[2.1rem]"
									style={{
										color: ENTRY_COLORS[selectedTopic],
									}}
								>
									{TOPIC_WORDS[selectedTopic]}
								</motion.span>
							</AnimatePresence>
						</div>
					</div>

					<p className="mt-10 max-w-xs text-sm leading-relaxed text-white/40 2xl:text-base 2xl:max-w-sm">
						Essential services for newcomers in Melbourne — food,
						transport, health, admin, and community, all mapped to
						your suburb.
					</p>
				</div>

				<p className="text-[0.65rem] tracking-wide text-white/20">
					Suburb-aware · No sign-up required · Melbourne
				</p>
			</div>

			{/* ── Form panel ── */}
			<div className="flex h-full flex-1 flex-col items-center justify-center overflow-y-auto bg-minuri-fog px-5 py-6 md:px-8">
				<Link
					href="/"
					className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-minuri-silver/80 bg-minuri-white px-3.5 py-1.5 text-xs font-medium text-minuri-slate transition hover:scale-105 lg:hidden"
				>
					<ArrowLeft className="size-3.5" aria-hidden />
					Back to home
				</Link>

				<div className="w-full max-w-[460px] 2xl:max-w-[560px]">
					{/* Topic selection */}
					<div className="mb-3">
						<h1 className="text-xl font-black tracking-tight text-minuri-ocean md:text-2xl 2xl:text-3xl">
							What&apos;s on your mind?
						</h1>
						<p className="mt-1.5 text-sm text-minuri-slate 2xl:text-base">
							Pick what fits — we&apos;ll find what&apos;s near
							you.
						</p>
					</div>

					<div className="overflow-hidden rounded-2xl border border-minuri-silver/40 bg-minuri-white shadow-[0_4px_24px_-8px_rgba(4,30,43,0.10)]">
						{ALL_TOPICS.map((t, i) => {
							const isSelected = selectedTopic === t.slug;
							const color = ENTRY_COLORS[t.slug];
							return (
								<motion.button
									key={t.slug}
									type="button"
									onClick={() => setSelectedTopic(t.slug)}
									className={cn(
										"group relative flex w-full items-center gap-4 px-5 py-4 text-left 2xl:px-6 2xl:py-5",
										i < ALL_TOPICS.length - 1 &&
											"border-b border-minuri-silver/30",
									)}
									initial={false}
									animate={{
										backgroundColor: isSelected
											? `${color}30`
											: "rgba(0,0,0,0)",
									}}
									whileHover={
										!isSelected
											? {
													boxShadow:
														"inset 0 0 0 1px rgba(4,30,43,0.08)",
												}
											: {}
									}
									transition={{
										duration: 0.22,
										ease: [0.22, 1, 0.36, 1],
									}}
								>
									{/* Left accent bar */}
									<motion.div
										className="absolute left-0 top-0 h-full w-[3px]"
										style={{ backgroundColor: color }}
										initial={false}
										animate={{
											scaleY: isSelected ? 1 : 0,
											opacity: isSelected ? 1 : 0,
										}}
										transition={{
											duration: 0.2,
											ease: EASE_OUT,
										}}
									/>

									{/* Text */}
									<div className="min-w-0 flex-1 pl-1">
										<p
											className={cn(
												"font-hero-serif text-[1rem] leading-snug transition-colors duration-150 2xl:text-[1.15rem]",
												isSelected
													? "text-minuri-ocean"
													: "text-minuri-mid/70",
											)}
										>
											&ldquo;{t.tagline}&rdquo;
										</p>
										<p
											className={cn(
												"mt-0.5 text-xs font-medium transition-colors duration-150 2xl:text-sm",
												isSelected
													? "text-minuri-mid"
													: "text-minuri-slate/60",
											)}
										>
											{t.label}
										</p>
									</div>

									{/* Radio dot */}
									<div
										className={cn(
											"size-4 shrink-0 rounded-full border-2 transition-all duration-200",
											isSelected
												? "border-transparent"
												: "border-minuri-silver/60 group-hover:border-minuri-silver",
										)}
										style={
											isSelected
												? {
														backgroundColor: color,
														borderColor: color,
													}
												: {}
										}
									/>
								</motion.button>
							);
						})}
					</div>

					{/* Divider */}
					<div className="my-3 flex items-center gap-3 px-1">
						<div className="h-px flex-1 bg-minuri-silver/50" />
						<span className="text-xs font-medium text-minuri-slate/40 2xl:text-sm">
							then
						</span>
						<div className="h-px flex-1 bg-minuri-silver/50" />
					</div>

					{/* Suburb form */}
					<div className="rounded-2xl border border-minuri-silver/40 bg-minuri-white px-6 py-4 shadow-[0_4px_24px_-8px_rgba(4,30,43,0.10)]">
						<p className="mb-3 text-sm font-semibold text-minuri-mid 2xl:text-base">
							Which suburb are you in?
						</p>

						<form
							onSubmit={(e) => {
								e.preventDefault();
								const nextSuburb =
									selected?.locality ??
									activeOption?.locality ??
									suggestions[0]?.locality ??
									query;
								submitWithSuburb(nextSuburb);
							}}
						>
							<div className="relative">
								<Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-minuri-silver" />
								<input
									value={query}
									disabled={hasConfirmedSelection}
									onChange={(e) => {
										setQuery(e.target.value);
										setSelected(null);
										setActiveIndex(-1);
									}}
									onKeyDown={(e) => {
										if (e.key === "ArrowDown") {
											e.preventDefault();
											setActiveIndex((p) =>
												suggestions.length === 0
													? -1
													: Math.min(
															p + 1,
															suggestions.length -
																1,
														),
											);
										} else if (e.key === "ArrowUp") {
											e.preventDefault();
											setActiveIndex((p) =>
												Math.max(p - 1, 0),
											);
										} else if (e.key === "Escape") {
											e.preventDefault();
											setActiveIndex(-1);
										} else if (
											e.key === "Enter" &&
											activeOption
										) {
											e.preventDefault();
											setSelected(activeOption);
											skipNextSearchRef.current = true;
											setQuery(activeOption.locality);
											setActiveIndex(-1);
										}
									}}
									placeholder="Type your suburb or postcode"
									role="combobox"
									aria-autocomplete="list"
									aria-expanded={
										!hasConfirmedSelection &&
										!loading &&
										!error &&
										suggestions.length > 0
									}
									aria-controls={listboxId}
									aria-activedescendant={
										activeOption
											? `suburb-option-${activeOption.id}`
											: undefined
									}
									className={cn(
										"h-12 w-full rounded-xl border pl-10 pr-4 text-sm outline-none transition",
										hasConfirmedSelection
											? "cursor-not-allowed border-minuri-teal/60 bg-minuri-teal/5"
											: "border-minuri-silver bg-minuri-fog/50 focus:border-minuri-teal focus:ring-2 focus:ring-minuri-teal/15",
									)}
								/>
							</div>

							{hasConfirmedSelection ? (
								<div className="mt-2.5 flex items-center justify-between gap-2">
									<span className="inline-flex items-center gap-1.5 text-xs font-semibold text-minuri-teal">
										<CheckCircle2
											className="size-3.5"
											aria-hidden
										/>
										{selected?.locality}
									</span>
									<button
										type="button"
										onClick={resetSelection}
										className="rounded-full border border-minuri-silver/70 px-2.5 py-1 text-[0.68rem] font-semibold text-minuri-slate transition hover:border-minuri-teal/40 hover:text-minuri-teal"
									>
										Change
									</button>
								</div>
							) : (
								<p className="mt-2 text-[0.72rem] text-minuri-slate/50">
									Type at least 3 characters to see matches.
								</p>
							)}

							{shouldShowSuggestionsPanel && (
								<div
									id={listboxId}
									role="listbox"
									className="mt-3 max-h-56 overflow-y-auto rounded-xl border border-minuri-silver/40 bg-minuri-white shadow-sm"
								>
									{loading && (
										<div className="flex items-center gap-2 px-4 py-3 text-sm text-minuri-slate">
											<Loader2 className="size-4 animate-spin text-minuri-teal" />
											Loading suburbs…
										</div>
									)}
									{!loading && error && (
										<div className="px-4 py-3 text-sm text-rose-600">
											{error}
										</div>
									)}
									{!loading &&
										!error &&
										suggestions.length === 0 && (
											<div className="px-4 py-3 text-sm text-minuri-slate">
												{normalizedQuery.length < 3
													? "Keep typing…"
													: "No matching suburb."}
											</div>
										)}
									{!loading &&
										!error &&
										suggestions.map((opt) => (
											<button
												key={opt.id}
												type="button"
												role="option"
												id={`suburb-option-${opt.id}`}
												aria-selected={
													selected?.id === opt.id ||
													activeOption?.id === opt.id
												}
												onMouseDown={(e) =>
													e.preventDefault()
												}
												onClick={() => {
													setSelected(opt);
													skipNextSearchRef.current = true;
													setQuery(opt.locality);
													setActiveIndex(-1);
												}}
												className={cn(
													"flex w-full items-start gap-3 px-4 py-3 text-left text-sm transition hover:bg-minuri-fog",
													selected?.id === opt.id ||
														activeOption?.id ===
															opt.id
														? "bg-minuri-teal/8 ring-1 ring-inset ring-minuri-teal/30"
														: "",
												)}
											>
												<MapPin className="mt-0.5 size-3.5 shrink-0 text-minuri-teal" />
												<span>
													<span className="font-medium text-minuri-mid">
														{opt.locality}
													</span>
													<span className="ml-1.5 text-xs text-minuri-slate">
														{opt.state}{" "}
														{opt.postcode}
													</span>
													<span className="block text-xs text-minuri-slate/60">
														{opt.largerRegion}
													</span>
												</span>
											</button>
										))}
								</div>
							)}

							<button
								type="submit"
								disabled={
									!query.trim() &&
									!selected &&
									suggestions.length === 0
								}
								className="mt-4 flex h-12 w-full items-center justify-center rounded-xl bg-[linear-gradient(120deg,color-mix(in_oklch,var(--minuri-seafoam)_58%,var(--minuri-teal))_0%,color-mix(in_oklch,var(--minuri-teal)_78%,var(--minuri-seafoam))_100%)] px-5 text-sm font-semibold text-white shadow-[0_8px_20px_-10px_color-mix(in_oklch,var(--minuri-mid)_40%,transparent)] transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
							>
								{submitLabel}
							</button>
						</form>
					</div>

					<p className="mt-3 text-center text-[0.7rem] text-minuri-slate/40">
						Your location stays on your device · No account needed
					</p>
				</div>
			</div>
		</div>
	);
}
