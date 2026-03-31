import { PageShell } from "@/components/PageShell";

const LINKS = [
  {
    label: "github",
    value: "github.com/yuritoledo",
    href: "https://github.com/yuritoledo",
  },
  {
    label: "email",
    value: "yuriwtoledo@gmail.com",
    href: "mailto:yuriwtoledo@gmail.com",
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
