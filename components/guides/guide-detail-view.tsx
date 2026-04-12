"use client";

import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";

import type { Guide } from "@/content/guides";
import type { GuideFilter, GuideOrigin } from "@/lib/guides";
import { Button } from "@/components/ui/button";
import { GuidesShell } from "@/components/guides/guides-shell";
import { GuideWidget } from "@/components/guides/guide-widget";
import { RelatedGuides } from "@/components/guides/related-guides";
import { BookmarkButton } from "@/components/guides/bookmark-button";
import {
    getCategoryMeta,
    getRelatedGuides,
} from "@/lib/guides";
import { useGuideBookmarks } from "@/hooks/use-guide-bookmarks";

type GuideDetailViewProps = {
    guide: Guide;
    backHref: string;
    filter: GuideFilter;
    query: string;
    from: GuideOrigin;
};

export function GuideDetailView({
    guide,
    backHref,
    filter,
    query,
    from,
}: GuideDetailViewProps) {
    const { bookmarks, isBookmarked, toggleBookmark } = useGuideBookmarks();
    const relatedGuides = getRelatedGuides(guide.slug, 2);
    const categoryMeta = getCategoryMeta(guide.category);

    return (
        <GuidesShell
            title="Read and act on one problem at a time"
            description="Step-by-step guides to help you handle real-life problems with confidence."
        >
            <article className="rounded-[2rem] bg-minuri-white p-6 shadow-sm ring-1 ring-minuri-silver/40 md:p-8">
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                    <div>
                        <Link
                            href={backHref}
                            className="inline-flex items-center gap-2 text-sm font-medium text-minuri-mid hover:text-minuri-teal"
                        >
                            <ArrowLeft className="size-4" aria-hidden="true" />
                            Back to library
                        </Link>

                        <div className="mt-5 flex flex-wrap items-center gap-3">
                            <span className="rounded-full bg-minuri-mist px-3 py-2 text-sm font-medium text-minuri-mid">
                                {categoryMeta?.label ?? guide.category}
                            </span>
                            <span className="rounded-full bg-minuri-fog px-3 py-2 text-sm text-minuri-slate">
                                {guide.readMinutes} min read
                            </span>
                        </div>

                        <h1 className="mt-5 text-3xl font-semibold tracking-tight text-minuri-ocean md:text-5xl">
                            {guide.title}
                        </h1>

                        <p className="mt-4 max-w-3xl text-base leading-7 text-minuri-slate md:text-lg">
                            {guide.summary}
                        </p>
                    </div>

                    <BookmarkButton
                        active={isBookmarked(guide.slug)}
                        onToggle={() => toggleBookmark(guide.slug)}
                    />
                </div>

                <div className="mt-10 space-y-10">
                    {guide.sections.map((section) => (
                        <section key={section.heading}>
                            <h2 className="text-2xl font-semibold tracking-tight text-minuri-ocean">
                                {section.heading}
                            </h2>

                            <div className="mt-4 space-y-4">
                                {section.body.map((paragraph) => (
                                    <p
                                        key={paragraph}
                                        className="text-base leading-7 text-minuri-slate"
                                    >
                                        {paragraph}
                                    </p>
                                ))}
                            </div>

                            {section.checklist ? (
                                <ul className="mt-5 space-y-3 rounded-[1.5rem] bg-minuri-fog p-5 text-base leading-7 text-minuri-slate">
                                    {section.checklist.map((item) => (
                                        <li key={item} className="flex gap-3">
                                            <span
                                                className="mt-2 size-2 rounded-full bg-minuri-teal"
                                                aria-hidden="true"
                                            />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : null}
                        </section>
                    ))}
                </div>

                {guide.widget ? (
                    <div className="mt-12">
                        <GuideWidget widget={guide.widget} />
                    </div>
                ) : null}

                {guide.cta ? (
                    <section className="mt-12 rounded-[2rem] bg-minuri-mist p-6 md:p-8">
                        <h2 className="text-2xl font-semibold tracking-tight text-minuri-ocean">
                            Ready for the next step?
                        </h2>
                        <p className="mt-3 max-w-2xl text-base leading-7 text-minuri-slate">
                            Small steps lead to big changes. Start with one today.
                        </p>

                        <div className="mt-5">
                            <Button asChild className="rounded-full px-5">
                                <Link href={guide.cta.href}>{guide.cta.label}</Link>
                            </Button>
                        </div>
                    </section>
                ) : null}

                <section className="mt-12">
                    <h2 className="text-2xl font-semibold tracking-tight text-minuri-ocean">
                        Further reading
                    </h2>
                    <div className="mt-5 grid gap-3">
                        {guide.sourceLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 rounded-[1.25rem] bg-minuri-fog px-4 py-3 text-sm font-medium text-minuri-mid hover:bg-minuri-ice"
                            >
                                {link.label}
                                <ExternalLink className="size-4" aria-hidden="true" />
                            </a>
                        ))}
                    </div>
                </section>

                <RelatedGuides
                    guides={relatedGuides}
                    filter={filter}
                    query={query}
                    from={from}
                    bookmarkedSlugs={bookmarks}
                    onToggleBookmark={toggleBookmark}
                />
            </article>
        </GuidesShell>
    );
}
