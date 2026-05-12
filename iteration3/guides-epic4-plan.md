# Epic 4 — Guides: Paper & Notes Reading Experience
## Implementation Record (Shipped — 2026-05-11)

**Inspiration:** Politico EU editorial long-read + physical scrapbook/notebook aesthetic  
**Principle:** Each section has a distinct paper register. Reader always knows where they are.

---

## Font Stack (2 fonts only)

| Font | Variable | Used for |
|------|----------|---------|
| **Inter** | `--font-sans` | All body prose, UI labels, feeling section |
| **Caveat** | `--font-handwriting` | Moment section only |
| **Fraunces** | `--font-hero-serif` | All headings, guide card titles, up-next card title, How It Works h2 |

Loaded in `app/layout.tsx` via `next/font/google`. `--font-handwriting` is set on `<html>` by Caveat's `.variable`.

---

## Section Visual Register

| Section | Paper type | Font | Background | Key CSS class |
|---------|-----------|------|-----------|--------------|
| **Moment** | Lined journal | Caveat 1.5rem | Warm cream + ruled lines | `.guide-section-moment` |
| **Feeling + Reveal** | Side-by-side flex row | Inter / Fraunces | White margin / Dark navy | flex container |
| **Feeling** | Margin annotation | Inter 1.05rem | White, rose left border at `left:0` | `.guide-section-feeling` |
| **Reveal** | Crumpled dark paper | Inter semibold | `oklch(0.22 0.028 232)` navy | `.guide-section-reveal` |
| **How It Works** | Graph paper | Fraunces h2 + Inter body | Grid lines bg | `.guide-section-body` |
| **First Steps** | Sticky notes | Inter | Pastel per card | `.guide-sticky` + variants |
| **Next Chapter** | Pinned index card | Fraunces title | Warm off-white paper | `.guide-next-card` |

---

## Page Anatomy (as built)

```
┌─────────────────────────────────────────────────────────┐
│  STICKY HEADER — logo + progress bar + nav              │
├─────────────────────────────────────────────────────────┤
│  HERO — full-width image h-[180px] md:h-[300px]         │
│  Title (Fraunces) + summary + read time                 │
├─────────────────────────────────────────────────────────┤
│  THE MOMENT ━━                                          │
│  Caveat 1.5rem, lined journal paper bg, warm cream      │
│  Rose left binding, line-height: 2                      │
├────────────────────┬────────────────────────────────────┤
│  THE FEELING ━━   │  [revealSection.title] ━━           │
│  Inter, rose      │  Dark navy crumpled paper            │
│  margin line      │  White semibold prose               │
│  left:0 border    │  Torn paper bottom (SVG Q-curve)    │
│  ← slides left    │  → slides right on scroll           │
├────────────────────┴────────────────────────────────────┤
│  HOW IT WORKS ━━                                        │
│  Graph paper bg, Fraunces h2, Inter prose               │
├─────────────────────────────────────────────────────────┤
│  FIRST STEPS ━━                                         │
│  4-column sticky note grid (2-col mobile)               │
│  Yellow / Mint / Blue / Peach, tape strip, rotation     │
├─────────────────────────────────────────────────────────┤
│  UP NEXT ━━                                             │
│  Pinned index card (max-w-md, coral pushpin)            │
│  Swing animation on hover (transform-origin: top)       │
└─────────────────────────────────────────────────────────┘
```

---

## Components Built

| Component | File | What it does |
|-----------|------|-------------|
| `GuideSectionLabel` | `components/guides/guide-section-label.tsx` | Uppercase label + teal underrule. `dark` prop for navy sections |
| `GuideMarkdown` | `components/guides/guide-markdown.tsx` | Default `<p>`: no hardcoded font-size (lets parent CSS control). `<strong>`: `font-bold` only (inherits colour) |

### Deleted from render
- Bridge section (Near Me CTA) — removed entirely
- JourneyNearbyPanel (suburb panel) — removed entirely
- `bridgeSection`, `bridgeCardText` variables — deleted
- `JourneyNearbyPanel` import — deleted

---

## CSS Classes (globals.css)

### `.guide-section-moment`
```css
background: oklch(0.975 0.025 78);
background-image: repeating-linear-gradient(/* ruled lines */);
border-left: 3px solid oklch(0.78 0.07 25 / 0.3);
font-family: var(--font-handwriting), cursive;
font-size: 1.5rem;  /* larger than Inter — Caveat renders smaller */
line-height: 2;
```
Mobile: `font-size: 1.3rem`  
Large (1500px+): `font-size: 1.65rem`

### `.guide-section-feeling`
```css
position: relative;
padding: 0.5rem 1.5rem 0.5rem 1.25rem;
font-size: 1.05rem;  /* Inter, matches body */
line-height: 2;
color: oklch(0.28 0.025 260);
```
`::before` — rose vertical line at `left: 0` (flush with section edge)

### `.guide-section-reveal`
```css
background: oklch(0.22 0.028 232);  /* dark navy */
padding: 3.5rem 2.5rem 6rem;
border-radius: 4px;
```
`::before` — radial gradient texture overlay  
`::after` — SVG Q-curve mask at `bottom: 0`, `height: 64px` creates torn paper bottom edge  
`strong` inside inherits white from paragraph (not `text-minuri-ocean`)

