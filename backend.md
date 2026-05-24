# Minuri Server

<div align="center">
  <img src="./favicon.png" width="300" alt="Minuri icon">
</div>
<br/>
<p align="center">
<a href=""><img src="https://img.shields.io/badge/Latest%20Version-V0.1.0-blue.svg?&style=for-the-badge&logo=git&logoColor=white&colorB=7289DA"></a> <br>
<a href=""><img src="https://img.shields.io/badge/Python-3.11%2B-3776AB?style=for-the-badge&logo=python&logoColor=white"></a>
<a href=""><img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white"></a>
<a href=""><img src="https://img.shields.io/badge/uv-%23DE5FE9.svg?style=for-the-badge&logo=uv&logoColor=white"></a> <br>
<a href=""><img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white"></a>
<a href=""><img src="https://img.shields.io/badge/AWS_S3-FF9900?style=for-the-badge&logo=amazons3&logoColor=white"></a>
<a href=""><img src="https://img.shields.io/badge/SerpApi-2A6DF4?style=for-the-badge&logo=google&logoColor=white"></a>
<a href=""><img src="https://img.shields.io/badge/pydantic-%23E92063.svg?style=for-the-badge&logo=pydantic&logoColor=white"></a>
</p>

Minuri Server is the backend service for Minuri. Built with FastAPI, it powers location-based discovery, suburb demographic data, AI-generated journey plans, and static guide content. Guide metadata lives in Postgres (`topics`, `arcs`, `guides`, `guide_sections`), while guide JSON payloads are stored under `app/s3/guides-content/` and synced to S3 separately.

## Table of Contents

