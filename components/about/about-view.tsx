"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Volume2, VolumeX } from "lucide-react";
import { useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";

const QUOTE = "Me and you are incre -dible (Minuri)".split(" ");

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
		<motion.span
			className={`block leading-none ${index % 2 === 0 ? "text-left" : "text-right"}`}
			style={{ opacity }}
		>
			{word}
		</motion.span>
	);
}

function ScrollHighlightQuote() {
	const ref = useRef<HTMLDivElement>(null);
	const [muted, setMuted] = useState(true);
	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ["start 0.9", "end 0.1"],
	});

	return (
		<div
			ref={ref}
			className="relative flex min-h-screen w-full flex-col justify-between px-6 py-16 text-[clamp(4rem,9vw,8rem)] font-black uppercase tracking-tight text-minuri-ocean md:px-12 md:py-20"
		>
			{QUOTE.map((word, i) => (
				<Word
					key={i}
					word={word}
					progress={scrollYProgress}
					index={i}
					total={QUOTE.length}
				/>
			))}

			{/* Video — absolute centered over words */}
			<div className="pointer-events-none absolute inset-0 flex items-center justify-center">
				<div className="pointer-events-auto relative w-[300px] md:w-[360px]">
					<video
						autoPlay
						muted={muted}
						loop
						playsInline
						src="/team/team-intro.mp4"
						className="w-full rounded-2xl object-cover shadow-xl border-2 border-minuri-ocean"
						style={{ aspectRatio: "9/16" }}
					/>
					<button
						type="button"
						onClick={() => setMuted((m) => !m)}
						className="absolute bottom-3 right-3 flex size-8 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70"
						aria-label={muted ? "Unmute" : "Mute"}
					>
						{muted ? (
							<VolumeX className="size-4" />
						) : (
							<Volume2 className="size-4" />
						)}
					</button>
				</div>
			</div>
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
		fullName: "Minh Vu",
		tags: ["Frontend", "Engineering"],
		animated: "/team/Minh.jpeg",
		photo: "/team/Minh0.png",
	},
	{
		name: "Chon",
		fullName: "Chon Ngai Lam",
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

	const handleRowEnter = (index: number) => setHoveredIndex(index);
	const handleRowLeave = () => setHoveredIndex(null);

	return (
		<div className="mx-auto min-h-screen w-full max-w-[1600px] bg-minuri-white text-minuri-ink">
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
					transition={{ duration: 0.7, ease, delay: 1.0 }}
				>
					About Minuri
				</motion.h1>
				<motion.div
					className="relative z-10 mt-16 grid grid-cols-1 gap-6 md:mt-20 md:grid-cols-[140px_1fr] md:gap-10"
					initial={{ opacity: 0, y: 28 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.7, ease, delay: 1.15 }}
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
			<motion.section
				className="px-6 md:px-12"
				initial={{ opacity: 0, y: 24 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true, amount: 0.2 }}
				transition={{ duration: 0.7, ease }}
			>
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
			</motion.section>

			{/* Team description */}
			<motion.section
				className="px-6 py-16 md:px-12 md:py-24"
				initial={{ opacity: 0, y: 24 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true, amount: 0.2 }}
				transition={{ duration: 0.7, ease, delay: 0.05 }}
			>
				<div className="grid grid-cols-1 gap-6 md:grid-cols-[140px_1fr] md:gap-10">
					<p className="text-xs font-black uppercase tracking-[0.12em] text-minuri-teal md:pt-3">
						(The Team)
					</p>
					<div>
						<h2 className="text-[clamp(2rem,5vw,4rem)] font-black leading-[1.05] tracking-tight text-minuri-ocean">
							We arrived in Melbourne and built the guide we
							wished existed
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
			</motion.section>

			{/* Team list */}
			<motion.section
				className="relative"
				onMouseLeave={handleRowLeave}
				onClick={handleRowLeave}
				initial={{ opacity: 0, y: 24 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true, amount: 0.1 }}
				transition={{ duration: 0.7, ease, delay: 0.05 }}
			>
				<div className="mx-6 border-t border-minuri-ocean/30 md:mx-12" />
				{/* Floating portrait — absolute in center column, overlaps rows */}
				<AnimatePresence>
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
								animate={{ opacity: 1 }}
								transition={{
									delay: 0.7,
									duration: 0.8,
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
								{/* ── Mobile layout ── */}
								<div className="flex items-start justify-between gap-4 px-6 py-6 md:hidden">
									<div className="flex-1">
										<span className="mb-4 block text-2xl font-medium leading-none tracking-tight text-minuri-ocean">
											{member.fullName}
										</span>
										<div className="flex flex-col gap-2">
											{member.tags.map(
												(tag, tagIndex) => (
													<div
														key={tag}
														className={`relative inline-flex self-start overflow-hidden border border-minuri-ocean shadow-md transition-colors duration-300 group-hover:border-minuri-teal ${tagIndex === 1 ? "rounded-2xl" : "rounded-sm"}`}
													>
														<span className="relative z-10 px-6 py-2 text-sm font-medium text-minuri-ocean transition-colors duration-300 group-hover:text-minuri-white">
															{tag}
														</span>
														<span className="absolute inset-x-0 -bottom-px top-0 translate-y-[105%] bg-minuri-teal transition-transform duration-[500ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
													</div>
												),
											)}
										</div>
									</div>
									<div
										className="relative h-32 w-32 flex-shrink-0 cursor-pointer overflow-hidden rounded-xl"
										onClick={(e) => {
											e.stopPropagation();
											handleRowEnter(index);
										}}
									>
										<Image
											src={member.animated}
											alt={member.name}
											fill
											className="object-cover object-top"
											sizes="128px"
										/>
										<motion.div
											className="absolute inset-0"
											animate={{
												opacity:
													hoveredIndex === index
														? 1
														: 0,
											}}
											transition={{
												delay:
													hoveredIndex === index
														? 0.7
														: 0,
												duration: 0.8,
												ease: [0.25, 0.46, 0.45, 0.94],
											}}
										>
											<Image
												src={member.photo}
												alt={member.name}
												fill
												className="object-cover object-top"
												sizes="128px"
											/>
										</motion.div>
									</div>
								</div>

								{/* ── Desktop layout ── */}
								<div className="hidden md:grid md:grid-cols-[22%_44%_1fr] md:items-center md:px-12 md:py-10">
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
									<div />
									<div className="flex items-center justify-start">
										<span className="text-4xl font-medium leading-none tracking-tight text-minuri-ocean">
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
			</motion.section>

			{/* Scroll highlight quote */}
			<ScrollHighlightQuote />

			{/* CTA footer */}
			<motion.section
				className="flex min-h-screen flex-col items-center justify-center px-6 py-24 text-center md:px-12 md:py-36"
				initial={{ opacity: 0, y: 24 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true, amount: 0.3 }}
				transition={{ duration: 0.7, ease }}
			>
				<h2 className="mx-auto max-w-full text-[clamp(2.5rem,6vw,5rem)] font-black uppercase leading-[1.05] tracking-tight text-minuri-teal">
					Ready to feel at home?
				</h2>
				<p className="mx-auto mt-6 max-w-full text-base leading-relaxed text-minuri-ink md:text-lg">
					Everything you need to settle into Melbourne — in one place.
				</p>
				<div className="group relative mt-10 inline-flex overflow-hidden rounded-sm">
					<Link
						href="/start"
						className="relative z-10 inline-flex h-14 items-center gap-2 rounded-sm border border-minuri-ocean px-10 text-base font-medium text-minuri-ocean shadow-md transition-colors duration-300 group-hover:text-minuri-white md:text-lg"
					>
						Let&apos;s get started with Minuri
						<ChevronRight
							className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-1"
							aria-hidden
						/>
					</Link>
					<span className="absolute inset-0 translate-y-full bg-minuri-ocean transition-transform duration-[500ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
				</div>
			</motion.section>
		</div>
	);
}
