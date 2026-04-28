**MINURI**

**Iteration 2 Plan**

**Narrative Guides \&Unified Topic Taxonomy**

*Still feeling home, wherever you are.*

**Team:** FIT5120 · TP39

**Author:** Minh Quan (Wan)

**Scope:** Content \+ UX restructure of the First-Time Guides epic, and topic alignment across the Guides and Near Me epics.

# **1\. Executive Summary**

Iteration 1 delivered Minuri as three separate features behind a landing page: a flat library of 15 guides, a category-filtered Near Me tool, and a homepage that routes between them. Mentor feedback after Iteration 1 identified the core gap: the Guides read like a FAQ database, not an experience. This document sets out the plan to fix that in Iteration 2\.

The core shift is from reference library to accompanied journey. A Minuri user should not feel like they are looking up an answer; they should feel like the product is walking next to them — recognising where they are, opening the right next moment, and handing off to action when they are ready.

This plan does four things:

1. **Refines** the five content topics that Guides and Near Me share, so a guide on finding a GP deep-links cleanly into Near Me's Health tab rather than into a mismatched filter.

2. **Repositions Landing** from a one-time gate into a living hub with returning-user state, life-moment entry points, and arc progress previews — the connective tissue between the other two epics.

3. **Restructures the 15 guides** into three time-based narrative arcs — Week 1, Month 1, Month 3 — that mirror the real emotional stages of moving out, with a six-part template and a style guide every writer commits to.

4. **Deepens Near Me** with real API integration, a service detail panel, topic-specific UI personalities, and a "came from a guide" banner that closes the loop with the Guides epic.

# **2\. Refinement: The Unified 5-Topic Taxonomy**

Iteration 1 shipped with mismatched category systems between the two features. This is the single biggest obstacle to cross-epic coherence and is the first thing Iteration 2 should fix.

### **Current state (misaligned)**

| First-Time Guides (5) | Near Me (7) |
| :---- | :---- |
| • Eating & Cooking • Getting Around • Health & Wellbeing • Adulting Basics • Social & Mental Health | • Health • Mental Health • Food • Social • Groceries • Parks • Amenities |

| Why this breaks the product The Guide → Near Me bridge (US 2.3) depends on deep-linking a guide to its matching Near Me category. Right now a guide under 'Adulting Basics' has no Near Me tab to land on. A guide under 'Social & Mental Health' has to choose between Near Me's 'Mental Health' and 'Social' tabs. The mapping is lossy, which is why the two features feel like separate tools rather than one product. |
| :---- |

### **Proposed state — unified 5 topics**

Both Guides and Near Me adopt the same five topics as their primary navigation. Near Me's finer-grained distinctions (Groceries, Parks, Amenities) become sub-filters under the parent topic, not top-level tabs.

| Topic | What it covers | Guide examples | Near Me (primary \+ subfilters) |
| :---- | :---- | :---- | :---- |
| **Food & Eating** | Cooking, groceries, eating out on a budget. | Your First Grocery Run; Cheap Eats in Melbourne; 5 Meals You'll Actually Cook | Cafés & restaurants · Supermarkets · Markets |
| **Getting Around** | Public transport, walking, biking, navigating Melbourne. | Getting a Myki & Surviving PTV; Building a Local Routine | Tram/train stops · Bike share · Parking |
| **Health & Wellbeing** | GPs, bulk-billing, Medicare, physical and mental healthcare. | Finding a GP Before You Need One; Medicare & Mental Health Care Plans; Psych vs Counsellor vs Friend | Clinics · Pharmacies · Mental health services · Crisis lines |
| **Home & Admin** | Renting, utilities, budgeting, and the paperwork nobody taught you. | Renting Without Getting Burned; Setting Up Utilities; Budgeting on What You Earn | Service Victoria · Banks · Post offices · Centrelink |
| **Social & Belonging** | Community, loneliness, making friends, finding your people. | Making Friends in a Busy City; The Homesickness Nobody Warns You About; Finding Your Community | Parks & public spaces · Community centres · Hobby groups · Meetups |

