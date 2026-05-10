# Landing Data Section — Evidence-Based Storytelling PRD

**Epic:** 3 — Landing: Evidence-Based Purpose & Persona Storytelling  
**Version:** 3.0  
**Date:** 2026-05-10  
**Status:** Implemented

---

## 1. Goal

A "Why it matters" section between `LandingServicesSection` and `SpotlightScrollSection`. Converts a skeptical first-time visitor into someone who understands the problem before the product. Two acts: headline statistics → scroll-driven data strips.

`HomeView` render order:
```
LandingHeroSectionV2
LandingServicesSection
LandingDataSection          ← this section
SpotlightScrollSection
LandingCareSection
LandingAccessSection
LandingFooter
```

### Two-act narrative arc

| Act | Component | Role |
|-----|-----------|------|
| 1 — Headlines | `LandingStatCard` ×3 | Shocking numbers → create tension |
| 2 — Evidence | `LandingInsightChart` | Scroll-driven strips → visual proof per stat |

> Persona section removed from this component.

---

## 2. Research Base

### Stat Cards

| Card | Stat | Source |
|------|------|--------|
| 1 | **1 in 4** young Australians experience high psychological distress during major life transitions | Mission Australia Youth Survey, 2024 |
| 2 | **98%** of international students report anxiety; **86%** financial stress in first semester | Monash University International Student Health and Wellbeing Survey, 2023 |
| 3 | **#1** — Loneliness is the top self-reported issue for Australians aged 15–24 | University of Melbourne Loneliness Research Group, 2023 |

### Chart Strips (no overlap with stat cards)

| Strip | Stat | Source | URL |
|-------|------|--------|-----|
| 1 | **65%** of young Australians 18–25 experiencing high/very high psychological distress | headspace National Survey, 2025 | headspace.org.au/our-organisation/media-releases/... |
| 2 | **56%** of young people named cost of living as Australia's #1 national concern | Mission Australia Youth Survey, 2024 | missionaustralia.com.au/media-centre/... |
| 3 | **2 in 5** young Australians report stress directly linked to their mental health | Mission Australia Youth Survey, 2025 | missionaustralia.com.au/what-we-do/research-and-resources/youth-survey |
| 4 | **2 in 3** young renters under 25 remain in housing stress even after government rent assistance | AIHW · Housing Assistance in Australia, 2024 | aihw.gov.au/reports/housing-assistance/... |

Strip bar widths: 65, 56, 60 (display "2 in 5"), 67 (display "2 in 3") — all ≥56% for visual impact.

---

## 3. Section Structure

```
bg-minuri-white

  ┌─ pt-24 md:pt-32 constrained (max-w-7xl) ───────────────┐
  │  Section kicker                                         │
  │  h2: "Independent living is harder than it looks."      │
  │  Subheading: "The systems that support you..."          │
  │                                                         │
  │  Stat cards row (grid-cols-1 sm:grid-cols-3)            │
  │  [StatCard 1]  [StatCard 2 — counter]  [StatCard 3]     │
  │                                                         │
  │  "Break it down by area" lead-in (text-center)          │
  └─────────────────────────────────────────────────────────┘

  ┌─ Full-bleed LandingInsightChart ────────────────────────┐
  │  bg-minuri-ocean · 100vw · no max-width constraint      │
  │  [Strip 1: 65%  ████████████████████████████░░░░░░░░]  │
  │  [Strip 2: 56%  ████████████████████████░░░░░░░░░░░░]  │
  │  [Strip 3: 2in5 ████████████████████████░░░░░░░░░░░░]  │
  │  [Strip 4: 2in3 ██████████████████████████░░░░░░░░░░]  │
  └─────────────────────────────────────────────────────────┘

  pb-24 md:pb-32
```

---

## 4. Components

### 4.1 `LandingDataSection`

**File:** `components/landing/landing-data-section.tsx`

Layout split into three divs:
1. Constrained (`max-w-7xl`, `px-5 md:px-8`, `pt-24 md:pt-32`) — heading, stat cards, lead-in
2. Full-bleed (`mt-6`, no padding) — `<LandingInsightChart />`
3. Bottom spacer (`pb-24 md:pb-32`)

The full-bleed break is intentional — the chart sits edge-to-edge across the white section.

---

### 4.2 `LandingStatCard`

**File:** `components/landing/landing-stat-card.tsx`

```typescript
interface LandingStatCardProps {
  stat: string;          // display text when no counter ("1 in 4", "#1")
  label: string;
  source: string;
  fullCitation: string;  // data-source attribute for auditability
  delay?: number;        // entrance stagger in seconds
  accentClass?: string;  // tailwind bg class, e.g. "bg-minuri-teal"
  countTo?: number;      // if set, animates 0 → countTo on inView
  countSuffix?: string;  // e.g. "%"
}
```

Visual anatomy:
- Top accent bar: `h-[3px] w-10 rounded-full ${accentClass}`
- Stat number: `text-[3.25rem] font-black leading-none tracking-tight text-minuri-ocean`
  - Counter: `useCountUp(to, active, duration=1400)` — cubic ease-out, triggers on `useInView(amount: 0.4)`
  - Only card 2 (98%) uses counter; cards 1 and 3 display static text
