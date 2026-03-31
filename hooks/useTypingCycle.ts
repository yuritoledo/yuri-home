"use client";

import { useState, useEffect, useRef, useMemo } from "react";

interface UseTypingCycleOptions {
  phrases: string[];
  finalPhrase: string;
  typeSpeed?: number;
  eraseSpeed?: number;
  pauseDuration?: number;
}

interface UseTypingCycleResult {
  displayedText: string;
  isComplete: boolean;
}

function pickRandom<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

type Phase = "typing" | "pausing" | "erasing";

export function useTypingCycle({
  phrases,
  finalPhrase,
  typeSpeed = 40,
  eraseSpeed = 25,
  pauseDuration = 800,
}: UseTypingCycleOptions): UseTypingCycleResult {
  const allPhrases = useMemo(
    () => [pickRandom(phrases), finalPhrase],
    [phrases, finalPhrase]
  );

  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  const phraseIndexRef = useRef(0);
  const charIndexRef = useRef(0);
  const phaseRef = useRef<Phase>("typing");

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    function tick() {
      const currentPhraseIndex = phraseIndexRef.current;
      const currentPhrase = allPhrases[currentPhraseIndex];
      const isLastPhrase = currentPhraseIndex === allPhrases.length - 1;
      const phase = phaseRef.current;

      if (phase === "typing") {
        charIndexRef.current += 1;
        const newText = currentPhrase.slice(0, charIndexRef.current);
        setDisplayedText(newText);

        if (charIndexRef.current >= currentPhrase.length) {
          if (isLastPhrase) {
            setIsComplete(true);
            return;
          }
          phaseRef.current = "pausing";
          timeout = setTimeout(tick, pauseDuration);
        } else {
          timeout = setTimeout(tick, typeSpeed);
        }
      } else if (phase === "pausing") {
        phaseRef.current = "erasing";
        timeout = setTimeout(tick, eraseSpeed);
      } else if (phase === "erasing") {
        charIndexRef.current -= 1;
        const newText = currentPhrase.slice(0, charIndexRef.current);
        setDisplayedText(newText);

        if (charIndexRef.current <= 0) {
          phraseIndexRef.current += 1;
          phaseRef.current = "typing";
          charIndexRef.current = 0;
          timeout = setTimeout(tick, typeSpeed);
        } else {
          timeout = setTimeout(tick, eraseSpeed);
        }
      }
    }

    timeout = setTimeout(tick, typeSpeed);

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [allPhrases, typeSpeed, eraseSpeed, pauseDuration]);

  return { displayedText, isComplete };
}
