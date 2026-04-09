"use client";

import { SpotlightScrollSection } from "@/components/landing/spotlight-scroll-section";
import { LandingAccessSection } from "@/components/landing/landing-access-section";
import { LandingCareSection } from "@/components/landing/landing-care-section";
import { LandingFlowSection } from "@/components/landing/landing-flow-section";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingHeader } from "@/components/landing/landing-header";
import { LandingHeroSection } from "@/components/landing/landing-hero-section";
import { LandingProofSection } from "@/components/landing/landing-proof-section";

export function HomeView() {
	return (
		<div className="min-h-screen bg-minuri-fog text-foreground">
			<LandingHeader />
			<LandingHeroSection />

			<main>
				<SpotlightScrollSection />
				<LandingFlowSection />
				<LandingCareSection />
				<LandingProofSection />
				<LandingAccessSection />
			</main>
			<LandingFooter />
		</div>
	);
}
