# Minuri — Iteration 2 Data Management Plan

**Unit:** FIT5120 Industry Experience Studio
**Team:** TP39
**Version:** 1.0
**Date:** 2026-05-05
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
13. [Changes from Iteration 1](#13-changes-from-iteration-1)

---

## 1. Overview

### 1.1 Purpose of This Document

This Data Management Plan (DMP) documents how data is collected, stored, processed, used, and protected within the Minuri application during Iteration 2. It covers all data sources — external APIs, static datasets, a cloud-hosted relational database, a cloud object store, and client-side browser storage — and specifies responsibilities, schemas, and governance for each.

### 1.2 Product Summary

Minuri is a web application that helps young adults settle into independent life in Melbourne. It provides four interconnected features: a personalised Landing hub, a narrative First-Time Guides library, a Near Me location discovery tool, and a personalised Journey plan. All four features share a unified five-topic taxonomy: Food & Eating, Getting Around, Health & Wellbeing, Home & Admin, and Social & Belonging.

### 1.3 Iteration 2 Data Scope

Iteration 1 established the backend data foundation: suburb master data, ABS population demographics, SerpAPI live results, and a PostgreSQL database hosted on Neon. Iteration 2 expands this in four ways:

| Dimension | Iteration 1 | Iteration 2 |
|-----------|------------|------------|
| Guide content storage | Flat 15-guide structure; no persistence layer | 20+ guides as static JSON in `public/guides-content/`; mirrored to AWS S3 |
| Reference data | Not persisted | Topics and Arcs seeded into PostgreSQL |
| Guide/Section ORM | Not defined | ORM models defined for `guides` and `guide_sections` (future use) |
| Client-side state | sessionStorage only (lost on tab close) | Comprehensive localStorage model under `minuri:` namespace; sessionStorage retained only for ephemeral dismiss flags |
| External APIs | SerpAPI only | SerpAPI + PTV Timetable API (new); ABS data unchanged |

---

## 2. Data Sources

Minuri Iteration 2 draws on six distinct data sources. Each is described below by category, origin, update frequency, and licensing.

### 2.1 Australian Postcodes — Suburb Master Data

| Attribute | Detail |
|-----------|--------|
| **Source** | matthewproctor/australianpostcodes on GitHub |
| **URL** | `https://raw.githubusercontent.com/matthewproctor/australianpostcodes/master/australian_postcodes.csv` |
| **Format** | CSV |
| **Update frequency** | Fetched at ETL time (not scheduled); dataset is periodically updated by the upstream maintainer |
| **Licence** | Open (no commercial restriction stated by the repository) |
| **Fields used** | `locality`, `postcode`, `state`, `lat`, `long`, `sa2_code`, `sa3_name`, `sa4` |
| **Filtering applied** | Filtered to Victoria suburbs with SA4 codes 206–214 (Greater Melbourne) |
| **Loaded into** | `suburbs` table in PostgreSQL |

### 2.2 ABS Regional Population — Victoria

| Attribute | Detail |
|-----------|--------|
| **Source** | Australian Bureau of Statistics |
| **URL** | ABS Regional Population release, Table 2, 2024–25 |
| **Format** | Excel (.xlsx), converted to CSV by `app/scripts/extract.py` |
| **Update frequency** | Annual ABS release; manual re-import required when new data is published |
| **Licence** | Creative Commons Attribution 4.0 (CC BY 4.0) — requires attribution to ABS |
| **Fields used** | SA2/SA3/SA4/GCCSA name and code, ERP 2024, ERP 2025, change count, change %, area km², population density 2025 |
| **Loaded into** | `suburb_demographics` table in PostgreSQL |

### 2.3 SerpAPI — Live Nearby Place Search

| Attribute | Detail |
|-----------|--------|
| **Source** | SerpAPI Google Maps engine (`google_maps`) |
| **URL** | `https://serpapi.com/` |
| **Format** | JSON (live, per-request) |
| **Update frequency** | Real-time; called at request time, not persisted |
| **Licence** | Commercial API — covered by the team's SerpAPI subscription |
| **Fields returned** | `title`, `rating`, `reviews`, `address`, `type`, `price`, `open_state`, `description`, `thumbnail`, `place_id`, `gps_coordinates`, `phone`, `website`, `service_options` |
| **Loaded into** | Not stored in the database; served directly to the client from `GET /api/nearby-interest` |
| **Privacy note** | Results describe businesses, not individuals. No personal data is transmitted to or from SerpAPI beyond the suburb query string |

### 2.4 PTV Timetable API — Public Transport Victoria (New in Iteration 2)

| Attribute | Detail |
|-----------|--------|
| **Source** | Public Transport Victoria (PTV) Developer API |
| **URL** | `https://timetableapi.ptv.vic.gov.au/` |
| **Format** | JSON (live, per-request) |
| **Update frequency** | Real-time; departure data is fetched at request time |
| **Licence** | PTV Developer API Terms of Service — key obtained via email request to PTV |
| **Fields used** | Stop ID, stop name, stop latitude/longitude, route type; departures (scheduled time, estimated time, route number, direction) |
| **Loaded into** | Not persisted; proxied through the backend at `/api/ptv/stops-nearby` and `/api/ptv/departures`. Backend caches responses for 60 seconds to reduce API call volume |
| **Privacy note** | No personal data transmitted. Query parameters are coordinates (bounding box around suburb) and stop IDs only |
| **Degradation policy** | If PTV API is unavailable, the Getting Around tab degrades to a static suburb-centre view with an error message on stop popups |

### 2.5 Guide Content — Authored Static JSON (New in Iteration 2)

| Attribute | Detail |
|-----------|--------|
| **Source** | Authored by the TP39 team |
| **Location** | `public/guides-content/<topic-slug>/<guide-slug>.json` (frontend); mirrored to `app/s3/guides-content/` (backend) and synced to AWS S3 |
| **Format** | JSON |
| **Update frequency** | Updated by team during the iteration; synced to S3 via `app/scripts/sync_s3_content.py` |
| **Licence** | Owned by TP39 — authored content, no third-party restrictions |
| **Fields** | See Section 7 for the full guide JSON schema |
| **Loaded into** | Served statically from `public/` by Next.js; optionally fetched from S3 if the frontend switches to a remote content fetch model |

### 2.6 Static Reference Data — Topics and Arcs (New in Iteration 2)

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

---

## 3. Data Collection and Acquisition

### 3.1 Automated ETL Scripts

The backend includes a set of Python scripts under `app/scripts/` that import and prepare all server-side data. Running `uv run python -m app.scripts` executes the full ETL pipeline (excluding S3 sync) in the following sequence:

| Step | Script | Action |
|------|--------|--------|
| 1 | `app.scripts.extract` | Downloads the ABS Excel file and converts it to `app/data/victoria_population_table.csv` |
| 2 | `app.scripts.load_population_records` | Reads the CSV and inserts/updates rows in `suburb_demographics` |
| 3 | `app.scripts.load_melbourne_suburbs` | Fetches the Australian postcodes CSV, filters to Greater Melbourne (SA4 206–214), and upserts rows into `suburbs` |
| 4 | `app.scripts.seed_static_reference_data` | Upserts the 5 topic records and 3 arc records by slug (idempotent — safe to run repeatedly) |

S3 sync runs separately:

| Step | Script | Action |
|------|--------|--------|
| 5 | `app.scripts.sync_s3_content` | Walks `app/s3/` recursively, compares MD5 hashes against S3 ETags, and uploads new or changed files to `guides-content/` prefix in the configured S3 bucket |

### 3.2 Live Data at Request Time

SerpAPI and PTV API calls are made at runtime, not during ETL. The backend proxies these requests to protect API keys:

- **SerpAPI** — called by `app/services/near_me.py` on every `GET /api/nearby-interest` request. The query string is constructed from the `suburb` + `topic` + `subtype` parameters using `QUERY_MAP` in the service file.
- **PTV API** — called by the Getting Around tab; requests are signed server-side using the developer key. Responses are cached for 60 seconds.

### 3.3 Guide Content Authoring

Guide JSON files are manually authored by the team following the narrative template defined in Section 7. Each file is placed at `public/guides-content/<topic-slug>/<guide-slug>.json`. Authors validate their JSON against the schema before committing. The `sync_s3_content.py` script keeps the S3 bucket in sync.

---

## 4. Data Storage Architecture

### 4.1 Storage Layer Summary

| Store | Technology | What is stored | Location |
|-------|-----------|---------------|----------|
| Relational database | PostgreSQL via Neon (cloud-hosted) | Suburb master data, suburb demographics, topic and arc reference data, guide and guide_section ORM models (future) | Neon cloud (ap-southeast-2 equivalent) |
| Object storage | AWS S3 | Guide content JSON files under `guides-content/` prefix | AWS ap-southeast-2 bucket |
| Static file serving | Next.js `public/` directory | Guide content JSON files served directly to the browser | CDN / Vercel edge |
| Client-side | Browser localStorage | User personalisation state: suburb, life moment, arc progress, read history, bookmarks, saved locations, journey state | User's device only |
| Client-side (ephemeral) | Browser sessionStorage | Per-session hub dismiss preference | User's device, cleared on tab/browser close |
| Intermediary CSV | File system (`app/data/`) | ABS population CSV generated by `extract.py` | Backend host, not committed to source control |

### 4.2 Database Connection

The PostgreSQL database is accessed via the `DB_CONNECTION` environment variable, which holds a full connection string in the format:

```
postgresql://user:password@host/dbname?sslmode=require
```

Connections are managed by SQLAlchemy's engine, configured in `app/database.py`. Sessions are dependency-injected into FastAPI route handlers.

### 4.3 AWS S3 Configuration

S3 access uses boto3's default credential chain. The following environment variables are required for the sync script:

| Variable | Purpose |
|----------|---------|
| `AWS_S3_BUCKET_NAME` | Target bucket name |
| `AWS_DEFAULT_REGION` | Region (e.g. `ap-southeast-2`) |
| `AWS_ACCESS_KEY_ID` | AWS access credentials |
| `AWS_SECRET_ACCESS_KEY` | AWS access credentials |

Guide files are uploaded under the `guides-content/` prefix, mirroring the directory structure of `app/s3/`.

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
    }
