"use client";

import Image from "next/image";
import { useState } from "react";
import { ExternalLink, Heart, Info, MapPin, Phone } from "lucide-react";

import { cn } from "@/lib/utils";
import type { NearMePlace, NearMeTopic } from "@/lib/near-me";

export type CardLayout = "grid" | "list" | "compact";

type CardProps = {
	place: NearMePlace;
	index: number;
	selected: boolean;
	hovered: boolean;
	saved: boolean;
	topic?: NearMeTopic;
	onSelect: () => void;
	onHoverEnter?: () => void;
	onHoverLeave?: () => void;
	onToggleSave?: () => void;
	cardRef?: (node: HTMLDivElement | null) => void;
};

export type PlaceCardProps = CardProps & { layout: CardLayout };

export function PlaceCard({ layout, ...rest }: PlaceCardProps) {
	if (layout === "grid") return <GridCard {...rest} />;
	if (layout === "compact") return <CompactCard {...rest} />;
	return <ListCard {...rest} />;
}

// ── Helpers ──

function formatReviewCount(n: number): string {
	return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

function getGoogleDirectionsUrl(place: NearMePlace) {
	if (Number.isFinite(place.lat) && Number.isFinite(place.lng)) {
		return `https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`;
	}
	return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(place.address)}`;
}

function getHostname(url: string): string {
	try {
		return new URL(url).hostname.replace(/^www\./, "");
	} catch {
		return url;
	}
}

const TRANSIT_EMOJI_MAP: Array<[string, string]> = [
	["train", "🚂"],
	["tram", "🚊"],
	["bus", "🚌"],
	["bicycle", "🚲"],
	["bike", "🚲"],
];

function getTransitEmoji(type: string | undefined): string {
	if (!type) return "🗺";
	const lower = type.toLowerCase();
	return TRANSIT_EMOJI_MAP.find(([k]) => lower.includes(k))?.[1] ?? "🗺";
}

const TOPIC_PLACEHOLDER: Record<NearMeTopic, { bg: string; emoji: string }> = {
	"food-eating": { bg: "bg-amber-50", emoji: "💰" },
	"health-wellbeing": { bg: "bg-green-50", emoji: "🩺" },
	"home-admin": { bg: "bg-teal-50", emoji: "📋" },
	"social-belonging": { bg: "bg-purple-50", emoji: "💬" },
	"getting-around": { bg: "bg-blue-50", emoji: "🚊" },
};

// ── Sub-components ──

function HeartButton({ saved, onToggle }: { saved: boolean; onToggle: () => void }) {
	const [pulsing, setPulsing] = useState(false);
	return (
		<button
			type="button"
			onClick={(e) => {
				e.stopPropagation();
				e.preventDefault();
				setPulsing(true);
				setTimeout(() => setPulsing(false), 200);
				onToggle();
			}}
			aria-label={saved ? "Unsave place" : "Save place"}
			style={{ transform: pulsing ? "scale(1.3)" : "scale(1)", transition: "transform 0.1s ease-out" }}
			className="cursor-pointer rounded-full p-1 transition hover:text-rose-500"
		>
			<Heart className={cn("size-3.5", saved ? "fill-rose-500 text-rose-500" : "text-minuri-silver")} />
		</button>
	);
}

function RatingRow({ rating, reviewCount }: { rating: number; reviewCount?: number }) {
	return (
		<span className="inline-flex items-center gap-1 text-xs">
			<span>⭐</span>
			<span className="font-semibold text-minuri-mid">{rating.toFixed(1)}</span>
			{reviewCount !== undefined && (
				<span className="text-minuri-slate">({formatReviewCount(reviewCount)})</span>
			)}
		</span>
	);
}

function OpenBadge({ isOpen, label }: { isOpen: boolean; label: string }) {
	return (
		<span className="inline-flex items-center gap-1.5 text-xs">
			<span className={cn("size-1.5 rounded-full", isOpen ? "bg-green-500" : "bg-red-400")} />
			<span className={cn("font-medium", isOpen ? "text-green-700" : "text-red-600")}>
				{isOpen ? "Open" : "Closed"}{label ? ` · ${label}` : ""}
			</span>
		</span>
	);
}

function DistancePill({ km }: { km: number }) {
	return (
		<span className="inline-flex items-center gap-0.5 rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-medium text-green-700">
			📍 {km} km
		</span>
	);
}

function PlacePhoto({
	place,
	topic,
	className,
}: {
	place: NearMePlace;
	topic?: NearMeTopic;
	className: string;
}) {
	if (!place.thumbnail) {
		const ph = topic ? TOPIC_PLACEHOLDER[topic] : null;
		return (
			<div className={cn("flex shrink-0 items-center justify-center", ph?.bg ?? "bg-minuri-fog", className)}>
				<span className="text-xl">{ph?.emoji ?? "📍"}</span>
			</div>
		);
	}
	return (
		<div className={cn("relative shrink-0 overflow-hidden bg-minuri-fog", className)}>
			<Image src={place.thumbnail} alt={place.name} fill sizes="200px" className="object-cover" />
		</div>
	);
}

// ── Grid card (food-eating, social-belonging) — Yelp-style, photo-forward ──

function GridCard({
	place,
	index,
	selected,
	hovered,
	saved,
	topic,
	onSelect,
	onHoverEnter,
	onHoverLeave,
	onToggleSave,
	cardRef,
}: CardProps) {
	const isOpen = place.openNow ?? false;
	const hoursLabel = place.hours ?? "";
	const isSocial = topic === "social-belonging";
	const ph = topic ? TOPIC_PLACEHOLDER[topic] : null;

	return (
		<div
			ref={cardRef}
			role="button"
			tabIndex={0}
			onClick={onSelect}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") onSelect();
			}}
			onMouseEnter={onHoverEnter}
			onMouseLeave={onHoverLeave}
			className={cn(
				"cursor-pointer overflow-hidden rounded-xl border bg-minuri-white transition",
				selected
					? "border-minuri-teal ring-2 ring-minuri-teal/30"
					: hovered
						? "border-minuri-teal/50"
						: "border-minuri-silver/30 hover:border-minuri-silver",
			)}
		>
			{/* Photo hero */}
			<div className="relative h-44 w-full overflow-hidden">
				{place.thumbnail ? (
					<Image
						src={place.thumbnail}
						alt={place.name}
						fill
						sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
						className="object-cover"
					/>
				) : (
					<div className={cn("flex h-full items-center justify-center text-3xl", ph?.bg ?? "bg-minuri-fog")}>
						{ph?.emoji ?? "📍"}
					</div>
				)}
				{!isSocial && (
					<span className="absolute bottom-2 left-2 flex size-6 items-center justify-center rounded-full bg-minuri-mid/80 text-[10px] font-bold text-minuri-white backdrop-blur-sm">
						{index + 1}
					</span>
				)}
				{onToggleSave && (
					<button
						type="button"
						onClick={(e) => {
							e.stopPropagation();
							onToggleSave();
						}}
						aria-label={saved ? "Unsave place" : "Save place"}
						className="absolute right-2 top-2 rounded-full bg-minuri-white/80 p-1.5 backdrop-blur-sm transition hover:bg-minuri-white"
					>
						<Heart
							className={cn(
								"size-3.5",
								saved ? "fill-rose-500 text-rose-500" : "text-minuri-slate",
							)}
						/>
					</button>
				)}
			</div>

			{/* Card body */}
			<div className="px-4 py-3">
				<h3 className="text-sm font-semibold leading-snug text-minuri-mid">
					{place.name}
				</h3>

				{!isSocial && place.rating && (
					<div className="mt-1">
						<RatingRow rating={place.rating} reviewCount={place.reviewCount} />
					</div>
				)}

				<div className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-1">
					{(place.type || place.price) && (
						<span className="text-xs text-minuri-slate">
							{[place.type, place.price].filter(Boolean).join(" · ")}
						</span>
					)}
					{place.distanceKm !== undefined && (
						<DistancePill km={place.distanceKm} />
					)}
				</div>

				<div className="mt-1.5 flex items-center gap-1 text-xs text-minuri-slate">
					<MapPin className="size-3 shrink-0 text-minuri-teal" />
					<span className="truncate">{place.address.split(",")[0]}</span>
				</div>

				{hoursLabel && (
					<div className="mt-1.5">
						<OpenBadge isOpen={isOpen} label={hoursLabel} />
					</div>
				)}

				{place.snippet && (
					<p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-minuri-slate/80">
						&ldquo;{place.snippet}&rdquo;
					</p>
				)}

				{isSocial && place.subtype === "community-spaces" && (
					<span className="mt-2 inline-block rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] text-amber-700">
						📅 Check for events
					</span>
				)}

				{place.serviceOptions && place.serviceOptions.length > 0 && (
					<div className="mt-2 flex flex-wrap gap-1">
						{place.serviceOptions.slice(0, 3).map((opt) => (
							<span
								key={opt}
								className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700"
							>
								{opt}
							</span>
						))}
					</div>
				)}

				<div className="mt-3 border-t border-minuri-silver/30 pt-2.5">
					<a
						href={getGoogleDirectionsUrl(place)}
						target="_blank"
						rel="noreferrer"
						onClick={(e) => e.stopPropagation()}
						className="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-minuri-teal px-3 py-1.5 text-[11px] font-medium text-minuri-white transition hover:bg-minuri-ocean"
					>
						<ExternalLink className="size-3" />
						Directions
					</a>
				</div>
			</div>
		</div>
	);
}

// ── List card (health-wellbeing, home-admin) — practical, action-forward ──

function ListCard({
	place,
	index,
	selected,
	hovered,
	saved,
	topic,
	onSelect,
	onHoverEnter,
	onHoverLeave,
	onToggleSave,
	cardRef,
}: CardProps) {
	const isOpen = place.openNow ?? false;
	const isHealth = topic === "health-wellbeing";
	const isHome = topic === "home-admin";
	const hasPhotoStrip = Array.isArray(place.photos) && place.photos.length >= 2;

	return (
		<div
			ref={cardRef}
			role="button"
			tabIndex={0}
			onClick={onSelect}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") onSelect();
			}}
			onMouseEnter={onHoverEnter}
			onMouseLeave={onHoverLeave}
			className={cn(
				"cursor-pointer border-l-2 px-5 py-4 transition",
				selected
					? "border-l-minuri-teal bg-minuri-teal/5"
					: hovered
						? "border-l-transparent bg-minuri-teal/8"
						: "border-l-transparent hover:bg-minuri-fog/50",
			)}
		>
			{/* Photo strip when multiple photos available */}
			{hasPhotoStrip && (
				<div className="mb-3 flex gap-1.5">
					{place.photos!.slice(0, 3).map((photo, i) => (
						<div key={i} className="relative h-20 flex-1 overflow-hidden rounded-lg bg-minuri-fog">
							<Image src={photo} alt="" fill sizes="120px" className="object-cover" />
						</div>
					))}
				</div>
			)}

			<div className="flex gap-4">
				{/* Left: thumbnail (hidden when photo strip is shown) */}
				{!hasPhotoStrip && (
					<PlacePhoto place={place} topic={topic} className="h-20 w-20 rounded-lg" />
				)}

				{/* Center: main content */}
				<div className="min-w-0 flex-1">
					<div className="flex items-start justify-between gap-2">
						<h3 className="text-sm font-semibold text-minuri-mid">
							{index + 1}. {place.name}
						</h3>
						<div className="flex shrink-0 items-center gap-1">
							{/* Rating in header for non-health */}
							{!isHealth && place.rating && (
								<RatingRow rating={place.rating} reviewCount={place.reviewCount} />
							)}
							{onToggleSave && (
								isHealth ? (
									<div className="sm:hidden">
										<HeartButton saved={saved} onToggle={onToggleSave} />
									</div>
								) : (
									<HeartButton saved={saved} onToggle={onToggleSave} />
								)
							)}
						</div>
					</div>

					{/* Open badge for all topics */}
					{place.hours && (
						<div className="mt-1">
							<OpenBadge isOpen={isOpen} label={place.hours} />
						</div>
					)}

					<p className="mt-0.5 text-xs text-minuri-slate">
						{[place.type, place.price].filter(Boolean).join(" · ")}
					</p>

					<p className="mt-1 flex items-center gap-1.5 text-xs text-minuri-slate">
						<MapPin className="size-3 shrink-0 text-minuri-teal" />
						<span className="truncate">{place.address.split(",")[0]}</span>
						{place.distanceKm !== undefined && (
							<DistancePill km={place.distanceKm} />
						)}
					</p>

					{place.snippet && (
						<p className="mt-1.5 text-xs italic leading-relaxed text-minuri-slate/80">
							&ldquo;{place.snippet}&rdquo;
						</p>
					)}

					{place.tags && place.tags.length > 0 && (
						<div className="mt-2 flex flex-wrap gap-1.5">
							{place.tags.map((tag) => {
								const isBulkBilling = tag === "Bulk-billing: call to confirm";
								return (
									<span
										key={tag}
										className={cn(
											"inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-medium",
											isBulkBilling
												? "border border-amber-200 bg-amber-50 text-amber-700"
												: "bg-minuri-fog text-minuri-slate",
										)}
									>
										{tag}
										{isBulkBilling && (
											<span title="We cannot verify bulk-billing from this source. Always call the clinic to confirm.">
												<Info className="size-3 text-amber-500" />
											</span>
										)}
									</span>
								);
							})}
						</div>
					)}

					<div className="mt-2.5 flex flex-wrap items-center gap-2">
						{isHealth && place.phone && (
							<a
								href={`tel:${place.phone.replace(/\s+/g, "")}`}
								onClick={(e) => e.stopPropagation()}
								className="inline-flex items-center gap-1 rounded-full border border-minuri-teal/30 bg-minuri-teal/5 px-2.5 py-1 text-[11px] font-medium text-minuri-teal transition hover:bg-minuri-teal/10"
							>
								<Phone className="size-3" />
								{place.phone}
							</a>
						)}
						{isHome && place.website && (
							<a
								href={place.website}
								target="_blank"
								rel="noreferrer"
								onClick={(e) => e.stopPropagation()}
								className="inline-flex w-full items-center justify-center gap-1 rounded-full bg-minuri-teal px-3 py-1.5 text-[11px] font-medium text-minuri-white transition hover:bg-minuri-ocean"
							>
								<ExternalLink className="size-3" />
								Visit website
							</a>
						)}
						{!isHome && (
							<>
								<a
									href={getGoogleDirectionsUrl(place)}
									target="_blank"
									rel="noreferrer"
									onClick={(e) => e.stopPropagation()}
									className="inline-flex items-center gap-1 rounded-full border border-minuri-silver/60 px-2.5 py-1 text-[11px] font-medium text-minuri-slate transition hover:border-minuri-teal hover:text-minuri-teal"
								>
									<ExternalLink className="size-3" />
									Directions
								</a>
								{!isHealth && place.phone && (
									<a
										href={`tel:${place.phone.replace(/\s+/g, "")}`}
										onClick={(e) => e.stopPropagation()}
										className="inline-flex items-center gap-1 rounded-full border border-minuri-teal/30 bg-minuri-teal/5 px-2.5 py-1 text-[11px] font-medium text-minuri-teal transition hover:bg-minuri-teal/10"
									>
										<Phone className="size-3" />
										Call
									</a>
								)}
								{place.website && (
									<a
										href={place.website}
										target="_blank"
										rel="noreferrer"
										onClick={(e) => e.stopPropagation()}
										className="inline-flex items-center gap-1 rounded-full border border-minuri-silver/60 px-2.5 py-1 text-[11px] font-medium text-minuri-slate transition hover:border-minuri-teal hover:text-minuri-teal"
									>
										<ExternalLink className="size-3" />
										{getHostname(place.website)}
									</a>
								)}
							</>
						)}
					</div>
				</div>

				{/* Right zone — health desktop only */}
				{isHealth && (
					<div className="hidden w-24 shrink-0 flex-col items-end gap-1.5 pt-0.5 sm:flex">
						{place.rating && (
							<RatingRow rating={place.rating} reviewCount={place.reviewCount} />
						)}
						{onToggleSave && (
							<HeartButton saved={saved} onToggle={onToggleSave} />
						)}
					</div>
				)}
			</div>
		</div>
	);
}

// ── Compact card (getting-around) — minimal, map takes priority ──

function CompactCard({
	place,
	selected,
	hovered,
	topic,
	onSelect,
	onHoverEnter,
	onHoverLeave,
	cardRef,
}: CardProps) {
	const emoji = getTransitEmoji(place.type);

	return (
		<div
			ref={cardRef}
			role="button"
			tabIndex={0}
			onClick={onSelect}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") onSelect();
			}}
			onMouseEnter={onHoverEnter}
			onMouseLeave={onHoverLeave}
			className={cn(
				"cursor-pointer border-l-2 px-4 py-3 transition",
				selected
					? "border-l-minuri-teal bg-minuri-teal/5"
					: hovered
						? "border-l-transparent bg-minuri-teal/8"
						: "border-l-transparent hover:bg-minuri-fog/50",
			)}
		>
			<div className="flex items-center gap-3">
				<div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xl">
					{emoji}
				</div>

				<div className="min-w-0 flex-1">
					<div className="flex items-center justify-between gap-2">
						<h3 className="truncate text-sm font-medium text-minuri-mid">
							{place.name}
						</h3>
						{topic === "getting-around" && place.type && (
							<span className="shrink-0 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] text-blue-700">
								{place.type}
							</span>
						)}
					</div>

					<div className="mt-0.5 flex items-center gap-2 text-[11px] text-minuri-slate">
						<span className="truncate">{place.address.split(",")[0]}</span>
						{place.distanceKm !== undefined && (
							<span className="shrink-0">{place.distanceKm} km away</span>
						)}
					</div>

					{place.snippet && (
						<p className="mt-1 text-[11px] leading-relaxed text-minuri-slate/70">
							{place.snippet}
						</p>
					)}

					<div className="mt-1.5">
						{topic === "getting-around" && place.subtype !== "cycling" ? (
							<a
								href="https://www.ptv.vic.gov.au/journey"
								target="_blank"
								rel="noreferrer"
								onClick={(e) => e.stopPropagation()}
								className="inline-flex items-center gap-1 rounded-full border border-minuri-silver/60 px-2 py-0.5 text-[10px] font-medium text-minuri-slate transition hover:border-minuri-teal hover:text-minuri-teal"
							>
								<ExternalLink className="size-3" />
								Plan journey
							</a>
						) : (
							<a
								href={getGoogleDirectionsUrl(place)}
								target="_blank"
								rel="noreferrer"
								onClick={(e) => e.stopPropagation()}
								className="inline-flex items-center gap-1 rounded-full border border-minuri-silver/60 px-2 py-0.5 text-[10px] font-medium text-minuri-slate transition hover:border-minuri-teal hover:text-minuri-teal"
							>
								<ExternalLink className="size-3" />
								Directions
							</a>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
