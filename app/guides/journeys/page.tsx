import { Suspense } from "react";

import { PersonaJourneyView } from "@/components/guides/persona-journey-view";
import { ScrollToTopButton } from "@/components/landing/scroll-to-top-button";

export default async function JourneysPage({
    searchParams,
}: {
    searchParams: Promise<{ persona?: string }>;
}) {
    const { persona } = await searchParams;
    return (
        <>
            <Suspense fallback={null}>
                <PersonaJourneyView initialPersonaId={persona ?? null} />
            </Suspense>
            <ScrollToTopButton />
        </>
    );
}
