"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Orbitron } from "next/font/google";
import { BoxFoldedGuideA5, BoxFoldedGuideA5Back } from "@/components/print/BoxFoldedGuideA5";
import { PRINT_MANUAL_A5_FACTORY_SLOT_STYLE_BLOCK } from "@/components/print/pdfExportStyles";
import {
  RULEBOOK_ARTWORK,
  RULEBOOK_FACTORY_SHEET,
} from "@/lib/print/heroTimeRulebook";

const orbitron = Orbitron({ subsets: ["latin"] });

const factoryManualStyles = PRINT_MANUAL_A5_FACTORY_SLOT_STYLE_BLOCK;

function RulebookArtworkSlot({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rulebook-artwork-slot absolute overflow-hidden"
      style={{
        left: `${RULEBOOK_ARTWORK.leftPt}pt`,
        top: `${RULEBOOK_ARTWORK.topPt}pt`,
        width: `${RULEBOOK_ARTWORK.widthMm}mm`,
        height: `${RULEBOOK_ARTWORK.heightMm}mm`,
      }}
    >
      {children}
    </div>
  );
}

function RulebookFactorySheetContent() {
  const searchParams = useSearchParams();
  const noBg = searchParams.get("no-bg") === "1";
  const side = searchParams.get("side") ?? "both";

  const pageStyle: React.CSSProperties = {
    width: `${RULEBOOK_FACTORY_SHEET.widthPt}pt`,
    height: `${RULEBOOK_FACTORY_SHEET.heightPt}pt`,
    backgroundImage: noBg ? "none" : "url('/templates/rulebook_template.png')",
    backgroundSize: "100% 100%",
    backgroundRepeat: "no-repeat",
    WebkitPrintColorAdjust: "exact",
    printColorAdjust: "exact",
  };

  const showFront = side === "both" || side === "front";
  const showBack = side === "both" || side === "back";

  return (
    <div className="rulebook-factory-root print-sheet-container min-h-screen bg-zinc-900 py-10 px-4 print:bg-white print:p-0 print:py-0 flex flex-col items-center">
      <div className="print-hidden max-w-2xl w-full mb-10 text-white flex flex-col items-center text-center">
        <h1
          className={`text-4xl font-black mb-3 bg-gradient-to-r from-cyan-400 to-rose-400 bg-clip-text text-transparent ${orbitron.className}`}
        >
          Rulebook Factory Art Sheet
        </h1>
        <p className="text-gray-400 text-sm mb-6">
          HeroTime one-sheet rulebook on 244×326.8 mm template. 5 mm safe margins, print-safe
          blacks, front + back pages.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            type="button"
            onClick={() => window.print()}
            className="bg-cyan-500 hover:bg-cyan-400 text-black px-10 py-3 rounded-full font-bold uppercase tracking-widest text-xs"
          >
            Print Rulebook PDF
          </button>
          <Link
            href="/print-cards"
            className="bg-zinc-800 hover:bg-zinc-700 text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest text-xs"
          >
            Print Hub
          </Link>
        </div>
      </div>

      <div className="rulebook-factory-pages print-sheet-container flex flex-col items-center">
        {showFront && (
        <div
          className="manual-factory-page relative bg-white text-black shrink-0 overflow-hidden shadow-2xl print:shadow-none mb-10"
          style={pageStyle}
        >
          <div
            className="rulebook-artwork-slot absolute overflow-hidden"
            style={{
              left: `${RULEBOOK_ARTWORK.leftPt}pt`,
              top: `${RULEBOOK_ARTWORK.topPt}pt`,
              width: `${RULEBOOK_ARTWORK.widthMm}mm`,
              height: `${RULEBOOK_ARTWORK.heightMm}mm`,
            }}
          >
            <BoxFoldedGuideA5 styleBlock={factoryManualStyles} />
          </div>
        </div>
        )}

        {showBack && (
        <div
          className="manual-factory-page relative bg-white text-black shrink-0 overflow-hidden shadow-2xl print:shadow-none"
          style={pageStyle}
        >
          <div
            className="rulebook-artwork-slot absolute overflow-hidden"
            style={{
              left: `${RULEBOOK_ARTWORK.leftPt}pt`,
              top: `${RULEBOOK_ARTWORK.topPt}pt`,
              width: `${RULEBOOK_ARTWORK.widthMm}mm`,
              height: `${RULEBOOK_ARTWORK.heightMm}mm`,
            }}
          >
            <BoxFoldedGuideA5Back styleBlock={factoryManualStyles} />
          </div>
        </div>
        )}
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
          html.pdf-export .print-hidden,
          html.pdf-export .rulebook-factory-root > .print-hidden {
            display: none !important;
          }
          html.pdf-export .rulebook-factory-root {
            min-height: 0 !important;
            padding: 0 !important;
            margin: 0 !important;
            background: white !important;
            display: block !important;
          }
          html.pdf-export .rulebook-factory-pages {
            display: block !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          html.pdf-export .manual-factory-page {
            position: relative !important;
            width: ${RULEBOOK_FACTORY_SHEET.widthPt}pt !important;
            height: ${RULEBOOK_FACTORY_SHEET.heightPt}pt !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            overflow: hidden !important;
            background: white !important;
          }
          html.pdf-export:has(.rulebook-factory-root),
          html.pdf-export:has(.rulebook-factory-root) body {
            width: ${RULEBOOK_FACTORY_SHEET.widthMm}mm !important;
            height: ${RULEBOOK_FACTORY_SHEET.heightMm}mm !important;
            max-height: none !important;
            min-height: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
            background: white !important;
          }
          html.pdf-export .rulebook-artwork-slot {
            position: absolute !important;
            left: ${RULEBOOK_ARTWORK.leftPt}pt !important;
            top: ${RULEBOOK_ARTWORK.topPt}pt !important;
            width: ${RULEBOOK_ARTWORK.widthMm}mm !important;
            height: ${RULEBOOK_ARTWORK.heightMm}mm !important;
          }
          html.pdf-export .rulebook-artwork-slot .a5-manual-root,
          html.pdf-export .rulebook-artwork-slot .a5-sheet {
            width: 100% !important;
            height: 100% !important;
            max-width: none !important;
            max-height: none !important;
            margin: 0 !important;
          }

          @media print {
            @page {
              size: ${RULEBOOK_FACTORY_SHEET.widthMm}mm ${RULEBOOK_FACTORY_SHEET.heightMm}mm !important;
              margin: 0 !important;
            }
            html:has(.rulebook-factory-root),
            html:has(.rulebook-factory-root) body {
              margin: 0 !important;
              padding: 0 !important;
              background: white !important;
              width: ${RULEBOOK_FACTORY_SHEET.widthMm}mm !important;
              height: ${RULEBOOK_FACTORY_SHEET.heightMm}mm !important;
              overflow: hidden !important;
            }
            .print-hidden {
              display: none !important;
            }
            .print-sheet-container {
              display: block !important;
              margin: 0 !important;
              padding: 0 !important;
              width: ${RULEBOOK_FACTORY_SHEET.widthMm}mm !important;
              height: auto !important;
              overflow: visible !important;
            }
            .manual-factory-page {
              position: relative !important;
              top: 0 !important;
              left: 0 !important;
              width: ${RULEBOOK_FACTORY_SHEET.widthPt}pt !important;
              height: ${RULEBOOK_FACTORY_SHEET.heightPt}pt !important;
              box-shadow: none !important;
              margin: 0 !important;
              padding: 0 !important;
              page-break-after: always !important;
              page-break-inside: avoid !important;
              break-after: page !important;
              background: transparent !important;
            }
            .manual-factory-page:last-child {
              page-break-after: auto !important;
              break-after: auto !important;
            }
          }
        `,
        }}
      />
    </div>
  );
}

export default function RulebookFactorySheetPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-900" />}>
      <RulebookFactorySheetContent />
    </Suspense>
  );
}
