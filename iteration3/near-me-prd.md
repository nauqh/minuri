# Near Me Epic PRD

**Epic:** 1 — Near Me  
**Date:** 2026-05-18  
**Status:** In Progress

---

## 1. Goal

Upgrade the Near Me feature from a clinical data-viewer into a genuine wayfinding tool — one that reads like a map, responds to the user's topic, and surfaces community life (not just services) for young adults new to Melbourne.

Three stages deliver this: a vector map engine that renders geography as legible as Google Maps; topic-sensitive overlays that show what each topic actually cares about (tram lines, parks, hospitals, markets); and a live social layer that surfaces real events and community spaces for the social-belonging topic.

### Page & component map

```
/near-me (NearMeEntry)
  └── NearMeView
        ├── TopicIntroStrip          ← contextual description + map note per topic
        ├── SubtypeChips             ← topic-specific subtype filter pills
        ├── PlaceCard ×N             ← GridCard / ListCard / CompactCard per topic
        ├── NearMeMap                ← MapLibre GL JS + topic overlays + legend
        │     ├── TopicOverlay       ← tram/train lines, hospital pins, park fills, market pins
        │     └── MapLegend          ← top-left overlay chip per active topic
        └── EventsSection            ← social-belonging only
              ├── EventCard ×N       ← SerpAPI Google Events cards
              ├── CommunityVenueCard ×N  ← City of Melbourne Open Data venues
              └── VolunteerCard ×N   ← curated static volunteer list
```

---

## 2. Components in scope

| File | Responsibility |
|------|---------------|
| `components/near-me/near-me-map.tsx` | MapLibre GL JS engine; topic overlays; legend; GPS dot; hover bridge; popup |
| `components/near-me/near-me-view.tsx` | TopicIntroStrip; EventsSection gate for social-belonging subtype |
| `lib/near-me-overlays.ts` | `addTopicOverlay` / `removeTopicOverlays`; GeoJSON cache; AbortController-safe |
| `lib/near-me.ts` | `TopicMeta.intro` + `TopicMeta.mapNote` fields; `TOPIC_COLORS` export |
| `public/geodata/` | `melbourne-trams.geojson`, `melbourne-trains.geojson`, `melbourne-parks.geojson` |
| `public/volunteering-orgs.json` | Curated static volunteer list (20–30 orgs) |
| `components/near-me/events-card.tsx` | Event card for SerpAPI Google Events results |
| `components/near-me/community-venue-card.tsx` | Venue card for City of Melbourne Open Data results |
| `app/api/nearby-events/route.ts` | Next.js proxy to backend SerpAPI Google Events endpoint |
| `app/api/community-venues/route.ts` | Next.js proxy or direct CoM Open Data fetch with 24hr cache |

---

## 3. User Stories

---

### US-01 — Vector Map Engine

**As a** newcomer using Near Me on any device,  
**I want** the map to show parks, water, buildings, and streets with clear visual hierarchy,  
**so that** I can orient myself to a real neighbourhood, not a grey data layer.

#### Acceptance Criteria

---

**AC-01-1 — Map renders with Google Maps-quality base style**

> **Given** I open Near Me and the map loads  
> **When** the map appears  
> **Then** parks are green, water is blue, building footprints are visible, and road widths reflect hierarchy  
> **And** text labels for streets and neighbourhoods are visible at normal zoom levels

> **Given** I am on a high-DPI screen (Retina, 2× pixel density)  
> **When** the map renders  
> **Then** labels, icons, and tile edges are crisp — not blurry as raster PNG tiles were

---

**AC-01-2 — Smooth continuous zoom replaces stepped raster zoom**

> **Given** I pinch-zoom or scroll-zoom the map  
> **When** the zoom level changes  
> **Then** the map zooms smoothly and continuously — no tile-swap snap between zoom levels

---

**AC-01-3 — All existing map behaviours preserved**

