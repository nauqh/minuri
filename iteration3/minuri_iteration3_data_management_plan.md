# Minuri — Data Management Plan

**Unit:** FIT5120 Industry Experience Studio
**Team:** TP39
**Version:** 3.0 (Final)
**Date:** 2026-05-25
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

---

## 1. Overview

### 1.1 Purpose of This Document

This Data Management Plan (DMP) documents how data is collected, stored, processed, used, and protected within the Minuri application. It covers all data sources — external APIs, static datasets, a cloud-hosted relational database, a cloud object store, static GeoJSON assets, and client-side browser storage — and specifies responsibilities, schemas, and governance for each.

### 1.2 Product Summary

Minuri is a web application that helps young adults settle into independent life in Melbourne. It provides four interconnected features: a personalised Landing hub, a narrative First-Time Guides library, a Near Me location and events discovery tool, and a personalised LLM-powered Journey plan. All four features share a unified five-topic taxonomy: Food & Eating, Getting Around, Health & Wellbeing, Home & Admin, and Social & Belonging.

### 1.3 Data Scope

Minuri draws on twelve data sources across three storage tiers: a cloud-hosted PostgreSQL database (suburb master data, demographic statistics, guide metadata, and reference taxonomy), AWS S3 (guide content JSON), and the user's browser (all personalisation state). Live data is fetched at request time from SerpAPI, PTV, City of Melbourne Open Data, and the Anthropic Claude API. Static assets — GeoJSON overlays and a curated volunteer list — are committed to source control and served via the Next.js CDN. No user-identifiable data is stored server-side.

---

## 2. Data Sources

### 2.1 Australian Postcodes — Suburb Master Data

| Attribute | Detail |
|-----------|--------|
| **Source** | matthewproctor/australianpostcodes on GitHub |
| **URL** | `https://raw.githubusercontent.com/matthewproctor/australianpostcodes/master/australian_postcodes.csv` |
| **Format** | CSV |
| **Update frequency** | Fetched at ETL time (not scheduled); dataset is periodically updated by the upstream maintainer |
| **Licence** | Open (no commercial restriction stated by the repository) |
| **Fields used** | `locality`, `postcode`, `state`, `lat`, `long`, `sa2_code`, `sa3_name`, `sa4` |
| **Filtering applied** | Victoria suburbs with SA4 codes 206–214 (Greater Melbourne) |
| **Loaded into** | `suburbs` table in PostgreSQL |

### 2.2 ABS Regional Population — Victoria

| Attribute | Detail |
|-----------|--------|
| **Source** | Australian Bureau of Statistics |
| **URL** | ABS Regional Population release, Table 2, 2024–25 |
| **Format** | Excel (.xlsx) converted to CSV by `app/scripts/extract.py` |
| **Update frequency** | Annual ABS release; manual re-import required when new data is published |
| **Licence** | Creative Commons Attribution 4.0 (CC BY 4.0) |
| **Fields used** | SA2/SA3/SA4/GCCSA name and code, ERP 2024, ERP 2025, change count, change %, area km², population density 2025 |
| **Loaded into** | `suburb_demographics` table in PostgreSQL |

### 2.3 ABS Census Data — Rent and Demographics

| Attribute | Detail |
|-----------|--------|
| **Source** | ABS Census of Population and Housing |
| **Format** | Published tables (manual extraction) |
| **Licence** | Creative Commons Attribution 4.0 (CC BY 4.0) |
| **Fields used** | Median weekly rent by SA2, overseas-born percentage by SA2 |
| **Loaded into** | `suburb_demographics.median_weekly_rent`, `suburb_demographics.overseas_born_pct` |

### 2.4 SerpAPI — Live Nearby Search and Events

| Attribute | Detail |
|-----------|--------|
| **Source** | SerpAPI |
| **URL** | `https://serpapi.com/` |
| **Format** | JSON (live, per-request) |
| **Update frequency** | Real-time; not persisted |
| **Licence** | Commercial API — covered by the team's SerpAPI subscription |
| **Engines used** | `google_maps` (`GET /api/nearby-interest`); `google_events` (`GET /api/nearby-events`) |
| **Places fields** | `title`, `rating`, `reviews`, `address`, `type`, `price`, `open_state`, `description`, `thumbnail`, `place_id`, `gps_coordinates` |
| **Events fields** | `title`, `date.when`, `address`, `description`, `link`, `thumbnail`, `venue.name`, `venue.rating` |
| **Thumbnail handling** | Thumbnails proxied through `wsrv.nl` at `800×600` to bypass hotlink restrictions |
| **Not stored** | Results are in-memory during request only; not persisted to database |

### 2.5 PTV Timetable API — Public Transport Victoria

