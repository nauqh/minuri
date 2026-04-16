"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
	ChevronDown,
	Clock,
	ExternalLink,
	List,
	LocateFixed,
	Map,
	MapPin,
	Phone,
	Search,
	Star,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { rankAndFilterSuburbs, type SuburbOption } from "@/lib/suburbs";
import {
	NEAR_ME_TOPICS,
	type NearMeTopic,
	type NearMePlace,
	type Subtype,
	type TopicLayout,
	formatNumber,
	getAllTopicsMeta,
	getContextHeading,
	getMockPlaces,
	getSuburbDisplayName,
	getTopicMeta,
} from "@/lib/near-me";

const NearMeMap = dynamic(
	() =>
		import("@/components/near-me/near-me-map").then((mod) => mod.NearMeMap),
	{
		ssr: false,
		loading: () => (
			<div className="flex h-full items-center justify-center bg-minuri-fog">
				<MapPin className="size-8 animate-pulse text-minuri-silver" />
			</div>
		),
	},
);

// ── Types ──

type NearMeViewProps = {
	initialTopic: NearMeTopic;
	initialSuburb: string;
};

type LoadState =
	| "idle"
	| "loading"
	| "success"
	| "empty"
	| "error"
	| "rate-limit";

// ── Main component ──

export function NearMeView({ initialTopic, initialSuburb }: NearMeViewProps) {
	const router = useRouter();
	const pathname = usePathname();
	const enabledTopics = useMemo(
		() => new Set<NearMeTopic>(["survive", "health"]),
		[],
	);

	// Location context (set once, persists)
	const [suburb, setSuburb] = useState(initialSuburb || "Melbourne");
	const [locationPickerOpen, setLocationPickerOpen] = useState(false);
	const [locationQuery, setLocationQuery] = useState("");
	const [suburbOptions, setSuburbOptions] = useState<SuburbOption[]>([]);
	const [suburbLoading, setSuburbLoading] = useState(false);
	const [suburbError, setSuburbError] = useState("");
	const [youngAdultPopulation, setYoungAdultPopulation] = useState<
		number | null
	>(null);
	const [usingLocation, setUsingLocation] = useState(false);
	const locationRef = useRef<HTMLDivElement>(null);

	// Browsing state
	const [topic, setTopic] = useState<NearMeTopic>(
		enabledTopics.has(initialTopic) ? initialTopic : "survive",
	);
	const [activeSubtype, setActiveSubtype] = useState<string | null>(null);
	const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
	const [places, setPlaces] = useState<NearMePlace[]>([]);
	const [status, setStatus] = useState<LoadState>("idle");
	const [message, setMessage] = useState("");
	const [mobilePane, setMobilePane] = useState<"list" | "map">("list");
	const rowRefs = useRef<Record<string, HTMLDivElement | null>>({});

	// Derived
	const displaySuburb = getSuburbDisplayName(suburb || "Melbourne");
	const topicMeta = getTopicMeta(topic);
	const allTopics = getAllTopicsMeta();
	const subtypes: Subtype[] = topicMeta.subtypes;
	const layout: TopicLayout = topicMeta.layout;
	const heading = getContextHeading(topic, displaySuburb);
	const suggestions = useMemo(
		() => rankAndFilterSuburbs(suburbOptions, locationQuery),
		[locationQuery, suburbOptions],
	);

	// Close location picker on outside click
	useEffect(() => {
		function onClickOutside(event: MouseEvent) {
			if (
				locationRef.current &&
				!locationRef.current.contains(event.target as Node)
			) {
				setLocationPickerOpen(false);
			}
		}
		document.addEventListener("mousedown", onClickOutside);
		return () => document.removeEventListener("mousedown", onClickOutside);
	}, []);

	// Sync URL
	useEffect(() => {
		const query = new URLSearchParams();
		if (topic) query.set("category", topic);
		if (displaySuburb) query.set("suburb", displaySuburb);
		router.replace(`${pathname}?${query.toString()}`, { scroll: false });
	}, [topic, displaySuburb, pathname, router]);

	// Load suburb options for picker
	useEffect(() => {
		let cancelled = false;

		async function loadSuburbs() {
			setSuburbLoading(true);
			setSuburbError("");
			try {
				const suburbsResponse = await fetch("/api/suburbs");
				if (!suburbsResponse.ok) {
					throw new Error("Failed to fetch suburb data");
				}
				const suburbsPayload = (await suburbsResponse.json()) as {
					suburbs?: SuburbOption[];
				};
				if (!cancelled) {
					setSuburbOptions(suburbsPayload.suburbs ?? []);
				}
			} catch {
				if (!cancelled) {
					setSuburbError("Could not load suburb suggestions.");
				}
			} finally {
				if (!cancelled) {
					setSuburbLoading(false);
				}
			}
		}

		void loadSuburbs();
		return () => {
			cancelled = true;
		};
	}, []);

	// Auto-fetch on context changes
	useEffect(() => {
		fetchPlaces();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [topic, activeSubtype, displaySuburb]);

	// Fetch live young-adult population by suburb
	useEffect(() => {
		let cancelled = false;

		async function loadPopulation() {
			try {
				const params = new URLSearchParams({ location: displaySuburb });
				const response = await fetch(
					`/api/population?${params.toString()}`,
				);
				if (!response.ok) {
					throw new Error("Failed to load population");
				}
				const payload = (await response.json()) as {
					youngAdultPopulation?: number;
				};
				if (!cancelled) {
					setYoungAdultPopulation(
						typeof payload.youngAdultPopulation === "number"
							? payload.youngAdultPopulation
							: null,
					);
				}
			} catch {
				if (!cancelled) {
					setYoungAdultPopulation(null);
				}
			}
		}

		if (!displaySuburb) {
			setYoungAdultPopulation(null);
			return;
		}
		void loadPopulation();
		return () => {
			cancelled = true;
		};
	}, [displaySuburb]);

	const onSelectPlace = useCallback((placeId: string) => {
		setSelectedPlaceId(placeId);
		rowRefs.current[placeId]?.scrollIntoView({
			block: "nearest",
			behavior: "smooth",
		});
	}, []);

	function fetchPlaces() {
		if (!displaySuburb) return;
		setStatus("loading");
		setMessage("");

		window.setTimeout(() => {
			const next = getMockPlaces({
				suburb: displaySuburb,
				topic,
				subtype: activeSubtype ?? undefined,
				useLocation: usingLocation,
			});

			if (!next.length) {
				setStatus("empty");
				setMessage(topicMeta.emptyPrompt);
				setPlaces([]);
				setSelectedPlaceId(null);
				return;
			}

			setPlaces(next);
			setSelectedPlaceId(next[0]?.id ?? null);
			setStatus("success");
		}, 350);
	}

	function pickSuburb(s: string) {
		setSuburb(s);
		setLocationPickerOpen(false);
		setLocationQuery("");
	}

	function useMyLocation() {
		setUsingLocation(true);
		setSuburb(suggestions[0]?.locality ?? "Carlton");
		setLocationPickerOpen(false);
	}

	function switchTopic(t: NearMeTopic) {
		if (!enabledTopics.has(t)) return;
		setTopic(t);
		setActiveSubtype(null);
	}

	// Layout split ratios
	const listWidth =
		layout === "list-focus"
			? "lg:w-[55%] xl:w-[52%]"
			: layout === "card-grid"
				? "lg:w-[50%]"
				: "lg:w-[38%] xl:w-[36%]";

	return (
		<div className="flex h-screen flex-col overflow-hidden bg-minuri-fog">
			{/* ═══ Layer 1: Location context strip ═══ */}
			<div className="shrink-0 border-b border-minuri-silver/50 bg-minuri-white px-4 py-2 md:px-6">
				<div className="mx-auto flex max-w-[1440px] items-center gap-3">
					<div ref={locationRef} className="relative">
						<button
							type="button"
							onClick={() =>
								setLocationPickerOpen(!locationPickerOpen)
							}
							className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-minuri-fog px-3 py-1.5 text-sm font-medium text-minuri-mid transition hover:bg-minuri-mist"
						>
							<MapPin className="size-3.5 text-minuri-teal" />
							{displaySuburb}
							<ChevronDown className="size-3 text-minuri-slate" />
						</button>

						{locationPickerOpen && (
							<div className="absolute left-0 top-full z-40 mt-1.5 w-72 overflow-hidden rounded-xl border border-minuri-silver/70 bg-minuri-white shadow-xl">
								<div className="p-3">
									<div className="relative">
										<Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-minuri-silver" />
										<input
											autoFocus
											value={locationQuery}
											onChange={(e) =>
												setLocationQuery(e.target.value)
											}
											placeholder="Search suburb..."
											className="h-10 w-full rounded-lg border border-minuri-silver bg-minuri-fog/50 pl-8 pr-3 text-sm outline-none ring-minuri-teal/30 transition focus:border-minuri-teal focus:ring-2"
										/>
									</div>
								</div>
								<button
									type="button"
									onClick={useMyLocation}
									className="flex w-full cursor-pointer items-center gap-2 border-t border-minuri-silver/30 px-4 py-2.5 text-left text-xs font-medium text-minuri-teal transition hover:bg-minuri-fog"
								>
									<LocateFixed className="size-3.5" />
									Use my location
								</button>
								<div className="max-h-48 overflow-y-auto border-t border-minuri-silver/30">
									{suburbLoading && (
										<div className="px-4 py-2 text-xs text-minuri-slate">
											Loading suburbs...
										</div>
									)}
									{!suburbLoading && suburbError && (
										<div className="px-4 py-2 text-xs text-rose-700">
											{suburbError}
										</div>
									)}
									{!suburbLoading &&
										!suburbError &&
										suggestions.map((option) => (
											<button
												key={option.id}
												type="button"
												onClick={() =>
													pickSuburb(option.locality)
												}
												className={cn(
													"flex w-full cursor-pointer items-center gap-2 px-4 py-2.5 text-left text-sm transition hover:bg-minuri-fog",
													option.locality.toLowerCase() ===
														suburb.toLowerCase()
														? "font-medium text-minuri-teal"
														: "text-minuri-slate",
												)}
											>
												<MapPin className="size-3 shrink-0 text-minuri-silver" />
												<span>
													{option.locality}
													<span className="ml-1 text-xs text-minuri-slate/80">
														{option.state}{" "}
														{option.postcode}
													</span>
												</span>
											</button>
										))}
								</div>
							</div>
						)}
					</div>

					{youngAdultPopulation !== null &&
						youngAdultPopulation > 0 && (
							<span className="text-xs text-minuri-slate">
								There are {formatNumber(youngAdultPopulation)}{" "}
								young adults in your area
							</span>
						)}
				</div>
			</div>

			{/* ═══ Layer 2: Topic tabs ═══ */}
			<div className="shrink-0 border-b border-minuri-silver/50 bg-minuri-white">
				<div className="mx-auto max-w-[1440px]">
					<nav className="flex gap-0 overflow-x-auto px-2 md:px-4">
						{allTopics.map((t) => {
							const active = topic === t.slug;
							const isEnabled = enabledTopics.has(t.slug);
							return (
								<button
									key={t.slug}
									type="button"
									onClick={() => switchTopic(t.slug)}
									disabled={!isEnabled}
									className={cn(
										"relative flex shrink-0 flex-col items-center gap-0.5 px-4 py-3 text-xs font-medium transition md:flex-row md:gap-1.5 md:px-5",
										active
											? "text-minuri-mid"
											: "text-minuri-slate",
										isEnabled
											? "cursor-pointer hover:text-minuri-mid"
											: "cursor-not-allowed opacity-60",
									)}
								>
									<span className="text-base md:text-sm">
										{t.icon}
									</span>
									<span>{t.label}</span>
									{!isEnabled && (
										<span className="rounded-full bg-minuri-fog px-1.5 py-0.5 text-[10px] font-medium text-minuri-slate">
											Comming soon
										</span>
									)}
									{active && (
										<span className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full bg-minuri-teal" />
									)}
								</button>
							);
						})}
					</nav>
				</div>
			</div>

			{/* ═══ Split: list + map ═══ */}
			<div className="flex min-h-0 flex-1">
				{/* ── Left: header + scrollable results ── */}
				<div
					className={cn(
						"flex w-full shrink-0 flex-col border-r border-minuri-silver/40 bg-minuri-white",
						listWidth,
						mobilePane === "map" ? "hidden lg:flex" : "flex",
					)}
				>
					{/* Topic view header + subtypes */}
					<div className="shrink-0 px-4 pb-3 pt-4 shadow-sm md:px-6">
						<div className="flex flex-wrap items-end justify-between gap-2">
							<div>
								<h1 className="text-lg font-semibold tracking-tight text-minuri-mid md:text-xl">
									{heading}
								</h1>
								<p className="mt-0.5 text-xs text-minuri-slate">
									{topicMeta.tagline}
									{status === "success" &&
										` · ${places.length} result${places.length !== 1 ? "s" : ""}`}
								</p>
							</div>

							{/* Mobile view toggle */}
							<div className="flex items-center gap-1 rounded-full border border-minuri-silver/60 bg-minuri-fog p-0.5 lg:hidden">
								<button
									type="button"
									onClick={() => setMobilePane("list")}
									className={cn(
										"inline-flex cursor-pointer items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition",
										mobilePane === "list"
											? "bg-minuri-white text-minuri-mid shadow-sm"
											: "text-minuri-slate",
									)}
								>
									<List className="size-3.5" />
									List
								</button>
								<button
									type="button"
									onClick={() => setMobilePane("map")}
									className={cn(
										"inline-flex cursor-pointer items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition",
										mobilePane === "map"
											? "bg-minuri-white text-minuri-mid shadow-sm"
											: "text-minuri-slate",
									)}
								>
									<Map className="size-3.5" />
									Map
								</button>
							</div>
						</div>

						{/* Subtype chips */}
						<div className="mt-3 flex items-center gap-2 overflow-x-auto">
							<button
								type="button"
								onClick={() => setActiveSubtype(null)}
								className={cn(
									"shrink-0 cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-medium transition",
									activeSubtype === null
										? "bg-minuri-mid text-minuri-white"
										: "bg-minuri-fog text-minuri-slate hover:bg-minuri-mist",
								)}
							>
								All
							</button>
							{subtypes.map((sub) => (
								<button
									key={sub.slug}
									type="button"
									onClick={() => setActiveSubtype(sub.slug)}
									className={cn(
										"shrink-0 cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-medium transition",
										activeSubtype === sub.slug
											? "bg-minuri-mid text-minuri-white"
											: "bg-minuri-fog text-minuri-slate hover:bg-minuri-mist",
									)}
								>
									{sub.label}
								</button>
							))}
						</div>
					</div>

					{/* Scrollable results */}
					<div className="min-h-0 flex-1 overflow-y-auto">
						{/* Loading skeletons */}
						{status === "loading" && (
							<div className="divide-y divide-minuri-silver/30">
								{Array.from({ length: 5 }).map((_, i) => (
									<div key={i} className="px-5 py-4">
										<div className="flex gap-3">
											<div className="size-7 shrink-0 animate-pulse rounded-full bg-minuri-silver/30" />
											<div className="flex-1 space-y-2">
												<div className="h-4 w-3/5 animate-pulse rounded bg-minuri-silver/30" />
												<div className="h-3 w-2/5 animate-pulse rounded bg-minuri-silver/20" />
												<div className="h-3 w-4/5 animate-pulse rounded bg-minuri-silver/15" />
											</div>
										</div>
									</div>
								))}
							</div>
						)}

						{/* Error */}
						{status === "error" && (
							<div className="p-8 text-center">
								<p className="text-sm text-minuri-mid">
									{message}
								</p>
								<button
									type="button"
									onClick={fetchPlaces}
									className="mt-3 cursor-pointer rounded-full bg-minuri-mid px-4 py-1.5 text-xs font-medium text-minuri-white hover:bg-minuri-ocean"
								>
									Try again
								</button>
							</div>
						)}

						{/* Rate limit */}
						{status === "rate-limit" && (
							<div className="p-8 text-center">
								<p className="text-sm text-minuri-slate">
									{message}
								</p>
								<button
									type="button"
									onClick={fetchPlaces}
									className="mt-3 cursor-pointer rounded-full border border-minuri-silver px-4 py-1.5 text-xs font-medium text-minuri-slate hover:border-minuri-teal"
								>
									Retry
								</button>
							</div>
						)}

						{/* Empty */}
						{status === "empty" && (
							<div className="p-8 text-center">
								<p className="text-sm text-minuri-slate">
									{message}
								</p>
								<div className="mt-4 flex flex-wrap justify-center gap-2">
									{NEAR_ME_TOPICS.filter(
										(t) => t !== topic,
									).map((t) => {
										const meta = getTopicMeta(t);
										return (
											<button
												key={t}
												type="button"
												onClick={() => switchTopic(t)}
												className="cursor-pointer rounded-full bg-minuri-fog px-3 py-1.5 text-xs text-minuri-slate hover:bg-minuri-mist"
											>
												{meta.icon} {meta.label}
											</button>
										);
									})}
								</div>
							</div>
						)}

						{/* ── Results ── */}
						{status === "success" && (
							<>
								{layout === "card-grid" ? (
									<CardGridList
										places={places}
										selectedId={selectedPlaceId}
										onSelect={onSelectPlace}
										rowRefs={rowRefs}
									/>
								) : layout === "map-focus" ? (
									<CompactList
										places={places}
										selectedId={selectedPlaceId}
										onSelect={onSelectPlace}
										rowRefs={rowRefs}
									/>
								) : (
									<DetailList
										places={places}
										selectedId={selectedPlaceId}
										onSelect={onSelectPlace}
										rowRefs={rowRefs}
										showPhone
									/>
								)}
							</>
						)}
					</div>
				</div>

				{/* ── Right: map ── */}
				<div
					className={cn(
						"relative min-h-0 flex-1",
						mobilePane === "list" ? "hidden lg:block" : "block",
					)}
				>
					<NearMeMap
						places={places}
						selectedPlaceId={selectedPlaceId}
						onSelectPlace={onSelectPlace}
					/>
				</div>
			</div>
		</div>
	);
}

// ═══════════════════════════════════════════════════════
// Per-topic list renderers
// ═══════════════════════════════════════════════════════

type ListProps = {
	places: NearMePlace[];
	selectedId: string | null;
	onSelect: (id: string) => void;
	rowRefs: React.RefObject<Record<string, HTMLDivElement | null>>;
	showPhone?: boolean;
};

function PlaceThumbnail({
	place,
	className = "h-14 w-14",
}: {
	place: NearMePlace;
	className?: string;
}) {
	if (!place.thumbnail) {
		return (
			<div
				className={cn(
					"flex shrink-0 items-center justify-center overflow-hidden rounded-lg bg-minuri-fog",
					className,
				)}
			>
				<MapPin className="size-4 text-minuri-silver" />
			</div>
		);
	}

	return (
		<div
			className={cn(
				"relative shrink-0 overflow-hidden rounded-lg bg-minuri-fog",
				className,
			)}
		>
			<Image
				src={place.thumbnail}
				alt={`${place.name} thumbnail`}
				fill
				sizes="(max-width: 1024px) 100px, 140px"
				className="object-cover"
			/>
		</div>
	);
}

// ── DetailList: Health / Setup — phone-forward, practical ──

function DetailList({
	places,
	selectedId,
	onSelect,
	rowRefs,
	showPhone,
}: ListProps) {
	return (
		<div className="divide-y divide-minuri-silver/30">
			{places.map((place, i) => {
				const selected = selectedId === place.id;
				return (
					<div
						key={place.id}
						ref={(node) => {
							rowRefs.current[place.id] = node;
						}}
						role="button"
						tabIndex={0}
						onClick={() => onSelect(place.id)}
						onKeyDown={(e) => {
							if (e.key === "Enter" || e.key === " ")
								onSelect(place.id);
						}}
						className={cn(
							"cursor-pointer px-5 py-4 transition",
							selected
								? "bg-minuri-teal/5"
								: "hover:bg-minuri-fog/50",
						)}
					>
						<div className="flex gap-3">
							<PlaceThumbnail place={place} />
							<div
								className={cn(
									"flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
									selected
										? "bg-minuri-mid text-minuri-white"
										: "bg-minuri-teal text-minuri-white",
								)}
							>
								{i + 1}
							</div>

							<div className="min-w-0 flex-1">
								<div className="flex items-start justify-between gap-2">
									<h3 className="text-sm font-semibold text-minuri-mid">
										{place.name}
									</h3>
									{place.rating && (
										<span className="inline-flex shrink-0 items-center gap-0.5 rounded bg-minuri-mid px-1.5 py-0.5 text-xs font-bold text-minuri-white">
											<Star className="size-2.5 fill-current" />
											{place.rating}
											{place.reviewCount && (
												<span className="ml-0.5 font-normal opacity-80">
													({place.reviewCount})
												</span>
											)}
										</span>
									)}
								</div>

								<p className="mt-0.5 text-xs text-minuri-slate">
									{[place.type, place.hours]
										.filter(Boolean)
										.join(" · ")}
									{place.openNow && (
										<span className="ml-1.5 font-medium text-emerald-600">
											Open now
										</span>
									)}
								</p>

								<p className="mt-1 flex items-center gap-1 text-xs text-minuri-slate">
									<MapPin className="size-3 shrink-0 text-minuri-teal" />
									{place.address}
									{place.distanceKm !== undefined &&
										` · ${place.distanceKm} km`}
								</p>

								{place.snippet && (
									<p className="mt-1.5 text-xs leading-relaxed text-minuri-slate/80 italic">
										&ldquo;{place.snippet}&rdquo;
									</p>
								)}

								{place.tags && place.tags.length > 0 && (
									<div className="mt-2 flex flex-wrap gap-1.5">
										{place.tags.map((tag) => (
											<span
												key={tag}
												className="rounded-full bg-minuri-fog px-2 py-0.5 text-[10px] font-medium text-minuri-slate"
											>
												{tag}
											</span>
										))}
									</div>
								)}

								{/* Actions */}
								<div className="mt-2.5 flex flex-wrap items-center gap-2">
									{showPhone && place.phone && (
										<a
											href={`tel:${place.phone.replace(/\s+/g, "")}`}
											onClick={(e) => e.stopPropagation()}
											className="inline-flex items-center gap-1 rounded-full border border-minuri-teal/30 bg-minuri-teal/5 px-2.5 py-1 text-[11px] font-medium text-minuri-teal transition hover:bg-minuri-teal/10"
										>
											<Phone className="size-3" />
											{place.phone}
										</a>
									)}
									<a
										href={`https://maps.google.com/?q=${encodeURIComponent(place.address)}`}
										target="_blank"
										rel="noreferrer"
										onClick={(e) => e.stopPropagation()}
										className="inline-flex items-center gap-1 rounded-full border border-minuri-silver/60 px-2.5 py-1 text-[11px] font-medium text-minuri-slate transition hover:border-minuri-teal hover:text-minuri-teal"
									>
										<ExternalLink className="size-3" />
										Directions
									</a>
								</div>
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
}

// ── CardGridList: Survive / Food — rating-forward, snippet visible ──

function CardGridList({ places, selectedId, onSelect, rowRefs }: ListProps) {
	return (
		<div className="divide-y divide-minuri-silver/30">
			{places.map((place, i) => {
				const selected = selectedId === place.id;
				return (
					<div
						key={place.id}
						ref={(node) => {
							rowRefs.current[place.id] = node;
						}}
						role="button"
						tabIndex={0}
						onClick={() => onSelect(place.id)}
						onKeyDown={(e) => {
							if (e.key === "Enter" || e.key === " ")
								onSelect(place.id);
						}}
						className={cn(
							"cursor-pointer px-5 py-4 transition",
							selected
								? "bg-minuri-teal/5"
								: "hover:bg-minuri-fog/50",
						)}
					>
						<div className="flex gap-4">
							<PlaceThumbnail
								place={place}
								className="h-24 w-36"
							/>
							<div className="min-w-0 flex-1">
								<h3 className="text-sm font-semibold text-minuri-mid">
									{i + 1}. {place.name}
								</h3>

								{/* Rating row */}
								<div className="mt-1 flex items-center gap-2">
									{place.rating && (
										<div className="flex items-center gap-1">
											<div className="flex">
												{Array.from({ length: 5 }).map(
													(_, si) => (
														<Star
															key={si}
															className={cn(
																"size-3",
																si <
																	Math.round(
																		place.rating!,
																	)
																	? "fill-amber-400 text-amber-400"
																	: "fill-minuri-silver/40 text-minuri-silver/40",
															)}
														/>
													),
												)}
											</div>
											<span className="text-xs font-medium text-minuri-mid">
												{place.rating}
											</span>
											{place.reviewCount && (
												<span className="text-xs text-minuri-slate">
													(
													{place.reviewCount.toLocaleString()}
													)
												</span>
											)}
										</div>
									)}
									{place.type && (
										<>
											<span className="text-minuri-silver">
												·
											</span>
											<span className="text-xs text-minuri-slate">
												{place.type}
											</span>
										</>
									)}
								</div>

								{/* Location + hours */}
								<div className="mt-1 flex items-center gap-3 text-xs text-minuri-slate">
									<span className="flex items-center gap-1">
										<MapPin className="size-3 text-minuri-teal" />
										{place.address.split(",")[0]}
									</span>
									{place.openNow && (
										<span className="flex items-center gap-1 font-medium text-emerald-600">
											<Clock className="size-3" />
											Open now
										</span>
									)}
								</div>

								{/* Snippet */}
								{place.snippet && (
									<p className="mt-1.5 text-xs leading-relaxed text-minuri-slate/80">
										&ldquo;{place.snippet}&rdquo;
									</p>
								)}

								{/* Tags */}
								{place.tags && place.tags.length > 0 && (
									<div className="mt-2 flex flex-wrap gap-1.5">
										{place.tags.map((tag) => (
											<span
												key={tag}
												className="rounded-full bg-minuri-fog px-2 py-0.5 text-[10px] font-medium text-minuri-slate"
											>
												{tag}
											</span>
										))}
									</div>
								)}
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
}

// ── CompactList: Get around / Connect — minimal, map takes priority ──

function CompactList({ places, selectedId, onSelect, rowRefs }: ListProps) {
	return (
		<div className="divide-y divide-minuri-silver/30">
			{places.map((place, i) => {
				const selected = selectedId === place.id;
				return (
					<div
						key={place.id}
						ref={(node) => {
							rowRefs.current[place.id] = node;
						}}
						role="button"
						tabIndex={0}
						onClick={() => onSelect(place.id)}
						onKeyDown={(e) => {
							if (e.key === "Enter" || e.key === " ")
								onSelect(place.id);
						}}
						className={cn(
							"cursor-pointer px-4 py-3 transition",
							selected
								? "bg-minuri-teal/5"
								: "hover:bg-minuri-fog/50",
						)}
					>
						<div className="flex items-center gap-3">
							<PlaceThumbnail place={place} />
							<div
								className={cn(
									"flex size-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
									selected
										? "bg-minuri-mid text-minuri-white"
										: "bg-minuri-teal text-minuri-white",
								)}
							>
								{i + 1}
							</div>

							<div className="min-w-0 flex-1">
								<div className="flex items-center justify-between gap-2">
									<h3 className="truncate text-sm font-medium text-minuri-mid">
										{place.name}
									</h3>
									{place.type && (
										<span className="shrink-0 rounded bg-minuri-fog px-1.5 py-0.5 text-[10px] text-minuri-slate">
											{place.type}
										</span>
									)}
								</div>
								<div className="mt-0.5 flex items-center gap-2 text-[11px] text-minuri-slate">
									<span className="truncate">
										{place.address.split(",")[0]}
									</span>
									{place.tags &&
										place.tags.slice(0, 2).map((tag) => (
											<span
												key={tag}
												className="shrink-0 rounded-full bg-minuri-teal/10 px-1.5 py-0.5 text-[10px] font-medium text-minuri-teal"
											>
												{tag}
											</span>
										))}
								</div>
								{place.snippet && (
									<p className="mt-1 text-[11px] leading-relaxed text-minuri-slate/70">
										{place.snippet}
									</p>
								)}
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
}
