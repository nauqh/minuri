# LLM-Powered Journey Plan — Epic PRD

**Epic:** 2 — Journey: Personalised 7-Day Plan
**Date:** 2026-05-15
**Status:** In Progress

---

## 1. Goal

Turn a new arrival's specific situation — their moment, suburb, and topic priorities — into a ready-made 7-day guide journey, so that they have a clear, personalised starting path rather than an open library to browse on their own.

### Page & component map

```
/journey (JourneyOnboarding)
  ├── Intro stage              ← full-height hero + floating sticky cards + "Build my plan" CTA
  └── Form stage               ← moment presets + suburb combobox + already-sorted checklist + topic chips
        └── Loading stage      ← spinner + topic-filtered guide thumbnails → redirect to /journey/plan

/journey/plan (JourneyPlanView)
  ├── WeekDrawer               ← slide-in right panel: 7-day list + vibe color swatch
  ├── DayStepperNav            ← 7-tab horizontal strip, vibe-accent active node, done-state checkmark
  └── DayContent × 7          ← topic icon + theme label + vibe narrative + guide accordion + tasks + nearby places
        ├── GuideAccordionRow  ← expandable guide card: image, title, read-time, summary, read link
        ├── Task checklist     ← checkbox list; persists to localStorage
        └── JourneyDayPlaces   ← live nearby places for the day's topic and suburb
```

---

## 2. Components in scope

| File | Responsibility |
|------|---------------|
| `components/journey/journey-onboarding.tsx` | All three onboarding stages: intro, form, loading |
| `components/journey/journey-plan-view.tsx` | Full plan view: header, stepper, day content, week drawer |
| `components/journey/journey-day-places.tsx` | Topic-filtered nearby places panel per day |
| `hooks/use-journey-state.ts` | localStorage read/write for journey inputs and task completion |
| `lib/journey-week.ts` | Plan-building algorithm and static content (narratives, tasks, skip logic) |
| `lib/vibes.ts` | Vibe presets: id, name, hex color, traits text |

---

## 3. User Stories

---

### US-01 — Journey Intro Screen

**As a** visitor arriving at `/journey`,
**I want** to see an engaging intro that explains what Journey will build for me,
**so that** I understand the value before committing to filling out a form.

#### Acceptance Criteria

---

**AC-01-1 — Intro stage appears on first visit**

> **Given** I navigate to `/journey`
> **When** the page loads
> **Then** I see a full-height screen with the heading "Your personal starter kit"
> **And** a description "A curated 7-day plan — guides + nearby services — built around your moment, your suburb, and what you still need to sort"
> **And** a "Build my plan" button centred on screen
> **And** no form fields are visible

---

**AC-01-2 — Floating sticky cards decorate the background**

> **Given** I am on the intro screen
> **When** the page has finished loading
> **Then** six coloured sticky-note cards are positioned around the edges of the screen
> **And** each card shows a topic label, a tip title, and a short tip note
> **And** each card gently floats upward and back down in a continuous looping animation

> **Given** I have enabled "Reduce motion" in my device accessibility settings
> **When** the intro screen loads
> **Then** the sticky cards are visible but static — no floating animation plays

---

**AC-01-3 — "Build my plan" advances to the form**

> **Given** I am on the intro screen
> **When** I click "Build my plan"
> **Then** the intro transitions out and the form screen appears in its place
> **And** a Back button is visible at the top of the form that returns me to the intro screen

---

### US-02 — Moment Selection

**As a** visitor on the Journey form,
**I want** to describe my current situation — either by picking a preset or writing my own —
**so that** my plan is built around my actual circumstances.

#### Acceptance Criteria

---

**AC-02-1 — Preset moment cards**

> **Given** I am on the form screen
> **When** I look at the "Your moment" section
> **Then** I see four preset cards arranged in a grid
> **And** each card shows an emoji, a bold headline, and a short italic preview sentence
> **And** no card is selected by default

> **Given** I click a preset card
> **When** the card activates
> **Then** the card shows a teal ring border and a filled teal checkmark in the top-right corner
> **And** a textarea appears below the grid containing the full preset text

> **Given** one preset card is already selected and I click a different card
> **When** the second card activates
> **Then** the first card loses its teal border and checkmark
> **And** the textarea updates to the second preset's full text

---

**AC-02-2 — Write your own**

> **Given** I am on the form screen
> **When** I click "Something else? Write your own"
> **Then** a textarea appears below the preset cards with placeholder "I just moved to Melbourne and I'm trying to figure out..."
> **And** no preset card appears selected

