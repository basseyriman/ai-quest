"use client";

import React from "react";

import { AI_QUEST_LANDING_URL } from "@/lib/brand";

export { AI_QUEST_LANDING_URL };

const QR_IMAGE_SRC = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(AI_QUEST_LANDING_URL)}`;

type AiQuestQrCodeProps = {
  /** QR image width/height in pixels */
  sizePx?: number;
  /** dark = box base panels; print = manual / light backgrounds */
  variant?: "dark" | "print";
};

export function AiQuestQrCode({ sizePx = 30, variant = "dark" }: AiQuestQrCodeProps) {
  const labelColor = variant === "dark" ? "#888" : "#666";
  const urlColor = variant === "dark" ? "#555" : "#444";

  return (
    <div className="flex flex-col items-center gap-[1mm] shrink-0">
      <div
        className="bg-white p-[1px] flex rounded-sm"
        style={{ border: variant === "print" ? "1px solid #d4d4d8" : undefined }}
      >
        <img
          src={QR_IMAGE_SRC}
          style={{ width: `${sizePx}px`, height: `${sizePx}px` }}
          alt="AI Quest QR Code"
        />
      </div>
      <div className="flex flex-col items-center text-center leading-tight">
        <span
          style={{
            fontSize: variant === "print" ? "6pt" : "6px",
            color: labelColor,
            fontVariant: "small-caps",
            letterSpacing: "0.5px",
          }}
        >
          Scan for Intel
        </span>
        <span
          style={{
            fontSize: variant === "print" ? "5.5pt" : "5px",
            color: urlColor,
            fontVariant: "small-caps",
            letterSpacing: "0.3px",
          }}
        >
          rimanstech.com/ai-quest
        </span>
      </div>
    </div>
  );
}
