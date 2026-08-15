/** 0–100 IP track — 25 IP per side, numbers in outer gutter (mm, y-down). */

export type TrackPoint = {
  x: number;
  y: number;
  tangentDeg: number;
  side: "bottom" | "right" | "top" | "left";
};

export const CARD_W = 63;
export const CARD_H = 88;
export const CORNER_R = 3;
export const TRACK_INSET = 6.5;
export const LABEL_GUTTER = 3.5;

function bounds() {
  const x1 = TRACK_INSET;
  const y1 = TRACK_INSET;
  const x2 = CARD_W - TRACK_INSET;
  const y2 = CARD_H - TRACK_INSET;
  const r = CORNER_R;
  return { x1, y1, x2, y2, r, bottomLen: x2 - x1 - 2 * r, rightLen: y2 - y1 - 2 * r };
}

/** Bottom → right → top → left, 25 IP per side. */
export function pointOnIpTrack(ip: number): TrackPoint {
  const { x1, y1, x2, y2, r, bottomLen, rightLen } = bounds();
  const v = Math.max(0, Math.min(100, ip));

  if (v <= 25) {
    const t = v / 25;
    return { x: x1 + r + t * bottomLen, y: y2, tangentDeg: 0, side: "bottom" };
  }
  if (v <= 50) {
    const t = (v - 25) / 25;
    return { x: x2, y: y2 - r - t * rightLen, tangentDeg: -90, side: "right" };
  }
  if (v <= 75) {
    const t = (v - 50) / 25;
    return { x: x2 - r - t * bottomLen, y: y1, tangentDeg: 180, side: "top" };
  }
  const t = (v - 75) / 25;
  return { x: x1, y: y1 + r + t * rightLen, tangentDeg: 90, side: "left" };
}

export function ipTrackPathD(): string {
  const { x1, y1, x2, y2, r } = bounds();
  return [
    `M ${x1 + r} ${y2}`,
    `L ${x2 - r} ${y2}`,
    `Q ${x2} ${y2} ${x2} ${y2 - r}`,
    `L ${x2} ${y1 + r}`,
    `Q ${x2} ${y1} ${x2 - r} ${y1}`,
    `L ${x1 + r} ${y1}`,
    `Q ${x1} ${y1} ${x1} ${y1 + r}`,
    `L ${x1} ${y2 - r}`,
    `Q ${x1} ${y2} ${x1 + r} ${y2}`,
  ].join(" ");
}

/** Labels in outer gutter — matches IP card increments (multiples of 5). */
export function gutterLabel(ip: number): { x: number; y: number } {
  const g = LABEL_GUTTER;
  const { x1, y1, x2, y2, r, bottomLen, rightLen } = bounds();

  if (ip <= 25) {
    const t = ip / 25;
    return { x: x1 + r + t * bottomLen, y: CARD_H - g };
  }
  if (ip <= 50) {
    const t = (ip - 25) / 25;
    return { x: CARD_W - g, y: y2 - r - t * rightLen };
  }
  if (ip <= 75) {
    const t = (ip - 50) / 25;
    return { x: x2 - r - t * bottomLen, y: g };
  }
  const t = (ip - 75) / 25;
  return { x: g, y: y1 + r + t * rightLen };
}

export const IP_TRACK_CARD = { width: CARD_W, height: CARD_H };

/** Every 5 IP on the track scale. */
export const LABEL_IPS = Array.from({ length: 21 }, (_, i) => i * 5);
