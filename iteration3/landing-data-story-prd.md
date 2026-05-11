# Landing Data Story Section PRD

**Epic:** 3 — Landing: Data Story  
**Date:** 2026-05-11  
**Status:** Implemented

---

## 1. Goal

A "Why it matters" section between `LandingServicesSection` and `SpotlightScrollSection`. Converts a skeptical first-time visitor into someone who understands the problem before the product.

The section builds a three-act emotional arc — headline shock → area-by-area evidence → human-scale gap — ending on the help-seeking crisis that Minuri directly addresses.

### Page position

```
LandingHeroSectionV2
LandingServicesSection
LandingDataSection          ← this section
SpotlightScrollSection
LandingCareSection
LandingAccessSection
LandingFooter
```

### Three-act narrative arc

| Act | Component | Emotional job |
|-----|-----------|---------------|
| 1 — Headlines | `LandingStatCard` ×3 | Shock the visitor into recognising the scale of the problem |
| 2 — Evidence | `LandingInsightChart` | Break it down by area — housing, mental health, finance, cost of living |
| 3 — Human scale | `LandingDotGrid` | Show it as people, not percentages — and reveal the help-seeking gap |

---

## 2. Data & References

### Act 1 — Stat Cards

| Card | Insight | Source | URL |
|------|---------|--------|-----|
| 1 | **1 in 4** young Australians experience high psychological distress during major life transitions | Mission Australia Youth Survey, 2024 | https://www.missionaustralia.com.au/what-we-do/research-and-resources/youth-survey |
| 2 | **98%** of international students report anxiety in their first semester; **86%** report financial stress | Monash University International Student Health and Wellbeing Survey, 2023 | https://www.monash.edu/health/health-wellbeing/student-health-survey |
| 3 | **#1** — Loneliness is the top self-reported issue for Australians aged 15–24 starting independent life | University of Melbourne Loneliness Research Group, 2023 | https://www.unimelb.edu.au/loneliness |

### Act 2 — Insight Chart Strips

| Strip | Insight | Source | URL |
|-------|---------|--------|-----|
| 1 | **65%** of young Australians aged 18–25 experiencing high or very high psychological distress | headspace National Survey, 2025 | https://headspace.org.au/our-organisation/media-releases/nearly-half-of-young-australians-experiencing-high-levels-of-psychological-distress-but-more-are-seeking-support/ |
| 2 | **56%** of young people named cost of living as Australia's #1 national concern — the highest ever recorded | Mission Australia Youth Survey, 2024 | https://www.missionaustralia.com.au/media-centre/media-releases/youth-survey-cost-living-number-one-for-young-people |
| 3 | **2 in 5** young Australians report stress directly linked to their mental health, affecting school attendance and daily motivation | Mission Australia Youth Survey, 2025 | https://www.missionaustralia.com.au/what-we-do/research-and-resources/youth-survey |
| 4 | **2 in 3** young renters remain in housing stress even after receiving government rent assistance | AIHW · Housing Assistance in Australia, 2024 | https://www.aihw.gov.au/reports/housing-assistance/housing-assistance-in-australia-2024/contents/financial-assistance |

### Act 3 — Dot Grid Steps

| Step | Insight | Source | URL |
|------|---------|--------|-----|
| 1 | **65 in 100** young Australians aged 18–25 are experiencing high or very high psychological distress | headspace National Survey, 2025 | https://headspace.org.au/our-organisation/media-releases/nearly-half-of-young-australians-experiencing-high-levels-of-psychological-distress-but-more-are-seeking-support/ |
| 2 | **1 in 2** won't reach out for support until they're at crisis point — when the window to help is already closing | headspace National Survey, 2024 | https://headspace.org.au/our-organisation/research/ |
| 3 | **22 in 100** skipped or delayed medical care last year — not because they didn't need it, but because they couldn't afford it | Brotherhood of St Laurence, 2024 | https://www.bsl.org.au/research/our-publications/reports/young-australians-financial-difficulty/ |

---

## 3. Section Structure

