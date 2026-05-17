# Persona Journeys — Full Feature PRD
## Status: Shipped — 2026-05-14

**Principle:** New arrivals don't need all 32 guides at once. They need the right 8, in the right order, from someone who's been where they are.

---

## Problem Statement

Minuri has 32 guides across five topic areas. A first-time user arriving at the guides section faces the same problem they have in the rest of Melbourne: everything is available, nothing is sequenced. There is no answer to "where do I start?"

The library view (topic filters, search) works for users who already know what they're looking for. It fails for users who don't know what questions to ask yet — and that is the majority of new arrivals in their first week.

A second, deeper problem: newcomers to Melbourne are not a monolith. The stress of a 21-year-old international student who doesn't know what Medicare is differs fundamentally from the stress of a 41-year-old professional expat whose employer sorted accommodation but left everything else unexplained. A single generic "start here" sequence serves neither of them well.

---

## Solution

Six **persona journeys**: curated, sequenced guide paths built around specific arrival situations. Each persona represents a distinct archetype of newcomer to Melbourne — different visa status, different life stage, different prior knowledge, different primary stressors. Users pick the persona closest to their situation, and the app opens a week of guides ordered for that specific context.

The persona is not a filter. It is a guide: *someone who has already been where you are, whose path through the information you can follow.*

Guides overlap intentionally across personas. The same guide ("Finding a GP Before You Need One") appears in the international student, skilled migrant, and humanitarian arrival journeys — but each enters it from a different starting point, having read different prior guides. The sequence is the value, not the guide in isolation.

---

## The Six Personas

### Mei — International Student, 21 · China
**Core stressor:** Systems overload in the first week — Medicare, unfamiliar food, public transport, social isolation.
**What she needs first:** Grocery run, Myki, making friends before she retreats into her room.
**What she needs in week one:** Cooking basic meals, understanding Medicare, navigating community.
**What she needs in month one:** Processing homesickness, knowing when to seek professional support.

> "I left everything familiar. Where do I even start?"

**Tone note:** She is capable and organised. She lacks local context, not ability. Do not pity.

---

### Jordan — Career Starter, 24 · Brisbane
**Core stressor:** Social infrastructure collapse. Competent adult, zero local network.
**What he needs first:** 48-hour admin checklist, Myki, surviving the first weekend.
**What he needs in week one:** Finding his way around the city, super and first paycheck, budgeting.
**What he needs in month one:** Building a local routine, making friends in a city where everyone has their people.

> "I got the job. Now I need to get a life here."

**Tone note:** He does not need hand-holding. He needs orientation.

---

### Priya — Skilled Migrant, 22 · India
**Core stressor:** Administrative walls. Moving with family means every gap costs more.
**What she needs first:** 48-hour checklist, bond protection from day one, finding a GP for the toddler.
**What she needs in week one:** Emergency vs urgent care, Medicare enrollment, utilities without being overcharged.
**What she needs in month one:** Renting rights, tenant protections, finding community with a child.

> "My family needs stability. I need to figure out how everything works here."

**Tone note:** She has managed a household and a career simultaneously for years. She is not overwhelmed — she is navigating a system that assumes prior knowledge she was never given.

---

### Sam — Working Holiday Maker, 19 · Melbourne-area
**Core stressor:** Financial erosion. Small daily costs compound into a shorter trip.
**What he needs first:** Myki (correct zones, not overpaying), night transport, cheap eats.
**What he needs in week one:** Free things to do, finding his way around, budgeting.
**What he needs in month one:** Cycling the city, meal prep, volunteering as a way to meet people.

> "I'm here for the adventure. Just need to not run out of money."

**Tone note:** He is excited, not anxious. His risk is financial, not emotional.

---

### Chloe — Anxious Transferee, 21 · Sydney
**Core stressor:** Health safety net first. She cannot engage with anything practical until she knows crisis support exists.
**What she needs first:** Crisis lines, finding a GP, emergency vs urgent care.
**What she needs in week one:** Prescriptions, seeing a psych, understanding the cheapest first stop.
**What she needs in month one:** Social connection, homesickness, routine and sleep.

> "I need to know I'll be okay before I can think about anything else."

**Tone note:** She is transferring mid-degree with anxiety. The journey front-loads health and safety; practical admin comes only after the safety net is established.

---

### Tom — First-Time Renter, 26 · Melbourne
**Core stressor:** Invisible admin. His parents handled everything — he doesn't know what he doesn't know.
**What he needs first:** 48-hour checklist, bond from day one.
**What he needs in week one:** Renting without being burned, tenant rights, setting up utilities.
**What he needs in month one:** Superannuation, Medicare, groceries, transport.

> "The practical gaps are bigger than I expected."

**Tone note:** He has a stable job. His challenge is not financial — it is the procedural knowledge his parents managed invisibly. The journey surfaces the hidden admin layer of adult life.

---

## Journey Structure

Each journey is a **7-day arc** mapped as panels in the fullscreen view. Each day contains 1–2 guides selected for that persona's priority at that point in their arrival.

### Arc phases