### `.guide-section-body`
```css
background-image: linear-gradient(/* grid lines 1.5rem */), linear-gradient(90deg, /* grid */);
padding: 2rem;
border-radius: 0.5rem;
border: 1px solid oklch(0.88 0.02 210 / 0.45);
```

### `.guide-sticky` + variants
Base: `position: relative; padding: 1.25rem 1.25rem 1.75rem; border-radius: 2px`  
`::before` — tape strip at top-center (`44px × 18px`, amber semi-transparent)  
Variants cycle by `index % 4`:
- `.guide-sticky-a` — yellow, `rotate(-1.5deg)`
- `.guide-sticky-b` — mint, `rotate(0.8deg)`
- `.guide-sticky-c` — sky blue, `rotate(-0.6deg)`
- `.guide-sticky-d` — peach, `rotate(1.2deg)`

Mobile (`<640px`): rotation removed (`transform: none`)

### `.guide-next-card` + `@keyframes guide-swing`
```css
transform-origin: top center;  /* pivots at pushpin */
transform: rotate(-0.8deg);

@keyframes guide-swing {
  0%   rotate(-0.8deg)
  20%  rotate(-6deg)   /* swings wide left */
  45%  rotate(3.5deg)  /* rebounds right */
  65%  rotate(-2deg)
  80%  rotate(1deg)
  100% rotate(-0.8deg) /* settles */
}
```
Hover triggers `guide-swing 0.75s cubic-bezier(0.36, 0.07, 0.19, 0.97)`

### `.guide-section-bridge` (CSS kept, section removed from render)
Scissor tear-off — `::before` dashed border, `::after` ✂ icon. Unused since bridge was removed.

---

## Layout & Responsiveness

### Content width strategy
Matches landing (`px-4 md:px-8`, fixed Tailwind breakpoints, `min-[1500px]` cap):

| Breakpoint | Width |
|-----------|-------|
| Mobile `<640px` | `w-full` |
| `md` 768px | `max-w-3xl` |
| `lg` 1024px | `max-w-4xl` |
| `xl` 1280px | `max-w-5xl` |
| `min-[1500px]` | `max-w-6xl` |

Outer: `px-4 py-6 md:px-8 md:py-10`

### Feeling + Reveal side-by-side
```tsx
<div className="flex flex-col gap-6 md:flex-row md:items-stretch">
  <motion.section className="guide-section-feeling md:flex-1" style={{ paddingTop: "2rem" }}>
  <motion.section className="guide-section-reveal md:flex-1" style={{ paddingTop: "2rem" }}>
```
`paddingTop: "2rem"` via inline style (overrides unlayered CSS — Tailwind `pt-*` loses to unlayered CSS)  
Both use `paddingTop: "2rem"` so labels align across columns.

### First Steps grid
`grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4`

---

## Scroll Animations

### Shared `sectionAnim`
```tsx
const sectionAnim = {
  initial: { opacity: 0, y: 52, filter: "blur(6px)" },
  whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
  viewport: { once: true, amount: 0.08 },
  transition: { duration: 0.7, ease: SECTION_ENTER_EASE },
};
```
`prefersReducedMotion` collapses to `duration: 0.01`, no y/blur.

### Feeling + Reveal override (horizontal slide)
```tsx
// Feeling — slides from left
initial={{ opacity: 0, x: -60, filter: "blur(4px)" }}
whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}

// Reveal — slides from right
initial={{ opacity: 0, x: 60, filter: "blur(4px)" }}
whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
```
`viewport`/`transition` inherited from spread `{...sectionAnim}`.

---

## Up Next Card (inline in guide-detail-view.tsx)

```
          ○  (coral pushpin, size-7)
┌──────────────────────────────────────┐
│  [16:8 thumbnail — polaroid border]  │
│  ░░░░ gradient overlay ░░░░░░░░░░░  │
│  TOPIC NAME (bottom-left, white/70)  │
├──────────────────────────────────────┤
│  Guide Title (Fraunces, text-xl)     │
│  X min read                          │
│  Continue reading →                  │
└──────────────────────────────────────┘
```

- Warm paper bg `oklch(0.975 0.022 80)`, no shadow
- Thumbnail: `aspect-[16/8]`, `border-b-4 border-white/60` (polaroid strip)
- Image overlay label: `getTopicMeta(nextGuide.topic)?.name`
- Swing on hover via `.guide-next-card` CSS class
- Max width: `max-w-md mx-auto`

---

## Typography Standardisation

All body prose: `text-[1.05rem] leading-8`  
Exception: Caveat sections (Moment) — CSS controls size, no `text-*` in `paragraphClassName`  
`GuideMarkdown` default `<p>`: `leading-8 text-minuri-ink` (no font-size — parent CSS controls)  
`GuideMarkdown` `<strong>`: `font-bold` only — inherits colour from `<p>` (critical for dark reveal section)

---

## `GuideSectionLabel` Component

```tsx
// components/guides/guide-section-label.tsx
interface GuideSectionLabelProps {
  label: string;
  dark?: boolean;   // switches to seafoam palette for dark navy bg
  className?: string;
}
```

Visual: `text-sm font-black uppercase tracking-[0.18em]` + `w-14 border-t-2` underrule  
Colors: light → `text-minuri-teal / border-minuri-teal/60`; dark → `text-minuri-seafoam/80 / border-minuri-seafoam/40`

Applied to: Moment, Feeling, Reveal (dark), How It Works, First Steps, Up Next

---

*Minuri · Epic 4 Implementation Record · 2026-05-11*
