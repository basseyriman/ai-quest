"use client";

import React, { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Target } from "lucide-react";
import { BoxType, PrintBoxNet } from "@/components/print/PrintBoxNet";
import { PRINT_BOX_STYLE_BLOCK } from "@/components/print/pdfExportStyles";

function PrintBoxContent() {
  const searchParams = useSearchParams();
  const urlTemplate = searchParams.get("template");
  const [template, setTemplate] = useState<BoxType>("lid");

  const templatesToRender: BoxType[] =
    urlTemplate === "both"
      ? ["lid", "base"]
      : urlTemplate === "lid" || urlTemplate === "base"
        ? [urlTemplate]
        : [template];

  return (
    <div className="print-export-root print-export-ready min-h-screen bg-zinc-900 flex flex-col items-center py-10 font-sans print:bg-white print:p-0 print:block">
      <style dangerouslySetInnerHTML={{ __html: PRINT_BOX_STYLE_BLOCK }} />

      <div className="print-hidden mb-8 text-center text-white px-4 max-w-2xl">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
          Premium Two-Piece Box
        </h1>
        <p className="mb-4 text-gray-400">
          A premium telescoping box. Print both the Lid and Base on heavy cardstock (e.g. 300gsm).
          <br />
          Cut along the solid lines and fold along the dashed lines. Use glue or double-sided tape on
          the corner flaps.
        </p>
        <div className="mb-6 text-left text-sm text-gray-300 bg-zinc-800/80 border border-zinc-700 rounded-lg p-4 space-y-2">
          <p className="font-bold text-cyan-400">Print settings (important)</p>
          <ul className="list-disc pl-5 space-y-1 text-gray-400">
            <li>
              <strong className="text-white">Scale: 100%</strong> (Actual size) — never “Fit to page”
            </li>
            <li>
              Paper: <strong className="text-white">A4</strong> · Portrait · one template per sheet
            </li>
            <li>
              Turn on <strong className="text-white">Background graphics</strong> (dark panels must
              print)
            </li>
          </ul>
          <p className="text-xs text-gray-500 pt-1 border-t border-zinc-700">
            Check size after printing: center panel should measure{" "}
            <strong className="text-white">87×127 mm</strong> (lid) or{" "}
            <strong className="text-white">85×125 mm</strong> (base).
          </p>
        </div>

        <div className="flex gap-4 justify-center mb-8">
          <button
            onClick={() => setTemplate("lid")}
            className={`px-8 py-3 rounded-full font-bold shadow-lg transition-colors ${template === "lid" ? "bg-cyan-500 text-black" : "bg-zinc-800 text-white hover:bg-zinc-700"}`}
          >
            1. Select Lid
          </button>
          <button
            onClick={() => setTemplate("base")}
            className={`px-8 py-3 rounded-full font-bold shadow-lg transition-colors ${template === "base" ? "bg-purple-500 text-white" : "bg-zinc-800 text-white hover:bg-zinc-700"}`}
          >
            2. Select Base
          </button>
        </div>

        <div className="flex gap-4 justify-center flex-wrap">
          <button
            onClick={() => window.print()}
            className="bg-white hover:bg-gray-200 text-black px-6 py-2 rounded-lg font-bold shadow-lg transition-colors flex items-center gap-2"
          >
            Print Current View
          </button>
          <a
            href="/print-manual"
            className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-lg font-bold shadow-lg transition-colors"
          >
            Box Manual
          </a>
          <a
            href="/print-scorecard"
            className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2 rounded-lg font-bold shadow-lg transition-colors flex items-center gap-2"
          >
            <Target className="w-5 h-5" />
            Score Card
          </a>
        </div>
      </div>

      {templatesToRender.map((t, i) => (
        <div
          key={t}
          className={`print-box-sheet w-full flex justify-center ${i < templatesToRender.length - 1 ? "pdf-page-break" : ""}`}
        >
          <PrintBoxNet template={t} />
        </div>
      ))}
    </div>
  );
}

export default function PrintBoxPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-900" />}>
      <PrintBoxContent />
    </Suspense>
  );
}
