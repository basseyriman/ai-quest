"use client";

import React from "react";
import { Orbitron } from "next/font/google";
import { EngineerPrintCard } from "@/components/print/EngineerPrintCard";
import { SystemObjectiveCard } from "@/components/print/SystemObjectiveCard";
import { LandingScaledCard } from "@/components/landing/LandingScaledCard";
import { LandingGameBox3D } from "@/components/landing/LandingGameBox3D";
import { AiQuestQrCode } from "@/components/print/AiQuestQrCode";
import {
  LANDING_OBJECTIVE_ICON,
  LANDING_SHOWCASE_CARDS,
} from "@/lib/landing/showcaseCards";
import {
  AI_QUEST_LANDING_URL,
  COMPANY_NAME,
  FULL_GAME_SET_SIZE,
} from "@/lib/brand";

const orbitron = Orbitron({ subsets: ["latin"] });

const engineerCards = LANDING_SHOWCASE_CARDS.filter(
  (c) => c.category !== "SYSTEM OBJECTIVE",
);
const objectiveCard = LANDING_SHOWCASE_CARDS.find(
  (c) => c.category === "SYSTEM OBJECTIVE",
)!;

export type PlaytestPosterDetails = {
  date: string;
  time: string;
  location: string;
  subtitle: string;
  variant?: "3d" | "photo" | "banner";
};

const DEFAULT_DETAILS: PlaytestPosterDetails = {
  date: "Saturday · 14 June 2026",
  time: "2:00 PM – 5:00 PM",
  location: "Your venue · City",
  subtitle: "Free to play · All skill levels welcome · Your feedback shapes the game",
  variant: "photo",
};

type PlaytestEventPosterProps = Partial<PlaytestPosterDetails>;

function PlaytestPosterHero() {
  const peekCards = [
    {
      key: "left",
      className:
        "landing-cards-fan__card landing-cards-fan__card--left playtest-poster__hero-card",
      scale: 0.62,
      content: <EngineerPrintCard card={engineerCards[0]} />,
    },
    {
      key: "center",
      className:
        "landing-cards-fan__card landing-cards-fan__card--center playtest-poster__hero-card",
      scale: 0.68,
      content: (
        <SystemObjectiveCard
          id="obj-1"
          title={objectiveCard.name}
          description={objectiveCard.description}
          iconName={LANDING_OBJECTIVE_ICON}
        />
      ),
    },
    {
      key: "right",
      className:
        "landing-cards-fan__card landing-cards-fan__card--right playtest-poster__hero-card",
      scale: 0.62,
      content: <EngineerPrintCard card={engineerCards[4]} />,
    },
  ];

  return (
    <div className="playtest-poster__hero">
      <div className="playtest-poster__hero-glow" aria-hidden />
      <div className="landing-box-scene playtest-poster__hero-scene">
        <div className="landing-cards-fan playtest-poster__hero-fan">
          {peekCards.map((item) => (
            <div key={item.key} className={item.className}>
              <LandingScaledCard scale={item.scale}>{item.content}</LandingScaledCard>
            </div>
          ))}
        </div>
        <div className="landing-box3d-wrap playtest-poster__hero-box">
          <LandingGameBox3D scale={3.15} />
        </div>
      </div>
    </div>
  );
}

