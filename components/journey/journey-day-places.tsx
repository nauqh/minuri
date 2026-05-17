"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import type { NearbyInterestRecord } from "@/lib/near-me-api";
import type { NearMePlace } from "@/lib/near-me";
import type { GuideTopicSlug } from "@/content/guides";
import { TOPIC_NEAR_ME } from "@/lib/journey-week";
import { PlaceCard } from "@/components/near-me/place-card";

const NearMeMap = dynamic(
    () => import("@/components/near-me/near-me-map").then((m) => m.NearMeMap),
    {
        ssr: false,
        loading: () => (
            <div className="flex h-full items-center justify-center bg-minuri-fog">
                <div className="size-6 animate-spin rounded-full border-2 border-minuri-silver border-t-minuri-teal" />
            </div>
        ),
    },
);

const TOPIC_PLACE_LABEL: Record<GuideTopicSlug, string> = {
    "food-eating": "cheap supermarkets & community meals",
    "getting-around": "transport & Myki top-up points",
    "health-wellbeing": "bulk-billing GPs & pharmacies",
    "home-admin": "tenancy advice & legal aid",
    "social-belonging": "community centres & volunteering",
};

const placesCache = new Map<string, NearbyInterestRecord[]>();

function toNearMePlace(r: NearbyInterestRecord, index: number, topic: GuideTopicSlug): NearMePlace | null {
    const lat = r.gps_coordinates?.latitude;
    const lng = r.gps_coordinates?.longitude;
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
    return {
        id: r.place_id ?? `${topic}-${index}`,
        name: r.title,
        address: r.address ?? "",
        lat: lat as number,
        lng: lng as number,
        topic,
        subtype: r.type ?? "",
        phone: r.phone ?? undefined,
        rating: r.rating ?? undefined,
        reviewCount: r.reviews ?? undefined,
        thumbnail: r.thumbnail ?? undefined,
        photos: r.photos ?? undefined,
        website: r.website ?? undefined,
        price: r.price ?? undefined,
        openNow: r.open_state ? /open/i.test(r.open_state) && !/closed/i.test(r.open_state) : undefined,
        hours: r.open_state ?? undefined,
    };
}

type Props = {
    suburb: string;
    topicSlug: GuideTopicSlug;
};

export function JourneyDayPlaces({ suburb, topicSlug }: Props) {
    const cacheKey = `${suburb}:${topicSlug}`;
    const [records, setRecords] = useState<NearbyInterestRecord[]>(
        () => placesCache.get(cacheKey) ?? [],
    );
    const [ready, setReady] = useState(() => placesCache.has(cacheKey));
    const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
    const [hoveredPlaceId, setHoveredPlaceId] = useState<string | null>(null);

    useEffect(() => {
        if (placesCache.has(cacheKey)) {
            setRecords(placesCache.get(cacheKey)!);
            setReady(true);
            return;
        }

        let cancelled = false;
        setReady(false);
        setRecords([]);

        const topic = TOPIC_NEAR_ME[topicSlug];
        fetch(`/api/nearby-interest?suburb=${encodeURIComponent(suburb)}&topic=${encodeURIComponent(topic)}`)
            .then((r) => r.json() as Promise<NearbyInterestRecord[]>)
            .then((data) => {
                if (cancelled) return;
                const results = Array.isArray(data) ? data.slice(0, 5) : [];
                placesCache.set(cacheKey, results);
                setRecords(results);
                setReady(true);
            })
            .catch(() => {
                if (!cancelled) setReady(true);
            });

        return () => { cancelled = true; };
    }, [cacheKey, suburb, topicSlug]);

    const places: NearMePlace[] = records
        .map((r, i) => toNearMePlace(r, i, topicSlug))
        .filter((p): p is NearMePlace => p !== null);

    if (!ready || places.length === 0) return null;

    return (
        <div className="mt-6">
            <p className="mb-1 text-base font-bold text-minuri-ocean">
                Places to go today in {suburb}
            </p>
            <p className="mb-3 text-sm text-minuri-slate">{TOPIC_PLACE_LABEL[topicSlug]}</p>

            <div className="flex flex-col overflow-hidden rounded-xl border border-minuri-silver/60 sm:flex-row sm:h-[480px]">
                <div className="h-[260px] min-w-0 sm:h-auto sm:flex-[3]">
                    <NearMeMap
                        places={places}
                        selectedPlaceId={selectedPlaceId}
                        onSelectPlace={setSelectedPlaceId}
                        topic={topicSlug}
                        hoveredPlaceId={hoveredPlaceId}
                        onHoverPlace={setHoveredPlaceId}
                    />
                </div>

                <div className="max-h-[280px] divide-y divide-minuri-silver/30 overflow-y-auto border-t border-minuri-silver/60 bg-minuri-white sm:max-h-none sm:flex-[2] sm:shrink-0 sm:border-l sm:border-t-0">
                    {places.map((place, i) => (
                        <PlaceCard
                            key={place.id}
                            place={place}
                            index={i}
                            layout="compact"
                            selected={selectedPlaceId === place.id}
                            hovered={hoveredPlaceId === place.id}
                            saved={false}
                            topic={topicSlug}
                            onSelect={() => setSelectedPlaceId(place.id)}
                            onHoverEnter={() => setHoveredPlaceId(place.id)}
                            onHoverLeave={() => setHoveredPlaceId(null)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
