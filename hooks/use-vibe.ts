"use client";

import { useEffect } from "react";
import { LANDING_KEYS } from "@/components/landing/landing-local-state";
import { DEFAULT_VIBE_ID, getVibe, type VibeId } from "@/lib/vibes";

function readVibeId(): VibeId {
	if (typeof window === "undefined") return DEFAULT_VIBE_ID;
	return (window.localStorage.getItem(LANDING_KEYS.vibe) as VibeId) ?? DEFAULT_VIBE_ID;
}

export function saveVibe(id: VibeId) {
	if (typeof window === "undefined") return;
	window.localStorage.setItem(LANDING_KEYS.vibe, id);
	document.documentElement.style.setProperty("--vibe-accent", getVibe(id).hex);
}

/** Reads the stored vibe on mount and stamps --vibe-accent onto :root. */
export function useVibe() {
	useEffect(() => {
		const vibe = getVibe(readVibeId());
		document.documentElement.style.setProperty("--vibe-accent", vibe.hex);
	}, []);
}
