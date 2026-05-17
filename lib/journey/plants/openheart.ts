import { Branch, BloomPoint, Leaf, SpeciesData } from "./types";
import { BASE_X, BASE_Y, jitter, linePath } from "./utils";

// Bamboo — 3 culms of varying height, segmented nodes, lanceolate leaves

export function buildOpenHeart(): SpeciesData {
  const branches: Branch[] = [];
  const leaves: Leaf[] = [];
  const blooms: BloomPoint[] = [];

  // Three culms: center (tallest), left (medium), right (shortest)
  const culms = [
    { id: "C",  x: BASE_X + jitter("BM-cx", 2),       tipY: 38,  sw: 6,   day: 1 }, // center
    { id: "L",  x: BASE_X - 15 + jitter("BM-lx", 2),  tipY: 60,  sw: 5,   day: 2 }, // left
    { id: "R",  x: BASE_X + 16 + jitter("BM-rx", 2),  tipY: 72,  sw: 4.5, day: 3 }, // right
  ];

  culms.forEach((culm) => {
    const totalH = BASE_Y - culm.tipY;
    const segH   = 24; // node interval (px)
    const segs   = Math.floor(totalH / segH);

    // ── culm body — two segments for growth reveal ──────────────────────────

    // Lower half (appears on culm's own day)
    const midY = BASE_Y - Math.round(totalH * 0.5);
    branches.push({
      id: `BM-${culm.id}-lo`,
      d: linePath(culm.x, BASE_Y, culm.x, midY),
      sw: culm.sw, depth: 0, day: culm.day,
      tx: culm.x, ty: midY,
    });

    // Upper half (one day later)
    branches.push({
      id: `BM-${culm.id}-hi`,
      d: linePath(culm.x, midY, culm.x, culm.tipY),
      sw: culm.sw * 0.85, depth: 0, day: culm.day + 1,
      tx: culm.x, ty: culm.tipY,
    });

    // ── nodes — horizontal bands at each segment interval ───────────────────
    for (let s = 1; s <= segs; s++) {
      const ny    = BASE_Y - s * segH;
      const nDay  = ny < midY ? culm.day + 1 : culm.day;
      const nHalf = culm.sw * 0.9; // node slightly wider than culm stroke

      // Node rendered as flat wide ellipse
      leaves.push({
        id: `BM-${culm.id}-node${s}`,
        cx: culm.x,
        cy: ny,
        rx: nHalf + 1.5,
        ry: 1.2,
        rot: 0,
        sway: 0, dur: 1,
        day: nDay,
      });
    }

    // ── leaves — lanceolate, from upper third nodes ──────────────────────────
    // Only nodes in the top 40% of culm get leaves
    const leafStartY = BASE_Y - totalH * 0.55;

    for (let s = 1; s <= segs; s++) {
      const ny = BASE_Y - s * segH;
      if (ny > leafStartY) continue; // below leaf zone

      const leafDay = culm.day + 2 + (ny > culm.tipY + totalH * 0.2 ? 1 : 0);

      // 2 leaves per node, alternating sides, different angles
      const angles = s % 2 === 0
        ? [-42, 15]   // even nodes: left-leaning pair
        : [42, -15];  // odd nodes: right-leaning pair

      angles.forEach((ang, ai) => {
        const rad = (ang * Math.PI) / 180;
        const lLen = 20 + jitter(`BM-${culm.id}-lf${s}-${ai}`, 4);
        leaves.push({
          id: `BM-${culm.id}-lf${s}-${ai}`,
          cx: culm.x + Math.sin(rad) * lLen * 0.6,
          cy: ny    - Math.cos(rad) * lLen * 0.4,
          rx: 2,
          ry: lLen * 0.48,
          rot: ang,
          sway: 3 + Math.abs(jitter(`BM-sw-${culm.id}${s}${ai}`, 2)),
          dur:  2.8 + Math.abs(jitter(`BM-dur-${culm.id}${s}${ai}`, 1.2)),
          day: Math.min(leafDay, 6),
        });
      });
    }
  });

  // Day 7 bloom: small cluster at tallest culm tip
  blooms.push({ id: "BM-bloom", cx: culms[0]!.x, cy: culms[0]!.tipY, day: 7, style: "cluster" });

  return { branches, leaves, blooms, leafColor: "#6DBF80" };
}
