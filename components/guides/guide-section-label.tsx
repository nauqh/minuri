"use client";

import { cn } from "@/lib/utils";

interface GuideSectionLabelProps {
	label: string;
	dark?: boolean;
	className?: string;
}

export function GuideSectionLabel({
	label,
	dark = false,
	className,
}: GuideSectionLabelProps) {
	return (
		<header className={cn("mb-6 text-center", className)}>
			<p
				className={cn(
					"text-sm font-black uppercase tracking-[0.18em]",
					dark ? "text-minuri-seafoam/80" : "text-minuri-teal",
				)}
			>
				{label}
			</p>
			<div
				className={cn(
					"mx-auto mt-2 w-14 border-t-2",
					dark
						? "border-minuri-seafoam/40"
						: "border-minuri-teal/60",
				)}
			/>
		</header>
	);
}
