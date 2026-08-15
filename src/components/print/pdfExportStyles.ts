/** Shared @media print rules reused across print pages. */
export const PRINT_MEDIA_BASE = `
  body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: white !important; }
  .print-hidden { display: none !important; }
`;

/**
 * Playwright PDF often drops backgrounds unless color-adjust is exact on each layer.
 * Dark cards (white text) become invisible on the forced-white page without this.
 */
export const PRINT_COLOR_PRESERVE = `
  html.pdf-export .print-color-artifact,
  html.pdf-export .print-color-artifact *,
  html.pdf-export .page-break,
  html.pdf-export .page-break *,
  html.pdf-export .tracker-grid > *,
  html.pdf-export .print-box-net,
  html.pdf-export .print-box-net *,
  html.pdf-export .a5-sheet,
  html.pdf-export .a5-sheet *,
  html.pdf-export .manual-page,
  html.pdf-export .manual-page * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  html.pdf-export .ip-score-tracker {
    background: linear-gradient(165deg, #0c0c10 0%, #050508 55%, #0a0a0f 100%) !important;
    border: 1.5px solid rgba(255, 255, 255, 0.9) !important;
  }
  @media print {
    .print-color-artifact,
    .print-color-artifact *,
    .page-break,
    .page-break *,
    .tracker-grid > *,
    .print-box-net,
    .print-box-net * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
  }
`;

/**
 * Injected on print pages — mirrors critical @media print rules under html.pdf-export
 * so Playwright PDF capture works even when Tailwind print: variants are flaky.
 */
export const PDF_EXPORT_STYLE_BLOCK = `
  ${PRINT_COLOR_PRESERVE}
  html.pdf-export .print-hidden { display: none !important; }
  html.pdf-export body {
    background: white !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  html.pdf-export .print-export-root {
    padding: 0 !important;
    margin: 0 !important;
    min-height: auto !important;
    background: white !important;
    display: block !important;
  }
  html.pdf-export .a5-sheet-force-visibility {
    visibility: visible !important;
  }
  .pdf-page-break { break-after: page; page-break-after: always; }
  html.pdf-export .pdf-page-break {
    break-after: page !important;
    page-break-after: always !important;
  }
`;

/** A4 card-deck print pages (6-up sheets + backs). */
export const PRINT_DECK_STYLE_BLOCK = `
  ${PDF_EXPORT_STYLE_BLOCK}
  @page { size: A4; margin: 0; }
  @media print {
    ${PRINT_MEDIA_BASE}
    .print-export-root { padding: 0 !important; margin: 0 !important; min-height: auto !important; }
    .page-break { page-break-after: always; break-after: page; }
  }
  html.pdf-export .page-break {
    page-break-after: always !important;
    break-after: page !important;
    margin-bottom: 0 !important;
    box-shadow: none !important;
  }
`;

const TRACKER_SHEET_RULES = `
  .tracker-sheet {
    width: 210mm;
    height: 297mm;
    max-height: 297mm;
    box-sizing: border-box;
    position: relative;
    margin: 0 auto;
    padding: 0;
    overflow: hidden;
    background: white;
    page-break-after: always;
    break-after: page;
    page-break-inside: avoid;
    break-inside: avoid;
  }
  .tracker-sheet:last-child {
    page-break-after: auto;
    break-after: auto;
  }
  .tracker-sheet + .tracker-sheet {
    page-break-before: always;
    break-before: page;
  }
  .tracker-grid {
    position: absolute;
    top: calc((297mm - 88mm - 4mm - 88mm) / 2);
    left: calc((210mm - 63mm - 6mm - 63mm) / 2);
    transform: none;
    display: grid;
    grid-template-columns: 63mm 63mm;
    grid-template-rows: 88mm 88mm;
    column-gap: 6mm;
    row-gap: 4mm;
    width: calc(63mm + 6mm + 63mm);
    height: calc(88mm + 4mm + 88mm);
    margin: 0;
    padding: 0;
  }
  .tracker-grid > * {
    width: 63mm !important;
    height: 88mm !important;
    max-width: 63mm !important;
    max-height: 88mm !important;
    margin: 0 !important;
    box-sizing: border-box !important;
  }
`;

export const PRINT_TRACKER_STYLE_BLOCK = `
  ${PDF_EXPORT_STYLE_BLOCK}
  @page { size: A4 portrait; margin: 0; }
  html.pdf-export .tracker-sheet {
    width: 210mm !important;
    height: 297mm !important;
    max-height: 297mm !important;
    box-sizing: border-box !important;
    position: relative !important;
    margin: 0 auto !important;
    padding: 0 !important;
    overflow: hidden !important;
    background: white !important;
    page-break-after: always !important;
    break-after: page !important;
    page-break-inside: avoid !important;
    break-inside: avoid !important;
    display: block !important;
    visibility: visible !important;
  }
  html.pdf-export .tracker-sheet:last-child {
    page-break-after: auto !important;
    break-after: auto !important;
  }
  html.pdf-export .tracker-sheet + .tracker-sheet {
    page-break-before: always !important;
    break-before: page !important;
  }
  html.pdf-export .tracker-grid {
    position: absolute !important;
    top: calc((297mm - 88mm - 4mm - 88mm) / 2) !important;
    left: calc((210mm - 63mm - 6mm - 63mm) / 2) !important;
    transform: none !important;
    display: grid !important;
    grid-template-columns: 63mm 63mm !important;
    grid-template-rows: 88mm 88mm !important;
    column-gap: 6mm !important;
    row-gap: 4mm !important;
    width: calc(63mm + 6mm + 63mm) !important;
    height: calc(88mm + 4mm + 88mm) !important;
    margin: 0 !important;
    padding: 0 !important;
  }
  html.pdf-export .tracker-grid > * {
    width: 63mm !important;
    height: 88mm !important;
    max-width: 63mm !important;
    max-height: 88mm !important;
    margin: 0 !important;
    box-sizing: border-box !important;
  }
  @media print {
    ${PRINT_MEDIA_BASE}
    .print-export-root { padding: 0 !important; margin: 0 !important; }
    ${TRACKER_SHEET_RULES}
  }
`;

