"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Orbitron } from "next/font/google";
import { SystemObjectiveCard } from "@/components/print/SystemObjectiveCard";
import { MilestoneCard } from "@/components/print/MilestoneCard";
import { EngineerRuleCard } from "@/components/print/EngineerRuleCard";
import { IpScoreTracker } from "@/components/print/IpScoreTracker";
import { EngineerPrintCard } from "@/components/print/EngineerPrintCard";
import { PrintCardBack } from "@/components/print/PrintCardBack";
import { RETAIL_ENGINEER_DECK } from "@/lib/engineer-mode/cards";
import { MILESTONE_CARDS } from "@/lib/engineer-mode/milestones";
import { OBJECTIVE_DECK } from "@/lib/engineer-mode/cards";

const orbitron = Orbitron({ subsets: ["latin"] });

// 15 System Objectives Icons
const OBJECTIVE_ICONS = [
  "ShieldAlert", "Sparkles", "Activity", "Car", "CloudRain", "Globe",
  "TrendingUp", "Mic", "Skull", "Zap", "Tag", "ScanFace",
  "MessageSquare", "Navigation", "Briefcase"
];

// Assemble the master deck in a stable sequence
const ALL_CARDS: {
  id: string;
  type: "engineer" | "objective" | "milestone" | "reference";
  front: React.ReactNode;
}[] = [
  // 1. Objectives (15 cards)
  ...OBJECTIVE_DECK.map((card, idx) => ({
    id: `obj-${idx}`,
    type: "objective" as const,
    front: (
      <SystemObjectiveCard
        id={`obj-${idx + 1}`}
        title={card.name}
        description={card.description}
        iconName={OBJECTIVE_ICONS[idx] || "Target"}
      />
    ),
  })),
  // 2. Milestones (15 cards)
  ...MILESTONE_CARDS.map((card, idx) => ({
    id: `ms-${idx}`,
    type: "milestone" as const,
    front: (
      <MilestoneCard
        id={`ms-${idx + 1}`}
        title={card.name}
        description={card.description}
        points={String(card.ipValue)}
      />
    ),
  })),
  // 3. IP Scorecards (8 cards)
  ...Array.from({ length: 8 }).map((_, idx) => ({
    id: `score-${idx}`,
    type: "reference" as const,
    front: <IpScoreTracker playerNumber={idx + 1} />,
  })),
  // 4. Engineer Deck (210 cards)
  ...RETAIL_ENGINEER_DECK.map((card, idx) => ({
    id: `eng-${idx}`,
    type: "engineer" as const,
    front: <EngineerPrintCard card={card} />,
  })),
];

// Grid Layout Geometry Constants (in pt)
// Sheet is 1376mm x 673mm
const SHEET_WIDTH = 3900.5;
const SHEET_HEIGHT = 1907.7;

const CARD_W = 187.09;
const CARD_H = 257.95;

const COL_STEP = 187.09;
const ROW_STEP = 257.95;

const BACKS_X_START = 50;
const FRONTS_X_START = 50 + 10 * 187.09 + 50; // 1970.9
const Y_START = 50;

const TOTAL_SLOTS = 70; // 10x7
const CARDS_PER_SHEET = 62; // 248 / 4
const BLANK_SLOTS = TOTAL_SLOTS - CARDS_PER_SHEET;

