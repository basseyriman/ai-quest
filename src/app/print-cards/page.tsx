"use client";

import { useState } from "react";
import Link from "next/link";
import { Orbitron } from "next/font/google";
import {
  Database,
  Wrench,
  Settings,
  Cpu,
  Dumbbell,
  LineChart,
  Rocket,
  Target,
  Trophy,
  Layers,
  BookOpen,
  Box,
  LayoutGrid,
  Megaphone,
  Printer,
  Download,
  Loader2,
} from "lucide-react";
import {
  RETAIL_ENGINEER_DECK,
  RETAIL_ENGINEER_DECK_SIZE,
  PLAYABLE_ENGINEER_CARDS,
  FULL_GAME_SET_SIZE,
} from "@/lib/engineer-mode/cards";
import { MILESTONE_CARDS } from "@/lib/engineer-mode/milestones";

const orbitron = Orbitron({ subsets: ["latin"] });

const countByCategory = (category: string) =>
  RETAIL_ENGINEER_DECK.filter((c) => c.category === category).length;
import { ENGINEER_CATEGORY_IP } from "@/lib/engineer-mode/ipValues";

const DECK_LINKS = [
  {
    href: "/print-cards/system-objectives",
    label: "Objective Deck",
    count: 15,
    ip: ENGINEER_CATEGORY_IP["SYSTEM OBJECTIVE"],
    icon: Target,
    color: "text-yellow-500",
    border: "border-yellow-500/40 hover:border-yellow-400",
  },
  {
    href: "/print-cards/milestones",
    label: "Milestone Deck",
    count: MILESTONE_CARDS.length,
    ip: ENGINEER_CATEGORY_IP.MILESTONE,
    icon: Trophy,
    color: "text-red-500",
    border: "border-red-500/40 hover:border-red-400",
  },
  {
    href: "/print-cards/data-collection",
    label: "Data Collection",
    count: countByCategory("DATA COLLECTION"),
    ip: ENGINEER_CATEGORY_IP["DATA COLLECTION"],
    icon: Database,
    color: "text-slate-400",
    border: "border-slate-500/40 hover:border-slate-300",
  },
  {
    href: "/print-cards/data-preparation",
    label: "Data Preparation",
    count: countByCategory("DATA PREPARATION"),
    ip: ENGINEER_CATEGORY_IP["DATA PREPARATION"],
    icon: Wrench,
    color: "text-sky-400",
    border: "border-sky-500/40 hover:border-sky-300",
  },
  {
    href: "/print-cards/feature-engineering",
    label: "Feature Engineering",
    count: countByCategory("FEATURE ENGINEERING"),
    ip: ENGINEER_CATEGORY_IP["FEATURE ENGINEERING"],
    icon: Settings,
    color: "text-pink-400",
    border: "border-pink-500/40 hover:border-pink-300",
  },
  {
    href: "/print-cards/model-selection",
    label: "Model Selection",
    count: countByCategory("MODEL SELECTION"),
    ip: ENGINEER_CATEGORY_IP["MODEL SELECTION"],
    icon: Cpu,
    color: "text-purple-400",
    border: "border-purple-500/40 hover:border-purple-300",
  },
  {
    href: "/print-cards/model-training",
    label: "Model Training",
    count: countByCategory("MODEL TRAINING"),
    ip: ENGINEER_CATEGORY_IP["MODEL TRAINING"],
    icon: Dumbbell,
    color: "text-rose-400",
    border: "border-rose-500/40 hover:border-rose-300",
  },
  {
    href: "/print-cards/model-evaluation",
    label: "Model Evaluation",
    count: countByCategory("MODEL EVALUATION"),
    ip: ENGINEER_CATEGORY_IP["MODEL EVALUATION"],
    icon: LineChart,
    color: "text-fuchsia-400",
    border: "border-fuchsia-500/40 hover:border-fuchsia-300",
  },
  {
    href: "/print-cards/deployment",
    label: "Deployment",
    count: countByCategory("DEPLOYMENT"),
    ip: ENGINEER_CATEGORY_IP.DEPLOYMENT,
    icon: Rocket,
    color: "text-teal-400",
    border: "border-teal-500/40 hover:border-teal-300",
  },
  {
    href: "/print-cards/engineer-mode",
    label: "Full Engineer Deck",
    count: RETAIL_ENGINEER_DECK_SIZE,
    ip: null,
    icon: Layers,
    color: "text-cyan-400",
    border: "border-cyan-500/40 hover:border-cyan-300",
  },
];

