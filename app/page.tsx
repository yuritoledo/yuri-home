"use client";

import { useState, useCallback, useEffect } from "react";
import { BootSequence } from "@/components/BootSequence";
import { AsciiName } from "@/components/AsciiName";
import { TypingText } from "@/components/TypingText";
import { TypingCycle } from "@/components/TypingCycle";
import { TerminalNav } from "@/components/TerminalNav";

function getDaysSince(dateString: string): string {
  const start = new Date(dateString);
  const now = new Date();
  const diff = Math.floor(
    (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  );
  return diff.toLocaleString();
}

export default function Home() {
  const [booted, setBooted] = useState(false);
  const [line1Done, setLine1Done] = useState(false);
  const [line2Done, setLine2Done] = useState(false);
  const [showNav, setShowNav] = useState(false);
  const days = getDaysSince("2015-11-01");

  const handleBootComplete = useCallback(() => setBooted(true), []);

  useEffect(() => {
    if (line2Done) {
      const t = setTimeout(() => setShowNav(true), 200);
      return () => clearTimeout(t);
    }
  }, [line2Done]);

  return (
    <>
      {!booted && <BootSequence onComplete={handleBootComplete} />}
      {booted && (
        <main className="min-h-screen flex flex-col justify-center px-8 md:px-16 lg:px-24">
          <div className="max-w-[720px] w-full">
            <div style={{ animation: "fadeIn 400ms ease-out" }}>
              <AsciiName />
            </div>

            <div className="mt-6 space-y-1">
              <div>
                ${" "}
                <TypingCycle
                  phrases={[
                    "button crafter",
                    "css enemy",
                    "div wrangler",
                    "console.log debugger",
                    'the "just add a button" go-to person',
                  ]}
                  finalPhrase="senior frontend engineer :)"
                  showCursor={!line1Done}
                  onComplete={() => setLine1Done(true)}
                />
              </div>
              {line1Done && (
                <div>
                  ${" "}
                  <TypingText
                    text={`crafting interfaces for ${days} days and counting...`}
                    showCursor={true}
                    onComplete={() => setLine2Done(true)}
                  />
                </div>
              )}
            </div>

            {showNav && (
              <div
                className="mt-8"
                style={{ animation: "fadeIn 400ms ease-out" }}
              >
                <TerminalNav />
              </div>
            )}
          </div>
        </main>
      )}
    </>
  );
}
