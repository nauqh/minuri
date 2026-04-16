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
	query: string,
) {
	const normalizedQuery = normalizeSuburbName(query).toLowerCase();
	const hasQuery = normalizedQuery.length > 0;
	const tokens = normalizedQuery.split(" ").filter(Boolean);

	const filtered = hasQuery
		? options.filter((option) => {
				const locality = option.locality.toLowerCase();
				const postcode = option.postcode.toLowerCase();
				const state = option.state.toLowerCase();
				const region = option.largerRegion.toLowerCase();

				return tokens.every(
					(token) =>
						locality.startsWith(token) ||
						postcode.startsWith(token) ||
						state.startsWith(token) ||
						region.startsWith(token),
				);
		  })
		: options;

	// Prefer locality prefix matches first for better typeahead relevance.
	const ranked = filtered.sort((a, b) => {
		const aStarts = a.locality.toLowerCase().startsWith(normalizedQuery);
		const bStarts = b.locality.toLowerCase().startsWith(normalizedQuery);

		if (aStarts !== bStarts) {
			return aStarts ? -1 : 1;
		}

		return a.locality.localeCompare(b.locality);
	});

	return ranked;
}
