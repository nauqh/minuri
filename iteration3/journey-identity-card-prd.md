# Journey Identity Card — PRD 2.0

**Epic:** AI-Powered Living Identity Card + Letter from Melbourne
**Date:** 2026-05-16
**Status:** Proposal

---

## Goal

Turn a new arrival's life moment — a single paragraph of free text — into two things that happen immediately after onboarding: a **cinematic identity reveal** (who you are in this city) and a **personal letter from Melbourne** (what the city sees in you). Together they form the emotional opening of the 7-day journey.

Then, as each day is completed, the identity card earns new visual elements — stars, stamps, traits, color — until Day 7 produces a fully vibrant, shareable artifact of their first week.

```
┌─────────────────────────────────────────────────────┐
│  ONBOARDING COMPLETE                                │
│         ↓                                          │
│  [ AI generates JourneyIdentity JSON ]             │
│         ↓                                          │
│  [ Part 1 — Identity Reveal (visual, cinematic) ]  │
│         ↓                                          │
│  [ Part 2 — Letter from Melbourne (streaming) ]    │
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

The existing Journey plan (`/journey/plan`) generates a deterministic 7-day schedule from the user's onboarding data. This PRD adds a parallel AI identity layer — a structured LLM output that drives:

1. A cinematic identity reveal screen with visual UI elements
2. A streaming letter written as if Melbourne is personally welcoming the user
3. A living card that grows richer with every completed day

No existing journey logic is replaced. The identity layer is additive.

---

## Components in Scope

| File | Responsibility |
|---|---|
| `app/api/journey/identity/route.ts` | Streams `JourneyIdentity` JSON from LLM |
| `app/api/journey/memory/route.ts` | Returns one memory line per completed day |
| `components/journey/identity-reveal.tsx` | Full-screen cinematic reveal — Part 1 |
| `components/journey/melbourne-letter.tsx` | Streaming letter reveal — Part 2 |
| `components/journey/identity-card.tsx` | The living card — renders all identity fields, handles day state |
| `components/journey/identity-card-back.tsx` | Card back — 7 memory lines |
| `components/journey/card-earn-toast.tsx` | Micro-animation that fires when a day is completed |
| `components/journey/trait-radar.tsx` | Animated radar/spider chart for 4 trait scores |
| `components/journey/palette-swatch.tsx` | 3-color swatch reveal with color names |
| `components/journey/constellation.tsx` | 7-star constellation that fills day by day |
| `lib/journey/identity.ts` | Types, localStorage persistence, day-earn logic |
| `lib/journey/identity-prompt.ts` | LLM prompt builder |

---

## AI Output Shape

The LLM generates a single structured `JourneyIdentity` object. The `letter` field is generated last so structured fields can be rendered while the letter streams in.

```typescript
type JourneyIdentity = {
  archetype:    string      // e.g. "The Quiet Pioneer"
  mantra:       string      // 5–8 words, e.g. "Roots grow slowly. That's okay."
  final_mantra: string      // rewritten for Day 7, e.g. "You've taken root."
  symbol:       string      // single emoji, e.g. "🌱"
  mood:         string      // metaphorical weather, e.g. "partly cloudy with warmth breaking through"
  suburb_line:  string      // e.g. "Fitzroy: creative, a bit chaotic, deeply warm"
  palette: [
    { hex: string; name: string },  // e.g. "#4A90D9", "Melbourne Blue"
    { hex: string; name: string },
    { hex: string; name: string }
  ]
  traits: {
    courage:      number    // 0–100
    curiosity:    number    // 0–100
    social:       number    // 0–100
    independence: number    // 0–100
  }
  letter: {
    body:     string        // 80–120 words, Melbourne's voice addressing the user
    sign_off: string        // always "— Your City"
  }
}
```

### LLM Inputs

| Input | Used for |
|---|---|
| `yourMoment` | Primary signal — drives archetype, traits, mantra, mood, letter body |
| `suburb` | Drives `suburb_line`, palette tone, letter references |
| `selectedTopics` | Informs trait weighting |
| `alreadySorted` | Informs courage/independence baseline; gaps surface in the letter |

### Prompt Constraints

- Response must be valid JSON, no prose wrapping
- `archetype` max 4 words
- `mantra` and `final_mantra` must differ meaningfully
- `palette` colors must harmonise as a gradient
- `symbol` must be a single printable emoji
- `traits` values must sum to ≥ 200 (no flat distribution)
- `letter.body` must reference the user's specific moment — no generic copy
- `letter.body` must name the suburb naturally, at least once
- `letter.body` must call out 1–2 items not yet in `alreadySorted`
- `letter.body` must not use the word "journey"
- `letter.sign_off` must always be `"— Your City"`

### Letter Voice

The letter is written in second person, present tense, as if Melbourne itself is speaking. It is warm but not saccharine, specific but not intrusive, hopeful but honest. It does not give instructions or advice — it simply reflects the user back to themselves.

**Example input:** *"I just moved from Vietnam to study at UniMelb, I'm alone and I don't know anyone here"*

**Example output:**
> *"You arrived with courage in your suitcase and questions you haven't figured out how to ask yet. Carlton is a good suburb for that — loud enough to feel alive, small enough to learn. We noticed you haven't registered with a GP yet. That's okay. That's what this week is for. People who feel alone in their first few days here often find that Melbourne rewards small acts of showing up — the coffee order you learn, the tram route you memorise, the corner you start to recognise. You made it this far. That's not nothing.*
> *— Your City"*

---

## Day Progression — What Gets Earned

The card starts sparse on Day 0 and earns new visual elements as each day is marked complete. Completion is determined by the existing `minuri:journey:tasks:v1` localStorage key.

| Day | Theme | Card Earn |
|---|---|---|
| 0 | Onboarding complete | Card created — archetype, symbol (dim), palette (30% saturation), empty trait bars, 7 empty star slots, title: **"Newcomer"** |
| 1 | Survival Basics | First star lights · palette → 45% saturation · stamp: **"First Night"** · independence trait animates |
| 2 | Admin Foundation | Second star · stamp: **"Settled In"** · independence trait +10 · card border gains first decoration |
| 3 | Priority Topic A | Third star · palette → 60% saturation · title: **"Finding My Feet"** · curiosity trait animates |
| 4 | Priority Topic B | Fourth star · hidden card element unlocks (border pattern or background texture) · courage trait animates |
| 5 | Health Baseline | Fifth star · symbol begins glowing · health reflected in traits |
| 6 | Social & Belonging | Sixth star · social trait fills · suburb_line gains warmth badge · palette → 85% saturation |
| 7 | Build Your Routine | All 7 stars form constellation · palette → 100% · mantra rewrites to `final_mantra` · title: **"Melbourne Local"** · fully unlocked · share prompt appears |

### Day Memory Lines

After each completed day, the LLM generates one short memory sentence that is added to the **card back**. By Day 7 the back holds 7 lines — a personal diary of the week.

```
Day 1 → "The evening you figured out what was in the fridge."
Day 2 → "The afternoon you got your Medicare card sorted."
Day 6 → "The first time you said hi to someone at the café."
Day 7 → "The week you became a Melburnian."
```

Memory lines are generated at completion time so they can reference tasks the user actually checked off.

---

## Reveal Screen — Two-Part Experience

The reveal screen appears immediately after onboarding form submission. It has two beats — visual first, then written.

### Part 1 — Identity Reveal

```
0.0s   Background fades in with mood-mapped animation
0.4s   Palette floods in as gradient
1.0s   Symbol scales up from center, pulses once
1.6s   Archetype title types in letter-by-letter
2.2s   Suburb line slides up beneath archetype
2.8s   Mantra fades in word-by-word
3.5s   Trait radar animates — each axis extends to its value
4.4s   Palette swatches bloom open (3 circles) with color names
5.0s   Identity card settles into position (top half of screen)
```

### Part 2 — Letter from Melbourne

```
5.2s   Letter card slides up from bottom
5.4s   Salutation appears: "Dear [suburb],"
5.6s   Letter body streams in line-by-line (~40ms per character)
 —     Sign-off fades in: "— Your City"
 —     "Begin Your Journey →" button pulses in below the letter
