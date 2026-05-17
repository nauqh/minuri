"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { type JourneyIdentity, type IdentityCardState, TITLE_LABELS } from "@/lib/journey/identity";
import { Constellation } from "./constellation";
import { TraitRadar } from "./trait-radar";
import { PaletteSwatch } from "./palette-swatch";
import { IdentityCardBack } from "./identity-card-back";
import { PlantGrowth } from "./plant-growth";

type Props = {
  identity: JourneyIdentity;
  cardState: IdentityCardState;
  className?: string;
};

export function IdentityCard({ identity, cardState, className = "" }: Props) {
  const [flipped, setFlipped] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const { palette, traits, archetype, suburb_line, mantra, final_mantra } = identity;
  const {
    saturation,
    titleTier,
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
    setFlipped((v) => !v);
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
            titleTier={titleTier}
            stampsEarned={stampsEarned}
            constellationLit={constellationLit}
            primaryColor={primaryColor}
          />
        </div>

        {/* ── BACK ── */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div
            className="h-full rounded-2xl border"
            style={{
              background: `linear-gradient(135deg, ${palette[0].hex}18, ${palette[1].hex}12)`,
              borderColor: `${primaryColor}30`,
              color: "#1A2A3A",
              minHeight: 400,
            }}
          >
            <IdentityCardBack
              memoryLines={memoryLines}
              daysCompleted={daysCompleted}
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
  titleTier: IdentityCardState["titleTier"];
  stampsEarned: string[];
  constellationLit: number;
  primaryColor: string;
};

function CardFront({
  archetype,
  suburb_line,
  mantra,
  palette,
  traits,
  saturation,
  titleTier,
  stampsEarned,
  constellationLit,
  primaryColor,
}: FrontProps) {
  return (
    <div
      className="rounded-2xl border px-5 pb-5 pt-0 flex flex-col gap-3"
      style={{
        background: `linear-gradient(160deg, ${palette[0].hex}22, ${palette[1].hex}14, ${palette[2].hex}10)`,
        borderColor: `${primaryColor}35`,
        color: "#1A2A3A",
        minHeight: 400,
      }}
    >
      {/* Growing plant — replaces static emoji symbol */}
      <div className="flex justify-center py-1">
        <PlantGrowth
          daysCompleted={constellationLit}
          archetype={archetype}
          color={primaryColor}
          saturation={saturation}
        />
      </div>

      {/* Archetype + suburb */}
      <div>
        <p
          className="text-base font-black uppercase tracking-tight leading-tight"
          style={{ color: primaryColor }}
        >
          {archetype}
        </p>
        <p className="mt-0.5 text-[11px] opacity-55 leading-snug">{suburb_line}</p>
      </div>

      {/* Mantra */}
      <p
        className="text-sm italic leading-snug opacity-70"
        style={{ fontFamily: "var(--font-handwriting, serif)" }}
      >
        &ldquo;{mantra}&rdquo;
      </p>

      {/* Radar */}
      <div className="flex justify-center">
        <TraitRadar
          traits={traits}
          size={210}
          color={primaryColor}
          animate={false}
        />
      </div>

    </div>
  );
}
