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
	const [passwordInput, setPasswordInput] = useState("");
	const [isUnlocked, setIsUnlocked] = useState(false);
	const [passwordError, setPasswordError] = useState("");

	const handleUnlock = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (passwordInput === "weareincredible") {
			setIsUnlocked(true);
			setPasswordError("");
			return;
		}

		setPasswordError("Incorrect password");
	};

	return (
		<div className="relative min-h-screen bg-minuri-fog text-foreground">
			{isUnlocked ? (
				<>
					<LandingHubSidebar open={hubOpen} onOpenChange={setHubOpen} />
					<LandingHeroSectionV2
						headerVisible={headerVisible}
						onHeroReveal={() => setHeaderVisible(true)}
					/>

					<main>
						<SpotlightScrollSection
							onOpenMinuriHub={() => setHubOpen(true)}
						/>
						<LandingCareSection />
						<LandingAccessSection />
					</main>
					<LandingFooter />
					<ScrollToTopButton />
				</>
			) : null}

			{!isUnlocked ? (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 backdrop-blur-sm p-6">
					<form
						onSubmit={handleUnlock}
						className="w-full max-w-md rounded-2xl border border-white/20 bg-background/95 p-8 shadow-lg"
					>
						<p className="text-xl font-semibold text-foreground">
							Protected preview
						</p>
						<p className="mt-2 text-sm text-muted-foreground">
							Enter password to access the landing page.
						</p>
						<input
							type="password"
							value={passwordInput}
							onChange={(event) => {
								setPasswordInput(event.target.value);
								if (passwordError) {
									setPasswordError("");
								}
							}}
							className="mt-5 w-full rounded-md border border-border bg-background px-4 py-3 text-base outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
							placeholder="Password"
							autoFocus
						/>
						{passwordError ? (
							<p className="mt-2 text-sm text-destructive">
								{passwordError}
							</p>
						) : null}
						<button
							type="submit"
							className="mt-5 w-full rounded-md bg-primary px-4 py-3 text-base font-medium text-primary-foreground transition hover:opacity-90"
						>
							Unlock
						</button>
					</form>
				</div>
			) : null}
		</div>
	);
}
