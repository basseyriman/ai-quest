export interface PrintExportJob {
    path: string;
    filename: string;
    label: string;
    group: "deck" | "other";
    /** Playwright PDF page size (default A4). */
    pageFormat?: "A4" | "A5" | "factory-cards" | "factory-box" | "factory-manual";
    /** Wait for this selector before capturing PDF. */
    waitForSelector?: string;
}

/** Every printable asset linked from the print hub — order matches recommended print sequence. */
export const PRINT_EXPORT_JOBS: PrintExportJob[] = [
    { path: "/print-cards/system-objectives", filename: "01-objective-deck.pdf", label: "Objective Deck", group: "deck" },
    { path: "/print-cards/milestones", filename: "02-milestone-deck.pdf", label: "Milestone Deck", group: "deck" },
    { path: "/print-cards/data-collection", filename: "03-data-collection.pdf", label: "Data Collection", group: "deck" },
    { path: "/print-cards/data-preparation", filename: "04-data-preparation.pdf", label: "Data Preparation", group: "deck" },
    { path: "/print-cards/feature-engineering", filename: "05-feature-engineering.pdf", label: "Feature Engineering", group: "deck" },
    { path: "/print-cards/model-selection", filename: "06-model-selection.pdf", label: "Model Selection", group: "deck" },
    { path: "/print-cards/model-training", filename: "07-model-training.pdf", label: "Model Training", group: "deck" },
    { path: "/print-cards/model-evaluation", filename: "08-model-evaluation.pdf", label: "Model Evaluation", group: "deck" },
    { path: "/print-cards/deployment", filename: "09-deployment.pdf", label: "Deployment", group: "deck" },
    { path: "/print-cards/engineer-mode", filename: "10-full-engineer-deck.pdf", label: "Full Engineer Deck", group: "deck" },
    {
        path: "/print-manual?pdf-export=1",
        filename: "11-box-manual-a5.pdf",
        label: "Box Manual (A5)",
        group: "other",
        pageFormat: "A5",
        waitForSelector: ".a5-sheet",
    },
    {
        path: "/print-manual/full?pdf-export=1",
        filename: "12-full-rules-a4.pdf",
        label: "Full Rules (A4)",
        group: "other",
        pageFormat: "A4",
        waitForSelector: ".manual-page",
    },
    {
        path: "/print-scorecard?pdf-export=1",
        filename: "13-ip-score-tracker.pdf",
        label: "IP Score Tracker",
        group: "other",
        pageFormat: "A4",
        waitForSelector: ".tracker-sheet",
    },
    {
        path: "/print-box?pdf-export=1&template=both",
        filename: "14-box-art.pdf",
        label: "Box Art (Lid + Base)",
        group: "other",
        pageFormat: "A4",
        waitForSelector: ".print-box-net",
    },
    {
        path: "/print-cards/factory-sheets?sheet=0",
        filename: "factory-cards-sheet-1.pdf",
        label: "Cards Factory Sheet 1 (65 Cards)",
        group: "other",
        pageFormat: "factory-cards",
        waitForSelector: ".factory-sheet",
    },
    {
        path: "/print-cards/factory-sheets?sheet=1",
        filename: "factory-cards-sheet-2.pdf",
        label: "Cards Factory Sheet 2 (65 Cards)",
        group: "other",
        pageFormat: "factory-cards",
        waitForSelector: ".factory-sheet",
    },
    {
        path: "/print-cards/factory-sheets?sheet=2",
        filename: "factory-cards-sheet-3.pdf",
        label: "Cards Factory Sheet 3 (65 Cards)",
        group: "other",
        pageFormat: "factory-cards",
        waitForSelector: ".factory-sheet",
    },
    {
        path: "/print-cards/factory-sheets?sheet=3",
        filename: "factory-cards-sheet-4.pdf",
        label: "Cards Factory Sheet 4 (58 Cards)",
        group: "other",
        pageFormat: "factory-cards",
        waitForSelector: ".factory-sheet",
    },
    {
        path: "/print-box/factory-sheet",
        filename: "factory-box-art-sheet.pdf",
        label: "Box Factory Sheet (Lid + Base)",
        group: "other",
        pageFormat: "factory-box",
        waitForSelector: ".box-factory-sheet",
    },
    {
        path: "/print-manual/factory-sheet",
        filename: "factory-rulebook-sheet.pdf",
        label: "Rulebook Factory Sheet (A5 Flat)",
        group: "other",
        pageFormat: "factory-manual",
        waitForSelector: ".manual-factory-page",
    },
];
