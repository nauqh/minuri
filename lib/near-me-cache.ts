import type { NearbyInterestRecord } from "@/lib/near-me-api";

const TTL_MS = 5 * 60 * 1000;

type Entry = { data: NearbyInterestRecord[]; ts: number };

const store = new Map<string, Entry>();

function key(suburb: string, topic: string, subtype: string | null): string {
	return `${suburb.toLowerCase().trim()}:${topic}:${subtype ?? ""}`;
}

export function getCachedPlaces(
	suburb: string,
	topic: string,
	subtype: string | null,
): NearbyInterestRecord[] | null {
	const k = key(suburb, topic, subtype);
	const entry = store.get(k);
	if (!entry) return null;
	if (Date.now() - entry.ts > TTL_MS) {
		store.delete(k);
		return null;
	}
	return entry.data;
}

export function setCachedPlaces(
	suburb: string,
	topic: string,
	subtype: string | null,
	data: NearbyInterestRecord[],
): void {
	store.set(key(suburb, topic, subtype), { data, ts: Date.now() });
}
