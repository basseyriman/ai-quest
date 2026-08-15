"use client";

import React from "react";
import { FULL_GAME_SET_SIZE } from "@/lib/brand";

/** Lid dimensions from PrintBoxNet — 87 × 127 × 40 mm */
const W = 87;
const H = 127;
const D = 40;
/** Default scale for PNG export page */
const EXPORT_SCALE = 3.15;

function UKFlag() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" className="landing-box3d__flag" aria-hidden>
      <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="4" />
      <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
      <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
    </svg>
  );
}

function LidFrontFace() {
  return (
    <div className="landing-box3d__face landing-box3d__face--front">
      <img src="/ai_quest_logo_clean.png" alt="" className="landing-box3d__logo" />
      <div className="landing-box3d__badge">ENGINEER EDITION</div>
      <div className="landing-box3d__tagline">BUILD. TRAIN. DEPLOY.</div>
      <div className="landing-box3d__meta">
        {FULL_GAME_SET_SIZE} CARDS TOTAL <UKFlag />
      </div>
    </div>
  );
}

function LidTopFace() {
  return (
    <div className="landing-box3d__face landing-box3d__face--top">
      <div className="landing-box3d__spine">
        AI QUEST: ENGINEER
        <span>BUILD. TRAIN. DEPLOY.</span>
      </div>
    </div>
  );
}

function LidSideFace({ side }: { side: "left" | "right" }) {
  return (
    <div className={`landing-box3d__face landing-box3d__face--${side}`}>
      <div className="landing-box3d__side-label">
        ENGINEER EDITION <UKFlag />
      </div>
    </div>
  );
}

/** CSS 3D retail box — matches PrintBoxNet lid artwork */
export function LandingGameBox3D({
  className = "",
  scale = 2.35,
}: {
  className?: string;
  /** Pixel scale from print mm dimensions (use ~3.15 on landing hero) */
  scale?: number;
}) {
  const w = W * scale;
  const h = H * scale;
  const d = D * scale;

  return (
    <div
      className={`landing-box3d-scene ${className}`}
      style={
        {
          "--box-w": `${w}px`,
          "--box-h": `${h}px`,
          "--box-d": `${d}px`,
        } as React.CSSProperties
      }
    >
      <div className="landing-box3d">
        <div className="landing-box3d__solid">
          <LidFrontFace />
          <div className="landing-box3d__face landing-box3d__face--back" />
          <LidSideFace side="left" />
          <LidSideFace side="right" />
          <LidTopFace />
          <div className="landing-box3d__face landing-box3d__face--bottom" />
        </div>
      </div>
    </div>
  );
}

/** Static markup for PNG export page (same visuals, export-friendly id) */
export function LandingGameBox3DExport() {
  return (
    <div id="box-3d-export-root" style={{ background: "transparent", padding: 48 }}>
      <LandingGameBox3D scale={EXPORT_SCALE} className="landing-box3d-scene--export" />
    </div>
  );
}
