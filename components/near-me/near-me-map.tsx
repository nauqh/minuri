"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { renderToStaticMarkup } from "react-dom/server";

import type { NearMePlace } from "@/lib/near-me";

type NearMeMapProps = {
	places: NearMePlace[];
	selectedPlaceId: string | null;
	onSelectPlace: (id: string) => void;
};

function makePinIcon(index: number, active: boolean) {
	const color = active ? "#1a3a4a" : "#2a8a7a";
	const size = active ? 34 : 30;
	const iconMarkup = renderToStaticMarkup(
		<div
			style={{
				position: "relative",
				width: size,
				height: size + 10,
				display: "flex",
				alignItems: "flex-start",
				justifyContent: "center",
			}}
		>
			<div
				style={{
					width: size,
					height: size,
					borderRadius: "9999px",
					backgroundColor: color,
					border: "2px solid white",
					color: "white",
					fontWeight: 700,
					fontSize: active ? 14 : 12,
					lineHeight: 1,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					boxShadow: "0 2px 8px rgba(0, 0, 0, 0.25)",
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
					borderTop: `8px solid ${color}`,
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

		L.tileLayer("https://tile.openstreetmap.bzh/ca/{z}/{x}/{y}.png", {
			maxZoom: 19,
			attribution:
				'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles courtesy of <a href="https://www.openstreetmap.cat" target="_blank">Breton OpenStreetMap Team</a>',
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
				icon: makePinIcon(i, active),
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
