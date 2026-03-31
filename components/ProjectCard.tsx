interface ProjectCardProps {
  name: string;
  description: string;
  tags: string[];
  href?: string;
}

export function ProjectCard({ name, description, tags, href }: ProjectCardProps) {
  return (
    <div className="border border-[#1a3a1a] p-4 relative">
      <span className="absolute -top-3 left-3 bg-[#0a0a0a] px-2 text-[#33ff33]">
        {name}
      </span>
      <p className="text-[#33ff33] mt-1">{description}</p>
      <p className="text-[#1a8a1a] mt-2">{tags.join(" · ")}</p>
      {href && (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#33ff33] hover:text-[#66ff66] hover:[text-shadow:0_0_8px_#33ff33] transition-all duration-200 mt-2 inline-block"
        >
          {href}
        </a>
      )}
    </div>
  );
}
