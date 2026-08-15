import type { Metadata } from "next";
import { Orbitron, Rajdhani } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

const rajdhani = Rajdhani({
  weight: ['300', '400', '500', '600', '700'],
  variable: "--font-rajdhani",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://rimanstech.com"),
  title: "AI QUEST: BUILD. TRAIN. DEPLOY.",
  description: "A premium AI-themed card game where you race to build the ultimate intelligence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${orbitron.variable} ${rajdhani.variable} antialiased font-sans bg-black text-white`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
