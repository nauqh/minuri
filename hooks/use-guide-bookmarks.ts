"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "minuri:guide-bookmarks:v1";

function normaliseBookmarks(input: string[]) {
    return Array.from(new Set(input));
}

function readBookmarks() {
    if (typeof window === "undefined") {
        return [];
    }

    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) {
        return [];
    }

    try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed)
            ? normaliseBookmarks(
                parsed.filter((item): item is string => typeof item === "string"),
            )
            : [];
    } catch {
        return [];
    }
}

function writeBookmarks(bookmarks: string[]) {
    window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(normaliseBookmarks(bookmarks)),
    );
}

export function useGuideBookmarks() {
    const [bookmarks, setBookmarks] = useState<string[]>([]);
    const [hasHydrated, setHasHydrated] = useState(false);

    useEffect(() => {
        setBookmarks(readBookmarks());
        setHasHydrated(true);

        const handleStorage = (event: StorageEvent) => {
            if (event.key === STORAGE_KEY) {
                setBookmarks(readBookmarks());
            }
        };

        window.addEventListener("storage", handleStorage);
        return () => window.removeEventListener("storage", handleStorage);
    }, []);

    function toggleBookmark(slug: string) {
        setBookmarks((current) => {
            const next = current.includes(slug)
                ? current.filter((item) => item !== slug)
                : [...current, slug];

            writeBookmarks(next);
            return normaliseBookmarks(next);
        });
    }

    return {
        bookmarks,
        hasHydrated,
        bookmarkCount: bookmarks.length,
        isBookmarked: (slug: string) => bookmarks.includes(slug),
        toggleBookmark,
    };
}
