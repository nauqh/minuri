"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export interface TypewriterProps {
    phrases: string[];
    charDelay?: number;
    phraseDelay?: number;
    startDelay?: number;
    endDelay?: number;
    onComplete?: () => void;
    cursor?: boolean;
    cursorChar?: string;
    className?: string;
    paragraphClassName?: string;
    trailing?: React.ReactNode;
}

export function Typewriter({
    phrases,
    charDelay = 50,
    phraseDelay = 3000,
    startDelay = 500,
    endDelay,
    onComplete,
    cursor = true,
    cursorChar = "|",
    className,
    paragraphClassName,
    trailing,
}: TypewriterProps) {
    const [completedPhrases, setCompletedPhrases] = useState<string[]>([]);
    const [currentPhraseDisplay, setCurrentPhraseDisplay] = useState("");
    const [phraseIndex, setPhraseIndex] = useState(0);
    const [started, setStarted] = useState(false);
    const [done, setDone] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const endDelayTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const completedRef = useRef(false);

    const charDelayRef = useRef(charDelay);
    const phraseDelayRef = useRef(phraseDelay ?? charDelay);
    const endDelayRef = useRef(endDelay ?? startDelay);
    const onCompleteRef = useRef(onComplete);
    const phrasesRef = useRef(phrases);
    charDelayRef.current = charDelay;
    phraseDelayRef.current = phraseDelay ?? charDelay;
    endDelayRef.current = endDelay ?? startDelay;
    onCompleteRef.current = onComplete;
    phrasesRef.current = phrases;

    useEffect(() => {
        if (phrases.length === 0) {
            setStarted(true);
            return;
        }
        const startTimer = setTimeout(() => setStarted(true), startDelay);
        return () => clearTimeout(startTimer);
    }, [phrases.length, startDelay]);

    useEffect(() => {
        if (!started || phrases.length === 0) return;

        setCompletedPhrases([]);
        setCurrentPhraseDisplay("");
        setPhraseIndex(0);
        setDone(false);
        completedRef.current = false;

        const phrasesList = phrasesRef.current;
        let phraseIdx = 0;
        let charIdx = 0;

        const scheduleNext = () => {
            const phrase = phrasesList[phraseIdx];
            if (!phrase) {
                setDone(true);
                if (!completedRef.current && onCompleteRef.current) {
                    completedRef.current = true;
                    endDelayTimeoutRef.current = setTimeout(() => {
                        onCompleteRef.current?.();
                    }, endDelayRef.current);
                }
                return;
            }

            if (charIdx >= phrase.length) {
                setCompletedPhrases((prev) => [...prev, phrase]);
                setCurrentPhraseDisplay("");
                phraseIdx += 1;
                charIdx = 0;
                setPhraseIndex(phraseIdx);

                if (phraseIdx >= phrasesList.length) {
                    setDone(true);
                    if (!completedRef.current && onCompleteRef.current) {
                        completedRef.current = true;
                        endDelayTimeoutRef.current = setTimeout(() => {
                            onCompleteRef.current?.();
                        }, endDelayRef.current);
                    }
                    return;
                }
                timeoutRef.current = setTimeout(scheduleNext, phraseDelayRef.current);
                return;
            }

            charIdx += 1;
            setCurrentPhraseDisplay(phrase.slice(0, charIdx));

            if (charIdx >= phrase.length) {
                setCompletedPhrases((prev) => [...prev, phrase]);
                setCurrentPhraseDisplay("");
                phraseIdx += 1;
                charIdx = 0;
                setPhraseIndex(phraseIdx);

                if (phraseIdx >= phrasesList.length) {
                    setDone(true);
                    if (!completedRef.current && onCompleteRef.current) {
                        completedRef.current = true;
                        endDelayTimeoutRef.current = setTimeout(() => {
                            onCompleteRef.current?.();
                        }, endDelayRef.current);
                    }
                    return;
                }
                timeoutRef.current = setTimeout(scheduleNext, phraseDelayRef.current);
                return;
            }

            timeoutRef.current = setTimeout(scheduleNext, charDelayRef.current);
        };

        timeoutRef.current = setTimeout(scheduleNext, charDelayRef.current);

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
            if (endDelayTimeoutRef.current) {
                clearTimeout(endDelayTimeoutRef.current);
                endDelayTimeoutRef.current = null;
            }
        };
    }, [started, phrases.length]);

    const isCurrentPhraseActive = phraseIndex < phrases.length && !done;
    const cursorOnLastCompleted =
        isCurrentPhraseActive &&
        currentPhraseDisplay === "" &&
        completedPhrases.length > 0;

    return (
        <div className={cn("flex flex-col gap-2 text-left", className)}>
            {completedPhrases.map((phrase, i) => (
                <p key={i} className={paragraphClassName}>
                    {phrase}
                    {cursor &&
                        cursorOnLastCompleted &&
                        i === completedPhrases.length - 1 && (
                            <span
                                className="animate-typewriter-cursor inline-block align-baseline"
                                aria-hidden
                            >
                                {cursorChar}
                            </span>
                        )}
                    {trailing &&
                        isCurrentPhraseActive &&
                        currentPhraseDisplay === "" &&
                        i === completedPhrases.length - 1 && <>{trailing}</>}
                </p>
            ))}
            {isCurrentPhraseActive &&
                (currentPhraseDisplay !== "" || completedPhrases.length === 0) && (
                    <p className={paragraphClassName}>
                        <span className="inline">
                            {currentPhraseDisplay}
                            {cursor && (
                                <span
                                    className="animate-typewriter-cursor inline-block align-baseline"
                                    aria-hidden
                                >
                                    {cursorChar}
                                </span>
                            )}
                            {trailing && <>{trailing}</>}
                        </span>
                    </p>
                )}
        </div>
    );
}

export default Typewriter;
