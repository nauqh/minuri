"use client";

import { useState } from "react";

import { SpotlightScrollSection } from "./spotlight-scroll-section";
import { LandingAccessSection } from "@/components/landing/landing-access-section";
import { LandingCareSection } from "@/components/landing/landing-care-section";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingHeroSectionV2 } from "./landing-hero-section-v2";
import { ScrollToTopButton } from "@/components/landing/scroll-to-top-button";
import { LandingServicesSection } from "@/components/landing/landing-services-section";
import { PasswordGate } from "@/components/password-gate";

export function HomeView() {
	const [headerVisible, setHeaderVisible] = useState(false);

	return (
		<div className="relative min-h-screen bg-minuri-fog text-foreground">
			<PasswordGate>
				<LandingHeroSectionV2
					headerVisible={headerVisible}
					onHeroReveal={() => setHeaderVisible(true)}
				/>

				<main>
					<LandingServicesSection />
					<SpotlightScrollSection />
					<LandingCareSection />
					<LandingAccessSection />
				</main>
				<LandingFooter />
			</PasswordGate>
			<ScrollToTopButton />
		</div>
	);
}
