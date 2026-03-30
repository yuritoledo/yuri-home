# yuritoledo.dev Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a minimalist terminal-aesthetic personal portfolio for yuritoledo.dev with a subtle druidic/roguelike tone.

**Architecture:** Next.js 15 App Router with TypeScript. All animations are custom (React hooks + CSS transitions, no libraries). Pages: Home (boot + hero), About, Projects, Blog, Contact. Shared terminal nav on all pages.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS v4, JetBrains Mono, custom animation hooks

---

## File Map

```
app/
  layout.tsx              — root layout: font loading, global styles, scanline overlay, metadata
  page.tsx                — homepage: boot sequence + hero (client component)
  about/page.tsx          — about page
  projects/page.tsx       — projects listing
  blog/page.tsx           — blog listing
  contact/page.tsx        — contact links
  globals.css             — Tailwind directives, CSS custom properties, cursor/scanline animations
components/
  BootSequence.tsx        — full-screen boot overlay, staggered lines, sessionStorage gate
  TerminalNav.tsx         — horizontal nav with > prefix, active state, glow hover
  TypingText.tsx          — renders text char-by-char using useTyping, shows cursor
  Cursor.tsx              — blinking █ block cursor
  AsciiName.tsx           — pre-built ASCII art "YURI TOLEDO"
  ScanlineOverlay.tsx     — fixed full-screen CRT scanline effect
  ProjectCard.tsx         — box-drawn project card with tech tags
  PageShell.tsx           — shared inner page layout: typed title + fade-in content
hooks/
  useTyping.ts            — typing animation hook
```

---

### Task 1: Project Scaffolding

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `app/globals.css`, `app/layout.tsx`, `app/page.tsx`

- [ ] **Step 1: Initialize Next.js project**

```bash
cd /Users/yuritoledo/code/yuri-home
npx create-next-app@latest . --typescript --tailwind --eslint --app --src=false --import-alias="@/*" --use-npm
```

Select defaults when prompted. This creates the full Next.js 15 scaffolding with Tailwind v4.

- [ ] **Step 2: Verify it runs**

```bash
cd /Users/yuritoledo/code/yuri-home
npm run dev
```

Expected: Dev server starts on localhost:3000, default Next.js page renders.

- [ ] **Step 3: Clean up boilerplate**

Remove all default content from `app/page.tsx` — replace with a minimal placeholder:

```tsx
export default function Home() {
  return <div>yuri-home</div>;
}
```

Remove all default styles from `app/globals.css` except the Tailwind import at the top.

- [ ] **Step 4: Commit**

```bash
git init
git add .
git commit -m "chore: scaffold Next.js 15 project with Tailwind"
```

---

### Task 2: Global Styles, Font, and Color Tokens

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Set up JetBrains Mono in layout**

Replace `app/layout.tsx` with:

```tsx
import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Yuri Toledo",
  description: "Frontend developer based in Brazil",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={jetbrainsMono.variable}>
      <body className="bg-[#0a0a0a] text-[#33ff33] font-mono antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Set up globals.css with color tokens and base styles**

Replace `app/globals.css` with:

```css
@import "tailwindcss";

@theme {
  --font-mono: var(--font-mono);
  --color-terminal-bg: #0a0a0a;
  --color-terminal-primary: #33ff33;
  --color-terminal-dim: #1a8a1a;
  --color-terminal-accent: #66ff66;
  --color-terminal-border: #1a3a1a;
  --color-terminal-error: #ff4444;
}

body {
  font-family: var(--font-mono), monospace;
  font-size: 15px;
  line-height: 1.6;
}

::selection {
  background-color: #33ff33;
  color: #0a0a0a;
}
```

- [ ] **Step 3: Verify in browser**

```bash
npm run dev
```

Expected: Page shows "yuri-home" in green JetBrains Mono on black background. Text selection is green-on-black inverted.

- [ ] **Step 4: Commit**

```bash
git add app/globals.css app/layout.tsx
git commit -m "feat: add JetBrains Mono font and terminal color tokens"
```

---

### Task 3: Cursor Component

**Files:**
- Create: `components/Cursor.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Add cursor blink keyframe to globals.css**

Append to `app/globals.css`:

```css
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
```

