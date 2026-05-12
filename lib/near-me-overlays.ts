import maplibregl from "maplibre-gl";
import type { NearMeTopic } from "@/lib/near-me";

// ── GeoJSON fetch cache (per session) ──

const geoCache = new Map<string, GeoJSON.FeatureCollection>();

async function fetchGeoJSON(
	path: string,
	signal: AbortSignal,
): Promise<GeoJSON.FeatureCollection> {
	if (geoCache.has(path)) return geoCache.get(path)!;
	const res = await fetch(path, { signal });
	if (!res.ok) throw new Error(`GeoJSON fetch failed: ${res.status} ${path}`);
	const data = (await res.json()) as GeoJSON.FeatureCollection;
	geoCache.set(path, data);
	return data;
}

// ── Inline GeoJSON — hospitals ──

const HOSPITALS: GeoJSON.FeatureCollection = {
	type: "FeatureCollection",
	features: [
		{ type: "Feature", properties: { name: "Royal Melbourne Hospital" },       geometry: { type: "Point", coordinates: [144.9558, -37.7994] } },
		{ type: "Feature", properties: { name: "The Alfred" },                     geometry: { type: "Point", coordinates: [144.9798, -37.8459] } },
		{ type: "Feature", properties: { name: "St Vincent's Hospital" },          geometry: { type: "Point", coordinates: [144.9783, -37.8069] } },
		{ type: "Feature", properties: { name: "Royal Children's Hospital" },      geometry: { type: "Point", coordinates: [144.9498, -37.7976] } },
		{ type: "Feature", properties: { name: "Monash Medical Centre" },          geometry: { type: "Point", coordinates: [145.1257, -37.9262] } },
		{ type: "Feature", properties: { name: "Austin Hospital" },                geometry: { type: "Point", coordinates: [145.0609, -37.7546] } },
		{ type: "Feature", properties: { name: "Box Hill Hospital" },              geometry: { type: "Point", coordinates: [145.1209, -37.8216] } },
		{ type: "Feature", properties: { name: "Footscray Hospital" },             geometry: { type: "Point", coordinates: [144.8957, -37.8007] } },
		{ type: "Feature", properties: { name: "Dandenong Hospital" },             geometry: { type: "Point", coordinates: [145.2205, -37.9874] } },
		{ type: "Feature", properties: { name: "Frankston Hospital" },             geometry: { type: "Point", coordinates: [145.1274, -38.1464] } },
		{ type: "Feature", properties: { name: "Sunshine Hospital" },              geometry: { type: "Point", coordinates: [144.8289, -37.7819] } },
		{ type: "Feature", properties: { name: "The Northern Hospital" },          geometry: { type: "Point", coordinates: [145.0137, -37.6613] } },
		{ type: "Feature", properties: { name: "Casey Hospital" },                 geometry: { type: "Point", coordinates: [145.2993, -38.0636] } },
		{ type: "Feature", properties: { name: "Maroondah Hospital" },             geometry: { type: "Point", coordinates: [145.2242, -37.8119] } },
		{ type: "Feature", properties: { name: "Werribee Mercy Hospital" },        geometry: { type: "Point", coordinates: [144.6597, -37.9065] } },
	],
};

// ── Inline GeoJSON — markets ──

const MARKETS: GeoJSON.FeatureCollection = {
	type: "FeatureCollection",
	features: [
		{ type: "Feature", properties: { name: "Queen Victoria Market" },    geometry: { type: "Point", coordinates: [144.9568, -37.8065] } },
		{ type: "Feature", properties: { name: "South Melbourne Market" },   geometry: { type: "Point", coordinates: [144.9567, -37.8330] } },
		{ type: "Feature", properties: { name: "Prahran Market" },           geometry: { type: "Point", coordinates: [144.9943, -37.8497] } },
		{ type: "Feature", properties: { name: "Preston Market" },           geometry: { type: "Point", coordinates: [145.0104, -37.7413] } },
		{ type: "Feature", properties: { name: "Dandenong Market" },         geometry: { type: "Point", coordinates: [145.2175, -37.9889] } },
		{ type: "Feature", properties: { name: "Footscray Market" },         geometry: { type: "Point", coordinates: [144.8990, -37.8000] } },
		{ type: "Feature", properties: { name: "Camberwell Sunday Market" }, geometry: { type: "Point", coordinates: [145.0651, -37.8443] } },
		{ type: "Feature", properties: { name: "Coburg Farmers Market" },    geometry: { type: "Point", coordinates: [144.9660, -37.7437] } },
	],
};

// ── Layer helpers ──

// Find a stable layer to insert overlays below so road labels stay readable.
// MapTiler Streets v2 uses OpenMapTiles naming conventions.
function findBeforeId(map: maplibregl.Map): string | undefined {
	const candidates = [
		"road-label",
		"road_label",
		"place-label",
		"poi-label",
		"transit-label",
		"waterway-label",
	];
	for (const id of candidates) {
		if (map.getLayer(id)) return id;
	}
	return undefined;
}

// ── Public API ──

export function removeTopicOverlays(map: maplibregl.Map): void {
	const style = map.getStyle();
	if (!style?.layers) return;
	for (const layer of style.layers) {
		if (layer.id.startsWith("nm-overlay-")) {
			map.removeLayer(layer.id);
		}
	}
	const sources = style.sources ?? {};
	for (const sourceId of Object.keys(sources)) {
		if (sourceId.startsWith("nm-overlay-")) {
			map.removeSource(sourceId);
		}
	}
}

