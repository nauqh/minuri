# Immersive Guides Epic PRD

**Epic:** 4 — Immersive Guides  
**Date:** 2026-05-15  
**Status:** In Progress

---

## 1. Goal

Redesign the guides experience as a three-stage immersive funnel — smart entry gate → persona-driven journey discovery → deep reading mode — so that a first-time visitor is guided into the content that fits their situation, reads it without distraction, and leaves knowing their next step.

### Page & component map

```
/guides (GuidesPageEntry)
  ├── GuidesIntroView          ← entry gate: topic picker + persona grid
  │     └── PersonaDetailFullscreen  ← full-screen journey overlay (inline)
  └── GuidesLibraryView        ← library: hero card + topic filter + grid

/guides/journeys (PersonaJourneyView)
  ├── PersonaPickerCard ×N     ← 2/3-col picker grid
  └── PersonaDetailFullscreen  ← full-screen journey overlay (route-level)

/guides/[slug] (GuideDetailView)
  ├── Reading progress bar
  ├── Hide-on-scroll header
  ├── Section animations (Moment / Feeling / Reveal / How It Works / First Steps)
  ├── Up Next polaroid card
  ├── Sources accordion
  ├── Guide footer (save / copy / download)
  └── Journey map sidebar (desktop panel + mobile bottom sheet)
```

---

## 2. Components in scope

| File | Responsibility |
|------|---------------|
| `components/guides/guides-page-entry.tsx` | URL-param routing gate between intro and library |
| `components/guides/guides-intro-view.tsx` | Topic picker cards + persona grid (first-timer screen) |
| `components/guides/guides-library-view.tsx` | Filtered guide list with search and topic pills |
| `components/guides/persona-journey-view.tsx` | `PersonaPickerCard` + `PersonaDetailFullscreen` |
| `components/guides/guide-detail-view.tsx` | Full reading experience |

---

## 3. User Stories

---

### US-01 — Smart Entry Gate

**As a** first-time visitor arriving at `/guides`,  
**I want** to see a personalised entry screen that lets me pick my topics before entering the library,  
**so that** the guides I see first are relevant to my situation rather than a generic list.

#### Acceptance Criteria

---

**AC-01-1 — First visit shows intro screen; returning to library skips it**

> **Given** I open the Guides page for the first time (e.g. by clicking "Guides" in the nav)  
> **When** the page loads  
> **Then** I see the topic picker screen — headline, five coloured topic cards, and the persona grid below  
> **And** I do not see the search bar or the full guide list

> **Given** I have already picked my topics and clicked "Explore guides"  
> **When** I press the browser back button and then click "Guides" again  
> **Then** I land directly on the guide library with my previously chosen topic filter still active  
> **And** the topic picker screen is not shown

---

**AC-01-2 — Topic selection and CTA state**

> **Given** I am on the topic picker screen with nothing selected  
> **When** I look at the primary button at the bottom  
> **Then** it reads "Select a topic to continue" and I cannot click it

> **Given** I click one topic card (e.g. Food & Eating)  
> **When** the card activates  
> **Then** the button becomes clickable and reads "Explore N guides" where N is the guide count for that topic  
> **And** the selected card has a visible ring border and sits slightly larger than the others

> **Given** I click two or more topic cards  
> **When** I click "Explore N guides"  
> **Then** I land on the guide library showing only guides from the topics I selected

> **Given** I decide to skip topic selection  
> **When** I click "or browse all guides" below the CTA  
> **Then** I land on the guide library showing all guides with no topic filter applied

#### Tasks

- Verify `GuidesPageEntry` checks all five param keys: `ready`, `topic`, `q`, `story`, `needs`
- `GuidesIntroView`: disable CTA when `selected.size === 0`; set `aria-pressed` per topic button
- `handleExplore`: emit `?needs=` when multiple topics, `?topic=` when exactly one
- Topic cards: staggered entrance animation, spring scale on select/deselect
- Reduce-motion: all animation durations collapse to `0.01s`

---

### US-02 — Persona Journey Discovery

**As a** visitor who identifies more with a person than a topic list,  
**I want** to pick a persona that resembles my situation and step through their curated week of guides,  
**so that** I find relevant guides without having to browse or search.

#### Acceptance Criteria

---

**AC-02-1 — Persona picker grid and card anatomy**

> **Given** I scroll down to the "or follow a journey" section on the intro screen, or open the Journeys page directly  
> **When** the persona grid appears  
> **Then** the personas are arranged in two columns on my phone and three columns on a wider screen  
> **And** each card shows a role badge in the top-left corner, age and origin in the top-right, the person's name at the bottom, and their tagline in italics below the name

> **Given** I hover my mouse over a persona card  
> **When** the cursor rests on the card  
> **Then** a short description of their situation slides in below the tagline  
> **And** no "Scroll for more" hint appears at this stage — that text only appears inside the full journey view

> **Given** I click on a persona card  
> **When** the tap or click registers  
> **Then** all other persona cards fade out and blur within about a quarter of a second  
> **And** the card I clicked lifts upward slightly  
> **And** immediately after, the full-screen journey view opens over the page

---