- [Getting Started](#getting-started)
- [Local Development](#local-development)
- [Docker](#docker)
- [Environment Variables](#environment-variables)
- [Data Sources and Import](#data-sources-and-import)
- [Data Flow](#data-flow)
- [Project Structure](#project-structure)
- [Current API Overview](#current-api-overview)
- [Security](#security)

## Getting Started

```bash
cd minuri-server
uv sync
```

Create a local `.env` file in the project root:

```env
# Required — API runtime
SERPAPI_API_KEY=your_key_here
DB_CONNECTION=postgresql://user:password@host/dbname?sslmode=require
OPEN_ROUTER_API=your_openrouter_key_here

# Optional — enables /docs, /redoc, /openapi.json
ENVIRONMENT=development

# Optional — only needed for guide sync to S3
AWS_ACCESS_KEY_ID=your_key_here
AWS_SECRET_ACCESS_KEY=your_secret_here
AWS_DEFAULT_REGION=ap-southeast-2
AWS_S3_BUCKET_NAME=your_bucket_name
```

Start the development server:

```bash
uv run uvicorn app.main:app --reload
```

## Local Development

- Server URL: `http://127.0.0.1:8000`
- API docs: `http://127.0.0.1:8000/docs` (only when `ENVIRONMENT=development`)
- Root endpoint: `http://127.0.0.1:8000/` → `{"message": "Root endpoint"}`

> **Note:** Swagger UI, ReDoc, and the OpenAPI schema are hidden in production (`ENVIRONMENT` defaults to `"production"`). Set `ENVIRONMENT=development` locally to enable them.

## Docker

From the repo root (requires Docker):

```bash
docker build -t minuri-server .
docker run --rm -p 8000:80 --env-file .env minuri-server
```

The image installs dependencies with `uv sync --frozen` and starts the app with `fastapi run app/main.py` on port 80 inside the container (mapped to `8000` in the example).

## Environment Variables

### Required for the API (`app/config.py`)

Loaded via Pydantic Settings from `.env` or the process environment:

| Variable | Purpose |
|----------|---------|
| `SERPAPI_API_KEY` | API key for nearby-interest and nearby-events search (SerpApi) |
| `DB_CONNECTION` | PostgreSQL connection string (Neon DB recommended) |
| `OPEN_ROUTER_API` | API key for OpenRouter (used by the Journey AI service) |

### Optional runtime flags

| Variable | Default | Purpose |
|----------|---------|---------|
| `ENVIRONMENT` | `production` | Set to `development` to enable `/docs`, `/redoc`, `/openapi.json` |

### Used by `sync_s3_content` only

The sync script loads `.env` with `python-dotenv` and uses boto3's default credential chain plus:

| Variable | Purpose |
|----------|---------|
| `AWS_S3_BUCKET_NAME` | S3 bucket name (required by the script) |
| `AWS_DEFAULT_REGION` | Region passed to the S3 client |
| `AWS_ACCESS_KEY_ID` | AWS credentials (if not using another boto3 credential source) |
| `AWS_SECRET_ACCESS_KEY` | AWS credentials (if not using another boto3 credential source) |

Keep secrets in your local `.env` file and do not commit them to source control.

## Data Sources and Import

This project combines suburb master data, official ABS population statistics, SerpApi for live nearby search, OpenRouter for AI-generated journey plans, seeded topics/arcs metadata, optional AWS S3 sync for guide JSON authored under `app/s3/`, and a Node.js geodata fetcher that pulls OSM transit and park geometries for the frontend map.

### Running database ETL scripts together

To reset the database and reload all data in one step:

```bash
uv run python -m app.scripts
```

This drops and recreates all tables defined on the SQLAlchemy `Base`, then runs these modules **in order**:

1. `app.scripts.extract` — ABS Excel → `app/data/victoria_population_table.csv`
2. `app.scripts.load_population_records` — CSV → `suburb_demographics`
3. `app.scripts.load_melbourne_suburbs` — Australian postcodes → `suburbs`
4. `app.scripts.seed_static_reference_data` — upsert `topics` and `arcs`

**Not included:** `app.scripts.sync_s3_content` (AWS sync). Run that separately when you need to push local guide JSON to S3.

---

### 1) Australian Postcodes (suburb master data)

Source:
- Repository: [https://github.com/matthewproctor/australianpostcodes](https://github.com/matthewproctor/australianpostcodes)
- CSV: [https://raw.githubusercontent.com/matthewproctor/australianpostcodes/master/australian_postcodes.csv](https://raw.githubusercontent.com/matthewproctor/australianpostcodes/master/australian_postcodes.csv)

What it contains (used fields):
- Locality name, postcode, state
- Latitude/longitude (`Lat_precise`, `Long_precise`)
- SA2 code (2021) and SA3 name metadata

How we use it:
- `app.scripts.load_melbourne_suburbs` fetches the CSV, filters to VIC suburbs in Greater Melbourne (SA4 codes 206–214), deduplicates by `(name, postcode, state)`, and bulk-inserts into `suburbs`.
- `GET /suburb` and `GET /suburb/larger-region` read from this data.

```bash
uv run python -m app.scripts.load_melbourne_suburbs
```

---

### 2) ABS Regional Population (Victoria)

Source:
- ABS Regional Population release (Table 2): [https://www.abs.gov.au/statistics/people/population/regional-population/2024-25#data-downloads](https://www.abs.gov.au/statistics/people/population/regional-population/2024-25#data-downloads)
- Local file: `app/data/32180DS0001_2024-25.xlsx`

What it contains (used fields):
- SA2/SA3/SA4/GCCSA names and codes
- ERP population values (2024 and 2025)
- Growth and density measures (change %, area, density)

How we use it:
- `app.scripts.extract` converts the ABS Excel table (sheet "Table 2", skip 5 header rows) into `app/data/victoria_population_table.csv`.
- `app.scripts.load_population_records` loads the CSV into `suburb_demographics`, deduplicating by SA2 code (last row wins).
- `GET /api/population` sums `erp_2025` across all rows whose SA2/SA3/SA4/GCCSA names `ILIKE` the requested string.

```bash
uv run python -m app.scripts.extract
uv run python -m app.scripts.load_population_records
```

---

### 3) Static Reference Data (Topics & Arcs)

Seed data for the `topics` and `arcs` tables, which classify guide content.

**Topics (5):**

| Slug | Name |
|------|------|
| `food_eating` | Food & Eating |
| `getting_around` | Getting Around |
| `health_wellbeing` | Health & Wellbeing |
| `home_admin` | Home & Admin |
| `social_belonging` | Social & Belonging |

**Arcs (3):**

| Slug | Name | Timeframe |
|------|------|-----------|
| `week_one` | You Just Moved In | Week 1 |
| `month_one` | Getting Set Up | Month 1 |
| `month_three` | Finding Your Rhythm | Month 3 |

`app.scripts.seed_static_reference_data` upserts by slug — safe to run repeatedly.

```bash
uv run python -m app.scripts.seed_static_reference_data
```

---

### 4) SerpApi (live nearby search)

Source: [https://serpapi.com/](https://serpapi.com/)

Used at request time for two endpoints:

**Nearby places** (`GET /api/nearby-interest`):
- Engine: `google_maps`, Melbourne viewport `@-37.8136,144.9631,12z`
- Query built from `QUERY_MAP` (topic + subtype) or `_TOPIC_FALLBACK` (topic only)
- Results normalized: title, rating, reviews, address, type, price, open_state, description, thumbnail (upscaled to 800×600), place_id, gps_coordinates

**Nearby events** (`GET /api/nearby-events`):
- Engine: `google_events`, location: Melbourne, Victoria, Australia
- Query: `social community events {suburb} Melbourne`
- Filterable by date: `today`, `week` (default), `next_month`

---

### 5) OpenRouter AI (journey plans)

Source: [https://openrouter.ai/](https://openrouter.ai/)

Used at request time by `POST /journey`.

- Model: `openrouter/owl-alpha`
- Structured JSON output via `response_format` with strict schema matching `JourneyResponse`
- Input: suburb name, free-text "your moment", selected topic slugs (1–5)
- Output: assigned archetype + vibe color + letter body + suburb line

**Archetypes:**

| Key | Description |
|-----|-------------|
| `first-timer` | Never lived independently before |
| `far-from-home` | Family/friends are far away; emotional weight of distance |
| `solo-arrival` | Moved knowing absolutely no one |
| `reluctant-grownup` | Didn't fully choose this move |

---

### 6) AWS S3 (guide content)

Local files under `app/s3/guides-content/` synced to S3 via MD5/ETag comparison. Only new or changed files are uploaded. Deletion of orphaned S3 objects is disabled by default (commented out in the script).

```bash
uv run python -m app.scripts.sync_s3_content
```

---

### 7) OpenStreetMap Geodata (frontend map assets)

Source: [Overpass API](https://overpass-api.de/) — OpenStreetMap data for Melbourne.

Script: `app/scripts/fetch-geodata.mjs` (Node.js — requires `osmtogeojson` package)

What it fetches and outputs to `public/geodata/`:

| Output file | OSM query | Filter |
|-------------|-----------|--------|
| `melbourne-trams.geojson` | `way["railway"="tram"]` | LineStrings only, all properties stripped |
| `melbourne-trains.geojson` | `way["railway"="rail"]` excluding industrial/tourism/yard/siding | LineStrings only, all properties stripped |
| `melbourne-parks.geojson` | Named `leisure=park` ways and relations | Polygons only, area > 0.00003 deg² (~15 ha); keeps `PARK_NAME` |

Processing pipeline per dataset:
1. Overpass HTTP fetch with 120 s timeout (Melbourne bbox: `-38.3,144.4,-37.6,145.7`)
2. OSM → GeoJSON via `osmtogeojson`
3. Geometry simplification via Ramer-Douglas-Peucker (`eps` varies per layer)
4. Coordinate rounding to 4 decimal places

Run:
```bash
node app/scripts/fetch-geodata.mjs
```

> This script is standalone — it is not part of the Python ETL pipeline and writes only to `public/geodata/`, not to the database.

---

## Data Flow

```mermaid
flowchart TD
    subgraph Sources["External Sources"]
        A1[Australian Postcodes CSV\nGitHub]
        A2[ABS Victoria Population XLSX]
        A3[SerpApi\nGoogle Maps / Events]
        A4[OpenRouter AI\nowl-alpha model]
        A5[Overpass API\nOpenStreetMap]
        L1[app/s3/guides-content/\nlocal JSON files]
    end

    subgraph ETL["ETL Pipeline (app.scripts)"]
        S1[extract.py\nExcel → CSV]
        S2[load_population_records.py\nCSV → DB]
        S3[load_melbourne_suburbs.py\nDownload → DB]
        S4[seed_static_reference_data.py\nUpsert topics & arcs]
        S5[sync_s3_content.py\nMD5 diff → upload]
        S6[fetch-geodata.mjs\nOSM → GeoJSON]
    end

    subgraph Storage["Storage"]
        DB[(PostgreSQL\nNeon DB)]
        S3B[(AWS S3\nguides-content/)]
        F1[app/data/\nvictoria_population_table.csv]
        GEO[public/geodata/\ntrams · trains · parks GeoJSON]
    end

    subgraph Services["Services"]
        SV1[suburb_service.py]
        SV2[population_service.py]
        SV3[near_me.py]
        SV4[journey_service.py]
    end

    subgraph API["FastAPI App"]
        R1[GET /suburb]
        R2[GET /suburb/larger-region]
        R3[GET /api/population]
        R4[GET /api/nearby-interest]
        R5[GET /api/nearby-events]
        R6[POST /journey]
    end

    A1 --> S3
    A2 --> S1 --> F1 --> S2
    S2 --> DB
    S3 --> DB
    S4 --> DB
    L1 --> S5 --> S3B
    A5 --> S6 --> GEO

    RUN[uv run python -m app.scripts\nETL only — no S3 sync] --> S1
    RUN --> S2
    RUN --> S3
    RUN --> S4

    DB --> SV1 --> R1
    DB --> SV1 --> R2
    DB --> SV2 --> R3
    A3 --> SV3 --> R4
    A3 --> SV3 --> R5
    A4 --> SV4 --> R6

    R1 & R2 & R3 & R4 & R5 & R6 --> Client[Client / Frontend]

    classDef source fill:#e3f2fd,stroke:#1e88e5,color:#0d47a1;
    classDef etl fill:#ede7f6,stroke:#5e35b1,color:#311b92;
    classDef db fill:#e8f5e9,stroke:#2e7d32,color:#1b5e20;
    classDef serve fill:#fff3e0,stroke:#ef6c00,color:#e65100;
    classDef client fill:#fce4ec,stroke:#c2185b,color:#880e4f;
    classDef runner fill:#f3e5f5,stroke:#8e24aa,color:#4a148c;

    class A1,A2,A3,A4,A5,F1,L1 source;
    class S1,S2,S3,S4,S5 etl;
    class DB,S3B db;
    class SV1,SV2,SV3,SV4,R1,R2,R3,R4,R5,R6 serve;
    class Client client;
    class RUN runner;
```

### Request Lifecycle

```mermaid
sequenceDiagram
    participant C as Client
    participant MW as Middleware<br/>(CORS + Security Headers + Rate Limiter)
    participant R as Router
    participant S as Service
    participant EXT as External<br/>(SerpApi / OpenRouter)
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
    else SerpApi endpoint
        R->>S: call service(params)
        S->>EXT: serpapi.Client.search(...)
        EXT-->>S: JSON payload
        S-->>R: normalized results
    else Journey endpoint
        R->>S: await get_journey_plan(...)
        S->>EXT: httpx POST → OpenRouter
        EXT-->>S: structured JSON
        S-->>R: JourneyResponse
    end
    R-->>MW: Response
    MW->>MW: Inject security headers
    MW-->>C: Final response
```

### ERD

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

## Project Structure

```
minuri-server/
├── pyproject.toml
├── Dockerfile
└── app/
    ├── main.py                            # FastAPI app, CORS, security headers, rate limiter
    ├── config.py                          # Settings (Pydantic, lru_cache)
    ├── database.py                        # SQLAlchemy engine + session (Neon DB)
    ├── limiter.py                         # slowapi Limiter (key: remote address)
    ├── models.py                          # ORM: Topic, Arc, Guide, GuideSection, Suburb, SuburbDemographic
    ├── routers/
    │   ├── api.py                         # /api/nearby-interest, /api/nearby-events, /api/population
    │   ├── suburb.py                      # /suburb, /suburb/larger-region
    │   └── journey.py                     # /journey (AI journey plan)
    ├── schemas/
    │   ├── near_me.py                     # NearbyInterest + NearbyEvent response schemas
    │   ├── suburb.py                      # Suburb response schemas
    │   └── journey.py                     # JourneyRequest, JourneyResponse, IdentityLLM, VibeLLM
    ├── services/
    │   ├── near_me.py                     # SerpApi Google Maps + Google Events search
    │   ├── population_service.py          # Population aggregation (ILIKE sum)
    │   ├── suburb_service.py              # Suburb queries
    │   └── journey_service.py             # OpenRouter AI call + structured output parsing
    ├── scripts/
    │   ├── __main__.py                    # Master runner: reset DB + run ETL (no S3 sync)
    │   ├── extract.py                     # ABS Excel → victoria_population_table.csv
    │   ├── load_melbourne_suburbs.py      # Download & load suburb data
    │   ├── load_population_records.py     # Load demographics CSV → DB
    │   ├── seed_static_reference_data.py  # Upsert Topics & Arcs by slug
    │   ├── sync_s3_content.py             # Sync app/s3/** → AWS S3 guides-content/
    │   └── fetch-geodata.mjs              # Node.js: Overpass API → public/geodata/ GeoJSON
    ├── data/                              # CSV/XLSX inputs & generated CSV (ABS pipeline)
    └── s3/
        └── guides-content/                # Guide JSON grouped by topic slug folders
```

## Current API Overview

```
GET  /
GET  /suburb
GET  /suburb/larger-region
GET  /api/nearby-interest
GET  /api/nearby-events
GET  /api/population
POST /journey
```

### Rate Limits

| Endpoint | Limit |
|----------|-------|
| `GET /api/nearby-interest` | 10 / minute |
| `GET /api/nearby-events` | 10 / minute |
| `GET /api/population` | 30 / minute |
| `GET /suburb` | 30 / minute |
| `GET /suburb/larger-region` | 30 / minute |
| `POST /journey` | 5 / minute |

Exceeded limits return `429 Too Many Requests`.

---

### Nearby Interest

**GET `/api/nearby-interest`**

| Param | Required | Notes |
|-------|----------|-------|
| `suburb` | Yes | Passed into SerpApi query as `… near {suburb}` |
| `topic` | No | One of: `food-eating`, `getting-around`, `health-wellbeing`, `home-admin`, `social-belonging` |
| `subtype` | No | Narrows the query. See `QUERY_MAP` in `app/services/near_me.py` |

Supported `(topic, subtype)` pairs:

| Topic | Subtype |
|-------|---------|
| `food-eating` | `food-dining`, `groceries` |
| `getting-around` | `public-transit`, `cycling` |
| `health-wellbeing` | `gp-clinics`, `mental-health` |
| `home-admin` | `services`, `libraries` |
| `social-belonging` | `community-spaces`, `social-venues` |

Omit `subtype` or use `all` to use the per-topic fallback query.

Response:
```json
{
  "suburb": "Clayton",
  "query": "cheap restaurants cafes food",
  "results": [{
    "title": "...", "rating": 4.5, "reviews": 120,
    "address": "...", "type": "...", "price": "...",
    "open_state": "...", "description": "...",
    "thumbnail": "...", "place_id": "...",
    "gps_coordinates": { "latitude": -37.9, "longitude": 145.1 }
  }]
}
```

Errors: `400` invalid topic, `502` SerpApi failure.

---

### Nearby Events

**GET `/api/nearby-events`**

| Param | Required | Default | Notes |
|-------|----------|---------|-------|
| `suburb` | Yes | — | Used in query: `social community events {suburb} Melbourne` |
| `date_filter` | No | `week` | One of: `today`, `week`, `next_month` |

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

Errors: `400` invalid date_filter, `502` SerpApi failure.

---

### Population

**GET `/api/population`**

| Param | Required | Notes |
|-------|----------|-------|
| `location` | Yes | Case-insensitive substring match against SA2/SA3/SA4/GCCSA names |

Response:
```json
{ "population": 142300, "location": "Melbourne", "year": "2025" }
```

Population is the sum of `erp_2025` across all matching `suburb_demographics` rows.

---

### Suburb Endpoints

**GET `/suburb`**

| Param | Required | Notes |
|-------|----------|-------|
| `larger_region` | No | Filter by SA3 name |

Response: `{ "suburbs": [{ "locality", "postcode", "state", "long", "lat", "larger_region" }] }`

**GET `/suburb/larger-region`**

Returns all distinct SA3 names. Response: `{ "larger_regions": ["Bayside", "Melbourne City", "..."] }`

---

### Journey

**POST `/journey`**

Request body:
```json
{
  "suburb": "Fitzroy",
  "your_moment": "I just arrived and don't know anyone here...",
  "selected_topics": ["social-belonging", "food-eating"]
}
```

| Field | Constraints |
|-------|-------------|
| `suburb` | 1–100 chars; `{}` stripped to prevent prompt injection |
| `your_moment` | 10–500 chars; C0 control characters sanitized |
| `selected_topics` | 1–5 items from valid topic slugs |

Response:
```json
{
  "identity": {
    "archetype": "solo-arrival",
    "vibe": { "name": "Still Morning", "hex": "#4A7FA5" },
    "letter_body": "You arrived knowing no one, and that takes a particular kind of courage...",
    "suburb_line": "Fitzroy: your new corner of Melbourne."
  }
}
```

Errors: `502` if OpenRouter call fails or returns unparseable output.

---

## Security

```mermaid
flowchart LR
    C[Client] -->|Request| CORS[CORS Middleware\nAllows: minuri-amber.vercel.app\nwww.minuri.tech]
    CORS --> RL[Rate Limiter\nslowapi / IP-based]
    RL --> SH[Security Headers Middleware]
    SH --> App[FastAPI App]
    App -->|Response| SH
    SH -->|Injects headers| OUT[Response]

    subgraph Headers["Security Headers Added"]
        H1[X-Content-Type-Options: nosniff]
        H2[X-Frame-Options: DENY]
        H3[Referrer-Policy: strict-origin-when-cross-origin]
        H4[X-XSS-Protection: 0]
    end
```

- CORS allows only the production frontend origins; credentials are not forwarded.
- API docs (`/docs`, `/redoc`, `/openapi.json`) are disabled in production.
- Input to `POST /journey` is sanitized server-side before being forwarded to the LLM.
