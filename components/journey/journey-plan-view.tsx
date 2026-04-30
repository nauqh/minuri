"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Compass,
    HeartPulse,
    Home,
    RotateCcw,
    Sandwich,
    Users,
    type LucideIcon,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import type { GuideTopicSlug } from "@/content/guides";
import { cn } from "@/lib/utils";
import { useJourneyState } from "@/hooks/use-journey-state";
import { useGuideBookmarks } from "@/hooks/use-guide-bookmarks";
import { GuideCard } from "@/components/guides/guide-card";
import { JourneyNearbyPanel } from "@/components/journey/journey-nearby-panel";
import {
    buildWeekPlan,
    type DayPlan,
} from "@/lib/journey-week";

const TOPIC_ICONS: Record<GuideTopicSlug, LucideIcon> = {
    "food-eating": Sandwich,
    "getting-around": Compass,
    "health-wellbeing": HeartPulse,
    "home-admin": Home,
    "social-belonging": Users,
};

const TOPIC_COLORS: Record<
    GuideTopicSlug,
    { bg: string; text: string; border: string; iconBg: string }
> = {
    "food-eating": {
        bg: "bg-orange-50",
        text: "text-orange-700",
        border: "border-orange-200",
        iconBg: "bg-orange-100",
    },
    "getting-around": {
        bg: "bg-sky-50",
        text: "text-sky-700",
        border: "border-sky-200",
        iconBg: "bg-sky-100",
    },
    "health-wellbeing": {
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-200",
        iconBg: "bg-emerald-100",
    },
    "home-admin": {
        bg: "bg-violet-50",
        text: "text-violet-700",
        border: "border-violet-200",
        iconBg: "bg-violet-100",
    },
    "social-belonging": {
        bg: "bg-rose-50",
        text: "text-rose-700",
        border: "border-rose-200",
        iconBg: "bg-rose-100",
    },
};

function DayTab({
    plan,
    active,
    onClick,
}: {
    plan: DayPlan;
    active: boolean;
    onClick: () => void;
}) {
    const Icon = TOPIC_ICONS[plan.topicSlug];
    const colors = TOPIC_COLORS[plan.topicSlug];

    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={active}
            className={cn(
                "group flex min-w-[5.5rem] flex-col items-center gap-1.5 rounded-2xl border px-3 py-3 text-center transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-minuri-teal/60",
                active
                    ? "border-minuri-teal bg-minuri-teal shadow-sm"
                    : "border-minuri-silver/70 bg-minuri-white hover:border-minuri-teal/40 hover:bg-minuri-fog",
            )}
        >
            <span
                className={cn(
                    "text-[10px] font-bold uppercase tracking-[0.12em]",
                    active ? "text-primary-foreground/70" : "text-minuri-slate",
                )}
            >
                Day {plan.day}
            </span>
            <span
                className={cn(
                    "flex size-9 items-center justify-center rounded-xl",
                    active ? "bg-white/20" : colors.iconBg,
                )}
            >
                <Icon
                    className={cn(
                        "size-4.5",
                        active ? "text-primary-foreground" : colors.text,
                    )}
                    aria-hidden
                />
            </span>
            <span
                className={cn(
                    "text-[11px] font-semibold leading-tight",
                    active ? "text-primary-foreground" : "text-minuri-ocean",
                )}
            >
                {plan.shortLabel}
            </span>
        </button>
    );
}

function DayContent({
    plan,
    suburb,
    isBookmarked,
    toggleBookmark,
}: {
    plan: DayPlan;
    suburb: string;
    isBookmarked: (slug: string) => boolean;
    toggleBookmark: (slug: string) => void;
}) {
    const prefersReducedMotion = useReducedMotion();
    const colors = TOPIC_COLORS[plan.topicSlug];
    const Icon = TOPIC_ICONS[plan.topicSlug];

    return (
        <motion.div
            key={plan.day}
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -8 }}
            transition={{ duration: prefersReducedMotion ? 0.01 : 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
            {/* Day header */}
            <div className="mb-6 flex items-start gap-4">
                <div
                    className={cn(
                        "flex size-12 shrink-0 items-center justify-center rounded-2xl",
                        colors.iconBg,
                    )}
                >
                    <Icon className={cn("size-5", colors.text)} aria-hidden />
                </div>
                <div>
                    <p
                        className={cn(
                            "text-xs font-semibold uppercase tracking-[0.13em]",
                            colors.text,
                        )}
                    >
                        Day {plan.day} · {plan.theme}
                    </p>
                    <p className="mt-1.5 text-base leading-relaxed text-minuri-slate md:text-[1.06rem] md:leading-8">
                        {plan.narrative}
                    </p>
                </div>
            </div>

            {/* Guides */}
            <div className="grid gap-6 sm:grid-cols-2">
                {plan.guides.map((guide, index) => (
                    <GuideCard
                        key={guide.slug}
                        guide={guide}
                        href={`/guides/${guide.arc}/${guide.slug}?suburb=${encodeURIComponent(suburb)}&from=journey`}
                        bookmarked={isBookmarked(guide.slug)}
                        onToggleBookmark={toggleBookmark}
                        animationDelay={index * 0.06}
                    />
                ))}
            </div>
        </motion.div>
    );
}