const OTHER_LINKS = [
  {
    href: "/print-manual",
    label: "Box Manual",
    icon: BookOpen,
    note: "A5 folded guide",
  },
  { href: "/print-manual/full", label: "Full Rules (A4)", icon: BookOpen },
  { href: "/print-scorecard", label: "IP Score Tracker", icon: LayoutGrid, note: "Pipeline + IP ref ×8" },
  { href: "/print-box", label: "Box Art", icon: Box },
  {
    href: "/print-playtest-poster",
    label: "Playtest Poster",
    icon: Megaphone,
    note: "A3 playtest poster",
  },
  {
    href: "/print-cards/factory-sheets",
    label: "Cards Factory Sheets",
    icon: Layers,
    note: "HeroTime 65-card layout",
  },
  {
    href: "/print-box/factory-sheet",
    label: "Box Factory Sheet",
    icon: Box,
    note: "Lid + Base side-by-side",
  },
  {
    href: "/print-manual/factory-sheet",
    label: "Rulebook Factory Sheet",
    icon: BookOpen,
    note: "Flat A5 folded layout",
  },
];

export default function PrintCardsHubPage() {
  const [exporting, setExporting] = useState<"all" | "decks" | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);
  const [exportProgress, setExportProgress] = useState<string | null>(null);

  const downloadPrintPack = async (scope: "all" | "decks") => {
    setExporting(scope);
    setExportError(null);
    setExportProgress("Starting export…");

    const zipName =
      scope === "decks" ? "ai-quest-card-decks.zip" : "ai-quest-print-pack.zip";

    const pollJobStatus = async (jobId: string, total: number) => {
      const statusResponse = await fetch(`/api/print/export/status/${jobId}`);
      if (!statusResponse.ok) {
        throw new Error("Lost track of export job.");
      }

      const status = (await statusResponse.json()) as {
        status: string;
        progress?: { current: number; total: number; label: string };
        error?: string;
      };

      if (status.progress) {
        setExportProgress(
          `Generating ${status.progress.current}/${status.progress.total} — ${status.progress.label}`
        );
      } else {
        setExportProgress(`Preparing ${total} PDFs…`);
      }

      if (status.status === "done") {
        setExportProgress("Downloading ZIP…");

        const downloadResponse = await fetch(`/api/print/export/download/${jobId}`);
        if (!downloadResponse.ok) {
          const payload = await downloadResponse.json().catch(() => null);
          throw new Error(payload?.error || "Download failed.");
        }

        const blob = await downloadResponse.blob();
        const objectUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = objectUrl;
        link.download = zipName;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(objectUrl);

        setExportProgress("Download complete.");
        return true;
      }

      if (status.status === "error") {
        throw new Error(status.error || "Export failed on the server.");
      }

      return false;
    };

    try {
      const query = scope === "decks" ? "?scope=decks" : "";
      const startResponse = await fetch(`/api/print/export/start${query}`, {
        method: "POST",
      });

      const payload = await startResponse.json().catch(() => null);

      if (!startResponse.ok) {
        throw new Error(payload?.error || "Could not start export.");
      }

      const { jobId, total } = payload as {
        jobId: string;
        total: number;
      };

      if (await pollJobStatus(jobId, total)) {
        return;
      }

      await new Promise<void>((resolve, reject) => {
        const poll = window.setInterval(async () => {
          try {
            if (await pollJobStatus(jobId, total)) {
              window.clearInterval(poll);
              resolve();
            }
          } catch (pollError) {
            window.clearInterval(poll);
            reject(pollError);
          }
        }, 2000);
      });
    } catch (err) {
      setExportError(err instanceof Error ? err.message : "Export failed.");
      setExportProgress(null);
    } finally {
      setExporting(null);
    }
  };

  const ipRows = [
    ["Data Collection", ENGINEER_CATEGORY_IP["DATA COLLECTION"]],
    ["Data Preparation", ENGINEER_CATEGORY_IP["DATA PREPARATION"]],
    ["Feature Engineering", ENGINEER_CATEGORY_IP["FEATURE ENGINEERING"]],
    ["Model Selection", ENGINEER_CATEGORY_IP["MODEL SELECTION"]],
    ["Model Training", ENGINEER_CATEGORY_IP["MODEL TRAINING"]],
    ["Model Evaluation", ENGINEER_CATEGORY_IP["MODEL EVALUATION"]],
    ["Deployment", ENGINEER_CATEGORY_IP.DEPLOYMENT],
    ["Milestone Reward", ENGINEER_CATEGORY_IP.MILESTONE],
  ] as const;

  return (
    <div
      className="print-hub-root min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white box-border overflow-x-hidden print:min-h-0 print:bg-[#0f172a] print:p-0"
      style={{ padding: "3.5rem 1.75rem 5rem" }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @page { size: A4 portrait; margin: 12mm; }
          @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: #0f172a !important; }
            .print-hidden { display: none !important; }
            .print-hub-root { padding: 0 !important; }
            .print-hub-inner { max-width: none !important; padding: 0 !important; }
            .print-hub-header { margin-bottom: 1.5rem !important; padding-top: 0 !important; }
            .print-hub-section { margin-bottom: 1rem !important; padding: 1rem !important; }
            .print-deck-link { break-inside: avoid; box-shadow: none !important; color: #ffffff !important; }
            .print-deck-link:visited,
            .print-deck-link:hover { color: #ffffff !important; }
            .print-deck-link p,
            .print-deck-link span:not(.print-link-path) { color: #ffffff !important; }
            .print-deck-link:hover { background: #0a1124 !important; }
            .print-link-arrow { display: none !important; }
            .print-ip-label { color: #ffffff !important; }
            .print-hub-section h2 { color: #ffffff !important; }
            .print-link-path {
              display: block !important;
              color: rgba(255,255,255,0.45) !important;
              font-size: 0.62rem !important;
              letter-spacing: 0.02em !important;
              margin-top: 0.2rem !important;
              font-family: ui-monospace, monospace !important;
            }
          }
          .print-link-path { display: none; }

          /* Force readable white text — links default to dark blue when printing */
          .print-hub-root,
          .print-hub-root .print-deck-link,
          .print-hub-root .print-deck-link:visited,
          .print-hub-root .print-deck-link:hover,
          .print-hub-root .print-deck-link p,
          .print-hub-root .print-deck-link span:not(.print-link-path) {
            color: #ffffff !important;
          }
          .print-hub-root .print-deck-link .text-yellow-500,
          .print-hub-root .print-deck-link .text-yellow-400,
          .print-hub-root .text-yellow-400 {
            color: #facc15 !important;
          }
          .print-hub-root .text-cyan-300,
          .print-hub-root .text-cyan-400 {
            color: #67e8f9 !important;
          }
          .print-hub-root .print-ip-label {
            color: #ffffff !important;
          }
        `,
        }}
      />

      <div className="print-hidden max-w-2xl mx-auto mb-10 text-center px-4">
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <button
            type="button"
            onClick={() => downloadPrintPack("all")}
            disabled={exporting !== null}
            className="inline-flex items-center gap-2 rounded-xl bg-yellow-500 hover:bg-yellow-400 disabled:opacity-60 disabled:cursor-wait text-black font-bold uppercase tracking-wider px-6 py-3 text-sm transition-colors"
          >
            {exporting === "all" ? (
              <Loader2 style={{ width: 18, height: 18 }} className="animate-spin" />
            ) : (
              <Download style={{ width: 18, height: 18 }} />
            )}
            {exporting === "all" ? "Building ZIP…" : "Download all PDFs (ZIP)"}
          </button>
          <button
            type="button"
            onClick={() => downloadPrintPack("decks")}
            disabled={exporting !== null}
            className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-60 disabled:cursor-wait text-white font-bold uppercase tracking-wider px-6 py-3 text-sm transition-colors"
          >
            {exporting === "decks" ? (
              <Loader2 style={{ width: 18, height: 18 }} className="animate-spin" />
            ) : (
              <Download style={{ width: 18, height: 18 }} />
            )}
            {exporting === "decks" ? "Building ZIP…" : "Card decks only (ZIP)"}
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-xl border border-white/20 hover:border-cyan-400/50 text-white/80 hover:text-white font-bold uppercase tracking-wider px-6 py-3 text-sm transition-colors"
          >
            <Printer style={{ width: 18, height: 18 }} />
            Save hub as PDF
          </button>
        </div>
        <p className="mt-4 text-white/45 text-xs leading-relaxed max-w-lg mx-auto">
          <strong className="text-white/70">Download all PDFs</strong> builds every deck and print asset
          into one ZIP on the server. This usually takes <strong className="text-white/70">3–8 minutes</strong> —
          progress updates below while it runs.
        </p>
        {exportProgress && (
          <p className="mt-3 text-cyan-300 text-xs font-mono tracking-wide">{exportProgress}</p>
        )}
        {exportError && (
          <p className="mt-3 text-red-400 text-sm leading-relaxed max-w-md mx-auto font-semibold">
            {exportError}
          </p>
        )}
        <p className="mt-4 text-white/35 text-xs leading-relaxed max-w-md mx-auto">
          Manual single-PDF save: choose <strong className="text-white/55">Microsoft Print to PDF</strong>, scale{" "}
          <strong className="text-white/55">100%</strong>, background graphics{" "}
          <strong className="text-white/55">ON</strong>.
        </p>
      </div>

      <div
        className="max-w-4xl mx-auto w-full print-hub-inner"
        style={{ paddingLeft: 8, paddingRight: 8 }}
      >
        <div
          className="print-hub-header text-center mb-12"
          style={{ paddingLeft: 20, paddingRight: 20 }}
        >
          <img
            src="/ai_quest_logo_clean.png"
            alt="AI Quest"
            className="h-20 mx-auto mb-6 drop-shadow-[0_0_20px_rgba(34,211,238,0.5)]"
          />
          <h1
            className={`font-black uppercase text-cyan-300 leading-snug ${orbitron.className}`}
            style={{
              fontSize: "clamp(1.35rem, 4.5vw, 2.25rem)",
              letterSpacing: "0.06em",
              paddingLeft: 12,
              paddingRight: 12,
            }}
          >
            Physical Cards — Print Hub
          </h1>
          <p
            className="text-white/80 mt-5 uppercase max-w-lg mx-auto leading-relaxed"
            style={{
              fontSize: "0.7rem",
              letterSpacing: "0.18em",
              paddingLeft: 16,
              paddingRight: 16,
            }}
          >
            {FULL_GAME_SET_SIZE} cards total · {RETAIL_ENGINEER_DECK_SIZE} engineer + 15 objectives + 15 milestones
            <span className="block mt-2 text-cyan-500/70 normal-case tracking-normal text-xs">
              Every deck print job includes matching card backs — dark shield design, same as the digital game.
            <span className="block mt-2 text-yellow-500/80 normal-case tracking-normal text-xs">
              The ZIP includes <strong className="text-yellow-400/90">README.txt</strong> — full production
              specs (card size, paper, box dimensions, quantities) for your print vendor.
            </span>
            </span>
          </p>
        </div>

        <div
          className="print-hub-section mb-12 rounded-2xl border border-cyan-500/30 bg-cyan-950/20"
          style={{ padding: "1.5rem 1.25rem" }}
        >
          <p
            className="text-cyan-400 font-bold uppercase text-center sm:text-left"
            style={{
              fontSize: "0.65rem",
              letterSpacing: "0.28em",
              marginBottom: "1.25rem",
              paddingLeft: 8,
              paddingRight: 8,
            }}
          >
            Current IP values (live)
          </p>
          <div className="rounded-xl border border-white/15 overflow-hidden bg-black/30">
            <div className="grid grid-cols-1 sm:grid-cols-2">
              {ipRows.map(([label, ip], index) => (
                <div
                  key={label}
                  className={`flex items-center justify-between border-white/10 ${
                    index < ipRows.length - 1 ? "border-b" : ""
                  } ${index % 2 === 0 ? "sm:border-r" : ""} ${
                    index < ipRows.length - 2 ? "sm:border-b" : ""
                  }`}
                  style={{
                    padding: "1rem 1.35rem",
                    gap: "1.25rem",
                    minHeight: 52,
                  }}
                >
                  <span
                    className="print-ip-label text-white text-left"
                    style={{ fontSize: "0.8rem", lineHeight: 1.35, flex: 1, color: "#ffffff" }}
                  >
                    {label}
                  </span>
                  <span
                    className="font-bold text-yellow-400 shrink-0 tabular-nums"
                    style={{ fontSize: "0.9rem", paddingLeft: 8 }}
                  >
                    +{ip}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <section
          className="print-hub-section mb-12 rounded-2xl border border-white/10 bg-[#050a14]/40"
          style={{ padding: "1.5rem 1.25rem" }}
        >
          <h2
            className="font-bold text-white uppercase"
            style={{
              fontSize: "0.65rem",
              letterSpacing: "0.32em",
              marginBottom: "1.25rem",
              paddingLeft: 8,
              paddingRight: 8,
            }}
          >
            Engineer print decks
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {DECK_LINKS.map((deck) => {
              const Icon = deck.icon;
              return (
                <Link
                  key={deck.href}
                  href={deck.href}
                  className={`print-deck-link flex items-center rounded-xl border bg-[#0a1124]/80 transition-all hover:bg-[#0f1a30] hover:shadow-[0_0_24px_rgba(6,182,212,0.12)] ${deck.border}`}
                  style={{
                    padding: "1.1rem 1.35rem",
                    gap: "1rem",
                    minHeight: 72,
                  }}
                >
                  <Icon
                    className={`shrink-0 ${deck.color}`}
                    style={{ width: 32, height: 32 }}
                  />
                  <div className="flex-1 min-w-0" style={{ paddingRight: 4 }}>
                    <p
                      className="font-bold uppercase text-white leading-snug"
                      style={{ fontSize: "0.82rem", letterSpacing: "0.04em" }}
                    >
                      {deck.label}
                    </p>
                    <p
                      className="text-white mt-1 leading-relaxed"
                      style={{ fontSize: "0.72rem" }}
                    >
                      {deck.count} cards
                      {deck.ip !== null && (
                        <span className="text-yellow-400"> · +{deck.ip} IP each</span>
                      )}
                    </p>
                    <span className="print-link-path">{deck.href}</span>
                  </div>
                  <span
                    className="print-link-arrow text-cyan-500 shrink-0"
                    style={{ fontSize: "1.1rem", paddingLeft: 4 }}
                    aria-hidden
                  >
                    →
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        <section
          className="print-hub-section rounded-2xl border border-white/10 bg-[#050a14]/40"
          style={{ padding: "1.5rem 1.25rem", marginBottom: "0.5rem" }}
        >
          <h2
            className="font-bold text-white uppercase"
            style={{
              fontSize: "0.65rem",
              letterSpacing: "0.32em",
              marginBottom: "1.25rem",
              paddingLeft: 8,
              paddingRight: 8,
            }}
          >
            Other print assets
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {OTHER_LINKS.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="print-deck-link flex items-center rounded-xl border border-white/10 bg-[#0a1124]/60 hover:border-white/25 hover:bg-[#0f1a30] transition-all"
                  style={{
                    padding: "1.1rem 1.35rem",
                    gap: "1rem",
                    minHeight: 64,
                  }}
                >
                  <Icon
                    className="text-white shrink-0"
                    style={{ width: 26, height: 26 }}
                  />
                  <span className="flex-1 min-w-0">
                    <span
                      className="font-bold uppercase text-white leading-snug block"
                      style={{
                        fontSize: "0.82rem",
                        letterSpacing: "0.04em",
                      }}
                    >
                      {item.label}
                    </span>
                    {"note" in item && item.note && (
                      <span className="text-white/90 text-xs block mt-0.5">{item.note}</span>
                    )}
                    <span className="print-link-path">{item.href}</span>
                  </span>
                  <span
                    className="print-link-arrow text-white/30 shrink-0"
                    style={{ fontSize: "1rem", paddingLeft: 4 }}
                    aria-hidden
                  >
                    →
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        <p
          className="print-hidden text-center text-white/30 uppercase"
          style={{ marginTop: "3rem", fontSize: "0.65rem", letterSpacing: "0.2em", padding: "0 1.5rem" }}
        >
          Open any deck → click Execute Print Job
        </p>
        <p
          className="hidden print:block text-center text-white/35 uppercase"
          style={{ marginTop: "1.5rem", fontSize: "0.6rem", letterSpacing: "0.18em" }}
        >
          AI Quest · Physical Cards Print Hub · Official Rules v1.0
        </p>
      </div>
    </div>
  );
}
