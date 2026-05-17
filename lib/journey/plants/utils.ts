export const W = 160;
export const H = 200;
export const BASE_X = W / 2;
export const BASE_Y = H - 8;

export function jitter(seed: string, range: number): number {
  let h = 5381;
  for (let i = 0; i < seed.length; i++) {
    h = ((h << 5) + h + seed.charCodeAt(i)) & 0x7fffffff;
  }
  return ((h % 10000) / 10000 - 0.5) * range * 2;
}

export function qPath(x1: number, y1: number, x2: number, y2: number, id: string): string {
  const mx = (x1 + x2) / 2 + jitter(id + "cx", 5);
  const my = (y1 + y2) / 2 + jitter(id + "cy", 4);
  return `M${x1.toFixed(1)},${y1.toFixed(1)} Q${mx.toFixed(1)},${my.toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)}`;
}

export function linePath(x1: number, y1: number, x2: number, y2: number): string {
  return `M${x1.toFixed(1)},${y1.toFixed(1)} L${x2.toFixed(1)},${y2.toFixed(1)}`;
}

export type Pt = [number, number];

export function bezierPt(t: number, p0: Pt, p1: Pt, p2: Pt): Pt {
  const mt = 1 - t;
  return [
    mt * mt * p0[0] + 2 * mt * t * p1[0] + t * t * p2[0],
    mt * mt * p0[1] + 2 * mt * t * p1[1] + t * t * p2[1],
  ];
}

export function bezierTan(t: number, p0: Pt, p1: Pt, p2: Pt): Pt {
  const mt = 1 - t;
  return [
    2 * mt * (p1[0] - p0[0]) + 2 * t * (p2[0] - p1[0]),
    2 * mt * (p1[1] - p0[1]) + 2 * t * (p2[1] - p1[1]),
  ];
}

export function normalize(v: Pt): Pt {
  const len = Math.sqrt(v[0] ** 2 + v[1] ** 2) || 1;
  return [v[0] / len, v[1] / len];
}
