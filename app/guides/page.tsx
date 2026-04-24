import { GuidesLibraryView } from "@/components/guides/guides-library-view";
import { ScrollToTopButton } from "@/components/landing/scroll-to-top-button";

export default function GuidesPage() {
	return (
		<>
			<GuidesLibraryView mode="library" />
			<ScrollToTopButton trackedSectionIds={[]} />
		</>
	);
}