```
bg-minuri-white

  ┌─ Constrained (max-w-7xl) ───────────────────────────────┐
  │  Kicker: "The numbers behind your experience"            │
  │  h2: "Independent living is hard"                        │
  │  Subheading: "The systems that support you..."           │
  │                                                          │
  │  [StatCard 1]     [StatCard 2 — counter]  [StatCard 3]  │
  │  1 in 4 distress  98% intl anxiety        #1 loneliness  │
  │                                                          │
  │  "Break it down by area" lead-in                         │
  └──────────────────────────────────────────────────────────┘

  ┌─ Full-bleed LandingInsightChart (bg-minuri-ocean) ───────┐
  │  [65%   ████████████████████████████░░]  Mental health   │
  │  [56%   ████████████████████░░░░░░░░░]  Cost of living   │
  │  [2in5  ████████████████████░░░░░░░░░]  Stress impact    │
  │  [2in3  ██████████████████████░░░░░░░]  Housing stress   │
  └──────────────────────────────────────────────────────────┘

  ┌─ LandingDotGrid (bg-minuri-ocean, constrained max-w-7xl) ┐
  │  "Out of 100 young Australians"                           │
  │                                                           │
  │  [10×10 dot grid]   65 in 100              [>]            │
  │                     young Australians...                  │
  │                     headspace · 2025                      │
  │                                                           │
  │  [65 in 100]  [1 in 2]  [22 in 100]   ← step pills       │
  │                                                           │
  │  ● seeking   ○ waiting   ● medical   ○ not distressed     │
  └──────────────────────────────────────────────────────────┘

  pb-24 md:pb-32
```

---

## 4. Components

### 4.1 `LandingDataSection`

**File:** `components/landing/landing-data-section.tsx`

Wrapper section with `bg-minuri-white`. Renders all three acts in sequence. The insight chart and dot grid break the white background with `bg-minuri-ocean`, creating a dark band that visually groups the evidence.

---

### 4.2 `LandingStatCard`

**File:** `components/landing/landing-stat-card.tsx`

Three cards in a responsive grid (stacked on mobile, 3-column on sm+). Each card carries:

- A coloured accent bar at the top to visually differentiate the three topics
- A large stat — static text or an animated count-up (card 2 only)
- A short label that contextualises the stat without over-explaining
- A source attribution at the bottom, separated by a subtle border

Cards entrance with a staggered fade-up animation as they scroll into view.

| Card | Stat | Topic | Accent colour |
|------|------|-------|---------------|
| 1 | 1 in 4 | Mental health | Teal |
| 2 | 98% (animated) | International students | Coral |
| 3 | #1 | Loneliness | Sky |

---

### 4.3 `LandingInsightChart`

**File:** `components/landing/landing-insight-chart.tsx`

Full-bleed dark section. Four horizontal strips, each representing one area of hardship. Inspired by Pattern Breaking-style data visualisation — no external charting library.

**Design principles:**
- Each strip fills a coloured bar from left to right as it scrolls into view, with the percentage number tracking the bar's right edge
- The number appears to "push" into the dark zone just past the fill — always legible
- Context text sits in the right third, with bold phrases calling out the key claim
- Each strip is clickable and opens the original source in a new tab
- On mobile, strip 3 is hidden to avoid crowding

**Strip colours:**

| Strip | Colour | Topic |
|-------|--------|-------|
| 1 | Yellow `#fcf300` | Psychological distress |
| 2 | Light blue `#cae9ff` | Cost of living |
| 3 | Blush `#ffc2d1` | Mental health impact |
| 4 | Mint `#00f5c8` | Housing stress |

---

### 4.4 `LandingDotGrid`

**File:** `components/landing/landing-dot-grid.tsx`

The closing act. Reframes the statistics as people — 100 dots, each one a young Australian. Three sequential views reveal how crises compound and why people don't get help in time.

#### Narrative arc

**Step 1 — Scale**
65 dots illuminate in yellow. The majority of the grid lights up. This is the scale of psychological distress — not an edge case, the norm.

