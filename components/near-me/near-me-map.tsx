"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { renderToStaticMarkup } from "react-dom/server";

import { haversineKm, TOPIC_COLORS, type NearMePlace, type NearMeTopic } from "@/lib/near-me";
import { addTopicOverlay, removeTopicOverlays } from "@/lib/near-me-overlays";

// ── Overlay legend config ──

type LegendItem = { color: string; shape: "circle" | "line" | "square"; label: string };

const OVERLAY_LEGENDS: Partial<Record<NearMeTopic, LegendItem[]>> = {
	"getting-around": [
		{ color: "#c0392b", shape: "line",   label: "Tram lines"    },
		{ color: "#1a5276", shape: "line",   label: "Train lines"   },
	],
	"health-wellbeing": [
		{ color: "#ef4444", shape: "circle", label: "Major hospitals" },
	],
	"social-belonging": [
		{ color: "#2d6a4f", shape: "square", label: "Parks"          },
	],
	"food-eating": [
		{ color: "#e07b39", shape: "circle", label: "Markets"        },
	],
};


function darkenColor(hex: string): string {
	const r = Math.max(0, parseInt(hex.slice(1, 3), 16) - 40);
	const g = Math.max(0, parseInt(hex.slice(3, 5), 16) - 40);
	const b = Math.max(0, parseInt(hex.slice(5, 7), 16) - 40);
	return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

// ── HTML helpers ──

function escapeHtml(str: string): string {
	return str
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");
}

function getDirectionsUrl(place: NearMePlace): string {
	if (Number.isFinite(place.lat) && Number.isFinite(place.lng)) {
		return `https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`;
	}
	return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(place.address)}`;
}

// ── Pin icon ──

function makePinIcon(
	index: number,
	active: boolean,
	hovered: boolean,
	color: string,
	animDelay: number | false,
): HTMLElement {
	const bgColor = active ? darkenColor(color) : color;
	const size = active ? 34 : hovered ? 32 : 30;

	const animStyle: React.CSSProperties =
		animDelay !== false
			? {
					animationName: "nmMarkerDrop",
					animationDuration: "280ms",
					animationTimingFunction: "ease-out",
					animationDelay: `${animDelay}ms`,
					animationFillMode: "both",
				}
			: {};

	const iconMarkup = renderToStaticMarkup(
		<div
			className="nm-marker-anim"
			style={{
				position: "relative",
				width: size,
				height: size + 10,
				display: "flex",
				alignItems: "flex-start",
				justifyContent: "center",
				...animStyle,
			}}
		>
			<div
				style={{
					width: size,
					height: size,
					borderRadius: "9999px",
					backgroundColor: bgColor,
					border: "2px solid white",
					color: "white",
					fontWeight: 700,
					fontSize: active ? 14 : 12,
					lineHeight: 1,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					boxShadow:
						hovered && !active
							? `0 0 0 4px ${bgColor}33, 0 2px 8px rgba(0,0,0,0.25)`
							: "0 2px 8px rgba(0,0,0,0.25)",
				}}
			>
				{index + 1}
			</div>
			<div
				style={{
					position: "absolute",
					left: "50%",
					bottom: 0,
					transform: "translateX(-50%)",
					width: 0,
					height: 0,
					borderLeft: "5px solid transparent",
					borderRight: "5px solid transparent",
					borderTop: `8px solid ${bgColor}`,
				}}
			/>
		</div>,
	);

	const el = document.createElement("div");
	el.innerHTML = iconMarkup;
	return el;
}

// ── Popup HTML ──

function formatK(n: number): string {
	return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

function makePopupContent(
	place: NearMePlace,
	index: number,
	color: string,
): string {
	const darkColor = darkenColor(color);
	const dirUrl = getDirectionsUrl(place);
	const phoneRaw = place.phone?.replace(/\s+/g, "") ?? "";

	const thumbHtml = place.thumbnail
		? `<img src="${escapeHtml(place.thumbnail)}" alt="" style="width:100%;height:80px;object-fit:cover;display:block;border-radius:10px 10px 0 0">`
		: `<div style="width:100%;height:52px;background:#f0f4f5;display:flex;align-items:center;justify-content:center;border-radius:10px 10px 0 0"><svg width="18" height="18" fill="none" stroke="#9baabb" stroke-width="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></div>`;

	const ratingHtml = place.rating
		? `<span style="font-size:11px;color:#374151">⭐ ${place.rating.toFixed(1)}${place.reviewCount ? ` (${formatK(place.reviewCount)})` : ""}</span>`
		: "";

	const openLabel = place.hours
		? `${place.openNow ? "Open" : "Closed"} · ${escapeHtml(place.hours)}`
		: place.openNow
			? "Open now"
			: "";
	const statusParts = [
		place.type ? escapeHtml(place.type) : "",
		openLabel
			? `<span style="color:${place.openNow ? "#16a34a" : "#dc2626"};font-weight:500">${escapeHtml(openLabel)}</span>`
			: "",
	].filter(Boolean);

	const btn = `text-decoration:none;display:inline-flex;align-items:center;gap:3px;border-radius:20px;padding:4px 10px;font-size:11px;font-weight:500;cursor:pointer`;

	const callHtml = place.phone
		? `<a href="tel:${escapeHtml(phoneRaw)}" style="${btn};border:1px solid ${color}44;color:${darkColor};background:${color}12">&#128222; Call</a>`
		: "";

	return [
		`<div style="font-family:system-ui,-apple-system,sans-serif;max-width:280px;border-radius:12px;overflow:hidden">`,
		thumbHtml,
		`<div style="padding:10px 12px 12px">`,
		`<div style="display:flex;align-items:flex-start;gap:8px;justify-content:space-between;margin-bottom:4px">`,
		`<strong style="font-size:13px;color:#1e3a4a;line-height:1.3;flex:1">${index + 1}. ${escapeHtml(place.name)}</strong>`,
		ratingHtml,
		`</div>`,
		statusParts.length
			? `<div style="font-size:11px;color:#6b7280;margin-bottom:6px">${statusParts.join(" · ")}</div>`
			: "",
		`<div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:6px">`,
		`<a href="${escapeHtml(dirUrl)}" target="_blank" rel="noreferrer" style="${btn};border:1px solid #d1d5db;color:#4b5563;background:white">&#8599; Directions</a>`,
		callHtml,
		`</div>`,
		`</div>`,
		`</div>`,
	].join("");
}

