"use client";

import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";

import type { Guide } from "@/content/guides";
import type {
    GuideArcFilter,
    GuideOrigin,
    GuideTopicFilter,
} from "@/lib/guides";
import { Button } from "@/components/ui/button";
import { GuidesShell } from "@/components/guides/guides-shell";
import { RelatedGuides } from "@/components/guides/related-guides";
import { BookmarkButton } from "@/components/guides/bookmark-button";
import { getArcMeta, getNextGuide, getTopicMeta } from "@/lib/guides";
import { useGuideBookmarks } from "@/hooks/use-guide-bookmarks";

type GuideDetailViewProps = {
    guide: Guide;
    backHref: string;
    arcFilter: GuideArcFilter;
    topicFilter: GuideTopicFilter;
    query: string;
    from: GuideOrigin;
};

const SECTION_STYLE_MAP = {
    moment: "",
    feeling: "",
    reveal: "rounded-[1.25rem] border border-minuri-teal/30 bg-minuri-mist p-5",
    "how-it-works": "",
    bridge: "rounded-[1.25rem] border border-minuri-silver/50 bg-minuri-fog p-5",
    "next-chapter": "",
} as const;

export function GuideDetailView({
    guide,
    backHref,
    arcFilter,
    topicFilter,
    query,
    from,
}: GuideDetailViewProps) {
    const { bookmarks, isBookmarked, toggleBookmark } = useGuideBookmarks();
    const arcMeta = getArcMeta(guide.arc);
    const topicMeta = getTopicMeta(guide.topic);
    const nextGuide = getNextGuide(guide);

    return (
        <GuidesShell
            title="Read one chapter, take one action"
            description="Narrative guides designed for your first months of independent living."
        >
            <article className="rounded-[2rem] bg-minuri-white p-6 shadow-sm ring-1 ring-minuri-silver/40 md:p-8">
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                    <div>
                        <Link
                            href={backHref}
                            className="inline-flex items-center gap-2 text-xs font-medium text-minuri-mid hover:text-minuri-teal"
                        >
                            <ArrowLeft className="size-4" aria-hidden="true" />
                            Back to library
                        </Link>

                        <div className="mt-5 flex flex-wrap items-center gap-3">
                            <span className="rounded-full bg-minuri-mist px-3 py-2 text-xs font-medium text-minuri-mid">
                                {arcMeta?.timeframeLabel} · {arcMeta?.name}
                            </span>
                            <span className="rounded-full bg-minuri-fog px-3 py-2 text-xs text-minuri-slate">
                                {topicMeta?.name}
                            </span>
                            <span className="rounded-full bg-minuri-fog px-3 py-2 text-xs text-minuri-slate">
                                {guide.readingTimeMin} min read
                            </span>
                        </div>

                        <h1 className="mt-5 text-2xl font-semibold tracking-tight text-minuri-ocean md:text-4xl">
                            {guide.title}
                        </h1>

                        <p className="mt-4 max-w-3xl text-sm leading-6 text-minuri-slate md:text-base">
                            {guide.summary}
                        </p>
                    </div>

                    <BookmarkButton
                        active={isBookmarked(guide.slug)}
                        onToggle={() => toggleBookmark(guide.slug)}
                    />
                </div>

                <div className="mt-10 space-y-8">
                    {guide.sections.map((section) => (
                        <section
                            key={section.sectionKey}
                            className={SECTION_STYLE_MAP[section.sectionKey]}
                        >
                            <h2 className="text-xl font-semibold tracking-tight text-minuri-ocean">
                                {section.title}
                            </h2>
                            <div className="mt-4 space-y-4">
                                {section.body.map((paragraph, index) => (
                                    <p
                                        key={paragraph}
                                        className="text-sm leading-6 text-minuri-slate"
                                    >
                                        {section.sectionKey === "moment" && index === 0 ? (
                                            <span>
                                                <span className="mr-1 inline-block align-top font-hero-serif text-4xl leading-none text-minuri-ocean">
                                                    {paragraph.charAt(0)}
                                                </span>
                                                {paragraph.slice(1)}
                                            </span>
                                        ) : (
                                            paragraph
                                        )}
                                    </p>
                                ))}
                            </div>

                            {section.sectionKey === "bridge" ? (
                                <div className="mt-5">
                                    <Button asChild className="rounded-full px-5 text-xs">
                                        <Link href={guide.nearMeDeeplink}>
                                            Explore Near Me for this topic
                                        </Link>
                                    </Button>
                                </div>
                            ) : null}
                        </section>
                    ))}
                </div>

                {nextGuide ? (
                    <section className="mt-12 rounded-[2rem] bg-minuri-mist p-6 md:p-8">
                        <h2 className="text-xl font-semibold tracking-tight text-minuri-ocean">
                            Up next in this arc
                        </h2>
                        <p className="mt-3 max-w-2xl text-sm leading-6 text-minuri-slate">
                            {nextGuide.title}
                        </p>
                        <div className="mt-5">
                            <Button asChild className="rounded-full px-5 text-xs">
                                <Link href={`/guides/${nextGuide.arc}/${nextGuide.slug}`}>
                                    Read next chapter
                                </Link>
                            </Button>
                        </div>
                    </section>
                ) : null}

                {guide.sourceLinks.length > 0 ? (
                    <section className="mt-12">
                        <h2 className="text-xl font-semibold tracking-tight text-minuri-ocean">
                            Further reading
                        </h2>
                        <div className="mt-5 grid gap-3">
                            {guide.sourceLinks.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 rounded-[1.25rem] bg-minuri-fog px-4 py-3 text-xs font-medium text-minuri-mid hover:bg-minuri-ice"
                                >
                                    {link.label}
                                    <ExternalLink className="size-4" aria-hidden="true" />
                                </a>
                            ))}
                        </div>
                    </section>
                ) : null}

                <RelatedGuides
                    guide={guide}
                    arcFilter={arcFilter}
                    topicFilter={topicFilter}
                    query={query}
                    from={from}
                    bookmarkedSlugs={bookmarks}
                    onToggleBookmark={toggleBookmark}
                />
            </article>
        </GuidesShell>
    );
}
