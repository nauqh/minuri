"use client";

import Link from "next/link";
import { Route } from "lucide-react";
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

	return (
		<>
			<GuidesIntroView />
			<div className="bg-minuri-white px-6 py-16">
				<div className="mx-auto max-w-screen-2xl">
					<div className="mb-10 flex items-center gap-4">
						<div className="h-px flex-1 bg-gradient-to-r from-transparent to-minuri-silver/40" />
						<span className="text-sm font-semibold uppercase tracking-[0.14em] text-minuri-mid">
							Prefer to go your own way?
						</span>
						<div className="h-px flex-1 bg-gradient-to-l from-transparent to-minuri-silver/40" />
					</div>
					<div className="flex flex-col items-center gap-4 text-center">
						<p className="max-w-sm text-sm text-minuri-slate">
							Journey lets you plan your own week — pick topics,
							set goals, and build a path that&apos;s entirely
							yours.
						</p>
						<Link
							href="/journey"
							className="inline-flex items-center gap-2 rounded-full border border-minuri-ocean/20 bg-minuri-white px-8 py-3 text-sm font-semibold text-minuri-ocean shadow-xs transition-colors hover:bg-minuri-ocean hover:text-white"
						>
							<Route className="size-4" aria-hidden />
							Build my own Journey
						</Link>
					</div>
				</div>
			</div>
		</>
	);
}
