import { NextRequest } from "next/server";

import { fetchNearbyInterest } from "@/lib/near-me-api";

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;
		const suburb = searchParams.get("suburb")?.trim();
		const topic = searchParams.get("topic")?.trim() ?? undefined;
		const subtype = searchParams.get("subtype")?.trim() ?? undefined;

		if (!suburb) {
			return Response.json(
				{ error: "Missing required query param: suburb" },
				{ status: 400 },
			);
		}
		if (suburb.length > 200 || (topic && topic.length > 200) || (subtype && subtype.length > 200)) {
			return Response.json({ error: "Query param too long" }, { status: 400 });
		}

		const payload = await fetchNearbyInterest({ suburb, topic, subtype });
		return Response.json(payload, {
			headers: { "Cache-Control": "public, max-age=300, stale-while-revalidate=600" },
		});
	} catch {
		return Response.json(
			{ error: "Nearby interest service is temporarily unavailable" },
			{ status: 502 },
		);
	}
}
