import { Branch, BloomPoint, Leaf, SpeciesData } from "./types";
import { BASE_X, BASE_Y, jitter, qPath } from "./utils";

export function buildWanderer(): SpeciesData {
  const branches: Branch[] = [];
  const leaves: Leaf[] = [];
  const blooms: BloomPoint[] = [];

  const stemAngles = [-8, -5, -2, 2, 5, 8];
  const stemDays   = [1, 1, 1, 2, 2, 2];

  stemAngles.forEach((ang, i) => {
    const rad = (ang * Math.PI) / 180;
    const stemLen = 80 + jitter(`WA-slen${i}`, 4);
    const tx = BASE_X + Math.sin(rad) * stemLen + jitter(`WA-tex${i}`, 2);
    const ty = BASE_Y - Math.cos(rad) * stemLen + jitter(`WA-tey${i}`, 2);
    const sId = `WA-stem${i}`;

    branches.push({ id: sId, d: qPath(BASE_X, BASE_Y, tx, ty, sId), sw: 1.8, depth: 0, day: stemDays[i]!, tx, ty });
    leaves.push({ id: `WA-node${i}`, cx: tx, cy: ty, rx: 2, ry: 2, rot: 0, sway: 0, dur: 1, day: stemDays[i]! });

    const perpRad = ((ang + 90) * Math.PI) / 180;
    [0.3, 0.55, 0.75].forEach((t, li) => {
      const ptx = BASE_X + (tx - BASE_X) * t;
      const pty = BASE_Y + (ty - BASE_Y) * t;
      [-1, 1].forEach((side, si) =>
        leaves.push({
          id: `WA-lf${i}-${li}-${si}`,
          cx: ptx + side * Math.cos(perpRad) * 9,
          cy: pty + side * Math.sin(perpRad) * 9,
          rx: 5, ry: 10,
          rot: ang + 90,
          sway: 2, dur: 2.5 + i * 0.12,
          day: li + 3,
        }),
      );
    });

    blooms.push({ id: `WA-pollen${i}`, cx: tx, cy: ty, day: 7, style: "cluster" as const });
  });

  return { branches, leaves, blooms, leafColor: "#AED581" };
}
