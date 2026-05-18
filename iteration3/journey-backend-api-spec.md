# Journey API — Backend Spec

## Endpoint

`POST /journey`

---

## Request (unchanged)

```json
{
  "suburb": "Fitzroy",
  "your_moment": "I just moved out of home for the first time...",
  "selected_topics": ["home-admin", "food-eating"]
}
```

---

## Response (simplified)

`week_plan` is removed. Frontend handles the week plan statically based on archetype.

```json
{
  "identity": {
    "archetype": "first-timer",
    "vibe": {
      "name": "Laneway Gold",
      "hex": "#E9C46A"
    },
    "letter_body": "You arrived without a manual, which is how most people arrive...",
    "suburb_line": "Fitzroy: your new corner of Melbourne."
  }
}
```

---

## Field spec

### `archetype`

Exactly one of four string values. Assign by reading `your_moment`:

| Value | Assign when `your_moment` suggests... |
|-------|--------------------------------------|
| `first-timer` | Never lived independently before. Overwhelmed by basic adulting. Doesn't know how systems work. |
| `far-from-home` | Family or friends are far away. Emotional weight of distance is the central experience. May have practical things sorted but feels the separation. |
| `solo-arrival` | Moved here knowing absolutely no one. Social isolation is the primary anxiety. |
| `reluctant-grownup` | Didn't fully choose this — life moved them here (uni, job, circumstance). Uncertain, not fully committed to being here yet. |

Default to `first-timer` if unclear.

---

### `vibe`

| Field | Description |
|-------|-------------|
| `name` | Short evocative colour name — e.g. `"Laneway Gold"`, `"Still Morning"`, `"Deep Teal"` |
| `hex` | Matching hex code |

Should reflect the emotional tone of `your_moment` — warm/cool, bright/muted. Not random. A nervous, quiet moment → muted cool. An excited but overwhelmed moment → warm amber.

---

### `letter_body`

- 3–5 sentences, second person ("You arrived…")
- Acknowledges where they are emotionally right now
- References `suburb` by name at least once
- Does **not** give advice or list tasks — that is the week plan's job
- Warm and honest — not cheerful, not motivational-poster-y

Tone guide per archetype:

| Archetype | Letter tone |
|-----------|-------------|
| `first-timer` | Reassure about capability. Normalise not knowing things. Make the unknown feel manageable, not scary. |
| `far-from-home` | Acknowledge the distance honestly. Don't minimise it or rush to silver linings. Let them feel seen first. |
| `solo-arrival` | Validate starting from zero as an act of courage, not a failure. Make the blank slate feel like potential. |
| `reluctant-grownup` | Validate ambivalence. Don't push positivity. It's okay to be uncertain and still build something. |

---

### `suburb_line`

One short sentence. Examples:

- `"Fitzroy: your new corner of Melbourne."`
- `"Brunswick is a good place to figure things out."`
- `"Footscray doesn't wait for you to be ready."`

---

## What to remove

Stop generating `week_plan` entirely. Remove all LLM prompting for:

- `days`
- `theme` / `short_label` / `narrative` per day
- `guides` (slug arrays)
- `tasks`
- `memory_line` / `stamp_label`

The frontend selects a pre-written 7-day plan based on the returned `archetype`. No week plan logic needed on the backend.

---

## Archetype assignment examples

| `your_moment` excerpt | Archetype |
|-----------------------|-----------|
| "I just moved out of home for the first time, I don't really know how rent works" | `first-timer` |
| "I moved from Brisbane and my whole family is still there" | `far-from-home` |
| "I came here for a job and I don't know a single person in the city" | `solo-arrival` |
| "I kind of ended up here — my uni offer came through and I just went with it" | `reluctant-grownup` |
| "It's my first time living alone, everything feels a bit overwhelming" | `first-timer` |
| "I moved from Vietnam six months ago and I'm still finding my feet" | `far-from-home` |
