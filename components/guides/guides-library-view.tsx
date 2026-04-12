"use client";

import { startTransition, useDeferredValue } from "react";
import { Search, X } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";

import { GUIDE_CATEGORIES, GUIDES } from "@/content/guides";
import { GuideCard } from "@/components/guides/guide-card";
import { GuidesShell } from "@/components/guides/guides-shell";
import { useGuideBookmarks } from "@/hooks/use-guide-bookmarks";
import {
    buildGuideHref,
    filterGuides,
    getGuidesFromSlugs,
    parseGuideFilter,
    type GuideFilter,
    type GuideOrigin,
} from "@/lib/guides";
import { cn } from "@/lib/utils";

type GuidesLibraryViewProps = {
    mode: GuideOrigin;
};

const FILTER_OPTIONS: { value: GuideFilter; label: string }[] = [
    { value: "all", label: "All" },
    ...GUIDE_CATEGORIES.map((category) => ({
        value: category.slug,
        label: category.label,
    })),
    { value: "coming-soon", label: "More soon" },
];

export function GuidesLibraryView({ mode }: GuidesLibraryViewProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { bookmarks, hasHydrated, isBookmarked, toggleBookmark } =
        useGuideBookmarks();

    const activeFilter = parseGuideFilter(searchParams.get("category"));
    const rawQuery = searchParams.get("q") ?? "";
    const deferredQuery = useDeferredValue(rawQuery);

    const sourceGuides =
        mode === "bookmarks" ? getGuidesFromSlugs(bookmarks) : GUIDES;

    const visibleGuides = filterGuides(sourceGuides, activeFilter, deferredQuery);

    function updateParams(
        updater: (params: URLSearchParams) => void,
    ) {
        startTransition(() => {
            const nextParams = new URLSearchParams(searchParams.toString());
            updater(nextParams);

            const nextQuery = nextParams.toString();
            const nextHref = nextQuery ? `${pathname}?${nextQuery}` : pathname;

            window.history.replaceState(null, "", nextHref);
        });
    }

    const isBookmarksMode = mode === "bookmarks";
    const title = isBookmarksMode ? "My Bookmarks" : "Find the guide that closes your knowledge gap";
    const description = isBookmarksMode
        ? "Your saved guides, all in one place."
        : "Browse, search, and save practical guides to learn exactly what you need.";

    let emptyTitle = "No guides available";
    let emptyBody =
        "Try another category or return to All to browse the current guide library.";

    if (isBookmarksMode && hasHydrated && bookmarks.length === 0) {
        emptyTitle = "No bookmarks yet";
        emptyBody =
            "Save a guide from the library or a detail page and it will appear here.";
    } else if (rawQuery.trim()) {
        emptyTitle = "No results found";
        emptyBody =
            "Try a broader keyword like 'Myki', 'bulk billing' or 'budget'.";
    }

    return (
        <GuidesShell title={title} description={description}>
            <section className="rounded-[2rem] bg-minuri-white p-6 shadow-sm ring-1 ring-minuri-silver/40 md:p-8">
                <div className="grid gap-6">
                    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                        <div className="relative">
                            <label htmlFor="guide-search" className="sr-only">
                                Search guides
                            </label>
                            <Search
                                className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-minuri-slate"
                                aria-hidden="true"
                            />
                            <input
                                id="guide-search"
                                type="search"
                                value={rawQuery}
                                placeholder="Search topics like bulk billing, Myki or rent"
                                className="h-12 w-full rounded-full border border-minuri-silver bg-minuri-fog pl-12 pr-12 text-sm text-minuri-ocean outline-none ring-0 placeholder:text-minuri-slate focus:border-minuri-teal"
                                onChange={(event) =>
                                    updateParams((params) => {
                                        const nextValue = event.target.value.trimStart();

                                        if (nextValue) {
                                            params.set("q", nextValue);
                                        } else {
                                            params.delete("q");
                                        }
                                    })
                                }
                            />
                            {rawQuery ? (
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-minuri-white text-minuri-slate hover:bg-minuri-mist"
                                    aria-label="Clear search"
                                    onClick={() =>
                                        updateParams((params) => {
                                            params.delete("q");
                                        })
                                    }
                                >
                                    <X className="size-4" aria-hidden="true" />
                                </button>
                            ) : null}
                        </div>

                        <p className="text-sm font-medium text-minuri-slate">
                            {visibleGuides.length} guide{visibleGuides.length === 1 ? "" : "s"}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {FILTER_OPTIONS.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                className={cn(
                                    "min-h-11 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                                    activeFilter === option.value
                                        ? "bg-minuri-teal text-primary-foreground"
                                        : "bg-minuri-mist text-minuri-slate hover:bg-minuri-ice",
                                )}
                                onClick={() =>
                                    updateParams((params) => {
                                        if (option.value === "all") {
                                            params.delete("category");
                                            return;
                                        }

                                        params.set("category", option.value);
                                    })
                                }
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {isBookmarksMode && !hasHydrated ? (
                <section className="mt-8 rounded-[2rem] bg-minuri-white p-6 shadow-sm ring-1 ring-minuri-silver/40">
                    <p className="text-base leading-7 text-minuri-slate">
                        Loading bookmarks...
                    </p>
                </section>
            ) : visibleGuides.length > 0 ? (
                <section className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {visibleGuides.map((guide) => (
                        <GuideCard
                            key={guide.slug}
                            guide={guide}
                            href={buildGuideHref(guide.slug, {
                                filter: activeFilter,
                                query: rawQuery,
                                from: mode,
                            })}
                            bookmarked={isBookmarked(guide.slug)}
                            onToggleBookmark={toggleBookmark}
                        />
                    ))}
                </section>
            ) : (
                <section className="mt-8 rounded-[2rem] bg-minuri-white p-8 text-center shadow-sm ring-1 ring-minuri-silver/40">
                    <h2 className="text-2xl font-semibold tracking-tight text-minuri-ocean">
                        {emptyTitle}
                    </h2>
                    <p className="mt-4 mx-auto max-w-2xl text-base leading-7 text-minuri-slate">
                        {emptyBody}
                    </p>
                </section>
            )}
        </GuidesShell>
    );
}
