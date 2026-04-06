# Minuri — Iteration 1 Epic Planning
## Detailed Data Sources, APIs & Implementation Spec

**Scope:** Melbourne only (City of Melbourne LGA + surrounding suburbs like Clayton, Parkville, Southbank, Carlton, Fitzroy, Richmond)

---

## Data Sources Master List

Before diving into epics, here's every dataset and API we'll use and how to access them.

### City of Melbourne Open Data Portal (data.melbourne.vic.gov.au)

All datasets use the **Opendatasoft API v2.1**. No API key required. Base URL:

```
https://data.melbourne.vic.gov.au/api/explore/v2.1/catalog/datasets/{dataset-id}/records
```

| # | Dataset | Dataset ID | What it gives us |
|---|---------|-----------|-----------------|
| 1 | Landmarks & Places of Interest | `landmarks-and-places-of-interest-including-schools-theatres-health-services-spor` | Health services, hospitals, universities, parks, galleries, sports facilities — with lat/lng coordinates and theme/sub-theme classification |
| 2 | Cafés & Restaurants (CLUE) | `cafes-and-restaurants-with-seating-capacity` | Every café/restaurant in CoM with trading name, address, ANZSIC industry code, indoor/outdoor seat count, lat/lng |
| 3 | Bars & Pubs (CLUE) | `bars-and-pubs-with-patron-capacity` | Bar/tavern/pub listings with patron capacity, address, lat/lng |
| 4 | Public Toilets | `public-toilets` | Location, accessibility info, opening hours of all council-operated public toilets |
| 5 | Drinking Fountains | `drinking-fountains` | Location and type of all drinking fountains in CoM |
| 6 | Public BBQs | `public-barbecues` | Location and type of all free public BBQs |
| 7 | Venues for Event Bookings | `venues-for-event-bookings` | Bookable event spaces, dog-friendly, smoke-free flags |
| 8 | Social Indicators (CoMSIS) | `social-indicators-for-city-of-melbourne-residents-2020` | Health, wellbeing, participation, and social connection indicators by suburb, gender, and age |
| 9 | Liveability Indicators | `city-of-melbourne-liveability-and-social-indicators` | Quality of life indicators including health and recreation |

**Example API call** — get all health service landmarks:
```
GET https://data.melbourne.vic.gov.au/api/explore/v2.1/catalog/datasets/landmarks-and-places-of-interest-including-schools-theatres-health-services-spor/records?where=theme%3D%22Health%20Services%22&limit=100
```

**Example API call** — get cafés in a specific CLUE small area:
```
GET https://data.melbourne.vic.gov.au/api/explore/v2.1/catalog/datasets/cafes-and-restaurants-with-seating-capacity/records?where=census_year%3D2023&limit=50
```

### NHSD / HealthDirect API

The National Health Services Directory (NHSD) Consumer API provides Australia's most comprehensive health service directory (400,000+ records). Requires an API key (free, apply at developers.nhsd.healthdirect.org.au).

```
Base URL: https://api.nhsd.healthdirect.org.au/v5/healthcareServices/_search
Header: x-api-key: YOUR_KEY
```

**Example** — find bulk-billing GPs near postcode 3168 (Clayton):
```
GET /v5/healthcareServices/_search
  ?requestContext.serviceDeliveryMethod=PHYSICAL
  &filter.serviceType.codes=nhsd:/reference/taxonomies/snomed-servicetype/788007007
  &location.proximity.near_postcode=3168
  &location.proximity.near_distance=5000
  &responseControl.limit=20
```

Returns: service name, address, phone, lat/lng, bulk-billing flag, opening hours, service types.

**Fallback plan** if NHSD API key application is slow: scrape/extract data from the HealthDirect Service Finder widget for Melbourne postcodes and seed it into PostgreSQL as a static dataset. This gives you the same data structure without API dependency at runtime.

### ABS Census 2021

Download CSV from ABS TableBuilder or DataPacks: https://www.abs.gov.au/census/find-census-data