| Phase | What it covers |
|-------|---------------|
| **Day 1** | Immediate survival: the things that break down without action in the first 48 hours |
| **Days 2–5** | Week-one orientation: building the knowledge layer underneath daily life |
| **Days 6–7** | Month-one investment: the slower work of belonging, routine, and long-term stability |

The arc is intentionally paced. Putting social connection on Day 1 ignores the reality that most people cannot process that information until their basic logistics are handled. Putting Medicare on Day 7 for a user who needs to see a doctor in week one is a failure of sequencing.

---

## Content Model

### Persona fields

| Field | Description |
|-------|-------------|
| `id` | Slug (e.g. `sam`, `priya`) |
| `name` | First name |
| `age` | Age |
| `origin` | City or country of origin |
| `role` | Short label shown on card (e.g. "Uni Fresher", "First-Time Renter") |
| `tagline` | First-person quote — the core emotional truth of their situation |
| `situation` | 3–4 sentence prose description of who they are and what they're navigating |
| `accentColor` | Hex — used for role label in the fullscreen detail view |
| `imageUrl` | Portrait photo — full-bleed in card and fullscreen column |
| `journey` | `string[][]` — 7 arrays of guide slugs, one per day |

### Journey rendering

The fullscreen detail view renders Panel 0 (persona description) + one panel per day that has at least one resolvable guide. Days with no matching guide slugs are skipped. Each day panel shows a horizontal row of `GuideCard` components.

---

## UI — Persona Grid (Entry Page)

Personas appear in a `2-col / 3-col` grid at the bottom of `GuidesIntroView`, below the topic selector and divider. This placement is intentional: the topic path (pick what you need) and the persona path (follow someone like you) are offered as alternatives, not competitors.

### Card anatomy

```
┌──────────────────────────┐
│ [ROLE BADGE]    24 · VIC │  ← backdrop-blur pill + age/origin
│                          │
│    [portrait photo]      │
│                          │
│ Name                     │  ← serif bold, large
│ "tagline in italics"     │  ← italic, capped at 2 lines
│                          │
│ [situation text]         │  ← hover-reveal: slides in via max-h
│ Follow journey →         │  ← hover-reveal CTA
└──────────────────────────┘
```

- Aspect ratio: `3:4` portrait
- Hover: image scales `1.04`, situation + CTA slides in via CSS `max-h` transition (no JS state)
- Cards stagger in at 60ms intervals on page load

### Selection flow

Click a card → image morphs via shared-element animation into the fullscreen left column → persona detail opens as an in-page overlay. No route navigation. Scroll position on the entry page is preserved.

For the full transition animation spec, see `persona-journey-transition-prd.md`.

---

## UI — Persona Fullscreen (Detail View)

A `fixed inset-0 z-50` overlay mounted directly on `/guides`. Horizontal scroll-driven panel system powered by a nested Lenis instance.

### Panel 0 — Persona description

```
┌────────┬──────────────────────┬──────────────────────────┐
│        │                      │ ROLE LABEL               │
│  N     │                      │   (in accentColor)       │
│  A     │  [portrait photo]    │                          │
│  M     │  (42% width,         │                          │
│  E     │   full height)       │  "tagline"               │
│        │                      │                          │
│  ↕     │                      │  situation prose         │
│        │                      │                          │
│        │                      │  Name, Age · Origin      │
└────────┴──────────────────────┴──────────────────────────┘
  vertical                             scroll for more ↓
  serif name
```

- Left: huge vertical serif name (`clamp(5rem, 12vw, 10rem)`, `writing-mode: vertical-rl`)
- Center: portrait photo in 42% column (same image as card — the layoutId morph bridges the two)
- Right: role label in `accentColor`, scroll hint, tagline quote, situation paragraph, name/age/origin

### Panels 1–N — Journey days

Each day panel is a full-screen horizontal slide:

```
┌──────────────────────────────────────────────┐
│ NAME · Day N              panelIndex / total  │
│ Day label (First day / Day 3 / End of week)   │
│                                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ GuideCard│  │ GuideCard│  │ GuideCard│   │
│  └──────────┘  └──────────┘  └──────────┘   │
│                                               │
└──────────────────────────────────────────────┘
```

- Background: `#f0ede8` warm cream across all panels
- Navigation: vertical scroll on a tall track (`numPanels × 100vh`) maps to horizontal panning via `useScroll → useTransform → x`
- Smooth scroll: nested Lenis instance (`lerp: 0.068`) scoped to the modal; root Lenis is stopped while the modal is open and restored on close
- Close: X button (top-right), Escape key, or `handlePersonaBack` in the parent

---

## Navigation & Routes

| Entry point | Behaviour |
|-------------|-----------|
| Click persona card on `/guides` | Opens `PersonaDetailFullscreen` as in-page overlay, no navigation |
| Close persona on `/guides` | Overlay unmounts, intro page reappears at same scroll position |
| Click "Browse all →" on intro page | Navigates to `/guides/journeys` (full picker page) |
| Direct URL `/guides/journeys?persona=sam` | `PersonaJourneyView` reads `initialPersonaId` from page props, initialises `selectedPersona` synchronously, opens fullscreen immediately |
| Close persona on `/guides/journeys` | `setSelectedPersona(null)`, `router.push("/guides")` — returns to entry page |

