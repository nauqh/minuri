import { NextRequest } from "next/server";

import { fetchPopulation } from "@/lib/near-me-api";

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;
		const location = searchParams.get("location")?.trim();

		if (!location) {
			return Response.json(
				{ error: "Missing required query param: location" },
				{ status: 400 },
			);
		}
		if (location.length > 200) {
			return Response.json({ error: "Query parameter too long" }, { status: 400 });
		}

		const payload = await fetchPopulation({ location });

		return Response.json({
			youngAdultPopulation: payload.population ?? 0,
			population: payload.population ?? 0,
			location: payload.location ?? location,
			year: payload.year ?? null,
		});
	} catch {
		return Response.json(
			{ error: "Population service is temporarily unavailable" },
			{ status: 502 },
		);
	}
}
