"use client";

import React from "react";
import {
  Cpu,
  Sparkles,
  BookOpen,
  MapPin,
  Calendar,
  Clock,
  Globe,
  Building2,
  ArrowUpRight,
  Gamepad2,
  Users,
  Award,
} from "lucide-react";
import { OnlineManualGameArena } from "@/components/game/OnlineManualGameArena";
import {
  COMPANY_NAME,
  DESIGNER_NAME,
  RETAIL_ENGINEER_DECK_SIZE,
  OBJECTIVE_DECK_SIZE,
  MILESTONE_DECK_SIZE,
  RIMANSTECH_URL,
} from "@/lib/brand";
import { OBJECTIVE_DECK } from "@/lib/engineer-mode/cards";
import { MILESTONE_CARDS } from "@/lib/engineer-mode/milestones";
import { ENGINEER_CATEGORY_IP } from "@/lib/engineer-mode/ipValues";

const PIPELINE_OVERVIEW = [
  {
    step: "01",
    name: "DATA COLLECTION",
    ip: ENGINEER_CATEGORY_IP["DATA COLLECTION"],
    color: "#38bdf8",
    examples: "Camera Image Dataset, MRI Scan Dataset, Financial Transaction Logs, IoT Sensor Streams",
    desc: "Gather raw, high-signal datasets required to power your target System Objective.",
  },
  {
    step: "02",
    name: "DATA PREPARATION",
    ip: ENGINEER_CATEGORY_IP["DATA PREPARATION"],
    color: "#0ea5e9",
    examples: "Handle Missing Values, Remove Duplicates, Class Balancing, Data Normalization",
    desc: "Clean, deduplicate, and balance noisy inputs so your pipeline builds on solid ground.",
  },
  {
    step: "03",
    name: "FEATURE ENGINEERING",
    ip: ENGINEER_CATEGORY_IP["FEATURE ENGINEERING"],
    color: "#ec4899",
    examples: "Feature Selection, One-Hot Encoding, Dimensionality Reduction (PCA), Tokenization",
    desc: "Transform prepared data into high-leverage predictive signals for model training.",
  },
  {
    step: "04",
    name: "MODEL SELECTION",
    ip: ENGINEER_CATEGORY_IP["MODEL SELECTION"],
    color: "#a855f7",
    examples: "Convolutional Neural Network (CNN), Transformer Architecture, Random Forest, XGBoost",
    desc: "Choose the optimal machine learning or deep learning architecture for the mission.",
  },
  {
    step: "05",
    name: "MODEL TRAINING",
    ip: ENGINEER_CATEGORY_IP["MODEL TRAINING"],
    color: "#f43f5e",
    examples: "Gradient Descent Optimization, Hyperparameter Tuning, Cross-Validation, Transfer Learning",
    desc: "Optimize weights, tune hyperparameters, and prevent overfitting across training epochs.",
  },
  {
    step: "06",
    name: "MODEL EVALUATION",
    ip: ENGINEER_CATEGORY_IP["MODEL EVALUATION"],
    color: "#d946ef",
    examples: "Precision & Recall Audit, Confusion Matrix, ROC-AUC Benchmark, Bias & Fairness Check",
    desc: "Benchmark model accuracy, robustness, and safety before going live.",
  },
  {
    step: "07",
    name: "DEPLOYMENT",
    ip: ENGINEER_CATEGORY_IP.DEPLOYMENT,
    color: "#14b8a6",
    examples: "AWS Cloud Deployment, Edge Device Inference, Real-Time API Endpoint, Docker/Kubernetes",
    desc: "Launch the completed AI system into production (+25 IP) and unlock the paired Milestone (+30 IP)!",
  },
];

const THREE_PILLARS = [
  {
    num: "01",
    title: "MASTER REAL-WORLD AI · NO CODING REQUIRED",
    desc1:
      "Experience the authentic machine learning lifecycle from data collection to live deployment.",
    desc2:
      "Build complete AI systems in an intuitive, fast-paced tabletop strategy card game.",
    borderCol: "border-[#38bdf8]",
    badgeBg: "bg-[#051024] border-[#38bdf8] text-[#38bdf8]",
  },
  {
    num: "02",
    title: 'HIGH-STAKES RIVALRY & "CHALLENGE!" AUDITS',
    desc1:
      "Outsmart your rivals in a shared pipeline. Catch opponents cutting corners or pushing",
    desc2:
      "flawed architectures, and trigger game-changing 'CHALLENGE!' validation audits.",
    borderCol: "border-[#facc15]",
    badgeBg: "bg-[#051024] border-[#facc15] text-[#facc15]",
  },
  {
    num: "03",
    title: "CRAFTED FOR BOARD GAMERS & TECH ENTHUSIASTS",
    desc1:
      "Engineered for 2–8 players or solo play online vs AI. Fast to learn in 5 minutes,",
    desc2:
      "yet deeply strategic for data & AI professionals, students, and tabletop veterans alike.",
    borderCol: "border-[#4ade80]",
    badgeBg: "bg-[#051024] border-[#4ade80] text-[#4ade80]",
  },
];