**Table needed:** "Age by SA2 (Statistical Area Level 2)" — filter to ages 18–25 for Melbourne SA2 areas (Clayton, Parkville, Melbourne CBD, Carlton, Fitzroy, Richmond, Southbank, etc.)

This is a **batch download → ETL → PostgreSQL** pipeline, not a live API. The ABS does have a data API (stat.data.abs.gov.au) but the Census data is easier to work with as CSV.

### PTV (Public Transport Victoria) API

Free API for tram/train/bus data. Apply for devid + key at https://www.ptv.vic.gov.au/footer/data-and-reporting/datasets/

```
Base URL: https://timetableapi.ptv.vic.gov.au/v3
Auth: HMAC-SHA1 signature on each request
```

Useful endpoints: `/v3/stops/location/{lat},{lng}` (nearby stops), `/v3/departures/route_type/{type}/stop/{id}` (live departures).

**Use case for Minuri:** "How do I get around Melbourne?" guide — show nearby tram/train stops on the Near Me map. Low priority for Iteration 1 but good to flag for future.

---

## Epic 1: Landing Page & Core Navigation

**Data required:** None (static content)

**What to build:**

The homepage is entirely static — no API calls. It serves as the entry point and must communicate the value proposition clearly.

**Page structure:**

1. **Hero section** — "Minuri" brand name + tagline "Your digital safety net for independent living" + a one-paragraph pitch: "Just moved to Melbourne? Minuri helps you find where to eat, where to get help, and how to do the things nobody taught you — powered by real City of Melbourne data."
2. **Three persona cards** — Alex (uni student), Chloe (first-time renter), Jordan (first jobber). Each links contextually to relevant guide categories.
3. **Two CTAs** — "Browse First Time Guides" → `/guides` | "Find Services Near Me" → `/near-me`
4. **Quick stats strip** — Pull 2–3 numbers from the Social Indicators dataset to display (e.g., "93.3% of uni students report loneliness," "29% of young Australians say mental health is their top concern"). These are static/hardcoded from the research, not live API calls.

**User stories:** US 1.1 (Homepage), US 1.2 (Navbar) — as defined in the A&D report.

**Dev effort:** ~1–2 days. React + Tailwind. Mobile-first layout.

---

## Epic 2: First Time Guides

**Data required:** Article content (authored by team) + contextual links to Near Me data

### Guide Topics — Organised by Category

The key insight: these guides are not clinical health articles. They're the practical stuff your mum would have told you. Group them into 5 categories with 3 articles each (15 total for Iteration 1). Each article is 2–5 minutes to read.

#### Category 1: Eating & Cooking 🍳

| Guide Title | What it covers | Open Data Connection |
|---|---|---|
| "Cheap Eats in Melbourne: A Broke Student's Map" | Budget-friendly food spots around Melbourne. Where to eat for under $15. | **CoM Cafés & Restaurants dataset** — pull all restaurants, let users filter by CLUE small area. Display on map. |
| "Your First Grocery Run: What to Actually Buy" | A realistic first-week shopping list. What staples to stock. How to not blow $200 on random stuff. | Static article. Link to Near Me for nearby supermarkets (landmarks dataset → Retail theme). |
| "5 Meals You Can Cook With 5 Ingredients" | Dead-simple recipes for someone who's never cooked. Fried rice, pasta, stir-fry, omelette, soup. | Static article. No API needed. |

#### Category 2: Getting Around 🚋

| Guide Title | What it covers | Open Data Connection |
|---|---|---|
| "Melbourne Transport 101: Myki, Zones, and How to Not Get Fined" | How Myki works, where to buy/top up, zone rules, concession eligibility, free tram zone boundaries. | Static article. Can embed free tram zone boundary map from CoM data. |
| "How to Actually Get From A to B" | Google Maps vs PTV app. Which tram goes to campus. Night bus/tram info. | Static article with links to PTV resources. Future iteration: integrate PTV API for live departures. |

#### Category 3: Health & Wellbeing 🩺

