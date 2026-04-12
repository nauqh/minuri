"use client";

import type { Guide } from "@/content/guides";
import type { GuideFilter, GuideOrigin } from "@/lib/guides";
import { buildGuideHref } from "@/lib/guides";
import { GuideCard } from "@/components/guides/guide-card";

type RelatedGuidesProps = {
    guides: Guide[];
    filter: GuideFilter;
    query: string;
    from: GuideOrigin;
    bookmarkedSlugs: string[];
    onToggleBookmark: (slug: string) => void;
};

export function RelatedGuides({
    guides,
    filter,
    query,
    from,
    bookmarkedSlugs,
    onToggleBookmark,
}: RelatedGuidesProps) {
    if (guides.length === 0) {
        return null;
    }

    return (
        <section className="mt-12">
            <h2 className="text-2xl font-semibold tracking-tight text-minuri-ocean">
                Related guides
            </h2>
            <p className="mt-3 text-base leading-7 text-minuri-slate">
                More guides related to what you're reading.
            </p>

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
                {guides.map((guide) => (
                    <GuideCard
                        key={guide.slug}
                        guide={guide}
                        href={buildGuideHref(guide.slug, { filter, query, from })}
                        bookmarked={bookmarkedSlugs.includes(guide.slug)}
                        onToggleBookmark={onToggleBookmark}
                    />
                ))}
            </div>
        </section>
    );
}
