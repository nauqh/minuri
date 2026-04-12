"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

type GuidesShellProps = {
    title: string;
    description: string;
    children: ReactNode;
};

export function GuidesShell({
    title,
    description,
    children,
}: GuidesShellProps) {
    const pathname = usePathname();

    const links = [
        {
            href: "/",
            label: "Home",
            active: pathname === "/",
        },
        {
            href: "/guides",
            label: "Guides",
            active:
                pathname === "/guides" ||
                (pathname.startsWith("/guides/") &&
                    pathname !== "/guides/bookmarks"),
        },
        {
            href: "/guides/bookmarks",
            label: "My Bookmarks",
            active: pathname === "/guides/bookmarks",
        },
        {
            href: "/near-me",
            label: "Near Me",
            active: pathname === "/near-me",
        },
    ] as const;

    return (
        <div className="min-h-screen bg-minuri-fog text-foreground">
            <header className="sticky top-0 z-40 border-b border-minuri-silver/70 bg-minuri-white/90 backdrop-blur">
                <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 md:px-8 md:py-5">
                    <div className="flex items-center justify-between gap-4">
                        <Link
                            href="/"
                            className="text-xl font-semibold tracking-tight text-minuri-ocean"
                        >
                            Minuri
                        </Link>
                        <nav
                            aria-label="Guides navigation"
                            className="flex flex-wrap justify-end gap-2"
                        >
                            {links.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                                        link.active
                                            ? "bg-minuri-teal text-primary-foreground"
                                            : "bg-minuri-mist text-minuri-slate hover:bg-minuri-ice",
                                    )}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    <div className="rounded-[2rem] bg-minuri-white p-6 shadow-sm ring-1 ring-minuri-silver/40 md:p-8">
                        <p className="text-sm font-medium uppercase tracking-[0.18em] text-minuri-teal">
                            Knowledge is Power · Your First-time Guides
                        </p>
                        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-minuri-ocean md:text-5xl">
                            {title}
                        </h1>
                        <p className="mt-4 max-w-3xl text-base leading-7 text-minuri-slate md:text-lg">
                            {description}
                        </p>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-10">
                {children}
            </main>
        </div>
    );
}