| Guide Title | What it covers | Open Data Connection |
|---|---|---|
| "How to Book Your First GP Appointment" | Step-by-step: what to say when you call, what to bring, what bulk-billing means, what a Mental Health Care Plan is. | Links to **Near Me** → GP filter. Uses **NHSD API** or **CoM Landmarks (Health Services theme)** to show nearby GPs. |
| "Bulk-Billing: What It Actually Means" | Plain-language explainer of Medicare, bulk-billing vs gap fees, how to find a bulk-billing clinic. | Links to Near Me. |
| "Feeling Off? Here's When to See a GP vs Go to Emergency" | Triage decision guide — sore throat vs chest pain, when to call 000 vs book a GP. Crisis lines always displayed. | Static article. Always shows crisis lines footer (Lifeline 13 11 14, Beyond Blue 1300 22 4636, headspace 1800 650 890). |

#### Category 4: Adulting Basics 🏠

| Guide Title | What it covers | Open Data Connection |
|---|---|---|
| "Your First Week Living Alone: A Checklist" | Setting up utilities, getting a bank account, registering your address, finding your nearest supermarket/pharmacy/GP. | Links to Near Me for all three service types. |
| "Share House Survival Guide" | Splitting bills, cleaning rosters, dealing with housemate conflict, what's normal. | Static article. |

#### Category 5: Social & Mental Health 💙

| Guide Title | What it covers | Open Data Connection |
|---|---|---|
| "Free Things to Do in Melbourne When You're Broke" | Free museums/galleries, parks, markets, library events, public BBQs. | **CoM Landmarks dataset** (Leisure/Recreation theme) + **Public BBQs dataset** + **Venues for Event Bookings dataset**. Display as a mini-map or list. |
| "Feeling Lonely? You're Not the Only One" | Normalises loneliness, cites CoMSIS social connection data ("X% of Melbourne residents feel socially connected"), suggests low-barrier social activities. | **CoM Social Indicators dataset** — pull social connection and wellbeing indicators for 18–25 age group. Display as contextual stats within the article. |
| "Crisis Lines and Free Support Services" | Every free mental health service available — headspace, Beyond Blue, Lifeline, eheadspace, QLife, 1800RESPECT. What each one does, when to use which. | Static article with hardcoded contact info. Always accessible from navbar as a quick-access link. |

### How Guides Connect to Open Data

Guides are **not just static articles**. The ones tagged with open data pull live data via the backend:

```
Article content (static in DB)
  └── Inline data widget (dynamic)
       └── "Cheap Eats Near You" → calls CoM Cafés API filtered by user's suburb
       └── "Free Things To Do" → calls CoM Landmarks API filtered by Leisure/Recreation
       └── "Find a GP" → calls NHSD API or CoM Landmarks (Health Services)
```

The backend serves this as:
```
GET /api/articles/{id}
  → returns article content + data_widget config

GET /api/explore/cafes?area={clue_area}
  → proxies to CoM Cafés API, returns formatted results

GET /api/explore/landmarks?theme=Health%20Services
  → proxies to CoM Landmarks API
```

### Database Schema for Articles

```sql
CREATE TABLE articles (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  category VARCHAR(50) NOT NULL,  -- eating, transport, health, adulting, social
  summary TEXT NOT NULL,
  content TEXT NOT NULL,           -- markdown or rich text
  reading_time_min INT DEFAULT 3,
  data_widget_type VARCHAR(50),    -- null, 'cafe_map', 'landmark_map', 'gp_finder'
  data_widget_config JSONB,        -- e.g. {"theme": "Health Services", "limit": 10}
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Seed 15 articles at launch
INSERT INTO articles (title, slug, category, summary, content, reading_time_min, data_widget_type)
VALUES
  ('Cheap Eats in Melbourne', 'cheap-eats-melbourne', 'eating',
   'Budget-friendly food spots around Melbourne — all under $15.',
   '...full article markdown...', 4, 'cafe_map'),
  ('How to Book Your First GP Appointment', 'first-gp-appointment', 'health',
   'Step-by-step: what to say, what to bring, what bulk-billing means.',
   '...full article markdown...', 3, 'gp_finder'),
  -- ... etc
;
```

