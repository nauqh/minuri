"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

function RouteScrollToTop() {
	const pathname = usePathname();
	const lenis = useLenis();

	useEffect(() => {
		lenis?.scrollTo(0, { immediate: true, force: true });
	}, [pathname, lenis]);

	return null;
}

function InteractiveClickHandler() {
	const lenis = useLenis();

	useEffect(() => {
		if (!lenis) return;

		const handler = (e: PointerEvent) => {
			const target = e.target as Element;
			if (target.closest("button, a, [role='button'], [role='link']")) {
				lenis.stop();
				requestAnimationFrame(() => lenis.start());
			}
		};

		document.addEventListener("pointerdown", handler);
		return () => document.removeEventListener("pointerdown", handler);
	}, [lenis]);

	return null;
}

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
	const [reducedMotion, setReducedMotion] = useState(false);

	useEffect(() => {
		const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
		const apply = () => setReducedMotion(mq.matches);
		apply();
		mq.addEventListener("change", apply);
		return () => mq.removeEventListener("change", apply);
	}, []);

	if (reducedMotion) {
		return children;
	}

	return (
		<ReactLenis
			root
			options={{
				autoRaf: true,
				// Lower lerp = heavier “slide” / more catch-up lag (luxury portfolio feel).
				lerp: 0.068,
				smoothWheel: true,
				anchors: true,
				stopInertiaOnNavigate: true,
				allowNestedScroll: true,
			}}
		>
			<RouteScrollToTop />
			<InteractiveClickHandler />
			{children}
		</ReactLenis>
	);
}
