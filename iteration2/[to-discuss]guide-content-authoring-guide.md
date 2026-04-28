# Minuri Guide Content Authoring Guide

Use this guide when creating a new guide JSON file under `public/guides-content/<topic>/`.

The goal is consistency: every guide should load correctly, follow the same narrative shape, and link cleanly to the next guide.

## 1) File location and naming

- Create the file in: `public/guides-content/<topic-slug>/`
- File name must match `slug` exactly: `<slug>.json`
- Example:
  - Path: `public/guides-content/health-wellbeing/finding-a-gp-before-you-need-one.json`
  - Slug: `finding-a-gp-before-you-need-one`

## 2) Allowed taxonomy values

### Topic (`topic`)

Must be one of:

- `food-eating`
- `getting-around`
- `health-wellbeing`
- `home-admin`
- `social-belonging`

### Arc (`arc`)

Must be one of:

- `day-1`
- `week-1`
- `month-1`

### Section keys (`sections[].sectionKey`)

Must appear in this exact sequence:

1. `moment`
2. `feeling`
3. `reveal`
4. `how-it-works`
5. `bridge`
6. `next-chapter`

## 3) Guides matrix (current catalog)

Use this matrix to avoid ID collisions, keep `arcOrder` coherent, and set `nextGuideSlug` correctly.

| ID | Arc | Arc Order | Topic | Slug | Next Guide Slug |
| --- | --- | --- | --- | --- | --- |
| 1 | day-1 | 1 | food-eating | `your-first-grocery-run` | `getting-myki-and-surviving-ptv` |
| 2 | month-1 | 1 | food-eating | `cheap-eats-when-broke` | `renting-without-getting-burned` |
| 3 | day-1 | 2 | getting-around | `getting-myki-and-surviving-ptv` | `finding-a-gp-before-you-need-one` |
| 4 | day-1 | 3 | health-wellbeing | `finding-a-gp-before-you-need-one` | `crisis-lines-you-can-actually-call` |
| 5 | day-1 | 4 | health-wellbeing | `crisis-lines-you-can-actually-call` | `your-first-48-hours-checklist` |
| 6 | month-1 | 2 | home-admin | `renting-without-getting-burned` | `building-a-local-routine` |
| 7 | week-1 | 4 | health-wellbeing | `medicare-bulk-billing-and-mental-health-care-plans` | `managing-your-prescriptions-in-a-new-city` |
| 8 | week-1 | 3 | home-admin | `budgeting-on-what-you-actually-earn` | `medicare-bulk-billing-and-mental-health-care-plans` |
| 9 | week-1 | 2 | home-admin | `setting-up-utilities-without-overpaying` | `budgeting-on-what-you-actually-earn` |
| 10 | week-1 | 1 | food-eating | `cooking-5-meals-youll-actually-eat` | `setting-up-utilities-without-overpaying` |
| 11 | week-1 | 7 | social-belonging | `making-friends-in-a-city-where-everyones-busy` | `null` |
| 12 | month-1 | 5 | social-belonging | `homesickness-nobody-warns-you-about` | `when-to-see-a-psych-counsellor-or-friend` |
| 13 | month-1 | 4 | social-belonging | `finding-your-community` | `homesickness-nobody-warns-you-about` |
| 14 | month-1 | 6 | health-wellbeing | `when-to-see-a-psych-counsellor-or-friend` | `sustaining-yourself-sleep-movement-and-disconnecting` |
| 15 | month-1 | 3 | getting-around | `building-a-local-routine` | `finding-your-community` |
| 16 | week-1 | 5 | health-wellbeing | `managing-your-prescriptions-in-a-new-city` | `finding-your-way-around-melbourne-in-week-one` |
| 17 | month-1 | 7 | health-wellbeing | `sustaining-yourself-sleep-movement-and-disconnecting` | `null` |
| 18 | day-1 | 5 | home-admin | `your-first-48-hours-checklist` | `when-you-dont-know-anyone-yet` |
| 19 | day-1 | 6 | social-belonging | `when-you-dont-know-anyone-yet` | `null` |
| 20 | week-1 | 6 | getting-around | `finding-your-way-around-melbourne-in-week-one` | `making-friends-in-a-city-where-everyones-busy` |

