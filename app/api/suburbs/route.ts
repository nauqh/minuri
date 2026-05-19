import { NextRequest } from "next/server";

import { fetchSuburbs } from "@/lib/near-me-api";
import {
	rankAndFilterSuburbs,
	toSuburbOption,
	type SuburbOption,
} from "@/lib/suburbs";

let cachedOptions: SuburbOption[] | null = null;

async function getAllSuburbOptions(): Promise<SuburbOption[]> {
	if (cachedOptions) return cachedOptions;
	const upstreamSuburbs = await fetchSuburbs({});
	cachedOptions = upstreamSuburbs.map(toSuburbOption);
	return cachedOptions;
}

export async function GET(request: NextRequest) {
	try {
		const query = request.nextUrl.searchParams.get("q") ?? "";
		if (query.length > 200) {
			return Response.json({ error: "Query param too long" }, { status: 400 });
		}
		const allOptions = await getAllSuburbOptions();
		const options = query ? rankAndFilterSuburbs(allOptions, query) : allOptions;

		return Response.json({ suburbs: options });
	} catch {
		return Response.json(
			{
				error: "Suburb service is temporarily unavailable",
			},
			{ status: 502 },
		);
	}
}