const PRINT_BOX_SHEET_RULES = `
  .print-box-sheet {
    width: 210mm;
    min-height: 287mm;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    page-break-after: always;
    break-after: page;
  }
  .print-box-sheet:last-child {
    page-break-after: auto;
    break-after: auto;
  }
  .print-box-wrapper { margin: 0; box-shadow: none; }
`;

export const PRINT_BOX_STYLE_BLOCK = `
  ${PDF_EXPORT_STYLE_BLOCK}
  @page { size: A4 portrait; margin: 5mm; }
  html.pdf-export .print-box-sheet {
    width: 210mm !important;
    min-height: 287mm !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    margin: 0 auto !important;
    page-break-after: always !important;
    break-after: page !important;
  }
  html.pdf-export .print-box-sheet:last-child {
    page-break-after: auto !important;
    break-after: auto !important;
  }
  html.pdf-export .print-box-wrapper {
    margin: 0 !important;
    box-shadow: none !important;
  }
  @media print {
    ${PRINT_MEDIA_BASE}
    ${PRINT_BOX_SHEET_RULES}
  }
`;

export const PRINT_MANUAL_FULL_STYLE_BLOCK = `
  ${PDF_EXPORT_STYLE_BLOCK}
  @page { size: A4 portrait; margin: 0; }
  html.pdf-export .manual-pages,
  html.pdf-export .manual-page {
    display: block !important;
    visibility: visible !important;
  }
  html.pdf-export .manual-page {
    page-break-after: always !important;
    break-after: page !important;
    box-shadow: none !important;
    margin: 0 auto !important;
    background: white !important;
    color: inherit !important;
  }
  html.pdf-export .manual-page *:not(img):not(svg) {
    color: inherit !important;
  }
  html.pdf-export .manual-page .manual-accent {
    color: #e11d48 !important;
  }
  html.pdf-export .manual-page .manual-muted {
    color: #5c5c5c !important;
  }
  html.pdf-export .manual-page:last-child {
    page-break-after: auto !important;
    break-after: auto !important;
  }
  @media print {
    ${PRINT_MEDIA_BASE}
    .manual-page { page-break-after: always; box-shadow: none !important; margin: 0 !important; color: #000000; }
    .manual-page:last-child { page-break-after: auto; }
  }
`;