```

The letter streams while the identity card is already visible above. The user sees both at once — their visual identity at the top, their personal letter arriving at the bottom.

### Mood → Animation Mapping

| Mood keyword | Animation style |
|---|---|
| cloudy / overcast | slow drifting particle fog |
| warm / sunny | soft light-ray bloom from top |
| rainy / stormy | gentle vertical streak particles |
| golden / sunset | radial warm gradient pulse |
| calm / quiet | barely-moving slow blur drift |
| bright / energetic | fast particle scatter and settle |

Unmatched moods fall back to calm.

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

---

## Letter Card — Visual Anatomy

```
┌──────────────────────────────────────┐
│  Dear Fitzroy,                       │  ← salutation
│                                      │
│  You arrived with courage in your    │
│  suitcase and questions you haven't  │  ← body, streams in
│  figured out how to ask yet...       │
│                                      │
│                       — Your City    │  ← sign-off, right-aligned
└──────────────────────────────────────┘
```

The letter card uses a different visual treatment from the identity card — lighter background, serif or handwriting-adjacent typeface, softer border. It should feel intimate against the boldness of the identity reveal above it.

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
> **When** the API call to `/api/journey/identity` begins streaming
> **Then** the reveal screen renders full-screen
> **And** the mood animation begins within 400ms of the stream opening

---

**AC-01-2 — Structured fields render before the letter arrives**

> **Given** the LLM streams `JourneyIdentity` fields in order
> **When** `archetype`, `palette`, `traits`, and `symbol` have been received
> **Then** Part 1 of the reveal plays immediately — without waiting for `letter`
> **And** the letter card appears and streams only after Part 1 settles

---

**AC-01-3 — LLM failure falls back gracefully**

> **Given** the `/api/journey/identity` call fails or times out after 8s
> **When** the error is caught
> **Then** the user is taken directly to `/journey/plan`
> **And** the card renders with a deterministic fallback identity derived from `selectedTopics` and `suburb`
> **And** no letter is shown in the fallback state

---

**AC-01-4 — Reduced motion is respected**

> **Given** the user has `prefers-reduced-motion: reduce` set
> **When** the reveal screen loads
> **Then** all sequential animations are replaced with a single 300ms cross-fade
> **And** the letter body appears instantly rather than streaming character by character

---

### US-02 — Letter from Melbourne Streams In

**As a** new arrival seeing my reveal screen,
**I want** to read a personal letter from the city,
**so that** I feel emotionally welcomed and understood before my week begins.

#### Acceptance Criteria

---

**AC-02-1 — Letter appears after identity reveal settles**

> **Given** Part 1 of the reveal has completed
> **When** the `letter` field begins arriving in the stream
> **Then** the letter card slides into view
> **And** the body text streams in character by character

---

**AC-02-2 — Letter is specific to the user's moment and suburb**

> **Given** the user wrote about moving from overseas and living in Carlton
> **When** the letter renders
> **Then** the letter body references their specific situation — not generic copy
> **And** the suburb name appears naturally in the letter body

---

**AC-02-3 — Letter references an unsorted item**

> **Given** the user has not yet ticked "GP registered" in `alreadySorted`
> **When** the letter renders
> **Then** the letter body acknowledges at least one missing item without being prescriptive

---

**AC-02-4 — Sign-off is always "— Your City"**

> **Given** the letter has finished streaming
> **When** the sign-off appears
> **Then** it reads exactly `— Your City`, right-aligned
> **And** no other sign-off text is accepted from the LLM

---

### US-03 — Living Card Visible Throughout Journey

**As a** user partway through my 7-day journey,
**I want** to see my identity card on the plan page,
**so that** I can track what I've earned and feel motivated to continue.

#### Acceptance Criteria

---

**AC-03-1 — Card is accessible from the plan view**

> **Given** I am on `/journey/plan`
> **When** the page loads
> **Then** my identity card is visible — either inline or via a persistent card button
> **And** it reflects my current day completion state correctly

---

**AC-03-2 — Card state persists across sessions**

> **Given** I completed Day 1 yesterday and return today
> **When** the plan page loads
> **Then** my card still shows Day 1 earned elements (star, stamp, trait value)
> **And** I do not need to re-complete Day 1

---

**AC-03-3 — Palette colors theme the journey plan**

> **Given** my identity palette has been generated
> **When** I view `/journey/plan`
> **Then** my three palette colors are applied as CSS custom properties
> **And** they influence card backgrounds, accents, and highlight states throughout the view

---

### US-04 — Day Completion Earns Card Update

**As a** user who has just checked off all tasks on a day,
**I want** to see my card visibly update,
**so that** completing a day feels rewarding and meaningful.

#### Acceptance Criteria

---

**AC-04-1 — Earn animation fires on day completion**

> **Given** I have checked off all tasks for Day N
> **When** the final task checkbox is ticked
> **Then** a card earn animation plays — new star lights, stamp appears, relevant trait extends
> **And** the animation completes within 2s
> **And** the card reflects the new state afterward

---

**AC-04-2 — Memory line is generated and added to card back**

> **Given** I have completed Day N
> **When** the earn animation plays
> **Then** a POST is made to `/api/journey/memory` with completed task IDs and day theme
> **And** the returned memory line is added to the corresponding slot on the card back

---

**AC-04-3 — Memory line failure does not block the earn flow**

> **Given** the `/api/journey/memory` call fails
> **When** the error is caught
> **Then** the earn animation plays in full
> **And** the card back shows a deterministic fallback line for that day
> **And** no error is shown to the user

---

### US-05 — Card Flip Interaction

**As a** user who wants to read my journey memories,
**I want** to flip my identity card to see the back,
**so that** I can reflect on what I've done this week.

#### Acceptance Criteria

---

**AC-05-1 — Card flips on tap or click**

> **Given** I am viewing my identity card front
> **When** I tap the card or a flip affordance
> **Then** a 3D CSS flip animation plays (600ms)
> **And** the card back is revealed with my memory lines

---

**AC-05-2 — Locked memory lines are visually distinct**

> **Given** I have completed 3 of 7 days
> **When** I view the card back
> **Then** Days 1–3 show memory lines in full
> **And** Days 4–7 show blurred placeholder text
> **And** no placeholder text is legible

---

### US-06 — Day 7 Completion — Full Unlock and Share

**As a** user who has completed all 7 days,
**I want** my card to reach its final unlocked state,
**so that** I feel a strong sense of achievement and want to share it.

#### Acceptance Criteria

---

**AC-06-1 — Day 7 triggers full card unlock**

> **Given** I have marked all tasks complete on Day 7
> **When** the final earn animation plays
> **Then** all 7 stars form the full constellation
> **And** palette reaches 100% saturation
> **And** mantra updates to `final_mantra`
> **And** title changes to "Melbourne Local"

---

**AC-06-2 — Share prompt appears after Day 7 unlock**

> **Given** the Day 7 unlock animation has completed
> **When** the screen settles
> **Then** a share prompt appears: "Your card is complete. Share your week."
> **And** tapping it renders a screenshot-optimised card layout
> **And** the native share sheet or a download option is offered

---

**AC-06-3 — Shareable card shows front only**

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
    daysCompleted:    number[]                   // e.g. [1, 2, 3]
    saturation:       number                     // 30–100
    titleTier:        'newcomer' | 'finding-my-feet' | 'settling-in' | 'melbourne-local'
    stampsEarned:     string[]                   // stamp slugs in order
    memoryLines:      Record<number, string>     // { 1: "...", 2: "..." }
    traitValues: {
      courage:        number
      curiosity:      number
      social:         number
      independence:   number
    }
    constellationLit: number                     // 0–7
    symbolGlowing:    boolean                    // true from Day 5
    fullyUnlocked:    boolean                    // true after Day 7
  }
}
```

