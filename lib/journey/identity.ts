export type PaletteColor = { hex: string; name: string };

export type JourneyIdentity = {
  archetype: string;
  mantra: string;
  final_mantra: string;
  symbol: string;
  mood: string;
  suburb_line: string;
  palette: [PaletteColor, PaletteColor, PaletteColor];
  traits: {
    courage: number;
    curiosity: number;
    social: number;
    independence: number;
  };
  letter: {
    body: string;
    sign_off: string;
  };
};

export type CardTitleTier =
  | "newcomer"
  | "finding-my-feet"
  | "settling-in"
  | "melbourne-local";

export type IdentityCardState = {
  daysCompleted: number[];
  saturation: number;
  titleTier: CardTitleTier;
  stampsEarned: string[];
  memoryLines: Record<number, string>;
  traitValues: {
    courage: number;
    curiosity: number;
    social: number;
    independence: number;
  };
  constellationLit: number;
  symbolGlowing: boolean;
  fullyUnlocked: boolean;
};

export type IdentityStore = {
  identity: JourneyIdentity;
  cardState: IdentityCardState;
};

export const MOCK_IDENTITY: JourneyIdentity = {
  archetype: "The Quiet Pioneer",
  mantra: "Roots grow slowly. That's okay.",
  final_mantra: "You've taken root.",
  symbol: "🌱",
  mood: "partly cloudy with warmth breaking through",
  suburb_line: "Melbourne: every street has something to learn.",
  palette: [
    { hex: "#4A90D9", name: "Melbourne Blue" },
    { hex: "#C8A96E", name: "Laneway Gold" },
    { hex: "#1A2A3A", name: "Night Arrival" },
  ],
  traits: {
    courage: 72,
    curiosity: 85,
    social: 48,
    independence: 78,
  },
  letter: {
    body: "You arrived with courage in your suitcase and questions you haven't figured out how to ask yet. Melbourne is a good city for that — loud enough to feel alive, small enough to learn. That's what this week is for. People who feel alone in their first few days here often find that Melbourne rewards small acts of showing up — the coffee order you learn, the tram route you memorise, the corner you start to recognise. You made it this far. That's not nothing.",
    sign_off: "— Your City",
  },
};

type TopicSlug =
  | "food-eating"
  | "getting-around"
  | "health-wellbeing"
  | "home-admin"
  | "social-belonging";

type ArchetypeBlueprint = {
  archetype: string;
  mantra: string;
  final_mantra: string;
  symbol: string;
  mood: string;
  palette: [PaletteColor, PaletteColor, PaletteColor];
  traits: JourneyIdentity["traits"];
  letterTemplate: (suburb: string) => string;
};

