"use client";

import { EngineerCard } from "@/types/engineer-mode";
import { EngineerPrintCard } from "@/components/print/EngineerPrintCard";

interface DigitalEngineerCardFaceProps {
  card: EngineerCard;
  className?: string;
}

/** First-edition print card art, scaled to fit digital play areas. */
export function DigitalEngineerCardFace({ card, className = "" }: DigitalEngineerCardFaceProps) {
  return (
    <div
      className={`digital-card-face relative w-full h-full overflow-hidden rounded-[20px] ${className}`}
      style={{ containerType: "size" }}
    >
      <div
        className="absolute top-0 left-0 origin-top-left"
        style={{
          width: "63.5mm",
          height: "88.9mm",
          transform: "scale(min(calc(100cqw / 63.5mm), calc(100cqh / 88.9mm)))",
        }}
      >
        <EngineerPrintCard card={card} />
      </div>
    </div>
  );
}
