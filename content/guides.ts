export type GuideTopicSlug =
    | "food-eating"
    | "getting-around"
    | "health-wellbeing"
    | "home-admin"
    | "social-belonging";

export type GuideArcSlug = "week-1" | "month-1" | "month-3";

export type NarrativeSectionKey =
    | "moment"
    | "feeling"
    | "reveal"
    | "how-it-works"
    | "bridge"
    | "next-chapter";

export type GuideTopic = {
    slug: GuideTopicSlug;
    name: string;
    sortOrder: number;
};

export type GuideArc = {
    slug: GuideArcSlug;
    name: string;
    timeframeLabel: string;
    sortOrder: number;
};

export type GuideSection = {
    sectionKey: NarrativeSectionKey;
    title: string;
    body: string[];
};

export type Guide = {
    id: number;
    slug: string;
    title: string;
    thumbnailUrl: string;
    summary: string;
    arc: GuideArcSlug;
    arcOrder: number;
    topic: GuideTopicSlug;
    readingTimeMin: 2 | 3 | 4 | 5;
    isPublished: boolean;
    isFeatured: boolean;
    nearMeDeeplink: string;
    nextGuideSlug: string | null;
    searchTerms: string[];
    sections: GuideSection[];
    sourceLinks: { label: string; href: string }[];
};

export const GUIDE_TOPICS: GuideTopic[] = [
    { slug: "food-eating", name: "Food & Eating", sortOrder: 1 },
    { slug: "getting-around", name: "Getting Around", sortOrder: 2 },
    { slug: "health-wellbeing", name: "Health & Wellbeing", sortOrder: 3 },
    { slug: "home-admin", name: "Home & Admin", sortOrder: 4 },
    { slug: "social-belonging", name: "Social & Belonging", sortOrder: 5 },
];

export const GUIDE_ARCS: GuideArc[] = [
    {
        slug: "week-1",
        name: "You Just Moved In",
        timeframeLabel: "Week 1",
        sortOrder: 1,
    },
    {
        slug: "month-1",
        name: "Getting Set Up",
        timeframeLabel: "Month 1",
        sortOrder: 2,
    },
    {
        slug: "month-3",
        name: "Finding Your Rhythm",
        timeframeLabel: "Month 3",
        sortOrder: 3,
    },
];

function bridge(topic: GuideTopicSlug, slug: string) {
    const params = new URLSearchParams({
        topic,
        from: slug,
    });

    return `/near-me?${params.toString()}`;
}

function createGuide(input: Omit<Guide, "nearMeDeeplink" | "thumbnailUrl">): Guide {
    return {
        ...input,
        thumbnailUrl: `https://picsum.photos/seed/minuri-${input.slug}/640/420`,
        nearMeDeeplink: bridge(input.topic, input.slug),
    };
}

const SOURCES = {
    studyMelbourneTransport:
        "https://studymelbourne.vic.gov.au/living-here/transport/guide-to-public-transportation",
    youthCentralRenting:
        "https://www.youthcentral.vic.gov.au/housing/renting-and-sharehousing/signing-lease",
    tenantsVic: "https://tenantsvic.org.au",
    headspace: "https://headspace.org.au",
    healthdirect: "https://www.healthdirect.gov.au",
    vicroads: "https://www.vicroads.vic.gov.au",
    ato: "https://www.ato.gov.au",
} as const;

