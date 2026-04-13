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
	color: string;
	colorBg: string;
	guideCategory: string;
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
		color: "text-sky-600",
		colorBg: "bg-sky-50",
		guideCategory: "adulting",
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
		color: "text-amber-600",
		colorBg: "bg-amber-50",
		guideCategory: "eating",
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
		color: "text-indigo-600",
		colorBg: "bg-indigo-50",
		guideCategory: "transport",
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
		color: "text-rose-600",
		colorBg: "bg-rose-50",
		guideCategory: "health",
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
		color: "text-violet-600",
		colorBg: "bg-violet-50",
		guideCategory: "social",
		subtypes: [
			{ slug: "parks-free", label: "Parks & free" },
			{ slug: "bars-social", label: "Bars & social" },
		],
		layout: "map-focus",
		heading: "Places to hang out near {suburb}",
		emptyPrompt: "Nothing here yet — try a nearby suburb.",
	},
};

// ── Crisis support ──

export const CRISIS_LINES = [
	{ name: "Lifeline", phone: "13 11 14", available: "24/7" },
	{ name: "Beyond Blue", phone: "1300 22 4636", available: "24/7" },
	{ name: "Kids Helpline", phone: "1800 55 1800", available: "24/7" },
];

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
};

// ── Demographics ──

type SuburbDemographics = {
	label: string;
	population18to25?: number;
	totalPopulation?: number;
};

const SUBURBS = [
	"Melbourne",
	"Carlton",
	"Richmond",
	"Brunswick",
	"Footscray",
	"St Kilda",
	"Fitzroy",
	"Docklands",
	"South Yarra",
	"Coburg",
];

const DEMOGRAPHICS: Record<string, SuburbDemographics> = {
	melbourne: {
		label: "Melbourne CBD",
		population18to25: 33100,
		totalPopulation: 149615,
	},
	carlton: {
		label: "Carlton",
		population18to25: 6840,
		totalPopulation: 18615,
	},
	richmond: {
		label: "Richmond",
		population18to25: 5870,
		totalPopulation: 28230,
	},
	brunswick: {
		label: "Brunswick",
		population18to25: 7220,
		totalPopulation: 27994,
	},
	footscray: {
		label: "Footscray",
		population18to25: 4965,
		totalPopulation: 17802,
	},
	"st kilda": { label: "St Kilda", totalPopulation: 20300 },
	fitzroy: {
		label: "Fitzroy",
		population18to25: 3385,
		totalPopulation: 11570,
	},
	docklands: { label: "Docklands", totalPopulation: 15940 },
	"south yarra": {
		label: "South Yarra",
		population18to25: 6040,
		totalPopulation: 25866,
	},
	coburg: { label: "Coburg", population18to25: 5110, totalPopulation: 27043 },
};

// ── Mock places ──

