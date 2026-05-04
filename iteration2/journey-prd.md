# Journey Feature PRD

## Overview

Journey is a personalised 7-day guide plan for users who are new to Melbourne. It collects three inputs from the user, then uses them to sequence curated guides across the five Minuri topics into a day-by-day structure they can work through in their first week.

---

## User Flow

### 1. Onboarding — `/journey`

The user fills out a single-page form with three fields.

**Your moment**
The user picks a preset scenario or writes their own description (minimum 30 characters). Four presets are available:
- Just started uni
- First job in the city
- New to Australia
- Moved from another city

Selecting a preset pre-fills the textarea with a full-text description the user can edit. The "write your own" path starts with a blank textarea.

**Suburb**
A combobox that calls `/api/suburbs?q=` with a 250ms debounce (minimum 3 characters). The user must select a result from the dropdown to confirm their suburb. The field locks once confirmed; a "Change" button resets it.

**Topics**
Five toggle chips, one per Minuri topic. At least one must be selected.

Form validation requires all three fields to be satisfied before the submit button activates.

On submit, the state is saved to `sessionStorage` under key `minuri:journey:v1`, then after a 2.2s loading screen the user is redirected to `/journey/plan`.

---

### 2. Plan view — `/journey/plan`

Reads `journeyState` from session storage. If the state is absent (e.g. direct URL access), redirects back to `/journey`.

The plan is generated client-side by `buildWeekPlan(selectedTopics)` from `lib/journey-week.ts`.

The view renders:
- A hero section with the suburb name and the user's moment text (truncated to 120 characters) displayed as a pull quote
- A horizontal tab strip of day cards (Day 1–7), each labelled with the day number, topic icon, and short topic name
- A day content panel showing 2 guide cards for the active day, with a day-level narrative paragraph
- Previous/Next day navigation
- A sticky sidebar with:
  - `JourneyNearbyPanel` — nearby services relevant to the active day's topic
  - "This week at a glance" — a compact ordered list of all 7 days

---

## Plan Generation Algorithm

Implemented in `lib/journey-week.ts → buildWeekPlan()`.

**Input:** `selectedTopics: GuideTopicSlug[]`

**Topic ordering**
Selected topics are placed first (preserving the user's selection order), followed by the remaining topics. This is the only point where user input shapes the plan.

**Guide sorting**
All published guides are sorted by:
1. Topic priority (selected topics first)
2. Arc priority: `day-1` → `week-1` → `month-1`
3. `arcOrder` within each arc

**Day assignment**
The algorithm cycles through topics round-robin over 7 days. On each day it picks up to 2 guides from the current topic's queue. Already-used guide slugs are tracked and skipped. If a topic's queue is exhausted, the cycle skips to the next topic with remaining guides.

**Narrative**
Each day's contextual paragraph is looked up from a hardcoded `GUIDE_NARRATIVES` map keyed by the primary guide's slug. If no entry exists, the guide's `summary` field is used as a fallback. There are 32 entries in the map covering all current guides.

**Output:** `DayPlan[]` — up to 7 days, each with:
```ts
{
  day: number;
  theme: string;        // full topic name
  shortLabel: string;   // abbreviated label for the tab
  topicSlug: GuideTopicSlug;
  narrative: string;    // day-level contextual paragraph
  guides: Guide[];      // 1–2 guides
}
```

---

## State Management

Journey state is stored in `sessionStorage` (not `localStorage`) via the `useJourneyState` hook. This means:
- State is scoped to the current browser tab
- State is lost when the tab is closed
- No server-side persistence

State shape:
```ts
{
  yourMoment: string;
  suburb: string;
  selectedTopics: GuideTopicSlug[];
}
```

---

## Known Limitations

| Area | Current state |
|---|---|
| Personalisation | Only `selectedTopics` order affects the plan — the moment text and suburb do not influence which guides appear |
| Plan generation | Fully static and deterministic; no AI or backend involvement |
| Suburb relevance | Suburb is used only for the "Near Me" sidebar; it does not filter or contextualise guides |
| State lifetime | Cleared when the browser tab closes |
| Guide pool | Capped by the number of published guides per topic; days may be fewer than 7 if guides run out |
| Moment text | Stored and displayed back as a decorative quote; has no effect on plan output |