**AC-02-2 — Full-screen persona journey: panels and scroll drive**

> **Given** I tap a persona card and the full-screen journey opens  
> **When** the view appears  
> **Then** it covers the entire screen — nothing from the page behind is visible  
> **And** the persona's photo appears to smoothly grow from the small card into its new position in the full-screen layout  
> **And** the rest of the page stops scrolling while the journey is open

> **Given** I am inside the full-screen journey view  
> **When** I scroll down  
> **Then** the panels slide horizontally to the left — the first panel shows the persona's photo, role, tagline, and situation; each following panel shows one day of their guide journey  
> **And** a "Scroll for more" hint fades out once I start scrolling

> **Given** I am inside the full-screen journey view  
> **When** I press the Escape key or tap the × close button  
> **Then** the journey view closes and I return to the page I came from  
> **And** the page scrolls normally again

#### Tasks

- `PersonaPickerCard`: `layoutId` on photo `motion.div` for shared-element transition
- `GuidesIntroView` persona grid: blur/fade siblings on `activating` state; lift active card
- `PersonaDetailFullscreen`: vertical scroll → horizontal panel translation via `useScroll` + `useTransform`
- Lenis inner scroller: `wrapper` = `scrollRef`, `content` = `contentRef`, `lerp: 0.068`
- Keyboard: `Escape` → `onBack`; stop root Lenis on mount, restart on unmount
- Scroll-hint `motion.p`: opacity from 1 → 0 between `scrollYProgress` 0 and 0.08
- `validDays` filter: skip days where `getGuidesFromSlugs` returns empty array

---

### US-03 — Immersive Guide Reading

**As a** visitor who has opened a guide,  
**I want** each section of the guide to reveal itself as I scroll through a clean, distraction-free layout,  
**so that** the narrative unfolds naturally and I stay engaged to the end.

#### Acceptance Criteria

---

**AC-03-1 — Reading progress bar and hide-on-scroll header**

> **Given** I open a guide and start reading  
> **When** I scroll down to roughly the middle of the article  
> **Then** the thin teal bar pinned to the very top of the screen fills to approximately half its width  
> **And** the header shows "50% complete"

> **Given** I am reading deep into the article and scroll further down  
> **When** I scroll down continuously  
> **Then** the header slides up and disappears off the top of the screen, giving me more reading space

> **Given** the header has slid away  
> **When** I scroll back up even a little  
> **Then** the header slides back into view within a third of a second

> **Given** I scroll all the way back to the top of the page  
> **When** I am near the top  
> **Then** the header stays visible no matter which direction I scroll

---

**AC-03-2 — Section entrance animations**

> **Given** I open a guide and scroll down toward the first section  
> **When** the "The Moment" section comes into view  
> **Then** it fades in and rises up from a slightly lower position, as if surfacing — the effect takes about 0.7 seconds  
> **And** if I scroll back up and then back down, the animation does not replay

> **Given** a guide has both a "Feeling" and a "Reveal" section side by side  
> **When** that row scrolls into view  
> **Then** the Feeling panel slides in from the left and the Reveal panel slides in from the right at the same time  
> **And** the Reveal panel has a dark background with white text

> **Given** I have enabled "Reduce motion" in my device accessibility settings  
> **When** I scroll through the guide  
> **Then** all sections appear instantly without any sliding, fading, or blur effects

> **Given** a guide includes a "First Steps" section  
> **When** I reach it  
> **Then** the steps are shown in a two-column grid on my phone and a four-column grid on desktop  
> **And** each step shows a numbered badge, an action label, and an estimated time — steps with no time estimate show the label only

#### Tasks

- Reading progress: compute via `articleRef` `getBoundingClientRect` on `scroll` + `resize`; clamp 0–100
- Hide-on-scroll: `lastScrollY` ref; threshold 4px down / 80px from top; `translate-y` via Tailwind `cn`
- `sectionAnim`: shared object with `initial / whileInView / viewport / transition`; apply to each `motion.section`
- Feeling/Reveal row: override `initial` on each child to `x: ±60`; keep `whileInView` as `{x: 0}`
- Reduce-motion: all durations via `prefersReducedMotion ? 0.01 : N`
- First Steps grid: `[index % 4]` sticky class pattern; hide `estimateMin` row when `<= 0`

---

### US-04 — Guide Completion & Continuity

**As a** visitor who has finished reading a guide,  
**I want** to save it, see what's next, explore my reading journey, and access sources,  
**so that** I leave the guide with a clear next action and can continue building knowledge.

#### Acceptance Criteria

---

**AC-04-1 — Journey map sidebar (desktop panel + mobile bottom sheet)**

> **Given** I am reading a guide on a wide screen (desktop)  
> **When** I click the "Journey map" button near the top of the article  
> **Then** a panel slides open to the right of the article  
> **And** the panel shows how far through the current topic I am, a summary of all topics, and a list of guides in my current topic  
> **And** the guide I am reading now is highlighted in teal and labelled "Now"

