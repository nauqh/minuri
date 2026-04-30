"use client";

import Image from "next/image";
import { useState } from "react";
import { ExternalLink, Heart, Info, MapPin, Phone, Star } from "lucide-react";

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

// ── Shared sub-components ──

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

function RatingBadge({
	rating,
	reviewCount,
	variant = "dark",
}: {
	rating: number;
	reviewCount?: number;
	variant?: "dark" | "yellow";
}) {
	if (variant === "yellow") {
		return (
			<span className="inline-flex items-center gap-1 rounded-md bg-amber-400 px-2 py-0.5 text-xs font-bold text-amber-900">
				<Star className="size-3 fill-current" />
				{rating.toFixed(1)}
				{reviewCount ? (
					<span className="font-normal opacity-80">
						({reviewCount.toLocaleString()})
					</span>
				) : null}
			</span>
		);
	}
	return (
		<span className="inline-flex items-center gap-0.5 rounded bg-minuri-mid px-1.5 py-0.5 text-xs font-bold text-minuri-white">
			<Star className="size-2.5 fill-current" />
			{rating}
			{reviewCount ? (
				<span className="ml-0.5 font-normal opacity-80">
					({reviewCount.toLocaleString()})
				</span>
			) : null}
		</span>
	);
}

function OpenStatusBadge({ isOpen, label }: { isOpen: boolean; label: string }) {
	return (
		<span
			className={cn(
				"inline-flex rounded px-1.5 py-0.5 text-xs font-medium",
				isOpen ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700",
			)}
		>
			{isOpen ? "Open" : "Closed"}
			{label ? ` · ${label}` : ""}
		</span>
	);
}

