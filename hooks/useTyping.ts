"use client";

import { useState, useEffect, useRef } from "react";

interface UseTypingOptions {
  text: string;
  speed?: number;
  startDelay?: number;
  enabled?: boolean;
}

interface UseTypingResult {
  displayedText: string;
  isComplete: boolean;
}

export function useTyping({
  text,
  speed = 40,
  startDelay = 0,
  enabled = true,
}: UseTypingOptions): UseTypingResult {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    if (!enabled) return;

    setDisplayedText("");
    setIsComplete(false);
    indexRef.current = 0;

    const delayTimeout = setTimeout(() => {
      const interval = setInterval(() => {
        indexRef.current += 1;
        if (indexRef.current >= text.length) {
          setDisplayedText(text);
          setIsComplete(true);
          clearInterval(interval);
        } else {
          setDisplayedText(text.slice(0, indexRef.current));
        }
      }, speed);

      return () => clearInterval(interval);
    }, startDelay);

    return () => clearTimeout(delayTimeout);
  }, [text, speed, startDelay, enabled]);

  return { displayedText, isComplete };
}