const BLUEPRINTS: Record<string, ArchetypeBlueprint> = {
  "social-belonging": {
    archetype: "The Open Heart",
    mantra: "Connection starts with one brave hello.",
    final_mantra: "You belong here now.",
    symbol: "🌊",
    mood: "warm with sunshine breaking through",
    palette: [
      { hex: "#E07A5F", name: "Coral Warmth" },
      { hex: "#F2CC8F", name: "Golden Hour" },
      { hex: "#3D405B", name: "Late Evening" },
    ],
    traits: { courage: 68, curiosity: 76, social: 88, independence: 52 },
    letterTemplate: (suburb) =>
      `You came here ready to meet people, even if you don't fully know it yet. ${suburb} will help with that — this city opens up when you do. Melbourne doesn't ask you to have everything figured out before it welcomes you. The friendships that start here tend to begin small — a shared tram, a familiar face at the café, a conversation you didn't plan. You're already doing the hard part just by being here.`,
  },
  "getting-around": {
    archetype: "The Urban Explorer",
    mantra: "Every wrong tram is a new street found.",
    final_mantra: "You know this city now.",
    symbol: "🧭",
    mood: "bright and energetic",
    palette: [
      { hex: "#48CAE4", name: "Sky Line" },
      { hex: "#023E8A", name: "Deep Transit" },
      { hex: "#ADE8F4", name: "Open Air" },
    ],
    traits: { courage: 65, curiosity: 92, social: 58, independence: 82 },
    letterTemplate: (suburb) =>
      `You're the kind of person who figures things out by moving through them. ${suburb} suits that — there's always another street to learn. Melbourne reveals itself slowly. The shortcuts, the hidden laneways, the tram lines that actually make sense — you'll know them all by the end of this week. The city rewards people who explore it on foot, even when they're slightly lost.`,
  },
  "health-wellbeing": {
    archetype: "The Careful Settler",
    mantra: "Slow down. You're already here.",
    final_mantra: "You've found your rhythm.",
    symbol: "🌿",
    mood: "calm and quiet",
    palette: [
      { hex: "#52B788", name: "Eucalyptus" },
      { hex: "#D8F3DC", name: "Still Morning" },
      { hex: "#1B4332", name: "Deep Green" },
    ],
    traits: { courage: 60, curiosity: 72, social: 55, independence: 85 },
    letterTemplate: (suburb) =>
      `You arrived with a quiet determination most people don't even notice in themselves. ${suburb} is a good place to settle into — the pace here rewards those who take it seriously. Taking care of yourself in a new city is an act of courage. This week is about building a foundation, not rushing to the finish. Melbourne will wait for you.`,
  },
  "home-admin": {
    archetype: "The Steady Builder",
    mantra: "One thing sorted. Then the next.",
    final_mantra: "You built something solid here.",
    symbol: "🔑",
    mood: "golden, purposeful",
    palette: [
      { hex: "#E9C46A", name: "Laneway Gold" },
      { hex: "#264653", name: "Deep Teal" },
      { hex: "#F4A261", name: "Warm Brick" },
    ],
    traits: { courage: 74, curiosity: 64, social: 50, independence: 90 },
    letterTemplate: (suburb) =>
      `You showed up and started sorting things out before most people even unpack. ${suburb} has everything you need — it just takes a week to find it. The admin feels overwhelming at first. It isn't. You've already started, and that's the hardest part. Melbourne was built by people who figured it out as they went. You're doing the same thing.`,
  },
  "food-eating": {
    archetype: "The Hungry Wanderer",
    mantra: "The best meal is the one you haven't had yet.",
    final_mantra: "You've found your table.",
    symbol: "☕",
    mood: "warm and cozy",
    palette: [
      { hex: "#9B2335", name: "Market Red" },
      { hex: "#D4A853", name: "Morning Coffee" },
      { hex: "#2C1810", name: "Dark Roast" },
    ],
    traits: { courage: 70, curiosity: 88, social: 72, independence: 62 },
    letterTemplate: (suburb) =>
      `You found your way to ${suburb}, which means you already have good instincts. Melbourne's food culture isn't something you discover — it's something you stumble into, then never leave. This week, let eating be the thread that pulls the rest together. The best market stall, the café that gets your order right, the corner spot that feels like yours — they're all there. You just have to find them.`,
  },
  default: {
    archetype: "The Quiet Pioneer",
    mantra: "Roots grow slowly. That's okay.",
    final_mantra: "You've taken root.",
    symbol: "🌱",
    mood: "partly cloudy with warmth breaking through",
    palette: [
      { hex: "#4A90D9", name: "Melbourne Blue" },
      { hex: "#C8A96E", name: "Laneway Gold" },
      { hex: "#1A2A3A", name: "Night Arrival" },
    ],
    traits: { courage: 72, curiosity: 85, social: 48, independence: 78 },
    letterTemplate: (suburb) =>
      `You arrived with courage in your suitcase and questions you haven't figured out how to ask yet. ${suburb} is a good suburb for that — loud enough to feel alive, small enough to learn. People who feel alone in their first few days here often find that Melbourne rewards small acts of showing up — the coffee order you learn, the tram route you memorise, the corner you start to recognise. You made it this far. That's not nothing.`,
  },
};

export function buildMockIdentity(
  suburb: string,
  topics: string[],
): JourneyIdentity {
  const priority = (
    ["social-belonging", "getting-around", "health-wellbeing", "home-admin", "food-eating"] as TopicSlug[]
  ).find((t) => topics.includes(t)) ?? "default";

  const bp = BLUEPRINTS[priority] ?? BLUEPRINTS.default;
  const suburbDisplay = suburb || "your suburb";

  return {
    archetype: bp.archetype,
    mantra: bp.mantra,
    final_mantra: bp.final_mantra,
    symbol: bp.symbol,
    mood: bp.mood,
    suburb_line: `${suburbDisplay}: your new corner of Melbourne.`,
    palette: bp.palette,
    traits: bp.traits,
    letter: {
      body: bp.letterTemplate(suburbDisplay).trim(),
      sign_off: "— Your City",
    },
  };
}