---

## User Stories

1. As a new arrival who doesn't know what questions to ask, I want to pick a person whose situation sounds like mine, so I get a starting point without having to navigate 32 guides.
2. As a user, I want to see the persona's situation described honestly before I commit to their journey, so I can tell whether it matches my reality.
3. As a user scrolling through the persona grid, I want to hover over a card and see more detail slide in, so I can compare personas without opening each one.
4. As a user who clicks a persona card, I want the photo to visually transition into the fullscreen view, so the experience feels like entering a story rather than loading a new page.
5. As a user inside the persona fullscreen, I want to scroll to reveal each day's guides one at a time, so the week unfolds progressively rather than as a dump of information.
6. As a user on Day 1 of Chloe's journey, I want to see crisis line guides before anything practical, so the sequence matches how I actually feel right now.
7. As a user completing a persona's guide, I want to see the next guide in the sequence recommended automatically, so I don't need to re-open the persona view to find what's next.
8. As a user, I want to close the persona and return to the entry page at the same scroll position, so I can compare journeys or go back to topic selection without losing context.
9. As a user accessing Minuri for the first time via a shared link to a persona (`/guides/journeys?persona=priya`), I want the persona to open immediately without flash, so the shared link works as the sender intended.
10. As a user on a mobile device, I want the persona cards to show the name and tagline clearly, so I can read enough to make a decision without hovering.
11. As a user with reduced-motion preferences, I want the persona to open and close without translate or scale animations, so I am not disoriented.
12. As a content editor, I want persona journeys defined as arrays of guide slugs, so I can rearrange or add guides without touching component code.
13. As a content editor, I want the same guide to appear in multiple persona journeys, so I don't duplicate content for different arrival contexts.

---

## Implementation Decisions

### Personas as static content

Personas are defined in `content/personas.ts` as a typed array. The `journey` field is `string[][]` — seven arrays of guide slugs, one per day. Guides are resolved at render time via `getGuidesFromSlugs()`. Days where no slugs resolve to real guides are silently skipped, preventing empty panels.

### Guide overlap is intentional

The same guide (e.g., "When You Don't Know Anyone Yet") appears in multiple journeys. The guide itself is topic-agnostic; the value is the order it appears in relative to the surrounding guides for that persona. No deduplication logic is applied.

### Persona journeys as an alternative path, not a replacement

The entry page offers two parallel paths: **topic selection** (I know what area I need) and **persona journeys** (I want to follow someone in my situation). These are positioned as equals on the screen. Neither gates the other. Users who want neither can skip directly to the full library.

### In-page overlay for persona from entry

From `/guides`, clicking a persona opens `PersonaDetailFullscreen` as a React overlay — not a navigation. This preserves scroll position and avoids the `RouteScrollToTop` reset. The `/guides/journeys` dedicated page remains for direct URL access and the "Browse all" link.

### Horizontal scroll as narrative pacing

The day-by-day horizontal scroll is deliberate. It prevents all seven days from being visible simultaneously, which would make the journey feel like a list. Each scroll step reveals one day — matching the cadence of actually living the arrival, one day at a time.

### Persona card hover reveal via CSS only

The situation text and "Follow journey →" CTA on persona cards are revealed purely via CSS `max-h` / `opacity` transition on `:group-hover`. No `useState` required per card. This keeps 6+ cards from each maintaining hover state.

---

## Out of Scope

- Saving or resuming a persona journey across sessions (no persistence layer yet).
- "You are on Day 3 of Sam's journey" progress state.
- Customising a journey (swapping out individual guides from a persona's sequence).
- More than six personas — the current set covers the primary arrival archetypes for Melbourne newcomers. New personas require both content (situation, tagline, accentColor, journey arc) and a portrait photo.
- Animated transitions within the persona fullscreen between day panels (current: instantaneous on scroll).
- Persona recommendation ("Based on your topic selections, you might be Priya").

---

## Further Notes

### Tone across all personas

Every persona is capable. None of them are lost or helpless. What they lack is **local procedural knowledge** — the specific, often invisible layer of information that Australians who grew up here absorbed gradually over years. Minuri's job is to compress that accumulation into a navigable week. The guides should never condescend, never assume the user couldn't figure it out themselves eventually. They're here because *eventually* isn't fast enough.

### The persona photo matters

The portrait photo is load-bearing. It is the primary visual element on both the card and the fullscreen detail. It is the shared element in the transition animation. Photos must be:
- High resolution (minimum 1200px wide for the fullscreen column at 42vw)
- Portrait orientation (tall — the card is `3:4`)
- Shot against neutral or dark backgrounds (the overlay text uses white)
- Depicting the persona's approximate age, origin, and energy — not stock-photo cheerfulness

### `accentColor` per persona

Each persona has a hex accent color used for the role label in the fullscreen. This is the only per-persona color and should be chosen to read clearly on the `#f0ede8` cream background. Avoid yellows and very light colors.

---

*Minuri · Persona Journeys Feature PRD · 2026-05-14*