const MOCK_PLACES: Record<string, NearMePlace[]> = {
	melbourne: [
		// ── Setup ──
		{
			id: "mel-svc-1",
			name: "Melbourne Town Hall Hub",
			address: "120 Swanston St, Melbourne",
			lat: -37.815,
			lng: 144.967,
			topic: "setup",
			subtype: "services",
			phone: "(03) 9658 9658",
			type: "Service centre",
			hours: "Mon–Fri 8:30 am – 5 pm",
			openNow: true,
			tags: ["Free", "Walk-in"],
		},
		{
			id: "mel-svc-2",
			name: "Centrelink – CBD",
			address: "595 Collins St, Melbourne",
			lat: -37.8195,
			lng: 144.955,
			topic: "setup",
			subtype: "services",
			phone: "136 150",
			type: "Government services",
			hours: "Mon–Fri 8:30 am – 4:30 pm",
			openNow: true,
			tags: ["Medicare", "Centrelink", "myGov"],
		},
		{
			id: "mel-lib-1",
			name: "State Library Victoria",
			address: "328 Swanston St, Melbourne",
			lat: -37.81,
			lng: 144.965,
			topic: "setup",
			subtype: "libraries",
			type: "Library",
			hours: "Daily 10 am – 6 pm",
			openNow: true,
			tags: ["Free Wi-Fi", "Study spaces"],
			snippet: "Huge reading rooms, free Wi-Fi, and community programs. Great for studying or just settling in.",
		},
		{
			id: "mel-lib-2",
			name: "City Library – Flinders Lane",
			address: "253 Flinders Ln, Melbourne",
			lat: -37.8178,
			lng: 144.966,
			topic: "setup",
			subtype: "libraries",
			type: "Library",
			hours: "Mon–Fri 8 am – 8 pm, Sat–Sun 10 am – 5 pm",
			openNow: true,
			tags: ["Free Wi-Fi", "Events"],
		},
		// ── Survive ──
		{
			id: "mel-food-1",
			name: "Little Lunch House",
			address: "17 Hardware Ln, Melbourne",
			lat: -37.813,
			lng: 144.961,
			topic: "survive",
			subtype: "food-dining",
			rating: 4.6,
			reviewCount: 284,
			type: "Cafe",
			hours: "Daily 7 am – 4 pm",
			openNow: true,
			snippet: "Generous portions and student-friendly prices. The rice bowls are huge.",
			tags: ["Under $15", "Student deal"],
		},
		{
			id: "mel-food-2",
			name: "Nasi Lemak Korner",
			address: "53 Elizabeth St, Melbourne",
			lat: -37.8145,
			lng: 144.963,
			topic: "survive",
			subtype: "food-dining",
			rating: 4.4,
			reviewCount: 512,
			type: "Malaysian",
			hours: "Daily 10 am – 9 pm",
			openNow: true,
			snippet: "Authentic Malaysian at student prices. Cash only but worth it.",
			tags: ["Under $12", "Cash only"],
		},
		{
			id: "mel-food-3",
			name: "Stalactites",
			address: "177 Lonsdale St, Melbourne",
			lat: -37.811,
			lng: 144.964,
			topic: "survive",
			subtype: "food-dining",
			rating: 4.3,
			reviewCount: 1870,
			type: "Greek",
			hours: "24 hours",
			openNow: true,
			snippet: "Open 24 hours. Good for a late-night souvlaki after uni.",
			tags: ["24 hours", "Under $18"],
		},
		{
			id: "mel-groc-1",
			name: "Queen Vic Fresh Market",
			address: "513 Elizabeth St, Melbourne",
			lat: -37.807,
			lng: 144.958,
			topic: "survive",
			subtype: "groceries",
			rating: 4.5,
			reviewCount: 3420,
			type: "Market",
			hours: "Tue, Thu–Sun 6 am – 3 pm",
			snippet: "Best fresh produce prices in the CBD, especially late in the day when vendors discount.",
			tags: ["Fresh produce", "Bargain buys"],
		},
		{
			id: "mel-groc-2",
			name: "Woolworths Metro – Swanston",
			address: "181 Swanston St, Melbourne",
			lat: -37.814,
			lng: 144.966,
			topic: "survive",
			subtype: "groceries",
			type: "Supermarket",
			hours: "Daily 6 am – midnight",
			openNow: true,
			tags: ["Late-night"],
		},
		// ── Get around ──
		{
			id: "mel-train-1",
			name: "Flinders Street Station",
			address: "Flinders St, Melbourne",
			lat: -37.818,
			lng: 144.967,
			topic: "get-around",
			subtype: "trains-trams",
			type: "Train station",
			hours: "First service ~5 am",
			tags: ["Major hub", "All lines"],
		},
		{
			id: "mel-train-2",
			name: "Melbourne Central Station",
			address: "Cnr Swanston & La Trobe St, Melbourne",
			lat: -37.81,
			lng: 144.963,
			topic: "get-around",
			subtype: "trains-trams",
			type: "Train station",
			hours: "First service ~5 am",
			tags: ["City Loop"],
		},
		{
			id: "mel-tram-1",
			name: "Free Tram Zone – entire CBD",
			address: "Central Melbourne",
			lat: -37.815,
			lng: 144.965,
			topic: "get-around",
			subtype: "trains-trams",
			type: "Tram network",
			snippet: "All trams within the CBD are free. Look for the green signs at stops.",
			tags: ["Free", "No Myki needed"],
		},
		{
			id: "mel-bike-1",
			name: "Melbourne Bike Share – Fed Square",
			address: "Federation Square, Melbourne",
			lat: -37.818,
			lng: 144.969,
			topic: "get-around",
			subtype: "bikes-buses",
			type: "Bike share dock",
			hours: "24/7",
			tags: ["$3/trip"],
		},
		{
			id: "mel-bus-1",
			name: "Bus Route 901 – Frankston → Airport",
			address: "Multiple stops through Melbourne",
			lat: -37.816,
			lng: 144.96,
			topic: "get-around",
			subtype: "bikes-buses",
			type: "Bus route",
			hours: "Every 15–20 min",
			tags: ["SmartBus", "Airport link"],
		},
		// ── Health ──
		{
			id: "mel-gp-1",
			name: "City Med GP Clinic",
			address: "220 Collins St, Melbourne",
			lat: -37.815,
			lng: 144.966,
			topic: "health",
			subtype: "gp-clinics",
			phone: "(03) 9000 2100",
			rating: 4.4,
			reviewCount: 189,
			type: "GP clinic",
			hours: "Mon–Fri 8 am – 6 pm",
			openNow: true,
			tags: ["Bulk billing", "Walk-in"],
		},
		{
			id: "mel-gp-2",
			name: "Swanston Street Medical",
			address: "160 Swanston St, Melbourne",
			lat: -37.814,
			lng: 144.966,
			topic: "health",
			subtype: "gp-clinics",
			phone: "(03) 9654 3299",
			rating: 4.2,
			reviewCount: 94,
			type: "GP clinic",
			hours: "Mon–Sat 8 am – 8 pm",
			openNow: true,
			tags: ["Bulk billing", "Evening hours"],
		},
		{
			id: "mel-gp-3",
			name: "Melbourne Central Clinic",
			address: "300 Lonsdale St, Melbourne",
			lat: -37.812,
			lng: 144.963,
			topic: "health",
			subtype: "gp-clinics",
			phone: "(03) 9663 3100",
			rating: 4.0,
			reviewCount: 67,
			type: "GP clinic",
			hours: "Mon–Fri 9 am – 5 pm",
			openNow: true,
			tags: ["Walk-in", "Scripts"],
		},
		{
			id: "mel-mh-1",
			name: "City Wellbeing Hub",
			address: "88 Queen St, Melbourne",
			lat: -37.816,
			lng: 144.962,
			topic: "health",
			subtype: "mental-health",
			phone: "(03) 9000 3100",
			type: "Counselling",
			hours: "Mon–Fri 9 am – 5 pm",
			openNow: true,
			tags: ["Free sessions", "No referral"],
			snippet: "Drop-in counselling for under-25s. You don't need a referral — just walk in.",
		},
		{
			id: "mel-mh-2",
			name: "headspace Melbourne",
			address: "Level 2, 484 Elizabeth St, Melbourne",
			lat: -37.808,
			lng: 144.959,
			topic: "health",
			subtype: "mental-health",
			phone: "(03) 9027 0100",
			type: "Youth mental health",
			hours: "Mon–Fri 9 am – 5 pm",
			tags: ["Ages 12–25", "Free", "GP + counselling"],
			snippet: "Free mental health support for 12–25 year olds. GPs, counsellors, and group sessions.",
		},
		// ── Connect ──
		{
			id: "mel-park-1",
			name: "Flagstaff Gardens",
			address: "309-311 William St, Melbourne",
			lat: -37.811,
			lng: 144.955,
			topic: "connect",
			subtype: "parks-free",
			type: "Park",
			hours: "Always open",
			tags: ["Free", "BBQs", "Quiet"],
		},
		{
			id: "mel-park-2",
			name: "Treasury Gardens",
			address: "Wellington Pde, East Melbourne",
			lat: -37.8145,
			lng: 144.978,
			topic: "connect",
			subtype: "parks-free",
			type: "Park",
			hours: "Always open",
			tags: ["Free", "Lake", "Shady"],
		},
		{
			id: "mel-free-1",
			name: "NGV International",
			address: "180 St Kilda Rd, Melbourne",
			lat: -37.823,
			lng: 144.969,
			topic: "connect",
			subtype: "parks-free",
			type: "Gallery",
			hours: "Daily 10 am – 5 pm",
			tags: ["Free entry", "Exhibitions"],
			snippet: "Free permanent collection. Great for a rainy afternoon.",
		},
		{
			id: "mel-bar-1",
			name: "Laneway Social Club",
			address: "21 Queen St, Melbourne",
			lat: -37.818,
			lng: 144.959,
			topic: "connect",
			subtype: "bars-social",
			rating: 4.2,
			reviewCount: 156,
			type: "Bar",
			hours: "Wed–Sun 4 pm – late",
			snippet: "Good vibes, board games, and $8 pints on Wednesdays.",
			tags: ["Happy hour", "Board games"],
		},
		{
			id: "mel-bar-2",
			name: "Section 8",
			address: "27-29 Tattersalls Ln, Melbourne",
			lat: -37.8125,
			lng: 144.966,
			topic: "connect",
			subtype: "bars-social",
			rating: 4.3,
			reviewCount: 742,
			type: "Bar",
			hours: "Daily 12 pm – 1 am",
			openNow: true,
			snippet: "Shipping container bar in a laneway. Relaxed, cheap, always packed on Fridays.",
			tags: ["Outdoor", "Cheap drinks"],
		},
	],
	carlton: [
		// ── Setup ──
		{
			id: "car-svc-1",
			name: "Argyle Square Community Room",
			address: "250 Lygon St, Carlton",
			lat: -37.798,
			lng: 144.966,
			topic: "setup",
			subtype: "services",
			type: "Community centre",
			hours: "Mon–Fri 9 am – 5 pm",
			openNow: true,
			tags: ["Free", "Multilingual"],
		},
		{
			id: "car-svc-2",
			name: "AMES Settlement – Carlton",
			address: "1 Elgin St, Carlton",
			lat: -37.8,
			lng: 144.969,
			topic: "setup",
			subtype: "services",
			phone: "(03) 9092 1500",
			type: "Settlement services",
			hours: "Mon–Fri 9 am – 5 pm",
			tags: ["Migration help", "English classes"],
		},
		{
			id: "car-lib-1",
			name: "Carlton Library",
			address: "667 Rathdowne St, Carlton",
			lat: -37.796,
			lng: 144.968,
			topic: "setup",
			subtype: "libraries",
			type: "Library",
			hours: "Mon–Sat 10 am – 6 pm",
			openNow: true,
			tags: ["Free Wi-Fi", "Printing"],
		},
		// ── Survive ──
		{
			id: "car-food-1",
			name: "Uni Budget Bites",
			address: "186 Faraday St, Carlton",
			lat: -37.8,
			lng: 144.965,
			topic: "survive",
			subtype: "food-dining",
			rating: 4.5,
			reviewCount: 312,
			type: "Takeaway",
			hours: "Daily 11 am – 9 pm",
			openNow: true,
			snippet: "The $10 rice boxes feed you for a whole day. Student favourite.",
			tags: ["Under $10", "Student deal"],
		},
		{
			id: "car-food-2",
			name: "Tiamo",
			address: "303 Lygon St, Carlton",
			lat: -37.797,
			lng: 144.967,
			topic: "survive",
			subtype: "food-dining",
			rating: 4.3,
			reviewCount: 1240,
			type: "Italian",
			hours: "Daily 7 am – 11 pm",
			openNow: true,
			snippet: "Old-school Lygon St Italian. Huge pasta bowls for under $16.",
			tags: ["Under $16", "BYO"],
		},
		{
			id: "car-food-3",
			name: "Abla's Pastries",
			address: "109 Elgin St, Carlton",
			lat: -37.8005,
			lng: 144.9685,
			topic: "survive",
			subtype: "food-dining",
			rating: 4.7,
			reviewCount: 890,
			type: "Lebanese bakery",
			hours: "Mon–Sat 7 am – 6 pm",
			snippet: "Best spinach triangles in Melbourne. A couple of bucks feeds you.",
			tags: ["Under $5", "Bakery"],
		},
		{
			id: "car-groc-1",
			name: "Lygon Pantry",
			address: "265 Lygon St, Carlton",
			lat: -37.796,
			lng: 144.967,
			topic: "survive",
			subtype: "groceries",
			type: "Grocery store",
			hours: "Daily 7 am – 10 pm",
			openNow: true,
			tags: ["Late-night", "International goods"],
		},
		{
			id: "car-groc-2",
			name: "IGA Xpress – Carlton",
			address: "163 Elgin St, Carlton",
			lat: -37.8015,
			lng: 144.969,
			topic: "survive",
			subtype: "groceries",
			type: "Supermarket",
			hours: "Daily 7 am – 11 pm",
			openNow: true,
			tags: ["Late-night"],
		},
		// ── Get around ──
		{
			id: "car-tram-1",
			name: "Tram Stop 1 – Lygon St / Elgin St",
			address: "Lygon St at Elgin St, Carlton",
			lat: -37.8,
			lng: 144.968,
			topic: "get-around",
			subtype: "trains-trams",
			type: "Tram stop",
			hours: "First service ~5:30 am",
			tags: ["Route 1", "Route 6"],
		},
		{
			id: "car-tram-2",
			name: "Tram Stop – Nicholson St / Elgin St",
			address: "Nicholson St at Elgin St, Carlton",
			lat: -37.8,
			lng: 144.973,
			topic: "get-around",
			subtype: "trains-trams",
			type: "Tram stop",
			tags: ["Route 96"],
		},
		{
			id: "car-bus-1",
			name: "Bus Stop – Grattan St / Swanston St",
			address: "Grattan St, Carlton",
			lat: -37.802,
			lng: 144.964,
			topic: "get-around",
			subtype: "bikes-buses",
			type: "Bus stop",
			hours: "Routes vary",
		},
		{
			id: "car-bike-1",
			name: "Bike Share – Carlton Gardens",
			address: "Carlton St, Carlton",
			lat: -37.806,
			lng: 144.971,
			topic: "get-around",
			subtype: "bikes-buses",
			type: "Bike share dock",
			hours: "24/7",
			tags: ["$3/trip"],
		},
		// ── Health ──
		{
			id: "car-gp-1",
			name: "Carlton Family Clinic",
			address: "74 Lygon St, Carlton",
			lat: -37.798,
			lng: 144.968,
			topic: "health",
			subtype: "gp-clinics",
			phone: "(03) 9012 4400",
			rating: 4.3,
			reviewCount: 147,
			type: "GP clinic",
			hours: "Mon–Sat 8 am – 6 pm",
			openNow: true,
			tags: ["Bulk billing", "Walk-in"],
		},
		{
			id: "car-gp-2",
			name: "UniMelb Health Service",
			address: "138 Cardigan St, Carlton",
			lat: -37.7995,
			lng: 144.963,
			topic: "health",
			subtype: "gp-clinics",
			phone: "(03) 8344 6904",
			rating: 4.1,
			reviewCount: 53,
			type: "Student health",
			hours: "Mon–Fri 9 am – 5 pm",
			tags: ["Students only", "Bulk billing"],
			snippet: "Free for UniMelb students. Appointments or walk-in.",
		},
		{
			id: "car-mh-1",
			name: "Northside Headspace",
			address: "120 Queensberry St, Carlton",
			lat: -37.804,
			lng: 144.964,
			topic: "health",
			subtype: "mental-health",
			phone: "(03) 9349 3000",
			type: "Youth mental health",
			hours: "Mon–Fri 9 am – 5 pm",
			tags: ["Ages 12–25", "Free", "No referral"],
			snippet: "Walk-in support for under-25s. Counselling, group programs, and GP services.",
		},
		// ── Connect ──
		{
			id: "car-park-1",
			name: "Carlton Gardens",
			address: "1-111 Carlton St, Carlton",
			lat: -37.806,
			lng: 144.971,
			topic: "connect",
			subtype: "parks-free",
			type: "Park",
			hours: "Always open",
			tags: ["Free", "Heritage-listed", "Huge"],
		},
		{
			id: "car-park-2",
			name: "Argyle Square",
			address: "Lygon St & Argyle Pl, Carlton",
			lat: -37.798,
			lng: 144.966,
			topic: "connect",
			subtype: "parks-free",
			type: "Small park",
			hours: "Always open",
			tags: ["Free", "Benches", "Quiet"],
		},
		{
			id: "car-bar-1",
			name: "Cinema Nova",
			address: "380 Lygon St, Carlton",
			lat: -37.797,
			lng: 144.967,
			topic: "connect",
			subtype: "bars-social",
			rating: 4.5,
			reviewCount: 2100,
			type: "Cinema",
			hours: "Daily, sessions vary",
			snippet: "Independent cinema with $10 student tickets. Good for a cheap night out.",
			tags: ["Student price", "Indie films"],
		},
		{
			id: "car-bar-2",
			name: "The Clyde Hotel",
			address: "385 Cardigan St, Carlton",
			lat: -37.799,
			lng: 144.964,
			topic: "connect",
			subtype: "bars-social",
			rating: 4.1,
			reviewCount: 320,
			type: "Pub",
			hours: "Daily 12 pm – late",
			openNow: true,
			snippet: "Trivia on Tuesdays. Good pub meals and $7 pots.",
			tags: ["Trivia night", "Pub meals"],
		},
	],
};

