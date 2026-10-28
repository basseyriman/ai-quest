"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Orbitron } from "next/font/google";
import { Printer, Sparkles, ArrowLeft, QrCode } from "lucide-react";

const orbitron = Orbitron({ subsets: ["latin"] });

export default function PrintFeedbackQrPage() {
  const [layoutMode, setLayoutMode] = useState<"dual" | "tent" | "single">("dual");

  return (
    <div className="min-h-screen bg-zinc-950 py-8 px-4 text-white print:bg-white print:p-0 print:m-0 print:text-black">
      {/* On-Screen Control Panel */}
      <div className="print:hidden max-w-3xl mx-auto mb-8 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-cyan-950 border border-cyan-500/40 rounded-xl text-cyan-400">
              <QrCode className="w-6 h-6" />
            </span>
            <div>
              <h1 className={`text-2xl font-black text-cyan-400 tracking-wider ${orbitron.className}`}>
                Playtest Feedback QR Table Sheets
              </h1>
              <p className="text-xs text-zinc-400">
                citizenM Tower of London · Friday 13th November 2026
              </p>
            </div>
          </div>

          <Link
            href="/"
            className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 border border-zinc-700 px-3 py-1.5 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Game
          </Link>
        </div>

        <p className="text-sm text-zinc-300 leading-relaxed mb-6">
          Place these on the playtest tables at citizenM so players can scan with their phone camera and complete the debrief in under 3 minutes.
        </p>

        {/* Layout selector */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 text-sm font-semibold">
          <button
            type="button"
            onClick={() => setLayoutMode("dual")}
            className={`p-3 rounded-xl border text-left transition-all ${
              layoutMode === "dual"
                ? "bg-cyan-950/60 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.25)]"
                : "bg-zinc-800/60 border-zinc-700 text-zinc-400 hover:text-white"
            }`}
          >
            <div className="font-bold mb-1">2x Table Cards (A5)</div>
            <div className="text-xs text-zinc-400 font-normal">
              2 cards per A4 page. Cut down the center line. (Recommended)
            </div>
          </button>

          <button
            type="button"
            onClick={() => setLayoutMode("tent")}
            className={`p-3 rounded-xl border text-left transition-all ${
              layoutMode === "tent"
                ? "bg-cyan-950/60 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.25)]"
                : "bg-zinc-800/60 border-zinc-700 text-zinc-400 hover:text-white"
            }`}
          >
            <div className="font-bold mb-1">Table Tent (Foldable)</div>
            <div className="text-xs text-zinc-400 font-normal">
              Folds in half to stand upright in the center of the table.
            </div>
          </button>

          <button
            type="button"
            onClick={() => setLayoutMode("single")}
            className={`p-3 rounded-xl border text-left transition-all ${
              layoutMode === "single"
                ? "bg-cyan-950/60 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.25)]"
                : "bg-zinc-800/60 border-zinc-700 text-zinc-400 hover:text-white"
            }`}
          >
            <div className="font-bold mb-1">Single A4 Placemat</div>
            <div className="text-xs text-zinc-400 font-normal">
              Large full-page poster or welcome desk sheet.
            </div>
          </button>
        </div>

        <div className="flex items-center justify-between gap-4 pt-4 border-t border-zinc-800 flex-wrap">
          <span className="text-xs text-zinc-400">
            Print setting: <strong className="text-white">A4 Portrait</strong> · Scale:{" "}
            <strong className="text-white">100%</strong> · Background graphics:{" "}
            <strong className="text-cyan-400">ON</strong>
          </span>

          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black px-6 py-2.5 rounded-full font-bold uppercase tracking-wider text-xs shadow-lg shadow-cyan-950 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" /> Print Table Sheets
          </button>
        </div>
      </div>

      {/* PRINT STYLES */}
      <style jsx global>{`
        @page {
          size: A4 portrait;
          margin: 0;
        }
        @media print {
          body {
            background: white !important;
            color: black !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          .a4-print-sheet {
            width: 210mm !important;
            height: 297mm !important;
            margin: 0 auto !important;
            box-shadow: none !important;
            border: none !important;
            page-break-after: always;
            break-after: page;
          }
        }
      `}</style>

      {/* --- PRINT SHEET CANVAS (A4 210mm x 297mm) --- */}
      <div className="a4-print-sheet mx-auto bg-white text-zinc-900 shadow-2xl overflow-hidden relative w-[210mm] min-h-[297mm]">
        {layoutMode === "dual" && (
          <div className="w-full h-full flex flex-col justify-between p-6 box-border">
            {/* Card 1 (Top Half) */}
            <div className="h-[138mm] border-2 border-cyan-600/40 rounded-2xl p-6 flex flex-col justify-between bg-gradient-to-br from-slate-900 via-[#070e1e] to-slate-950 text-white relative shadow-md">
              <TableCardContent />
            </div>

            {/* Cut Line (On screen only, completely hidden on print) */}
            <div className="print:hidden relative py-2 flex items-center justify-center">
              <div className="w-full border-b-2 border-dashed border-zinc-400" />
              <span className="absolute bg-white px-3 text-[10px] uppercase font-mono tracking-widest text-zinc-500 font-bold">
                ✂ Cut here for 2x Table Cards (Guidelines hidden on print)
              </span>
            </div>

            {/* Card 2 (Bottom Half) */}
            <div className="h-[138mm] border-2 border-cyan-600/40 rounded-2xl p-6 flex flex-col justify-between bg-gradient-to-br from-slate-900 via-[#070e1e] to-slate-950 text-white relative shadow-md">
              <TableCardContent />
            </div>
          </div>
        )}

        {layoutMode === "tent" && (
          <div className="w-full h-full flex flex-col justify-between p-8 box-border">
            {/* Front Panel (Flipped 180 degrees so when folded it faces outwards) */}
            <div className="h-[135mm] border-2 border-cyan-600/40 rounded-2xl p-6 flex flex-col justify-between bg-gradient-to-br from-slate-900 via-[#070e1e] to-slate-950 text-white relative rotate-180 shadow-md">
              <TableCardContent isTent />
            </div>

            {/* Center Fold Line (Visible on screen preview only, hidden on paper print) */}
            <div className="print:hidden relative py-3 flex items-center justify-center">
              <div className="w-full border-b-2 border-dashed border-cyan-700/60" />
              <span className="absolute bg-white px-4 text-[10px] uppercase font-mono tracking-widest text-cyan-700 font-bold">
                ▾ Fold line (Preview only — hidden on print) ▾
              </span>
            </div>

            {/* Back Panel */}
            <div className="h-[135mm] border-2 border-cyan-600/40 rounded-2xl p-6 flex flex-col justify-between bg-gradient-to-br from-slate-900 via-[#070e1e] to-slate-950 text-white relative shadow-md">
              <TableCardContent isTent />
            </div>
          </div>
        )}

        {layoutMode === "single" && (
          <div className="w-full h-full p-10 flex flex-col justify-between bg-gradient-to-br from-slate-950 via-[#081226] to-slate-900 text-white border-8 border-slate-900">
            <SinglePosterContent />
          </div>
        )}
      </div>
    </div>
  );
}

function TableCardContent({ isTent }: { isTent?: boolean }) {
  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-cyan-500/25 pb-3">
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="AI Quest"
            className="w-11 h-11 object-contain drop-shadow-[0_0_12px_rgba(6,182,212,0.6)]"
          />
          <div>
            <div className={`text-base font-black tracking-wider text-cyan-400 ${orbitron.className}`}>
              AI QUEST
            </div>
            <div className="text-[9px] uppercase tracking-[0.25em] text-slate-300 font-mono">
              Build · Train · Deploy
            </div>
          </div>
        </div>

        <div className="text-right">
          <span className="inline-block text-[8px] font-bold font-mono tracking-widest uppercase bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 px-2 py-0.5 rounded">
            Official Playtest
          </span>
          <div className="text-[8px] text-slate-400 mt-1 font-mono">citizenM Tower of London</div>
        </div>
      </div>

      {/* Main Body Grid */}
      <div className="grid grid-cols-12 gap-5 items-center my-auto py-2">
        {/* Left Side: QR Code */}
        <div className="col-span-5 flex flex-col items-center text-center">
          <div className="p-2 bg-white rounded-xl shadow-[0_0_25px_rgba(6,182,212,0.35)] border border-cyan-400/50">
            <img
              src="/feedback_qr_branded.png"
              alt="Scan QR code for playtest feedback"
              className="w-36 h-36 object-contain"
            />
          </div>
          <span className="mt-2 text-[9px] font-mono tracking-widest uppercase text-cyan-300 font-bold animate-pulse">
            📷 Scan with Camera
          </span>
        </div>

        {/* Right Side: Perks & Call to Action */}
        <div className="col-span-7 flex flex-col justify-center space-y-2.5 text-left">
          <div>
            <h2 className="text-sm font-black tracking-wide text-white uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Playtest Debrief (3 min)
            </h2>
            <p className="text-[10px] text-slate-300 mt-0.5 leading-snug">
              Your feedback directly shapes our card balance & rulebook before factory mass production.
            </p>
          </div>

          <div className="space-y-1.5 text-[9px] text-slate-300">
            <div className="flex items-start gap-2 bg-slate-900/60 p-1.5 rounded-lg border border-cyan-500/15">
              <span className="text-cyan-400 font-bold shrink-0">01</span>
              <span>Rate the 7 ML pipeline stages & bluff mechanics.</span>
            </div>
            <div className="flex items-start gap-2 bg-slate-900/60 p-1.5 rounded-lg border border-cyan-500/15">
              <span className="text-cyan-400 font-bold shrink-0">02</span>
              <span>Flag any confusing cards or rules.</span>
            </div>
            <div className="flex items-start gap-2 bg-slate-900/60 p-1.5 rounded-lg border border-cyan-500/15">
              <span className="text-yellow-400 font-bold shrink-0">★</span>
              <span>Get notified for Day-1 Kickstarter Backer credit.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-cyan-500/20 text-[8px] font-mono text-slate-400">
        <span>RimansTech Industries · London, UK</span>
        <span className="text-cyan-400 font-bold">www.aiquestgame.com</span>
      </div>
    </>
  );
}