| Naming note "Adulting Basics" is replaced by "Home & Admin" — warmer, less patronising, and specific enough that users know what lives there. "Social & Mental Health" is replaced by "Social & Belonging" — mental-health guides move into Health & Wellbeing where clinical context belongs, freeing this topic to carry the softer emotional content (loneliness, community, friendship) without overloading one label. |
| :---- |

# **3\. Epic 1 — Landing: Two Layers, Two Audiences**

Landing in Iteration 1 tried to serve two fundamentally different users on the same canvas — new visitors who need the tagline, the story, and the CTAs, and returning users who just want their progress. The result was a marketing page that returning users saw as noise, and a half-built dashboard that new users didn't understand.

Iteration 2 resolves this by splitting Landing into two layers: a pristine main Landing that functions as Minuri's advertisement for new users, and a slide-out "Your Minuri" sidebar hub that functions as home base for returning users. The split honours the local-first, identity-light stance — no login wall decides which user sees which layer; the product simply recognises returning activity in localStorage and responds accordingly.

| The tagline shift changes Landing most The old tagline framed Minuri as a knowledge product ("Everything you need to know…"). The new tagline — "Still feeling home, wherever you are" — frames it as a belonging product. This shows up first and loudest on Landing: the hero subtitle, the copy across life-moment tiles, and the warmer register of cross-linking language ("When you're ready…" rather than "Click here to…"). Landing is where the shift is felt. Guides and Near Me follow its lead. |
| :---- |

## **Layer A — Main Landing (for new users)**

The Landing page seen on first visit stays close to the Iteration 1 intent: a clear introduction to Minuri. It functions as the advertisement. No personal state, no dashboard, no returning-user clutter. The four user stories below keep the page focused on arrival and orientation.

**US 1.4 — Life moment entry points.** Replace the Alex/Jordan persona cards with three emotional-state tiles — one per arc: “I just arrived”, “I’m getting set up”, “I’m looking for my people”. Each tile is an entry point into a specific arc, and simultaneously highlights the most relevant Near Me topics for that stage. Three tiles, three arcs, clean 1-to-1. Users recognise themselves in a feeling, not a demographic event — which avoids the mismatch problem of life-event framing (e.g. someone “between homes” needs Week 1 survival content, not Month 1 admin paperwork).

**US 1.5 — Live Melbourne stats.** Replace the hardcoded stats from Iteration 1 with one live data widget powered by the existing ABS/CLUE pipeline. Example: "84,200 young adults aged 18–25 moved to inner Melbourne this year." Strengthens the data narrative and gives Landing a reason to feel current.

