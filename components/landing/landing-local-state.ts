"use client";

import { GUIDES, GUIDE_ARCS } from "@/content/guides";

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

type ArcName = "day1" | "week1" | "month1";

export type ArcProgress = Record<ArcName, number>;

function maxGuidesInAnyArc(): number {
	let max = 1;
	for (const arc of GUIDE_ARCS) {
		const n = GUIDES.filter((g) => g.arc === arc.slug).length;
		if (n > max) max = n;
	}
	return max;
}

function clampArcSlotValue(value: number): number {
	const cap = maxGuidesInAnyArc();
	if (!Number.isFinite(value) || value < 0) return 0;
	return Math.min(cap, Math.round(value));
}

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

type JourneyReceiptShape = {
	kind: "minuri-journey-receipt";
	version: 1;
	receiptId: string;
	issuedAt: string;
	createdBy: "minuri-web";
	summary: {
		suburb: string | null;
		lifeMoment: string | null;
		lastTopic: string | null;
		savedLocationsCount: number;
		readGuidesCount: number;
	};
	journey: LandingJourneyState;
	checksum: string;
};

export type JourneyImportResult =
	| {
			ok: true;
			source: "receipt" | "legacy-json";
			receiptId: string | null;
			issuedAt: string | null;
			state: LandingJourneyState;
	  }
	| { ok: false; error: string };

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

function clampToNonNegativeInteger(value: number) {
	if (!Number.isFinite(value) || value < 0) return 0;
	return Math.round(value);
}

function normalizeString(value: unknown): string | null {
	if (typeof value !== "string") return null;
	const trimmed = value.trim();
	return trimmed.length > 0 ? trimmed : null;
}

function normalizeStringArray(value: unknown): string[] {
	if (!Array.isArray(value)) return [];
	return value
		.filter((item): item is string => typeof item === "string")
		.map((item) => item.trim())
		.filter(Boolean);
}

function normalizeUnknownArray(value: unknown): unknown[] {
	return Array.isArray(value) ? value : [];
}

function normalizeArcProgress(value: unknown, _readGuidesCount: number): ArcProgress {
	if (!value || typeof value !== "object") {
		return { day1: 0, week1: 0, month1: 0 };
	}

	const record = value as Record<string, unknown>;
	if (record.day1 !== undefined || "day1" in record) {
		return {
			day1: clampArcSlotValue(Number(record.day1 ?? 0)),
			week1: clampArcSlotValue(Number(record.week1 ?? 0)),
			month1: clampArcSlotValue(Number(record.month1 ?? 0)),
		};
	}

	// Legacy keys: old week-1 / month-1 / month-3 arcs
	return {
		day1: clampArcSlotValue(Number(record.week1 ?? record["week-1"] ?? 0)),
		week1: clampArcSlotValue(Number(record.month1 ?? record["month-1"] ?? 0)),
		month1: clampArcSlotValue(Number(record.month3 ?? record["month-3"] ?? 0)),
	};
}

function normalizeJourneyState(payload: unknown): LandingJourneyState {
	const input =
		payload && typeof payload === "object"
			? (payload as Record<string, unknown>)
			: {};
	const readGuides = [...new Set(normalizeStringArray(input.readGuides))];
	const savedLocations = normalizeUnknownArray(input.savedLocations);
	const version = Number(input.version);
	return {
		version: Number.isFinite(version) ? Math.max(1, Math.round(version)) : 1,
		lastGuideSlug: normalizeString(input.lastGuideSlug),
		activeArc: normalizeString(input.activeArc),
		selectedSuburb: normalizeString(input.selectedSuburb),
		lastTopic: normalizeString(input.lastTopic),
		lifeMoment: normalizeString(input.lifeMoment),
		savedLocationsCount: savedLocations.length,
		savedLocations,
		topicHistory: [...new Set(normalizeStringArray(input.topicHistory))],
		readGuides,
		arcProgress: normalizeArcProgress(input.arcProgress, readGuides.length),
	};
}

function writeString(key: string, value: string | null) {
	if (value) {
		window.localStorage.setItem(key, value);
		return;
	}
	window.localStorage.removeItem(key);
}

function writeJson(key: string, value: unknown) {
	window.localStorage.setItem(key, JSON.stringify(value));
}

