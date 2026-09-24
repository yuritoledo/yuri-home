"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PageShell } from "@/components/PageShell";
import { ProjectCard } from "@/components/ProjectCard";
import { Cursor } from "@/components/Cursor";

const WORK = [
  {
    name: "a5-labs",
    period: "12/2023 — present",
    description: "Leading 2 projects with full ownership. AI-augmented workflow with Claude Code, MCP servers, automated tests, PRDs, and rapid prototyping.",
    tags: ["next.js", "tailwind", "typescript", "claude-code", "mcp", "rpi", "shadcn/ui", "vite"],
  },
  {
    name: "zenlist",
    period: "12/2021 — 12/2023",
    description: "350+ handcrafted e2e tests — no AI, all manual. Performance optimization and accessibility across the platform.",
    tags: ["next.js", "tailwind", "typescript", "graphql", "jest", "cypress"],
  },
  {
    name: "foxbox",
    period: "03/2021 — 12/2021",
    description: "Led frontend architecture for greenfield projects, mentored 3 engineers.",
    tags: ["next.js", "chakra-ui", "typescript", "rest", "jest", "cypress"],
  },
  {
    name: "millenium-bcp",
    period: "08/2020 — 03/2021",
    description: "Collaborated with designers to ship functional frontend code.",
    tags: ["react", "react-native", "typescript", "rest", "styled-components"],
  },
  {
    name: "troupe",
    period: "05/2017 — 08/2020",
    description: "Owned frontend architecture, mentored 3 engineers, shipped from scratch.",
    tags: ["react", "react-native", "typescript", "rest", "styled-components", "redux"],
  },
  {
    name: "mkdata",
    period: "11/2015 — 05/2017",
    description: "Fullstack development — building features end-to-end, from API to UI.",
    tags: ["node.js", "vue.js", "javascript", "rest", "sql"],
  },
];

const SIDE_PROJECTS = [
  {
    name: "poker-shield",
    period: "side project",
    description: "Poker room monitoring dashboard for tables, players, sessions, and risk signals.",
    tags: ["next.js", "typescript", "tailwind", "zustand"],
    href: "https://poker-shield.vercel.app",
  },
  {
    name: "clube-turismo",
    period: "side project",
    description: "Backoffice platform for travel consultants.",
    tags: ["next.js", "tailwind", "typescript"],
    href: "https://travel-app-demo-yuri-toledos-projects.vercel.app/login",
  },
  {
    name: "druid-delve",
    period: "side project",
    description: "Turn-based roguelike dungeon crawler. Play as a druid navigating procedurally-generated dungeons with shapeshift powers and magic.",
    tags: ["next.js", "tailwind", "typescript", "game-dev"],
    href: "https://v0-druid-delve.vercel.app/",
  },
  {
    name: "masmorras-shadowdark",
    period: "side project",
    description: "Dungeons for solo/coop/group play in PT-BR for the Shadowdark RPG system. English coming soon.",
    tags: ["shadowdark", "ttrpg", "pt-br"],
    href: "https://masmorras-shadowdark.vercel.app/",
  },
  {
    name: "dungeon-generator",
    period: "side project",
    description: "Procedural dungeon generator with configurable room placement, corridor carving, and real-time visualization.",
    tags: ["typescript", "canvas", "procedural-generation"],
    href: "https://yuritoledo.github.io/dungeon-generator/",
  },
];

function ProjectsSearch() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const [animateCards, setAnimateCards] = useState(true);
  const inputRef = useCallback((input: HTMLInputElement | null) => input?.focus(), []);

  useEffect(() => {
    const stopAnimations = () => setAnimateCards(false);
    window.addEventListener("popstate", stopAnimations);
    return () => window.removeEventListener("popstate", stopAnimations);
  }, []);

  function updateQuery(value: string) {
    setAnimateCards(false);
    const url = new URL(window.location.href);
    if (value) url.searchParams.set("q", value);
    else url.searchParams.delete("q");
    window.history.replaceState(null, "", url);
  }

  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const matches = (project: (typeof WORK)[number] | (typeof SIDE_PROJECTS)[number]) => {
    const fields = [project.name, project.period, project.description, ...project.tags, "href" in project ? project.href : ""];
    return words.every((word) => fields.some((field) => field.toLowerCase().includes(word)));
  };
  const work = WORK.filter(matches);
  const sideProjects = SIDE_PROJECTS.filter(matches);

  return (
    <PageShell title="projects" wide prompt={
      <span className="relative inline-flex items-center align-middle max-w-full">
        <input
          ref={inputRef}
          type="search"
          aria-label="Search projects"
          autoComplete="off"
          value={query}
          onChange={(event) => updateQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.preventDefault();
              updateQuery("");
            }
          }}
          className="bg-transparent text-inherit outline-none appearance-none [&::-webkit-search-cancel-button]:hidden"
          style={{ width: `min(${Math.max(query.length, 1)}ch, 70vw)`, caretColor: query ? "currentColor" : "transparent" }}
        />
        {!query && <span aria-hidden="true" className="absolute left-0 pointer-events-none"><Cursor /></span>}
      </span>
    }>
      {work.length === 0 && sideProjects.length === 0 ? (
        <p>no projects found for &quot;{query.trim()}&quot;</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {work.length > 0 && (
            <div>
              <h2 className="text-[#1a8a1a] mb-4">work</h2>
              <div className="space-y-6">
                {work.map((project, index) => (
                  <div
                    key={project.name}
                    style={animateCards ? {
                      animation: "fadeIn 400ms ease-out",
                      animationDelay: `${index * 150}ms`,
                      animationFillMode: "both",
                    } : undefined}
                  >
                    <ProjectCard {...project} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {sideProjects.length > 0 && (
            <div>
              <h2 className="text-[#1a8a1a] mb-4">side projects</h2>
              <div className="space-y-6">
                {sideProjects.map((project, index) => (
                  <div
                    key={project.name}
                    style={animateCards ? {
                      animation: "fadeIn 400ms ease-out",
                      animationDelay: `${(WORK.length + index) * 150}ms`,
                      animationFillMode: "both",
                    } : undefined}
                  >
                    <ProjectCard {...project} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </PageShell>
  );
}

export default function ProjectsPage() {
  return <Suspense fallback={null}><ProjectsSearch /></Suspense>;
}
