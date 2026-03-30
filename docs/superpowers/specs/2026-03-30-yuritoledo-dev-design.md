# yuritoledo.dev — Design Spec

## Overview

Personal portfolio website for Yuri Toledo, a frontend developer based in Brazil, coding since January 1, 2016. The site is a minimalist terminal-aesthetic portfolio with a subtle druidic/roguelike tone expressed through color palette and microcopy — professional first, nerdy second.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Font:** JetBrains Mono (Google Fonts) — used everywhere
- **Animation:** Custom React hooks + CSS transitions (no libraries)
- **Deployment:** Vercel-ready

## Color Palette

| Token       | Hex       | Usage                                |
|-------------|-----------|--------------------------------------|
| bg          | `#0a0a0a` | Page background                      |
| primary     | `#33ff33` | Main text, active elements           |
| dim         | `#1a8a1a` | Secondary text, inactive nav links   |
| accent      | `#66ff66` | Hover states, emphasis               |
| border      | `#1a3a1a` | Box-drawing characters, dividers     |
| error       | `#ff4444` | Sparingly, for error/alert states    |

## Typography

- JetBrains Mono for all text — headings, body, nav, code
- Base font size: 14-16px
- Line height: 1.6
- No large headings — terminal doesn't do big fonts

## Project Structure

```
app/
  layout.tsx            — root layout, font, global styles, scanline overlay
  page.tsx              — home (boot sequence + hero)
  about/page.tsx
  projects/page.tsx
  blog/page.tsx
  contact/page.tsx
components/
  BootSequence.tsx      — boot animation overlay
  TerminalNav.tsx       — persistent navigation
  TypingText.tsx        — reusable typing animation component
  Cursor.tsx            — blinking block cursor
  AsciiName.tsx         — ASCII art "YURI TOLEDO"
  ScanlineOverlay.tsx   — subtle CRT scanline effect
  ProjectCard.tsx       — box-drawn project card
hooks/
  useTyping.ts          — typing animation hook (~40ms per char)
  useBootSequence.ts    — boot sequence state machine
```

## Boot Sequence

Full-screen overlay on `#0a0a0a` background. Lines appear with ~200ms stagger (not individually typed — too slow). Plays once per session (`sessionStorage` flag). Total duration: ~2.1s + 300ms fade out.

```
[0.0s]  > initializing grove protocol...
[0.2s]  > loading root system...
[0.4s]  > parsing html canopy... ok
[0.6s]  > compiling css bark... ok
[0.8s]  > resolving branches... ok
[1.0s]  > mounting /dev/forest... ok
[1.2s]  > seed checksum verified
[1.4s]  > establishing connection...
[1.8s]  > ready.
[2.1s]  (overlay fades out over 300ms)
```

- Lines in dim green (`#1a8a1a`)
- "ok" and "ready." in bright green (`#33ff33`)

## Homepage Hero

Revealed after boot sequence clears. No box frame.

```
YURI TOLEDO
(ASCII art — blocky monospace letters)

$ frontend developer
$ crafting interfaces for 3,746 days_█

> about    > projects    > blog    > contact
```

- ASCII art name renders instantly, fades in
- Two `$` lines type out sequentially (~40ms per char)
- Day counter is live — calculated from `new Date('2016-01-01')`, ticks daily
- Blinking block cursor `█` at end of last typed line
- Nav links fade in after typing completes, staggered
- Links use `>` prefix, hover: bright green + glow (`text-shadow: 0 0 8px #33ff33`)

## Navigation (TerminalNav)

Horizontal row persisted on all pages:

```
> about    > projects    > blog    > contact
```

- Active page: bright green (`#33ff33`)
- Inactive pages: dim green (`#1a8a1a`)
- Hover: bright green + glow
- On inner pages: positioned at top of layout
- On homepage: nav is part of the hero content (no separate top bar), fades in after typing

## Inner Pages — Shared Pattern

```
$ page-name_█

  [content]
```

- Page title appears as `$ page-name` with typing animation + blinking cursor
- Content fades in after title finishes typing
- Max-width: 720px, centered, generous padding
- Scanline overlay on all pages

## Inner Pages — Specific

### About

```
$ about_█

  Frontend developer based in Brazil.
  Building for the web since 2016.

  I work with React, TypeScript, and Next.js.
  [additional content from Yuri]
```

Plain text, no special formatting beyond the terminal style.

### Projects

Each project displayed as a box-drawn card:

```
┌─ project-name ──────────────────────────┐
│                                          │
│  Description of the project goes here.   │
│                                          │
│  react · typescript · next.js            │
│  [link]                                  │
│                                          │
└──────────────────────────────────────────┘
```

- Cards appear with staggered fade-in
- Tech tags in dim green
- Link in bright green with hover glow

### Blog

Minimal list format:

```
$ blog_█

  [2026-03-15] post title here
  [2026-02-28] another post title
  [2026-01-10] yet another post
```

- Dates in dim green, titles in primary green
- Hover: title shifts to accent green + glow

### Contact

Terminal-output style, no form:

```
$ contact_█

  > github    github.com/yuritoledo
  > email     yuri@example.com
  > linkedin  linkedin.com/in/yuritoledo
```

- Labels in dim green, values/links in primary green
- Hover glow on links

## Effects

### Blinking Block Cursor

- Character: `█`
- Blinks via CSS animation: `opacity 1 → 0` on a 1s loop
- Appears at end of typed text

### CRT Scanline Overlay

- CSS pseudo-element on the root layout
- Repeating horizontal lines (`repeating-linear-gradient`)
- Very low opacity (~0.03) — felt, not seen
- `pointer-events: none` so it doesn't interfere with clicks

### Hover Glow

- On all interactive elements (nav links, project links, contact links)
- `text-shadow: 0 0 8px #33ff33`
- Transition: 0.2s ease

### Typing Animation

- Custom `useTyping` hook
- ~40ms per character
- Returns current visible string + isComplete boolean
- Used for page titles and hero lines

## Tone Guidelines

The druidic/roguelike flavor is expressed subtly:

- **Color palette** does the heavy lifting — green-on-black is inherently forest/terminal
- **Boot sequence microcopy** uses dev/nature double meanings ("grove protocol", "root system", "branches")
- **No fantasy imagery, ASCII art trees, runes, RPG stats, or character sheets**
- **Nav and page names are plain:** About, Projects, Blog, Contact
- A recruiter sees a sharp dev portfolio. A fellow nerd catches the vibe.