**Step 2 — The gap**
The grid splits. Roughly half of the yellow dots fade away — the ones who won't reach out until they're already in crisis. A smaller number of bright dots remain: those who sought help early enough. The label shifts: *"1 in 2 won't reach out until they're at crisis point."*

**Step 3 — The barrier**
A new colour emerges: coral. Around 22 dots switch — scattered across both the bright and faded groups — revealing those who skipped medical care because of cost. The same people who aren't seeking mental health support are also avoiding the GP.

#### Dot types and colours

Each dot has a role (idle / seeking help / waiting to seek help) and optionally a medical flag (skipped care). These combine per step to produce the visual:

| Dot state | Colour | Meaning |
|-----------|--------|---------|
| Not in distress | Dark `white/8%` | Baseline — not currently experiencing high distress |
| In distress, seeking help | Bright yellow `#fcf300` | Reached out for support |
| In distress, not yet seeking | Faded yellow `#fcf300/12%` | Waiting, or don't know where to turn |
| Medical care avoided | Coral `minuri-coral` | Skipped or delayed care due to cost (overlaid on step 3) |

#### Playback and controls

The grid auto-plays on scroll entry, cycling through all three steps every 2.6 seconds in a continuous loop. Once a user clicks any control, auto-play stops and they take manual control.

Two control surfaces:
- **Step pills** — labelled buttons below the grid (`65 in 100` / `1 in 2` / `22 in 100`). Active pill is white-filled; inactive is outlined.
- **`>` chevron** — sits to the right of the stat panel, inline with the label. Advances forward and wraps back to step 1.

#### Legend

The legend reveals entries progressively as each step introduces a new dot colour. Items that aren't yet on screen don't hold space — no phantom gaps in the layout.

#### Layout

The dot grid sits to the left; the animated stat label and `>` chevron sit to the right as a tight group. On desktop the two columns sit side by side; on small screens they stack vertically. The step pills and legend are centered below.

---

## 5. Responsive Behaviour

| Component | Mobile | Tablet (md) | Desktop (lg+) |
|-----------|--------|-------------|---------------|
| Stat cards | Stacked 1-col | 3-col grid | 3-col grid |
| Insight strips | 3 strips (strip 3 hidden) | 4 strips | 4 strips, taller |
| Dot grid layout | Stacked (grid above, label below) | Side by side | Side by side, larger dots |
| Dot size | 20px | 24px | 36px |

---

## 6. Accessibility

- `LandingStatCard`: `data-source` attribute on each card for citation auditability
- `LandingInsightChart` strips: `role="button"`, `tabIndex={0}`, descriptive `aria-label` per strip; Enter/Space opens source URL
- `LandingDotGrid` chevron: `aria-label="Next view"`
- Section has `aria-labelledby="why-it-matters-heading"`

---

## 7. File Checklist

```
components/landing/
  landing-data-section.tsx   ✓ three-act wrapper, full-bleed chart break
  landing-stat-card.tsx      ✓ count-up animation, accent bar
  landing-insight-chart.tsx  ✓ scroll-driven fill strips, source URLs
  landing-dot-grid.tsx       ✓ isotype dot grid, 3-step loop, manual controls

iteration3/
  landing-data-section-prd.md  ✓ this document (v4.0)
```

Removed:
- `recharts` — replaced by custom strip visualisation
- `LandingPersonaCard`, `LandingPersonaToggle` — moved out of this section

---

## 9. Epic & User Stories

### Epic

**EPIC-01 — Landing Data Story Section**

**As a** skeptical first-time visitor who has just landed on the page,
**I want** to see real data about the challenges of independent living presented as a clear, human-scale narrative,
**so that** I understand the scale of the problem and feel confident that Minuri was built for my situation before I explore the product.

---

### US-01 — Headline Stat Cards

**As a** first-time visitor,
**I want** to see three headline statistics about independent-living challenges on the landing page,
**so that** I immediately grasp the scale of the problem and feel motivated to keep reading.

#### Acceptance Criteria

---

**AC-01-1 — Responsive card grid**