```

### 5.2 Table Descriptions

#### `topics`
Stores the five unified content topics shared across Guides and Near Me. The `slug` field is the canonical identifier used in URL routing, deep-links, and localStorage keys. `is_active` allows a topic to be deactivated without deletion.

#### `arcs`
Stores the three time-based guide arcs. The `timeframe_label` provides the human-readable stage label displayed in the UI (e.g. "Week 1", "Month 1", "Month 3").

#### `guides`
ORM model for guide metadata. In Iteration 2 this table is defined but guide content is served statically from `public/guides-content/`. The table is designed to support a future database-backed content management workflow. `next_guide_id` is a self-referencing foreign key that drives the "Up next" chain within an arc. `near_me_deeplink` stores the pre-formatted URL for the Bridge CTA.

#### `guide_sections`
ORM model for the six narrative sections of each guide. `section_key` is an enum: `moment`, `feeling`, `reveal`, `how-it-works`, `bridge`, `next-chapter`. `section_order` enforces the prescribed display sequence.

#### `suburbs`
Suburb master records covering Greater Melbourne. `sa2_code` links to `suburb_demographics` for population context. `lat`/`lng` are used for map centring and Near Me queries.

#### `suburb_demographics`
ABS ERP data at the SA2 level. Aggregated by `GET /api/population` via a case-insensitive substring match against SA2, SA3, SA4, and GCCSA name columns.

---

## 6. Client-Side Data Model (localStorage)

All user personalisation in Minuri is stored in the user's browser under the `minuri:` namespace. No data is sent to any server. The full state contract is documented here to prevent key collisions between epics and to support the export/import and clear features in the hub footer.

### 6.1 Key Registry

| Key | Owner Epic | TypeScript Shape | Storage | Lifetime |
|-----|-----------|-----------------|---------|---------|
| `minuri:suburb` | Landing | `string` | localStorage | Persistent |
| `minuri:lifeMoment` | Landing | `"just-arrived" \| "getting-set-up" \| "finding-people"` | localStorage | Persistent |
| `minuri:topicFrequency` | Landing | `Record<TopicSlug, number>` | localStorage | Persistent |
| `minuri:arcProgress` | Guides | `Record<ArcSlug, number>` | localStorage | Persistent |
| `minuri:readGuides` | Guides | `string[]` (guide slugs) | localStorage | Persistent |
| `minuri:bookmarks` | Guides | `{guideSlug: string, sectionKey: string}[]` | localStorage | Persistent |
| `minuri:savedLocations` | Near Me | `SavedLocation[]` (see below) | localStorage | Persistent |
| `minuri:hub:dismissed` | Landing | `boolean` | sessionStorage | Per-session |
| `minuri:journey:v1` | Journey | `{yourMoment, suburb, selectedTopics, alreadySorted}` | localStorage | Persistent (migrated from sessionStorage in Iteration 2) |
| `minuri:journey:completion` | Journey | `Record<dayNumber, {dayDone: boolean, taskDone: boolean}>` | localStorage | Persistent |
| `minuri:journey:sorted` | Journey | `string[]` ("already sorted" checked items) | localStorage | Persistent |

### 6.2 SavedLocation Shape

```typescript
interface SavedLocation {
  placeId: string;      // SerpAPI place_id
  name: string;
  topic: TopicSlug;
  address: string;
  lat: number | null;
  lng: number | null;
}
```

Maximum 20 entries, deduplicated by `placeId`.

### 6.3 Journey State Shape (`minuri:journey:v1`)

```typescript
interface JourneyState {
  yourMoment: string;           // Free text (min 30 chars) or preset value
  suburb: string;               // Confirmed suburb name from /suburb combobox
  selectedTopics: TopicSlug[];  // At least one topic
  alreadySorted: string[];      // Checked "already sorted" items
}
```

**Migration note:** In Iteration 1, `minuri:journey:v1` was stored in `sessionStorage` (cleared on tab close). Iteration 2 moves it to `localStorage`. On first read after the migration, if the key is absent from localStorage but present in sessionStorage, the value is migrated and the sessionStorage copy cleared.

### 6.4 localStorage Privacy Guarantee

All data under `minuri:` lives exclusively on the user's device. It is never transmitted to the Minuri server, SerpAPI, or any third party. The hub footer makes this explicit to the user: *"Your journey stays on this device. Minuri never sees it."*

Users can export their full journey state as a JSON download or clear it entirely via the hub footer controls.

---

## 7. Guide Content Schema (Static JSON)

Each guide is a JSON file at `public/guides-content/<topic-slug>/<guide-slug>.json`. The schema below is the authoritative contract for all 20 guides in Iteration 2.

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

### 7.2 Section Object

| Field | Type | Constraint |
|-------|------|-----------|
| `sectionKey` | `"moment" \| "feeling" \| "reveal" \| "how-it-works" \| "bridge" \| "next-chapter"` | Required; must appear in this exact order |
| `title` | `string` | Display name for the section heading |
| `value` | `string` | Markdown-formatted body content |

### 7.3 Full Guide Catalog (Iteration 2)

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
    A1[Australian Postcodes CSV<br/>GitHub source] --> S3[load_melbourne_suburbs.py]
    A2[ABS Victoria Population XLSX] --> S1[extract.py]
    S1 --> F1[app/data/victoria_population_table.csv]
    F1 --> S2[load_population_records.py]
    S4[seed_static_reference_data.py] --> DB[(PostgreSQL — Neon)]
    S3 --> DB
    S2 --> DB

    L1[app/s3/ local guide files] --> S5[sync_s3_content.py]
    S5 --> S3B[(AWS S3 — guides-content/)]

    RUN[python -m app.scripts<br/>ETL only — no S3 sync] --> S1
    RUN --> S2
    RUN --> S3
    RUN --> S4

    DB --> SV1[suburb_service.py]
    DB --> SV2[population_service.py]
    A3[SerpAPI — Google Maps] --> SV3[near_me.py]
    A4[PTV Timetable API] --> SV4[ptv_service.py]
    SV1 --> API[FastAPI app]
    SV2 --> API
    SV3 --> API
    SV4 --> API

    API --> R1[GET /suburb]
    API --> R2[GET /suburb/larger-region]
    API --> R3[GET /api/population]
    API --> R4[GET /api/nearby-interest]
    API --> R5[GET /api/ptv/stops-nearby]
    API --> R6[GET /api/ptv/departures]

    R1 --> U[Next.js Client]
    R2 --> U
    R3 --> U
    R4 --> U
    R5 --> U
    R6 --> U

    GJ[public/guides-content JSON] --> U
    U <--> LS[(Browser localStorage)]

    classDef source fill:#e3f2fd,stroke:#1e88e5,color:#0d47a1;
    classDef etl fill:#ede7f6,stroke:#5e35b1,color:#311b92;
    classDef db fill:#e8f5e9,stroke:#2e7d32,color:#1b5e20;
    classDef serve fill:#fff3e0,stroke:#ef6c00,color:#e65100;
    classDef client fill:#fce4ec,stroke:#c2185b,color:#880e4f;
    classDef runner fill:#f3e5f5,stroke:#8e24aa,color:#4a148c;

    class A1,A2,A3,A4,F1,L1,GJ source;
    class S1,S2,S3,S4,S5 etl;
    class DB,S3B,LS db;
    class SV1,SV2,SV3,SV4,R1,R2,R3,R4,R5,R6,API serve;
    class U client;
    class RUN runner;
```