export function PlaytestEventPoster({
  date = DEFAULT_DETAILS.date,
  time = DEFAULT_DETAILS.time,
  location = DEFAULT_DETAILS.location,
  subtitle = DEFAULT_DETAILS.subtitle,
  variant = "photo",
}: PlaytestEventPosterProps) {
  if (variant === "banner") {
    return (
      <article
        className={`playtest-poster playtest-poster--banner print-color-artifact ${orbitron.className}`}
        aria-label="AI Quest Eventbrite banner"
      >
        {/* Borders */}
        <div className="playtest-poster__border-frame" />
        <div className="playtest-poster__border-corners" />
        <div className="playtest-poster__circuit-bg" />

        {/* Left Content Side */}
        <div className="playtest-poster__banner-left">
          {/* Logo & Title */}
          <div className="playtest-poster__banner-logo-row">
            <img
              src="/logo.png"
              alt="AI Quest Logo"
              className="playtest-poster__banner-logo"
            />
            <h2 className="playtest-poster__banner-title">Playtesting Event</h2>
          </div>

          {/* Tagline */}
          <div className="playtest-poster__banner-tagline">
            {(() => {
              const upper = subtitle.toUpperCase();
              const parts = upper.split(/[·•|]/).map(p => p.trim()).filter(Boolean);
              if (parts.length >= 2) {
                if (parts.length === 3) {
                  return (
                    <>
                      <div>{parts[0]} &middot; {parts[1]}</div>
                      <div>{parts[2]}</div>
                    </>
                  );
                }
                return (
                  <>
                    <div>{parts[0]}</div>
                    <div>{parts[1]}</div>
                  </>
                );
              }
              const sentences = upper.split(/(?<=\.)\s+/).map(s => s.trim()).filter(Boolean);
              if (sentences.length >= 2) {
                return (
                  <>
                    <div>{sentences[0]}</div>
                    <div>{sentences[1]}</div>
                  </>
                );
              }
              return <div>{upper}</div>;
            })()}
          </div>

          {/* Details Grid */}
          <div className="playtest-poster__banner-grid">
            <div className="playtest-poster__banner-row">
              <span className="playtest-poster__banner-label">Date:</span>
              <span className="playtest-poster__banner-value">{date}</span>
            </div>
            <div className="playtest-poster__banner-row">
              <span className="playtest-poster__banner-label">Time:</span>
              <span className="playtest-poster__banner-value">{time}</span>
            </div>
            <div className="playtest-poster__banner-row">
              <span className="playtest-poster__banner-label">Location:</span>
              <span className="playtest-poster__banner-value">{location}</span>
            </div>
          </div>

          {/* Footer Bar */}
          <footer className="playtest-poster__banner-footer">
            <span>@AIQUEST</span>
            <span className="playtest-poster__banner-footer-sep">|</span>
            <span>WWW.AIQUESTGAME.COM</span>
          </footer>
        </div>

        {/* Right Photo Side */}
        <div className="playtest-poster__banner-right">
          <div className="playtest-poster__banner-image-frame">
            <img
              src="/ai_quest_playtest_round_table.png"
              alt="Playtesting AI Quest around a table"
              className="playtest-poster__banner-image"
            />
          </div>
        </div>
      </article>
    );
  }

  if (variant === "photo") {
    return (
      <article
        className={`playtest-poster playtest-poster--photo print-color-artifact ${orbitron.className}`}
        aria-label="AI Quest playtest event poster"
      >
        {/* Full-bleed background photo with overlay */}
        <div className="playtest-poster__bg-photo-wrap">
          <img
            src="/ai_quest_playtest_round_table.png"
            alt="Playtesting background"
            className="playtest-poster__bg-photo-img"
          />
          <div className="playtest-poster__bg-photo-overlay" />
        </div>

        {/* Futuristic neon border & circuit overlays */}
        <div className="playtest-poster__border-frame" />
        <div className="playtest-poster__border-corners" />
        <div className="playtest-poster__circuit-bg" />

        <div className="playtest-poster__content">
          {/* Top Logo & Heading */}
          <header className="playtest-poster__header-photo">
            <img
              src="/logo.png"
              alt="AI Quest Logo"
              className="playtest-poster__logo-photo"
            />
            <h2 className="playtest-poster__title-photo">Playtesting Event</h2>
          </header>

          {/* Central spacer to reveal the background photo */}
          <div className="flex-1 min-h-0" />

          {/* Tagline */}
          <div className="playtest-poster__tagline-photo">
            {(() => {
              const upper = subtitle.toUpperCase();
              const parts = upper.split(/[·•|]/).map(p => p.trim()).filter(Boolean);
              
              if (parts.length >= 2) {
                if (parts.length === 3) {
                  return (
                    <>
                      <div>{parts[0]} &middot; {parts[1]}</div>
                      <div>{parts[2]}</div>
                    </>
                  );
                }
                return (
                  <>
                    <div>{parts[0]}</div>
                    <div>{parts[1]}</div>
                  </>
                );
              }
              
              // Fallback split by sentence periods if no bullet marks
              const sentences = upper.split(/(?<=\.)\s+/).map(s => s.trim()).filter(Boolean);
              if (sentences.length >= 2) {
                return (
                  <>
                    <div>{sentences[0]}</div>
                    <div>{sentences[1]}</div>
                  </>
                );
              }
              
              return <div>{upper}</div>;
            })()}
          </div>

          {/* Details Grid */}
          <div className="playtest-poster__details-grid">
            <div className="playtest-poster__details-col">
              <span className="playtest-poster__col-label">Date:</span>
              <span className="playtest-poster__col-value">{date}</span>
            </div>
            <div className="playtest-poster__details-divider" />
            <div className="playtest-poster__details-col">
              <span className="playtest-poster__col-label">Time:</span>
              <span className="playtest-poster__col-value">{time}</span>
            </div>
            <div className="playtest-poster__details-divider" />
            <div className="playtest-poster__details-col">
              <span className="playtest-poster__col-label">Location:</span>
              <span className="playtest-poster__col-value">{location}</span>
            </div>
          </div>

          {/* Bottom Social Bar */}
          <footer className="playtest-poster__footer-photo">
            <span>@AIQUEST</span>
            <span className="playtest-poster__footer-sep">|</span>
            <span>WWW.AIQUESTGAME.COM</span>
            <span className="playtest-poster__footer-sep">|</span>
            <span>JOIN US & GIVE FEEDBACK</span>
          </footer>
        </div>
      </article>
    );
  }

  // Original light-themed 3D box and card fan variant
  return (
    <article
      className={`playtest-poster print-color-artifact ${orbitron.className}`}
      aria-label="AI Quest playtest event poster"
    >
      <div className="playtest-poster__upper">
        <div className="playtest-poster__upper-bg" aria-hidden />
        <div className="playtest-poster__mesh" aria-hidden />

        <header className="playtest-poster__masthead">
          <img
            src="/ai_quest_logo_clean.png"
            alt=""
            className="playtest-poster__masthead-logo"
          />
          <div className="playtest-poster__masthead-text">
            <p className="playtest-poster__masthead-kicker">Official Playtest</p>
            <p className="playtest-poster__masthead-edition">Engineer Edition</p>
          </div>
        </header>

        <PlaytestPosterHero />
      </div>

      <footer className="playtest-poster__strip">
        <div className="playtest-poster__strip-grid">
          <div className="playtest-poster__strip-cell">
            <span className="playtest-poster__strip-label">Date</span>
            <span className="playtest-poster__strip-value">{date}</span>
          </div>
          <div className="playtest-poster__strip-cell">
            <span className="playtest-poster__strip-label">Time</span>
            <span className="playtest-poster__strip-value">{time}</span>
          </div>
          <div className="playtest-poster__strip-cell">
            <span className="playtest-poster__strip-label">Where</span>
            <span className="playtest-poster__strip-value">{location}</span>
          </div>
        </div>

        <p className="playtest-poster__strip-tagline">{subtitle}</p>

        <div className="playtest-poster__strip-foot">
          <p className="playtest-poster__strip-specs">
            {FULL_GAME_SET_SIZE} cards · 2–8 players · 60–90 min · 7 ML stages
          </p>
          <div className="playtest-poster__strip-brand">
            <AiQuestQrCode sizePx={72} variant="dark" />
            <div className="playtest-poster__strip-brand-text">
              <span className="playtest-poster__strip-game">AI Quest</span>
              <span className="playtest-poster__strip-company">{COMPANY_NAME}</span>
              <span className="playtest-poster__strip-url">
                {AI_QUEST_LANDING_URL.replace("https://", "")}
              </span>
            </div>
          </div>
        </div>
      </footer>
    </article>
  );
}
