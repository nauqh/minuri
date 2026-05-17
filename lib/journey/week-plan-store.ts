import { GUIDES } from "@/content/guides";
import type { GuideTopicSlug } from "@/content/guides";
import type { DayPlan } from "@/lib/journey-week";

const WEEK_PLAN_KEY = "minuri:journey:weekplan:v1";

export type VibeLLM = {
  name: string;
  hex: string;
  traits: string;
};

export type IdentityLLM = {
  species: "pioneer" | "settler" | "builder" | "openheart";
  vibe: VibeLLM;
  letter_body: string;
  suburb_line: string;
};

export type DayPlanLLM = {
  day: number;
  theme: string;
  short_label: string;
  narrative: string;
  topic: GuideTopicSlug;
  guides: string[];
  tasks: string[];
  memory_line: string;
  stamp_label: string | null;
};

export type WeekPlanLLM = {
  days: DayPlanLLM[];
};

export type JourneyAPIResponse = {
  identity: IdentityLLM;
  week_plan: WeekPlanLLM;
};

export function saveWeekPlan(plan: WeekPlanLLM): void {
  try {
    localStorage.setItem(WEEK_PLAN_KEY, JSON.stringify(plan));
  } catch { /* ignore */ }
}

export function loadWeekPlan(): WeekPlanLLM | null {
  try {
    const raw = localStorage.getItem(WEEK_PLAN_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as WeekPlanLLM;
  } catch { return null; }
}

export function clearWeekPlan(): void {
  try {
    localStorage.removeItem(WEEK_PLAN_KEY);
  } catch { /* ignore */ }
}

const VALID_GUIDE_SLUGS = new Set(GUIDES.map((g) => g.slug));

export function resolveWeekPlan(llm: WeekPlanLLM): DayPlan[] {
  return llm.days
    .map((d): DayPlan | null => {
      const guides = d.guides
        .filter((slug) => VALID_GUIDE_SLUGS.has(slug))
        .map((slug) => GUIDES.find((g) => g.slug === slug && g.isPublished))
        .filter(Boolean) as (typeof GUIDES)[number][];
      if (guides.length === 0) return null;
      return {
        day: d.day,
        theme: d.theme,
        shortLabel: d.short_label,
        topicSlug: d.topic,
        narrative: d.narrative,
        guides,
        tasks: d.tasks,
        memoryLine: d.memory_line,
      };
    })
    .filter(Boolean) as DayPlan[];
}
