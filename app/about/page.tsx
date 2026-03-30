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
