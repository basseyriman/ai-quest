"use client";

import React from "react";
import Link from "next/link";
import { Orbitron } from "next/font/google";
import { Layers } from "lucide-react";
import { IpScoreTracker } from "@/components/print/IpScoreTracker";
import { PRINT_TRACKER_STYLE_BLOCK } from "@/components/print/pdfExportStyles";

const orbitron = Orbitron({ subsets: ["latin"] });

const TRACKER_COUNT = 8;

const SHEETS: readonly (readonly number[])[] = [
  [1, 2, 3, 4],
  [5, 6, 7, 8],
];

export default function PrintScorecardPage() {
  return (
    <div className="print-export-root print-export-ready min-h-screen bg-zinc-900 py-10 px-4 print:bg-white print:p-0 print:py-0">
      <style dangerouslySetInnerHTML={{ __html: PRINT_TRACKER_STYLE_BLOCK }} />

      <div className="print-hidden max-w-2xl mx-auto mb-12 text-center text-white">
        <h1
          className={`text-4xl font-black mb-3 bg-gradient-to-r from-cyan-400 to-rose-400 bg-clip-text text-transparent ${orbitron.className}`}
        >
          IP Score Tracker
        </h1>
        <p className="text-gray-400 mb-2 text-sm uppercase tracking-widest">
          Official Rules v1.0 · First Edition
        </p>
        <p className="text-gray-500 text-sm mb-6 max-w-lg mx-auto leading-relaxed">
          {TRACKER_COUNT} trackers on 2× A4 sheets — 4 per page (2×2 grid), centred. Each tracker is
          63×88 mm.
        </p>

        <div className="flex gap-4 justify-center flex-wrap">
          <button
            onClick={() => window.print()}
            className="bg-cyan-500 hover:bg-cyan-400 text-black px-10 py-3 rounded-full font-bold uppercase tracking-widest text-sm"
          >
            Print Trackers
          </button>
          <Link
            href="/print-cards"
            className="bg-zinc-800 hover:bg-zinc-700 text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest text-sm inline-flex items-center gap-2"
          >
            <Layers className="w-4 h-4" />
            Print Hub
          </Link>
        </div>
      </div>

      {SHEETS.map((players, sheetIndex) => (
        <div
          key={sheetIndex}
          className={`tracker-sheet${sheetIndex < SHEETS.length - 1 ? " pdf-page-break" : ""}`}
        >
          <div className="tracker-grid">
            {players.map((n) => (
              <IpScoreTracker key={n} playerNumber={n} />
            ))}
          </div>
        </div>
      ))}

      <p className="print-hidden text-xs text-zinc-500 max-w-md text-center mx-auto mt-8">
        Print on A4 — 2 sheets, 4 trackers each (2×2 grid), centred on page. Trim to 63×88 mm.
      </p>
    </div>
  );
}