export async function addTopicOverlay(
	map: maplibregl.Map,
	topic: NearMeTopic,
	signal: AbortSignal,
): Promise<void> {
	switch (topic) {
		case "getting-around":
			return addGettingAroundOverlay(map, signal);
		case "health-wellbeing":
			return addHealthOverlay(map);
		case "social-belonging":
			return addSocialOverlay(map, signal);
		case "food-eating":
			return addFoodOverlay(map);
		default:
			return; // home-admin: no overlay
	}
}

// ── Getting Around — tram tracks + train tracks ──

async function addGettingAroundOverlay(
	map: maplibregl.Map,
	signal: AbortSignal,
): Promise<void> {
	const [trams, trains] = await Promise.all([
		fetchGeoJSON("/geodata/melbourne-trams.geojson", signal),
		fetchGeoJSON("/geodata/melbourne-trains.geojson", signal),
	]);
	if (signal.aborted) return;

	const beforeId = findBeforeId(map);

	map.addSource("nm-overlay-trams", { type: "geojson", data: trams });
	map.addLayer(
		{
			id: "nm-overlay-tram-lines",
			type: "line",
			source: "nm-overlay-trams",
			paint: {
				"line-color": "#c0392b",
				"line-width": 2,
				"line-opacity": 0.65,
			},
		},
		beforeId,
	);

	map.addSource("nm-overlay-trains", { type: "geojson", data: trains });
	map.addLayer(
		{
			id: "nm-overlay-train-lines",
			type: "line",
			source: "nm-overlay-trains",
			paint: {
				"line-color": "#1a5276",
				"line-width": 2.5,
				"line-opacity": 0.65,
			},
		},
		beforeId,
	);
}

// ── Health & Wellbeing — hospital markers ──

function addHealthOverlay(map: maplibregl.Map): void {
	map.addSource("nm-overlay-hospitals", { type: "geojson", data: HOSPITALS });

	map.addLayer({
		id: "nm-overlay-hospital-markers",
		type: "circle",
		source: "nm-overlay-hospitals",
		paint: {
			"circle-radius": 8,
			"circle-color": "#ef4444",
			"circle-stroke-width": 2,
			"circle-stroke-color": "#ffffff",
			"circle-opacity": 0.9,
		},
	});

	map.addLayer({
		id: "nm-overlay-hospital-labels",
		type: "symbol",
		source: "nm-overlay-hospitals",
		layout: {
			"text-field": ["get", "name"],
			"text-size": 10,
			"text-offset": [0, 1.5],
			"text-anchor": "top",
			"text-max-width": 10,
		},
		paint: {
			"text-color": "#991b1b",
			"text-halo-color": "#ffffff",
			"text-halo-width": 1,
		},
	});
}

// ── Social & Belonging — named parks ──

async function addSocialOverlay(
	map: maplibregl.Map,
	signal: AbortSignal,
): Promise<void> {
	const parks = await fetchGeoJSON("/geodata/melbourne-parks.geojson", signal);
	if (signal.aborted) return;

	const beforeId = findBeforeId(map);

	map.addSource("nm-overlay-parks", { type: "geojson", data: parks });

	map.addLayer(
		{
			id: "nm-overlay-park-fills",
			type: "fill",
			source: "nm-overlay-parks",
			paint: {
				"fill-color": "#2d6a4f",
				"fill-opacity": 0.22,
			},
		},
		beforeId,
	);

	map.addLayer(
		{
			id: "nm-overlay-park-outlines",
			type: "line",
			source: "nm-overlay-parks",
			paint: {
				"line-color": "#1b4332",
				"line-width": 1,
				"line-opacity": 0.35,
			},
		},
		beforeId,
	);

	map.addLayer({
		id: "nm-overlay-park-labels",
		type: "symbol",
		source: "nm-overlay-parks",
		minzoom: 13,
		layout: {
			"text-field": ["get", "PARK_NAME"],
			"text-size": 10,
			"text-anchor": "center",
			"text-max-width": 8,
		},
		paint: {
			"text-color": "#1b4332",
			"text-halo-color": "#ffffff",
			"text-halo-width": 1.5,
		},
	});
}

// ── Food & Eating — market markers ──

function addFoodOverlay(map: maplibregl.Map): void {
	map.addSource("nm-overlay-markets", { type: "geojson", data: MARKETS });

	map.addLayer({
		id: "nm-overlay-market-markers",
		type: "circle",
		source: "nm-overlay-markets",
		paint: {
			"circle-radius": 9,
			"circle-color": "#e07b39",
			"circle-stroke-width": 2.5,
			"circle-stroke-color": "#ffffff",
			"circle-opacity": 0.85,
		},
	});

	map.addLayer({
		id: "nm-overlay-market-labels",
		type: "symbol",
		source: "nm-overlay-markets",
		layout: {
			"text-field": ["get", "name"],
			"text-size": 10,
			"text-offset": [0, 1.6],
			"text-anchor": "top",
			"text-max-width": 10,
		},
		paint: {
			"text-color": "#7c3a11",
			"text-halo-color": "#ffffff",
			"text-halo-width": 1.5,
		},
	});
}
