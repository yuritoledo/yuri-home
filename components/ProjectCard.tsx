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
