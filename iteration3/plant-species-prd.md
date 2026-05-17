# Plant Growth — 6 Species per Archetype

## Concept

Each identity archetype gets a distinct SVG plant that grows as the user completes daily milestones (Day 0→7). Plant reveals character: Pioneer = patient seedling, Explorer = sprawling fern, etc. All geometry deterministic (djb2 jitter, no Math.random). All animation via Framer Motion pathLength + scale. `prefers-reduced-motion` respected.

---

## Species Map

| Archetype | Species Key | Plant Form | Leaf Color | Day 7 Bloom |
|---|---|---|---|---|
| The Quiet Pioneer | `pioneer` | Sprouting seedling — single trunk, 2 tiers of branches | `#52B788` (green) | 5-petal flower (current Bloom) |
| The Urban Explorer | `explorer` | Spreading fern — curved frond spine, alternating pinnae pairs | `#4FC3F7` (sky) | Fiddlehead spiral unfurl |
| The Careful Settler | `settler` | Tall narrow cypress — vertical trunk, 5 tight whorls ascending | `#81C784` (sage) | Crown bud cluster at apex |
| The Steady Builder | `builder` | Wide bonsai — short thick trunk, ±52° fork, tiered canopy | `#FFB74D` (amber) | Cherry blossom burst (4-petal rounded) |
| The Open Heart | `openheart` | Flowering bush — 5 stems in fan spread, dense leaves | `#F48FB1` (rose) | Progressive blooms Day 5/6/7 |
| The Hungry Wanderer | `wanderer` | Herb/basil — 6 thin stems, opposite leaf pairs | `#AED581` (lime) | 3-dot pollen cluster at stem tips |

---

## Growth Timeline (all species)

| Day | What appears |
|---|---|
| 0 | Seed dot only |
| 1 | Primary trunk / main stem(s) |
| 2 | First branch tier / frond spine |
| 3 | Second branch tier / first pinnae or leaf pair |
| 4 | Third tier / more pinnae or pairs |
| 5 | Outer leaves / deep pinnae / additional stems — saturation bump |
| 6 | All foliage complete |
| 7 | Bloom / blossom / spiral / cluster — full color, glow filter |

---

## Species Detail

### 1. Pioneer — Sprouting Seedling
Refined version of current single-species plant.

- Trunk: straight, 72px, slight jitter
- Tier 1 branches: ±30° from trunk tip (Day 2)
- Tier 2 branches: ±24° from tier 1 tips (Day 3)
- Leaves: ellipses at tier 2/3 tips, slow sway animation (Day 5)
- Flower stem: 22px above trunk fork (Day 6)
- Bloom: 5 petals + pollen center (Day 7)
- Stroke color = `palette[0].hex`, leaf = `#52B788`

### 2. Explorer — Spreading Fern
Horizontal, low-gravity, expansive feel.

- Main frond: quadratic bezier curving left-to-right across canvas (Day 1)
- Pinnae: 8 pairs, alternating sides, perpendicular to frond direction, 18px length, ellipse rx=3 ry=8 (Day 2–4, 2 pairs per day)
- Sub-pinnae: 3px ellipses on each pinna tip (Day 5)
- Second frond: mirrored, slightly shorter (Day 3)
- Fiddlehead: tight spiral path at frond tip (Day 7) — `M cx,cy` arc commands drawing inward curl
- Leaf color: `#4FC3F7`

### 3. Settler — Narrow Cypress
Tall, composed, disciplined silhouette.

- Trunk: vertical, 110px (Day 1)
- 5 whorls at y = 90, 72, 54, 36, 20 from base
- Each whorl: 2 branches ±18° from vertical, length 20/18/16/14/12px descending (Day 2–4, 2 whorls per step)
- Whorl 4+5 only appear Day 5
- Leaf ellipses: tiny rx=2.5 ry=5.5 clustered along each branch (Day 5–6)
- Crown bud cluster: 5 tiny circles at trunk apex, scale-in staggered (Day 7)
- Stroke = `palette[0].hex`, leaf = `#81C784`

### 4. Builder — Wide Bonsai
Grounded, broad, structural. Most visually complex.

- Short thick trunk: 45px, strokeWidth=5 (Day 1)
- Primary fork: ±52° at trunk tip, length 38px each (Day 2)
- Secondary branches from each fork: ±30°, length 24px (Day 3)
- Tertiary: ±22°, length 16px (Day 4)
- Leaf pads: ellipse groups (3 overlapping ellipses) at outer branch tips (Day 5–6)
- Cherry blossom: 4-petal rounded (rx=4.5 ry=3 ellipses, petal rotation 0/90/180/270°), 3 blossoms on right fork, 3 on left fork (Day 7)
- Stroke = `palette[0].hex`, leaf = `#FFB74D`

