"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import type { NearMePlace } from "@/lib/near-me";

type NearMeMapProps = {
	places: NearMePlace[];
	selectedPlaceId: string | null;
	onSelectPlace: (id: string) => void;
};

function makeNumberedIcon(index: number, active: boolean) {
	const bg = active ? "#1a3a4a" : "#2a8a7a";
	const size = active ? 36 : 28;
	const fontSize = active ? 14 : 12;
	const svg = `
		<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size + 10}" viewBox="0 0 ${size} ${size + 10}">
			<circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="${bg}" stroke="white" stroke-width="2"/>
			<text x="${size / 2}" y="${size / 2 + fontSize / 3}" text-anchor="middle" fill="white" font-size="${fontSize}" font-weight="600" font-family="system-ui,sans-serif">${index + 1}</text>
			<polygon points="${size / 2 - 4},${size - 2} ${size / 2},${size + 8} ${size / 2 + 4},${size - 2}" fill="${bg}"/>
		</svg>`;

	return L.divIcon({
		html: svg,
		className: "",
		iconSize: [size, size + 10],
		iconAnchor: [size / 2, size + 10],
	});
}

export function NearMeMap({
	places,
	selectedPlaceId,
	onSelectPlace,
}: NearMeMapProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const mapRef = useRef<L.Map | null>(null);
	const markersRef = useRef<L.Marker[]>([]);

	useEffect(() => {
		if (!containerRef.current) return;
		if (mapRef.current) return;

		mapRef.current = L.map(containerRef.current, {
			zoomControl: false,
			attributionControl: true,
		}).setView([-37.813, 144.963], 14);

		L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
			attribution: "&copy; OpenStreetMap contributors",
			maxZoom: 19,
		}).addTo(mapRef.current);

		L.control.zoom({ position: "topright" }).addTo(mapRef.current);

		return () => {
			mapRef.current?.remove();
			mapRef.current = null;
		};
	}, []);

	useEffect(() => {
		const map = mapRef.current;
		if (!map) return;

		for (const m of markersRef.current) {
			m.remove();
		}
		markersRef.current = [];

		if (!places.length) return;

		const group = L.latLngBounds(
			places.map((p) => [p.lat, p.lng] as L.LatLngTuple),
		);
		map.fitBounds(group, { padding: [40, 40], maxZoom: 15 });

		for (let i = 0; i < places.length; i++) {
			const place = places[i];
			const active = place.id === selectedPlaceId;
			const marker = L.marker([place.lat, place.lng], {
				icon: makeNumberedIcon(i, active),
				zIndexOffset: active ? 1000 : 0,
			});
			marker.on("click", () => onSelectPlace(place.id));
			marker.bindTooltip(place.name, {
				direction: "top",
				offset: [0, -34],
				className: "near-me-tooltip",
			});
			marker.addTo(map);
			markersRef.current.push(marker);
		}
	}, [places, selectedPlaceId, onSelectPlace]);

	useEffect(() => {
		const map = mapRef.current;
		if (!map || !selectedPlaceId) return;

		const place = places.find((p) => p.id === selectedPlaceId);
		if (place) {
			map.panTo([place.lat, place.lng], { animate: true, duration: 0.4 });
		}
	}, [selectedPlaceId, places]);

	return <div ref={containerRef} className="h-full w-full" />;
}
