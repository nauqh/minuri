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
    sign_off: "— Minuri",
  },
};

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
  "first-timer": {
    archetype: "The First-Timer",
    mantra: "Everything's new. That's okay.",
    final_mantra: "Turns out, I had it in me.",
    symbol: "🔑",
    mood: "cautiously hopeful",
    palette: [
      { hex: "#E9C46A", name: "Laneway Gold" },
      { hex: "#264653", name: "Deep Teal" },
      { hex: "#F4A261", name: "Warm Brick" },
    ],
    traits: { courage: 74, curiosity: 78, social: 55, independence: 80 },
    letterTemplate: (suburb) =>
      `You arrived without a manual, which is how most people arrive. ${suburb} doesn't expect you to know everything — it just expects you to show up, which you already did. The admin, the kitchen, the tram routes — none of it is as complicated as it feels right now. You'll figure each thing out the same way everyone does: one at a time, slightly awkwardly, and then suddenly it's just normal. You made it this far on instinct. That's not nothing.`,
  },
  "far-from-home": {
    archetype: "The Far-From-Home",
    mantra: "Home feels very far right now.",
    final_mantra: "I built something here without losing what I had.",
    symbol: "🌏",
    mood: "quietly carrying something heavy",
    palette: [
      { hex: "#4A90D9", name: "Melbourne Blue" },
      { hex: "#C8A96E", name: "Laneway Gold" },
      { hex: "#1A2A3A", name: "Night Arrival" },
    ],
    traits: { courage: 80, curiosity: 72, social: 62, independence: 76 },
    letterTemplate: (suburb) =>
      `The distance is real. ${suburb} is not the place you grew up, and the people who know you best are not nearby. That weight doesn't go away quickly, and it doesn't need to. What does happen — slowly, unremarkably — is that Melbourne starts to have corners that feel like yours. A café you return to. A route you stop thinking about. A face you recognise. It's not a replacement. It's something that grows alongside what you already have. You're allowed to miss home and build something new at the same time.`,
  },
  "solo-arrival": {
    archetype: "The Solo Arrival",
    mantra: "I'm starting from zero here.",
    final_mantra: "I'm not a stranger anymore.",
    symbol: "🌱",
    mood: "open, quietly apprehensive",
    palette: [
      { hex: "#52B788", name: "Eucalyptus" },
      { hex: "#D8F3DC", name: "Still Morning" },
      { hex: "#1B4332", name: "Deep Green" },
    ],
    traits: { courage: 82, curiosity: 80, social: 60, independence: 85 },
    letterTemplate: (suburb) =>
      `You arrived knowing no one, which takes more courage than most people give it credit for. ${suburb} is full of people who did exactly the same thing — you just can't tell yet, because everyone looks like they belong. The social life you're imagining doesn't appear all at once. It starts with one regular place, one repeated face, one conversation that goes slightly longer than expected. Melbourne is good at that. It opens up slowly, then all at once. You're earlier in the process than it feels.`,
  },
  "reluctant-grownup": {
    archetype: "The Reluctant Grownup",
    mantra: "I didn't quite plan for this.",
    final_mantra: "I'm here. And I'm choosing to stay.",
    symbol: "🧭",
    mood: "uncertain but present",
    palette: [
      { hex: "#E07A5F", name: "Coral Warmth" },
      { hex: "#F2CC8F", name: "Golden Hour" },
      { hex: "#3D405B", name: "Late Evening" },
    ],
    traits: { courage: 68, curiosity: 82, social: 65, independence: 72 },
    letterTemplate: (suburb) =>
      `Not every arrival is a choice you made cleanly. Maybe life moved you here — a course, a job, a circumstance that made ${suburb} the answer before you'd fully formed the question. That's okay. The city doesn't ask for certainty at the door. What tends to happen is this: you do the practical things, then you do the social things, and somewhere in between you realise you've started building something. It doesn't feel like a decision at first. Then one day it does. You're allowed to be unsure about being here and still make something good of it.`,
  },
};

export function buildMockIdentity(
  suburb: string,
  topics: string[],
): JourneyIdentity {
  const archetypeByTopic: Record<string, string> = {
    "social-belonging": "solo-arrival",
    "health-wellbeing": "far-from-home",
    "home-admin": "first-timer",
    "food-eating": "first-timer",
    "getting-around": "reluctant-grownup",
  };
  const priority = topics.map((t) => archetypeByTopic[t]).find(Boolean) ?? "first-timer";

  const bp = BLUEPRINTS[priority] ?? BLUEPRINTS["first-timer"];
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
      sign_off: "— Minuri",
    },
  };
}

export function buildIdentityFromLLM(
  llm: import("@/lib/journey/week-plan-store").IdentityLLM,
): JourneyIdentity {
  const bp = BLUEPRINTS[llm.archetype] ?? BLUEPRINTS["first-timer"];
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
      sign_off: "— Minuri",
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