**US 1.9 — Persistent "Your Minuri" trigger.** A button in the top navigation labelled "Your Minuri" that opens the sidebar hub at any time. Small dot appears on the button when the hub has unread content (a newly-available next guide, a tip based on the user's suburb). For users on their first visit, the button exists but the hub is empty — tapping it opens a neutral welcome state.

### **How Main Landing threads the 5 topics**

Entry-point moments map to arcs and topic clusters. Users don’t pick an arc directly — they recognise themselves in a feeling, and the system places them at the right stage. Three moments, three arcs, clean 1-to-1.

| Moment (entry point) | Guide arc opened | Near Me topics highlighted |
| :---- | :---- | :---- |
| **“I just arrived”** | Arc 1 — You Just Moved In (Week 1\) | Food & Eating · Health & Wellbeing |
| **“I’m getting set up”** | Arc 2 — Getting Set Up (Month 1\) | Home & Admin · Getting Around |
| **“I’m looking for my people”** | Arc 3 — Finding Your Rhythm (Month 3\) | Social & Belonging · Health & Wellbeing |

## **Layer B — "Your Minuri" Sidebar Hub (for returning users)**

A slide-out panel that houses everything personal to the user. It is not a separate page — it overlays Landing from the right (desktop) or rises as a bottom sheet (mobile). The main Landing stays visible beside or beneath it so returning users never lose their sense of place. The hub is where US 1.3, US 1.6, US 1.7 and the saved-locations feature live. None of this appears on the main Landing; all of it appears here.

### **US 1.8 — The sidebar hub (container)**

**What it is.** A right-docked panel on desktop (approximately 380–420px wide) and a bottom sheet on mobile (roughly 85% of viewport height). It contains a narrative composition of the user's personal signals — not a dashboard of widgets. Scannable top-to-bottom, one thing per section, with clear hierarchy.

### **Trigger behaviour**

* **First visit:** hidden. User sees pure marketing Landing. The "Your Minuri" nav button exists but tapping it opens a neutral welcome state ("Start reading a guide or set your suburb, and your journey will appear here.").

* **Second visit and beyond:** the hub auto-opens on page load, docked beside the main Landing. If the user closes it, that preference is remembered for the rest of the session via localStorage (hub\_dismissed\_this\_session), but re-opens on the next visit.

* **Nav button:** always available as a manual trigger. Small notification dot when the hub has new content since last opened (next guide unlocked, new tip available). The dot clears on open.

* **Dismiss:** close button (X) in the hub header. ESC key on desktop. Swipe-down on mobile. Tapping the dimmed Landing area behind it on mobile.

### **What's inside the hub — vertical composition**

The hub is read top-to-bottom. Each section is one thing, not a cluster of widgets. The goal is a narrative of where the user is right now — not a control panel.

| \# | Section | Content | Routes to |
| :---- | :---- | :---- | :---- |
| **1** | **Your Minuri greeting** | 2–3 sentence reflection prose generated from localStorage signals (suburb, active arc, topic frequency, saved locations). The warmest moment in the product. See US 1.7. | Tap to expand full reflection · otherwise no route |
| **2** | **Continue reading** | A single card — the next unread guide in the user's active arc. Shows guide title, arc name, estimated read time. Not a list, a choice. | /guides/:arc/:slug |
| **3** | **Your journey** | Compact arc progress — three labelled dots or rings (Week 1 · Month 1 · Month 3\) with per-arc fill. Current arc highlighted. | Tap an arc → /guides/:arc |
| **4** | **Your \[suburb\]** | Heading dynamically renders the user's saved suburb ("Your Clayton"). Two or three saved Near Me locations as compact cards (name, topic icon, distance). "See all saved →" link if more than 3\. | Card → /near-me/:location\_id · See all → /near-me?view=saved |
| **5** | **Jump back in** | Single secondary CTA: "Explore Near Me". Suburb-aware — the button carries the user's saved suburb and lands on the topic tab they used most recently. | /near-me?topic=\<most-recent\> |
| **6** | **Footer** | Small, muted: "Your journey stays on this device. Minuri never sees it." Link: "Export your journey" (downloads JSON). Link: "Clear my journey". | Export → local download · Clear → confirmation modal |

| What's deliberately NOT in the hub No search. No filter chips. No map. No full guide library. No life-moment tiles (those live on the main Landing). The hub is not a second version of the product — it answers one question: "what's next for me right now?" Everything else stays on its own page. This discipline is what prevents the hub from becoming a cluttered dashboard. |
| :---- |

### **Mobile adaptation**

On mobile, the hub is a bottom sheet that rises from the bottom of the screen rather than sliding in from the right. Trigger behaviour is identical — hidden on first visit, auto-opens on return — but the interaction is swipe-up to expand and swipe-down to dismiss. The sheet takes roughly 85% of viewport height when fully open, with a compact peek state (20% height, showing just the greeting \+ continue reading) that users can tap to expand. Mobile is Minuri's primary form factor, so the peek state is important: it respects screen real estate without hiding the hub entirely.

### **Hub-resident user stories**

The following user stories now live inside the sidebar hub rather than on the main Landing page. They were originally scoped for Landing but belong in the personal layer, not the advertisement layer.

**US 1.3 — Returning user state.** Section 2 of the hub ("Continue reading") surfaces the next unread guide in the user's active arc. Single card, not a list — the hub respects decision fatigue.

**US 1.6 — Arc progress preview.** Section 3 of the hub ("Your journey"). A three-dot strip for the three arcs with per-arc fill, replacing the original plan for a three-tile strip on Landing.

**US 1.7 — "Your Minuri" character reflection.** Section 1 of the hub ("Your Minuri greeting"). The soft, accruing portrait that emerges from localStorage signals (suburb, life-moment tile, arc progress, topic frequency, saved locations). No login, no avatar, no form. The character is never declared — it accrues. Rendered as 2–3 sentences of warm reflection prose at the top of the hub, optionally LLM-generated for per-visit variation (see Section 13).

**US 1.10 — Saved locations surface.** Section 4 of the hub ("Your \[suburb\]") reads saved locations from localStorage (US 3.6) and displays up to three, with a "see all" overflow. Forms the return half of the Near Me → Landing loop.

| Local-first, identity-light — Minuri's design stance Iteration 2 ships without user login. All personalisation lives in browser localStorage. This is a deliberate design choice, not a scope cut. A login wall contradicts the tagline "Still feeling home, wherever you are" — you shouldn't need to register to feel welcome. Instead, Minuri knows users by what they do, not what they declare. The sidebar hub is the clearest expression of this stance: the product recognises returning activity and opens the hub for them, without ever asking them to prove who they are. The tradeoff — that clearing the browser wipes the character — is made transparent in the hub footer ("Your journey stays on this device. Minuri never sees it.") with an optional export-your-journey JSON download. |
| :---- |

| The new vs returning story in one line The first time a user arrives, Minuri introduces itself. Every time after that, Minuri welcomes them back — in a space that's just theirs. |
| :---- |

# **4\. Epic 2 — First-Time Guides: Narrative Framework**

This is the largest content shift in Iteration 2\. The Guides epic moves from reference library to accompanied journey. Three principles govern every guide after the rewrite.

### **Principle 1 — Moment first, facts second**

Every guide opens with a specific, recognisable moment before any tip lands. Written in second person (“you”), never in a named character’s voice. “You wake up at 6am with a 39° fever, reach for your phone to call your mum’s doctor, and realise you’re 700 kilometres away from that clinic.” The practical content lands harder when it resolves a moment the reader recognises, not when it opens a briefing. The moment is the reader’s — not someone else’s that the reader has to map onto themselves.

### **Principle 2 — One "nobody taught you" reveal per guide**

Every guide earns its existence with one insight that reframes a familiar panic into something manageable. This is the line the reader remembers. If a guide has two reveals, it is two guides.

### **Principle 3 — Every guide bridges to action**

No guide ends in a summary. Every guide ends with a deep-link to Near Me (the Bridge CTA) and a teaser for the next guide in the arc. The Guides feature becomes a funnel into the rest of the product, not a dead end.

### **Principle 4 — Every screen has one action**

The product never dead-ends. On Landing, the one action is “pick a moment.” Inside a guide, the one action is “read this section, then take the Bridge.” In the Well Nest hub, the one action is “continue reading.” On Near Me, the one action is “save or call this place.” Every screen is designed against the test: “what is the one thing the user should do here?” If a screen has more than one answer, it has more than one job.

*Why it matters: “sense of purpose” — the feeling of knowing what to do and where to do it — is not a mood we add with copy. It’s a consequence of this principle. When every screen answers one question with one action, the user never has to stop and figure out what they’re doing here.*

# **5\. Arc Structure**

Replace the flat five-category grid with three timeline arcs that mirror the emotional stages of moving out. The 15 existing guides re-sequence into arcs without loss; topic tags persist as metadata but are no longer the primary navigation.

| The 2D model Every guide sits at the intersection of an arc (temporal journey) and a topic (content domain). The arc tells the reader where they are in life. The topic tells the system where the guide deep-links to in Near Me. A reader navigates by arc; the system routes by topic. |
| :---- |

### **Arc 1 — "You Just Moved In" · Week 1 · Survival**

The arc of panic and immediate needs. Everything in here solves a problem the reader hits in their first seven days.

| Guide | Topic | Persona (internal) |
| :---- | :---- | :---- |
| Your First Grocery Run | Food & Eating | Alex |
| Cheap Eats When You're Broke | Food & Eating | Alex |
| Getting a Myki & Surviving PTV | Getting Around | Both |
| Finding a GP Before You Need One | Health & Wellbeing | Alex |
| Crisis Lines You Can Actually Call | Health & Wellbeing | Both |

### **Arc 2 — "Getting Set Up" · Month 1 · Admin**

The arc of paperwork and structure. Less urgent, more foundational. The stuff that feels boring but saves you later.

| Guide | Topic | Persona (internal) |
| :---- | :---- | :---- |
| Renting Without Getting Burned | Home & Admin | Jordan |
| Medicare, Bulk-Billing & Mental Health Care Plans | Health & Wellbeing | Jordan |
| Budgeting on What You Actually Earn | Home & Admin | Jordan |
| Setting Up Utilities Without Overpaying | Home & Admin | Both |
| Cooking 5 Meals You'll Actually Eat | Food & Eating | Alex |

### **Arc 3 — "Finding Your Rhythm" · Month 3 · Settling**

The arc of belonging. Starts once the admin is done and the real loneliness begins. This is the arc most resource directories never get to.

| Guide | Topic | Persona (internal) |
| :---- | :---- | :---- |
| Making Friends in a City Where Everyone's Busy | Social & Belonging | Jordan |
| The Homesickness Nobody Warns You About | Social & Belonging | Alex |
| Finding Your Community (Hobby Groups, Clubs, Meetups) | Social & Belonging | Both |
| When to See a Psych vs a Counsellor vs a Friend | Health & Wellbeing | Both |
| Building a Local Routine That Feels Like Yours | Getting Around | Alex |

# **6\. The Guide Template**

Every guide follows the same six-part structure. This is the contract that keeps multiple writers consistent and the contract that makes the voice recognisably Minuri.

| Section | Name | Purpose | Length |
| :---- | :---- | :---- | :---- |
| **1** | **The Moment** | Open with a specific moment in second person (“you”). Sensory detail, one internal thought, Melbourne-grounded. No named characters — the reader is the protagonist. | \~60 words |
| **2** | **The Feeling** | Name what the reader probably feels too. "If you've ever stood in a Coles aisle and realised you have no idea what to buy…" | \~40 words |
| **3** | **The Reveal** | The one thing nobody taught them. This is the insight the guide exists for. Visually emphasised. | 1–2 sentences |
| **4** | **How It Actually Works** | The practical content. Numbered steps allowed here, not earlier. Still in the character's voice. | 150–250 words |
| **5** | **The Bridge** | CTA to Near Me, pre-filtered by topic. "When you're ready, find a bulk-billing GP near you →" | 1 line |
| **6** | **Next Chapter** | Teaser for the next guide in the arc. Should feel like a post-credits hook, not a summary. | 1 line |

# **7\. Exemplar Rewrite**

One rewrite, side-by-side, to set the bar. The team writes against this exemplar for every guide in Iteration 2\.

### **Before — current instructional format**

| How to Find a GP in Melbourne Step 1: Search Healthdirect for clinics in your area. Step 2: Check if they bulk-bill. Step 3: Book online or call. Bulk-billing means the clinic bills Medicare directly and you don't pay out of pocket. |
| :---- |

### **After — narrative format**

| Finding a GP Before You Need One *You’ve been in Melbourne for three weeks when you wake up at 6am with a 39° fever and a throat that feels like gravel. You reach for your phone to call your mum’s doctor — the one you’ve been going to since you were nine — and realise you’re 700 kilometres away from that clinic.* If you've never had to find your own doctor, this moment hits harder than you'd expect. Most of us grew up being taken to a GP — we never had to pick one. Here's what nobody tells you: in Australia, finding a GP isn't like finding a specialist. You don't need a referral, you don't need insurance, and if you pick a bulk-billing clinic, it costs you nothing. Bulk-billing means the clinic sends the bill straight to Medicare instead of you. You walk in with your Medicare card, you walk out without paying. About 65% of GP visits in Australia are bulk-billed, and Melbourne has hundreds of clinics that do it — you just have to know to filter for it. Three things to do before you're sick: Register with a bulk-billing clinic near where you live, not where you work. At 6am you don't want to commute. Save their after-hours number in your phone. Many have a locum service overnight. If it's mental health you're worried about, ask about a Mental Health Care Plan — we'll get to that in the next guide. You pick a clinic 8 minutes from your unit. The GP bulk-bills you, writes a script, and you’re back in bed by 9am with a 40-minute detour out of your day — not the full-blown crisis it would’ve been. When you're ready: *Find a bulk-billing GP near you →* Up next: *Medicare, Bulk-Billing & Mental Health Care Plans — the three words that unlock half of Australia's healthcare system.* |
| :---- |

Same practical content. Reads completely differently. The facts are still there — bulk-billing, Medicare, the 65% figure — but the reader arrives at them through their own 6am, not through a numbered list.

# **8\. Content Style Rules**

One-page style guide. Every writer commits to this before drafting.

**1\. Always name the character.** Personas (Alex the uni fresher, Jordan the career starter) are internal writing references only. They shape editorial decisions — tone, example situations, what to worry about — but they never appear by name in reader-facing content. Every guide is written in second person, addressed to the reader directly.

**2\. Ground every opening in Melbourne.** A tram, a suburb, a weather moment, a specific chain store. Generic openings don't land.

**3\. No bullet points in the first third.** Prose first, structure later. If the guide opens with a list, it has not become a guide yet.

**4\. Lead with feeling, follow with fact.** The reader's emotional state is the door into the information. Tips before feelings slam the door shut.

**5\. Second person after the reveal.** Maintain second person throughout. The Moment, the Feeling, the How It Works, the Bridge — all addressed to the reader as “you”. Never narrate at a third party the reader has to translate into themselves.

**6\. One reveal per guide.** If you have two insights, it's two guides. Compression weakens both.

**7\. End on a bridge, never a summary.** No "In conclusion" paragraphs. The last line should either route somewhere or foreshadow the next guide.

**8\. Minuri doesn't moralise.** No "you should…" or "it’s important to…". Show the consequence in the scene; let the reader draw the conclusion.

# **9\. Epic 3 — Near Me: Deepening the Experience**

Near Me shipped Iteration 1 with the right architecture — suburb context strip, category tab strip, list/map toggle — but with partial data and no awareness of the Guides epic. Iteration 2 makes it real, and plugs it into the topic taxonomy and the Guide bridge.

### **The 5-topic tab refactor**

The Near Me tab strip changes from seven tabs (Health, Mental Health, Food, Social, Groceries, Parks, Amenities) to the unified five topics. Finer-grained distinctions become sub-filters under each tab. A user sees five tabs at the top level, and if they're in Food & Eating, they can further filter by Restaurants · Supermarkets · Markets. This mirrors the Guides navigation exactly — no cognitive switch between features.

### **New user stories**

**US 3.3 — Real API integration.** Wire up actual data sources: PTV Timetable for Getting Around, Healthdirect NHSD for Health & Wellbeing, City of Melbourne CLUE dataset for Food & Eating venues, ABS Census for the demographic snapshot. Replaces Iteration 1's stub data. Highest-effort item, highest-impact demo moment.

**US 3.4 — Service detail panel.** Clicking a result card or map pin opens a panel — bottom sheet on mobile, sidebar on desktop — showing opening hours, bulk-billing status (for health), phone, website, accessibility info, and distance from the user's suburb. Replaces the flat card view with something a user can actually act on.

**US 3.5 — "Came from a guide" context banner.** When a user lands on Near Me via a Guide's Bridge CTA (URL contains ?from=guide-slug\&topic=health), a contextual banner appears: "Looking for a GP after reading 'Finding a GP Before You Need One'? Here are options near you." Closes the loop between the two epics — the journey feels deliberate, not coincidental.

**US 3.6 — Save locations.** Heart icon on result cards adds a location to a localStorage-backed favourites list. Saved locations surface on Landing's "Continue where you left off" hub, creating a three-way bridge: Guide → Near Me → saved → Landing → next session.

**US 3.7 — Topic-specific UI personality.** Each of the five topic tabs gets its own visual character rather than being a generic filter. Switching tabs feels like changing experiences, not flipping a value.

| Topic tab | UI personality |
| :---- | :---- |
| **Food & Eating** | Card-grid-first with venue photos. Map secondary. Price range filter prominent. |
| **Getting Around** | Map-dominant with live PTV data overlayed. List minimal, distance-sorted. |
| **Health & Wellbeing** | List-heavy, bulk-billing status prominently shown. Crisis lines pinned at top of the tab regardless of scroll position. |
| **Home & Admin** | Opening hours and phone number lead every card. Less visual, more utilitarian — matches the arc's mood. |
| **Social & Belonging** | Softer visual treatment. Accessibility info (wheelchair access, quiet spaces) shown on cards. Ratings de-emphasised — belonging isn't ranked. |

### **How Near Me connects to Guides and Landing**

Near Me is no longer a standalone tool. In Iteration 2 it sits inside a three-way circuit:

* **Incoming from Guides:** Bridge CTA deep-links (e.g. /near-me?topic=health\&from=finding-a-gp) land in the correct topic tab, surface the "came from a guide" banner, and preserve the user's saved suburb.

* **Outgoing to Landing:** Saved locations (US 3.6) surface on Landing's hub ("Your saved places: Dr Lee's Clinic, Coles Clayton, Westall Station") with one-tap access each.

* **Back-references to Guides:** Service detail panels for health services include a footer link: "Not sure what you're looking at? Read 'Medicare, Bulk-Billing & Mental Health Care Plans' →" — reversing the Bridge CTA direction when context helps.

# **10\. Execution Plan — 4 Weeks, 3 Parallel Tracks**

Iteration 2 is not a guides-only sprint. All three epics evolve in parallel, with clear sequencing so dependencies line up (topic taxonomy lands before Bridge CTAs; API data lands before service detail panels).

| Week | Landing track | Guides track | Near Me track |
| :---- | :---- | :---- | :---- |
| **Week 1** | • Hero redesign with new tagline • Two-layer Landing architecture (main \+ hub) • Life-moment tile wireframes • Sidebar hub wireframes (desktop \+ mobile) • Confirm tile → topic mapping | • Lock 6-part template • Lock style guide • Rewrite 2 exemplar guides • Arc landing page mockups | • Tab strip refactor to 5 topics • API integration plan finalised • Data contract doc with Guides team |
| **Week 2** | • Sidebar hub container \+ trigger behaviour • Hub sections 1–3 (greeting, continue reading, arc progress) • localStorage hooks for hub state | • Arc 1 rewrites (3 remaining) • ArcHero, GuideTemplate components • /guides/:arc/:slug routing | • Real API: Health \+ Food tabs • ?topic= deep-link routing • Topic-specific UI for Health tab |
| **Week 3** | • Life-moment tiles on main Landing • Live stats widget wired • Hub sections 4–5 (saved locations, jump back in) • Mobile bottom-sheet behaviour | • Arc 2 rewrites (5) • ProgressIndicator hook • BridgeCTA component | • Service detail panel • Real API: Getting Around, Home & Admin, Social & Belonging • Topic-specific UI for remaining tabs |
| **Week 4** | • Hub footer \+ export/clear journey • Notification dot logic on hub trigger • End-to-end QA • Tagline placement audit | • Arc 3 rewrites (5) • Cross-arc navigation QA • Bridge CTA end-to-end tests | • "Came from a guide" banner • Save-location feature • Back-reference links on detail panels |

| Critical cross-track dependencies Week 1: Taxonomy must be locked before any track proceeds — it's the contract all three depend on. · Week 2: Near Me's ?topic= routing must ship before Guides' BridgeCTA can be wired end-to-end in Week 3\. · Week 3: Landing's life-moment tiles depend on both Guides' arc structure and Near Me's topic tabs being live. · Week 4: The "came from a guide" banner and saved-locations-on-Landing features need Bridge CTAs fully wired to test end-to-end. |
| :---- |

# **11\. Tech & Data Model Changes**

The narrative restructure requires small but specific changes to the guide schema, routing, and React component library. These changes align with the backend ERD: Topic and Arc become first-class reference entities; Guide and Guide Section carry the content; Suburb and Suburb Demographic support suburb-aware personalisation. No Character entity, no Life Moment entity — personas and entry tiles are internal editorial/UI concepts, not persisted content. Location data for Near Me is fetched live from SerpApi (Google Local) at request time and is not persisted.

### **Guide schema additions**

* **arc** — enum: week\_one | month\_one | month\_three

* **arc\_order** — integer, position within arc (1–5)

* **topic** — enum of the unified 5 topics (replaces the old category field)

* **reading\_time\_min** — integer, estimated read time shown on guide cards and Continue Reading

* **is\_published** — boolean, controls draft vs live state during the rewrite phase

* **is\_featured** — boolean, used to highlight exemplar guides (e.g. for the homepage “featured this week” slot)

* **next\_guide\_slug** — string, drives the "Up next" link

* **near\_me\_deeplink** — string, the pre-filtered Near Me URL for the Bridge CTA

### **Routing changes**

* /guides — library index, three arc sections replacing the old filter chips

* /guides/:arc — arc landing page with emotional hero and sequential list

* /guides/:arc/:slug — individual guide page with "Up next" footer

* /near-me?topic=health — Near Me accepts ?topic= to support deep-linking from Bridge CTAs

### **New React components**

| Component | Purpose |
| :---- | :---- |
| **ArcHero** | Arc landing page header. Title, emotional framing paragraph, progress indicator. |
| **GuideTemplate** | Enforces the six-part narrative structure at the component level — named slots for Moment, Feeling, Reveal, How It Works, Bridge, Next Chapter. |
| **ProgressIndicator** | "3 of 5 read" per arc, persisted via localStorage. Same hook powers the Landing hub's "Continue where you left off" feature. |
| **BridgeCTA** | Standardised bottom-of-guide CTA to Near Me. Takes a topic enum and produces the correct deep-link. |
| **NextChapterLink** | Teaser-style link to the next guide in the arc. Uses italic body copy, not a button — it's a hook, not a CTA. |

| Migration note Keep the old category field in the schema during Iteration 2 as a deprecation path, mapping old categories to new topics on read. Removing it immediately breaks search indexing and the bookmark system built in Iteration 1\. Scheduled removal: Iteration 3\. |
| :---- |

# **12\. What This Unlocks**

Iteration 2 moves Minuri from three features behind a landing page to a single connected experience. Five outcomes, tied directly to the Iteration 2 success criteria.

**1\. All three epics evolve together.** Landing becomes a living hub, Guides become a narrative journey, and Near Me becomes a real tool with live data. Every epic ships meaningful change — not just Guides.

**2\. Mentor feedback addressed end-to-end.** The Guides have narrative shape, not just tips. Every guide follows a character through a specific Melbourne moment and resolves on a reveal.

**3\. Cross-epic coherence drops in naturally.** The unified 5-topic taxonomy lets Landing's life-moment tiles, Guides' Bridge CTAs, and Near Me's tab strip all speak the same language. Deep-links work. Banners make sense. Saved locations return home to Landing.

**4\. The new tagline earns its place.** "Still feeling home, wherever you are" shows up most strongly on Landing and in the warmer register of the Guides rewrites. It stops being just a tagline and becomes the product's tone.

**5\. The pitch gets stronger.** "We rewrote our guides as a journey, connected our three features around a shared topic taxonomy, and made Landing a home base users return to" is a better Iteration 2 story than "we added features." It shows design maturity, not just delivery.

*Minuri · Iteration 2 Plan · Narrative Guides*  
*Still feeling home, wherever you are.*