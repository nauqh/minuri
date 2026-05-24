# Minuri — Iteration 3 Data Management Plan

**Unit:** FIT5120 Industry Experience Studio
**Team:** TP39
**Version:** 1.0
**Date:** 2026-05-24
**Author:** TP39 Team

---

## Table of Contents

1. [Overview](#1-overview)
2. [Data Sources](#2-data-sources)
3. [Data Collection and Acquisition](#3-data-collection-and-acquisition)
4. [Data Storage Architecture](#4-data-storage-architecture)
5. [Database Schema (ERD)](#5-database-schema-erd)
6. [Client-Side Data Model (localStorage)](#6-client-side-data-model-localstorage)
7. [Guide Content Schema (Static JSON)](#7-guide-content-schema-static-json)
8. [Data Processing and ETL Pipeline](#8-data-processing-and-etl-pipeline)
9. [API Endpoints and Data Flow](#9-api-endpoints-and-data-flow)
10. [Data Security and Privacy](#10-data-security-and-privacy)
11. [Data Quality and Validation](#11-data-quality-and-validation)
12. [Ethical Considerations](#12-ethical-considerations)
13. [Changes from Iteration 2](#13-changes-from-iteration-2)

---

## 1. Overview

### 1.1 Purpose of This Document

This Data Management Plan (DMP) documents how data is collected, stored, processed, used, and protected within the Minuri application during Iteration 3. It covers all data sources — external APIs, static datasets, a cloud-hosted relational database, a cloud object store, static GeoJSON assets, and client-side browser storage — and specifies responsibilities, schemas, and governance for each.

### 1.2 Product Summary

Minuri is a web application that helps young adults settle into independent life in Melbourne. It provides four interconnected features: a personalised Landing hub, a narrative First-Time Guides library, a Near Me location and events discovery tool, and a personalised LLM-powered Journey plan. All four features share a unified five-topic taxonomy: Food & Eating, Getting Around, Health & Wellbeing, Home & Admin, and Social & Belonging.

### 1.3 Iteration 3 Data Scope

Iteration 3 makes Minuri "feel intelligent" by replacing the static journey plan with LLM-powered personalisation, upgrading the map engine to vector tiles, extending Near Me with live events and community venues, and enriching the guide reading experience with tables, videos, and key terms.

| Dimension | Iteration 2 | Iteration 3 |
|-----------|------------|------------|
| Journey AI | OpenRouter `owl-alpha` → single `identity` + static `week_plan` | Claude API (Sonnet 4.6 / Haiku) → streaming `identity` + living identity card; `week_plan` moved to frontend |
| Map engine | Leaflet + CartoDB raster tiles | MapLibre GL JS + MapTiler vector tiles; topic-sensitive GeoJSON overlays |
| Near Me events | Not implemented | SerpAPI Google Events (`google_events` engine) + City of Melbourne Open Data venues + curated volunteer JSON |
| Guide content | 20 guides with 6 text sections | Extended schema: `tables`, `videos` (YouTube embeds), `keyTerms`; per-section step tracking |
| Client-side state | `minuri:journey:v1` | `minuri:journey:v2` (LLMJourneyPlan); new identity, guide-step, quicktake, arc-receipt keys |
| Database | `suburbs`, `suburb_demographics`, `topics`, `arcs`, `guides`, `guide_sections` | Same tables + new columns: `suburb_demographics.median_weekly_rent`, `suburb_demographics.overseas_born_pct` (backlog) |
| External APIs | SerpAPI, PTV Timetable API, OpenRouter | SerpAPI (enhanced), PTV Timetable API, Claude API (Anthropic), MapTiler, City of Melbourne Open Data |

---

## 2. Data Sources

Minuri Iteration 3 draws on eleven distinct data sources.

### 2.1 Australian Postcodes — Suburb Master Data (Unchanged)

| Attribute | Detail |
|-----------|--------|
| **Source** | matthewproctor/australianpostcodes on GitHub |
| **URL** | `https://raw.githubusercontent.com/matthewproctor/australianpostcodes/master/australian_postcodes.csv` |
| **Format** | CSV |
| **Update frequency** | Fetched at ETL time (not scheduled) |
| **Licence** | Open (no commercial restriction stated by the repository) |
| **Fields used** | `locality`, `postcode`, `state`, `lat`, `long`, `sa2_code`, `sa3_name`, `sa4` |
| **Loaded into** | `suburbs` table in PostgreSQL |

### 2.2 ABS Regional Population — Victoria (Unchanged)

| Attribute | Detail |
|-----------|--------|
| **Source** | Australian Bureau of Statistics |
| **Format** | Excel (.xlsx) converted to CSV by `app/scripts/extract.py` |
| **Licence** | Creative Commons Attribution 4.0 (CC BY 4.0) |
| **Fields used** | SA2/SA3/SA4/GCCSA name and code, ERP 2024, ERP 2025, change count, change %, area km², population density 2025 |
| **Loaded into** | `suburb_demographics` table in PostgreSQL |

### 2.3 ABS Census Data — Rent and Demographics (New in Iteration 3, Backlog)

| Attribute | Detail |
|-----------|--------|
| **Source** | ABS Census of Population and Housing |
| **Format** | Published tables (manual extraction) |
| **Licence** | Creative Commons Attribution 4.0 (CC BY 4.0) |
| **Fields used** | Median weekly rent by SA2, overseas-born percentage by SA2 |
| **Loaded into** | `suburb_demographics.median_weekly_rent`, `suburb_demographics.overseas_born_pct` (new columns, backlog ETL) |
| **Status** | Backlog — required to activate the `/api/suburb/livability` endpoint |

### 2.4 SerpAPI — Live Nearby Search and Events (Enhanced)

| Attribute | Detail |
|-----------|--------|
| **Source** | SerpAPI |
| **URL** | `https://serpapi.com/` |
| **Format** | JSON (live, per-request) |
| **Update frequency** | Real-time; not persisted |
| **Licence** | Commercial API — covered by the team's SerpAPI subscription |
| **Engines used** | `google_maps` (existing — `GET /api/nearby-interest`); `google_events` (new — `GET /api/nearby-events`) |
| **Events fields** | `title`, `date.when`, `address`, `description`, `link`, `thumbnail`, `venue.name`, `venue.rating` |
| **Thumbnail handling** | Thumbnails proxied through `wsrv.nl` at `800×600` to bypass hotlink restrictions |
| **Not stored** | Results are in-memory during request only; not persisted to database |

### 2.5 PTV Timetable API — Public Transport Victoria (Carried from Iteration 2)

| Attribute | Detail |
|-----------|--------|
| **Source** | Public Transport Victoria (PTV) Developer API |
| **URL** | `https://timetableapi.ptv.vic.gov.au/` |
| **Format** | JSON (live, per-request) |
| **Licence** | PTV Developer API Terms of Service |
| **Fields used** | Stop ID, stop name, stop lat/lng, route type; departure scheduled time, estimated time, route number, direction |
| **Not persisted** | Proxied through backend; responses cached 60 seconds to limit API call volume |
| **Privacy note** | No personal data; query parameters are coordinates and stop IDs only |

### 2.6 City of Melbourne Open Data — Community Venues (New in Iteration 3)

| Attribute | Detail |
|-----------|--------|
| **Source** | City of Melbourne Open Data Portal |
| **URL** | `https://data.melbourne.vic.gov.au/` |
| **Format** | JSON (live, per-request) |
| **Update frequency** | Real-time; backend caches per suburb for 24 hours |
| **Licence** | Creative Commons Attribution 4.0 |
| **Fields used** | Venue name, type (neighbourhood house / community centre / library), address, lat/lng, website |
| **Loaded into** | Not persisted; served from `GET /api/community-venues`; in-memory cache keyed by suburb |
| **Privacy note** | Describes public institutions; no personal data |

### 2.7 Guide Content — Authored Static JSON (Extended Schema)

| Attribute | Detail |
|-----------|--------|
| **Source** | Authored by the TP39 team |
| **Location** | `public/guides-content/<topic-slug>/<guide-slug>.json` (frontend); mirrored to `app/s3/guides-content/` (backend) and synced to AWS S3 |
| **Format** | JSON (extended schema — see Section 7) |
| **Licence** | Owned by TP39 |
| **New fields** | `tables` (GuideDataTable[]), `videos` (GuideYouTubeEmbed[]), `keyTerms` (GuideKeyTerm[]) |

### 2.8 Static Reference Data — Topics and Arcs (Unchanged)

Same five topics and three arcs as Iteration 2. Seeded by `app/scripts/seed_static_reference_data.py`.

### 2.9 Curated Volunteer Organisations — Static JSON (New in Iteration 3)

| Attribute | Detail |
|-----------|--------|
| **Source** | Curated and authored by TP39 |
| **Location** | `public/volunteering-orgs.json` |
| **Format** | JSON (static; served by Next.js) |
| **Update frequency** | Manual update by the team; no automated sync |
| **Licence** | Data sourced from public volunteer org websites; compiled by the team |
| **Fields** | `name`, `category`, `url`, `suburb`, `description` |
| **Count** | 20–30 organisations covering Melbourne |

### 2.10 OpenStreetMap Geodata (Extended)

| Attribute | Detail |
|-----------|--------|
| **Source** | Overpass API — OpenStreetMap |
| **Script** | `app/scripts/fetch-geodata.mjs` (Node.js) |
| **Output files** | `public/geodata/melbourne-trams.geojson` (~240 KB), `public/geodata/melbourne-trains.geojson` (~377 KB), `public/geodata/melbourne-parks.geojson` (~210 KB) |
| **New in Iteration 3** | GeoJSON files now consumed by MapLibre GL overlays (topic-sensitive rendering) rather than Leaflet |
| **Coordinate rounding** | 4 decimal places; geometry simplified via Ramer-Douglas-Peucker |

### 2.11 MapTiler — Vector Map Tiles (New in Iteration 3)

| Attribute | Detail |
|-----------|--------|
| **Source** | MapTiler |
| **URL** | MapTiler CDN (accessed via `NEXT_PUBLIC_MAPTILER_KEY`) |
| **Format** | Vector tiles (Mapbox Vector Tile spec) |
| **Update frequency** | Fetched at render time by MapLibre GL JS; not persisted |
| **Licence** | MapTiler free tier (100 000 map loads/month) |
| **Replaces** | CartoDB Positron raster tiles (Iteration 2) |
| **Privacy note** | Tile requests carry the map key but no user data |

### 2.12 Claude API — LLM Personalisation (New in Iteration 3)

| Attribute | Detail |
|-----------|--------|
| **Source** | Anthropic Claude API |
| **Models** | `claude-sonnet-4-6` (identity generation, journey plan); `claude-haiku-4-5` (memory lines, greetings, arc receipts) |
| **Format** | JSON (structured output via `response_format`); streaming for identity |
| **Update frequency** | Called at request time; not persisted server-side |
| **Prompt caching** | System prompt and static guide catalog marked `cache_control: {"type": "ephemeral"}`; cache TTL 5 minutes |
| **Fallback** | All LLM calls have synchronous fallbacks activated on timeout (8 s) or API failure |
| **Replaces** | OpenRouter `owl-alpha` (Iteration 2) |
| **Privacy note** | User inputs (suburb, moment text, selected topics) are forwarded to the Claude API. No PII beyond user-authored free text. See Section 10 |

---

## 3. Data Collection and Acquisition

### 3.1 Automated ETL Scripts (Unchanged from Iteration 2)

`uv run python -m app.scripts` runs the full ETL pipeline (excluding S3 sync and new ABS Census import) in order:

| Step | Script | Action |
|------|--------|--------|
| 1 | `app.scripts.extract` | ABS Excel → `app/data/victoria_population_table.csv` |
| 2 | `app.scripts.load_population_records` | CSV → `suburb_demographics` |
| 3 | `app.scripts.load_melbourne_suburbs` | Australian postcodes CSV → `suburbs` |
| 4 | `app.scripts.seed_static_reference_data` | Upsert `topics` and `arcs` by slug |

S3 sync runs separately:

| Step | Script | Action |
|------|--------|--------|
| 5 | `app.scripts.sync_s3_content` | MD5 diff → upload new/changed guide JSON to `guides-content/` on S3 |

### 3.2 New ETL Scripts (Iteration 3 — Backlog)

| Step | Script (planned) | Action |
|------|-----------------|--------|
| 6 | `app.scripts.load_census_suburb_data` | Load ABS Census median rent and overseas-born % into `suburb_demographics` new columns |

### 3.3 Live Data at Request Time

| Service | Endpoint | Trigger | Caching |
|---------|----------|---------|---------|
| SerpAPI `google_maps` | `GET /api/nearby-interest` | Per-request | None |
| SerpAPI `google_events` | `GET /api/nearby-events` | Per-request | None (5-min TTL planned) |
| PTV Timetable API | `GET /api/ptv/stops-nearby`, `GET /api/ptv/departures` | Per-request | 60 s in-memory |
| City of Melbourne Open Data | `GET /api/community-venues` | Per suburb, per-request | 24 h in-memory per suburb key |
| Claude API | `POST /api/journey/identity`, `POST /api/journey/memory`, `POST /api/llm/journey-plan`, `POST /api/llm/greeting`, `POST /api/llm/arc-receipt` | Per-request (user-initiated) | Prompt cache (system prompt + guide catalog); no response caching |

### 3.4 Guide Content Authoring (Extended)

Guide JSON files follow the extended schema (Section 7). New fields (`tables`, `videos`, `keyTerms`) are optional; existing guides may omit them. YouTube video IDs are verified before commit. The `sync_s3_content.py` script keeps the S3 bucket in sync after any content change.

### 3.5 Static Asset Generation (Geodata)

GeoJSON files are regenerated by running:

```bash
node app/scripts/fetch-geodata.mjs
```

This fetches from Overpass API, simplifies geometry, and writes to `public/geodata/`. These files are committed to source control and served statically by Next.js. They are not re-fetched at runtime.

---

## 4. Data Storage Architecture

### 4.1 Storage Layer Summary

| Store | Technology | What is stored | Location |
|-------|-----------|---------------|----------|
| Relational database | PostgreSQL via Neon | Suburb master data, demographics, topics, arcs, guides, guide_sections | Neon cloud (ap-southeast-2) |
| Object storage | AWS S3 | Guide content JSON under `guides-content/` prefix | AWS ap-southeast-2 bucket |
| Static file serving | Next.js `public/` | Guide content JSON, GeoJSON overlays, `volunteering-orgs.json` | CDN / Vercel edge |
| Client-side | Browser localStorage | User personalisation: suburb, arc progress, guide steps, journey identity, bookmarks, saved locations | User's device only |
| Client-side (ephemeral) | Browser sessionStorage | Hub dismiss flag, LLM greeting (per-session) | User's device, cleared on tab close |
| Intermediary CSV | File system (`app/data/`) | ABS population CSV generated by `extract.py` | Backend host only |
| In-memory (server) | Python dict | PTV responses (60 s TTL); CoM Open Data venues (24 h TTL per suburb) | Backend process only |

### 4.2 Database Connection (Unchanged)

```
postgresql://user:password@host/dbname?sslmode=require
```

Managed via SQLAlchemy engine (`app/database.py`), dependency-injected into FastAPI route handlers.

### 4.3 AWS S3 Configuration (Unchanged)

| Variable | Purpose |
|----------|---------|
| `AWS_S3_BUCKET_NAME` | Target bucket name |
| `AWS_DEFAULT_REGION` | Region (`ap-southeast-2`) |
| `AWS_ACCESS_KEY_ID` | AWS credentials |
| `AWS_SECRET_ACCESS_KEY` | AWS credentials |

### 4.4 Claude API Configuration (New)

| Variable | Purpose |
|----------|---------|
| `ANTHROPIC_API_KEY` | Authenticates all Claude API calls in `app/services/journey_service.py` and LLM router |

### 4.5 MapTiler Configuration (New — Frontend Only)

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_MAPTILER_KEY` | MapTiler API key used by MapLibre GL JS in the browser |

---

## 5. Database Schema (ERD)

### 5.1 Entity Relationship Diagram

```mermaid
erDiagram
    TOPIC ||--o{ GUIDE : classifies
    ARC ||--o{ GUIDE : groups
    GUIDE ||--o{ GUIDE_SECTION : contains
    GUIDE ||--o| GUIDE : next_guide
    SUBURB_DEMOGRAPHIC ||--o{ SUBURB : maps_sa2

    TOPIC {
      int id PK
      string slug UK
      string name
      int sort_order
      boolean is_active
    }

    ARC {
      int id PK
      string slug UK
      string name
      int sort_order
      string timeframe_label
    }

    GUIDE {
      int id PK
      string title
      string slug UK
      int arc_id FK
      int arc_order
      int topic_id FK
      int next_guide_id FK
      string near_me_deeplink
      int reading_time_min
      boolean is_published
      boolean is_featured
      datetime created_at
      datetime updated_at
    }

    GUIDE_SECTION {
      int id PK
      int guide_id FK
      string section_key
      int section_order
      text body
      datetime updated_at
    }

    SUBURB {
      int id PK
      string name
      string postcode
      string state
      float lat
      float lng
      string sa2_code FK
      string sa3_name
    }

    SUBURB_DEMOGRAPHIC {
      int id PK
      string sa2_code UK
      string sa2_name
      string sa3_name
      string sa4_name
      string gccsa_name
      int erp_2024
      int erp_2025
      int erp_change_no
      float erp_change_pct
      float area_km2
      float pop_density_2025
      int median_weekly_rent
      float overseas_born_pct
    }
```

### 5.2 New Columns in Iteration 3

#### `suburb_demographics.median_weekly_rent` (Backlog)

INTEGER. Median weekly rent for the SA2 area sourced from ABS Census. Null until `load_census_suburb_data` ETL script is run. Required by `GET /api/suburb/livability`.

#### `suburb_demographics.overseas_born_pct` (Backlog)

NUMERIC(5,2). Percentage of residents born overseas, sourced from ABS Census. Null until census ETL is run.

### 5.3 Table Descriptions (Unchanged from Iteration 2)

All existing tables retain their Iteration 2 structure. `guides` and `guide_sections` are defined as ORM models but guide content continues to be served statically from `public/guides-content/` in Iteration 3.

---

## 6. Client-Side Data Model (localStorage)

All user personalisation lives in the browser under the `minuri:` namespace. No data is sent to any server except the fields explicitly listed in Section 10.1 as inputs to the Claude API.

### 6.1 Key Registry

| Key | Owner Epic | TypeScript Shape | Storage | Lifetime | Status |
|-----|-----------|-----------------|---------|---------|--------|
| `minuri:suburb` | Landing | `string` | localStorage | Persistent | Unchanged |
| `minuri:lifeMoment` | Landing | `"just-arrived" \| "getting-set-up" \| "finding-people"` | localStorage | Persistent | Unchanged |
| `minuri:topicFrequency` | Landing | `Record<TopicSlug, number>` | localStorage | Persistent | Unchanged |
| `minuri:arcProgress` | Guides | `Record<ArcSlug, number>` | localStorage | Persistent | Unchanged |
| `minuri:readGuides` | Guides | `string[]` | localStorage | Persistent | Unchanged |
| `minuri:bookmarks` | Guides | `{guideSlug: string, sectionKey: string}[]` | localStorage | Persistent | Unchanged |
| `minuri:savedLocations` | Near Me | `SavedLocation[]` | localStorage | Persistent | Unchanged |
| `minuri:hub:dismissed` | Landing | `boolean` | sessionStorage | Per-session | Unchanged |
| `minuri:journey:v2` | Journey | `LLMJourneyPlan` (see 6.3) | localStorage | Persistent | **Replaces v1** |
| `minuri:journey:identity:v1` | Journey | `IdentityStore` (see 6.4) | localStorage | Persistent | **New** |
| `minuri:llm:greeting` | Journey | `string` | sessionStorage | Per-session | **New** |
| `minuri:arcReceipt:<arc-slug>` | Journey | `string` (receipt text) | localStorage | Persistent | **New** |
| `minuri:guide:steps:<slug>` | Guides | `number` (bitmask, up to 30 steps) | localStorage | Persistent | **New** |
| `minuri:guide:quicktake:<slug>` | Guides | `boolean` (collapsed state) | localStorage | Persistent | **New** |
| `minuri:suburb:livability` | Near Me / Journey | `Record<suburbName, SuburbLivability>` with `fetchedAt` TTL | localStorage | 7-day TTL | **New (Backlog)** |

### 6.2 LLMJourneyPlan Shape (`minuri:journey:v2`)

```typescript
interface LLMDay {
  dayNumber: number
  label: string
  theme: string
  guideSlug: string
  nearMeTopic: TopicSlug
  task: string
}

interface LLMJourneyPlan {
  generatedAt: string      // ISO 8601
  fallback: boolean        // true if LLM timed out and static plan was used
  arc: ArcSlug
  suburb: string
  vibeColor: VibeColor
  days: LLMDay[]           // 7 entries
}
```

**Migration note:** On first read, if `minuri:journey:v2` is absent but `minuri:journey:v1` is present, the v1 value is migrated: `suburb`, `yourMoment`, and `selectedTopics` are extracted, a new plan is triggered, and v1 is cleared.

### 6.3 IdentityStore Shape (`minuri:journey:identity:v1`)

```typescript
interface JourneyIdentity {
  archetype: string
  mantra: string
  final_mantra: string
  symbol: string
  mood: string
  suburb_line: string
  palette: { hex: string; name: string }[]
  traits: { courage: number; curiosity: number; social: number; independence: number }
  letter: { body: string; sign_off: string }
}

interface CardState {
  daysCompleted: number
  saturation: number          // 0–100; drives greyscale → colour progression
  titleTier: 0 | 1 | 2 | 3
  stampsEarned: string[]
  memoryLines: string[]       // one per completed day, from /api/journey/memory
  traitValues: Record<string, number>
  constellationLit: boolean
  symbolGlowing: boolean
  fullyUnlocked: boolean
}

interface IdentityStore {
  identity: JourneyIdentity
  cardState: CardState
}
```

### 6.4 SuburbLivability Shape (`minuri:suburb:livability`, Backlog)

```typescript
interface SuburbLivability {
  suburb: string
  fetchedAt: string              // ISO 8601; stale after 7 days
  gpCount: number
  supermarketCount: number
  transitFrequencyLabel: string  // e.g. "Every 8 min"
  medianWeeklyRent: number | null
  overseasBornPct: number | null
  narrative: string              // 2-sentence Claude Haiku summary
}
```

### 6.5 Guide Step Bitmask (`minuri:guide:steps:<slug>`)

Each guide step (checklist item within a guide section) maps to a bit position. A single integer encodes up to 30 steps. The `useGuideSteps` hook reads and writes this value:

```typescript
// Check if step N is done
const isDone = (bitmask >> stepIndex) & 1

// Mark step N done
const updated = bitmask | (1 << stepIndex)
```

### 6.6 localStorage Privacy Guarantee

All data under `minuri:` lives exclusively on the user's device except where the user explicitly initiates a journey plan — see Section 10.1 for exactly which fields are forwarded to the Claude API and under what circumstances.

---

## 7. Guide Content Schema (Static JSON)

Each guide is a JSON file at `public/guides-content/<topic-slug>/<guide-slug>.json`.

### 7.1 Guide Object

| Field | Type | Constraint | Status |
|-------|------|-----------|--------|
| `id` | `number` | Unique across all guides | Unchanged |
| `slug` | `string` | Kebab-case; matches filename | Unchanged |
| `title` | `string` | Required | Unchanged |
| `summary` | `string` | 1–3 sentences | Unchanged |
| `arc` | `"day-1" \| "week-1" \| "month-1"` | Must match arc slug | Unchanged |
| `arcOrder` | `number` | Unique within topic + arc | Unchanged |
| `topic` | `TopicSlug` | One of five unified slugs | Unchanged |
| `readingTimeMin` | `number` | Integer 2–15 | Unchanged |
| `isPublished` | `boolean` | Draft vs live | Unchanged |
| `isFeatured` | `boolean` | Max 1–2 per topic | Unchanged |
| `markdownPath` | `string` | Self-referential path for tooling | Unchanged |
| `nextGuideSlug` | `string \| null` | Must exist in catalog or be null | Unchanged |
| `searchTerms` | `string[]` | At least 3 keywords | Unchanged |
| `sourceLinks` | `{label: string, href: string}[]` | Real, verified URLs | Unchanged |
| `thumbnailUrl` | `string` | Required | Unchanged |
| `nearMeDeeplink` | `string` | `/near-me?topic=<slug>&from=<guide-slug>` | Unchanged |
| `sections` | `Section[]` | Exactly 6 objects in prescribed order | Unchanged |
| `tables` | `GuideDataTable[]` | Optional; zero or more data tables referenced from section body | **New** |
| `videos` | `GuideYouTubeEmbed[]` | Optional; zero or more YouTube video IDs | **New** |
| `keyTerms` | `GuideKeyTerm[]` | Optional; zero or more glossary terms | **New** |

### 7.2 New Sub-Types (Iteration 3)

```typescript
interface GuideDataTable {
  id: string
  caption?: string
  headers: string[]
  rows: string[][]
}

interface GuideYouTubeEmbed {
  id: string           // YouTube video ID (11 characters)
  caption?: string
  startSeconds?: number
}

interface GuideKeyTerm {
  term: string
  definition: string
}
```

### 7.3 Section Object (Unchanged)

| Field | Type | Constraint |
|-------|------|-----------|
| `sectionKey` | `"moment" \| "feeling" \| "reveal" \| "how-it-works" \| "bridge" \| "next-chapter"` | Required; this exact order |
| `title` | `string` | Display name for section heading |
| `value` | `string` | Markdown-formatted body content |

### 7.4 Guide Catalog (Iteration 3)

All 20 Iteration 2 guides are retained. `tables`, `videos`, and `keyTerms` fields are being progressively added; priority is the 8 Health & Wellbeing guides. The old `category` field (Iteration 2 deprecation path) is removed in Iteration 3.

---

## 8. Data Processing and ETL Pipeline

### 8.1 Full Data Flow Diagram

```mermaid
flowchart TD
    subgraph Sources["External Sources"]
        A1[Australian Postcodes CSV\nGitHub]
        A2[ABS Victoria Population XLSX]
        A2b[ABS Census Data\nRent / Overseas-born]
        A3[SerpAPI\ngoogle_maps + google_events]
        A4[Claude API\nSonnet 4.6 / Haiku]
        A5[Overpass API\nOpenStreetMap]
        A6[PTV Timetable API]
        A7[City of Melbourne\nOpen Data]
        A8[MapTiler CDN\nVector tiles]
        L1[app/s3/guides-content/\nlocal JSON files]
        L2[public/volunteering-orgs.json\ncurated static]
    end

    subgraph ETL["ETL Pipeline (app.scripts)"]
        S1[extract.py\nExcel → CSV]
        S2[load_population_records.py\nCSV → DB]
        S3[load_melbourne_suburbs.py\nDownload → DB]
        S4[seed_static_reference_data.py\nUpsert topics & arcs]
        S5[sync_s3_content.py\nMD5 diff → upload]
        S6[fetch-geodata.mjs\nOSM → GeoJSON]
        S7[load_census_suburb_data.py\nBacklog — ABS Census → DB]
    end

    subgraph Storage["Storage"]
        DB[(PostgreSQL\nNeon DB)]
        S3B[(AWS S3\nguides-content/)]
        F1[app/data/\nvictoria_population_table.csv]
        GEO[public/geodata/\ntrams · trains · parks GeoJSON]
    end

    subgraph Services["Backend Services"]
        SV1[suburb_service.py]
        SV2[population_service.py]
        SV3[near_me.py\nSerpAPI proxy]
        SV4[journey_service.py\nClaude API]
        SV5[ptv_service.py\nPTV proxy + 60s cache]
        SV6[community_venue_service.py\nCoM Open Data + 24h cache]
        SV7[suburb_livability_service.py\nBacklog]
    end

    subgraph API["FastAPI App"]
        R1[GET /suburb]
        R2[GET /suburb/larger-region]
        R3[GET /api/population]
        R4[GET /api/nearby-interest]
        R5[GET /api/nearby-events]
        R6[GET /api/community-venues]
        R7[POST /api/journey/identity]
        R8[POST /api/journey/memory]
        R9[POST /api/llm/journey-plan]
        R10[POST /api/llm/greeting]
        R11[POST /api/llm/arc-receipt]
        R12[GET /api/ptv/stops-nearby]
        R13[GET /api/ptv/departures]
        R14[GET /api/suburb/livability — Backlog]
    end

    A1 --> S3 --> DB
    A2 --> S1 --> F1 --> S2 --> DB
    A2b --> S7 --> DB
    S4 --> DB
    L1 --> S5 --> S3B
    A5 --> S6 --> GEO

    RUN[uv run python -m app.scripts\nETL only] --> S1 & S2 & S3 & S4

    DB --> SV1 --> R1 & R2
    DB --> SV2 --> R3
    A3 --> SV3 --> R4 & R5
    A4 --> SV4 --> R7 & R8 & R9 & R10 & R11
    A6 --> SV5 --> R12 & R13
    A7 --> SV6 --> R6
    DB --> SV7 --> R14
    A3 --> SV7
    A6 --> SV7

    R1 & R2 & R3 & R4 & R5 & R6 & R7 & R8 & R9 & R10 & R11 & R12 & R13 & R14 --> Client[Next.js Client]
    GEO --> Client
    L2 --> Client
    A8 -->|MapLibre tiles| Client

    classDef source fill:#e3f2fd,stroke:#1e88e5,color:#0d47a1;
    classDef etl fill:#ede7f6,stroke:#5e35b1,color:#311b92;
    classDef db fill:#e8f5e9,stroke:#2e7d32,color:#1b5e20;
    classDef serve fill:#fff3e0,stroke:#ef6c00,color:#e65100;
    classDef client fill:#fce4ec,stroke:#c2185b,color:#880e4f;
    classDef runner fill:#f3e5f5,stroke:#8e24aa,color:#4a148c;

    class A1,A2,A2b,A3,A4,A5,A6,A7,A8,F1,L1,L2 source;
    class S1,S2,S3,S4,S5,S6,S7 etl;
    class DB,S3B db;
    class SV1,SV2,SV3,SV4,SV5,SV6,SV7,R1,R2,R3,R4,R5,R6,R7,R8,R9,R10,R11,R12,R13,R14 serve;
    class Client client;
    class RUN runner;
```

### 8.2 ETL Script Reference

| Script | Input | Output | Idempotent? |
|--------|-------|--------|-------------|
| `app.scripts.extract` | ABS Excel | `victoria_population_table.csv` | Yes |
| `app.scripts.load_population_records` | CSV | `suburb_demographics` rows | Drops + recreates via `__main__` |
| `app.scripts.load_melbourne_suburbs` | Australian postcodes CSV | `suburbs` rows | Drops + recreates via `__main__` |
| `app.scripts.seed_static_reference_data` | Hardcoded constants | `topics` and `arcs` rows | Yes — upserts by slug |
| `app.scripts.sync_s3_content` | `app/s3/` local files | AWS S3 `guides-content/` | Yes — MD5 comparison |
| `app.scripts.load_census_suburb_data` | ABS Census tables | `suburb_demographics.median_weekly_rent`, `.overseas_born_pct` | Yes — upserts by `sa2_code` |

### 8.3 Request Lifecycle (Updated)

```mermaid
sequenceDiagram
    participant C as Client
    participant MW as Middleware<br/>(CORS + Security Headers + Rate Limiter)
    participant R as Router
    participant S as Service
    participant EXT as External<br/>(SerpAPI / Claude / PTV / CoM)
    participant DB as PostgreSQL

    C->>MW: HTTP Request
    MW->>MW: CORS check
    MW->>MW: Rate limit check (slowapi)
    MW->>R: Forward request
    alt DB-backed endpoint
        R->>S: call service(db, params)
        S->>DB: SQLAlchemy query
        DB-->>S: rows
        S-->>R: response model
    else SerpAPI endpoint
        R->>S: call service(params)
        S->>EXT: serpapi.Client.search(...)
        EXT-->>S: JSON payload
        S-->>R: normalized results
    else Claude API endpoint
        R->>S: await llm_service(params)
        S->>S: build prompt (cached system + guide catalog)
        S->>EXT: httpx POST → Anthropic API (8 s timeout)
        EXT-->>S: structured JSON / stream
        S-->>R: typed response (or fallback if timeout)
    else PTV / CoM endpoint
        R->>S: call service(params)
        S->>S: check in-memory cache
        alt cache hit
            S-->>R: cached response
        else cache miss
            S->>EXT: HTTP GET → PTV or CoM API
            EXT-->>S: JSON
            S->>S: populate cache
            S-->>R: response
        end
    end
    R-->>MW: Response
    MW->>MW: Inject security headers
    MW-->>C: Final response
```

---

## 9. API Endpoints and Data Flow

### 9.1 Full API Surface

| Endpoint | Method | Auth | Returns | Status |
|----------|--------|------|---------|--------|
| `/` | GET | None | `{"message": "Root endpoint"}` | Unchanged |
| `/suburb` | GET | None | Suburb records | Unchanged |
| `/suburb/larger-region` | GET | None | Distinct SA3 names | Unchanged |
| `/api/population` | GET | None | ABS ERP aggregate | Unchanged |
| `/api/nearby-interest` | GET | None (key server-side) | SerpAPI places | Unchanged |
| `/api/nearby-events` | GET | None (key server-side) | SerpAPI events + CoM venues + volunteer orgs | **New** |
| `/api/community-venues` | GET | None (key server-side) | CoM Open Data venue list | **New** |
| `/api/ptv/stops-nearby` | GET | None (key server-side) | PTV stops within radius | Carried from Iteration 2 |
| `/api/ptv/departures` | GET | None (key server-side) | Next 3 departures for stop | Carried from Iteration 2 |
| `/api/journey/identity` | POST | None | Streaming `JourneyIdentity` (Claude Sonnet 4.6) | **New** |
| `/api/journey/memory` | POST | None | `{memory_line: string}` (Claude Haiku) | **New** |
| `/api/llm/journey-plan` | POST | None | `LLMJourneyPlan` (Claude Sonnet 4.6, prompt-cached) | **New** |
| `/api/llm/greeting` | POST | None | `{greeting: string}` (Claude Haiku) | **New** |
| `/api/llm/arc-receipt` | POST | None | `{receipt: string}` (Claude Haiku) | **New** |
| `/api/suburb/livability` | GET | None | `SuburbLivability` (Claude Haiku + SerpAPI + PTV + DB) | **New (Backlog)** |

### 9.2 Rate Limits

| Endpoint | Limit |
|----------|-------|
| `GET /api/nearby-interest` | 10 / minute |
| `GET /api/nearby-events` | 10 / minute |
| `GET /api/community-venues` | 20 / minute |
| `GET /api/population` | 30 / minute |
| `GET /suburb` | 30 / minute |
| `GET /suburb/larger-region` | 30 / minute |
| `POST /api/journey/identity` | 5 / minute |
| `POST /api/journey/memory` | 10 / minute |
| `POST /api/llm/journey-plan` | 5 / minute |
| `POST /api/llm/greeting` | 10 / minute |
| `POST /api/llm/arc-receipt` | 10 / minute |
| `GET /api/ptv/stops-nearby` | 20 / minute |
| `GET /api/ptv/departures` | 30 / minute |
| `GET /api/suburb/livability` | 10 / minute |

Exceeded limits return `429 Too Many Requests`.

### 9.3 Journey Identity Endpoint

**POST `/api/journey/identity`**

| Field | Constraints |
|-------|-------------|
| `suburb` | 1–100 chars; `{}` stripped |
| `your_moment` | 10–500 chars; C0 control chars sanitized |
| `selected_topics` | 1–5 valid topic slugs |

Response: streams `JourneyIdentity` JSON (Section 6.3). Fallback (on 8 s timeout): deterministic identity derived from archetype lookup table.

### 9.4 Journey Memory Endpoint

**POST `/api/journey/memory`**

| Field | Constraints |
|-------|-------------|
| `archetype` | One of four valid archetype keys |
| `day_number` | 1–7 |
| `guide_slug` | Valid guide slug |

Response: `{"memory_line": "..."}` — one sentence, 10–30 words.

### 9.5 LLM Journey Plan Endpoint

**POST `/api/llm/journey-plan`**

| Field | Constraints |
|-------|-------------|
| `suburb` | 1–100 chars |
| `concern` | 10–300 chars |
| `selected_topics` | 1–5 valid topic slugs |
| `already_sorted` | `string[]`; items that skip redundant guides |
| `arc` | One of three arc slugs |

Prompt structure: cached system prompt + static guide catalog (`cache_control: ephemeral`) + user message. Response: `LLMJourneyPlan` (Section 6.2). Fallback: static archetype-to-guide mapping with `fallback: true`.

### 9.6 Nearby Events Endpoint

**GET `/api/nearby-events`**

| Param | Required | Notes |
|-------|----------|-------|
| `suburb` | Yes | Used in SerpAPI query: `social community events {suburb} Melbourne` |
| `date_filter` | No (default `week`) | `today`, `week`, `next_month` |

Response:
```json
{
  "suburb": "Fitzroy",
  "query": "social community events Fitzroy Melbourne",
  "date_filter": "week",
  "results": [{
    "title": "...",
    "date": { "when": "Sat, Jun 7, 2025" },
    "address": "...", "description": "...",
    "link": "...", "thumbnail": "...",
    "venue": { "name": "...", "rating": 4.2 }
  }]
}
```

Thumbnails are proxied through `wsrv.nl` to `800×600`. Errors: `400` invalid `date_filter`, `502` SerpAPI failure.

### 9.7 Community Venues Endpoint

**GET `/api/community-venues`**

| Param | Required | Notes |
|-------|----------|-------|
| `suburb` | Yes | Filters by suburb from City of Melbourne Open Data |

Response: `{ "suburb": "...", "venues": [{ "name", "type", "address", "lat", "lng", "website" }] }`. Cached 24 h per suburb. Errors: `502` if CoM Open Data is unavailable.

---

## 10. Data Security and Privacy

### 10.1 Personal Data Inventory

| Data element | Source | Contains PII? | Storage | Forwarded to third party? |
|-------------|--------|--------------|---------|--------------------------|
| Suburb name | User input | No | localStorage; sent as API query param | Sent to SerpAPI, PTV, Claude API as part of journey/nearby queries |
| Life-moment selection | User input | No | localStorage only | No |
| Guide read history | User behaviour | No | localStorage only | No |
| Saved Near Me places | User interaction | No | localStorage only | No |
| Journey moment text | User input (free text) | **Potentially sensitive** | localStorage; forwarded to Claude API when user initiates journey | **Yes — forwarded to Anthropic Claude API** (see below) |
| Selected topics | User input | No | localStorage; forwarded to Claude API as part of journey | Yes — forwarded to Anthropic Claude API |
| ABS population/census data | ABS | No — aggregate statistics | PostgreSQL | No |
| SerpAPI results | SerpAPI | No — describes businesses/events | Not persisted; in-memory only | N/A |
| PTV stop/departure data | PTV | No — public transport infrastructure | Not persisted; in-memory 60 s | N/A |
| CoM venue data | City of Melbourne | No — public institutions | Not persisted; in-memory 24 h | N/A |
| MapTiler tile requests | MapTiler CDN | No — generic tile coordinates | Not persisted | Yes — tile request sent to MapTiler CDN with API key |

**Claude API disclosure:** When a user submits the journey onboarding form, the following three fields are transmitted to the Anthropic Claude API: (1) suburb name, (2) `your_moment` free text, (3) selected topic slugs. No other user data is sent. Anthropic's data handling is governed by the Anthropic API Terms of Service. The team does not log or store these request payloads server-side.

### 10.2 API Key Management

| Key | Storage | Used by |
|-----|---------|---------|
| `SERPAPI_API_KEY` | `.env` / process env | `app/services/near_me.py` |
| `ANTHROPIC_API_KEY` | `.env` / process env | `app/services/journey_service.py` (replaces `OPEN_ROUTER_API`) |
| `NEXT_PUBLIC_MAPTILER_KEY` | `.env.local` / Vercel env | Browser (MapLibre GL JS) |
| PTV developer key | `.env` / process env | `app/services/ptv_service.py` |
| `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` | `.env` / process env | `app/scripts/sync_s3_content.py` only |

`NEXT_PUBLIC_MAPTILER_KEY` is exposed to the browser by Next.js convention. MapTiler keys should be domain-restricted in the MapTiler dashboard to prevent unauthorised use.

### 10.3 Client-Side Data Transparency (Updated)

The hub footer displays:

> *"Your journey stays on this device. Minuri never sees it."*

**Clarification note (added Iteration 3):** When you generate a Journey Plan, your suburb, your moment description, and your selected topics are sent to Anthropic's Claude API to create your personalised identity. This data is not stored by Minuri after the response is returned.

Users retain export and clear controls as in Iteration 2.

### 10.4 HTTPS and Transport Security (Unchanged)

All API calls use HTTPS in production. PostgreSQL connection requires `sslmode=require`. Claude API calls use HTTPS via `httpx`. MapTiler tile requests use HTTPS via the MapLibre GL JS client.

### 10.5 LLM Output Safety

Journey identity and memory outputs are generated by Claude models. The backend validates that:
- The response matches the expected `JourneyIdentity` schema before forwarding to the client.
- On parse failure or timeout, the deterministic fallback path is used rather than passing raw LLM output.

Input sanitization before forwarding to the Claude API:
- `suburb`: `{}` characters stripped to prevent prompt injection.
- `your_moment`: C0 control characters (U+0000–U+001F) sanitized.
- `selected_topics`: validated against the canonical slug list; unknown slugs are rejected with HTTP 400.

---

## 11. Data Quality and Validation

### 11.1 Database Integrity (Unchanged)

Existing constraints from Iteration 2 are retained. New columns (`median_weekly_rent`, `overseas_born_pct`) are nullable until the census ETL is run.

### 11.2 Guide Content Validation (Extended)

Before a guide JSON is committed, authors verify:

1. All required fields are present and correctly typed.
2. `sections` contains exactly 6 objects in prescribed order.
3. `nextGuideSlug` matches catalog or is `null`.
4. `nearMeDeeplink` follows `/near-me?topic=<slug>&from=<guide-slug>`.
5. `sourceLinks` hrefs are real, publicly accessible URLs.
6. `arc` and `topic` match canonical slug lists.
7. (New) YouTube video IDs in `videos` are verified as publicly accessible.
8. (New) `tables` rows have consistent column counts matching `headers`.

### 11.3 LLM Response Validation

All Claude API responses are validated against Pydantic schemas before being returned to the client. Validation failures trigger the fallback path. The fallback is deterministic and does not call the Claude API.

### 11.4 SerpAPI Response Handling (Unchanged from Iteration 2)

`gps_coordinates`, `phone`, `website`, and `service_options` treated as optional. HTTP 502 on SerpAPI error.

**Events engine additions:** `venue`, `date.when`, and `thumbnail` are optional. Missing thumbnails are omitted from results rather than returning a broken URL.

### 11.5 Prompt Cache Validity

The Claude API prompt cache stores the system prompt and guide catalog. Cache invalidation occurs after 5 minutes of inactivity. When the guide catalog is updated (new guides added), the cached system prompt should be invalidated by making one uncached request to warm the new version. This is handled automatically by the normal request flow.

### 11.6 localStorage Data Integrity (Extended)

Existing `try/catch` wrappers on all `localStorage.getItem()` calls remain. New additions:

- `minuri:journey:v2`: validated on read against the `LLMJourneyPlan` schema; malformed data triggers a fresh plan generation rather than crashing.
- `minuri:guide:steps:<slug>`: bitmask stored as an integer; non-integer values are treated as 0 (no steps complete).
- `minuri:suburb:livability`: `fetchedAt` compared to current time on read; entries older than 7 days are discarded and re-fetched.

---

## 12. Ethical Considerations

### 12.1 Sensitive Content and Vulnerable Users (Updated)

Minuri's target audience includes young adults experiencing social isolation, financial stress, mental health challenges, and displacement anxiety.

**Journey moment text and Claude API:** In Iteration 3, the `your_moment` free-text field is forwarded to the Anthropic Claude API to generate a personalised identity. Users who disclose sensitive information (e.g., mental health struggles, financial hardship) should be aware their text leaves their device. The onboarding screen displays a clear notice before submission: *"Your moment is sent to our AI to create your identity. It's not stored by Minuri after your card is created."* Users may use preset moment options to avoid free-text disclosure entirely.

**Mental health content:** Crisis line phone numbers remain pinned in the Health & Wellbeing tab. Verified before each iteration release.

### 12.2 Data Minimisation (Updated)

- Claude API calls include only the minimum fields required: suburb, moment text, selected topics. No device identifiers, session tokens, or user behaviour history are sent.
- Community venue and events queries send only the suburb name — no coordinates or user identifiers.
- MapTiler tile requests contain no user data; they are keyed only to the visible map region.

### 12.3 LLM Output Responsibility

The team acknowledges that LLM-generated content (identity archetypes, letter bodies, mantras) may contain unexpected outputs. Safeguards:
- Schema validation rejects responses that do not conform to the expected structure.
- Archetype values are constrained to a closed set of four valid keys.
- No LLM output is stored server-side; the client receives and renders the response.
- Users can regenerate their journey plan at any time; previous state is overwritten in localStorage.

### 12.4 ABS Data Attribution (Unchanged)

Population statistics sourced under CC BY 4.0. Attribution in the `GET /api/population` response context and landing statistics widget.

### 12.5 City of Melbourne Open Data Attribution

Community venue data from the City of Melbourne Open Data Portal is used under CC BY 4.0. Attribution is displayed in the Near Me venue cards footer.

### 12.6 No Dark Patterns (Unchanged)

Hub sidebar auto-open behaviour, single-dismiss suppression, and the absence of re-engagement notifications remain unchanged from Iteration 2.

---

## 13. Changes from Iteration 2

### 13.1 What Changed

| Area | Iteration 2 | Iteration 3 |
|------|------------|------------|
| **Journey AI provider** | OpenRouter `owl-alpha` via `OPEN_ROUTER_API` | Anthropic Claude API (`claude-sonnet-4-6`, `claude-haiku-4-5`) via `ANTHROPIC_API_KEY`; prompt caching on system prompt + guide catalog |
| **Journey response shape** | `{identity, week_plan}` — backend generates 7-day plan | `{identity}` only — backend returns archetype; frontend assembles week plan from static persona journeys |
| **Journey identity card** | Static reveal card | Living card that earns visual elements per completed day; memory lines generated by Claude Haiku |
| **Map engine** | Leaflet + CartoDB raster tiles | MapLibre GL JS + MapTiler vector tiles (`NEXT_PUBLIC_MAPTILER_KEY`) |
| **Map overlays** | None | Topic-sensitive GeoJSON overlays (trams, trains, parks); inline hospital/market coordinates |
| **Near Me events** | Not implemented | `GET /api/nearby-events` — SerpAPI `google_events` engine |
| **Near Me community venues** | Not implemented | `GET /api/community-venues` — City of Melbourne Open Data; 24 h in-memory cache |
| **Volunteer orgs** | Not present | `public/volunteering-orgs.json` — 20–30 curated orgs (static) |
| **Guide content schema** | 6 text sections | Extended with `tables`, `videos` (YouTube IDs), `keyTerms`; all optional |
| **Guide step tracking** | None | `minuri:guide:steps:<slug>` — integer bitmask per guide (up to 30 steps) |
| **Guide quicktake** | None | `minuri:guide:quicktake:<slug>` — collapsed/expanded boolean per guide |
| **Journey localStorage version** | `minuri:journey:v1` | `minuri:journey:v2` — LLMJourneyPlan shape; migration from v1 on first read |
| **New localStorage keys** | — | `minuri:journey:identity:v1`, `minuri:llm:greeting` (sessionStorage), `minuri:arcReceipt:<arc-slug>` |
| **Database** | Existing columns only | `suburb_demographics.median_weekly_rent`, `suburb_demographics.overseas_born_pct` added (nullable; backlog ETL) |
| **ETL scripts** | 5 scripts | + `load_census_suburb_data` (backlog) |
| **Environment variables** | `SERPAPI_API_KEY`, `DB_CONNECTION`, `OPEN_ROUTER_API`, `AWS_*` | Replaced `OPEN_ROUTER_API` → `ANTHROPIC_API_KEY`; added `NEXT_PUBLIC_MAPTILER_KEY` |

### 13.2 Deprecated in Iteration 3

| Item | Status |
|------|--------|
| `OPEN_ROUTER_API` / OpenRouter `owl-alpha` | Replaced by `ANTHROPIC_API_KEY` + Claude API |
| `minuri:journey:v1` localStorage key | Migrated to `minuri:journey:v2` on first read; v1 key cleared after migration |
| `week_plan` in journey API response | Removed from backend response; frontend derives week plan from archetype and persona journey arrays |
| CartoDB Positron raster tiles | Replaced by MapTiler vector tiles |
| Guide `category` field | Removed (was kept as a deprecation path in Iteration 2) |

---

*Minuri · Iteration 3 Data Management Plan · TP39 · 2026-05-24*
*Still feeling home, wherever you are.*