> **Given** I am reading a guide on my phone  
> **When** I tap the "Journey map" button  
> **Then** a sheet slides up from the bottom of the screen with a dark overlay behind it  
> **And** tapping the dark area behind the sheet, or pressing Escape, closes the sheet  
> **And** tapping any guide in the sheet closes the sheet and takes me to that guide

> **Given** the Journey map is open  
> **When** I look at the topic summary cards inside it  
> **Then** the topic I am currently reading is visually distinguished from the others  
> **And** a topic marked "complete" means I have saved every guide in it  
> **And** my current topic shows "you are here" if it is not yet complete

---

**AC-04-2 — Guide footer: save, copy, sources, and up-next card**

> **Given** I finish reading and reach the guide footer  
> **When** I click "Save"  
> **Then** the guide is saved to my bookmarks and the button switches to "Saved" with a filled bookmark icon  
> **And** if I click "Saved" again the guide is removed from my bookmarks and the button reverts to "Save"

> **Given** I am in the guide footer  
> **When** I click "Copy link"  
> **Then** the guide's URL is copied to my clipboard  
> **And** the button immediately shows "Copied" with a tick icon  
> **And** after two seconds the button goes back to "Copy link"

> **Given** the guide cites sources and I want to check them  
> **When** I click "Show N sources"  
> **Then** the source list expands smoothly below the button, one item at a time  
> **And** each item shows the source name, its domain, and an external link icon  
> **And** clicking "Hide N sources" collapses the list back

> **Given** the guide has a recommended next guide  
> **When** I reach the "Up Next" section  
> **Then** I see a card styled like a polaroid photo showing the next guide's image, topic, title, and reading time  
> **And** a small coral pin sits centred above the card  
> **And** clicking the card takes me to that guide

#### Tasks

- Journey map sidebar: `motion.div` width + marginLeft + opacity animation on `isJourneySidebarOpen`
- Mobile bottom sheet: `AnimatePresence` + `motion.aside` `y: "100%" → 0`; backdrop `onClick` dismisses
- `topicJourneySummary`: computed from `GUIDE_TOPICS` × `journeyGuides`; `isBookmarked` per slug
- Guide footer bookmark toggle: `isBookmarked(guide.slug)` drives icon + label + border class
- Copy link: `navigator.clipboard.writeText`; `setCopied(true)` → `setTimeout 2000ms` → `false`
- Sources accordion: `AnimatePresence` + `motion.div` `height: 0 → auto`; staggered child `initial x: -8`
- Up Next card: `getNextGuide(guide)` for slug; pushpin `div` as absolute sibling above card
- Download guide button: opens `GuideShareModal` via `setShareOpen(true)`

---

## 4. Responsive Behaviour

| Component | Mobile | Tablet (md) | Desktop (xl+) |
|-----------|--------|-------------|---------------|
| Topic picker grid | 2-col | 3-col | 5-col |
| Persona picker grid | 2-col | 3-col | 3-col |
| Persona fullscreen panels | stacked (photo above text) | side by side | side by side |
| Guide article max-width | full | `max-w-3xl` | `max-w-5xl` → `max-w-6xl` at 1500px |
| Journey map | bottom sheet | bottom sheet | right-side panel (`26rem`) |
| First Steps grid | 2-col | 2-col | 4-col |

---

## 5. Accessibility

- `GuidesIntroView` topic buttons: `aria-pressed={isSelected}` per card
- `PersonaDetailFullscreen` close button: `aria-label="Close"`; Escape key handler
- Guide header "Journey map" button: `aria-expanded={isJourneySidebarOpen}`
- Journey map "Hide journey map" close button: `aria-label="Hide journey map"`
- Mobile bottom sheet backdrop button: `aria-label="Close journey map"`
- `BookmarkButton`: descriptive `aria-label` reflecting current saved state
- Sources accordion trigger: button semantics with `Show / Hide` prefix
- Up Next `Link`: `aria-label` not required — visible text "Continue reading →" is sufficient
- All `motion` animations: guarded by `prefersReducedMotion` with `duration: 0.01` fallback

---

## 6. File Checklist

```
components/guides/
  guides-page-entry.tsx          ← URL-param routing gate
  guides-intro-view.tsx          ← topic picker + persona grid
  guides-library-view.tsx        ← search + topic filter + guide grid
  persona-journey-view.tsx       ← PersonaPickerCard + PersonaDetailFullscreen
  guide-detail-view.tsx          ← full reading experience

content/
  personas.ts                    ← Persona type + PERSONAS array
  guides.ts                      ← Guide type + GUIDES array + GUIDE_TOPICS

lib/
  guides.ts                      ← buildGuideHref, getNextGuide, filterGuides, getTopicMeta

hooks/
  use-guide-bookmarks.ts         ← localStorage bookmark state
```

---

## 7. Open Questions

| Question | Status |
|----------|--------|
| `GuideShareModal` download format | PDF vs. share sheet — implementation TBD |
| `/guides/journeys` route | `PersonaJourneyView` used at route level vs. inline — currently both patterns exist |
| `story` param in `GuidesPageEntry` | Key present in param check but no emitter in `GuidesIntroView` — needs wiring |
| Persona journey back navigation | `handleBack` calls `router.push("/guides")` — clears URL state; may need `router.back()` |
