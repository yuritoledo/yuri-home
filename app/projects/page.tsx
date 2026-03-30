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
