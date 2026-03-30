import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ScanlineOverlay } from "@/components/ScanlineOverlay";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Yuri Toledo",
  description: "Frontend developer based in Brazil",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={jetbrainsMono.variable}>
      <body className="bg-[#0a0a0a] text-[#33ff33] font-mono antialiased min-h-screen">
        {children}
        <ScanlineOverlay />
      </body>
    </html>
  );
}
