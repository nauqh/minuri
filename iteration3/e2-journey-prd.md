# Journey Feature PRD

**Epic:** 5 — Personalised Journey  
**Date:** 2026-05-19  
**Status:** In Progress

---

## 1. Goal

Give every new arrival a personalised 7-day action plan built around their suburb, their moment, and the topics they need most — so that instead of browsing a library of guides they get a structured, emotionally grounded week that walks alongside them as they settle in.

### Page & component map

```
/journey (JourneyOnboarding)
  ├── MomentStep           ← preset cards + textarea
  ├── SuburbStep           ← combobox with suburb search
  └── TopicStep            ← 5 coloured topic cards

/journey/plan (JourneyPlanView)
  ├── LetterReveal         ← identity intro screen (letter + archetype + mantra)
  ├── DayStepperNav        ← 7-tab stepper with completion rings
  ├── DayContent           ← active day: narrative, guides, tasks, places
  │     ├── GuideAccordionRow    ← expandable guide card per day
  │     ├── TaskList             ← checkable one-action tasks
  │     └── JourneyDayPlaces     ← map + place cards (topic-scoped)
  ├── JourneyNearbyEvents  ← community events feed (suburb-scoped, week window)
  └── IdentityCard drawer  ← collectible card earned per completed day
```

---

## 2. Components in scope

| File | Responsibility |
|------|---------------|
| `components/journey/journey-onboarding.tsx` | 3-step onboarding form; submits to backend; saves state to localStorage |
| `components/journey/journey-plan-view.tsx` | 7-day plan shell: letter reveal → day stepper → day content → events |
| `components/journey/journey-day-places.tsx` | Topic-scoped map + place cards per day via `/api/nearby-interest` |
| `components/journey/journey-nearby-events.tsx` | Community events grid via `/api/nearby-events` |
| `components/journey/identity-card.tsx` | Collectible identity card earned as days are completed |
| `lib/journey/static-plans.ts` | Archetype-keyed static week plans (fallback when LLM unavailable) |
| `lib/journey/identity.ts` | `buildIdentityFromLLM` and `buildMockIdentity` |
| `lib/journey/week-plan-store.ts` | Save/load/resolve week plan from localStorage |
| `app/api/nearby-events/route.ts` | Proxy to backend `/api/nearby-events`; 5-min cache |

---

## 3. User Stories

---

### US-01 — Journey Onboarding

**As a** new arrival opening the Journey page,  
**I want** to describe my situation, confirm my suburb, and pick the topics I need most,  
**so that** the week plan I receive is built around where I actually am and what I actually need.

#### Acceptance Criteria

---

**AC-01-1 — Moment step: presets and free text**

> **Given** I open `/journey` for the first time  
> **When** the page loads  
> **Then** I see four preset moment cards (Just started uni, First job, Overseas, Another city) and a "Write your own" link below them

> **Given** I click a preset card  
> **When** the card activates  
> **Then** a textarea appears pre-filled with that preset's full text, which I can edit  
> **And** a check badge replaces the step number when the text reaches 30 characters

> **Given** I click "Write your own"  
> **When** the textarea appears empty  
> **Then** I see a placeholder: "I just moved to Melbourne and I'm trying to figure out..."  
> **And** an amber hint appears below the textarea showing characters remaining until the 30-char minimum

---

**AC-01-2 — Suburb step: search and confirm**

> **Given** I type at least 3 characters into the suburb field  
> **When** the dropdown appears  
> **Then** I see ranked suburb matches with locality name, state, and postcode  
> **And** I can navigate them with arrow keys and confirm with Enter

> **Given** I select a suburb from the dropdown  
> **When** the selection is confirmed  
> **Then** the input becomes read-only, a "Set to {suburb}" confirmation appears, and a "Change" button lets me reset

---

**AC-01-3 — Topics step and form submission**

> **Given** I click one or more topic cards  
> **When** each card activates  
> **Then** it scales up slightly, a check appears in the corner, and the footer counter decrements

> **Given** all three steps are complete  
> **When** I click "Build My Guide Journey"  
> **Then** the form transitions to a loading screen showing "Reading your story..." with a pulsing 🌱 and a grid of guide thumbnails for my selected topics  
> **And** the page navigates to `/journey/plan` once the plan is ready

#### Tasks

- Validate `yourMoment.length >= 30`, `hasConfirmedSuburb`, `selectedTopics.length >= 1` before enabling submit
- Loading screen: show guides filtered to `selectedTopics` as thumbnail grid
- On API failure: fall back to `buildStaticWeekPlan` + `buildMockIdentity` silently
- Persist `{ yourMoment, suburb, selectedTopics }` to localStorage before navigating

---

### US-02 — Identity Letter Reveal

**As a** user who has just submitted the onboarding form,  
**I want** to receive a short personalised letter that names who I am and what this week is for,  
**so that** I feel seen before I read a single guide.

#### Acceptance Criteria

---

**AC-02-1 — Letter reveal sequence**