function SinglePosterContent() {
  return (
    <div className="h-full flex flex-col justify-between py-6">
      <div className="text-center space-y-3">
        <img
          src="/google_forms_header.png"
          alt="AI Quest Header"
          className="w-full max-h-32 object-contain mx-auto"
        />
        <div className="inline-block bg-cyan-950 border border-cyan-500/40 text-cyan-300 px-4 py-1 rounded-full text-xs font-mono font-bold tracking-widest uppercase">
          Official Playtesting Event · citizenM Tower of London
        </div>
      </div>

      <div className="my-auto flex flex-col items-center text-center">
        <div className="p-4 bg-white rounded-3xl shadow-[0_0_50px_rgba(6,182,212,0.5)] border-2 border-cyan-400 mb-4">
          <img
            src="/feedback_qr_branded.png"
            alt="Scan QR for Feedback"
            className="w-56 h-56 object-contain"
          />
        </div>
        <h2 className="text-xl font-bold tracking-wider uppercase text-white mb-1">
          Scan to Enter Debrief
        </h2>
        <p className="text-xs text-slate-400 font-mono tracking-widest">
          3-MINUTE SURVEY · ALL FEEDBACK CONFIDENTIAL
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="bg-slate-900/80 border border-cyan-500/25 p-4 rounded-xl">
          <div className="text-cyan-400 font-bold text-xs uppercase mb-1">Gameplay Balance</div>
          <p className="text-[10px] text-slate-300">Evaluate pacing, turns & bluff catching</p>
        </div>
        <div className="bg-slate-900/80 border border-cyan-500/25 p-4 rounded-xl">
          <div className="text-cyan-400 font-bold text-xs uppercase mb-1">ML Authenticity</div>
          <p className="text-[10px] text-slate-300">Rate the 7-stage machine learning pipeline</p>
        </div>
        <div className="bg-slate-900/80 border border-cyan-500/25 p-4 rounded-xl">
          <div className="text-yellow-400 font-bold text-xs uppercase mb-1">VIP Recognition</div>
          <p className="text-[10px] text-slate-300">Credit in the final game rulebook</p>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-slate-800 pt-4 text-xs font-mono text-slate-400">
        <span>RimansTech Industries</span>
        <span className="text-cyan-400">aiquestgame.com</span>
      </div>
    </div>
  );
}