> **Given** the map loads with place results  
> **When** I interact with it  
> **Then** numbered pins appear at each place's coordinates, coloured by topic  
> **And** hovering a list card highlights the matching pin, and vice versa  
> **And** clicking a pin opens a popup with thumbnail, name, rating, open status, Directions and Call buttons  
> **And** a pulsing GPS dot appears at my location when I grant location permission  
> **And** after panning more than 800 m from the original centre, a "Search this area" pill appears  
> **And** pins drop with a staggered animation when results first load

#### Tasks

- Replace `leaflet` imports with `maplibregl` in `near-me-map.tsx`; remove `leaflet`, `react-leaflet`, `@types/leaflet` from `package.json`
- `NEXT_PUBLIC_MAPTILER_KEY` in `.env.local`; `.env.example` with placeholder
- Coordinate order: all pairs flipped to `[lng, lat]` for MapLibre
- `mapRef` typed as `maplibregl.Map | null`; `markerMapRef` typed with `{ marker: maplibregl.Marker; el: HTMLElement; index: number }`
- `makePinIcon()` returns `HTMLElement` via `renderToStaticMarkup`; pin state changes via `el.innerHTML` (not `marker.setIcon()`)
- `maplibregl.Popup` replaces `bindPopup`; CSS selectors updated to `.maplibregl-popup-content` and `.maplibregl-popup-tip`
- `maplibregl.LngLatBounds` + `map.once('moveend')` before `fitBounds`
- Search-this-area: `haversineKm(c.lat, c.lng, orig.lat, orig.lng) * 1000 > 800` replaces `distanceTo()`
- GPS dot: `new maplibregl.Marker({ element: el, anchor: 'center' })`
- `TOPIC_COLORS` moved from `near-me-map.tsx` into `lib/near-me.ts` and exported

---

### US-02 — Topic-Sensitive Map Overlays

**As a** user browsing a specific topic in Near Me,  
**I want** the map to show contextually relevant infrastructure (tram lines, hospitals, parks, markets),  
**so that** the map reinforces what the topic is about rather than just showing my result pins.

#### Acceptance Criteria

---

**AC-02-1 — Overlays appear per topic and clear on topic switch**

> **Given** I select the Getting Around topic  
> **When** the map loads  
> **Then** red tram lines and navy train lines are drawn on the map, below road labels  
> **And** a legend chip in the top-left corner shows a red swatch labelled "Tram" and a navy swatch labelled "Train"

> **Given** I select the Health & Wellbeing topic  
> **When** the map loads  
> **Then** circle markers for 15 major public hospitals appear with name labels

> **Given** I select the Social & Belonging topic  
> **When** the map loads  
> **Then** named park fills with outlines and labels are visible at zoom ≥ 13

> **Given** I select the Food & Eating topic  
> **When** the map loads  
> **Then** circle markers for 8 major Melbourne markets appear with name labels

> **Given** I select the Home & Admin topic  
> **When** the map loads  
> **Then** no additional overlay appears; the legend chip is hidden

> **Given** I switch rapidly between topics  
> **When** each topic switch fires  
> **Then** the previous overlay is fully removed before the new one is added — no stale layers remain  
> **And** a mid-flight overlay fetch is aborted if the topic changes before it completes (AbortController)

---

**AC-02-2 — Topic intro strip appears above results**

> **Given** I am on the results pane for any topic  
> **When** results load  
> **Then** a text strip between the subtype chips and the result list explains what results this topic covers  
> **And** if an overlay is active, a 🗺 line below the description names the overlay shown on the map

#### Tasks

