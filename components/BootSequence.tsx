"use client";

import { useState, useEffect } from "react";

const BOOT_LINES = [
  { text: "> initializing grove protocol...", delay: 0 },
  { text: "> loading root system...", delay: 200 },
  { text: "> parsing html canopy... ", suffix: "ok", delay: 400 },
  { text: "> compiling css bark... ", suffix: "ok", delay: 600 },
  { text: "> resolving branches... ", suffix: "ok", delay: 800 },
  { text: "> mounting /dev/forest... ", suffix: "ok", delay: 1000 },
  { text: "> seed checksum verified", delay: 1200 },
  { text: "> establishing connection...", delay: 1400 },
  { text: "> ", suffix: "ready.", delay: 1800 },
];

const FADE_OUT_DELAY = 2100;
const FADE_OUT_DURATION = 300;

interface BootSequenceProps {
  onComplete: () => void;
}

export function BootSequence({ onComplete }: BootSequenceProps) {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    const alreadyBooted = sessionStorage.getItem("booted");
    if (alreadyBooted) {
      onComplete();
      return;
    }

    const timeouts: NodeJS.Timeout[] = [];

    BOOT_LINES.forEach((line, index) => {
      const t = setTimeout(() => {
        setVisibleLines(index + 1);
      }, line.delay);
      timeouts.push(t);
    });

    const fadeTimeout = setTimeout(() => {
      setFadingOut(true);
    }, FADE_OUT_DELAY);
    timeouts.push(fadeTimeout);

    const completeTimeout = setTimeout(() => {
      sessionStorage.setItem("booted", "1");
      onComplete();
    }, FADE_OUT_DELAY + FADE_OUT_DURATION);
    timeouts.push(completeTimeout);

    return () => timeouts.forEach(clearTimeout);
  }, [onComplete]);

  const alreadyBooted =
    typeof window !== "undefined" && sessionStorage.getItem("booted");
  if (alreadyBooted) return null;

  return (
    <div
      className="fixed inset-0 z-40 flex flex-col justify-center px-8 bg-[#0a0a0a]"
      style={{
        animation: fadingOut
          ? `fadeOut ${FADE_OUT_DURATION}ms ease-out forwards`
          : undefined,
      }}
    >
      <div className="max-w-[720px] mx-auto w-full">
        {BOOT_LINES.slice(0, visibleLines).map((line, index) => (
          <div
            key={index}
            className="text-[#1a8a1a]"
            style={{ animation: "fadeIn 150ms ease-out" }}
          >
            {line.text}
            {line.suffix && (
              <span className="text-[#33ff33]">{line.suffix}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
