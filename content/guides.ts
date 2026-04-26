import buildingALocalRoutineGuide from "@/public/guides-content/getting-around/building-a-local-routine.json";
import budgetingGuide from "@/public/guides-content/home-admin/budgeting-on-what-you-actually-earn.json";
import cheapEatsGuide from "@/public/guides-content/food-eating/cheap-eats-when-broke.json";
import cookingMealsGuide from "@/public/guides-content/food-eating/cooking-5-meals-youll-actually-eat.json";
import crisisLinesGuide from "@/public/guides-content/health-wellbeing/crisis-lines-you-can-actually-call.json";
import findingCommunityGuide from "@/public/guides-content/social-belonging/finding-your-community.json";
import findingGpGuide from "@/public/guides-content/health-wellbeing/finding-a-gp-before-you-need-one.json";
import mykiGuide from "@/public/guides-content/getting-around/getting-myki-and-surviving-ptv.json";
import homesicknessGuide from "@/public/guides-content/social-belonging/homesickness-nobody-warns-you-about.json";
import makingFriendsGuide from "@/public/guides-content/social-belonging/making-friends-in-a-city-where-everyones-busy.json";
import managingPrescriptionsGuide from "@/public/guides-content/health-wellbeing/managing-your-prescriptions-in-a-new-city.json";
import medicareGuide from "@/public/guides-content/health-wellbeing/medicare-bulk-billing-and-mental-health-care-plans.json";
import rentingGuide from "@/public/guides-content/home-admin/renting-without-getting-burned.json";
import settingUtilitiesGuide from "@/public/guides-content/home-admin/setting-up-utilities-without-overpaying.json";
import sustainingGuide from "@/public/guides-content/health-wellbeing/sustaining-yourself-sleep-movement-and-disconnecting.json";
import psychGuide from "@/public/guides-content/health-wellbeing/when-to-see-a-psych-counsellor-or-friend.json";
import firstGroceryGuide from "@/public/guides-content/food-eating/your-first-grocery-run.json";

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
    readingTimeMin: number;
    isPublished: boolean;
    isFeatured: boolean;
    nearMeDeeplink: string;
    nextGuideSlug: string | null;
    markdownPath?: string;
    searchTerms: string[];
    sections: GuideSection[];
    sourceLinks: { label: string; href: string }[];
};

type GuideJsonSection = {
    sectionKey: NarrativeSectionKey;
    title: string;
    value: string;
};

type GuideJson = Omit<Guide, "sections"> & {
    sections: GuideJsonSection[];
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

const GUIDE_FILES: GuideJson[] = [
    firstGroceryGuide as GuideJson,
    cheapEatsGuide as GuideJson,
    mykiGuide as GuideJson,
    findingGpGuide as GuideJson,
    crisisLinesGuide as GuideJson,
    rentingGuide as GuideJson,
    medicareGuide as GuideJson,
    managingPrescriptionsGuide as GuideJson,
    budgetingGuide as GuideJson,
    settingUtilitiesGuide as GuideJson,
    cookingMealsGuide as GuideJson,
    makingFriendsGuide as GuideJson,
    homesicknessGuide as GuideJson,
    findingCommunityGuide as GuideJson,
    psychGuide as GuideJson,
    sustainingGuide as GuideJson,
    buildingALocalRoutineGuide as GuideJson,
];

function fromGuideJson(guide: GuideJson): Guide {
    return {
        ...guide,
        sections: guide.sections.map((section) => ({
            sectionKey: section.sectionKey,
            title: section.title,
            body: section.value ? [section.value] : [],
        })),
    };
}

export const GUIDES: Guide[] = GUIDE_FILES.map(fromGuideJson);

export const LEGACY_CATEGORY_TO_TOPIC: Record<string, GuideTopicSlug> = {
    setup: "home-admin",
    survive: "food-eating",
    "get-around": "getting-around",
    health: "health-wellbeing",
    connect: "social-belonging",
};