> **Given** I am typing in the textarea and have entered fewer than 30 characters
> **When** I look below the textarea
> **Then** a hint message reads "A little more detail helps us personalise your plan (N/30 characters)"
> **And** the textarea has an amber-coloured border

> **Given** I have typed 30 or more characters in the textarea
> **When** I look at the textarea and hint
> **Then** the border changes to teal
> **And** the character-count hint disappears

---

**AC-02-3 — "How it works" accordion**

> **Given** I am on the form screen
> **When** I click the "How it works" row
> **Then** a three-step numbered list expands below it, describing the three steps of building a plan
> **And** a downward chevron rotates to point upward

> **Given** the "How it works" section is expanded
> **When** I click the row again
> **Then** the list collapses and the chevron rotates back down

---

### US-03 — Suburb Selection

**As a** visitor filling out the Journey form,
**I want** to find my Melbourne suburb quickly and have it confirmed,
**so that** my plan and nearby places are relevant to where I actually live.

#### Acceptance Criteria

---

**AC-03-1 — Combobox search and dropdown**

> **Given** I am on the form screen
> **When** I type fewer than 3 characters into the suburb field
> **Then** no dropdown appears

> **Given** I type 3 or more characters into the suburb field
> **When** the debounce delay passes (~250 ms)
> **Then** a dropdown list appears below the input showing matching suburbs
> **And** each option shows a teal map-pin icon, the suburb name in medium weight, and the state and postcode in lighter text

> **Given** I type 3 or more characters and no suburb matches
> **When** the dropdown appears
> **Then** it shows "No matching suburb found." and no selectable options

---

**AC-03-2 — Keyboard navigation**

> **Given** the suburb dropdown is open with at least one option
> **When** I press the Down arrow key
> **Then** the first option highlights with a teal ring
> **And** pressing Down again moves the highlight to the next option

> **Given** an option is highlighted in the dropdown
> **When** I press Enter
> **Then** that suburb is selected and confirmed and the dropdown closes

> **Given** the suburb dropdown is open
> **When** I press Escape
> **Then** the dropdown closes without selecting anything
> **And** the input retains the text I had typed

---

**AC-03-3 — Confirmed state and change**

> **Given** I click a suburb option from the dropdown
> **When** the selection registers
> **Then** the input field shows the suburb name and becomes disabled with a light teal background
> **And** a "Set to [suburb name]" confirmation with a green checkmark icon appears below the field
> **And** a "Change" button appears beside the confirmation

> **Given** I click "Change"
> **When** the button is clicked
> **Then** the input field clears and becomes editable again
> **And** the confirmed state disappears

---

**AC-03-4 — Loading and error states**

> **Given** I have typed 3 or more characters and the suburb search is in progress
> **When** I look at the dropdown
> **Then** it shows a spinning loader icon and "Loading suburbs..."

> **Given** the suburb search request fails
> **When** I look at the dropdown
> **Then** it shows "Could not load suburbs right now." in place of results

---

### US-04 — Topic Priority and Already-Sorted

**As a** visitor filling out the Journey form,
**I want** to mark what I have already handled and pick which topics matter most to me right now,
**so that** my plan focuses on what I genuinely still need rather than repeating what I have already done.

#### Acceptance Criteria

---

**AC-04-1 — Already-sorted checklist**

> **Given** I am on the form screen
> **When** I look at the "Already sorted?" section
> **Then** I see five pill-shaped buttons: Myki card, GP registered, Bank account, SIM card, Lease signed
> **And** none is selected by default

> **Given** I click a pill button
> **When** it activates
> **Then** its border and text turn teal and a checkmark icon appears on its left
> **And** clicking it again deselects it and removes the checkmark

---

**AC-04-2 — Topic chip multi-select**

> **Given** I am on the form screen
> **When** I look at the "What matters most right now?" section
> **Then** I see five topic chips: Food & Eating, Getting Around, Health & Wellbeing, Home & Admin, Social & Belonging
> **And** none is selected by default

> **Given** I click a topic chip
> **When** it activates
> **Then** the chip fills with a solid teal background and white text

> **Given** I click an already-selected topic chip
> **When** it deactivates
> **Then** the chip returns to its white background with dark text

> **Given** multiple chips are selected
> **When** I look at the chip group
> **Then** all selected chips remain independently highlighted
> **And** I can select or deselect any of them individually

---

**AC-04-3 — Form submission guard**

