import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen px-8 py-12 flex items-center justify-center">
      <div className="max-w-[720px] w-full font-mono">
        <pre className="text-[#1a8a1a] text-sm leading-relaxed">
{`HTTP/1.1 404 Not Found
Content-Type: text/plain; charset=utf-8
Server: yuri-home/1.0
Date: ${new Date().toUTCString()}
Connection: close`}
        </pre>

        <div className="border-t border-[#1a3a1a] my-6" />

        <p className="text-[#33ff33] text-lg mb-2">404 — page not found</p>
        <p className="text-[#1a8a1a] mb-8">the requested resource could not be located on this server.</p>

        <Link
          href="/"
          className="text-[#33ff33] hover:text-[#66ff66] hover:[text-shadow:0_0_8px_#33ff33] transition-all duration-200"
        >
          &gt; return home
        </Link>
      </div>
    </main>
  );
}
