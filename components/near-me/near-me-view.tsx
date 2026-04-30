"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
	ChevronDown,
	ExternalLink,
	House,
	List,
	LocateFixed,
	Map,
	MapPin,
	Phone,
	Search,
	Star,
	X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { rankAndFilterSuburbs, type SuburbOption } from "@/lib/suburbs";
import {
	CRISIS_LINES,
	haversineKm,
	parseOpenState,
	type NearMeTopic,
	type NearMePlace,
	type Subtype,
	type TopicLayout,
	formatNumber,
	getAllTopicsMeta,
	getContextHeading,
	getSuburbDisplayName,
	getTopicMeta,
} from "@/lib/near-me";
import { type NearbyInterestRecord } from "@/lib/near-me-api";
import { getGuideBySlug } from "@/lib/guides";
import {
	readSavedPlaces,
	savePlaceToHub,
	unsavePlaceFromHub,
} from "@/components/landing/landing-local-state";
import { PlaceCard, type CardLayout } from "@/components/near-me/place-card";

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
	fromGuide?: string | null;
};

type LoadState = "idle" | "loading" | "success" | "empty" | "error";

// ── Empty state suggestions per topic ──

const EMPTY_SUGGESTIONS: Partial<Record<NearMeTopic, string>> = {
	"home-admin":
		"Try Dandenong or Footscray — both have large settlement support hubs.",
	"getting-around": "Try the CBD or inner suburbs for the best transit coverage.",
	"health-wellbeing":
		"Try a neighbouring suburb, or use the crisis line numbers above to find support now.",
	"social-belonging":
		"Try Fitzroy, Footscray, or Sunshine for active multicultural community spaces.",
};

// ── Main component ──