const SPECS_BAR = [
  { val: "2–8 PLAYERS", sub: "Competitive & Solo" },
  { val: "45–60 MINS", sub: "Fast Strategic Turns" },
  { val: "AGES 14+", sub: "Gamers & Engineers" },
  { val: "240 CARDS", sub: "Linen Air-Cushion Set" },
];

export function AiQuestLandingPage() {
  return (
    <div className="min-h-screen bg-[#030712] text-white selection:bg-cyan-500/30 overflow-x-hidden">
      {/* Subtle Cyber Architectural Grid Overlay (Matches Roll-Up Banner #0a1936 Grid) */}
      <div
        className="fixed inset-0 pointer-events-none opacity-45 z-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(10,25,54,0.65) 1px, transparent 1px), linear-gradient(to bottom, rgba(10,25,54,0.65) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      {/* STICKY TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#030712]/90 border-b border-cyan-500/25">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
          <a href="#top" className="flex items-center gap-3 group">
            <img
              src="/logo.png"
              alt="AI Quest"
              className="w-10 h-10 object-contain drop-shadow-[0_0_12px_rgba(34,211,238,0.6)] group-hover:scale-105 transition-transform"
            />
            <div>
              <div className="text-sm sm:text-base font-extrabold tracking-[0.16em] text-white uppercase">
                AI QUEST
              </div>
              <div className="text-[10px] font-semibold tracking-[0.22em] text-sky-400 uppercase">
                BUILD · TRAIN · DEPLOY
              </div>
            </div>
          </a>

          <nav className="hidden lg:flex items-center gap-7 text-xs font-bold uppercase tracking-[0.14em] text-slate-300">
            <a href="#play-arena" className="text-cyan-300 hover:text-white transition-colors">
              Play Online
            </a>
            <a href="#box-showcase" className="hover:text-cyan-300 transition-colors">
              240-Card Edition
            </a>
            <a href="#three-pillars" className="hover:text-cyan-300 transition-colors">
              Why AI Quest
            </a>
            <a href="#rules-pipeline" className="hover:text-cyan-300 transition-colors">
              7 ML Stages &amp; Rules
            </a>
            <a href="#london-event" className="hover:text-cyan-300 transition-colors">
              London Showcase
            </a>
            <a href="#rimanstech" className="hover:text-cyan-300 transition-colors">
              RimansTech Industries
            </a>
          </nav>

          <div className="flex items-center gap-2.5">
            <a
              href="#rules-pipeline"
              className="px-4 py-2 rounded-xl bg-[#081834] hover:bg-[#0c2249] border border-cyan-500/40 text-cyan-200 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Official Rules</span>
            </a>
            <a
              href="#play-arena"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 text-slate-950 font-extrabold text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all"
            >
              Play Now
            </a>
          </div>
        </div>
      </header>

      {/* OUTER LUXURY ROLL-UP BANNER ARCHITECTURAL CONTAINER */}
      <main id="top" className="relative z-10 max-w-[1480px] mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="relative rounded-[32px] border-[2.5px] border-[#0ea5e9]/75 bg-gradient-to-b from-[#030712]/95 via-[#061229]/95 to-[#030712]/98 shadow-[0_0_90px_rgba(14,165,233,0.15)] px-4 sm:px-8 lg:px-12 py-10 sm:py-14 overflow-hidden">
          {/* Inner Subtle Gold/Slate Accent Line (Matches Roll-Up Banner Double Frame) */}
          <div className="absolute inset-2.5 rounded-[24px] border border-slate-400/15 pointer-events-none" />

          {/* 4 Glowing Cyan Corner Nodes (Exact Roll-Up Banner Signature) */}
          <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#22d3ee] flex items-center justify-center shadow-[0_0_16px_#22d3ee] pointer-events-none">
            <div className="w-2 h-2 rounded-full bg-white" />
          </div>
          <div className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#22d3ee] flex items-center justify-center shadow-[0_0_16px_#22d3ee] pointer-events-none">
            <div className="w-2 h-2 rounded-full bg-white" />
          </div>
          <div className="absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2 w-5 h-5 rounded-full bg-[#22d3ee] flex items-center justify-center shadow-[0_0_16px_#22d3ee] pointer-events-none">
            <div className="w-2 h-2 rounded-full bg-white" />
          </div>
          <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-5 h-5 rounded-full bg-[#22d3ee] flex items-center justify-center shadow-[0_0_16px_#22d3ee] pointer-events-none">
            <div className="w-2 h-2 rounded-full bg-white" />
          </div>

          {/* =====================================================================
              SECTION 1 (TOP): EXACT ROLL-UP BANNER HEADER + LIVE PLAYABLE GAME ARENA
          ===================================================================== */}
          <section id="play-arena" className="relative">
            {/* Exact Roll-Up Banner Header Hierarchy (Matches verify_top.png 1:1) */}
            <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-4 lg:mb-10">
              {/* 1. Presenter Line */}
              <p className="text-[10px] sm:text-sm md:text-base font-bold tracking-[0.16em] text-[#94a3b8] uppercase mb-2 sm:mb-5">
                RIMANSTECH INDUSTRIES PRESENTS
              </p>

              {/* 2. Official AI QUEST Shield Emblem with Smooth Radial Spotlight */}
              <div className="relative flex items-center justify-center my-0.5 sm:my-1">
                <div
                  className="absolute w-44 h-44 sm:w-96 sm:h-96 rounded-full pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(14,165,233,0.22) 0%, rgba(14,165,233,0.08) 45%, rgba(3,7,18,0) 72%)",
                  }}
                />
                <img
                  src="/logo.png"
                  alt="AI Quest: Build. Train. Deploy."
                  className="relative z-10 w-24 sm:w-56 md:w-64 h-auto object-contain drop-shadow-[0_18px_38px_rgba(0,0,0,0.85)]"
                />
              </div>

              {/* 3. Category Title (Single Clean Line in Sky Blue #38bdf8, Generous Gap Below Shield Tip) */}
              <h1 className="mt-2.5 sm:mt-8 text-xs sm:text-2xl md:text-[28px] font-bold tracking-[0.06em] uppercase text-[#38bdf8] leading-snug">
                THE MACHINE LEARNING STRATEGY CARD GAME
              </h1>

              {/* 4. Glowing Cyan Tagline Pill: BUILD · TRAIN · DEPLOY */}
              <div className="mt-2 sm:mt-5 inline-flex items-center justify-center px-5 sm:px-12 py-1.5 sm:py-3 rounded-full bg-[#0a1e44] border-2 border-[#22d3ee] shadow-[0_0_25px_rgba(34,211,238,0.28)]">
                <span className="text-[11px] sm:text-lg md:text-xl font-bold tracking-[0.14em] uppercase text-white">
                  BUILD &nbsp;&middot;&nbsp; TRAIN &nbsp;&middot;&nbsp; DEPLOY
                </span>
              </div>

              {/* 5. Signature Cyan Divider Line with Center Node */}
              <div className="mt-3 sm:mt-7 flex items-center justify-center w-full max-w-md">
                <div className="flex-1 h-[2px] bg-[#0ea5e9]/70" />
                <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#22d3ee] shadow-[0_0_10px_#22d3ee] mx-0" />
                <div className="flex-1 h-[2px] bg-[#0ea5e9]/70" />
              </div>
            </div>

            {/* Interactive Game Arena (Official Manual Rules v1.0) */}
            <OnlineManualGameArena />
          </section>

          {/* =====================================================================
              SECTION 2: ROLL-UP BANNER HERO SHOWCASE (3D BOX & 4 FANNED OFFICIAL CARDS)
              Matches verify_mid.png 1:1
          ===================================================================== */}
          <section id="box-showcase" className="pt-20 pb-14 relative">
            <div className="flex flex-col items-center text-center">
              {/* 3D Box & 4 Fanned Official Cards Stage */}
              <div className="relative w-full max-w-[1160px] pt-4 pb-6 flex flex-col items-center">
                {/* Smooth Radial Cyan Spotlight Behind Box & Cards */}
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[980px] h-[480px] pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(ellipse at center, rgba(6,182,212,0.22) 0%, rgba(14,165,233,0.08) 45%, rgba(3,7,18,0) 72%)",
                  }}
                />

                {/* Fanned Cards + Center 3D Box Composition (Unified Mobile & Desktop) */}
                <div className="relative z-10 flex flex-row items-center justify-center w-full overflow-hidden py-2">
                  {/* Left 2 Fanned Cards */}
                  <div className="flex items-center justify-center relative -mr-8 sm:-mr-10 lg:-mr-12 z-10">
                    <img
                      src="/official_cards/extracted/official_card_prep_class_balancing.png"
                      alt="Class Balancing — Data Preparation Card"
                      className="w-20 sm:w-40 md:w-48 xl:w-52 rounded-lg sm:rounded-2xl shadow-[0_14px_32px_rgba(0,0,0,0.88)] sm:shadow-[0_22px_50px_rgba(0,0,0,0.88)] -rotate-[14deg] translate-x-5 sm:translate-x-10 translate-y-2 sm:translate-y-3 hover:rotate-0 hover:scale-105 hover:z-30 transition-all duration-300"
                    />
                    <img
                      src="/official_cards/extracted/official_card_data_camera.png"
                      alt="Camera Image Dataset — Data Collection Card"
                      className="w-24 sm:w-44 md:w-56 xl:w-60 rounded-lg sm:rounded-2xl shadow-[0_16px_38px_rgba(0,0,0,0.92)] sm:shadow-[0_25px_60px_rgba(0,0,0,0.92)] -rotate-[6deg] hover:rotate-0 hover:scale-105 hover:z-30 transition-all duration-300"
                    />
                  </div>

                  {/* Center 3D Collector's Box */}
                  <div className="relative z-20 flex flex-col items-center mx-1 sm:mx-2 shrink-0">
                    <img
                      src="/ai_quest_box_3d.png?v=2"
                      alt="AI Quest Engineer Edition 3D Box"
                      className="w-36 sm:w-80 md:w-[360px] xl:w-[390px] h-auto drop-shadow-[0_20px_45px_rgba(0,0,0,0.92)] sm:drop-shadow-[0_28px_65px_rgba(0,0,0,0.92)] hover:scale-[1.02] transition-transform duration-500"
                    />
                  </div>

                  {/* Right 2 Fanned Cards */}
                  <div className="flex items-center justify-center relative -ml-8 sm:-ml-10 lg:-ml-12 z-10">
                    <img
                      src="/official_cards/extracted/official_card_objective_healthcare.png"
                      alt="Healthcare Diagnosis AI — System Objective Card"
                      className="w-24 sm:w-44 md:w-56 xl:w-60 rounded-lg sm:rounded-2xl shadow-[0_16px_38px_rgba(0,0,0,0.92)] sm:shadow-[0_25px_60px_rgba(0,0,0,0.92)] rotate-[6deg] hover:rotate-0 hover:scale-105 hover:z-30 transition-all duration-300"
                    />
                    <img
                      src="/official_cards/extracted/official_card_deploy_aws.png"
                      alt="AWS Deployment — Deployment Card"
                      className="w-20 sm:w-40 md:w-48 xl:w-52 rounded-lg sm:rounded-2xl shadow-[0_14px_32px_rgba(0,0,0,0.88)] sm:shadow-[0_22px_50px_rgba(0,0,0,0.88)] rotate-[14deg] -translate-x-5 sm:-translate-x-10 translate-y-2 sm:translate-y-3 hover:rotate-0 hover:scale-105 hover:z-30 transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Luminous Cyan Perspective Pedestal Grid (Matches verify_mid.png) */}
                <div className="relative w-full max-w-[900px] h-14 -mt-3 flex flex-col items-center justify-center pointer-events-none">
                  <div
                    className="w-[70%] h-12 rounded-full"
                    style={{
                      background:
                        "radial-gradient(ellipse at center, rgba(34,211,238,0.28) 0%, rgba(14,165,233,0.08) 50%, rgba(3,7,18,0) 75%)",
                    }}
                  />
                  <div className="absolute inset-x-12 top-3 h-[1px] bg-cyan-400/25" />
                  <div className="absolute inset-x-6 top-7 h-[1px] bg-cyan-400/20" />
                  <div className="absolute inset-x-0 top-11 h-[1px] bg-cyan-400/15" />
                </div>

                {/* Component Specification Ribbon (Exact verify_mid.png Pill) */}
                <div className="mt-2 px-6 sm:px-12 py-3.5 rounded-full bg-[#0b1c3c] border-2 border-[#06b6d4] shadow-[0_0_30px_rgba(6,182,212,0.2)]">
                  <span className="text-xs sm:text-base font-bold tracking-[0.08em] uppercase text-[#38bdf8]">
                    PREMIER COLLECTOR&apos;S EDITION &nbsp;&middot;&nbsp; 240 LINEN-FINISH CARDS &nbsp;&middot;&nbsp; COMPLETE ML PIPELINE
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* =====================================================================
              SECTION 3: 3-PILLAR LUXURY SHOWCASE & 4 SPEC BADGES
              Matches verify_bot.png 1:1
          ===================================================================== */}
          <section id="three-pillars" className="py-12">
            <div className="max-w-[1140px] mx-auto">
              {/* Section Title & Subtitle */}
              <div className="text-center mb-10">
                <h2 className="text-xl sm:text-3xl md:text-[34px] font-bold tracking-[0.04em] uppercase text-white">
                  ENGINEERED FOR GAMERS &amp; MACHINE LEARNING PIONEERS
                </h2>
                <p className="text-[#94a3b8] text-sm sm:text-lg mt-2">
                  Demystifying artificial intelligence into tense, high-stakes tabletop strategy
                </p>
              </div>

              {/* 3 Feature Pillar Cards */}
              <div className="flex flex-col gap-5 mb-10">
                {THREE_PILLARS.map((feat) => (
                  <div
                    key={feat.num}
                    className={`rounded-[22px] bg-[#081834] border-2 ${feat.borderCol} px-6 sm:px-8 py-6 flex flex-col sm:flex-row items-start sm:items-center gap-6 shadow-[0_12px_35px_rgba(0,0,0,0.45)]`}
                  >
                    <div
                      className={`w-16 h-16 sm:w-[74px] sm:h-[74px] rounded-[18px] border-2 ${feat.badgeBg} flex items-center justify-center shrink-0 text-2xl sm:text-[28px] font-bold`}
                    >
                      {feat.num}
                    </div>
                    <div className="text-left">
                      <h3 className="text-base sm:text-[22px] font-bold tracking-[0.02em] text-white uppercase mb-1.5">
                        {feat.title}
                      </h3>
                      <p className="text-sm sm:text-[17px] text-[#e2e8f0] leading-relaxed">
                        {feat.desc1}
                        <br className="hidden md:inline" /> {feat.desc2}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* 4 Spec Badges Bar (Exact verify_bot.png Layout Right Below Pillars) */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                {SPECS_BAR.map((sp) => (
                  <div
                    key={sp.val}
                    className="rounded-[18px] bg-[#0a1b3a] border-2 border-[#0ea5e9] py-4 sm:py-5 px-4 text-center shadow-[0_10px_28px_rgba(0,0,0,0.45)]"
                  >
                    <div className="text-lg sm:text-[22px] font-bold tracking-[0.03em] text-white uppercase">
                      {sp.val}
                    </div>
                    <div className="text-xs sm:text-sm text-[#94a3b8] mt-1">{sp.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* =====================================================================
              SECTION 4: THE 7 ML PIPELINE STAGES, OFFICIAL RULES v1.0 & 15 OBJECTIVES
          ===================================================================== */}
          <section id="rules-pipeline" className="py-16 border-t border-cyan-500/25 mt-6">
            <div className="max-w-[1200px] mx-auto">
              <div className="text-center max-w-3xl mx-auto mb-12">
                <span className="text-xs font-bold tracking-[0.25em] text-[#38bdf8] uppercase">
                  OFFICIAL RULES MANUAL v1.0
                </span>
                <h2 className="text-2xl sm:text-4xl font-bold tracking-[0.04em] uppercase text-white mt-2">
                  HOW THE 7-STAGE AI PIPELINE WORKS
                </h2>
                <p className="text-[#94a3b8] text-sm sm:text-base mt-3 leading-relaxed">
                  Every match challenges players to build a real-world AI system from raw data to live production. Contribute valid cards to earn Innovation Points (IP), advance stages strategically, and audit rivals with{" "}
                  <strong className="text-amber-300">&ldquo;CHALLENGE!&rdquo;</strong> calls.
                </p>
              </div>

              {/* 7 Stages Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3.5 mb-12">
                {PIPELINE_OVERVIEW.map((st) => (
                  <div
                    key={st.step}
                    className="rounded-2xl bg-[#081834] border border-[#0ea5e9]/40 p-4 flex flex-col justify-between hover:border-[#38bdf8] transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span
                          className="text-xs font-bold px-2.5 py-0.5 rounded-lg text-slate-950"
                          style={{ backgroundColor: st.color }}
                        >
                          STAGE {st.step}
                        </span>
                        <span className="text-sm font-bold text-amber-300">
                          +{st.ip} IP
                        </span>
                      </div>
                      <h3 className="text-sm font-bold uppercase tracking-wide text-white mb-2">
                        {st.name}
                      </h3>
                      <p className="text-xs text-slate-300 leading-relaxed mb-3">
                        {st.desc}
                      </p>
                    </div>
                    <div className="pt-3 border-t border-white/10 text-[11px] text-slate-400">
                      <strong className="text-sky-300 block mb-0.5">Sample Cards:</strong>
                      {st.examples}
                    </div>
                  </div>
                ))}
              </div>

              {/* Core Rules Cards (Setup, Turn Structure, Challenges, Winning) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
                <div className="rounded-2xl bg-[#081834] border border-[#0ea5e9]/40 p-6">
                  <div className="text-xs font-bold text-[#38bdf8] uppercase tracking-wider mb-1.5">
                    RULE 01 · TURN STRUCTURE
                  </div>
                  <h3 className="text-lg font-bold text-white uppercase mb-3">
                    Play, Score, Draw, End
                  </h3>
                  <ol className="list-decimal pl-5 space-y-1.5 text-xs sm:text-sm text-slate-200">
                    <li>
                      <strong>Play:</strong> Play as many valid cards as you wish into the current or next stage.
                    </li>
                    <li>
                      <strong>Score:</strong> Earn IP immediately for every valid card integrated.
                    </li>
                    <li>
                      <strong>Draw:</strong> When you can no longer continue the pipeline, draw 1 card.
                    </li>
                    <li>
                      <strong>End Turn:</strong> Play passes clockwise.
                    </li>
                  </ol>
                </div>

                <div className="rounded-2xl bg-[#081834] border border-[#0ea5e9]/40 p-6">
                  <div className="text-xs font-bold text-[#38bdf8] uppercase tracking-wider mb-1.5">
                    RULE 02 · STAGE ADVANCEMENT
                  </div>
                  <h3 className="text-lg font-bold text-white uppercase mb-3">
                    Forward-Only Pipeline
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    Players may continue playing multiple unique cards in the current open stage, OR advance the pipeline at any time by playing a valid card from the{" "}
                    <strong className="text-white">next sequential stage</strong>. Once advanced, the previous stage closes permanently!
                  </p>
                </div>

                <div className="rounded-2xl bg-[#081834] border border-[#facc15]/50 p-6">
                  <div className="text-xs font-bold text-[#facc15] uppercase tracking-wider mb-1.5">
                    RULE 03 · PEER AUDITS
                  </div>
                  <h3 className="text-lg font-bold text-white uppercase mb-3">
                    &ldquo;CHALLENGE!&rdquo; Mechanics
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    If a player plays a <strong>Duplicate Card</strong> or an{" "}
                    <strong>Out-of-Stage Card</strong>, any rival may call{" "}
                    <strong className="text-amber-300">&ldquo;CHALLENGE!&rdquo;</strong>. The invalid card is rejected (0 IP) and their turn ends immediately. Falsely challenging a valid play costs the challenger their next turn!
                  </p>
                </div>

                <div className="rounded-2xl bg-[#081834] border border-[#4ade80]/50 p-6">
                  <div className="text-xs font-bold text-[#4ade80] uppercase tracking-wider mb-1.5">
                    RULE 04 · VICTORY &amp; MILESTONE
                  </div>
                  <h3 className="text-lg font-bold text-white uppercase mb-3">
                    Deploy to Unlock +30 IP
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    No winner is declared until a <strong>Deployment Card (Stage 7)</strong> is played. Deployment awards <strong>+25 IP</strong> AND unlocks the paired{" "}
                    <strong className="text-emerald-300">Milestone Card (+30 IP)</strong>. Highest total IP wins (ties broken by highest stage card remaining in hand).
                  </p>
                </div>
              </div>

              {/* 15 Official System Objectives & Paired Milestones Table */}
              <div className="rounded-[24px] bg-[#081834] border border-[#0ea5e9]/40 p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-cyan-500/20">
                  <div>
                    <span className="text-xs font-bold text-[#facc15] uppercase tracking-widest">
                      {OBJECTIVE_DECK_SIZE} OBJECTIVES + {MILESTONE_DECK_SIZE} PAIRED MILESTONES + {RETAIL_ENGINEER_DECK_SIZE} ENGINEER CARDS
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-white uppercase mt-1">
                      Official Mission Objectives &amp; Paired Milestones
                    </h3>
                  </div>
                  <a
                    href="#play-arena"
                    className="px-5 py-2.5 rounded-xl bg-[#22d3ee] hover:bg-[#38bdf8] text-slate-950 font-bold text-xs uppercase tracking-widest transition-all w-fit flex items-center gap-2"
                  >
                    <Gamepad2 className="w-4 h-4" />
                    Test Missions in Live Arena ↑
                  </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {OBJECTIVE_DECK.map((obj, idx) => {
                    const ms = MILESTONE_CARDS[idx];
                    return (
                      <div
                        key={obj.id}
                        className="rounded-xl bg-[#051024] border border-cyan-500/25 px-4 py-3.5 flex flex-col justify-between"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-xs font-bold text-[#facc15] uppercase">
                            {idx + 1}. {obj.name}
                          </span>
                          <span className="text-[11px] font-bold text-[#4ade80] bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded shrink-0">
                            +{ENGINEER_CATEGORY_IP.MILESTONE} IP
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-1.5">{obj.description}</p>
                        {ms && (
                          <div className="mt-2.5 pt-2 border-t border-slate-800 text-xs text-[#38bdf8]">
                            🎯 Milestone: <strong>{ms.name}</strong>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* =====================================================================
              SECTION 5: OFFICIAL LONDON ROOFTOP PLAYTESTING SHOWCASE & EVENT HUB
          ===================================================================== */}
          <section id="london-event" className="py-12">
            <div className="max-w-[1140px] mx-auto">
              <div className="rounded-[28px] bg-[#07152e] border-2 border-[#22d3ee] shadow-[0_0_60px_rgba(34,211,238,0.18)] p-6 sm:p-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  {/* Left: Official London VIP Showcase Pass Card */}
                  <div className="lg:col-span-5 flex flex-col">
                    <div className="relative rounded-[24px] bg-gradient-to-br from-[#0a1f44] via-[#061229] to-[#030917] border-2 border-[#06b6d4] p-6 sm:p-7 shadow-[0_18px_45px_rgba(0,0,0,0.75)] overflow-hidden">
                      {/* Ambient Top Glow */}
                      <div
                        className="absolute -top-20 -right-20 w-56 h-56 rounded-full pointer-events-none"
                        style={{
                          background:
                            "radial-gradient(circle, rgba(34,211,238,0.22) 0%, rgba(3,7,18,0) 70%)",
                        }}
                      />

                      {/* Pass Top Bar */}
                      <div className="flex items-center justify-between gap-3 pb-4 border-b border-cyan-500/25">
                        <div className="flex items-center gap-3">
                          <img
                            src="/logo.png"
                            alt="AI Quest Shield"
                            className="w-12 h-12 object-contain drop-shadow-[0_0_12px_rgba(34,211,238,0.5)]"
                          />
                          <div className="text-left">
                            <div className="text-xs font-bold tracking-[0.18em] text-[#38bdf8] uppercase">
                              OFFICIAL EVENT PASS
                            </div>
                            <div className="text-base font-bold tracking-wider text-white uppercase">
                              LONDON ROOFTOP SHOWCASE
                            </div>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-amber-400/15 border border-amber-400/50 text-[#facc15] text-[10px] font-bold uppercase tracking-widest shrink-0">
                          VIP PLAYTEST
                        </span>
                      </div>

                      {/* Event Highlights List */}
                      <div className="py-5 space-y-3 text-left">
                        <div className="flex items-start gap-3 bg-[#051024]/90 border border-cyan-500/25 rounded-xl p-3">
                          <span className="w-6 h-6 rounded-lg bg-cyan-500/20 border border-cyan-400/40 text-[#22d3ee] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                            01
                          </span>
                          <div>
                            <div className="text-xs sm:text-sm font-bold text-white uppercase">
                              Live 240-Card Tabletop Matches
                            </div>
                            <p className="text-xs text-[#94a3b8] mt-0.5">
                              Play the physical Collector&apos;s Edition across tables of 2 to 8 players with the creators.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 bg-[#051024]/90 border border-cyan-500/25 rounded-xl p-3">
                          <span className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-400/40 text-[#facc15] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                            02
                          </span>
                          <div>
                            <div className="text-xs sm:text-sm font-bold text-white uppercase">
                              Skyline Tech &amp; AI Networking
                            </div>
                            <p className="text-xs text-[#94a3b8] mt-0.5">
                              Connect with London ML engineers, tech founders, students, and strategy gamers overlooking the Tower of London.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 bg-[#051024]/90 border border-cyan-500/25 rounded-xl p-3">
                          <span className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-[#4ade80] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                            03
                          </span>
                          <div>
                            <div className="text-xs sm:text-sm font-bold text-white uppercase">
                              Rulebook Playtester Recognition
                            </div>
                            <p className="text-xs text-[#94a3b8] mt-0.5">
                              Official playtesters receive priority Day-1 Kickstarter backer access and credit consideration.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Pass Footer */}
                      <div className="pt-3 border-t border-cyan-500/25 flex items-center justify-between text-[11px] text-[#94a3b8]">
                        <span className="font-bold text-white">citizenM Tower of London</span>
                        <span className="text-[#22d3ee] font-bold uppercase tracking-wider">
                          cloudM Rooftop Bar
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Event Details & Direct Action Buttons */}
                  <div className="lg:col-span-7 text-left space-y-4">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/40 text-[#facc15] text-xs sm:text-sm font-bold uppercase tracking-[0.06em]">
                      <Sparkles className="w-3.5 h-3.5" />
                      OFFICIAL LONDON LAUNCH &amp; PLAYTESTING EVENT
                    </div>

                    <h2 className="text-2xl sm:text-4xl font-bold uppercase tracking-[0.02em] text-white leading-tight">
                      JOIN US LIVE AT CLOUDM ROOFTOP BAR, TOWER OF LONDON
                    </h2>

                    <p className="text-[#e2e8f0] text-sm sm:text-lg leading-relaxed">
                      Experience <strong>AI QUEST: BUILD. TRAIN. DEPLOY.</strong> in person at our flagship London Playtesting Night hosted at{" "}
                      <strong className="text-[#38bdf8]">
                        cloudM Rooftop Bar, citizenM Tower of London
                      </strong>
                      . Test the live digital edition right at the top of this page, or join us at the tables to shape the final Collector&apos;s Edition before mass production.
                    </p>

                    {/* London Rooftop Event Details Pills */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                      <div className="p-3.5 rounded-2xl bg-[#051024] border border-[#0ea5e9]/40">
                        <div className="flex items-center gap-2 text-[#38bdf8] text-xs font-bold uppercase mb-1">
                          <Calendar className="w-4 h-4" /> Date
                        </div>
                        <div className="text-sm font-bold text-white">Fri, 13 Nov 2026</div>
                        <div className="text-xs text-[#94a3b8]">Official London Playtest</div>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-[#051024] border border-[#0ea5e9]/40">
                        <div className="flex items-center gap-2 text-[#38bdf8] text-xs font-bold uppercase mb-1">
                          <Clock className="w-4 h-4" /> Time
                        </div>
                        <div className="text-sm font-bold text-white">5:30 PM – 9:30 PM</div>
                        <div className="text-xs text-[#94a3b8]">GMT · Rooftop Networking</div>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-[#051024] border border-[#0ea5e9]/40">
                        <div className="flex items-center gap-2 text-[#38bdf8] text-xs font-bold uppercase mb-1">
                          <MapPin className="w-4 h-4" /> Venue
                        </div>
                        <div className="text-sm font-bold text-white">cloudM Rooftop Bar</div>
                        <div className="text-xs text-[#94a3b8]">40 Trinity Square, EC3N 4DJ</div>
                      </div>
                    </div>

                    {/* Direct Action Buttons (Replaces Redundant QR Code) */}
                    <div className="flex flex-wrap items-center gap-3.5 pt-3">
                      <a
                        href="#play-arena"
                        className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 text-slate-950 font-bold text-xs sm:text-sm uppercase tracking-wider inline-flex items-center gap-2 shadow-[0_0_25px_rgba(34,211,238,0.35)] transition-all"
                      >
                        <Gamepad2 className="w-4 h-4" />
                        Play Live Web Edition Above ↑
                      </a>

                      <a
                        href={RIMANSTECH_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3.5 rounded-2xl bg-[#0a1e44] hover:bg-[#0f295c] border-2 border-[#22d3ee] text-white font-bold text-xs sm:text-sm uppercase tracking-wider inline-flex items-center gap-2 transition-all"
                      >
                        <Globe className="w-4 h-4 text-[#22d3ee]" />
                        Event &amp; Kickstarter Updates
                        <ArrowUpRight className="w-4 h-4 text-[#22d3ee]" />
                      </a>
                    </div>

                    <div className="pt-1 text-xs sm:text-sm text-[#94a3b8]">
                      Hosted by <strong className="text-white">RimansTech Industries</strong> &nbsp;&middot;&nbsp; London, UK &nbsp;&middot;&nbsp; 40 Trinity Square, Tower Hill
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* =====================================================================
              SECTION 6: PARENT COMPANY PROFILE — RIMANSTECH INDUSTRIES
          ===================================================================== */}
          <section id="rimanstech" className="pt-16 pb-6 border-t border-cyan-500/25 mt-8">
            <div className="max-w-[1140px] mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                <div className="lg:col-span-7 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#081834] border border-[#0ea5e9]/50 text-[#38bdf8] text-xs font-bold uppercase tracking-widest">
                    <Building2 className="w-3.5 h-3.5" />
                    PARENT COMPANY &amp; CREATOR STUDIO
                  </div>

                  <h2 className="text-2xl sm:text-4xl font-bold uppercase tracking-[0.03em] text-white leading-tight">
                    {COMPANY_NAME.toUpperCase()}
                  </h2>

                  <p className="text-[#e2e8f0] text-sm sm:text-base leading-relaxed">
                    Headquartered in <strong>London, United Kingdom</strong> and founded by{" "}
                    <strong className="text-white">{DESIGNER_NAME}</strong>,{" "}
                    <strong className="text-[#38bdf8]">{COMPANY_NAME}</strong> is an artificial intelligence engineering, software innovation, and interactive educational technology company dedicated to bridging the gap between advanced machine learning architecture and human strategic decision-making.
                  </p>

                  <p className="text-[#94a3b8] text-sm sm:text-base leading-relaxed">
                    Through flagship products like <strong>AI QUEST: BUILD. TRAIN. DEPLOY.</strong>, RimansTech empowers engineers, university students, corporate leaders, and board game enthusiasts to master the real-world machine learning pipeline—from data collection and preparation to cloud deployment and peer-audit governance.
                  </p>

                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <a
                      href={RIMANSTECH_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 text-slate-950 font-bold text-xs sm:text-sm uppercase tracking-widest inline-flex items-center gap-2 shadow-[0_0_25px_rgba(34,211,238,0.35)] transition-all"
                    >
                      <Globe className="w-4 h-4" />
                      Visit RimansTech.com
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                    <div className="text-xs sm:text-sm text-[#94a3b8]">
                      Created &amp; Designed by <strong className="text-white">{DESIGNER_NAME}</strong> · London, UK
                    </div>
                  </div>
                </div>

                {/* Right Column: RimansTech Core Pillars */}
                <div className="lg:col-span-5 grid grid-cols-1 gap-4">
                  <div className="p-5 rounded-2xl bg-[#081834] border border-[#0ea5e9]/40">
                    <div className="flex items-center gap-2.5 text-[#38bdf8] font-bold text-sm uppercase tracking-wider mb-1.5">
                      <Cpu className="w-4 h-4 text-[#38bdf8]" />
                      Enterprise AI &amp; ML Engineering
                    </div>
                    <p className="text-xs sm:text-sm text-[#e2e8f0] leading-relaxed">
                      Designing resilient, production-grade machine learning pipelines, predictive analytics, and intelligent automation systems for modern organizations.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#081834] border border-[#facc15]/40">
                    <div className="flex items-center gap-2.5 text-[#facc15] font-bold text-sm uppercase tracking-wider mb-1.5">
                      <Award className="w-4 h-4 text-[#facc15]" />
                      Interactive AI Strategy &amp; Simulation
                    </div>
                    <p className="text-xs sm:text-sm text-[#e2e8f0] leading-relaxed">
                      Creator of the 240-card <em>AI Quest Collector&apos;s Edition</em> and interactive web simulation platform used for hands-on ML literacy and team strategy.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#081834] border border-[#4ade80]/40">
                    <div className="flex items-center gap-2.5 text-[#4ade80] font-bold text-sm uppercase tracking-wider mb-1.5">
                      <Users className="w-4 h-4 text-[#4ade80]" />
                      STEM Workshops &amp; Tech Community Events
                    </div>
                    <p className="text-xs sm:text-sm text-[#e2e8f0] leading-relaxed">
                      Hosting executive AI literacy workshops, university tournaments, and London technology networking showcases.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* OFFICIAL FOOTER */}
      <footer className="border-t border-cyan-500/20 bg-[#010309] py-8 px-4 sm:px-8 relative z-10">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#94a3b8]">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="AI Quest" className="w-7 h-7 object-contain" />
            <span>
              © {new Date().getFullYear()} <strong>{COMPANY_NAME}</strong>. Created &amp; Designed by{" "}
              <strong>{DESIGNER_NAME}</strong>. All Rights Reserved.
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-5">
            <a href="#play-arena" className="hover:text-cyan-300 transition-colors">
              Play Online
            </a>
            <a href="#rules-pipeline" className="hover:text-cyan-300 transition-colors">
              Official Rules v1.0
            </a>
            <a
              href={RIMANSTECH_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#22d3ee] hover:text-white font-bold"
            >
              rimanstech.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