---

## API Routes

### `POST /api/journey/identity`

Generates the full `JourneyIdentity` from onboarding data. Streamed — structured fields arrive first, `letter` last.

**Request body:**
```typescript
{
  yourMoment:     string
  suburb:         string
  selectedTopics: GuideTopicSlug[]
  alreadySorted:  string[]
}
```

**Response:** Streamed `JourneyIdentity` JSON.
**Timeout:** 8s. Client falls back to deterministic identity; no letter shown.

---

### `POST /api/journey/memory`

Generates one memory line for a completed day.

**Request body:**
```typescript
{
  day:            number
  theme:          string
  completedTasks: string[]   // task text the user actually checked off
  suburb:         string
  archetype:      string
}
```

**Response:** `{ line: string }` — one sentence, max 12 words.
**Timeout:** 4s. Client uses deterministic fallback from a day-keyed lookup table.

---

## Responsive Behaviour

| Component | Mobile | Tablet | Desktop |
|---|---|---|---|
| Reveal Part 1 | Full-screen, symbol 80px, archetype 28px | Full-screen, 100px / 36px | Centered max-width 480px, larger type |
| Reveal Part 2 (letter) | Slides up over bottom half of screen | Same | Appears below identity card, max-width 480px |
| Living card | Full-width card in plan view | Sidebar card (fixed right) | Sidebar card (fixed right) |
| Letter card on plan page | Not shown (reveal only) | Not shown (reveal only) | Not shown (reveal only) |
| Radar chart | 180×180px | 220×220px | 240×240px |
| Card flip | Tap anywhere | Tap or hover flip button | Click anywhere or hover flip button |
| Share flow | Native share sheet | Native share sheet | Download PNG |

