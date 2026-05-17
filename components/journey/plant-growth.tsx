"use client";

import { motion, useReducedMotion } from "motion/react";
import { BloomPoint, BloomStyle, SpeciesKey } from "@/lib/journey/plants/types";
import { W, H, BASE_X, BASE_Y } from "@/lib/journey/plants/utils";
import { buildPioneer } from "@/lib/journey/plants/pioneer";
import { buildSettler } from "@/lib/journey/plants/settler";
import { buildBuilder } from "@/lib/journey/plants/builder";
import { buildOpenHeart } from "@/lib/journey/plants/openheart";

// ── species registry ──────────────────────────────────────────────────────────

const ALL_SPECIES = {
  pioneer:   buildPioneer(),
  settler:   buildSettler(),
  builder:   buildBuilder(),
  openheart: buildOpenHeart(),
} satisfies Record<SpeciesKey, ReturnType<typeof buildPioneer>>;

const ARCHETYPE_TO_SPECIES: Record<string, SpeciesKey> = {
  "The Quiet Pioneer":   "pioneer",
  "The Urban Explorer":  "pioneer",
  "The Careful Settler": "settler",
  "The Steady Builder":  "builder",
  "The Open Heart":      "openheart",
  "The Hungry Wanderer": "builder",
};

// ── bloom renderers ───────────────────────────────────────────────────────────

type BloomProps = { cx: number; cy: number; color: string; reduced: boolean };

function FlowerBloom({ cx, cy, color, reduced }: BloomProps) {
  const petalR = 9;
  return (
    <g>
      {Array.from({ length: 5 }, (_, i) => {
        const ang = (i / 5) * 360 - 90;
        const rad = (ang * Math.PI) / 180;
        return (
          <motion.ellipse
            key={i}
            cx={cx + petalR * Math.cos(rad)}
            cy={cy + petalR * Math.sin(rad)}
            rx={3.5} ry={5.5}
            fill={color}
            style={{ transformBox: "fill-box", transformOrigin: "center", rotate: ang + 90 }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.9 }}
            transition={{ duration: reduced ? 0 : 0.45, delay: reduced ? 0 : 0.1 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
          />
        );
      })}
      <motion.circle cx={cx} cy={cy} r={4.5} fill="#FFF8E1"
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ duration: reduced ? 0 : 0.35, delay: reduced ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.circle cx={cx} cy={cy} r={2.5} fill="#F9A825"
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ duration: reduced ? 0 : 0.3, delay: reduced ? 0 : 0.55 }}
      />
    </g>
  );
}

function BlossomBloom({ cx, cy, color, reduced }: BloomProps) {
  return (
    <g>
      {[0, 90, 180, 270].map((ang, i) => {
        const rad = (ang * Math.PI) / 180;
        return (
          <motion.ellipse
            key={i}
            cx={cx + Math.cos(rad) * 7}
            cy={cy + Math.sin(rad) * 7}
            rx={4.5} ry={3}
            fill={color}
            style={{ transformBox: "fill-box", transformOrigin: "center", rotate: ang }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.85 }}
            transition={{ duration: reduced ? 0 : 0.4, delay: reduced ? 0 : i * 0.07, ease: [0.22, 1, 0.36, 1] }}
          />
        );
      })}
      <motion.circle cx={cx} cy={cy} r={3} fill="#FFF8E1"
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ duration: reduced ? 0 : 0.3, delay: reduced ? 0 : 0.3 }}
      />
    </g>
  );
}

function SpiralBloom({ cx, cy, color, reduced }: BloomProps) {
  const steps = 24;
  const d = Array.from({ length: steps + 1 }, (_, k) => {
    const t = k / steps;
    const r = 8 * (1 - t * 0.75);
    const ang = t * Math.PI * 2.5;
    return `${k === 0 ? "M" : "L"}${(cx + Math.cos(ang) * r).toFixed(1)},${(cy + Math.sin(ang) * r).toFixed(1)}`;
  }).join(" ");
  return (
    <motion.path
      d={d}
      stroke={color}
      strokeWidth={2}
      fill="none"
      strokeLinecap="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: reduced ? 0 : 0.9, ease: [0.22, 1, 0.36, 1] }}
    />
  );
}