function PlacePhoto({ place, className }: { place: NearMePlace; className: string }) {
	if (!place.thumbnail) {
		return (
			<div className={cn("flex shrink-0 items-center justify-center bg-minuri-fog", className)}>
				<MapPin className="size-5 text-minuri-silver/60" />
			</div>
		);
	}
	return (
		<div className={cn("relative shrink-0 overflow-hidden bg-minuri-fog", className)}>
			<Image src={place.thumbnail} alt={place.name} fill sizes="200px" className="object-cover" />
		</div>
	);
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

const TRANSIT_BADGE_ENTRIES = [
	{ match: "train", label: "🚂 Train" },
	{ match: "tram", label: "🚊 Tram" },
	{ match: "bus", label: "🚌 Bus" },
	{ match: "bicycle", label: "🚲 Bike" },
	{ match: "bike", label: "🚲 Bike" },
];

function getTransitBadge(type: string | undefined): string {
	if (!type) return "🗺 Transit";
	const lower = type.toLowerCase();
	return TRANSIT_BADGE_ENTRIES.find((e) => lower.includes(e.match))?.label ?? "🗺 Transit";
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
				"cursor-pointer border-l-2 transition",
				selected
					? "border-l-minuri-teal bg-minuri-teal/5"
					: hovered
						? "border-l-transparent bg-minuri-teal/8"
						: "border-l-transparent hover:bg-minuri-fog/50",
			)}
		>
			{/* Photo strip */}
			<div className="relative h-36 w-full overflow-hidden bg-minuri-fog">
				{place.thumbnail ? (
					<Image
						src={place.thumbnail}
						alt={place.name}
						fill
						sizes="(max-width: 1024px) 100vw, 50vw"
						className="object-cover"
					/>
				) : (
					<div className="flex h-full items-center justify-center">
						<MapPin className="size-6 text-minuri-silver/50" />
					</div>
				)}
				<span className="absolute bottom-2 left-2 flex size-6 items-center justify-center rounded-full bg-minuri-mid/80 text-[10px] font-bold text-minuri-white backdrop-blur-sm">
					{index + 1}
				</span>
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
				<div className="flex items-start justify-between gap-2">
					<h3 className="text-sm font-semibold leading-snug text-minuri-mid">
						{place.name}
					</h3>
					{place.rating && (
						<RatingBadge rating={place.rating} reviewCount={place.reviewCount} variant="yellow" />
					)}
				</div>

				<div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-minuri-slate">
					{place.type && <span>{place.type}</span>}
					{place.distanceKm !== undefined && (
						<span className="rounded-full bg-minuri-fog px-2 py-0.5 text-[10px] font-medium">
							{place.distanceKm} km
						</span>
					)}
				</div>

				<div className="mt-1.5 flex items-center gap-1 text-xs text-minuri-slate">
					<MapPin className="size-3 shrink-0 text-minuri-teal" />
					<span className="truncate">{place.address.split(",")[0]}</span>
				</div>

				{hoursLabel && (
					<div className="mt-1.5">
						<OpenStatusBadge isOpen={isOpen} label={hoursLabel} />
					</div>
				)}

				{place.snippet && (
					<p className="mt-1.5 text-xs leading-relaxed text-minuri-slate/80">
						&ldquo;{place.snippet}&rdquo;
					</p>
				)}

				{topic === "food-eating" && place.serviceOptions && place.serviceOptions.length > 0 && (
					<div className="mt-2 flex flex-wrap gap-1">
						{place.serviceOptions.slice(0, 3).map((opt) => (
							<span
								key={opt}
								className="rounded-full bg-minuri-teal/10 px-2 py-0.5 text-[10px] font-medium text-minuri-teal"
							>
								{opt}
							</span>
						))}
					</div>
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

				<div className="mt-3 flex flex-wrap gap-2 border-t border-minuri-silver/30 pt-2.5">
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
					{place.phone && (
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
				</div>
			</div>
		</div>
	);
}

// ── List card (health-wellbeing, home-admin) — phone-forward, practical ──

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
			<div className="flex gap-4">
				<PlacePhoto place={place} className="h-20 w-20 rounded-lg" />

				<div className="min-w-0 flex-1">
					<div className="flex items-start justify-between gap-2">
						<h3 className="text-sm font-semibold text-minuri-mid">
							{index + 1}. {place.name}
						</h3>
						<div className="flex shrink-0 items-center gap-1">
							{place.rating && (
								<RatingBadge rating={place.rating} reviewCount={place.reviewCount} />
							)}
							{onToggleSave && (
								<HeartButton saved={saved} onToggle={onToggleSave} />
							)}
						</div>
					</div>

					{topic === "health-wellbeing" ? (
						<div className="mt-1">
							<OpenStatusBadge isOpen={isOpen} label={place.hours ?? ""} />
						</div>
					) : place.openNow ? (
						<div className="mt-1">
							<span className="inline-flex rounded bg-green-100 px-1.5 py-0.5 text-xs font-medium text-green-700">
								Open now
							</span>
						</div>
					) : null}

					<p className="mt-0.5 text-xs text-minuri-slate">
						{[
							place.type,
							topic !== "health-wellbeing" ? place.hours : undefined,
						]
							.filter(Boolean)
							.join(" · ")}
					</p>

					<p className="mt-1 flex items-center gap-1 text-xs text-minuri-slate">
						<MapPin className="size-3 shrink-0 text-minuri-teal" />
						{place.address}
						{place.distanceKm !== undefined && ` · ${place.distanceKm} km`}
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
						{place.phone && (
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
							href={getGoogleDirectionsUrl(place)}
							target="_blank"
							rel="noreferrer"
							onClick={(e) => e.stopPropagation()}
							className="inline-flex items-center gap-1 rounded-full border border-minuri-silver/60 px-2.5 py-1 text-[11px] font-medium text-minuri-slate transition hover:border-minuri-teal hover:text-minuri-teal"
						>
							<ExternalLink className="size-3" />
							Directions
						</a>
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
					</div>
				</div>
			</div>
		</div>
	);
}

// ── Compact card (getting-around) — minimal, map takes priority ──

function CompactCard({
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
				<div
					className={cn(
						"flex size-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
						selected
							? "bg-minuri-mid text-minuri-white"
							: "bg-minuri-teal text-minuri-white",
					)}
				>
					{index + 1}
				</div>

				<div className="min-w-0 flex-1">
					<div className="flex items-center justify-between gap-2">
						<h3 className="truncate text-sm font-medium text-minuri-mid">
							{place.name}
						</h3>
						<div className="flex shrink-0 items-center gap-1.5">
							{topic !== "social-belonging" && place.rating && (
								<span className="rounded bg-minuri-fog px-1.5 py-0.5 text-[10px] font-semibold text-minuri-slate">
									★ {place.rating}
								</span>
							)}
							{topic === "getting-around" ? (
								<span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] text-blue-700">
									{getTransitBadge(place.type)}
								</span>
							) : (
								place.type && (
									<span className="rounded bg-minuri-fog px-1.5 py-0.5 text-[10px] text-minuri-slate">
										{place.type}
									</span>
								)
							)}
							{topic === "social-belonging" &&
								place.subtype === "social-venues" &&
								place.tags
									?.filter((t) => /^\$+$/.test(t))
									.map((tag) => (
										<span
											key={tag}
											className="rounded bg-minuri-teal/10 px-1.5 py-0 text-[11px] font-medium text-minuri-teal"
										>
											{tag}
										</span>
									))}
							{onToggleSave && (
								<HeartButton saved={saved} onToggle={onToggleSave} />
							)}
						</div>
					</div>

					<div className="mt-0.5 flex items-center gap-2 text-[11px] text-minuri-slate">
						<span className="truncate">{place.address.split(",")[0]}</span>
					</div>

					{place.snippet && (
						<p className="mt-1 text-[11px] leading-relaxed text-minuri-slate/70">
							{place.snippet}
						</p>
					)}

					{topic === "social-belonging" && place.subtype === "community-spaces" && (
						<span className="mt-1 inline-block rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] text-amber-700">
							📅 Check for events
						</span>
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
