"use client";

import { useState } from "react";
import { PlantGrowth } from "@/components/journey/plant-growth";

const SPECIES = [
  { archetype: "The Quiet Pioneer",   color: "#52B788", label: "Pioneer"   },
  { archetype: "The Careful Settler", color: "#81C784", label: "Settler"   },
  { archetype: "The Steady Builder",  color: "#FFB74D", label: "Builder"   },
  { archetype: "The Open Heart",      color: "#6DBF80", label: "Open Heart (Bamboo)" },
];

export default function PlantPreviewPage() {
  const [day, setDay] = useState(7);

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Plant Species Preview</h1>

        {/* Day slider */}
        <div className="flex items-center gap-4 mb-10">
          <span className="text-sm text-neutral-400 w-12">Day {day}</span>
          <input
            type="range"
            min={0}
            max={7}
            step={1}
            value={day}
            onChange={(e) => setDay(Number(e.target.value))}
            className="w-56 accent-white"
          />
          <div className="flex gap-2">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((d) => (
              <button
                key={d}
                onClick={() => setDay(d)}
                className={`w-7 h-7 rounded text-xs font-bold transition-colors ${
                  day === d ? "bg-white text-black" : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-8">
          {SPECIES.map((s) => (
            <div
              key={s.archetype}
              className="flex flex-col items-center gap-3 rounded-xl p-6"
              style={{ background: `${s.color}12`, border: `1px solid ${s.color}30` }}
            >
              <PlantGrowth
                daysCompleted={day}
                archetype={s.archetype}
                color={s.color}
                saturation={100}
              />
              <div className="text-center">
                <p className="font-bold text-sm" style={{ color: s.color }}>
                  {s.label}
                </p>
                <p className="text-xs text-neutral-500 mt-0.5">{s.archetype}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