## 4) Required JSON fields

Every guide JSON must include these fields:

- `id` (number) - unique ID across all guides
- `slug` (string) - kebab-case identifier
- `title` (string) - guide title shown in UI
- `summary` (string) - short card summary
- `arc` (enum) - `day-1 | week-1 | month-1`
- `arcOrder` (number) - order within that arc
- `topic` (enum) - one of the five topic slugs
- `readingTimeMin` (number) - estimated reading minutes
- `isPublished` (boolean)
- `isFeatured` (boolean)
- `markdownPath` (string) - URL path to this JSON file
- `nextGuideSlug` (string or null) - slug of next guide in flow
- `searchTerms` (string[]) - search keywords
- `sourceLinks` ({ `label`, `href` }[]) - references (can be empty)
- `thumbnailUrl` (string) - card image URL
- `nearMeDeeplink` (string) - deep link for action CTA
- `sections` (array of 6 objects; structure below)

## 5) Section object shape

Each section must follow:

```json
{
  "sectionKey": "moment",
  "title": "The Moment",
  "value": "Your content here"
}
```

Notes:

- `value` supports plain text and markdown (including line breaks and lists).
- Keep the six sections present even if some are brief.

## 6) Copy template (ready to paste)

```json
{
  "id": 999,
  "slug": "replace-with-slug",
  "title": "Replace with Title",
  "summary": "One-line summary of practical outcome.",
  "arc": "day-1",
  "arcOrder": 1,
  "topic": "health-wellbeing",
  "readingTimeMin": 5,
  "isPublished": true,
  "isFeatured": false,
  "markdownPath": "/guides-content/health-wellbeing/replace-with-slug.json",
  "nextGuideSlug": null,
  "searchTerms": ["keyword 1", "keyword 2"],
  "sourceLinks": [
    {
      "label": "Official Source Name",
      "href": "https://example.com"
    }
  ],
  "thumbnailUrl": "https://picsum.photos/seed/minuri-replace-with-slug/640/420",
  "nearMeDeeplink": "/near-me?topic=health-wellbeing&from=replace-with-slug",
  "sections": [
    {
      "sectionKey": "moment",
      "title": "The Moment",
      "value": ""
    },
    {
      "sectionKey": "feeling",
      "title": "The Feeling",
      "value": ""
    },
    {
      "sectionKey": "reveal",
      "title": "What nobody told you",
      "value": ""
    },
    {
      "sectionKey": "how-it-works",
      "title": "How it actually works",
      "value": ""
    },
    {
      "sectionKey": "bridge",
      "title": "When you're ready",
      "value": ""
    },
    {
      "sectionKey": "next-chapter",
      "title": "Up next",
      "value": ""
    }
  ]
}
```

## 7) Writing expectations by section

- `moment`: Open with a concrete scenario the reader recognizes.
- `feeling`: Name the emotional friction plainly.
- `reveal`: One core insight only (do not split into multiple reveals).
- `how-it-works`: Practical steps, checks, caveats, and exact tools/services.
- `bridge`: Clear action that maps to `nearMeDeeplink`.
- `next-chapter`: Tease next guide; keep tone forward-moving.

## 8) Implementation checklist (important)

After creating the JSON file:

1. Import it in `content/guides.ts`.
2. Add it to the `GUIDE_FILES` array.
3. Verify `id` is unique.
4. Verify `slug` and file name match exactly.
5. Verify `topic`, `arc`, and section keys use allowed enums.
6. Verify `nextGuideSlug` points to an existing guide slug (or `null` for end).
7. Verify `nearMeDeeplink` topic and `from` slug are correct.

If steps 1-2 are skipped, the guide file exists but will not appear in the app.