export function NearMeView({
	initialTopic,
	initialSuburb,
	fromGuide,
}: NearMeViewProps) {
	const router = useRouter();
	const pathname = usePathname();
	const enabledTopics = useMemo(
		() =>
			new Set<NearMeTopic>([
				"food-eating",
				"getting-around",
				"health-wellbeing",
				"home-admin",
				"social-belonging",
			]),
		[],
	);

	// Location context
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
	const [userCoords, setUserCoords] = useState<{
		lat: number;
		lng: number;
	} | null>(null);
	const locationRef = useRef<HTMLDivElement>(null);

	// Browsing state
	const [topic, setTopic] = useState<NearMeTopic>(
		enabledTopics.has(initialTopic) ? initialTopic : "food-eating",
	);
	const [activeSubtype, setActiveSubtype] = useState<string | null>(null);
	const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
	const [hoveredPlaceId, setHoveredPlaceId] = useState<string | null>(null);
	const [places, setPlaces] = useState<NearMePlace[]>([]);
	const [status, setStatus] = useState<LoadState>("idle");
	const [message, setMessage] = useState("");
	const [mobilePane, setMobilePane] = useState<"list" | "map">("list");
	const [mobileMapCard, setMobileMapCard] = useState<NearMePlace | null>(null);
	const [savedPlaceIds, setSavedPlaceIds] = useState<Set<string>>(new Set());
	const [showFromGuideBanner, setShowFromGuideBanner] = useState(true);
	const rowRefs = useRef<Record<string, HTMLDivElement | null>>({});

	// Derived
	const displaySuburb = getSuburbDisplayName(suburb || "Melbourne");
	const topicMeta = getTopicMeta(topic);
	const allTopics = getAllTopicsMeta();
	const subtypes: Subtype[] = topicMeta.subtypes;
	const layout: TopicLayout = topicMeta.layout;
	const cardLayout: CardLayout =
		layout === "card-grid" ? "grid" : layout === "map-focus" ? "compact" : "list";
	const heading =
		topic === "health-wellbeing" && activeSubtype === "mental-health"
			? `Mental health services near ${displaySuburb}`
			: getContextHeading(topic, displaySuburb);
	const suggestions = useMemo(
		() => rankAndFilterSuburbs(suburbOptions, locationQuery),
		[locationQuery, suburbOptions],
	);
	const fromGuideTitle = fromGuide ? getGuideBySlug(fromGuide)?.title ?? null : null;

	// Load saved places on mount
	useEffect(() => {
		const saved = readSavedPlaces();
		setSavedPlaceIds(new Set(saved.map((p) => p.id)));
	}, []);

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
				const res = await fetch("/api/suburbs");
				if (!res.ok) throw new Error("Failed to fetch suburb data");
				const payload = (await res.json()) as {
					suburbs?: SuburbOption[];
				};
				if (!cancelled) setSuburbOptions(payload.suburbs ?? []);
			} catch {
				if (!cancelled) setSuburbError("Could not load suburb suggestions.");
			} finally {
				if (!cancelled) setSuburbLoading(false);
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

	// Population
	useEffect(() => {
		let cancelled = false;
		async function loadPopulation() {
			try {
				const params = new URLSearchParams({ location: displaySuburb });
				const res = await fetch(`/api/population?${params.toString()}`);
				if (!res.ok) throw new Error("Failed");
				const payload = (await res.json()) as {
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
				if (!cancelled) setYoungAdultPopulation(null);
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

	// Sync mobile map card with selectedPlaceId
	useEffect(() => {
		if (mobilePane !== "map" || !selectedPlaceId) {
			setMobileMapCard(null);
			return;
		}
		const place = places.find((p) => p.id === selectedPlaceId);
		setMobileMapCard(place ?? null);
	}, [selectedPlaceId, mobilePane, places]);

	const onSelectPlace = useCallback((placeId: string) => {
		setSelectedPlaceId(placeId);
		rowRefs.current[placeId]?.scrollIntoView({
			block: "nearest",
			behavior: "smooth",
		});
	}, []);

	const onHoverPlace = useCallback((id: string | null) => {
		setHoveredPlaceId(id);
	}, []);

	function handleToggleSave(place: NearMePlace) {
		const id = place.id;
		if (savedPlaceIds.has(id)) {
			unsavePlaceFromHub(id);
			setSavedPlaceIds((prev) => {
				const s = new Set(prev);
				s.delete(id);
				return s;
			});
		} else {
			savePlaceToHub({
				id: place.id,
				name: place.name,
				topic: place.topic,
				suburb: displaySuburb,
				thumbnail: place.thumbnail,
			});
			setSavedPlaceIds((prev) => new Set([...prev, id]));
		}
	}

	const handleSearchArea = useCallback(
		async (center: { lat: number; lng: number }) => {
			try {
				const res = await fetch(
					`https://nominatim.openstreetmap.org/reverse?format=json&lat=${center.lat}&lon=${center.lng}&zoom=14&addressdetails=1`,
					{ headers: { "Accept-Language": "en" } },
				);
				if (!res.ok) return;
				const data = (await res.json()) as {
					address?: {
						suburb?: string;
						city_district?: string;
						city?: string;
					};
				};
				const newSuburb =
					data.address?.suburb ??
					data.address?.city_district ??
					data.address?.city;
				if (newSuburb) {
					setSuburb(newSuburb);
					setLocationQuery("");
				}
			} catch {
				// ignore
			}
		},
		[],
	);

	function fetchPlaces() {
		if (!displaySuburb) return;
		setStatus("loading");
		setMessage("");
		const params = new URLSearchParams({ suburb: displaySuburb, topic });
		if (activeSubtype) params.set("subtype", activeSubtype);
		const capturedCoords = userCoords;
		void fetch(`/api/nearby-interest?${params.toString()}`)
			.then(async (res) => {
				if (!res.ok) throw new Error("Failed");
				const payload = (await res.json()) as NearbyInterestRecord[];
				const mapped = (Array.isArray(payload) ? payload : []).map(
					(place, index): NearMePlace => {
						const { isOpen, label: hoursLabel } = parseOpenState(
							place.open_state ?? undefined,
						);
						const rawTags: string[] = place.price ? [place.price] : [];
						const tags =
							topic === "health-wellbeing" && rawTags.length === 0
								? ["Bulk-billing: call to confirm"]
								: rawTags.length > 0
									? rawTags
									: undefined;
						const placeLat = place.gps_coordinates?.latitude ?? -37.8136;
						const placeLng = place.gps_coordinates?.longitude ?? 144.9631;
						return {
							id:
								place.place_id ||
								`${topic}-${index}-${place.title.replace(/\s+/g, "-").toLowerCase()}`,
							name: place.title,
							address: place.address ?? displaySuburb,
							lat: placeLat,
							lng: placeLng,
							topic,
							subtype: activeSubtype ?? "general",
							phone: place.phone ?? undefined,
							website: place.website ?? undefined,
							serviceOptions: place.service_options ?? undefined,
							rating:
								typeof place.rating === "number" ? place.rating : undefined,
							reviewCount:
								typeof place.reviews === "number" ? place.reviews : undefined,
							type: place.type ?? undefined,
							hours: hoursLabel || undefined,
							openNow: isOpen,
							snippet: place.description
								? place.description.replace(/^"|"$/g, "")
								: undefined,
							thumbnail: place.thumbnail ?? undefined,
							photos: place.photos ?? undefined,
							tags,
							distanceKm:
								usingLocation && capturedCoords
									? Number(
											haversineKm(
												capturedCoords.lat,
												capturedCoords.lng,
												placeLat,
												placeLng,
											).toFixed(1),
										)
									: undefined,
						};
					},
				);

				if (!mapped.length) {
					setStatus("empty");
					setMessage(topicMeta.emptyPrompt);
					setPlaces([]);
					setSelectedPlaceId(null);
					return;
				}

				if (usingLocation && capturedCoords) {
					mapped.sort(
						(a, b) => (a.distanceKm ?? 999) - (b.distanceKm ?? 999),
					);
				}
				setPlaces(mapped);
				setSelectedPlaceId(mapped[0]?.id ?? null);
				setStatus("success");
			})
			.catch(() => {
				setStatus("error");
				setMessage("Could not load nearby places right now.");
				setPlaces([]);
				setSelectedPlaceId(null);
			});
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
		if (typeof navigator !== "undefined" && navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(pos) => {
					setUserCoords({
						lat: pos.coords.latitude,
						lng: pos.coords.longitude,
					});
				},
				() => {
					/* ignore */
				},
			);
		}
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
			<div className="shrink-0 border-b border-minuri-silver/50 bg-minuri-white px-4 py-2.5 md:px-6">
				<div className="mx-auto flex max-w-[1440px] items-center justify-between gap-3">
					<div ref={locationRef} className="relative">
						<button
							type="button"
							onClick={() => setLocationPickerOpen(!locationPickerOpen)}
							className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-minuri-teal/25 bg-minuri-teal/8 px-3.5 py-2 text-sm font-semibold text-minuri-teal transition hover:border-minuri-teal/45 hover:bg-minuri-teal/12"
						>
							<MapPin className="size-3.5" />
							{displaySuburb}
							<ChevronDown className="size-3 text-minuri-teal/60" />
						</button>

						{locationPickerOpen && (
							<div className="absolute left-0 top-full z-40 mt-1.5 w-72 overflow-hidden rounded-xl border border-minuri-silver/70 bg-minuri-white shadow-xl">
								<div className="p-3">
									<div className="relative">
										<Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-minuri-silver" />
										<input
											autoFocus
											value={locationQuery}
											onChange={(e) => setLocationQuery(e.target.value)}
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
												onClick={() => pickSuburb(option.locality)}
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
														{option.state} {option.postcode}
													</span>
												</span>
											</button>
										))}
								</div>
							</div>
						)}
					</div>

					<div className="flex items-center gap-3">
						{youngAdultPopulation !== null && youngAdultPopulation > 0 && (
							<span className="text-xs text-minuri-slate">
								There are {formatNumber(youngAdultPopulation)} young adults in
								your area
							</span>
						)}
						<button
							type="button"
							onClick={() => router.push("/")}
							className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-minuri-silver/50 bg-minuri-fog px-3 py-1.5 text-xs font-medium text-minuri-slate transition hover:border-minuri-silver hover:text-minuri-mid"
						>
							<House className="size-3.5" />
							Home
						</button>
					</div>
				</div>
			</div>

			{/* ═══ Layer 2: Topic tabs ═══ */}
			<div className="shrink-0 border-b border-minuri-silver/50 bg-minuri-white">
				<div className="mx-auto max-w-[1440px]">
					<nav className="flex gap-0 overflow-x-auto px-2 md:px-3">
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
										active ? "text-minuri-teal" : "text-minuri-slate",
										isEnabled
											? "cursor-pointer hover:text-minuri-mid"
											: "cursor-not-allowed opacity-50",
									)}
								>
									<span className="text-base md:text-sm">{t.icon}</span>
									<span className={active ? "font-semibold" : ""}>{t.label}</span>
									{!isEnabled && (
										<span className="rounded-full bg-minuri-fog px-1.5 py-0.5 text-[10px] font-medium text-minuri-slate/70">
											Coming soon
										</span>
									)}
									{active && (
										<span className="absolute bottom-0 left-3 right-3 h-[2.5px] rounded-full bg-minuri-teal" />
									)}
								</button>
							);
						})}
					</nav>
				</div>
			</div>

			{/* "Came from guide" banner */}
			{fromGuide && fromGuideTitle && showFromGuideBanner && (
				<div className="shrink-0 flex items-center gap-3 border-l-4 border-minuri-teal bg-minuri-teal/8 px-4 py-3">
					<p className="flex-1 text-xs text-minuri-mid">
						You&apos;re here after reading{" "}
						<strong>&ldquo;{fromGuideTitle}&rdquo;</strong> — here are places near
						you.
					</p>
					<button
						type="button"
						onClick={() => setShowFromGuideBanner(false)}
						aria-label="Dismiss banner"
						className="shrink-0 cursor-pointer rounded-full p-1 text-minuri-slate transition hover:bg-minuri-silver/20"
					>
						<X className="size-3.5" />
					</button>
				</div>
			)}

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
										? "bg-minuri-teal text-minuri-white"
										: "bg-minuri-fog text-minuri-slate hover:bg-minuri-mist hover:text-minuri-mid",
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
											? "bg-minuri-teal text-minuri-white"
											: "bg-minuri-fog text-minuri-slate hover:bg-minuri-mist hover:text-minuri-mid",
									)}
								>
									{sub.label}
								</button>
							))}
						</div>
					</div>

					{/* Scrollable results */}
					<div className="min-h-0 flex-1 overflow-y-auto">
						{/* Crisis lines banner — Health topic only, sticky */}
						{topic === "health-wellbeing" && (
							<div className="sticky top-0 z-10 border-b border-amber-100 bg-amber-50/95 px-4 py-2.5 backdrop-blur">
								<p className="mb-1.5 text-[10px] font-black uppercase tracking-wide text-amber-700">
									Crisis support
								</p>
								<div className="flex flex-wrap gap-2">
									{CRISIS_LINES.map((line) => (
										<a
											key={line.name}
											href={`tel:${line.phone.replace(/\s+/g, "")}`}
											className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-semibold text-amber-800 transition hover:bg-amber-200"
										>
											<Phone className="size-3" />
											{line.name}: {line.phone}
										</a>
									))}
								</div>
							</div>
						)}

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
								<p className="text-sm text-minuri-mid">{message}</p>
								<button
									type="button"
									onClick={fetchPlaces}
									className="mt-3 cursor-pointer rounded-full bg-minuri-mid px-4 py-1.5 text-xs font-medium text-minuri-white hover:bg-minuri-ocean"
								>
									Try again
								</button>
							</div>
						)}

						{/* Empty */}
						{status === "empty" && (
							<div className="p-8 text-center">
								<p className="text-sm text-minuri-slate">{message}</p>
								{EMPTY_SUGGESTIONS[topic] && (
									<p className="mt-1 text-sm italic text-minuri-slate/70">
										{EMPTY_SUGGESTIONS[topic]}
									</p>
								)}
								<div className="mt-4 flex flex-wrap justify-center gap-2">
									{allTopics
										.filter((t) => t.slug !== topic)
										.map((t) => (
											<button
												key={t.slug}
												type="button"
												onClick={() => switchTopic(t.slug)}
												className="cursor-pointer rounded-full bg-minuri-fog px-3 py-1.5 text-xs text-minuri-slate hover:bg-minuri-mist"
											>
												{t.icon} {t.label}
											</button>
										))}
								</div>
							</div>
						)}

						{/* Results */}
						{status === "success" && (
							<div className="divide-y divide-minuri-silver/30">
								{places.map((place, i) => (
									<PlaceCard
										key={place.id}
										place={place}
										index={i}
										layout={cardLayout}
										selected={selectedPlaceId === place.id}
										hovered={hoveredPlaceId === place.id}
										saved={savedPlaceIds.has(place.id)}
										topic={topic}
										onSelect={() => onSelectPlace(place.id)}
										onHoverEnter={() => onHoverPlace(place.id)}
										onHoverLeave={() => onHoverPlace(null)}
										onToggleSave={() => handleToggleSave(place)}
										cardRef={(node) => {
											rowRefs.current[place.id] = node;
										}}
									/>
								))}
							</div>
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
						topic={topic}
						hoveredPlaceId={hoveredPlaceId}
						onHoverPlace={onHoverPlace}
						onSearchArea={handleSearchArea}
						userLat={userCoords?.lat}
						userLng={userCoords?.lng}
					/>
				</div>
			</div>

			{/* ── Mobile bottom sheet ── */}
			<div
				className={cn(
					"fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl bg-minuri-white shadow-xl transition-transform duration-300 ease-out lg:hidden",
					mobileMapCard && mobilePane === "map"
						? "translate-y-0"
						: "pointer-events-none translate-y-full",
				)}
			>
				{mobileMapCard && (
					<>
						<div className="flex items-center justify-between px-4 pb-2 pt-3">
							<h3 className="truncate pr-2 text-sm font-semibold text-minuri-mid">
								{mobileMapCard.name}
							</h3>
							<button
								type="button"
								onClick={() => setMobileMapCard(null)}
								className="shrink-0 cursor-pointer rounded-full bg-minuri-fog p-1.5 text-minuri-slate transition hover:bg-minuri-silver/20"
							>
								<X className="size-4" />
							</button>
						</div>
						{mobileMapCard.thumbnail && (
							<div className="relative h-28 w-full overflow-hidden">
								<Image
									src={mobileMapCard.thumbnail}
									alt={mobileMapCard.name}
									fill
									className="object-cover"
								/>
							</div>
						)}
						<div className="px-4 py-3">
							<div className="flex flex-wrap items-center gap-2">
								{mobileMapCard.rating && (
									<span className="inline-flex items-center gap-0.5 rounded bg-minuri-mid px-1.5 py-0.5 text-xs font-bold text-minuri-white">
										<Star className="size-2.5 fill-current" />
										{mobileMapCard.rating}
									</span>
								)}
								{mobileMapCard.type && (
									<span className="text-xs text-minuri-slate">
										{mobileMapCard.type}
									</span>
								)}
								{mobileMapCard.openNow && (
									<span className="text-xs font-medium text-emerald-600">
										Open now
									</span>
								)}
							</div>
							<p className="mt-1.5 flex items-center gap-1 text-xs text-minuri-slate">
								<MapPin className="size-3 shrink-0 text-minuri-teal" />
								{mobileMapCard.address}
							</p>
							<div className="mt-3 flex gap-2">
								<a
									href={getGoogleDirectionsUrl(mobileMapCard)}
									target="_blank"
									rel="noreferrer"
									className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-minuri-silver px-3 py-2 text-xs font-medium text-minuri-slate transition hover:border-minuri-teal hover:text-minuri-teal"
								>
									<ExternalLink className="size-3.5" />
									Directions
								</a>
								{mobileMapCard.phone && (
									<a
										href={`tel:${mobileMapCard.phone.replace(/\s+/g, "")}`}
										className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-minuri-teal/30 bg-minuri-teal/8 px-3 py-2 text-xs font-medium text-minuri-teal transition hover:bg-minuri-teal/12"
									>
										<Phone className="size-3.5" />
										Call
									</a>
								)}
							</div>
						</div>
						<div className="h-[env(safe-area-inset-bottom,0px)]" />
					</>
				)}
			</div>
		</div>
	);
}

// ── Shared helpers ──

function getGoogleDirectionsUrl(place: NearMePlace) {
	if (Number.isFinite(place.lat) && Number.isFinite(place.lng)) {
		return `https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`;
	}
	return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(place.address)}`;
}