> **Given** I have not yet filled in all required fields (moment ≥ 30 chars, suburb confirmed, at least 1 topic selected)
> **When** I look at the "Build My Guide Journey" button
> **Then** the button appears greyed out and cannot be clicked

> **Given** I have filled all required fields
> **When** I look at the submit button
> **Then** the button is fully coloured teal and clickable

---

### US-05 — Plan Submission and Loading Screen

**As a** visitor who has completed the Journey form,
**I want** to see a purposeful loading screen while my plan is being built,
**so that** the transition to my plan feels considered rather than a blank pause.

#### Acceptance Criteria

---

**AC-05-1 — Loading screen appears on submit**

> **Given** I have completed all required form fields
> **When** I click "Build My Guide Journey"
> **Then** the form transitions out and a loading screen appears
> **And** a spinning loader icon is visible at the top centre
> **And** the text "Putting together your Melbourne starter kit..." appears below the spinner
> **And** my confirmed suburb name appears in smaller text beneath that

---

**AC-05-2 — Guide thumbnails animate in during loading**

> **Given** the loading screen is showing
> **When** the thumbnails render
> **Then** a 4-column grid of guide thumbnail images fades and rises in one by one with a staggered delay
> **And** the thumbnails shown are filtered to the topics I selected (or all published guides if none selected)
> **And** each thumbnail shows the guide cover image and title below it

---

**AC-05-3 — Automatic transition to plan view**

> **Given** the loading screen has been showing
> **When** the plan is ready
> **Then** I am automatically navigated to `/journey/plan`

---

### US-06 — 7-Day Plan Navigation

**As a** visitor on the plan view,
**I want** to move between the seven days of my plan easily,
**so that** I can see each day's content at any point in my week.

#### Acceptance Criteria

---

**AC-06-1 — Day stepper strip**

> **Given** I open `/journey/plan`
> **When** the page loads
> **Then** a horizontal strip of 7 day buttons is visible, each showing a number circle and a short day label below it (e.g. "Survive", "Admin", "Connect")
> **And** Day 1 is active by default
> **And** the active day's number circle is filled with the vibe accent colour

> **Given** I click a different day button
> **When** it activates
> **Then** that button's circle fills with the vibe accent colour
> **And** the previously active day returns to its default unfilled style

---

**AC-06-2 — Done-state in the stepper**

> **Given** I have checked every task on a given day
> **When** I look at that day's button in the stepper
> **Then** the number circle shows a filled teal checkmark icon instead of the day number

---

**AC-06-3 — Day content animation**

> **Given** I click a different day tab
> **When** the transition plays
> **Then** the current day's content fades out and the new day's content fades in
> **And** the transition takes under half a second

> **Given** I have enabled "Reduce motion"
> **When** I switch days
> **Then** the content switches instantly with no fade or movement

---

**AC-06-4 — Prev / next navigation**

> **Given** I am viewing any day other than Day 1
> **When** I look at the bottom of the page below the day content
> **Then** a "← Day N · [short label]" text link is visible on the left

> **Given** I am viewing any day other than Day 7
> **When** I look at the bottom of the page
> **Then** a "Day N · [short label] →" text link is visible on the right

> **Given** I click a prev or next link
> **When** it activates
> **Then** the plan view switches to that day and scrolls to bring the stepper into view

---

**AC-06-5 — Redirect when no journey state exists**

> **Given** I navigate directly to `/journey/plan` without having completed the onboarding form
> **When** the page finishes loading
> **Then** I am redirected to `/journey`

---

### US-07 — Day Content

**As a** visitor viewing a specific day,
**I want** to see that day's theme, guides, tasks, and nearby places in one view,
**so that** I know exactly what to read and where to go today.

#### Acceptance Criteria

---

**AC-07-1 — Day header and narrative**

> **Given** I am viewing any day's content
> **When** the content loads
> **Then** a topic icon appears inside a rounded square coloured to match the day's topic (e.g. orange for Food, sky for Getting Around)
> **And** a small label shows "Day N · [theme]" in the topic's text colour
> **And** a paragraph of narrative text below describes the day's purpose and emotional tone

> **Given** the day header is visible
> **When** I look below the narrative
> **Then** a short horizontal divider bar is visible in the vibe accent colour, separating the header from the guides section

---

**AC-07-2 — Guide accordion**

> **Given** I am viewing a day's content
> **When** the guides section loads
> **Then** a "GUIDES" label appears in small uppercase tracking above the list
> **And** the first guide card is expanded by default, showing its thumbnail image at full height, its title, the summary text, and a "Read guide →" link

