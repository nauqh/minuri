# Minuri Journey Receipt + LLM Suggestion Spec

## 1) User Information Fields We Currently Keep

This section lists user-related fields currently stored locally (via browser `localStorage`) and exported in receipt JSON.

### A. Core journey fields (`LANDING_KEYS`)

Defined in `components/landing/landing-local-state.ts`:

- `version` (`minuri.landingStateVersion`)
  - Schema/state version for compatibility.
- `lastGuideSlug` (`minuri.lastGuideSlug`)
  - Last guide the user touched.
- `activeArc` (`minuri.activeArc`)
  - Current journey arc.
- `selectedSuburb` (`minuri.selectedSuburb`)
  - User-provided suburb/location text.
- `lastTopic` (`minuri.lastTopic`)
  - Most recent topic/category touched.
- `lifeMoment` (`minuri.lifeMoment`)
  - Onboarding context (user life situation).
- `savedLocations` (`minuri.savedLocations`)
  - Array of saved place entries (currently `unknown[]` shape).
- `topicHistory` (`minuri.topicHistory`)
  - Array of topic labels/history.
- `readGuides` (`minuri.readGuides`)
  - Array of guide slugs read.
- `arcProgress` (`minuri.arcProgress`)
  - Object with progress counters per arc:
    - `day1` (Day 1 arc, slug `day-1`)
    - `week1` (Week 1 arc, slug `week-1`)
    - `month1` (Month 1 arc, slug `month-1`)
  - Receipts or storage from before this rename may still show legacy keys `week1` / `month1` / `month3` mapping to the old three arcs; the app migrates those on read.

### B. Related bookmark field

Defined in `hooks/use-guide-bookmarks.ts` and also read by journey logic:

- `bookmarks` (`minuri:guide-bookmarks:v1`)
  - Array of guide slugs bookmarked.

### C. Derived fields (computed, not independently authored by user)

- `savedLocationsCount` = `savedLocations.length`
- `readGuidesCount` = `readGuides.length` (used in receipt summary)

### D. Receipt metadata fields (export/import payload)

Defined by `JourneyReceiptShape`:

- `kind` (`"minuri-journey-receipt"`)
- `version` (`1`)
- `receiptId`
- `issuedAt`
- `createdBy` (`"minuri-web"`)
- `summary`:
  - `suburb`
  - `lifeMoment`
  - `lastTopic`
  - `savedLocationsCount`
  - `readGuidesCount`
- `journey` (full `LandingJourneyState` payload)
- `checksum` (integrity check)

### E. Session/UI-only fields (currently not persisted)

In `components/landing/landing-hub-sidebar.tsx`:

- `selectedMood`
- `showTopics`
- modal open/close toggles and temporary UI feedback state

---

## 2) How to Leverage an LLM on User Information

The goal is to turn user journey data into practical, contextual next steps.

### A. High-value use cases

1. **Next-best action recommendation**
   - Inputs: `lifeMoment`, `lastTopic`, `arcProgress`, `readGuides`, `selectedSuburb`
   - Output: one recommended guide + one local action + one short task.

2. **Weekly reflection and plan**
   - Inputs: `topicHistory`, `readGuides`, `arcProgress`
   - Output: progress reflection + blockers + 3-step weekly plan.

3. **Return-user restart suggestion**
   - Inputs: `lastGuideSlug`, `lifeMoment`, `arcProgress`
   - Output: “continue where you left off” with fallback path.

4. **Journey gap detection**
   - Inputs: `arcProgress`, `topicHistory`
   - Output: identify neglected arc/topics with short prioritized actions.

5. **Import-time insight**
   - Trigger: after receipt upload
   - Output: quick summary of user state and recommended starting screen.

---

## 3) Recommended Architecture

### Step 1: Deterministic feature extraction

Create a compact feature object from journey data before any model call:

- `lifeMoment`
- `suburb`
- `lastTopic`
- `arcProgress`
- `readGuidesCount`
- `savedLocationsCount`
- recent guides/topics (trimmed)

### Step 2: LLM generation (strict contract)

Send only required fields to model. Require strict JSON output:

- `summary` (string)
- `next_best_action` (object)
- `alternatives` (array of 2)
- `confidence` (`low|med|high`)
- `reasoning_tags` (array)

### Step 3: Safety/policy filter

Post-process generated output:

- prevent overreaching health/legal claims
- enforce practical, non-diagnostic language
- enforce short, actionable phrasing

### Step 4: UI rendering

Render suggestion cards with:

- recommendation
- “why this was suggested”
- fallback alternatives

---

## 4) Suggested Prompt Shape

### System intent

Supportive migration/life-admin coach for users in Melbourne context.

### Input payload

Compact JSON object with only selected fields:

- `lifeMoment`
- `suburb`
- `lastTopic`
- `arcProgress`
- `readGuidesCount`
- `savedLocationsCount`
- `recentGuides`
- `recentTopics`

### Output contract (JSON only)

- `summary`: one sentence
- `next_best_action`: one clear recommendation
- `alternatives`: two options
- `confidence`: low/med/high
- `reasoning_tags`: machine-readable short tags

---

## 5) Practical Next Build

1. Add endpoint: `app/api/journey-suggestions/route.ts`
2. Build deterministic feature mapper from `LandingJourneyState`
3. Add “Suggested next steps” panel in `components/landing/landing-hub-sidebar.tsx`
4. Trigger suggestions on:
   - sidebar open
   - receipt import success
   - major state change (life moment/topic/arc)

