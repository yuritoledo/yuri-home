import { PageShell } from "@/components/PageShell";

const POSTS = [
  { date: "2026-03-15", title: "First blog post title" },
  { date: "2026-02-28", title: "Another post about something" },
  { date: "2026-01-10", title: "Yet another interesting post" },
];

export default function BlogPage() {
  return (
    <PageShell title="blog">
      <div className="space-y-2">
        {POSTS.map((post) => (
          <div key={post.date} className="group cursor-pointer">
            <span className="text-[#1a8a1a]">[{post.date}]</span>{" "}
            <span className="text-[#33ff33] group-hover:text-[#66ff66] group-hover:[text-shadow:0_0_8px_#33ff33] transition-all duration-200">
              {post.title}
            </span>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
