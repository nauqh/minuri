# Near Me — Map Upgrade

## Problem

The current map uses **Leaflet + CartoDB Positron** raster tiles. Positron is a data-viz base map — deliberately stripped of color, building footprints, and park fills. It looks clinical, not spatial. Specific issues:

- No green parks, no blue water, no building outlines — places appear to float in a grey void
- Raster PNG tiles are blurry on high-DPI screens and snap between zoom levels (no smooth zoom)
- Does not read like a wayfinding map to a newcomer unfamiliar with Melbourne suburbs

## Suggested Solution

Replace Leaflet with **MapLibre GL JS** (open-source, MIT) and point it at **MapTiler Streets v2** tiles.

- **Vector tiles** — crisp at all zoom levels, smooth continuous zoom like Google Maps
- **MapTiler Streets v2** — visually close to Google Maps: colored parks, blue water, road hierarchy, building footprints, dense street labels
- **Zero ongoing cost** — MapTiler free tier covers 100k map loads/month; MapLibre has no license fee
- **No lock-in** — MapLibre is the open-source successor to Mapbox GL JS

The internal map component (`components/near-me/near-me-map.tsx`) is fully self-contained. All existing behavior — numbered pins, hover bridge, popup card, GPS dot, Search this area button, stagger animation — ports directly. The only breaking change is coordinate order: MapLibre uses `[lng, lat]` everywhere vs Leaflet's `[lat, lng]`.

## Implementation

See `iteration3/map-upgrade-prd.json` — 10 items across setup, markers, popups, interactions, GPS, and cleanup.
