"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {
	readLandingJourneyState,
	type LandingJourneyState,
} from "@/components/landing/landing-local-state";

const EMPTY_STATE: LandingJourneyState = {
	version: 1,
	lastGuideSlug: null,
	activeArc: null,
	selectedSuburb: null,
	lastTopic: null,
	lifeMoment: null,
	savedLocationsCount: 0,
	savedLocations: [],
	topicHistory: [],
	readGuides: [],
	arcProgress: { day1: 0, week1: 0, month1: 0 },
};

function sentenceCase(value: string | null) {
	if (!value) return "your journey";
	return value
		.replace(/-/g, " ")
		.replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function UserPage() {
	const [journey, setJourney] = useState<LandingJourneyState>(EMPTY_STATE);

	useEffect(() => {
		setJourney(readLandingJourneyState());
	}, []);

	const primaryGuideHref = useMemo(() => {
		if (journey.lifeMoment === "i-just-arrived")
			return "/guides?category=survive";
		if (journey.lifeMoment === "im-getting-set-up")
			return "/guides?category=setup";
		if (journey.lifeMoment === "im-looking-for-my-people")
			return "/guides?category=connect";
		return "/guides";
	}, [journey.lifeMoment]);

	return (
		<main className="mx-auto max-w-3xl px-5 py-10 text-minuri-ocean">
			<p className="text-[0.7rem] font-black uppercase tracking-[0.14em] text-minuri-teal">
				Your personalized page
			</p>
			<h1 className="mt-1 text-3xl font-black tracking-tight">
				Welcome to your Wellnest
			</h1>
			<p className="mt-2 text-sm text-minuri-slate">
				Built around {journey.selectedSuburb ?? "Melbourne"} and{" "}
				{sentenceCase(journey.lifeMoment)}.
			</p>

			<section className="mt-6 space-y-2">
				<h2 className="text-sm font-black uppercase tracking-[0.12em] text-minuri-teal">
					Start here
				</h2>
				<div className="flex flex-wrap gap-2">
					<Link
						href={primaryGuideHref}
						className="rounded-full bg-minuri-teal px-3.5 py-2 text-xs font-semibold text-primary-foreground"
					>
						Continue with guides
					</Link>
					<Link
						href="/near-me"
						className="rounded-full border border-minuri-silver bg-minuri-white px-3.5 py-2 text-xs font-semibold text-minuri-ocean"
					>
						Explore near me
					</Link>
				</div>
			</section>
		</main>
	);
}
