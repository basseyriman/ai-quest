import { createWriteStream, existsSync, mkdirSync, unlinkSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import { ZipArchive } from "archiver";
import {
    appendPrintPdfsToArchive,
    preflightPrintExportBrowser,
} from "./exportPrintPdfBundle";
import { PRINT_EXPORT_JOBS, PrintExportJob } from "./printExportManifest";

export type ExportJobStatus = "queued" | "running" | "done" | "error";

export interface ExportJob {
    id: string;
    scope: "all" | "decks";
    status: ExportJobStatus;
    progress: { current: number; total: number; label: string } | null;
    error: string | null;
    filePath: string | null;
    createdAt: number;
}

const jobs = new Map<string, ExportJob>();
const EXPORT_DIR = join(tmpdir(), "ai-quest-exports");

function ensureExportDir() {
    if (!existsSync(EXPORT_DIR)) {
        mkdirSync(EXPORT_DIR, { recursive: true });
    }
}

export function getActiveExportJob(): ExportJob | undefined {
    for (const job of jobs.values()) {
        if (job.status === "queued" || job.status === "running") {
            return job;
        }
    }
    return undefined;
}

export function createExportJob(scope: "all" | "decks"): ExportJob {
    ensureExportDir();
    cleanupOldJobs();

    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const job: ExportJob = {
        id,
        scope,
        status: "queued",
        progress: null,
        error: null,
        filePath: null,
        createdAt: Date.now(),
    };
    jobs.set(id, job);
    return job;
}

export function getExportJob(id: string): ExportJob | undefined {
    return jobs.get(id);
}

export function cleanupOldJobs(maxAgeMs = 60 * 60 * 1000) {
    const cutoff = Date.now() - maxAgeMs;
    for (const [id, job] of jobs) {
        if (job.createdAt < cutoff) {
            if (job.filePath && existsSync(job.filePath)) {
                unlinkSync(job.filePath);
            }
            jobs.delete(id);
        }
    }
}

export async function runExportJob(
    job: ExportJob,
    baseUrl: string,
    jobList: PrintExportJob[]
): Promise<void> {
    job.status = "running";
    const filePath = join(EXPORT_DIR, `${job.id}.zip`);
    job.filePath = filePath;

    const output = createWriteStream(filePath);
    const archive = new ZipArchive({ zlib: { level: 6 } });
    archive.pipe(output);

    let browser = null;

    try {
        browser = await preflightPrintExportBrowser();
        await appendPrintPdfsToArchive(
            archive,
            baseUrl,
            jobList,
            (progress) => {
                job.progress = progress;
                console.log(
                    `[print-export] ${job.id} ${progress.current}/${progress.total} — ${progress.label}`
                );
            },
            browser
        );
        await archive.finalize();
        await new Promise<void>((resolve, reject) => {
            output.on("finish", () => resolve());
            output.on("error", reject);
        });
        job.status = "done";
    } catch (err) {
        job.status = "error";
        job.error =
            err instanceof Error && err.message.includes("Executable doesn't exist")
                ? "Playwright browser missing. Run: npm run setup:print"
                : err instanceof Error
                  ? err.message
                  : "Export failed.";
        if (existsSync(filePath)) {
            unlinkSync(filePath);
        }
        job.filePath = null;
    } finally {
        if (browser) {
            await browser.close().catch(() => undefined);
        }
    }
}

export function getJobsForScope(scope: "all" | "decks"): PrintExportJob[] {
    return scope === "decks"
        ? PRINT_EXPORT_JOBS.filter((job) => job.group === "deck")
        : PRINT_EXPORT_JOBS;
}