export function JourneyPlanView() {
    const router = useRouter();
    const { journeyState, hydrated, clearJourney } = useJourneyState();
    const { isBookmarked, toggleBookmark } = useGuideBookmarks();
    const prefersReducedMotion = useReducedMotion();
    const scrollRef = useRef<HTMLDivElement>(null);

    const [activeDay, setActiveDay] = useState(1);
    const revealTransition = {
        duration: prefersReducedMotion ? 0.01 : 0.45,
        ease: [0.22, 1, 0.36, 1] as const,
    };

    useEffect(() => {
        if (!hydrated) return;
        if (!journeyState) router.replace("/journey");
    }, [hydrated, journeyState, router]);

    if (!hydrated || !journeyState) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-minuri-white">
                <div className="size-8 animate-spin rounded-full border-2 border-minuri-silver border-t-minuri-teal" />
            </div>
        );
    }

    const { suburb, selectedTopics, yourMoment } = journeyState;
    const weekPlan = buildWeekPlan(selectedTopics);
    const currentDay = weekPlan.find((d) => d.day === activeDay) ?? weekPlan[0];

    const truncatedMoment =
        yourMoment.length > 120
            ? yourMoment.slice(0, 117).trimEnd() + "..."
            : yourMoment;

    function handleStartOver() {
        clearJourney();
        router.push("/journey");
    }

    function selectDay(day: number) {
        setActiveDay(day);
        scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    return (
        <div className="min-h-screen bg-minuri-white text-minuri-ink">
            {/* Header */}
            <header className="border-b border-minuri-silver/60 px-6 py-4 md:px-10">
                <div className="mx-auto flex max-w-screen-xl items-center justify-between">
                    <Link
                        href="/"
                        className="text-2xl font-black uppercase tracking-tight text-minuri-ocean"
                    >
                        Minuri
                    </Link>
                    <button
                        type="button"
                        onClick={handleStartOver}
                        className="inline-flex items-center gap-2 rounded-full border border-minuri-silver/80 px-4 py-2 text-sm font-medium text-minuri-slate transition-colors hover:border-minuri-teal/50 hover:text-minuri-teal"
                    >
                        <RotateCcw className="size-3.5" aria-hidden />
                        Start over
                    </button>
                </div>
            </header>

            <main className="mx-auto max-w-screen-xl px-6 py-10 md:px-10 md:py-12">
                {/* Hero intro */}
                <motion.div
                    className="mb-10"
                    initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10% 0px -8% 0px" }}
                    transition={revealTransition}
                >
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-minuri-teal">
                        Your guide journey
                    </p>
                    <h1 className="mt-2 text-2xl font-black leading-tight text-minuri-ocean md:text-3xl">
                        Your first week in {suburb}
                    </h1>

                    {truncatedMoment && (
                        <motion.div
                            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: prefersReducedMotion ? 0.01 : 0.4, delay: 0.1 }}
                            className="mt-4 flex gap-3 rounded-xl border border-minuri-silver/60 bg-minuri-fog/50 px-4 py-3.5"
                        >
                            <span className="mt-0.5 text-xl leading-none text-minuri-silver">
                                "
                            </span>
                            <p className="text-sm italic leading-relaxed text-minuri-slate">
                                {truncatedMoment}
                            </p>
                        </motion.div>
                    )}

                    <p className="mt-4 text-sm text-minuri-slate">
                        One focus per day. Seven days to get settled. Each day
                        has a guide to read and services to find near you.
                    </p>
                </motion.div>

                <div className="grid gap-10 lg:grid-cols-[1fr_22rem] lg:gap-12">
                    <motion.div
                        initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-8% 0px -6% 0px" }}
                        transition={{
                            ...revealTransition,
                            delay: prefersReducedMotion ? 0 : 0.05,
                        }}
                    >
                        {/* Day tab strip */}
                        <div
                            className="mb-8 flex gap-2.5 overflow-x-auto pb-1"
                            role="tablist"
                            aria-label="Week days"
                        >
                            {weekPlan.map((plan) => (
                                <DayTab
                                    key={plan.day}
                                    plan={plan}
                                    active={plan.day === activeDay}
                                    onClick={() => selectDay(plan.day)}
                                />
                            ))}
                        </div>

                        {/* Day content */}
                        <div ref={scrollRef} className="rounded-2xl border border-minuri-silver/60 bg-minuri-white p-6 md:p-8">
                            <AnimatePresence mode="wait">
                                {currentDay && (
                                    <DayContent
                                        plan={currentDay}
                                        suburb={suburb}
                                        isBookmarked={isBookmarked}
                                        toggleBookmark={toggleBookmark}
                                    />
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Day navigation */}
                        <div className="mt-4 flex items-center justify-between">
                            <button
                                type="button"
                                onClick={() =>
                                    selectDay(Math.max(activeDay - 1, 1))
                                }
                                disabled={activeDay === 1}
                                className="rounded-full border border-minuri-silver/70 px-4 py-2 text-sm font-medium text-minuri-slate transition-colors hover:border-minuri-teal/40 hover:text-minuri-teal disabled:pointer-events-none disabled:opacity-30"
                            >
                                ← Previous day
                            </button>
                            <span className="text-xs text-minuri-slate">
                                Day {activeDay} of {weekPlan.length}
                            </span>
                            <button
                                type="button"
                                onClick={() =>
                                    selectDay(
                                        Math.min(activeDay + 1, weekPlan.length),
                                    )
                                }
                                disabled={activeDay === weekPlan.length}
                                className="rounded-full border border-minuri-silver/70 px-4 py-2 text-sm font-medium text-minuri-slate transition-colors hover:border-minuri-teal/40 hover:text-minuri-teal disabled:pointer-events-none disabled:opacity-30"
                            >
                                Next day →
                            </button>
                        </div>
                    </motion.div>

                    {/* Sidebar: services near you */}
                    <motion.aside
                        className="lg:sticky lg:top-6 lg:self-start"
                        initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-8% 0px -8% 0px" }}
                        transition={{
                            ...revealTransition,
                            delay: prefersReducedMotion ? 0 : 0.1,
                        }}
                    >
                        <JourneyNearbyPanel suburb={suburb} />

                        {/* Week overview */}
                        <div className="mt-6 rounded-2xl border border-minuri-silver/60 bg-minuri-fog/40 px-5 py-5">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-minuri-mid">
                                This week at a glance
                            </p>
                            <ol className="mt-4 space-y-2.5">
                                {weekPlan.map((plan) => {
                                    const Icon = TOPIC_ICONS[plan.topicSlug];
                                    const colors = TOPIC_COLORS[plan.topicSlug];
                                    const isActive = plan.day === activeDay;
                                    return (
                                        <li key={plan.day}>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    selectDay(plan.day)
                                                }
                                                className={cn(
                                                    "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors",
                                                    isActive
                                                        ? "bg-minuri-teal/10 text-minuri-ocean"
                                                        : "hover:bg-minuri-silver/20 text-minuri-slate",
                                                )}
                                            >
                                                <span
                                                    className={cn(
                                                        "flex size-6 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold",
                                                        isActive
                                                            ? "bg-minuri-teal text-white"
                                                            : colors.iconBg +
                                                              " " +
                                                              colors.text,
                                                    )}
                                                >
                                                    {plan.day}
                                                </span>
                                                <span>
                                                    <span
                                                        className={cn(
                                                            "block text-xs font-semibold",
                                                            isActive
                                                                ? "text-minuri-teal"
                                                                : "text-minuri-ocean",
                                                        )}
                                                    >
                                                        {plan.theme}
                                                    </span>
                                                    <span className="block truncate text-[11px] text-minuri-slate">
                                                        {plan.guides[0]?.title}
                                                    </span>
                                                </span>
                                            </button>
                                        </li>
                                    );
                                })}
                            </ol>
                        </div>
                    </motion.aside>
                </div>
            </main>
        </div>
    );
}
