import { NextRequest } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_MINURI_SERVER_BASE_URL?.replace(/\/+$/, "");

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 65_000);

    let response: Response;
    try {
      response = await fetch(`${BACKEND_URL}/journey`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }

    if (!response.ok) {
      return Response.json({ error: "Journey service unavailable" }, { status: 502 });
    }

    const data = await response.json();
    return Response.json(data);
  } catch {
    return Response.json({ error: "Journey service unavailable" }, { status: 502 });
  }
}
