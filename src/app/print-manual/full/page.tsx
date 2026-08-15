"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { Orbitron } from "next/font/google";
import { PRINT_MANUAL_FULL_STYLE_BLOCK } from "@/components/print/pdfExportStyles";
import { ENGINEER_CATEGORY_IP } from "@/lib/engineer-mode/ipValues";
import {
  FULL_GAME_SET_SIZE,
  RETAIL_ENGINEER_DECK_SIZE,
  OBJECTIVE_DECK,
} from "@/lib/engineer-mode/cards";
import { MILESTONE_CARDS } from "@/lib/engineer-mode/milestones";

const orbitron = Orbitron({ subsets: ["latin"] });

const PIPELINE = [
  "DATA COLLECTION",
  "DATA PREPARATION",
  "FEATURE ENGINEERING",
  "MODEL SELECTION",
  "MODEL TRAINING",
  "MODEL EVALUATION",
  "DEPLOYMENT",
];

const TIE_BREAK_ORDER = [
  "Deployment",
  "Model Evaluation",
  "Model Training",
  "Model Selection",
  "Feature Engineering",
  "Data Preparation",
  "Data Collection",
];

function PrintFullManualContent() {
  const objectiveNames = OBJECTIVE_DECK.map((c) => c.name);

  return (
    <div className="print-export-root print-export-ready min-h-screen bg-zinc-900 py-10 px-4 print:bg-white print:p-0 print:py-0">
      <style dangerouslySetInnerHTML={{ __html: PRINT_MANUAL_FULL_STYLE_BLOCK }} />

      <div className="print-hidden max-w-2xl mx-auto mb-10 text-center text-white">
        <h1
          className={`text-4xl font-black mb-3 bg-gradient-to-r from-rose-400 to-cyan-400 bg-clip-text text-transparent ${orbitron.className}`}
        >
          Official Rules Manual
        </h1>
        <p className="text-gray-400 mb-2 text-sm uppercase tracking-widest">
          Version 1.0 · {FULL_GAME_SET_SIZE} cards · Print-ready A4
        </p>
        <p className="text-gray-500 text-sm mb-6 max-w-lg mx-auto">
          Full reference manual — too large for the box. Use{" "}
          <Link href="/print-manual" className="text-cyan-400 hover:text-cyan-300">
            Box Insert Manual
          </Link>{" "}
          for the folded A5 guide and player cards.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <button
            onClick={() => window.print()}
            className="bg-rose-500 hover:bg-rose-400 text-white px-10 py-3 rounded-full font-bold uppercase tracking-widest text-sm"
          >
            Print Full Manual
          </button>
          <Link
            href="/print-manual"
            className="bg-zinc-800 hover:bg-zinc-700 text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest text-sm"
          >
            Box Inserts
          </Link>
          <Link
            href="/print-cards"
            className="bg-zinc-800 hover:bg-zinc-700 text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest text-sm"
          >
            Print Hub
          </Link>
        </div>
      </div>

      <div className="manual-pages flex flex-col items-center gap-8 print:gap-0">
        {/* COVER + OBJECTIVE + COMPONENTS */}
        <ManualPage>
          <div className="flex flex-col items-center text-center pt-8 pb-6 border-b-2 border-zinc-900 mb-8">
            <img
              src="/ai_quest_logo_clean.png"
              alt="AI QUEST"
              className="w-48 h-auto mb-6"
            />
            <p className={`text-sm font-black tracking-[0.35em] uppercase text-zinc-500 mb-2 ${orbitron.className}`}>
              AI QUEST
            </p>
            <h1 className={`text-3xl font-black uppercase tracking-wide text-zinc-900 mb-2 ${orbitron.className}`}>
              Final Official Rules
            </h1>
            <p className="text-lg font-semibold text-rose-600 uppercase tracking-widest">
              Version 1.0
            </p>
          </div>

          <Section title="Objective">
            <p>
              Build a complete AI system by progressing through the Machine Learning Lifecycle.
            </p>
            <p className="mt-2">
              Earn Innovation Points (IP) by contributing valid AI engineering cards.
            </p>
            <p className="mt-3 font-bold text-zinc-900">
              The player with the highest IP when the AI system is successfully deployed wins.
            </p>
          </Section>

          <Section title="Game Components">
            <Sub title="Objective Deck (15 Cards)" />
            <ul className="list-disc pl-5 mt-1 space-y-0.5 text-sm columns-2 gap-x-6">
              {objectiveNames.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>

            <Sub title="Engineer Deck" className="mt-4">
              Contains:
            </Sub>
            <ul className="list-disc pl-5 mt-1 space-y-0.5 text-sm">
              <li>Data Collection Cards</li>
              <li>Data Preparation Cards</li>
              <li>Feature Engineering Cards</li>
              <li>Model Selection Cards</li>
              <li>Model Training Cards</li>
              <li>Model Evaluation Cards</li>
              <li>Deployment Cards</li>
            </ul>
            <p className="mt-2 text-xs text-zinc-500">
              Retail deck: {RETAIL_ENGINEER_DECK_SIZE} cards
            </p>

            <Sub title="Milestone Deck (15 Cards)" className="mt-4">
              Each Objective has a matching Milestone.
            </Sub>
            <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-3 mt-2 text-sm">
              <p className="font-semibold">Healthcare Diagnosis AI</p>
              <p className="text-zinc-500 text-center my-1">↓</p>
              <p className="font-semibold">Early Disease Detection</p>
              <p className="mt-1 font-bold text-rose-700">
                Reward: +{ENGINEER_CATEGORY_IP.MILESTONE} IP
              </p>
            </div>

            <Sub title="IP Score Trackers" className="mt-4">
              Used to track Innovation Points on a 0–100 scale.
            </Sub>
            <p className="text-sm text-zinc-700 mt-1">
              If a player exceeds 100 IP, continue counting from 0 and add 100. Example: token at 15
              after passing 100 = 115 IP.
            </p>

            <p className="mt-4 text-xs text-zinc-500 font-semibold uppercase tracking-wider">
              Full retail set: {FULL_GAME_SET_SIZE} cards ({RETAIL_ENGINEER_DECK_SIZE} engineer +{" "}
              {OBJECTIVE_DECK.length} objectives + {MILESTONE_CARDS.length} milestones)
            </p>
          </Section>

          <PageFooter n={1} />
        </ManualPage>

        {/* SETUP + PIPELINE + TURN */}
        <ManualPage>
          <Section title="Setup">
            <SetupStep n="1">Shuffle the Objective Deck.</SetupStep>
            <SetupStep n="2">Draw 1 Objective Card.</SetupStep>
            <SetupStep n="3">Place the Objective face up.</SetupStep>
            <SetupStep n="4">Place the matching Milestone Card beside it.</SetupStep>
            <SetupStep n="5">Shuffle the Engineer Deck.</SetupStep>
            <SetupStep n="6">
              Deal the same number of cards to each player. Players agree on the same starting hand
              size.
              <br />
              <em className="text-zinc-600">Recommended: 4–7 cards.</em>
            </SetupStep>
            <SetupStep n="7">Place remaining cards face down as the Draw Deck.</SetupStep>
            <SetupStep n="8">Every player starts at 0 IP.</SetupStep>
          </Section>

          <Section title="The AI Pipeline">
            <p className="mb-3">
              The AI system must follow this order. The pipeline may never move backwards.
            </p>
            <PipelineDiagram />
          </Section>

          <Section title="Turn Structure">
            <p className="mb-2 font-semibold">On your turn:</p>
            <ol className="list-decimal pl-5 space-y-2 text-sm">
              <li>
                <strong>Step 1 — Play:</strong> Play as many valid cards as you wish.
              </li>
              <li>
                <strong>Step 2 — Score:</strong> Earn IP for every valid card played.
              </li>
              <li>
                <strong>Step 3 — Draw:</strong> When you can no longer continue the pipeline, draw 1
                card.
              </li>
              <li>
                <strong>Step 4 — End turn:</strong> Next player proceeds clockwise.
              </li>
            </ol>
          </Section>

          <PageFooter n={2} />
        </ManualPage>

        {/* PIPELINE RULES */}
        <ManualPage>
          <Section title="Flexible Pipeline Rule">
            <p className="mb-2">Players may continue playing cards while:</p>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>The cards follow the pipeline.</li>
              <li>The cards are valid for the current stage.</li>
              <li>The cards have not already been played.</li>
            </ul>
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-sm mt-3">
              <p className="font-bold text-emerald-800 mb-2">Valid example:</p>
              <p className="font-mono text-xs leading-relaxed text-zinc-700">
                MRI Dataset → Handle Missing Values → Remove Duplicates → Class Balancing → Feature
                Selection
              </p>
            </div>
          </Section>

          <Section title="Stage Advancement Rule">
            <p>
              A player may advance the pipeline at any time by playing a valid card from the next
              stage.
            </p>
            <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-4 text-sm mt-3">
              <p className="font-bold mb-2">Example — current pipeline:</p>
              <p className="font-mono text-xs leading-relaxed text-zinc-700">
                MRI Dataset → Handle Missing Values → Normalize Data
              </p>
              <p className="mt-2">
                Player has <strong>Feature Selection</strong> and may immediately advance into
                Feature Engineering. Once advanced, the previous stage closes — no more cards from
                that stage may be played.
              </p>
            </div>
          </Section>

          <Section title="Unique Card Rule">
            <p className="mb-2">A card already in the pipeline cannot be played again.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                <p className="font-bold text-emerald-800 mb-1">Valid:</p>
                <p className="font-mono text-xs">
                  Handle Missing Values → Remove Duplicates → Class Balancing
                </p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="font-bold text-red-800 mb-1">Invalid:</p>
                <p className="font-mono text-xs">
                  Handle Missing Values → Handle Missing Values
                </p>
              </div>
            </div>
          </Section>

          <PageFooter n={3} />
        </ManualPage>

        {/* CHALLENGES */}
        <ManualPage>
          <Section title="Duplicate Card Challenge">
            <p className="mb-2">
              If a player attempts to play a card already present in the pipeline, any player may
              call:
            </p>
            <p className={`text-lg font-black text-rose-600 mb-3 ${orbitron.className}`}>
              &ldquo;CHALLENGE!&rdquo;
            </p>
            <p className="font-semibold mb-1">If successful:</p>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Card is rejected.</li>
              <li>No IP awarded.</li>
              <li>Turn immediately ends.</li>
            </ul>
          </Section>

          <Section title="Invalid Move Challenge">
            <p className="mb-2">
              If a player attempts to play a card that does not belong to the current stage{" "}
              <em>or</em> the next valid stage, any player may call:
            </p>
            <p className={`text-lg font-black text-rose-600 mb-3 ${orbitron.className}`}>
              &ldquo;CHALLENGE!&rdquo;
            </p>
            <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-4 text-sm mb-3">
              <p className="font-bold mb-1">Example — current pipeline:</p>
              <p className="font-mono text-xs">MRI Dataset → Handle Missing Values</p>
              <p className="mt-2">
                Player attempts <strong>AWS Deployment</strong>. Challenge successful.
              </p>
            </div>
            <p className="font-semibold mb-1">Result:</p>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Card rejected.</li>
              <li>No IP awarded.</li>
              <li>Turn immediately ends.</li>
            </ul>
          </Section>

          <Section title="Challenge Failure">
            <p>
              If a player incorrectly challenges a valid move, the challenger loses their next
              turn.
            </p>
          </Section>

          <Section title="Game Flow">
            <p>
              Players build the AI system by contributing cards to the shared pipeline, earning
              Innovation Points (IP) for valid contributions.
            </p>
          </Section>

          <PageFooter n={4} />
        </ManualPage>

        {/* SCORING + COMPLETION + WIN */}
        <ManualPage>
          <Section title="Innovation Point (IP) Scoring">
            <table className="w-full text-sm border-collapse mt-2">
              <thead>
                <tr className="border-b-2 border-zinc-900">
                  <th className="text-left py-2 font-bold">Category</th>
                  <th className="text-right py-2 font-bold">IP</th>
                </tr>
              </thead>
              <tbody>
                <IpRow label="Data Collection" value={ENGINEER_CATEGORY_IP["DATA COLLECTION"]} />
                <IpRow label="Data Preparation" value={ENGINEER_CATEGORY_IP["DATA PREPARATION"]} />
                <IpRow
                  label="Feature Engineering"
                  value={ENGINEER_CATEGORY_IP["FEATURE ENGINEERING"]}
                />
                <IpRow label="Model Selection" value={ENGINEER_CATEGORY_IP["MODEL SELECTION"]} />
                <IpRow label="Model Training" value={ENGINEER_CATEGORY_IP["MODEL TRAINING"]} />
                <IpRow label="Model Evaluation" value={ENGINEER_CATEGORY_IP["MODEL EVALUATION"]} />
                <IpRow label="Deployment" value={ENGINEER_CATEGORY_IP.DEPLOYMENT} />
                <IpRow label="Milestone Completion" value={ENGINEER_CATEGORY_IP.MILESTONE} />
              </tbody>
            </table>
          </Section>

          <Section title="Using the IP Score Tracker">
            <p className="mb-2">
              Each tracker shows IP from <strong>0 to 100</strong>. Scores may exceed 100 during
              play.
            </p>
            <p className="mb-2">
              If a player exceeds 100 IP, continue counting from 0 and add 100.
            </p>
            <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-3 text-sm">
              <p className="font-bold mb-1">Example</p>
              <p>
                Token at <strong>15</strong> after passing 100 = <strong>115 IP</strong>.
              </p>
            </div>
            <p className="mt-2 text-sm text-zinc-600">
              This lets the same tracker work indefinitely for any final score.
            </p>
          </Section>

          <Section title="Completing the AI System">
            <p className="mb-2">When a Deployment Card is successfully played:</p>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>The AI system is complete.</li>
              <li>The matching Milestone is unlocked.</li>
              <li>
                Deployment player earns +{ENGINEER_CATEGORY_IP.DEPLOYMENT} IP.
              </li>
              <li>
                Milestone reward: +{ENGINEER_CATEGORY_IP.MILESTONE} IP.
              </li>
            </ul>
          </Section>

          <Section title="Winning the Game">
            <p className="mb-2">
              A player may exceed 100 IP during gameplay. However, no winner can be declared until
              the AI system reaches Deployment.
            </p>
            <p className="mb-2 font-semibold">Once Deployment has been completed:</p>
            <ol className="list-decimal pl-5 space-y-1 text-sm mb-4">
              <li>Calculate all final IP scores.</li>
              <li>Award Milestone IP.</li>
              <li>The player with the highest IP wins.</li>
            </ol>
            <Sub title="Tie-breaker">
              If two players tie, tied players reveal their remaining hands. The player holding the
              highest-stage card wins. Priority:
            </Sub>
            <div className="flex flex-col items-start gap-0.5 font-semibold text-sm mt-2 ml-2">
              {TIE_BREAK_ORDER.map((stage, i) => (
                <React.Fragment key={stage}>
                  <span>{stage}</span>
                  {i < TIE_BREAK_ORDER.length - 1 && (
                    <span className="text-zinc-400 text-xs">↓</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </Section>

          <div className="mt-10 pt-6 border-t-2 border-zinc-900 text-center">
            <p className={`text-lg font-black uppercase tracking-[0.3em] text-rose-600 ${orbitron.className}`}>
              AI QUEST Mission
            </p>
            <ul className="mt-3 text-sm font-semibold text-zinc-700 space-y-0.5">
              <li>Collect Data.</li>
              <li>Prepare Data.</li>
              <li>Engineer Features.</li>
              <li>Select Models.</li>
              <li>Train Models.</li>
              <li>Evaluate Performance.</li>
              <li>Deploy Solutions.</li>
            </ul>
            <p className={`mt-4 text-sm font-black uppercase tracking-widest text-zinc-900 ${orbitron.className}`}>
              Become the AI QUEST Champion.
            </p>
            <p className="mt-6 text-[10px] text-zinc-400 uppercase tracking-widest">
              Created & Designed by Bassey Riman · Property of RimansTech Industries. All Rights Reserved.
            </p>
          </div>

          <PageFooter n={5} />
        </ManualPage>
      </div>
    </div>
  );
}

export default function PrintManualPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-900" />}>
      <PrintFullManualContent />
    </Suspense>
  );
}

function ManualPage({ children }: { children: React.ReactNode }) {
  return (
    <div className="manual-page print-color-artifact w-[210mm] min-h-[297mm] bg-white text-zinc-900 shadow-2xl print:shadow-none px-[15mm] py-[12mm] text-[13px] leading-relaxed">
      {children}
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-6">
      <h2 className={`text-base font-black uppercase tracking-wide text-zinc-900 mb-2 ${orbitron.className}`}>
        {title}
      </h2>
      <div className="text-zinc-800">{children}</div>
    </section>
  );
}

function Sub({
  title,
  children,
  className = "",
}: {
  title: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <h3 className="font-bold text-zinc-900 text-sm">{title}</h3>
      {children && <div className="text-zinc-700">{children}</div>}
    </div>
  );
}

function SetupStep({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <div className="mb-2 pl-1">
      <p className="text-sm">
        <strong>{n}.</strong> {children}
      </p>
    </div>
  );
}

function PipelineDiagram() {
  return (
    <div className="flex flex-col items-center gap-0.5 font-semibold text-sm">
      {PIPELINE.map((step, i) => (
        <React.Fragment key={step}>
          <div className="w-full max-w-xs text-center py-1.5 px-3 bg-zinc-100 border border-zinc-300 rounded">
            {step}
          </div>
          {i < PIPELINE.length - 1 && (
            <span className="text-zinc-400 text-xs leading-none">↓</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function IpRow({ label, value }: { label: string; value: number }) {
  return (
    <tr className="border-b border-zinc-200">
      <td className="py-2">{label}</td>
      <td className="py-2 text-right font-bold">+{value} IP</td>
    </tr>
  );
}

function PageFooter({ n }: { n: number }) {
  return (
    <div className="mt-auto pt-4 flex justify-between items-center text-[9px] text-zinc-400 uppercase tracking-widest font-bold">
      <span>AI QUEST — Official Rules v1.0</span>
      <span>Page {n}</span>
    </div>
  );
}

