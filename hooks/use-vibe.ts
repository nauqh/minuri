"use client";

import { useEffect } from "react";
import { LANDING_KEYS } from "@/components/landing/landing-local-state";
import { VIBES, getVibe, type VibeId } from "@/lib/vibes";

export function saveVibe(id: VibeId) {
	if (typeof window === "undefined") return;
	window.localStorage.setItem(LANDING_KEYS.vibe, id);
	document.documentElement.style.setProperty("--vibe-accent", getVibe(id).hex);
}

/** Picks a random vibe on mount, persists it for the session, and stamps --vibe-accent onto :root. */
export function useVibe() {
	useEffect(() => {
		const random = VIBES[Math.floor(Math.random() * VIBES.length)];
		window.localStorage.setItem(LANDING_KEYS.vibe, random.id);
		document.documentElement.style.setProperty("--vibe-accent", random.hex);
	}, []);
}
