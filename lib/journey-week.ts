import { GUIDES, type Guide, type GuideTopicSlug } from "@/content/guides";
import type { NearMeTopic } from "@/lib/near-me";

export type DayPlan = {
    day: number;
    theme: string;
    shortLabel: string;
    topicSlug: GuideTopicSlug;
    narrative: string;
    guides: Guide[];
    tasks: string[];
};

export const TOPIC_NEAR_ME: Record<GuideTopicSlug, NearMeTopic> = {
    "food-eating": "food-eating",
    "getting-around": "getting-around",
    "health-wellbeing": "health-wellbeing",
    "home-admin": "home-admin",
    "social-belonging": "social-belonging",
};

const TOPIC_SHORT: Record<GuideTopicSlug, string> = {
    "food-eating": "Food",
    "getting-around": "Transport",
    "health-wellbeing": "Health",
    "home-admin": "Admin",
    "social-belonging": "Connect",
};

const TOPIC_THEME: Record<GuideTopicSlug, string> = {
    "food-eating": "Food & Eating",
    "getting-around": "Getting Around",
    "health-wellbeing": "Health & Wellbeing",
    "home-admin": "Home & Admin",
    "social-belonging": "Social & Belonging",
};

export function getTopicTheme(slug: GuideTopicSlug) {
    return TOPIC_THEME[slug];
}

export function getTopicShort(slug: GuideTopicSlug) {
    return TOPIC_SHORT[slug];
}

// Checklist items shown in onboarding
export const ALREADY_SORTED_ITEMS = [
    { id: "myki", label: "Myki card" },
    { id: "gp", label: "GP registered" },
    { id: "bank", label: "Bank account" },
    { id: "sim", label: "SIM card" },
    { id: "lease", label: "Lease signed" },
] as const;

// Guide slugs to skip when a checklist item is ticked
const ALREADY_SORTED_SKIP: Record<string, string[]> = {
    myki: ["getting-myki-and-surviving-ptv"],
    gp: ["finding-a-gp-before-you-need-one"],
    bank: [],
    sim: [],
    lease: ["renting-without-getting-burned", "your-bond-starts-on-day-one"],
};

