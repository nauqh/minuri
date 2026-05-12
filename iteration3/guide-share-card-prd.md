# Guide Take-Away Card — Downloadable PDF PRD

**Epic:** 3 — Guide: Shareable Summary Card  
**Version:** 1.0  
**Date:** 2026-05-11  
**Status:** Planned

---

## 1. Goal

Replace the current "copy link to clipboard" share action with something more useful and memorable. Instead of opening a social media share sheet, the user downloads a single-page styled card that summarises the guide — something they can save, screenshot, or print.

The output feels like a page torn from a personal notebook: handwritten-style labels, sticky notes, ruled lines, real content. Not a marketing flyer — a reference sheet the user actually keeps.

---

## 2. Concept

**Metaphor:** A page from a study notebook. The kind you'd write notes in while reading something important — not perfectly formatted, but intentional. Sticky notes with key warnings. Circled action items. A torn edge. Minuri's voice throughout.

**Reference:** The notebook canvas aesthetic from the "How It Works" section in the guide detail view — cream background, ruled lines, slightly imperfect layout.

**Format:** A5 portrait (148 × 210mm). Narrow enough to feel like a card, tall enough to hold meaningful content. Downloads as PDF.

---

## 3. Visual Design

### Canvas

- Background: cream/off-white (`#faf8f3`) — aged notebook paper feel
- Horizontal ruled lines: subtle grey-blue, evenly spaced across the page
- Spiral coil: decorative SVG along the top edge
- Torn bottom edge: subtle SVG mask giving a ripped-paper finish
- Drop shadow on the card when shown in the modal preview

### Typography

