# PRD: Near Me — Map Engine Upgrade (Leaflet → MapLibre GL JS)

## Problem Statement

The Near Me map uses Leaflet with CartoDB Positron raster tiles. Positron is a data-visualisation base map — deliberately stripped of colour, building footprints, and park fills. Parks appear as grey voids. Water has no colour. Streets have no visual hierarchy. On high-DPI screens, raster PNG tiles are blurry and snap between zoom levels instead of animating smoothly. The map does not read as a wayfinding tool to a newcomer unfamiliar with Melbourne suburbs.

## Solution

Replace Leaflet with **MapLibre GL JS** (open-source, MIT) and point it at **MapTiler Streets v2** vector tiles. MapTiler Streets v2 is visually close to Google Maps: green parks, blue water, road hierarchy, building footprints, and dense street labels. Vector tiles are crisp at all pixel densities and support smooth continuous zoom. The migration is scoped entirely to `near-me-map` — all existing behaviour (numbered pins, hover bridge, popup card, GPS dot, Search this area button, stagger animation) is preserved.

## User Stories

1. As a Melbourne newcomer, I want the map to show green parks and blue water, so that I can orient myself relative to landmarks I recognise.
2. As a user on a Retina / high-DPI screen, I want crisp map tiles at all zoom levels, so that text and road lines do not appear blurry.
3. As a user zooming in, I want smooth continuous zoom animation, so that the map does not snap and disorient me.
4. As a user searching for nearby cafes, I want to see building outlines and street names on the map, so that I can read directions to walk there.
5. As a user, I want numbered pins to appear at the correct geographic coordinates for each place, so that I can match the list to the map.
6. As a user, I want the selected pin to enlarge and highlight when I click a list row, so that I can identify which pin corresponds to my chosen place.
7. As a user hovering a list row, I want the corresponding pin to change state, so that I get immediate visual feedback before clicking.
8. As a user, I want pin state changes (active, hovered, default) to not replay the drop animation, so that the interface does not feel jittery.
9. As a user, I want a popup card to open when I click a pin, showing the place thumbnail, rating, open status, and Directions and Call buttons.
10. As a user, I want the popup to close when I click another pin or the map background, so that only one popup is visible at a time.
11. As a user whose search returns multiple results, I want the map to automatically fit all result pins within the viewport, so that I do not need to pan to find outlying results.
12. As a user clicking a list row, I want the map to smoothly animate to centre on the matching pin, so that the transition feels fluid.
13. As a user who has panned more than ~800 m from the original search area, I want a "Search this area" pill to appear, so that I can trigger a new search for the panned region.
14. As a user clicking "Search this area", I want the search to use the current map centre coordinates, so that results are relevant to where I am looking.
15. As a user who has granted location permission, I want a pulsing blue GPS dot at my current position, so that I can see myself relative to nearby results.
16. As a developer, I want the MapTiler API key restricted to authorised domains, so that the key cannot be scraped from the JS bundle and abused.

## Implementation Decisions

### Scope
Only `near-me-map` is modified. Its public prop interface (`NearMeMapProps`) is unchanged. Both existing importers (`near-me-view` and `journey-nearby-panel`) already use `dynamic(..., { ssr: false })` — no changes needed in parent components. `map.remove()` is already called in the existing `useEffect` cleanup; this is preserved.

### Map engine
`maplibregl.Map` replaces `L.Map`. The style URL encodes the tile source, so `L.tileLayer` is removed entirely. `maplibregl.NavigationControl` replaces `L.control.zoom`.

### Coordinate order
MapLibre uses `[lng, lat]` everywhere. All coordinate pairs must be swapped from Leaflet's `[lat, lng]` convention. This affects marker placement, `fitBounds`, `flyTo`, and the GPS dot — it is the single highest-risk change in the migration.

### Typed refs
- `mapRef`: `L.Map | null` → `maplibregl.Map | null`
- `markerMapRef`: `Map<string, { marker: L.Marker; index: number }>` → `Map<string, { marker: maplibregl.Marker; el: HTMLElement; index: number }>`
- `originalCenterRef`: `L.LatLng | null` → `{ lat: number; lng: number } | null` — MapLibre's `getCenter()` returns a plain object, not a `LatLng` with `distanceTo()`