// ── Local pulse ──

export const LOCAL_PULSE_SAMPLE = [
	{
		id: "pulse-1",
		title: "Melbourne council extends free community fitness sessions",
		source: "City bulletin",
	},
	{
		id: "pulse-2",
		title: "New late-night tram safety marshals rolled out in inner north",
		source: "Transport update",
	},
	{
		id: "pulse-3",
		title: "Student-led food co-op opens low-cost pantry night",
		source: "Local news",
	},
];

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
	if (!input) return "health";
	const normalized = input.toLowerCase().trim();
	if (NEAR_ME_TOPICS.includes(normalized as NearMeTopic)) {
		return normalized as NearMeTopic;
	}
	return "health";
}

export function getSuburbSuggestions(query: string) {
	const normalized = query.trim().toLowerCase();
	if (!normalized) return SUBURBS.slice(0, 5);
	return SUBURBS.filter((suburb) =>
		suburb.toLowerCase().includes(normalized),
	).slice(0, 6);
}

export function getSuburbDisplayName(rawSuburb: string) {
	const trimmed = rawSuburb.trim();
	if (!trimmed) return "";
	const found = SUBURBS.find(
		(candidate) => candidate.toLowerCase() === trimmed.toLowerCase(),
	);
	return found ?? trimmed;
}