> **Given** I open the landing page on a mobile device  
> **When** I scroll to the data section  
> **Then** the three stat cards stack in a single column  
> **And** each card displays a coloured accent bar, large stat, short label, and source attribution separated by a border

> **Given** I open the landing page on a tablet or desktop (`sm+`)  
> **When** I scroll to the data section  
> **Then** the three cards render side by side in a 3-column grid with consistent spacing

---

**AC-01-2 — Scroll-triggered entrance animation**

> **Given** the stat cards are below the fold  
> **When** the section enters the viewport for the first time  
> **Then** each card fades up with a staggered delay (card 1 first, card 3 last)  
> **And** the animation does not replay if I scroll away and back

---

**AC-01-3 — Count-up animation on card 2**

> **Given** card 2 (98% international student anxiety) is out of view  
> **When** it enters the viewport  
> **Then** the stat animates from 0 to 98 in a smooth count-up  
> **And** cards 1 and 3 display their stats as static text with no animation

---

**AC-01-4 — Citation auditability**

> **Given** any of the three stat cards is rendered in the DOM  
> **When** I inspect the element in DevTools  
> **Then** a `data-source` attribute is present containing the full citation URL  
> **And** the URL matches the source listed in the PRD data table

#### Tasks

- Build the stat card component with accent bar, stat, label, and source row
- Add scroll-triggered staggered entrance animation to the three cards
- Animate the number on card 2 counting up from zero on scroll entry
- Assemble all three cards into the data section with the correct layout

---

### US-02 — Insight Chart Strips

**As a** visitor who wants evidence behind the headline numbers,
**I want** to see a breakdown of hardship by life area as animated bar strips,
**so that** I can understand which aspects of independent living are the most widespread and serious.

#### Acceptance Criteria

---

**AC-02-1 — Scroll-driven fill animation**

> **Given** the insight chart section is below the fold  
> **When** it enters the viewport  
> **Then** each strip's fill bar animates from 0% to its target value left to right  
> **And** the percentage number tracks the bar's right edge throughout the animation  
> **And** the number is legible against the dark background at every point during the fill

---

**AC-02-2 — Clickable source links**

> **Given** I am viewing any chart strip  
> **When** I click it with a mouse or press Enter/Space while focused  
> **Then** the original source URL opens in a new tab  
> **And** the element has `role="button"`, `tabIndex={0}`, and an `aria-label` describing the source

---

**AC-02-3 — Mobile strip visibility**

> **Given** I am on a mobile viewport  
> **When** the chart section renders  
> **Then** strips 1, 2, and 4 are visible and strip 3 is hidden  
> **And** the layout does not show a gap or placeholder where strip 3 would be

> **Given** I am on tablet or desktop  
> **When** the chart section renders  
> **Then** all four strips are visible

---

**AC-02-4 — Strip colour and content**

> **Given** I am viewing the insight chart  
> **When** any strip is fully rendered  
> **Then** its fill bar uses the assigned topic colour (yellow / light-blue / blush / mint)  
> **And** the right-hand column displays the bold key-claim phrase matching the PRD data table

#### Tasks

- Build the full-width dark chart section with four horizontal strip rows
- Animate each strip's fill bar and number when the section scrolls into view
- Make each strip clickable and keyboard-accessible, opening the source in a new tab
- Hide the third strip on mobile so the layout does not feel crowded

---

### US-03 — Dot Grid Human-Scale View

**As a** visitor who has absorbed the statistics,
**I want** to see those numbers reframed as 100 individual dots representing real people,
**so that** the help-seeking crisis feels human and urgent rather than abstract.

#### Acceptance Criteria

---

**AC-03-1 — Auto-play and manual override**

> **Given** the dot grid section is out of view  
> **When** it enters the viewport  
> **Then** the grid begins auto-playing through steps 1 → 2 → 3 → 1 on a 2.6-second loop

> **Given** auto-play is running  
> **When** I click any step pill or the chevron  
> **Then** auto-play stops immediately  
> **And** the grid stays on the step I selected until I interact again