- [ ] **Step 2: Create Cursor component**

Create `components/Cursor.tsx`:

```tsx
export function Cursor() {
  return (
    <span
      className="inline-block"
      style={{ animation: "blink 1s step-end infinite" }}
    >
      █
    </span>
  );
}
```

- [ ] **Step 3: Smoke test in page.tsx**

Temporarily update `app/page.tsx`:

```tsx
import { Cursor } from "@/components/Cursor";

export default function Home() {
  return (
    <div className="p-8">
      $ hello world <Cursor />
    </div>
  );
}
```

Expected: Green text with blinking block cursor in the browser.

- [ ] **Step 4: Commit**

```bash
git add components/Cursor.tsx app/globals.css app/page.tsx
git commit -m "feat: add blinking block cursor component"
```

---

### Task 4: useTyping Hook and TypingText Component

**Files:**
- Create: `hooks/useTyping.ts`
- Create: `components/TypingText.tsx`

- [ ] **Step 1: Create useTyping hook**

Create `hooks/useTyping.ts`:

```ts
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
```

- [ ] **Step 2: Create TypingText component**

Create `components/TypingText.tsx`:

```tsx
"use client";

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

  if (isComplete && onComplete) {
    onComplete();
  }

  return (
    <span>
      {displayedText}
      {showCursor && !isComplete && <Cursor />}
      {showCursor && isComplete && <Cursor />}
    </span>
  );
}
```

Note: cursor stays visible after completion — it's always blinking at the end. The `onComplete` callback lets parent components sequence animations.

- [ ] **Step 3: Smoke test**

Update `app/page.tsx`:

```tsx
"use client";

import { TypingText } from "@/components/TypingText";

export default function Home() {
  return (
    <div className="p-8">
      <div>
        $ <TypingText text="hello world" />
      </div>
    </div>
  );
}
```

Expected: "$ " appears immediately, "hello world" types out character by character, blinking cursor at the end.

- [ ] **Step 4: Commit**

```bash
git add hooks/useTyping.ts components/TypingText.tsx app/page.tsx
git commit -m "feat: add useTyping hook and TypingText component"
```

---

### Task 5: ScanlineOverlay Component

**Files:**
- Create: `components/ScanlineOverlay.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Create ScanlineOverlay component**

Create `components/ScanlineOverlay.tsx`:

```tsx
export function ScanlineOverlay() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-50"
      style={{
        background:
          "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.03) 2px, rgba(0, 0, 0, 0.03) 4px)",
      }}
    />
  );
}
```

- [ ] **Step 2: Add to root layout**

In `app/layout.tsx`, import and add `ScanlineOverlay` inside `<body>`:

```tsx
import { ScanlineOverlay } from "@/components/ScanlineOverlay";
```

Add as last child inside `<body>`:

```tsx
<body className="bg-[#0a0a0a] text-[#33ff33] font-mono antialiased min-h-screen">
  {children}
  <ScanlineOverlay />
</body>
```

- [ ] **Step 3: Verify in browser**

Expected: Very subtle horizontal lines overlaying the entire page. Should be barely noticeable — felt, not seen. Content underneath remains fully clickable.

- [ ] **Step 4: Commit**

```bash
git add components/ScanlineOverlay.tsx app/layout.tsx
git commit -m "feat: add CRT scanline overlay"
```

---

### Task 6: BootSequence Component

**Files:**
- Create: `components/BootSequence.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Add boot animation keyframes to globals.css**

Append to `app/globals.css`:

```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}
```

- [ ] **Step 2: Create BootSequence component**

Create `components/BootSequence.tsx`:

```tsx
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
```

- [ ] **Step 3: Smoke test**

Update `app/page.tsx` temporarily:

```tsx
"use client";

import { useState } from "react";
import { BootSequence } from "@/components/BootSequence";

export default function Home() {
  const [booted, setBooted] = useState(false);

  return (
    <>
      {!booted && <BootSequence onComplete={() => setBooted(true)} />}
      {booted && <div className="p-8">$ boot complete</div>}
    </>
  );
}
```

Expected: Boot lines stagger in over ~2s, "ok"/"ready." in bright green, overlay fades out, reveals content. Refresh page — boot is skipped (sessionStorage). Clear sessionStorage to see it again.

