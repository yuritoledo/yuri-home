"use client";

import { PageShell } from "@/components/PageShell";
import { ProjectCard } from "@/components/ProjectCard";

const PROJECTS = [
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
