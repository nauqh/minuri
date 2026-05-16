# Journey Identity Card — PRD 2.0

**Epic:** AI-Powered Living Identity Card
**Date:** 2026-05-16
**Status:** Proposal

---

## Goal

Turn a new arrival's life moment — a single paragraph of free text — into a beautiful, evolving identity card that grows with them across their 7-day Melbourne journey.

On Day 0, the card is born: sparse, muted, full of potential. Each day they complete earns something new onto the card — a star, a stamp, a memory line, a brighter palette. By Day 7 the card is a vibrant, personal artifact of their first week in Melbourne. Something worth keeping. Something worth sharing.

```
┌─────────────────────────────────────────────────────┐
│  ONBOARDING COMPLETE                                │
│         ↓                                          │
│  [ AI generates JourneyIdentity JSON ]             │
│         ↓                                          │
│  [ Reveal Screen — streaming animation ]           │
│         ↓                                          │
│  [ Living Card — Day 0, sparse ]                   │
│         ↓  ↓  ↓  ↓  ↓  ↓  ↓                       │
│  [ Day completions earn card updates ]             │
│         ↓                                          │
│  [ Day 7 — full card, shareable artifact ]         │
└─────────────────────────────────────────────────────┘
```

---

## What's New in 2.0

The existing Journey plan (`/journey/plan`) generates a deterministic 7-day schedule from the user's onboarding data. This PRD adds a parallel AI identity layer — a structured LLM output that drives a visual card system, a cinematic reveal screen, and a day-by-day progression mechanic.

No existing journey logic is replaced. The identity card is additive.

---

## Components in Scope

| File | Responsibility |
|---|---|
| `app/api/journey/identity/route.ts` | Streams `JourneyIdentity` JSON from LLM |
| `components/journey/identity-reveal.tsx` | Full-screen cinematic reveal on onboarding completion |
| `components/journey/identity-card.tsx` | The living card — renders all identity fields, handles day state |
| `components/journey/identity-card-back.tsx` | Card back — 7 memory lines |
| `components/journey/card-earn-toast.tsx` | Micro-animation that fires when a day is completed |
| `components/journey/trait-radar.tsx` | Animated radar/spider chart for 4 trait scores |
| `components/journey/palette-swatch.tsx` | 3-color swatch reveal with names |
| `components/journey/constellation.tsx` | 7-star constellation that fills day by day |
| `lib/journey/identity.ts` | Types, localStorage persistence, day-earn logic |
| `lib/journey/identity-prompt.ts` | LLM prompt builder |

---

## AI Output Shape

The LLM generates a single structured `JourneyIdentity` object from the user's onboarding data. All fields are required.

```typescript
type JourneyIdentity = {
  archetype: string           // e.g. "The Quiet Pioneer"
  mantra: string              // 5–8 words, e.g. "Roots grow slowly. That's okay."
  symbol: string              // single emoji, e.g. "🌱"
  mood: string                // metaphorical weather, e.g. "partly cloudy with warmth breaking through"
  suburb_line: string         // e.g. "Fitzroy: creative, a bit chaotic, deeply warm"
  palette: [                  // exactly 3 colors
    { hex: string; name: string },
    { hex: string; name: string },
    { hex: string; name: string }
  ]
  traits: {
    courage:      number      // 0–100
    curiosity:    number      // 0–100
    social:       number      // 0–100
    independence: number      // 0–100
  }
  final_mantra: string        // rewritten mantra for Day 7 completion,
                              // e.g. "You've taken root."
}
```

### LLM Inputs

The prompt is built from the user's `JourneyState`:

| Input | Used for |
|---|---|
| `yourMoment` | Primary signal — drives archetype, traits, mantra, mood |
| `suburb` | Drives `suburb_line` and palette tone |
| `selectedTopics` | Informs trait weighting |
| `alreadySorted` | Informs courage/independence baseline |

### Prompt Constraints

- Response must be valid JSON, no prose wrapping
- `archetype` max 4 words
- `mantra` and `final_mantra` must differ meaningfully
- `palette` colors must work together as a gradient (avoid clashing hues)
- `symbol` must be a single printable emoji
- `traits` values must sum to ≥ 200 (no flat distribution)

---

## Day Progression — What Gets Earned

The card starts sparse on Day 0 and earns new visual elements as each day is marked complete. Completion is determined by the existing `minuri:journey:tasks:v1` localStorage key.

