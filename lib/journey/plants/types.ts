export type Branch = {
  id: string;
  d: string;
  sw: number;
  depth: number;
  day: number;
  tx: number;
  ty: number;
};

export type Leaf = {
  id: string;
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  rot: number;
  sway: number;
  dur: number;
  day: number;
};

export type BloomStyle = "flower" | "blossom" | "spiral" | "cluster" | "crown";

export type BloomPoint = {
  id: string;
  cx: number;
  cy: number;
  day: number;
  style: BloomStyle;
};

export type SpeciesData = {
  branches: Branch[];
  leaves: Leaf[];
  blooms: BloomPoint[];
  leafColor: string;
};

export type SpeciesKey = "pioneer" | "settler" | "builder" | "openheart";
