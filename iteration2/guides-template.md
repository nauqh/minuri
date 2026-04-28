# Minuri — Guide Content Briefs

**Iteration 2 · 20 guides shipped in-app · Six-part narrative template**

*Still feeling home, wherever you are.*

---

## How to use this document

Each guide has six parts, matching the narrative template used for every guide in Iteration 2:

1. **The Moment** — a specific, recognisable scene that opens the guide. Written in second person ("you"). Never a named character.
2. **The Feeling** — the reader-recognition line. The emotional state this moment opens.
3. **The Reveal** — the one insight the guide exists for. One or two sentences, sharp.
4. **How It Works** — the practical content the guide covers. A research spec, not copy.
5. **The Bridge** — the Near Me deep-link and topic tab it points to.
6. **Next Chapter** — the teaser line and which guide follows in the arc.

The brief in each part is **editorial direction, not final copy**. Writers use this as their spec before drafting.

### Voice rules

- **Second person throughout.** "You wake up at 6am" — never "Alex woke up."
- **No named characters in reader-facing content.** The reader is the protagonist.
- **Moment first, facts second.** Every guide opens with a scene, not a definition.
- **One Reveal per guide.** If there are two reveals, you have two guides.
- **End on action.** No summaries — every guide closes with a Bridge and a Next Chapter.

### Metadata

- **Persona (internal)** — which of the two internal editorial personas (Alex / Jordan / Both) this guide was written with in mind. For writing-decision use only; never appears in reader-facing content.
- **Status** — `REWRITE` means an existing Iteration 1 guide being rewritten to the template. `NEW` means net-new content for Iteration 2.

### Arcs (product taxonomy)

Shipped guides use **three time arcs**, each spanning **all five topics** (Food & Eating, Getting Around, Health & Wellbeing, Home & Admin, Social & Belonging):

| Arc | URL slug | Reader label | Intent |
|-----|----------|--------------|--------|
| **Day 1** | `day-1` | Day 1 | First day/night alone: immediate survival and orientation in every topic. |
| **Week 1** | `week-1` | Week 1 | First full week: systems, appointments, money, and place-making. |
| **Month 1** | `month-1` | Month 1 | First month: rhythm, community, lease reality, and sustaining habits. |

Older drafts referred to “Week 1 / Month 1 / Month 3”; the live product uses **Day 1 / Week 1 / Month 1** so the third arc is clearly the first month, not a later milestone.

### Shipped guide inventory (authoritative)

These numbers reflect what the app actually loads: the `GUIDE_FILES` array in `content/guides.ts` (each entry is a JSON file under `public/guides-content/`).

| Metric | Value |
|--------|-------|
| **Total shipped guides** | **20** |
| **Arcs × topics (grid)** | 3 × 5 = **15** cells |
| **Full arc×topic coverage** | **Yes** — every cell has ≥ 1 guide |
| **Cells with 2 guides** | 5 (see matrix below) |

**Coverage matrix (arc slug × topic)** — multiple titles in one cell means two separate guides share that arc and topic.

| Arc | Food & Eating | Getting Around | Health & Wellbeing | Home & Admin | Social & Belonging |
|-----|---------------|----------------|--------------------|--------------|--------------------|
| `day-1` | Your First Grocery Run | Getting a Myki & Surviving PTV | Crisis Lines You Can Actually Call; Finding a GP Before You Need One | Your First 48 Hours: The Checklist | When You Don't Know Anyone Yet |
| `week-1` | Cooking 5 Meals You'll Actually Eat | Finding Your Way Around Melbourne in Week One | Managing Your Prescriptions in a New City; Medicare, Bulk-Billing & Mental Health Care Plans | Budgeting on What You Actually Earn; Setting Up Utilities Without Overpaying | Making Friends in a City Where Everyone's Busy |
| `month-1` | Cheap Eats When You're Broke | Building a Local Routine That Feels Like Yours | Sustaining Yourself: Sleep, Movement and Disconnecting; When to See a Psych, a Counsellor, or a Friend | Renting Without Getting Burned | The Homesickness Nobody Warns You About; Finding Your Community |

The long-form briefs below are the editorial spec for Iteration 2; the shipped set above is the subset currently wired into the product. When you add a guide, import its JSON into `content/guides.ts` and extend this matrix if the arc×topic cell is new or now has a second guide.

---

# Arc 1 — Day 1 · "I just arrived" · Survival across every topic

*Every topic has at least one Day 1 guide: food, transport, health, home, and social baseline. The Reveal in each guide is the thing no resource directory mentions.*

## Food & Eating

### 1. Your First Grocery Run

*Persona (internal): Alex · Status: REWRITE*

**1 · The Moment** — Day two. You're standing at the entrance of a Woolworths with a trolley and a rough list, realising you don't recognise most of the brands and have no idea what anything should cost.

**2 · The Feeling** — That specific paralysis of not knowing what you don't know. You've shopped before — but never for yourself, never here, never without someone else's context to lean on.

**3 · The Reveal** — Aldi is not a downgrade. Australian home-brand products are largely the same quality as branded. You can eat well for $60 in your first week if you know which 12 items to buy.

**4 · How It Works** — The Melbourne supermarket map (Woolies, Coles, Aldi, IGA — what each is for). The $60 first-week shopping list. How to read unit pricing on shelf labels. Why branded is a habit, not a necessity. What to skip in week one. How to shop for one without waste.

**5 · The Bridge** — Find your nearest supermarket → Near Me / Food & Eating

