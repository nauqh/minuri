# Guides Library — Discovery Redesign
## PRD (Shipped — 2026-05-13)

**Principle:** One clear action per screen. Library = find a guide. Journeys = follow a persona.

---

## Problem Statement

Users arriving at `/guides` (Library tab) were greeted by three competing elements with no clear relationship:

1. **Persona photo strip** — six portrait cards with names and roles only. No context, no tagline, no reason to act.
2. **32 guide cards dumped at once** — no suggested entry point, no hierarchy.
3. **Sidebar progress bars showing `0/5`** — bookmark counts misread as reading progress. New users see zeroed bars implying failure before they have started.

The combined effect: users did not know what they were looking at, what to do first, or what the numbers meant.

---

## Solution

Replace the `/guides` entry point with a **dedicated intro/onboarding page** (`GuidesIntroView`) that gates access to the library. Users must either select topics or pick a persona before entering the guide grid. A skip link allows direct library access for returning users.

---

## Architecture

### Routing

```
/guides                    (no params) → GuidesIntroView
/guides?ready=1            → GuidesLibraryView (all guides)
/guides?ready=1&topic=X    → GuidesLibraryView (single topic filtered)
/guides?ready=1&needs=X,Y  → GuidesLibraryView (multi-topic filtered)
/guides?topic=X            → GuidesLibraryView (deep link, intro skipped)
/guides?q=X                → GuidesLibraryView (search deep link, intro skipped)
```

`GuidesPageEntry` (client component) reads `useSearchParams` and renders the appropriate view. Any of `ready`, `topic`, `q`, `story`, or `needs` params trigger the library view directly — preserving all existing deep links and back-navigation.

### Files

| File | Change |
|------|--------|
| `components/guides/guides-intro-view.tsx` | **New** — intro/onboarding page |
| `components/guides/guides-page-entry.tsx` | **New** — routing wrapper |
| `app/guides/page.tsx` | Updated to render `GuidesPageEntry` |
| `components/guides/guides-library-view.tsx` | `shouldApplyStoryNeedsFilter` no longer requires `story=ready`; `storyContextBanner` label updated |
| `app/globals.css` | Global `button:not([disabled])` hover scale (120ms ease-out, scale 1.03) |

---

## Intro Page Design (`GuidesIntroView`)

### Layout

```
[← Back to home]                          [Browse all 32 guides →]

        FIRST-TIME GUIDES
   What do you need most right now?
   Pick one or more topics. We'll open those guides first.

  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
  │ Food │ │ Nav  │ │Health│ │ Home │ │Social│
  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘

         [ Explore N guides → ]
           or browse all guides

  ─────────────── or follow a journey ───────────────

  Choose someone like you — we'll open their curated week of guides.

  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐   Browse all →
  │ Mei│ │Dan │ │Priya│ │Sam│ │Aiko│ │Marc│
  └────┘ └────┘ └────┘ └────┘ └────┘ └────┘
```

### Topic Cards

- **Grid:** 2 cols mobile → 3 cols sm → 5 cols lg
- **Color palette:** Landing hero colors — `#00f5c8` (Food), `#5dd6ff` (Getting Around), `#fcf300` (Health), `#ffc2d1` (Home), `#cae9ff` (Social)
- **Unselected:** white bg, silver border, icon/count in full vivid hero color
- **Selected:** 15% opacity tint bg (`heroBg + "26"` hex alpha), full vivid border, vivid icon/count, spring-animated checkmark badge
- **Multi-select:** any number of topics selectable simultaneously
- **CTA:** disabled/grey when 0 selected; activates with correct guide count when ≥1 selected; `whileHover` scale 1.05, `whileTap` scale 0.97, 120ms ease-out transition

### Navigation from Intro

| Action | Destination |
|--------|-------------|
| 1 topic selected → Explore | `/guides?ready=1&topic=X` |
| 2+ topics selected → Explore | `/guides?ready=1&needs=X,Y,...` |
| Skip / Browse all | `/guides?ready=1` |
| Persona card click | `/guides/journeys?persona=X` |