- Label: `text-sm leading-relaxed text-minuri-ocean/70`
- Source: `text-[11px] uppercase tracking-wide text-minuri-ocean/40` — `border-t` separator
- Card bg: `bg-minuri-fog/60 rounded-2xl`
- Hover: `-translate-y-1.5 shadow-lg`
- Entrance: `opacity: 0→1, y: 20→0`, stagger `delay: i * 0.1s`

Accent colors:
| Card | Stat | Accent |
|------|------|--------|
| 1 | 1 in 4 | `bg-minuri-teal` |
| 2 | 98% | `bg-minuri-coral` + counter |
| 3 | #1 | `bg-minuri-sky` |

---

### 4.3 `LandingInsightChart`

**File:** `components/landing/landing-insight-chart.tsx`

**No external charting library.** Pattern Breaking–inspired scroll-driven strips.

#### Data structure

```typescript
type ContextRun = { text: string; bold?: boolean };

const STRIP_DATA = [
  {
    value: 65,              // bar fill width as %
    displayStat: "65%",    // shown as large number; non-% strings skip counter
    source: "headspace National Survey · 2025",
    context: ContextRun[], // complete standalone sentence with stat embedded
    color: "#fcf300",      // pastel fill color
    sourceUrl: string,     // opens in _blank on click
  },
  // ...
];
```

#### Strip layout (per `StripBar`)

```
┌─ min-h-[200px] md:min-h-[220px] 2xl:min-h-[300px] ──────┐
│  bg-minuri-ocean + 10-column grid overlay                 │
│                                                           │
│  [absolute fill: color, width 0→value%, 1.2s ease-out]   │
│                                                           │
│  [number: left 0→value%, opacity 0→1, vertically centered]│
│    clamp(3.5rem, 12vw, 8rem) · text-minuri-white          │
│    pl-3 md:pl-4 gap from fill tip · in dark zone          │
│                                                           │
│  [context text: left 32–40%, z-10]                        │
│    source: 9px uppercase text-minuri-ocean/50             │
│    sentence: text-base md:text-lg text-minuri-ocean        │
│    bold runs: font-black text-minuri-ocean                 │
│                                                           │
│  [hover: "View source →" bottom-right, opacity 0→white/35]│
└───────────────────────────────────────────────────────────┘
```

#### Number rendering

- `displayStat` contains `%` → shows animated counter: `${count}%`
- `displayStat` does not contain `%` (e.g. "2 in 5") → shows static `displayStat` string; `value` still drives bar width

#### Interaction

- Click / Enter / Space → `window.open(sourceUrl, "_blank", "noopener,noreferrer")`
- No-op if `sourceUrl` is empty (placeholder)
- `aria-label`: full sentence + "View source."

#### Animation

| Element | Trigger | Behaviour |
|---------|---------|-----------|
| Fill | `useInView(amount: 0)` | `width: 0 → value%`, 1.2s, ease `[0.22,1,0.36,1]` |
| Number | Same trigger | `left: 0 → value%`, `opacity: 0→1`, same timing |
| Counter | Same trigger | `useCountUp(value, active, delay=150, duration=1050)` — finishes with fill |

#### Container

`bg-minuri-ocean` with CSS vertical grid:
```css
backgroundImage: "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px)"
backgroundSize: "10% 100%"   /* 10 equal columns */
```

---

## 5. Responsive Layout

| Breakpoint | Stat cards | Strip height | Number size |
|------------|------------|--------------|-------------|
| < 640px | `grid-cols-1` | 200px | clamp(3.5rem, 12vw, 8rem) |
| 640px–1536px | `grid-cols-3` | 220px | same clamp |
| ≥ 1536px (2xl) | `grid-cols-3` | 300px | same clamp |

Context text column: `w-[40%]` mobile → `w-[36%]` md → `w-[32%]` lg.  
Number always in dark zone: all bar values ≤ 67%, number at `left: value%` with `pl-3`, safe from overlap.

---

## 6. Accessibility

- `LandingStatCard`: `data-source={fullCitation}` attribute for auditability
- `LandingInsightChart` strips: `role="button"`, `tabIndex={0}`, descriptive `aria-label`
- Keyboard: Enter/Space opens source URL
- `section` has `aria-labelledby="why-it-matters-heading"`

---

## 7. File Checklist

```
components/landing/
  landing-data-section.tsx   ✓ two-act, full-bleed chart break
  landing-stat-card.tsx      ✓ counter animation, accent bar, accentClass prop
  landing-insight-chart.tsx  ✓ Pattern Breaking strips, verified data, source URLs

iteration3/
  landing-data-section-prd.md  ✓ this document (v3.0)
```

Removed:
- `recharts` — no longer used
- `LandingPersonaCard`, `LandingPersonaToggle` — removed from this section

---

## 8. Open Questions

| Question | Status |
|----------|--------|
| `sourceUrl` placeholders for strips 2–4 | ✓ URLs added for all 4 strips |
| Persona section | Removed — handled elsewhere |
| Recharts package | Still in package.json; safe to uninstall |
