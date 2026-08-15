"use client";

import React from 'react';
import { Playfair_Display, Orbitron } from "next/font/google";

const playfair = Playfair_Display({ weight: ['400', '600', '700', '800'], subsets: ["latin"] });
const orbitron = Orbitron({ subsets: ["latin"] });

interface MilestoneCardProps {
    id?: string;
    title: string;
    description: string;
    points: string;
}

export const MilestoneCard: React.FC<MilestoneCardProps> = ({ id, title, description, points }) => {
    // Extract numeric match ID (e.g. ms-1 -> 1)
    const matchNumber = id ? id.replace(/\D/g, '') : '';

    return (
        <div className="w-[66mm] h-[91mm] box-border card-border bg-[#dc2626] rounded-[3.5mm] relative p-[4.5mm] shrink-0 print:shadow-none print-color-artifact" style={{boxShadow: '0 0 0 1px rgba(255,255,255,0.08), 0 8px 32px rgba(0,0,0,0.8), 0 2px 8px rgba(0,0,0,0.6)', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact'}}>
            
            {/* Inner White Box */}
            <div className="w-full h-full bg-[#fcfcfc] rounded-[1.5mm] border-[0.5px] border-black/10 flex flex-col overflow-hidden relative">
                
                {/* Match Identifier - Sized with [22px] to prevent browser-specific squishing and shifted top-2.5/left-2.5 for breathing room */}
                {matchNumber && (
                    <div className="absolute top-2.5 left-2.5 bg-[#dc2626]/10 border border-[#dc2626]/30 rounded-full w-[22px] h-[22px] flex items-center justify-center z-20 shadow-sm">
                        <span className={`${orbitron.className} text-[10px] font-black text-[#991b1b] leading-none`}>
                            {matchNumber
                        }</span>
                    </div>
                )}

                {/* Top Section: Logo & Title */}
                <div className="flex flex-col items-center pt-1.5 px-[2mm] shrink-0 z-10">
                    <div className="mb-1.5">
                        <img 
                            src="/ai_quest_logo_clean.png" 
                            className="w-[10mm] h-auto opacity-100" 
                            alt="AI QUEST" 
                        />
                    </div>

                    <div className="text-center mb-1 leading-[1.05] shrink-0 w-full px-2 min-h-[38px] flex items-center justify-center">
                        <h2 className={`${playfair.className} text-[13px] font-[900] text-[#0a0a0a] tracking-tight uppercase leading-[1.1] text-center`}>
                            {title}
                        </h2>
                    </div>
                </div>

                {/* Middle Content: Icon + Description */}
                <div className="flex-1 flex flex-col items-center justify-center px-[3.5mm] pt-0.5 pb-0 min-h-0 overflow-hidden z-10">
                    <div className="w-full flex justify-center mb-1.5 shrink-0">
                        <div className="bg-[#fef2f2] w-[42px] h-[42px] flex items-center justify-center rounded-2xl border border-[#dc2626]/20 shadow-inner">
                            <span className="text-[22px] leading-none">🏆</span>
                        </div>
                    </div>

                    <div className="text-center px-2 shrink min-h-0 overflow-hidden">
                        <p className={`${playfair.className} text-[9.5px] font-[700] text-[#111] leading-[1.15]`}>
                            {description}
                        </p>
                    </div>
                </div>

                {/* IP Badge — own row, clear gap above footer bar */}
                <div className="flex justify-center items-center shrink-0 w-full pt-[1mm] pb-[2.5mm] z-10">
                    <div className="rounded-full w-[10mm] h-[10mm] flex items-center justify-center shadow-md border border-white/5" style={{ backgroundColor: '#111111', color: '#ffffff' }}>
                        <div className="flex flex-col items-center justify-center leading-none">
                            <span className={`${playfair.className} text-[13px] font-[900] tracking-tighter`}>
                                {points.toString().replace(/[a-zA-Z\s]/g, '') || '0'}
                            </span>
                            <span className={`${orbitron.className} text-[5.5px] font-[900] tracking-[0.1em] -mt-0.5 uppercase`}>
                                IP
                            </span>
                        </div>
                    </div>
                </div>

                {/* Footer Section: Rigidly Pinned to Bottom */}
                <div className="w-full flex flex-col shrink-0 bg-white">
                    <div className="w-full py-[0.8mm] text-center" style={{ backgroundColor: '#dc2626' }}>
                        <span className="text-[10px] font-sans font-[900] tracking-[0.25em] leading-none uppercase" style={{ color: '#ffffff' }}>
                            MILESTONE CARD
                        </span>
                    </div>
                    
                    {/* Branding Area */}
                    <div className="w-full bg-white pt-[1mm] pb-[1mm] text-center px-4 overflow-visible">
                        <p className={`${playfair.className} text-[7px] font-[700] text-[#333] leading-none`}>
                            Major achievements towards winning
                        </p>
                        <p className={`${orbitron.className} text-[4.5px] font-[900] text-[#888] uppercase tracking-[0.15em] mt-1`}>
                            CREATED BY BASSEY RIMAN<br/>PROPERTY OF RIMANSTECH INDUSTRIES
                        </p>
                    </div>
                </div>
            </div>

        </div>
    );
};