### 8.2 ETL Script Reference

| Script | Input | Output | Idempotent? |
|--------|-------|--------|-------------|
| `app.scripts.extract` | ABS Excel file (downloaded from ABS URL) | `app/data/victoria_population_table.csv` | Yes — overwrites the CSV |
| `app.scripts.load_population_records` | `victoria_population_table.csv` | `suburb_demographics` rows | Drops and recreates table when run via `__main__` |
| `app.scripts.load_melbourne_suburbs` | Australian postcodes CSV (fetched from GitHub) | `suburbs` rows | Drops and recreates table when run via `__main__` |
| `app.scripts.seed_static_reference_data` | Hardcoded Python constants | `topics` and `arcs` rows | Yes — upserts by slug |
| `app.scripts.sync_s3_content` | `app/s3/` local files | AWS S3 `guides-content/` prefix | Yes — MD5 hash comparison; only uploads changed files |

### 8.3 Database Reset Behaviour

Running `python -m app.scripts` (the master runner) drops and recreates **all tables** defined on the SQLAlchemy `Base` before executing the ETL steps. This is destructive and intended for development resets only. In production or staging, individual scripts should be run selectively to avoid data loss.

---

## 9. API Endpoints and Data Flow

### 9.1 Current API Surface

| Endpoint | Method | Auth | Returns |
|----------|--------|------|---------|
| `/` | GET | None | `{"message": "Root endpoint"}` |
| `/api/nearby-interest` | GET | None (key server-side) | SerpAPI place results |
| `/api/population` | GET | None | ABS ERP aggregate for a location |
| `/suburb` | GET | None | Suburb records with optional SA3 filter |
| `/suburb/larger-region` | GET | None | Distinct SA3 names |
| `/api/ptv/stops-nearby` | GET | None (key server-side) | PTV stops within radius of coordinates |
| `/api/ptv/departures` | GET | None (key server-side) | Next 3 departures for a stop ID |

