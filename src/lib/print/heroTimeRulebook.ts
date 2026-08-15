/** HeroTime one-sheet rulebook template geometry (151 × 213 mm sheet including 1.5mm bleed). */
export const RULEBOOK_FACTORY_SHEET = {
  widthMm: 151,
  heightMm: 213,
  widthPt: 428.03, // 151 * 72 / 25.4
  heightPt: 603.78, // 213 * 72 / 25.4
} as const;

/** Trim size of the flat A5 rulebook panel on the factory sheet. */
export const RULEBOOK_ARTWORK = {
  widthMm: 148,
  heightMm: 210,
  widthPt: 419.53, // 148 * 72 / 25.4
  heightPt: 595.28, // 210 * 72 / 25.4
  /** 1.5mm bleed offset */
  leftPt: 4.252, 
  topPt: 4.252,
} as const;

/** HeroTime template: green safe margin inside each panel. */
export const RULEBOOK_SAFE_MARGIN_MM = 5;

/** HeroTime template: blue bleed outside trim (when extending backgrounds). */
export const RULEBOOK_BLEED_MM = 1.5;
