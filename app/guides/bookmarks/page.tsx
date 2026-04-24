import { Suspense } from "react";

import { GuidesLibraryView } from "@/components/guides/guides-library-view";
import { ScrollToTopButton } from "@/components/landing/scroll-to-top-button";

export default function BookmarksPage() {
	return (
		<>
			<Suspense fallback={null}>
				<GuidesLibraryView mode="bookmarks" />
			</Suspense>
			<ScrollToTopButton trackedSectionIds={[]} />
		</>
	);
}