const GUIDE_NARRATIVES: Partial<Record<string, string>> = {
    "your-first-48-hours-checklist":
        "Today is about reducing friction. Your only job is to handle the essentials that make tomorrow easier — shelter, food, phone, a way to get around. Don't try to do everything. Just do the things that buy you stability.",
    "your-bond-starts-on-day-one":
        "The photos you take today are worth more than any bond dispute resolution later. Ten minutes of documentation now protects months of your rent money.",
    "renting-without-getting-burned":
        "Your lease is the foundation of everything else. Understanding what you've signed — and what you're entitled to — means you can protect yourself before something goes wrong.",
    "budgeting-on-what-you-actually-earn":
        "A budget isn't a punishment. It's a picture of where your money goes so you can make better choices. Today you build one from what you're actually earning.",
    "setting-up-utilities-without-overpaying":
        "Electricity and internet are set-and-forget — until you're paying too much. Today you set them up right the first time.",
    "super-and-your-first-paycheck":
        "Superannuation is the retirement money you start building now. Understanding it before your first paycheck means you don't miss the window.",
    "tenant-rights-when-things-go-wrong":
        "Knowing your rights before something goes wrong changes what you can do when it does. Think of today's guide as an insurance policy you don't pay for.",
    "getting-myki-and-surviving-ptv":
        "Today you become mobile. Getting your Myki sorted means Melbourne opens up to you. Thirty minutes of setup buys months of confidence in the city.",
    "finding-your-way-around-melbourne-in-week-one":
        "You don't need to know the whole city. You need to know your five most important locations and how to get between them. That's this week's goal.",
    "night-transport-and-getting-home-safe":
        "Knowing how to get home safe at night is one of those things you only value when you need it. Today you plan for the version of yourself that needs it.",
    "building-a-local-routine":
        "Routine is what turns a new city into home. Today you identify the recurring patterns that will make Melbourne feel familiar.",
    "cycling-melbourne-without-fear":
        "Melbourne has great cycling infrastructure if you know where to look. Today you plan one safe route that makes sense for your life.",
    "finding-a-gp-before-you-need-one":
        "Register for a GP while you're healthy — it takes ten calm minutes. You'll never have to do it sick and panicked. Today's task protects future you.",
    "crisis-lines-you-can-actually-call":
        "You may never need these numbers. Save them anyway. Knowing they exist changes the shape of a hard night.",
    "emergency-vs-urgent-care-in-melbourne":
        "Knowing the difference between an emergency and urgent care saves you money and time. Five minutes today, potential hours saved later.",
    "medicare-bulk-billing-and-mental-health-care-plans":
        "Medicare is what makes Australian healthcare affordable. Understanding how to use it — and your Mental Health Care Plan — is worth doing before you need it.",
    "managing-your-prescriptions-in-a-new-city":
        "If you take regular medication, today's task is non-negotiable. Getting your scripts sorted takes one GP visit done right.",
    "your-pharmacist-is-the-cheapest-first-stop":
        "Your pharmacist can answer most minor health questions for free. Knowing where they are and what they can help with is a low-effort, high-return investment.",
    "when-to-see-a-psych-counsellor-or-friend":
        "Mental health support works best when it's set up before you're struggling. Today you make sure you know your options before you need them.",
    "sustaining-yourself-sleep-movement-and-disconnecting":
        "Sustainable independence starts with sleep, movement, and time to disconnect. Today you identify what's already working — and one thing worth building on.",
    "your-first-grocery-run":
        "Your kitchen is your cheapest support system. One good grocery run sets you up for the week — and knowing where the supermarket is makes everything feel a little less foreign.",
    "cheap-eats-when-broke":
        "Eating well on a tight budget is about knowing where to look. Today's task: map your three cheapest reliable options within 20 minutes of home.",
    "cooking-5-meals-youll-actually-eat":
        "Five meals you actually eat reliably is worth more than ten recipes you abandon. Today you build the shortlist.",
    "meal-prepping-on-a-tight-budget":
        "One prep session on Sunday changes the entire week. Today you set up a system that makes eating well automatic — not a daily decision.",
    "finding-free-community-meals":
        "Community meals exist in every suburb and most people who need them never know. Today you find yours before you ever need them.",
    "when-you-dont-know-anyone-yet":
        "You don't need a lot of people right away. You need one comfortable place and one reliable small connection. That's today's goal.",
    "surviving-the-first-weekend-alone":
        "The first weekend alone in a new city is the most common trigger for a crisis of confidence. Today you plan it before it arrives.",
    "homesickness-nobody-warns-you-about":
        "Homesickness isn't weakness. It's the cost of moving somewhere that matters. Today you give it some space and a name.",
    "making-friends-in-a-city-where-everyones-busy":
        "Friendship in a new city requires two things: repeated exposure and low-pressure settings. Today you find one recurring option that fits your life.",
    "finding-your-community":
        "You came from somewhere. Finding a community here that shares your language, values, or interests is worth the effort. Today you start looking.",
    "free-things-to-do-this-week":
        "Some of the best things Melbourne offers are free. Today you find one. That's the whole task.",
    "volunteering-as-a-way-in":
        "Volunteering is one of the most efficient ways to meet people with shared values while doing something that matters. Today you explore what's near you.",
};