| Day | Theme | Card Earn |
|---|---|---|
| 0 | Onboarding complete | Card created — archetype, symbol (dim), palette (30% saturation), empty trait bars, 7 empty star slots, title: **"Newcomer"** |
| 1 | Survival Basics | First star lights (gold) · palette → 45% saturation · first stamp: **"First Night"** · independence trait animates to baseline |
| 2 | Admin Foundation | Second star · second stamp: **"Settled In"** · independence trait +10 · card border gains first decoration detail |
| 3 | Priority Topic A | Third star · palette → 60% saturation · title upgrades to **"Finding My Feet"** · curiosity trait animates |
| 4 | Priority Topic B | Fourth star · a previously hidden card element unlocks (background texture or border pattern) · courage trait animates |
| 5 | Health Baseline | Fifth star · symbol begins glowing · health subtly reflected in social trait |
| 6 | Social & Belonging | Sixth star · social trait fills · suburb_line gains a warmth badge · palette → 85% saturation |
| 7 | Build Your Routine | All 7 stars form full constellation · palette → 100% saturation · mantra rewrites to `final_mantra` · title upgrades to **"Melbourne Local"** · card fully unlocked · share prompt appears |

### Day Memory Lines

After each completed day, the LLM generates one short memory sentence that is added to the **card back**. By Day 7 the back holds 7 lines — a personal diary of the week.

```
Day 1 → "The evening you figured out what was in the fridge."
Day 2 → "The afternoon you got your Medicare card sorted."
Day 6 → "The first time you said hi to someone at the café."
Day 7 → "The week you became a Melburnian."
```

Memory lines are generated at day-completion time, not pre-generated, so they can reference tasks the user actually checked off.

---

## Reveal Screen

The reveal screen appears immediately after the user submits the onboarding form. It is the first moment they see their identity. It should feel cinematic.

### Reveal Sequence

```
0.0s   Background fades in with mood-mapped animation (particles / light rays / soft fog)
0.4s   Palette floods in as a gradient behind everything
1.0s   Symbol scales up from center, pulses once
1.6s   Archetype title types in letter-by-letter
2.2s   Suburb line slides up beneath the archetype
2.8s   Mantra fades in word-by-word below
3.5s   Trait radar animates — each axis extends to its value
4.4s   Palette swatches bloom open (3 circles, left to right) with color names
5.2s   "Begin Your Journey →" button pulses in
```

Reduced motion: all animations collapse to a single cross-fade at 0.3s. No sequencing.

### Mood → Animation Mapping

| Mood keyword | Animation style |
|---|---|
| cloudy / overcast | slow drifting particle fog |
| warm / sunny | soft light-ray bloom from top |
| rainy / stormy | gentle vertical streak particles |
| golden / sunset | radial warm gradient pulse |
| calm / quiet | barely-moving slow blur drift |
| bright / energetic | fast particle scatter and settle |

The LLM `mood` field is matched against these keywords. Unmatched moods fall back to calm.

---

## The Living Card — Visual Anatomy

### Front

```
┌──────────────────────────────────────┐
│  ✦ ✦ ✦ ✦ ✦ ✦ ✦   ← constellation   │
│                                      │
│         🌱                           │  ← symbol (glows Day 5+)
│                                      │
│   THE QUIET PIONEER                  │  ← archetype (large)
│   Fitzroy · creative, a bit chaotic  │  ← suburb_line
│                                      │
│   "Roots grow slowly. That's okay."  │  ← mantra (updates Day 7)
│                                      │
│   [radar chart]                      │  ← traits, 4 axes
│                                      │
│   ● Melbourne Blue                   │
│   ● Laneway Gold     ← palette       │
│   ● Night Arrival    swatches        │
│                                      │
│   [  ✦  ] [  ✦  ] [  ✦  ]  ← stamps │
│   Newcomer               ← title     │
└──────────────────────────────────────┘
```

### Back (unlocks Day 1+)

```
┌──────────────────────────────────────┐
│  Your Week                           │
│  ─────────────────────────────────   │
│  Day 1 · The evening you figured...  │
│  Day 2 · The afternoon you got...    │
│  Day 3 · ░░░░░░░░░░░░░░░░░░░░░░░    │  ← locked until day complete
│  Day 4 · ░░░░░░░░░░░░░░░░░░░░░░░    │
│  Day 5 · ░░░░░░░░░░░░░░░░░░░░░░░    │
│  Day 6 · ░░░░░░░░░░░░░░░░░░░░░░░    │
│  Day 7 · ░░░░░░░░░░░░░░░░░░░░░░░    │
└──────────────────────────────────────┘
```

Locked lines show blurred placeholder text until that day is completed.

---

## User Stories

### US-01 — Identity Generation on Onboarding Complete

**As a** new arrival who has just submitted the onboarding form,
**I want** to see a cinematic reveal of my personal identity,
**so that** I feel seen and excited to begin my week.

#### Acceptance Criteria

---

**AC-01-1 — Reveal triggers immediately after onboarding submit**

> **Given** I have completed all three onboarding steps and tapped "Build my plan"
> **When** the API call to `/api/journey/identity` resolves
> **Then** the reveal screen renders full-screen over the onboarding form
> **And** the mood animation begins within 400ms

