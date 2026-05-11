"use client";

import { useEffect, useRef, useState } from "react";
import { X, Download } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { Guide } from "@/content/guides";
import { GuideShareCard } from "./guide-share-card";

type Props = {
	guide: Guide;
	isOpen: boolean;
	onClose: () => void;
};

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const SCALE = 0.85;

const LOADER_LINES = [
	{ w: "80%", color: "#1a3040", h: 10, delay: 0.05 },
	{ w: "60%", color: "#1a3040", h: 8, delay: 0.15 },
	{ w: "90%", color: "#c8d4dc", h: 7, delay: 0.25 },
	{ w: "70%", color: "#c8d4dc", h: 7, delay: 0.35 },
	{ w: "85%", color: "#c8d4dc", h: 7, delay: 0.45 },
	{ w: "55%", color: "#c8d4dc", h: 7, delay: 0.55 },
	{ w: "40%", color: "#fcf300", h: 28, delay: 0.65 },
	{ w: "75%", color: "#c8d4dc", h: 7, delay: 0.82 },
	{ w: "65%", color: "#c8d4dc", h: 7, delay: 0.92 },
	{ w: "50%", color: "#ffc2d1", h: 22, delay: 1.02 },
	{ w: "70%", color: "#c8d4dc", h: 7, delay: 1.18 },
];

function PocketGuideLoader({ title }: { title: string }) {
	return (
		<div className="flex flex-col items-center gap-6">
			{/* Mini notebook card */}
			<motion.div
				initial={{ opacity: 0, y: 16 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4, ease: EASE }}
				style={{
					width: "clamp(340px, 30vw, 460px)",
					backgroundColor: "#faf8f3",
					borderRadius: "6px",
					overflow: "hidden",
					boxShadow:
						"0 24px 60px rgba(0,0,0,0.5), 0 4px 12px rgba(0,0,0,0.3)",
					backgroundImage:
						"radial-gradient(circle, #b8c8d4 1px, transparent 1px)",
					backgroundSize: "18px 18px",
					backgroundPosition: "10px 10px",
					fontFamily:
						'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
				}}
			>
				{/* Coil strip */}
				<div
					style={{
						height: "20px",
						backgroundColor: "#e8eef2",
						borderBottom: "1px solid #c8d4dc",
						display: "flex",
						alignItems: "center",
						paddingLeft: "10px",
						gap: "8px",
					}}
				>
					{Array.from({ length: 10 }, (_, i) => (
						<div
							key={i}
							style={{
								width: "10px",
								height: "10px",
								borderRadius: "50%",
								border: "1.5px solid #c8d4dc",
								backgroundColor: "#faf8f3",
							}}
						/>
					))}
				</div>

				<div style={{ padding: "14px 18px 18px" }}>
					{/* Wordmark */}
					<p
						style={{
							fontSize: "9px",
							fontWeight: 900,
							letterSpacing: "0.14em",
							color: "#1a3040",
							textTransform: "uppercase",
							marginBottom: "12px",
						}}
					>
						MINURI
					</p>

					{/* Animated lines */}
					{LOADER_LINES.map((line, i) => (
						<motion.div
							key={i}
							initial={{ scaleX: 0 }}
							animate={{ scaleX: 1 }}
							transition={{
								duration: 0.35,
								delay: line.delay,
								ease: EASE,
							}}
							style={{
								width: line.w,
								height: `${line.h}px`,
								backgroundColor: line.color,
								borderRadius:
									line.h > 12 ? "4px" : "3px",
								marginBottom:
									line.h > 12 ? "10px" : "8px",
								transformOrigin: "left",
								opacity: line.color === "#c8d4dc" ? 0.7 : 1,
							}}
						/>
					))}
				</div>
			</motion.div>

			{/* Label */}
			<motion.p
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.3, duration: 0.4 }}
				className="text-sm font-medium text-white/60"
			>
				Working on your pocket guide
				<AnimatedDots />
			</motion.p>
		</div>
	);
}

function AnimatedDots() {
	const [count, setCount] = useState(1);
	useEffect(() => {
		const t = setInterval(
			() => setCount((c) => (c >= 3 ? 1 : c + 1)),
			420,
		);
		return () => clearInterval(t);
	}, []);
	return <span>{".".repeat(count)}</span>;
}

