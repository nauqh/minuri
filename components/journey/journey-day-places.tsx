"use client";

import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";

import type { NearbyInterestRecord } from "@/lib/near-me-api";
import type { GuideTopicSlug } from "@/content/guides";
import { TOPIC_NEAR_ME } from "@/lib/journey-week";

const TOPIC_PLACE_LABEL: Record<GuideTopicSlug, string> = {
    "food-eating": "cheap supermarkets & community meals",
    "getting-around": "transport & Myki top-up points",
    "health-wellbeing": "bulk-billing GPs & pharmacies",
    "home-admin": "tenancy advice & legal aid",
    "social-belonging": "community centres & volunteering",
};

const placesCache = new Map<string, NearbyInterestRecord[]>();

type Props = {
    suburb: string;
    topicSlug: GuideTopicSlug;
};

export function JourneyDayPlaces({ suburb, topicSlug }: Props) {
    const cacheKey = `${suburb}:${topicSlug}`;
    const [places, setPlaces] = useState<NearbyInterestRecord[]>(
        () => placesCache.get(cacheKey) ?? [],
    );
    const [ready, setReady] = useState(() => placesCache.has(cacheKey));

    useEffect(() => {
        if (placesCache.has(cacheKey)) {
            setPlaces(placesCache.get(cacheKey)!);
            setReady(true);
            return;
        }

        let cancelled = false;
        setReady(false);
        setPlaces([]);

        const topic = TOPIC_NEAR_ME[topicSlug];
        fetch(
            `/api/nearby-interest?suburb=${encodeURIComponent(suburb)}&topic=${encodeURIComponent(topic)}`,
        )
            .then((r) => r.json() as Promise<NearbyInterestRecord[]>)
            .then((data) => {
                if (cancelled) return;
                const results = Array.isArray(data) ? data.slice(0, 3) : [];
                placesCache.set(cacheKey, results);
                setPlaces(results);
                setReady(true);
            })
            .catch(() => {
                if (!cancelled) setReady(true);
            });

        return () => {
            cancelled = true;
        };
    }, [cacheKey, suburb, topicSlug]);

    if (!ready || places.length === 0) return null;

    return (
        <div className="mt-6 rounded-xl border border-minuri-silver/60 bg-minuri-fog/40 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.13em] text-minuri-mid">
                Places to go today in {suburb}
            </p>
            <p className="mt-0.5 text-xs text-minuri-slate">
                {TOPIC_PLACE_LABEL[topicSlug]}
            </p>
            <ul className="mt-3 divide-y divide-minuri-silver/40">
                {places.map((place, i) => (
                    <li
                        key={place.place_id ?? i}
                        className="flex items-start gap-2.5 py-2.5 first:pt-0 last:pb-0"
                    >
                        <MapPin className="mt-0.5 size-3.5 shrink-0 text-minuri-teal" />
                        <span>
                            <span className="block text-sm font-medium text-minuri-ocean">
                                {place.title}
                            </span>
                            {place.address && (
                                <span className="block text-xs text-minuri-slate">
                                    {place.address}
                                </span>
                            )}
                            {place.rating != null && (
                                <span className="mt-0.5 block text-xs text-minuri-slate">
                                    {place.rating} ★
                                </span>
                            )}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
