"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Orbitron } from "next/font/google";
import { PrintBoxNet } from "@/components/print/PrintBoxNet";

const orbitron = Orbitron({ subsets: ["latin"] });

// Box Template Geometry Constants (in pt)
const SHEET_WIDTH = 1530.71; // 540mm
const SHEET_HEIGHT = 1077.17; // 380mm

function BoxFactorySheetContent() {
  const searchParams = useSearchParams();
  const noBg = searchParams.get("no-bg") === "1";

  return (
    <div className="print-sheet-container min-h-screen bg-zinc-900 py-10 px-4 print:bg-white print:p-0 print:py-0 flex flex-col items-center">
      {/* Header Banner (Hidden on print) */}
      <div className="print-hidden max-w-2xl w-full mb-10 text-white flex flex-col items-center text-center">
        <h1
          className={`text-4xl font-black mb-3 bg-gradient-to-r from-cyan-400 to-rose-400 bg-clip-text text-transparent ${orbitron.className}`}
        >
          Box Factory Art Sheet
        </h1>
        <p className="text-gray-400 text-sm mb-6">
          Lid and Base box artwork arranged on HeroTime's official 540×380mm template sheet.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => window.print()}
            className="bg-cyan-500 hover:bg-cyan-400 text-black px-10 py-3 rounded-full font-bold uppercase tracking-widest text-xs"
          >
            Print Box Art PDF
          </button>
          <Link
            href="/print-cards"
            className="bg-zinc-800 hover:bg-zinc-700 text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest text-xs"
          >
            Print Hub
          </Link>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          @media print {
            @page {
              size: 540mm 380mm;
              margin: 0;
            }
            html, body {
              margin: 0 !important;
              padding: 0 !important;
              background: white !important;
              width: 540mm !important;
              height: 380mm !important;
              overflow: hidden !important;
            }
            .print-hidden {
              display: none !important;
            }
            .print-sheet-container {
              display: block !important;
              margin: 0 !important;
              padding: 0 !important;
              width: 540mm !important;
              height: 380mm !important;
            }
            .box-factory-sheet {
              position: absolute !important;
              top: 0 !important;
              left: 0 !important;
              width: 1530.71pt !important;
              height: 1077.17pt !important;
              box-shadow: none !important;
              margin: 0 !important;
              padding: 0 !important;
            }
          }
        `
      }} />

      {/* Box Factory Sheet Container */}
      <div
        className="box-factory-sheet relative bg-white text-black shrink-0 overflow-hidden shadow-2xl print:shadow-none"
        style={{
          width: `${SHEET_WIDTH}pt`,
          height: `${SHEET_HEIGHT}pt`,
          backgroundImage: noBg ? "none" : "url('/templates/box_template.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          WebkitPrintColorAdjust: "exact",
          printColorAdjust: "exact",
        }}
      >
        {/* Lid Net: Positioned matching the template guide bounds */}
        <div
          className="absolute"
          style={{
            left: "131.15pt",
            bottom: "117.81pt",
            width: "203mm",
            height: "250mm",
          }}
        >
          <PrintBoxNet template="lid" />
        </div>

        {/* Base Net: Positioned matching the template guide bounds */}
        <div
          className="absolute"
          style={{
            left: "849.95pt",
            bottom: "122.91pt",
            width: "193.9mm",
            height: "240.9mm",
          }}
        >
          <PrintBoxNet template="base" />
        </div>
      </div>
    </div>
  );
}

export default function BoxFactorySheetPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-900" />}>
      <BoxFactorySheetContent />
    </Suspense>
  );
}