// ── Component ──

type NearMeMapProps = {
	places: NearMePlace[];
	selectedPlaceId: string | null;
	onSelectPlace: (id: string) => void;
	topic: NearMeTopic;
	hoveredPlaceId: string | null;
	onHoverPlace: (id: string | null) => void;
	onSearchArea?: (center: { lat: number; lng: number }) => void;
	userLat?: number | null;
	userLng?: number | null;
};

export function NearMeMap({
	places,
	selectedPlaceId,
	onSelectPlace,
	topic,
	hoveredPlaceId,
	onHoverPlace,
	onSearchArea,
	userLat,
	userLng,
}: NearMeMapProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const mapRef = useRef<maplibregl.Map | null>(null);
	const markerMapRef = useRef<
		Map<string, { marker: maplibregl.Marker; el: HTMLElement; index: number }>
	>(new Map());
	const userDotRef = useRef<maplibregl.Marker | null>(null);
	const originalCenterRef = useRef<{ lat: number; lng: number } | null>(null);
	const [showSearchArea, setShowSearchArea] = useState(false);

	// Inject shared CSS once
	useEffect(() => {
		if (document.getElementById("nm-map-styles")) return;
		const el = document.createElement("style");
		el.id = "nm-map-styles";
		el.textContent = `
      @keyframes nmMarkerDrop {
        from { transform: scale(0) translateY(-8px); opacity: 0; }
        to   { transform: scale(1) translateY(0);    opacity: 1; }
      }
      @keyframes nmGpsPulse {
        0%   { transform: translate(-50%,-50%) scale(1);   opacity: 0.4; }
        100% { transform: translate(-50%,-50%) scale(1.8); opacity: 0;   }
      }
      .nm-gps-pulse { animation: nmGpsPulse 2s ease-out infinite; }
      .near-me-popup .maplibregl-popup-content {
        border-radius: 12px; padding: 0; overflow: hidden;
        box-shadow: 0 8px 32px -8px rgba(0,0,0,0.22);
      }
      .near-me-popup .maplibregl-popup-tip { display: none; }
      @media (prefers-reduced-motion: reduce) {
        .nm-marker-anim { animation: none !important; }
        .nm-gps-pulse   { animation: none !important; }
      }
    `;
		document.head.appendChild(el);
	}, []);

	// Initialize map with MapTiler Streets v2
	useEffect(() => {
		if (!containerRef.current || mapRef.current) return;

		const map = new maplibregl.Map({
			container: containerRef.current,
			style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`,
			center: [144.963, -37.813],
			zoom: 13,
		});

		map.addControl(new maplibregl.NavigationControl(), "top-right");

		map.on("moveend", () => {
			if (!originalCenterRef.current) return;
			const c = map.getCenter();
			const dist =
				haversineKm(
					c.lat,
					c.lng,
					originalCenterRef.current.lat,
					originalCenterRef.current.lng,
				) * 1000;
			setShowSearchArea(dist > 800);
		});

		mapRef.current = map;

		return () => {
			map.remove();
			mapRef.current = null;
		};
	}, []);

	// Topic-sensitive map overlays (tram/train lines, hospitals, parks, markets)
	useEffect(() => {
		const map = mapRef.current;
		if (!map) return;

		const controller = new AbortController();

		const applyOverlay = () => {
			removeTopicOverlays(map);
			addTopicOverlay(map, topic, controller.signal).catch(console.error);
		};

		if (map.isStyleLoaded()) {
			applyOverlay();
		} else {
			map.once("load", applyOverlay);
		}

		return () => {
			controller.abort();
			map.off("load", applyOverlay);
		};
	}, [topic]);

	// Recreate markers when places or topic changes (plays stagger animation)
	useEffect(() => {
		const map = mapRef.current;
		if (!map) return;

		for (const { marker } of markerMapRef.current.values()) marker.remove();
		markerMapRef.current.clear();

		if (!places.length) return;

		const color = TOPIC_COLORS[topic];
		const bounds = new maplibregl.LngLatBounds();
		places.forEach((p) => bounds.extend([p.lng, p.lat]));
		setShowSearchArea(false);
		originalCenterRef.current = null;
		map.once("moveend", () => {
			const c = map.getCenter();
			originalCenterRef.current = { lat: c.lat, lng: c.lng };
		});
		map.fitBounds(bounds, { padding: 40, maxZoom: 15 });

		for (let i = 0; i < places.length; i++) {
			const place = places[i];
			const active = place.id === selectedPlaceId;
			const hovered = place.id === hoveredPlaceId;
			const el = makePinIcon(i, active, hovered, color, i * 40);
			el.style.zIndex = active ? "1000" : hovered ? "500" : "0";
			const popup = new maplibregl.Popup({
				closeButton: true,
				maxWidth: "300px",
				className: "near-me-popup",
			}).setHTML(makePopupContent(place, i, color));
			const marker = new maplibregl.Marker({ element: el, anchor: "bottom" })
				.setLngLat([place.lng, place.lat])
				.setPopup(popup)
				.addTo(map);
			el.addEventListener("click", () => onSelectPlace(place.id));
			el.addEventListener("mouseover", () => onHoverPlace(place.id));
			el.addEventListener("mouseout", () => onHoverPlace(null));
			markerMapRef.current.set(place.id, { marker, el, index: i });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [places, topic]);

	// Update pin state without replaying drop animation
	useEffect(() => {
		const color = TOPIC_COLORS[topic];
		for (const [placeId, { el, index }] of markerMapRef.current) {
			const active = placeId === selectedPlaceId;
			const hovered = placeId === hoveredPlaceId;
			const updated = makePinIcon(index, active, hovered, color, false);
			el.innerHTML = updated.innerHTML;
			el.style.zIndex = active ? "1000" : hovered ? "500" : "0";
		}
	}, [selectedPlaceId, hoveredPlaceId, topic]);

	// Pan to selected place
	useEffect(() => {
		const map = mapRef.current;
		if (!map || !selectedPlaceId) return;
		const place = places.find((p) => p.id === selectedPlaceId);
		if (place) map.flyTo({ center: [place.lng, place.lat], speed: 1.2 });
	}, [selectedPlaceId, places]);

	// GPS user dot
	useEffect(() => {
		const map = mapRef.current;
		if (userDotRef.current) {
			userDotRef.current.remove();
			userDotRef.current = null;
		}
		if (!map || userLat == null || userLng == null) return;

		const el = document.createElement("div");
		el.innerHTML = `<div style="position:relative;width:40px;height:40px"><div class="nm-gps-pulse" style="position:absolute;width:32px;height:32px;background:#3b82f633;border-radius:50%;top:50%;left:50%"></div><div style="position:absolute;width:16px;height:16px;background:#3b82f6;border:2.5px solid white;border-radius:50%;top:50%;left:50%;transform:translate(-50%,-50%);box-shadow:0 2px 8px rgba(59,130,246,0.35)"></div></div>`;
		const dot = new maplibregl.Marker({ element: el, anchor: "center" })
			.setLngLat([userLng, userLat])
			.addTo(map);
		userDotRef.current = dot;
	}, [userLat, userLng]);

	function handleSearchAreaClick() {
		const map = mapRef.current;
		if (!map || !onSearchArea) return;
		const center = map.getCenter();
		setShowSearchArea(false);
		originalCenterRef.current = { lat: center.lat, lng: center.lng };
		onSearchArea({ lat: center.lat, lng: center.lng });
	}

	const legendItems = OVERLAY_LEGENDS[topic];

	return (
		<div className="relative h-full w-full">
			<div ref={containerRef} className="h-full w-full" />

			{/* Overlay legend */}
			{legendItems && (
				<div className="absolute top-3 left-3 z-[800] flex flex-col gap-2.5 rounded-xl bg-white/95 px-4 py-3 shadow-md backdrop-blur-sm 2xl:gap-3 2xl:px-5 2xl:py-4">
					{legendItems.map((item) => (
						<div key={item.label} className="flex items-center gap-2.5 2xl:gap-3">
							{item.shape === "circle" && (
								<span
									className="inline-block size-3.5 flex-shrink-0 rounded-full 2xl:size-4"
									style={{ backgroundColor: item.color }}
								/>
							)}
							{item.shape === "line" && (
								<span
									className="inline-block h-[3px] w-5 flex-shrink-0 rounded-full 2xl:h-1 2xl:w-6"
									style={{ backgroundColor: item.color }}
								/>
							)}
							{item.shape === "square" && (
								<span
									className="inline-block size-3.5 flex-shrink-0 rounded-sm 2xl:size-4"
									style={{ backgroundColor: item.color, opacity: 0.75 }}
								/>
							)}
							<span className="text-sm font-medium leading-none text-gray-700 2xl:text-base">{item.label}</span>
						</div>
					))}
				</div>
			)}

			{showSearchArea && onSearchArea && (
				<button
					type="button"
					onClick={handleSearchAreaClick}
					className="absolute left-1/2 top-3 z-[800] -translate-x-1/2 cursor-pointer rounded-full border border-minuri-teal/30 bg-minuri-white px-4 py-2 text-xs font-semibold text-minuri-teal shadow-md transition hover:bg-minuri-teal/8"
				>
					Search this area
				</button>
			)}
		</div>
	);
}
