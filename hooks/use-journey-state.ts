"use client";

import { useCallback, useEffect, useState } from "react";
import type { GuideTopicSlug } from "@/content/guides";

export type JourneyState = {
    yourMoment: string;
    suburb: string;
    selectedTopics: GuideTopicSlug[];
};

const STORAGE_KEY = "minuri:journey:v1";

export function useJourneyState() {
    const [state, setState] = useState<JourneyState | null>(null);
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        try {
            const raw = sessionStorage.getItem(STORAGE_KEY);
            if (raw) setState(JSON.parse(raw) as JourneyState);
        } catch { /* ignore */ }
        setHydrated(true);
    }, []);

    const saveJourney = useCallback((next: JourneyState) => {
        try {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch { /* ignore */ }
        setState(next);
    }, []);

    const clearJourney = useCallback(() => {
        try {
            sessionStorage.removeItem(STORAGE_KEY);
        } catch { /* ignore */ }
        setState(null);
    }, []);

    return { journeyState: state, hydrated, saveJourney, clearJourney };
}
