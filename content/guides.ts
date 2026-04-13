export type GuideCategory =
    | "setup"
    | "survive"
    | "get-around"
    | "health"
    | "connect";

export type GuideWidgetKey = "cheap-eats" | "bulk-billing" | "free-things";

export type GuideSection = {
    heading: string;
    body: string[];
    checklist?: string[];
};

export type Guide = {
    slug: string;
    title: string;
    category: GuideCategory;
    summary: string;
    thumbnail: {
        src: string;
        alt: "";
    };
    readMinutes: 2 | 3 | 4 | 5;
    searchTerms: string[];
    sections: GuideSection[];
    sourceLinks: { label: string; href: string }[];
    widget?: {
        key: GuideWidgetKey;
        title: string;
        description: string;
    };
    cta?: {
        label: string;
        href: string;
    };
};

export type DemoWidgetItem = {
    id: string;
    name: string;
    area: string;
    group: string;
    detail: string;
    note: string;
};

const SOURCES = {
    upmove:
        "https://www.upmove.com.au/post/first-time-moving-out-guide",
    youthLease:
        "https://www.youthcentral.vic.gov.au/housing/renting-and-sharehousing/signing-lease",
    tenantsBond:
        "https://tenantsvic.org.au/explore-topics/starting-your-tenancy/bonds/private-rental/",
    tenantsCondition:
        "https://tenantsvic.org.au/explore-topics/starting-your-tenancy/condition-reports/",
    studyRights:
        "https://studymelbourne.vic.gov.au/living-here/accommodation/your-rights-when-renting",
    youthUtilities:
        "https://www.youthcentral.vic.gov.au/housing/renting-and-sharehousing/setting-gas-electricity-and-services",
    mykiExplained:
        "https://staydownunder.com/articles/myki-card-explained--getting-a/",
    choiceGroceries:
        "https://www.choice.com.au/shopping/everyday-shopping/supermarkets/articles/cheapest-groceries-australia",
    timeoutCheapEats:
        "https://www.timeout.com/melbourne/restaurants/cheap-eats-in-melbourne",
    communityFood:
        "https://www.melbourne.vic.gov.au/community-food-guide",
    youthBudget:
        "https://www.youthcentral.vic.gov.au/money/how-budget-and-save",
    youthConcessions:
        "https://www.youthcentral.vic.gov.au/study/financial-support/student-concessions-and-discounts",
    youthAllowance:
        "https://www.youthcentral.vic.gov.au/study/financial-support/youth-allowance-austudy-and-other-allowances",
    studyTransport:
        "https://studymelbourne.vic.gov.au/living-here/transport/guide-to-public-transportation",
    mykiConcession:
        "https://everythinginmelbourne.com.au/apply-myki-concession-card-melbourne/",
    freeTravel:
        "https://www.premier.vic.gov.au/free-travel-young-victorians-january",
    lateNightTransport:
        "https://transport.vic.gov.au/plan-a-journey/public-transport-tools-and-resources/travel-tips-and-resources/late-night-public-transport",
    cyclingScooters:
        "https://studymelbourne.vic.gov.au/living-here/transport/cycling-and-scooters",
    bikeRoutes:
        "https://www.melbourne.vic.gov.au/news/bike-routes-beginners-commuting-your-neighbourhood",
    firstGpGuide:
        "https://www.glenirisgp.com.au/post/first-time-gp-visit-guide",
    bulkBilling:
        "https://monashcaremed.com.au/blog/what-is-bulk-billing/",
    emergencyVsGp:
        "https://medidoc.com.au/blog/emergency-vs-gp-when-to-go-australia",
    pharmacist:
        "https://www.healthdirect.gov.au/getting-the-most-out-of-your-pharmacist",
    headspaceLoneliness:
        "https://headspace.org.au/explore-topics/for-young-people/loneliness/",
    homesickness:
        "https://www.allianzcare.com.au/en/blog/dealing-with-homesickness.html",
    mentalWellbeing:
        "https://www.youthcentral.vic.gov.au/health-and-wellbeing/managing-your-health/guide-mental-health-and-wellbeing",
    freeThings:
        "https://discovermelbourne.au/free-things-in-melbourne/",
    freeThisMonth:
        "https://whatson.melbourne.vic.gov.au/article/whats-free-in-melbourne-this-month",
    volunteer:
        "https://www.timeout.com/melbourne/things-to-do/where-to-volunteer-in-melbourne",
    youngPeopleGuide:
        "https://www.melbourne.vic.gov.au/news/guide-melbourne-young-people",
    sharehouse:
        "https://www.youthcentral.vic.gov.au/housing/renting-and-sharehousing/tips-sharehouse-success",
    gardens:
        "https://www.melbourne.vic.gov.au/community-gardens-and-compost-hubs",
    libraries:
        "https://www.melbourne.vic.gov.au/libraries",
} as const;

