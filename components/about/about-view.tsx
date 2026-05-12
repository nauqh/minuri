"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

const TEAM = [
	{
		name: "Quan",
		fullName: "Do Minh Quan",
		role: "Full-Stack Engineer",
		animated: "/team/Quan.png",
		photo: "/team/Quan0.jpeg",
		bio: "Add bio here.",
	},
	{
		name: "Shawn",
		fullName: "Shawn Han",
		role: "Product & Research",
		animated: "/team/Shawn.jpeg",
		photo: "/team/Shawn0.jpeg",
		bio: "Add bio here.",
	},
	{
		name: "Minh",
		fullName: "Minh Nguyen",
		role: "Frontend Engineer",
		animated: "/team/Minh.jpeg",
		photo: "/team/Minh0.png",
		bio: "Add bio here.",
	},
	{
		name: "Chon",
		fullName: "Chon Lam",
		role: "Backend Engineer",
		animated: "/team/Chon.jpeg",
		photo: "/team/Chon0.jpeg",
		bio: "Add bio here.",
	},
	{
		name: "Jiaxin",
		fullName: "Jiaxin Chen",
		role: "UI/UX Design",
		animated: "/team/Jiaxin.png",
		photo: "/team/Jiaxin0.jpeg",
		bio: "Add bio here.",
	},
	{
		name: "Chengmin",
		fullName: "Chengmin Chang",
		role: "Data Analyst",
		animated: "/team/Chengmin.png",
		photo: "/team/Chengmin0.jpeg",
		bio: "Add bio here.",
	},
] as const;

