# PRD: Near Me — Map Engine Upgrade (Leaflet → MapLibre GL JS)

**Status: COMPLETED**

## Problem Statement

The Near Me map used Leaflet with CartoDB Positron raster tiles. Positron is a data-visualisation base map — deliberately stripped of colour, building footprints, and park fills. Parks appeared as grey voids. Water had no colour. Streets had no visual hierarchy. On high-DPI screens, raster PNG tiles were blurry and snapped between zoom levels instead of animating smoothly. The map did not read as a wayfinding tool to a newcomer unfamiliar with Melbourne suburbs.

## Solution

Replaced Leaflet with **MapLibre GL JS** (open-source, MIT) pointed at **MapTiler Streets v2** vector tiles. MapTiler Streets v2 is visually close to Google Maps: green parks, blue water, road hierarchy, building footprints, and dense street labels. Vector tiles are crisp at all pixel densities and support smooth continuous zoom.

The migration was scoped to `near-me-map`. All existing behaviour is preserved. Beyond the engine swap, the following enhancements were added in the same iteration:

- **Topic-sensitive map overlays** — tram/train lines, hospital markers, park fills, market markers (see `iteration3/map-overlay-plan.md`)
- **Map legend** — top-left overlay chip explaining active layers per topic
- **Topic intro strip** — left-pane contextual text above results explaining what each topic finds and what is shown on the map

---

## Implementation Decisions

### Scope
Only `near-me-map.tsx` modified. Public prop interface (`NearMeMapProps`) unchanged. Both importers (`near-me-view`, `journey-nearby-panel`) already used `dynamic(..., { ssr: false })` — no parent changes needed. `map.remove()` already existed in the cleanup `useEffect` — preserved unchanged.

### Map engine
`maplibregl.Map` replaces `L.Map`. Style URL encodes tile source so `L.tileLayer` is removed entirely. `maplibregl.NavigationControl` replaces `L.control.zoom`.

**Deviation from plan:** `attributionControl: true` is not a valid option in MapLibre GL JS v5 — attribution is on by default. The option was removed.

**Dependency:** `maplibre-gl@^5.24.0` installed. `maplibre-gl` ships its own TypeScript types — no `@types/` package needed. `leaflet`, `react-leaflet`, `@types/leaflet` uninstalled after verification.

### Coordinate order
MapLibre uses `[lng, lat]` everywhere. All coordinate pairs swapped from Leaflet's `[lat, lng]`. Affects marker placement, `fitBounds`, `flyTo`, GPS dot.

### Typed refs
- `mapRef`: `L.Map | null` → `maplibregl.Map | null`
- `markerMapRef`: `Map<string, { marker: L.Marker; index: number }>` → `Map<string, { marker: maplibregl.Marker; el: HTMLElement; index: number }>`
- `originalCenterRef`: `L.LatLng | null` → `{ lat: number; lng: number } | null` — MapLibre's `getCenter()` returns a plain object, not a `LatLng` with `distanceTo()`
- `userDotRef`: `L.Marker | null` → `maplibregl.Marker | null`

### Pin icons
`makePinIcon()` returns `HTMLElement` (via `document.createElement` + `renderToStaticMarkup`) instead of `L.DivIcon`. `renderToStaticMarkup` was already imported. Pins created with `new maplibregl.Marker({ element: el, anchor: 'bottom' })`.

### Pin state changes
Direct DOM mutation (`el.innerHTML = renderToStaticMarkup(...)`) replaces `marker.setIcon()` (does not exist in MapLibre). Z-order via `el.style.zIndex`. Avoids replaying the stagger drop animation on state change.

### Popups
`maplibregl.Popup` replaces Leaflet's `bindPopup`. `makePopupContent()` and its HTML output unchanged. CSS selectors updated in `nm-map-styles`:

| Removed | Added |
|---|---|
| `.near-me-popup .leaflet-popup-content-wrapper` | `.near-me-popup .maplibregl-popup-content` |
| `.near-me-popup .leaflet-popup-content { margin: 0 }` | `.near-me-popup .maplibregl-popup-content { padding: 0 }` |
| `.near-me-popup .leaflet-popup-tip-container { display: none }` | `.near-me-popup .maplibregl-popup-tip { display: none }` |

