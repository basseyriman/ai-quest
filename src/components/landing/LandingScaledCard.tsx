"use client";

import React from "react";

/** Scales print-sized cards (63.5×88.9 mm) for screen display. */
export function LandingScaledCard({
  scale = 0.52,
  rotate = 0,
  className = "",
  children,
}: {
  scale?: number;
  rotate?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const w = 63.5 * scale;
  const h = 88.9 * scale;

  return (
    <div
      className={`landing-scaled-card ${className}`}
      style={{
        width: `${w}mm`,
        height: `${h}mm`,
        transform: rotate ? `rotate(${rotate}deg)` : undefined,
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          width: "63.5mm",
          height: "88.9mm",
        }}
      >
        {children}
      </div>
    </div>
  );
}
