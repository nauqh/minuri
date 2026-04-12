import {
    DEMO_WIDGET_DATA,
    GUIDE_CATEGORIES,
    GUIDES,
    type DemoWidgetItem,
    type Guide,
    type GuideCategory,
    type GuideWidgetKey,
} from "@/content/guides";

export type GuideFilter = "all" | GuideCategory | "coming-soon";
export type GuideOrigin = "library" | "bookmarks";

const FILTER_VALUES: GuideFilter[] = [
    "all",
    "setup",
    "survive",
    "get-around",
    "health",
    "connect",
    "coming-soon",
];

export function parseSingleParam(
    value: string | string[] | undefined,
): string | undefined {
    return Array.isArray(value) ? value[0] : value;
}

export function parseGuideFilter(
    value: string | null | undefined,
): GuideFilter {
    if (!value) return "all";
    return FILTER_VALUES.includes(value as GuideFilter)
        ? (value as GuideFilter)
        : "all";
}

export function parseGuideOrigin(
    value: string | null | undefined,
): GuideOrigin {
    return value === "bookmarks" ? "bookmarks" : "library";
}

export function getCategoryMeta(category: GuideCategory) {
    return GUIDE_CATEGORIES.find((item) => item.slug === category);
}

export function getGuideBySlug(slug: string): Guide | undefined {
    return GUIDES.find((guide) => guide.slug === slug);
}

function getSearchableGuideText(guide: Guide) {
    return [
        guide.title,
        guide.summary,
        ...guide.searchTerms,
        ...guide.sections.flatMap((section) => [
            section.heading,
            ...section.body,
            ...(section.checklist ?? []),
        ]),
    ]
        .join(" ")
        .toLowerCase();
}

export function filterGuides(
    guides: Guide[],
    filter: GuideFilter,
    query: string,
) {
    const normalizedQuery = query.trim().toLowerCase();

    return guides.filter((guide) => {
        const matchesCategory =
            filter === "all"
                ? true
                : filter === "coming-soon"
                    ? false
                    : guide.category === filter;

        const matchesQuery =
            normalizedQuery.length === 0
                ? true
                : getSearchableGuideText(guide).includes(normalizedQuery);

        return matchesCategory && matchesQuery;
    });
}

export function getRelatedGuides(slug: string, limit = 2) {
    const currentGuide = getGuideBySlug(slug);
    if (!currentGuide) return [];

    return GUIDES.filter(
        (guide) =>
            guide.slug !== slug && guide.category === currentGuide.category,
    ).slice(0, limit);
}

export function getGuidesFromSlugs(slugs: string[]) {
    return slugs
        .map((slug) => getGuideBySlug(slug))
        .filter((guide): guide is Guide => Boolean(guide));
}

export function buildGuideHref(
    slug: string,
    state: {
        filter: GuideFilter;
        query: string;
        from: GuideOrigin;
    },
) {
    const params = new URLSearchParams();

    if (state.from === "bookmarks") {
        params.set("from", "bookmarks");
    }

    if (state.filter !== "all") {
        params.set("category", state.filter);
    }

    if (state.query.trim()) {
        params.set("q", state.query.trim());
    }

    const queryString = params.toString();
    return queryString
        ? `/guides/${slug}?${queryString}`
        : `/guides/${slug}`;
}

export function buildBackHref(
    state: {
        filter: GuideFilter;
        query: string;
        from: GuideOrigin;
    },
) {
    const params = new URLSearchParams();
    const basePath =
        state.from === "bookmarks" ? "/guides/bookmarks" : "/guides";

    if (state.filter !== "all") {
        params.set("category", state.filter);
    }

    if (state.query.trim()) {
        params.set("q", state.query.trim());
    }

    const queryString = params.toString();
    return queryString ? `${basePath}?${queryString}` : basePath;
}

export function getWidgetData(
    key: GuideWidgetKey,
): DemoWidgetItem[] | undefined {
    return DEMO_WIDGET_DATA[key];
}
