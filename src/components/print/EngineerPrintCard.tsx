"use client";

import React from 'react';
import { Playfair_Display, Orbitron } from "next/font/google";
import { 
    Target, Database, Wrench, LineChart, Settings, 
    Cpu, CheckCircle, Cloud, Activity, AlertTriangle, 
    Shield, Trophy, Scale 
} from 'lucide-react';
import { EngineerCard } from '@/types/engineer-mode';

const playfair = Playfair_Display({ weight: ['400', '600', '700', '800'], subsets: ["latin"] });
const orbitron = Orbitron({ subsets: ["latin"] });

interface EngineerPrintCardProps {
    card: EngineerCard;
}

export const EngineerPrintCard: React.FC<EngineerPrintCardProps> = ({ card }) => {
    
    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'SYSTEM OBJECTIVE': return "#eab308"; // Yellow
            case 'DATA SOURCE':
            case 'DATA COLLECTION': return "#334155"; // Slate
            case 'DATA CLEANING':
            case 'DATA PREPARATION': return "#0ea5e9"; // Sky Blue
            case 'EXPLORATORY ANALYSIS': return "#8b5cf6"; // Violet
            case 'FEATURE ENGINEERING': return "#ec4899"; // Pink
            case 'MODEL':
            case 'MODEL SELECTION': return "#9333ea"; // Purple
            case 'MODEL TRAINING': return "#be123c"; // Deep Rose
            case 'VALIDATION':
            case 'MODEL EVALUATION': return "#d946ef"; // Fuchsia
            case 'DEPLOYMENT': return "#0f766e"; // Teal
            case 'MONITORING': return "#10b981"; // Emerald
            case 'CHALLENGE': return "#f97316"; // Orange
            case 'LOGIC': return "#dc2626"; // Alert Red
            case 'ETHICS': return "#16a34a"; // Green
            case 'MILESTONE': return "#2563eb"; // Royal Blue
            default: return "#0a0a0a";
        }
    };

    const categoryColor = getCategoryColor(card.category);
    
    // Extract base numeric ID (e.g. col_1_copy_0 -> 1)
    const baseId = card.id ? card.id.split('_')[0] : '';
    const matchNumber = baseId ? baseId.replace(/\D/g, '') : '';

    // Map categories to icons
    const getIcon = () => {
        const iconProps = { size: 24, strokeWidth: 2.5, style: { color: categoryColor } };
        switch (card.category) {
            case "SYSTEM OBJECTIVE": return <Target {...iconProps} />;
            case "DATA SOURCE":
            case "DATA COLLECTION": return <Database {...iconProps} />;
            case "DATA CLEANING":
            case "DATA PREPARATION": return <Wrench {...iconProps} />;
            case "EXPLORATORY ANALYSIS": return <LineChart {...iconProps} />;
            case "FEATURE ENGINEERING": return <Settings {...iconProps} />;
            case "MODEL":
            case "MODEL SELECTION":
            case "MODEL TRAINING": return <Cpu {...iconProps} />;
            case "VALIDATION":
            case "MODEL EVALUATION": return <CheckCircle {...iconProps} />;
            case "DEPLOYMENT": return <Cloud {...iconProps} />;
            case "MONITORING": return <Activity {...iconProps} />;
            case "CHALLENGE": return <AlertTriangle {...iconProps} />;
            case "LOGIC": return <Scale {...iconProps} />;
            case "ETHICS": return <Shield {...iconProps} />;
            case "MILESTONE": return <Trophy {...iconProps} />;
            default: return <Database {...iconProps} />;
        }
    };

    const getBannerText = (category: string) => {
        switch (category) {
            case 'SYSTEM OBJECTIVE': return "SYSTEM OBJECTIVE";
            case 'DATA SOURCE':
            case 'DATA COLLECTION': return "DATA COLLECTION CARD";
            case 'DATA CLEANING':
            case 'DATA PREPARATION': return "DATA PREPARATION CARD";
            case 'EXPLORATORY ANALYSIS': return "ANALYSIS CARD";
            case 'FEATURE ENGINEERING': return "FEATURE CARD";
            case 'MODEL': return "MODEL CARD";
            case 'MODEL SELECTION': return "MODEL SELECTION CARD";
            case 'MODEL TRAINING': return "MODEL TRAINING CARD";
            case 'VALIDATION': return "VALIDATION CARD";
            case 'MODEL EVALUATION': return "MODEL EVALUATION CARD";
            case 'DEPLOYMENT': return "DEPLOYMENT CARD";
            case 'MONITORING': return "MONITORING CARD";
            case 'CHALLENGE': return "CHALLENGE CARD";
            case 'LOGIC': return "PEER REVIEW CARD";
            case 'ETHICS': return "ETHICS CARD";
            case 'MILESTONE': return "MILESTONE CARD";
            default: return "ENGINEER CARD";
        }
    };

    return (
        <div className="w-[66mm] h-[91mm] box-border card-border rounded-[3.5mm] relative p-[4.5mm] shrink-0 print:shadow-none print-color-artifact" style={{ backgroundColor: categoryColor, boxShadow: '0 0 0 1px rgba(255,255,255,0.08), 0 8px 32px rgba(0,0,0,0.8), 0 2px 8px rgba(0,0,0,0.6)', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
            
            {/* Inner White Box */}
            <div className="w-full h-full bg-[#fcfcfc] rounded-[1.5mm] border-[0.5px] border-black/10 flex flex-col overflow-hidden relative">
                
                {/* Match Identifier - Sized with [22px] to prevent browser-specific squishing and shifted top-2.5/left-2.5 for breathing room */}
                {matchNumber && (
                    <div 
                        style={{ 
                            backgroundColor: `${categoryColor}1a`, 
                            borderColor: `${categoryColor}4d`, 
                        }}
                        className="absolute top-2.5 left-2.5 border rounded-full w-[22px] h-[22px] flex items-center justify-center z-20 shadow-sm"
                    >
                        <span 
                            style={{ color: categoryColor }} 
                            className={`${orbitron.className} text-[10px] font-black leading-none`}
                        >
                            {matchNumber}
                        </span>
                    </div>
                )}
                
                {/* Top Section: Logo & Title */}
                <div className="flex flex-col items-center pt-1 px-[2mm] shrink-0">
                    <div className="mb-0.5">
                        <img 
                            src="/ai_quest_logo_clean.png" 
                            className="w-[9mm] h-auto opacity-100" 
                            alt="AI QUEST" 
                        />
                    </div>

                    {/* Category Tag badge */}
                    <div style={{ border: `0.4px solid ${categoryColor}`, paddingLeft: '5px', paddingRight: '5px', paddingTop: '1px', paddingBottom: '1px', borderRadius: '1px', marginBottom: '3px' }}>
                        <span style={{ fontFamily: orbitron.style.fontFamily, fontSize: '5px', fontWeight: 900, color: categoryColor, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                            [{card.category}]
                        </span>
                    </div>

                    <div className="text-center mb-0.5 leading-[1.05] shrink-0 w-full px-2 min-h-[30px] flex items-center justify-center">
                        <h2 className={`${playfair.className} text-[12px] font-[900] text-[#0a0a0a] tracking-tight uppercase leading-[1.1]`}>
                            {card.name}
                        </h2>
                    </div>
                </div>

                {/* Middle Content: Icon + Description */}
                <div className="flex-1 flex flex-col items-center justify-center px-[3mm] pt-0.5 pb-0 min-h-0 overflow-hidden">
                    <div className="w-full flex justify-center mb-1 shrink-0">
                        <div className="bg-[#f3f4f6] p-[2mm] rounded-2xl border border-black/5 shadow-inner">
                            {getIcon()}
                        </div>
                    </div>

                    <div className="text-center px-1 shrink min-h-0 overflow-hidden">
                        <p className={`${playfair.className} text-[8.5px] font-[700] text-[#111] leading-[1.1]`}>
                            {card.description}
                        </p>
                        {card.synergy && (
                            <p className={`${playfair.className} text-[8px] font-[900] text-cyan-800 leading-[1.1] mt-1`}>
                                Synergy: +{card.synergy.bonusIP} IP
                            </p>
                        )}
                        {card.effect && (
                            <p className={`${playfair.className} text-[8px] font-[900] text-red-800 leading-[1.1] mt-1`}>
                                Penalty Effect
                            </p>
                        )}
                    </div>
                </div>

                {/* IP Badge — own row so it never clips or touches the footer bar */}
                {card.ipValue > 0 ? (
                    <div className="flex justify-center items-center shrink-0 w-full pt-[1mm] pb-[2.5mm]">
                        <div className="rounded-full w-[9mm] h-[9mm] flex items-center justify-center shadow-md border border-white/5" style={{ backgroundColor: '#111111', color: '#ffffff' }}>
                            <div className="flex flex-col items-center justify-center leading-none">
                                <span className={`${playfair.className} text-[12px] font-[900] tracking-tighter`}>
                                    {card.ipValue}
                                </span>
                                <span className={`${orbitron.className} text-[5px] font-[900] tracking-[0.1em] -mt-0.5 uppercase`}>
                                    IP
                                </span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="shrink-0 h-[2mm]" />
                )}

                {/* Footer Section */}
                <div className="w-full flex flex-col shrink-0 bg-white">
                    <div className="w-full py-[0.8mm] text-center" style={{ backgroundColor: categoryColor }}>
                        <span className="text-[10px] font-sans font-[900] tracking-[0.25em] leading-none uppercase" style={{ color: '#ffffff' }}>
                            {getBannerText(card.category)}
                        </span>
                    </div>
                    
                    <div className="w-full pt-[1mm] pb-[1mm] text-center px-4">
                        <p className={`${playfair.className} text-[7px] font-[700] text-[#333] leading-none`}>
                            The foundation of powerful machine learning
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
