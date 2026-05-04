"use client";

import { useVibe } from "@/hooks/use-vibe";

export function VibeProvider({ children }: { children: React.ReactNode }) {
	useVibe();
	return <>{children}</>;
}