| Attribute | Detail |
|-----------|--------|
| **Source** | Public Transport Victoria (PTV) Developer API |
| **URL** | `https://timetableapi.ptv.vic.gov.au/` |
| **Format** | JSON (live, per-request) |
| **Licence** | PTV Developer API Terms of Service — key obtained via email request to PTV |
| **Fields used** | Stop ID, stop name, stop lat/lng, route type; departure scheduled time, estimated time, route number, direction |
| **Not persisted** | Proxied through backend; responses cached 60 seconds to limit API call volume |
| **Privacy note** | No personal data; query parameters are coordinates and stop IDs only |

### 2.6 City of Melbourne Open Data — Community Venues

| Attribute | Detail |
|-----------|--------|
| **Source** | City of Melbourne Open Data Portal |
| **URL** | `https://data.melbourne.vic.gov.au/` |
| **Format** | JSON (live, per-request) |
| **Update frequency** | Real-time; backend caches per suburb for 24 hours |
| **Licence** | Creative Commons Attribution 4.0 |
| **Fields used** | Venue name, type (neighbourhood house / community centre / library), address, lat/lng, website |
| **Not persisted** | Served from `GET /api/community-venues`; in-memory cache keyed by suburb |
| **Privacy note** | Describes public institutions; no personal data |

### 2.7 Guide Content — Authored Static JSON

| Attribute | Detail |
|-----------|--------|
| **Source** | Authored by the TP39 team |
| **Location** | `public/guides-content/<topic-slug>/<guide-slug>.json` (frontend); mirrored to `app/s3/guides-content/` (backend) and synced to AWS S3 |
| **Format** | JSON (see Section 7 for full schema) |
| **Update frequency** | Updated by team; synced to S3 via `app/scripts/sync_s3_content.py` |
| **Licence** | Owned by TP39 — authored content, no third-party restrictions |
| **Fields** | `id`, `slug`, `title`, `summary`, `arc`, `arcOrder`, `topic`, `readingTimeMin`, `isPublished`, `isFeatured`, `sections`, `tables`, `videos`, `keyTerms`, `sourceLinks`, `thumbnailUrl`, `nearMeDeeplink`, `nextGuideSlug`, `searchTerms` |

### 2.8 Static Reference Data — Topics and Arcs

| Attribute | Detail |
|-----------|--------|
| **Source** | Authored by the TP39 team; seeded by `app/scripts/seed_static_reference_data.py` |
| **Format** | Python constants (seeded via SQLAlchemy upsert) |
| **Update frequency** | Seeded once; updated manually if taxonomy changes |
| **Loaded into** | `topics` and `arcs` tables in PostgreSQL |

**Topics (5):**

| Slug | Name | Sort Order |
|------|------|-----------|
| `food-eating` | Food & Eating | 1 |
| `getting-around` | Getting Around | 2 |
| `health-wellbeing` | Health & Wellbeing | 3 |
| `home-admin` | Home & Admin | 4 |
| `social-belonging` | Social & Belonging | 5 |

**Arcs (3):**

| Slug | Name | Timeframe Label | Sort Order |
|------|------|----------------|-----------|
| `day-1` | You Just Moved In | Week 1 | 1 |
| `week-1` | Getting Set Up | Month 1 | 2 |
| `month-1` | Finding Your Rhythm | Month 3 | 3 |

### 2.9 Curated Volunteer Organisations — Static JSON

| Attribute | Detail |
|-----------|--------|
| **Source** | Curated and authored by TP39 |
| **Location** | `public/volunteering-orgs.json` |
| **Format** | JSON (static; served by Next.js) |
| **Update frequency** | Manual update by the team |
| **Licence** | Data sourced from public volunteer org websites; compiled by the team |
| **Fields** | `name`, `category`, `url`, `suburb`, `description` |
| **Count** | 20–30 organisations covering Melbourne |

### 2.10 OpenStreetMap Geodata

| Attribute | Detail |
|-----------|--------|
| **Source** | Overpass API — OpenStreetMap |
| **Script** | `app/scripts/fetch-geodata.mjs` (Node.js — requires `osmtogeojson` package) |
| **Output files** | `public/geodata/melbourne-trams.geojson` (~240 KB), `public/geodata/melbourne-trains.geojson` (~377 KB), `public/geodata/melbourne-parks.geojson` (~210 KB) |
| **Processing** | OSM → GeoJSON via `osmtogeojson`; geometry simplified via Ramer-Douglas-Peucker; coordinates rounded to 4 decimal places |
| **Served** | Committed to source control; fetched by MapLibre GL JS as topic-sensitive overlays |

### 2.11 MapTiler — Vector Map Tiles

| Attribute | Detail |
|-----------|--------|
| **Source** | MapTiler |
| **Format** | Vector tiles (Mapbox Vector Tile spec) |
| **Update frequency** | Fetched at render time by MapLibre GL JS; not persisted |
| **Licence** | MapTiler free tier (100 000 map loads/month) |
| **Privacy note** | Tile requests carry the map key but no user data |

### 2.12 Claude API — LLM Personalisation

