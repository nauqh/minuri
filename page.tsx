import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Search, Menu } from "lucide-react";
import { SiInstagram, SiTiktok } from "react-icons/si";
import { HowItWorks } from "@/components/landing/how-it-works";
import { HomeNavAccountLinks } from "@/components/landing/home-nav-account";

function NavLink({
	href,
	children,
}: {
	href: string;
	children: React.ReactNode;
}) {
	return (
		<Link
			href={href}
			className="text-sm text-white underline-offset-4 transition-all duration-200 hover:underline hover:decoration-white hover:text-white hover:[text-shadow:0_0_0.5px_currentColor] group-hover:text-foreground/70 group-hover:hover:text-foreground group-hover:hover:underline group-hover:hover:decoration-foreground group-hover:hover:[text-shadow:0_0_0.5px_currentColor]"
		>
			{children}
		</Link>
	);
}

export default function Home() {
	return (
		<div className="min-h-screen bg-background text-foreground">
			{/* Nav + Hero */}
			<div className="relative min-h-screen overflow-hidden">
				{/* Hero background video */}
				<video
					autoPlay
					muted
					loop
					playsInline
					className="absolute inset-0 h-full w-full object-cover"
					aria-hidden
				>
					<source src="/hero.mp4" type="video/mp4" />
				</video>
				<div className="absolute inset-0 bg-linear-to-b from-black/30 via-black/10 to-black/50" />

				{/* Nav — two-tier like Aesop */}
				<header className="group relative z-50 pt-2 transition-colors duration-300 hover:bg-secondary md:pt-3">
					{/* Top row: utility left, logo centre, account right */}
					<div className="hidden h-14 grid-cols-[1fr_auto_1fr] items-center px-8 md:grid lg:px-12">
						<div className="flex items-center gap-6">
							<Image
								src="/logo.png"
								alt="GlowSafe"
								width={40}
								height={40}
							/>
						</div>
						<Link
							href="/"
							className="text-3xl font-medium tracking-tight text-white transition-colors duration-300 group-hover:text-foreground"
						>
							GlowSafe
						</Link>
						<HomeNavAccountLinks />
					</div>

					{/* Bottom row: nav links centred, search pinned right */}
					<div className="hidden items-center justify-between px-12 md:flex">
						<nav className="flex items-center gap-10">
							<NavLink href="/skin-builder">Skin Builder</NavLink>
							<NavLink href="/weather">Weather & UV</NavLink>
							<NavLink href="/sun-news">Sun news</NavLink>
							<NavLink href="#how-it-works">About us</NavLink>
						</nav>
						<button
							type="button"
							className="flex w-50 items-center gap-2.5 border border-white px-6 py-2.5 text-sm text-white transition-colors duration-300 group-hover:border-0 group-hover:border-l group-hover:border-foreground/20 group-hover:text-foreground"
						>
							<Search className="size-4 shrink-0" />
							<span>Search...</span>
						</button>
					</div>

					{/* Mobile: single row — logo + icons */}
					<div className="flex h-14 items-center justify-between px-5 md:hidden">
						<Link
							href="/"
							className="text-xl font-medium tracking-tight text-white transition-colors group-hover:text-foreground"
						>
							GlowSafe
						</Link>
						<div className="flex items-center gap-1">
							<button
								type="button"
								className="flex size-10 items-center justify-center rounded-lg text-white/80 transition-colors hover:bg-white/10 hover:text-white"
								aria-label="Search"
							>
								<Search className="size-5" />
							</button>
							<button
								type="button"
								className="flex size-10 items-center justify-center rounded-lg text-white/80 transition-colors hover:bg-white/10 hover:text-white"
								aria-label="Menu"
							>
								<Menu className="size-5" />
							</button>
						</div>
					</div>
				</header>

				{/* Hero */}
				<section className="relative z-10 flex min-h-[calc(100vh-5.75rem)] flex-col justify-end px-5 pb-16 pt-16 md:min-h-[calc(100vh-5.75rem)] md:items-center md:justify-center md:px-6 md:pb-0 md:pt-24">
					<div className="w-full max-w-5xl text-left md:text-center">
						<p className="text-xs font-bold tracking-[0.2em] text-white sm:text-xs">
							Sun smart that fits the way you live
						</p>
						<h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl md:mt-5 md:text-6xl">
							Glow smart.{" "}
							<span className="text-yellow">Stay safe.</span>
						</h1>
						<p className="mt-4 text-base leading-relaxed text-white/85 sm:text-base md:mx-auto md:mt-5 md:text-lg">
							Real-time UV for your area, tips for your skin type,
							zero lectures. Just what you need to enjoy the sun.
						</p>
						<div className="mt-7 flex w-full flex-col gap-3 sm:mt-9 md:flex-row md:justify-center md:gap-4">
							<Link
								href="/build"
								className="group flex min-h-14 flex-1 items-center justify-center gap-3 border border-white py-4 text-base font-semibold tracking-wide text-white transition-all duration-300 hover:border-secondary hover:bg-secondary hover:text-foreground md:min-h-0 md:w-auto md:flex-initial md:py-3.5 md:px-8 md:text-sm"
							>
								Build your profile
								<ArrowRight className="size-5 transition-transform group-hover:translate-x-1 md:size-4" />
							</Link>
							<Link
								href="/weather"
								className="group flex min-h-14 flex-1 items-center justify-center gap-3 border border-white/70 bg-white/10 py-4 text-base font-semibold tracking-wide text-white backdrop-blur-sm transition-all duration-300 hover:border-secondary hover:bg-white hover:text-foreground md:min-h-0 md:w-auto md:flex-initial md:py-3.5 md:px-8 md:text-sm"
							>
								Check today&apos;s UV
								<ArrowRight className="size-5 transition-transform group-hover:translate-x-1 md:size-4" />
							</Link>
						</div>
					</div>
				</section>
			</div>

			<main>
				{/* How it works */}
				<section
					id="how-it-works"
					className="px-5 py-16 md:px-12 md:py-32 lg:px-20"
				>
					<div className="mx-auto max-w-7xl">
						<p className="text-xs font-medium tracking-[0.2em] text-muted-foreground">
							(How it works)
						</p>
						<h2 className="mt-4 text-2xl font-medium tracking-tight sm:text-3xl md:text-4xl">
							Set up in minutes,
							<br className="hidden sm:inline" /> sorted for
							summer
						</h2>
						<div className="mt-10 md:mt-16">
							<HowItWorks />
						</div>
					</div>
				</section>

				{/* Why GlowSafe */}
				<section
					id="why"
					className="px-5 py-16 md:px-12 md:py-32 lg:px-20"
				>
					<div className="mx-auto grid max-w-7xl items-start gap-10 md:grid-cols-2 md:gap-24">
						<div>
							<p className="text-xs font-medium tracking-[0.2em] text-muted-foreground">
								(Why GlowSafe)
							</p>
							<h2 className="mt-4 text-2xl font-medium tracking-tight sm:text-3xl md:text-4xl">
								Because &ldquo;slip slop slap&rdquo;
								doesn&apos;t cut it anymore
							</h2>
							<p className="mt-5 text-sm leading-relaxed text-muted-foreground md:mt-6 md:text-base">
								Australia has one of the highest skin cancer
								rates on the planet — but the advice out there
								wasn&apos;t built for how young people actually
								spend their days. GlowSafe gives you
								personalised, no-nonsense UV guidance that fits
								your routine.
							</p>
						</div>
						<div className="grid grid-cols-2 gap-3 md:gap-4">
							<StatCard
								value="2 in 3"
								label="Aussies will get skin cancer by 70"
							/>
							<StatCard
								value="UV 6+"
								label="Common on overcast Melbourne days — bet you didn't know"
							/>
							<StatCard
								value="80%"
								label="Of your lifetime sun damage happens before 21"
							/>
							<StatCard
								value="5 min"
								label="To set up your profile and get sorted"
							/>
						</div>
					</div>
				</section>

				{/* CTA */}
				<section
					id="early-access"
					className="px-5 py-16 md:px-12 md:py-32 lg:px-20"
				>
					<div className="mx-auto text-center">
						<p className="text-xs font-medium tracking-[0.2em] text-muted-foreground">
							(Get in early)
						</p>
						<h2 className="mt-4 text-2xl font-medium tracking-tight sm:text-3xl md:text-4xl">
							We&apos;re launching soon — want in?
						</h2>
						<p className="mt-5 text-sm leading-relaxed text-muted-foreground md:mt-6 md:text-base">
							Drop your email and we&apos;ll send you your first
							personalised sun brief the moment we go live. No
							spam, just UV.
						</p>
						<Link
							href="#"
							className="group mt-7 flex w-full items-center justify-center gap-3 border border-foreground/20 py-3.5 text-sm tracking-wide text-foreground transition-all duration-300 hover:border-foreground hover:bg-foreground hover:text-background sm:mt-9 md:inline-flex md:w-auto md:px-20"
						>
							Notify me
							<ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
						</Link>
					</div>
				</section>
			</main>

			{/* Footer */}
			<footer
				id="contact-us"
				className="border-t border-border bg-[#F5F3ED]"
			>
				<div className="mx-auto px-5 pb-6 pt-8 md:px-12 md:pt-10">
					{/* Top: Home + headline */}
					<div className="pb-6 md:pb-8">
						<Link
							href="#"
							className="text-sm tracking-wide text-muted-foreground transition-colors hover:text-foreground"
						>
							Home
						</Link>
						<h2 className="mt-3 text-2xl font-medium tracking-tight text-foreground md:mt-4 md:text-3xl lg:text-[2rem] lg:leading-tight">
							Don&apos;t miss a thing
							<br />
							with GlowSafe
						</h2>
					</div>

					{/* Four columns: long first, then 3 grouped */}
					<div className="grid gap-10 pt-10 text-sm tracking-wide md:grid-cols-[1fr_1fr] md:gap-16 md:pt-12">
						{/* Column 1: Newsletter + contact (long) */}
						<div className="min-w-0">
							<p className="font-bold text-foreground">
								Sun briefs direct to your inbox
							</p>
							<div className="mt-4 flex min-w-0 items-center gap-2 border-b border-foreground/30 pb-1">
								<input
									type="email"
									placeholder="Enter your email"
									className="min-w-0 flex-1 bg-transparent text-base tracking-wide text-foreground placeholder:text-muted-foreground focus:outline-none"
								/>
								<button
									type="button"
									className="shrink-0 text-foreground transition-colors hover:text-accent"
									aria-label="Submit"
								>
									<ArrowRight className="size-4" />
								</button>
							</div>
							<p className="mt-8 font-bold text-foreground">
								Get in touch
							</p>
							<a
								href="mailto:hello@glowsafe.com"
								className="mt-3 block text-muted-foreground transition-colors hover:text-foreground"
							>
								hello@glowsafe.com
							</a>
						</div>

						{/* Columns 2–4: grouped, similar width */}
						<div className="grid grid-cols-3 gap-8 md:gap-10">
							<div>
								<p className="font-bold text-foreground">
									Find us
								</p>
								<p className="mt-4 normal-case leading-relaxed text-muted-foreground">
									Victoria, Australia
								</p>
							</div>
							<div>
								<p className="font-bold text-foreground">
									GlowSafe
								</p>
								<div className="mt-4 flex flex-col gap-2 text-muted-foreground">
									<Link
										href="/profile"
										className="transition-colors hover:text-foreground"
									>
										Profile
									</Link>
									<Link
										href="/skin-builder"
										className="transition-colors hover:text-foreground"
									>
										Skin Builder
									</Link>
									<Link
										href="/weather"
										className="transition-colors hover:text-foreground"
									>
										Weather & UV
									</Link>
									<Link
										href="#how-it-works"
										className="transition-colors hover:text-foreground"
									>
										About
									</Link>
									<Link
										href="#why"
										className="transition-colors hover:text-foreground"
									>
										Why
									</Link>
									<Link
										href="#early-access"
										className="transition-colors hover:text-foreground"
									>
										Access
									</Link>
									<Link
										href="#early-access"
										className="transition-colors hover:text-foreground"
									>
										Contact
									</Link>
								</div>
							</div>
							<div>
								<p className="font-bold text-foreground">
									Follow us
								</p>
								<div className="mt-4 flex gap-3">
									<Link
										href="#"
										className="flex size-10 items-center justify-center rounded-full border border-foreground/20 text-foreground/70 transition-colors hover:border-foreground/40 hover:text-foreground"
										aria-label="Instagram"
									>
										<SiInstagram className="size-5" />
									</Link>
									<Link
										href="#"
										className="flex size-10 items-center justify-center rounded-full border border-foreground/20 text-foreground/70 transition-colors hover:border-foreground/40 hover:text-foreground"
										aria-label="TikTok"
									>
										<SiTiktok className="size-5" />
									</Link>
								</div>
							</div>
						</div>
					</div>

					{/* Bottom bar */}
					<div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center md:mt-12">
						<span>©{new Date().getFullYear()} GlowSafe</span>
						<div className="flex items-center gap-6 tracking-wide">
							<Link
								href="#"
								className="transition-colors hover:text-foreground"
							>
								Privacy policy
							</Link>
							<Link
								href="#"
								className="transition-colors hover:text-foreground"
							>
								Terms & conditions
							</Link>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
}

function StatCard({ value, label }: { value: string; label: string }) {
	return (
		<div className="rounded-xl border border-border bg-background p-4 md:p-6">
			<p className="text-lg font-bold text-accent md:text-3xl">{value}</p>
			<p className="mt-1.5 text-xs leading-snug text-muted-foreground md:mt-2 md:text-sm">
				{label}
			</p>
		</div>
	);
}
