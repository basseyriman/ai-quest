"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Orbitron } from "next/font/google";
import { Megaphone } from "lucide-react";
import { PlaytestEventPoster } from "@/components/print/PlaytestEventPoster";
import { PRINT_PLAYTEST_POSTER_STYLE_BLOCK } from "@/components/print/pdfExportStyles";
import "@/app/ai-quest/landing.css";

const orbitron = Orbitron({ subsets: ["latin"] });

export default function PrintPlaytestPosterPage() {
  const [date, setDate] = useState("Saturday · 14 June 2026");
  const [time, setTime] = useState("2:00 PM – 5:00 PM");
  const [location, setLocation] = useState("Your venue · City");
  const [subtitle, setSubtitle] = useState(
    "Free to play · All skill levels welcome · Your feedback shapes the game",
  );
  const [variant, setVariant] = useState<"3d" | "photo" | "banner">("photo");

  return (
    <div className="print-export-root print-export-ready min-h-screen bg-zinc-900 py-10 px-4 print:bg-white print:p-0">
      <style dangerouslySetInnerHTML={{ __html: PRINT_PLAYTEST_POSTER_STYLE_BLOCK }} />

      <div className="print-hidden max-w-2xl mx-auto mb-10 text-white">
        <h1
          className={`text-4xl font-black mb-3 bg-gradient-to-r from-yellow-300 via-cyan-300 to-rose-400 bg-clip-text text-transparent ${orbitron.className}`}
        >
          Playtest Event Poster
        </h1>
        <p className="text-gray-400 text-sm mb-6 leading-relaxed">
          Premium A3 playtest poster — product-first layout. Edit the details below, then print at{" "}
          <strong className="text-white">100% scale</strong> with background graphics on.
        </p>

        <div className="grid gap-3 text-left text-sm mb-8">
          <label className="block">
            <span className="text-cyan-400 text-xs uppercase tracking-widest font-bold">Poster Style</span>
            <select
              value={variant}
              onChange={(e) => setVariant(e.target.value as "3d" | "photo" | "banner")}
              className="mt-1 w-full rounded-lg bg-zinc-800 border border-zinc-600 px-3 py-2 text-white"
            >
              <option value="photo">Realistic Playtest (Round Table Photo)</option>
              <option value="3d">Futuristic (3D Game Box & Card Fan)</option>
              <option value="banner">Eventbrite Cover Banner (2:1 Landscape)</option>
            </select>
          </label>
          <label className="block">
            <span className="text-cyan-400 text-xs uppercase tracking-widest font-bold">Date</span>
            <input
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 w-full rounded-lg bg-zinc-800 border border-zinc-600 px-3 py-2 text-white"
            />
          </label>
          <label className="block">
            <span className="text-cyan-400 text-xs uppercase tracking-widest font-bold">Time</span>
            <input
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="mt-1 w-full rounded-lg bg-zinc-800 border border-zinc-600 px-3 py-2 text-white"
            />
          </label>
          <label className="block">
            <span className="text-cyan-400 text-xs uppercase tracking-widest font-bold">Location</span>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="mt-1 w-full rounded-lg bg-zinc-800 border border-zinc-600 px-3 py-2 text-white"
            />
          </label>
          <label className="block">
            <span className="text-cyan-400 text-xs uppercase tracking-widest font-bold">Tagline</span>
            <input
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="mt-1 w-full rounded-lg bg-zinc-800 border border-zinc-600 px-3 py-2 text-white"
            />
          </label>
        </div>

        <div className="flex gap-4 justify-center flex-wrap">
          <button
            type="button"
            onClick={() => window.print()}
            className="bg-cyan-400 hover:bg-cyan-300 text-black px-10 py-3 rounded-full font-bold uppercase tracking-widest text-sm"
          >
            Print A3 Poster
          </button>
          <Link
            href="/print-cards"
            className="bg-zinc-800 hover:bg-zinc-700 text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest text-sm inline-flex items-center gap-2"
          >
            <Megaphone className="w-4 h-4" />
            Print Hub
          </Link>
        </div>
      </div>

      <div className="playtest-poster-sheet">
        <PlaytestEventPoster
          date={date}
          time={time}
          location={location}
          subtitle={subtitle}
          variant={variant}
        />
      </div>

      <p className="print-hidden text-xs text-zinc-500 max-w-md text-center mx-auto mt-8">
        Paper: A3 portrait · Scale 100% · Background graphics ON. For A4, use your printer&apos;s
        &quot;Fit to page&quot; only if A3 is unavailable.
      </p>
    </div>
  );
}
