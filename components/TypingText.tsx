"use client";

import { useEffect } from "react";
import { useTyping } from "@/hooks/useTyping";
import { Cursor } from "./Cursor";

interface TypingTextProps {
  text: string;
  speed?: number;
  startDelay?: number;
  enabled?: boolean;
  showCursor?: boolean;
  onComplete?: () => void;
}

export function TypingText({
  text,
  speed = 40,
  startDelay = 0,
  enabled = true,
  showCursor = true,
  onComplete,
}: TypingTextProps) {
  const { displayedText, isComplete } = useTyping({
    text,
    speed,
    startDelay,
    enabled,
  });

  useEffect(() => {
    if (isComplete && onComplete) {
      onComplete();
    }
  }, [isComplete, onComplete]);

  return (
    <span>
      {displayedText}
      {showCursor && <Cursor />}
    </span>
  );
}
