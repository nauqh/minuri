"use client";

import { motion } from "motion/react";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function AboutTemplate({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="relative">
			{children}
			<motion.div
				className="pointer-events-none fixed inset-0 z-50 bg-minuri-ocean"
				initial={{ y: 0 }}
				animate={{ y: "-100%" }}
				transition={{ duration: 0.9, ease, delay: 0.15 }}
			/>
		</div>
	);
}