> **Given** a day has more than one guide
> **When** I look at the second or third guide card
> **Then** it appears collapsed, showing only the thumbnail at reduced height and the title and reading time

> **Given** I click a collapsed guide's title or chevron icon
> **When** it expands
> **Then** the thumbnail grows taller and the summary and "Read guide →" link fade into view
> **And** the chevron rotates to point upward

> **Given** I click an expanded guide's title or chevron
> **When** it collapses
> **Then** the thumbnail shrinks back and the summary and link disappear
> **And** the chevron rotates back down

> **Given** I click "Read guide →"
> **When** the link is followed
> **Then** I am taken to that guide's page with `?suburb=[suburb]&from=journey` appended to the URL

---

**AC-07-3 — Nearby places**

> **Given** I am viewing a day's content and the nearby places request succeeds
> **When** results are available
> **Then** a "Places to go today in [suburb]" card appears below the guide accordion
> **And** a subtitle names the place type relevant to the day's topic (e.g. "cheap supermarkets & community meals" for Food, "bulk-billing GPs & pharmacies" for Health)
> **And** up to 3 places are listed, each showing a teal map-pin icon, the place name, its address, and star rating if available

> **Given** the nearby places request is still in progress or returns no results
> **When** I look at the places area
> **Then** nothing is shown — the section does not appear

---

### US-08 — Task Completion and Persistence

**As a** visitor on the plan view,
**I want** to check off my daily tasks and have them remembered between visits,
**so that** I can track my real-world progress across sessions without having to redo everything.

#### Acceptance Criteria

---

**AC-08-1 — Task checklist interaction**

> **Given** I am viewing a day that has tasks
> **When** I look at the "YOUR TASKS TODAY" column to the right of the guides
> **Then** each task appears as a row with a hollow square icon on the left and the task text beside it

> **Given** I click a task row
> **When** it toggles on
> **Then** the hollow square icon becomes a filled teal checkmark
> **And** the task text gains a strikethrough decoration and turns teal

> **Given** I click an already-completed task row
> **When** it toggles off
> **Then** the checkmark reverts to the hollow square
> **And** the strikethrough and teal colour are removed

---

**AC-08-2 — Persistence across browser sessions**

> **Given** I have checked one or more tasks across one or more days
> **When** I close the browser tab and reopen `/journey/plan`
> **Then** all previously checked tasks are shown as checked
> **And** all previously unchecked tasks are shown as unchecked
> **And** no visible flash of unchecked state occurs on load

---

**AC-08-3 — Day done state in the stepper**

> **Given** I check every task on a given day
> **When** I look at that day's circle in the stepper strip
> **Then** the circle immediately updates to show a filled teal checkmark instead of the day number

> **Given** I uncheck at least one task on that day
> **When** I look at the stepper
> **Then** the checkmark reverts to the day number

---

### US-09 — Week Drawer and Vibe Color

**As a** visitor on the plan view,
**I want** to see my full week overview at a glance and discover my journey's personal color theme,
**so that** I can jump to any day quickly and feel a sense of ownership over my plan.

#### Acceptance Criteria

---

**AC-09-1 — Opening and closing the drawer**

> **Given** I am on the plan view
> **When** I click the "Week" button in the header
> **Then** a panel slides in smoothly from the right edge of the screen
> **And** a dark semi-transparent overlay covers the page behind it

> **Given** the week drawer is open
> **When** I click anywhere on the dark overlay behind the drawer
> **Then** the drawer slides back out and the overlay disappears

> **Given** the week drawer is open
> **When** I press the Escape key
> **Then** the drawer closes

> **Given** the week drawer is open
> **When** I click the × close button inside the drawer
> **Then** the drawer closes

---

**AC-09-2 — Drawer day list**

> **Given** the week drawer is open
> **When** I look at the day list
> **Then** all 7 days are listed in order, each row showing a coloured icon square with the topic colour, the day theme in bold, and the first guide title in smaller text below

> **Given** I am currently viewing Day 3 on the plan view
> **When** I open the drawer
> **Then** Day 3's row has a teal-tinted background distinguishing it from the other rows

> **Given** a day has all its tasks completed
> **When** I look at that day's row in the drawer
> **Then** its icon square shows a teal checkmark instead of the day number

> **Given** I click a day row in the drawer
> **When** the click registers
> **Then** the drawer closes and the plan view switches to show that day's content

---

**AC-09-3 — Vibe color swatch**