> **Given** I land on `/journey/plan`  
> **When** the page loads  
> **Then** I first see the LetterReveal screen — not the week plan  
> **And** my identity's archetype name appears at the top, followed by a streaming letter body, then a mantra in italics

> **Given** the letter finishes streaming  
> **When** the final word appears  
> **Then** a "Begin my week →" button fades in  
> **And** clicking it transitions me to the week plan with a smooth fade

---

**AC-02-2 — Vibe accent colour**

> **Given** my identity has a palette  
> **When** the plan view mounts  
> **Then** `--vibe-accent` CSS variable is set to `identity.palette[0].hex`  
> **And** the day stepper rings, dividers, and CTA button all use this colour

#### Tasks

- `LetterReveal`: mount `MelbourneLetter` after 2.2s delay; show CTA only after `onComplete` fires
- `buildIdentityFromLLM`: map LLM `identity` response to `JourneyIdentity` shape
- `buildMockIdentity`: deterministic fallback from suburb + topics
- Set `--vibe-accent` in `useEffect` on `identity` change

---

### US-03 — Daily Guide and Task Experience

**As a** user on my journey plan,  
**I want** to navigate through 7 days, read the guide assigned to each day, and check off my one daily task,  
**so that** I make concrete progress without being overwhelmed.

#### Acceptance Criteria

---

**AC-03-1 — Day stepper navigation**

> **Given** I am on the plan view  
> **When** I look at the day stepper  
> **Then** I see 7 tabs, each showing the day number and a short label (e.g. "Home", "Food", "Transport")  
> **And** completed days show a filled completion ring using the vibe accent colour

> **Given** I click a day tab  
> **When** the tab activates  
> **Then** the day content animates in (fade + slight y rise) and the stepper scrolls to keep the active tab visible

---

**AC-03-2 — Day content: narrative, guides, tasks**

> **Given** I am viewing a day  
> **When** the content renders  
> **Then** I see: a topic icon, the day theme, a narrative paragraph, an italic "why today" line, and a vibe-accent divider  
> **And** below the divider: a Guides section and a Tasks section side by side on desktop, stacked on mobile

> **Given** I click a guide accordion row  
> **When** it expands  
> **Then** I see the guide thumbnail, description, reading time, and a "Read guide" link  
> **And** clicking the link navigates to `/guides/{slug}?from=journey`

> **Given** I check off a task  
> **When** the checkbox is toggled  
> **Then** the task text gets a strikethrough and the check persists across page refreshes  
> **And** once all tasks for a day are done, the identity card earn toast appears

#### Tasks

- `DayStepperNav`: scroll active tab into view on `activeDay` change using `scrollRef`
- `GuideAccordionRow`: controlled open state via `openGuides: Set<string>`; first guide open by default
- Task completion: stored in `completedTasks` Set, persisted via `useJourneyState`
- Card earn: `earnDay(day)` fires once per day via `earnedDaysRef` guard; shows `CardEarnToast`

---

### US-04 — Nearby Places Per Day

**As a** user viewing a day in my plan,  
**I want** to see a map of real places near my suburb that match that day's topic,  
**so that** I can immediately act on the guide by going somewhere relevant.

#### Acceptance Criteria

---

**AC-04-1 — Topic-scoped place map**

> **Given** I am viewing a day with topic "health-wellbeing"  
> **When** the `JourneyDayPlaces` section loads  
> **Then** I see a map centred on my suburb showing bulk-billing GPs and pharmacies  
> **And** a scrollable list of up to 5 place cards alongside the map  
> **And** clicking a card pin highlights it on the map and vice versa

> **Given** the topic is "social-belonging"  
> **When** the section heading renders  
> **Then** it reads "Find your people in {suburb}" instead of "Places to go today in {suburb}"

> **Given** no places are returned for my suburb and topic  
> **When** the fetch resolves empty  
> **Then** the section renders nothing (returns `null`) — no empty state shown

#### Tasks

- `TOPIC_NEAR_ME` map drives the query string sent to `/api/nearby-interest`
- `placesCache`: `Map<string, NearbyInterestRecord[]>` keyed by `${suburb}:${topicSlug}` — no duplicate fetches
- Section heading: conditional on `topicSlug === "social-belonging"`
- Subtitle: `pl-[14px]` indent to align under heading text past the accent bar

---

### US-05 — Community Events Discovery

**As a** user who has completed my 7-day plan,  
**I want** to see real community events happening near me this week,  
**so that** I have somewhere to go and someone to meet beyond the guided week.

#### Acceptance Criteria

---

**AC-05-1 — Events feed below the plan**

> **Given** I am on my journey plan page  
> **When** I scroll past the day navigation  
> **Then** I see a "Community events near {suburb}" section with a teal left accent bar  
> **And** below the heading: "Feeling settled takes time — but it starts with showing up somewhere. These events are happening near you this week. You don't need to know anyone to go."

