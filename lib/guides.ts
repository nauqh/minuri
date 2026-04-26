import {
    GUIDE_ARCS,
    GUIDES,
    GUIDE_TOPICS,
    type Guide,
    type GuideArcSlug,
    type GuideTopicSlug,
} from "@/content/guides";

export type GuideArcFilter = "all" | GuideArcSlug;
export type GuideTopicFilter = "all" | GuideTopicSlug;
export type GuideOrigin = "library" | "bookmarks";

export function parseSingleParam(
    value: string | string[] | undefined,
): string | undefined {
    return Array.isArray(value) ? value[0] : value;
}

export function parseGuideArcFilter(
    value: string | null | undefined,
): GuideArcFilter {
    if (!value) return "all";
    return GUIDE_ARCS.some((arc) => arc.slug === value)
        ? (value as GuideArcSlug)
        : "all";
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
    return value === "bookmarks" ? "bookmarks" : "library";
}

export function getGuideBySlug(slug: string): Guide | undefined {
    return GUIDES.find((guide) => guide.slug === slug);
}

export function getArcMeta(arc: GuideArcSlug) {
    return GUIDE_ARCS.find((item) => item.slug === arc);
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
    arcFilter: GuideArcFilter,
    topicFilter: GuideTopicFilter,
    query: string,
) {
    const normalizedQuery = query.trim().toLowerCase();

    return guides.filter((guide) => {
        const matchesArc = arcFilter === "all" ? true : guide.arc === arcFilter;
        const matchesTopic =
            topicFilter === "all" ? true : guide.topic === topicFilter;
        const matchesQuery =
            normalizedQuery.length === 0
                ? true
                : getSearchableGuideText(guide).includes(normalizedQuery);

        return matchesArc && matchesTopic && matchesQuery;
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
            guide.arc === currentGuide.arc &&
            guide.topic === currentGuide.topic,
    ).slice(0, limit);
}

export function getNextGuide(currentGuide: Guide) {
    if (!currentGuide.nextGuideSlug) return null;
    return getGuideBySlug(currentGuide.nextGuideSlug) ?? null;
}

function getArcGuides(arc: GuideArcSlug) {
    return GUIDES.filter((guide) => guide.arc === arc).sort(
        (a, b) => a.arcOrder - b.arcOrder,
    );
}

export function getArcProgress(arc: GuideArcSlug, bookmarkedSlugs: string[]) {
    const arcGuides = getArcGuides(arc);
    const readCount = arcGuides.filter((guide) =>
        bookmarkedSlugs.includes(guide.slug),
    ).length;
    const total = arcGuides.length;
    const completionPercent = total === 0 ? 0 : Math.round((readCount / total) * 100);
    const nextUnread = arcGuides.find(
        (guide) => !bookmarkedSlugs.includes(guide.slug),
    );

    return {
        readCount,
        total,
        completionPercent,
        nextUnread: nextUnread ?? null,
    };
}

export function buildGuideHref(
    guide: Pick<Guide, "arc" | "slug">,
    state: {
        arcFilter: GuideArcFilter;
        topicFilter: GuideTopicFilter;
        query: string;
        from: GuideOrigin;
    },
) {
    const params = new URLSearchParams();

    if (state.from === "bookmarks") {
        params.set("from", "bookmarks");
    }

    if (state.arcFilter !== "all") {
        params.set("arc", state.arcFilter);
    }

    if (state.topicFilter !== "all") {
        params.set("topic", state.topicFilter);
    }

    if (state.query.trim()) {
        params.set("q", state.query.trim());
    }

    const queryString = params.toString();
    const basePath = `/guides/${guide.arc}/${guide.slug}`;
    return queryString ? `${basePath}?${queryString}` : basePath;
}

export function buildBackHref(state: {
    arcFilter: GuideArcFilter;
    topicFilter: GuideTopicFilter;
    query: string;
    from: GuideOrigin;
}) {
    const params = new URLSearchParams();
    const basePath = state.from === "bookmarks" ? "/guides/bookmarks" : "/guides";

    if (state.arcFilter !== "all") {
        params.set("arc", state.arcFilter);
    }

    if (state.topicFilter !== "all") {
        params.set("topic", state.topicFilter);
    }

    if (state.query.trim()) {
        params.set("q", state.query.trim());
    }

    const queryString = params.toString();
    return queryString ? `${basePath}?${queryString}` : basePath;
}
