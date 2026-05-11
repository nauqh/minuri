"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const TABS = [
    { label: "Library", href: "/guides" },
    { label: "Journeys", href: "/guides/journeys" },
    { label: "Bookmarks", href: "/guides/bookmarks" },
] as const;

export function GuidesTabNav() {
    const pathname = usePathname();

    return (
        <div className="mb-8 flex justify-center">
            <nav
                className="inline-flex rounded-full border border-minuri-silver/70 bg-minuri-white p-1 shadow-sm"
                aria-label="Guides sections"
            >
                {TABS.map((tab) => {
                    const isActive =
                        tab.href === "/guides"
                            ? pathname === "/guides"
                            : pathname.startsWith(tab.href);

                    return (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            aria-current={isActive ? "page" : undefined}
                            className={cn(
                                "rounded-full px-5 py-1.5 text-sm font-medium transition-colors duration-150",
                                isActive
                                    ? "bg-minuri-ocean text-minuri-white"
                                    : "text-minuri-slate hover:bg-minuri-fog hover:text-minuri-ocean",
                            )}
                        >
                            {tab.label}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
