"use client";

import { useState } from "react";
import { TypingText } from "./TypingText";
import { TerminalNav } from "./TerminalNav";

interface PageShellProps {
  title: string;
  children: React.ReactNode;
}

export function PageShell({ title, children }: PageShellProps) {
  const [titleDone, setTitleDone] = useState(false);

  return (
    <main className="min-h-screen px-8 py-12">
      <div className="max-w-[720px] mx-auto w-full">
        <TerminalNav className="mb-12" />

        <div className="mb-8">
          $ <TypingText
            text={title}
            onComplete={() => setTitleDone(true)}
          />
        </div>

        {titleDone && (
          <div style={{ animation: "fadeIn 400ms ease-out" }}>
            {children}
          </div>
        )}
      </div>
    </main>
  );
}
