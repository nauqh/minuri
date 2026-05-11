import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";

import { GUIDES } from "@/content/guides";
import { GuideDetailView } from "@/components/guides/guide-detail-view";
import { ScrollToTopButton } from "@/components/landing/scroll-to-top-button";
import {
    buildBackHref,
    getGuideBySlug,
    parseGuideOrigin,
    parseGuideTopicFilter,
    parseSingleParam,
} from "@/lib/guides";

export const dynamicParams = false;

export function generateStaticParams() {
    return GUIDES.map((guide) => ({
        segments: [guide.slug],
    }));
}

export default async function GuidesSegmentsPage({
    params,
    searchParams,
}: {
    params: Promise<{ segments: string[] }>;
    searchParams: Promise<{
        topic?: string | string[];
        q?: string | string[];
        from?: string | string[];
        suburb?: string | string[];
    }>;
}) {
    const { segments } = await params;

    if (segments.length === 2) {
        const [, slug] = segments;
        redirect(`/guides/${slug}`);
    }

    if (segments.length !== 1) {
        notFound();
    }

    const [slug] = segments;
    const guide = getGuideBySlug(slug);

    if (!guide) {
        notFound();
    }

    const incomingSearchParams = await searchParams;

    const topicFilter = parseGuideTopicFilter(
        parseSingleParam(incomingSearchParams.topic),
    );
    const query = parseSingleParam(incomingSearchParams.q) ?? "";
    const from = parseGuideOrigin(parseSingleParam(incomingSearchParams.from));
    const suburb = parseSingleParam(incomingSearchParams.suburb);

    return (
        <>
            <GuideDetailView
                guide={guide}
                backHref={buildBackHref({ topicFilter, query, from })}
                topicFilter={topicFilter}
                query={query}
                from={from}
                suburb={suburb}
            />
            <ScrollToTopButton />
        </>
    );
}