export const GUIDE_CATEGORIES = [
    {
        slug: "setup",
        label: "Setup",
        tagline: "I don't understand the paperwork",
    },
    {
        slug: "survive",
        label: "Survive",
        tagline: "I'm running out of money",
    },
    {
        slug: "get-around",
        label: "Get around",
        tagline: "I don't know how to get around",
    },
    {
        slug: "health",
        label: "Health",
        tagline: "Something feels off",
    },
    {
        slug: "connect",
        label: "Connect",
        tagline: "I feel alone",
    },
] as const;

export const GUIDES: Guide[] = [
    {
        slug: "understanding-rental-paperwork",
        title: "Understanding Rental Paperwork",
        category: "setup",
        summary:
            "A plain-language intro to leases, bonds and condition reports before you sign anything.",
        thumbnail: {
            src: "/guides/thumbnails/understanding-rental-paperwork.svg",
            alt: "",
        },
        readMinutes: 4,
        searchTerms: [
            "lease",
            "bond",
            "condition report",
            "paperwork",
            "rental agreement",
        ],
        sections: [
            {
                heading: "What each document does",
                body: [
                    "Treat the lease, bond record and condition report as three separate safety tools. One defines the agreement, one records your payment, and one protects you from being blamed for old damage.",
                    "Reading them in that order helps reduce stress because you can understand the purpose of each form before focusing on the fine print.",
                ],
            },
            {
                heading: "What to check before you sign",
                body: [
                    "Before you commit, make sure dates, rent amount, names and special conditions all match what you were told.",
                ],
                checklist: [
                    "Read the lease slowly and highlight any rule you do not understand.",
                    "Confirm who holds the bond and how it will be lodged.",
                    "Take photos during move-in day before unpacking.",
                    "Keep digital copies of every document in one folder.",
                ],
            },
        ],
        sourceLinks: [
            { label: "First-time moving out guide", href: SOURCES.upmove },
            { label: "Signing a lease", href: SOURCES.youthLease },
            { label: "Private rental bonds", href: SOURCES.tenantsBond },
            { label: "Condition reports", href: SOURCES.tenantsCondition },
        ],
    },
    {
        slug: "know-your-rights-as-a-renter",
        title: "Know Your Rights as a Renter",
        category: "setup",
        summary:
            "Learn the basic renter rights that matter in your first weeks living independently.",
        thumbnail: {
            src: "/guides/thumbnails/know-your-rights-as-a-renter.svg",
            alt: "",
        },
        readMinutes: 4,
        searchTerms: [
            "renter rights",
            "tenant rights",
            "renting rights",
            "bonds",
            "condition report",
        ],
        sections: [
            {
                heading: "The basics worth knowing early",
                body: [
                    "You do not need to become an expert overnight. Start with the rights that affect your money, your safety and how property condition is recorded.",
                    "That means understanding the bond process, keeping evidence of property condition and knowing what repairs or issues should be reported quickly.",
                ],
            },
            {
                heading: "How to protect yourself",
                body: [
                    "A calm paper trail is one of the most useful habits you can build as a new renter.",
                ],
                checklist: [
                    "Save emails, receipts and screenshots in one place.",
                    "Submit the condition report on time and keep your own copy.",
                    "Document issues with photos and dates.",
                    "Use official guidance before agreeing to anything you are unsure about.",
                ],
            },
        ],
        sourceLinks: [
            { label: "Your rights when renting", href: SOURCES.studyRights },
            { label: "Private rental bonds", href: SOURCES.tenantsBond },
            { label: "Condition reports", href: SOURCES.tenantsCondition },
        ],
    },
    {
        slug: "moving-in-essentials-checklist",
        title: "Moving-in Essentials Checklist",
        category: "setup",
        summary:
            "Use this first-week checklist to set up utilities, transport and your basic admin.",
        thumbnail: {
            src: "/guides/thumbnails/moving-in-essentials-checklist.svg",
            alt: "",
        },
        readMinutes: 3,
        searchTerms: [
            "moving checklist",
            "utilities",
            "electricity",
            "gas",
            "internet",
            "myki",
        ],
        sections: [
            {
                heading: "Sort the essentials first",
                body: [
                    "When you first move, focus on the things that affect daily functioning: electricity, gas, internet, keys, transport and emergency contacts.",
                    "Doing the basics first gives you stability and makes the rest of independent living feel much more manageable.",
                ],
            },
            {
                heading: "First-week setup list",
                body: [
                    "Keep this list short and practical so you can finish it in a few sessions instead of trying to fix everything at once.",
                ],
                checklist: [
                    "Set up electricity, gas and internet accounts.",
                    "Check that your address is written correctly on important records.",
                    "Buy or top up a Myki card for transport.",
                    "Store your lease, ID and support contacts where you can find them fast.",
                ],
            },
        ],
        sourceLinks: [
            { label: "First-time moving out guide", href: SOURCES.upmove },
            { label: "Setting up gas, electricity and services", href: SOURCES.youthUtilities },
            { label: "Myki card explained", href: SOURCES.mykiExplained },
        ],
    },
    {
        slug: "cheap-groceries-in-australia",
        title: "Cheap Groceries in Australia",
        category: "survive",
        summary:
            "Stretch your grocery budget with planning habits that reduce waste and impulse spending.",
        thumbnail: {
            src: "/guides/thumbnails/cheap-groceries-in-australia.svg",
            alt: "",
        },
        readMinutes: 4,
        searchTerms: [
            "groceries",
            "cheap food",
            "save money",
            "meal planning",
            "supermarket",
        ],
        sections: [
            {
                heading: "How to make groceries go further",
                body: [
                    "Cheap groceries usually come from routine rather than one perfect shop. Planning a few repeat meals, checking specials and avoiding waste matters more than chasing every discount.",
                    "Your aim is not to buy the cheapest possible items every week. It is to build a shopping pattern that is realistic when you are tired or busy.",
                ],
            },
            {
                heading: "Budget habits that actually help",
                body: [
                    "Keep your first system simple and repeatable.",
                ],
                checklist: [
                    "Shop with a short list instead of browsing hungry.",
                    "Pick a few low-cost meals you can cook on repeat.",
                    "Use frozen, canned and pantry staples to reduce waste.",
                    "Compare stores only for items you buy often.",
                ],
            },
        ],
        sourceLinks: [
            { label: "Cheapest groceries in Australia", href: SOURCES.choiceGroceries },
            { label: "Community food guide", href: SOURCES.communityFood },
        ],
    },
    {
        slug: "cheap-eats-in-melbourne",
        title: "Cheap Eats in Melbourne",
        category: "survive",
        summary:
            "Find affordable meal options and build a fallback list for low-energy days.",
        thumbnail: {
            src: "/guides/thumbnails/cheap-eats-in-melbourne.svg",
            alt: "",
        },
        readMinutes: 3,
        searchTerms: [
            "cheap eats",
            "food near me",
            "budget meals",
            "student food",
            "restaurants",
        ],
        sections: [
            {
                heading: "Why a cheap-eats list helps",
                body: [
                    "Low-cost meal options are not just about saving money. They also help when you are exhausted, short on time or still learning to cook regularly.",
                    "Building a personal list of reliable places can stop stressful evenings turning into expensive takeaway decisions.",
                ],
            },
            {
                heading: "How to use this guide",
                body: [
                    "Use the dataset widget below as a demo of what a future live food widget can look like on the frontend.",
                ],
                checklist: [
                    "Save two or three places near your regular route.",
                    "Notice which meals feel filling for the price.",
                    "Mix takeaway with low-cost home meals during the week.",
                ],
            },
        ],
        sourceLinks: [
            { label: "Cheap eats in Melbourne", href: SOURCES.timeoutCheapEats },
            { label: "Community food guide", href: SOURCES.communityFood },
        ],
        widget: {
            key: "cheap-eats",
            title: "Cheap eats demo widget",
            description:
                "Frontend-only demo data for affordable meal spots. Replace with backend-fed data later.",
        },
    },
    {
        slug: "budgeting-discounts-and-youth-allowance",
        title: "Budgeting, Discounts and Youth Allowance",
        category: "survive",
        summary:
            "Start with a simple budget and learn which discounts or support schemes are worth checking.",
        thumbnail: {
            src: "/guides/thumbnails/budgeting-discounts-and-youth-allowance.svg",
            alt: "",
        },
        readMinutes: 5,
        searchTerms: [
            "budget",
            "discounts",
            "concession",
            "youth allowance",
            "austudy",
        ],
        sections: [
            {
                heading: "Start with the simple version",
                body: [
                    "A first budget does not need ten categories and a spreadsheet you hate. Start with fixed costs, food, transport and a small buffer.",
                    "Once you know where your money usually goes, then add more detail if it actually helps you make decisions.",
                ],
            },
            {
                heading: "Support to look into",
                body: [
                    "Discounts and allowances are easiest to use when you check them as part of your routine admin, not only during a crisis.",
                ],
                checklist: [
                    "Check whether you qualify for student concessions.",
                    "Review transport, health and study-related discounts.",
                    "Look into Youth Allowance or Austudy if relevant.",
                    "Set one weekly spending check-in on the same day each week.",
                ],
            },
        ],
        sourceLinks: [
            { label: "How to budget and save", href: SOURCES.youthBudget },
            { label: "Student concessions and discounts", href: SOURCES.youthConcessions },
            { label: "Youth Allowance and Austudy", href: SOURCES.youthAllowance },
        ],
    },
    {
        slug: "melbourne-public-transport-101",
        title: "Melbourne Public Transport 101",
        category: "get-around",
        summary:
            "A beginner-friendly guide to Myki, trains, trams and building confidence with public transport.",
        thumbnail: {
            src: "/guides/thumbnails/melbourne-public-transport-101.svg",
            alt: "",
        },
        readMinutes: 4,
        searchTerms: [
            "myki",
            "tram",
            "train",
            "bus",
            "public transport",
            "zones",
        ],
        sections: [
            {
                heading: "What you need first",
                body: [
                    "Your goal is not to master the whole system in one day. First, learn how to top up, tap on and understand the route you use most often.",
                    "Once one route feels familiar, the rest of the network becomes much less intimidating.",
                ],
            },
            {
                heading: "Confidence-building steps",
                body: [
                    "Reduce decision fatigue by rehearsing your regular journey before you need it under pressure.",
                ],
                checklist: [
                    "Get a Myki card and top it up before your first trip.",
                    "Practice your route to campus, work or the CBD.",
                    "Check platform, stop and interchange details ahead of time.",
                    "Save one backup route in case of delays.",
                ],
            },
        ],
        sourceLinks: [
            { label: "Guide to public transportation", href: SOURCES.studyTransport },
            { label: "Myki card explained", href: SOURCES.mykiExplained },
        ],
    },
    {
        slug: "transport-discounts-and-concessions",
        title: "Transport Discounts and Concessions",
        category: "get-around",
        summary:
            "Understand the discounts and concession pathways that can lower your weekly transport costs.",
        thumbnail: {
            src: "/guides/thumbnails/transport-discounts-and-concessions.svg",
            alt: "",
        },
        readMinutes: 3,
        searchTerms: [
            "transport concession",
            "myki concession",
            "free travel",
            "discount travel",
        ],
        sections: [
            {
                heading: "Why this matters early",
                body: [
                    "Transport becomes a quiet money leak if you never check whether you are eligible for reduced fares or seasonal offers.",
                    "A little admin now can make your weekly budget much easier to manage later.",
                ],
            },
            {
                heading: "What to check",
                body: [
                    "Use this as a shortlist of things to verify rather than assumptions to rely on forever.",
                ],
                checklist: [
                    "Check whether you qualify for a concession card.",
                    "Make sure your Myki setup matches your eligibility.",
                    "Keep an eye on temporary free-travel initiatives or holiday programs.",
                ],
            },
        ],
        sourceLinks: [
            { label: "Apply for Myki concession", href: SOURCES.mykiConcession },
            { label: "Free travel for young Victorians", href: SOURCES.freeTravel },
        ],
    },
    {
        slug: "cycling-and-late-night-travel",
        title: "Cycling and Late-night Travel",
        category: "get-around",
        summary:
            "Plan safer travel when public transport is limited or you want alternatives to your usual route.",
        thumbnail: {
            src: "/guides/thumbnails/cycling-and-late-night-travel.svg",
            alt: "",
        },
        readMinutes: 4,
        searchTerms: [
            "cycling",
            "scooters",
            "late night transport",
            "night travel",
            "bike routes",
        ],
        sections: [
            {
                heading: "Think in travel options, not one mode",
                body: [
                    "Independent living gets easier when you have more than one way to get somewhere. That can mean mixing public transport with walking, cycling or a backup late-night plan.",
                    "Your best option may change depending on time, weather, confidence and what is running.",
                ],
            },
            {
                heading: "Build a safer backup plan",
                body: [
                    "Try planning before you are already tired or stuck somewhere late.",
                ],
                checklist: [
                    "Know your last reliable service home.",
                    "Check whether a cycling route feels beginner-friendly in daylight first.",
                    "Share travel plans when heading home late.",
                    "Keep enough phone battery for navigation and updates.",
                ],
            },
        ],
        sourceLinks: [
            { label: "Late-night public transport", href: SOURCES.lateNightTransport },
            { label: "Cycling and scooters", href: SOURCES.cyclingScooters },
            { label: "Bike routes for beginners", href: SOURCES.bikeRoutes },
        ],
    },
    {
        slug: "your-first-gp-visit",
        title: "Your First GP Visit",
        category: "health",
        summary:
            "Know what to expect before booking a doctor and how to prepare for a first appointment.",
        thumbnail: {
            src: "/guides/thumbnails/your-first-gp-visit.svg",
            alt: "",
        },
        readMinutes: 4,
        searchTerms: [
            "gp",
            "doctor",
            "first appointment",
            "medical centre",
            "book a gp",
        ],
        sections: [
            {
                heading: "What a GP can help with",
                body: [
                    "A GP is usually your first stop for non-emergency health concerns, routine checks, ongoing symptoms and referrals.",
                    "Knowing that role makes it easier to decide when you need urgent care and when you can book a normal appointment.",
                ],
            },
            {
                heading: "Before you book",
                body: [
                    "Preparation lowers anxiety because you already know what details or questions you want to raise.",
                ],
                checklist: [
                    "Write down symptoms, timing and any medication you are taking.",
                    "Bring ID, Medicare details or anything the clinic asks for.",
                    "Note any questions you keep putting off asking.",
                    "Ask how fees, follow-ups and referrals work.",
                ],
            },
        ],
        sourceLinks: [
            { label: "First-time GP visit guide", href: SOURCES.firstGpGuide },
            { label: "Emergency vs GP", href: SOURCES.emergencyVsGp },
        ],
        cta: {
            label: "Find a GP near you",
            href: "/near-me?type=health",
        },
    },
    {
        slug: "bulk-billing-and-pharmacy-basics",
        title: "Bulk Billing and Pharmacy Basics",
        category: "health",
        summary:
            "Understand common health costs, what bulk billing means and when a pharmacist can help.",
        thumbnail: {
            src: "/guides/thumbnails/bulk-billing-and-pharmacy-basics.svg",
            alt: "",
        },
        readMinutes: 4,
        searchTerms: [
            "bulk billing",
            "pharmacy",
            "chemist",
            "health costs",
            "medical costs",
        ],
        sections: [
            {
                heading: "Why these basics reduce stress",
                body: [
                    "Health admin feels overwhelming when you are unwell, so it helps to learn the common terms ahead of time.",
                    "Bulk billing and pharmacist support are both practical concepts that can help you make faster decisions when you need care.",
                ],
            },
            {
                heading: "What to ask when you are unsure",
                body: [
                    "Clear questions can save money and make your care pathway much easier to follow.",
                ],
                checklist: [
                    "Ask whether the clinic bulk bills and for whom.",
                    "Check if the pharmacist can help with minor concerns or medicine questions.",
                    "Confirm follow-up costs before booking extra appointments.",
                ],
            },
        ],
        sourceLinks: [
            { label: "What is bulk billing", href: SOURCES.bulkBilling },
            { label: "Getting the most out of your pharmacist", href: SOURCES.pharmacist },
        ],
        widget: {
            key: "bulk-billing",
            title: "Bulk-billing services demo widget",
            description:
                "Frontend-only demo data for nearby-style health entries. Replace with NHSD or backend proxy data later.",
        },
    },
    {
        slug: "homesickness-loneliness-and-mental-wellbeing",
        title: "Homesickness, Loneliness and Mental Wellbeing",
        category: "health",
        summary:
            "Recognise common emotional strain in early independence and take small actions before it snowballs.",
        thumbnail: {
            src: "/guides/thumbnails/homesickness-loneliness-and-mental-wellbeing.svg",
            alt: "",
        },
        readMinutes: 5,
        searchTerms: [
            "loneliness",
            "homesickness",
            "mental health",
            "wellbeing",
            "feeling isolated",
        ],
        sections: [
            {
                heading: "What can feel normal and what needs attention",
                body: [
                    "It is common to feel off, lonely or unsettled when routines, support systems and surroundings all change at once.",
                    "The important part is noticing patterns early so you can respond before exhaustion or isolation becomes your default state.",
                ],
            },
            {
                heading: "Small actions that create momentum",
                body: [
                    "A low-pressure plan is often more realistic than waiting until you feel fully motivated.",
                ],
                checklist: [
                    "Name one person you can message honestly this week.",
                    "Build one repeat routine that gets you out of your room or house.",
                    "Notice when support from a GP, counsellor or youth service would help.",
                    "Keep crisis and support contacts easy to reach.",
                ],
            },
        ],
        sourceLinks: [
            { label: "Headspace on loneliness", href: SOURCES.headspaceLoneliness },
            { label: "Dealing with homesickness", href: SOURCES.homesickness },
            { label: "Mental health and wellbeing guide", href: SOURCES.mentalWellbeing },
        ],
    },
    {
        slug: "free-things-to-do-in-melbourne",
        title: "Free Things to Do in Melbourne",
        category: "connect",
        summary:
            "Use free activities to explore the city, reset on a budget and make weekends feel less isolating.",
        thumbnail: {
            src: "/guides/thumbnails/free-things-to-do-in-melbourne.svg",
            alt: "",
        },
        readMinutes: 3,
        searchTerms: [
            "free things",
            "weekend",
            "budget activities",
            "melbourne events",
            "things to do",
        ],
        sections: [
            {
                heading: "Why free plans matter",
                body: [
                    "Free activities are useful for more than saving money. They make it easier to leave the house, explore safely and build a sense of place in a new city.",
                    "Having a few no-cost options ready can also prevent weekends from drifting into isolation.",
                ],
            },
            {
                heading: "Use the demo widget as a planning board",
                body: [
                    "The widget below shows how this kind of content can become interactive in the frontend before live open-data wiring is added later.",
                ],
                checklist: [
                    "Save a few options in areas you already travel through.",
                    "Mix solo activities with community-facing spaces.",
                    "Use free outings as low-pressure social opportunities.",
                ],
            },
        ],
        sourceLinks: [
            { label: "Free things in Melbourne", href: SOURCES.freeThings },
            { label: "What's free in Melbourne this month", href: SOURCES.freeThisMonth },
        ],
        widget: {
            key: "free-things",
            title: "Free things demo widget",
            description:
                "Frontend-only demo data for free places and activities. Replace with backend-fed civic data later.",
        },
    },
    {
        slug: "ways-to-meet-people-and-volunteer",
        title: "Ways to Meet People and Volunteer",
        category: "connect",
        summary:
            "Find low-pressure ways to build belonging through volunteering, public spaces and youth-friendly programs.",
        thumbnail: {
            src: "/guides/thumbnails/ways-to-meet-people-and-volunteer.svg",
            alt: "",
        },
        readMinutes: 4,
        searchTerms: [
            "volunteer",
            "meet people",
            "friends",
            "community",
            "social",
        ],
        sections: [
            {
                heading: "Connection works better with structure",
                body: [
                    "Meeting people gets easier when there is a shared activity, place or role instead of pressure to be instantly social.",
                    "That is why volunteering, libraries and community programs can feel more approachable than trying to force a big social reset.",
                ],
            },
            {
                heading: "Places to start",
                body: [
                    "Choose one environment that feels manageable and repeatable.",
                ],
                checklist: [
                    "Look for volunteering options with clear roles or shifts.",
                    "Use youth-friendly city guides to find welcoming spaces.",
                    "Try public programs where you can attend without needing a full group.",
                ],
            },
        ],
        sourceLinks: [
            { label: "Where to volunteer in Melbourne", href: SOURCES.volunteer },
            { label: "Guide for young people in Melbourne", href: SOURCES.youngPeopleGuide },
            { label: "Melbourne libraries", href: SOURCES.libraries },
        ],
    },
    {
        slug: "sharehouse-and-community-life",
        title: "Sharehouse and Community Life",
        category: "connect",
        summary:
            "Build better shared-living habits and use local spaces to feel less alone in a new city.",
        thumbnail: {
            src: "/guides/thumbnails/sharehouse-and-community-life.svg",
            alt: "",
        },
        readMinutes: 4,
        searchTerms: [
            "sharehouse",
            "housemates",
            "community",
            "gardens",
            "libraries",
        ],
        sections: [
            {
                heading: "Good sharehouse life is mostly small habits",
                body: [
                    "Living with others gets easier when expectations are made visible instead of assumed. Small agreements around cleaning, noise, bills and guests prevent a lot of stress later.",
                    "Outside the house, local community spaces can help reduce the feeling that your whole social world depends on housemates alone.",
                ],
            },
            {
                heading: "Simple ways to create stability",
                body: [
                    "You do not need a perfect group dynamic to create a livable routine.",
                ],
                checklist: [
                    "Talk about chores, bills and shared spaces early.",
                    "Use written notes or messages for recurring house tasks.",
                    "Try libraries, gardens or other public spaces when you need a reset.",
                ],
            },
        ],
        sourceLinks: [
            { label: "Tips for sharehouse success", href: SOURCES.sharehouse },
            { label: "Community gardens and compost hubs", href: SOURCES.gardens },
            { label: "Melbourne libraries", href: SOURCES.libraries },
        ],
    },
];

