"use client";

import { useState } from "react";

import { LoadingScreen } from "@/components/loading-screen";

export function AppShell({ children }: { children: React.ReactNode }) {
	const [ready, setReady] = useState(false);

	return (
		<>
			<LoadingScreen onComplete={() => setReady(true)} />
			<div
				key={ready ? "ready" : "loading"}
				className="flex min-h-full flex-1 flex-col"
				style={{ visibility: ready ? "visible" : "hidden" }}
			>
				{children}
			</div>
		</>
	);
}