**6 · Next Chapter** — *"Next: Cheap Eats When You're Broke — because you'll want to leave the kitchen eventually."*

---

### 2. Cheap Eats When You're Broke

*Persona (internal): Alex · Status: REWRITE*

**1 · The Moment** — End of week two. $30 left until payday. You're sitting outside a food court trying to decide what you can afford that isn't depressing.

**2 · The Feeling** — Broke-hungry is different from regular hungry. It carries a specific anxiety — the money stress is seasoning everything you eat. You want good food and you feel like you can't have it.

**3 · The Reveal** — Melbourne has an entire economy of $10-or-less meals that locals know and newcomers never find. You don't have to eat sad food when you're broke.

**4 · How It Works** — Food court strategy by suburb (Chinatown, Victoria Market, Footscray). The $10 rice-box districts. Student discount apps (UNiDAYS, Student Beans). Which fast food is actually value. How to find a good cheap lunch in an unfamiliar area. The $5–$8 banh mi circuit.

**5 · The Bridge** — Find cheap eats near you → Near Me / Food & Eating / Cafes & Restaurants

**6 · Next Chapter** — *"Next: Cooking 5 Meals You'll Actually Eat — because eating out every night adds up."*

---

## Getting Around

### 3. Getting a Myki & Surviving PTV

*Persona (internal): Both · Status: REWRITE*

**1 · The Moment** — First morning commute. You watch everyone around you tap on and move through the barriers while you stand there holding a paper ticket that doesn't exist.

**2 · The Feeling** — Public transport in a new city is one of those things that feels simple until you're standing on the wrong platform at the wrong time, and everyone else seems to just know.

**3 · The Reveal** — Melbourne's tram network is the largest in the Southern Hemisphere and most of the inner city is completely free. Many newcomers pay for trams they never needed to.

**4 · How It Works** — Where to buy a Myki (7-Eleven, station machines, online). How to top up. Zone 1 vs Zone 2 explained. The Free Tram Zone boundaries. How daily and weekly caps work. Night Network on weekends. PTV app setup and journey planning. What to do if your Myki stops working.

**5 · The Bridge** — Find tram stops and stations near you → Near Me / Getting Around

**6 · Next Chapter** — *"Next: Finding Your Way Around Melbourne in Week One — knowing your zone is just the start."*

---

### 4. Finding Your Way Around Melbourne in Week One

*Persona (internal): Jordan · Status: NEW*

**1 · The Moment** — Day three. You're trying to get from Fitzroy to Carlton — about 15 minutes on foot — but get turned around by one-way streets and a tram going the wrong direction. You arrive 20 minutes late.

**2 · The Feeling** — The city isn't hostile. It's just legible in a way you haven't learned yet — like reading in a language where you know most of the letters but not how they combine.

**3 · The Reveal** — Melbourne's CBD is a strict grid, but just outside it everything curves. Once you know four spine streets — Swanston, Elizabeth, Flinders, Collins — the rest of the inner suburbs fall into place.

**4 · How It Works** — The CBD grid explained (numbered blocks, why the corner tells you where you are). Inner-suburb spine streets by direction. Google Maps walking vs transit vs cycling modes. Melbourne's cycling network (on-road lanes, off-road paths). Lime and Neuron e-bike pickup zones. The tram network as a navigation backbone. How to read a PTV network map.

**5 · The Bridge** — Find bike share and public transport near you → Near Me / Getting Around

**6 · Next Chapter** — *"Next: Myki Concessions and Weekly Caps — how to stop overpaying once you know where you're going."*

---

## Health & Wellbeing

### 5. Finding a GP Before You Need One

*Persona (internal): Alex · Status: REWRITE*

**1 · The Moment** — 6am, three weeks in. You wake up with a 39° fever and reach for your phone to call your mum's doctor — the one you've been going to since you were nine — and realise you're 700 kilometres away from that clinic.

**2 · The Feeling** — If you've never had to find your own doctor, this moment hits harder than you expect. Most of us grew up being taken to a GP. We never had to pick one.

**3 · The Reveal** — In Australia, finding a GP isn't like finding a specialist. You don't need a referral, don't need insurance, and if you pick a bulk-billing clinic, it costs you nothing.

**4 · How It Works** — What bulk-billing means and how to filter for it. How to use Healthdirect to find a clinic near you. What to bring to a first appointment (Medicare card, ID, any existing scripts). How to enrol as a new patient. After-hours options. Telehealth for non-urgent needs. The difference between a GP and a specialist.

**5 · The Bridge** — Find bulk-billing GPs near you → Near Me / Health & Wellbeing / Clinics

**6 · Next Chapter** — *"Next: Medicare, Bulk-Billing & Mental Health Care Plans — the three words that unlock half of Australia's healthcare system."*

---

### 6. Crisis Lines You Can Actually Call

*Persona (internal): Both · Status: REWRITE*

**1 · The Moment** — It's 2am. Something happened — a fight with someone back home, a wave of everything feeling too much at once. The instinct is to open a browser tab and then close it.

**2 · The Feeling** — There's a specific shame in googling "who to call when you're not okay" — like you should already know this, like you're the only one who doesn't.

**3 · The Reveal** — Australia has strong crisis support infrastructure. The hard part isn't finding the number — it's knowing you're allowed to use it. You don't have to be in crisis to call. You just have to be struggling.

**4 · How It Works** — Lifeline 13 11 14 (what happens when you call, what to expect, call vs text). Beyond Blue 1300 22 4636. 1800RESPECT (for sexual violence or DV). Kids Helpline (up to age 25). QLife (LGBTQ+). Text line options for people who can't make a voice call. University and TAFE counselling services. What "crisis" means and doesn't mean.