export const DEMO_WIDGET_DATA: Record<GuideWidgetKey, DemoWidgetItem[]> = {
    "cheap-eats": [
        {
            id: "eat-1",
            name: "Campus Noodle Bowl",
            area: "Carlton",
            group: "Under $15",
            detail: "Hot meal, quick service, easy weekday lunch option.",
            note: "Good fallback for class days.",
        },
        {
            id: "eat-2",
            name: "Market Sandwich Bar",
            area: "CBD",
            group: "Grab and go",
            detail: "Simple lunch options near transport.",
            note: "Useful when you need a cheap meal before heading home.",
        },
        {
            id: "eat-3",
            name: "Clayton Rice Kitchen",
            area: "Clayton",
            group: "Under $15",
            detail: "Filling meals with student-friendly portions.",
            note: "Good for building a shortlist near campus areas.",
        },
        {
            id: "eat-4",
            name: "Late Tram Bites",
            area: "CBD",
            group: "Late-night",
            detail: "Budget option for nights when you miss your normal dinner window.",
            note: "Useful backup for late study or work days.",
        },
    ],
    "bulk-billing": [
        {
            id: "health-1",
            name: "Southbank Family Clinic",
            area: "Southbank",
            group: "Clinic",
            detail: "Demo entry showing a GP-style result card.",
            note: "Bulk-billing availability must come from backend data later.",
        },
        {
            id: "health-2",
            name: "CBD Walk-in Medical",
            area: "CBD",
            group: "Clinic",
            detail: "Useful example for list and filter behaviour.",
            note: "Future version should be fed by NHSD or a backend proxy.",
        },
        {
            id: "health-3",
            name: "Neighbourhood Pharmacy",
            area: "Carlton",
            group: "Pharmacy",
            detail: "Demo entry showing that pharmacists can sit beside GP guidance content.",
            note: "Pharmacy support is informative here, not a live directory yet.",
        },
        {
            id: "health-4",
            name: "Student Telehealth Support",
            area: "Online",
            group: "Telehealth",
            detail: "Demo entry for broader service discovery patterns.",
            note: "Live integration belongs in a later backend-powered epic.",
        },
    ],
    "free-things": [
        {
            id: "free-1",
            name: "State Library Study and Browse",
            area: "CBD",
            group: "Quiet spaces",
            detail: "Free indoor option for solo time or gentle social exposure.",
            note: "Useful when you want to be around people without spending.",
        },
        {
            id: "free-2",
            name: "Riverside Walk",
            area: "Southbank",
            group: "Outdoors",
            detail: "Low-pressure reset activity after work or study.",
            note: "Great for budget weekends.",
        },
        {
            id: "free-3",
            name: "Community Garden Visit",
            area: "Inner north",
            group: "Community",
            detail: "A softer entry point into shared local spaces.",
            note: "Can support both connection and routine.",
        },
        {
            id: "free-4",
            name: "Free City Event",
            area: "CBD",
            group: "Events",
            detail: "Frontend demo entry for event-like results.",
            note: "Later this can be backed by real city feeds.",
        },
    ],
};
