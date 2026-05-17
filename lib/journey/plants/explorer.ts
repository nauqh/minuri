import { Branch, BloomPoint, Leaf, SpeciesData } from "./types";
import { BASE_X, BASE_Y, jitter, qPath, bezierPt, bezierTan, normalize, Pt } from "./utils";

export function buildExplorer(): SpeciesData {
  const branches: Branch[] = [];
  const leaves: Leaf[] = [];
  const blooms: BloomPoint[] = [];

  const fp0: Pt = [22, 155];
  const fp1: Pt = [80, 70];
  const fp2: Pt = [138, 102];

  branches.push({ id: "EX-base", d: qPath(BASE_X, BASE_Y, fp0[0], fp0[1], "EX-base"), sw: 2.5, depth: 0, day: 1, tx: fp0[0], ty: fp0[1] });
  branches.push({ id: "EX-frond", d: `M${fp0[0]},${fp0[1]} Q${fp1[0]},${fp1[1]} ${fp2[0]},${fp2[1]}`, sw: 2.0, depth: 0, day: 1, tx: fp2[0], ty: fp2[1] });

  const sf0: Pt = [BASE_X + 4, BASE_Y - 20];
  const sf1: Pt = [50, 88];
  const sf2: Pt = [26, 116];
  branches.push({ id: "EX-frond2", d: `M${sf0[0]},${sf0[1]} Q${sf1[0]},${sf1[1]} ${sf2[0]},${sf2[1]}`, sw: 1.5, depth: 1, day: 3, tx: sf2[0], ty: sf2[1] });

  const pinnaTs = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.72, 0.85];
  const pinnaDays = [2, 2, 3, 3, 4, 4, 5, 5];

  pinnaTs.forEach((t, i) => {
    const [px, py] = bezierPt(t, fp0, fp1, fp2);
    const [ux, uy] = normalize(bezierTan(t, fp0, fp1, fp2));
    const nx = -uy;
    const ny = ux;
    const side = i % 2 === 0 ? 1 : -1;
    const len = 18 - i * 0.6;
    const ex = px + nx * len * side;
    const ey = py + ny * len * side;
    const pDay = pinnaDays[i]!;
    const pId = `EX-pinna-${i}`;
    const pinnaAng = Math.atan2(ey - py, ex - px) * (180 / Math.PI);

    branches.push({ id: pId, d: qPath(px, py, ex, ey, pId), sw: 1.2, depth: 1, day: pDay, tx: ex, ty: ey });
    leaves.push({ id: `EX-lf-${i}`, cx: ex, cy: ey, rx: 3, ry: 8, rot: pinnaAng + 90, sway: 2, dur: 2.5 + i * 0.2, day: pDay });
    leaves.push({ id: `EX-sub-${i}`, cx: ex + jitter(`EX-sub${i}x`, 3), cy: ey + jitter(`EX-sub${i}y`, 3), rx: 1.5, ry: 3, rot: pinnaAng + 60, sway: 1, dur: 3.2, day: 5 });
  });

  blooms.push({ id: "EX-fiddle", cx: fp2[0], cy: fp2[1], day: 7, style: "spiral" as const });
  return { branches, leaves, blooms, leafColor: "#4FC3F7" };
}