/** A5 folded box insert — plain CSS only (Tailwind classes are unreliable in Playwright PDF). */
export const PRINT_MANUAL_A5_STYLE_BLOCK = `
  ${PDF_EXPORT_STYLE_BLOCK}
  @page { size: 148mm 210mm; margin: 0; }

  html.pdf-export,
  html.pdf-export body {
    width: 148mm !important;
    height: 210mm !important;
    max-height: 210mm !important;
    min-height: 0 !important;
    margin: 0 !important;
    padding: 0 !important;
    overflow: hidden !important;
    background: white !important;
  }

  html.pdf-export .print-manual-screen {
    width: 148mm !important;
    height: 210mm !important;
    max-height: 210mm !important;
    min-height: 0 !important;
    margin: 0 !important;
    padding: 0 !important;
    overflow: hidden !important;
    background: white !important;
  }

  html.pdf-export .print-manual-a5-root {
    width: 148mm !important;
    height: 210mm !important;
    max-height: 210mm !important;
    min-height: 0 !important;
    margin: 0 !important;
    padding: 0 !important;
    overflow: hidden !important;
    background: white !important;
    display: block !important;
  }

  html.pdf-export .print-export-root.print-manual-a5-root {
    min-height: 0 !important;
    height: 210mm !important;
    max-height: 210mm !important;
  }

  html.pdf-export .print-manual-a5-root .print-hidden {
    display: none !important;
    height: 0 !important;
    margin: 0 !important;
    padding: 0 !important;
    overflow: hidden !important;
  }

  .a5-manual-root,
  html.pdf-export .a5-manual-root {
    width: 148mm !important;
    height: 210mm !important;
    max-height: 210mm !important;
    margin: 0 auto !important;
    padding: 0 !important;
    overflow: hidden !important;
    page-break-after: avoid !important;
    break-after: avoid !important;
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }

  .a5-sheet {
    box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.45);
  }

  html.pdf-export .a5-sheet {
    box-shadow: none !important;
  }

  .a5-sheet,
  html.pdf-export .a5-sheet {
    display: grid !important;
    grid-template-columns: 1fr 1fr !important;
    grid-template-rows: 1fr 1fr !important;
    width: 148mm !important;
    height: 210mm !important;
    max-width: 148mm !important;
    max-height: 210mm !important;
    box-sizing: border-box !important;
    background: transparent !important;
    color: inherit !important;
    /* outline — not border — so the 210mm box is not pushed onto a second page */
    border: none !important;
    outline: 1px solid #52525b !important;
    margin: 0 !important;
    padding: 0 !important;
    overflow: hidden !important;
    page-break-after: avoid !important;
    break-after: avoid !important;
    page-break-inside: avoid !important;
    break-inside: avoid !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  .a5-quadrant,
  html.pdf-export .a5-quadrant {
    position: relative !important;
    box-sizing: border-box !important;
    padding: 4mm !important;
    display: flex !important;
    flex-direction: column !important;
    min-width: 0 !important;
    min-height: 0 !important;
    max-height: 100% !important;
    overflow: hidden !important;
    color: inherit !important;
    font-size: 7.5pt !important;
    line-height: 1.3 !important;
    border: none !important;
    outline: 0.5px dashed #d4d4d8 !important;
    outline-offset: -0.5px !important;
  }

  .a5-panel-label,
  html.pdf-export .a5-panel-label {
    position: absolute !important;
    top: 2mm !important;
    right: 2mm !important;
    font-size: 6pt !important;
    color: #d4d4d8 !important;
    font-weight: 700 !important;
    text-transform: uppercase !important;
    line-height: 1 !important;
  }

  .a5-title,
  html.pdf-export .a5-title {
    font-size: 9pt !important;
    font-weight: 900 !important;
    text-transform: uppercase !important;
    color: inherit !important;
    margin: 0 0 1mm 0 !important;
    line-height: 1.2 !important;
  }

  .a5-cover-title,
  html.pdf-export .a5-cover-title {
    font-size: 10pt !important;
    font-weight: 900 !important;
    text-transform: uppercase !important;
    color: inherit !important;
    text-align: center !important;
    margin: 0 !important;
    line-height: 1.15 !important;
  }

  .a5-accent,
  html.pdf-export .a5-accent {
    color: #e11d48 !important;
  }

  .a5-muted,
  html.pdf-export .a5-muted {
    color: #5c5c5c !important;
  }

  .a5-body,
  html.pdf-export .a5-body {
    color: inherit !important;
    font-size: 7pt !important;
    margin: 0 0 0.5mm 0 !important;
  }

  .a5-body-sm,
  html.pdf-export .a5-body-sm {
    color: inherit !important;
    font-size: 6.5pt !important;
    line-height: 1.15 !important;
  }

  .a5-cover-center,
  html.pdf-export .a5-cover-center {
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;
    height: 100% !important;
    text-align: center !important;
    gap: 1mm !important;
    padding: 0 1mm !important;
  }

  .a5-list,
  html.pdf-export .a5-list {
    margin: 0 !important;
    padding-left: 3.5mm !important;
    color: inherit !important;
    font-size: 7pt !important;
  }

  .a5-ip-row,
  html.pdf-export .a5-ip-row {
    display: grid !important;
    grid-template-columns: 1fr 8mm !important;
    gap: 1mm !important;
    font-size: 7pt !important;
    color: inherit !important;
  }

  @media print {
    ${PRINT_MEDIA_BASE}
    @page { size: 148mm 210mm; margin: 0; }
    html, body {
      width: 148mm !important;
      height: 210mm !important;
      margin: 0 !important;
      padding: 0 !important;
      overflow: hidden !important;
    }
    .print-manual-screen {
      background: white !important;
      padding: 0 !important;
      margin: 0 !important;
      min-height: 0 !important;
      height: 210mm !important;
      max-height: 210mm !important;
      overflow: hidden !important;
    }
    .print-manual-a5-root {
      padding: 0 !important;
      margin: 0 !important;
      height: 210mm !important;
      max-height: 210mm !important;
      overflow: hidden !important;
    }
    .a5-manual-root, .a5-sheet {
      page-break-after: avoid !important;
      break-after: avoid !important;
    }
  }
`;

/** HeroTime factory export — 5 mm safe margins, print-safe blacks, no debug guides. */
export const PRINT_MANUAL_A5_FACTORY_STYLE_BLOCK = `
  ${PRINT_MANUAL_A5_STYLE_BLOCK}

  .a5-sheet,
  html.pdf-export .a5-sheet {
    outline: none !important;
    background: transparent !important;
  }

  .a5-quadrant,
  html.pdf-export .a5-quadrant {
    padding: 5mm !important;
    outline: none !important;
  }

  .a5-panel-label,
  html.pdf-export .a5-panel-label {
    display: none !important;
  }

  .a5-title,
  html.pdf-export .a5-title,
  .a5-cover-title,
  html.pdf-export .a5-cover-title,
  .a5-body,
  html.pdf-export .a5-body,
  .a5-body-sm,
  html.pdf-export .a5-body-sm,
  .a5-list,
  html.pdf-export .a5-list,
  .a5-ip-row,
  html.pdf-export .a5-ip-row {
    color: inherit !important;
  }

  .a5-muted,
  html.pdf-export .a5-muted {
    color: #5c5c5c !important;
  }

  .a5-cover-center,
  html.pdf-export .a5-cover-center {
    padding: 5mm !important;
    gap: 1.5mm !important;
  }

  .a5-sheet--back,
  html.pdf-export .a5-sheet--back {
    display: flex !important;
    grid-template-columns: unset !important;
    grid-template-rows: unset !important;
    background: #000000 !important;
    color: #ffffff !important;
    outline: none !important;
  }

  .a5-back-safe,
  html.pdf-export .a5-back-safe {
    box-sizing: border-box !important;
    width: 100% !important;
    height: 100% !important;
    min-height: 210mm !important;
    padding: 5mm !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;
    text-align: center !important;
    background: #000000 !important;
    color: #ffffff !important;
  }

  .a5-back-safe__title {
    margin: 0 !important;
    font-size: 14pt !important;
    font-weight: 900 !important;
    letter-spacing: 0.2em !important;
    text-transform: uppercase !important;
    color: #ffffff !important;
  }

  .a5-back-safe__tagline {
    margin: 2mm 0 0 !important;
    font-size: 7.5pt !important;
    font-weight: 700 !important;
    letter-spacing: 0.32em !important;
    text-transform: uppercase !important;
    color: #2ee8f5 !important;
  }

  .a5-back-safe__legal {
    margin: 3mm 0 0 !important;
    font-size: 6.5pt !important;
    font-weight: 700 !important;
    letter-spacing: 0.12em !important;
    text-transform: uppercase !important;
    color: #8a8a8a !important;
    line-height: 1.55 !important;
  }
`;

