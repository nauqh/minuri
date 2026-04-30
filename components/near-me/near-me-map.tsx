"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { renderToStaticMarkup } from "react-dom/server";

import type { NearMePlace, NearMeTopic } from "@/lib/near-me";

// ── Topic colours ──

const TOPIC_COLORS: Record<NearMeTopic, string> = {
	survive: "#e07b39",
	health: "#3a8a5a",
	"get-around": "#3a6aaa",
	setup: "#2a8a7a",
	connect: "#7a6aaa",
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
) {
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

	return L.divIcon({
		html: iconMarkup,
		className: "",
		iconSize: [size, size + 10],
		iconAnchor: [size / 2, size + 10],
	});
}

// ── Popup HTML ──

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
		? `<span style="background:${darkColor};color:white;font-size:10px;font-weight:700;padding:2px 7px;border-radius:4px;white-space:nowrap;flex-shrink:0">&#9733; ${place.rating}</span>`
		: "";

	const statusParts = [
		place.type ? escapeHtml(place.type) : "",
		place.openNow
			? `<span style="color:#16a34a;font-weight:500">Open now</span>`
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
	const mapRef = useRef<L.Map | null>(null);
	const markerMapRef = useRef<
		Map<string, { marker: L.Marker; index: number }>
	>(new Map());
	const userDotRef = useRef<L.Marker | null>(null);
	const originalCenterRef = useRef<L.LatLng | null>(null);
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
      .near-me-popup .leaflet-popup-content-wrapper {
        border-radius: 12px; padding: 0; overflow: hidden;
        box-shadow: 0 8px 32px -8px rgba(0,0,0,0.22);
      }
      .near-me-popup .leaflet-popup-content { margin: 0; }
      .near-me-popup .leaflet-popup-tip-container { display: none; }
      @media (prefers-reduced-motion: reduce) {
        .nm-marker-anim { animation: none !important; }
        .nm-gps-pulse   { animation: none !important; }
      }
    `;
		document.head.appendChild(el);
	}, []);

	// Initialize map with CartoDB Positron tiles
	useEffect(() => {
		if (!containerRef.current || mapRef.current) return;

		const map = L.map(containerRef.current, {
			zoomControl: false,
			attributionControl: true,
		}).setView([-37.813, 144.963], 14);

		L.tileLayer(
			"https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
			{
				maxZoom: 19,
				subdomains: ["a", "b", "c", "d"],
				attribution:
					'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
			},
		).addTo(map);

		L.control.zoom({ position: "topright" }).addTo(map);

		map.on("moveend", () => {
			if (!originalCenterRef.current) return;
			const dist = map.getCenter().distanceTo(originalCenterRef.current);
			setShowSearchArea(dist > 800);
		});

		mapRef.current = map;

		return () => {
			map.remove();
			mapRef.current = null;
		};
	}, []);

	// Recreate markers when places or topic changes (plays stagger animation)
	useEffect(() => {
		const map = mapRef.current;
		if (!map) return;

		for (const { marker } of markerMapRef.current.values()) marker.remove();
		markerMapRef.current.clear();

		if (!places.length) return;

		const color = TOPIC_COLORS[topic];
		const group = L.latLngBounds(
			places.map((p) => [p.lat, p.lng] as L.LatLngTuple),
		);
		setShowSearchArea(false);
		originalCenterRef.current = null;
		map.fitBounds(group, { padding: [40, 40], maxZoom: 15 });
		map.once("moveend", () => {
			originalCenterRef.current = map.getCenter();
		});

		for (let i = 0; i < places.length; i++) {
			const place = places[i];
			const active = place.id === selectedPlaceId;
			const hovered = place.id === hoveredPlaceId;
			const marker = L.marker([place.lat, place.lng], {
				icon: makePinIcon(i, active, hovered, color, i * 40),
				zIndexOffset: active ? 1000 : hovered ? 500 : 0,
			});
			marker.on("click", () => onSelectPlace(place.id));
			marker.on("mouseover", () => onHoverPlace(place.id));
			marker.on("mouseout", () => onHoverPlace(null));
			marker.bindPopup(makePopupContent(place, i, color), {
				closeButton: true,
				autoPan: true,
				maxWidth: 300,
				className: "near-me-popup",
			});
			marker.addTo(map);
			markerMapRef.current.set(place.id, { marker, index: i });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [places, topic]);

	// Update icons only when selected/hovered changes (no animation replay)
	useEffect(() => {
		const color = TOPIC_COLORS[topic];
		for (const [placeId, { marker, index }] of markerMapRef.current) {
			const active = placeId === selectedPlaceId;
			const hovered = placeId === hoveredPlaceId;
			marker.setIcon(makePinIcon(index, active, hovered, color, false));
			marker.setZIndexOffset(active ? 1000 : hovered ? 500 : 0);
		}
	}, [selectedPlaceId, hoveredPlaceId, topic]);

	// Pan to selected place
	useEffect(() => {
		const map = mapRef.current;
		if (!map || !selectedPlaceId) return;
		const place = places.find((p) => p.id === selectedPlaceId);
		if (place) map.panTo([place.lat, place.lng], { animate: true, duration: 0.4 });
	}, [selectedPlaceId, places]);

	// GPS user dot
	useEffect(() => {
		const map = mapRef.current;
		if (userDotRef.current) {
			userDotRef.current.remove();
			userDotRef.current = null;
		}
		if (!map || userLat == null || userLng == null) return;

		const dot = L.marker([userLat, userLng], {
			icon: L.divIcon({
				className: "",
				html: `<div style="position:relative;width:40px;height:40px"><div class="nm-gps-pulse" style="position:absolute;width:32px;height:32px;background:#3b82f633;border-radius:50%;top:50%;left:50%"></div><div style="position:absolute;width:16px;height:16px;background:#3b82f6;border:2.5px solid white;border-radius:50%;top:50%;left:50%;transform:translate(-50%,-50%);box-shadow:0 2px 8px rgba(59,130,246,0.35)"></div></div>`,
				iconSize: [40, 40],
				iconAnchor: [20, 20],
			}),
			zIndexOffset: 2000,
		}).addTo(map);
		userDotRef.current = dot;
	}, [userLat, userLng]);

	function handleSearchAreaClick() {
		const map = mapRef.current;
		if (!map || !onSearchArea) return;
		const center = map.getCenter();
		setShowSearchArea(false);
		originalCenterRef.current = center;
		onSearchArea({ lat: center.lat, lng: center.lng });
	}

	return (
		<div className="relative h-full w-full">
			<div ref={containerRef} className="h-full w-full" />
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