### Persona Cards

- **Grid:** 2 cols mobile → 3 cols desktop (cards sized for readable text)
- **Always visible:** role pill badge (top-left), age · origin (top-right), name (serif bold, `text-xl sm:text-2xl`), tagline in italics (`text-xs sm:text-sm`)
- **Hover reveal:** situation text + "Follow journey →" slides in via `max-h` / opacity CSS transition (no JS state required)
- **Image:** scales 1.04 on hover; gradient deepens via `bg-black/0 → bg-black/15`

### Animations

All entrance animations use `[0.22, 1, 0.36, 1]` ease. Topic cards stagger at 70ms intervals. Persona cards stagger at 60ms intervals starting at 280ms delay. `useReducedMotion` respected throughout — all `y` offsets and delays collapse to zero.

---

## Library View Changes (`GuidesLibraryView`)

### Multi-topic filter

Removed the `isStoryReady` requirement from `shouldApplyStoryNeedsFilter`:

```ts
// Before
const shouldApplyStoryNeedsFilter =
  !isBookmarksMode && isStoryReady && activeTopicFilter === "all" && storyNeedsSet.size > 0;

// After
const shouldApplyStoryNeedsFilter =
  !isBookmarksMode && activeTopicFilter === "all" && storyNeedsSet.size > 0;
```

This activates multi-topic filtering via `?needs=X,Y` without requiring the legacy `?story=ready` param.

### Context banner label

When `storyMoment` is absent but topic needs are set (i.e. user came from intro), the banner reads "Filtered by topic / Showing: X • Y" rather than "Your story-guided path / Prioritizing: X • Y".

---

## Global Button Hover

Added to `@layer base` in `globals.css`:

```css
button:not([disabled]) {
  transition: transform 120ms cubic-bezier(0.22, 1, 0.36, 1);
}
button:not([disabled]):hover {
  transform: scale(1.03);
}
```

Framer Motion buttons override this via inline `style` — their own `whileHover` takes precedence. Plain `<button>` elements across the app gain the hover scale automatically.

---

## User Stories

1. As a first-time user, I want to see topic categories when I open the library so I know what kinds of guides exist before browsing.
2. As a first-time user, I want to select multiple topics at once so I can see guides across my areas of need.
3. As a first-time user, I want to see who the personas are (role, tagline, situation) so I can pick a journey that matches my situation.
4. As a returning user, I want to skip the intro directly to the guide grid so I am not blocked by onboarding I have already completed.
5. As a user arriving via a deep link (`?topic=X`), I want the library to open directly without showing the intro.
6. As a user on mobile, I want the topic cards and persona cards to be large enough to read and tap comfortably.

---

## Out of Scope

- Reading-progress tracking — separate epic
- Animated page transition between intro and library views
- Persisting topic preferences across sessions (currently URL-only)
- Changes to `GuideDetailView`, `PersonaJourneyView`, or Bookmarks tab
- The story-intake overlay (remains disabled via `showStoryOverlay = false`)

---

## Testing

| Scenario | Expected |
|----------|----------|
| Open `/guides` (no params) | Intro page shown |
| Select 1 topic → Explore | `?ready=1&topic=X`, library filtered |
| Select 2+ topics → Explore | `?ready=1&needs=X,Y`, library filtered, banner shows "Filtered by topic" |
| Click Skip / Browse all | `?ready=1`, full library |
| Click persona card | `/guides/journeys?persona=X` |
| Open `/guides?topic=food-eating` | Library shown directly, intro skipped |
| Open `/guides?q=myki` | Library + search results shown directly |
| Browser back from library | Returns to intro |
| Open `/guides/bookmarks` | Bookmarks view unchanged |
| Open `/guides/journeys` | Journeys / PersonaJourneyView unchanged |

---

*Minuri · Guides Library Redesign PRD · updated 2026-05-13*