> **Given** the events API returns results  
> **When** the feed renders  
> **Then** I see up to 8 events in a 2-column grid (1-column on mobile)  
> **And** each item shows: a small thumbnail (112px, upscaled via wsrv.nl), date in teal caps, bold title with an ArrowUpRight icon, time · day-of-week, venue name, and 2-line description

> **Given** I hover over an event card  
> **When** the cursor enters  
> **Then** the card background shifts to `minuri-fog/60`, the title turns teal, and the ArrowUpRight icon translates up-right  
> **And** clicking anywhere on the card opens the event's booking link in a new tab

> **Given** the thumbnail URL is from a low-quality source  
> **When** the image renders  
> **Then** it is proxied through `wsrv.nl` at 240×240 with `sharp=3` and WebP output  
> **And** if `thumbnail` is null, a coloured gradient fallback fills the image slot

#### Tasks

- `app/api/nearby-events/route.ts`: proxy to `MINURI_SERVER_BASE/api/nearby-events?suburb=`; 5-min cache
- `fetchNearbyEvents`: same pattern as `fetchNearbyInterest`; normalise array vs `{ results }` shape
- `upscale(url)`: `wsrv.nl` proxy with `w=240&h=240&fit=cover&output=webp&q=90&sharp=3`
- `parseWhen`: extract `{ date, dayTime }` from "Tue, 19 May, 9:30 am – 12:30 pm"
- Gradient fallback: 6-colour array cycling by index; used when `event.thumbnail` is null
- Backend: filter `encrypted-tbn0.gstatic.com` and `maps/vt/data` thumbnails → return null (pending)

---

## 4. Responsive Behaviour

| Component | Mobile | Tablet (md) | Desktop |
|-----------|--------|-------------|---------|
| Onboarding topic cards | 1-col | 3-col | 5-col |
| Moment preset cards | 1-col | 2-col | 2-col |
| Day stepper | horizontal scroll | horizontal scroll | horizontal scroll |
| Guides + Tasks | stacked | side by side | side by side (`flex-[1]` + `w-72`) |
| JourneyDayPlaces map | 260px tall, stacked | side by side 480px | side by side 480px |
| JourneyNearbyEvents grid | 1-col | 2-col | 2-col |
| Thumbnail size | 96px | 112px | 112px |

---

## 5. Accessibility

- Onboarding topic buttons: `role="checkbox"` + `aria-checked={isSelected}`
- Suburb input: `role="combobox"`, `aria-expanded`, `aria-controls`, `aria-activedescendant`
- Moment textarea: `aria-describedby="moment-hint"` when character hint is visible
- `JourneyDayPlaces` map: loaded via `dynamic` with `ssr: false`; loading spinner as fallback
- `JourneyNearbyEvents` section: `aria-label="Community events near {suburb}"`
- Event cards: `<a>` with `target="_blank" rel="noopener noreferrer"`; `ArrowUpRight` has `aria-hidden`
- Identity card drawer: focusable, closeable via header button
- All `motion` animations guarded by `prefersReducedMotion` with `duration: 0.01` fallback

---

## 6. File Checklist

```
app/
  journey/page.tsx                     ← renders JourneyOnboarding
  journey/plan/page.tsx                ← renders JourneyPlanView
  api/nearby-events/route.ts           ← proxy to backend nearby-events

components/journey/
  journey-onboarding.tsx               ← 3-step form
  journey-plan-view.tsx                ← 7-day plan shell + letter reveal
  journey-day-places.tsx               ← topic-scoped map + place cards per day
  journey-nearby-events.tsx            ← community events feed
  journey-nearby-panel.tsx             ← exists, unused (topic prop added)
  identity-card.tsx                    ← collectible card UI
  card-earn-toast.tsx                  ← toast on day completion
  melbourne-letter.tsx                 ← streaming letter component

lib/
  near-me-api.ts                       ← NearbyEventRecord type + fetchNearbyEvents
  journey/identity.ts                  ← buildIdentityFromLLM, buildMockIdentity
  journey/static-plans.ts              ← archetype-keyed fallback plans
  journey/week-plan-store.ts           ← save/load/resolve week plan

hooks/
  use-journey-state.ts                 ← localStorage persistence (minuri:journey:v2)
  use-identity-state.ts                ← identity + card state
```

---

## 7. Open Questions

| Question | Status |
|----------|--------|
| Backend thumbnail filtering | `encrypted-tbn0` and `maps/vt/data` thumbnails should be nulled in backend response — frontend workaround via `wsrv.nl` is active but not ideal |
| `JourneyNearbyPanel` | Component exists with `topic` prop but is not rendered anywhere — remove or repurpose |
| Event save / bookmarking | Heart icon removed from events feed; no persistence for events yet — intentional for now |
| `/api/nearby-events` topic scoping | Current endpoint is suburb-only; future: add topic param to filter events by relevance to the active day |
| Week plan LLM cost | Every onboarding submit calls the LLM journey endpoint; no caching per suburb+topics combination |
| `alreadySorted` checklist | Removed from onboarding in this iteration — `JourneyState` shape in memory may be outdated |
