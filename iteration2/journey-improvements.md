# Journey Feature — Improvement Ideas

## Core Problem

The UI implies "a personalised plan built around your situation" but delivers topic-reordering with static guide pairs. The moment text, suburb, and living context have no effect on which guides appear or how they're framed.

---

## 1. Richer Onboarding Inputs

| Input | Options | Why it matters |
|---|---|---|
| Living situation | Alone / with housemates / with family | Changes which guides are urgent (bond docs, utility splitting) |
| Budget level | Tight / moderate / comfortable | Surfaces free/cheap alternatives first |
| Already sorted | Checklist: Myki, GP, bank, SIM card, lease | Skip days the user doesn't need |
| Transport access | Public transport / bike / car | Changes the getting-around guides entirely |
| Student or working | Student / working / both | Determines super, student discounts, admin relevance |

The "already sorted" checklist is the highest-value addition — it makes the plan feel like it actually listened.

---

## 2. Redesign the Day Structure — "Read → Act → Go"

Each day should have three zones instead of two guide cards:

```
┌─────────────────────────────────────────┐
│  Day 3 · Home & Admin                   │
│  "Your lease is the foundation..."       │
│                                         │
│  📖 READ                                │
│  One guide card — the most important    │
│  thing to understand today              │
│                                         │
│  ✅ YOUR TASK                           │
│  A single concrete action sentence.     │
│  e.g. "Take 15 photos of your room      │
│  and email them to yourself today."     │
│                                         │
│  📍 NEAR YOU IN [SUBURB]               │
│  2–3 inline place cards, topic-matched │
└─────────────────────────────────────────┘
```

- **One guide per day** (not two) — forces curation of the most important one
- **One task** — a single sentence the user can act on today
- **Inline near-me** — places move from the sidebar into the day content

---

## 3. Inline Near-Me Integration

Move near-me out of the sidebar and into each day, driven by the day's topic and the user's suburb.

| Day topic | Near-me query |
|---|---|
| health-wellbeing | Bulk-billing GPs near suburb |
| home-admin | Tenancy advice / legal aid near suburb |
| food-eating | Cheap supermarkets + community meals near suburb |
| getting-around | Myki top-up points + train stations near suburb |
| social-belonging | Community centres / volunteering near suburb |

Label: **"Places to go today in [Suburb]"** — makes the guide immediately actionable.

The sidebar becomes a week progress tracker instead.

---

## 4. Progress Tracking + Persistence

- Move state from `sessionStorage` → `localStorage` so the plan survives tab close
- **Day completion** — "Mark as done" button per day; completed days show a tick on the tab strip
- **Task checkbox** — single checkbox for the daily action; small celebration on tick
- **Bookmarks carry over** — guides bookmarked from Near Me surface in the journey view

---

## 5. Deliberate Week Arc (Replace Round-Robin)

Replace the mechanical topic cycle with an opinionated narrative structure:

| Day | Focus | Logic |
|---|---|---|
| 1 | Survival basics | Food + getting home safe — always first, regardless of topic selection |
| 2 | Admin foundation | Highest-priority selected admin topic |
| 3–4 | Chosen priorities | User's top 2 selected topics, one per day |
| 5 | Health baseline | Register a GP, know urgent care options |
| 6 | Social / community | One anchor point, even for introverts |
| 7 | Settle in | Routine-building, reflection, what's next |

Day 1 is always survival-first regardless of what the user selected.

---

## 6. Make the Moment Text Do Work

**Option A — Keyword scoring (no AI, can build now)**
Parse the moment text for signals and adjust guide weights:

| Keyword | Effect |
|---|---|
| "international", "overseas" | Bump Medicare + banking guides to earlier days |
| "budget", "broke", "afford" | Prioritise free/cheap-eats and bulk-billing guides |
| "alone", "by myself" | Surface social-belonging day earlier |
| "uni", "student" | Prioritise student discounts, campus transport guides |
| "anxious", "overwhelmed" | Surface crisis lines + mental health guides |

**Option B — Claude API personalisation (bigger lift, high impact)**
Send moment text + all inputs to Claude. Ask it to:
1. Select and order guides from the static catalog
2. Write one personalised narrative sentence per day

The guide catalog stays static — Claude only selects and sequences. Produces genuinely different plans for genuinely different people.

---

## Build Priority

| Priority | Item | Effort | API needed |
|---|---|---|---|
| 1 | Inline near-me per day | Low | No |
| 2 | "Already sorted" checklist in onboarding | Low | No |
| 3 | Day completion + localStorage persistence | Low | No |
| 4 | One guide + one task per day | Medium | No |
| 5 | Deliberate week arc | Medium | No |
| 6 | Keyword scoring on moment text | Medium | No |
| 7 | Claude API personalisation | High | Yes — Claude API |

Items 1–6 are purely frontend with no new APIs required.
