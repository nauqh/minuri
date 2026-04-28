# Minuri Design Reference

This file documents the current visual and interaction system used by Minuri's marketing and onboarding experience. It is intended as a handoff reference for future agents so they can extend UI work without drifting from the existing style.

## Scope and source of truth

- Primary implementation source: `components/landing/`
- Global design tokens and utility classes: `app/globals.css`
- Theme strategy: Tailwind + CSS variables (`oklch`) + a small set of custom utility classes

## Brand intent

Minuri presents as calm, practical, and warm:

- Calm through ocean/teal/mist tones and soft shadows
- Practical through clear hierarchy, short actionable labels, and simple flows
- Warm through rounded surfaces, friendly copy, and expressive motion

## Design tokens

## Color system

Global variables live in `:root` and `.dark` in `app/globals.css`. Components are expected to use tokenized classes (`bg-minuri-*`, `text-minuri-*`) rather than raw hex.

Core Minuri palette:

- `--minuri-ocean`: deep brand anchor
- `--minuri-mid`: mid-depth ocean
- `--minuri-teal`: primary action and emphasis
- `--minuri-seafoam`: lighter interactive accent
- `--minuri-mist` / `--minuri-fog`: neutral surfaces
- `--minuri-slate`: secondary text
- `--minuri-pale`, `--minuri-ice`, `--minuri-silver`: supporting cool tints and borders
- `--minuri-coral`: warm contrast accent
- `--minuri-ink`: dark text anchor on light surfaces
- `--minuri-mint` and `--minuri-sky`: hero split-card fields

Practical usage patterns seen in landing:

- Primary CTA: `bg-minuri-teal` + `text-primary-foreground`
- Secondary CTA: bordered white/ocean style
- Section backgrounds alternate among `bg-minuri-white`, `bg-minuri-ocean`, `bg-minuri-mist`, `bg-minuri-fog`
- Borders often use `border-minuri-silver` with alpha

## Radius and shape

- Global base radius token: `--radius: 0.625rem`
- Landing container token: `--minuri-container-radius: 0.875rem`
- Shared utility: `.rounded-minuri`
- Common shape language:
  - Pills/capsules for nav and CTAs
  - Medium-rounded cards/panels for content blocks
  - Occasional larger rounded corners for hero cards and feature surfaces

## Typography

- Base font: `--font-sans` (applied on `html`)
- Accent serif utility: `.font-hero-serif`
- Landing headline voice: uppercase, heavy weight, tight tracking
- Secondary labels/kickers: uppercase, compact tracking, high contrast
- Support text: short lines with relaxed leading

Reusable component classes:

- `.landing-section-kicker`
- `.landing-section-heading`
- `.landing-section-subheading`

## Motion and interaction language

Shared easing and animation curve:

- `easeOut = [0.22, 1, 0.36, 1]`
- Used consistently across reveal, hover, and section transitions

Animation pattern:

- Entry: subtle opacity + small translate (FadeUp and section-specific variants)
- Scroll reveal: staged/staggered cards with `whileInView`
- Hover: small scale shifts for buttons/cards (around 1.02 to 1.08)
- Respect motion preferences via `useReducedMotion` where heavier effects exist

Micro-interaction details:

- Underline animation via `.minuri-link-underline`
- Chevron/icon nudges on hover for directional affordance
- Floating "back to top" appears contextually while scrolling up in tracked sections

## Landing page composition

High-level order in `HomeView`:

1. `LandingHubSidebar` (desktop floating setup panel)
2. `LandingHeroSectionV2`
3. Main content:
   - `SpotlightScrollSection` (3-step explanation cards + hub CTA)
   - `LandingCareSection` (topic cards; sticky desktop scrollytelling)
   - `LandingAccessSection` (email capture CTA)
4. `LandingFooter`
5. `ScrollToTopButton`

## Component patterns

## Header and navigation

- Desktop nav uses understated text links with animated underline
- Primary actions as pill buttons:
  - First-time guides (outlined/light)
  - Near me (filled teal)
- Mobile nav is a dedicated overlay panel with oversized, low-cognitive-load options
- Escape key closes mobile menus; body scroll is locked while open

## Hero

Current primary hero is `LandingHeroSectionV2`:

- Clean white surface with ocean/teal typography
- Rotating illustration cross-fade
- Dual CTA cluster (Near me + First-time guides)
- Mobile-first menu and compact divider treatment
- Highlight chips reinforce value propositions in uppercase format

Legacy hero (`LandingHeroSection`) still encodes useful patterns:

- Typewriter headline staging
- Intersecting two-path cards ("Guides" vs "Near me")
- Intentional reveal timing and progressive disclosure

## "How it works" / explanation cards

- Three-step narrative cards
- Vertical timeline cue on desktop
- Color-coded markers and card accents
- Each card combines:
  - Step label
  - Plain-language explanation
  - Structured options block

## Topic support section

- Five core support domains:
  - Food & Eating
  - Getting Around
  - Health & Wellbeing
  - Home & Admin
  - Social & Belonging
- Mobile: stacked reveal cards
- Desktop: sticky section with orchestrated spread/reveal effect

## Access section and footer

- "Ask Minuri" section uses minimal email + clear CTA
- Footer uses curved top transition and large CTA headline
- Bottom utility links remain low-noise and text-first

## Personalization and "Wellnest" UX model

The landing experience includes a local, privacy-preserving setup flow in `LandingHubSidebar`:

- Step 1: suburb selection with debounced search and keyboard navigation
- Step 2: life moment selection
- Step 3: choose up to 3 focus topics
- Completion gate controls "Continue to your page"
- Data is stored in localStorage via `landing-local-state.ts`
- Messaging explicitly states journey data stays on device

Language and framing:

- "Wellnest" = user's personal wellbeing nest
- Copy tone is supportive, non-clinical, and practical
- Recommendations reference the selected life moment and local context

## Utility and custom classes from globals

Important custom classes used by landing patterns:

- `.landing-hero-dots` (hero dot-grid surface)
- `.landing-header-no-bg-desktop`
- `.landing-hero-card-mint-a`
- `.landing-hero-card-mint-b`
- `.rounded-minuri`
- `.minuri-link-underline`
- `.landing-section-kicker`
- `.landing-section-heading`
- `.landing-section-subheading`

## Accessibility and UX constraints

- Visible focus rings on actionable controls
- Escape key support on overlays/menus
- `aria-*` labels and combobox/listbox semantics for suburb picker
- Reduced motion handling in complex animation areas
- Tap/hover parity: mobile interactions avoid hover-only dependence

## Agent guardrails for future UI changes

- Always use existing color tokens (`minuri-*`) from `app/globals.css`
- Prefer existing section utility classes before creating new variants
- Keep CTA hierarchy consistent: one strong primary, one quieter secondary
- Maintain uppercase heavy headline style on landing marketing sections
- Preserve low-friction language: short, plain, action-oriented copy
- For new animations, reuse `easeOut` and keep movement subtle
- Do not introduce raw hex unless a one-off artistic element truly requires it
- Keep privacy-first onboarding framing ("stored on this device") intact

## Quick implementation checklist

When adding or editing landing UI:

- Verify token usage (`bg-minuri-*`, `text-minuri-*`, `border-minuri-*`)
- Check desktop + mobile behavior (especially nav and overlays)
- Confirm focus, keyboard, and Escape behavior for interactive panels
- Respect `prefers-reduced-motion` in advanced animated sections
- Ensure copy aligns with Minuri tone: supportive, practical, non-judgmental
