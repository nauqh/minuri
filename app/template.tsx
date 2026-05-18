"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function Template({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	if (pathname === "/") return <>{children}</>;

	return (
		<div className="relative">
			{children}
			<motion.div
				className="pointer-events-none fixed inset-0 z-50 bg-minuri-ocean"
				style={{ transformOrigin: "bottom" }}
				initial={{ scaleY: 1 }}
				animate={{ scaleY: 0 }}
				transition={{ duration: 1.4, ease, delay: 0.1 }}
			/>
		</div>
	);
}
