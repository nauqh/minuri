import {
    GUIDES,
    GUIDE_TOPICS,
    type Guide,
    type GuideTopicSlug,
} from "@/content/guides";

export type GuideTopicFilter = "all" | GuideTopicSlug;
export type GuideOrigin = "library" | "bookmarks" | "journey";

export function parseSingleParam(
    value: string | string[] | undefined,
): string | undefined {
    return Array.isArray(value) ? value[0] : value;
}

export function parseGuideTopicFilter(
    value: string | null | undefined,
): GuideTopicFilter {
    if (!value) return "all";
    return GUIDE_TOPICS.some((topic) => topic.slug === value)
        ? (value as GuideTopicSlug)
        : "all";
}

export function parseGuideOrigin(
    value: string | null | undefined,
): GuideOrigin {
    if (value === "bookmarks") return "bookmarks";
    if (value === "journey") return "journey";
    return "library";
}

export function getGuideBySlug(slug: string): Guide | undefined {
    return GUIDES.find((guide) => guide.slug === slug);
}

export function getTopicMeta(topic: GuideTopicSlug) {
    return GUIDE_TOPICS.find((item) => item.slug === topic);
}

function getSearchableGuideText(guide: Guide) {
    return [
        guide.title,
        guide.summary,
        ...guide.searchTerms,
    ]
        .join(" ")
        .toLowerCase();
}

export function filterGuides(
    guides: Guide[],
    topicFilter: GuideTopicFilter,
    query: string,
) {
    const normalizedQuery = query.trim().toLowerCase();

    return guides.filter((guide) => {
        const matchesTopic =
            topicFilter === "all" ? true : guide.topic === topicFilter;
        const matchesQuery =
            normalizedQuery.length === 0
                ? true
                : getSearchableGuideText(guide).includes(normalizedQuery);

        return matchesTopic && matchesQuery;
    });
}

export function getGuidesFromSlugs(slugs: string[]) {
    return slugs
        .map((slug) => getGuideBySlug(slug))
        .filter((guide): guide is Guide => Boolean(guide));
}

export function getRelatedGuides(slug: string, limit = 2) {
    const currentGuide = getGuideBySlug(slug);
    if (!currentGuide) return [];

    return GUIDES.filter(
        (guide) =>
            guide.slug !== slug &&
            guide.topic === currentGuide.topic,
    ).slice(0, limit);
}

export function getNextGuide(currentGuide: Guide) {
    if (!currentGuide.nextGuideSlug) return null;
    return getGuideBySlug(currentGuide.nextGuideSlug) ?? null;
}

export function buildGuideHref(
    guide: Pick<Guide, "slug">,
    state: {
        topicFilter: GuideTopicFilter;
        query: string;
        from: GuideOrigin;
        day?: number;
    },
) {
    const params = new URLSearchParams();

    if (state.from === "bookmarks") {
        params.set("from", "bookmarks");
    }

    if (state.topicFilter !== "all") {
        params.set("topic", state.topicFilter);
    }

    if (state.query.trim()) {
        params.set("q", state.query.trim());
    }

    if (state.from === "journey" && state.day != null) {
        params.set("day", String(state.day));
    }

    const queryString = params.toString();
    const basePath = `/guides/${guide.slug}`;
    return queryString ? `${basePath}?${queryString}` : basePath;
}

export function buildBackHref(state: {
    topicFilter: GuideTopicFilter;
    query: string;
    from: GuideOrigin;
    day?: number;
}) {
    if (state.from === "journey") {
        return state.day != null ? `/journey/plan?day=${state.day}` : "/journey/plan";
    }

    const params = new URLSearchParams();
    const basePath = state.from === "bookmarks" ? "/guides/bookmarks" : "/guides";

    if (state.topicFilter !== "all") {
        params.set("topic", state.topicFilter);
    }

    if (state.query.trim()) {
        params.set("q", state.query.trim());
    }

    const queryString = params.toString();
    return queryString ? `${basePath}?${queryString}` : basePath;
}