function FactorySheet({ sheetIndex, noBg }: { sheetIndex: number; noBg: boolean }) {
  const startIndex = sheetIndex * CARDS_PER_SHEET;
  const sheetCards = ALL_CARDS.slice(startIndex, startIndex + CARDS_PER_SHEET);

  const activeSlotsFronts: { row: number; col: number; cardIndex: number | null }[] = [];
  
  // Initialize all 70 slots with null
  for (let row = 0; row < 7; row++) {
    for (let col = 0; col < 10; col++) {
      activeSlotsFronts.push({ row, col, cardIndex: null });
    }
  }

  // Fill slots in column-major order, skipping the first 8 slots (row 0, col 0-7)
  let cardCounter = 0;
  for (let col = 0; col < 10; col++) {
    for (let row = 0; row < 7; row++) {
      const slotIndex = row * 10 + col;
      if (slotIndex >= BLANK_SLOTS && cardCounter < CARDS_PER_SHEET) {
        const targetSlot = activeSlotsFronts.find(s => s.row === row && s.col === col);
        if (targetSlot) {
          targetSlot.cardIndex = cardCounter++;
        }
      }
    }
  }

  return (
    <div
      className="factory-sheet relative bg-white text-black shrink-0 overflow-hidden shadow-2xl print:shadow-none print:mb-0 mb-20 page-break"
      style={{
        width: `${SHEET_WIDTH}pt`,
        height: `${SHEET_HEIGHT}pt`,
        backgroundImage: noBg ? "none" : "url('/templates/cards_template.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        WebkitPrintColorAdjust: "exact",
        printColorAdjust: "exact",
      }}
    >
      {activeSlotsFronts.map((slot, sIdx) => {
        if (slot.cardIndex === null) return null;
        
        const card = sheetCards[slot.cardIndex];
        if (!card) return null;

        // Front Slot Coordinates (col 0 is far right)
        const leftFront = FRONTS_X_START + (9 - slot.col) * COL_STEP;
        const topFront = Y_START + slot.row * ROW_STEP;

        // Back Slot Coordinates (col 0 is far left)
        const leftBack = BACKS_X_START + slot.col * COL_STEP;
        const topBack = Y_START + slot.row * ROW_STEP;

        return (
          <React.Fragment key={card.id}>
            {/* Front Card slot */}
            <div
              className="absolute overflow-hidden flex items-center justify-center"
              style={{
                left: `${leftFront}pt`,
                top: `${topFront}pt`,
                width: `${CARD_W}pt`,
                height: `${CARD_H}pt`,
              }}
            >
              {card.front}
            </div>

            {/* Back Card slot */}
            <div
              className="absolute overflow-hidden flex items-center justify-center"
              style={{
                left: `${leftBack}pt`,
                top: `${topBack}pt`,
                width: `${CARD_W}pt`,
                height: `${CARD_H}pt`,
              }}
            >
              <PrintCardBack />
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}

function FactorySheetsContent() {
  const searchParams = useSearchParams();
  const sheetParam = searchParams.get("sheet");
  const noBg = searchParams.get("no-bg") === "1";

  const singleSheetIndex = sheetParam !== null ? parseInt(sheetParam, 10) : null;
  const sheetsToRender =
    singleSheetIndex !== null && singleSheetIndex >= 0 && singleSheetIndex < 4
      ? [singleSheetIndex]
      : [0, 1, 2, 3];

  return (
    <div className="min-h-screen bg-zinc-900 py-10 px-4 print:bg-white print:p-0 print:py-0 flex flex-col items-center">
      {/* Print Hub Header Banner (Hidden on print) */}
      <div className="print-hidden max-w-4xl w-full mb-10 text-white flex flex-col items-center text-center">
        <h1
          className={`text-4xl font-black mb-3 bg-gradient-to-r from-cyan-400 to-rose-400 bg-clip-text text-transparent ${orbitron.className}`}
        >
          Factory Printing Sheets
        </h1>
        <p className="text-gray-400 text-sm max-w-xl mb-6">
          High-resolution cards arranged on HeroTime's official 10×7 template sheets (70-slots total, max 65 cards).
          Includes crop margins, bleed outlines, and registration alignments.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <button
            onClick={() => window.print()}
            className="bg-cyan-500 hover:bg-cyan-400 text-black px-10 py-3 rounded-full font-bold uppercase tracking-widest text-xs"
          >
            Print Sheets to PDF
          </button>
          <Link
            href="/print-cards"
            className="bg-zinc-800 hover:bg-zinc-700 text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest text-xs"
          >
            Print Hub
          </Link>
        </div>

        <div className="flex gap-2 mt-6 justify-center flex-wrap">
          <Link
            href="/print-cards/factory-sheets"
            className={`px-4 py-1.5 rounded-full text-xs font-bold ${
              singleSheetIndex === null ? "bg-cyan-500 text-black" : "bg-zinc-800 text-zinc-400"
            }`}
          >
            All Sheets
          </Link>
          {[0, 1, 2, 3].map((num) => (
            <Link
              key={num}
              href={`/print-cards/factory-sheets?sheet=${num}`}
              className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                singleSheetIndex === num ? "bg-cyan-500 text-black" : "bg-zinc-800 text-zinc-400"
              }`}
            >
              Sheet {num + 1}
            </Link>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          @media print {
            @page {
              size: 1376mm 673mm;
              margin: 0;
            }
            html, body {
              margin: 0 !important;
              padding: 0 !important;
              background: white !important;
              width: 1376mm !important;
              height: 673mm !important;
            }
            .print-hidden {
              display: none !important;
            }
            .print-sheet-container {
              display: block !important;
              margin: 0 !important;
              padding: 0 !important;
              width: 1376mm !important;
              height: 673mm !important;
            }
            .factory-sheet {
              position: relative !important;
              top: 0 !important;
              left: 0 !important;
              width: 3900.5pt !important;
              height: 1907.7pt !important;
              box-shadow: none !important;
              margin: 0 !important;
              padding: 0 !important;
              page-break-after: always !important;
              page-break-inside: avoid !important;
              break-after: page !important;
            }
          }
        `
      }} />

      {/* Pages Container */}
      <div className="print-sheet-container flex flex-col items-center">
        {sheetsToRender.map((num) => (
          <FactorySheet key={num} sheetIndex={num} noBg={noBg} />
        ))}
      </div>
    </div>
  );
}

export default function FactorySheetsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-900" />}>
      <FactorySheetsContent />
    </Suspense>
  );
}
