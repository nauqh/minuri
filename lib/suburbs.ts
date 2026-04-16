export type SuburbRecord = {
	locality: string;
	postcode: string | null;
	state: string;
	long: number | null;
	lat: number | null;
	larger_region: string | null;
};

export type SuburbOption = {
	id: string;
	label: string;
	locality: string;
	postcode: string;
	state: string;
	lat: number;
	lng: number;
	largerRegion: string;
};

export const DEFAULT_SUBURB_LIMIT = 100;

export function toSuburbOption(input: SuburbRecord): SuburbOption {
	const locality = input.locality.trim();
	const postcode = (input.postcode ?? "").trim();
	const state = input.state.trim();
	const largerRegion = (input.larger_region ?? "Unknown region").trim();
	return {
		id: `${locality.toLowerCase()}-${postcode}-${state.toLowerCase()}`,
		label: `${locality}, ${state} ${postcode}`,
		locality,
		postcode,
		state,
		lat: input.lat ?? 0,
		lng: input.long ?? 0,
		largerRegion,
	};
}

export function normalizeSuburbName(raw: string) {
	return raw.trim().replace(/\s+/g, " ");
}

function computeScore(option: SuburbOption, query: string) {
	const normalized = query.trim().toLowerCase();
	if (!normalized) return 1;
	const locality = option.locality.toLowerCase();
	const label = option.label.toLowerCase();
	const region = option.largerRegion.toLowerCase();

	if (locality === normalized) return 140;
	if (locality.startsWith(normalized)) return 120;
	if (label.startsWith(normalized)) return 110;
	if (option.postcode.startsWith(normalized)) return 100;
	if (locality.includes(normalized)) return 80;
	if (region.includes(normalized)) return 50;
	if (label.includes(normalized)) return 20;
	return 0;
}

export function rankAndFilterSuburbs(
	options: SuburbOption[],
	query: string,
	limit = DEFAULT_SUBURB_LIMIT,
) {
	const normalized = query.trim().toLowerCase();
	const scored = options
		.map((option) => ({ option, score: computeScore(option, normalized) }))
		.filter((entry) => entry.score > 0)
		.sort((a, b) => b.score - a.score || a.option.label.localeCompare(b.option.label))
		.slice(0, limit)
		.map((entry) => entry.option);

	return normalized ? scored : options.slice(0, limit);
}