**5 · The Bridge** — Find mental health services and crisis support near you → Near Me / Health & Wellbeing / Mental health services

**6 · Next Chapter** — *"Next: When to See a Psych, a Counsellor, or a Friend — when the crisis is lower-level but the need is still real."*

---

## Home & Admin

### 7. Your First 48 Hours: The Checklist

*Persona (internal): Jordan · Status: NEW*

**1 · The Moment** — Moving-in afternoon. The landlord has just left. You're standing in an empty flat surrounded by boxes, realising you have no idea what to check, document, or do first.

**2 · The Feeling** — The relief of getting the keys is followed immediately by a kind of formless overwhelm. There's so much to do and no order. Nobody gave you a manual for this.

**3 · The Reveal** — Your first 48 hours as a renter are your most legally important. What you document now is your protection if anything goes wrong before you move out.

**4 · How It Works** — Condition report walkthrough: what to photograph, what to write, the deadline for returning it to the landlord. Meter readings and how to record them. Setting up utilities under your name. Getting keys copied. Testing smoke alarms and noting defects. Changing the Wi-Fi password. Writing down anything that doesn't work before you unpack.

**5 · The Bridge** — Find locksmiths, utility offices and hardware stores near you → Near Me / Home & Admin

**6 · Next Chapter** — *"Next: Know Your Rights as a Renter from Day One — what that condition report is actually protecting you from."*

---

### 8. Know Your Rights as a Renter from Day One

*Persona (internal): Jordan · Status: NEW*

**1 · The Moment** — Week one. Your landlord texts to say he'll "pop by tomorrow to check on things." No notice period, no time given. You don't know if you can say no.

**2 · The Feeling** — Renting makes you feel like a guest in your own home — especially when you don't know what you're entitled to. That uncertainty is exactly what some landlords count on.

**3 · The Reveal** — Victorian renters have some of the strongest protections in Australia. A landlord cannot enter without 24 hours' written notice except in a genuine emergency. You are allowed to say no to anything else.

**4 · How It Works** — Minimum notice for entry (24 hours written, specific times). Urgent vs non-urgent repairs and what the landlord must fix and when. Bond lodgement to RTBA — how to check it's been lodged. What a routine inspection means and how often it can happen. Consumer Affairs Victoria complaints process. Rent increases — notice period and frequency rules.

**5 · The Bridge** — Find Consumer Affairs Victoria offices and community legal centres near you → Near Me / Home & Admin

**6 · Next Chapter** — *"Next: Renting Without Getting Burned — when your first lease ends and you do it again with more knowledge."*

---

## Social & Belonging

### 9. When You Don't Know Anyone Yet

*Persona (internal): Alex · Status: NEW*

**1 · The Moment** — Sunday afternoon, week one. Everyone back home is together, visible in Instagram stories. You're in your apartment. It's quiet in a way that's different from comfortable quiet.

**2 · The Feeling** — That specific Sunday loneliness — not depression, not crisis, just the absence of a social life that hasn't been built yet. It has a particular quality, like a room without furniture.

**3 · The Reveal** — This feeling has a name — "social baseline loneliness" — and it is nearly universal in people who relocate. It doesn't mean you've made a mistake. It means you're between social worlds, which is exactly where you are.

**4 · How It Works** — What the research says about relocation loneliness and its timeline. The difference between social baseline loneliness and clinical isolation. Why comparing your week to curated social media is a specific trap. Two or three things that actually help in week one: a predictable daily routine, one small real-world interaction per day, a scheduled video call with someone who knows you. What doesn't help.

**5 · The Bridge** — Find community spaces, parks and casual social venues near you → Near Me / Social & Belonging

**6 · Next Chapter** — *"Next: Getting Your Bearings: Exploring Your New Neighbourhood — going outside is a surprisingly effective treatment."*

---

### 10. Getting Your Bearings: Exploring Your New Neighbourhood

*Persona (internal): Alex · Status: NEW*

**1 · The Moment** — Day three. You force yourself to go for a walk without a destination. You find a park you didn't know was there. A cafe with a handwritten menu in a window. A back street that smells like jasmine.

**2 · The Feeling** — A place starts to feel like yours when you've found something in it that nobody sent you to find. That feeling can't be forced, but it can be created with the right conditions.

**3 · The Reveal** — The research on place attachment says familiarity is built through repeated, low-stakes encounters — not through big experiences. The daily walk matters more than the weekend trip.

**4 · How It Works** — The "suburb walk" method: cover the four compass directions from your front door, one per day, in your first week. What to look for (not tourist sights — functional anchors: your nearest park, your nearest convenience store, a quiet route). How to note what you find. Why repeated exposure to the same places matters more than variety at this stage.

**5 · The Bridge** — Find parks, green spaces and walkways near you → Near Me / Social & Belonging

**6 · Next Chapter** — *"Next: Finding Your Local — what happens when you go back to the same place twice."*

---

# Arc 2 — Week 1 · "I'm getting set up" · Systems and structure

*Week-one guides across all topics: cooking loops, utilities, Medicare, navigation, and first social moves. Less “emergency” than Day 1, more foundational. The Reveal in each guide is the thing hiding in plain sight.*

## Food & Eating

### 11. Cooking 5 Meals You'll Actually Eat

*Persona (internal): Alex · Status: REWRITE*

**1 · The Moment** — Week three. You open the fridge and find the same ingredients you've bought three times and cooked twice. You need a system, not more recipes.