/**
 * A5 rulebook panel inside HeroTime factory artwork slot.
 * Omits document-level @page / html / body sizing from PRINT_MANUAL_A5_STYLE_BLOCK.
 */
export const PRINT_MANUAL_A5_FACTORY_SLOT_STYLE_BLOCK = `
  ${PRINT_COLOR_PRESERVE}

  .rulebook-artwork-slot .a5-manual-root,
  html.pdf-export .rulebook-artwork-slot .a5-manual-root {
    width: 100% !important;
    height: 100% !important;
    max-width: none !important;
    max-height: none !important;
    margin: 0 !important;
    padding: 0 !important;
    overflow: hidden !important;
    page-break-after: avoid !important;
    break-after: avoid !important;
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }

  .rulebook-artwork-slot .a5-sheet,
  html.pdf-export .rulebook-artwork-slot .a5-sheet {
    display: grid !important;
    grid-template-columns: 1fr 1fr !important;
    grid-template-rows: 1fr 1fr !important;
    width: 100% !important;
    height: 100% !important;
    max-width: none !important;
    max-height: none !important;
    box-sizing: border-box !important;
    background: #ffffff !important;
    color: #000000 !important;
    border: none !important;
    outline: none !important;
    margin: 0 !important;
    padding: 0 !important;
    overflow: hidden !important;
    page-break-after: avoid !important;
    break-after: avoid !important;
    page-break-inside: avoid !important;
    break-inside: avoid !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  .rulebook-artwork-slot .a5-quadrant,
  html.pdf-export .rulebook-artwork-slot .a5-quadrant {
    position: relative !important;
    box-sizing: border-box !important;
    padding: 5mm !important;
    display: flex !important;
    flex-direction: column !important;
    min-width: 0 !important;
    min-height: 0 !important;
    max-height: 100% !important;
    overflow: hidden !important;
    color: inherit !important;
    font-size: 7.5pt !important;
    line-height: 1.3 !important;
    border: none !important;
    outline: none !important;
  }

  .rulebook-artwork-slot .a5-panel-label,
  html.pdf-export .rulebook-artwork-slot .a5-panel-label {
    display: none !important;
  }

  .rulebook-artwork-slot .a5-title,
  html.pdf-export .rulebook-artwork-slot .a5-title,
  .rulebook-artwork-slot .a5-cover-title,
  html.pdf-export .rulebook-artwork-slot .a5-cover-title,
  .rulebook-artwork-slot .a5-body,
  html.pdf-export .rulebook-artwork-slot .a5-body,
  .rulebook-artwork-slot .a5-body-sm,
  html.pdf-export .rulebook-artwork-slot .a5-body-sm,
  .rulebook-artwork-slot .a5-list,
  html.pdf-export .rulebook-artwork-slot .a5-list,
  .rulebook-artwork-slot .a5-ip-row,
  html.pdf-export .rulebook-artwork-slot .a5-ip-row {
    color: inherit !important;
  }

  .rulebook-artwork-slot .a5-muted,
  html.pdf-export .rulebook-artwork-slot .a5-muted {
    color: #5c5c5c !important;
  }

  .rulebook-artwork-slot .a5-accent,
  html.pdf-export .rulebook-artwork-slot .a5-accent {
    color: #e11d48 !important;
  }

  .rulebook-artwork-slot .a5-title,
  html.pdf-export .rulebook-artwork-slot .a5-title {
    font-size: 9pt !important;
    font-weight: 900 !important;
    text-transform: uppercase !important;
    margin: 0 0 1mm 0 !important;
    line-height: 1.2 !important;
  }

  .rulebook-artwork-slot .a5-cover-title,
  html.pdf-export .rulebook-artwork-slot .a5-cover-title {
    font-size: 10pt !important;
    font-weight: 900 !important;
    text-transform: uppercase !important;
    text-align: center !important;
    margin: 0 !important;
    line-height: 1.15 !important;
  }

  .rulebook-artwork-slot .a5-body,
  html.pdf-export .rulebook-artwork-slot .a5-body {
    font-size: 7pt !important;
    margin: 0 0 0.5mm 0 !important;
  }

  .rulebook-artwork-slot .a5-body-sm,
  html.pdf-export .rulebook-artwork-slot .a5-body-sm {
    font-size: 6.5pt !important;
    line-height: 1.15 !important;
  }

  .rulebook-artwork-slot .a5-cover-center,
  html.pdf-export .rulebook-artwork-slot .a5-cover-center {
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;
    height: 100% !important;
    text-align: center !important;
    gap: 1.5mm !important;
    padding: 5mm !important;
  }

  .rulebook-artwork-slot .a5-list,
  html.pdf-export .rulebook-artwork-slot .a5-list {
    margin: 0 !important;
    padding-left: 3.5mm !important;
    font-size: 7pt !important;
  }

  .rulebook-artwork-slot .a5-ip-row,
  html.pdf-export .rulebook-artwork-slot .a5-ip-row {
    display: grid !important;
    grid-template-columns: 1fr 8mm !important;
    gap: 1mm !important;
    font-size: 7pt !important;
  }

  .rulebook-artwork-slot .a5-sheet--back,
  html.pdf-export .rulebook-artwork-slot .a5-sheet--back {
    display: flex !important;
    grid-template-columns: unset !important;
    grid-template-rows: unset !important;
    background: #000000 !important;
    color: #ffffff !important;
    outline: none !important;
  }

  .rulebook-artwork-slot .a5-back-safe,
  html.pdf-export .rulebook-artwork-slot .a5-back-safe {
    box-sizing: border-box !important;
    width: 100% !important;
    height: 100% !important;
    min-height: 100% !important;
    padding: 5mm !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;
    text-align: center !important;
    background: #000000 !important;
    color: #ffffff !important;
  }

  .rulebook-artwork-slot .a5-back-safe__title,
  html.pdf-export .rulebook-artwork-slot .a5-back-safe__title {
    margin: 0 !important;
    font-size: 14pt !important;
    font-weight: 900 !important;
    letter-spacing: 0.2em !important;
    text-transform: uppercase !important;
    color: #ffffff !important;
  }

  .rulebook-artwork-slot .a5-back-safe__tagline,
  html.pdf-export .rulebook-artwork-slot .a5-back-safe__tagline {
    margin: 2mm 0 0 !important;
    font-size: 7.5pt !important;
    font-weight: 700 !important;
    letter-spacing: 0.32em !important;
    text-transform: uppercase !important;
    color: #2ee8f5 !important;
  }

  .rulebook-artwork-slot .a5-back-safe__legal,
  html.pdf-export .rulebook-artwork-slot .a5-back-safe__legal {
    margin: 3mm 0 0 !important;
    font-size: 6.5pt !important;
    font-weight: 700 !important;
    letter-spacing: 0.12em !important;
    text-transform: uppercase !important;
    color: #8a8a8a !important;
    line-height: 1.55 !important;
  }
`;

