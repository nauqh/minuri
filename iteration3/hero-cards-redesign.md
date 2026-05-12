# Hero Topic Cards — Redesign Plan

## What stays

- Word cycling in the headline (`eat / travel / heal / settle / belong`) — keep as-is
- Per-card accent colors (`#00f5c8`, `#5dd6ff`, `#fcf300`, `#ffc2d1`, `#cae9ff`)
- Entrance spring drop animation + float loop
- `isActive` scale-up on hover/cycle
- 5-card layout (2×2 + 1 centred bottom)

---

## What is wrong now

| Problem | Why it feels generic |
|---|---|
| Icon + title + description | Standard SaaS card formula — nothing distinctive |
| All 5 cards identical in structure | No personality per topic |
| Description text at 0.75rem | Too small to read, adds noise not value |
| Icon is decorative, not expressive | MapPin/Heart/Utensils are UI icons, not brand |
| No visual link between card and headline word | The word cycle is disconnected from the card design |

---

## Redesign direction — Editorial Word Cards

**Core idea:** each card's primary visual is the _category word_ (`eat`, `travel`, `heal`, `settle`, `belong`) rendered large in **Fraunces** (the serif already loaded). The word on the card IS the word that animates in the headline — visual loop that reinforces the interaction.

### Card anatomy

```
┌──────────────────────────┐
│  FOOD & EATING   ↗ icon  │  ← small label row (Inter, 0.6rem, uppercase, 80% opacity)
│                          │
│                          │
│         eat              │  ← BIG WORD: Fraunces italic, ~3.5–4rem, fills card vertically
│                          │
│                          │
│  Groceries, cheap        │  ← one-liner (Inter, 0.72rem, 65% opacity), bottom-pinned
│  meals & cooking.        │
└──────────────────────────┘
```

- **Big word**: `font-fraunces italic font-black`, size `clamp(2.6rem, 6vw, 4rem)`, dark color at 85% opacity over the card bg
- **Label row**: keep category title + swap LucideIcon for a minimal 2-char category code (`F&E`, `GA`, `H&W`, `H&A`, `S&B`) in monospace — or drop icon entirely
- **Description**: keep but shrink role — single short line, bottom-pinned, `opacity-60`
- **Active state**: when this card drives the headline word, the big word jumps to `opacity-100` + slight scale; inactive cards dim the big word to `opacity-30`

### Why Fraunces

- Already loaded in `app/layout.tsx` (`--font-hero-serif`) — no extra bundle cost
- Optical size variable font: set `font-variation-settings: 'opsz' 144` for display size
- Italic serif on coloured card = editorial/magazine, not corporate SaaS
- Creates clear visual contrast with the Inter body text

### Active/inactive differentiation

```
active card:  big word opacity 100%, card scale 1.05 (keep existing), slight drop-shadow boost
inactive:     big word opacity 25%, card scale 1.0, slightly desaturate bg (mix with white 15%)
```

This makes it obvious which card is "talking" to the headline without hover confusion.

---

## Layout options

### Option A — Keep 2×2 + 1 (low-effort)

Just restyle card internals. Easiest path, layout unchanged.

**Tradeoff:** grid is fine but not memorable.

### Option B — Stacked deck / offset columns (recommended if willing)

```
Col 1 (left, pushed up):    Card 1, Card 3
Col 2 (right, pushed down): Card 2, Card 4
Bottom centred:             Card 5
```

Achieved with `grid-rows` + `translate-y` offset on col 2. Cards overlap slightly vertically, creating depth. Works with existing rotation + float.

**Tradeoff:** more layout work, but feels like a real design choice not a grid.

### Option C — Horizontal fan (mobile-unfriendly, skip)

---

## Implementation notes

### Fraunces usage

```tsx
// tailwind.config: fontFamily already has 'fraunces': ['var(--font-hero-serif)']
// use: className="font-fraunces italic"
// add font-variation-settings via style prop for optical size:
style={{ fontVariationSettings: "'opsz' 144" }}
```

### Active word dim

```tsx
// in HeroTopicCard, replace static big-word with:
<span
  className="font-fraunces italic font-black transition-opacity duration-300"
  style={{
    fontSize: 'clamp(2.6rem, 5vw, 3.8rem)',
    color: '#05292a',
    opacity: isActive ? 1 : 0.22,
    fontVariationSettings: "'opsz' 144",
  }}
>
  {card.word}
</span>
```

### Remove

- `card.icon` import + render
- `card.wordColor` (was unused in current card body anyway)
- Description `<p>` — move inline to bottom with `mt-auto`

---

## Scope

- Edit: `components/landing/landing-hero-section-v2.tsx` only
- No new files
- No changes to animation logic, word cycling, or parent layout
- `HERO_TOPIC_CARDS` data: add nothing, remove `wordColor` field after confirmed unused

## Decision needed

1. Option A (card internals only) or Option B (layout + internals)?
2. Keep the one-line description or drop it to let the word breathe?
