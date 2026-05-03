"use client";

import { useCallback, useEffect, useState } from "react";
import type { GuideTopicSlug } from "@/content/guides";

export type JourneyState = {
    yourMoment: string;
    suburb: string;
    selectedTopics: GuideTopicSlug[];
    alreadySorted: string[];
};

const STORAGE_KEY = "minuri:journey:v2";
const COMPLETED_KEY = "minuri:journey:completed";

export function useJourneyState() {
    const [state, setState] = useState<JourneyState | null>(null);
    const [hydrated, setHydrated] = useState(false);
    const [completedDays, setCompletedDays] = useState<Set<number>>(new Set());

    useEffect(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) setState(JSON.parse(raw) as JourneyState);
            const comp = localStorage.getItem(COMPLETED_KEY);
            if (comp) setCompletedDays(new Set(JSON.parse(comp) as number[]));
        } catch { /* ignore */ }
        setHydrated(true);
    }, []);

    const saveJourney = useCallback((next: JourneyState) => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch { /* ignore */ }
        setState(next);
    }, []);

    const clearJourney = useCallback(() => {
        try {
            localStorage.removeItem(STORAGE_KEY);
            localStorage.removeItem(COMPLETED_KEY);
        } catch { /* ignore */ }
        setState(null);
        setCompletedDays(new Set());
    }, []);

    const toggleDayComplete = useCallback((day: number) => {
        setCompletedDays((prev) => {
            const next = new Set(prev);
            if (next.has(day)) {
                next.delete(day);
            } else {
                next.add(day);
            }
            try {
                localStorage.setItem(COMPLETED_KEY, JSON.stringify([...next]));
            } catch { /* ignore */ }
            return next;
        });
    }, []);

    return {
        journeyState: state,
        hydrated,
        saveJourney,
        clearJourney,
        completedDays,
        toggleDayComplete,
    };
}
