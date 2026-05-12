# Near Me — Topic-Sensitive Map Overlays

## Opportunity

The Near Me map currently shows one thing: the place markers from the search results.
But the basemap itself carries no meaning relative to the user's topic.

When a newcomer selects **Getting Around**, tram and train lines should be visible — they are the literal infrastructure of moving around Melbourne. When they select **Health & Wellbeing**, hospital locations should be anchored on the map as a safety baseline. When they select **Social & Belonging**, parks should read as social spaces, not just green fill.

MapLibre GL JS makes this native: overlay GeoJSON layers toggled per topic change, slotted below the place markers, above the basemap. No new dependencies. Data already exists as open government and OSM sources.

This was planned as FR-N3 in iteration2 but deferred pending PTV API access. Static GeoJSON from open data sources unblocks it immediately — no API key required.

---

## User value per topic

### Getting Around — Tram + train network lines

A newcomer opens Getting Around in Carlton. They see the search results. They also now see the red tram lines threading through the streets — Route 1, Route 96, the City Circle. They immediately understand which result is on a tram corridor vs a 10-minute walk from any stop.

This is Melbourne's defining transport geometry. No other city-specific feature communicates "you are in Melbourne, and this is how you move" as immediately as the tram network.

**Overlay:** Melbourne tram lines (red, semi-transparent) + train lines (dark blue). Optional: tram stop dots along the lines.

---

### Health & Wellbeing — Hospital + emergency markers

An anxious newcomer selects Health & Wellbeing. Beyond the GP results, they can see where the nearest major hospital and emergency department is — not as a search result, but as a permanent anchor on the map.

This is peace of mind, not a search result. Knowing the Alfred Hospital is 1.4 km south is background safety context that should always be visible on this topic regardless of the suburb searched.

**Overlay:** Major Melbourne public hospitals as markers (red cross icon or circle), each with a subtle 1.5 km radius fill to show coverage. ~15–20 hospitals total — small enough to hardcode as inline GeoJSON.

---

### Social & Belonging — Parks as social spaces

Parks in Melbourne are not decorative — they are community infrastructure. Flagstaff Gardens, Royal Park, Caulfield Park, Princes Park all host language exchanges, community cricket, weekend markets. For a lonely newcomer, a park is the lowest-barrier social space.

MapTiler Streets v2 already renders parks as green fill, but at default zoom they are subtle. This overlay deepens the green fill and adds a label layer for named parks, making them read as *destinations* rather than background.

**Overlay:** Named Melbourne parks as highlighted polygons (deeper green fill, park name label). Source: data.melbourne.vic.gov.au — "Open Space" dataset.

---

### Food & Eating — Weekly markets (curated, not search results)

Queen Vic Market, Preston Market, Prahran Market, South Melbourne Market. These are not in SerpAPI results consistently, and they deserve permanent map anchors for the food topic.

A newcomer on a budget who spots "Queen Victoria Market" pinned on the map alongside search results gets immediate context: *this city has cheap fresh food if you know where to go.*

**Overlay:** ~8 curated Melbourne food markets as distinctive pin markers (different icon from search result pins — e.g. a stall/tent icon). Hardcoded as inline GeoJSON — static, rarely changes.

---

### Home & Admin — No overlay

Library and council results already appear as search results. No overlay adds enough signal to justify the visual noise. Map stays clean for this topic.

---

## Technical design

### Layer lifecycle

Overlays are managed in a dedicated `useEffect` keyed on `topic`. On topic change:
1. Remove all layers and sources prefixed `nm-overlay-*`
2. Wait for style to be loaded (`map.isStyleLoaded()` or `map.once('load', ...)`)
3. Add the new topic's layers

```
Source ID pattern:  nm-overlay-{name}
Layer ID pattern:   nm-overlay-{name}-{type}

Examples:
  nm-overlay-tram-lines
  nm-overlay-tram-stops
  nm-overlay-train-lines
  nm-overlay-hospitals-fill
  nm-overlay-hospitals-markers
  nm-overlay-parks-fill
  nm-overlay-markets-markers
```

Layers are inserted *below* the marker layer using `map.addLayer(layer, beforeId)` — place markers always render on top of overlays.

### New module: `lib/near-me-overlays.ts`

Encapsulates all overlay logic. Exports two functions:

```
addTopicOverlay(map: maplibregl.Map, topic: NearMeTopic): void
removeTopicOverlays(map: maplibregl.Map): void
```

`near-me-map.tsx` calls these from the topic `useEffect`. The map component stays ignorant of overlay data — it only calls add/remove.

### GeoJSON loading strategy