export const PRINT_PLAYTEST_POSTER_STYLE_BLOCK = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;500;600;700&display=swap');
  ${PDF_EXPORT_STYLE_BLOCK}
  @page { size: A3 portrait; margin: 0; }

  .playtest-poster-sheet {
    display: flex;
    justify-content: center;
    padding: 12mm 0 24mm;
  }

  .playtest-poster {
    position: relative;
    width: 297mm;
    height: 420mm;
    box-sizing: border-box;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .playtest-poster__upper {
    position: relative;
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
    padding: 10mm 10mm 6mm;
  }

  .playtest-poster__upper-bg {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 70% 50% at 50% 85%, rgba(46, 232, 245, 0.1) 0%, transparent 55%),
      linear-gradient(180deg, #f8fafc 0%, #ffffff 45%, #f1f5f9 100%);
    z-index: 0;
  }

  .playtest-poster__mesh {
    position: absolute;
    inset: 0;
    opacity: 0.045;
    background-image: url("/hex-grid.svg");
    background-size: 36mm 36mm;
    z-index: 0;
    pointer-events: none;
  }

  .playtest-poster__upper > *:not(.playtest-poster__upper-bg):not(.playtest-poster__mesh) {
    position: relative;
    z-index: 1;
  }

  .playtest-poster__masthead {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6mm;
    text-align: left;
  }

  .playtest-poster__masthead-logo {
    width: 28mm;
    height: auto;
    filter: drop-shadow(0 2mm 6mm rgba(6, 182, 212, 0.2));
  }

  .playtest-poster__masthead-kicker {
    margin: 0;
    font-size: 9pt;
    font-weight: 900;
    letter-spacing: 0.34em;
    text-transform: uppercase;
    color: #0f172a;
  }

  .playtest-poster__masthead-edition {
    margin: 1.5mm 0 0;
    font-family: var(--font-rajdhani), system-ui, sans-serif;
    font-size: 8.5pt;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #ef4444;
  }

  .playtest-poster__photo-container {
    position: relative;
    flex: 1;
    width: 100%;
    min-height: 0;
    margin-top: 4mm;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    border-radius: 6mm;
    box-shadow: 0 10mm 30mm rgba(15, 23, 42, 0.15);
    border: 1px solid rgba(0, 0, 0, 0.08);
  }

  .playtest-poster__photo-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }

  .playtest-poster__hero {
    position: relative;
    flex: 1;
    width: 100%;
    min-height: 0;
    margin-top: 4mm;
  }

  .playtest-poster__hero-glow {
    position: absolute;
    left: 50%;
    bottom: 18%;
    width: 80%;
    height: 45%;
    transform: translateX(-50%);
    background: radial-gradient(ellipse, rgba(46, 232, 245, 0.14) 0%, transparent 72%);
    filter: blur(10mm);
    pointer-events: none;
    z-index: 0;
  }

  .playtest-poster__hero-scene {
    position: relative !important;
    width: 100% !important;
    max-width: none !important;
    height: 100% !important;
    margin: 0 !important;
    overflow: visible !important;
  }

  .playtest-poster__hero-fan {
    left: 38% !important;
    bottom: 8% !important;
    width: 200mm !important;
    height: 100% !important;
    transform: translateX(-50%) !important;
  }

  .playtest-poster__hero-card {
    filter:
      drop-shadow(0 8mm 18mm rgba(15, 23, 42, 0.28))
      drop-shadow(0 0 8mm rgba(46, 232, 245, 0.1)) !important;
  }

  .playtest-poster__hero-fan .landing-cards-fan__card--left {
    margin-left: -58mm !important;
    transform: translateX(-50%) rotate(-17deg) !important;
  }

  .playtest-poster__hero-fan .landing-cards-fan__card--center {
    bottom: 28mm !important;
    transform: translateX(-50%) rotate(0deg) !important;
    filter:
      drop-shadow(0 10mm 22mm rgba(15, 23, 42, 0.32))
      drop-shadow(0 0 12mm rgba(251, 191, 36, 0.2)) !important;
  }

  .playtest-poster__hero-fan .landing-cards-fan__card--right {
    margin-left: 58mm !important;
    transform: translateX(-50%) rotate(17deg) !important;
  }

  .playtest-poster__hero-box {
    position: absolute !important;
    right: 2mm !important;
    bottom: 6% !important;
    z-index: 12 !important;
    filter:
      drop-shadow(0 12mm 28mm rgba(15, 23, 42, 0.35))
      drop-shadow(0 0 16mm rgba(46, 232, 245, 0.15)) !important;
    animation: none !important;
  }

  .playtest-poster__strip {
    flex-shrink: 0;
    padding: 8mm 12mm 9mm;
    background: linear-gradient(180deg, #0a0c10 0%, #050608 100%);
    color: #f1f5f9;
    border-top: 1px solid rgba(46, 232, 245, 0.35);
    box-shadow: 0 -4mm 20mm rgba(0, 0, 0, 0.12);
  }

  .playtest-poster__strip-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 5mm;
    text-align: left;
  }

  .playtest-poster__strip-cell {
    display: flex;
    flex-direction: column;
    gap: 1.5mm;
  }

  .playtest-poster__strip-label {
    font-size: 6.5pt;
    font-weight: 900;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: #2ee8f5;
  }

  .playtest-poster__strip-value {
    font-family: var(--font-rajdhani), system-ui, sans-serif;
    font-size: 12.5pt;
    font-weight: 600;
    color: #f8fafc;
    line-height: 1.35;
  }

  .playtest-poster__strip-tagline {
    margin: 5mm 0 0;
    font-family: var(--font-rajdhani), system-ui, sans-serif;
    font-size: 9.5pt;
    font-weight: 500;
    color: #94a3b8;
    line-height: 1.45;
    text-align: center;
  }

  .playtest-poster__strip-foot {
    margin-top: 5mm;
    padding-top: 4mm;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 6mm;
  }

  .playtest-poster__strip-specs {
    margin: 0;
    font-size: 7pt;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #64748b;
    max-width: 120mm;
    line-height: 1.6;
  }

  .playtest-poster__strip-brand {
    display: flex;
    align-items: center;
    gap: 4mm;
    margin-left: auto;
  }

  .playtest-poster__strip-brand-text {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.8mm;
    text-align: right;
  }

  .playtest-poster__strip-game {
    font-size: 10pt;
    font-weight: 900;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #f8fafc;
  }

  .playtest-poster__strip-company {
    font-family: var(--font-rajdhani), system-ui, sans-serif;
    font-size: 8pt;
    font-weight: 500;
    color: #94a3b8;
  }

  .playtest-poster__strip-url {
    font-family: var(--font-rajdhani), system-ui, sans-serif;
    font-size: 7.5pt;
    font-weight: 600;
    letter-spacing: 0.06em;
    color: #2ee8f5;
  }

  /* Playtest Poster Photo Variant Styles */
  .playtest-poster--photo {
    width: 297mm !important;
    height: 297mm !important; /* Perfect Square! */
    background: #020617 !important; /* Dark theme fallback */
    color: #f8fafc !important;
    border: 4px solid #0891b2 !important; /* Cyan border */
    box-shadow: inset 0 0 30px rgba(6, 182, 212, 0.4), 0 10mm 40mm rgba(0, 0, 0, 0.6) !important;
    padding: 10mm 12mm 6mm !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: space-between !important;
    align-items: center !important;
    position: relative !important;
  }

  .playtest-poster__bg-photo-wrap {
    position: absolute !important;
    inset: 0 !important;
    z-index: 1 !important;
    overflow: hidden !important;
  }

  .playtest-poster__bg-photo-img {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover !important;
    object-position: center !important;
    filter: blur(0.5px) !important; /* Extremely soft blur for film look */
  }

  .playtest-poster__bg-photo-overlay {
    position: absolute !important;
    inset: 0 !important;
    background: linear-gradient(to bottom, 
      rgba(2, 6, 23, 0.94) 0%, 
      rgba(2, 6, 23, 0.8) 18%, 
      rgba(2, 6, 23, 0.3) 45%, 
      rgba(2, 6, 23, 0.3) 65%, 
      rgba(2, 6, 23, 0.85) 82%, 
      rgba(2, 6, 23, 0.98) 100%) !important;
    z-index: 2 !important;
  }

  .playtest-poster__border-frame {
    position: absolute !important;
    inset: 6mm !important;
    border: 1px solid rgba(239, 68, 68, 0.25) !important; /* Red border */
    pointer-events: none !important;
    z-index: 5 !important;
  }

  .playtest-poster__border-frame::before {
    content: '' !important;
    position: absolute !important;
    top: -3px !important; left: -3px !important;
    width: 30px !important; height: 30px !important;
    border-top: 3px solid #ef4444 !important;
    border-left: 3px solid #ef4444 !important;
  }

  .playtest-poster__border-frame::after {
    content: '' !important;
    position: absolute !important;
    bottom: -3px !important; right: -3px !important;
    width: 30px !important; height: 30px !important;
    border-bottom: 3px solid #ef4444 !important;
    border-right: 3px solid #ef4444 !important;
  }

  .playtest-poster__border-corners {
    position: absolute !important;
    inset: 6mm !important;
    pointer-events: none !important;
    z-index: 5 !important;
  }

  .playtest-poster__border-corners::before {
    content: '' !important;
    position: absolute !important;
    top: -3px !important; right: -3px !important;
    width: 30px !important; height: 30px !important;
    border-top: 3px solid #ef4444 !important;
    border-right: 3px solid #ef4444 !important;
  }

  .playtest-poster__border-corners::after {
    content: '' !important;
    position: absolute !important;
    bottom: -3px !important; right: -3px !important;
    width: 30px !important; height: 30px !important;
    border-bottom: 3px solid #ef4444 !important;
    border-left: 3px solid #ef4444 !important;
  }

  .playtest-poster__circuit-bg {
    position: absolute !important;
    inset: 0 !important;
    opacity: 0.12 !important;
    background-image: url("/landing_circuit_bg.png") !important;
    background-size: cover !important;
    background-position: center !important;
    pointer-events: none !important;
    z-index: 4 !important; /* Overlay on top of image but below content */
  }

  .playtest-poster__content {
    position: relative !important;
    width: 100% !important;
    height: 100% !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: space-between !important;
    align-items: center !important;
    z-index: 6 !important;
  }

  .playtest-poster__header-photo {
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    gap: 3mm !important;
    margin-top: 1mm !important;
  }

  .playtest-poster__logo-photo {
    height: 34mm !important;
    width: auto !important;
    filter: drop-shadow(0 0 10px rgba(6, 182, 212, 0.5)) !important;
  }

  .playtest-poster__kicker-photo {
    font-family: 'Orbitron', sans-serif !important;
    font-size: 8.5pt !important;
    font-weight: 900 !important;
    letter-spacing: 0.35em !important;
    text-transform: uppercase !important;
    color: #ef4444 !important; /* Glowing Red */
    text-shadow: 0 0 8px rgba(239, 68, 68, 0.4) !important;
    margin: 1mm 0 0 !important;
    line-height: 1 !important;
  }

  .playtest-poster__title-photo {
    font-family: 'Orbitron', sans-serif !important;
    font-size: 20pt !important;
    font-weight: 900 !important;
    letter-spacing: 0.18em !important;
    text-transform: uppercase !important;
    color: #ffffff !important;
    text-shadow: 0 0 15px rgba(255, 255, 255, 0.4) !important;
    margin: 0 !important;
  }

  .playtest-poster__tagline-photo {
    font-family: 'Orbitron', sans-serif !important;
    font-size: 11pt !important;
    font-weight: 900 !important;
    letter-spacing: 0.12em !important;
    text-transform: uppercase !important;
    color: #ffffff !important;
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.3) !important;
    text-align: center !important;
    margin-bottom: 4mm !important;
    max-width: 90% !important;
    line-height: 1.35 !important;
    display: flex !important;
    flex-direction: column !important;
    gap: 1.5mm !important;
  }

  .playtest-poster__tagline-photo > div:last-child {
    color: #2ee8f5 !important; /* Cyber cyan for key call-to-action line! */
    text-shadow: 0 0 8px rgba(46, 232, 245, 0.5) !important;
  }

  .playtest-poster__details-grid {
    display: grid !important;
    grid-template-columns: 1fr 1px 1fr 1px 1fr !important;
    align-items: center !important;
    width: 100% !important;
    border-top: 1px solid rgba(6, 182, 212, 0.3) !important;
    border-bottom: 1px solid rgba(6, 182, 212, 0.3) !important;
    padding: 4mm 0 !important;
    margin-bottom: 4mm !important;
    background: rgba(2, 6, 23, 0.55) !important; /* Extra contrast backing */
    backdrop-filter: blur(3px) !important;
    border-radius: 2mm !important;
  }

  .playtest-poster__details-col {
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    gap: 1.5mm !important;
    text-align: center !important;
    padding: 0 4mm !important;
  }

  .playtest-poster__col-label {
    font-family: 'Orbitron', sans-serif !important;
    font-size: 10pt !important;
    font-weight: 900 !important;
    letter-spacing: 0.15em !important;
    text-transform: uppercase !important;
    color: #2ee8f5 !important; /* Cyber cyan label */
    text-shadow: 0 0 8px rgba(46, 232, 245, 0.4) !important;
  }

  .playtest-poster__col-value {
    font-family: 'Rajdhani', sans-serif !important;
    font-size: 12pt !important;
    font-weight: 700 !important;
    color: #f8fafc !important;
    letter-spacing: 0.05em !important;
  }

  .playtest-poster__details-divider {
    height: 10mm !important;
    width: 1px !important;
    background: linear-gradient(180deg, transparent, #2ee8f5, transparent) !important;
  }

  .playtest-poster__footer-photo {
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    gap: 5mm !important;
    width: 100% !important;
    font-family: 'Rajdhani', sans-serif !important;
    font-size: 7.5pt !important;
    font-weight: 600 !important;
    letter-spacing: 0.15em !important;
    color: #64748b !important; /* Slate-400 */
    text-transform: uppercase !important;
  }

  .playtest-poster__footer-sep {
    color: #0891b2 !important; /* Cyan separator */
    font-weight: 900 !important;
  }

  /* Playtest Poster Landscape Banner Variant Styles */
  .playtest-poster--banner {
    width: 420mm !important;
    height: 210mm !important; /* 2:1 Landscape aspect ratio! */
    background: #020617 !important; /* Dark theme */
    color: #f8fafc !important;
    border: 4px solid #0891b2 !important; /* Cyan border */
    box-shadow: inset 0 0 30px rgba(6, 182, 212, 0.4), 0 10mm 40mm rgba(0, 0, 0, 0.6) !important;
    padding: 8mm 12mm !important;
    display: flex !important;
    flex-direction: row !important; /* Horizontal layout! */
    justify-content: space-between !important;
    align-items: center !important;
    position: relative !important;
    gap: 8mm !important;
    overflow: hidden !important;
  }

  .playtest-poster--banner .playtest-poster__border-frame {
    inset: 4mm !important;
  }

  .playtest-poster--banner .playtest-poster__border-corners {
    inset: 4mm !important;
  }

  .playtest-poster__banner-left {
    display: flex !important;
    flex-direction: column !important;
    justify-content: space-between !important;
    height: 100% !important;
    flex: 1.25 !important;
    z-index: 3 !important;
    text-align: left !important;
    padding: 2mm 0 !important;
  }

  .playtest-poster__banner-right {
    flex: 1 !important;
    height: 100% !important;
    z-index: 3 !important;
    position: relative !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  }

  .playtest-poster__banner-logo-row {
    display: flex !important;
    align-items: center !important;
    gap: 4mm !important;
  }

  .playtest-poster__banner-logo {
    height: 15mm !important;
    width: auto !important;
    filter: drop-shadow(0 0 8px rgba(6, 182, 212, 0.4)) !important;
  }

  .playtest-poster__banner-kicker {
    font-family: 'Orbitron', sans-serif !important;
    font-size: 7.5pt !important;
    font-weight: 900 !important;
    letter-spacing: 0.3em !important;
    text-transform: uppercase !important;
    color: #ef4444 !important; /* Glowing Red */
    text-shadow: 0 0 6px rgba(239, 68, 68, 0.4) !important;
    line-height: 1 !important;
    margin-bottom: 1mm !important;
  }

  .playtest-poster__banner-title {
    font-family: 'Orbitron', sans-serif !important;
    font-size: 16pt !important;
    font-weight: 900 !important;
    letter-spacing: 0.15em !important;
    text-transform: uppercase !important;
    color: #ffffff !important;
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.3) !important;
    margin: 0 !important;
  }

  .playtest-poster__banner-tagline {
    font-family: 'Orbitron', sans-serif !important;
    font-size: 9pt !important;
    font-weight: 700 !important;
    letter-spacing: 0.08em !important;
    text-transform: uppercase !important;
    color: #ffffff !important;
    line-height: 1.45 !important;
    margin: 3mm 0 !important;
    display: flex !important;
    flex-direction: column !important;
    gap: 1mm !important;
  }

  .playtest-poster__banner-tagline > div:last-child {
    color: #2ee8f5 !important;
    text-shadow: 0 0 6px rgba(46, 232, 245, 0.4) !important;
  }

  .playtest-poster__banner-grid {
    display: grid !important;
    grid-template-columns: 1fr !important;
    gap: 2.5mm !important;
    border-top: 1px solid rgba(6, 182, 212, 0.2) !important;
    border-bottom: 1px solid rgba(6, 182, 212, 0.2) !important;
    padding: 3mm 0 !important;
    margin-bottom: 3mm !important;
  }

  .playtest-poster__banner-row {
    display: flex !important;
    align-items: center !important;
    gap: 3mm !important;
  }

  .playtest-poster__banner-label {
    font-family: 'Orbitron', sans-serif !important;
    font-size: 8.5pt !important;
    font-weight: 900 !important;
    letter-spacing: 0.1em !important;
    text-transform: uppercase !important;
    color: #2ee8f5 !important;
    width: 25mm !important;
    flex-shrink: 0 !important;
    text-shadow: 0 0 6px rgba(46, 232, 245, 0.3) !important;
  }

  .playtest-poster__banner-value {
    font-family: 'Rajdhani', sans-serif !important;
    font-size: 10.5pt !important;
    font-weight: 600 !important;
    color: #f8fafc !important;
  }

  .playtest-poster__banner-image-frame {
    width: 100% !important;
    height: 90% !important;
    border-radius: 3mm !important;
    overflow: hidden !important;
    border: 2px solid rgba(239, 68, 68, 0.8) !important;
    box-shadow: 0 0 20px rgba(239, 68, 68, 0.35) !important;
  }

  .playtest-poster__banner-image {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover !important;
    object-position: center !important;
  }

  .playtest-poster__banner-footer {
    display: flex !important;
    gap: 4mm !important;
    font-family: 'Rajdhani', sans-serif !important;
    font-size: 7.5pt !important;
    font-weight: 600 !important;
    color: #64748b !important;
    text-transform: uppercase !important;
  }

  .playtest-poster__banner-footer-sep {
    color: #0891b2 !important;
    font-weight: 900 !important;
  }

  @media print {
    .playtest-poster-sheet {
      padding: 0 !important;
    }
    .playtest-poster {
      margin: 0 auto;
      box-shadow: none !important;
    }
    .playtest-poster,
    .playtest-poster * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
  }

  html.pdf-export .playtest-poster-sheet {
    padding: 0 !important;
  }
  html.pdf-export .playtest-poster {
    margin: 0 auto !important;
  }
`;
