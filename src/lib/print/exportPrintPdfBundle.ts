import { ZipArchive } from "archiver";
import { Browser, chromium } from "playwright";
import {
    PRINT_EXPORT_JOBS,
    PrintExportJob,
} from "./printExportManifest";
import { buildPrintProductionReadme } from "./printProductionReadme";

export interface ExportProgress {
    current: number;
    total: number;
    label: string;
}

/** Verify Playwright can launch before starting a ZIP download. */
export async function preflightPrintExportBrowser(): Promise<Browser> {
    return chromium.launch({ headless: true });
}

function withPdfExportParam(path: string): string {
    if (path.includes("pdf-export=1")) return path;
    return `${path}${path.includes("?") ? "&" : "?"}pdf-export=1`;
}

export async function appendPrintPdfsToArchive(
    archive: ZipArchive,
    baseUrl: string,
    jobs: PrintExportJob[] = PRINT_EXPORT_JOBS,
    onProgress?: (progress: ExportProgress) => void,
    browser?: Browser
): Promise<void> {
    archive.append(Buffer.from(buildPrintProductionReadme(), "utf-8"), {
        name: "README.txt",
    });

    const ownsBrowser = !browser;
    const activeBrowser = browser ?? (await chromium.launch({ headless: true }));
    const page = await activeBrowser.newPage();

    try {
        for (let i = 0; i < jobs.length; i++) {
            const job = jobs[i];
            onProgress?.({ current: i + 1, total: jobs.length, label: job.label });

            const exportPath = withPdfExportParam(job.path);
            const url = `${baseUrl.replace(/\/$/, "")}${exportPath}`;
            const pageFormat = job.pageFormat ?? "A4";
            const isLongDoc = Boolean(job.waitForSelector);

            await page.goto(url, { waitUntil: "networkidle", timeout: 180_000 });
            await page.emulateMedia({ media: "print" });
            await page.evaluate(() => document.documentElement.classList.add("pdf-export"));
            await page.evaluate(() => document.fonts.ready);
            await page.waitForFunction(
                () => document.styleSheets.length > 0 && document.querySelector(".print-export-ready, .page-break"),
                { timeout: 60_000 }
            );

            const selector = job.waitForSelector ?? ".page-break, .print-export-ready";
            await page.waitForSelector(selector, { timeout: 60_000 });
            await page.waitForTimeout(isLongDoc ? 2_000 : 1_000);

            let pdfOptions: any = {
                printBackground: true,
                preferCSSPageSize: false,
                margin: { top: "0", right: "0", bottom: "0", left: "0" },
            };

            if (pageFormat === "A5") {
                pdfOptions.width = "148mm";
                pdfOptions.height = "210mm";
                pdfOptions.pageRanges = "1";
            } else if (pageFormat === "factory-cards") {
                pdfOptions.width = "1624.9mm";
                pdfOptions.height = "801.1mm";
                pdfOptions.pageRanges = "1";
            } else if (pageFormat === "factory-box") {
                pdfOptions.width = "540mm";
                pdfOptions.height = "380mm";
                pdfOptions.pageRanges = "1";
            } else if (pageFormat === "factory-manual") {
                pdfOptions.width = "244mm";
                pdfOptions.height = "326.8mm";
                pdfOptions.pageRanges = "1";
            } else {
                pdfOptions.format = pageFormat || "A4";
            }

            const pdf = await page.pdf(pdfOptions);

            archive.append(Buffer.from(pdf), { name: job.filename });
        }
    } finally {
        await page.close();
        if (ownsBrowser) {
            await activeBrowser.close();
        }
    }
}
