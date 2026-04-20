"use client";

import { useState } from "react";

import { SpotlightScrollSection } from "./spotlight-scroll-section";
import { LandingAccessSection } from "@/components/landing/landing-access-section";
import { LandingCareSection } from "@/components/landing/landing-care-section";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingHeroSectionV2 } from "./landing-hero-section-v2";
import { LandingHubSidebar } from "@/components/landing/landing-hub-sidebar";
import { ScrollToTopButton } from "@/components/landing/scroll-to-top-button";

export function HomeView() {
	const [headerVisible, setHeaderVisible] = useState(false);
	const [hubOpen, setHubOpen] = useState(false);

	return (
		<div className="min-h-screen bg-minuri-fog text-foreground">
			<LandingHubSidebar open={hubOpen} onOpenChange={setHubOpen} />
			<LandingHeroSectionV2
				headerVisible={headerVisible}
				onHeroReveal={() => setHeaderVisible(true)}
			/>

			<main>
				<SpotlightScrollSection
					onOpenMinuriHub={() => setHubOpen((value) => !value)}
				/>
				<LandingCareSection />
				<LandingAccessSection />
			</main>
			<LandingFooter />
			<ScrollToTopButton />
		</div>
	);
}
