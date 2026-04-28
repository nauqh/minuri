# Minuri — Iteration 2 Cards

3 epics · 12 user stories (4 per epic) · 12 acceptance criteria

---

## EPIC 1 — Landing

The landing page is the first thing users see. It needs to explain what Minuri is, give returning users a way to pick up where they left off, and work well on phones.

---

### As a first-time visitor, I want to quickly understand what Minuri does and who it's for, so that I know within seconds if it's useful for me.

**Weight:** Effort: Medium · Difficulty: Low · Uncertainty: Low

**Acceptance Criteria**
- GIVEN a new user opens the Minuri home page for the first time
- WHEN the page finishes loading
- THEN the top of the page shows the tagline "Still feeling home, wherever you are." and a short one-line summary of what Minuri does
- AND a clear button is shown to take the user to either Guides or Near Me

**References**
- unDraw illustrations — https://undraw.co/
- shadcn/ui components — https://ui.shadcn.com/docs/components
- WCAG 2.1 — https://www.w3.org/TR/WCAG21/

**Subtasks**
- [ ] Write the hero text and tagline
- [ ] Pick a hero illustration from unDraw
- [ ] Build the hero section in React/TypeScript
- [ ] Add buttons that link to /guides and /near-me
- [ ] Show the page to 3 friends and ask if they understand what Minuri does
- [ ] Check the page loads in under 3 seconds

---

### As a returning user, I want to see what I looked at last time on the home page, so that I can pick up where I left off.

**Weight:** Effort: High · Difficulty: Medium · Uncertainty: Medium

**Acceptance Criteria**
- GIVEN a user has visited at least one guide or saved one Near Me location before
- WHEN they open the home page again
- THEN a "Continue exploring" section shows their recent guides and saved spots
- AND first-time users with no history see a default list of popular guides instead

**References**
- MDN localStorage — https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
- shadcn/ui Card — https://ui.shadcn.com/docs/components

**Subtasks**
- [ ] Decide what data to save (guide ID, saved location ID, last viewed date)
- [ ] Write a useRecentActivity hook to read and save user history
- [ ] Build the "Continue exploring" cards using the existing CardVisual component
- [ ] Build the fallback list for new users
- [ ] Add a small note saying data is saved on the user's device only
- [ ] Test on a fresh browser to confirm the fallback shows

---

### As a user on the home page, I want shortcuts to the main features, so that I can get to what I need without searching.

**Weight:** Effort: Low · Difficulty: Low · Uncertainty: Low

**Acceptance Criteria**
- GIVEN a user is on the Minuri home page
- WHEN they scroll past the hero section
- THEN they see two large cards — one for Guides and one for Near Me — each with a short description
- AND clicking either card takes the user to that section

**References**
- shadcn/ui Card — https://ui.shadcn.com/docs/components
- unDraw illustrations — https://undraw.co/

**Subtasks**
- [ ] Pick or design two icons / unDraw images for the cards
- [ ] Write short copy (1–2 lines) for each card
- [ ] Build the cards with shadcn/ui Card
- [ ] Add hover and focus states
- [ ] Make sure cards work with keyboard navigation
- [ ] Test on phone, tablet, and desktop screen sizes

---

### As a user on a phone, I want the home page to look good and work well on a small screen, so that I can use Minuri on the go.

**Weight:** Effort: Medium · Difficulty: Medium · Uncertainty: Low

**Acceptance Criteria**
- GIVEN a user opens Minuri on a phone (screen width around 360px)
- WHEN the home page loads
- THEN all text is readable without zooming, buttons are easy to tap, and nothing is cut off
- AND the page passes a Lighthouse mobile test with at least 90 for accessibility

**References**
- WCAG 2.1 — https://www.w3.org/TR/WCAG21/

**Subtasks**
- [ ] Set up responsive Tailwind classes for the home page
- [ ] Test all sections on a 360px-wide screen
- [ ] Make sure tap targets are at least 44 x 44 pixels
- [ ] Run a Lighthouse mobile test
- [ ] Fix any issues the Lighthouse report finds
- [ ] Test on a real iPhone and Android phone