| Attribute | Detail |
|-----------|--------|
| **Source** | Anthropic Claude API |
| **Models** | `claude-sonnet-4-6` (identity generation, journey plan); `claude-haiku-4-5` (memory lines, greetings, arc receipts) |
| **Format** | JSON (structured output via `response_format`); streaming for identity endpoint |
| **Update frequency** | Called at request time; not persisted server-side |
| **Prompt caching** | System prompt and static guide catalog marked `cache_control: {"type": "ephemeral"}`; cache TTL 5 minutes |
| **Fallback** | All LLM calls have synchronous fallbacks activated on timeout (8 s) or API failure |
| **Privacy note** | User inputs (suburb, moment text, selected topics) forwarded to the Claude API. No PII beyond user-authored free text. See Section 10 |

---

## 3. Data Collection and Acquisition

### 3.1 Automated ETL Scripts

`uv run python -m app.scripts` runs the full ETL pipeline (excluding S3 sync and census import) in order:

| Step | Script | Action |
|------|--------|--------|
| 1 | `app.scripts.extract` | ABS Excel → `app/data/victoria_population_table.csv` |
| 2 | `app.scripts.load_population_records` | CSV → `suburb_demographics` |
| 3 | `app.scripts.load_melbourne_suburbs` | Australian postcodes CSV → `suburbs` |
| 4 | `app.scripts.seed_static_reference_data` | Upsert `topics` and `arcs` by slug (idempotent) |

S3 sync runs separately:

| Step | Script | Action |
|------|--------|--------|
| 5 | `app.scripts.sync_s3_content` | MD5 diff → upload new/changed guide JSON to `guides-content/` on S3 |

Census data runs separately:

| Step | Script | Action |
|------|--------|--------|
| 6 | `app.scripts.load_census_suburb_data` | ABS Census median rent and overseas-born % → `suburb_demographics` new columns |

### 3.2 Live Data at Request Time

| Service | Endpoint | Trigger | Caching |
|---------|----------|---------|---------|
| SerpAPI `google_maps` | `GET /api/nearby-interest` | Per-request | None |
| SerpAPI `google_events` | `GET /api/nearby-events` | Per-request | None |
| PTV Timetable API | `GET /api/ptv/stops-nearby`, `GET /api/ptv/departures` | Per-request | 60 s in-memory |
| City of Melbourne Open Data | `GET /api/community-venues` | Per suburb | 24 h in-memory per suburb key |
| Claude API | `POST /api/journey/identity`, `POST /api/journey/memory`, `POST /api/llm/journey-plan`, `POST /api/llm/greeting`, `POST /api/llm/arc-receipt` | Per-request (user-initiated) | Prompt cache (system prompt + guide catalog); no response caching |

### 3.3 Guide Content Authoring

Guide JSON files follow the schema in Section 7. `tables`, `videos`, and `keyTerms` fields are optional. YouTube video IDs are verified before commit. The `sync_s3_content.py` script keeps the S3 bucket in sync after any content change.

### 3.4 Static Asset Generation (Geodata)

GeoJSON files are regenerated by running:

```bash
node app/scripts/fetch-geodata.mjs
```

This fetches from Overpass API, simplifies geometry, and writes to `public/geodata/`. Files are committed to source control and served statically by Next.js — not re-fetched at runtime.

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

### 4.2 Database Connection

```
postgresql://user:password@host/dbname?sslmode=require
```

Managed via SQLAlchemy engine (`app/database.py`), dependency-injected into FastAPI route handlers.

### 4.3 AWS S3 Configuration

| Variable | Purpose |
|----------|---------|
| `AWS_S3_BUCKET_NAME` | Target bucket name |
| `AWS_DEFAULT_REGION` | Region (`ap-southeast-2`) |
| `AWS_ACCESS_KEY_ID` | AWS credentials |
| `AWS_SECRET_ACCESS_KEY` | AWS credentials |

### 4.4 Claude API Configuration

| Variable | Purpose |
|----------|---------|
| `ANTHROPIC_API_KEY` | Authenticates all Claude API calls in `app/services/journey_service.py` and LLM router |