| Topic | Data | Strategy |
|---|---|---|
| Getting Around — tram lines | ~180KB GeoJSON | Static file: `/public/geodata/melbourne-trams.geojson` |
| Getting Around — train lines | ~60KB GeoJSON | Static file: `/public/geodata/melbourne-trains.geojson` |
| Health — hospitals | ~5KB, ~18 features | Inline in `near-me-overlays.ts` as a const |
| Social — parks | ~400KB GeoJSON | Static file: `/public/geodata/melbourne-parks.geojson` |
| Food — markets | ~1KB, ~8 features | Inline in `near-me-overlays.ts` as a const |

Static files are fetched once and cached in a module-level `Map<string, GeoJSON.FeatureCollection>` — second topic visit costs zero network.

### Style loading guard

MapLibre layers can only be added after the style is loaded. The overlay effect must handle both cases:

```typescript
const applyOverlay = () => {
  removeTopicOverlays(map);
  addTopicOverlay(map, topic);
};

if (map.isStyleLoaded()) {
  applyOverlay();
} else {
  map.once('load', applyOverlay);
}
```

### Visual spec

| Overlay | Color | Opacity | Weight |
|---|---|---|---|
| Tram lines | `#c0392b` (PTV red) | 0.65 | 2.5px |
| Train lines | `#1a5276` (PTV navy) | 0.65 | 3px |
| Tram stops | `#c0392b` | 0.8 | 5px circle |
| Hospital radius fill | `#ef4444` | 0.06 | — |
| Hospital marker | `#ef4444` | 1.0 | 10px circle + white border |
| Park fill | `#2d6a4f` | 0.18 | — |
| Park label | `#1b4332` | 0.9 | 11px text |
| Market marker | `#e07b39` (food topic color) | 1.0 | custom icon |

All overlays must respect `prefers-reduced-motion` — no animated overlays.

---

## Data sources

| Dataset | Source | License | Format |
|---|---|---|---|
| Melbourne tram routes | data.vic.gov.au — "PTV Metro Tram Routes" | Creative Commons Attribution 4.0 | Shapefile → GeoJSON |
| Melbourne train routes | data.vic.gov.au — "PTV Metro Train Routes" | Creative Commons Attribution 4.0 | Shapefile → GeoJSON |
| Melbourne open space / parks | data.melbourne.vic.gov.au — "Open Space" | CC BY 4.0 | GeoJSON direct download |
| Hospitals | Hardcoded (~18 major public hospitals) | N/A | Inline GeoJSON const |
| Markets | Hardcoded (~8 major markets) | N/A | Inline GeoJSON const |

All Shapefile → GeoJSON conversion done once with `ogr2ogr` or mapshaper before committing to `/public/geodata/`. Files are committed — no build step, no runtime conversion.

---

## File structure

```
public/
  geodata/
    melbourne-trams.geojson       ← PTV tram routes, simplified
    melbourne-trains.geojson      ← PTV train routes, simplified
    melbourne-parks.geojson       ← Melbourne open space polygons

lib/
  near-me-overlays.ts             ← NEW: add/remove logic + inline GeoJSON consts

components/near-me/
  near-me-map.tsx                 ← add overlay useEffect (~8 lines)
```

---

## Phase plan

### Phase 1 — Getting Around tram + train lines

Highest impact. Aligns with FR-N3 from iteration2. Melbourne's tram network is the single most recognisable thing about the city.

1. Download PTV Metro Tram + Train route Shapefiles from data.vic.gov.au
2. Convert to GeoJSON with `ogr2ogr` + simplify geometry with `mapshaper` (reduce to ~100KB each)
3. Commit to `/public/geodata/`
4. Create `lib/near-me-overlays.ts` with `addTopicOverlay` / `removeTopicOverlays`
5. Add overlay `useEffect` to `near-me-map.tsx`
6. Verify: Getting Around topic shows tram lines; switching to any other topic removes them

### Phase 2 — Health hospitals + Social parks

1. Hardcode hospital GeoJSON const (18 major public hospitals, lat/lng from data.gov.au)
2. Download Melbourne open space GeoJSON from data.melbourne.vic.gov.au
3. Simplify parks GeoJSON (keep only named parks > 2ha)
4. Add health + social overlay cases to `near-me-overlays.ts`
5. Verify: Health topic shows hospital markers; Social topic shows park fills

### Phase 3 — Food markets

1. Hardcode 8 major Melbourne markets as inline GeoJSON const
2. Add food overlay case
3. Verify: Food topic shows market markers distinct from search result pins

---

## Out of scope

- Real-time PTV departure data (requires PTV API key + backend proxy)
- Bus routes (too dense, adds visual noise)
- Suburb boundary outlines
- Any overlay for Home & Admin topic
