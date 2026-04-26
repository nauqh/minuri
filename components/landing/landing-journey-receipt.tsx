"use client";

import type { LandingJourneyState } from "@/components/landing/landing-local-state";
import { getArcGuideTotal } from "@/lib/guides";

function toLabel(value: string | null, fallback: string) {
	if (!value) return fallback;
	return value
		.replace(/-/g, " ")
		.replace(/\b\w/g, (character) => character.toUpperCase());
}

function toDateLabel(issuedAt: string) {
	const date = new Date(issuedAt);
	if (Number.isNaN(date.getTime())) return issuedAt;
	return new Intl.DateTimeFormat("en-AU", {
		year: "numeric",
		month: "short",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
	}).format(date);
}

function ReceiptRow({ label, value }: { label: string; value: string }) {
	return (
		<div className="grid grid-cols-[1fr_auto] items-center gap-3 text-sm font-semibold uppercase tracking-[0.08em] text-minuri-ocean">
			<span className="relative overflow-hidden">
				<span>{label}</span>
				<span
					className="ml-2 inline-block w-full border-b border-dashed border-minuri-silver/90 align-middle"
					aria-hidden
				/>
			</span>
			<span>{value}</span>
		</div>
	);
}

export function LandingJourneyReceipt({
	journey,
	receiptId,
	issuedAt,
}: {
	journey: LandingJourneyState;
	receiptId: string;
	issuedAt: string;
}) {
	const profileSuburb = toLabel(journey.selectedSuburb, "Unknown");
	const profileMoment = toLabel(journey.lifeMoment, "Not selected");
	const profileTopic = toLabel(journey.lastTopic, "No topic yet");
	const readCount = String(journey.readGuides.length);
	const savedCount = String(journey.savedLocationsCount);
	const day1 = String(journey.arcProgress.day1);
	const week1 = String(journey.arcProgress.week1);
	const month1Arc = String(journey.arcProgress.month1);
	const totalDay1 = getArcGuideTotal("day-1");
	const totalWeek1 = getArcGuideTotal("week-1");
	const totalMonth1 = getArcGuideTotal("month-1");

	return (
		<div className="mx-auto w-full max-w-2xl px-3 pb-6 pt-2">
			<div className="relative rounded-[1.2rem] border border-minuri-slate/25 bg-minuri-white px-5 pb-7 pt-7 shadow-[0_22px_50px_-30px_color-mix(in_oklch,var(--minuri-ocean)_55%,transparent)] md:px-8">
				<div
					className="absolute right-0 top-0 h-0 w-0 border-b-34 border-l-34 border-b-minuri-mist border-l-transparent"
					aria-hidden
				/>

				<div className="grid gap-5 border-b border-dashed border-minuri-silver/90 pb-5 md:grid-cols-2">
					<div>
						<p className="text-5xl font-black uppercase leading-[0.9] tracking-tight text-minuri-ocean">
							Minuri
						</p>
						<p className="mt-1 text-xs font-black uppercase tracking-[0.16em] text-minuri-slate">
							User Receipt
						</p>
					</div>
					<div className="space-y-1 text-xs uppercase tracking-[0.1em] text-minuri-ocean">
						<p className="font-black">
							Your Journey, Saved Locally
						</p>
						<p className="text-minuri-slate">
							Receipt #{receiptId}
						</p>
						<p className="text-minuri-slate">
							{toDateLabel(issuedAt)}
						</p>
					</div>
				</div>

				<div className="grid gap-5 border-b border-dashed border-minuri-silver/90 py-5 md:grid-cols-2">
					<section>
						<h4 className="text-xl font-black uppercase tracking-tight text-minuri-ocean">
							Profile
						</h4>
						<ul className="mt-2 space-y-1.5 text-sm text-minuri-ocean">
							<li>Suburb: {profileSuburb}</li>
							<li>Life moment: {profileMoment}</li>
							<li>Focus topic: {profileTopic}</li>
						</ul>
					</section>
					<section>
						<h4 className="text-xl font-black uppercase tracking-tight text-minuri-ocean">
							Journey
						</h4>
						<ul className="mt-2 space-y-1.5 text-sm text-minuri-ocean">
							<li>Guides read: {readCount}</li>
							<li>Saved places: {savedCount}</li>
							<li>Version: v{journey.version}</li>
						</ul>
					</section>
				</div>

				<div className="space-y-2 border-b border-dashed border-minuri-silver/90 py-5">
					<h4 className="text-2xl font-black uppercase tracking-tight text-minuri-ocean">
						Arc Progress
					</h4>
					<ReceiptRow
						label="Day 1 guides"
						value={`${day1} / ${totalDay1}`}
					/>
					<ReceiptRow
						label="Week 1 guides"
						value={`${week1} / ${totalWeek1}`}
					/>
					<ReceiptRow
						label="Month 1 guides"
						value={`${month1Arc} / ${totalMonth1}`}
					/>
					<ReceiptRow label="Total Reads" value={readCount} />
				</div>

				<div className="pt-5">
					<div
						className="h-12 w-full rounded-sm bg-[repeating-linear-gradient(90deg,var(--minuri-ocean),var(--minuri-ocean)_2px,transparent_2px,transparent_5px,var(--minuri-silver)_5px,var(--minuri-silver)_7px,transparent_7px,transparent_11px)]"
						aria-hidden
					/>
					<p className="mt-3 text-center text-base font-black uppercase tracking-[0.1em] text-minuri-ocean">
						Customer Copy
					</p>
				</div>
			</div>
		</div>
	);
}
