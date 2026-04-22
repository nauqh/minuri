"use client";

import { useRef } from "react";
import {
	motion,
	useScroll,
	useTransform,
	type MotionValue,
} from "motion/react";

type TopicCard = {
	title: string;
	description: string;
	bgClass: string;
	borderClass: string;
};

const TOPIC_CARDS: TopicCard[] = [
	{
		title: "Food & Eating",
		description: "Groceries, cheap meals, and everyday food decisions.",
		bgClass: "bg-[#00f5d4]",
		borderClass: "border-[#00f5d4]",
	},
	{
		title: "Getting Around",
		description:
			"Transport options, routes, and daily movement in Melbourne.",
		bgClass: "bg-[#7fdcff]",
		borderClass: "border-[#7fdcff]",
	},
	{
		title: "Health & Wellbeing",
		description:
			"GPs, pharmacies, Medicare pathways, and mental health support.",
		bgClass: "bg-[#fff14a]",
		borderClass: "border-[#fff14a]",
	},
	{
		title: "Home & Admin",
		description:
			"Renting, utilities, paperwork, and practical setup tasks.",
		bgClass: "bg-[#ff7ecb]",
		borderClass: "border-[#ff7ecb]",
	},
	{
		title: "Social & Belonging",
		description:
			"Friendships, community, loneliness, and finding your people.",
		bgClass: "bg-minuri-mist",
		borderClass: "border-minuri-mist",
	},
];

const X_OFFSETS = [-350, -175, 0, 175, 350];
const Y_OFFSETS = [-80, -102, -118, -102, -80];
const ROTATIONS = [-11, -6, -1, 4, 9];

function ScrollyTopicCard({
	card,
	index,
	progress,
}: {
	card: TopicCard;
	index: number;
	progress: MotionValue<number>;
}) {
	const revealStart = 0.15 + index * 0.145;
	const revealEnd = revealStart + 0.085;
	const finalX = X_OFFSETS[index];
	const finalY = Y_OFFSETS[index];
	const entryX = finalX * 0.18;
	const entryY = 430;

	const opacity = useTransform(
		progress,
		[0, revealStart, revealEnd, 1],
		[0, 0, 1, 1],
	);
	const y = useTransform(
		progress,
		[0, revealStart, revealEnd, 1],
		[entryY, entryY, finalY, finalY],
	);
	const x = useTransform(
		progress,
		[0, revealStart, revealEnd, 1],
		[entryX, entryX, finalX, finalX],
	);
	const rotate = useTransform(
		progress,
		[0, revealStart, revealEnd, 1],
		[0, 0, ROTATIONS[index], ROTATIONS[index]],
	);
	const scale = useTransform(
		progress,
		[0, revealStart, revealEnd, 1],
		[0.9, 0.9, 1, 1],
	);

	return (
		<motion.article
			className={`absolute left-1/2 top-1/2 hidden h-74 w-[14.8rem] -translate-x-1/2 -translate-y-1/2 flex-col justify-between rounded-[1.15rem] border p-5 shadow-[0_20px_38px_-22px_rgba(2,24,25,0.42)] md:flex md:h-84 md:w-[16.8rem] md:p-6 ${card.bgClass} ${card.borderClass}`}
			style={{ opacity, y, x, rotate, scale, zIndex: index + 10 }}
		>
			<h3 className="text-[1.9rem] font-black uppercase leading-[0.9] tracking-tight text-[#05292a] md:text-[2.1rem]">
				{card.title}
			</h3>
			<p className="max-w-[17ch] text-[0.97rem] leading-relaxed text-[#163a3a] md:text-[1.03rem]">
				{card.description}
			</p>
		</motion.article>
	);
}

export function LandingCareSection() {
	const sectionRef = useRef<HTMLElement | null>(null);
	const { scrollYProgress } = useScroll({
		target: sectionRef,
		offset: ["start start", "end end"],
	});
	// Finish card animation early, then hold final state for extra scroll.
	const cardsProgress = useTransform(
		scrollYProgress,
		[0, 0.78, 1],
		[0, 1, 1],
	);

	return (
		<section
			ref={sectionRef}
			id="care"
			className="relative bg-minuri-white py-16 text-minuri-ink md:min-h-[620vh] md:py-0"
		>
			<div className="md:sticky md:top-0 md:flex md:h-screen md:items-start md:pt-[12vh]">
				<div className="mx-auto w-full max-w-6xl px-5 md:px-8">
					<div className="text-center">
						<p className="landing-section-kicker">
							Our core support areas
						</p>
						<h2 className="landing-section-heading">
							How we help
						</h2>
						<p className="landing-section-subheading">
							Our core support areas
						</p>
					</div>

					<div className="mx-auto mt-12 w-full max-w-sm space-y-4 md:hidden">
						{TOPIC_CARDS.map((card, index) => (
							<motion.article
								key={card.title}
								className={`relative flex min-h-60 flex-col justify-between rounded-[1.15rem] border p-5 shadow-[0_20px_38px_-22px_rgba(2,24,25,0.42)] ${card.bgClass} ${card.borderClass}`}
								initial={{ opacity: 0, y: 44, scale: 0.96 }}
								whileInView={{ opacity: 1, y: 0, scale: 1 }}
								viewport={{ amount: 0.58 }}
								transition={{
									duration: 0.55,
									ease: [0.22, 1, 0.36, 1],
									delay: index * 0.03,
								}}
							>
								<h3 className="text-[1.9rem] font-black uppercase leading-[0.9] tracking-tight text-[#05292a]">
									{card.title}
								</h3>
								<p className="max-w-[17ch] text-[0.97rem] leading-relaxed text-[#163a3a]">
									{card.description}
								</p>
							</motion.article>
						))}
					</div>

					<div className="relative mx-auto mt-14 hidden h-100 w-full max-w-6xl overflow-visible md:mt-16 md:block md:h-120">
						{TOPIC_CARDS.map((card, index) => (
							<ScrollyTopicCard
								key={card.title}
								card={card}
								index={index}
								progress={cardsProgress}
							/>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