- `lib/near-me-overlays.ts`: `addTopicOverlay(map, topic, signal)` switches on topic; `removeTopicOverlays(map)` removes all `nm-overlay-*` layers and sources; module-level GeoJSON cache
- GeoJSON files in `public/geodata/`: `melbourne-trams.geojson` (OSM tram ways, RDP simplified), `melbourne-trains.geojson` (OSM rail ways), `melbourne-parks.geojson` (leisure=park polygons, >15 ha)
- Hospital and market markers: inline GeoJSON consts in `lib/near-me-overlays.ts`
- Map legend: `motion.div` top-left; updates on topic switch; hidden for home-admin
- `TopicMeta` in `lib/near-me.ts`: add `intro: string` and `mapNote?: string` fields; populate for all five topics
- Topic intro strip: render below subtype chips in `near-me-view.tsx`; `text-sm 2xl:text-base`

---

### US-03 — Social & Belonging: Live Events Discovery

**As a** user on the Social & Belonging topic,  
**I want** to see what's on this week near me and where I can go regularly,  
**so that** I find real community connection opportunities, not just static venue information.

#### Acceptance Criteria

---

**AC-03-1 — Two distinct subtypes for social-belonging**

> **Given** I select the Social & Belonging topic  
> **When** I look at the subtype chips  
> **Then** I see at least two subtypes: "What's on this week" and "Community spaces"  
> **And** selecting "What's on this week" shows event cards from SerpAPI Google Events  
> **And** selecting "Community spaces" shows recurring venues from the City of Melbourne Open Data and the curated volunteer list

---

**AC-03-2 — Events cards: what's on this week**

> **Given** I select the "What's on this week" subtype  
> **When** results load  
> **Then** each event card shows: event name, date and time, venue name, a short description, and a link to the event source  
> **And** events are filtered to this week and near the selected suburb  
> **And** if no events are found, an empty state reads "No events found near [suburb] this week — try a neighbouring suburb"

> **Given** the events fetch fails or times out  
> **When** the error occurs  
> **Then** an error state shows "Could not load events right now" with a retry button  
> **And** the map still shows the Social & Belonging park overlay

---

**AC-03-3 — Community spaces: where I can go regularly**

> **Given** I select the "Community spaces" subtype  
> **When** results load  
> **Then** venue cards from the City of Melbourne Open Data (neighbourhood houses, community centres, libraries) appear  
> **And** each venue card shows: name, address, a type badge (e.g. "Neighbourhood House"), and a link or phone if available

> **Given** the Community spaces subtype is active  
> **When** I scroll below the venue list  
> **Then** a "Volunteering in Melbourne" section shows curated volunteer organisation cards  
> **And** each card shows: org name, category (e.g. "Food rescue"), suburb, and a link to the org website  
> **And** a note clarifies: "These organisations welcome walk-in volunteers — no API, no ticket, just show up"

---

**AC-03-4 — Event pins on map**

> **Given** events have loaded for the "What's on this week" subtype  
> **When** I look at the map  
> **Then** pins appear at each event's venue coordinates  
> **And** clicking a pin shows the event name, date, and a link to the source  
> **And** the hover bridge works: hovering an event card highlights its map pin

#### Tasks

- Backend: new endpoint `POST /api/nearby-events?suburb=X` using SerpAPI `engine=google_events`; filter `htichips=date:week`; return `NearbyEventRecord[]`
- Frontend: `app/api/nearby-events/route.ts` proxy
- Backend: new endpoint `GET /api/community-venues?suburb=X` fetching CoM Open Data neighbourhood houses + community centres + libraries; 24hr server-side cache
- Frontend: `app/api/community-venues/route.ts` proxy
- Static file: `public/volunteering-orgs.json` — 20–30 orgs with `name`, `category`, `url`, `suburb`, `description` fields
- `components/near-me/events-card.tsx` — event name, date chip, venue, description, source link; `motion.div` entrance stagger
- `components/near-me/community-venue-card.tsx` — venue name, type badge, address, phone/website CTA
- Volunteer section: rendered below venue list as a static-data section; no fetch required
- `near-me-view.tsx`: gate `EventsSection` behind `topic === "social-belonging"`; subtype chips add "events" and "community" to existing list
- `NearMePlace` event variant: `type EventPlace = { kind: "event"; date: string; sourceUrl: string; ... }` — map pins use same marker format as place pins
- Empty state: topic-specific message for each new subtype