**Bookmarking** uses localStorage on the frontend — store an array of article IDs:
```javascript
// Save bookmark
const bookmarks = JSON.parse(localStorage.getItem('minuri_bookmarks') || '[]');
bookmarks.push(articleId);
localStorage.setItem('minuri_bookmarks', JSON.stringify([...new Set(bookmarks)]));
```

---

## Epic 3: Near Me — Melbourne Resource Finder

**Data required:** CoM Landmarks API + CoM Cafés API + NHSD API + ABS Census CSV + CoM amenity datasets

### What Near Me Actually Does

User flow: Enter suburb or allow location detection → See a split-view (list + map) of nearby services → Filter by category → See suburb demographic snapshot.

### Data Architecture

Near Me aggregates multiple data sources into a unified "places" model:

```
┌──────────────────────────────┐
│       Near Me Frontend       │
│  (Leaflet.js map + list)     │
└──────────┬───────────────────┘
           │ GET /api/near-me?suburb=Clayton&type=health
           ▼
┌──────────────────────────────┐
│       FastAPI Backend        │
│  Aggregation Layer           │
│                              │
│  ┌─────────┐ ┌────────────┐ │
│  │ CoM API │ │ NHSD API   │ │
│  │ (proxy) │ │ (proxy)    │ │
│  └────┬────┘ └─────┬──────┘ │
│       │             │        │
│  ┌────▼─────────────▼──────┐ │
│  │    PostgreSQL           │ │
│  │  - suburb_demographics  │ │
│  │  - cached_places        │ │
│  │  - amenities            │ │
│  └─────────────────────────┘ │
└──────────────────────────────┘
```

### Service Categories & Data Sources

| Category | Icon | Primary Data Source | What's Displayed |
|---|---|---|---|
| **Health** | 🏥 | CoM Landmarks API (`theme=Health Services`) + NHSD API | GPs, hospitals, bulk-billing clinics. Name, address, phone, bulk-billing flag |
| **Mental Health** | 💙 | NHSD API (service type: psychology/counselling) + hardcoded headspace locations | headspace centres, psychologists, counselling. Always includes crisis lines |
| **Food & Dining** | 🍽️ | CoM Cafés & Restaurants API | Restaurant name, cuisine type (from ANZSIC), indoor/outdoor seats, address |
| **Bars & Social** | 🍺 | CoM Bars & Pubs API | Bar name, patron capacity, address |
| **Groceries** | 🛒 | CoM Landmarks API (`theme=Retail`) + manually curated supermarket list | Supermarkets (Coles, Woolworths, Aldi, IGA) near suburb |
| **Parks & Free Activities** | 🌳 | CoM Landmarks API (`theme=Leisure/Recreation`) + Public BBQs + Drinking Fountains | Parks, gardens, sports facilities, free BBQs, drinking fountains |
| **Public Amenities** | 🚻 | CoM Public Toilets API + Drinking Fountains API | Nearest public toilets (with accessibility info), water fountains |

### Backend API Endpoints

```python
# FastAPI routes for Near Me

@app.get("/api/near-me")
async def get_nearby_places(
    suburb: str,              # e.g. "Clayton" or "Melbourne CBD"
    type: str = "all",        # health | mental_health | food | bars | groceries | parks | amenities
    lat: float = None,        # optional: user's lat for distance calc
    lng: float = None,        # optional: user's lng for distance calc
    limit: int = 20
):
    """
    Aggregates data from multiple sources based on type filter.
    Returns unified place objects with: name, type, address, lat, lng, phone, metadata
    """
    pass

@app.get("/api/near-me/demographics")
async def get_suburb_demographics(suburb: str):
    """
    Returns ABS Census 2021 data for the given SA2 area.
    Response: { suburb, population_18_25, total_population, health_services_count, ... }
    """
    pass

@app.get("/api/near-me/suburb-search")
async def search_suburbs(q: str):
    """
    Autocomplete for suburb names. Returns matching Melbourne suburbs.
    Source: ABS SA2 list filtered to Greater Melbourne.
    """
    pass
```