const SPECIES_TO_BLUEPRINT: Record<string, string> = {
  pioneer: "default",
  settler: "health-wellbeing",
  builder: "home-admin",
  openheart: "social-belonging",
};

export function buildIdentityFromLLM(
  llm: import("@/lib/journey/week-plan-store").IdentityLLM,
): JourneyIdentity {
  const bp = BLUEPRINTS[SPECIES_TO_BLUEPRINT[llm.species] ?? "default"] ?? BLUEPRINTS.default;
  return {
    archetype: bp.archetype,
    mantra: bp.mantra,
    final_mantra: bp.final_mantra,
    symbol: bp.symbol,
    mood: bp.mood,
    suburb_line: llm.suburb_line,
    palette: [
      { hex: llm.vibe.hex, name: llm.vibe.name },
      bp.palette[1],
      bp.palette[2],
    ],
    traits: bp.traits,
    letter: {
      body: llm.letter_body,
      sign_off: "— Your City",
    },
  };
}

export const TITLE_LABELS: Record<CardTitleTier, string> = {
  newcomer: "Newcomer",
  "finding-my-feet": "Finding My Feet",
  "settling-in": "Settling In",
  "melbourne-local": "Melbourne Local",
};

const DAY_STAMPS: Record<number, string> = {
  1: "First Night",
  2: "Settled In",
};

const SATURATION_BY_DAY: Record<number, number> = {
  0: 30,
  1: 45,
  2: 45,
  3: 60,
  4: 60,
  5: 60,
  6: 85,
  7: 100,
};

const TITLE_BY_DAY: Record<number, CardTitleTier> = {
  0: "newcomer",
  1: "newcomer",
  2: "newcomer",
  3: "finding-my-feet",
  4: "finding-my-feet",
  5: "settling-in",
  6: "settling-in",
  7: "melbourne-local",
};

const IDENTITY_KEY = "minuri:journey:identity:v1";

export function loadIdentityStore(): IdentityStore | null {
  try {
    const raw = localStorage.getItem(IDENTITY_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as IdentityStore;
  } catch {
    return null;
  }
}

export function saveIdentityStore(store: IdentityStore): void {
  try {
    localStorage.setItem(IDENTITY_KEY, JSON.stringify(store));
  } catch { /* ignore */ }
}

export function clearIdentityStore(): void {
  try {
    localStorage.removeItem(IDENTITY_KEY);
  } catch { /* ignore */ }
}

export function buildInitialCardState(
  identity: JourneyIdentity,
): IdentityCardState {
  return {
    daysCompleted: [],
    saturation: 30,
    titleTier: "newcomer",
    stampsEarned: [],
    memoryLines: {},
    traitValues: { ...identity.traits },
    constellationLit: 0,
    symbolGlowing: false,
    fullyUnlocked: false,
  };
}

export function applyDayEarn(
  state: IdentityCardState,
  day: number,
  memoryLine?: string,
): IdentityCardState {
  const daysCompleted = [
    ...new Set([...state.daysCompleted, day]),
  ].sort((a, b) => a - b);
  const maxDay = Math.max(...daysCompleted, 0);

  const stampsEarned = [...state.stampsEarned];
  if (DAY_STAMPS[day] && !stampsEarned.includes(DAY_STAMPS[day])) {
    stampsEarned.push(DAY_STAMPS[day]);
  }

  const memoryLines = { ...state.memoryLines };
  if (memoryLine) memoryLines[day] = memoryLine;

  return {
    ...state,
    daysCompleted,
    saturation: SATURATION_BY_DAY[maxDay] ?? 30,
    titleTier: TITLE_BY_DAY[maxDay] ?? "newcomer",
    stampsEarned,
    memoryLines,
    constellationLit: daysCompleted.length,
    symbolGlowing: daysCompleted.length >= 5,
    fullyUnlocked: daysCompleted.length >= 7,
  };
}