### 5. Open Heart — Flowering Bush
Wide, rounded, social. Blooms earliest.

- 5 main stems: fan from base, angles -40/-20/0/20/40°, length 70px, slight curve (Day 1–2)
- Leaf pairs: 3 pairs per stem, ellipses at t=0.4/0.6/0.8 along each stem (Day 3–4)
- Blooms begin Day 5: small 5-petal flowers at 3 stem tips
- Day 6: blooms on remaining 2 stems
- Day 7: additional bud at each bloom center, full saturation + glow
- Leaf color: `#F48FB1`, bloom = `palette[0].hex`

### 6. Wanderer — Herb / Basil
Upright, practical, quietly lush.

- 6 stems from single root: 3 left-leaning (-8/-5/-2°), 3 right-leaning (2/5/8°), length 80px (Day 1–2, 3 stems per day)
- Opposite leaf pairs: 3 pairs per stem at t=0.3/0.55/0.75
- Ellipse: rx=5 ry=10, perpendicular to stem direction (Day 3–5, 1 tier per day)
- Stem tips: small circle node visible from Day 1
- Day 7: 3-dot pollen cluster at each stem tip (3 circles r=2.5, equilateral triangle arrangement)
- Leaf color: `#AED581`

---

## Implementation Plan

### File: `components/journey/plant-growth.tsx`

```
Types:
  SpeciesKey = "pioneer" | "explorer" | "settler" | "builder" | "openheart" | "wanderer"
  
  Branch = { id, d, sw, depth, day, tx, ty }
  Leaf   = { id, cx, cy, rx, ry, rot, sway, dur, day }
  Bloom  = { id, cx, cy, day, style: BloomStyle }
  BloomStyle = "flower" | "blossom" | "spiral" | "cluster" | "crown"
  
  SpeciesData = { branches, leaves, blooms, leafColor }

Module-level:
  ALL_SPECIES: Record<SpeciesKey, SpeciesData> — built once at load
  
  ARCHETYPE_TO_SPECIES: Record<string, SpeciesKey>
    "The Quiet Pioneer"   → "pioneer"
    "The Urban Explorer"  → "explorer"
    "The Careful Settler" → "settler"
    "The Steady Builder"  → "builder"
    "The Open Heart"      → "openheart"
    "The Hungry Wanderer" → "wanderer"

Build functions (all deterministic):
  buildPioneer()   → SpeciesData
  buildExplorer()  → SpeciesData
  buildSettler()   → SpeciesData
  buildBuilder()   → SpeciesData
  buildOpenHeart() → SpeciesData
  buildWanderer()  → SpeciesData

Bloom renderers (sub-components):
  FlowerBloom   — current Bloom, 5 petals + pollen
  BlossomBloom  — 4 petals rounded, used by Builder
  SpiralBloom   — arc path fiddlehead, used by Explorer
  ClusterBloom  — 3 dot circles, used by Wanderer
  CrownBloom    — 5 tight buds, used by Settler
  (OpenHeart reuses FlowerBloom, earlier reveal at Day 5)

PlantGrowth props:
  daysCompleted: number  (0–7)
  archetype: string      (mapped to SpeciesKey internally)
  color: string          (palette[0].hex)
  saturation?: number
  className?: string
```

### Files to update after plant-growth.tsx rewrite

| File | Change |
|---|---|
| `components/journey/identity-card.tsx` | Pass `archetype={archetype}` to `<PlantGrowth>` |
| `components/journey/identity-reveal.tsx` | Pass `archetype={identity.archetype}` to `<PlantGrowth>` |

---

## Visual Canvas

All species: `W=160 H=200 viewBox="0 0 160 200"`. `overflow: visible` so wide species (fern, bonsai) can bleed.

Base point: `cx=80 cy=192` (near bottom center).

Explorer frond: starts `x=20 y=150`, curves to `x=140 y=100` — horizontal spread.

Settler trunk: `x=80 y=192` → `x=80 y=82` — tall vertical.

Builder trunk: `x=80 y=192` → `x=80 y=147` — short, then wide fork.

---

## Out of Scope

- No physics simulation
- No interaction / hover on individual branches
- No server-side data — all geometry pre-computed at module load
- No per-user randomness — `jitter(seed, range)` is deterministic