- [ ] **Step 4: Commit**

```bash
git add components/BootSequence.tsx app/globals.css app/page.tsx
git commit -m "feat: add boot sequence overlay with session gate"
```

---

### Task 7: AsciiName Component

**Files:**
- Create: `components/AsciiName.tsx`

- [ ] **Step 1: Create AsciiName component**

Create `components/AsciiName.tsx`:

```tsx
export function AsciiName() {
  const ascii = `
__   ___   _ ____  ___   _____ ___  _     _____ ____   ___
\\ \\ / / | | |  _ \\|_ _| |_   _/ _ \\| |   | ____|  _ \\ / _ \\
 \\ V /| | | | |_) || |    | || | | | |   |  _| | | | | | | |
  | | | |_| |  _ < | |    | || |_| | |___| |___| |_| | |_| |
  |_|  \\___/|_| \\_\\___|   |_| \\___/|_____|_____|____/ \\___/
`.trimStart();

  return (
    <pre className="text-[#33ff33] text-xs sm:text-sm leading-none select-none">
      {ascii}
    </pre>
  );
}
```

- [ ] **Step 2: Verify rendering**

Temporarily render in `app/page.tsx` to confirm it looks correct at different screen sizes. The ASCII art should be legible on mobile (text-xs) and comfortable on desktop (text-sm).

- [ ] **Step 3: Commit**

```bash
git add components/AsciiName.tsx
git commit -m "feat: add ASCII art name component"
```

---

### Task 8: TerminalNav Component

**Files:**
- Create: `components/TerminalNav.tsx`

- [ ] **Step 1: Create TerminalNav component**

Create `components/TerminalNav.tsx`:

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "about", href: "/about" },
  { label: "projects", href: "/projects" },
  { label: "blog", href: "/blog" },
  { label: "contact", href: "/contact" },
];

interface TerminalNavProps {
  className?: string;
}

