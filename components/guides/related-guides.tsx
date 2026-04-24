"use client";

import type { Guide } from "@/content/guides";
import type {
    GuideArcFilter,
    GuideOrigin,
    GuideTopicFilter,
} from "@/lib/guides";
import { buildGuideHref, getRelatedGuides } from "@/lib/guides";
import { GuideCard } from "@/components/guides/guide-card";

type RelatedGuidesProps = {
    guide: Guide;
    arcFilter: GuideArcFilter;
    topicFilter: GuideTopicFilter;
    query: string;
    from: GuideOrigin;
    bookmarkedSlugs: string[];
    onToggleBookmark: (slug: string) => void;
};

export function RelatedGuides({
    guide,
    arcFilter,
    topicFilter,
    query,
    from,
    bookmarkedSlugs,
    onToggleBookmark,
}: RelatedGuidesProps) {
    const guides = getRelatedGuides(guide.slug, 2);
    if (guides.length === 0) {
        return null;
    }

    return (
        <section className="mt-12">
            <h2 className="text-xl font-semibold tracking-tight text-minuri-ocean">
                More in this arc
            </h2>
            <p className="mt-3 text-sm leading-6 text-minuri-slate">
                Keep going with related chapters in the same stage of your journey.
            </p>

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
                {guides.map((relatedGuide) => (
                    <GuideCard
                        key={relatedGuide.slug}
                        guide={relatedGuide}
                        href={buildGuideHref(relatedGuide, {
                            arcFilter,
                            topicFilter,
                            query,
                            from,
                        })}
                        bookmarked={bookmarkedSlugs.includes(relatedGuide.slug)}
                        onToggleBookmark={onToggleBookmark}
                    />
                ))}
            </div>
        </section>
    );
}
