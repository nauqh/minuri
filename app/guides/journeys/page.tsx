import { Suspense } from "react";

import { PersonaJourneyView } from "@/components/guides/persona-journey-view";
import { ScrollToTopButton } from "@/components/landing/scroll-to-top-button";

export default function JourneysPage() {
    return (
        <>
            <Suspense fallback={null}>
                <PersonaJourneyView />
            </Suspense>
            <ScrollToTopButton />
        </>
    );
}
