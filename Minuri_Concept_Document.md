

**MINURI**

*美結里  —  The beauty of bonding to a community*

*Far from home, still Minuri.*

| Document | Concept Document v2.1 |
| :---- | :---- |
| Unit | FIT5120 Industry Experience |
| Semester | 2026 Semester 1 |
| Topic | Shielding Crisis & Community Resilience |
| Alignment | UN SDG 3 \+ SDG 11 |
| Platform | Web Application (React \+ FastAPI) |

# **1\. Introduction**

This concept document defines the product vision, problem context, target audience, feature specifications, technical architecture, design system, and iteration planning for Minuri — a web application built for young adults aged 18–25 who are navigating independent living for the first time.

It is intended to inform the development team, academic supervisors, and industry mentors of the project's scope, rationale, and implementation plan. The document serves as the authoritative reference for all analysis, design, and build decisions throughout the iterative development process. All epics, user stories, and acceptance criteria defined herein are reflected in the team's LeanKit board and will be used as the basis for acceptance testing in each iteration.

Minuri is an IT for Social Good project, aligned with UN Sustainable Development Goal 3 (Good Health and Wellbeing) and SDG 11 (Sustainable Cities and Communities). It addresses a recognised public health gap using open data from the Australian Bureau of Statistics (ABS) and the Australian Institute of Health and Welfare (AIHW).

# **2\. Problem Statement**

Young adults aged 18–25 who transition into independent living — whether as first-year university students moving away from home, young professionals beginning their first role in a new city, or recent graduates renting alone for the first time — face a significant and underrecognised health and wellbeing gap. Without the informal safety net of a family home (the shared meals, ambient check-ins, and routine nudges that a parent or household provides), many in this cohort struggle to maintain basic daily routines around sleep, nutrition, mental health, and medical care. This decline is gradual, invisible to broader support systems, and rarely addressed until a crisis has already occurred.

The core vulnerability is shared across this entire cohort: the sudden removal of a trusted support network that previously noticed, guided, and reminded them. A 2024 report by Orygen — Australia's leading youth mental health organisation — found that young adults living away from home for the first time are significantly more likely to experience psychological distress, with many citing a lack of informal support as a primary barrier to help-seeking. This is particularly acute for those who have relocated from regional or rural areas to major cities, where geographic distance from family compounds the loss of day-to-day support.

Current digital health tools fail this audience. Existing apps are either too clinical, too reactive (responding to crises rather than preventing them), or too generic to account for the specific context of first-time independent living. There is no mainstream tool that combines proactive health habit support, triage guidance, and ambient social accountability in a format designed specifically for this cohort.

Minuri directly addresses this gap by providing young adults with the tools they need to maintain their wellbeing independently — before a crisis occurs — while connecting them to micro-communities of mutual care.

**Supporting Evidence**

| Source | Key Finding |
| :---- | :---- |
| Orygen (2024). Young People, Mental Health & University Transition. | Students living away from home are significantly more likely to experience psychological distress and are less likely to seek professional help. |
| AIHW (2023). Young Australians: Their Health and Wellbeing. | Over 50% of young adults aged 18–24 in major cities report difficulty maintaining health routines after moving out of home for the first time. |
| ABC News (2024). 'Young Australians moving to the city for work are burning out faster than ever.' abc.net.au, 3 September 2024\. | Young adults relocating from regional areas to major cities for study or work report significantly higher rates of social isolation and unmet healthcare needs in their first year of independent living. |
| ABS Census (2021). Population and Housing. | Inner Melbourne and Clayton LGAs show among the highest concentrations of 18–25 year olds living alone in Australia, with 38% of households being single-person student or graduate households. |

# **3\. Target Audience & Personas**

Minuri's primary audience is young adults aged 18–25 who are living independently for the first time. The audience is united not by geography but by a shared experience: navigating daily health and wellbeing without a family safety net for the first time. Three distinct sub-groups are served.

## **Persona 1 — The Regional Transplant (Primary)**

| Attribute | Detail |
| :---- | :---- |
| **Name & Age** | Alex, 19 |
| **Background** | Domestic student from Bendigo, regional Victoria. First year at Monash University Clayton. Grew up in a close-knit family where a parent managed all health admin, meals, and routines. Now in a studio apartment near campus — surrounded by a new city but feeling completely alone. |
| **Goals** | Get through first year academically, make friends in a new city, and figure out how to manage daily life on his own for the first time. |
| **Pain Points** | Has Medicare but has never booked a GP appointment himself. Does not know what bulk-billing means or how to find a local clinic. Skips meals under assignment pressure. Struggles to maintain sleep schedule without parental structure. Feels embarrassed admitting he does not know how basic adult tasks work. |
| **Behaviours** | Heavy smartphone user. Cooks instant meals. Searches symptoms on Google late at night. Calls home less often because he does not want to worry his parents. |
| **Thinks** | "Everyone else seems to have figured this out. Why haven't I?" |
| **Feels** | Overwhelmed, underprepared, and reluctant to admit it. Independent in theory, not in practice. |
| **Hears** | "You'll get used to it" and "Just Google it" — neither of which is actually helpful. |
| **News Reference** | The Guardian Australia (2024). 'Regional students at Melbourne universities face hidden wellbeing crisis.' theguardian.com, 8 February 2024\. |

