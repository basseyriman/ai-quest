"use client";

import React from 'react';
import { Playfair_Display, Orbitron } from "next/font/google";
import * as LucideIcons from 'lucide-react';
import { LucideIcon } from 'lucide-react';

const playfair = Playfair_Display({ weight: ['400', '600', '700', '800'], subsets: ["latin"] });
const orbitron = Orbitron({ subsets: ["latin"] });

interface SystemObjectiveCardProps {
    id?: string;
    title: string;
    description: string;
    iconName?: string;
}

export const SystemObjectiveCard: React.FC<SystemObjectiveCardProps> = ({ id, title, description, iconName = "Target" }) => {
    // Dynamically get the icon component from Lucide
    const IconComponent = (LucideIcons as any)[iconName] as LucideIcon || LucideIcons.ShieldAlert;

    // Extract numeric match ID (e.g. obj-1 -> 1)
    const matchNumber = id ? id.replace(/\D/g, '') : '';

    return (
        <div className="w-[66mm] h-[91mm] box-border card-border bg-[#eab308] rounded-[3.5mm] relative p-[4.5mm] shrink-0 print:shadow-none print-color-artifact" style={{boxShadow: '0 0 0 1px rgba(255,255,255,0.08), 0 8px 32px rgba(0,0,0,0.8), 0 2px 8px rgba(0,0,0,0.6)', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact'}}>
            
            {/* Inner White Box */}
            <div className="w-full h-full bg-[#fcfcfc] rounded-[1.5mm] border-[0.5px] border-black/10 flex flex-col overflow-hidden relative">
                
                {/* Match Identifier - Sized with [22px] to prevent browser-specific squishing and shifted top-2.5/left-2.5 for breathing room */}
                {matchNumber && (
                    <div className="absolute top-2.5 left-2.5 bg-[#eab308]/10 border border-[#eab308]/30 rounded-full w-[22px] h-[22px] flex items-center justify-center z-20 shadow-sm">
                        <span className={`${orbitron.className} text-[10px] font-black text-[#a16207] leading-none`}>
                            {matchNumber}
                        </span>
                    </div>
                )}
                
                {/* Top Section: Logo & Title (Synced with other cards: 9mm width) */}
                <div className="flex flex-col items-center pt-1 px-[2mm] shrink-0">
                    <div className="mb-0.5">
                        <img 
                            src="/ai_quest_logo_clean.png" 
                            className="w-[9mm] h-auto opacity-100" 
                            alt="AI QUEST" 
                        />
                    </div>

                    <div className="text-center mb-1 leading-[1.05] shrink-0 w-full px-2 min-h-[34px] flex items-center justify-center text-balance">
                        <h2 className={`${playfair.className} text-[15px] font-[900] text-[#0a0a0a] tracking-tight uppercase leading-[1.1]`}>
                            {title}
                        </h2>
                    </div>
                </div>

                {/* Middle Content: Icon -> Logic */}
                <div className="flex-1 flex flex-col items-center justify-center px-[3.5mm] py-0.5 min-h-0">
                    {/* CUSTOM OBJECTIVE ICON - Simple Square as per reference */}
                    <div className="w-full flex justify-center mb-3 shrink-0">
                        <div className="border border-[#111] p-[3mm] rounded-sm">
                            <IconComponent size={32} strokeWidth={2.5} className="text-[#111]" />
                        </div>
                    </div>

                    {/* Logic Text */}
                    <div className="text-center mb-1.5 px-3 shrink-0">
                        <p className={`${playfair.className} text-[10.5px] font-[700] text-[#111] leading-[1.2]`}>
                            {description}
                        </p>
                    </div>
                </div>

                {/* Footer Section: Split Footer as per high-res reference image */}
                <div className="w-full flex flex-col shrink-0 mt-auto bg-white">
                    <div className="w-full py-[1.2mm] text-center border-t border-[#a16207]" style={{ backgroundColor: '#eab308' }}>
                        <span className="text-[10px] font-sans font-[900] tracking-[0.25em] leading-none uppercase" style={{ color: '#ffffff' }}>
                            SYSTEM OBJECTIVE
                        </span>
                    </div>
                    
                    {/* Branding Area: Clean White Area */}
                    <div className="w-full pb-3 pt-2 text-center px-4 overflow-visible">
                        <p className={`${orbitron.className} text-[4.5px] font-[900] text-[#888] uppercase tracking-[0.15em] mt-1`}>
                            CREATED BY BASSEY RIMAN<br/>PROPERTY OF RIMANSTECH INDUSTRIES
                        </p>
                    </div>
                </div>
            </div>

        </div>
    );
};