---

**AC-01-2 — All identity fields are populated**

> **Given** the LLM returns a valid `JourneyIdentity` JSON
> **When** the reveal sequence completes
> **Then** archetype, symbol, mantra, suburb_line, palette, and trait radar are all visible
> **And** no field displays a placeholder or loading state

---

**AC-01-3 — LLM failure falls back gracefully**

> **Given** the `/api/journey/identity` call fails or times out after 8s
> **When** the error is caught
> **Then** the reveal screen does not appear
> **And** the user is taken directly to `/journey/plan` with no error message shown
> **And** the card renders with a deterministic fallback identity derived from `selectedTopics` and `suburb`

---

**AC-01-4 — Reduced motion is respected**

> **Given** the user has `prefers-reduced-motion: reduce` set
> **When** the reveal screen loads
> **Then** all sequential animations are replaced with a single 300ms cross-fade
> **And** no looping background animation plays

---

### US-02 — Living Card Visible Throughout Journey

**As a** user partway through my 7-day journey,
**I want** to see my identity card on the plan page,
**so that** I can track what I've earned and feel motivated to continue.

#### Acceptance Criteria

---

**AC-02-1 — Card is accessible from the plan view**

> **Given** I am on `/journey/plan`
> **When** the page loads
> **Then** my identity card is visible — either inline or via a persistent card icon/button
> **And** it reflects my current day completion state

---

**AC-02-2 — Card state persists across sessions**

> **Given** I completed Day 1 yesterday and return today
> **When** the plan page loads
> **Then** my card still shows the Day 1 earned elements (first star, first stamp, trait value)
> **And** I do not need to re-complete Day 1

---

**AC-02-3 — Palette colors theme the journey plan**

> **Given** my identity palette has been generated
> **When** I view `/journey/plan`
> **Then** my three palette colors are applied as CSS custom properties
> **And** they influence card backgrounds, accent colors, and highlight states throughout the plan view

---

### US-03 — Day Completion Earns Card Update

**As a** user who has just checked off all tasks on a day,
**I want** to see my card visibly update,
**so that** completing a day feels rewarding and meaningful.

#### Acceptance Criteria

---

**AC-03-1 — Earn animation fires on day completion**

> **Given** I have checked off all tasks for Day N
> **When** the final task checkbox is ticked
> **Then** a card earn animation plays — the new star lights, the stamp appears, the relevant trait extends
> **And** the animation completes within 2s
> **And** the card reflects the new state afterward

---

**AC-03-2 — Memory line is generated and added to card back**

> **Given** I have completed Day N
> **When** the earn animation plays
> **Then** a POST request is made to `/api/journey/memory` with my completed task IDs and day theme
> **Then** the LLM returns a single memory sentence
> **And** it is added to the corresponding slot on the card back

---

**AC-03-3 — Memory line generation failure does not block the earn flow**

> **Given** the memory line API call fails
> **When** the error is caught
> **Then** the earn animation still plays in full
> **And** the card back shows a deterministic fallback line for that day
> **And** no error is surfaced to the user

---

### US-04 — Card Flip Interaction

**As a** user who wants to read my journey memories,
**I want** to flip my identity card to see the back,
**so that** I can reflect on what I've done this week.

#### Acceptance Criteria

---

**AC-04-1 — Card flips on tap/click**

> **Given** I am viewing my identity card (front)
> **When** I tap the card or a "flip" affordance
> **Then** a 3D CSS flip animation plays (600ms)
> **And** the card back is revealed with my memory lines

---

**AC-04-2 — Locked memory lines are visually distinct**

> **Given** I have completed 3 of 7 days
> **When** I view the card back
> **Then** Days 1–3 show their memory lines in full
> **And** Days 4–7 show blurred/obscured placeholder text
> **And** no placeholder text is legible

---

### US-05 — Day 7 Completion — Full Unlock and Share

**As a** user who has completed all 7 days,
**I want** to see my card reach its final, fully unlocked state,
**so that** I feel a strong sense of achievement and want to share it.

#### Acceptance Criteria

---

**AC-05-1 — Day 7 triggers full card unlock**

> **Given** I have marked all tasks complete on Day 7
> **When** the final earn animation plays
> **Then** all 7 stars form the full constellation
> **And** the palette reaches 100% saturation
> **And** the mantra updates to `final_mantra`
> **And** the card title changes to "Melbourne Local"

---

**AC-05-2 — Share prompt appears after Day 7 unlock**

> **Given** the Day 7 unlock animation has completed
> **When** the screen settles
> **Then** a share prompt appears: "Your card is complete. Share your week."
> **And** tapping it renders a screenshot-optimised card layout
> **And** the native share sheet or a download option is offered

---