export const GUIDES: Guide[] = [
    createGuide({
        id: 1,
        slug: "your-first-grocery-run",
        title: "Your First Grocery Run",
        summary: "Build a low-stress first-week food system without overspending.",
        arc: "week-1",
        arcOrder: 1,
        topic: "food-eating",
        readingTimeMin: 4,
        isPublished: true,
        isFeatured: true,
        nextGuideSlug: "cheap-eats-when-broke",
        searchTerms: ["grocery", "budget", "woolworths", "coles", "aldi"],
        sourceLinks: [],
        sections: [
            {
                sectionKey: "moment",
                title: "The Moment",
                body: [
                    "Day two. You are standing in a supermarket aisle with no reliable price memory and no food plan.",
                ],
            },
            {
                sectionKey: "feeling",
                title: "The Feeling",
                body: [
                    "You are not confused about food. You are overloaded by decisions without context.",
                ],
            },
            {
                sectionKey: "reveal",
                title: "The Reveal",
                body: [
                    "You can eat well in your first week with a tiny repeat list. Brand familiarity is not the same as value.",
                ],
            },
            {
                sectionKey: "how-it-works",
                title: "How It Actually Works",
                body: [
                    "Start with 10-12 essentials you can combine into 3 meals. Use unit pricing, not packaging size.",
                    "Pick one supermarket for routine shopping and one backup store for low-stock days.",
                ],
            },
            {
                sectionKey: "bridge",
                title: "The Bridge",
                body: ["When you're ready, find supermarkets and markets near you."],
            },
            {
                sectionKey: "next-chapter",
                title: "Next Chapter",
                body: [
                    "Next: Cheap Eats When You're Broke - for nights when cooking is not realistic.",
                ],
            },
        ],
    }),
    createGuide({
        id: 2,
        slug: "cheap-eats-when-broke",
        title: "Cheap Eats When You're Broke",
        summary: "Keep food quality up even when cash flow is tight.",
        arc: "week-1",
        arcOrder: 2,
        topic: "food-eating",
        readingTimeMin: 3,
        isPublished: true,
        isFeatured: false,
        nextGuideSlug: "getting-myki-and-surviving-ptv",
        searchTerms: ["cheap eats", "budget meals", "food court", "banh mi"],
        sourceLinks: [],
        sections: [
            {
                sectionKey: "moment",
                title: "The Moment",
                body: ["Week two. You have $30 left and still need meals until payday."],
            },
            {
                sectionKey: "feeling",
                title: "The Feeling",
                body: ["Money stress follows every menu decision and makes every option feel wrong."],
            },
            {
                sectionKey: "reveal",
                title: "The Reveal",
                body: ["Melbourne has a deep low-cost food ecosystem if you know where to look."],
            },
            {
                sectionKey: "how-it-works",
                title: "How It Actually Works",
                body: [
                    "Build a fallback list: 3 cheap lunch spots, 2 dinner options, and 1 emergency late-night stop.",
                    "Tie your list to routes you already travel so choices are easy when tired.",
                ],
            },
            {
                sectionKey: "bridge",
                title: "The Bridge",
                body: ["When you're ready, find budget-friendly cafes and restaurants near you."],
            },
            {
                sectionKey: "next-chapter",
                title: "Next Chapter",
                body: [
                    "Next: Getting a Myki & Surviving PTV - so transport does not eat your budget.",
                ],
            },
        ],
    }),
    createGuide({
        id: 3,
        slug: "getting-myki-and-surviving-ptv",
        title: "Getting a Myki & Surviving PTV",
        summary: "Learn the minimum transport system knowledge to move confidently.",
        arc: "week-1",
        arcOrder: 3,
        topic: "getting-around",
        readingTimeMin: 4,
        isPublished: true,
        isFeatured: true,
        nextGuideSlug: "finding-a-gp-before-you-need-one",
        searchTerms: ["myki", "ptv", "tram", "train", "free tram zone"],
        sourceLinks: [{ label: "Study Melbourne transport guide", href: SOURCES.studyMelbourneTransport }],
        sections: [
            {
                sectionKey: "moment",
                title: "The Moment",
                body: ["First commute. Everyone taps through and you are still decoding zones and platforms."],
            },
            {
                sectionKey: "feeling",
                title: "The Feeling",
                body: ["Public transport feels simple for everyone else and chaotic for you."],
            },
            {
                sectionKey: "reveal",
                title: "The Reveal",
                body: ["Most first-week transport stress disappears once one recurring route is stable."],
            },
            {
                sectionKey: "how-it-works",
                title: "How It Actually Works",
                body: [
                    "Set up Myki, save your top-up pattern, and rehearse your most important weekly route.",
                    "Use the Free Tram Zone and cap rules to avoid unnecessary spending.",
                ],
            },
            {
                sectionKey: "bridge",
                title: "The Bridge",
                body: ["When you're ready, find stations, tram stops, and top-up points near you."],
            },
            {
                sectionKey: "next-chapter",
                title: "Next Chapter",
                body: ["Next: Finding a GP Before You Need One - before a bad day becomes a crisis."],
            },
        ],
    }),
    createGuide({
        id: 4,
        slug: "finding-a-gp-before-you-need-one",
        title: "Finding a GP Before You Need One",
        summary: "Set up healthcare before your first urgent morning.",
        arc: "week-1",
        arcOrder: 4,
        topic: "health-wellbeing",
        readingTimeMin: 4,
        isPublished: true,
        isFeatured: false,
        nextGuideSlug: "crisis-lines-you-can-actually-call",
        searchTerms: ["gp", "doctor", "bulk billing", "healthdirect"],
        sourceLinks: [{ label: "Healthdirect", href: SOURCES.healthdirect }],
        sections: [
            {
                sectionKey: "moment",
                title: "The Moment",
                body: ["You wake up sick and realize your home doctor is hundreds of kilometers away."],
            },
            {
                sectionKey: "feeling",
                title: "The Feeling",
                body: ["Healthcare becomes real only when you need it now."],
            },
            {
                sectionKey: "reveal",
                title: "The Reveal",
                body: ["You can prepare healthcare in one calm hour before you ever need urgent care."],
            },
            {
                sectionKey: "how-it-works",
                title: "How It Actually Works",
                body: [
                    "Pick a nearby clinic, check bulk-billing policy, store contact details, and verify after-hours options.",
                    "Bring identity and Medicare details to your first registration appointment.",
                ],
            },
            {
                sectionKey: "bridge",
                title: "The Bridge",
                body: ["When you're ready, find bulk-billing clinics and pharmacies near you."],
            },
            {
                sectionKey: "next-chapter",
                title: "Next Chapter",
                body: ["Next: Crisis Lines You Can Actually Call - support before things escalate."],
            },
        ],
    }),
    createGuide({
        id: 5,
        slug: "crisis-lines-you-can-actually-call",
        title: "Crisis Lines You Can Actually Call",
        summary: "Know who to call and what happens when you do.",
        arc: "week-1",
        arcOrder: 5,
        topic: "health-wellbeing",
        readingTimeMin: 3,
        isPublished: true,
        isFeatured: false,
        nextGuideSlug: "renting-without-getting-burned",
        searchTerms: ["lifeline", "mental health", "support lines"],
        sourceLinks: [],
        sections: [
            {
                sectionKey: "moment",
                title: "The Moment",
                body: ["It is late, everything is heavy, and you do not know if your situation is serious enough to call."],
            },
            {
                sectionKey: "feeling",
                title: "The Feeling",
                body: ["Asking for urgent support can feel like crossing an invisible line."],
            },
            {
                sectionKey: "reveal",
                title: "The Reveal",
                body: ["You do not need to wait for a worst-case scenario before calling."],
            },
            {
                sectionKey: "how-it-works",
                title: "How It Actually Works",
                body: [
                    "Keep three support options saved in your phone by purpose: immediate crisis, ongoing support, and text-based support.",
                    "Make the first call before exhaustion decides for you.",
                ],
            },
            {
                sectionKey: "bridge",
                title: "The Bridge",
                body: ["When you're ready, find mental health support services and safe places near you."],
            },
            {
                sectionKey: "next-chapter",
                title: "Next Chapter",
                body: ["Next: Renting Without Getting Burned - the practical systems phase starts now."],
            },
        ],
    }),
    createGuide({
        id: 6,
        slug: "renting-without-getting-burned",
        title: "Renting Without Getting Burned",
        summary: "Reduce rental friction by understanding what actually protects you.",
        arc: "month-1",
        arcOrder: 1,
        topic: "home-admin",
        readingTimeMin: 5,
        isPublished: true,
        isFeatured: true,
        nextGuideSlug: "medicare-bulk-billing-and-mental-health-care-plans",
        searchTerms: ["lease", "bond", "condition report", "rights"],
        sourceLinks: [{ label: "Youth Central renting", href: SOURCES.youthCentralRenting }],
        sections: [
            {
                sectionKey: "moment",
                title: "The Moment",
                body: ["At inspection four, everyone else has a folder and a system, and you do not."],
            },
            {
                sectionKey: "feeling",
                title: "The Feeling",
                body: ["The rental process feels biased toward people who already know hidden rules."],
            },
            {
                sectionKey: "reveal",
                title: "The Reveal",
                body: ["Your rental application is a product package. Presentation changes outcomes."],
            },
            {
                sectionKey: "how-it-works",
                title: "How It Actually Works",
                body: [
                    "Prepare one reusable bundle: IDs, income proof, references, and a short cover note.",
                    "Document condition reports early and verify bond lodgement to protect future disputes.",
                ],
            },
            {
                sectionKey: "bridge",
                title: "The Bridge",
                body: ["When you're ready, find rental support and admin services near you."],
            },
            {
                sectionKey: "next-chapter",
                title: "Next Chapter",
                body: ["Next: Medicare, Bulk-Billing & Mental Health Care Plans - your health admin layer."],
            },
        ],
    }),
    createGuide({
        id: 7,
        slug: "medicare-bulk-billing-and-mental-health-care-plans",
        title: "Medicare, Bulk-Billing & Mental Health Care Plans",
        summary: "Understand the health admin terms that unlock affordable support.",
        arc: "month-1",
        arcOrder: 2,
        topic: "health-wellbeing",
        readingTimeMin: 5,
        isPublished: true,
        isFeatured: false,
        nextGuideSlug: "budgeting-on-what-you-actually-earn",
        searchTerms: ["medicare", "bulk billing", "mhcp"],
        sourceLinks: [{ label: "Healthdirect", href: SOURCES.healthdirect }],
        sections: [
            { sectionKey: "moment", title: "The Moment", body: ["The clinic asks for details you meant to set up weeks ago."] },
            { sectionKey: "feeling", title: "The Feeling", body: ["Health admin procrastination turns into pressure quickly."] },
            { sectionKey: "reveal", title: "The Reveal", body: ["A short setup can save months of avoidable health costs."] },
            {
                sectionKey: "how-it-works",
                title: "How It Actually Works",
                body: [
                    "Complete enrolment, confirm eligibility, and ask your GP when a care plan is appropriate.",
                    "Keep your healthcare details in one note so urgent visits stay simple.",
                ],
            },
            { sectionKey: "bridge", title: "The Bridge", body: ["When you're ready, find GPs and mental health services near you."] },
            { sectionKey: "next-chapter", title: "Next Chapter", body: ["Next: Budgeting on What You Actually Earn - because admin and money are linked."] },
        ],
    }),
    createGuide({
        id: 8,
        slug: "budgeting-on-what-you-actually-earn",
        title: "Budgeting on What You Actually Earn",
        summary: "Build a realistic weekly money system for Melbourne costs.",
        arc: "month-1",
        arcOrder: 3,
        topic: "home-admin",
        readingTimeMin: 4,
        isPublished: true,
        isFeatured: false,
        nextGuideSlug: "setting-up-utilities-without-overpaying",
        searchTerms: ["budget", "weekly spending", "rent", "cost of living"],
        sourceLinks: [],
        sections: [
            { sectionKey: "moment", title: "The Moment", body: ["End of month one and your spending does not match your memory."] },
            { sectionKey: "feeling", title: "The Feeling", body: ["You feel careful, but your system still leaks."] },
            { sectionKey: "reveal", title: "The Reveal", body: ["A weekly rhythm beats a monthly guess for early independence."] },
            {
                sectionKey: "how-it-works",
                title: "How It Actually Works",
                body: [
                    "Split costs into fixed essentials and weekly flex spending, then review on the same day every week.",
                    "Keep one protected buffer category so every surprise does not become debt.",
                ],
            },
            { sectionKey: "bridge", title: "The Bridge", body: ["When you're ready, find banks and support services near you."] },
            { sectionKey: "next-chapter", title: "Next Chapter", body: ["Next: Setting Up Utilities Without Overpaying - your biggest fixed-cost tune-up."] },
        ],
    }),
    createGuide({
        id: 9,
        slug: "setting-up-utilities-without-overpaying",
        title: "Setting Up Utilities Without Overpaying",
        summary: "Avoid default-plan traps in power, internet, and essential services.",
        arc: "month-1",
        arcOrder: 4,
        topic: "home-admin",
        readingTimeMin: 4,
        isPublished: true,
        isFeatured: false,
        nextGuideSlug: "cooking-5-meals-youll-actually-eat",
        searchTerms: ["utilities", "electricity", "internet", "energy compare"],
        sourceLinks: [],
        sections: [
            { sectionKey: "moment", title: "The Moment", body: ["A surprisingly high bill arrives before you know your plan type."] },
            { sectionKey: "feeling", title: "The Feeling", body: ["Utilities feel fixed and non-negotiable when they are not."] },
            { sectionKey: "reveal", title: "The Reveal", body: ["Default plans are convenience products, not value products."] },
            {
                sectionKey: "how-it-works",
                title: "How It Actually Works",
                body: [
                    "Compare providers once, set calendar reminders for annual checks, and record account numbers in one secure place.",
                    "Check usage versus supply charges to avoid false savings assumptions.",
                ],
            },
            { sectionKey: "bridge", title: "The Bridge", body: ["When you're ready, find home and utility service touchpoints near you."] },
            { sectionKey: "next-chapter", title: "Next Chapter", body: ["Next: Cooking 5 Meals You'll Actually Eat - stable routines make budgets sustainable."] },
        ],
    }),
    createGuide({
        id: 10,
        slug: "cooking-5-meals-youll-actually-eat",
        title: "Cooking 5 Meals You'll Actually Eat",
        summary: "Use a repeatable meal system instead of collecting random recipes.",
        arc: "month-1",
        arcOrder: 5,
        topic: "food-eating",
        readingTimeMin: 3,
        isPublished: true,
        isFeatured: false,
        nextGuideSlug: "making-friends-in-a-city-where-everyones-busy",
        searchTerms: ["meal prep", "cooking for one", "shopping list"],
        sourceLinks: [],
        sections: [
            { sectionKey: "moment", title: "The Moment", body: ["Your fridge keeps filling with ingredients you never finish."] },
            { sectionKey: "feeling", title: "The Feeling", body: ["You are exhausted by deciding what to cook every evening."] },
            { sectionKey: "reveal", title: "The Reveal", body: ["You need a system of five repeat meals, not endless variety."] },
            {
                sectionKey: "how-it-works",
                title: "How It Actually Works",
                body: [
                    "Pick five recipes with overlapping ingredients and one prep day.",
                    "Optimize for low-effort execution on tired weekdays, not ideal weekends.",
                ],
            },
            { sectionKey: "bridge", title: "The Bridge", body: ["When you're ready, find supermarkets and food markets near you."] },
            { sectionKey: "next-chapter", title: "Next Chapter", body: ["Next: Making Friends in a City Where Everyone's Busy - routine creates room for people."] },
        ],
    }),
    createGuide({
        id: 11,
        slug: "making-friends-in-a-city-where-everyones-busy",
        title: "Making Friends in a City Where Everyone's Busy",
        summary: "Turn repeated contact into real social momentum.",
        arc: "month-3",
        arcOrder: 1,
        topic: "social-belonging",
        readingTimeMin: 5,
        isPublished: true,
        isFeatured: true,
        nextGuideSlug: "homesickness-nobody-warns-you-about",
        searchTerms: ["friendship", "community", "meetup", "third place"],
        sourceLinks: [{ label: "Headspace", href: SOURCES.headspace }],
        sections: [
            { sectionKey: "moment", title: "The Moment", body: ["You have met people, but none of those chats turned into actual friendships."] },
            { sectionKey: "feeling", title: "The Feeling", body: ["You are social but still feel socially unanchored."] },
            { sectionKey: "reveal", title: "The Reveal", body: ["Friendship is repetition plus low-pressure follow-up, not one perfect event."] },
            {
                sectionKey: "how-it-works",
                title: "How It Actually Works",
                body: [
                    "Engineer repeat proximity with recurring groups and a shared weekly slot.",
                    "Convert good conversations into lightweight next plans quickly.",
                ],
            },
            { sectionKey: "bridge", title: "The Bridge", body: ["When you're ready, find clubs, groups, and community spaces near you."] },
            { sectionKey: "next-chapter", title: "Next Chapter", body: ["Next: The Homesickness Nobody Warns You About - when connection is growing but grief remains."] },
        ],
    }),
    createGuide({
        id: 12,
        slug: "homesickness-nobody-warns-you-about",
        title: "The Homesickness Nobody Warns You About",
        summary: "Understand the delayed homesickness phase and respond with structure.",
        arc: "month-3",
        arcOrder: 2,
        topic: "social-belonging",
        readingTimeMin: 4,
        isPublished: true,
        isFeatured: false,
        nextGuideSlug: "finding-your-community",
        searchTerms: ["homesickness", "loneliness", "relocation"],
        sourceLinks: [],
        sections: [
            { sectionKey: "moment", title: "The Moment", body: ["A warm call with home ends and your room feels suddenly unfamiliar again."] },
            { sectionKey: "feeling", title: "The Feeling", body: ["You are functioning, but there is an ache that keeps returning."] },
            { sectionKey: "reveal", title: "The Reveal", body: ["Homesickness often peaks after novelty fades, not when you first arrive."] },
            {
                sectionKey: "how-it-works",
                title: "How It Actually Works",
                body: [
                    "Use scheduled contact, local rituals, and one ongoing community thread.",
                    "Avoid living only in digital memory loops of home.",
                ],
            },
            { sectionKey: "bridge", title: "The Bridge", body: ["When you're ready, find community and cultural groups near you."] },
            { sectionKey: "next-chapter", title: "Next Chapter", body: ["Next: Finding Your Community - turning connection into belonging infrastructure."] },
        ],
    }),
    createGuide({
        id: 13,
        slug: "finding-your-community",
        title: "Finding Your Community",
        summary: "Build durable belonging by joining structures, not just events.",
        arc: "month-3",
        arcOrder: 3,
        topic: "social-belonging",
        readingTimeMin: 5,
        isPublished: true,
        isFeatured: false,
        nextGuideSlug: "when-to-see-a-psych-counsellor-or-friend",
        searchTerms: ["community centres", "volunteering", "clubs"],
        sourceLinks: [],
        sections: [
            { sectionKey: "moment", title: "The Moment", body: ["You want more than occasional plans; you want a stable social net."] },
            { sectionKey: "feeling", title: "The Feeling", body: ["Friendships help, but you still lack a wider sense of place."] },
            { sectionKey: "reveal", title: "The Reveal", body: ["Belonging grows faster in recurring groups with shared roles."] },
            {
                sectionKey: "how-it-works",
                title: "How It Actually Works",
                body: [
                    "Choose one high-frequency group and commit to showing up at least three times.",
                    "Prefer environments with contribution opportunities over passive attendance.",
                ],
            },
            { sectionKey: "bridge", title: "The Bridge", body: ["When you're ready, find community centres and volunteer groups near you."] },
            { sectionKey: "next-chapter", title: "Next Chapter", body: ["Next: When to See a Psych vs a Counsellor vs a Friend - support matching matters."] },
        ],
    }),
    createGuide({
        id: 14,
        slug: "when-to-see-a-psych-counsellor-or-friend",
        title: "When to See a Psych, Counsellor, or Friend",
        summary: "Choose the right support type for the situation you are in.",
        arc: "month-3",
        arcOrder: 4,
        topic: "health-wellbeing",
        readingTimeMin: 4,
        isPublished: true,
        isFeatured: false,
        nextGuideSlug: "building-a-local-routine",
        searchTerms: ["psychologist", "counsellor", "mental health plan", "gp"],
        sourceLinks: [{ label: "Healthdirect", href: SOURCES.healthdirect }],
        sections: [
            { sectionKey: "moment", title: "The Moment", body: ["You are unsure whether your current struggle needs professional care or social support."] },
            { sectionKey: "feeling", title: "The Feeling", body: ["Ambiguity itself delays getting the right help."] },
            { sectionKey: "reveal", title: "The Reveal", body: ["Correct support matching is often more important than support intensity."] },
            {
                sectionKey: "how-it-works",
                title: "How It Actually Works",
                body: [
                    "Use your GP as first triage, then choose care pathways based on severity, duration, and function impact.",
                    "Keep one trusted friend in your loop even when using formal support.",
                ],
            },
            { sectionKey: "bridge", title: "The Bridge", body: ["When you're ready, find local mental health services near you."] },
            { sectionKey: "next-chapter", title: "Next Chapter", body: ["Next: Building a Local Routine That Feels Like Yours - consistency reduces background stress."] },
        ],
    }),
    createGuide({
        id: 15,
        slug: "building-a-local-routine",
        title: "Building a Local Routine That Feels Like Yours",
        summary: "Turn repeated places and rhythms into a stable sense of home.",
        arc: "month-3",
        arcOrder: 5,
        topic: "getting-around",
        readingTimeMin: 3,
        isPublished: true,
        isFeatured: false,
        nextGuideSlug: null,
        searchTerms: ["routine", "local", "habit", "belonging"],
        sourceLinks: [],
        sections: [
            { sectionKey: "moment", title: "The Moment", body: ["You notice your daily route now feels familiar instead of foreign."] },
            { sectionKey: "feeling", title: "The Feeling", body: ["Repetition starts to feel comforting instead of limiting."] },
            { sectionKey: "reveal", title: "The Reveal", body: ["Belonging is often built by routine before it is felt emotionally."] },
            {
                sectionKey: "how-it-works",
                title: "How It Actually Works",
                body: [
                    "Create three place anchors across your week: movement, nourishment, and connection.",
                    "Keep the anchors stable for six weeks before changing them.",
                ],
            },
            { sectionKey: "bridge", title: "The Bridge", body: ["When you're ready, find parks, paths, and neighborhood hubs near you."] },
            { sectionKey: "next-chapter", title: "Next Chapter", body: ["You have finished this arc. Revisit any chapter whenever life shifts again."] },
        ],
    }),
];

export const LEGACY_CATEGORY_TO_TOPIC: Record<string, GuideTopicSlug> = {
    setup: "home-admin",
    survive: "food-eating",
    "get-around": "getting-around",
    health: "health-wellbeing",
    connect: "social-belonging",
};
