import { PageShell } from "@/components/PageShell";

export default function AboutPage() {
  return (
    <PageShell title="about">
      <div className="space-y-4 text-[#33ff33]">
        <p>
          Senior Frontend Engineer based in São Paulo, Brazil.
          9+ years deep in the React ecosystem — building,
          leading, and shipping.
        </p>
        <p>
          Currently at A5 Labs, leading projects with full
          autonomy over UI/UX and architecture. Previously
          led frontend teams at Foxbox and Troupe, mentoring
          engineers and owning the technical direction.
        </p>
        <p>
          My stack revolves around React, TypeScript, Next.js,
          and Tailwind CSS. Strong focus on testing (TDD, Cypress,
          350+ e2e tests at Zenlist) and performance optimization.
        </p>
        <p>
          Worked across international teams in startup and agile
          environments. I care about code quality, accessibility,
          and delivering things that actually work.
        </p>
        <p className="text-[#1a8a1a]">
          Information Security — FATEC (2011-2014)
        </p>
      </div>
    </PageShell>
  );
}