---

## 4. Responsive Behaviour

| Component | Mobile | Tablet (md) | Desktop (xl+) |
|-----------|--------|-------------|---------------|
| Map pane | full-width below list (mobilePane toggle) | full-width below list | right 55% fixed height |
| Map legend chip | top-left, sm text | top-left | top-left |
| Topic intro strip | full-width, sm text | full-width | full-width, 2xl:text-base |
| Events subtype chips | horizontal scroll | horizontal scroll | flex-wrap |
| Event cards | full-width stacked | 2-col grid | 2-col grid (max-w-2xl) |
| Community venue cards | full-width list (divide-y) | full-width list | full-width list |
| Volunteer cards | full-width stacked | 2-col grid | 3-col grid |

---

## 5. Accessibility

- Map: `maplibregl.NavigationControl` keyboard-navigable; popup closeable via Escape
- "Search this area" pill: `role="button"` with `aria-label="Search for places near this map area"`
- Topic intro strip: `role="note"` or plain `p`; not interactive
- Events subtype chips: `aria-pressed={isActive}` per chip
- Event cards: source link has `aria-label` including event name (not bare "View event")
- Community venue cards: phone link `aria-label="Call [venue name]"` 
- Volunteer section heading: `h3` semantics, not decorative text
- Empty states and error states: `role="status"` with `aria-live="polite"`
- All animated entrances: guarded by `prefersReducedMotion` with `duration: 0.01` fallback

---

## 6. File Checklist

```
components/near-me/
  near-me-map.tsx               ← MapLibre GL JS; overlays; legend; popup; GPS dot
  near-me-view.tsx              ← TopicIntroStrip; EventsSection gate
  place-card.tsx                ← GridCard / ListCard / CompactCard (unchanged)
  near-me-entry.tsx             ← suburb + topic picker (unchanged)
  events-card.tsx               ← new: SerpAPI event card
  community-venue-card.tsx      ← new: CoM Open Data venue card

lib/
  near-me.ts                    ← TOPIC_COLORS export; TopicMeta.intro + mapNote
  near-me-overlays.ts           ← addTopicOverlay; removeTopicOverlays; GeoJSON cache

public/
  geodata/
    melbourne-trams.geojson     ← OSM tram ways, RDP simplified
    melbourne-trains.geojson    ← OSM rail ways, RDP simplified
    melbourne-parks.geojson     ← leisure=park polygons, >15 ha
  volunteering-orgs.json        ← new: curated static volunteer list

app/api/
  nearby-events/route.ts        ← new: SerpAPI Google Events proxy
  community-venues/route.ts     ← new: CoM Open Data proxy with 24hr cache

scripts/
  fetch-geodata.mjs             ← Overpass API + osmtogeojson; outputs to public/geodata/
```

---

## 7. Open Questions

| Question | Status |
|----------|--------|
| Backend `_normalize_place()` — phone/website/service_options/photos still not extracted from SerpAPI response | Outstanding — user handles in `minuri-server/` |
| SerpAPI engine switch from `"google"` to `"google_maps"` for places queries | Outstanding — user handles in `minuri-server/` |
| CoM Open Data rate limits for community-venues endpoint | Unknown — check API docs; add 24hr cache to mitigate |
| Volunteering orgs list: static JSON or backend-managed? | Static JSON for iteration 3; quarterly manual refresh |
| SerpAPI Google Events: events sourced from broad Melbourne query or suburb-specific? | TBD — suburb-specific preferred; fall back to Melbourne-wide if < 3 results |
| Suburb Intelligence (livability metrics card) | Backlogged to Iteration 4 — see `iteration3/backlog.md` |
