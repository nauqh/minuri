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
const TASKS_KEY = "minuri:journey:tasks:v1";

export function useJourneyState() {
    const [state, setState] = useState<JourneyState | null>(null);
    const [hydrated, setHydrated] = useState(false);
    const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());

    useEffect(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) setState(JSON.parse(raw) as JourneyState);
            const tasks = localStorage.getItem(TASKS_KEY);
            if (tasks) setCompletedTasks(new Set(JSON.parse(tasks) as string[]));
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
            localStorage.removeItem(TASKS_KEY);
        } catch { /* ignore */ }
        setState(null);
        setCompletedTasks(new Set());
    }, []);

    const toggleTaskComplete = useCallback((key: string) => {
        setCompletedTasks((prev) => {
            const next = new Set(prev);
            if (next.has(key)) {
                next.delete(key);
            } else {
                next.add(key);
            }
            try {
                localStorage.setItem(TASKS_KEY, JSON.stringify([...next]));
            } catch { /* ignore */ }
            return next;
        });
    }, []);

    return {
        journeyState: state,
        hydrated,
        saveJourney,
        clearJourney,
        completedTasks,
        toggleTaskComplete,
    };
}
