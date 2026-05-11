"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ChevronRight, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import Lenis from "lenis";
import { useLenis } from "lenis/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { PERSONAS, type Persona } from "@/content/personas";
import { getGuidesFromSlugs } from "@/lib/guides";
import { GuideCard } from "@/components/guides/guide-card";
import { GuidesShell } from "@/components/guides/guides-shell";
import { GuidesTabNav } from "@/components/guides/guides-tab-nav";
import { useGuideBookmarks } from "@/hooks/use-guide-bookmarks";

const DOT_PATTERN = `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='1.5' fill='white' fill-opacity='0.18'/%3E%3C/svg%3E")`;

function PersonaPickerCard({
    persona,
    onSelect,
    animationDelay,
}: {
    persona: Persona;
    onSelect: (p: Persona) => void;
    animationDelay: number;
}) {
    const prefersReducedMotion = useReducedMotion();

    return (
        <motion.button
            type="button"
            onClick={() => onSelect(persona)}
            className="group relative overflow-hidden rounded-2xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-minuri-teal/50"
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.12 }}
            transition={{
                duration: prefersReducedMotion ? 0.01 : 0.5,
                delay: prefersReducedMotion ? 0 : animationDelay,
                ease: [0.22, 1, 0.36, 1],
            }}
            whileHover={{ scale: prefersReducedMotion ? 1 : 1.015 }}
        >
            <Image
                src={persona.imageUrl}
                alt={persona.name}
                fill
                sizes="(max-width: 640px) 50vw, 33vw"
                className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/15" />

            <div className="relative flex aspect-[3/4] flex-col justify-between p-5 sm:p-6">
                {/* Top — role + age */}
                <div className="flex items-start justify-between gap-2">
                    <span className="rounded-full border border-white/25 bg-white/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-sm">
                        {persona.role}
                    </span>
                    <span className="text-[10px] text-white/50">
                        {persona.age} · {persona.origin}
                    </span>
                </div>

{/* Bottom — name + tagline */}
                <div className="relative">
                    <h3
                        className="text-xl font-bold text-white sm:text-2xl"
                        style={{ fontFamily: "var(--font-hero-serif)" }}
                    >
                        {persona.name}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-xs italic leading-snug text-white/70 sm:text-sm">
                        &ldquo;{persona.tagline}&rdquo;
                    </p>
                </div>
            </div>
        </motion.button>
    );
}