## **Persona 2 — The First-Time Renter (Secondary)**

| Attribute | Detail |
| :---- | :---- |
| **Name & Age** | Chloe, 19 |
| **Background** | Domestic student from Geelong, Victoria. First year at Monash Clayton. Grew up in a small town where her mother managed all health admin. Now sharing a house with two other students she met at O-Week — surrounded by people but still feeling alone. |
| **Goals** | Find her feet socially, keep mental health stable during exams, eat better than she did in O-Week. |
| **Pain Points** | Has a Medicare card but has never booked a GP herself. Stress-eats or skips meals under pressure. Feels guilty calling home every time she struggles. Does not know which GP clinics are bulk-billing near campus. |
| **Behaviours** | App-native — uses apps for everything else and expects health to work the same way. Asks housemates for advice, then second-guesses it. |
| **Thinks** | "I should be handling this on my own by now." |
| **Feels** | Capable but underprepared. Independent in theory, not in practice. |
| **Hears** | "You'll figure it out" — not actionable. |
| **News Reference** | The Guardian Australia (2024). 'Regional students at Melbourne universities face hidden wellbeing crisis.' theguardian.com, 8 February 2024\. |

## **Persona 3 — The First Jobber (Tertiary)**

| Attribute | Detail |
| :---- | :---- |
| **Name & Age** | Jordan, 23 |
| **Background** | Just started their first full-time role at a tech company in Melbourne CBD. Moved from Brisbane; renting alone for the first time. No longer has the structure of a student community. |
| **Goals** | Perform well at work, manage stress, build a new social life in Melbourne. |
| **Pain Points** | Long hours erode sleep and exercise habits. Does not know any local GPs. Feels admitting struggle would seem unprofessional. Tracked by hustle-culture norms. |
| **Behaviours** | Productivity-app user. Responds to data-driven personal insights. Tracks everything — except their wellbeing. |
| **Thinks** | "I'm burning out but I don't know how to stop." |
| **Feels** | Ambitious but isolated. Success-oriented but health-neglecting. |
| **Hears** | Hustle culture narrative that deprioritises self-care. |
| **News Reference** | ABC News (2024). 'Burnout among young professionals is rising — and they're not seeking help.' abc.net.au, 3 September 2024\. |

# **4\. Solution Overview**

Minuri is a responsive web application that provides proactive, preventative health and wellbeing tools for young adults living independently for the first time. It does not replace professional healthcare — it fills the informal support gap that exists before a crisis occurs.

The application is structured around four core modules: a Health Reminder System, a Guideline Article Library, a Health Habit Tracker, and the Care Circle — Minuri's key innovation feature. Together, these modules replicate the informal oversight of living with family, surface early warning signals before they escalate, and connect users to trusted people back home and local peers who understand the same experience.

By leveraging ABS Census data, Minuri surfaces locally relevant health resources (e.g. bulk-billing GPs near Clayton or Parkville) personalised to the user's suburb. This data-driven localisation is a core differentiator from generic health information platforms.

# **5\. Epics, User Stories & Acceptance Criteria**

