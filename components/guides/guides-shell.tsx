"use client";

import type { ReactNode } from "react";

type GuidesShellProps = {
	children: ReactNode;
	title: string;
	description: string;
	headerStart: ReactNode;
	headerEnd?: ReactNode;
};

export function GuidesShell({
	children,
	title,
	description,
	headerStart,
	headerEnd,
}: GuidesShellProps) {
	return (
		<div className="min-h-screen bg-minuri-white text-foreground">
			<div className="mx-auto max-w-screen-2xl px-6">
				<div className="flex items-center justify-between py-3">
					{headerStart}
					{headerEnd && <div>{headerEnd}</div>}
				</div>

				<div className="pb-8 pt-6 text-center md:pt-8">
					<p className="landing-section-kicker">First-time guides</p>
					<h1 className="landing-section-heading md:text-6xl">
						{title}
					</h1>
					<p className="landing-section-subheading">{description}</p>
				</div>
			</div>

			<main className="mx-auto max-w-screen-2xl px-6 pb-10">
				{children}
			</main>
		</div>
	);
}