function PersonaDetailFullscreen({
    persona,
    onBack,
}: {
    persona: Persona;
    onBack: () => void;
}) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const prefersReducedMotion = useReducedMotion();
    const { isBookmarked, toggleBookmark } = useGuideBookmarks();
    const rootLenis = useLenis();
    const { scrollYProgress } = useScroll({ container: scrollRef });

    const validDays = persona.journey
        .map((slugs, i) => ({ dayIndex: i, guides: getGuidesFromSlugs(slugs) }))
        .filter((d) => d.guides.length > 0);

    // 1 description panel + one panel per day
    const numPanels = 1 + validDays.length;
    const trackHeight = `${numPanels * 100}vh`;
    const slideWidth = `${numPanels * 100}vw`;
    const maxTranslate = `${(numPanels - 1) * 100}vw`;

    const x = useTransform(
        scrollYProgress,
        [0, 1],
        prefersReducedMotion ? ["0vw", "0vw"] : ["0vw", `-${maxTranslate}`],
    );

    const scrollHintOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);

    useEffect(() => {
        function onKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape") onBack();
        }
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [onBack]);

    useEffect(() => {
        const prev = document.documentElement.style.overflow;
        document.documentElement.style.overflow = "hidden";
        rootLenis?.stop();

        const wrapper = scrollRef.current;
        const content = contentRef.current;
        if (!wrapper || !content || prefersReducedMotion) {
            return () => {
                document.documentElement.style.overflow = prev;
                rootLenis?.start();
            };
        }

        const lenis = new Lenis({
            wrapper,
            content,
            lerp: 0.068,
            smoothWheel: true,
        });

        const onPointerDown = (e: PointerEvent) => {
            const target = e.target as Element;
            if (target.closest("button, a, [role='button'], [role='link']")) {
                lenis.stop();
                requestAnimationFrame(() => lenis.start());
            }
        };
        wrapper.addEventListener("pointerdown", onPointerDown);

        let rafId: number;
        const raf = (time: number) => {
            lenis.raf(time);
            rafId = requestAnimationFrame(raf);
        };
        rafId = requestAnimationFrame(raf);

        return () => {
            wrapper.removeEventListener("pointerdown", onPointerDown);
            cancelAnimationFrame(rafId);
            lenis.destroy();
            document.documentElement.style.overflow = prev;
            rootLenis?.start();
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [prefersReducedMotion]);

    return (
        <motion.div
            className="fixed inset-0 z-50 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0.01 : 0.3 }}
        >
            {/* Sticky close button */}
            <button
                type="button"
                onClick={onBack}
                className="absolute right-6 top-6 z-10 flex size-9 items-center justify-center rounded-full border border-gray-300/60 bg-white/70 text-gray-700 backdrop-blur-sm transition-transform hover:scale-105"
                aria-label="Close"
            >
                <X className="size-4" aria-hidden />
            </button>

            {/* Scroll container — ref here, scrollbar fully hidden */}
            <div
                ref={scrollRef}
                className="h-full w-full overflow-x-hidden overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
            {/* Tall scroll track — height = numPanels × 100vh */}
            <div ref={contentRef} style={{ height: trackHeight }}>
                {/* Sticky viewport */}
                <div className="sticky top-0 h-screen overflow-hidden">
                    <motion.div
                        className="flex h-full"
                        style={{ x, width: slideWidth }}
                    >
                        {/* ── Panel 0: Persona description ── */}
                        <div
                            className="relative flex h-screen w-screen shrink-0"
                            style={{ backgroundColor: "#f0ede8" }}
                        >
                            {/* Far left — huge vertical name */}
                            <div className="flex w-24 shrink-0 items-center justify-center px-2 ml-6 mr-4 md:w-32 md:px-3 md:ml-10 md:mr-6">
                                <span
                                    className="select-none font-black leading-none text-gray-900"
                                    style={{
                                        fontFamily: "var(--font-hero-serif)",
                                        fontSize: "clamp(5rem, 12vw, 10rem)",
                                        writingMode: "vertical-rl",
                                        transform: "rotate(180deg)",
                                        letterSpacing: "-0.05em",
                                    }}
                                    aria-hidden
                                >
                                    {persona.name}
                                </span>
                            </div>

                            {/* Center — persona photo */}
                            <div className="relative w-[42%] shrink-0 overflow-hidden">
                                <Image
                                    src={persona.imageUrl}
                                    alt={persona.name}
                                    fill
                                    sizes="42vw"
                                    priority
                                    className="object-cover"
                                />
                            </div>

                            {/* Right — role / hint / quote */}
                            <div
                                className="flex flex-1 flex-col justify-between px-8 py-10 lg:px-10 lg:py-12"
                                style={{ backgroundColor: "#f0ede8" }}
                            >
                                <div className="flex items-start">
                                    <p
                                        className="text-[11px] font-bold uppercase tracking-[0.18em]"
                                        style={{ color: persona.accentColor }}
                                    >
                                        {persona.role}
                                    </p>
                                </div>

                                <motion.p
                                    style={{ opacity: scrollHintOpacity }}
                                    className="text-[9px] font-semibold uppercase tracking-[0.2em] text-gray-400"
                                >
                                    Scroll for more
                                </motion.p>

                                <div>
                                    <p
                                        className="text-lg font-medium leading-relaxed text-gray-800 md:text-xl lg:text-2xl"
                                        style={{ fontFamily: "var(--font-hero-serif)" }}
                                    >
                                        &ldquo;{persona.tagline}&rdquo;
                                    </p>
                                    <p className="mt-4 text-sm leading-6 text-gray-500">
                                        {persona.situation}
                                    </p>
                                    <p className="mt-3 text-xs text-gray-400">
                                        {persona.name}, {persona.age} · {persona.origin}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* ── Panels 1–N: One full-screen panel per day ── */}
                        {validDays.map(({ dayIndex, guides }, panelIndex) => (
                            <div
                                key={dayIndex}
                                className="relative flex h-screen w-screen shrink-0 flex-col justify-between px-12 py-12 lg:px-20 lg:py-14"
                                style={{ backgroundColor: "#f0ede8" }}
                            >
                                {/* Top — persona mini + day label */}
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p
                                            className="text-[10px] font-bold uppercase tracking-[0.2em]"
                                            style={{ color: persona.accentColor }}
                                        >
                                            {persona.name} · Day {dayIndex + 1}
                                        </p>
                                        <h2
                                            className="mt-1 text-3xl font-black text-gray-900 md:text-4xl lg:text-5xl"
                                            style={{
                                                fontFamily: "var(--font-hero-serif)",
                                                letterSpacing: "-0.03em",
                                            }}
                                        >
                                            {dayIndex === 0
                                                ? "First day"
                                                : dayIndex === 6
                                                  ? "End of week"
                                                  : `Day ${dayIndex + 1}`}
                                        </h2>
                                    </div>
                                    <span className="text-xs text-gray-400">
                                        {panelIndex + 1} / {validDays.length}
                                    </span>
                                </div>

                                {/* Middle — guide cards */}
                                <div className="flex gap-6">
                                    {guides.map((guide, index) => (
                                        <div key={guide.slug} className="w-72 shrink-0">
                                            <GuideCard
                                                guide={guide}
                                                href={`/guides/${guide.slug}`}
                                                bookmarked={isBookmarked(guide.slug)}
                                                onToggleBookmark={toggleBookmark}
                                                animationDelay={index * 0.06}
                                            />
                                        </div>
                                    ))}
                                </div>

                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
            </div>
        </motion.div>
    );
}

export function PersonaJourneyView() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
    const prefersReducedMotion = useReducedMotion();

    useEffect(() => {
        const personaId = searchParams.get("persona");
        if (personaId && selectedPersona === null) {
            const match = PERSONAS.find((p) => p.id === personaId);
            if (match) setSelectedPersona(match);
        }
    }, [searchParams, selectedPersona]);

    function handleBack() {
        setSelectedPersona(null);
        const nextParams = new URLSearchParams(searchParams.toString());
        nextParams.delete("persona");
        const nextHref = nextParams.size > 0 ? `${pathname}?${nextParams}` : pathname;
        router.replace(nextHref);
    }

    const headerStart = (
        <Link
            href="/"
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-minuri-silver/80 bg-minuri-white px-3.5 py-1.5 text-xs font-medium text-minuri-slate transition-transform duration-200 ease-out hover:scale-105"
        >
            <ArrowLeft className="size-3.5" aria-hidden />
            Back to home
        </Link>
    );

    return (
        <>
            <GuidesShell
                title="Choose your journey"
                description="Pick the situation closest to yours. We'll open a curated week of guides."
                headerStart={headerStart}
            >
                <GuidesTabNav />

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: prefersReducedMotion ? 0.01 : 0.2 }}
                >
                    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
                        {PERSONAS.map((persona, index) => (
                            <PersonaPickerCard
                                key={persona.id}
                                persona={persona}
                                onSelect={setSelectedPersona}
                                animationDelay={(index % 3) * 0.08}
                            />
                        ))}
                    </div>
                </motion.div>
            </GuidesShell>

            {/* Full-screen overlay — renders above everything */}
            <AnimatePresence>
                {selectedPersona && (
                    <PersonaDetailFullscreen
                        key={selectedPersona.id}
                        persona={selectedPersona}
                        onBack={handleBack}
                    />
                )}
            </AnimatePresence>
        </>
    );
}
