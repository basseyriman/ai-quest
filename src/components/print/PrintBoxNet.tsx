"use client";

import React from "react";
import { AiQuestQrCode } from "@/components/print/AiQuestQrCode";

export type BoxType = "lid" | "base";

const LID_CONFIG = { w: 103, h: 150, d: 50 };
const BASE_CONFIG = { w: 97.5, h: 144.5, d: 48.2 };
const FLAP = 15;

function UKFlag({ size = "16px" }: { size?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 60 30"
      style={{ width: size, height: "auto", border: "1px solid #444", display: "inline-block" }}
    >
      <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="4" />
      <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
      <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
    </svg>
  );
}

export function PrintBoxNet({ template }: { template: BoxType }) {
  const config = template === "lid" ? LID_CONFIG : BASE_CONFIG;
  const { w, h, d } = config;

  const totalW = d + w + d;
  const totalH = d + h + d;

  const contentWidth = `${w}mm`;
  const contentHeight = `${h}mm`;
  const depthSize = `${d}mm`;

  const cutPath = `
        M ${d},0 
        L ${d + w},0 
        L ${d + w + FLAP},5 
        L ${d + w + FLAP},${d - 5} 
        L ${d + w},${d} 
        L ${totalW},${d} 
        L ${totalW},${d + h} 
        L ${d + w},${d + h} 
        L ${d + w + FLAP},${d + h + 5} 
        L ${d + w + FLAP},${totalH - 5} 
        L ${d + w},${totalH} 
        L ${d},${totalH} 
        L ${d - FLAP},${totalH - 5} 
        L ${d - FLAP},${d + h + 5} 
        L ${d},${d + h} 
        L 0,${d + h} 
        L 0,${d} 
        L ${d},${d} 
        L ${d - FLAP},${d - 5} 
        L ${d - FLAP},5 
        Z
    `;

  return (
    <div
      className="print-box-net print-box-wrapper print-color-artifact"
      style={{
        width: `${totalW}mm`,
        height: `${totalH}mm`,
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#fff",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
        WebkitPrintColorAdjust: "exact",
        printColorAdjust: "exact",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: template === "lid" ? "#0f0f13" : "#141416",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: depthSize,
          left: depthSize,
          width: contentWidth,
          height: contentHeight,
          backgroundColor: template === "lid" ? "#07070a" : "#111",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          boxSizing: "border-box",
          border: "1px solid #222",
        }}
      >
        {template === "lid" ? (
          <>
            <img
              src="/ai_quest_logo_clean.png"
              style={{ width: "85%", marginBottom: "8mm" }}
              alt="AI Quest"
            />
            <div
              style={{
                padding: "4px 14px",
                backgroundColor: "#ef4444",
                color: "#fff",
                fontSize: "10px",
                fontWeight: "900",
                borderRadius: "4px",
                letterSpacing: "2px",
              }}
            >
              ENGINEER EDITION
            </div>
            <div
              style={{
                color: "#fff",
                fontSize: "11px",
                fontWeight: "bold",
                letterSpacing: "4px",
                textAlign: "center",
                textShadow: "0 0 10px rgba(239,68,68,0.5)",
                marginTop: "6mm",
              }}
            >
              BUILD. TRAIN. DEPLOY.
            </div>
            <div
              style={{
                color: "#888",
                fontSize: "10px",
                marginTop: "6mm",
                letterSpacing: "3px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              240 CARDS TOTAL <UKFlag size="16px" />
            </div>
          </>
        ) : (
          <>
            <img
              src="/ai_quest_logo_clean.png"
              style={{ width: "40%", marginBottom: "6mm", opacity: 0.5 }}
              alt="AI Quest"
            />
            <div
              style={{
                color: "#ef4444",
                fontSize: "10px",
                fontWeight: "900",
                letterSpacing: "2px",
                marginBottom: "8mm",
              }}
            >
              ENGINEER EDITION
            </div>
            <div
              style={{
                color: "#666",
                fontSize: "8px",
                textAlign: "center",
                maxWidth: "85%",
                lineHeight: "1.8",
                marginBottom: "12mm",
                border: "1px solid #222",
                padding: "10px",
                borderRadius: "8px",
              }}
            >
              <span style={{ color: "#fff", fontWeight: "bold" }}>SYSTEM CONTENTS:</span>
              <br />
              210 ENGINEER DECK CARDS
              <br />
              15 OBJECTIVES + 15 MILESTONES
              <br />
              TRACTION TRACKER + FIELD MANUAL
            </div>
            <div
              style={{
                fontSize: "6px",
                color: "#555",
                fontWeight: "bold",
                letterSpacing: "1px",
                textAlign: "center",
                marginTop: "12mm",
              }}
            >
              CREATED & DESIGNED BY BASSEY RIMAN<br/>PROPERTY OF RIMANSTECH INDUSTRIES. ALL RIGHTS RESERVED.
            </div>
            <div
              style={{
                marginTop: "4mm",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <AiQuestQrCode sizePx={30} variant="dark" />
            </div>
          </>
        )}
      </div>

      <div
        style={{
          position: "absolute",
          top: 0,
          left: depthSize,
          width: contentWidth,
          height: depthSize,
          borderBottom: "1px dashed rgba(255,255,255,0.1)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            transform: `rotate(${template === "lid" ? 180 : 0}deg)`,
            color: "#fff",
            fontWeight: "bold",
            letterSpacing: "5px",
            fontSize: "10px",
            textAlign: "center",
          }}
        >
          AI QUEST: ENGINEER
          <div
            style={{
              fontSize: "6px",
              letterSpacing: "3px",
              marginTop: "2px",
              fontVariant: "small-caps",
              color: "#ef4444",
            }}
          >
            BUILD. TRAIN. DEPLOY.
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: `${d + h}mm`,
          left: depthSize,
          width: contentWidth,
          height: depthSize,
          borderTop: "1px dashed rgba(255,255,255,0.1)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            transform: `rotate(${template === "lid" ? 0 : 180}deg)`,
            color: "#fff",
            fontWeight: "bold",
            letterSpacing: "5px",
            fontSize: "10px",
            textAlign: "center",
          }}
        >
          AI QUEST: ENGINEER
          <div
            style={{
              fontSize: "6px",
              letterSpacing: "3px",
              marginTop: "2px",
              fontVariant: "small-caps",
              color: "#ef4444",
            }}
          >
            BUILD. TRAIN. DEPLOY.
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: depthSize,
          left: 0,
          width: depthSize,
          height: contentHeight,
          borderRight: "1px dashed rgba(255,255,255,0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            transform: `rotate(${template === "lid" ? 90 : -90}deg)`,
            color: template === "lid" ? "#00e5ff" : "#666",
            fontWeight: "bold",
            letterSpacing: "3px",
            fontSize: "9px",
            whiteSpace: "nowrap",
            textAlign: "center",
          }}
        >
          {template === "lid" ? (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              ENGINEER EDITION <UKFlag size="12px" />
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
              <div style={{ fontVariant: "small-caps" }}>240-CARD ENGINEER SET</div>
              <div
                style={{
                  color: "#00e5ff",
                  fontSize: "7px",
                  fontVariant: "small-caps",
                  letterSpacing: "2px",
                }}
              >
                BUILD. TRAIN. DEPLOY.
              </div>
              <div
                style={{
                  color: "#444",
                  fontSize: "5px",
                  marginTop: "4px",
                  fontVariant: "small-caps",
                }}
              >
                CREATED & DESIGNED BY BASSEY RIMAN<br/>PROPERTY OF RIMANSTECH INDUSTRIES. ALL RIGHTS RESERVED.
              </div>
            </div>
          )}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: depthSize,
          left: `${d + w}mm`,
          width: depthSize,
          height: contentHeight,
          borderLeft: "1px dashed rgba(255,255,255,0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            transform: `rotate(${template === "lid" ? -90 : 90}deg)`,
            color: template === "lid" ? "#00e5ff" : "#666",
            fontWeight: "bold",
            letterSpacing: "3px",
            fontSize: "9px",
            whiteSpace: "nowrap",
            textAlign: "center",
          }}
        >
          {template === "lid" ? (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              ENGINEER EDITION <UKFlag size="12px" />
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
              <div style={{ fontVariant: "small-caps" }}>240-CARD ENGINEER SET</div>
              <div
                style={{
                  color: "#00e5ff",
                  fontSize: "7px",
                  fontVariant: "small-caps",
                  letterSpacing: "2px",
                }}
              >
                BUILD. TRAIN. DEPLOY.
              </div>
              <div
                style={{
                  color: "#444",
                  fontSize: "5px",
                  marginTop: "4px",
                  fontVariant: "small-caps",
                }}
              >
                CREATED & DESIGNED BY BASSEY RIMAN<br/>PROPERTY OF RIMANSTECH INDUSTRIES. ALL RIGHTS RESERVED.
              </div>
            </div>
          )}
        </div>
      </div>

      <svg
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 10,
        }}
        viewBox={`0 0 ${totalW} ${totalH}`}
      >
        <path
          d={`M -10,-10 L ${totalW + 10},-10 L ${totalW + 10},${totalH + 10} L -10,${totalH + 10} Z ${cutPath}`}
          fill="#ffffff"
          fillRule="evenodd"
        />
        <path d={cutPath} fill="none" stroke="#666" strokeWidth="0.5" />
        <g stroke="#999" strokeWidth="0.4" strokeDasharray="3,2">
          <line x1={d} y1={d} x2={d + w} y2={d} />
          <line x1={d} y1={d + h} x2={d + w} y2={d + h} />
          <line x1={d} y1={d} x2={d} y2={d + h} />
          <line x1={d + w} y1={d} x2={d + w} y2={d + h} />
          <line x1={d} y1={0} x2={d} y2={d} />
          <line x1={d + w} y1={0} x2={d + w} y2={d} />
          <line x1={d} y1={d + h} x2={d} y2={totalH} />
          <line x1={d + w} y1={d + h} x2={d + w} y2={totalH} />
        </g>
      </svg>
    </div>
  );
}
