import { Suspense } from "react";

import { GuidesPageEntry } from "@/components/guides/guides-page-entry";
import { ScrollToTopButton } from "@/components/landing/scroll-to-top-button";

export default function GuidesPage() {
	return (
		<>
			<Suspense fallback={null}>
				<GuidesPageEntry />
			</Suspense>
			<ScrollToTopButton />
		</>
	);
}