All epics are prioritised using the MoSCoW method (Must Have, Should Have, Could Have, Won't Have). Acceptance criteria are defined using the SMART format and are reflected in the team's LeanKit board.

| ID | Epic Title | MoSCoW | Description |
| :---- | :---- | :---- | :---- |
| E1 | Health Reminder System | Must Have | Personalised, contextual daily nudges for water intake, meals, sleep, and medication. Replaces informal family check-ins. |
| E2 | Guideline Article Library | Must Have | Curated, searchable health guides with GP vs. ED triage support and Census-data-driven local resource surfacing. |
| E3 | Health Habit Tracker | Must Have | Daily logging of sleep, meals, mood, hydration, and exercise with weekly trend dashboards and correlation insights. |
| E4 | Care Circle (Innovation) | Must Have | Opt-in ambient wellness snapshot shared with up to 3 trusted contacts. Community feed, care reactions, and crisis flag. |
| E5 | User Onboarding & Profiles | Must Have | Persona-adaptive onboarding capturing user type, location, and notification preferences. |
| E6 | Resource Localisation | Should Have | ABS Census suburb-level data pipeline surfaces bulk-billing GPs and health services relevant to the user's area. |
| E7 | Accessibility & Multilingual | Could Have | WCAG 2.1 AA compliance and multilingual support for common languages spoken by young adults in major Australian cities. |
| E8 | Security & Privacy | Must Have | AES-256 encryption, OWASP Top 10 compliance, JWT authentication, no PII in Care Circle, full data deletion on request. |

## **5.1 Detailed User Stories — Iteration 1 Must-Have Epics**

### **E1 — Health Reminder System**

| User Story | Acceptance Criteria (SMART) |
| :---- | :---- |
| US1.1: As Alex, I want to set a daily water intake reminder so that I don't forget to stay hydrated during long study sessions. | Given the user is logged in, when they set a water reminder at a chosen frequency, then the system delivers a browser notification at those intervals, and the reminder is stored and editable from the settings page within the same session. |
| US1.2: As Chloe, I want to receive a bedtime nudge so that I am reminded to wind down at an appropriate time. | Given the user has set a bedtime goal, when the system clock reaches 30 minutes before that time, then a contextual nudge is delivered in a warm, friendly tone (e.g. 'It is 10:30pm — time to wind down') and logged in the reminder history. |
| US1.3: As Jordan, I want to customise reminder types and timing so that the system adapts to my work schedule. | Given the user accesses reminder settings, when they configure reminder categories and preferred times, then changes are saved immediately, applied from the next scheduled notification, and reflected in the weekly summary. |

### **E2 — Guideline Article Library**

| User Story | Acceptance Criteria (SMART) |
| :---- | :---- |
| US2.1: As Alex, I want to access a GP vs. ED triage guide so that I can determine whether my symptoms need urgent care. | Given the user opens the article library, when they navigate to the triage section, then a decision-support tool is displayed that asks 3 to 5 symptom questions and returns a clear recommendation (e.g. 'Visit your GP within 48 hours') within 10 seconds of completing input. |
| US2.2: As Chloe, I want to find bulk-billing GPs near Clayton so that I know where to go for affordable care. | Given the user has granted location access or entered their suburb, when they search for GPs, then a list of at least 5 bulk-billing clinics within 5 km is displayed, sourced from ABS Census data and updated within the last quarter. |
| US2.3: As Jordan, I want to filter articles by topic (physical, mental, nutrition, social) so that I can quickly find relevant content. | Given the user is on the article library page, when they select a topic filter, then only articles matching that category are displayed within 2 seconds, and the active filter is visually indicated. |

### **E3 — Health Habit Tracker**

| User Story | Acceptance Criteria (SMART) |
| :---- | :---- |
| US3.1: As Alex, I want to log my daily mood using an emoji scale so that I can track how I am feeling without it feeling clinical. | Given the user opens the daily check-in, when they select a mood emoji and submit, then the entry is saved with a timestamp, displayed in the weekly trend chart, and confirmation is shown within 1 second. |
| US3.2: As Chloe, I want to see a weekly trend dashboard so that I can identify patterns in my sleep and eating habits. | Given the user has logged data for at least 3 days, when they view the weekly dashboard, then a line chart displays trends for each tracked category and at least one correlation insight is surfaced (e.g. 'You tend to feel better on days you sleep 7+ hours'). |
| US3.3: As Jordan, I want to export my wellness summary as a PDF so that I can share it with a GP or counsellor. | Given the user has at least one week of logged data, when they select Export Summary, then a PDF is generated within 5 seconds containing their habit logs, weekly averages, and trend chart, with no personally identifying information beyond their first name. |

### **E4 — Care Circle (Innovation Feature)**

| User Story | Acceptance Criteria (SMART) |
| :---- | :---- |
| US4.1: As Alex, I want to invite my mum (in Bendigo) to my Care Circle so that she can see I am doing okay without me having to call every day. | Given the user navigates to Care Circle settings, when they enter a contact's email address and send an invitation, then the contact receives an email within 5 minutes with an activation link that requires no account creation to view the wellness summary. |
| US4.2: As a Care Circle contact (Alex's mum), I want to see a simplified wellness score so that I am reassured without being alarmed by clinical data. | Given the contact has accepted the invitation, when they view the wellness summary, then they see a plain-language score (e.g. 'Alex is doing well this week') derived from habit tracker data, with no raw health logs, medical terms, or specific values displayed. |
| US4.3: As Alex, I want to receive a gentle prompt if my wellness score drops significantly so that I am encouraged to reach out before a crisis occurs. | Given the system detects a wellness score drop of 30% or more over 3 consecutive days, when this threshold is met, then the user receives a notification reading 'It looks like you have had a tough week — would you like to reach out to your Care Circle?' with options to send a message or dismiss. |

# **6\. Feature Descriptions**

## **Feature 1: Health Reminder System**

*Your digital housemate — checking in so no one else has to.*

| Attribute | Detail |
| :---- | :---- |
| **Description** | A personalised browser-based notification system delivering contextual nudges to maintain daily health routines. Replaces the informal reminders a parent or housemate would naturally provide. |
| **Sub-features** | Daily reminders for water, meals, sleep, and medication; contextual tone adapted by time of day; custom reminder creation; snooze/reschedule; smart scheduling based on user activity patterns; weekly adherence summary. |
| **Open Data Used** | User-set preferences and logged habit history. No external open data required for core reminder functionality. |
| **Innovation** | Nudges are phrased as warm, friendly check-ins — not clinical alerts. Tone adapts across user personas: gentle and reassuring for the overwhelmed first-year student, concise and data-forward for the productivity-focused young professional. |
| **Crisis Relevance** | Routine maintenance is the most effective form of crisis prevention. Users who maintain basic habits are significantly less likely to experience burnout or acute health episodes. |

## **Feature 2: Guideline Article Library**

*The handbook nobody gave you when you moved out.*

| Attribute | Detail |
| :---- | :---- |
| **Description** | A curated, searchable library of short health and life guides written specifically for young adults living independently for the first time. Content is practical, non-clinical, and friendly in tone. |
| **Sub-features** | Articles across four categories: Physical Health, Mental Wellbeing, Nutrition, and Social Connection; GP vs. ED triage decision support; search and filter by topic, reading time, and relevance; bookmarking; Census-data-informed local GP and bulk-billing service surfacing by suburb; short-read format (2–5 minutes) optimised for desktop and mobile browser. |
| **Open Data Used** | ABS Census data (suburb-level demographic and health service availability); AIHW health statistics; headspace and Beyond Blue open content guidelines. |
| **Innovation** | Unlike generic health websites, the library uses the user's location and Census demographic profile to surface locally relevant resources (e.g. bulk-billing GPs near Clayton shown specifically to students in that area). Triage guidance is framed in plain language for a first-time independent adult. |
| **Crisis Relevance** | Many young adults do not know whether a health issue warrants action. This feature closes that knowledge gap directly, reducing delayed care and unnecessary crisis escalation. |

## **Feature 3: Health Habit Tracker**

*Small habits, tracked daily, build the life you came here for.*

| Attribute | Detail |
| :---- | :---- |
| **Description** | A lightweight daily journaling tool allowing users to log key health habits and visualise wellness trends over time. Designed to build self-awareness without the pressure of a strict fitness or diet application. |
| **Sub-features** | Daily check-in for sleep hours, meals, exercise, mood, and hydration; emoji-based mood scale for low-friction entry; weekly trend dashboard across all categories; streak tracking and gentle encouragement; exportable wellness PDF summary; habit correlation insights (e.g. 'You tend to feel better on days you sleep 7+ hours'). |
| **Open Data Used** | User-generated data stored in PostgreSQL. AIHW benchmarks used to contextualise healthy ranges for 18–25 year olds. |
| **Innovation** | Habit correlation insights use pattern recognition across the user's own data to surface personalised, meaningful observations — turning raw logs into actionable self-knowledge. This is more motivating than generic external advice. |
| **Crisis Relevance** | Trend data surfaces early warning signals: a consistent decline in sleep, mood, or nutrition is a precursor to crisis. The tracker creates visibility before the crisis point is reached. |

## **Feature 4: Care Circle  \[Innovation Feature\]**

*You left home. Your support system didn't.*

| Attribute | Detail |
| :---- | :---- |
| **Description** | The Care Circle is Minuri's key differentiator. It is a privacy-respecting, opt-in feature allowing users to share a simplified wellness snapshot with up to 3 trusted contacts — a parent, sibling, or close friend back home. It recreates ambient oversight without surveillance or pressure, bridging the distance between the user and their support network. |
| **Sub-features** | Invite up to 3 trusted contacts; contacts receive a simplified, non-clinical wellness score; score auto-generated from habit tracker data; user controls what is shared and can revoke access at any time; anonymous community tip sharing on a city-level feed; care reactions — contacts can send supportive messages; crisis flag that gently prompts the user to reach out when their score drops significantly. |
| **Open Data Used** | Habit tracker data (aggregated into wellness score). ABS Census data used to match community feed posts to users in the same urban area. |
| **Innovation** | The Care Circle is ambient and passive — requiring no active reporting from the user. This is the core innovation: daily habit logs become a living signal that keeps loved ones informed without burdening the user with communication. No existing student health application offers this model. |
| **Crisis Relevance** | For users living alone without nearby family, this feature may be the only external check-in they receive. The crisis flag and Care Circle together create a safety net that catches deterioration before it becomes an emergency. |

# **7\. Open Data Strategy**

| Data Source | How It Is Used | Insight Provided |
| :---- | :---- | :---- |
| ABS Census 2021 | Suburb-level young adult population density. Used to tailor local health resource recommendations and validate persona demographics. | Hindsight: Identifies where high-density student/graduate populations live (Clayton, Parkville, CBD). Foresight: Growing student population means this cohort will expand. |
| AIHW National Health Survey | Youth health statistics (18–25). Used to contextualise AIHW healthy ranges displayed in the habit tracker and to evidence the problem statement. | Insight: Users need micro-interventions, not clinical tools. Lowering the threshold for help-seeking is more effective than replacing professional care. |
| ABS National Health Survey | Health conditions by age group (18–25 year olds living independently). Supports problem statement evidence. | Foresight: Continued urbanisation of young professionals means demand for crisis-prevention tools will increase. |
| Orygen / headspace | Youth mental health in university transition reports. Supports the problem statement and provides content basis for the article library. | Insight: Transition periods (starting university, starting first job) are the highest-risk windows for mental health deterioration. |

## **7.1 Entity-Relationship Diagram (ERD Overview)**

The following entity relationships underpin the Minuri data model:

| Entity | Relationships & Key Attributes |
| :---- | :---- |
| User | Has many HealthLogs, Reminders, Bookmarks, CareCircleLinks. Attributes: user\_id (PK), name, email, suburb, persona\_type, created\_at. |
| HealthLog | Belongs to User. Attributes: log\_id (PK), user\_id (FK), date, log\_type (sleep/meal/mood/exercise/hydration), value, created\_at. |
| WellnessScore | Aggregated from HealthLogs. Belongs to User. Attributes: score\_id (PK), user\_id (FK), week\_start, score\_value (0–100), computed\_at. |
| Reminder | Belongs to User. Attributes: reminder\_id (PK), user\_id (FK), type, time, frequency, is\_active, last\_sent. |
| Article | Tagged by category and suburb. Attributes: article\_id (PK), title, category, suburb\_tags\[\], source, reading\_time\_mins, content\_url. |
| CareCircleLink | Junction table: User (inviter) to Contact. Attributes: link\_id (PK), user\_id (FK), contact\_email, access\_token, is\_active, created\_at. |
| GPResource | Linked to ABS Census suburb data. Attributes: gp\_id (PK), name, address, suburb, postcode, bulk\_billing (bool), phone, last\_verified. |

# **8\. System Architecture**

| Layer | Technology & Rationale |
| :---- | :---- |
| Frontend | React (TypeScript) — component-based SPA. Tailwind CSS for styling. Axios for API communication. Vite as build tool. Responsive design supporting desktop and mobile browsers. |
| Backend | FastAPI (Python) — high-performance REST API. Pydantic for data validation. Async endpoints for scalable concurrent user handling. |
| Database | PostgreSQL — relational database for structured health data. SQLAlchemy ORM. Alembic for schema migrations. |
| Authentication | JWT (JSON Web Tokens) with OAuth 2.0 (Google Sign-In). Refresh token rotation. Role-based access control (User, CareCircleContact). |
| Hosting | Frontend: Vercel (CDN-deployed, automatic HTTPS). Backend: Railway or AWS EC2. Database: Supabase (managed PostgreSQL). Media/exports: AWS S3. |
| Notifications | Web Push API (browser-native notifications) via Service Worker. No third-party push service required for Iteration 1\. |
| Open Data Pipeline | ABS Census CSV data ingested via Python ETL script into PostgreSQL GPResource table. Refreshed quarterly. PostGIS extension for suburb-level proximity queries. |

## **8.1 High-Level System Diagram (Description)**

The system follows a standard three-tier web architecture:

* User Browser (Client) — React SPA served via Vercel CDN. Communicates with the backend via authenticated HTTPS REST calls. Service Worker handles web push notifications.

* Application Layer (Backend) — FastAPI server hosted on Railway/AWS. Handles all business logic including wellness score computation, Care Circle access control, ABS Census data queries, and reminder scheduling.

* Data Layer — PostgreSQL database (Supabase) stores all user, health log, reminder, article, and Care Circle data. AWS S3 stores exported PDF wellness summaries.

* External Data — ABS Census CSV files are ingested via a scheduled ETL pipeline and stored in the GPResource table. No live ABS API dependency during runtime.

# **9\. Colour Palette & Design System**

## **9.1 Brand Rationale**

Minuri's visual identity is built on a teal-to-ocean spectrum, deliberately chosen to convey calm, trust, and health without the clinical coldness of blue-dominant healthcare design. The palette avoids harsh reds (associated with alerts and danger) as a primary colour, reserving coral exclusively for the Care Circle innovation feature and crisis-related states — ensuring it remains visually meaningful and not overused.

The 'sandwich' structure — dark ocean backgrounds for hero and title sections, light fog/white for content, with teal accents — creates depth and hierarchy without requiring gradients or drop shadows, keeping the UI performant and clean.

## **9.2 Primary Palette**

|  | Name | Hex | Usage |
| :---- | :---- | :---- | :---- |
|  | **Minuri Teal** | \#028090 | Primary brand colour. CTAs, buttons, navigation bar, section headers, and interactive elements. |
|  | **Deep Ocean** | \#0D2B35 | Title sections, hero backgrounds, dark header/footer bands. Creates premium depth. |
|  | **Mid Teal** | \#1C5461 | Secondary surfaces, table header backgrounds, sidebar accents. Sits between Teal and Ocean. |
|  | **Seafoam** | \#00A896 | Highlight accents, active states, Care Circle elements, success indicators. |

## **9.3 Supporting Palette**

|  | Name | Hex | Usage |
| :---- | :---- | :---- | :---- |
|  | **Alert Coral** | \#E05C5C | Innovation badge, crisis flag notifications, and warning states ONLY. Do not use decoratively. |
|  | **Mist** | \#E8F6F8 | Light teal-tinted card backgrounds, hover states, and subtle surface highlights. |
|  | **Fog** | \#F0F4F5 | Slide and page backgrounds, alternating table rows, neutral content surfaces. |
|  | **Pure White** | \#FFFFFF | Card bodies, modal backgrounds, and primary content areas. |

## **9.4 Text & Neutral Palette**

|  | Name | Hex | Usage |
| :---- | :---- | :---- | :---- |
|  | **Slate** | \#4A6572 | Primary body text on light backgrounds. Warm grey with teal undertone — softer than black. |
|  | **Pale Teal** | \#80C8D0 | Muted text and labels on dark (ocean/teal) backgrounds. |
|  | **Ice** | \#A8D5DC | Secondary text and descriptions on dark backgrounds. Lighter than Pale Teal. |
|  | **Silver Teal** | \#C8D8DC | Borders, dividers, table outlines, and subtle visual separators. |

## **9.5 Typography**

| Element | Font | Size | Weight | Color |
| :---- | :---- | :---- | :---- | :---- |
| Page / Section Title | Inter / Calibri | 32–40px | 700 Bold | Deep Ocean |
| Heading 2 / Module Title | Inter / Calibri | 24–28px | 600 SemiBold | Minuri Teal |
| Heading 3 / Card Title | Inter / Calibri | 18–22px | 600 SemiBold | Mid Teal |
| Body Text | Inter / Calibri | 15–16px | 400 Regular | Slate |
| Caption / Label | Inter / Calibri | 12–13px | 500 Medium | Pale Teal / Slate |
| Code / Hex Values | JetBrains Mono / Courier New | 13px | 400 Regular | Minuri Teal |

## **9.6 Design Principles**

* **Flat & Clean:** No gradients, drop shadows, or noise textures. All depth is achieved through colour contrast and whitespace.

* **Teal-forward:** Teal (\#028090) anchors every page. All other colours serve as supporting tones or semantic signals.

* **Alert Coral is sacred:** Coral (\#E05C5C) appears only for the Care Circle innovation badge and crisis/warning states. Never use it decoratively.

* **Content sandwich:** Dark ocean backgrounds for hero/title sections; light fog or white for content; teal accents throughout. This creates hierarchy without heaviness.

* **Mobile-first but web-primary:** Minuri is a responsive webapp. Layouts are designed for 1280px desktop with graceful degradation to 390px mobile browser.

* **Accessibility:** All colour pairings maintain a minimum 4.5:1 contrast ratio (WCAG 2.1 AA). Interactive elements have a minimum touch/click target of 44x44px.

# **10\. Code Quality Plan**

| Measure | Implementation |
| :---- | :---- |
| Linting & Formatting | ESLint (Airbnb config) \+ Prettier for the React frontend. Ruff \+ Black for the FastAPI backend. Pre-commit hooks enforce standards before every commit. |
| Unit Testing | Pytest for FastAPI endpoints (business logic, wellness score computation, authentication). React Testing Library for frontend component tests. Minimum 70% coverage target for Iteration 1 Must-Have features. |
| Integration Testing | Postman collection for all REST API endpoints. Tests run against a local Docker environment mirroring production. Test cases derived directly from LeanKit acceptance criteria. |
| CI/CD Pipeline | GitHub Actions: automated linting, testing, and build validation on every pull request to main. Deployment to Vercel (frontend) and Railway (backend) is automatic on merge to main after all checks pass. |
| Code Reviews | Mandatory peer review required before any merge to main. Reviewers check: correctness, test coverage, security considerations, and adherence to team coding standards. |
| Documentation | All FastAPI endpoints documented via auto-generated OpenAPI (Swagger UI). React components documented with JSDoc comments. README maintained with setup, environment variables, and deployment instructions. |
| Database Migrations | Alembic manages all PostgreSQL schema changes. Migrations are versioned, reviewed, and applied as part of the CI/CD pipeline. No manual schema changes in production. |

# **11\. Security Plan**

| Security Domain | Measures Implemented |
| :---- | :---- |
| Data Encryption | All user health data encrypted at rest using AES-256. All API communication over HTTPS with TLS 1.3. Database connections encrypted via SSL. AWS S3 bucket server-side encryption enabled for exported PDFs. |
| Authentication & Authorisation | JWT-based authentication with short-lived access tokens (15 minutes) and refresh token rotation. OAuth 2.0 via Google Sign-In. Role-based access control: User role and CareCircleContact role (view-only, no login required). |
| OWASP Top 10 Compliance | SQL injection prevention via SQLAlchemy parameterised queries. XSS prevention via React's DOM sanitisation and strict CSP headers. CSRF protection via SameSite cookies and CORS whitelist. Rate limiting on all authentication endpoints (10 requests/minute). |
| Care Circle Privacy | No personally identifiable information (PII) is shared with Care Circle contacts. Only aggregated, plain-language wellness scores are exposed. Contact access is time-limited and revocable by the user at any time. Access tokens are single-use on first activation. |
| Penetration Testing | OWASP ZAP automated API endpoint scanning integrated into the CI/CD pipeline. Manual pen test report to be completed for MCS component before Iteration 2 submission. Findings documented in the Security Aspects folder of the Project Governance Portfolio. |
| Data Deletion | Users can request full account and data deletion at any time via the settings page. Deletion cascade removes all HealthLogs, WellnessScores, Reminders, and CareCircleLinks. Care Circle contacts are notified of access revocation within 24 hours. |
| Audit Logging | All authentication events (login, logout, failed attempts) and Care Circle access events are logged with timestamp and IP address. Logs retained for 90 days and not accessible to end users. |

# **12\. Iteration 1 Plan**

Iteration 1 delivers the core Must-Have epics that establish Minuri's primary value proposition: proactive health habit support and the foundational Care Circle feature. The build will be deployed to the production URL prior to the due date and will not be changed post-submission.

| Epic | Feature | Iteration 1 Deliverable |
| :---- | :---- | :---- |
| E1 | Health Reminder System | Functional reminder creation, scheduling, browser notification delivery, snooze/reschedule, and weekly adherence summary. All acceptance criteria from US1.1, US1.2, US1.3 met and tested. |
| E2 | Guideline Article Library | Searchable article library with category filtering, GP vs. ED triage decision tool, and ABS Census-powered local GP finder (Clayton and Parkville suburbs for Iteration 1 scope). Acceptance criteria from US2.1, US2.2, US2.3 met. |
| E3 | Health Habit Tracker | Daily check-in form (sleep, meals, mood, exercise, hydration), weekly trend dashboard with basic correlation insights, streak tracking, and PDF export. Acceptance criteria from US3.1, US3.2, US3.3 met. |
| E4 | Care Circle | Contact invitation flow (email delivery), view-only wellness score page for contacts (no account required), user revocation control, and crisis flag notification. Acceptance criteria from US4.1, US4.2, US4.3 met. |
| E5 | Onboarding & Profiles | Persona-adaptive onboarding (3 user type selections), suburb capture, notification preference setup, and profile edit page. |
| E8 | Security & Privacy | JWT authentication, Google OAuth, AES-256 at-rest encryption, HTTPS enforcement, CORS whitelist, rate limiting, and full account deletion flow. |

## **12.1 Sprint Details**

| Attribute | Detail |
| :---- | :---- |
| **Sprint Duration** | 3 weeks (Weeks 3 to 5\) |
| **Delivery Mode** | Agile — weekly standups, LeanKit board updated continuously, mentor review in studio Week 5 |
| **Definition of Done** | Feature implemented, unit-tested (\>70% coverage), peer-reviewed, deployed to production URL, and all LeanKit acceptance criteria verified by at least one team member who did not write the code |
| **Production URL** | To be confirmed and locked prior to Iteration 1 submission — will not change across iterations |
| **Archive URL** | Iteration 1 build will be preserved at archive URL when Iteration 2 development begins |
| **Testing Strategy** | Developer unit tests (Pytest / React Testing Library) \+ team acceptance testing against LeanKit criteria \+ usability testing session recorded for mentor review |

# **13\. Risk Register**

| ID | Level | Risk | Mitigation Strategy |
| :---- | :---- | :---- | :---- |
| R1 | HIGH | User privacy & health data sensitivity — breach of personal health logs could cause serious harm. | AES-256 encryption at rest and in transit. No PII shared to Care Circle. OWASP ZAP pen testing each iteration. Full user data deletion on request. Audit logs retained 90 days. |
| R2 | HIGH | Medical accuracy of triage and article library content — incorrect advice could cause harm. | All content reviewed against AIHW and headspace published guidelines. Explicit disclaimer on every article and triage output: 'This is not a substitute for professional medical advice.' No diagnosis functionality. |
| R3 | MED | ABS Census data lag — Census runs on 5-year cycle; GP availability data may be outdated. | Supplement with near-real-time GP finder APIs where available. Flag data currency to users. Prioritise 2021 Census data and incorporate 2026 updates when released. |
| R4 | MED | Low user engagement and notification fatigue — users may disable reminders or disengage. | Smart scheduling, snooze/reschedule functionality, and contextual tone adaptation. A/B test nudge messaging in Iteration 2\. Onboarding frequency preferences captured upfront. |
| R5 | LOW | Scope creep across 6 epics in Iteration 1\. | Strict MoSCoW prioritisation in LeanKit. Fortnightly scope review with academic mentor. Any additions must be approved and reflected in LeanKit before development begins. |
| R6 | LOW | Care Circle contact data handling — contacts view wellness data without creating an account. | Contacts identified only by email. Access token is single-use on first activation, then session-bound. Contact access is revocable at any time. No contact data stored beyond email and activation token. |

# **14\. Potential Sponsors**

| Organisation | Relevance | Alignment with Minuri |
| :---- | :---- | :---- |
| headspace — National Youth Mental Health Foundation | Australia's leading youth mental health organisation, operating 150+ centres nationally and funding digital wellbeing tools. | Direct alignment with under-25 mental health and crisis prevention. headspace already funds digital tools for young Australians. Care Circle and crisis flag features align with their community resilience mandate. |
| Medibank / Bupa — Private Health Insurers | Major private health insurers with strategic interest in preventative health and young adult member acquisition. | Integrating Minuri into student health plans or young professional packages adds measurable preventative value and reduces long-term claim costs. Preventative health is a declared strategic priority for both insurers. |
| Universities Australia — Peak Body for Australian Universities | Represents 39 Australian universities and advocates for student wellbeing as a regulatory and reputational priority. | Minuri directly addresses university duty-of-care obligations for domestic students, particularly those relocating from regional areas. The student personas, local GP finder, and Care Circle feature are purpose-built for the university context. |

# **15\. References**

1. Australian Bureau of Statistics. (2021). 2021 Census of Population and Housing. Canberra: ABS. Retrieved from https://www.abs.gov.au/census

2. Australian Institute of Health and Welfare. (2023). Young Australians: Their health and wellbeing. Canberra: AIHW. Retrieved from https://www.aihw.gov.au

3. Australian Institute of Health and Welfare. (2024). National Health Survey: First results. Canberra: AIHW.

4. Orygen. (2023). Transitions: A mental health guide for young people entering university. Melbourne: Orygen. Retrieved from https://www.orygen.org.au

5. Beyond Blue & headspace. (2024). University student mental health report. Melbourne.

6. ABC News. (2024, September 3). Young Australians moving to the city for work are burning out faster than ever. abc.net.au. Retrieved from https://www.abc.net.au

7. ABC News. (2024, September 3). Burnout among young professionals is rising — and they are not seeking help. abc.net.au. Retrieved from https://www.abc.net.au

8. The Guardian Australia. (2024, February 8). Regional students at Melbourne universities face hidden wellbeing crisis. theguardian.com. Retrieved from https://www.theguardian.com/australia

9. Open Web Application Security Project (OWASP). (2021). OWASP Top Ten. Retrieved from https://owasp.org/www-project-top-ten

10. World Health Organization. (2023). Sustainable Development Goal 3: Good Health and Wellbeing. Retrieved from https://www.who.int/sdg