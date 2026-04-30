import { GUIDES, type Guide, type GuideTopicSlug } from "@/content/guides";
import type { NearMeTopic } from "@/lib/near-me";

export type DayPlan = {
    day: number;
    theme: string;
    shortLabel: string;
    topicSlug: GuideTopicSlug;
    narrative: string;
    guides: Guide[];
};

export const TOPIC_NEAR_ME: Record<GuideTopicSlug, NearMeTopic> = {
    "food-eating": "survive",
    "getting-around": "get-around",
    "health-wellbeing": "health",
    "home-admin": "setup",
    "social-belonging": "connect",
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

const ARC_PRIORITY = { "day-1": 0, "week-1": 1, "month-1": 2 } as const;

export function buildWeekPlan(selectedTopics: GuideTopicSlug[]): DayPlan[] {
    const allTopics: GuideTopicSlug[] = [
        "food-eating",
        "getting-around",
        "health-wellbeing",
        "home-admin",
        "social-belonging",
    ];

    // Topics in priority order: selected first, then remainder
    const topicOrder: GuideTopicSlug[] = [
        ...selectedTopics,
        ...allTopics.filter((t) => !selectedTopics.includes(t)),
    ];

    // Sort all guides by topic priority → arc → arcOrder
    const sortedGuides = [...GUIDES]
        .filter((g) => g.isPublished)
        .sort((a, b) => {
            const ai = topicOrder.indexOf(a.topic);
            const bi = topicOrder.indexOf(b.topic);
            if (ai !== bi) return ai - bi;
            if (a.arc !== b.arc)
                return ARC_PRIORITY[a.arc] - ARC_PRIORITY[b.arc];
            return a.arcOrder - b.arcOrder;
        });

    // Build topic queues
    const topicQueues = new Map<GuideTopicSlug, Guide[]>();
    for (const topic of topicOrder) {
        topicQueues.set(
            topic,
            sortedGuides.filter((g) => g.topic === topic),
        );
    }

    const usedSlugs = new Set<string>();
    const days: DayPlan[] = [];
    let cycleIdx = 0;

    for (let dayIdx = 0; dayIdx < 7; dayIdx++) {
        // Find the next topic that still has unused guides
        let dayTopic: GuideTopicSlug | null = null;
        for (let attempt = 0; attempt < topicOrder.length; attempt++) {
            const candidate = topicOrder[cycleIdx % topicOrder.length];
            const available = (topicQueues.get(candidate) ?? []).filter(
                (g) => !usedSlugs.has(g.slug),
            );
            if (available.length > 0) {
                dayTopic = candidate;
                break;
            }
            cycleIdx++;
        }

        if (!dayTopic) break;

        const available = (topicQueues.get(dayTopic) ?? []).filter(
            (g) => !usedSlugs.has(g.slug),
        );
        const dayGuides = available.slice(0, 2);
        dayGuides.forEach((g) => usedSlugs.add(g.slug));

        const primary = dayGuides[0];
        const narrative =
            GUIDE_NARRATIVES[primary?.slug ?? ""] ?? primary?.summary ?? "";

        days.push({
            day: dayIdx + 1,
            theme: TOPIC_THEME[dayTopic],
            shortLabel: TOPIC_SHORT[dayTopic],
            topicSlug: dayTopic,
            narrative,
            guides: dayGuides,
        });

        cycleIdx++;
    }

    return days;
}
