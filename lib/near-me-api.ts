import { type SuburbRecord } from "@/lib/suburbs";

const MINURI_SERVER_BASE = "https://minuri-server-production.up.railway.app";

// Server-side fetchers (used by local route handlers)
export async function fetchSuburbs({
	limit,
}: {
	limit?: number;
}) {
	const params = new URLSearchParams();
	if (typeof limit === "number") {
		params.set("limit", String(limit));
	}

	const response = await fetch(
		`${MINURI_SERVER_BASE}/suburb${params.size ? `?${params.toString()}` : ""}`,
		{
			cache: "no-store",
		},
	);

	if (!response.ok) {
		throw new Error(`Suburb upstream failed: ${response.status}`);
	}

	const payload = (await response.json()) as { suburbs?: SuburbRecord[] };
	return payload.suburbs ?? [];
}

export async function fetchPopulation({
	location,
}: {
	location: string;
}) {
	const params = new URLSearchParams({ location });
	const response = await fetch(
		`${MINURI_SERVER_BASE}/api/population?${params.toString()}`,
		{
			cache: "no-store",
		},
	);

	if (!response.ok) {
		throw new Error(`Population upstream failed: ${response.status}`);
	}

	const payload = (await response.json()) as {
		population?: number;
		location?: string;
		year?: string;
	};

	return {
		population: payload.population ?? 0,
		location: payload.location ?? location,
		year: payload.year ?? null,
	};
}
