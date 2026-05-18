"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Typewriter } from "@/components/ui/typewriter";
import { cn } from "@/lib/utils";

type Props = {
    suburb: string;
    body: string;
    signOff: string;
    onComplete?: () => void;
    skipStream?: boolean;
    paragraphClassName?: string;
    className?: string;
};

export function MelbourneLetter({
    suburb,
    body,
    signOff,
    onComplete,
    skipStream = false,
    paragraphClassName = "text-sm leading-relaxed text-minuri-ocean",
    className,
}: Props) {
    const [done, setDone] = useState(skipStream);

    const phrases = body
        .split(/\n\n|\n/)
        .map((p) => p.trim())
        .filter(Boolean);

    function handleComplete() {
        setDone(true);
        onComplete?.();
    }

    return (
        <motion.div
            className={`rounded-2xl border bg-white/90 backdrop-blur-sm px-6 py-6 shadow-lg w-full${className ? ` ${className}` : ""}`}
            style={{
                borderColor: "rgba(74,144,217,0.2)",
                fontFamily: "var(--font-handwriting, Georgia, serif)",
            }}
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
            <p className={cn(paragraphClassName, "mb-2")}>
                Dear friend,
            </p>

            {skipStream ? (
                <div
                    className="flex flex-col gap-2 min-h-[80px]"
                    aria-label="Letter from Melbourne"
                >
                    {phrases.map((p, i) => (
                        <p key={i} className={paragraphClassName}>
                            {p}
                        </p>
                    ))}
                </div>
            ) : (
                <Typewriter
                    phrases={phrases}
                    charDelay={28}
                    phraseDelay={180}
                    startDelay={300}
                    endDelay={400}
                    onComplete={handleComplete}
                    cursor
                    cursorChar="|"
                    className="min-h-[80px]"
                    paragraphClassName={paragraphClassName}
                />
            )}

            {done && (
                <motion.p
                    className={cn(paragraphClassName, "mt-4 text-right")}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    {signOff}
                </motion.p>
            )}
        </motion.div>
    );
}
