import { notFound } from "next/navigation";

import { GUIDES } from "@/content/guides";
import { GuideDetailView } from "@/components/guides/guide-detail-view";
import {
    buildBackHref,
    getGuideBySlug,
    parseGuideFilter,
    parseGuideOrigin,
    parseSingleParam,
} from "@/lib/guides";

export const dynamicParams = false;

export function generateStaticParams() {
    return GUIDES.map((guide) => ({
        slug: guide.slug,
    }));
}

export default async function GuideDetailPage({
    params,
    searchParams,
}: {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{
        category?: string | string[];
        q?: string | string[];
        from?: string | string[];
    }>;
}) {
    const { slug } = await params;
    const guide = getGuideBySlug(slug);

    if (!guide) {
        notFound();
    }

    const incomingSearchParams = await searchParams;

    const filter = parseGuideFilter(
        parseSingleParam(incomingSearchParams.category),
    );
    const query = parseSingleParam(incomingSearchParams.q) ?? "";
    const from = parseGuideOrigin(
        parseSingleParam(incomingSearchParams.from),
    );

    return (
        <GuideDetailView
            guide={guide}
            backHref={buildBackHref({ filter, query, from })}
            filter={filter}
            query={query}
            from={from}
        />
    );
}
