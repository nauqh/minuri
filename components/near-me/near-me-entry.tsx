"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, MapPin, Search } from "lucide-react";

import { cn } from "@/lib/utils";
import {
	DEFAULT_SUBURB_LIMIT,
	normalizeSuburbName,
	rankAndFilterSuburbs,
	type SuburbOption,
} from "@/lib/suburbs";

export function NearMeEntry() {
	const router = useRouter();
	const [query, setQuery] = useState("");
	const [options, setOptions] = useState<SuburbOption[]>([]);
	const [selected, setSelected] = useState<SuburbOption | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		let cancelled = false;

		async function loadSuburbs() {
			setLoading(true);
			setError("");
			try {
				const suburbsParams = new URLSearchParams({
					limit: String(DEFAULT_SUBURB_LIMIT),
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
	}, []);

	const suggestions = useMemo(
		() => rankAndFilterSuburbs(options, query, DEFAULT_SUBURB_LIMIT),
		[options, query],
	);

	function submitWithSuburb(value: string) {
		const normalized = normalizeSuburbName(value);
		if (!normalized) return;
		const params = new URLSearchParams({
			suburb: normalized,
			category: "survive",
		});
		router.push(`/near-me?${params.toString()}`);
	}

	function onSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		submitWithSuburb(selected?.locality || query);
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

				<form onSubmit={onSubmit} className="mt-6">
					<div className="relative">
						<Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-minuri-silver" />
						<input
							value={query}
							onChange={(event) => {
								setQuery(event.target.value);
								setSelected(null);
							}}
							placeholder="Type your suburb or postcode"
							className="h-12 w-full rounded-xl border border-minuri-silver bg-minuri-fog/50 pl-10 pr-3 text-sm outline-none ring-minuri-teal/30 transition focus:border-minuri-teal focus:ring-2"
						/>
					</div>

					<div className="mt-3 max-h-72 overflow-y-auto rounded-xl border border-minuri-silver/40 bg-minuri-white">
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
								No matching suburb yet.
							</div>
						)}
						{!loading &&
							!error &&
							suggestions.map((option) => (
								<button
									key={option.id}
									type="button"
									onClick={() => {
										setSelected(option);
										setQuery(option.locality);
									}}
									className={cn(
										"flex w-full items-start gap-2 px-3 py-2.5 text-left text-sm transition hover:bg-minuri-fog",
										selected?.id === option.id
											? "bg-minuri-teal/10"
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

					<button
						type="submit"
						disabled={!query.trim() && !selected}
						className="mt-4 inline-flex h-11 items-center justify-center rounded-full bg-minuri-mid px-5 text-sm font-medium text-minuri-white transition hover:bg-minuri-ocean disabled:cursor-not-allowed disabled:opacity-60"
					>
						Show services near me
					</button>
				</form>
			</div>
		</div>
	);
}