**2 · The Feeling** — Cooking for one is logistically annoying in a way nobody prepared you for — the quantities are wrong, things go off before you use them, and the monotony of eating the same thing because you overbought is real.

**3 · The Reveal** — You don't need 20 recipes. You need five that share ingredients, that you can make on autopilot, and that you'll actually want to eat at the end of a long day.

**4 · How It Works** — The five recipes: (1) pasta with a base sauce that works three ways, (2) rice and protein stir-fry, (3) egg-based dish (frittata or scramble), (4) noodle soup, (5) grain bowl with whatever's left. Shared shopping list across all five. Batch-cooking basics. How to buy the right quantities for one person without waste. What to prep on Sunday.

**5 · The Bridge** — Find supermarkets and food markets near you → Near Me / Food & Eating

**6 · Next Chapter** — *"Next: Setting Up Your Kitchen Without Overspending — once you know what you're cooking, you'll know what you actually need."*

---

### 12. Setting Up Your Kitchen Without Overspending

*Persona (internal): Alex · Status: NEW*

**1 · The Moment** — Moving in week. You're looking at a bare kitchen counter and a $400 Kmart wishlist you've built from Instagram, wondering what you actually need versus what you've been told you need.

**2 · The Feeling** — Kitchen setup is a category that retailers have turned into an anxiety spiral. You can spend $600 and still not cook well. Or $60 and be completely fine.

**3 · The Reveal** — You need 12 items. A sharp knife, a chopping board, one pot, one pan, a wooden spoon, a colander, a bowl, a baking tray, measuring cups, a peeler, a grater, and a can opener. Everything else is optional for the first year.

**4 · How It Works** — The 12-item essentials list with Kmart, IKEA, and op-shop sourcing notes. What's worth spending on (the knife: $20–30, nothing cheaper). What to buy secondhand without hesitation. What to avoid in year one (single-purpose gadgets, matching sets). How to cook the Arc 2 recipe list with only these 12 items. What to add if you want to expand.

**5 · The Bridge** — Find op-shops, homewares and kitchenware near you → Near Me / Food & Eating

**6 · Next Chapter** — *"Next: Cooking for More Than One — when you're ready to have someone over."*

---

## Getting Around

### 13. Myki Concessions, Weekly Caps and Saving Money on Public Transport

*Persona (internal): Jordan · Status: NEW*

**1 · The Moment** — Month one, doing your budget. You've spent $180 on public transport. You know there was a concession card you should have set up. You just never got around to it.

**2 · The Feeling** — There's a specific sting to discovering you've been overpaying for something — especially when the cheaper option was there the whole time and nobody mentioned it.

**3 · The Reveal** — If you're a student or hold a health care card, you should be paying half price on every single trip. The weekly cap means you'll never pay more than $57.80 a week no matter how much you travel. Most newcomers know neither of these things.

**4 · How It Works** — How to set up a concession Myki (proof of eligibility, myki.com.au process). Daily cap ($10.80) and weekly cap ($57.80) explained. How the system charges you — and how to check if it's correct. PTV app balance notifications. What to do if you're overcharged. Student concession vs health care card concession — the difference.

**5 · The Bridge** — Find Myki top-up locations near you → Near Me / Getting Around

**6 · Next Chapter** — *"Next: Getting Your Victorian Driver's Licence or Learner Permit — if driving is on the agenda."*

---

### 14. Getting Your Victorian Driver's Licence or Learner Permit

*Persona (internal): Jordan · Status: NEW*

**1 · The Moment** — Month one. You try to hire a Flexicar for a weekend trip and discover your Queensland licence needs converting, and your credit card won't cover the damage waiver because your licence isn't Victorian.

**2 · The Feeling** — Driving should transfer seamlessly between states. It mostly does — but only if you know the rules, and only for a limited time that most people let expire without realising.

**3 · The Reveal** — You have three months from becoming a Victorian resident to convert your interstate licence. After that you are technically driving unlicensed. Almost nobody knows this.

**4 · How It Works** — Interstate licence conversion: VicRoads process, documents required, cost, how long it takes. Overseas licence holders: different process, different timeline, translation requirements. Learner permit steps for people who don't have one. VicRoads appointment booking. Hazard perception test overview for those who need it. P-plate rules for young drivers transferring from another state.

**5 · The Bridge** — Find VicRoads service centres near you → Near Me / Home & Admin

**6 · Next Chapter** — *"Next: Building a Local Routine That Feels Like Yours — once you can drive it."*

---

## Health & Wellbeing

### 15. Medicare, Bulk-Billing & Mental Health Care Plans

*Persona (internal): Jordan · Status: REWRITE*

**1 · The Moment** — Month one. You're at the GP for the first time and are asked for your Medicare number. You've never enrolled. You've been putting it off, and "eventually" is apparently now.

**2 · The Feeling** — Medicare feels like bureaucracy — something you'll get around to. Then you're in a waiting room being asked for it and that gap becomes immediately and embarrassingly real.

**3 · The Reveal** — Enrolling takes 20 minutes online. Once you have it, a bulk-billing GP costs you nothing. A Mental Health Care Plan gives you up to 20 subsidised psychology sessions a year — most people don't know this option exists.

**4 · How It Works** — Medicare enrolment via Services Australia (what you need: birth certificate or passport, proof of residency). What Medicare does and doesn't cover. Bulk-billing: what it means, how to ask for it, how to find a clinic that offers it. Mental Health Care Plan: how to ask your GP, what it unlocks, how many sessions, approximate out-of-pocket cost. Better Access scheme. University health centres.

