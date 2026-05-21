"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BookOpen, Home, Map, MapPin } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

const NAV_ITEMS = [
	{ id: "home",    label: "Home",    icon: Home     },
	{ id: "guides",  label: "Guides",  icon: BookOpen },
	{ id: "near-me", label: "Near Me", icon: MapPin   },
	{ id: "plan",    label: "My Plan", icon: Map      },
] as const;

type NavItemId = (typeof NAV_ITEMS)[number]["id"];

export function AppNav({ journeyDay, large = false }: { journeyDay?: number; large?: boolean } = {}) {
	const pathname = usePathname();
	const [open, setOpen] = useState(false);
	const [suburb, setSuburb] = useState<string | null>(null);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		try {
			const raw = localStorage.getItem("minuri:journey:v2");
			if (raw) {
				const parsed = JSON.parse(raw) as { suburb?: string };
				setSuburb(parsed.suburb ?? null);
			}
		} catch {
			// ignore
		}
	}, []);

	useEffect(() => {
		if (!open) return;
		function onKey(e: KeyboardEvent) {
			if (e.key === "Escape") setOpen(false);
		}
		function onOutside(e: MouseEvent) {
			if (ref.current && !ref.current.contains(e.target as Node)) {
				setOpen(false);
			}
		}
		document.addEventListener("keydown", onKey);
		document.addEventListener("mousedown", onOutside);
		return () => {
			document.removeEventListener("keydown", onKey);
			document.removeEventListener("mousedown", onOutside);
		};
	}, [open]);

	const hasJourney = suburb !== null;
	const guidesHref = suburb ? `/guides?suburb=${encodeURIComponent(suburb)}` : "/guides";
	const planHref = journeyDay != null ? `/journey/plan?day=${journeyDay}` : "/journey/plan";

	const hrefs: Record<NavItemId, string> = {
		home:      "/",
		guides:    guidesHref,
		"near-me": "/near-me",
		plan:      hasJourney ? planHref : "/journey",
	};

	function isActive(id: NavItemId) {
		if (id === "home")    return pathname === "/";
		if (id === "guides")  return pathname.startsWith("/guides");
		if (id === "near-me") return pathname.startsWith("/near-me");
		if (id === "plan")    return pathname.startsWith("/journey/plan");
		return false;
	}

	const visibleItems = NAV_ITEMS as readonly { id: NavItemId; label: string; icon: typeof Home }[];

	return (
		<div ref={ref} className="relative">
			{/* Burger button */}
			<button
				type="button"
				onClick={() => setOpen((v) => !v)}
				aria-label={open ? "Close menu" : "Open menu"}
				aria-expanded={open}
				className={cn(
					"flex items-center overflow-hidden rounded-sm border transition-all duration-300",
					large ? "h-14" : "h-10",
					open
						? "border-minuri-ocean bg-minuri-ocean text-white shadow-lg"
						: "border-minuri-silver bg-minuri-white text-minuri-ocean hover:border-minuri-ocean",
				)}
			>
				{/* Label */}
				<span className={cn("font-semibold", large ? "px-6 text-base" : "px-4 text-sm")}>
					Menu
				</span>

				{/* Divider */}
				<span className={cn("w-px self-stretch", open ? "bg-minuri-teal" : "bg-minuri-silver")} />

				{/* Icon */}
				<span className={cn("flex flex-col items-center justify-center gap-[5px]", large ? "w-14" : "w-10")}>
					<motion.span
						animate={open ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
						transition={{ duration: 0.25, ease: EASE }}
						className="block h-[1.5px] w-4 rounded-full bg-current origin-center"
					/>
					<motion.span
						animate={open ? { scaleX: 0, opacity: 0 } : { scaleX: 1, opacity: 1 }}
						transition={{ duration: 0.18 }}
						className="block h-[1.5px] w-4 rounded-full bg-current"
					/>
					<motion.span
						animate={open ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
						transition={{ duration: 0.25, ease: EASE }}
						className="block h-[1.5px] w-4 rounded-full bg-current origin-center"
					/>
				</span>
			</button>

			{/* Dropdown panel */}
			<AnimatePresence>
				{open && (
					<motion.div
						initial={{ opacity: 0, scale: 0.88, y: -8 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.92, y: -6 }}
						transition={{ duration: 0.22, ease: EASE }}
						style={{ transformOrigin: "top right" }}
						className="absolute right-0 top-[calc(100%+10px)] z-50 w-64 overflow-hidden rounded-2xl border border-minuri-silver bg-white shadow-2xl backdrop-blur-md"
					>
						<nav className="flex flex-col gap-0.5 p-3" aria-label="Main navigation">
							{visibleItems.map((item, i) => {
								const active = isActive(item.id);
								const Icon = item.icon;

								return (
									<motion.div
										key={item.id}
										initial={{ opacity: 0, x: 10 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ duration: 0.18, delay: i * 0.05, ease: EASE }}
									>
										<Link
											href={hrefs[item.id]}
											onClick={() => setOpen(false)}
											className={cn(
												"group flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition-all duration-200",
												active
													? "bg-minuri-ocean text-white"
													: "text-minuri-slate hover:bg-minuri-fog hover:text-minuri-ocean",
											)}
										>
											<span
												className={cn(
													"flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors duration-200",
													active
														? "bg-minuri-teal"
														: "bg-minuri-fog group-hover:bg-minuri-silver",
												)}
											>
												<Icon className="size-4" aria-hidden />
											</span>

											<span className="flex-1">{item.label}</span>

											{active && (
												<span className="rounded-full bg-minuri-teal px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
													here
												</span>
											)}
										</Link>
									</motion.div>
								);
							})}
						</nav>

						<div className="border-t border-minuri-silver px-4 py-2.5">
							<p className="text-[10px] text-minuri-silver">
								Press <kbd className="rounded bg-minuri-fog px-1.5 py-0.5 font-mono text-[10px] text-minuri-slate">Esc</kbd> to close
							</p>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
