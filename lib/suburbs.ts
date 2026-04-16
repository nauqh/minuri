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

export function rankAndFilterSuburbs(
	options: SuburbOption[],
	_query: string,
	limit = DEFAULT_SUBURB_LIMIT,
) {
	return options.slice(0, limit);
}
