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
                ? "text-[#33ff33] hover:[text-shadow:0_0_8px_#33ff33]"
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