---

## EPIC 2 — Guides

First Time Guides help young adults figure out independent living in Melbourne. Iteration 2 makes the guides easier to find, save, and finish.

---

### As a young adult new to Melbourne, I want to filter guides by topic (like housing, transport, health), so that I only see the guides that match what I need right now.

**Weight:** Effort: Medium · Difficulty: Low · Uncertainty: Low

**Acceptance Criteria**
- GIVEN a user is on the Guides page with at least 3 topic filters shown
- WHEN they click one or more topic filters
- THEN the guide list updates to show only guides in the chosen topics
- AND the number of results and a "Clear all" button are shown

**References**
- shadcn/ui Badge — https://ui.shadcn.com/docs/components
- WCAG 2.1 — https://www.w3.org/TR/WCAG21/

**Subtasks**
- [ ] List all current guides and tag each with a topic
- [ ] Agree on the final list of topics with the team
- [ ] Build a filter chip component with shadcn/ui Badge
- [ ] Wire up filter logic with React useState
- [ ] Add the result count and "Clear all" button
- [ ] Add filters to the URL (e.g. /guides?topic=housing) so links can be shared

---

### As a user reading a guide, I want to bookmark a section, so that I can come back to it later without scrolling through everything.

**Weight:** Effort: Medium · Difficulty: Medium · Uncertainty: Medium

**Acceptance Criteria**
- GIVEN a user is reading a guide with at least 2 sections
- WHEN they click the bookmark icon next to a section title
- THEN that section is added to their "My bookmarks" list
- AND the icon switches to a filled state to show it's saved

**References**
- MDN localStorage — https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
- shadcn/ui Button — https://ui.shadcn.com/docs/components

**Subtasks**
- [ ] Add unique IDs to each section in the .mdx files
- [ ] Write a useBookmarks hook (read, add, remove)
- [ ] Build a bookmark icon button with empty and filled states
- [ ] Build a "My bookmarks" page that lists saved sections grouped by guide
- [ ] Make sure clicking a bookmark scrolls to the right section
- [ ] Test that bookmarks stay after closing and reopening the browser

---

### As a user looking for help with something specific, I want to search guides by keyword, so that I can find the right guide without browsing all of them.

**Weight:** Effort: Medium · Difficulty: Medium · Uncertainty: Medium

**Acceptance Criteria**
- GIVEN a user is on the Guides page
- WHEN they type a word into the search bar
- THEN the list updates to show only guides where the word appears in the title or content
- AND if no guides match, a message says "No guides found, try a different word"

**References**
- shadcn/ui Input — https://ui.shadcn.com/docs/components

**Subtasks**
- [ ] Build a search input with shadcn/ui Input
- [ ] Index guide titles and a short description for searching
- [ ] Add basic keyword matching (case-insensitive, partial match)
- [ ] Show the empty state message when no results match
- [ ] Add a small loading state while filtering
- [ ] Test with common search words (e.g. "rent", "doctor", "tram")

---

### As a user reading a long guide, I want to see how far through I am, so that I know how much is left to read.

**Weight:** Effort: Low · Difficulty: Low · Uncertainty: Low

**Acceptance Criteria**
- GIVEN a user is reading a guide
- WHEN they scroll down the page
- THEN a thin progress bar at the top of the page fills up based on how far they have scrolled
- AND when they reach the end, the guide is saved as "Read" so it shows that label next time

**References**
- MDN localStorage — https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage

**Subtasks**
- [ ] Build a scroll progress bar component
- [ ] Add the bar to the top of every guide page
- [ ] Save the "read" status of a guide to localStorage when the user finishes
- [ ] Show a "Read" tag on guides the user has already finished
- [ ] Add a "Mark as unread" option on the guide list
- [ ] Test that the progress bar works on both long and short guides

---

## EPIC 3 — Near Me

Near Me shows useful Melbourne places on a map, using City of Melbourne open data and the PTV Timetable API. Iteration 2 makes it easier to filter, view details, see transport, and save favourites.