**AC-05-3 — Shareable card includes front only**

> **Given** I trigger the share flow
> **When** the shareable image is generated
> **Then** it shows the card front at full saturation with all earned elements
> **And** it does not include the card back, nav UI, or task lists

---

## State Management

`JourneyIdentity` is persisted to localStorage under `minuri:journey:identity:v1`.

```typescript
type IdentityStore = {
  identity: JourneyIdentity
  cardState: {
    daysCompleted: number[]           // [1, 2, 3] — which days are done
    saturation: number                // 30–100, derived from daysCompleted.length
    titleTier: 'newcomer' | 'finding-my-feet' | 'settling-in' | 'melbourne-local'
    stampsEarned: string[]            // stamp slugs in order earned
    memoryLines: Record<number, string> // { 1: "...", 2: "..." }
    traitValues: {                    // starts at identity.traits baseline, grows with days
      courage: number
      curiosity: number
      social: number
      independence: number
    }
    constellationLit: number          // 0–7, stars lit
    symbolGlowing: boolean            // true from Day 5
    fullyUnlocked: boolean            // true after Day 7
  }
}
```

---

## API Routes

### `POST /api/journey/identity`

Generates the full `JourneyIdentity` from onboarding data.

**Request body:**
```typescript
{
  yourMoment: string
  suburb: string
  selectedTopics: GuideTopicSlug[]
  alreadySorted: string[]
}
```

**Response:** Streamed JSON — `JourneyIdentity` object.
**Timeout:** 8s. On timeout, client falls back to deterministic identity.

---

### `POST /api/journey/memory`

Generates a single memory line for a completed day.

**Request body:**
```typescript
{
  day: number
  theme: string
  completedTasks: string[]    // task text strings the user actually checked off
  suburb: string
  archetype: string
}
```

**Response:** `{ line: string }` — one sentence, max 12 words.
**Timeout:** 4s. On timeout, client uses deterministic fallback from a day-keyed lookup table.

---

## Responsive Behaviour

| Component | Mobile | Tablet | Desktop |
|---|---|---|---|
| Reveal screen | Full-screen, symbol 80px, archetype 28px | Full-screen, symbol 100px, archetype 36px | Centered card max-width 480px, larger type |
| Living card | Full-width card in plan view | Sidebar card (fixed right) | Sidebar card (fixed right) |
| Radar chart | 180px × 180px | 220px × 220px | 240px × 240px |
| Card flip | Tap anywhere on card | Tap anywhere or hover flip button | Click anywhere or hover flip button |
| Share flow | Native share sheet | Native share sheet | Download PNG |

---

## Accessibility

- All reveal animations respect `prefers-reduced-motion`
- Card flip is keyboard accessible (`Tab` to focus, `Enter` or `Space` to flip)
- Radar chart axes have `aria-label` values: `"Courage: 78 out of 100"`
- Palette swatch color names are rendered as visible text, not color-only
- Locked memory lines use `aria-hidden="true"` on blurred content and `aria-label="Day 4 memory locked"` on the container
- Constellation stars use `aria-label="7 stars, 3 lit"` on the group
- Share button has descriptive `aria-label="Share your completed journey card"`

---

## File Checklist

```
app/
└── api/
    └── journey/
        ├── identity/
        │   └── route.ts              ← streams JourneyIdentity
        └── memory/
            └── route.ts              ← returns single memory line

components/
└── journey/
    ├── identity-reveal.tsx           ← cinematic reveal screen
    ├── identity-card.tsx             ← living card front
    ├── identity-card-back.tsx        ← memory lines back
    ├── card-earn-toast.tsx           ← day completion earn animation
    ├── trait-radar.tsx               ← animated radar chart
    ├── palette-swatch.tsx            ← 3 color bloom reveal
    └── constellation.tsx             ← 7-star day tracker

lib/
└── journey/
    ├── identity.ts                   ← types, localStorage, earn logic
    └── identity-prompt.ts            ← LLM prompt builder
```

---

## Open Questions

| Question | Status |
|---|---|
| Which LLM provider — Anthropic Claude API or OpenAI? | Open |
| Should `JourneyIdentity` be regeneratable if the user redoes onboarding? | Open |
| Do memory lines need moderation/filtering before display? | Open |
| Is the card shareable as a native image (canvas) or a link to a hosted render? | Open |
| Should the reveal screen be skippable on repeat visits (returning users)? | Open |
| What happens to the card if the user changes their suburb mid-journey? | Open |

---

## Known Limitations

- Card state lives in localStorage only — no cross-device sync in this version
- Memory lines are generated per completion event and cannot be regenerated without clearing state
- The mood → animation mapping covers 6 presets; unusual moods fall back to calm
- Palette harmony is prompt-guided but not programmatically validated — extremely rare edge cases may produce poor contrast