### Pin icons
`makePinIcon()` returns an `HTMLElement` (via `document.createElement` + `renderToStaticMarkup`) instead of `L.DivIcon`. Requires adding `import { renderToStaticMarkup } from 'react-dom/server'`. Pins created with `new maplibregl.Marker({ element: el, anchor: 'bottom' })`.

### Pin state changes
Direct DOM mutation (`el.innerHTML = renderToStaticMarkup(...)`) replaces `marker.setIcon()` (which does not exist in MapLibre). Z-order managed via `el.style.zIndex`. This avoids replaying the stagger drop animation on state change.

### Popups
`maplibregl.Popup` replaces Leaflet's `bindPopup`. `makePopupContent()` and its HTML output are unchanged. Three CSS selectors in `nm-map-styles` must be updated:

| Remove | Add |
|--------|-----|
| `.near-me-popup .leaflet-popup-content-wrapper` | `.near-me-popup .maplibregl-popup-content` |
| `.near-me-popup .leaflet-popup-content { margin: 0 }` | `.near-me-popup .maplibregl-popup-content { padding: 0 }` |
| `.near-me-popup .leaflet-popup-tip-container { display: none }` | `.near-me-popup .maplibregl-popup-tip { display: none }` |

### Fit-bounds
`maplibregl.LngLatBounds` replaces `L.latLngBounds`. Padding is a single number (uniform), not `[40, 40]`. The `map.once('moveend', ...)` listener **must be attached before** calling `fitBounds` — attaching it after risks the event firing before the listener is registered.

### Search this area distance check
`map.getCenter().distanceTo()` (Leaflet `LatLng` method) is replaced with `haversineKm(c.lat, c.lng, orig.lat, orig.lng) * 1000 > 800`. `haversineKm` is already present in `lib/near-me.ts` and returns kilometres.

### Pan on selection
`map.panTo` → `map.flyTo({ center: [place.lng, place.lat], speed: 1.2 })`.

### GPS dot
`L.marker` GPS dot → `new maplibregl.Marker({ element: el, anchor: 'center' })` using the existing pulsing HTML markup from the Leaflet `divIcon`. `nmGpsPulse` CSS animation is unchanged.

### API key security
`NEXT_PUBLIC_MAPTILER_KEY` is baked into the client JS bundle. Domain restrictions on the MapTiler dashboard (production domain + `localhost`) are **mandatory** before the key is used anywhere — an unrestricted key is freely usable by anyone who opens DevTools.

### Dependency cleanup
After end-to-end verification: `npm uninstall leaflet react-leaflet @types/leaflet`. `maplibre-gl` ships its own TypeScript types; no `@types/maplibre-gl` needed.

## Testing Decisions

Good tests verify external behaviour, not implementation details. Do not assert on internal refs, MapLibre/Leaflet API call counts, or CSS class names that may change between library versions.

**What to test:**
- Pins render at the correct coordinates for each place in the results array
- `selectedPlaceId` prop change causes the matching pin to enter the active visual state without replaying the drop animation
- `hoveredPlaceId` prop change causes the matching pin to enter the hovered state
- Clicking a pin opens the popup with the correct place name, rating, and open status
- After the map is panned >800 m, the "Search this area" pill becomes visible
- Clicking "Search this area" calls `onSearchArea` with `{ lat, lng }` matching the current map centre
- When `userLat` / `userLng` props are provided, a GPS dot marker appears at the correct position

No existing map component tests in the codebase. New tests should use React Testing Library with a mocked MapLibre instance (stub `maplibregl.Map` constructor and key methods).

## Out of Scope

- MapTiler style customisation (colours, fonts, icon sets) beyond the default Streets v2 theme
- Clustering or grouping of overlapping pins
- Directions integration
- Progressive Web App / offline tile caching
- Changes to `NearMePlace` data shape or the SerpAPI data layer

## Further Notes

- MapLibre GL JS is the open-source MIT-licensed successor to Mapbox GL JS v1. No per-tile or per-load fees.
- MapTiler free tier: 100k map loads/month — sufficient for development.
- The step-by-step implementation checklist (10 items, 6 categories) lives in `iteration3/map-upgrade-prd.json`.