---

## Accessibility

- All reveal animations respect `prefers-reduced-motion` — letter appears instantly, no streaming
- Letter body has `aria-live="polite"` so screen readers announce it as it streams
- Card flip is keyboard accessible (`Tab` to focus, `Enter`/`Space` to flip)
- Radar chart axes have `aria-label` values: `"Courage: 78 out of 100"`
- Palette swatch color names are visible text, not color-only
- Locked memory lines: `aria-hidden="true"` on blurred content, `aria-label="Day 4 memory locked"` on container
- Constellation: `aria-label="7 stars, 3 lit"` on the group
- Share button: `aria-label="Share your completed journey card"`

---

## File Checklist

```
app/
└── api/
    └── journey/
        ├── identity/
        │   └── route.ts              ← streams JourneyIdentity (incl. letter)
        └── memory/
            └── route.ts              ← returns single memory line

components/
└── journey/
    ├── identity-reveal.tsx           ← Part 1: cinematic identity reveal
    ├── melbourne-letter.tsx          ← Part 2: streaming letter from the city
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
| Should `JourneyIdentity` regenerate if the user redoes onboarding? | Open |
| Do memory lines need moderation before display? | Open |
| Is the card shareable as a canvas image or a hosted render link? | Open |
| Should the reveal screen be skippable on repeat visits? | Open |
| What happens to the card if the user changes suburb mid-journey? | Open |
| Should the letter be accessible after the reveal (e.g. on the card back or a separate view)? | Open |

---

## Known Limitations

- Card state and letter live in localStorage only — no cross-device sync in this version
- Memory lines cannot be regenerated without clearing state
- Mood → animation mapping covers 6 presets; unusual moods fall back to calm
- Palette harmony is prompt-guided, not programmatically validated
- Letter is only shown once at reveal — not persisted to a readable location in this version
