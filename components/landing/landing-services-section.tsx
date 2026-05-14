"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function LandingServicesSection() {
	return (
		<section
			id="services"
			className="scroll-mt-24 bg-minuri-white px-4 py-6 md:px-8 md:py-10 md:scroll-mt-28"
			aria-labelledby="services-heading"
		>
			{/* Card */}
			<div className="relative flex min-h-[75vh] items-center overflow-hidden rounded-3xl">
				{/* Video background */}
				<video
					autoPlay
					muted
					loop
					playsInline
					className="absolute inset-0 h-full w-full object-cover"
				>
					<source src="/hero.mp4" type="video/mp4" />
				</video>

				{/* Dark overlay */}
				<div className="absolute inset-0 bg-black/35" />

				{/* Content */}
				<div className="relative z-10 mx-auto w-full max-w-7xl px-8 py-32 text-center md:px-16 md:py-40">
					<h2
						id="services-heading"
						className="text-[clamp(3rem,8vw,7rem)] font-black leading-[1.05] tracking-wide text-white"
					>
						Settle. Learn.
						<br />
						Belong.
					</h2>

					<p className="mx-auto mt-6 max-w-3xl text-xl leading-relaxed text-minuri-white font-semibold">
						Minuri is the first friend you make in a new city — the
						one who knows where to go, what to bring, and what it
						actually costs.
					</p>

					<div className="group relative mt-10 inline-flex overflow-hidden rounded-sm">
						<Link
							href="/start"
							className="relative z-10 inline-flex h-14 items-center gap-3 rounded-sm border border-white/70 px-10 text-base font-semibold text-white shadow-md transition-colors duration-300 group-hover:text-black md:h-16 md:px-12 md:text-lg"
						>
							Start your journey
							<ChevronRight
								className="size-5 transition-transform duration-200 ease-out group-hover:translate-x-1"
								aria-hidden
							/>
						</Link>
						<span className="absolute inset-0 translate-y-full bg-white transition-transform duration-[500ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
					</div>
				</div>
			</div>
		</section>
	);
}
