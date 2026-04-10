"use client";

import { useState } from "react";

import { SpotlightScrollSection } from "@/components/landing/spotlight-scroll-section";
import { LandingAccessSection } from "@/components/landing/landing-access-section";
import { LandingCareSection } from "@/components/landing/landing-care-section";
import { LandingFlowSection } from "@/components/landing/landing-flow-section";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingHeader } from "@/components/landing/landing-header";
import { LandingHeroSection } from "@/components/landing/landing-hero-section";

export function HomeView() {
	const [headerVisible, setHeaderVisible] = useState(true);

	return (
		<div className="min-h-screen bg-minuri-fog text-foreground">
			<LandingHeader isVisible={headerVisible} />
			<LandingHeroSection onHeroReveal={() => setHeaderVisible(true)} />

			<main>
				<SpotlightScrollSection />
				<LandingFlowSection />
				<LandingCareSection />
				<LandingAccessSection />
			</main>
			<LandingFooter />
		</div>
	);
}
