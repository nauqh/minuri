# Minuri Frontend

# Minuri Server

<div align="center">
  <img src="./public/favicon.png" width="300" alt="Minuri icon">
</div>
<br/>
<p align="center">
<a href=""><img src="https://img.shields.io/badge/Latest%20Version-V0.0.1-blue.svg?&style=for-the-badge&logo=git&logoColor=white&colorB=7289DA"></a> <br>
<a href=""><img src="https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white"></a>
<a href=""><img src="https://img.shields.io/badge/shadcn/ui-%23000000?style=for-the-badge&logo=shadcnui&logoColor=white"></a>
<a href=""><img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB"></a>
<a href=""><img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white"></a>
<a href=""><img src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white"></a>
</p>

Minuri is a web app for first-time independent young adults in Melbourne.  
It helps users move from "I do not know where to start" to practical action through:

- a clear landing experience,
- short, actionable guides, and
- a location-based "Near Me" finder.

## Getting Started

Install dependencies and run locally:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## App Components

The frontend is organized into three main feature surfaces:

### 1) Landing (`/`)

Purpose: orient first-time users and route them to core actions.

Main components:

- `components/landing/home-view.tsx` (page shell)
- `components/landing/landing-hero-section.tsx`
- `components/landing/landing-header.tsx`
- `components/landing/spotlight-scroll-section.tsx`
- `components/landing/landing-flow-section.tsx`
- `components/landing/landing-care-section.tsx`
- `components/landing/landing-access-section.tsx`
- `components/landing/landing-footer.tsx`
- `components/landing/scroll-to-top-button.tsx`

### 2) Guides (`/guides`, `/guides/[slug]`, `/guides/bookmarks`)

Purpose: let users browse, search, read, and save practical guides.

Main components:

- `components/guides/guides-library-view.tsx` (library + bookmarks modes)
- `components/guides/guides-shell.tsx` (shared layout shell)
- `components/guides/guide-card.tsx`
- `components/guides/guide-detail-view.tsx`
- `components/guides/guide-widget.tsx`
- `components/guides/related-guides.tsx`
- `components/guides/bookmark-button.tsx`

### 3) Near Me (`/near-me`)

Purpose: help users find local places by suburb and topic.

Main components:

- `components/near-me/near-me-entry.tsx` (suburb entry step)
- `components/near-me/near-me-view.tsx` (results experience)
- `components/near-me/near-me-map.tsx` (map rendering)

### Shared UI

Reusable UI primitives live in `components/ui/*` (buttons, icons, menu, etc.).

## Sitemap

### User-facing routes

- `/` - Landing page
- `/guides` - Guide library (filter + search)
- `/guides/[slug]` - Guide detail page
- `/guides/bookmarks` - Saved guides
- `/near-me` - Near Me flow (entry and results states)
- `/not-found` - Not Found UI

### API routes (frontend-consumed)

- `/api/suburbs` - suburb autocomplete data
- `/api/nearby-interest` - nearby places data
- `/api/population` - young-adult population context

## Simple React Component Map

This map shows high-level composition (not every small UI element).

```txt
app/page.tsx
└─ HomeView
   ├─ LandingHeroSection
   │  └─ LandingHeader
   ├─ SpotlightScrollSection
   ├─ LandingFlowSection
   ├─ LandingCareSection
   ├─ LandingAccessSection
   ├─ LandingFooter
   └─ ScrollToTopButton

app/guides/page.tsx
└─ GuidesLibraryView (mode="library")
   └─ GuidesShell
      └─ GuideCard[]

app/guides/bookmarks/page.tsx
└─ GuidesLibraryView (mode="bookmarks")
   └─ GuidesShell
      └─ GuideCard[] (bookmarked only)

app/guides/[slug]/page.tsx
└─ GuideDetailView
   └─ GuidesShell
      ├─ BookmarkButton
      ├─ GuideWidget? (optional)
      └─ RelatedGuides

app/near-me/page.tsx
└─ NearMeEntry (when no suburb query)
   OR
└─ NearMeView (when suburb provided)
   └─ NearMeMap
```

## Project Structure (Frontend)

```txt
app/
  page.tsx
  guides/
    page.tsx
    loading.tsx
    bookmarks/page.tsx
    [slug]/page.tsx
  near-me/page.tsx
  api/
    suburbs/route.ts
    nearby-interest/route.ts
    population/route.ts

components/
  landing/*
  guides/*
  near-me/*
  ui/*
```

## Notes

- Guides bookmarks are stored in browser localStorage (no auth required).
- Near Me currently supports all topic tabs in UI, with the current data-fetch implementation centered on `survive`.
