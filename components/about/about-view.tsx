"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";

const QUOTE = "Me and you are incredible - (Minuri)".split(" ");

function Word({
	word,
	progress,
	index,
	total,
}: {
	word: string;
	progress: ReturnType<typeof useScroll>["scrollYProgress"];
	index: number;
	total: number;
}) {
	const start = index / total;
	const end = Math.min((index + 1) / total, 1);
	const opacity = useTransform(progress, [start, end], [0.12, 1]);
	return (
		<motion.span className="inline" style={{ opacity }}>
			{word}{" "}
		</motion.span>
	);
}

function ScrollHighlightQuote() {
	const ref = useRef<HTMLDivElement>(null);
	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ["start 0.5", "start 0"],
	});

	return (
		<div ref={ref} className="px-6 pt-28 pb-64 md:px-12 md:pt-40 md:pb-96">
			<p className="mx-auto max-w-2xl text-center text-[clamp(4rem,10vw,9rem)] font-black uppercase leading-[0.95] tracking-tight text-minuri-ocean">
				{QUOTE.map((word, i) => (
					<Word
						key={i}
						word={word}
						progress={scrollYProgress}
						index={i}
						total={QUOTE.length}
					/>
				))}
			</p>
		</div>
	);
}

const TEAM = [
	{
		name: "Quan",
		fullName: "Do Minh Quan",
		tags: ["Full-Stack", "Engineering"],
		animated: "/team/Quan.png",
		photo: "/team/Quan0.jpeg",
	},
	{
		name: "Shawn",
		fullName: "Shawn Han",
		tags: ["Product", "Research"],
		animated: "/team/Shawn.jpeg",
		photo: "/team/Shawn0.jpeg",
	},
	{
		name: "Minh",
		fullName: "Minh Nguyen",
		tags: ["Frontend", "Engineering"],
		animated: "/team/Minh.jpeg",
		photo: "/team/Minh0.png",
	},
	{
		name: "Chon",
		fullName: "Chon Lam",
		tags: ["Backend", "Engineering"],
		animated: "/team/Chon.jpeg",
		photo: "/team/Chon0.jpeg",
	},
	{
		name: "Jiaxin",
		fullName: "Jiaxin Chen",
		tags: ["Design", "UX"],
		animated: "/team/Jiaxin.png",
		photo: "/team/Jiaxin0.jpeg",
	},
	{
		name: "Chengmin",
		fullName: "Chengmin Chang",
		tags: ["Data", "Analytics"],
		animated: "/team/Chengmin.png",
		photo: "/team/Chengmin0.jpeg",
	},
] as const;

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function AboutView() {
	const [teamHovered, setTeamHovered] = useState(false);
	const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
	const [showReal, setShowReal] = useState(false);
	const introTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

	const handleRowEnter = (index: number) => {
		if (introTimer.current) clearTimeout(introTimer.current);
		setHoveredIndex(index);
		setShowReal(false);
		introTimer.current = setTimeout(() => setShowReal(true), 1400);
	};

	const handleRowLeave = () => {
		if (introTimer.current) clearTimeout(introTimer.current);
		setHoveredIndex(null);
		setShowReal(false);
	};

	return (
		<motion.div
			className="mx-auto min-h-screen w-full max-w-[1600px] bg-minuri-white text-minuri-ink"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.4, ease }}
		>
			{/* Hero + Story — merged so illustration spans both */}
			<section className="relative px-6 pt-32 pb-16 md:px-12 md:pt-40 md:pb-24">
				<div className="pointer-events-none absolute inset-0 opacity-[0.035]">
					<svg
						viewBox="0 0 800 400"
						className="h-full w-full"
						preserveAspectRatio="xMidYMid slice"
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
				<motion.h1
					className="relative z-10 text-[clamp(4rem,14vw,11rem)] font-black uppercase leading-none tracking-tight text-minuri-ocean"
					style={{ fontFamily: "var(--font-sans)" }}
					initial={{ opacity: 0, y: 40 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.7, ease, delay: 0.1 }}
				>
					About Minuri
				</motion.h1>
				<motion.div
					className="relative z-10 mt-16 grid grid-cols-1 gap-6 md:mt-20 md:grid-cols-[140px_1fr] md:gap-10"
					initial={{ opacity: 0, y: 28 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.7, ease, delay: 0.28 }}
				>
					<p className="text-xs font-black uppercase tracking-[0.12em] text-minuri-teal md:pt-3">
						(Our Story)
					</p>
					<div>
						<h2 className="text-[clamp(2rem,5vw,4rem)] font-black leading-[1.05] tracking-tight text-minuri-ocean">
							Settling in shouldn't be a solo project
						</h2>
						<div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-14">
							<p className="text-base leading-loose text-minuri-ink md:text-lg">
								Minuri grew out of the questions we kept asking
								each other after arriving in Melbourne. Where do
								I get a Medicare card? How does Myki work? What
								does a rental bond actually mean? Good answers
								were scattered, buried, or assumed. So we built
								the guide we wished existed.
							</p>
							<div className="space-y-8">
								<p className="text-base leading-loose text-minuri-ink md:text-lg">
									At the heart of our work is a simple belief
									— by mapping the real steps people take,
									from opening a bank account to finding a GP,
									we make the invisible path visible.
								</p>
								<p className="text-base leading-loose text-minuri-ink md:text-lg">
									We care about precision. Not just the right
									suburb or the right form to fill in, but the
									right framing — the kind that makes a task
									feel manageable rather than overwhelming.
								</p>
							</div>
						</div>
					</div>
				</motion.div>
			</section>

			{/* Team photo */}
			<section className="px-6 md:px-12">
				<div
					className="relative cursor-crosshair overflow-hidden"
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

			{/* Team description */}
			<section className="px-6 py-16 md:px-12 md:py-24">
				<div className="grid grid-cols-1 gap-6 md:grid-cols-[140px_1fr] md:gap-10">
					<p className="text-xs font-black uppercase tracking-[0.12em] text-minuri-teal md:pt-3">
						(The Team)
					</p>
					<div>
						<h2 className="text-[clamp(2rem,5vw,4rem)] font-black leading-[1.05] tracking-tight text-minuri-ocean">
							We met at university in Melbourne and built the
							guide we wished we&apos;d had
						</h2>
						<div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-14">
							<p className="text-base leading-relaxed text-minuri-ink md:text-lg md:leading-relaxed">
								Minuri is built by a small team of international
								students who know firsthand what it feels like
								to arrive in a new city and not know where to
								start. We care about people and the process just
								as much as the product — and we truly do mean
								that.
							</p>
							<div className="space-y-5">
								<p className="text-base leading-relaxed text-minuri-ink md:text-lg md:leading-relaxed">
									Every guide we write is shaped by lived
									experience. We ask questions — of the city,
									of each other, and of the people we talk to
									along the way. The answers become the
									content you read here.
								</p>
								<p className="text-base leading-relaxed text-minuri-ink md:text-lg md:leading-relaxed">
									If you&apos;re new to Melbourne, or you know
									someone who is — this is for you.
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Team list */}
			<section className="relative" onMouseLeave={handleRowLeave}>
				<div className="mx-6 border-t border-minuri-ocean/30 md:mx-12" />
				{/* Floating portrait — absolute in center column, overlaps rows */}
				<AnimatePresence mode="wait">
					{hoveredIndex !== null && (
						<motion.div
							key={hoveredIndex}
							className="pointer-events-none absolute z-20 hidden overflow-hidden rounded-xl md:block"
							style={{
								width: 460,
								height: 600,
								left: "42%",
								top: "50%",
								translateX: "-50%",
								translateY: "-50%",
							}}
							initial={{ opacity: 0, scale: 0.94 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.96 }}
							transition={{ duration: 0.18, ease }}
						>
							{/* Tinted bg rect behind photo */}
							<div className="absolute inset-0 bg-minuri-teal/20" />
							{/* Animated base */}
							<Image
								src={TEAM[hoveredIndex].animated}
								alt={TEAM[hoveredIndex].name}
								fill
								className="object-cover object-top"
								sizes="460px"
							/>
							{/* Real photo crossfades in after delay */}
							<motion.div
								className="absolute inset-0"
								initial={{ opacity: 0 }}
								animate={{ opacity: showReal ? 1 : 0 }}
								transition={{
									duration: 0.9,
									ease: [0.25, 0.46, 0.45, 0.94],
								}}
							>
								<Image
									src={TEAM[hoveredIndex].photo}
									alt={TEAM[hoveredIndex].name}
									fill
									className="object-cover object-top"
									sizes="460px"
								/>
							</motion.div>
						</motion.div>
					)}
				</AnimatePresence>

				<ol>
					{TEAM.map((member, index) => {
						const isHovered = hoveredIndex === index;
						return (
							<li
								key={member.name}
								className="group"
								onMouseEnter={() => handleRowEnter(index)}
							>
								<div className="grid grid-cols-[1fr_auto] items-center gap-4 px-6 py-8 md:grid-cols-[22%_44%_1fr] md:gap-0 md:px-12 md:py-10">
									{/* Left: tags */}
									<div className="flex flex-wrap items-center gap-2">
										{member.tags.map((tag, tagIndex) => (
											<div
												key={tag}
												className={`relative inline-flex overflow-hidden border border-minuri-ocean shadow-md transition-colors duration-300 group-hover:border-minuri-teal ${tagIndex === 1 ? "rounded-2xl" : "rounded-sm"}`}
											>
												<span className="relative z-10 px-6 py-2 text-sm font-medium text-minuri-ocean transition-colors duration-300 group-hover:text-minuri-white">
													{tag}
												</span>
												<span className="absolute inset-x-0 -bottom-px top-0 translate-y-[105%] bg-minuri-teal transition-transform duration-[500ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
											</div>
										))}
									</div>

									{/* Center: spacer for the floating photo (desktop) */}
									<div className="hidden md:block" />

									{/* Right: full name */}
									<div className="flex items-center justify-end md:justify-start">
										<span className="text-2xl font-medium leading-none tracking-tight text-minuri-ocean md:text-4xl">
											{member.fullName}
										</span>
									</div>
								</div>
								{/* Indented divider */}
								<div className="mx-6 border-t border-minuri-ocean/30 md:mx-12" />
							</li>
						);
					})}
				</ol>
			</section>

			{/* Scroll highlight quote */}
			<ScrollHighlightQuote />
		</div>
	);
}
