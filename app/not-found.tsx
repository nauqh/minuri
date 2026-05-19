import Link from "next/link";

function UFO() {
	return (
		<svg viewBox="0 0 220 130" width="280" height="165" aria-hidden className="shrink-0">
			<ellipse cx="110" cy="88" rx="100" ry="30" fill="currentColor" />
			<ellipse cx="110" cy="72" rx="52" ry="42" fill="currentColor" />
			<ellipse cx="110" cy="68" rx="48" ry="37" fill="none" stroke="white" strokeWidth="1.5" />
		</svg>
	);
}

function Creature() {
	return (
		<svg viewBox="0 0 80 90" width="72" height="82" aria-hidden className="shrink-0">
			<path
				d="M40 4 L44 18 L56 9 L51 23 L66 22 L55 34 L68 44 L53 43 L55 58 L42 50 L44 66 L40 56 L36 66 L38 50 L25 58 L27 43 L12 44 L25 34 L14 22 L29 23 L24 9 L36 18 Z"
				fill="currentColor"
			/>
			<circle cx="34" cy="36" r="3" fill="white" />
			<circle cx="46" cy="36" r="3" fill="white" />
			<line x1="30" y1="65" x2="25" y2="78" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
			<line x1="40" y1="67" x2="40" y2="81" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
			<line x1="50" y1="65" x2="55" y2="78" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
		</svg>
	);
}

function CurvedArrow() {
	return (
		<svg viewBox="0 0 90 65" width="75" height="55" aria-hidden>
			<path
				d="M 15 12 Q 72 8 72 52"
				stroke="currentColor"
				strokeWidth="2"
				fill="none"
				strokeLinecap="round"
			/>
			<path
				d="M 63 48 L 72 52 L 75 42"
				stroke="currentColor"
				strokeWidth="2"
				fill="none"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

export default function NotFound() {
	return (
		<div className="fixed inset-0 z-50 flex flex-col overflow-auto bg-white text-minuri-ocean">
			{/* Notebook grid background */}
			<div aria-hidden className="pointer-events-none absolute inset-0">
				<div
					className="absolute inset-0"
					style={{
						backgroundImage: [
							"linear-gradient(to right, rgba(2,24,25,0.07) 1px, transparent 1px)",
							"linear-gradient(to bottom, rgba(2,24,25,0.07) 1px, transparent 1px)",
						].join(", "),
						backgroundSize: "96px 96px",
					}}
				/>
				<div
					className="absolute inset-0"
					style={{
						background:
							"radial-gradient(ellipse 80% 75% at 50% 50%, transparent 30%, rgba(255,255,255,0.55) 60%, white 82%)",
					}}
				/>
			</div>

			<header className="relative flex items-center justify-between px-10 py-6">
				<span className="text-sm tracking-wide">Minuri.</span>
				<span className="rounded-full border border-minuri-ocean px-5 py-1.5 text-sm">
					Melbourne guide
				</span>
			</header>

			<main className="relative flex flex-1 items-center px-10 py-8">
				<div className="grid w-full grid-cols-2 gap-y-16">
					{/* top-left: description */}
					<div className="flex items-start">
						<p className="max-w-[300px] font-mono text-sm leading-relaxed opacity-75">
							Looks like you&apos;ve wandered off the map. Even the best settlers
							take a wrong turn. Head back and keep going.
						</p>
					</div>

					{/* top-right: UFO */}
					<div className="flex items-start justify-end">
						<UFO />
					</div>

					{/* bottom-left: go home */}
					<div className="flex flex-col items-start">
						<CurvedArrow />
						<Link href="/">
							<span
								className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_3px] bg-left-bottom bg-no-repeat text-[5.5rem] font-semibold italic leading-none transition-[background-size] duration-500 ease-out hover:bg-[length:100%_3px] md:text-[7rem]"
								style={{ fontFamily: "var(--font-hero-serif)" }}
							>
								go home
							</span>
						</Link>
					</div>

					{/* bottom-right: 404 */}
					<div className="flex items-center justify-end">
						<span className="text-[6.5rem] font-bold leading-none md:text-[8rem]">4</span>
						<Creature />
						<span className="text-[6.5rem] font-bold leading-none md:text-[8rem]">4</span>
					</div>
				</div>
			</main>
		</div>
	);
}
