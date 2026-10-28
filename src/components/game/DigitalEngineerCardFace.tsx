"use client";

import React, { useRef, useState, useEffect } from "react";
import { EngineerCard } from "@/types/engineer-mode";
import { EngineerPrintCard } from "@/components/print/EngineerPrintCard";
import { SystemObjectiveCard } from "@/components/print/SystemObjectiveCard";
import { MilestoneCard } from "@/components/print/MilestoneCard";

interface DigitalEngineerCardFaceProps {
  card: EngineerCard;
  className?: string;
}

// 1mm = 3.7795275591 px at 96 DPI
const MM_TO_PX = 3.7795275591;

/** First-edition print card art, dynamically and accurately scaled to fit any digital container. */
export function DigitalEngineerCardFace({ card, className = "" }: DigitalEngineerCardFaceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number>(0.55);

  const isObjective = card.category === "SYSTEM OBJECTIVE";
  const isMilestone = card.category === "MILESTONE";
  const baseMmW = isObjective || isMilestone ? 66 : 63.5;
  const baseMmH = isObjective || isMilestone ? 91 : 88.9;
  const basePxW = baseMmW * MM_TO_PX;
  const basePxH = baseMmH * MM_TO_PX;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateScale = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        const sx = rect.width / basePxW;
        const sy = rect.height / basePxH;
        setScale(Math.min(sx, sy));
      }
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(el);
    return () => observer.disconnect();
  }, [basePxW, basePxH]);

  return (
    <div
      ref={containerRef}
      className={`digital-card-face relative w-full h-full overflow-hidden rounded-[14px] select-none bg-[#050a14] ${className}`}
    >
      <div
        className="absolute top-0 left-0 origin-top-left pointer-events-none"
        style={{
          width: `${baseMmW}mm`,
          height: `${baseMmH}mm`,
          transform: `scale(${scale})`,
        }}
      >
        {isObjective ? (
          <SystemObjectiveCard
            id={card.id}
            title={card.name}
            description={card.description}
            iconName="Target"
          />
        ) : isMilestone ? (
          <MilestoneCard
            id={card.id}
            title={card.name}
            description={card.description}
            points={String(card.ipValue || 30)}
          />
        ) : (
          <EngineerPrintCard card={card} />
        )}
      </div>
    </div>
  );
}
