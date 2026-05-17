import { Branch, BloomPoint, Leaf, SpeciesData } from "./types";
import { BASE_X, BASE_Y, jitter, qPath, Pt } from "./utils";

function addBranch(
  branches: Branch[],
  x: number, y: number,
  angleDeg: number, length: number,
  sw: number, depth: number, day: number, id: string,
): Pt {
  const rad = (angleDeg * Math.PI) / 180;
  const tx = x + Math.sin(rad) * length;
  const ty = y - Math.cos(rad) * length;
  branches.push({ id, d: qPath(x, y, tx, ty, id), sw, depth, day, tx, ty });
  return [tx, ty];
}

export function buildBuilder(): SpeciesData {
  const branches: Branch[] = [];
  const leaves: Leaf[] = [];
  const blooms: BloomPoint[] = [];

  const ttx = BASE_X + jitter("BL-ttx", 1.5);
  const tty = BASE_Y - 90;  // taller trunk (was 45)
  branches.push({ id: "BL-trunk", d: qPath(BASE_X, BASE_Y, ttx, tty, "BL-trunk"), sw: 5, depth: 0, day: 1, tx: ttx, ty: tty });

  const [lpx, lpy] = addBranch(branches, ttx, tty, -52, 44, 3.5, 1, 2, "BL-pL");
  const [rpx, rpy] = addBranch(branches, ttx, tty,  52, 44, 3.5, 1, 2, "BL-pR");

  const [sLLx, sLLy] = addBranch(branches, lpx, lpy, -82, 28, 2.5, 2, 3, "BL-sLL");
  const [sLRx, sLRy] = addBranch(branches, lpx, lpy, -22, 28, 2.5, 2, 3, "BL-sLR");
  const [sRLx, sRLy] = addBranch(branches, rpx, rpy,  22, 28, 2.5, 2, 3, "BL-sRL");
  const [sRRx, sRRy] = addBranch(branches, rpx, rpy,  82, 28, 2.5, 2, 3, "BL-sRR");

  const outerTips: Pt[] = [];
  const secondaries: [number, number, number, string][] = [
    [sLLx, sLLy, -82, "LL"],
    [sLRx, sLRy, -22, "LR"],
    [sRLx, sRLy,  22, "RL"],
    [sRRx, sRRy,  82, "RR"],
  ];
  secondaries.forEach(([sx, sy, baseAng, label]) => {
    outerTips.push(
      addBranch(branches, sx, sy, baseAng - 22, 18, 1.8, 3, 4, `BL-t${label}a`),
      addBranch(branches, sx, sy, baseAng + 22, 18, 1.8, 3, 4, `BL-t${label}b`),
    );
  });

  const half = Math.floor(outerTips.length / 2);
  outerTips.forEach((tip, i) => {
    const leafDay = i < half ? 5 : 6;
    for (let k = 0; k < 3; k++) {
      leaves.push({
        id: `BL-lf${i}-${k}`,
        cx: tip[0] + jitter(`BL-lf${i}${k}cx`, 5),
        cy: tip[1] + jitter(`BL-lf${i}${k}cy`, 5),
        rx: 5.5, ry: 8,
        rot: k * 35 + i * 18,
        sway: 2, dur: 3.2 + i * 0.08,
        day: leafDay,
      });
    }
  });

  const leftTips  = outerTips.slice(0, half);
  const rightTips = outerTips.slice(half);
  [...leftTips.slice(0, 3), ...rightTips.slice(0, 3)].forEach((tip, i) =>
    blooms.push({ id: `BL-blossom${i}`, cx: tip[0], cy: tip[1], day: 7, style: "blossom" as const }),
  );

  return { branches, leaves, blooms, leafColor: "#FFB74D" };
}
