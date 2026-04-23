"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2, MapPin, Search } from "lucide-react";

import { cn } from "@/lib/utils";
import {
	normalizeSuburbName,
	rankAndFilterSuburbs,
	type SuburbOption,
} from "@/lib/suburbs";

export function NearMeEntry() {
	const router = useRouter();
	const [query, setQuery] = useState("");
	const [options, setOptions] = useState<SuburbOption[]>([]);
	const [selected, setSelected] = useState<SuburbOption | null>(null);
	const [activeIndex, setActiveIndex] = useState(-1);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const skipNextSearchRef = useRef(false);
	const listboxId = useId();
	const [debouncedQuery, setDebouncedQuery] = useState("");

	useEffect(() => {
		const timer = window.setTimeout(() => {
			setDebouncedQuery(query);
		}, 250);
		return () => {
			window.clearTimeout(timer);
		};
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

		if (!normalizedQuery) {
			setOptions([]);
			setLoading(false);
			setError("");
			return;
		}

		// Match common autocomplete UX: wait for a few characters
		// before showing network-backed suggestions.
		if (normalizedQuery.length < 3) {
			setOptions([]);
			setLoading(false);
			setError("");
			return;
		}

		async function loadSuburbs() {
			setLoading(true);
			setError("");
			try {
				const suburbsParams = new URLSearchParams({
					q: normalizedQuery,
				});
				const suburbsResponse = await fetch(
					`/api/suburbs?${suburbsParams.toString()}`,
				);
				if (!suburbsResponse.ok) {
					throw new Error("Failed to fetch suburb data");
				}
				const suburbsPayload = (await suburbsResponse.json()) as {
					suburbs?: SuburbOption[];
				};
				if (!cancelled) {
					setOptions(suburbsPayload.suburbs ?? []);
				}
			} catch {
				if (!cancelled) {
					setError("Could not load suburbs right now.");
				}
			} finally {
				if (!cancelled) {
					setLoading(false);
				}
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
		const params = new URLSearchParams({
			suburb: normalized,
			category: "survive",
		});
		router.push(`/near-me?${params.toString()}`);
	}

	return (
		<div className="min-h-screen bg-minuri-fog px-4 py-10 md:px-6 md:py-16">
			<div className="mx-auto max-w-2xl rounded-2xl border border-minuri-silver/50 bg-minuri-white p-6 shadow-sm md:p-8">
				<p className="text-xs font-semibold uppercase tracking-[0.15em] text-minuri-teal">
					Near Me
				</p>
				<h1 className="mt-3 text-2xl font-semibold tracking-tight text-minuri-mid md:text-3xl">
					Where do you live?
				</h1>
				<p className="mt-2 text-sm text-minuri-slate">
					We&apos;ll show nearby essentials based on your suburb.
				</p>
				<p className="mt-3 rounded-lg bg-minuri-fog px-3 py-2 text-xs text-minuri-slate">
					Step 1: choose your suburb from the list. Step 2: tap
					Continue.
				</p>

				<form
					onSubmit={(event) => {
						event.preventDefault();
						const nextSuburb =
							selected?.locality ??
							activeOption?.locality ??
							suggestions[0]?.locality ??
							query;
						submitWithSuburb(nextSuburb);
					}}
					className="mt-6"
				>
					<div className="relative">
						<Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-minuri-silver" />
						<input
							value={query}
							disabled={hasConfirmedSelection}
							onChange={(event) => {
								setQuery(event.target.value);
								setSelected(null);
								setActiveIndex(-1);
							}}
							onKeyDown={(event) => {
								if (event.key === "ArrowDown") {
									event.preventDefault();
									setActiveIndex((prev) => {
										if (suggestions.length === 0) return -1;
										return Math.min(
											prev + 1,
											suggestions.length - 1,
										);
									});
									return;
								}
								if (event.key === "ArrowUp") {
									event.preventDefault();
									setActiveIndex((prev) =>
										Math.max(prev - 1, 0),
									);
									return;
								}
								if (event.key === "Escape") {
									event.preventDefault();
									setActiveIndex(-1);
									return;
								}
								if (event.key === "Enter" && activeOption) {
									event.preventDefault();
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
								"h-12 w-full rounded-xl border pl-10 pr-3 text-sm outline-none transition",
								hasConfirmedSelection
									? "cursor-not-allowed border-minuri-teal/70 bg-minuri-teal/5 focus:border-minuri-teal"
									: "border-minuri-silver bg-minuri-fog/50 focus:border-minuri-teal",
							)}
						/>
					</div>
					{hasConfirmedSelection ? (
						<div className="mt-2 flex items-center justify-between gap-2">
							<span className="inline-flex items-center gap-1.5 text-xs font-semibold text-minuri-teal">
								<CheckCircle2 className="size-3.5" aria-hidden />
								Suburb set to {selected?.locality}
							</span>
							<button
								type="button"
								onClick={resetSelection}
								className="rounded-full border border-minuri-silver/80 bg-minuri-white px-2.5 py-1 text-[0.68rem] font-semibold text-minuri-slate transition-colors hover:border-minuri-teal/45 hover:text-minuri-teal"
							>
								Reset
							</button>
						</div>
					) : (
						<p className="mt-2 text-xs text-minuri-slate">
							Start typing at least 3 characters to see suburb
							matches.
						</p>
					)}

					{shouldShowSuggestionsPanel && (
						<div
							id={listboxId}
							role="listbox"
							className="mt-3 max-h-72 overflow-y-auto rounded-xl border border-minuri-silver/40 bg-minuri-white"
						>
							{loading && (
								<div className="flex items-center gap-2 px-3 py-3 text-sm text-minuri-slate">
									<Loader2 className="size-4 animate-spin" />
									Loading suburbs...
								</div>
							)}
							{!loading && error && (
								<div className="px-3 py-3 text-sm text-rose-700">
									{error}
								</div>
							)}
							{!loading && !error && suggestions.length === 0 && (
								<div className="px-3 py-3 text-sm text-minuri-slate">
									{normalizedQuery.length > 0 &&
									normalizedQuery.length < 3
										? "Keep typing to search suburbs."
										: "No matching suburb yet."}
								</div>
							)}
							{!loading &&
								!error &&
								suggestions.map((option) => (
									<button
										key={option.id}
										type="button"
										role="option"
										id={`suburb-option-${option.id}`}
										aria-selected={
											selected?.id === option.id ||
											activeOption?.id === option.id
										}
										onMouseDown={(event) => {
											event.preventDefault();
										}}
										onClick={() => {
											setSelected(option);
											skipNextSearchRef.current = true;
											setQuery(option.locality);
											setActiveIndex(-1);
										}}
										className={cn(
											"flex w-full items-start gap-2 px-3 py-2.5 text-left text-sm transition hover:bg-minuri-fog",
											selected?.id === option.id ||
												activeOption?.id === option.id
												? "bg-minuri-teal/10 ring-1 ring-minuri-teal/40"
												: "bg-transparent",
										)}
									>
										<MapPin className="mt-0.5 size-3.5 shrink-0 text-minuri-teal" />
										<span>
											<span className="font-medium text-minuri-mid">
												{option.locality}
											</span>
											<span className="ml-1 text-minuri-slate">
												{option.state} {option.postcode}
											</span>
											<span className="block text-xs text-minuri-slate/80">
												{option.largerRegion}
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
						className="mt-4 flex h-11 w-full items-center justify-center rounded-full bg-minuri-mid px-5 text-sm font-medium text-minuri-white transition hover:bg-minuri-ocean disabled:cursor-not-allowed disabled:opacity-60"
					>
						Continue to nearby services
					</button>
				</form>
			</div>
		</div>
	);
}