export function TerminalNav({ className = "" }: TerminalNavProps) {
  const pathname = usePathname();

  return (
    <nav className={`flex gap-6 flex-wrap ${className}`}>
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`transition-all duration-200 ${
              isActive
                ? "text-[#33ff33]"
                : "text-[#1a8a1a] hover:text-[#66ff66] hover:[text-shadow:0_0_8px_#33ff33]"
            }`}
          >
            &gt; {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/TerminalNav.tsx
git commit -m "feat: add terminal navigation component"
```

---

### Task 9: Homepage — Full Assembly

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Build the full homepage**

Replace `app/page.tsx` with:

```tsx
"use client";

import { useState, useCallback, useEffect } from "react";
import { BootSequence } from "@/components/BootSequence";
import { AsciiName } from "@/components/AsciiName";
import { TypingText } from "@/components/TypingText";
import { Cursor } from "@/components/Cursor";
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
  const days = getDaysSince("2016-01-01");

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
        <main className="min-h-screen flex flex-col justify-center px-8">
          <div className="max-w-[720px] mx-auto w-full">
            <div
              style={{ animation: "fadeIn 400ms ease-out" }}
            >
              <AsciiName />
            </div>

            <div className="mt-6 space-y-1">
              <div>
                $ <TypingText
                  text="frontend developer"
                  showCursor={!line1Done}
                  onComplete={() => setLine1Done(true)}
                />
              </div>
              {line1Done && (
                <div>
                  ${" "}
                  <TypingText
                    text={`crafting interfaces for ${days} days`}
                    showCursor={true}
                    onComplete={() => setLine2Done(true)}
                  />
                  {line2Done && <Cursor />}
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
```

- [ ] **Step 2: Fix TypingText double cursor**

The `TypingText` component always shows a cursor. For line 1, we want the cursor to disappear when done (so line 2's cursor takes over). Update the `showCursor` logic:

In `components/TypingText.tsx`, change the render to:

```tsx
return (
  <span>
    {displayedText}
    {showCursor && <Cursor />}
  </span>
);
```

This way `showCursor` prop fully controls cursor visibility.

- [ ] **Step 3: Fix onComplete side effect**

The `onComplete` call inside render is a side effect. Move it to a `useEffect` in `components/TypingText.tsx`:

```tsx
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
```

- [ ] **Step 4: Verify full homepage flow in browser**

Expected flow:
1. Boot sequence plays (or skips if already seen)
2. ASCII "YURI TOLEDO" fades in
3. "$ frontend developer" types out with cursor
4. Cursor moves to line 2: "$ crafting interfaces for 3,746 days" types out
5. Blinking cursor stays at end
6. Nav links fade in below

- [ ] **Step 5: Commit**

```bash
git add app/page.tsx components/TypingText.tsx
git commit -m "feat: assemble full homepage with boot, hero, and nav"
```

---

### Task 10: PageShell Component (Shared Inner Page Layout)

**Files:**
- Create: `components/PageShell.tsx`

- [ ] **Step 1: Create PageShell component**

Create `components/PageShell.tsx`:

```tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add components/PageShell.tsx
git commit -m "feat: add shared PageShell for inner pages"
```

---

### Task 11: About Page

**Files:**
- Create: `app/about/page.tsx`

- [ ] **Step 1: Create About page**

Create `app/about/page.tsx`:

```tsx
import { PageShell } from "@/components/PageShell";

export default function AboutPage() {
  return (
    <PageShell title="about">
      <div className="space-y-4 text-[#33ff33]">
        <p>Frontend developer based in Brazil.</p>
        <p>Building for the web since 2016.</p>
        <p>I work with React, TypeScript, and Next.js.</p>
      </div>
    </PageShell>
  );
}
```

- [ ] **Step 2: Verify in browser**

Navigate to `/about`. Expected: nav at top with "about" highlighted, title types out as `$ about`, content fades in after.

- [ ] **Step 3: Commit**

```bash
git add app/about/page.tsx
git commit -m "feat: add about page"
```

---

### Task 12: ProjectCard Component and Projects Page

**Files:**
- Create: `components/ProjectCard.tsx`
- Create: `app/projects/page.tsx`

- [ ] **Step 1: Create ProjectCard component**

Create `components/ProjectCard.tsx`:

```tsx
interface ProjectCardProps {
  name: string;
  description: string;
  tags: string[];
  href?: string;
}

export function ProjectCard({ name, description, tags, href }: ProjectCardProps) {
  return (
    <div className="font-mono">
      <div className="text-[#1a3a1a]">
        ┌─ <span className="text-[#33ff33]">{name}</span>{" "}
        {"─".repeat(Math.max(0, 40 - name.length))}┐
      </div>
      <div className="text-[#1a3a1a]">
        │<span className="text-[#33ff33]">{"  "}{description}</span>
      </div>
      <div className="text-[#1a3a1a]">
        │{"  "}
        <span className="text-[#1a8a1a]">{tags.join(" · ")}</span>
      </div>
      {href && (
        <div className="text-[#1a3a1a]">
          │{"  "}
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#33ff33] hover:text-[#66ff66] hover:[text-shadow:0_0_8px_#33ff33] transition-all duration-200"
          >
            {href}
          </a>
        </div>
      )}
      <div className="text-[#1a3a1a]">
        └{"─".repeat(43)}┘
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create Projects page**

Create `app/projects/page.tsx`:

```tsx
"use client";

import { PageShell } from "@/components/PageShell";
import { ProjectCard } from "@/components/ProjectCard";

const PROJECTS = [
  {
    name: "project-one",
    description: "Description of the first project.",
    tags: ["react", "typescript", "next.js"],
    href: "https://github.com/yuritoledo/project-one",
  },
  {
    name: "project-two",
    description: "Description of the second project.",
    tags: ["node.js", "express"],
    href: "https://github.com/yuritoledo/project-two",
  },
];

export default function ProjectsPage() {
  return (
    <PageShell title="projects">
      <div className="space-y-6">
        {PROJECTS.map((project, index) => (
          <div
            key={project.name}
            style={{
              animation: "fadeIn 400ms ease-out",
              animationDelay: `${index * 150}ms`,
              animationFillMode: "both",
            }}
          >
            <ProjectCard {...project} />
          </div>
        ))}
      </div>
    </PageShell>
  );
}
```

- [ ] **Step 3: Verify in browser**

Navigate to `/projects`. Expected: nav at top, title types, project cards fade in staggered with box-drawing borders.

- [ ] **Step 4: Commit**

```bash
git add components/ProjectCard.tsx app/projects/page.tsx
git commit -m "feat: add project cards and projects page"
```

---

### Task 13: Blog Page

**Files:**
- Create: `app/blog/page.tsx`

- [ ] **Step 1: Create Blog page**

Create `app/blog/page.tsx`:

```tsx
import { PageShell } from "@/components/PageShell";

const POSTS = [
  { date: "2026-03-15", title: "First blog post title" },
  { date: "2026-02-28", title: "Another post about something" },
  { date: "2026-01-10", title: "Yet another interesting post" },
];

export default function BlogPage() {
  return (
    <PageShell title="blog">
      <div className="space-y-2">
        {POSTS.map((post) => (
          <div key={post.date} className="group cursor-pointer">
            <span className="text-[#1a8a1a]">[{post.date}]</span>{" "}
            <span className="text-[#33ff33] group-hover:text-[#66ff66] group-hover:[text-shadow:0_0_8px_#33ff33] transition-all duration-200">
              {post.title}
            </span>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
```

- [ ] **Step 2: Verify in browser**

Navigate to `/blog`. Expected: dates in dim green, titles in primary green, hover glow on titles.

- [ ] **Step 3: Commit**

```bash
git add app/blog/page.tsx
git commit -m "feat: add blog page"
```

---

### Task 14: Contact Page

**Files:**
- Create: `app/contact/page.tsx`

- [ ] **Step 1: Create Contact page**

Create `app/contact/page.tsx`:

```tsx
import { PageShell } from "@/components/PageShell";

const LINKS = [
  {
    label: "github",
    value: "github.com/yuritoledo",
    href: "https://github.com/yuritoledo",
  },
  {
    label: "email",
    value: "yuri@example.com",
    href: "mailto:yuri@example.com",
  },
  {
    label: "linkedin",
    value: "linkedin.com/in/yuritoledo",
    href: "https://linkedin.com/in/yuritoledo",
  },
];

export default function ContactPage() {
  return (
    <PageShell title="contact">
      <div className="space-y-2">
        {LINKS.map((link) => (
          <div key={link.label}>
            <span className="text-[#1a8a1a]">&gt; {link.label}</span>
            {"    "}
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#33ff33] hover:text-[#66ff66] hover:[text-shadow:0_0_8px_#33ff33] transition-all duration-200"
            >
              {link.value}
            </a>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
```

- [ ] **Step 2: Verify in browser**

Navigate to `/contact`. Expected: labels in dim green, links in primary green with hover glow.

- [ ] **Step 3: Commit**

```bash
git add app/contact/page.tsx
git commit -m "feat: add contact page"
```

---

### Task 15: Final Polish and Verification

**Files:**
- Modify: `app/layout.tsx` (add metadata)

- [ ] **Step 1: Add Open Graph and favicon metadata**

Update the metadata in `app/layout.tsx`:

```tsx
export const metadata: Metadata = {
  title: {
    default: "Yuri Toledo",
    template: "%s — Yuri Toledo",
  },
  description: "Frontend developer based in Brazil. Crafting interfaces since 2016.",
  metadataBase: new URL("https://yuritoledo.dev"),
  openGraph: {
    title: "Yuri Toledo",
    description: "Frontend developer based in Brazil. Crafting interfaces since 2016.",
    url: "https://yuritoledo.dev",
    siteName: "Yuri Toledo",
    locale: "en_US",
    type: "website",
  },
};
```

- [ ] **Step 2: Full smoke test — walk through every page**

1. Clear sessionStorage, load `/` — boot sequence plays, hero types out, nav fades in
2. Click each nav link — about, projects, blog, contact all render with typed titles
3. Verify active nav state on each page
4. Hover over links — glow effect works
5. Check mobile viewport — ASCII art scales down, layout remains usable
6. Refresh any inner page — works without boot sequence

- [ ] **Step 3: Run production build**

```bash
cd /Users/yuritoledo/code/yuri-home
npm run build
```

Expected: Build completes with no errors. Fix any TypeScript or build errors.

- [ ] **Step 4: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: add metadata and finalize site"
```
