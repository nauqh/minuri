import { NextRequest } from "next/server";

import { fetchSuburbs } from "@/lib/near-me-api";
import {
	DEFAULT_SUBURB_LIMIT,
	rankAndFilterSuburbs,
	toSuburbOption,
} from "@/lib/suburbs";

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;
		const limitValue = Number(
			searchParams.get("limit") ?? DEFAULT_SUBURB_LIMIT,
		);
		const limit = Number.isFinite(limitValue)
			? Math.max(1, Math.min(100, limitValue))
			: DEFAULT_SUBURB_LIMIT;
		const query = searchParams.get("q") ?? "";
		const upstreamLimit = query.trim()
			? Math.max(100, limit)
			: limit;

		const upstreamSuburbs = await fetchSuburbs({ limit: upstreamLimit });
		const allOptions = upstreamSuburbs.map(toSuburbOption);
		const options = rankAndFilterSuburbs(allOptions, query, limit);

		return Response.json({
			suburbs: options,
			meta: {
				limit,
				query,
				total: allOptions.length,
				returned: options.length,
			},
		});
	} catch {
		return Response.json(
			{
				error: "Suburb service is temporarily unavailable",
			},
			{ status: 502 },
		);
	}
}