---

### As a user looking for help nearby, I want to filter the map by category (medical, food, recreation, transport), so that I only see the places I care about.

**Weight:** Effort: High · Difficulty: Medium · Uncertainty: Medium

**Acceptance Criteria**
- GIVEN a user is on the Near Me map with all categories on by default
- WHEN they turn off a category in the side panel
- THEN the markers in that category disappear from the map within 1 second
- AND their filter choice stays the same when they navigate to another page and come back

**References**
- City of Melbourne Open Data — https://data.melbourne.vic.gov.au/
- Healthdirect NHSD — https://about.healthdirect.gov.au/nhsd
- Leaflet — https://leafletjs.com/

**Subtasks**
- [ ] Match each dataset's categories to Minuri's category list
- [ ] Build a side panel with category toggles
- [ ] Group markers by category in the map state
- [ ] Add marker clustering so the map stays fast when zoomed out
- [ ] Save the filter choice in sessionStorage
- [ ] Test the map with all categories on (500+ markers)

---

### As a user clicking a place on the map, I want to see its details in a popup, so that I can decide whether to go without leaving the map.

**Weight:** Effort: Medium · Difficulty: Low · Uncertainty: Low

**Acceptance Criteria**
- GIVEN a user is on the Near Me map with at least one marker visible
- WHEN they click a marker
- THEN a popup shows the place name, address, opening hours, phone number, and a "Get directions" link
- AND pressing Escape closes the popup

**References**
- City of Melbourne Open Data — https://data.melbourne.vic.gov.au/
- Google Maps URLs — https://developers.google.com/maps/documentation/urls/get-started
- Leaflet popup reference — https://leafletjs.com/reference.html

**Subtasks**
- [ ] Decide which fields to show (name, address, hours, phone, directions)
- [ ] Handle missing fields nicely (e.g. show "Hours not listed")
- [ ] Build a LocationPopup component using shadcn/ui Card
- [ ] Build the Google Maps directions link from the user's current location
- [ ] Add Escape-to-close keyboard support
- [ ] Test with a screen reader (NVDA or VoiceOver)

---

### As a user new to Melbourne, I want to see nearby tram, train, and bus stops on the map, so that I can plan how to get around using public transport.

**Weight:** Effort: High · Difficulty: High · Uncertainty: High

**Acceptance Criteria**
- GIVEN a user is on the Near Me map with the "Transport" filter on
- WHEN the map loads
- THEN nearby PTV stops (train, tram, bus) appear as markers
- AND clicking a stop shows the next 3 departures from that stop

**References**
- PTV Timetable API — https://www.vic.gov.au/public-transport-timetable-api
- Leaflet — https://leafletjs.com/

**Subtasks**
- [ ] Get a PTV API developer ID and key (request by email)
- [ ] Build a backend route that signs PTV API requests
- [ ] Call the "Stops Nearby" endpoint based on the map's centre point
- [ ] Call the "Departures" endpoint when a stop is clicked
- [ ] Cache PTV results for 60 seconds to reduce API calls
- [ ] Show a friendly error message if the PTV API is down

---

### As a user who found a place I like, I want to save it to a Favourites list, so that I can find it again easily later.

**Weight:** Effort: Medium · Difficulty: Low · Uncertainty: Low

**Acceptance Criteria**
- GIVEN a user has clicked a marker and the popup is open
- WHEN they click the "Save" button in the popup
- THEN the place is added to their Favourites list and the button changes to "Saved"
- AND the saved place is marked with a star on the map next time they open Near Me

**References**
- MDN localStorage — https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
- shadcn/ui Button — https://ui.shadcn.com/docs/components

**Subtasks**
- [ ] Add a "Save" button to the LocationPopup
- [ ] Write a useFavourites hook (add, remove, list)
- [ ] Save the place ID and category to localStorage
- [ ] Build a "Favourites" page that lists saved places
- [ ] Show a star icon on saved markers on the map
- [ ] Test that favourites stay across browser sessions