### 9.2 Nearby Interest — Query Parameters and Response

**Request:**
```
GET /api/nearby-interest?suburb=<suburb>&topic=<topic-slug>&subtype=<subtype>
```

| Parameter | Required | Values |
|-----------|----------|--------|
| `suburb` | Yes | Any suburb name string |
| `topic` | No | `food-eating`, `getting-around`, `health-wellbeing`, `home-admin`, `social-belonging` |
| `subtype` | No | Per-topic sub-filter key (see `QUERY_MAP` in `app/services/near_me.py`), or `all` |

**Supported topic/subtype pairs:**

| Topic | Subtype |
|-------|---------|
| `food-eating` | `food-dining`, `groceries` |
| `getting-around` | `public-transit`, `cycling` |
| `health-wellbeing` | `gp-clinics`, `mental-health` |
| `home-admin` | `services`, `libraries` |
| `social-belonging` | `community-spaces`, `social-venues` |

**Response:**
```json
{
  "suburb": "Fitzroy",
  "query": "bulk billing GP near Fitzroy",
  "results": [
    {
      "title": "...",
      "rating": 4.2,
      "reviews": 312,
      "address": "...",
      "type": "Medical clinic",
      "price": null,
      "open_state": "Open",
      "description": "...",
      "thumbnail": "https://...",
      "place_id": "...",
      "phone": "(03) 9123 4567",
      "website": "https://...",
      "service_options": ["Dine-in", "Takeaway"],
      "gps_coordinates": { "latitude": -37.79, "longitude": 144.97 }
    }
  ]
}
```

