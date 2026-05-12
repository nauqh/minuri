# Events & Community API — Research & Recommendations

**Date:** 2026-05-08  
**Feature:** Social connection — nearby events and community discovery  
**Target user:** Young international adults settling in Melbourne

---

## Context

Minuri's `social-belonging` topic already has 3 guides covering community, volunteering, and free events. This feature adds a **live, location-aware layer** — surfacing real events and recurring community spaces near the user's suburb.

Product philosophy constraint: **Recurring structures over transient events.** A language exchange group beats a one-off concert. A neighbourhood house beats a weekend market. Both tracks are valid, but depth matters more than novelty.

---

## API Landscape

### What We Evaluated

| API                             | Status        | Free Tier       | Best For                               | Verdict                            |
| ------------------------------- | ------------- | --------------- | -------------------------------------- | ---------------------------------- |
| **SerpAPI Google Events**       | Active        | 250 searches/mo | Broad event discovery across platforms | ✅ Use now                         |
| **City of Melbourne Open Data** | Active        | Free, no key    | Civic venues, community hubs (static)  | ✅ Use now                         |
| **Humanitix**                   | Active        | API key free    | Org-managed events (AU-native)         | ⏳ Partnership path                |
| **GoVolunteer**                 | No API        | —               | Volunteering roles in Melbourne        | ⏳ Curate manually                 |
| **Eventbrite**                  | ❌ Broken     | —               | —                                      | Public search dead since Feb 2020  |
| **Meetup**                      | ❌ Gated      | None            | —                                      | GraphQL API requires paid Pro plan |
| **PredictHQ**                   | ❌ Misaligned | 14-day trial    | Demand forecasting, not community      | Wrong use case                     |

---

## Recommendations

### Option A — SerpAPI Google Events (Start Here)

**Effort:** Low — already integrated in Near Me  
**Cost:** $0 (prototype), $25/mo at 1K searches  
**Timeline:** Ship in current iteration

SerpAPI is already wired into the backend for Near Me's place queries. The same infrastructure supports `engine=google_events` with no new API key or auth setup.

**Sample query params:**

```
engine=google_events
q=community events Melbourne
location=Melbourne, Victoria, Australia
gl=au
htichips=date:week
```

Google aggregates from Eventbrite, Humanitix, Facebook Events, and local news — so we get broad coverage without direct partnerships.

**What it covers:** One-off events — markets, cultural festivals, free gigs, workshops, community days  
**What it doesn't cover:** Recurring groups, ongoing community spaces

---

### Option B — City of Melbourne Open Data (Recurring Structures)

**Effort:** Low — free REST API, no key required  
**Cost:** Free  
**Timeline:** Ship in current iteration

Base URL: `https://data.melbourne.vic.gov.au/api/explore/v2.1/`

Relevant datasets:

| Dataset              | Use                                     |
| -------------------- | --------------------------------------- |
| Neighbourhood Houses | Recurring community hubs, free programs |
| Community Centres    | Locations + facilities                  |
| Libraries            | Free recurring programs, study spaces   |
| Parks & Gardens      | Physical third places                   |

These are **static civic datasets** — no live event schedules, but perfect for the "where can I go regularly" use case. Cache responses for 24 hours.

**What it covers:** Recurring, free, no-signup community infrastructure  
**What it doesn't cover:** Live events, private community groups

---

### Option C — Humanitix (Medium-Term Partnership Path)

**Effort:** Medium — requires org outreach  
**Cost:** Free (org shares API access)  
**Timeline:** Iteration 4+

Humanitix has no public discovery API — the REST API is scoped to events owned by your account. However, many Melbourne NFP orgs use Humanitix specifically because it donates ticketing fees to charity.

**Strategy:** Contact 5–10 Melbourne community orgs who use Humanitix. Ask them to share API access or co-list their events. The pitch is natural — Minuri sends them young international users actively looking for connection.

**Target orgs to approach:**

- AMES Australia (settlement services)
- Asylum Seeker Resource Centre (ASRC)
- Multicultural Arts Victoria
- University student unions (UniMelb, Monash, RMIT)
- Neighbourhood Houses Victoria

**What it unlocks:** Structured, org-vetted event data with booking links — higher trust than scraped Google results

---

### Option D — Curated Volunteer List (Static, No API)

**Effort:** Low — one-time JSON curation, quarterly refresh  
**Cost:** Free  
**Timeline:** Ship in current iteration

GoVolunteer (`govolunteer.com.au`) has no API but is the most complete Melbourne volunteering database. Curate a static list of 20–30 orgs, stored in `/public/`.

Several orgs are already mentioned in existing guides — this formalises them as linkable data.

**Seed orgs (from existing guides content):**

| Org                  | Category           |
| -------------------- | ------------------ |
| OzHarvest            | Food rescue        |
| Sacred Heart Mission | Community services |
| ASRC                 | Refugee support    |
| CERES                | Environment        |
| Lost Dogs' Home      | Animal welfare     |
| St Vincent de Paul   | Community services |
| Foodbank Victoria    | Food relief        |
| RSPCA Victoria       | Animal welfare     |

**Format:** JSON array in `/public/volunteering-orgs.json` with `name`, `category`, `url`, `suburb`, `description` fields.

---

## Build Order

### Phase 1 — MVP (Current Iteration)

1. **SerpAPI Google Events endpoint** — new route in existing backend pattern
    - Input: suburb name
    - Output: list of events this week near that suburb
    - Display: event cards in `social-belonging` Near Me view

2. **CoM Open Data — community venues** — static fetch, 24hr cache
    - Pull neighbourhood houses + community centres
    - Pin on Near Me map filtered to `social-belonging`

3. **Curated volunteer list** — JSON file, render as cards in guides or Near Me

### Phase 2 — Partnership (Iteration 4)

4. **Humanitix org outreach** — structured event feeds if traction warrants
5. **Meetup Pro** — reconsider if budget allows; best recurring group data in Melbourne

---

## UX Notes

Two distinct surfaces, not one:

| Surface                    | Data Source                  | User Intent                         |
| -------------------------- | ---------------------------- | ----------------------------------- |
| "What's on this week"      | SerpAPI Google Events        | Spontaneous, transient events       |
| "Where can I go regularly" | CoM Open Data + curated list | Ongoing community, recurring spaces |

The second surface is more aligned with Minuri's core philosophy and more useful for settlement. Don't collapse both into a single events feed — the recurring structures track deserves its own UI treatment.

---

## Cost Summary

| Source                      | Cost                             | Limit                   |
| --------------------------- | -------------------------------- | ----------------------- |
| SerpAPI                     | $0 prototype / $25/mo production | 250 searches/mo free    |
| City of Melbourne Open Data | Free                             | No limit                |
| GoVolunteer (curated)       | Free                             | Manual update quarterly |
| Humanitix                   | Free (partnership)               | Per org agreement       |

No new paid API required for MVP.
