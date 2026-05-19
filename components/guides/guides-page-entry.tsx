"use client";

import { useSearchParams } from "next/navigation";

import { GuidesIntroView } from "@/components/guides/guides-intro-view";
import { GuidesLibraryView } from "@/components/guides/guides-library-view";

export function GuidesPageEntry() {
	const params = useSearchParams();
	const isReady =
		params.has("ready") ||
		params.has("topic") ||
		params.has("q") ||
		params.has("story") ||
		params.has("needs");

	if (isReady) return <GuidesLibraryView />;

	return <GuidesIntroView />;
}