function ClusterBloom({ cx, cy, color, reduced }: BloomProps) {
  return (
    <g>
      {[0, 1, 2].map((i) => {
        const ang = (i / 3) * Math.PI * 2 - Math.PI / 2;
        return (
          <motion.circle
            key={i}
            cx={cx + Math.cos(ang) * 5}
            cy={cy + Math.sin(ang) * 5}
            r={2.5}
            fill={color}
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.9 }}
            transition={{ duration: reduced ? 0 : 0.35, delay: reduced ? 0 : i * 0.1, ease: [0.22, 1, 0.36, 1] }}
          />
        );
      })}
    </g>
  );
}

function CrownBloom({ cx, cy, color, reduced }: BloomProps) {
  return (
    <g>
      {[0, 1, 2, 3, 4].map((i) => {
        const ang = (i / 5) * Math.PI * 2 - Math.PI / 2;
        return (
          <motion.circle
            key={i}
            cx={cx + Math.cos(ang) * 6}
            cy={cy + Math.sin(ang) * 6}
            r={3}
            fill={color}
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.85 }}
            transition={{ duration: reduced ? 0 : 0.4, delay: reduced ? 0 : i * 0.1, ease: [0.22, 1, 0.36, 1] }}
          />
        );
      })}
    </g>
  );
}

function BloomRenderer({ bloom, color, reduced }: { bloom: BloomPoint; color: string; reduced: boolean }) {
  const props: BloomProps = { cx: bloom.cx, cy: bloom.cy, color, reduced };
  switch (bloom.style) {
    case "flower":  return <FlowerBloom {...props} />;
    case "blossom": return <BlossomBloom {...props} />;
    case "spiral":  return <SpiralBloom {...props} />;
    case "cluster": return <ClusterBloom {...props} />;
    case "crown":   return <CrownBloom {...props} />;
  }
}

// ── main component ────────────────────────────────────────────────────────────

type Props = {
  daysCompleted: number;
  archetype?: string;
  color: string;
  saturation?: number;
  className?: string;
};

export function PlantGrowth({
  daysCompleted,
  archetype = "",
  color,
  saturation = 100,
  className = "",
}: Props) {
  const reduced = useReducedMotion() ?? false;
  const key = ARCHETYPE_TO_SPECIES[archetype] ?? "pioneer";
  const { branches, leaves, blooms, leafColor } = ALL_SPECIES[key];
  const glowing = daysCompleted >= 5;

  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      aria-label={`Growing plant — day ${daysCompleted} of 7`}
      role="img"
      className={className}
      style={{
        overflow: "visible",
        filter: [
          `saturate(${saturation}%)`,
          glowing ? `drop-shadow(0 0 7px ${color}66)` : "",
        ]
          .filter(Boolean)
          .join(" "),
      }}
    >
      {/* Ground seed */}
      <motion.circle
        cx={BASE_X}
        cy={BASE_Y}
        r={5}
        fill={color}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: reduced ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Branches — deepest first so trunk renders on top */}
      {[...branches].sort((a, b) => b.depth - a.depth).map((b) => {
        const visible = daysCompleted >= b.day;
        return (
          <motion.path
            key={b.id}
            d={b.d}
            stroke={color}
            strokeWidth={b.sw}
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={visible ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
            transition={{
              pathLength: { duration: reduced ? 0 : 0.65 + b.depth * 0.08, ease: [0.22, 1, 0.36, 1] },
              opacity: { duration: reduced ? 0 : 0.15 },
            }}
          />
        );
      })}

      {/* Leaves */}
      {leaves.map((lf) => {
        const visible = daysCompleted >= lf.day;
        return (
          <motion.g
            key={lf.id}
            animate={visible && !reduced ? { rotate: [-lf.sway, lf.sway] } : { rotate: 0 }}
            transition={
              visible && !reduced
                ? { rotate: { duration: lf.dur || 2.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" } }
                : {}
            }
            style={{ transformOrigin: `${lf.cx}px ${lf.cy}px` }}
          >
            <motion.ellipse
              cx={lf.cx}
              cy={lf.cy}
              rx={lf.rx}
              ry={lf.ry}
              fill={leafColor}
              style={{ transformBox: "fill-box", transformOrigin: "center", rotate: lf.rot }}
              initial={{ scale: 0, opacity: 0 }}
              animate={visible ? { scale: 1, opacity: 0.85 } : { scale: 0, opacity: 0 }}
              transition={{
                scale: { duration: reduced ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] },
                opacity: { duration: reduced ? 0 : 0.25 },
              }}
            />
          </motion.g>
        );
      })}

      {/* Blooms */}
      {blooms
        .filter((bl) => daysCompleted >= bl.day)
        .map((bl) => (
          <BloomRenderer key={bl.id} bloom={bl} color={color} reduced={reduced} />
        ))}
    </svg>
  );
}
