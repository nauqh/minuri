import { Branch, Leaf, BloomPoint, SpeciesData } from "./types";
import { BASE_X, BASE_Y, jitter, linePath } from "./utils";

// Canvas: 160×200, BASE_X=80, BASE_Y=192
// Reference: tall saguaro, left arm higher & longer than right, smooth C-curve elbows,
//            tapered trunk, angled spines along outer edges.

export function buildSettler(): SpeciesData {
  const branches: Branch[] = [];
  const leaves: Leaf[] = [];
  const blooms: BloomPoint[] = [];

  const lean = jitter("SE-lean", 1.5);
  const tx = BASE_X + lean;

  // ── trunk geometry ────────────────────────────────────────────────────────
  const trunkTopY = 24;          // near canvas top — very tall
  const stubEndY  = BASE_Y - 50; // Day 1 stub ends here (y=142)
  const midY      = Math.round((stubEndY + trunkTopY) / 2); // ≈83

  // ── arm geometry — left arm higher + longer, right lower + shorter ────────
  const armYL     = 108;         // left branch point
  const elbowXL   = tx - 40;    // left elbow x (horizontal extent)
  const armTipYL  = 40;         // left arm tip y (68px rise)

  const armYR     = 138;         // right branch point (lower than left)
  const elbowXR   = tx + 32;    // right elbow x (slightly shorter reach)
  const armTipYR  = 94;         // right arm tip y (44px rise)

  // ── TRUNK — three segments to simulate taper ─────────────────────────────

  // Day 1: thick seedling stub at base
  branches.push({
    id: "SE-lo",
    d: `M${tx},${BASE_Y} L${tx},${stubEndY}`,
    sw: 30, depth: 0, day: 1, tx, ty: stubEndY,
  });

  // Day 2: mid trunk (slightly narrower)
  branches.push({
    id: "SE-mid",
    d: `M${tx},${stubEndY} L${tx},${midY}`,
    sw: 24, depth: 0, day: 2, tx, ty: midY,
  });

  // Day 2: upper trunk (narrowest)
  branches.push({
    id: "SE-hi",
    d: `M${tx},${midY} L${tx},${trunkTopY}`,
    sw: 19, depth: 0, day: 2, tx, ty: trunkTopY,
  });

  // ── LEFT ARM — dominant arm, higher, longer ───────────────────────────────

  // Day 3: short horizontal stub (nub emerging from trunk side)
  branches.push({
    id: "SE-aL-stub",
    d: linePath(tx, armYL, tx - 20, armYL),
    sw: 20, depth: 1, day: 3, tx: tx - 20, ty: armYL,
  });

  // Day 4: full elbow — Q-bezier gives perfect quarter-turn (horizontal→vertical)
  branches.push({
    id: "SE-aL",
    d: `M${tx},${armYL} Q${elbowXL},${armYL} ${elbowXL},${armTipYL}`,
    sw: 20, depth: 1, day: 4, tx: elbowXL, ty: armTipYL,
  });

  // ── RIGHT ARM — shorter, lower ────────────────────────────────────────────

  // Day 5: stub
  branches.push({
    id: "SE-aR-stub",
    d: linePath(tx, armYR, tx + 16, armYR),
    sw: 17, depth: 1, day: 5, tx: tx + 16, ty: armYR,
  });

  // Day 6: full elbow
  branches.push({
    id: "SE-aR",
    d: `M${tx},${armYR} Q${elbowXR},${armYR} ${elbowXR},${armTipYR}`,
    sw: 17, depth: 1, day: 6, tx: elbowXR, ty: armTipYR,
  });

  // ── RIBS — thin vertical lines along trunk (Day 2) ────────────────────────
  // Simulate the grooved ribbing of a real saguaro

  const ribHalfH = (BASE_Y - trunkTopY) / 2 - 10;
  const ribCY    = (BASE_Y + trunkTopY) / 2;
  [-6, 6].forEach((offset, i) =>
    leaves.push({ id: `SE-rib${i}`, cx: tx + offset, cy: ribCY, rx: 0.7, ry: ribHalfH, rot: 0, sway: 0, dur: 1, day: 2 }),
  );

  // Rib on left arm outer face (Day 4)
  leaves.push({
    id: "SE-rib-aL", cx: elbowXL, cy: (armYL + armTipYL) / 2,
    rx: 0.7, ry: (armYL - armTipYL) / 2 - 4, rot: 0, sway: 0, dur: 1, day: 4,
  });

  // Rib on right arm outer face (Day 6)
  leaves.push({
    id: "SE-rib-aR", cx: elbowXR, cy: (armYR + armTipYR) / 2,
    rx: 0.7, ry: (armYR - armTipYR) / 2 - 3, rot: 0, sway: 0, dur: 1, day: 6,
  });

  // ── SPINES — angled dashes at outer trunk edges (Day 3) ──────────────────
  // Trunk left side: angled downward-outward (~75° from vertical)
  const trunkSpineYs = [BASE_Y-16, BASE_Y-32, BASE_Y-50, BASE_Y-68, BASE_Y-88, BASE_Y-108, BASE_Y-128, BASE_Y-148];
  trunkSpineYs.forEach((sy, i) => {
    // Left spine: points left-downward
    leaves.push({ id: `SE-spL${i}`, cx: tx - 18, cy: sy + 3, rx: 1, ry: 5, rot:  70, sway: 0, dur: 1, day: 3 });
    // Right spine: mirror
    leaves.push({ id: `SE-spR${i}`, cx: tx + 18, cy: sy + 3, rx: 1, ry: 5, rot: -70, sway: 0, dur: 1, day: 3 });
  });

  // Left arm outer spines (Day 4) — along left outer edge of arm
  [0.2, 0.45, 0.7, 0.9].forEach((t, i) => {
    const sy = armYL - (armYL - armTipYL) * t;
    leaves.push({ id: `SE-spLA${i}`, cx: elbowXL - 13, cy: sy + 2, rx: 1, ry: 4.5, rot: 75, sway: 0, dur: 1, day: 4 });
  });

  // Right arm outer spines (Day 6)
  [0.2, 0.45, 0.7, 0.9].forEach((t, i) => {
    const sy = armYR - (armYR - armTipYR) * t;
    leaves.push({ id: `SE-spRA${i}`, cx: elbowXR + 13, cy: sy + 2, rx: 1, ry: 4.5, rot: -75, sway: 0, dur: 1, day: 6 });
  });

  // ── Day 7 blooms: white crown buds at all three tips ─────────────────────
  blooms.push({ id: "SE-bl-top", cx: tx,       cy: trunkTopY, day: 7, style: "crown" });
  blooms.push({ id: "SE-bl-L",   cx: elbowXL,  cy: armTipYL,  day: 7, style: "crown" });
  blooms.push({ id: "SE-bl-R",   cx: elbowXR,  cy: armTipYR,  day: 7, style: "crown" });

  return { branches, leaves, blooms, leafColor: "#5D9E6A" };
}