// A single concrete action sentence per guide
const GUIDE_TASKS: Partial<Record<string, string>> = {
    "your-first-48-hours-checklist":
        "Complete at least 3 items from today's checklist before you sleep.",
    "your-first-grocery-run":
        "Walk to your nearest supermarket and buy ingredients for 3 simple meals.",
    "cheap-eats-when-broke":
        "Save your 3 cheapest nearby meal options in your phone maps right now.",
    "cooking-5-meals-youll-actually-eat":
        "Write down 5 meals you can reliably cook and buy the ingredients for one.",
    "meal-prepping-on-a-tight-budget":
        "Block 2 hours this Sunday in your calendar for a single meal-prep session.",
    "finding-free-community-meals":
        "Find one free community meal near your suburb and note the day and time.",
    "getting-myki-and-surviving-ptv":
        "Buy a Myki card at a 7-Eleven or station today and top it up with $20.",
    "finding-your-way-around-melbourne-in-week-one":
        "Add your 5 most-used locations to your phone maps and plan a route between them.",
    "night-transport-and-getting-home-safe":
        "Find the last train and last tram from your nearest station and save them.",
    "cycling-melbourne-without-fear":
        "Plan one safe cycling route near you using the Melways cycle path map.",
    "building-a-local-routine":
        "Write down one recurring weekly thing — a walk, a market, a café — and add it to your calendar.",
    "finding-a-gp-before-you-need-one":
        "Book a GP appointment online today — even if you feel completely fine.",
    "crisis-lines-you-can-actually-call":
        "Save 1800 512 348 (Beyond Blue) in your phone right now.",
    "emergency-vs-urgent-care-in-melbourne":
        "Find the nearest urgent care clinic to your home and save its address.",
    "medicare-bulk-billing-and-mental-health-care-plans":
        "Check your Medicare eligibility and confirm your GP bulk-bills.",
    "managing-your-prescriptions-in-a-new-city":
        "Request repeat prescriptions at your first GP visit and note the pharmacy closest to you.",
    "your-pharmacist-is-the-cheapest-first-stop":
        "Walk into your nearest pharmacy and introduce yourself — ask about their free advice service.",
    "when-to-see-a-psych-counsellor-or-friend":
        "Find one free counselling option near you (headspace, uni, or community) and save the number.",
    "sustaining-yourself-sleep-movement-and-disconnecting":
        "Pick one thing — a 20-minute walk, a phone-free hour, or a consistent sleep time — and commit to it this week.",
    "renting-without-getting-burned":
        "Read your lease tonight and highlight any clause you don't understand.",
    "your-bond-starts-on-day-one":
        "Take 20 timestamped photos of your room today and email them to yourself.",
    "budgeting-on-what-you-actually-earn":
        "List your monthly income and your 5 biggest recurring expenses right now.",
    "setting-up-utilities-without-overpaying":
        "Compare two electricity plans on the Victorian Energy Compare website and pick one.",
    "super-and-your-first-paycheck":
        "Check if your employer has enrolled you in super — and pick your own fund if not.",
    "tenant-rights-when-things-go-wrong":
        "Save the VCAT tenancy hotline (1300 906 380) and note one right you have as a renter.",
    "when-you-dont-know-anyone-yet":
        "Find one regular local thing — a class, a market, a run club — and put the next date in your calendar.",
    "surviving-the-first-weekend-alone":
        "Plan Saturday now: one outdoor activity and one meal out, even if you go alone.",
    "homesickness-nobody-warns-you-about":
        "Write one paragraph about what you miss and one about what you're looking forward to.",
    "making-friends-in-a-city-where-everyones-busy":
        "Find one low-pressure recurring social option near you and sign up or bookmark it.",
    "finding-your-community":
        "Search for one group that shares your language, culture, or interest in Melbourne and save the details.",
    "free-things-to-do-this-week":
        "Find one free event or place in Melbourne this week and add it to your calendar.",
    "volunteering-as-a-way-in":
        "Browse Seek Volunteer and save one opportunity that fits your schedule.",
};

const ARC_PRIORITY = { "day-1": 0, "week-1": 1, "month-1": 2 } as const;

// Boost guide slugs based on keywords in the user's moment text
function getKeywordBoosts(moment: string): Set<string> {
    const lower = moment.toLowerCase();
    const boosts = new Set<string>();

    if (/international|overseas|arrived|arrival|new to australia/i.test(lower)) {
        boosts.add("medicare-bulk-billing-and-mental-health-care-plans");
        boosts.add("getting-myki-and-surviving-ptv");
    }
    if (/budget|broke|afford|tight|cheap|money/i.test(lower)) {
        boosts.add("cheap-eats-when-broke");
        boosts.add("budgeting-on-what-you-actually-earn");
        boosts.add("finding-free-community-meals");
    }
    if (/alone|by myself|no one|nobody|lonely|don't know anyone/i.test(lower)) {
        boosts.add("when-you-dont-know-anyone-yet");
        boosts.add("surviving-the-first-weekend-alone");
    }
    if (/uni|student|university|study|campus|tafe/i.test(lower)) {
        boosts.add("medicare-bulk-billing-and-mental-health-care-plans");
        boosts.add("cheap-eats-when-broke");
    }
    if (/anxious|overwhelmed|stressed|mental|crisis|scared/i.test(lower)) {
        boosts.add("crisis-lines-you-can-actually-call");
        boosts.add("when-to-see-a-psych-counsellor-or-friend");
    }

    return boosts;
}

