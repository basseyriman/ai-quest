"use client";

import React from 'react';
import { Orbitron } from "next/font/google";
import { AlertTriangle } from 'lucide-react';
import { ENGINEER_CATEGORY_IP } from "@/lib/engineer-mode/ipValues";

const orbitron = Orbitron({ subsets: ["latin"] });

const PIPELINE = [
  "Data Collection",
  "Data Preparation",
  "Feature Engineering",
  "Model Selection",
  "Model Training",
  "Model Evaluation",
  "Deployment",
];

export const EngineerRuleCard: React.FC = () => {
    return (
        <div 
            style={{ backgroundColor: '#ffffff', color: '#000000', borderColor: '#18181b' }}
            className="w-[63.5mm] h-[88.9mm] box-border border-2 rounded-[3mm] relative p-[3mm] shrink-0 print:shadow-none overflow-hidden flex flex-col"
        >
            <div className="flex flex-col items-center border-b border-zinc-200 pb-2 mb-2">
                <img src="/ai_quest_logo_clean.png" className="w-[8mm] h-auto mb-1" alt="Logo" />
                <h3 
                    style={{ color: '#000000' }}
                    className={`${orbitron.className} text-[8px] font-black tracking-widest uppercase`}
                >
                    Official Rules v1.0
                </h3>
            </div>

            <div className="flex-1 flex flex-col gap-1 overflow-hidden">
                <div className="space-y-0.5">
                    <p style={{ color: '#71717a' }} className="text-[7px] font-bold uppercase tracking-tighter">ML Pipeline</p>
                    <div className="space-y-0.5 text-[7px]">
                        {PIPELINE.map((step, i) => (
                            <div key={step} className="flex items-center gap-1.5">
                                <span style={{ color: '#000000' }} className="font-bold tabular-nums w-3">{i + 1}.</span>
                                <span style={{ color: '#000000' }} className="font-bold">{step}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-auto border-t border-zinc-100 pt-1.5 space-y-1">
                    <div className="flex items-start gap-1.5">
                        <AlertTriangle size={10} className="text-orange-500 shrink-0 mt-0.5" />
                        <p style={{ color: '#3f3f46' }} className="text-[6.5px] leading-tight">
                            <span style={{ color: '#000000' }} className="font-black">CHALLENGE:</span> Call on duplicate or invalid plays. Failed challenge = skip next turn.
                        </p>
                    </div>
                    <p style={{ color: '#3f3f46' }} className="text-[6.5px] leading-tight">
                        <span style={{ color: '#000000' }} className="font-black">WIN:</span> Highest IP after Deployment. Milestone +{ENGINEER_CATEGORY_IP.MILESTONE} IP.
                    </p>
                </div>
            </div>

            <div className="w-full pt-2 text-center border-t border-zinc-200 mt-2">
                <p 
                    style={{ color: '#a1a1aa' }}
                    className={`${orbitron.className} text-[4px] font-[900] uppercase tracking-[0.2em]`}
                >
                    PROPERTY OF RIMANSTECH INDUSTRIES.<br/>ALL RIGHTS RESERVED.
                </p>
            </div>
        </div>
    );
};

export const EngineerRuleBook: React.FC = () => {
    return (
        <div 
            style={{ backgroundColor: '#ffffff', color: '#000000', width: '210mm', height: '297mm' }}
            className="pt-[15mm] pb-[15mm] pl-[10mm] pr-[15mm] flex flex-col border-2 border-zinc-100 relative overflow-hidden"
        >
            <div className="absolute top-8 right-12 opacity-10">
                <img src="/ai_quest_logo_clean.png" className="w-32 h-auto" alt="Logo" />
            </div>

            <div className="w-full max-w-[190mm] flex flex-col h-full">
                <header style={{ borderBottom: '5px solid #000000' }} className="pb-8 mb-10 text-left">
                    <h1 
                        style={{ color: '#000000' }}
                        className={`${orbitron.className} text-5xl font-black tracking-tighter mb-2`}
                    >
                        AI QUEST
                    </h1>
                    <div className="flex items-center gap-4 mb-4">
                        <span style={{ color: '#000000' }} className={`${orbitron.className} text-xs font-black tracking-[0.8em] uppercase border-y border-black py-1 px-4`}>
                            OFFICIAL RULES v1.0
                        </span>
                    </div>
                    <p 
                        style={{ color: '#71717a' }}
                        className="text-xl font-bold uppercase tracking-[0.3em]"
                    >
                        Final Official Rules Manual
                    </p>
                </header>

                <main className="grid grid-cols-2 gap-12 flex-1">
                    <section className="space-y-6">
                        <div>
                            <h2 
                                style={{ backgroundColor: '#000000', color: '#ffffff' }}
                                className={`${orbitron.className} text-lg font-black px-4 py-1.5 inline-block mb-4`}
                            >
                                01. OBJECTIVE
                            </h2>
                            <p style={{ color: '#000000' }} className="text-[14px] leading-relaxed">
                                Build a complete AI system through the ML lifecycle. Earn IP for valid cards.
                                The player with the <span style={{ fontWeight: 'bold' }}>highest IP when Deployment is completed</span> wins.
                            </p>
                        </div>

                        <div>
                            <h2 
                                style={{ backgroundColor: '#000000', color: '#ffffff' }}
                                className={`${orbitron.className} text-lg font-black px-4 py-1.5 inline-block mb-4`}
                            >
                                02. TURN STRUCTURE
                            </h2>
                            <ul style={{ color: '#000000' }} className="text-[13px] space-y-2 list-decimal list-inside">
                                <li>Play as many valid cards as you wish.</li>
                                <li>Earn IP for every valid card played.</li>
                                <li>When you cannot continue, draw 1 card.</li>
                                <li>End turn — next player clockwise.</li>
                            </ul>
                        </div>

                        <div>
                            <h2 
                                style={{ backgroundColor: '#000000', color: '#ffffff' }}
                                className={`${orbitron.className} text-lg font-black px-4 py-1.5 inline-block mb-4`}
                            >
                                03. PIPELINE RULES
                            </h2>
                            <ul style={{ color: '#000000' }} className="text-[13px] space-y-2 list-disc list-inside">
                                <li>Follow stage order — never move backwards.</li>
                                <li>Advance by playing a card from the next stage (previous stage closes).</li>
                                <li>A card already in the pipeline cannot be played again.</li>
                            </ul>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <div>
                            <h2 
                                style={{ backgroundColor: '#000000', color: '#ffffff' }}
                                className={`${orbitron.className} text-lg font-black px-4 py-1.5 inline-block mb-4`}
                            >
                                04. CHALLENGES
                            </h2>
                            <div className="space-y-3">
                                <p style={{ color: '#000000' }} className="text-[13px] leading-relaxed">
                                    <span className="font-bold block uppercase border-b border-zinc-200 mb-1">Duplicate or Invalid Play</span>
                                    Any player may call &ldquo;CHALLENGE!&rdquo; — card rejected, no IP, turn ends.
                                </p>
                                <p style={{ color: '#000000' }} className="text-[13px] leading-relaxed">
                                    <span className="font-bold block uppercase border-b border-zinc-200 mb-1">Failed Challenge</span>
                                    Incorrect challenge: challenger loses their next turn.
                                </p>
                            </div>
                        </div>

                        <div style={{ backgroundColor: '#fafafa', borderColor: '#e4e4e7' }} className="p-4 rounded-xl border">
                            <h3 style={{ color: '#000000' }} className={`${orbitron.className} text-[10px] font-black mb-3`}>IP SCORING</h3>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px]">
                                <span>Data Collection +{ENGINEER_CATEGORY_IP["DATA COLLECTION"]}</span>
                                <span>Data Preparation +{ENGINEER_CATEGORY_IP["DATA PREPARATION"]}</span>
                                <span>Feature Eng. +{ENGINEER_CATEGORY_IP["FEATURE ENGINEERING"]}</span>
                                <span>Model Selection +{ENGINEER_CATEGORY_IP["MODEL SELECTION"]}</span>
                                <span>Model Training +{ENGINEER_CATEGORY_IP["MODEL TRAINING"]}</span>
                                <span>Model Evaluation +{ENGINEER_CATEGORY_IP["MODEL EVALUATION"]}</span>
                                <span>Deployment +{ENGINEER_CATEGORY_IP.DEPLOYMENT}</span>
                                <span>Milestone +{ENGINEER_CATEGORY_IP.MILESTONE}</span>
                            </div>
                        </div>

                        <div className="pt-2 text-center opacity-30">
                            <p style={{ color: '#000000' }} className={`${orbitron.className} text-[7px] font-black tracking-widest uppercase`}>
                                CREATED BY BASSEY RIMAN · PROPERTY OF RIMANSTECH INDUSTRIES
                            </p>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};