> **Given** the week drawer is open
> **When** I look at the bottom section of the drawer below the day list
> **Then** a "YOUR VIBE" label is visible in small uppercase
> **And** a coloured square swatch is shown alongside the vibe name (e.g. "Fresh Mint") and its hex code (e.g. "#3DBFB8")
> **And** a short sentence below the swatch describes the vibe's personality (e.g. "Curious, energetic. Everything feels new and that is exciting.")

---

### US-10 — Start Over

**As a** visitor on the plan view,
**I want** to reset my journey and return to the beginning of the onboarding form,
**so that** I can build a fresh plan if my situation has changed.

#### Acceptance Criteria

---

**AC-10-1 — Start over clears plan and tasks**

> **Given** I am on the plan view
> **When** I click the "Start over" button in the header
> **Then** my journey inputs (moment, suburb, topics, already-sorted) are removed from storage
> **And** my task completion history is removed from storage
> **And** I am taken to the Journey intro screen at `/journey`

---

## 4. Responsive Behaviour

| Component | Mobile | Tablet (md) | Desktop |
|-----------|--------|-------------|---------|
| Intro sticky cards | Visible but may be partially off-screen | Visible | Fully visible around edges |
| Moment preset grid | 1-column | 2-column | 2-column |
| Loading guide thumbnails | 4-column (small thumbnails) | 4-column | 4-column |
| Plan hero heading | Full width, smaller size | Full width | `max-w-screen-xl` centered |
| Guides + Tasks layout | Tasks stacked below guides (full width) | Tasks stacked below guides | Side by side: guides fill remaining width, tasks in fixed 18rem right column |
| Week drawer | Full-screen width | `max-w-md` right panel | `max-w-md` right panel |
| Day stepper | Scrollable if needed | Full row | Full row |

---

## 5. Accessibility

- Moment preset buttons: `aria-pressed={isActive}` per card
- "How it works" accordion trigger: standard `button`; chevron direction reflects state visually
- Suburb combobox input: `role="combobox"`, `aria-autocomplete="list"`, `aria-expanded`, `aria-controls={listboxId}`, `aria-activedescendant` pointing to highlighted option
- Suburb dropdown: `role="listbox"`; each option `role="option"` with `aria-selected`
- Already-sorted pills: `role="checkbox"`, `aria-checked`
- Topic chips: `role="checkbox"`, `aria-checked`; group wrapped in `role="group"`, `aria-label="Topic selection"`
- Submit button: native `disabled` attribute when form is invalid
- Day stepper: `role="tablist"`, `aria-label="Week days"`; each tab `role="tab"`, `aria-selected`
- Guide accordion toggle: `aria-expanded`
- Task rows: `aria-pressed={done}`
- Week drawer: `role="dialog"`, `aria-label="Your week"`; close button `aria-label="Close drawer"`
- All Framer Motion animations guarded by `prefersReducedMotion` with `duration: 0.01` fallback

---

## 6. File Checklist

```
components/journey/
  journey-onboarding.tsx       ← intro + form + loading stages
  journey-plan-view.tsx        ← header, stepper, day content, week drawer
  journey-day-places.tsx       ← topic-filtered nearby places per day

hooks/
  use-journey-state.ts         ← minuri:journey:v2 (inputs) + minuri:journey:tasks:v1 (task state)

lib/
  journey-week.ts              ← buildWeekPlan(), ALREADY_SORTED_ITEMS, GUIDE_NARRATIVES, GUIDE_TASKS
  vibes.ts                     ← VIBES[], getVibe(), DEFAULT_VIBE_ID
```

---

## 7. Open Questions

| Question | Status |
|----------|--------|
| Plan generation wiring | `llm_test.py` exists as a standalone backend test script; no `/api/llm/journey-plan` endpoint is registered in the backend router yet. When wired, the loading screen's hardcoded timeout will be replaced by the actual API response wait. |
| Vibe color source | Currently read from `LANDING_KEYS.vibe` set on the Landing page; when the plan endpoint is wired, the vibe color will be returned per plan and stored in journey state directly. |
| `journey-nearby-panel.tsx` | This component (map + scrollable list) exists in the codebase but is not rendered in `JourneyPlanView` — only `JourneyDayPlaces` (compact list, no map) is shown per day. Is `JourneyNearbyPanel` intended to replace or supplement `JourneyDayPlaces` in a future update? |
| LLM `day` field type | The test script returns `day` as a string (e.g. "Monday"); `DayStepperNav` expects a number for its tab index. A type-mapping step will be needed when the endpoint is wired. |