**Errors:** HTTP 400 for invalid topic; HTTP 502 if SerpAPI is unavailable.

### 9.3 Population Endpoint

```
GET /api/population?location=<string>
```

Performs a case-insensitive `ILIKE` substring match on `sa2_name`, `sa3_name`, `sa4_name`, and `gccsa_name` in `suburb_demographics`. Returns the sum of `erp_2025` across all matching rows.

**Response:**
```json
{ "population": 84300, "location": "Melbourne", "year": "2025" }
```

### 9.4 Cross-Epic Deep-Link URL Contract

All navigation between epics uses a shared URL parameter contract, documented here for completeness.

| Destination | Parameter | Produced by | Consumed by |
|-------------|-----------|------------|-------------|
| `/near-me?topic=<slug>` | `topic` | Life-moment tile; BridgeCTA component; Journey inline near-me | Near Me tab strip pre-selection |
| `/near-me?from=<guide-slug>` | `from` | BridgeCTA component | GuideContextBanner |
| `/guides?topic=<slug>` | `topic` | Life-moment tile; Hub topic cards | Guide library filter pre-selection |
| `/guides/:arc/:slug?suburb=<suburb>` | `suburb` | Journey "Read guide →" link | Guide page suburb-aware Near Me suggestions |
| `/guides/:arc/:slug?from=journey` | `from` | Journey "Read guide →" link | Guide page back-link to `/journey/plan` |