### 4.5 MapTiler Configuration

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_MAPTILER_KEY` | MapTiler API key used by MapLibre GL JS in the browser |

> `NEXT_PUBLIC_MAPTILER_KEY` is exposed to the browser by Next.js convention. The key must be domain-restricted in the MapTiler dashboard to prevent unauthorised use.

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

### 5.2 Table Descriptions

#### `topics`
Stores the five unified content topics shared across Guides and Near Me. `slug` is the canonical identifier used in URL routing, deep-links, and localStorage keys. `is_active` allows a topic to be deactivated without deletion.

#### `arcs`
Stores the three time-based guide arcs. `timeframe_label` provides the human-readable stage label displayed in the UI (e.g. "Week 1", "Month 1", "Month 3").

#### `guides`
ORM model for guide metadata. Guide content is served statically from `public/guides-content/`; this table is designed to support a future database-backed content management workflow. `next_guide_id` is a self-referencing foreign key driving the "Up next" chain within an arc. `near_me_deeplink` stores the pre-formatted URL for the Bridge CTA.

#### `guide_sections`
ORM model for the six narrative sections of each guide. `section_key` is an enum: `moment`, `feeling`, `reveal`, `how-it-works`, `bridge`, `next-chapter`. `section_order` enforces the prescribed display sequence.

#### `suburbs`
Suburb master records covering Greater Melbourne. `sa2_code` links to `suburb_demographics`. `lat`/`lng` are used for map centring and Near Me queries.

#### `suburb_demographics`
ABS ERP data at the SA2 level, extended with ABS Census rent and overseas-born figures. `median_weekly_rent` and `overseas_born_pct` are nullable until the census ETL script is run. Aggregated by `GET /api/population` via case-insensitive substring match against SA2, SA3, SA4, and GCCSA name columns. Required by `GET /api/suburb/livability`.

---

## 6. Client-Side Data Model (localStorage)

All user personalisation lives in the browser under the `minuri:` namespace. No data is transmitted to any server except the fields explicitly documented in Section 10.1.

### 6.1 Key Registry

| Key | Owner Epic | TypeScript Shape | Storage | Lifetime |
|-----|-----------|-----------------|---------|---------|
| `minuri:suburb` | Landing | `string` | localStorage | Persistent |
| `minuri:lifeMoment` | Landing | `"just-arrived" \| "getting-set-up" \| "finding-people"` | localStorage | Persistent |
| `minuri:topicFrequency` | Landing | `Record<TopicSlug, number>` | localStorage | Persistent |
| `minuri:arcProgress` | Guides | `Record<ArcSlug, number>` | localStorage | Persistent |
| `minuri:readGuides` | Guides | `string[]` | localStorage | Persistent |
| `minuri:bookmarks` | Guides | `{guideSlug: string, sectionKey: string}[]` | localStorage | Persistent |
| `minuri:savedLocations` | Near Me | `SavedLocation[]` (see 6.2) | localStorage | Persistent |
| `minuri:hub:dismissed` | Landing | `boolean` | sessionStorage | Per-session |
| `minuri:journey:v2` | Journey | `LLMJourneyPlan` (see 6.3) | localStorage | Persistent |
| `minuri:journey:identity:v1` | Journey | `IdentityStore` (see 6.4) | localStorage | Persistent |
| `minuri:llm:greeting` | Journey | `string` | sessionStorage | Per-session |
| `minuri:arcReceipt:<arc-slug>` | Journey | `string` (receipt text) | localStorage | Persistent |
| `minuri:guide:steps:<slug>` | Guides | `number` (bitmask, up to 30 steps) | localStorage | Persistent |
| `minuri:guide:quicktake:<slug>` | Guides | `boolean` (collapsed state) | localStorage | Persistent |
| `minuri:suburb:livability` | Near Me / Journey | `Record<suburbName, SuburbLivability>` with `fetchedAt` TTL | localStorage | 7-day TTL |

### 6.2 SavedLocation Shape

```typescript
interface SavedLocation {
  placeId: string      // SerpAPI place_id
  name: string
  topic: TopicSlug
  address: string
  lat: number | null
  lng: number | null
}
```

Maximum 20 entries, deduplicated by `placeId`.

### 6.3 LLMJourneyPlan Shape (`minuri:journey:v2`)

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
  generatedAt: string    // ISO 8601
  fallback: boolean      // true if LLM timed out and static plan was used
  arc: ArcSlug
  suburb: string
  vibeColor: VibeColor
  days: LLMDay[]         // 7 entries
}
```

### 6.4 IdentityStore Shape (`minuri:journey:identity:v1`)

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
  saturation: number         // 0–100; drives greyscale → colour progression
  titleTier: 0 | 1 | 2 | 3
  stampsEarned: string[]
  memoryLines: string[]      // one per completed day, from /api/journey/memory
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

### 6.5 SuburbLivability Shape (`minuri:suburb:livability`)

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

### 6.6 Guide Step Bitmask (`minuri:guide:steps:<slug>`)

Each guide step maps to a bit position. A single integer encodes up to 30 steps. The `useGuideSteps` hook reads and writes this value:

```typescript
// Check if step N is done
const isDone = (bitmask >> stepIndex) & 1

// Mark step N done
const updated = bitmask | (1 << stepIndex)
```

### 6.7 localStorage Privacy Guarantee

All data under `minuri:` lives exclusively on the user's device except where the user explicitly initiates a Journey Plan — see Section 10.1 for which fields are forwarded to the Claude API.

Users can export their full state as a JSON download or clear it entirely via the hub footer controls.

---

## 7. Guide Content Schema (Static JSON)

Each guide is a JSON file at `public/guides-content/<topic-slug>/<guide-slug>.json`.

### 7.1 Guide Object

