"use client";

import React from "react";
import { Orbitron } from "next/font/google";
import { Printer, Trophy } from "lucide-react";
import { MilestoneCard } from "@/components/print/MilestoneCard";
import {
    PrintCardBackPages,
    PRINT_BACK_GRID_TIGHT_CLASS,
} from "@/components/print/PrintCardBackPages";
import { PRINT_DECK_STYLE_BLOCK } from "@/components/print/pdfExportStyles";
import { MILESTONE_CARDS } from "@/lib/engineer-mode/milestones";

const orbitron = Orbitron({ subsets: ["latin"] });

export default function MilestonesPrintPage() {
    return (
        <div className="print-export-root print-export-ready min-h-screen bg-[#f0f0f0] flex flex-col items-center py-12 px-4 print:bg-white print:p-0">
            <style dangerouslySetInnerHTML={{ __html: PRINT_DECK_STYLE_BLOCK }} />

            <div className="print-hidden mb-12 text-center max-w-2xl text-gray-900 pb-12 transition-all">
                <div className="flex justify-center mb-4">
                    <div className="p-3 bg-blue-600/10 rounded-2xl border border-blue-500/20">
                        <Trophy className="w-8 h-8 text-blue-600" />
                    </div>
                </div>
                <h1
                    className={`text-4xl font-black mb-4 text-blue-600 ${orbitron.className} tracking-tighter uppercase`}
                >
                    Milestone Deck (Master Edition)
                </h1>
                <p className="text-gray-600 text-lg mb-8 uppercase tracking-[0.2em] font-bold italic text-center leading-relaxed">
                    {">"} ASSET_CLASS: CORE_ACHIEVEMENTS
                    <br />
                    {">"} UNIT_COUNT: {MILESTONE_CARDS.length} CARDS
                </p>
                <div className="flex gap-4 justify-center">
                    <button
                        onClick={() => window.print()}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-12 py-4 rounded-full font-bold shadow-xl transition-all flex items-center gap-3 active:scale-95 uppercase tracking-widest"
                    >
                        <Printer className="w-5 h-5" />
                        Execute Print Job
                    </button>
                    <a
                        href="/print-cards/system-objectives"
                        className="bg-yellow-600 hover:bg-yellow-500 text-white px-8 py-4 rounded-full font-bold transition-all flex items-center gap-2 uppercase tracking-widest"
                    >
                        Objectives
                    </a>
                </div>
            </div>

            <div className="flex flex-col items-center w-full">
                {Array.from({ length: Math.ceil(MILESTONE_CARDS.length / 6) }).map(
                    (_, pageIndex) => {
                        const pageCards = MILESTONE_CARDS.slice(
                            pageIndex * 6,
                            (pageIndex + 1) * 6
                        );
                        return (
                            <div
                                key={pageIndex}
                                className="grid grid-cols-2 grid-rows-[repeat(3,88.9mm)] gap-[2mm] p-[2mm] bg-white text-black w-full max-w-[210mm] h-[297mm] overflow-hidden relative page-break mb-32 print:mb-0 shadow-2xl print:shadow-none"
                            >
                                {pageCards.map((card) => (
                                    <div
                                        key={card.id}
                                        className="flex justify-center items-center break-inside-avoid print:break-inside-avoid"
                                    >
                                        <MilestoneCard
                                            id={card.id.replace("_", "-")}
                                            title={card.name}
                                            description={card.description}
                                            points={String(card.ipValue)}
                                        />
                                    </div>
                                ))}
                            </div>
                        );
                    }
                )}
                <PrintCardBackPages
                    totalCards={MILESTONE_CARDS.length}
                    pageClassName="flex justify-center items-center w-full max-w-[210mm] h-[297mm] overflow-hidden relative page-break mb-32 print:mb-0 shadow-2xl print:shadow-none bg-white"
                    gridClassName={PRINT_BACK_GRID_TIGHT_CLASS}
                    cellClassName="flex justify-center items-center break-inside-avoid print:break-inside-avoid"
                />
            </div>
        </div>
    );
}
