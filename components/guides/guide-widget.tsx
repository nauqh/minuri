"use client";

import { useState } from "react";

import type { Guide } from "@/content/guides";
import { getWidgetData } from "@/lib/guides";
import { cn } from "@/lib/utils";

type GuideWidgetProps = {
    widget: NonNullable<Guide["widget"]>;
};

export function GuideWidget({ widget }: GuideWidgetProps) {
    const items = getWidgetData(widget.key);

    if (!items || items.length === 0) {
        return (
            <section className="rounded-[2rem] border border-dashed border-minuri-silver bg-minuri-white p-6">
                <h2 className="text-2xl font-semibold tracking-tight text-minuri-ocean">
                    {widget.title}
                </h2>
                <p className="mt-3 text-base leading-7 text-minuri-slate">
                    Data unavailable.
                </p>
            </section>
        );
    }

    const groups = ["All", ...Array.from(new Set(items.map((item) => item.group)))];
    const [activeGroup, setActiveGroup] = useState("All");

    const visibleItems =
        activeGroup === "All"
            ? items
            : items.filter((item) => item.group === activeGroup);

    return (
        <section className="rounded-[2rem] bg-minuri-white p-6 shadow-sm ring-1 ring-minuri-silver/40 md:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <p className="text-sm font-medium uppercase tracking-[0.16em] text-minuri-teal">
                        Demo widget
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight text-minuri-ocean">
                        {widget.title}
                    </h2>
                    <p className="mt-3 max-w-3xl text-base leading-7 text-minuri-slate">
                        {widget.description}
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    {groups.map((group) => (
                        <button
                            key={group}
                            type="button"
                            className={cn(
                                "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                                group === activeGroup
                                    ? "bg-minuri-teal text-primary-foreground"
                                    : "bg-minuri-mist text-minuri-slate hover:bg-minuri-ice",
                            )}
                            onClick={() => setActiveGroup(group)}
                        >
                            {group}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
                {visibleItems.map((item) => (
                    <article
                        key={item.id}
                        className="rounded-[1.5rem] bg-minuri-fog p-5 ring-1 ring-minuri-silver/30"
                    >
                        <div className="flex items-center justify-between gap-3">
                            <h3 className="text-lg font-semibold text-minuri-ocean">
                                {item.name}
                            </h3>
                            <span className="rounded-full bg-minuri-white px-3 py-1 text-xs font-medium text-minuri-mid">
                                {item.group}
                            </span>
                        </div>
                        <p className="mt-2 text-sm font-medium text-minuri-mid">
                            {item.area}
                        </p>
                        <p className="mt-3 text-sm leading-6 text-minuri-slate">
                            {item.detail}
                        </p>
                        <p className="mt-3 text-sm leading-6 text-minuri-slate">
                            {item.note}
                        </p>
                    </article>
                ))}
            </div>
        </section>
    );
}
