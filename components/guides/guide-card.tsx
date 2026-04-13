"use client";

import Link from "next/link";
import {
    ArrowRight,
    FileText,
    HeartPulse,
    Map,
    Wallet,
    Users,
    type LucideIcon,
} from "lucide-react";

import type { Guide, GuideCategory } from "@/content/guides";
import { Button } from "@/components/ui/button";
import { getCategoryMeta } from "@/lib/guides";
import { BookmarkButton } from "@/components/guides/bookmark-button";

const CATEGORY_ICONS: Record<GuideCategory, LucideIcon> = {
    setup: FileText,
    survive: Wallet,
    "get-around": Map,
    health: HeartPulse,
    connect: Users,
};

type GuideCardProps = {
    guide: Guide;
    href: string;
    bookmarked: boolean;
    onToggleBookmark: (slug: string) => void;
};

export function GuideCard({
    guide,
    href,
    bookmarked,
    onToggleBookmark,
}: GuideCardProps) {
    const categoryMeta = getCategoryMeta(guide.category);
    const Icon = CATEGORY_ICONS[guide.category];

    return (
        <article className="flex h-full flex-col rounded-[2rem] bg-minuri-white p-5 shadow-sm ring-1 ring-minuri-silver/40 md:p-6">
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2 rounded-full bg-minuri-mist px-3 py-2 text-xs font-medium text-minuri-mid">
                    <Icon className="size-4" aria-hidden="true" />
                    <span>{categoryMeta?.label ?? guide.category}</span>
                </div>

                <BookmarkButton
                    active={bookmarked}
                    onToggle={() => onToggleBookmark(guide.slug)}
                />
            </div>

            <h2 className="mt-5 text-xl font-semibold tracking-tight text-minuri-ocean">
                {guide.title}
            </h2>

            <div className="mt-3 flex items-center gap-2 text-xs text-minuri-slate">
                <span className="rounded-full bg-minuri-fog px-3 py-1">
                    {guide.readMinutes} min read
                </span>
            </div>

            <p className="mt-4 flex-1 text-sm leading-6 text-minuri-slate">
                {guide.summary}
            </p>

            <div className="mt-6">
                <Button asChild className="rounded-full px-5 text-xs">
                    <Link href={href}>
                        Read guide
                        <ArrowRight className="size-4" aria-hidden="true" />
                    </Link>
                </Button>
            </div>
        </article>
    );
}
