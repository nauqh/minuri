# Hero Walker Animation Plan
> Bottom-left dead zone → animated character + CTA reveal

---

## Concept

A small flat-vector character enters from the left edge of the hero, walks across the bottom of the section carrying a suitcase. As they pass the CTA zone, the buttons spring into view. The character glances at them, then continues off-screen right. Loop restarts after a short pause.

**Tone**: Warm, playful, editorial — not cutesy. Matches sticky-note aesthetic.  
**Brand fit**: Character uses Minuri ink/teal palette. Suitcase = settling into new place narrative.

---

## Visual Direction

```
┌─────────────────────────────────────────────────────────────┐
│  FEELING AT HOME, WHEREVER YOU [eat]         [sticky cards] │
│                                                             │
│  Your everyday support system...             [sticky cards] │
│                                                             │
│  [Find nearby support ›]  [Start with guides ›]            │
│                                                             │
│  ──── 🚶 ────────────────────────────────────────────────   │
│                              ↑ SCROLL TO EXPLORE            │
└─────────────────────────────────────────────────────────────┘
```

Character walks on a faint baseline (the existing grid bottom edge). CTAs sit above in the left column at `mt-auto`.

---

## Character Design

Built entirely in SVG, inline in a React component. No external assets.

```
  ○        ← head (circle, #05292a fill)
  │        ← body (rect)
 / \       ← arms (lines, animated rotation)
  │
 / \       ← legs (lines, animated rotation, offset phase)

🧳         ← suitcase (small rect + handle, dangling from right hand)
```

**Size**: ~48×64px rendered. Stroke-based for clean scaling.  
**Colors**: Head/body `#05292a` (ink), suitcase `#00f5c8` (teal) or `#ffc2d1` (pink).

---

## Animation Phases

### Phase 1 — Enter (delay: 1.4s, after hero reveals)
- Character slides in from `x: -80px` → walk start position (left edge)
- Fade in with entry
- Walk cycle begins immediately

### Phase 2 — Walk across (ongoing)
- `x` translates from ~`-5%` → `110%` over ~8s, linear
- Legs alternate: `rotate: [0, 24, 0, -24, 0]` at ~0.45s per stride
- Arms counter-swing: opposite phase to legs
- Suitcase: slight `y` bob on each stride (spring)

### Phase 3 — CTA Reveal (triggered when character reaches ~30% x)
- CTAs animate in: `scale: [0.85, 1]`, `opacity: [0, 1]`, `y: [8, 0]`
- Staggered — primary CTA first (0ms), secondary CTA (+80ms)
- Character does a brief head-tilt (slight `rotate` on head element, then back)

### Phase 4 — Exit
- Character continues to `x: 110%`, walks off-screen
- After 2.5s pause, resets to `x: -80px` and loops

---

## Component Architecture

```
HeroWalkerScene
├── WalkerCharacter          ← SVG figure with animated parts
│   ├── Head (circle)
│   ├── Body (rect)
│   ├── ArmLeft / ArmRight   ← motion.line, rotate animation
│   ├── LegLeft / LegRight   ← motion.line, rotate animation
│   └── Suitcase             ← motion.g, bob animation
└── WalkerBaseline           ← optional faint dotted line (1px, opacity 0.15)
```

CTAs live in the existing left-column `mt-auto` block, revealed by a shared state from `HeroWalkerScene` (`ctaVisible: boolean`).

---

## State Machine

```ts
type WalkerPhase = "idle" | "entering" | "walking" | "looping"

// ctaVisible flips true when character x-progress > 0.30
// Never flips back false — CTAs stay visible once shown
```

Use `useMotionValue` + `useTransform` to derive `ctaVisible` from the character's `x` progress.

---

## Technical Stack

| Concern | Tool |
|---|---|
| Character movement | `motion.g` with `animate={{ x }}` |
| Limb cycle | `animate` with `repeat: Infinity` keyframe arrays |
| CTA reveal trigger | `useMotionValueEvent` on x progress |
| Loop reset | `onAnimationComplete` → reset x → restart |
| No new deps | Everything uses existing `motion/react` |

---

## CTA Integration

**Placement**: In-column (`mt-auto` block), remove `md:hidden` from desktop wrapper.

**Desktop CTA styles** (match mobile but horizontal, smaller):
```
[Find nearby support ›]  [Start with guides ›]
  filled teal, h-11        outlined ocean, h-11
```

**Reveal animation** (Framer Motion variants):
```ts
hidden: { opacity: 0, y: 12, scale: 0.92 }
visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 260, damping: 20 } }
```

CTAs animate in only after `ctaVisible = true` fires from walker progress.

---

## Micro-interactions

- **Hover CTA primary**: Character (if still on screen) does a quick arm-raise wave
- **Hover CTA secondary**: Suitcase swings slightly
- **Tab/focus CTA**: Same as hover — accessibility-aware

These are opt-in polish; implement after core walk loop is solid.

---

## Phases

| Phase | Scope |
|---|---|
| 1 | SVG character component + walk cycle (no movement) |
| 2 | `x` translate loop across hero bottom |
| 3 | CTA reveal triggered by walker progress |
| 4 | Head-tilt at CTAs + suitcase bob |
| 5 | Micro-interactions (hover reactions) |

---

## Open Questions

1. Should character loop continuously or stop at right edge and wait for scroll?
2. Character gender/style — abstract enough to be universal? (stick-ish vs fuller silhouette)
3. Should the baseline (dotted walk path) be visible or fully invisible?
4. Mobile: hide character entirely, or show a static version at bottom?