export function GuideShareModal({ guide, isOpen, onClose }: Props) {
	const captureRef = useRef<HTMLDivElement>(null);
	const [downloading, setDownloading] = useState(false);
	const [phase, setPhase] = useState<"loading" | "ready">("loading");

	useEffect(() => {
		if (!isOpen) return;
		setPhase("loading");
		const t = setTimeout(() => setPhase("ready"), 2000);
		return () => clearTimeout(t);
	}, [isOpen]);

	async function handleDownload() {
		if (!captureRef.current || downloading) return;
		setDownloading(true);
		try {
			await document.fonts.ready;
			const { toPng } = await import("html-to-image");
			const { jsPDF } = await import("jspdf");

			const el = captureRef.current;
			const imgData = await toPng(el, {
				pixelRatio: 2,
				backgroundColor: "#faf8f3",
			});

			const pdfW = 148;
			const pdfH = Math.round((el.offsetHeight / el.offsetWidth) * pdfW);
			const pdf = new jsPDF({
				orientation: "portrait",
				unit: "mm",
				format: [pdfW, pdfH],
			});
			pdf.addImage(imgData, "PNG", 0, 0, pdfW, pdfH);
			pdf.save(`minuri-${guide.slug}.pdf`);
		} catch (err) {
			console.error("PDF export failed, falling back to PNG", err);
			try {
				const { toPng } = await import("html-to-image");
				const imgData = await toPng(captureRef.current!, {
					pixelRatio: 2,
					backgroundColor: "#faf8f3",
				});
				const link = document.createElement("a");
				link.download = `minuri-${guide.slug}.png`;
				link.href = imgData;
				link.click();
			} catch {
				// silent
			}
		} finally {
			setDownloading(false);
		}
	}

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					key="backdrop"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.2 }}
					className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm"
					onClick={onClose}
				>
					<div className="flex min-h-full items-center justify-center p-8">
						<motion.div
							key="panel"
							initial={{ opacity: 0, scale: 0.96, y: 12 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.96, y: 8 }}
							transition={{ duration: 0.3, ease: EASE }}
							className="relative flex flex-col items-center gap-4"
							onClick={(e) => e.stopPropagation()}
						>
							{/* Close */}
							<button
								onClick={onClose}
								className="absolute -right-3 -top-3 z-10 rounded-full bg-white p-1.5 shadow-lg transition-colors hover:bg-gray-100"
								aria-label="Close"
							>
								<X className="h-4 w-4 text-gray-600" />
							</button>

							<AnimatePresence mode="wait">
								{phase === "loading" ? (
									<motion.div
										key="loader"
										exit={{ opacity: 0, scale: 0.95 }}
										transition={{ duration: 0.3, ease: EASE }}
									>
										<PocketGuideLoader title={guide.title} />
									</motion.div>
								) : (
									<motion.div
										key="card"
										initial={{ opacity: 0, y: 16 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.45, ease: EASE }}
										className="flex flex-col items-center gap-4"
									>
										{/* Preview */}
										<div
											style={{
												borderRadius: "6px",
												overflowX: "hidden",
												boxShadow:
													"0 24px 60px rgba(0,0,0,0.5), 0 4px 12px rgba(0,0,0,0.3)",
											}}
										>
											<div
												className="pointer-events-none [zoom:0.85] min-[1500px]:[zoom:1]"
												style={{ width: "793px" }}
											>
												<GuideShareCard guide={guide} />
											</div>
										</div>

										{/* Download button */}
										<button
											onClick={handleDownload}
											disabled={downloading}
											className="flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-gray-900 shadow-lg transition-all hover:bg-gray-50 disabled:opacity-60"
										>
											<Download className="h-4 w-4" />
											{downloading
												? "Preparing…"
												: "Download PDF"}
										</button>

										<p className="text-xs text-white/40">
											Saves as A5 · {guide.slug}
										</p>
									</motion.div>
								)}
							</AnimatePresence>
						</motion.div>
					</div>

					{/* Off-screen capture target */}
					<div
						style={{
							position: "fixed",
							top: "-9999px",
							left: "-9999px",
							pointerEvents: "none",
							zIndex: -1,
						}}
					>
						<GuideShareCard ref={captureRef} guide={guide} />
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
