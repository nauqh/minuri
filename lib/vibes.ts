export type Vibe = {
	id: string;
	name: string;
	hex: string;
	/** Human-readable trait summary — used later to drive assignment logic. */
	traits: string;
};

export const VIBES = [
	{
		id: "coral",
		name: "Coral Drift",
		hex: "#F76C6C",
		traits: "Social, warm, outgoing. Drawn to food and belonging.",
	},
	{
		id: "lavender",
		name: "Lavender Calm",
		hex: "#9B8EC4",
		traits: "Reflective, creative, emotionally self-aware.",
	},
	{
		id: "sage",
		name: "Sage Ground",
		hex: "#5C9E78",
		traits: "Grounded, practical, health-conscious.",
	},
	{
		id: "amber",
		name: "Amber Roam",
		hex: "#E09B3D",
		traits: "Adventurous, optimistic. Prioritises getting around and exploring.",
	},
	{
		id: "rose",
		name: "Dusty Rose",
		hex: "#D4849A",
		traits: "Connection-seeking, open, gentle. Needs belonging most.",
	},
	{
		id: "slate",
		name: "Slate Blue",
		hex: "#5B7EC5",
		traits: "Structured, systematic. Wants setup and admin sorted first.",
	},
	{
		id: "sienna",
		name: "Warm Sienna",
		hex: "#C2714F",
		traits: "Bold, independent, resourceful. Self-sufficient by default.",
	},
	{
		id: "mint",
		name: "Fresh Mint",
		hex: "#3DBFB8",
		traits: "Curious, energetic. Everything feels new and that is exciting.",
	},
	{
		id: "plum",
		name: "Deep Plum",
		hex: "#8B5EA0",
		traits: "Cultural depth, introspective. Seeks meaning, not just utility.",
	},
	{
		id: "sand",
		name: "Sandy Dusk",
		hex: "#C4A882",
		traits: "Comfort-seeking, nostalgic. Home still feels far away.",
	},
] as const satisfies Vibe[];

export type VibeId = (typeof VIBES)[number]["id"];

export const DEFAULT_VIBE_ID: VibeId = "mint";

export function getVibe(id: string): Vibe {
	return (
		(VIBES as readonly Vibe[]).find((v) => v.id === id) ??
		(VIBES as readonly Vibe[]).find((v) => v.id === DEFAULT_VIBE_ID)!
	);
}
