# Journey Feature — Improvement Plan

## What Is Happening Now

### Input flow

1. **Moment** — 4 preset cards + "write your own" (30 char min)
2. **Suburb** — autocomplete search
3. **Topics** — 5 cards, pick ≥1

Posts to `/journey` backend with `{ suburb, your_moment, selected_topics }`.

### What the backend returns

- `identity`: species (4 archetypes), vibe color/name, letter body, suburb_line
- `week_plan`: 7 days, each with theme, narrative, topic slug, 2 guide slugs, tasks[], memory_line

### What the plan view surfaces

- Hero: suburb in title, truncated moment as italic quote
- 7-day stepper — guide accordion + task checklist per day
- "Nearby places" section per day (topic + suburb)
- Side drawer (hidden behind "My card"): archetype, traits radar, mantra, letter, constellation progress

---

## Diagnosed Problems

### 1. Duplicate moment presets
Two of the four presets are near-identical uni scenarios:
- id 1: "Just started uni" — everything new, first week
- id 3: "First year of uni" — still overwhelming, first year

Same archetype, barely different fullText. Wastes a slot that could cover a meaningfully different newcomer type.

### 2. Inputs don't feel causal
User selects topics → presses submit → gets a plan. Nothing in the form explains how selections produce a specific outcome. The plan arc is driven by a 4-species classification (pioneer / settler / builder / openheart) mapped from a single priority topic — picking 3 topics barely differs from picking 1.

### 3. The identity output is buried
The most personalized content — the letter, archetype, trait radar — lives inside a slide-out drawer. Most users will never open it. The hero shows the user's own input back to them (truncated moment), not the LLM's output.

### 4. Days don't acknowledge the why
Each day narrative is well-written but generic to the species. Nothing says "because you're just arriving from overseas" or "since transport is your priority, we front-loaded Day 2." The connection between input and output is invisible.

### 5. Suburb is acknowledgment, not signal
Suburb appears in the hero title and filters nearby places — but doesn't shape guide selection, task wording, or day narratives. Clayton vs. Fitzroy produces identical plan text.

### 6. No "already sorted" awareness
A user who arrived 2 weeks ago and already has a Myki gets the same plan as someone who landed yesterday. The plan has no skip-what-you've-done logic.

---

## What We Will Do

### Fix 1 — Replace the duplicate uni preset

Replace id 3 ("First year of uni") with **"Just moved from overseas"**.

**Why:** Most distinct from the other three. Unique practical needs — Medicare eligibility, no Australian credit history, international SIM, visa-aware budgeting, potential English-as-second-language context.

```ts
{
  id: 3,
  icon: "✈️",
  headline: "Just moved from overseas",
  preview:
    "Australia is still very new — I'm figuring out things like Medicare, banking, and how everything works here.",
  fullText:
    "I've just moved to Melbourne from overseas and there's a lot I don't understand yet. I need to get a local SIM, figure out Medicare and whether I'm eligible, open a bank account, and learn how to get around — all while adjusting to a completely different city and system.",
},
```

---

### Fix 2 — Add one signal question: time in Melbourne

After suburb selection, add a single-choice question:

> "How long have you been in Melbourne?"
> - Just arrived (less than a week)
> - A couple of weeks
> - About a month
> - A few months

**How:** Add `time_in_melbourne` field to `journeyState` and POST it to the backend. Backend uses it to adjust narrative urgency (arrival tone vs. settling tone) and skip already-covered admin.

Frontend: render as radio/button group below suburb confirm, before topic cards. No new step — inline in existing form.

---

### Fix 3 — Reframe topics as urgency statements

Replace abstract category labels with first-person needs:

| Current label | New label |
|---|---|
| Food & Eating | "I need to sort groceries and eating on a budget" |
| Getting Around | "I need to figure out transport and getting around" |
| Health & Wellbeing | "I need a GP and to understand the health system" |
| Home & Admin | "I need to sort rent, bills, and admin paperwork" |
| Social & Belonging | "I want to meet people and stop feeling isolated" |

Keep the same `GuideTopicSlug` values — purely a label change. Makes selection feel like expressing a real need rather than picking a category.

---

### Fix 4 — Surface the identity letter in the plan hero

Move the letter from the drawer to the plan hero, between the subtitle and Day 1.

```
Your first week in Brunswick
────────────────────────────────────────
"You arrived with courage..."          ← truncated moment (keep)

┌── A letter for you ──────────────────┐
│ You arrived ready to figure things   │
│ out — even if you don't fully know   │
│ it yet. Brunswick suits that...      │
│                                      │
│ [Read more]                          │
└──────────────────────────────────────┘

Day 1 · Arrive & Sort
```

Collapsed by default, first 2 sentences visible, expand on click. The drawer retains the full identity card (traits, constellation, stamps).

**How:** Read `identity.letter.body` in `JourneyPlanView`, render a collapsible block above the day stepper.

---

### Fix 5 — "Why today?" micro-copy per day

One line below each day narrative connecting it to the user's inputs:

> *Based on your transport focus — getting mobile early frees up the rest of the week.*

**How:** Backend already produces `narrative` per day. Add a `why_line` field to `DayPlanLLM` (nullable). Frontend renders it in `DayContent` below the narrative paragraph, in a lighter style. If null, render nothing.

Alternatively: derive it purely frontend from `plan.topicSlug` + `journeyState.selectedTopics` — no backend change needed for a first pass.

---

### Fix 6 — "Already sorted" checklist in onboarding

Add an optional checklist step after topics:

> "What have you already sorted? (skip these from your plan)"
> ☐ Myki card  ☐ GP / Medicare  ☐ Bank account  ☐ SIM card  ☐ Lease signed

**How:** Add `already_sorted: string[]` to the POST body. Backend filters matching guide slugs from day plans or reorders them to later days. Frontend: simple checkbox group, collapsible ("Already have some things sorted? Tell us →").

---

### Fix 7 — Show live plan preview when topics are selected

When ≥1 topic is selected, show a preview line below the topic grid:

> "Your plan will prioritise health on Day 1, then transport and food."

**How:** Derive from `selectedTopics` using the `SPECIES_PLANS` priority order — pure frontend logic, no API call.

---

## How (Implementation Order)

| # | Change | File(s) | Effort | Backend? |
|---|---|---|---|---|
| 1 | Replace preset id 3 | `journey-onboarding.tsx` | XS | No |
| 2 | Topic labels → urgency statements | `journey-onboarding.tsx` | XS | No |
| 3 | Surface letter in plan hero | `journey-plan-view.tsx` | S | No |
| 4 | "Why today?" from topic slug (frontend derive) | `journey-plan-view.tsx` | S | No |
| 5 | Live plan preview from topic selection | `journey-onboarding.tsx` | S | No |
| 6 | Add time_in_melbourne field + POST it | onboarding + backend | M | Yes |
| 7 | "Already sorted" checklist + backend filter | onboarding + backend | M | Yes |
| 8 | Suburb-personalized task wording | backend prompt | M | Yes |

Items 1–5 are pure frontend, no backend touch. Start there.