### Fit-bounds
`maplibregl.LngLatBounds` replaces `L.latLngBounds`. Padding is a single number (uniform), not `[40, 40]`. `map.once('moveend', ...)` attached **before** `fitBounds` call to avoid race condition.

### Search this area distance check
`map.getCenter().distanceTo()` replaced with `haversineKm(c.lat, c.lng, orig.lat, orig.lng) * 1000 > 800`. `haversineKm` imported from `lib/near-me.ts`.

### Pan on selection
`map.panTo` → `map.flyTo({ center: [place.lng, place.lat], speed: 1.2 })`.

### GPS dot
`L.marker` → `new maplibregl.Marker({ element: el, anchor: 'center' })` using existing pulsing HTML markup. `nmGpsPulse` CSS animation unchanged.

### Topic colours
`TOPIC_COLORS` moved from `near-me-map.tsx` into `lib/near-me.ts` and exported — shared between the map component and the entry page topic cards.

### API key
`NEXT_PUBLIC_MAPTILER_KEY` set in `.env.local`. `.env.example` created with placeholder. Domain restrictions on MapTiler dashboard are mandatory — key is baked into the client bundle.

---

## Topic-Sensitive Overlays

Added in the same iteration. Full plan in `iteration3/map-overlay-plan.md`, checklist in `iteration3/map-overlay-prd.json`.

### New module: `lib/near-me-overlays.ts`
- `removeTopicOverlays(map)` — removes all `nm-overlay-*` layers and sources
- `addTopicOverlay(map, topic, signal)` — async, AbortSignal-safe, switches on topic
- Module-level GeoJSON cache — zero refetch on repeat topic visits
- Inline GeoJSON consts for hospitals (15 major public hospitals) and markets (8 major Melbourne markets)

### Geodata files (`public/geodata/`)
Fetched via `scripts/fetch-geodata.mjs` using Overpass API + osmtogeojson:

| File | Size | Source |
|---|---|---|
| `melbourne-trams.geojson` | 240 KB | OSM `railway=tram` ways, RDP simplified |
| `melbourne-trains.geojson` | 377 KB | OSM `railway=rail` ways, RDP simplified |
| `melbourne-parks.geojson` | 210 KB | OSM `leisure=park` polygons, >15 ha filter |

### Overlays per topic

| Topic | Overlay |
|---|---|
| Getting Around | Red tram lines + navy train lines, below road labels |
| Health & Wellbeing | 15 hospital circle markers + name labels (inline) |
| Social & Belonging | Named park fills + outlines + labels at zoom ≥13 |
| Food & Eating | 8 market circle markers + name labels (inline) |
| Home & Admin | No overlay |

### Map legend
Top-left frosted pill shows active overlay elements with matching colour swatches. Updates on topic switch. Hidden for Home & Admin.

---

## Topic Intro Strip

Added to `near-me-view.tsx` between the subtype chips and results list.

- `intro` and `mapNote` fields added to `TopicMeta` in `lib/near-me.ts`
- Strip shows topic-specific description of what results cover, plus a map note line (🗺) when an overlay is active
- `text-sm 2xl:text-base` — scales at 1536px+

---

## Testing Decisions

Good tests verify external behaviour, not implementation details. Do not assert on internal refs, MapLibre API call counts, or CSS class names that may change.

**What to test:**
- Pins render at correct coordinates for each place in the results array
- `selectedPlaceId` change causes matching pin to enter active state without replaying drop animation
- `hoveredPlaceId` change causes matching pin to enter hovered state
- Clicking a pin opens the popup with correct place name, rating, and open status
- After panning >800 m, "Search this area" pill becomes visible
- Clicking "Search this area" calls `onSearchArea` with `{ lat, lng }` matching current map centre
- When `userLat`/`userLng` props are provided, GPS dot marker appears at correct position
- Topic switch removes previous overlay layers and adds correct new ones
- Rapid topic switching does not leave stale overlay layers (AbortController test)

No existing map component tests. New tests should use React Testing Library with a mocked MapLibre instance.

---

## Out of Scope

- MapTiler style customisation beyond default Streets v2
- Clustering or grouping of overlapping pins
- Directions integration
- Progressive Web App / offline tile caching
- Changes to `NearMePlace` data shape or the SerpAPI data layer
- Real-time PTV departure data (requires PTV API key + backend proxy)
- Bus route overlays (too dense, adds visual noise)
