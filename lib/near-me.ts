// ── Topics ──
// Unified with GuideTopicSlug so Near Me and Guides share one vocabulary.

import { type GuideTopicSlug, GUIDE_TOPICS } from "@/content/guides";

export type NearMeTopic = GuideTopicSlug;

export type TopicLayout = "list-focus" | "card-grid" | "map-focus";

export type Subtype = {
	slug: string;
	label: string;
};

export type TopicMeta = {
	label: string;
	tagline: string;
	icon: string;
	subtypes: Subtype[];
	layout: TopicLayout;
	heading: string;
	emptyPrompt: string;
	intro: string;
	mapNote?: string;
};

const TOPIC_META: Record<NearMeTopic, TopicMeta> = {
	"food-eating": {
		label: "Food & Eating",
		tagline: "I'm running out of money",
		icon: "💰",
		subtypes: [
			{ slug: "food-dining", label: "Food & dining" },
			{ slug: "groceries", label: "Groceries" },
		],
		layout: "card-grid",
		heading: "Cheap eats & groceries near {suburb}",
		emptyPrompt: "Nothing matched — try broadening your search.",
		intro: "Supermarkets, cheap eats, and local food options near you — including spots that work on a student or new-arrival budget.",
		mapNote: "Major markets marked on map",
	},
	"getting-around": {
		label: "Getting Around",
		tagline: "I don't know how to get around",
		icon: "🚊",
		subtypes: [
			{ slug: "public-transit", label: "Trains & trams" },
			{ slug: "cycling", label: "Bikes & walking" },
		],
		layout: "map-focus",
		heading: "Getting around {suburb}",
		emptyPrompt: "No stops found — try a different suburb.",
		intro: "Tram stops, train stations, and transport options near you — use the map to see which lines pass through your area.",
		mapNote: "Tram and train lines shown on map",
	},
	"health-wellbeing": {
		label: "Health & Wellbeing",
		tagline: "Something feels off",
		icon: "🩺",
		subtypes: [
			{ slug: "gp-clinics", label: "GPs & clinics" },
			{ slug: "mental-health", label: "Mental health" },
		],
		layout: "list-focus",
		heading: "Clinics & GPs near {suburb}",
		emptyPrompt: "No clinics found here — try a neighbouring suburb.",
		intro: "Bulk-billing GPs, pharmacies, and mental health services near you — places you can access without paying upfront.",
		mapNote: "Major hospitals marked on map",
	},
	"home-admin": {
		label: "Home & Admin",
		tagline: "I don't understand the paperwork",
		icon: "📋",
		subtypes: [
			{ slug: "services", label: "Services & info" },
			{ slug: "libraries", label: "Libraries" },
		],
		layout: "list-focus",
		heading: "Services & support near {suburb}",
		emptyPrompt: "No services found here yet — try a nearby suburb.",
		intro: "Libraries, council offices, and settlement services near you — places that can help with forms, ID, tenancy, and paperwork.",
	},
	"social-belonging": {
		label: "Social & Belonging",
		tagline: "I feel alone",
		icon: "💬",
		subtypes: [
			{ slug: "community-spaces", label: "Parks & free" },
			{ slug: "social-venues", label: "Bars & social" },
		],
		layout: "card-grid",
		heading: "Places to hang out near {suburb}",
		emptyPrompt: "Nothing here yet — try a nearby suburb.",
		intro: "Community spaces, cultural clubs, and social venues near you — low-pressure places to meet people and feel less alone.",
		mapNote: "Parks highlighted on map",
	},
};

// ── Topic colours ──

export const TOPIC_COLORS: Record<NearMeTopic, string> = {
	"food-eating":      "#e07b39",
	"health-wellbeing": "#3a8a5a",
	"getting-around":   "#3a6aaa",
	"home-admin":       "#2a8a7a",
	"social-belonging": "#7a6aaa",
};

// ── Places ──

export type NearMePlace = {
	id: string;
	name: string;
	address: string;
	lat: number;
	lng: number;
	topic: NearMeTopic;
	subtype: string;
	phone?: string;
	rating?: number;
	reviewCount?: number;
	type?: string;
	price?: string;
	distanceKm?: number;
	hours?: string;
	snippet?: string;
	tags?: string[];
	openNow?: boolean;
	thumbnail?: string;
	photos?: string[];
	website?: string;
	serviceOptions?: string[];
};

export type CrisisLine = {
	name: string;
	phone: string;
	description: string;
};

export const CRISIS_LINES: CrisisLine[] = [
	{ name: "Lifeline", phone: "13 11 14", description: "24/7 crisis support" },
	{ name: "Beyond Blue", phone: "1300 22 4636", description: "Mental health support" },
	{ name: "000", phone: "000", description: "Emergency" },
];

// ── Accessors ──

export function getTopicMeta(topic: NearMeTopic) {
	return TOPIC_META[topic];
}

export function getAllTopicsMeta() {
	return GUIDE_TOPICS.map(({ slug }) => ({ slug, ...TOPIC_META[slug] }));
}

export function getContextHeading(topic: NearMeTopic, suburb: string) {
	return TOPIC_META[topic].heading.replace("{suburb}", suburb);
}

const NEAR_ME_TOPIC_SLUGS = Object.keys(TOPIC_META) as NearMeTopic[];

export function parseTopic(input: string | undefined | null): NearMeTopic {
	if (!input) return "food-eating";
	const normalized = input.toLowerCase().trim();
	if (NEAR_ME_TOPIC_SLUGS.includes(normalized as NearMeTopic)) {
		return normalized as NearMeTopic;
	}
	return "food-eating";
}

export function getSuburbDisplayName(rawSuburb: string) {
	const trimmed = rawSuburb.trim();
	if (!trimmed) return "";
	return trimmed.replace(/\+/g, " ").replace(/\s+/g, " ");
}

export function formatNumber(value: number) {
	return new Intl.NumberFormat("en-AU").format(value);
}

export function haversineKm(
	lat1: number,
	lng1: number,
	lat2: number,
	lng2: number,
): number {
	const R = 6371;
	const toRad = (d: number) => (d * Math.PI) / 180;
	const dLat = toRad(lat2 - lat1);
	const dLng = toRad(lng2 - lng1);
	const a =
		Math.sin(dLat / 2) ** 2 +
		Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
	return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function parseOpenState(raw: string | undefined): {
	isOpen: boolean;
	label: string;
} {
	if (!raw) return { isOpen: false, label: "" };
	if (/temporarily closed/i.test(raw))
		return { isOpen: false, label: "temporarily closed" };
	if (/24 hours/i.test(raw)) return { isOpen: true, label: "24 hours" };
	// SerpAPI uses "⋅" (U+22C5) as separator
	const closesMatch = raw.match(/closes?\s+(.+?)(?:\s*[·⋅•]|$)/i);
	const opensMatch = raw.match(/opens?\s+(.+?)(?:\s*[·⋅•]|$)/i);
	if (/open/i.test(raw) && closesMatch)
		return { isOpen: true, label: `until ${closesMatch[1].trim()}` };
	if (/closed/i.test(raw) && opensMatch)
		return { isOpen: false, label: `opens ${opensMatch[1].trim()}` };
	return { isOpen: /open/i.test(raw), label: "" };
}
