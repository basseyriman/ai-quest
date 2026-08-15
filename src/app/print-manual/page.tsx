"use client";

import React from "react";
import Link from "next/link";
import { Orbitron } from "next/font/google";
import { BookOpen, Layers } from "lucide-react";
import { FULL_GAME_SET_SIZE } from "@/lib/engineer-mode/cards";
import { BoxFoldedGuideA5 } from "@/components/print/BoxFoldedGuideA5";

const orbitron = Orbitron({ subsets: ["latin"] });

export default function PrintManualPage() {
  return (
    <div className="min-h-screen bg-zinc-900 py-10 px-4 print-manual-screen">
      <div className="print-hidden max-w-2xl mx-auto mb-10 text-center text-white">
        <h1
          className={`text-4xl font-black mb-3 bg-gradient-to-r from-rose-400 to-cyan-400 bg-clip-text text-transparent ${orbitron.className}`}
        >
          Box Insert Manual
        </h1>
        <p className="text-gray-400 mb-2 text-sm uppercase tracking-widest">
          Engineer Mode · {FULL_GAME_SET_SIZE} cards
        </p>
        <p className="text-gray-500 text-sm mb-8 max-w-lg mx-auto leading-relaxed">
          What goes inside the box: 1× A5 folded rules guide. Pipeline and IP reference live on the{" "}
          <Link href="/print-scorecard" className="text-cyan-400 hover:text-cyan-300">
            IP score trackers
          </Link>
          .
        </p>

        <div className="flex gap-3 justify-center flex-wrap mb-6">
          <button
            type="button"
            onClick={() => window.print()}
            className="bg-rose-500 hover:bg-rose-400 text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest text-sm"
          >
            Print Folded Guide
          </button>
        </div>

        <div className="flex gap-4 justify-center flex-wrap text-sm">
          <Link
            href="/print-manual/full"
            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-bold uppercase tracking-wider"
          >
            <BookOpen className="w-4 h-4" />
            Full A4 Rules Manual
          </Link>
          <Link
            href="/print-scorecard"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-300 font-bold uppercase tracking-wider"
          >
            IP Score Trackers
          </Link>
          <Link
            href="/print-cards"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-300 font-bold uppercase tracking-wider"
          >
            <Layers className="w-4 h-4" />
            Print Hub
          </Link>
        </div>
      </div>

      <div className="print-export-root print-export-ready print-manual-a5-root flex flex-col items-center">
        <p className="print-hidden text-white text-sm font-bold uppercase tracking-widest mb-4">
          1× A5 Folded Guide — preview
        </p>
        <BoxFoldedGuideA5 />
      </div>

      <p className="print-hidden text-xs text-zinc-500 max-w-md text-center mx-auto mt-8">
        Print on A5 (148×210 mm), duplex if possible. Fold in half vertically, then horizontally.
        Closed size ≈ 74×105 mm — fits 85×125 mm box.
      </p>
    </div>
  );
}