**5 · The Bridge** — Find bulk-billing GPs and mental health services near you → Near Me / Health & Wellbeing

**6 · Next Chapter** — *"Next: Managing Your Prescriptions in a New City — if you're on regular medication."*

---

### 16. Managing Your Prescriptions in a New City

*Persona (internal): Alex · Status: NEW*

**1 · The Moment** — Month one. You're running low on your regular medication and don't have a GP yet, don't know how to transfer a script, and don't know what "PBS" means on the pharmacy sign.

**2 · The Feeling** — Medication logistics just works at home because someone else set it up years ago. In a new city, the whole system is suddenly, quietly, on you.

**3 · The Reveal** — Under the Pharmaceutical Benefits Scheme, most common medications cost between $7.70 and $31.60 regardless of what they might cost elsewhere. You just need a current Australian script.

**4 · How It Works** — Electronic prescriptions: what they are and how to transfer between pharmacies without physically moving a piece of paper. What PBS means and how to check if your medication is listed. How to find a 24-hour pharmacy in Melbourne. Emergency supply provisions for when you run out unexpectedly. Telehealth services for non-urgent prescription renewals. What to do if you're on medication not listed on PBS.

**5 · The Bridge** — Find pharmacies near you → Near Me / Health & Wellbeing / Clinics

**6 · Next Chapter** — *"Next: When to See a Psych, a Counsellor, or a Friend — if it's mental health medication you're managing."*

---

## Home & Admin

### 17. Renting Without Getting Burned

*Persona (internal): Jordan · Status: REWRITE*

**1 · The Moment** — Your fourth rental inspection. Twelve other people are there with organised folders. You don't know what's in those folders or why you don't have one.

**2 · The Feeling** — Melbourne's rental market makes you feel like you're auditioning for a role that's already been cast. The system is designed to be opaque to people who don't already know it.

**3 · The Reveal** — Your rental application is a product. Landlords choose applications the way employers choose CVs. Knowing what they're looking for — and presenting it exactly that way — is the difference between getting a place and not.

**4 · How It Works** — What goes in a rental folder: ID (passport or licence), last three payslips or Centrelink evidence, employment reference letter, personal reference, filled application form, a short cover letter (yes, for a rental). How to write a cover letter that works. Lease types (fixed vs periodic) and what to check before signing. Bond lodgement to RTBA — what it is, how to verify it's been done. Lease red flags. What to do if something breaks after you move in.

**5 · The Bridge** — Find real estate agencies and rental listings near you → Near Me / Home & Admin

**6 · Next Chapter** — *"Next: Budgeting on What You Actually Earn — once you know what rent is taking each month."*

---

### 18. Budgeting on What You Actually Earn

*Persona (internal): Jordan · Status: REWRITE*

**1 · The Moment** — End of month one. You look at your bank account and can't explain where $400 went. You were careful. You're sure you were careful.

**2 · The Feeling** — Money disappears in a new city in ways it didn't at home, because you don't know the costs yet. Every purchase is a guess dressed up as a decision.

**3 · The Reveal** — The 50/30/20 rule was designed for American salaries and it breaks immediately on Melbourne rents. The real number to track is your weekly discretionary spend, not your monthly budget.