- Guide title: large, bold sans-serif (Minuri's existing heading font) — feels "written in marker"
- Section labels: small uppercase, slightly faded — like a pen running out of ink
- Body text: clean sans-serif at readable size — handwriting-style font optional for labels only
- Topic chip: colour-coded pill matching the guide's topic colour

### Sticky notes

Two sticky notes placed at slight angles across the card:

| Note | Content | Colour |
|------|---------|--------|
| Note 1 — Warning / heads-up | First sentence from the guide's `reveal` section | Yellow `#fcf300` |
| Note 2 — Quick tip | First sentence from the guide's `moment` section | Pink `#ffc2d1` |

Each note: rounded corners, subtle drop shadow, rotated ±3–5°, handwriting-style label at top ("heads up" / "good to know").

### Layout (top to bottom)

```
┌─ spiral coil ─────────────────────────────┐
│                                            │
│  [Minuri logo]         [Topic chip]        │
│                                            │
│  Guide Title                               │
│  ─────────────────────────────────────     │  ← ruled line
│  Summary sentence                          │
│  ─────────────────────────────────────     │
│                                            │
│  KEY THINGS TO KNOW                        │
│  ─────────────────────────────────────     │
│  • Point 1                                 │
│  ─────────────────────────────────────     │
│  • Point 2                  ┌──────────┐   │
│  ─────────────────────────  │ heads up │   │
│  • Point 3                  │ ...note..│   │ ← sticky note 1
│  ─────────────────────────  └──────────┘   │
│  • Point 4                                 │
│                                            │
│  YOUR FIRST STEP                           │
│  ─────────────────────────────────────     │
│  ☐  [First step label]  (~X min)           │
│                                            │
│         ┌─────────────────┐                │
│         │  good to know   │                │ ← sticky note 2
│         │  ...note...     │                │
│         └─────────────────┘                │
│                                            │
│  minuri.app/guides/[topic]/[slug]          │
│  ─────────────────────────────────────     │
└─ torn edge ───────────────────────────────┘
```

---

## 4. Content Mapping

All content pulled automatically from the `Guide` object. No manual authoring required per guide.

| Card element | Source field | Notes |
|--------------|-------------|-------|
| Guide title | `guide.title` | — |
| Topic chip | `guide.topic` | Colour-coded by topic |
| Summary | `guide.summary` | Truncate at 120 chars if needed |
| Key points (3–4) | `guide.sections` where `sectionKey === "how-it-works"` → `body[0..3]` | First 3–4 body paragraphs |
| Sticky note 1 | `guide.sections` where `sectionKey === "reveal"` → `body[0]` | First sentence only |
| Sticky note 2 | `guide.sections` where `sectionKey === "moment"` → `body[0]` | First sentence only |
| First step | `guide.firstSteps?.[0]` | Label + estimateMin |
| Guide URL | `minuri.app/guides/[guide.topic]/[guide.slug]` | — |
| Download date | `new Date()` formatted as "May 2026" | Bottom-right corner, small |

### Topic colours

| Topic | Chip colour | Accent |
|-------|-------------|--------|
| `health-wellbeing` | Teal | `bg-minuri-teal` |
| `home-admin` | Coral | `bg-minuri-coral` |
| `food-eating` | Sky | `bg-minuri-sky` |
| `getting-around` | Mint | `bg-minuri-mint` |
| `social-belonging` | Yellow | `bg-[#fcf300]` |

---

## 5. Interaction Flow

```
Guide detail page
  ↓
User clicks "Download summary" button
  (replaces or sits beside existing copy-link action)
  ↓
Modal opens — shows card preview at full A5 size
  Card is a live React component, rendered at fixed px dimensions
  ↓
User clicks "Download PDF"
  html2canvas captures the card DOM node → canvas
  jsPDF converts canvas to A5 PDF → browser triggers download
  Filename: "minuri-[guide-slug].pdf"
  ↓
Modal closes (or stays open for user to close)
```

### Modal design

- Full-screen overlay, dark backdrop
- Card preview centred, with realistic drop shadow
- Two buttons below the card: "Download PDF" (primary) and "Close"
- On mobile: card scales down to fit screen width

---

## 6. Technical Approach

### Rendering

- `GuideShareCard` — a React component rendered at **794 × 1123px** (A4 at 96dpi — A5 at 144dpi) using fixed pixel dimensions inside a scrollable modal
- All styles inline or scoped so `html2canvas` captures them faithfully
- Web fonts must be loaded before capture — use `document.fonts.ready` before triggering export
- SVG elements (coil, torn edge) rendered inline — not as `<img>` tags, which html2canvas may miss

### PDF export

```
html2canvas(cardRef.current, { scale: 2, useCORS: true })
  → canvas (high-res)
  → jsPDF A5 portrait
  → pdf.addImage(canvas, 'PNG', 0, 0, 148, 210)
  → pdf.save('minuri-[slug].pdf')
```

Libraries needed:
- `html2canvas` — DOM → canvas
- `jspdf` — canvas → PDF download

### Fallback

If PDF export fails (e.g. font rendering issues): fall back to `canvas.toBlob()` → download as PNG. User gets the image even if PDF conversion fails.

---

## 7. Files

```
components/guides/
  guide-share-card.tsx       ← the styled card component (fixed px dimensions)
  guide-share-modal.tsx      ← modal wrapper with preview + download button

iteration3/
  guide-share-card-prd.md    ← this document
```

Modified:
- `components/guides/guide-detail-view.tsx` — replace/extend share button (line ~821) to open modal

Dependencies to install:
- `html2canvas`
- `jspdf`

---

## 8. Open Questions

| Question | Status |
|----------|--------|
| Does every guide have a `how-it-works` section? | Need to verify — fallback to `reveal` if missing |
| Does every guide have `firstSteps`? | Optional field — hide "Your first step" block if absent |
| Font rendering in html2canvas | Web fonts often mis-render — may need to embed font as base64 or use system fonts only for the card |
| Mobile download UX | On iOS, PDF download opens in browser tab rather than saving — may need a "Share / Save" instruction |
| Should the card be guide-specific or journey-summary? | Currently scoped to single guide. Journey summary (multiple guides) is a future extension. |
