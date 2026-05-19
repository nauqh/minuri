import { NextRequest } from "next/server";

import { fetchNearbyEvents } from "@/lib/near-me-api";

export async function GET(request: NextRequest) {
	try {
		const suburb = request.nextUrl.searchParams.get("suburb")?.trim();

		if (!suburb) {
			return Response.json(
				{ error: "Missing required query param: suburb" },
				{ status: 400 },
			);
		}
		if (suburb.length > 200) {
			return Response.json({ error: "Query parameter too long" }, { status: 400 });
		}

		const payload = await fetchNearbyEvents({ suburb });
		return Response.json(payload, {
			headers: { "Cache-Control": "public, max-age=300, stale-while-revalidate=600" },
		});
	} catch {
		return Response.json(
			{ error: "Nearby events service is temporarily unavailable" },
			{ status: 502 },
		);
	}
}
