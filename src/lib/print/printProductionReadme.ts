import {
    FULL_GAME_SET_SIZE,
    OBJECTIVE_DECK,
    RETAIL_ENGINEER_DECK,
    RETAIL_ENGINEER_DECK_SIZE,
} from "@/lib/engineer-mode/cards";
import { MILESTONE_CARDS } from "@/lib/engineer-mode/milestones";
import { PRINT_EXPORT_JOBS } from "./printExportManifest";

const countByCategory = (category: string) =>
    RETAIL_ENGINEER_DECK.filter((c) => c.category === category).length;

/** Full production brief included in every print-pack ZIP (README.txt). */
export function buildPrintProductionReadme(): string {
    const engineerCounts = [
        ["Data Collection", countByCategory("DATA COLLECTION")],
        ["Data Preparation", countByCategory("DATA PREPARATION")],
        ["Feature Engineering", countByCategory("FEATURE ENGINEERING")],
        ["Model Selection", countByCategory("MODEL SELECTION")],
        ["Model Training", countByCategory("MODEL TRAINING")],
        ["Model Evaluation", countByCategory("MODEL EVALUATION")],
        ["Deployment", countByCategory("DEPLOYMENT")],
    ] as const;

    const fileList = PRINT_EXPORT_JOBS.map(
        (j) => `  • ${j.filename.padEnd(28)} ${j.label}`
    ).join("\n");

    const deckLines = engineerCounts
        .map(([name, n]) => `  • ${name.padEnd(22)} ${n} cards`)
        .join("\n");

    return `
================================================================================
  AI QUEST — PRODUCTION SPECIFICATION & PRINT BRIEF
  Engineer Mode · Official Rules v1.0 · First Edition
================================================================================

CLIENT HANDOFF
--------------
All artwork, dimensions, quantities, materials, and assembly notes required
to manufacture this game are contained in this README and the accompanying
PDF files in this ZIP. No separate creative brief is needed — use this
document as the single source of truth for the job.


1. PRODUCT SUMMARY
------------------
  Game title       AI Quest (Engineer Mode)
  Edition          First Edition · Retail / physical print-and-play
  Total components One complete game set per unit ordered
  Total cards      ${FULL_GAME_SET_SIZE} cards (${RETAIL_ENGINEER_DECK_SIZE} engineer + ${OBJECTIVE_DECK.length} objectives + ${MILESTONE_CARDS.length} milestones)
  Rules version    Official Rules v1.0


2. FINISHED CARD SPECIFICATION (ALL GAME CARDS)
------------------------------------------------
  Trim size        63.5 mm × 88.9 mm  (standard poker / US game card)
  Imperial         2.5 in × 3.5 in (nominal)
  Corner radius    3 mm rounded corners
  Orientation      Portrait
  Faces            Full colour (CMYK print from supplied PDFs)
  Card backs       ONE shared back design on all ${FULL_GAME_SET_SIZE} cards
                   (dark navy #050A14 + centred shield logo — see file backs)
  Bleed            Artwork supplied at TRIM size. If your workflow requires
                   bleed, add 3 mm on all sides — do not scale artwork down.
  Duplex           Each card PDF lists FRONTS first, then matching BACKS on
                   following pages (same 2×3 grid position per sheet).


3. SHEET LAYOUT (CARD PDFs)
---------------------------
  Press sheet      A4 portrait — 210 mm × 297 mm
  Imposition       6 cards per side — 2 columns × 3 rows
  Standard grid    4 mm gap between cards · 5 mm outer margin (most decks)
  Tight grid       2 mm gap · 2 mm margin (objective & milestone decks)
  Cards per A4     6 fronts OR 6 backs per printed sheet
  Scale            100% — ACTUAL SIZE — never “Fit to page”
  Colour           Background graphics / full colour MUST be enabled
  Verification     After test print, one card must measure 63.5 × 88.9 mm


4. CARD COUNT BREAKDOWN (${FULL_GAME_SET_SIZE} TOTAL)
-----------------------------------------------------
  ENGINEER PIPELINE DECK (${RETAIL_ENGINEER_DECK_SIZE} cards — shared card back)
${deckLines}

  SYSTEM OBJECTIVE DECK (${OBJECTIVE_DECK.length} cards — unique fronts, shared back)
  MILESTONE DECK (${MILESTONE_CARDS.length} cards — unique fronts, shared back)

  Note: Engineer cards appear once in category PDFs (03–09) and again in
  10-full-engineer-deck.pdf (with rulebook pages). Print EITHER the category
  PDFs OR the full engineer PDF — not both — to avoid duplicate cards.


5. CARD BACK (UNIFORM — ALL DECKS)
----------------------------------
  Background       #050A14 (dark navy)
  Border           Slate outer frame + subtle inner white keyline
  Centre art       AI Quest shield logo (70% card width, centred)
  Finish           Match card face stock; same back on every card in the set


6. RECOMMENDED MATERIALS & FINISH
---------------------------------
  Game cards (${FULL_GAME_SET_SIZE})
    • Stock: 300–350 gsm BLACK CORE or BLUE CORE casino / poker cardstock
    • Finish: Matte or linen anti-glare (avoid glossy for gameplay)
    • Cut: Precision guillotine to 63.5 × 88.9 mm, 3 mm corner round
    • Optional: Professional card sleeves size Standard / USA (63.5 × 88 mm)

  IP score trackers (8 per set — 2 A4 sheets, 4 per page — see section 9)
    • Same stock as cards OR 250–300 gsm coated board
    • Trim: 63 × 88 mm (slightly shorter than game cards — intentional)

  Box lid & base (1 of each per set)
    • Stock: 300 gsm+ cardstock OR 1.5–2 mm greyboard wrapped in print
    • Finish: Matte laminate on outer surfaces
    • Assembly: Cut on solid lines, fold on dashed lines, glue 15 mm corner tabs

  Box insert manual (1 per set)
    • Stock: 150–200 gsm coated silk or matte
    • Format: A5 sheet, duplex colour preferred

  Full rules booklet (optional — 1 per set if included)
    • Stock: 130–170 gsm interior, 250 gsm cover if saddle-stitched
    • Format: A4 pages, staple or perfect bind


7. TELESCOPING TWO-PIECE BOX (file: 14-box-art.pdf)
---------------------------------------------------
  Style            Two-piece telescoping lid over base (premium retail style)

  LID (print 1× per game)
    Flat cut size    167 mm × 207 mm (overall cross pattern including flaps)
    Face panel       87 mm × 127 mm (top label area)
    Side depth       40 mm (wrap height)
    Glue flaps       15 mm corner tabs

  BASE (print 1× per game)
    Flat cut size    165 mm × 205 mm
    Face panel       85 mm × 125 mm (bottom / inner tray)
    Side depth       40 mm
    Glue flaps       15 mm corner tabs

  Capacity         Designed for ~${FULL_GAME_SET_SIZE} poker-size cards + folded manual
  Post-print check Centre panel must measure exactly as above at 100% scale
  Print settings   A4 portrait · 100% scale · background graphics ON · 5 mm page margin


8. BOX INSERT MANUAL (file: 11-box-manual-a5.pdf)
-------------------------------------------------
  Flat sheet       A5 — 148 mm × 210 mm
  Layout           4 panels in 2×2 grid (folded booklet)
  Fold sequence    1) Fold in half vertically  2) Fold in half horizontally
  Closed size      ≈ 74 mm × 105 mm (fits inside 85 × 125 mm base)
  Quantity         1 folded guide per game box
  Print            A5 portrait · duplex colour if available · 100% scale
  Content          Quick-start rules, pipeline order, IP table, win condition


9. IP SCORE TRACKERS (file: 13-ip-score-tracker.pdf)
----------------------------------------------------
  Trim size        63 mm × 88 mm each
  Layout           2× A4 portrait sheets, 4 trackers per page (2×2 grid, centred): Players 1–4, then 5–8
  Quantity         8 player trackers (Player 1–8) per game
  Content          IP track 0–100 (wrap above 100), pipeline reference
  Pair with        8 player tokens (cube, chip, or pawn — not supplied in PDF)


10. FULL RULES MANUAL (file: 12-full-rules-a4.pdf) — OPTIONAL
---------------------------------------------------------------
  Format           A4 portrait multi-page reference (210 × 297 mm)
  Quantity         0–1 per box (A5 folded guide is the primary in-box rules)
  Use              Retail reference, reviewer copy, or expanded rulebook


11. CRITICAL PRINT SETTINGS (EVERY PDF)
---------------------------------------
  ✓  Paper size     Match file (A4 or A5 as noted above)
  ✓  Scale          100% — Actual size — NEVER “Fit to page” / “Shrink”
  ✓  Colour         Full colour · Background graphics ON
  ✓  Margins        As embedded in PDF (typically 0–5 mm)
  ✓  Duplex         Card PDFs: print front pages, then back pages; align sheet N
                     front to sheet N back (same grid positions)


12. ASSEMBLY & FINISHING (PER COMPLETE GAME UNIT)
-------------------------------------------------
  [ ] ${FULL_GAME_SET_SIZE} game cards — cut, round corners, pair front/back
  [ ] 1 × folded A5 rules insert
  [ ] 2 × A4 sheets of IP score trackers (8 cards total), trimmed
  [ ] 1 × box base — cut, fold, glue
  [ ] 1 × box lid — cut, fold, glue
  [ ] (Optional) 1 × full A4 rules manual
  [ ] Pack: objective + milestone + engineer decks + manual + trackers in base
  [ ] Close with lid; shrink-wrap or seal if retail requires


13. QUALITY CONTROL CHECKLIST
-----------------------------
  [ ] Random card measures 63.5 × 88.9 mm at trim
  [ ] Box lid panel measures 87 × 127 mm; base panel 85 × 125 mm
  [ ] All ${FULL_GAME_SET_SIZE} card backs match single shield design
  [ ] No card back printed upside-down relative to front (duplex alignment)
  [ ] Text legible at arm’s length on smallest card body copy
  [ ] Dark backgrounds (#050A14 card backs, box art) print solid — no banding
  [ ] Card count: ${RETAIL_ENGINEER_DECK_SIZE} + ${OBJECTIVE_DECK.length} + ${MILESTONE_CARDS.length} = ${FULL_GAME_SET_SIZE}


14. FILE MANIFEST (THIS ZIP)
----------------------------
${fileList}


15. NOTES FOR PRINT VENDOR
--------------------------
  • PDFs exported in sRGB; convert to CMYK per your press profile.
  • Fonts are embedded / outlined via render — no separate font package.
  • Dashed lines on screen proofs are trim guides only — do not print dashed
    guide lines on final cards unless agreed with client.
  • Questions about rules content: refer to 12-full-rules-a4.pdf (Official v1.0).
  • This package generated from AI Quest Print Hub — artwork is final for v1.0.

================================================================================
  END OF PRODUCTION SPECIFICATION
================================================================================
`.trim();
}
