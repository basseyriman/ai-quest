"use client";

import React from 'react';
import { Orbitron } from "next/font/google";
import { Printer, Cloud } from 'lucide-react';
import { EngineerPrintCard } from '@/components/print/EngineerPrintCard';
import { PrintCardBackPages } from '@/components/print/PrintCardBackPages';
import { PRINT_DECK_STYLE_BLOCK } from '@/components/print/pdfExportStyles';
import { RETAIL_ENGINEER_DECK } from '@/lib/engineer-mode/cards';

const orbitron = Orbitron({ subsets: ["latin"] });

export default function DeploymentPrintPage() {
    // Filter only the DEPLOYMENT cards (dep_1 to dep_7)
    const deploymentCards = RETAIL_ENGINEER_DECK.filter(card => card.category === "DEPLOYMENT");

    return (
        <div className="print-export-root print-export-ready min-h-screen bg-[#f4f4f5] flex flex-col items-center py-12 px-4 print:bg-white print:p-0">
            <style dangerouslySetInnerHTML={{ __html: PRINT_DECK_STYLE_BLOCK }} />

            <div className="print-hidden mb-12 text-center max-w-2xl pb-12 transition-all">
                <div className="flex justify-center mb-4">
                    <div className="p-3 bg-[#f0fdfa] border border-[#ccfbf1] rounded-2xl">
                        <Cloud className="w-8 h-8 text-[#0f766e]" />
                    </div>
                </div>
                <h1 className={`text-4xl font-black mb-4 text-[#0f172a] ${orbitron.className} tracking-tighter uppercase`}>
                    DEPLOYMENT DECK
                </h1>
                <p className="text-gray-500 text-lg mb-8 uppercase tracking-[0.2em] font-bold italic text-center leading-relaxed">
                    {">"} ASSET_CLASS: DEPLOYMENT_FLOWS<br/>
                    {">"} UNIT_COUNT: {deploymentCards.length} CARDS
                </p>
                <div className="flex gap-4 justify-center">
                    <button 
                        onClick={() => window.print()} 
                        className="bg-[#0f172a] hover:bg-[#1e293b] text-white px-12 py-4 rounded-full font-bold shadow-xl transition-all flex items-center gap-3 active:scale-95 uppercase tracking-widest"
                    >
                        <Printer className="w-5 h-5" />
                        Execute Print Job
                    </button>
                    <a 
                        href="/print-cards/data-collection" 
                        className="bg-[#334155] hover:bg-[#475569] text-white px-8 py-4 rounded-full font-bold transition-all flex items-center gap-2 uppercase tracking-widest"
                    >
                        Data Collection
                    </a>
                </div>
            </div>

            <div className="flex flex-col items-center w-full">
                {Array.from({ length: Math.ceil(deploymentCards.length / 6) }).map((_, pageIndex) => (
                    <div 
                        key={pageIndex} 
                        style={{ backgroundColor: '#ffffff' }}
                        className="flex justify-center items-center w-[210mm] h-[297mm] relative page-break mb-32 print:mb-0 print:shadow-none shadow-2xl"
                    >
                        <div className="grid grid-cols-2 grid-rows-[repeat(3,88.9mm)] gap-[4mm] p-[5mm]">
                            {deploymentCards.slice(pageIndex * 6, (pageIndex + 1) * 6).map((card) => (
                                <div key={card.id} className="flex justify-center items-center p-1 border-[0.2px] border-zinc-100 border-dashed">
                                    <EngineerPrintCard card={card} />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
                <PrintCardBackPages totalCards={deploymentCards.length} />
            </div>
        </div>
    );
}