| Field | Type | Constraint |
|-------|------|-----------|
| `id` | `number` | Unique across all guides |
| `slug` | `string` | Kebab-case; matches filename |
| `title` | `string` | Required |
| `summary` | `string` | 1–3 sentences; used as card fallback |
| `arc` | `"day-1" \| "week-1" \| "month-1"` | Must match an arc slug in the database |
| `arcOrder` | `number` | Unique within topic + arc combination |
| `topic` | `TopicSlug` | One of the five unified topic slugs |
| `readingTimeMin` | `number` | Integer 2–15 |
| `isPublished` | `boolean` | Controls draft vs live state |
| `isFeatured` | `boolean` | Max 1–2 per topic |
| `markdownPath` | `string` | Self-referential path for tooling |
| `nextGuideSlug` | `string \| null` | Must exist in guide catalog or be null |
| `searchTerms` | `string[]` | At least 3 keywords |
| `sourceLinks` | `{label: string, href: string}[]` | Can be empty; hrefs must be real, verified URLs |
| `thumbnailUrl` | `string` | Required |
| `nearMeDeeplink` | `string` | Format: `/near-me?topic=<slug>&from=<guide-slug>` |
| `sections` | `Section[]` | Exactly 6 objects in prescribed order |
| `tables` | `GuideDataTable[]` | Optional; zero or more data tables referenced from section body |
| `videos` | `GuideYouTubeEmbed[]` | Optional; zero or more YouTube video embeds |
| `keyTerms` | `GuideKeyTerm[]` | Optional; zero or more glossary terms |

### 7.2 Sub-Types

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

### 7.3 Section Object

| Field | Type | Constraint |
|-------|------|-----------|
| `sectionKey` | `"moment" \| "feeling" \| "reveal" \| "how-it-works" \| "bridge" \| "next-chapter"` | Required; must appear in this exact order |
| `title` | `string` | Display name for the section heading |
| `value` | `string` | Markdown-formatted body content |

### 7.4 Guide Catalog

| ID | Arc | Arc Order | Topic | Slug |
|----|-----|-----------|-------|------|
| 1 | day-1 | 1 | food-eating | `your-first-grocery-run` |
| 2 | month-1 | 1 | food-eating | `cheap-eats-when-broke` |
| 3 | day-1 | 2 | getting-around | `getting-myki-and-surviving-ptv` |
| 4 | day-1 | 3 | health-wellbeing | `finding-a-gp-before-you-need-one` |
| 5 | day-1 | 4 | health-wellbeing | `crisis-lines-you-can-actually-call` |
| 6 | month-1 | 2 | home-admin | `renting-without-getting-burned` |
| 7 | week-1 | 4 | health-wellbeing | `medicare-bulk-billing-and-mental-health-care-plans` |
| 8 | week-1 | 3 | home-admin | `budgeting-on-what-you-actually-earn` |
| 9 | week-1 | 2 | home-admin | `setting-up-utilities-without-overpaying` |
| 10 | week-1 | 1 | food-eating | `cooking-5-meals-youll-actually-eat` |
| 11 | week-1 | 7 | social-belonging | `making-friends-in-a-city-where-everyones-busy` |
| 12 | month-1 | 5 | social-belonging | `homesickness-nobody-warns-you-about` |
| 13 | month-1 | 4 | social-belonging | `finding-your-community` |
| 14 | month-1 | 6 | health-wellbeing | `when-to-see-a-psych-counsellor-or-friend` |
| 15 | month-1 | 3 | getting-around | `building-a-local-routine` |
| 16 | week-1 | 5 | health-wellbeing | `managing-your-prescriptions-in-a-new-city` |
| 17 | month-1 | 7 | health-wellbeing | `sustaining-yourself-sleep-movement-and-disconnecting` |
| 18 | day-1 | 5 | home-admin | `your-first-48-hours-checklist` |
| 19 | day-1 | 6 | social-belonging | `when-you-dont-know-anyone-yet` |
| 20 | week-1 | 6 | getting-around | `finding-your-way-around-melbourne-in-week-one` |

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
        S7[load_census_suburb_data.py\nABS Census → DB]
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
        SV7[suburb_livability_service.py]
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
        R14[GET /api/suburb/livability]
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
| `app.scripts.extract` | ABS Excel file | `app/data/victoria_population_table.csv` | Yes — overwrites CSV |
| `app.scripts.load_population_records` | `victoria_population_table.csv` | `suburb_demographics` rows | Drops + recreates when run via `__main__` |
| `app.scripts.load_melbourne_suburbs` | Australian postcodes CSV | `suburbs` rows | Drops + recreates when run via `__main__` |
| `app.scripts.seed_static_reference_data` | Hardcoded Python constants | `topics` and `arcs` rows | Yes — upserts by slug |
| `app.scripts.sync_s3_content` | `app/s3/` local files | AWS S3 `guides-content/` prefix | Yes — MD5 hash comparison |
| `app.scripts.load_census_suburb_data` | ABS Census tables | `suburb_demographics.median_weekly_rent`, `.overseas_born_pct` | Yes — upserts by `sa2_code` |

### 8.3 Database Reset Behaviour