---

## 10. Data Security and Privacy

### 10.1 Personal Data Inventory

Minuri does **not** collect, transmit, or store personally identifiable information (PII). The following table documents every data element and its privacy classification:

| Data element | Source | Contains PII? | Storage |
|-------------|--------|--------------|---------|
| Suburb name entered by user | User input (combobox) | No — suburb names are not individually identifying | localStorage only; sent to backend as a query parameter in API calls to match against the `suburbs` table |
| Life-moment selection | User input | No — one of three preset values | localStorage only |
| Guide read history | User behaviour | No — guide slugs only | localStorage only |
| Saved Near Me places | User interaction | No — public business records (name, address) | localStorage only |
| Journey moment text | User input (free text) | Potentially sensitive (e.g. "I'm anxious", "I can't afford rent") | localStorage only; used client-side for keyword scoring; never sent to any server |
| ABS population data | ABS | No — aggregate statistics | PostgreSQL |
| Suburb geo-coordinates | Australian postcodes CSV | No — publicly known suburb centroids | PostgreSQL |
| SerpAPI results | SerpAPI / Google Maps | No — describes businesses | Not persisted; in-memory only during request |
| PTV stop/departure data | PTV | No — public transport infrastructure | Not persisted; cached in-memory for 60 seconds |

### 10.2 API Key Management

