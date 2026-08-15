"use client";

import React from 'react';
import { Orbitron } from "next/font/google";
import { Printer, Settings } from 'lucide-react';
import { EngineerPrintCard } from '@/components/print/EngineerPrintCard';
import { PrintCardBackPages } from '@/components/print/PrintCardBackPages';
import { PRINT_DECK_STYLE_BLOCK } from '@/components/print/pdfExportStyles';
import { RETAIL_ENGINEER_DECK, RETAIL_ENGINEER_DECK_SIZE, PLAYABLE_ENGINEER_CARDS } from '@/lib/engineer-mode/cards';
import { EngineerRuleBook, EngineerRuleCard } from '@/components/print/EngineerRuleCard';

const orbitron = Orbitron({ subsets: ["latin"] });

export default function EngineerModePrintPage() {
    const deckToPrint = RETAIL_ENGINEER_DECK;

    return (
        <div
            className="print-export-root print-export-ready min-h-screen flex flex-col items-center py-12 px-4 print:bg-white print:p-0"
            style={{ backgroundColor: '#f4f4f5' }}
        >
            <style dangerouslySetInnerHTML={{ __html: PRINT_DECK_STYLE_BLOCK }} />

            <div className="print-hidden mb-12 text-center max-w-2xl pb-12 transition-all">
                <div className="flex justify-center mb-4">
                    <div style={{ backgroundColor: '#e4e4e7', borderColor: '#d4d4d8' }} className="p-3 rounded-2xl border">
                        <Settings style={{ color: '#18181b' }} className="w-8 h-8" />
                    </div>
                </div>
                <h1 
                    style={{ color: '#000000' }}
                    className={`text-4xl font-black mb-4 ${orbitron.className} tracking-tighter uppercase`}
                >
                    ENGINEER MODE DECK
                </h1>
                <p style={{ color: '#71717a' }} className="text-lg mb-8 uppercase tracking-[0.2em] font-bold italic text-center leading-relaxed">
                    {">"} ASSET_CLASS: RETAIL_EDITION_DECK<br/>
                    {">"} UNIT_COUNT: {RETAIL_ENGINEER_DECK_SIZE} TOTAL CARDS ({PLAYABLE_ENGINEER_CARDS.length} UNIQUE)
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                    <button 
                        onClick={() => window.print()} 
                        style={{ backgroundColor: '#000000', color: '#ffffff' }}
                        className="px-12 py-4 rounded-full font-bold shadow-xl transition-all flex items-center gap-3 active:scale-95 uppercase tracking-widest"
                    >
                        <Printer className="w-5 h-5" />
                        Execute Print Job
                    </button>
                    <a 
                        href="/engineer-mode" 
                        style={{ color: '#000000', borderBottom: '2px solid #000000' }}
                        className="font-bold transition-all flex items-center gap-2 uppercase tracking-widest pb-1"
                    >
                        Return to Game
                    </a>
                </div>
            </div>

            <div className="flex flex-col items-center w-full">
                {/* PAGE 1: THE RULEBOOK */}
                <div 
                    style={{ backgroundColor: '#ffffff', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
                    className="page-break mb-32 print:mb-0 print:shadow-none w-[210mm] h-[297mm] overflow-hidden"
                >
                    <EngineerRuleBook />
                </div>

                {/* PAGE 2: PLAYER REFERENCE CARDS (4 Per Page) */}
                <div 
                    style={{ backgroundColor: '#ffffff', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
                    className="page-break mb-32 print:mb-0 print:shadow-none w-[210mm] h-[297mm] grid grid-cols-2 grid-rows-2 gap-[5mm] p-[10mm] overflow-hidden"
                >
                    <EngineerRuleCard />
                    <EngineerRuleCard />
                    <EngineerRuleCard />
                    <EngineerRuleCard />
                </div>

                {/* RETAIL ENGINEER DECK (rarity duplicates) */}
                {Array.from({ length: Math.ceil(deckToPrint.length / 6) }).map((_, pageIndex) => (
                    <div 
                        key={pageIndex} 
                        style={{ backgroundColor: '#ffffff' }}
                        className="flex justify-center items-center w-[210mm] h-[297mm] relative page-break mb-32 print:mb-0 print:shadow-none"
                    >
                        <div className="grid grid-cols-2 grid-rows-[repeat(3,88.9mm)] gap-[4mm] p-[5mm] border-[0.5px] border-dashed border-zinc-200">
                            {deckToPrint.slice(pageIndex * 6, (pageIndex + 1) * 6).map((card) => (
                                <div key={card.id} className="flex justify-center items-center p-1 border-[0.2px] border-zinc-100 border-dashed">
                                    <EngineerPrintCard card={card} />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
                <PrintCardBackPages
                    totalCards={deckToPrint.length}
                    gridClassName="grid grid-cols-2 grid-rows-[repeat(3,88.9mm)] gap-[4mm] p-[5mm] border-[0.5px] border-dashed border-zinc-200"
                />
            </div>
        </div>
    );
}
