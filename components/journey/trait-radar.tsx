"use client";

import { useEffect, useState } from "react";

type Traits = {
  courage: number;
  curiosity: number;
  social: number;
  independence: number;
};

type Props = {
  traits: Traits;
  size?: number;
  color?: string;
  animate?: boolean;
};

const AXES: Array<{ key: keyof Traits; label: string; angle: number }> = [
  { key: "independence", label: "Independence", angle: -90 },
  { key: "curiosity",    label: "Curiosity",    angle: 0 },
  { key: "social",       label: "Social",       angle: 90 },
  { key: "courage",      label: "Courage",      angle: 180 },
];

function toXY(angle: number, value: number, cx: number, maxR: number) {
  const rad = (angle * Math.PI) / 180;
  return {
    x: cx + (value / 100) * maxR * Math.cos(rad),
    y: cx + (value / 100) * maxR * Math.sin(rad),
  };
}

function axisEnd(angle: number, cx: number, maxR: number) {
  return toXY(angle, 100, cx, maxR);
}

function labelPos(angle: number, cx: number, maxR: number) {
  const pad = 18;
  const rad = (angle * Math.PI) / 180;
  return {
    x: cx + (maxR + pad) * Math.cos(rad),
    y: cx + (maxR + pad) * Math.sin(rad),
  };
}

export function TraitRadar({ traits, size = 220, color = "#4A90D9", animate = true }: Props) {
  const cx = size / 2;
  const maxR = size * 0.42;

  const [progress, setProgress] = useState(animate ? 0 : 1);

  useEffect(() => {
    if (!animate) { setProgress(1); return; }
    const duration = 900;
    const start = Date.now();
    let raf: number;

    const frame = () => {
      const elapsed = Date.now() - start;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(eased);
      if (t < 1) raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [animate]);

  const scaledTraits: Traits = {
    courage:      traits.courage * progress,
    curiosity:    traits.curiosity * progress,
    social:       traits.social * progress,
    independence: traits.independence * progress,
  };

  const points = AXES.map(({ key, angle }) => {
    const { x, y } = toXY(angle, scaledTraits[key], cx, maxR);
    return `${x},${y}`;
  }).join(" ");

  const gridLevels = [25, 50, 75, 100];

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-hidden
      style={{ overflow: "visible" }}
    >
      {/* Grid rings */}
      {gridLevels.map((level) => {
        const pts = AXES.map(({ angle }) => {
          const { x, y } = toXY(angle, level, cx, maxR);
          return `${x},${y}`;
        }).join(" ");
        return (
          <polygon
            key={level}
            points={pts}
            fill="none"
            stroke="currentColor"
            strokeWidth={0.5}
            strokeOpacity={0.12}
          />
        );
      })}

      {/* Axis lines */}
      {AXES.map(({ angle, key, label }) => {
        const end = axisEnd(angle, cx, maxR);
        const lp = labelPos(angle, cx, maxR);
        return (
          <g key={key}>
            <line
              x1={cx}
              y1={cx}
              x2={end.x}
              y2={end.y}
              stroke="currentColor"
              strokeWidth={0.75}
              strokeOpacity={0.2}
            />
            <text
              x={lp.x}
              y={lp.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={9}
              fill="currentColor"
              opacity={0.5}
            >
              {label}
            </text>
          </g>
        );
      })}

      {/* Filled polygon */}
      <polygon
        points={points}
        fill={color}
        fillOpacity={0.18}
        stroke={color}
        strokeWidth={1.5}
        strokeLinejoin="round"
      />

      {/* Value dots */}
      {AXES.map(({ key, angle }) => {
        const { x, y } = toXY(angle, scaledTraits[key], cx, maxR);
        return (
          <circle
            key={key}
            cx={x}
            cy={y}
            r={3}
            fill={color}
            aria-label={`${key}: ${Math.round(traits[key])} out of 100`}
          />
        );
      })}
    </svg>
  );
}