function persistLandingJourneyState(state: LandingJourneyState) {
	writeString(LANDING_KEYS.lastGuideSlug, state.lastGuideSlug);
	writeString(LANDING_KEYS.activeArc, state.activeArc);
	writeString(LANDING_KEYS.selectedSuburb, state.selectedSuburb);
	writeString(LANDING_KEYS.lastTopic, state.lastTopic);
	writeString(LANDING_KEYS.lifeMoment, state.lifeMoment);
	writeJson(LANDING_KEYS.savedLocations, state.savedLocations);
	writeJson(LANDING_KEYS.topicHistory, state.topicHistory);
	writeJson(LANDING_KEYS.readGuides, state.readGuides);
	writeJson(BOOKMARKS_KEY, state.readGuides);
	writeJson(LANDING_KEYS.arcProgress, state.arcProgress);
	window.localStorage.setItem(
		LANDING_KEYS.stateVersion,
		String(Math.max(1, clampToNonNegativeInteger(state.version))),
	);
}

function computeChecksum(input: string) {
	let hash = 2166136261;
	for (let index = 0; index < input.length; index += 1) {
		hash ^= input.charCodeAt(index);
		hash +=
			(hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
	}
	return (hash >>> 0).toString(16).padStart(8, "0");
}

function makeReceiptCore(journey: LandingJourneyState) {
	const receiptId =
		typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
			? crypto.randomUUID()
			: `receipt-${Date.now()}`;
	return {
		kind: "minuri-journey-receipt" as const,
		version: 1 as const,
		receiptId,
		issuedAt: new Date().toISOString(),
		createdBy: "minuri-web" as const,
		summary: {
			suburb: journey.selectedSuburb,
			lifeMoment: journey.lifeMoment,
			lastTopic: journey.lastTopic,
			savedLocationsCount: journey.savedLocationsCount,
			readGuidesCount: journey.readGuides.length,
		},
		journey,
	};
}

function makeReceipt(journey: LandingJourneyState): JourneyReceiptShape {
	const core = makeReceiptCore(journey);
	const checksum = computeChecksum(JSON.stringify(core));
	return { ...core, checksum };
}

function readArcProgress(readGuidesCount: number): ArcProgress {
	const parsed = parseJson(window.localStorage.getItem(LANDING_KEYS.arcProgress));
	const defaults: ArcProgress = {
		day1: 0,
		week1: 0,
		month1: 0,
	};

	if (!parsed || typeof parsed !== "object") {
		return normalizeArcProgress(null, readGuidesCount);
	}

	return normalizeArcProgress(parsed, readGuidesCount);
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
			arcProgress: { day1: 0, week1: 0, month1: 0 },
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
	const receipt = makeReceipt(journey);
	const file = new Blob([JSON.stringify(receipt, null, 2)], {
		type: "application/json",
	});
	const href = URL.createObjectURL(file);
	const anchor = document.createElement("a");
	anchor.href = href;
	anchor.download = `minuri-receipt-${Date.now()}.json`;
	anchor.click();
	URL.revokeObjectURL(href);
}

export function exportJourneyReceipt() {
	exportJourneyState();
}

export async function importJourneyReceipt(
	file: File,
): Promise<JourneyImportResult> {
	if (typeof window === "undefined") {
		return { ok: false, error: "Receipt import is only available in browser." };
	}

	try {
		const raw = await file.text();
		const parsed = JSON.parse(raw) as unknown;

		if (parsed && typeof parsed === "object") {
			const payload = parsed as Record<string, unknown>;
			if (payload.kind === "minuri-journey-receipt") {
				const checksum = normalizeString(payload.checksum);
				const core = {
					kind: payload.kind,
					version: payload.version,
					receiptId: payload.receiptId,
					issuedAt: payload.issuedAt,
					createdBy: payload.createdBy,
					summary: payload.summary,
					journey: payload.journey,
				};
				const expectedChecksum = computeChecksum(JSON.stringify(core));
				if (!checksum || checksum !== expectedChecksum) {
					return {
						ok: false,
						error: "Receipt checksum mismatch. File may be corrupted.",
					};
				}

				const normalized = normalizeJourneyState(payload.journey);
				persistLandingJourneyState(normalized);
				return {
					ok: true,
					source: "receipt",
					receiptId: normalizeString(payload.receiptId),
					issuedAt: normalizeString(payload.issuedAt),
					state: normalized,
				};
			}
		}

		// Backward-compatible path for old plain JSON exports.
		const normalized = normalizeJourneyState(parsed);
		persistLandingJourneyState(normalized);
		return {
			ok: true,
			source: "legacy-json",
			receiptId: null,
			issuedAt: null,
			state: normalized,
		};
	} catch {
		return {
			ok: false,
			error: "Could not read this file. Use a valid Minuri receipt JSON.",
		};
	}
}
