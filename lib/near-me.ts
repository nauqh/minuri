// ── Topics ──
// Aligned with Epic 2 guide categories so the product feels like one surface.
// Guides explain *what to do*; Near Me shows *where to go*.

export const NEAR_ME_TOPICS = [
	"setup",
	"survive",
	"get-around",
	"health",
	"connect",
] as const;

export type NearMeTopic = (typeof NEAR_ME_TOPICS)[number];

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
};

const TOPIC_META: Record<NearMeTopic, TopicMeta> = {
	setup: {
		label: "Setup",
		tagline: "I don't understand the paperwork",
		icon: "📋",
		subtypes: [
			{ slug: "services", label: "Services & info" },
			{ slug: "libraries", label: "Libraries" },
		],
		layout: "list-focus",
		heading: "Services & support near {suburb}",
		emptyPrompt: "No services found here yet — try a nearby suburb.",
	},
	survive: {
		label: "Survive",
		tagline: "I'm running out of money",
		icon: "💰",
		subtypes: [
			{ slug: "food-dining", label: "Food & dining" },
			{ slug: "groceries", label: "Groceries" },
		],
		layout: "card-grid",
		heading: "Cheap eats & groceries near {suburb}",
		emptyPrompt: "Nothing matched — try broadening your search.",
	},
	"get-around": {
		label: "Get around",
		tagline: "I don't know how to get around",
		icon: "🚊",
		subtypes: [
			{ slug: "trains-trams", label: "Trains & trams" },
			{ slug: "bikes-buses", label: "Bikes & buses" },
		],
		layout: "map-focus",
		heading: "Getting around {suburb}",
		emptyPrompt: "No stops found — try a different suburb.",
	},
	health: {
		label: "Health",
		tagline: "Something feels off",
		icon: "🩺",
		subtypes: [
			{ slug: "gp-clinics", label: "GPs & clinics" },
			{ slug: "mental-health", label: "Mental health" },
		],
		layout: "list-focus",
		heading: "Clinics & GPs near {suburb}",
		emptyPrompt: "No clinics found here — try a neighbouring suburb.",
	},
	connect: {
		label: "Connect",
		tagline: "I feel alone",
		icon: "💬",
		subtypes: [
			{ slug: "parks-free", label: "Parks & free" },
			{ slug: "bars-social", label: "Bars & social" },
		],
		layout: "map-focus",
		heading: "Places to hang out near {suburb}",
		emptyPrompt: "Nothing here yet — try a nearby suburb.",
	},
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
	distanceKm?: number;
	hours?: string;
	snippet?: string;
	tags?: string[];
	openNow?: boolean;
	thumbnail?: string;
};

// ── Accessors ──

export function getTopicMeta(topic: NearMeTopic) {
	return TOPIC_META[topic];
}

export function getAllTopicsMeta() {
	return NEAR_ME_TOPICS.map((slug) => ({ slug, ...TOPIC_META[slug] }));
}

export function getContextHeading(topic: NearMeTopic, suburb: string) {
	return TOPIC_META[topic].heading.replace("{suburb}", suburb);
}

export function parseTopic(input: string | undefined | null): NearMeTopic {
	if (!input) return "survive";
	const normalized = input.toLowerCase().trim();
	if (NEAR_ME_TOPICS.includes(normalized as NearMeTopic)) {
		return normalized as NearMeTopic;
	}
	return "survive";
}

export function getSuburbDisplayName(rawSuburb: string) {
	const trimmed = rawSuburb.trim();
	if (!trimmed) return "";
	return trimmed.replace(/\+/g, " ").replace(/\s+/g, " ");
}

export function formatNumber(value: number) {
	return new Intl.NumberFormat("en-AU").format(value);
}