Running `python -m app.scripts` drops and recreates all tables defined on the SQLAlchemy `Base` before executing ETL steps. This is destructive and intended for development resets only. In production, individual scripts should be run selectively to avoid data loss.

### 8.4 Request Lifecycle

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

| Endpoint | Method | Auth | Returns |
|----------|--------|------|---------|
| `/` | GET | None | `{"message": "Root endpoint"}` |
| `/suburb` | GET | None | Suburb records with optional SA3 filter |
| `/suburb/larger-region` | GET | None | Distinct SA3 names |
| `/api/population` | GET | None | ABS ERP aggregate for a location |
| `/api/nearby-interest` | GET | None (key server-side) | SerpAPI place results |
| `/api/nearby-events` | GET | None (key server-side) | SerpAPI event results |
| `/api/community-venues` | GET | None (key server-side) | CoM Open Data venue list |
| `/api/ptv/stops-nearby` | GET | None (key server-side) | PTV stops within radius of coordinates |
| `/api/ptv/departures` | GET | None (key server-side) | Next 3 departures for a stop ID |
| `/api/journey/identity` | POST | None | Streaming `JourneyIdentity` (Claude Sonnet 4.6) |
| `/api/journey/memory` | POST | None | `{memory_line: string}` (Claude Haiku) |
| `/api/llm/journey-plan` | POST | None | `LLMJourneyPlan` (Claude Sonnet 4.6, prompt-cached) |
| `/api/llm/greeting` | POST | None | `{greeting: string}` (Claude Haiku) |
| `/api/llm/arc-receipt` | POST | None | `{receipt: string}` (Claude Haiku) |
| `/api/suburb/livability` | GET | None | `SuburbLivability` (Claude Haiku + SerpAPI + PTV + DB) |

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

Response: streams `JourneyIdentity` JSON (Section 6.4). Fallback on 8 s timeout: deterministic identity derived from archetype lookup table.

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

Prompt structure: cached system prompt + static guide catalog (`cache_control: ephemeral`) + user message. Response: `LLMJourneyPlan` (Section 6.3). Fallback: static archetype-to-guide mapping with `fallback: true`.

### 9.6 Nearby Interest Endpoint

**GET `/api/nearby-interest`**

| Param | Required | Notes |
|-------|----------|-------|
| `suburb` | Yes | Passed into SerpAPI query as `… near {suburb}` |
| `topic` | No | One of five topic slugs |
| `subtype` | No | Narrows the query; see `QUERY_MAP` in `app/services/near_me.py` |

Supported `(topic, subtype)` pairs:

| Topic | Subtype |
|-------|---------|
| `food-eating` | `food-dining`, `groceries` |
| `getting-around` | `public-transit`, `cycling` |
| `health-wellbeing` | `gp-clinics`, `mental-health` |
| `home-admin` | `services`, `libraries` |
| `social-belonging` | `community-spaces`, `social-venues` |

Errors: `400` invalid topic, `502` SerpAPI failure.

### 9.7 Nearby Events Endpoint

**GET `/api/nearby-events`**

| Param | Required | Default | Notes |
|-------|----------|---------|-------|
| `suburb` | Yes | — | Used in query: `social community events {suburb} Melbourne` |
| `date_filter` | No | `week` | `today`, `week`, `next_month` |

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

Thumbnails proxied through `wsrv.nl` to `800×600`. Errors: `400` invalid `date_filter`, `502` SerpAPI failure.

### 9.8 Community Venues Endpoint

**GET `/api/community-venues`**

| Param | Required | Notes |
|-------|----------|-------|
| `suburb` | Yes | Filters by suburb from City of Melbourne Open Data |

Response: `{ "suburb": "...", "venues": [{ "name", "type", "address", "lat", "lng", "website" }] }`. Cached 24 h per suburb. Errors: `502` if CoM Open Data unavailable.

### 9.9 Population Endpoint

**GET `/api/population`**

| Param | Required | Notes |
|-------|----------|-------|
| `location` | Yes | Case-insensitive substring match against SA2/SA3/SA4/GCCSA names |

Response: `{ "population": 142300, "location": "Melbourne", "year": "2025" }`. Population is the sum of `erp_2025` across all matching `suburb_demographics` rows.

### 9.10 Cross-Epic Deep-Link URL Contract

| Destination | Parameter | Produced by | Consumed by |
|-------------|-----------|------------|-------------|
| `/near-me?topic=<slug>` | `topic` | Life-moment tile; BridgeCTA; Journey inline near-me | Near Me tab strip pre-selection |
| `/near-me?from=<guide-slug>` | `from` | BridgeCTA component | GuideContextBanner |
| `/guides?topic=<slug>` | `topic` | Life-moment tile; Hub topic cards | Guide library filter pre-selection |
| `/guides/:arc/:slug?suburb=<suburb>` | `suburb` | Journey "Read guide →" link | Guide page suburb-aware Near Me suggestions |
| `/guides/:arc/:slug?from=journey` | `from` | Journey "Read guide →" link | Guide page back-link to `/journey/plan` |

