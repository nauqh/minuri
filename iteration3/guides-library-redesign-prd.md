# Guides Library — Discovery Redesign
## PRD (Planned — 2026-05-12)

**Principle:** One clear action per screen. Library = find a guide. Journeys = follow a persona.

---

## Problem Statement

Users arriving at `/guides` (Library tab) are greeted by three competing elements with no clear relationship:

1. **Persona photo strip** ("Follow a Journey") — six portrait cards with names and roles. Users have no context for what these represent or why they appear on a *library* page. The Journeys tab already owns this experience.
2. **32 guide cards dumped at once** — labelled "All topics" with subtitle "Read in sequence, one step at a time." No suggested entry point. No hierarchy.
3. **Sidebar progress bars showing `0/5`** — counts *bookmarked* guides, not reading progress. New users see zeroed-out bars on every topic, implying they have failed to do something before they have started.

The combined effect: users do not know what they are looking at, what they should do first, or what the numbers mean.

---

## Solution

Redesign the Library tab into a **two-state discovery view**:

- **State A — Topic Picker (default):** Five large topic entry cards replace the guide grid as the primary content. Each card shows the topic icon, topic name, and a plain guide count (e.g. "7 guides"). Search field stays at top as a shortcut to skip State A entirely.
- **State B — Guide List (topic selected):** The guide grid for the chosen topic. A breadcrumb chip ("← All topics") lets users return to State A. Sidebar narrows to the topic list with plain counts — no progress bars.

Remove the persona strip from the Library tab entirely. It lives in the Journeys tab.

---

## User Stories

1. As a first-time user, I want to see a clear set of topic categories when I open the Library, so that I know what kinds of guides exist before I commit to browsing.
2. As a first-time user, I want each topic card to show a guide count, so that I understand how much content exists per topic.
3. As a first-time user, I want to be able to search directly without selecting a topic first, so that I can jump straight to a guide I already know I need.
4. As a user who has selected a topic, I want a clear way to go back to the topic picker, so that I can switch topics without using the browser back button.
5. As a user, I want the sidebar filter list to show plain guide counts rather than a progress bar, so that I am not confused by metrics that imply reading progress I have not made.
6. As a user, I want the persona strip to be absent from the Library tab, so that I am not confused by content that belongs in the Journeys tab.
7. As a user on mobile, I want the topic picker to render as a readable card grid (not a small chip list), so that I can tap a topic comfortably.
8. As a user who has bookmarks, I want the Bookmarks tab to remain unchanged, so that my saved guides are still accessible in the same way.
9. As a user who has typed a search query, I want the guide grid to appear directly (skipping the topic picker), so that search results are not hidden behind a topic selection step.
10. As a user on the Journeys tab, I want the persona strip to remain exactly as it is, so that the journeys experience is unaffected by the library redesign.

---

## Implementation Decisions

### 1. Remove persona strip from Library tab
The `"Follow a Journey"` section block (persona grid + "Browse all →" link) in `GuidesLibraryView` is deleted. No replacement. Journeys tab is unaffected.

### 2. Two-state library view
Introduce a local boolean derivation: the Library is in **topic-picker state** when no `?topic=` param is set AND no `?q=` search query is active. When either condition is true, skip the picker and show the guide grid directly.

```
topicPickerVisible = !activeTopicFilter && !rawQuery (library mode only)
```

This means State A ↔ State B is driven entirely by existing URL params — no new state needed.

### 3. Topic picker cards (State A)
Replace the guide grid with a responsive card grid of five topic entry cards. Each card:
- Topic icon (Lucide, same icon map already in the component)
- Topic name
- Plain guide count: `{total} guides` — sourced from `topicStats` already computed
- Clicking sets `?topic=<slug>` via the existing `updateParams` helper

Layout: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` (five cards, last row has two)

### 4. Breadcrumb back chip (State B)
When a topic is active, render a small back chip above the guide list:
```
← All topics
```
Clicking it removes `?topic=` via `updateParams`. No new routing needed.

### 5. Sidebar: remove progress bars
Replace the `{saved}/{total}` count + progress bar with a plain `{total}` guide count. The `topicStats` map is still needed for the count; the bookmark-tracking part of it is no longer surfaced in the sidebar. The Bookmarks tab is unaffected — it does not use the sidebar.

### 6. Search bypasses topic picker
Existing logic: `rawQuery` is already derived from `?q=` param. The `topicPickerVisible` derivation above means any active search query sends the user directly to State B. No additional change needed.

### 7. No schema, no new files
All changes are confined to `GuidesLibraryView`. No new components required — the topic picker cards are simple enough to render inline. No data changes.

---

## Testing Decisions

Manual acceptance tests (no automated tests planned for this surface — component is client-only UI with URL-param state):

| Scenario | Expected |
|----------|----------|
| Open `/guides` with no params | Topic picker visible, no guide grid |
| Click a topic card | `?topic=<slug>` added, grid appears, breadcrumb visible |
| Click "← All topics" breadcrumb | `?topic=` removed, topic picker returns |
| Type in search field | Grid appears directly, topic picker hidden |
| Clear search | Returns to topic picker if no topic selected |
| Open `/guides?topic=food-eating` (deep link) | Grid visible immediately, topic picker skipped |
| Open `/guides/journeys` | Persona strip present and unchanged |
| Open `/guides/bookmarks` | Bookmarks view unchanged |
| Check sidebar on State B | Plain guide counts visible, no progress bars |
| Check sidebar on mobile | Filter sheet unchanged, topic buttons show count not progress bar |

---

## Out of Scope

- Reading-progress tracking (e.g. marking guides as "read") — this would require persistence and is a separate epic
- Reordering or curating guides within a topic
- Any changes to the Journeys tab or `PersonaJourneyView`
- Any changes to `GuideDetailView` (guide reading experience)
- Animated transitions between State A and State B (can be added later)
- The story-intake overlay (currently disabled via `showStoryOverlay = false`) — left as-is

---

## Further Notes

- The `topicStats` map continues to compute bookmark counts; they are simply no longer displayed in the sidebar. Keep the computation — it may be surfaced elsewhere (e.g. a future "saved" indicator on topic cards).
- The `storyContextBanner` (shown when `?story=ready` is set) is unaffected. It renders above the guide grid in State B and continues to work.
- Topic picker card order follows `GUIDE_TOPICS` sort order (already defined in `content/guides.ts`).

---

*Minuri · Guides Library Redesign PRD · 2026-05-12*
