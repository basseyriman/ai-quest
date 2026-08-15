"use client";

import React from "react";
import { Orbitron } from "next/font/google";
import { AiQuestQrCode } from "@/components/print/AiQuestQrCode";
import { PRINT_MANUAL_A5_STYLE_BLOCK } from "@/components/print/pdfExportStyles";
import { ENGINEER_CATEGORY_IP } from "@/lib/engineer-mode/ipValues";
import { RETAIL_ENGINEER_DECK_SIZE } from "@/lib/engineer-mode/cards";

const orbitron = Orbitron({ subsets: ["latin"] });
const displayFont = orbitron.style.fontFamily;

const IP_ROWS: [string, number][] = [
  ["Data Collection", ENGINEER_CATEGORY_IP["DATA COLLECTION"]],
  ["Data Preparation", ENGINEER_CATEGORY_IP["DATA PREPARATION"]],
  ["Feature Engineering", ENGINEER_CATEGORY_IP["FEATURE ENGINEERING"]],
  ["Model Selection", ENGINEER_CATEGORY_IP["MODEL SELECTION"]],
  ["Model Training", ENGINEER_CATEGORY_IP["MODEL TRAINING"]],
  ["Model Evaluation", ENGINEER_CATEGORY_IP["MODEL EVALUATION"]],
  ["Deployment", ENGINEER_CATEGORY_IP.DEPLOYMENT],
  ["Milestone", ENGINEER_CATEGORY_IP.MILESTONE],
];

const EXAMPLE_PIPELINE = [
  "Data Collection",
  "Data Preparation",
  "Feature Engineering",
  "Model Selection",
  "Model Training",
  "Model Evaluation",
  "Deployment",
];

function Quadrant({
  children,
  label,
  rotate = false,
}: {
  children: React.ReactNode;
  label?: string;
  rotate?: boolean;
}) {
  return (
    <div className="a5-quadrant print-color-artifact">
      {label && <span className="a5-panel-label">{label}</span>}
      <div style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 0, width: "100%", transform: rotate ? "rotate(180deg)" : "none" }}>
        {children}
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="a5-title" style={{ fontFamily: displayFont }}>
      {children}
    </h2>
  );
}

function IpTable() {
  return (
    <div>
      {IP_ROWS.map(([name, ip]) => (
        <div key={name} className="a5-ip-row">
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</span>
          <span style={{ textAlign: "right", fontWeight: 700 }}>+{ip}</span>
        </div>
      ))}
    </div>
  );
}

