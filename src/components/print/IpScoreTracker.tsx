"use client";

import React from "react";
import { Orbitron } from "next/font/google";
import { ENGINEER_CATEGORY_IP } from "@/lib/engineer-mode/ipValues";
import {
  ipTrackPathD,
  pointOnIpTrack,
  gutterLabel,
  IP_TRACK_CARD,
  LABEL_IPS,
} from "./scoreTrackerGeometry";

const orbitron = Orbitron({ subsets: ["latin"] });

/** Matches System Objective card gold (#eab308). */
const WIN_GOLD = "#eab308";

const PIPELINE_REF: { step: string; ip: number }[] = [
  { step: "DATA", ip: ENGINEER_CATEGORY_IP["DATA COLLECTION"] },
  { step: "PREP", ip: ENGINEER_CATEGORY_IP["DATA PREPARATION"] },
  { step: "FEATURE", ip: ENGINEER_CATEGORY_IP["FEATURE ENGINEERING"] },
  { step: "MODEL", ip: ENGINEER_CATEGORY_IP["MODEL SELECTION"] },
  { step: "TRAIN", ip: ENGINEER_CATEGORY_IP["MODEL TRAINING"] },
  { step: "EVAL", ip: ENGINEER_CATEGORY_IP["MODEL EVALUATION"] },
  { step: "DEPLOY", ip: ENGINEER_CATEGORY_IP.DEPLOYMENT },
];

function inwardNormal(tangentDeg: number): { nx: number; ny: number } {
  const rad = (tangentDeg * Math.PI) / 180;
  return { nx: -Math.sin(rad), ny: Math.cos(rad) };
}

function TrackRail() {
  return (
    <>
      <rect
        x={1.2}
        y={1.2}
        width={IP_TRACK_CARD.width - 2.4}
        height={IP_TRACK_CARD.height - 2.4}
        rx={3}
        ry={3}
        fill="none"
        stroke="rgba(255,255,255,0.9)"
        strokeWidth={0.6}
      />

      <path
        d={ipTrackPathD()}
        fill="none"
        stroke="rgba(255,255,255,0.42)"
        strokeWidth={0.45}
        strokeLinejoin="round"
        strokeDasharray="1.4 0.9"
      />

      {LABEL_IPS.map((ip) => {
        const { x, y, tangentDeg } = pointOnIpTrack(ip);
        const { nx, ny } = inwardNormal(tangentDeg);
        const isMajor = ip % 10 === 0;
        const len = isMajor ? 1.7 : 1.15;

        return (
          <line
            key={`tick-${ip}`}
            x1={x}
            y1={y}
            x2={x + nx * len}
            y2={y + ny * len}
            stroke={isMajor ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.5)"}
            strokeWidth={isMajor ? 0.48 : 0.34}
            strokeLinecap="round"
          />
        );
      })}

      {LABEL_IPS.map((ip) => {
        const { x, y } = gutterLabel(ip);
        const isWin = ip === 100;
        const isStart = ip === 0;
        const isMajor = ip % 10 === 0;

        return (
          <text
            key={`label-${ip}`}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={
              isWin
                ? WIN_GOLD
                : isStart
                  ? "#ffffff"
                  : isMajor
                    ? "rgba(255,255,255,0.92)"
                    : "rgba(255,255,255,0.58)"
            }
            fontSize={isWin ? "4.4" : isStart ? "3.7" : isMajor ? "3" : "2.4"}
            fontWeight={isMajor || isWin || isStart ? "800" : "700"}
            fontFamily="Arial, Helvetica, sans-serif"
          >
            {ip}
          </text>
        );
      })}
    </>
  );
}

function TrackerReference() {
  return (
    <div className="w-full shrink-0 border-t border-white/10 pt-0.5">
      <p
        className={`${orbitron.className} text-[3.5pt] font-bold uppercase tracking-[0.12em] mb-0.5 text-center`}
        style={{ color: "rgba(255,255,255,0.35)" }}
      >
        Pipeline
      </p>
      <div className="flex justify-center text-[4.5pt] leading-none">
        <div className="inline-grid grid-cols-[auto_6mm] gap-x-1.5 items-baseline">
          {PIPELINE_REF.map((row, i) => (
            <React.Fragment key={row.step}>
              <span
                className={`${orbitron.className} font-bold tracking-wide text-right`}
                style={{ color: "rgba(255,255,255,0.7)" }}
              >
                {row.step}
              </span>
              <span className="font-black tabular-nums text-right" style={{ color: "#22d3ee" }}>
                +{row.ip}
              </span>
              {i < PIPELINE_REF.length - 1 && (
                <span
                  className="col-span-2 text-center text-[4.5pt] leading-none"
                  style={{ color: "rgba(255,255,255,0.35)" }}
                >
                  ↓
                </span>
              )}
            </React.Fragment>
          ))}
          <span
            className="col-span-2 text-center text-[4.5pt] pt-px leading-none"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            ↓
          </span>
          <span
            className={`${orbitron.className} font-bold tracking-wide text-right`}
            style={{ color: "rgba(255,255,255,0.6)" }}
          >
            MILESTONE
          </span>
          <span className="font-black tabular-nums text-right" style={{ color: "#22d3ee" }}>
            +{ENGINEER_CATEGORY_IP.MILESTONE}
          </span>
        </div>
      </div>
    </div>
  );
}

export function IpScoreTracker({ playerNumber }: { playerNumber: number }) {
  return (
    <div
      className="ip-score-tracker print-color-artifact w-[63mm] h-[88mm] rounded-[3mm] relative overflow-hidden shrink-0 box-border print:shadow-none"
      style={{
        WebkitPrintColorAdjust: "exact",
        printColorAdjust: "exact",
        background: "linear-gradient(165deg, #0c0c10 0%, #050508 55%, #0a0a0f 100%)",
        border: "1.5px solid rgba(255,255,255,0.9)",
      }}
    >
      <svg
        viewBox={`0 0 ${IP_TRACK_CARD.width} ${IP_TRACK_CARD.height}`}
        className="absolute inset-0 w-full h-full"
        aria-hidden
      >
        <TrackRail />
      </svg>

      <div className="absolute inset-x-[10mm] top-[9mm] bottom-[11.5mm] flex flex-col items-center text-center pointer-events-none">
        <div className="shrink-0 flex flex-col items-center w-full">
          <img
            src="/ai_quest_logo_clean.png"
            alt="AI QUEST"
            className="w-[7.5mm] h-auto"
          />
          <p
            className={`${orbitron.className} text-[5pt] font-bold uppercase tracking-[0.14em] mt-0.5`}
            style={{ color: "rgba(255,255,255,0.7)" }}
          >
            Player {playerNumber}
          </p>
        </div>

        <div className="shrink-0 flex flex-col items-center w-full mt-0.5">
          <p
            className={`${orbitron.className} text-[6.5pt] font-black uppercase tracking-[0.03em] leading-tight`}
            style={{ color: "#ffffff" }}
          >
            Highest IP after{" "}
            <span style={{ color: WIN_GOLD }}>Deployment</span> wins
          </p>
          <p
            className="text-[4.25pt] mt-0.5 tracking-wide leading-snug"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            Track your total IP score.
            <br />
            100+ IP: continue from 0 and add 100.
          </p>
        </div>

        <div className="mt-auto w-full shrink-0">
          <TrackerReference />
        </div>
      </div>
    </div>
  );
}
