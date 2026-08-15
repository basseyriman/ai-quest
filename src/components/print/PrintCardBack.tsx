"use client";

import React from "react";

/** Same shield logo used on face-down decks in the digital game. */
export const CARD_BACK_LOGO_SRC = "/logo.png";

interface PrintCardBackProps {
    className?: string;
    variant?: "engineer" | "objective" | "milestone" | "reference";
}

/** Standard poker-size back — matches digital deck stacks. */
export function PrintCardBack({ className = "", variant = "engineer" }: PrintCardBackProps) {
    // Determine color schemes based on card type
    let bgColor = "#050A14"; // Default Dark Blue
    let strokeColor = "rgba(71, 85, 105, 0.5)"; // Slate-600/50
    let innerBorderColor = "rgba(255, 255, 255, 0.1)";
    let glowColor = "rgba(34, 211, 238, 0.2)"; // Cyan glow

    if (variant === "objective") {
        bgColor = "#141204"; // Dark Gold
        strokeColor = "rgba(161, 98, 7, 0.5)"; // Gold-700/50
        innerBorderColor = "rgba(234, 179, 8, 0.15)";
        glowColor = "rgba(234, 179, 8, 0.25)";
    } else if (variant === "milestone") {
        bgColor = "#180509"; // Dark Red
        strokeColor = "rgba(185, 28, 28, 0.5)"; // Red-700/50
        innerBorderColor = "rgba(239, 68, 68, 0.15)";
        glowColor = "rgba(239, 68, 68, 0.25)";
    } else if (variant === "reference") {
        bgColor = "#0f172a"; // Slate-900
        strokeColor = "rgba(100, 116, 139, 0.5)"; // Slate-500/50
        innerBorderColor = "rgba(255, 255, 255, 0.08)";
        glowColor = "rgba(255, 255, 255, 0.15)";
    }

    return (
        <div
            className={`w-[66mm] h-[91mm] box-border rounded-[3.5mm] relative shrink-0 overflow-hidden flex items-center justify-center print:shadow-none print-color-artifact ${className}`}
            style={{
                backgroundColor: bgColor,
                boxShadow:
                    "0 0 0 1px rgba(255,255,255,0.08), 0 8px 32px rgba(0,0,0,0.8), 0 2px 8px rgba(0,0,0,0.6)",
                WebkitPrintColorAdjust: "exact",
                printColorAdjust: "exact",
            }}
        >
            <div
                className="absolute inset-0 rounded-[3.5mm] border pointer-events-none"
                style={{ borderColor: strokeColor }}
                aria-hidden
            />
            <div
                className="absolute inset-[3mm] rounded-[2mm] border pointer-events-none"
                style={{ borderColor: innerBorderColor }}
                aria-hidden
            />
            <img
                src={CARD_BACK_LOGO_SRC}
                alt=""
                className="relative z-10 w-[70%] h-auto object-contain opacity-90"
                style={{ filter: `drop-shadow(0 0 2.5mm ${glowColor})` }}
                draggable={false}
            />
        </div>
    );
}
