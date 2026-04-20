"use client";

export const LANDING_STATE_VERSION = 1;
const BOOKMARKS_KEY = "minuri:guide-bookmarks:v1";

export const LANDING_KEYS = {
	lastGuideSlug: "minuri.lastGuideSlug",
	activeArc: "minuri.activeArc",
	arcProgress: "minuri.arcProgress",
	selectedSuburb: "minuri.selectedSuburb",
	lastTopic: "minuri.lastTopic",
	lifeMoment: "minuri.lifeMoment",
	savedLocations: "minuri.savedLocations",
	topicHistory: "minuri.topicHistory",
	readGuides: "minuri.readGuides",
	stateVersion: "minuri.landingStateVersion",
} as const;

type ArcName = "week1" | "month1" | "month3";

export type ArcProgress = Record<ArcName, number>;

export type LandingJourneyState = {
	version: number;
	lastGuideSlug: string | null;
	activeArc: string | null;
	selectedSuburb: string | null;
	lastTopic: string | null;
	lifeMoment: string | null;
	savedLocationsCount: number;
	savedLocations: unknown[];
	topicHistory: string[];
	readGuides: string[];
	arcProgress: ArcProgress;
};

function parseJson(raw: string | null): unknown {
	if (!raw) return null;
	try {
		return JSON.parse(raw);
	} catch {
		return null;
	}
}

function readString(key: string): string | null {
	if (typeof window === "undefined") return null;
	const raw = window.localStorage.getItem(key)?.trim();
	return raw ? raw : null;
}

function readStringArray(key: string): string[] {
	const parsed = parseJson(window.localStorage.getItem(key));
	if (!Array.isArray(parsed)) return [];
	return parsed.filter((value): value is string => typeof value === "string");
}

function readUnknownArray(key: string): unknown[] {
	const parsed = parseJson(window.localStorage.getItem(key));
	return Array.isArray(parsed) ? parsed : [];
}

function clampToCount(value: number) {
	if (!Number.isFinite(value) || value < 0) return 0;
	return Math.min(5, Math.round(value));
}

function readArcProgress(readGuidesCount: number): ArcProgress {
	const parsed = parseJson(window.localStorage.getItem(LANDING_KEYS.arcProgress));
	const defaults: ArcProgress = {
		week1: 0,
		month1: 0,
		month3: 0,
	};

	if (!parsed || typeof parsed !== "object") {
		const fallback = clampToCount(readGuidesCount);
		return { ...defaults, week1: fallback };
	}

	const record = parsed as Record<string, unknown>;
	return {
		week1: clampToCount(Number(record.week1 ?? record["week-1"] ?? 0)),
		month1: clampToCount(Number(record.month1 ?? record["month-1"] ?? 0)),
		month3: clampToCount(Number(record.month3 ?? record["month-3"] ?? 0)),
	};
}

export function readLandingJourneyState(): LandingJourneyState {
	if (typeof window === "undefined") {
		return {
			version: LANDING_STATE_VERSION,
			lastGuideSlug: null,
			activeArc: null,
			selectedSuburb: null,
			lastTopic: null,
			lifeMoment: null,
			savedLocationsCount: 0,
			savedLocations: [],
			topicHistory: [],
			readGuides: [],
			arcProgress: { week1: 0, month1: 0, month3: 0 },
		};
	}

	const readGuides = [
		...new Set([
			...readStringArray(LANDING_KEYS.readGuides),
			...readStringArray(BOOKMARKS_KEY),
		]),
	];
	const savedLocations = readUnknownArray(LANDING_KEYS.savedLocations);

	const version = Number(readString(LANDING_KEYS.stateVersion));
	const normalizedVersion = Number.isFinite(version)
		? version
		: LANDING_STATE_VERSION;

	return {
		version: normalizedVersion,
		lastGuideSlug: readString(LANDING_KEYS.lastGuideSlug),
		activeArc: readString(LANDING_KEYS.activeArc),
		selectedSuburb: readString(LANDING_KEYS.selectedSuburb),
		lastTopic: readString(LANDING_KEYS.lastTopic),
		lifeMoment: readString(LANDING_KEYS.lifeMoment),
		savedLocationsCount: savedLocations.length,
		savedLocations,
		topicHistory: readStringArray(LANDING_KEYS.topicHistory),
		readGuides,
		arcProgress: readArcProgress(readGuides.length),
	};
}

export function saveLifeMoment(lifeMoment: string) {
	if (typeof window === "undefined") return;
	window.localStorage.setItem(LANDING_KEYS.lifeMoment, lifeMoment);
	window.localStorage.setItem(
		LANDING_KEYS.stateVersion,
		String(LANDING_STATE_VERSION),
	);
}

export function exportJourneyState() {
	if (typeof window === "undefined") return;
	const journey = readLandingJourneyState();
	const file = new Blob([JSON.stringify(journey, null, 2)], {
		type: "application/json",
	});
	const href = URL.createObjectURL(file);
	const anchor = document.createElement("a");
	anchor.href = href;
	anchor.download = `minuri-journey-${Date.now()}.json`;
	anchor.click();
	URL.revokeObjectURL(href);
}
