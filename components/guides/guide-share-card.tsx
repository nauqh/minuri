"use client";

import { forwardRef } from "react";
import type { Guide } from "@/content/guides";

const TOPIC_META: Record<
	string,
	{ name: string; accent: string; chipBg: string; chipText: string }
> = {
	"food-eating": {
		name: "Food & Eating",
		accent: "#3a8878",
		chipBg: "#e0f5f0",
		chipText: "#1d5c52",
	},
	"getting-around": {
		name: "Getting Around",
		accent: "#4a7fc0",
		chipBg: "#e0ecf8",
		chipText: "#1e4a80",
	},
	"health-wellbeing": {
		name: "Health & Wellbeing",
		accent: "#3a8878",
		chipBg: "#e0f5f0",
		chipText: "#1d5c52",
	},
	"home-admin": {
		name: "Home & Admin",
		accent: "#c0503a",
		chipBg: "#fdecea",
		chipText: "#7a2010",
	},
	"social-belonging": {
		name: "Social & Belonging",
		accent: "#9a7800",
		chipBg: "#fffacc",
		chipText: "#5a4400",
	},
};

const SANS =
	'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

function stripMarkdown(text: string): string {
	return text
		.replace(/\*\*(.+?)\*\*/g, "$1")
		.replace(/\*(.+?)\*/g, "$1")
		.replace(/__(.+?)__/g, "$1")
		.replace(/_(.+?)_/g, "$1")
		.replace(/\[(.+?)\]\(.+?\)/g, "$1")
		.replace(/`(.+?)`/g, "$1")
		.replace(/^#{1,6}\s+/gm, "")
		.replace(/^>\s+/gm, "")
		.replace(/^\d+\.\s+/gm, "")
		.replace(/^[-*]\s+/gm, "")
		.replace(/\n+/g, " ")
		.trim();
}

function firstSentence(text: string): string {
	const clean = stripMarkdown(text);
	// require at least 8 chars before the sentence-ending punctuation
	const match = clean.match(/^.{8,}?[.!?](?:\s|$)/);
	return match ? match[0].trim() : clean;
}

function SpiralCoil() {
	const rings = Array.from({ length: 18 }, (_, i) => i);
	return (
		<svg
			width="793"
			height="36"
			viewBox="0 0 793 36"
			style={{ display: "block", flexShrink: 0 }}
		>
			{rings.map((i) => (
				<ellipse
					key={i}
					cx={26 + i * 42}
					cy={18}
					rx={14}
					ry={11}
					fill="none"
					stroke="#c8d2da"
					strokeWidth="2.5"
				/>
			))}
			<line
				x1="0"
				y1="32"
				x2="793"
				y2="32"
				stroke="#c8d2da"
				strokeWidth="1"
			/>
		</svg>
	);
}

type GuideShareCardProps = { guide: Guide };

export const GuideShareCard = forwardRef<HTMLDivElement, GuideShareCardProps>(
	({ guide }, ref) => {
		const meta = TOPIC_META[guide.topic] ?? TOPIC_META["health-wellbeing"];

		const { bullets, headsUp, goodToKnow } = guide.shareCard;
		const steps = guide.firstSteps ?? [];

		const dateStr = new Date().toLocaleDateString("en-AU", {
			month: "long",
			year: "numeric",
		});
		const guideUrl = `minuri.app/guides/${guide.topic}/${guide.slug}`;

		return (
			<div
				ref={ref}
				style={{
					width: "793px",
					backgroundColor: "#faf8f3",
					fontFamily: SANS,
					backgroundImage:
						"linear-gradient(rgba(102, 134, 145, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(102, 134, 145, 0.15) 1px, transparent 1px)",
					backgroundSize: "1.5rem 1.5rem",
					display: "flex",
					flexDirection: "column",
				}}
			>
				{/* Spiral coil */}
				<SpiralCoil />

				{/* Main content */}
				<div
					style={{
						padding: "28px 56px 32px",
						display: "flex",
						flexDirection: "column",
						gap: 0,
					}}
				>
					{/* Header row */}
					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							marginBottom: "22px",
						}}
					>
						<span
							style={{
								fontSize: "18px",
								fontWeight: 900,
								letterSpacing: "0.14em",
								color: "#1a3040",
								textTransform: "uppercase",
							}}
						>
							MINURI
						</span>
						<span
							style={{
								backgroundColor: meta.chipBg,
								color: meta.chipText,
								padding: "5px 14px",
								borderRadius: "999px",
								fontSize: "10px",
								fontWeight: 700,
								textTransform: "uppercase",
								letterSpacing: "0.1em",
							}}
						>
							{meta.name}
						</span>
					</div>

					{/* Title */}
					<h1
						style={{
							fontSize: "34px",
							fontWeight: 900,
							color: "#1a3040",
							lineHeight: 1.08,
							letterSpacing: "-0.02em",
							textTransform: "uppercase",
							margin: "0 0 10px 0",
						}}
					>
						{guide.title}
					</h1>

					{/* Summary */}
					<p
						style={{
							fontSize: "13px",
							color: "#4a6070",
							lineHeight: 1.6,
							margin: "0 0 26px 0",
						}}
					>
						{stripMarkdown(guide.summary)}
					</p>

					{/* Key things to know */}
					{bullets.length > 0 && (
						<>
							<p
								style={{
									fontSize: "10px",
									fontWeight: 700,
									textTransform: "uppercase",
									letterSpacing: "0.16em",
									color: "#8a9ea8",
									margin: "0 0 14px 0",
								}}
							>
								Key things to know
							</p>

							{/* Points + sticky note 1 */}
							<div style={{ position: "relative", marginBottom: "24px" }}>
								<div
									style={{
										paddingRight: headsUp ? "200px" : "0",
									}}
								>
									{bullets.map((point, i) => (
										<div
											key={i}
											style={{
												display: "flex",
												gap: "10px",
												marginBottom: "13px",
											}}
										>
											<span
												style={{
													color: meta.accent,
													fontWeight: 800,
													flexShrink: 0,
													fontSize: "14px",
													lineHeight: "1.5",
												}}
											>
												•
											</span>
											<p
												style={{
													fontSize: "12.5px",
													color: "#2a3a46",
													lineHeight: 1.55,
													margin: 0,
												}}
											>
												{point}
											</p>
										</div>
									))}
								</div>

								{/* Sticky note 1 — yellow */}
								{headsUp && (
									<div
										style={{
											position: "absolute",
											top: "4px",
											right: "0",
											width: "178px",
											backgroundColor: "#fcf300",
											padding: "14px 13px",
											transform: "rotate(2.5deg)",
											boxShadow: "3px 5px 10px rgba(0,0,0,0.13)",
										}}
									>
										<p
											style={{
												fontSize: "8.5px",
												fontWeight: 700,
												textTransform: "uppercase",
												letterSpacing: "0.13em",
												color: "#6a5e00",
												margin: "0 0 7px 0",
											}}
										>
											heads up
										</p>
										<p
											style={{
												fontSize: "11px",
												color: "#2a2400",
												lineHeight: 1.5,
												margin: 0,
											}}
										>
											{headsUp}
										</p>
									</div>
								)}
							</div>
						</>
					)}

					{/* First steps */}
					{steps.length > 0 && (
						<div style={{ marginBottom: "24px" }}>
							<p
								style={{
									fontSize: "10px",
									fontWeight: 700,
									textTransform: "uppercase",
									letterSpacing: "0.16em",
									color: "#8a9ea8",
									margin: "0 0 12px 0",
								}}
							>
								Your first steps
							</p>
							<div
								style={{
									display: "flex",
									flexDirection: "column",
									gap: "8px",
									borderLeft: `3px solid ${meta.accent}`,
									paddingLeft: "0",
								}}
							>
								{steps.map((step, i) => (
									<div
										key={i}
										style={{
											display: "flex",
											alignItems: "flex-start",
											gap: "12px",
											backgroundColor: `${meta.accent}10`,
											borderLeft: `3px solid ${meta.accent}`,
											padding: "11px 14px",
										}}
									>
										<div
											style={{
												width: "16px",
												height: "16px",
												border: `2px solid ${meta.accent}`,
												borderRadius: "3px",
												flexShrink: 0,
												marginTop: "2px",
											}}
										/>
										<div>
											<p
												style={{
													fontSize: "12.5px",
													color: "#1a3040",
													fontWeight: 600,
													margin: "0 0 2px 0",
													lineHeight: 1.4,
												}}
											>
												{step.label}
											</p>
											<p
												style={{
													fontSize: "11px",
													color: "#8a9ea8",
													margin: 0,
												}}
											>
												~{step.estimateMin} min
											</p>
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{/* Sticky note 2 — pink */}
					{goodToKnow && (
						<div
							style={{
								alignSelf: "flex-end",
								width: "220px",
								backgroundColor: "#ffc2d1",
								padding: "14px 13px",
								transform: "rotate(-2deg)",
								boxShadow: "3px 5px 10px rgba(0,0,0,0.1)",
								marginBottom: "8px",
							}}
						>
							<p
								style={{
									fontSize: "8.5px",
									fontWeight: 700,
									textTransform: "uppercase",
									letterSpacing: "0.13em",
									color: "#7a1a30",
									margin: "0 0 7px 0",
								}}
							>
								good to know
							</p>
							<p
								style={{
									fontSize: "11px",
									color: "#3a0010",
									lineHeight: 1.5,
									margin: 0,
								}}
							>
								{goodToKnow}
							</p>
						</div>
					)}
				</div>

				{/* Footer */}
				<div
					style={{
						borderTop: "1px solid #d8e0e6",
						backgroundColor: "#f4f0e8",
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						padding: "14px 56px",
						marginTop: "auto",
					}}
				>
					<span style={{ fontSize: "10.5px", color: "#6a8090" }}>
						{guideUrl}
					</span>
					<span style={{ fontSize: "10.5px", color: "#9aaab4" }}>
						{dateStr}
					</span>
				</div>
			</div>
		);
	},
);

GuideShareCard.displayName = "GuideShareCard";
