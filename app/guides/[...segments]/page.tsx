import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";

import { GUIDE_ARCS, GUIDES } from "@/content/guides";
import { GuideDetailView } from "@/components/guides/guide-detail-view";
import { GuidesLibraryView } from "@/components/guides/guides-library-view";
import { ScrollToTopButton } from "@/components/landing/scroll-to-top-button";
import {
    buildBackHref,
    getGuideBySlug,
    parseGuideArcFilter,
    parseGuideOrigin,
    parseGuideTopicFilter,
    parseSingleParam,
} from "@/lib/guides";

export const dynamicParams = false;

export function generateStaticParams() {
    const arcParams = GUIDE_ARCS.map((arc) => ({
        segments: [arc.slug],
    }));

    const guideParams = GUIDES.map((guide) => ({
        segments: [guide.arc, guide.slug],
    }));

    const legacyParams = GUIDES.map((guide) => ({
        segments: [guide.slug],
    }));

    return [...arcParams, ...guideParams, ...legacyParams];
}

export default async function GuidesSegmentsPage({
    params,
    searchParams,
}: {
    params: Promise<{ segments: string[] }>;
    searchParams: Promise<{
        arc?: string | string[];
        topic?: string | string[];
        q?: string | string[];
        from?: string | string[];
    }>;
}) {
    const { segments } = await params;

    if (segments.length === 1) {
        const [single] = segments;
        const arcMatch = GUIDE_ARCS.find((arc) => arc.slug === single);

        if (arcMatch) {
            return (
                <>
                    <Suspense fallback={null}>
                        <GuidesLibraryView mode="library" initialArc={arcMatch.slug} />
                    </Suspense>
                    <ScrollToTopButton trackedSectionIds={[]} />
                </>
            );
        }

        const legacyGuide = getGuideBySlug(single);
        if (!legacyGuide) {
            notFound();
        }

        redirect(`/guides/${legacyGuide.arc}/${legacyGuide.slug}`);
    }

    if (segments.length === 2) {
        const [arc, slug] = segments;
        const guide = getGuideBySlug(slug);

        if (!guide) {
            notFound();
        }

        if (guide.arc !== arc) {
            redirect(`/guides/${guide.arc}/${slug}`);
        }

        const incomingSearchParams = await searchParams;

        const arcFilter = parseGuideArcFilter(
            parseSingleParam(incomingSearchParams.arc),
        );
        const topicFilter = parseGuideTopicFilter(
            parseSingleParam(incomingSearchParams.topic),
        );
        const query = parseSingleParam(incomingSearchParams.q) ?? "";
        const from = parseGuideOrigin(parseSingleParam(incomingSearchParams.from));

        return (
            <>
                <GuideDetailView
                    guide={guide}
                    backHref={buildBackHref({ arcFilter, topicFilter, query, from })}
                    arcFilter={arcFilter}
                    topicFilter={topicFilter}
                    query={query}
                    from={from}
                />
                <ScrollToTopButton trackedSectionIds={[]} />
            </>
        );
    }

    notFound();
}
