# Persona Journey — Cinematic Transition & In-Page Overlay
## PRD (Shipped — 2026-05-14)

**Principle:** One action per screen. Clicking a persona card should feel like *entering* a world — not navigating to a new page.

---

## Problem Statement

Users opening the Guides entry page would scroll down to the persona grid, click a card, and experience three compounding problems:

1. **Flash before persona content.** Navigating to `/guides/journeys?persona=X` triggered a server round-trip. The `PersonaJourneyView` rendered the full picker grid first, then a `useEffect` read the URL param and set state — causing a two-render flash before the fullscreen panel appeared.

2. **No visual continuity.** The persona card clicked by the user disappeared entirely; a new page loaded with no connection to the card that was tapped. The transition felt like a broken link, not an intentional journey.

3. **Lost scroll position on close.** When the user closed the persona detail, `router.push("/guides")` triggered a full page navigation back to the entry page. `RouteScrollToTop` (in `SmoothScrollProvider`) fired on every route change, resetting scroll to the top — losing the user's position in the persona grid.

---

## Solution

Replace the cross-route navigation with an **in-page fullscreen overlay** mounted directly inside `GuidesIntroView`. Clicking a persona card opens `PersonaDetailFullscreen` as a React overlay on the `/guides` route — no navigation, no scroll reset. A **shared-element (FLIP) animation** using Framer Motion `layoutId` morphs the persona's portrait image from its card position and size into the left-column layout of the fullscreen view, providing a continuous visual thread.

---

## User Stories

1. As a first-time user browsing the persona grid, I want clicking a card to feel like zooming into that person's world, so the transition feels intentional and cinematic rather than like a page load.
2. As a user, I want the persona's photo to visually carry over from the thumbnail to the fullscreen view, so I have a sense of continuity and know I clicked the right person.
3. As a user, I want the other persona cards to step back when I click one, so my focus is drawn naturally to the selected person before the fullscreen opens.
4. As a user, I want the persona's name, quote, and situation to animate into view after the photo settles, so the information reveals itself at a readable pace.
5. As a user, I want to close the persona detail and return exactly to where I was on the entry page — same scroll position, same topic selections — so I can compare personas or continue browsing.
6. As a user pressing Escape, I want the persona detail to close immediately, so I can exit the fullscreen without reaching for a close button.
7. As a user with reduced-motion preferences enabled, I want all transitions to be instant or near-instant, so the experience is accessible and not disorienting.
8. As a user arriving directly at `/guides/journeys?persona=sam` via a shared link, I want the persona detail to open immediately without flash, so deep links work as expected.
9. As a developer, I want the persona fullscreen component to be reusable from both the intro page and the dedicated journeys page, so the animation logic is not duplicated.
10. As a developer, I want the persona detail to open as an in-page overlay with no route change, so `RouteScrollToTop` never fires and scroll state is preserved automatically.

---

## Implementation Decisions

### Routing — no navigation on persona open

Persona cards in `GuidesIntroView` previously linked to `/guides/journeys?persona=X`. This route navigation is replaced entirely by local React state: a `selectedPersona: Persona | null` state variable controls whether `PersonaDetailFullscreen` is mounted. No URL update occurs on open or close. The `/guides/journeys` page remains intact for direct URL access.

### Flash fix — synchronous initialisation from prop

`PersonaJourneyView` (on `/guides/journeys`) previously ignored the `initialPersonaId` prop passed from the server component and used a `useEffect` to read `searchParams`, causing a two-render flash. The fix: initialise `selectedPersona` synchronously in the `useState` initializer using the prop value. The `useEffect` is removed entirely.

### Shared-element animation — Framer Motion `layoutId`

The persona portrait image is wrapped in a `motion.div` with `layoutId="persona-photo-{id}"` in both the card (source) and the fullscreen column (target). Framer Motion FLIP-calculates the transform between the two rects and animates position, size, and border-radius simultaneously over 680ms using `[0.22, 1, 0.36, 1]` ease. This produces the "image grows and moves to the left" effect described in the design brief.

`borderRadius: 16` is set explicitly on the card's `layoutId` element so Framer Motion can animate it to `0` (no radius) in the fullscreen column.

### Overflow-hidden management

The card `<button>` has `overflow-hidden rounded-2xl` to clip the hover scale. During the layoutId morph, this would clip the expanding image. The button conditionally removes `overflow-hidden` only when `activating?.id === persona.id` — the 150ms highlight window before the fullscreen mounts. The fullscreen's image column also drops `overflow-hidden` since `Image fill` never overflows its parent anyway.