---

## 10. Data Security and Privacy

### 10.1 Personal Data Inventory

| Data element | Source | Contains PII? | Storage | Forwarded to third party? |
|-------------|--------|--------------|---------|--------------------------|
| Suburb name | User input | No | localStorage; sent as API query param | Sent to SerpAPI, PTV, Claude API as part of queries |
| Life-moment selection | User input | No | localStorage only | No |
| Guide read history | User behaviour | No | localStorage only | No |
| Saved Near Me places | User interaction | No | localStorage only | No |
| Journey moment text | User input (free text) | **Potentially sensitive** | localStorage; forwarded to Claude API when user initiates journey | **Yes — forwarded to Anthropic Claude API** |
| Selected topics | User input | No | localStorage; forwarded to Claude API as part of journey | Yes — forwarded to Anthropic Claude API |
| ABS population / census data | ABS | No — aggregate statistics | PostgreSQL | No |
| SerpAPI results | SerpAPI | No — describes businesses/events | Not persisted; in-memory only | N/A |
| PTV stop / departure data | PTV | No — public transport infrastructure | Not persisted; in-memory 60 s | N/A |
| CoM venue data | City of Melbourne | No — public institutions | Not persisted; in-memory 24 h | N/A |
| MapTiler tile requests | MapTiler CDN | No — generic tile coordinates | Not persisted | Yes — tile request sent to MapTiler CDN |

**Claude API disclosure:** When a user submits the journey onboarding form, the following fields are transmitted to the Anthropic Claude API: (1) suburb name, (2) `your_moment` free text, (3) selected topic slugs. No other user data is sent. Anthropic's data handling is governed by the Anthropic API Terms of Service. The team does not log or store these request payloads server-side.

### 10.2 API Key Management

| Key | Storage | Used by |
|-----|---------|---------|
| `SERPAPI_API_KEY` | `.env` / process env | `app/services/near_me.py` |
| `ANTHROPIC_API_KEY` | `.env` / process env | `app/services/journey_service.py` and LLM router |
| `NEXT_PUBLIC_MAPTILER_KEY` | `.env.local` / Vercel env | Browser (MapLibre GL JS) — must be domain-restricted in MapTiler dashboard |
| PTV developer key | `.env` / process env | `app/services/ptv_service.py` |
| `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` | `.env` / process env | `app/scripts/sync_s3_content.py` only |

The `.env` file is listed in `.gitignore`. No secrets appear in the codebase or git history.

### 10.3 Client-Side Data Transparency

The hub footer displays:

> *"Your journey stays on this device. Minuri never sees it."*

When a user generates a Journey Plan, a disclosure notice is shown before submission: *"Your suburb, your moment description, and your selected topics are sent to our AI to create your identity. This data is not stored by Minuri after your card is created."* Users may use preset moment options to avoid free-text disclosure entirely.

Users are provided two controls:
- **Export your journey** — downloads a JSON file containing all `minuri:` localStorage keys.
- **Clear my journey** — deletes all `minuri:` localStorage and sessionStorage keys after a confirmation modal.

### 10.4 HTTPS and Transport Security

All API calls between the Next.js frontend and the FastAPI backend use HTTPS in production. The PostgreSQL connection string includes `?sslmode=require`. Claude API calls use HTTPS via `httpx`. MapTiler tile requests use HTTPS via the MapLibre GL JS client.

### 10.5 LLM Output Safety

Journey identity and memory outputs are validated against Pydantic schemas before forwarding to the client. On parse failure or timeout the deterministic fallback path is used; raw LLM output is never passed directly to the client.

Input sanitization before forwarding to the Claude API:
- `suburb`: `{}` characters stripped to prevent prompt injection.
- `your_moment`: C0 control characters (U+0000–U+001F) sanitized.
- `selected_topics`: validated against the canonical slug list; unknown slugs rejected with HTTP 400.

### 10.6 Security Headers

All responses pass through a security headers middleware that injects:

| Header | Value |
|--------|-------|
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `X-XSS-Protection` | `0` |

CORS allows only the production frontend origins (`minuri-amber.vercel.app`, `www.minuri.tech`). API docs (`/docs`, `/redoc`, `/openapi.json`) are disabled in production (`ENVIRONMENT` defaults to `"production"`).

---

## 11. Data Quality and Validation

### 11.1 Database Integrity

| Constraint | Mechanism |
|-----------|-----------|
| `slug` uniqueness on `topics`, `arcs`, `guides`, `suburbs` | Unique key constraint enforced at the database level via SQLAlchemy column definitions |
| Foreign key consistency (`guides.arc_id`, `guides.topic_id`, `guides.next_guide_id`) | SQLAlchemy ForeignKey; `next_guide_id` is nullable (last guide in arc) |
| SA2 code linkage between `suburbs` and `suburb_demographics` | Soft string match; referential integrity maintained by ETL order |
| `median_weekly_rent` and `overseas_born_pct` | Nullable; null until `load_census_suburb_data` is run |

