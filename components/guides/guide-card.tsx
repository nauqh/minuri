"use client";

import Image from "next/image";
import Link from "next/link";
import {
	Compass,
	HeartPulse,
	Home,
	Sandwich,
	Users,
	type LucideIcon,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import type { Guide, GuideTopicSlug } from "@/content/guides";
import { getArcMeta, getTopicMeta } from "@/lib/guides";
import { BookmarkButton } from "@/components/guides/bookmark-button";

const TOPIC_ICONS: Record<GuideTopicSlug, LucideIcon> = {
	"food-eating": Sandwich,
	"getting-around": Compass,
	"health-wellbeing": HeartPulse,
	"home-admin": Home,
	"social-belonging": Users,
};

type GuideCardProps = {
	guide: Guide;
	href: string;
	bookmarked: boolean;
	onToggleBookmark: (slug: string) => void;
	animationDelay?: number;
};

export function GuideCard({
	guide,
	href,
	bookmarked,
	onToggleBookmark,
	animationDelay = 0,
}: GuideCardProps) {
	const topicMeta = getTopicMeta(guide.topic);
	const arcMeta = getArcMeta(guide.arc);
	const Icon = TOPIC_ICONS[guide.topic];
	const prefersReducedMotion = useReducedMotion();
	const entranceEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

	return (
		<motion.article
			className="minuri-link-underline-trigger group relative flex h-full cursor-pointer flex-col pt-4"
			initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 18 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, amount: 0.2 }}
			transition={{
				duration: prefersReducedMotion ? 0.01 : 0.5,
				delay: prefersReducedMotion ? 0 : animationDelay,
				ease: entranceEase,
			}}
		>
			<Link
				href={href}
				aria-label={`Read guide: ${guide.title}`}
				className="absolute inset-0 z-10 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-minuri-teal/60"
			/>
			<div className="relative mb-5 h-52 overflow-hidden rounded-sm bg-minuri-fog md:h-56">
				<Image
					src={guide.thumbnailUrl}
					alt={`${guide.title} thumbnail`}
					fill
					sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
					className="object-cover"
				/>
			</div>
			<div className="flex items-start justify-between gap-4">
				<div className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-minuri-mid">
					<Icon className="size-4" aria-hidden="true" />
					<span>{topicMeta?.name ?? guide.topic}</span>
				</div>

				<div className="relative z-20">
					<BookmarkButton
						active={bookmarked}
						onToggle={() => onToggleBookmark(guide.slug)}
					/>
				</div>
			</div>

			<h2 className="w-fit pb-1 font-hero-serif text-xl leading-tight text-minuri-ocean">
				<span className="minuri-link-underline-multiline">{guide.title}</span>
			</h2>

			<div className="mt-3 flex items-center gap-2 text-xs text-minuri-slate">
				<span>{guide.readingTimeMin} min read</span>
				<span aria-hidden="true">·</span>
				<span>{arcMeta?.timeframeLabel ?? guide.arc}</span>
			</div>

			<p className="mt-4 flex-1 text-base leading-7">
				{guide.summary}
			</p>
		</motion.article>
	);
}