export function AboutView() {
	const prefersReducedMotion = useReducedMotion();
	const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
	const [introPhase, setIntroPhase] = useState<
		"animated" | "original" | "done"
	>("animated");
	const [imageHovered, setImageHovered] = useState(false);
	const [teamHovered, setTeamHovered] = useState(false);
	const t1 = useRef<ReturnType<typeof setTimeout> | null>(null);
	const t2 = useRef<ReturnType<typeof setTimeout> | null>(null);

	const clearTimers = () => {
		if (t1.current) clearTimeout(t1.current);
		if (t2.current) clearTimeout(t2.current);
	};

	const toggle = (index: number) => {
		clearTimers();
		const isOpening = expandedIndex !== index;
		setExpandedIndex(isOpening ? index : null);
		setImageHovered(false);
		setIntroPhase("animated");
		if (isOpening && !prefersReducedMotion) {
			t1.current = setTimeout(() => setIntroPhase("original"), 1400);
			t2.current = setTimeout(() => setIntroPhase("done"), 3200);
		} else if (isOpening) {
			setIntroPhase("done");
		}
	};

	useEffect(() => () => clearTimers(), []);

	const showOriginal =
		introPhase === "original" || (introPhase === "done" && imageHovered);

	return (
		<div className="min-h-screen bg-minuri-white text-minuri-ink">
			{/* Hero */}
			<section className="relative flex min-h-[52vh] flex-col justify-end overflow-hidden px-6 pb-14 pt-32 md:px-12 md:pb-20">
				<div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.035]">
					<svg
						viewBox="0 0 800 400"
						className="h-full w-full"
						fill="none"
						stroke="currentColor"
						strokeWidth="0.6"
					>
						{Array.from({ length: 18 }, (_, i) => (
							<ellipse
								key={i}
								cx="400"
								cy="200"
								rx={40 + i * 22}
								ry={20 + i * 11}
								transform={`rotate(${i * 10} 400 200)`}
							/>
						))}
					</svg>
				</div>
				<h1
					className="relative z-10 text-[clamp(4rem,14vw,11rem)] font-black uppercase leading-none tracking-tight text-minuri-ocean"
					style={{ fontFamily: "var(--font-sans)" }}
				>
					Our Team
				</h1>
				<p className="relative z-10 mt-6 max-w-sm text-base leading-relaxed text-minuri-slate md:text-lg">
					A dedicated team, driven by the common goal of helping
					newcomers feel at home in Melbourne.
				</p>
			</section>

			{/* Divider */}
			<div className="border-t border-minuri-silver/60" />

			{/* Team list */}
			<section>
				<ol>
					{TEAM.map((member, index) => {
						const isExpanded = expandedIndex === index;
						return (
							<li key={member.name}>
								{/* Row header */}
								<button
									type="button"
									onClick={() => toggle(index)}
									className={cn(
										"group flex w-full cursor-pointer items-center justify-between gap-6 px-6 py-9 transition-colors duration-200 md:px-12 md:py-11",
										isExpanded
											? "bg-minuri-fog/60"
											: "hover:bg-minuri-fog/40",
									)}
								>
									<div className="flex items-center">
										<span className="text-2xl font-bold leading-none tracking-tight text-minuri-ocean md:text-4xl">
											{member.name}
										</span>
									</div>
									<div className="flex items-center gap-4">
										<span className="text-sm font-medium text-minuri-slate md:text-base">
											{member.role}
										</span>
										<span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-minuri-silver/60 text-minuri-slate transition-colors duration-200 group-hover:border-minuri-teal/50 group-hover:text-minuri-teal">
											{isExpanded ? (
												<Minus
													className="size-3"
													aria-hidden="true"
												/>
											) : (
												<Plus
													className="size-3"
													aria-hidden="true"
												/>
											)}
										</span>
									</div>
								</button>

								{/* Expandable panel */}
								<AnimatePresence initial={false}>
									{isExpanded && (
										<motion.div
											key="panel"
											initial={{ height: 0 }}
											animate={{ height: "auto" }}
											exit={{ height: 0 }}
											transition={{
												duration: prefersReducedMotion
													? 0
													: 0.6,
												ease: [0.22, 1, 0.36, 1],
											}}
											style={{ overflow: "hidden" }}
										>
											<motion.div
												initial={{ opacity: 0, y: 14 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{
													duration:
														prefersReducedMotion
															? 0
															: 0.55,
													delay: prefersReducedMotion
														? 0
														: 0.28,
													ease: [0.22, 1, 0.36, 1],
												}}
												className="grid grid-cols-1 gap-10 px-6 pb-14 pt-4 md:grid-cols-[300px_1fr_1.4fr] md:gap-12 md:px-12 md:pb-16"
											>
												{/* Portrait */}
												<div
													className="relative h-72 w-56 shrink-0 cursor-crosshair overflow-hidden md:h-[360px] md:w-full"
													onMouseEnter={() =>
														setImageHovered(true)
													}
													onMouseLeave={() =>
														setImageHovered(false)
													}
												>
													{/* Animated base */}
													<Image
														src={member.animated}
														alt={member.name}
														fill
														className="object-cover"
														sizes="(max-width: 768px) 176px, 180px"
														priority
													/>
													{/* Original — shown during intro, then again on hover */}
													<motion.div
														className="absolute inset-0"
														initial={{ opacity: 0 }}
														animate={{
															opacity:
																showOriginal
																	? 1
																	: 0,
														}}
														transition={{
															duration:
																prefersReducedMotion
																	? 0
																	: 0.9,
															ease: [
																0.25, 0.46,
																0.45, 0.94,
															],
														}}
													>
														<Image
															src={member.photo}
															alt={member.name}
															fill
															className="object-cover"
															sizes="(max-width: 768px) 176px, 180px"
														/>
													</motion.div>
												</div>

												{/* Name + role */}
												<div className="flex flex-col justify-start pt-1">
													<h2
														className="text-3xl font-black leading-tight text-minuri-ocean md:text-4xl"
														style={{
															fontFamily:
																"var(--font-sans)",
														}}
													>
														{member.fullName}
													</h2>
													<p className="mt-2 text-sm font-medium text-minuri-slate">
														{member.role}
													</p>
												</div>

												{/* Bio */}
												<div className="flex flex-col justify-start pt-1">
													<p className="text-base leading-relaxed text-minuri-ink">
														{member.bio}
													</p>
												</div>
											</motion.div>
										</motion.div>
									)}
								</AnimatePresence>

								<div className="border-t border-minuri-silver/50" />
							</li>
						);
					})}
				</ol>
			</section>

			{/* About section */}
			<section className="border-t border-minuri-silver/60 px-6 py-20 md:px-12 md:py-28">
				<div className="mx-auto max-w-2xl space-y-6">
					<p className="text-base leading-relaxed text-minuri-ink md:text-lg md:leading-relaxed">
						Minuri is built by a small team of international
						students who know firsthand what it feels like to arrive
						in a new city and not know where to start. We met at
						university in Melbourne, and this app grew out of the
						questions we kept asking each other.
					</p>
					<p className="text-base leading-relaxed text-minuri-ink md:text-lg md:leading-relaxed">
						At the heart of our work is a simple belief — settling
						in should not be a solo project. By mapping the real
						steps people take, from opening a bank account to
						finding a GP, we make the invisible path visible.
					</p>
					<p className="text-base leading-relaxed text-minuri-ink md:text-lg md:leading-relaxed">
						Every guide we write is shaped by lived experience. We
						ask questions — of the city, of each other, and of the
						people we talk to along the way. The answers become the
						content you read here.
					</p>
					<p className="text-base leading-relaxed text-minuri-ink md:text-lg md:leading-relaxed">
						We care about precision. Not just the right suburb or
						the right form to fill in, but the right framing — the
						kind that makes a task feel manageable rather than
						overwhelming.
					</p>
					<p className="text-base leading-relaxed text-minuri-ink md:text-lg md:leading-relaxed">
						If you're new to Melbourne, or you know someone who is —
						this is for you.
					</p>
				</div>
			</section>

			{/* Team photo */}
			<section className="px-6 pb-20 md:px-12 md:pb-28">
				<div
					className="relative mx-auto max-w-5xl cursor-crosshair overflow-hidden"
					onMouseEnter={() => setTeamHovered(true)}
					onMouseLeave={() => setTeamHovered(false)}
				>
					<Image
						src="/team/team.jpeg"
						alt="The Minuri team"
						width={1800}
						height={1350}
						className="w-full h-auto block"
						sizes="(max-width: 768px) 100vw, 1024px"
					/>
					<motion.div
						className="absolute inset-0"
						initial={{ opacity: 0 }}
						animate={{ opacity: teamHovered ? 1 : 0 }}
						transition={{
							duration: 0.9,
							ease: [0.25, 0.46, 0.45, 0.94],
						}}
					>
						<Image
							src="/team/team0.jpeg"
							alt="The Minuri team"
							width={1800}
							height={1350}
							className="w-full h-auto block"
							sizes="(max-width: 768px) 100vw, 1024px"
						/>
					</motion.div>
				</div>
			</section>
		</div>
	);
}
