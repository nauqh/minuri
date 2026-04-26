"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

type GuidesShellProps = {
	title: string;
	description: string;
	children: ReactNode;
	/** Trailing controls in the top bar (e.g. mobile filters on the library). */
	headerEnd?: ReactNode;
};

export function GuidesShell({
	title,
	description,
	children,
	headerEnd,
}: GuidesShellProps) {
	const pathname = usePathname();

	const links = [
		{
			href: "/",
			label: "Home",
			active: pathname === "/",
		},
		{
			href: "/guides",
			label: "Guides",
			active:
				pathname === "/guides" ||
				(pathname.startsWith("/guides/") &&
					pathname !== "/guides/bookmarks"),
		},
		{
			href: "/guides/bookmarks",
			label: "My Bookmarks",
			active: pathname === "/guides/bookmarks",
		},
		{
			href: "/near-me",
			label: "Near Me",
			active: pathname === "/near-me",
		},
	] as const;

	return (
		<div className="min-h-screen bg-minuri-white text-foreground">
			<header className="relative z-40 bg-minuri-white">
				<div className="relative mx-auto max-w-screen-2xl px-4 pb-10 pt-4 md:px-8">
					<div className="mx-auto flex w-full items-center justify-between gap-3 bg-minuri-white md:rounded-full">
						<Link
							href="/"
							className="z-10 flex shrink-0 items-center gap-2 text-2xl font-black tracking-tight text-minuri-ocean"
						>
							<span className="uppercase">Minuri</span>
						</Link>
						<div className="z-10 flex min-w-0 flex-1 items-center justify-end gap-2 md:justify-between md:gap-4">
							<nav
								aria-label="Guides navigation"
								className="ml-10 hidden items-center gap-9 text-sm font-medium text-minuri-ocean md:flex"
							>
								{links.map((link) => (
									<Link
										key={link.href}
										href={link.href}
										className={cn(
											"minuri-link-underline inline-flex h-10 items-center whitespace-nowrap",
											link.active
												? "text-minuri-ocean"
												: "text-minuri-ocean/70 transition-colors duration-200 hover:text-minuri-ocean",
										)}
									>
										{link.label}
									</Link>
								))}
							</nav>
							{headerEnd ? (
								<div className="flex shrink-0 items-center">
									{headerEnd}
								</div>
							) : null}
						</div>
					</div>
					<div className="mx-auto max-w-screen-2xl px-0 pb-1 pt-7 md:pt-9">
						<div className="pt-8 text-center md:pt-10">
							<p className="landing-section-kicker">
								First-time guides
							</p>
							<h1 className="landing-section-heading md:text-6xl">
								{title}
							</h1>
							<p className="landing-section-subheading">
								{description}
							</p>
						</div>
					</div>
				</div>
			</header>

			<main className="mx-auto max-w-screen-2xl px-4 py-8 md:px-8 md:py-10">
				{children}
			</main>
		</div>
	);
}