export function getMockPlaces({
	suburb,
	topic,
	subtype,
	keyword,
	useLocation,
}: {
	suburb: string;
	topic: NearMeTopic;
	subtype?: string;
	keyword?: string;
	useLocation?: boolean;
}) {
	const normalizedSuburb = suburb.trim().toLowerCase();
	const suburbPool =
		MOCK_PLACES[normalizedSuburb] ?? MOCK_PLACES.melbourne ?? [];

	let pool = suburbPool.filter((place) => place.topic === topic);

	if (subtype) {
		const filtered = pool.filter((place) => place.subtype === subtype);
		if (filtered.length) pool = filtered;
	}

	const normalizedKeyword = keyword?.trim().toLowerCase();
	if (normalizedKeyword) {
		pool = pool.filter((place) =>
			`${place.name} ${place.address} ${place.type ?? ""} ${(place.tags ?? []).join(" ")}`
				.toLowerCase()
				.includes(normalizedKeyword),
		);
	}

	return pool.map((place, index) => ({
		...place,
		distanceKm: useLocation
			? Number((0.4 + index * 0.7).toFixed(1))
			: undefined,
	}));
}

export function getMockDemographics(suburb: string) {
	const normalized = suburb.trim().toLowerCase();
	return DEMOGRAPHICS[normalized] ?? { label: getSuburbDisplayName(suburb) };
}

export function formatNumber(value: number) {
	return new Intl.NumberFormat("en-AU").format(value);
}
