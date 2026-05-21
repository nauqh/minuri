import { NextRequest } from "next/server";

const JOURNEY_URL = `${process.env.MINURI_SERVER_BASE_URL?.replace(/\/+$/, "")}/journey`;
const TIMEOUT_MS = 65_000;

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();

		const controller = new AbortController();
		const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

		let upstream: Response;
		try {
			upstream = await fetch(JOURNEY_URL, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
				signal: controller.signal,
			});
		} finally {
			clearTimeout(timer);
		}

		if (!upstream.ok) {
			return Response.json(
				{ error: "Journey service temporarily unavailable" },
				{ status: 502 },
			);
		}

		const data = await upstream.json();
		return Response.json(data);
	} catch {
		return Response.json(
			{ error: "Journey service temporarily unavailable" },
			{ status: 502 },
		);
	}
}