function ExamplePipeline() {
  return (
    <div style={{ paddingTop: "0.5mm", borderTop: "1px solid #e4e4e7" }}>
      <p className="a5-body" style={{ fontWeight: 700 }}>
        Example Pipeline
      </p>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          fontSize: "5.5pt",
          lineHeight: 1,
          gap: 0,
          marginTop: "0.5mm",
        }}
      >
        {EXAMPLE_PIPELINE.map((step, i) => (
          <React.Fragment key={step}>
            <span className="a5-body" style={{ fontWeight: 600, margin: 0 }}>{step}</span>
            {i < EXAMPLE_PIPELINE.length - 1 && (
              <span style={{ color: "#a1a1aa", fontSize: "6pt", padding: "0.5px 0" }}>↓</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export function BoxFoldedGuideA5({ styleBlock = PRINT_MANUAL_A5_STYLE_BLOCK }: { styleBlock?: string } = {}) {
  return (
    <div className="a5-manual-root print-color-artifact">
      <style dangerouslySetInnerHTML={{ __html: styleBlock }} />

      <div className="a5-sheet print-color-artifact">
        {/* Panel 4 — back cover */}
        <Quadrant label="4" rotate={true}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              minHeight: 0,
              justifyContent: "space-between",
              gap: "1mm",
            }}
          >
            <div style={{ minHeight: 0 }}>
              <SectionTitle>Win &amp; Challenges</SectionTitle>
              <p className="a5-body">
                <strong>Win:</strong> Complete the AI system.
                <br />
                Highest IP after Deployment wins.
              </p>
              <p className="a5-body">
                <strong>Unique:</strong> A card already in the pipeline cannot be played again.
              </p>
              <div>
                <p className="a5-accent" style={{ fontFamily: displayFont, fontWeight: 900, fontSize: "8pt", textTransform: "uppercase", margin: "0 0 0.5mm" }}>
                  CHALLENGE!
                </p>
                <ul className="a5-list">
                  <li>Duplicate card already in pipeline</li>
                  <li>Invalid stage progression</li>
                </ul>
                <p className="a5-body" style={{ marginTop: "0.5mm" }}>
                  Failed challenge = lose next turn.
                </p>
              </div>
            </div>
            <p
              className="a5-accent"
              style={{
                fontFamily: displayFont,
                fontSize: "7pt",
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                textAlign: "center",
                margin: 0,
              }}
            >
              Become the AI QUEST Champion
            </p>
          </div>
        </Quadrant>

        {/* Panel 1 — front cover */}
        <Quadrant label="1" rotate={true}>
          <div className="a5-cover-center">
            <img src="/ai_quest_logo_clean.png" alt="AI QUEST" style={{ width: "18mm", height: "auto" }} />
            <h1 className="a5-cover-title" style={{ fontFamily: displayFont }}>
              Final Official Rules
            </h1>
            <p className="a5-accent" style={{ fontSize: "8pt", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", margin: 0 }}>
              Version 1.0
            </p>
            <p
              className="a5-muted"
              style={{
                fontFamily: displayFont,
                fontSize: "7.5pt",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                margin: "0.5mm 0 0",
              }}
            >
              Build. Train. Deploy.
            </p>
            <p
              className="a5-muted"
              style={{
                fontFamily: displayFont,
                fontSize: "5.5pt",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                margin: "0.8mm 0 0",
                textAlign: "center",
              }}
            >
              Created & Designed by Bassey Riman
            </p>
            <div style={{ marginTop: "1.5mm" }}>
              <AiQuestQrCode sizePx={36} variant="print" />
            </div>
            <p
              className="a5-accent"
              style={{
                fontFamily: displayFont,
                fontSize: "7pt",
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                margin: "1mm 0 0",
              }}
            >
              Become the AI Quest Champion
            </p>
          </div>
        </Quadrant>

        {/* Panel 3 — inside left */}
        <Quadrant label="3">
          <SectionTitle>Rules &amp; Turn</SectionTitle>
          <div className="a5-body-sm" style={{ display: "flex", flexDirection: "column", gap: "0.5mm" }}>
            <div>
              <p style={{ fontWeight: 700, margin: 0 }}>Pipeline</p>
              <p style={{ margin: 0 }}>
                Follow stage order — never backwards. Advance with next-stage cards. A stage stays
                open until a player advances; then that stage closes.
              </p>
            </div>
            <div>
              <p style={{ fontWeight: 700, margin: 0 }}>Your turn</p>
              <ol className="a5-list" style={{ fontSize: "6.5pt" }}>
                <li>Play valid cards in sequence (as many as you can)</li>
                <li>Earn IP for each card</li>
                <li>When stuck, draw 1 card</li>
                <li>End turn (clockwise)</li>
              </ol>
            </div>
            <ExamplePipeline />
          </div>
        </Quadrant>

        {/* Panel 2 — inside right */}
        <Quadrant label="2">
          <SectionTitle>Setup &amp; IP</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: "1mm", minHeight: 0 }}>
            <ol className="a5-list">
              <li>Draw 1 Objective — place face-up</li>
              <li>Place matching Milestone beside it</li>
              <li>Shuffle Engineer Deck ({RETAIL_ENGINEER_DECK_SIZE} cards)</li>
              <li>Deal the same number of cards to each player</li>
              <li>
                Players agree on the same starting hand size.
                <br />
                Recommended: 4–7 cards.
              </li>
              <li>Draw pile face down · All start at 0 IP</li>
            </ol>
            <div>
              <p className="a5-body" style={{ fontWeight: 700 }}>
                Innovation Points
              </p>
              <IpTable />
            </div>
            <div className="a5-body-sm">
              <p style={{ fontWeight: 700, margin: 0 }}>Score Tracker</p>
              <p style={{ margin: 0 }}>Track IP using the player score tracker.</p>
              <p style={{ margin: 0 }}>If a player exceeds 100 IP, continue from 0 and add 100.</p>
            </div>
            <p className="a5-muted" style={{ fontSize: "7pt", margin: 0 }}>
              Shared pipeline — all players build together.
            </p>
          </div>
        </Quadrant>
      </div>
    </div>
  );
}

export function BoxFoldedGuideA5Back({
  styleBlock = PRINT_MANUAL_A5_STYLE_BLOCK,
}: {
  styleBlock?: string;
} = {}) {
  return (
    <div className="a5-manual-root print-color-artifact">
      <style dangerouslySetInnerHTML={{ __html: styleBlock }} />
      <div className="a5-sheet a5-sheet--back print-color-artifact">
        <div className="a5-back-safe">
          <img
            src="/ai_quest_logo_clean.png"
            alt="AI QUEST"
            style={{ width: "42mm", height: "auto", display: "block" }}
          />
          <p className="a5-back-safe__title" style={{ fontFamily: displayFont }}>
            AI Quest
          </p>
          <p className="a5-back-safe__tagline" style={{ fontFamily: displayFont }}>
            Build. Train. Deploy.
          </p>
          <p className="a5-back-safe__legal" style={{ fontFamily: displayFont }}>
            Created &amp; Designed by Bassey Riman
            <br />
            Property of RIMANSTECH INDUSTRIES
            <br />
            All Rights Reserved
          </p>
        </div>
      </div>
    </div>
  );
}
