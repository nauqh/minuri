"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { Loader2, MapPin } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import type { NearMePlace } from "@/lib/near-me";
import type { NearbyInterestRecord } from "@/lib/near-me-api";
import { cn } from "@/lib/utils";

const NearMeMap = dynamic(
    () =>
        import("@/components/near-me/near-me-map").then((m) => m.NearMeMap),
    {
        ssr: false,
        loading: () => (
            <div className="flex h-full items-center justify-center bg-minuri-fog">
                <MapPin className="size-6 animate-pulse text-minuri-silver" />
            </div>
        ),
    },
);

type Props = {
    suburb: string;
};

type LoadState = "loading" | "success" | "empty" | "error";

export function JourneyNearbyPanel({ suburb }: Props) {
    const prefersReducedMotion = useReducedMotion();
    const [places, setPlaces] = useState<NearMePlace[]>([]);
    const [loadState, setLoadState] = useState<LoadState>("loading");
    const [selectedId, setSelectedId] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        setLoadState("loading");

        fetch(`/api/nearby-interest?suburb=${encodeURIComponent(suburb)}`)
            .then((r) => r.json() as Promise<NearbyInterestRecord[]>)
            .then((data) => {
                if (cancelled) return;
                const mapped: NearMePlace[] = (Array.isArray(data) ? data : [])
                    .filter(
                        (r) =>
                            r.gps_coordinates?.latitude != null &&
                            r.gps_coordinates?.longitude != null,
                    )
                    .slice(0, 12)
                    .map((r, i) => ({
                        id: r.place_id ?? String(i),
                        name: r.title,
                        address: r.address ?? "",
                        lat: r.gps_coordinates!.latitude!,
                        lng: r.gps_coordinates!.longitude!,
                        topic: "home-admin" as const,
                        subtype: "services",
                        rating: r.rating ?? undefined,
                    }));
                setPlaces(mapped);
                setLoadState(mapped.length > 0 ? "success" : "empty");
            })
            .catch(() => {
                if (!cancelled) setLoadState("error");
            });

        return () => {
            cancelled = true;
        };
    }, [suburb]);

    const handleSelectPlace = useCallback(
        (id: string) => setSelectedId((prev) => (prev === id ? null : id)),
        [],
    );

    return (
        <motion.section
            aria-label={`Services near ${suburb}`}
            className="overflow-hidden rounded-2xl border border-minuri-silver/70 bg-minuri-fog/40"
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-8% 0px -8% 0px" }}
            transition={{
                duration: prefersReducedMotion ? 0.01 : 0.42,
                ease: [0.22, 1, 0.36, 1],
            }}
        >
            <div className="border-b border-minuri-silver/60 px-5 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-minuri-mid">
                    Near you
                </p>
                <h2 className="mt-0.5 text-lg font-bold text-minuri-ocean">
                    Services near {suburb}
                </h2>
            </div>

            {loadState === "loading" && (
                <div className="flex items-center gap-2 px-5 py-6 text-sm text-minuri-slate">
                    <Loader2 className="size-4 animate-spin" />
                    Finding services near {suburb}...
                </div>
            )}

            {loadState === "error" && (
                <p className="px-5 py-6 text-sm text-minuri-slate">
                    Could not load services right now.
                </p>
            )}

            {loadState === "empty" && (
                <p className="px-5 py-6 text-sm text-minuri-slate">
                    No services found near {suburb} yet.
                </p>
            )}

            {loadState === "success" && (
                <>
                    <div className="h-60 md:h-72">
                        <NearMeMap
                            places={places}
                            selectedPlaceId={selectedId}
                            onSelectPlace={handleSelectPlace}
                            topic="home-admin"
                            hoveredPlaceId={null}
                            onHoverPlace={() => undefined}
                        />
                    </div>
                    <ul className="max-h-60 divide-y divide-minuri-silver/40 overflow-y-auto">
                        {places.map((place) => (
                            <li key={place.id}>
                                <button
                                    type="button"
                                    onClick={() => handleSelectPlace(place.id)}
                                    className={cn(
                                        "flex w-full items-start gap-3 px-5 py-3 text-left text-sm transition-colors hover:bg-minuri-fog",
                                        selectedId === place.id
                                            ? "bg-minuri-mist"
                                            : "",
                                    )}
                                >
                                    <MapPin className="mt-0.5 size-3.5 shrink-0 text-minuri-teal" />
                                    <span>
                                        <span className="block font-medium text-minuri-ocean">
                                            {place.name}
                                        </span>
                                        {place.address && (
                                            <span className="block text-xs text-minuri-slate">
                                                {place.address}
                                            </span>
                                        )}
                                    </span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </motion.section>
    );
}
