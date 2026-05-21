"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useReducedMotion } from "motion/react";
import { type JourneyIdentity, type IdentityCardState } from "@/lib/journey/identity";
import { Constellation } from "./constellation";
import { TraitRadar } from "./trait-radar";
import { PaletteSwatch } from "./palette-swatch";
import { IdentityCardBack } from "./identity-card-back";
import { PlantGrowth } from "./plant-growth";

type Props = {
  identity: JourneyIdentity;
  cardState: IdentityCardState;
  className?: string;
  plantDelay?: number;
  highlight?: number;
  onFlipChange?: (flipped: boolean) => void;
};

export function IdentityCard({ identity, cardState, className = "", plantDelay = 0, highlight = 0, onFlipChange }: Props) {
  const [flipped, setFlipped] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const backRef = useRef<HTMLDivElement>(null);
  const [backHeight, setBackHeight] = useState(0);

  useEffect(() => {
    const el = backRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setBackHeight(el.scrollHeight));
    ro.observe(el);
    setBackHeight(el.scrollHeight);
    return () => ro.disconnect();
  }, []);

  const { palette, traits, archetype, suburb_line, mantra, final_mantra } = identity;
  const {
    saturation,
    stampsEarned,
    constellationLit,
    fullyUnlocked,
    daysCompleted,
    memoryLines,
  } = cardState;

  const displayMantra = fullyUnlocked ? final_mantra : mantra;
  const primaryColor = palette[0].hex;

  function handleFlip() {
    if (daysCompleted.length === 0) return;
    const next = !flipped;
    setFlipped(next);
    onFlipChange?.(next);
  }

  return (
    <div
      className={`relative select-none ${className}`}
      style={{ perspective: 1000 }}
      onClick={handleFlip}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleFlip();
        }
      }}
      tabIndex={daysCompleted.length > 0 ? 0 : -1}
      role={daysCompleted.length > 0 ? "button" : undefined}
      aria-label={flipped ? "Identity card back — click to flip front" : "Identity card — click to flip"}
    >
      <motion.div
        style={{
          width: "100%",
          transformStyle: "preserve-3d",
          position: "relative",
          minHeight: flipped && backHeight ? backHeight : undefined,
          transition: "min-height 0.3s ease",
        }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={
          prefersReducedMotion
            ? { duration: 0 }
            : { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
        }
      >
        {/* ── FRONT ── */}
        <div
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          <CardFront
            archetype={archetype}
            suburb_line={suburb_line}
            mantra={displayMantra}
            palette={palette}
            traits={traits}
            saturation={saturation}
            stampsEarned={stampsEarned}
            constellationLit={constellationLit}
            primaryColor={primaryColor}
            plantDelay={plantDelay}
            highlight={highlight}
          />
        </div>

        {/* ── BACK ── */}
        <div
          ref={backRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div
            className="rounded-2xl border"
            style={{
              background: `linear-gradient(135deg, ${palette[0].hex}18, ${palette[1].hex}12)`,
              borderColor: `${primaryColor}30`,
              color: "#1A2A3A",
            }}
          >
            <IdentityCardBack
              memoryLines={memoryLines}
              daysCompleted={daysCompleted}
              traits={traits}
              primaryColor={primaryColor}
            />
          </div>
        </div>
      </motion.div>

      {daysCompleted.length > 0 && (
        <p className="mt-2 text-center text-[10px] opacity-30">
          {flipped ? "tap to see front" : "tap to see your week"}
        </p>
      )}
    </div>
  );
}

type FrontProps = {
  archetype: string;
  suburb_line: string;
  mantra: string;
  palette: JourneyIdentity["palette"];
  traits: JourneyIdentity["traits"];
  saturation: number;
  stampsEarned: string[];
  constellationLit: number;
  primaryColor: string;
  plantDelay?: number;
  highlight?: number;
};

function CardFront({
  archetype,
  suburb_line,
  mantra,
  palette,
  traits,
  saturation,
  stampsEarned,
  constellationLit,
  primaryColor,
  plantDelay = 0,
  highlight = 0,
}: FrontProps) {
  return (
    <div
      className="rounded-2xl border flex flex-col overflow-hidden"
      style={{
        background: `linear-gradient(160deg, ${palette[0].hex}18, ${palette[1].hex}10, ${palette[2].hex}08)`,
        borderColor: `${primaryColor}30`,
        color: "#1A2A3A",
      }}
    >
      {/* ── Archetype ── */}
      <div className="px-5 pt-5 pb-3">
        <p
          className="text-xl font-black uppercase tracking-wide leading-tight"
          style={{ color: primaryColor }}
        >
          {archetype}
        </p>
      </div>

      {/* ── Plant ── */}
      <div className="flex justify-center py-1">
        {constellationLit === 0 ? (
          <svg
            width="160"
            height="200"
            viewBox="0 0 160 200"
            aria-label="A seed, not yet grown"
          >
            <ellipse cx="80" cy="192" rx="28" ry="7" fill={primaryColor} opacity="0.12" />
            <ellipse cx="80" cy="168" rx="15" ry="22" fill={primaryColor} opacity="0.9" transform="rotate(-10 80 168)" />
            <path d="M 78 148 Q 82 168 78 188" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.22" transform="rotate(-10 80 168)" />
            <ellipse cx="73" cy="157" rx="4" ry="7" fill="white" opacity="0.2" transform="rotate(-10 73 157)" />
          </svg>
        ) : (
          <PlantGrowth
            daysCompleted={constellationLit}
            archetype={archetype}
            color={primaryColor}
            saturation={saturation}
            delay={plantDelay}
            highlight={highlight}
          />
        )}
      </div>

      {/* ── Mantra ── */}
      <p
        className="mx-5 mb-4 mt-2 text-lg italic leading-relaxed text-minuri-ocean text-center"
        style={{ fontFamily: "var(--font-handwriting, serif)" }}
      >
        &ldquo;{mantra}&rdquo;
      </p>

    </div>
  );
}