All third-party API keys are handled server-side and kept out of source control:

| Key | Storage | Used by |
|-----|---------|---------|
| `SERPAPI_API_KEY` | `.env` file (not committed); process environment in production | `app/config.py` (Pydantic Settings) |
| PTV developer key | `.env` file; process environment in production | `app/services/ptv_service.py` |
| `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` | `.env` file; process environment in production | `app/scripts/sync_s3_content.py` only |

The `.env` file is listed in `.gitignore`. No secrets appear in the codebase or in git history.

### 10.3 Client-Side Data Transparency

The hub footer displays the following notice to all returning users:

> *"Your journey stays on this device. Minuri never sees it."*

Users are provided two controls:
- **Export your journey** — downloads a JSON file containing all `minuri:` localStorage keys.
- **Clear my journey** — deletes all `minuri:` localStorage and sessionStorage keys after a confirmation modal.

### 10.4 HTTPS and Transport Security

All API calls between the Next.js frontend and the FastAPI backend use HTTPS in production. The PostgreSQL connection string includes `?sslmode=require`, ensuring encrypted connections to the Neon cloud database.

---

## 11. Data Quality and Validation

### 11.1 Database Integrity

| Constraint | Mechanism |
|-----------|-----------|
| `slug` uniqueness on `topics`, `arcs`, `guides`, `suburbs` | `UK` (unique key) constraint enforced at the database level via SQLAlchemy column definitions |
| Foreign key consistency (`guides.arc_id`, `guides.topic_id`, `guides.next_guide_id`) | SQLAlchemy ForeignKey with `nullable=True` for `next_guide_id` (last guide in arc) |
| SA2 code linkage between `suburbs` and `suburb_demographics` | `sa2_code` treated as a soft link (string match); referential integrity maintained by the ETL order |

### 11.2 Guide Content Validation

Before a guide JSON file is committed, authors verify:

1. All required fields are present and correctly typed.
2. `sections` array contains exactly 6 objects with keys in the prescribed order.
3. `nextGuideSlug` either matches a slug in the catalog or is `null`.
4. `nearMeDeeplink` follows the format `/near-me?topic=<slug>&from=<guide-slug>`.
5. `sourceLinks` hrefs are real, publicly accessible URLs.
6. `arc` and `topic` values match the canonical slug lists in Section 2.6.

### 11.3 SerpAPI Response Handling

SerpAPI results are accepted as-is with the following defensive practices:

- `gps_coordinates` is `null`-checked before rendering map pins.
- `phone`, `website`, and `service_options` are treated as optional fields; UI elements that depend on them render conditionally.
- If SerpAPI returns an error (non-200 response), the backend returns HTTP 502 to the client, which renders a user-friendly fallback message.

### 11.4 PTV Response Handling

PTV departures are cached for 60 seconds to avoid stale data accumulation. If the PTV API returns an error, the stop popup displays: *"Live departures unavailable. Check the PTV app for real-time info."*

### 11.5 localStorage Data Integrity

The client-side hooks (`useRecentActivity`, `useArcProgress`, `useFavourites`, `useJourneyState`, etc.) wrap all `localStorage.getItem()` calls in `try/catch` to handle:

