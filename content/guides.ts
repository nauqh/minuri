import findingYourWayWeekOneGuide from "@/public/guides-content/getting-around/finding-your-way-around-melbourne-in-week-one.json";
import buildingALocalRoutineGuide from "@/public/guides-content/getting-around/building-a-local-routine.json";
import yourFirst48HoursGuide from "@/public/guides-content/home-admin/your-first-48-hours-checklist.json";
import budgetingGuide from "@/public/guides-content/home-admin/budgeting-on-what-you-actually-earn.json";
import cheapEatsGuide from "@/public/guides-content/food-eating/cheap-eats-when-broke.json";
import cookingMealsGuide from "@/public/guides-content/food-eating/cooking-5-meals-youll-actually-eat.json";
import crisisLinesGuide from "@/public/guides-content/health-wellbeing/crisis-lines-you-can-actually-call.json";
import whenYouDontKnowAnyoneGuide from "@/public/guides-content/social-belonging/when-you-dont-know-anyone-yet.json";
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
import mealPreppingGuide from "@/public/guides-content/food-eating/meal-prepping-on-a-tight-budget.json";
import freeCommunityMealsGuide from "@/public/guides-content/food-eating/finding-free-community-meals.json";
import nightTransportGuide from "@/public/guides-content/getting-around/night-transport-and-getting-home-safe.json";
import cyclingMelbourneGuide from "@/public/guides-content/getting-around/cycling-melbourne-without-fear.json";
import emergencyVsUrgentCareGuide from "@/public/guides-content/health-wellbeing/emergency-vs-urgent-care-in-melbourne.json";
import pharmacistFirstStopGuide from "@/public/guides-content/health-wellbeing/your-pharmacist-is-the-cheapest-first-stop.json";
import bondDayOneGuide from "@/public/guides-content/home-admin/your-bond-starts-on-day-one.json";
import superFirstPaycheckGuide from "@/public/guides-content/home-admin/super-and-your-first-paycheck.json";
import tenantRightsGuide from "@/public/guides-content/home-admin/tenant-rights-when-things-go-wrong.json";
import survivingFirstWeekendGuide from "@/public/guides-content/social-belonging/surviving-the-first-weekend-alone.json";
import freeThingsThisWeekGuide from "@/public/guides-content/social-belonging/free-things-to-do-this-week.json";
import volunteeringWayInGuide from "@/public/guides-content/social-belonging/volunteering-as-a-way-in.json";

export type GuideTopicSlug =
    | "food-eating"
    | "getting-around"
    | "health-wellbeing"
    | "home-admin"
    | "social-belonging";

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

export type GuideSection = {
    sectionKey: NarrativeSectionKey;
    title: string;
    body: string[];
};

export type GuideFirstStep = {
    label: string;
    estimateMin: number;
};

export type GuideShareCardContent = {
    bullets: string[];
    headsUp: string;
    goodToKnow: string;
};

export type Guide = {
    id: number;
    slug: string;
    title: string;
    thumbnailUrl: string;
    summary: string;
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
    firstSteps?: GuideFirstStep[];
    shareCard: GuideShareCardContent;
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

const GUIDE_FILES: GuideJson[] = [
    firstGroceryGuide as GuideJson,
    yourFirst48HoursGuide as GuideJson,
    whenYouDontKnowAnyoneGuide as GuideJson,
    mykiGuide as GuideJson,
    findingYourWayWeekOneGuide as GuideJson,
    cheapEatsGuide as GuideJson,
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
    mealPreppingGuide as GuideJson,
    freeCommunityMealsGuide as GuideJson,
    nightTransportGuide as GuideJson,
    cyclingMelbourneGuide as GuideJson,
    emergencyVsUrgentCareGuide as GuideJson,
    pharmacistFirstStopGuide as GuideJson,
    bondDayOneGuide as GuideJson,
    superFirstPaycheckGuide as GuideJson,
    tenantRightsGuide as GuideJson,
    survivingFirstWeekendGuide as GuideJson,
    freeThingsThisWeekGuide as GuideJson,
    volunteeringWayInGuide as GuideJson,
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

