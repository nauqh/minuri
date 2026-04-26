import Link from "next/link";

export default function NotFound() {
	return (
		<main className="flex min-h-full flex-1 flex-col items-center justify-center bg-minuri-fog px-6 py-20 text-center md:py-28">
			<span className="sr-only">404 — Page not found</span>
			<p
				className="text-[clamp(4.5rem,18vw,10rem)] font-medium leading-none tracking-tight text-minuri-slate/25"
				aria-hidden
			>
				404
			</p>
			<h1 className="mt-2 max-w-xl font-sans text-3xl font-semibold tracking-tight text-minuri-mid md:max-w-2xl md:text-5xl md:leading-[1.1]">
				This page isn&apos;t on your map
			</h1>
			<p className="mt-6 max-w-lg text-base leading-relaxed text-minuri-slate md:mt-8 md:max-w-xl md:text-xl">
				Even steady routines take a wrong turn sometimes. Head back to a
				familiar place and we&apos;ll pick up from there.
			</p>
			<Link
				href="/"
				className="mt-10 inline-flex items-center justify-center rounded-full bg-minuri-teal px-8 py-3.5 text-base font-semibold text-primary-foreground transition-transform duration-200 ease-out hover:scale-105 md:mt-12 md:px-10 md:py-4 md:text-lg"
			>
				Back home
			</Link>
		</main>
	);
}