- JSON parse errors (corrupted data).
- Storage quota exceeded (typically 5–10 MB; Minuri's footprint is minimal).
- Browsers with localStorage disabled (private/incognito strict mode).

In the event of a read error, hooks return their default empty state rather than crashing.

---

## 12. Ethical Considerations

### 12.1 Sensitive Content and Vulnerable Users

Minuri's target audience includes young adults who may be experiencing social isolation, financial stress, mental health challenges, and displacement anxiety. Two data handling implications follow:

**Journey moment text:** The free-text field collects potentially sensitive personal disclosures (e.g., "I'm really anxious and don't know anyone"). This text is used exclusively for keyword scoring to personalise guide selection. It is stored in `localStorage` on the user's own device and is never transmitted to any server. No inference or profiling is performed by the team.

**Mental health content:** The Health & Wellbeing topic includes guides on bulk-billing GPs, mental health care plans, and crisis lines. Crisis line phone numbers (Lifeline, Beyond Blue) are sourced from verified public directories and pinned at the top of the Health tab regardless of scroll position. The team commits to verifying the accuracy of these numbers before every iteration release.

### 12.2 Data Minimisation

Minuri collects the minimum data necessary for its features:

- The suburb combobox sends a substring query to the backend; it does not transmit GPS coordinates or a full address.
- No user account, email address, or authentication token is ever requested.
- The `minuri:topicFrequency` counter records counts by topic slug only — it does not record timestamps, session data, or click paths.

### 12.3 User Control

Users retain full control over their data at all times:

- The Export function produces a JSON download of all localStorage state, so users can back up or inspect their data.
- The Clear function wipes all `minuri:` keys immediately.
- Clearing browser storage or browsing in private mode resets the experience to first-visit state.

### 12.4 ABS Data Attribution

Population statistics sourced from the Australian Bureau of Statistics are used under CC BY 4.0. Attribution appears in the `GET /api/population` response context and in the footer of the live statistics widget on the Landing page.

### 12.5 No Dark Patterns

The hub sidebar auto-opens on return visits to surface personalised content, but respects user dismissal: a single close (X or ESC or swipe-down) suppresses auto-open for the remainder of the session via `minuri:hub:dismissed` in sessionStorage. The next visit resets this preference. No re-engagement notifications, push alerts, or email capture are used.

---

## 13. Changes from Iteration 1

### 13.1 What Changed

| Area | Iteration 1 | Iteration 2 |
|------|------------|------------|
| **Guide storage** | 15 flat guides as static files; no JSON schema enforced | 20 guides with a validated 6-section JSON schema in `public/guides-content/`; mirrored to AWS S3 |
| **Reference data** | Not persisted | `topics` (5) and `arcs` (3) seeded into PostgreSQL via `seed_static_reference_data.py` |
| **ORM coverage** | `suburbs` and `suburb_demographics` only | Added `guides`, `guide_sections`, `topics`, `arcs` ORM models |
| **Cloud storage** | Not used | AWS S3 bucket for guide content; `sync_s3_content.py` handles sync |
| **External APIs** | SerpAPI only | SerpAPI + PTV Timetable API |
| **Client-side state** | `sessionStorage` for journey (cleared on tab close); no other persistent state | Comprehensive `localStorage` model under `minuri:` namespace; journey state migrated to `localStorage` |
| **Topic taxonomy** | 5 topics in Guides (`Adulting Basics`, `Social & Mental Health`, etc.); 7 tabs in Near Me | Unified 5 topics (`home-admin`, `social-belonging`, etc.) shared across all epics |
| **Environment variables** | `SERPAPI_API_KEY` only | Added `DB_CONNECTION`, `AWS_*` variables; PTV key added for Iteration 2 |
| **ETL scripts** | `extract`, `load_population_records`, `load_melbourne_suburbs` | Added `seed_static_reference_data` and `sync_s3_content` |

### 13.2 Deprecated in Iteration 2

| Item | Status |
|------|--------|
| Topic labels `Adulting Basics` and `Social & Mental Health` | Retired; mapped to `home-admin` and `social-belonging` / `health-wellbeing` respectively. Old `category` field kept in guide JSON during Iteration 2 as a deprecation path; scheduled for removal in Iteration 3 |
| Near Me 7-tab layout (`Health`, `Mental Health`, `Food`, `Social`, `Groceries`, `Parks`, `Amenities`) | Replaced by 5-topic tab strip with sub-filter chips |
| Journey state in `sessionStorage` | Migrated to `localStorage`; sessionStorage copy cleared after migration |

---

*Minuri · Iteration 2 Data Management Plan · TP39 · 2026-05-05*
*Still feeling home, wherever you are.*
