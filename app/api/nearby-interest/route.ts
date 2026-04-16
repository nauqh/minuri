import { NextRequest } from "next/server";

import { fetchNearbyInterest } from "@/lib/near-me-api";

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;
		const suburb = searchParams.get("suburb")?.trim();

		if (!suburb) {
			return Response.json(
				{ error: "Missing required query param: suburb" },
				{ status: 400 },
			);
		}

		const payload = await fetchNearbyInterest({ suburb });
		return Response.json(payload);
	} catch {
		return Response.json(
			{ error: "Nearby interest service is temporarily unavailable" },
			{ status: 502 },
		);
	}
}
