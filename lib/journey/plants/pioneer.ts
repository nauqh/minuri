import { Branch, Leaf, SpeciesData } from "./types";
import { BASE_X, BASE_Y, jitter, qPath } from "./utils";

function growPioneer(
  out: { branches: Branch[]; leaves: Leaf[] },
  x: number,
  y: number,
  angleDeg: number,
  length: number,
  depth: number,
  id: string,
): void {
  if (depth > 3) return;
  const rad = (angleDeg * Math.PI) / 180;
  const jx = jitter(id + "ex", depth === 0 ? 1.5 : 3.5);
  const jy = jitter(id + "ey", depth === 0 ? 1 : 2.5);
  const tx = x + Math.sin(rad) * length + jx;
  const ty = y - Math.cos(rad) * length + jy;
  const sw = [3.8, 2.5, 1.6, 0.9][depth]!;
  out.branches.push({ id, d: qPath(x, y, tx, ty, id), sw, depth, day: depth + 1, tx, ty });
  if (depth >= 2) {
    out.leaves.push({
      id: `lf-${id}`,
      cx: tx + jitter(id + "lcx", 3),
      cy: ty + jitter(id + "lcy", 3),
      rx: (depth === 2 ? 5 : 3.5) + Math.abs(jitter(id + "lrx", 1.5)),
      ry: (depth === 2 ? 9 : 6.5) + Math.abs(jitter(id + "lry", 2)),
      rot: angleDeg + jitter(id + "la", 35),
      sway: 3.5 + Math.abs(jitter(id + "sw", 2.5)),
      dur: 2.2 + Math.abs(jitter(id + "sd", 1.8)),
      day: depth === 2 ? 6 : 5,
    });
  }
  const spread = [30, 24, 18][depth] ?? 18;
  const childLen = length * ([0.66, 0.71, 0.76][depth] ?? 0.7);
  growPioneer(out, tx, ty, angleDeg - spread, childLen, depth + 1, id + "L");
  growPioneer(out, tx, ty, angleDeg + spread, childLen, depth + 1, id + "R");
}

export function buildPioneer(): SpeciesData {
  const out = { branches: [] as Branch[], leaves: [] as Leaf[] };
  growPioneer(out, BASE_X, BASE_Y, 0, 72, 0, "T");
  const trunk = out.branches.find((b) => b.id === "T")!;

  // Day 7: new shoot — two small leaf pairs unfurling from trunk tip
  const budAngles = [-28, 0, 28];
  budAngles.forEach((ang, i) => {
    const rad = (ang * Math.PI) / 180;
    const bLen = 10 + Math.abs(jitter(`PI-bud${i}len`, 3));
    out.leaves.push({
      id: `PI-bud${i}`,
      cx: trunk.tx + Math.sin(rad) * bLen,
      cy: trunk.ty - Math.cos(rad) * bLen,
      rx: 2.5,
      ry: 5.5,
      rot: ang + jitter(`PI-bud${i}rot`, 12),
      sway: 4,
      dur: 2.0 + i * 0.3,
      day: 7,
    });
  });

  return {
    branches: out.branches,
    leaves: out.leaves,
    blooms: [],
    leafColor: "#52B788",
  };
}
