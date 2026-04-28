# Minuri Iteration 2 — Epics, User Stories, and Acceptance Criteria

## Epic Card 1 — Landing

### User Story Card 1.1 — New user orientation

- **User Story:** As a first-time Minuri user, I want to see clear entry points on the landing page so that I can quickly choose where to start.
- **Weight:**
  - **Effort:** 3
  - **Difficulty:** 2
  - **Uncertainty:** 2
  - **Total:** 7
- **Acceptance Criteria (AC 1.1):**  
**Given** I am visiting Minuri for the first time,  
**When** I open the landing page,  
**Then** I can see at least one clearly labeled starting option,  
**And** selecting it takes me to the relevant feature section.

### User Story Card 1.2 — Returning user continuation

- **User Story:** As a returning Minuri user, I want the landing page to surface my next recommended action so that I can continue my journey without re-discovering content.
- **Weight:**
  - **Effort:** 4
  - **Difficulty:** 3
  - **Uncertainty:** 3
  - **Total:** 10
- **Acceptance Criteria (AC 1.2):**  
**Given** I have previous activity saved,  
**When** I return to the landing page,  
**Then** I can see a personalized continue action,  
**And** clicking it resumes from my latest relevant step.

## Epic Card 2 — Guides

### User Story Card 2.1 — Narrative guide readability

- **User Story:** As a user reading guides, I want every guide to follow the same easy-to-scan structure so that I can quickly understand what to do now, what to do next, and where to get help.
- **Weight:**
  - **Effort:** 3
  - **Difficulty:** 3
  - **Uncertainty:** 2
  - **Total:** 8
  - **Why this score (brief):** Medium work to standardize multiple guides (**Effort 3**), moderate complexity in maintaining consistent quality and CTA mapping (**Difficulty 3**), and relatively clear scope with limited unknowns (**Uncertainty 2**).
- **Acceptance Criteria (AC 2.1):**  
**Given** I open any guide in Iteration 2,  
**When** the guide content loads,  
**Then** I can see these sections in order with headings:  
  1. `Why this matters`  
  2. `What to do now`  
  3. `What to expect`  
  4. `When to get urgent help` (if applicable)  
  5. `Your next step`
  **And** each section includes at least one concrete, action-focused sentence (for example: call, book, ask, save, or check),  
  **And** no section contains unexplained jargon or acronyms,  
  **And** the final `Your next step` section includes one primary CTA that links to a relevant Minuri destination (Near Me, Journey, or a related guide).

### User Story Card 2.2 — Guide-to-action bridge

- **User Story:** As a user finishing a guide, I want a direct bridge to related support tools so that I can take immediate action from what I just read.
- **Weight:**
  - **Effort:** 4
  - **Difficulty:** 3
  - **Uncertainty:** 3
  - **Total:** 10
- **Acceptance Criteria (AC 2.2):**  
**Given** I am at the end of a guide,  
**When** I click the guide bridge call-to-action,  
**Then** I am taken to a relevant destination linked to that guide topic,  
**And** the destination is pre-filtered to match the guide context.

## Epic Card 3 — Near Me

### User Story Card 3.1 — Topic-based local discovery

- **User Story:** As a user exploring Near Me, I want local services grouped by clear topics so that I can find the right place faster.
- **Weight:**
  - **Effort:** 3
  - **Difficulty:** 3
  - **Uncertainty:** 2
  - **Total:** 8
- **Acceptance Criteria (AC 3.1):**  
**Given** I open the Near Me feature,  
**When** I choose a topic tab,  
**Then** I see locations relevant to that topic,  
**And** I can switch topics without losing the core Near Me context.

### User Story Card 3.2 — Save useful locations

- **User Story:** As a user who finds a useful service in Near Me, I want to save the location so that I can return to it later from my journey.
- **Weight:**
  - **Effort:** 4
  - **Difficulty:** 2
  - **Uncertainty:** 3
  - **Total:** 9
- **Acceptance Criteria (AC 3.2):**  
**Given** I am viewing a location result in Near Me,  
**When** I tap save on that location,  
**Then** the location is added to my saved list,  
**And** I can access it again in a later session.