### CoM API Proxy Implementation

The backend proxies requests to the City of Melbourne API so the frontend never calls external APIs directly:

```python
import httpx

COM_BASE = "https://data.melbourne.vic.gov.au/api/explore/v2.1/catalog/datasets"

async def fetch_com_landmarks(theme: str, limit: int = 50):
    """Fetch landmarks from CoM by theme (Health Services, Leisure/Recreation, etc.)"""
    url = f"{COM_BASE}/landmarks-and-places-of-interest-including-schools-theatres-health-services-spor/records"
    params = {
        "where": f'theme="{theme}"',
        "limit": limit,
    }
    async with httpx.AsyncClient() as client:
        resp = await client.get(url, params=params)
        data = resp.json()
        return [
            {
                "name": r["record"]["fields"].get("feature_name"),
                "type": theme,
                "address": r["record"]["fields"].get("description"),
                "lat": r["record"]["fields"].get("lat"),
                "lng": r["record"]["fields"].get("lon"),
            }
            for r in data.get("records", [])
        ]

async def fetch_com_cafes(clue_area: str = None, limit: int = 50):
    """Fetch cafés and restaurants from CoM CLUE data"""
    url = f"{COM_BASE}/cafes-and-restaurants-with-seating-capacity/records"
    params = {"where": "census_year=2023", "limit": limit}
    if clue_area:
        params["where"] += f' AND clue_small_area="{clue_area}"'
    async with httpx.AsyncClient() as client:
        resp = await client.get(url, params=params)
        data = resp.json()
        return [
            {
                "name": r["record"]["fields"].get("trading_name"),
                "type": "food",
                "address": r["record"]["fields"].get("street_address"),
                "lat": r["record"]["fields"].get("latitude"),
                "lng": r["record"]["fields"].get("longitude"),
                "seats_indoor": r["record"]["fields"].get("number_of_seats_indoor"),
                "seats_outdoor": r["record"]["fields"].get("number_of_seats_outdoor"),
                "industry": r["record"]["fields"].get("industry_anzsic4_description"),
            }
            for r in data.get("records", [])
        ]
```

### Demographic Snapshot Card

When a user selects a suburb, a card at the top shows:

```
┌─────────────────────────────────────────────┐
│  📍 Clayton                                  │
│                                              │
│  👥 2,847 young adults (18–25) live here     │
│  🏥 12 health services nearby                │
│  🍽️ 34 cafés & restaurants                   │
│  🌳 5 parks & recreation spots               │
└─────────────────────────────────────────────┘
```

The population number comes from ABS Census. The service counts come from live CoM API queries.

---

## Epic 4: Open Data Pipeline (ETL)

### Script 1: `ingest_census.py`

Downloads and processes ABS Census 2021 "Age by SA2" data for Melbourne SA2 areas.

```python
# Pseudocode for Census ETL

import pandas as pd
from sqlalchemy import create_engine

def ingest_census():
    # 1. Read ABS CSV (downloaded manually from ABS TableBuilder)
    df = pd.read_csv("data/abs_census_age_by_sa2_2021.csv")
    
    # 2. Filter to Melbourne SA2 areas
    melbourne_sa2s = [
        "Clayton", "Parkville", "Melbourne", "Carlton",
        "Fitzroy", "Richmond", "Southbank", "South Yarra",
        "Docklands", "North Melbourne", "Footscray",
        "Brunswick", "Hawthorn", "Kew", "St Kilda",
        # ... expand to cover Greater Melbourne
    ]
    df = df[df["sa2_name"].isin(melbourne_sa2s)]
    
    # 3. Aggregate 18-25 age columns
    age_cols = ["age_18", "age_19", "age_20", "age_21", "age_22", "age_23", "age_24", "age_25"]
    df["population_18_25"] = df[age_cols].sum(axis=1)
    
    # 4. Load into PostgreSQL
    engine = create_engine(DATABASE_URL)
    df[["sa2_code", "sa2_name", "population_18_25", "total_population"]].to_sql(
        "suburb_demographics", engine, if_exists="replace", index=False
    )

# Run: python scripts/ingest_census.py
```