**4 · How It Works** — Melbourne-specific cost breakdown for a single person (rent, transport, food, utilities, phone). The 50/30/20 rule and why to adapt it. Weekly tracking vs monthly budgeting — why weekly is more controllable. Free apps that work (Up Bank's spending categories, Frollo). Common month-one budget mistakes: eating out when stressed, buying comfort items, underestimating transport. What to cut vs what to protect.

**5 · The Bridge** — Find banks and financial services near you → Near Me / Home & Admin

**6 · Next Chapter** — *"Next: Setting Up Utilities Without Overpaying — fixed costs matter as much as variable ones."*

---

### 19. Setting Up Utilities Without Overpaying

*Persona (internal): Both · Status: REWRITE*

**1 · The Moment** — End of first month. A $380 electricity bill arrives. Nobody told you the apartment was on the retailer's default plan. Nobody told you you had a choice.

**2 · The Feeling** — Utilities feel fixed — you get what you get and you pay what it costs. The idea that you have a choice, and that exercising it saves hundreds a year, is not obvious until someone points it out.

**3 · The Reveal** — In Victoria, energy providers compete for your business and you can switch plans in ten minutes online. Most new renters stay on the default plan for years and overpay by $200–400 annually.

**4 · How It Works** — Victorian Energy Compare (compare.energy.vic.gov.au) — how to use it. How to read an energy bill (usage vs supply charges). Gas vs all-electric apartments: which is cheaper and when. Internet providers by suburb: which NBN plans are actually worth it, average speeds to expect. Water billing: who pays in a rental, how it's calculated, what's typical. What to do if a bill seems wrong.

**5 · The Bridge** — Find utility offices and service centres near you → Near Me / Home & Admin

**6 · Next Chapter** — *"Next: When Your Lease Comes Up — what to do when the year ends and everything's up for renegotiation."*

---

## Social & Belonging

### 20. Finding Your Local

*Persona (internal): Alex · Status: NEW*

**1 · The Moment** — Month one. You go back to the same cafe on Thursday for the third week running. The person behind the counter recognises your order without being asked.

**2 · The Feeling** — There's a moment when a place stops being a location and starts being yours. It's small and quiet and it matters more than it should, and it takes you by surprise when it happens.

**3 · The Reveal** — A "local" — a regular place where you're at least expected, even if not known — is one of the most reliable low-effort buffers against urban loneliness. It's not the deep social connection you imagine, but it's real and it's reliable.

**4 · How It Works** — How to find your local: the three-week test (go back to the same place three times and see if it still feels right). Why regularity matters more than intensity in early place attachment. The difference between your local cafe, your local park, and your local route — and why having all three matters. How to be a regular without effort. What this process looks like in different suburb types (inner-city vs outer suburban).

**5 · The Bridge** — Find cafes, parks and regular spaces near you → Near Me / Food & Eating and Social & Belonging

**6 · Next Chapter** — *"Next: Getting to Know Your Neighbours — expanding the geography outward."*

---

### 21. Getting to Know Your Neighbours

*Persona (internal): Jordan · Status: NEW*

**1 · The Moment** — Month one. You hear your neighbour's music through the wall for the third night and realise you don't know this person's name or face — and now it's too late for an easy introduction.

**2 · The Feeling** — Neighbours are the people you're most likely to need help from one day and the least likely to know anything about. The awkwardness of not knowing them compounds with every week that passes.

**3 · The Reveal** — You don't need a friendship. You need a relationship of mutual recognition — names, a nod in the hallway, a door you could knock on in an emergency. That alone reduces noise friction and increases informal security.

**4 · How It Works** — The first-week window: why the first week is the easiest time to introduce yourself and how to do it (one sentence, no pressure). What to say and what not to say. How to handle ongoing friction (noise, shared spaces) before it becomes conflict. The body corporate or real estate agent as a resource when it does escalate. The difference between wanting to be friends and wanting to be neighbours — and why the second is more useful.

**5 · The Bridge** — Find community centres and noticeboards near you → Near Me / Social & Belonging

**6 · Next Chapter** — *"Next: Making Friends in a City Where Everyone's Busy — when you're ready for something more intentional."*

---

# Arc 3 — Month 1 · "I'm looking for my people" · Rhythm and belonging

*The arc of belonging and sustainability in your first month. Starts when early admin is underway and a different, quieter difficulty appears. In the shipped library this arc also carries “first month” food, home, and health depth—not only social content.*

## Food & Eating

### 22. Melbourne's Food Scene on a Budget

*Persona (internal): Both · Status: NEW*

**1 · The Moment** — Month three. You've been eating at the same three places — it feels safe, it's easy, it's fine. But Melbourne has an entire food culture you've barely touched.

**2 · The Feeling** — There's a moment when "survival eating" can open into actually enjoying what the city has to offer. The shift isn't about spending more. It's about knowing where to look.

**3 · The Reveal** — Melbourne has one of the most diverse food cultures in the world. The most interesting and affordable part of it isn't on restaurant review sites — it's in the multicultural suburb strips that tourists never find.

**4 · How It Works** — Queen Victoria Market (what to buy, when to go, what to avoid). Footscray Market (Vietnamese and African grocers, the Vietnamese strip on Hopkins St). Box Hill (Chinese food courts, $8 dumplings). Dandenong (Sri Lankan, Indian, Afghan). BYO restaurant culture: what it means, how to find them, how to use it. $10 lunch spots by suburb. Student deal apps for restaurant discounts. Sunday market circuit.

**5 · The Bridge** — Find markets, food courts and restaurants near you → Near Me / Food & Eating

**6 · Next Chapter** — *"Next: Cooking for More Than One — bringing the food culture home."*

---

### 23. Cooking for More Than One

*Persona (internal): Alex · Status: NEW*

**1 · The Moment** — Month three. You're having people over for the first time. You want to cook. You have no idea how to scale a recipe for four people, how much to buy, or how to time it so everything's ready at once.

**2 · The Feeling** — Feeding people is an act of care, but it comes with a specific anxiety the first time — what if there's not enough, what if it's awful, what if the kitchen is too small.

**3 · The Reveal** — Hosting doesn't require culinary skill. It requires one reliable dish, enough of it, and the confidence to offer it. The bar is considerably lower than you think.

**4 · How It Works** — How to scale the Arc 2 recipes for 2–4 people (specific quantity multipliers per recipe). Timing: how to work backwards from a mealtime. Potluck culture in Melbourne — how it works, what the etiquette is, how to invite people into it. Dietary requirements: a calm approach. The "one good dish" philosophy — why doing one thing well is better than three things adequately. What to have in reserve if something goes wrong.

**5 · The Bridge** — Find food markets and specialty ingredient stores near you → Near Me / Food & Eating

**6 · Next Chapter** — *"Next: Finding Your Community in Melbourne — food is how communities often find each other."*

---

## Getting Around

### 24. Building a Local Routine That Feels Like Yours

*Persona (internal): Alex · Status: REWRITE*

**1 · The Moment** — Month three. You're walking the same route to the station every morning and have started to notice details you never noticed before — a jacaranda you didn't register for six weeks, a bakery that opens at 6am, a corner that always smells like coffee.

**2 · The Feeling** — Repetition does something to a city. It starts to feel like yours even though nothing has changed except your attention to it. The city hasn't moved. You have.

**3 · The Reveal** — Neuroscience calls this "cognitive mapping" — your brain is building a spatial and emotional model of your environment that actively reduces anxiety and increases your sense of safety. You don't have to force it. You just have to keep going.

**4 · How It Works** — What a local routine actually consists of (morning walk, a regular coffee stop, a weekly rhythm — market, run, class). How daily repetition interacts with place attachment and belonging. The role of seasonal change in Melbourne as a reinforcing timeline. How to build one deliberately if it hasn't emerged naturally: identify three anchor points (morning, midday, evening), assign a place to each, go back.

**5 · The Bridge** — Find parks, paths and regular neighbourhood spots near you → Near Me / Getting Around and Social & Belonging

**6 · Next Chapter** — *"Next: Exploring Melbourne Beyond the CBD — now that you have a base to come back to."*

---

### 25. Exploring Melbourne Beyond the CBD

*Persona (internal): Both · Status: NEW*

**1 · The Moment** — Month three. You've seen the same inner-suburb streets for twelve weeks. Melbourne is enormous and you've covered about 3% of it.

**2 · The Feeling** — After the survival and admin phases settle, there's genuine space to be curious. But Melbourne's regions don't advertise themselves — they don't need to. You have to know to look.

**3 · The Reveal** — Victoria has some of the most accessible day-trip destinations in Australia, all reachable by public transport for under $30 return. You don't need a car and you don't need to plan weeks ahead.

**4 · How It Works** — V/Line destinations from Southern Cross Station: Geelong (1 hour, beach and art), Ballarat (1.5 hours, history and food), Bendigo (2 hours, galleries and goldfields), Warrnambool (3 hours, coast). Metro extensions: Mornington Peninsula (bus from Frankston), Dandenong Ranges (Belgrave line). Booking V/Line tickets (PTV app or station). What to do without a car in each destination. Car-sharing for trips that need wheels: GoGet, Flexicar, Popcar — how they work, what they cost.

**5 · The Bridge** — Find V/Line and regional transport access near you → Near Me / Getting Around

**6 · Next Chapter** — *"Next: Building a Local Routine That Feels Like Yours — the thing to come back to."*

---

## Health & Wellbeing

### 26. When to See a Psych, a Counsellor, or a Friend

*Persona (internal): Both · Status: REWRITE*

**1 · The Moment** — You've been feeling low for six weeks and don't know if you need professional help or just a good conversation. Or: you've been referred to a psychologist and don't know what to say or if it's the right kind of help.

**2 · The Feeling** — The mental health help landscape is confusing in a way that actively stops people accessing it. Everyone says "get help" but nobody explains what kind, from whom, at what cost, or in what order.

**3 · The Reveal** — Your GP is your first stop for mental health — not a psychologist or a psychiatrist. They can assess you, prescribe if needed, and write a Mental Health Care Plan that reduces your psychology costs by around 70%.

**4 · How It Works** — The four options clearly distinguished: (1) GP — first stop, can prescribe, can write MHCP; (2) Psychologist — talk therapy, Medicare rebates with MHCP, $20–50 per session bulk-billed; (3) Psychiatrist — medical specialist, for complex or treatment-resistant conditions, long wait times; (4) Counsellor — no Medicare rebates but lower cost, often through university or EAP. What each does and doesn't do. How to find a psychologist who bulk-bills. What to say in a first session. How to know if a therapist is working.

**5 · The Bridge** — Find mental health services near you → Near Me / Health & Wellbeing / Mental health services

**6 · Next Chapter** — *"Next: Sustaining Yourself — when things are okay but you want to keep them that way."*

---

### 27. Sustaining Yourself: Sleep, Movement and Disconnecting

*Persona (internal): Jordan · Status: NEW*

**1 · The Moment** — Month four. You're fine — not in crisis, not overwhelmed — but running slightly below what you know is your best. Tired but not exhausted. Stressed but not anxious. The subtle grind of city life has a cumulative cost.

**2 · The Feeling** — The maintenance phase is less dramatic than the survival phase but it matters just as much. There's a specific fatigue that accumulates from always being slightly alert, always figuring something out.

**3 · The Reveal** — Sleep debt is the most underrated factor in how people feel in their first year of living alone. The research is clear: consistent sleep timing matters more than total sleep hours.

**4 · How It Works** — Sleep: the consistency principle (same wake time, not total hours), the Melbourne summer light issue and blackout solutions, what actually helps vs sleep hygiene myths. Movement without a gym: running routes by suburb, outdoor pools (and their low seasonal cost), yoga in parks, free fitness apps. Disconnection: what it actually means in a city apartment, digital boundaries without moralising, the value of doing nothing in a place. What to do if you think you need more than this.

**5 · The Bridge** — Find parks, pools and fitness spaces near you → Near Me / Health & Wellbeing and Social & Belonging

**6 · Next Chapter** — *"Next: Finding Your Community in Melbourne — because social connection is one of the most effective wellbeing tools there is."*

---

## Home & Admin

### 28. When Your Lease Comes Up

*Persona (internal): Jordan · Status: NEW*

**1 · The Moment** — Month eleven. A lease renewal notice arrives with a 15% rent increase. You don't know if you should accept, negotiate, or start looking again. You don't know you can do any of these things.

**2 · The Feeling** — Lease renewal is the moment most renters discover they have more power than they've been acting like they have — or realise they've already lost it by not knowing.

**3 · The Reveal** — In Victoria, a landlord can only raise rent once every 12 months and must give you 60 days' written notice. If you've been a reliable tenant, you have leverage. Most renters don't use it.

**4 · How It Works** — Notice periods for lease endings and rent increases (what's required by law). How to negotiate a renewal: what to say, what documentation shows you're a good tenant, what the market rate comparison looks like. The bond refund process: condition report comparison, RTBA claim, how to dispute deductions. End-of-tenancy cleaning standards. How to break a lease early if needed, and what the costs are.

**5 · The Bridge** — Find Consumer Affairs Victoria, legal aid and removalists near you → Near Me / Home & Admin

**6 · Next Chapter** — *"Next: Super, Tax and Your First Year of Work — the other end-of-year admin nobody prepares you for."*

---

### 29. Super, Tax and Your First Year of Work

*Persona (internal): Jordan · Status: NEW*

**1 · The Moment** — End of financial year. You open the myTax portal for the first time. You have three income sources, two super funds, and no idea what a tax deduction is or whether you should be getting one.

**2 · The Feeling** — Tax in Australia should be simple — the ATO pre-fills most of it from employer and bank data. But most people are so worried about doing it wrong that they either don't file, or pay someone to do what takes an hour.

**3 · The Reveal** — If your income was under $18,200 you pay zero income tax. Between $18,200 and $45,000 you pay 19 cents per dollar above the threshold. The ATO pre-fills most of your return. You review, add deductions, and submit.

**4 · How It Works** — myTax walkthrough: setting up a myGov account, linking the ATO, reviewing pre-filled data. Common deductions for first-year workers (work-from-home, uniforms, tools, self-education). What you cannot claim. Superannuation: what it is, what the employer contribution rate is, how to find your balance via the ATO, how to consolidate multiple funds into one. Tax file number — how to get one if you don't have it. What to do with a tax refund.

**5 · The Bridge** — Find ATO-linked financial advice services near you → Near Me / Home & Admin

**6 · Next Chapter** — *"Next: When Your Lease Comes Up — the other annual admin that sneaks up on you."*

---

## Social & Belonging

### 30. Making Friends in a City Where Everyone's Busy

*Persona (internal): Jordan · Status: REWRITE*

**1 · The Moment** — Month three. You've been to a work social event and had three good conversations that led nowhere. You've met people. You just haven't made friends. There seems to be a gap between the two that nobody explained.

**2 · The Feeling** — There's a difference between meeting people and making friends that nobody articulates clearly. You can do everything right — be present, be interesting, follow up — and still not close the gap. Melbourne is full of people having exactly this experience.

**3 · The Reveal** — Adult friendship is primarily built through repeated, unplanned proximity — what psychologists call "propinquity." Melbourne's urban size actively works against this unless you deliberately create the conditions for accidental repeated contact.

**4 · How It Works** — The mechanics of adult friendship: propinquity and how to engineer it. The "third place" concept — a space that is neither home nor work where you regularly encounter the same people. Melbourne-specific contexts that generate propinquity: sports clubs and social sport (City of Melbourne's social sports program), improv classes, language exchanges, regular running groups, volunteer roles. Apps that work for friendship (Bumble BFF, Meetup). How to move from conversation to contact to actual plans without it feeling forced. What to do when it doesn't work.

**5 · The Bridge** — Find community groups, sports clubs and social spaces near you → Near Me / Social & Belonging

**6 · Next Chapter** — *"Next: Finding Your Community in Melbourne — the bigger structure beneath individual friendships."*

---

### 31. The Homesickness Nobody Warns You About

*Persona (internal): Alex · Status: REWRITE*

**1 · The Moment** — Month four. You're on a video call with your mum, laughing about something from home. The call ends. The apartment goes quiet in a specific way that you don't have a word for.

**2 · The Feeling** — Month-four homesickness is different from week-one loneliness. You've built some connection here. The ache is different — it's the distance between who you are here and who you were there.

**3 · The Reveal** — Month three to six is when homesickness often peaks — not month one. You've stopped being distracted by novelty. The life you've left starts to feel more vivid than the one you're building.

**4 · How It Works** — What the research says about homesickness timelines and why it intensifies at month three. The difference between homesickness and depression (important: one is specific and contextual, the other is not). What actually helps: scheduled contact rather than constant contact, bringing rituals from home into the new place, investing in the new city rather than holding it at arm's length. What doesn't help: over-visiting home in the first year (it resets the adaptation clock). How to talk about it with people back home without it dominating every conversation.

**5 · The Bridge** — Find cultural organisations and community groups near you → Near Me / Social & Belonging

**6 · Next Chapter** — *"Next: Finding Your Community in Melbourne — the longer answer to the longer ache."*

---

### 32. Finding Your Community in Melbourne

*Persona (internal): Both · Status: REWRITE*

**1 · The Moment** — Month five. You realise that friendship, while it's growing, isn't quite what you're looking for. You want something more structural — a place to belong, not just people to see.

**2 · The Feeling** — Community is not the same as friendship. It's the difference between one-on-one connection and a net of belonging — something that would hold you if a single thread broke.

**3 · The Reveal** — Melbourne has one of the most active community and civic participation cultures in Australia. But most of it is invisible until you know to look — it doesn't advertise itself the way social media does.

**4 · How It Works** — Melbourne's community landscape by category: (1) Sports and social sport — City of Melbourne program, local football, netball, tennis clubs, social cycling. (2) Volunteering — GoVolunteer, Seek Volunteer, specific causes that align with your interests. (3) Cultural and faith organisations — multicultural community centres, church groups that are open to newcomers, cultural festivals with volunteer roles. (4) Interest and hobby groups — Meetup.com by category, Reddit's Melbourne community threads. (5) Neighbourhood Houses — a Victorian institution, free or low-cost classes and community meals. How long to give something before deciding it isn't for you: the three-times rule.

**5 · The Bridge** — Find community centres, clubs and volunteer organisations near you → Near Me / Social & Belonging

**6 · Next Chapter** — *"Next: Sustaining Yourself — because community is one of the most effective mental health tools there is."*

---

*Minuri · Iteration 2 · Guide Content Briefs*
*Still feeling home, wherever you are.*