// Deliberate 7-day arc: fixed structure, user's choices fill days 3–4
function buildArcTopics(selectedTopics: GuideTopicSlug[]): GuideTopicSlug[] {
    const allTopics: GuideTopicSlug[] = [
        "food-eating",
        "getting-around",
        "health-wellbeing",
        "home-admin",
        "social-belonging",
    ];

    // User's chosen priorities for days 3–4, falling back to remaining topics
    const remaining = allTopics.filter(
        (t) =>
            !["food-eating", "home-admin", "health-wellbeing", "social-belonging"].includes(t) &&
            !selectedTopics.includes(t),
    );

    const priority1 = selectedTopics[0] ?? remaining[0] ?? "getting-around";
    const priority2 =
        selectedTopics[1] ??
        selectedTopics[0] ??
        remaining[0] ??
        "getting-around";

    return [
        "food-eating",      // Day 1: survival basics
        "home-admin",       // Day 2: admin foundation
        priority1,          // Day 3: user's first chosen priority
        priority2,          // Day 4: user's second chosen priority
        "health-wellbeing", // Day 5: health baseline
        "social-belonging", // Day 6: community anchor
        "getting-around",   // Day 7: build your routine
    ];
}

const ARC_THEMES: Record<number, { theme: string; shortLabel: string }> = {
    1: { theme: "Survival Basics", shortLabel: "Survive" },
    2: { theme: "Admin Foundation", shortLabel: "Admin" },
    5: { theme: "Health Baseline", shortLabel: "Health" },
    6: { theme: "Community", shortLabel: "Connect" },
    7: { theme: "Build Your Routine", shortLabel: "Routine" },
};

export function buildWeekPlan(
    selectedTopics: GuideTopicSlug[],
    yourMoment = "",
    alreadySorted: string[] = [],
): DayPlan[] {
    const allTopics: GuideTopicSlug[] = [
        "food-eating",
        "getting-around",
        "health-wellbeing",
        "home-admin",
        "social-belonging",
    ];

    const skipSlugs = new Set(
        alreadySorted.flatMap((item) => ALREADY_SORTED_SKIP[item] ?? []),
    );
    const boostedSlugs = getKeywordBoosts(yourMoment);

    // Build per-topic guide queues sorted by boost → arc priority → arcOrder
    const topicQueues = new Map<GuideTopicSlug, Guide[]>();
    for (const topic of allTopics) {
        const guides = [...GUIDES]
            .filter((g) => g.isPublished && g.topic === topic && !skipSlugs.has(g.slug))
            .sort((a, b) => {
                const aBoosted = boostedSlugs.has(a.slug) ? 0 : 1;
                const bBoosted = boostedSlugs.has(b.slug) ? 0 : 1;
                if (aBoosted !== bBoosted) return aBoosted - bBoosted;
                if (a.arc !== b.arc) return ARC_PRIORITY[a.arc] - ARC_PRIORITY[b.arc];
                return a.arcOrder - b.arcOrder;
            });
        topicQueues.set(topic, guides);
    }

    const arcTopics = buildArcTopics(selectedTopics);
    const usedSlugs = new Set<string>();
    const days: DayPlan[] = [];

    for (let dayIdx = 0; dayIdx < arcTopics.length; dayIdx++) {
        const dayNum = dayIdx + 1;
        const topicSlug = arcTopics[dayIdx];

        const available = (topicQueues.get(topicSlug) ?? []).filter(
            (g) => !usedSlugs.has(g.slug),
        );
        if (available.length === 0) continue;

        const guides = available.slice(0, 3);
        for (const g of guides) usedSlugs.add(g.slug);

        const override = ARC_THEMES[dayNum];
        const narrative = GUIDE_NARRATIVES[guides[0].slug] ?? guides[0].summary ?? "";
        const tasks = guides
            .map((g) => GUIDE_TASKS[g.slug] ?? "")
            .filter(Boolean);

        days.push({
            day: dayNum,
            theme: override?.theme ?? TOPIC_THEME[topicSlug],
            shortLabel: override?.shortLabel ?? TOPIC_SHORT[topicSlug],
            topicSlug,
            narrative,
            guides,
            tasks,
        });
    }

    return days;
}