---

**AC-03-2 — Three-step dot states**

> **Given** I am on step 1  
> **When** the grid renders  
> **Then** 65 dots are illuminated in bright yellow and 35 remain dark

> **Given** I advance to step 2  
> **When** the grid updates  
> **Then** approximately 32 yellow dots fade to 12% opacity  
> **And** approximately 33 yellow dots remain at full brightness

> **Given** I advance to step 3  
> **When** the grid updates  
> **Then** approximately 22 dots across both bright and faded groups switch to coral  
> **And** the remaining dots hold their step-2 state

---

**AC-03-3 — Step pill and chevron controls**

> **Given** I am viewing the dot grid  
> **When** I look at the step pills  
> **Then** the active step pill is white-filled and inactive pills are outlined

> **Given** I am on step 3  
> **When** I click the chevron  
> **Then** the grid advances to step 1 (wraps around)

---

**AC-03-4 — Progressive legend**

> **Given** the grid is on step 1  
> **When** I look at the legend  
> **Then** only the yellow "seeking help" and dark "not in distress" entries are visible

> **Given** I advance to step 3  
> **When** the coral dots appear  
> **Then** the coral "medical care avoided" legend entry fades in  
> **And** no legend entry renders before its dot colour is introduced in the grid

#### Tasks

- Build the dot grid with a fixed dot assignment across all three steps
- Add auto-play that starts on scroll entry and stops when the user interacts
- Build the step pills and forward chevron with active and inactive states
- Reveal each legend entry only when its dot colour first appears in the grid

---

### US-04 — Section Integration & Accessibility

**As any** visitor including those using assistive technology,
**I want** the full data section to be accessible, responsive, and visually coherent across all screen sizes,
**so that** the three-act narrative is usable and credible regardless of device or access need.

#### Acceptance Criteria

---

**AC-04-1 — ARIA labelling**

> **Given** I navigate the page using a screen reader  
> **When** I reach the data section  
> **Then** the section is announced using the text of the visible `h2` via `aria-labelledby="why-it-matters-heading"`  
> **And** every interactive element (chart strips, step pills, chevron) has a descriptive `aria-label`

---

**AC-04-2 — Responsive dot grid layout**

> **Given** I am on a mobile viewport  
> **When** the dot grid renders  
> **Then** the grid stacks above the stat label (grid on top, label below)  
> **And** each dot is 20 px

> **Given** I am on a tablet viewport (`md`)  
> **When** the dot grid renders  
> **Then** the grid and stat label sit side by side  
> **And** each dot is 24 px

> **Given** I am on desktop (`lg+`)  
> **When** the dot grid renders  
> **Then** the layout remains side by side  
> **And** each dot is 36 px

---

**AC-04-3 — Dark band visual continuity**

> **Given** I scroll through the data section  
> **When** the insight chart and dot grid are in view  
> **Then** both sections share a continuous `bg-minuri-ocean` background with no white gap between them  
> **And** the dark band is visually distinct from the white stat cards above and white content below

---

**AC-04-4 — DOM narrative order**

> **Given** I navigate the page using a screen reader or keyboard tab order  
> **When** I move through the data section  
> **Then** I encounter stat cards first, then insight chart strips, then the dot grid  
> **And** no CSS property (absolute positioning, `order`, `flex-direction: row-reverse`) changes this sequence from its source order

#### Tasks

- Add screen-reader labels to the section, chart strips, and dot grid controls
- Implement the responsive layout and dot size changes across mobile, tablet, and desktop
- Ensure the dark background spans both the chart and dot grid with no white gap
- Confirm the three acts appear in reading order in the page source

---

## 8. Open Questions

| Question | Status |
|----------|--------|
| Persona section | Removed from data section — handled in guide journey feature |
| Recharts package | Still in package.json; safe to uninstall |
| Dot grid counts | Approximate (~65 distressed, ~22 medical) — scatter is deterministic, not exact. Acceptable for isotype. |
| Auto-play interval | 2600ms per step. Tune if user testing shows pace feels rushed. |