### 11.2 Guide Content Validation

Before a guide JSON file is committed, authors verify:

1. All required fields are present and correctly typed.
2. `sections` contains exactly 6 objects in prescribed order.
3. `nextGuideSlug` either matches a slug in the catalog or is `null`.
4. `nearMeDeeplink` follows the format `/near-me?topic=<slug>&from=<guide-slug>`.
5. `sourceLinks` hrefs are real, publicly accessible URLs.
6. `arc` and `topic` values match the canonical slug lists in Section 2.8.
7. YouTube video IDs in `videos` are verified as publicly accessible.
8. `tables` rows have consistent column counts matching `headers`.

### 11.3 LLM Response Validation

All Claude API responses are validated against Pydantic schemas before being returned to the client. Validation failures trigger the deterministic fallback path. The fallback does not call the Claude API.

### 11.4 SerpAPI Response Handling

`gps_coordinates`, `phone`, `website`, and `service_options` are treated as optional for place results. `venue`, `date.when`, and `thumbnail` are optional for event results; missing thumbnails are omitted rather than returning a broken URL. HTTP 502 is returned to the client on any SerpAPI error.

### 11.5 Prompt Cache Validity

The Claude API prompt cache stores the system prompt and guide catalog with a 5-minute inactivity TTL. When the guide catalog is updated, the new version is automatically warmed on the next request.

### 11.6 localStorage Data Integrity

All `localStorage.getItem()` calls are wrapped in `try/catch` to handle JSON parse errors, storage quota exceeded, and browsers with localStorage disabled. In the event of a read error, hooks return their default empty state rather than crashing. Additional key-level validation:

- `minuri:journey:v2`: validated on read against `LLMJourneyPlan` schema; malformed data triggers fresh plan generation.
- `minuri:guide:steps:<slug>`: non-integer values treated as 0 (no steps complete).
- `minuri:suburb:livability`: `fetchedAt` compared to current time; entries older than 7 days are discarded and re-fetched.

---

## 12. Ethical Considerations

### 12.1 Sensitive Content and Vulnerable Users

Minuri's target audience includes young adults experiencing social isolation, financial stress, mental health challenges, and displacement anxiety.

**Journey moment text:** The `your_moment` free-text field is forwarded to the Anthropic Claude API to generate a personalised identity. Users who disclose sensitive information (e.g. mental health struggles, financial hardship) should be aware their text leaves their device. The onboarding screen displays a clear disclosure notice before submission. Users may use preset moment options to avoid free-text disclosure entirely.

**Mental health content:** The Health & Wellbeing topic includes guides on bulk-billing GPs, mental health care plans, and crisis lines. Crisis line phone numbers (Lifeline, Beyond Blue) are sourced from verified public directories and pinned at the top of the Health tab regardless of scroll position. The team verifies the accuracy of these numbers before each release.

### 12.2 Data Minimisation

- Claude API calls include only the minimum fields required: suburb, moment text, selected topics. No device identifiers, session tokens, or user behaviour history are sent.
- Community venue and events queries send only the suburb name — no coordinates or user identifiers.
- MapTiler tile requests contain no user data; they are keyed only to the visible map region.
- The `minuri:topicFrequency` counter records counts by topic slug only — no timestamps, session data, or click paths.
- No user account, email address, or authentication token is ever requested.

### 12.3 LLM Output Responsibility

LLM-generated content (identity archetypes, letter bodies, mantras) may contain unexpected outputs. Safeguards:
- Schema validation rejects responses that do not conform to the expected structure.
- Archetype values are constrained to a closed set of four valid keys.
- No LLM output is stored server-side.
- Users can regenerate their journey plan at any time; previous state is overwritten in localStorage.

### 12.4 Data Attribution

| Source | Licence | Attribution requirement |
|--------|---------|------------------------|
| ABS Regional Population | CC BY 4.0 | Attribution in `GET /api/population` response context and landing statistics widget |
| ABS Census | CC BY 4.0 | Attribution in suburb livability display |
| City of Melbourne Open Data | CC BY 4.0 | Attribution in Near Me venue cards footer |
| OpenStreetMap | ODbL | Attribution in map overlay footer |

### 12.5 User Control

Users retain full control over their data:
- The Export function produces a JSON download of all localStorage state.
- The Clear function wipes all `minuri:` keys immediately after a confirmation modal.
- Clearing browser storage or browsing in private mode resets the experience to first-visit state.

### 12.6 No Dark Patterns

The hub sidebar auto-opens on return visits to surface personalised content, but respects user dismissal: a single close (X, ESC, or swipe-down) suppresses auto-open for the remainder of the session via `minuri:hub:dismissed` in sessionStorage. The next visit resets this preference. No re-engagement notifications, push alerts, or email capture are used.

---

*Minuri · Data Management Plan · TP39 · 2026-05-25*
*Still feeling home, wherever you are.*
