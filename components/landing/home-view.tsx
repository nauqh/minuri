"use client";

import { useState } from "react";

import { SpotlightScrollSection } from "@/components/landing/spotlight-scroll-section";
import { LandingAccessSection } from "@/components/landing/landing-access-section";
import { LandingCareSection } from "@/components/landing/landing-care-section";
import { LandingFlowSection } from "@/components/landing/landing-flow-section";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingHeroSection } from "@/components/landing/landing-hero-section";
import { LandingHeroSectionV2 } from "./landing-hero-section-v2";
import { ScrollToTopButton } from "@/components/landing/scroll-to-top-button";

export function HomeView() {
	const [headerVisible, setHeaderVisible] = useState(false);

	return (
		<div className="min-h-screen bg-minuri-fog text-foreground">
			<LandingHeroSectionV2
				headerVisible={headerVisible}
				onHeroReveal={() => setHeaderVisible(true)}
			/>

			<main>
				<SpotlightScrollSection />
				<LandingFlowSection />
				<LandingCareSection />
				<LandingAccessSection />
			</main>
			<LandingFooter />
			<ScrollToTopButton />
		</div>
	);
}