### Transparent overlay container — no opacity bleed

The outer `motion.div` of `PersonaDetailFullscreen` previously faded `opacity: 0 → 1`, which made the `layoutId` image semi-transparent during the morph (ghosting over the intro page). Fixed by removing the mount fade from the container — it now only has an `exit` animation. A separate `motion.div` with `pointer-events-none absolute inset-0` carries the `#f0ede8` background fade, ensuring the image morphs at full opacity throughout.

### Animation choreography — three phases

**Phase 1 — Highlight (0–150ms):**
- Non-selected cards animate to `opacity: 0, scale: 0.93, filter: blur(6px)` over 280ms.
- Selected card lifts to `scale: 1.05, y: -8px`.
- Card overlays (role badge, name, tagline) immediately fade to `opacity: 0` via CSS transition.

**Phase 2 — Image morph (150–820ms):**
- `PersonaDetailFullscreen` mounts. `activating` is cleared.
- `layoutId` FLIP begins: image travels from card rect → 42%-wide left column, full viewport height. Border-radius 16 → 0.
- Background `#f0ede8` fades in (320ms) behind the morphing image.

**Phase 3 — Content arrival (530ms+):**
- Vertical serif name drifts up from `y: 70` (380ms delay, 600ms duration).
- Right panel (role, scroll hint, quote, situation) slides in from `x: 55` (480ms delay, 550ms duration).

### Close behaviour — zero navigation

`handlePersonaBack` calls `setSelectedPersona(null)` only. No `router.push`, no `window.history` call. `AnimatePresence` handles the exit fade (250ms). `RouteScrollToTop` never fires. The intro page reappears at the user's exact scroll position with topic selections intact.

### `PersonaDetailFullscreen` — exported for reuse

Previously unexported and used only inside `PersonaJourneyView`. Now exported so `GuidesIntroView` can import and render it directly without duplicating the component.

### Reduced-motion support

All `y`, `x`, and `scale` initial values collapse to their animated targets when `useReducedMotion()` returns true. The `layoutId` `borderRadius` animation and the background fade are skipped. The fullscreen exits in 10ms. Phase 1 card dimming uses zero-delay transitions.

---

## Testing Decisions

Good tests verify observable behaviour from the user's perspective — not implementation details like which state variables are set or which CSS classes are applied.

### What to test

| Scenario | Expected observable outcome |
|----------|---------------------------|
| Click persona card | `PersonaDetailFullscreen` appears without page navigation (URL stays `/guides`) |
| Click persona card | Non-clicked cards are visually de-emphasised (opacity test) |
| Close persona detail | Intro page reappears; scroll position unchanged |
| Press Escape inside persona | Persona closes |
| Open `/guides/journeys?persona=sam` directly | Fullscreen opens immediately, no picker grid flash |
| `prefers-reduced-motion: reduce` | Fullscreen opens/closes with no translate/scale animations |

### Prior art

Animation timing and FLIP patterns follow the same `[0.22, 1, 0.36, 1]` ease used throughout `GuidesIntroView` topic card animations. Reduced-motion guards follow the `useReducedMotion()` pattern established across all animated components in the guides feature.

---

## Out of Scope

- Reverse layoutId animation on close (image flying back to card) — complex to orchestrate cleanly with the exit fade; simple fade-out is sufficient.
- URL encoding of open persona state — not needed since the persona opens as an in-page overlay; deep links via `/guides/journeys?persona=X` remain the canonical share URL.
- Swipe-to-dismiss gesture on the persona fullscreen.
- Transition animation between the topic-select flow and the library view (separate epic, noted as out of scope in the Guides Library Redesign PRD).
- Keyboard navigation between persona cards while the grid is visible.

---

## Further Notes

The `/guides/journeys` dedicated page remains in place and continues to serve:
- Direct URL access (`/guides/journeys?persona=X`)
- The "Browse all journeys →" link from the intro page
- Any future navigation that targets journeys independently of the entry flow

`PersonaDetailFullscreen` is now a shared component consumed by both `GuidesIntroView` (overlay on `/guides`) and `PersonaJourneyView` (overlay on `/guides/journeys`). Any changes to the fullscreen layout or animation must account for both consumers.

The `activating` state in `GuidesIntroView` serves as a 150ms pre-animation buffer. It is distinct from `selectedPersona`: `activating` drives the card spotlight effect; `selectedPersona` drives the fullscreen mount. This separation allows the highlight phase to complete before Framer Motion begins calculating the FLIP transform.

---

*Minuri · Persona Journey Transition PRD · 2026-05-14*
