"use client";

import React from "react";
import Link from "next/link";
import { EngineerPrintCard } from "@/components/print/EngineerPrintCard";
import { SystemObjectiveCard } from "@/components/print/SystemObjectiveCard";
import { LandingScaledCard } from "@/components/landing/LandingScaledCard";
import { LandingGameBox3D } from "@/components/landing/LandingGameBox3D";
import { LANDING_OBJECTIVE_ICON, LANDING_SHOWCASE_CARDS } from "@/lib/landing/showcaseCards";
import { AI_QUEST_LANDING_URL, COMPANY_NAME, FULL_GAME_SET_SIZE, RIMANSTECH_URL } from "@/lib/brand";

const engineerCards = LANDING_SHOWCASE_CARDS.filter((c) => c.category !== "SYSTEM OBJECTIVE");
const objectiveCard = LANDING_SHOWCASE_CARDS.find((c) => c.category === "SYSTEM OBJECTIVE")!;

function useHeroCardScales() {
  const [scales, setScales] = React.useState({ side: 0.82, center: 0.88 });

  React.useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 640) setScales({ side: 0.5, center: 0.54 });
      else if (w < 900) setScales({ side: 0.64, center: 0.68 });
      else setScales({ side: 0.82, center: 0.88 });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return scales;
}

export function AiQuestLandingPage() {
  const cardScales = useHeroCardScales();

  const peekCards = [
    {
      key: "left",
      className: "landing-cards-fan__card landing-cards-fan__card--left",
      scale: cardScales.side,
      content: <EngineerPrintCard card={engineerCards[0]} />,
    },
    {
      key: "center",
      className: "landing-cards-fan__card landing-cards-fan__card--center",
      scale: cardScales.center,
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
      className: "landing-cards-fan__card landing-cards-fan__card--right",
      scale: cardScales.side,
      content: <EngineerPrintCard card={engineerCards[4]} />,
    },
  ];
  return (
    <>
      <header className="landing-nav-wrap">
        <nav className="landing-nav-bar">
          <Link href="/ai-quest">
            <img src="/ai_quest_logo_clean.png" alt="AI Quest" className="landing-nav-bar__logo" />
          </Link>
          <Link href="/" className="landing-btn landing-btn--ghost">
            Play online
          </Link>
        </nav>
      </header>

      <main className="landing-hero">
        <div className="landing-hero__stage">
          <div className="landing-hero__accent landing-hero__accent--left" aria-hidden />
          <div className="landing-hero__accent landing-hero__accent--right" aria-hidden />
          <div className="landing-hero__glow" aria-hidden />
          <div className="landing-hero__ground" aria-hidden />

          <div className="landing-box-scene">
            <div className="landing-cards-fan">
              {peekCards.map((item) => (
                <div key={item.key} className={item.className}>
                  <LandingScaledCard scale={item.scale}>{item.content}</LandingScaledCard>
                </div>
              ))}
            </div>

            <div
              className="landing-box3d-wrap landing-box3d-wrap--hero"
              role="img"
              aria-label="AI Quest Engineer Edition — 240 cards"
            >
              <LandingGameBox3D scale={3.2} />
            </div>
          </div>

          <div className="landing-hero-panel">
            <div className="landing-hero-panel__shine" aria-hidden />
            <p className="landing-hero-panel__kicker">Engineer Edition</p>
            <div className="landing-hero-panel__divider" aria-hidden />
            <p className="landing-hero-panel__tagline">Build · Train · Deploy</p>
            <p className="landing-hero-panel__sub">
              The premium AI engineering card game. Race through seven real ML lifecycle stages
              and be first to deploy.
            </p>
            <ul className="landing-hero-panel__stats" aria-label="Game details">
              <li>{FULL_GAME_SET_SIZE} cards</li>
              <li>7 stages</li>
              <li>2–8 players</li>
            </ul>
            <div className="landing-hero-panel__actions">
              <Link href="/" className="landing-btn landing-btn--primary">
                Play free
              </Link>
              <Link href="/print-manual/full" className="landing-btn landing-btn--ghost">
                Rules
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="landing-footer">
        <p>
          AI Quest · A product of{" "}
          <a href={RIMANSTECH_URL} target="_blank" rel="noopener noreferrer">
            {COMPANY_NAME}
          </a>
          {" · "}
          {AI_QUEST_LANDING_URL.replace("https://", "")}
          {" · "}© {new Date().getFullYear()}
        </p>
      </footer>
    </>
  );
}
