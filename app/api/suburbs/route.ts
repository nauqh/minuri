import { NextRequest } from "next/server";

import { fetchSuburbs } from "@/lib/near-me-api";
import {
	rankAndFilterSuburbs,
	toSuburbOption,
} from "@/lib/suburbs";

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;
		const query = searchParams.get("q") ?? "";

		const upstreamSuburbs = await fetchSuburbs({});
		const allOptions = upstreamSuburbs.map(toSuburbOption);
		const options = rankAndFilterSuburbs(allOptions, query);

		return Response.json({
			suburbs: options,
			meta: {
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