### Script 2: `seed_articles.py`

Seeds the 15 initial articles into the database from markdown files:

```python
def seed_articles():
    articles_dir = "data/articles/"
    for md_file in Path(articles_dir).glob("*.md"):
        metadata = parse_frontmatter(md_file)  # title, category, summary, etc.
        content = parse_content(md_file)
        upsert_article(metadata, content)
```

### Script 3: `cache_com_data.py` (optional, recommended)

Pre-caches City of Melbourne API data into PostgreSQL so the app isn't fully dependent on live API calls:

```python
async def cache_landmarks():
    """Cache CoM landmarks locally for faster queries and offline resilience"""
    for theme in ["Health Services", "Leisure/Recreation", "Retail", "Education Centre"]:
        records = await fetch_com_landmarks(theme, limit=500)
        # Upsert into local cached_places table
        for r in records:
            upsert_place(r, source="com_landmarks")

async def cache_cafes():
    records = await fetch_com_cafes(limit=1000)
    for r in records:
        upsert_place(r, source="com_cafes")
```

### Database Schema Summary

```sql
-- Suburb demographics from ABS Census
CREATE TABLE suburb_demographics (
    id SERIAL PRIMARY KEY,
    sa2_code VARCHAR(20) UNIQUE,
    sa2_name VARCHAR(100),
    population_18_25 INT,
    total_population INT
);

-- Articles for First Time Guides
CREATE TABLE articles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    category VARCHAR(50) NOT NULL,
    summary TEXT NOT NULL,
    content TEXT NOT NULL,
    reading_time_min INT DEFAULT 3,
    data_widget_type VARCHAR(50),
    data_widget_config JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Cached places from CoM + NHSD (optional, for resilience)
CREATE TABLE cached_places (
    id SERIAL PRIMARY KEY,
    name VARCHAR(300),
    place_type VARCHAR(50),        -- health, food, bars, parks, amenities, groceries
    address TEXT,
    suburb VARCHAR(100),
    lat DECIMAL(10, 7),
    lng DECIMAL(10, 7),
    phone VARCHAR(50),
    metadata JSONB,                -- bulk_billing, seats, patron_capacity, etc.
    source VARCHAR(50),            -- com_landmarks, com_cafes, nhsd, manual
    fetched_at TIMESTAMP DEFAULT NOW()
);
```

---

## Epic 5: Responsive Design & Accessibility

**Data required:** None

**What to build:**

- Mobile-first Tailwind breakpoints: `sm:` (640px), `md:` (768px), `lg:` (1024px)
- Map collapses to full-width below list on mobile
- Touch targets ≥ 44px on all interactive elements
- Crisis lines footer always visible on every page
- Semantic HTML (`<main>`, `<nav>`, `<article>`) for screen readers
- Colour contrast ratio ≥ 4.5:1 (WCAG AA)

---

## Open Data Alignment Summary

This table maps every open dataset to the feature that uses it, so you can clearly articulate the open data strategy in presentations:

| Open Dataset | Source | Feature | Hindsight Insight | Foresight Insight |
|---|---|---|---|---|
| Landmarks & Places of Interest | CoM Open Data | Near Me (Health, Parks, Retail filters) | Shows where health services, parks, and retail are concentrated within CoM | As Melbourne's young adult population grows, gaps in service coverage become visible |
| Cafés & Restaurants (CLUE) | CoM Open Data | Near Me (Food filter) + "Cheap Eats" guide | Maps every dining option in CoM with seat counts — reveals food deserts and clusters | Can track year-over-year changes in food accessibility as new developments open |
| Bars & Pubs (CLUE) | CoM Open Data | Near Me (Social filter) | Shows social venue density and capacity across suburbs | |
| Public Toilets | CoM Open Data | Near Me (Amenities filter) | Shows accessibility-rated amenity coverage | |
| Drinking Fountains | CoM Open Data | Near Me (Amenities filter) | Maps free water access points | |
| Public BBQs | CoM Open Data | Near Me (Parks filter) + "Free Things To Do" guide | Highlights free social gathering infrastructure | |
| Social Indicators (CoMSIS) | CoM Open Data | "Feeling Lonely?" guide — inline stats | Reveals wellbeing and social connection rates by suburb and age | Declining connection rates signal growing need for tools like Minuri |
| ABS Census 2021 (Age by SA2) | ABS | Near Me demographic snapshot | Quantifies 18–25 population density by suburb | Growing cohort = growing demand for independent living support |
| NHSD Health Services | Healthdirect | Near Me (Health + Mental Health filters) | Comprehensive service directory with bulk-billing flags | |

**Total open datasets used: 9** (7 from City of Melbourne, 1 from ABS, 1 from Healthdirect NHSD)

---

## Development Task Breakdown

### Week 1 (of Iteration 1 build period)

| Task | Owner | Dependencies |
|---|---|---|
| Set up React + Vite + Tailwind project scaffold | Frontend | None |
| Set up FastAPI project + Supabase PostgreSQL | Backend | None |
| Write `ingest_census.py` ETL script | Backend/Data | ABS CSV downloaded |
| Write 5 highest-priority articles in markdown | Content/All | Article template agreed |
| Test CoM API endpoints (landmarks, cafés, bars) — confirm field names | Backend | None |
| Apply for NHSD API key | Backend | Application submitted |

### Week 2

| Task | Owner | Dependencies |
|---|---|---|
| Homepage + Navbar (US 1.1, 1.2) | Frontend | Project scaffold |
| Article list page with category filters + search (US 2.1, 2.2) | Frontend | API endpoint ready |
| Backend: `/api/articles` CRUD endpoints | Backend | DB schema + seed data |
| Backend: `/api/near-me` aggregation endpoint | Backend | CoM API proxy working |
| Write remaining 10 articles | Content/All | |
| `seed_articles.py` script | Backend | Article content ready |

### Week 3

| Task | Owner | Dependencies |
|---|---|---|
| Article detail page (US 2.3) + bookmarking (US 2.4) | Frontend | Article API |
| Near Me page: suburb search + list view (US 3.1, 3.3) | Frontend | Near Me API |
| Near Me: Leaflet.js map integration (US 3.4) | Frontend | Geocoded data |
| Near Me: demographic snapshot card (US 3.2) | Frontend + Backend | Census data ingested |
| Responsive testing + fixes (US 5.1) | Frontend | All pages built |
| Integration testing + acceptance criteria verification | All | All features |

---

## Key Decisions & Notes

1. **Melbourne-only scope is a strength.** The CoM Open Data Portal gives you 7 live, free API datasets with no key required. That's more open data than most FIT5120 teams use across their entire project.

2. **First Time Guides are not just articles.** The guides with `data_widget_type` set to `cafe_map`, `gp_finder`, or `landmark_map` pull live data inline. This means articles are enhanced by open data, not just linking to it — a clear differentiator.

3. **No login is intentional, not a limitation.** Bookmarks use localStorage. Near Me requires no state. Guides are public. This means zero friction for a first-time visitor, which is exactly what your personas need.

4. **NHSD API key is the main risk.** If the key doesn't arrive in time, fall back to the CoM Landmarks dataset (Health Services theme) which covers hospitals and major clinics within CoM, and manually curate a supplementary list of GPs/pharmacies for key suburbs (Clayton, Parkville, CBD, Carlton). Seed this into `cached_places` and you're covered.

5. **Crisis lines are not a feature — they're infrastructure.** Lifeline (13 11 14), Beyond Blue (1300 22 4636), and headspace (1800 650 890) appear on every page in a persistent footer strip. This is non-negotiable and directly supports your crisis prevention framing.