"use client";

import { useEffect } from "react";
import { useTypingCycle } from "@/hooks/useTypingCycle";
import { Cursor } from "./Cursor";

interface TypingCycleProps {
  phrases: string[];
  finalPhrase: string;
  showCursor?: boolean;
  onComplete?: () => void;
}

export function TypingCycle({
  phrases,
  finalPhrase,
  showCursor = true,
  onComplete,
}: TypingCycleProps) {
  const { displayedText, isComplete } = useTypingCycle({
    phrases,
    finalPhrase,
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
