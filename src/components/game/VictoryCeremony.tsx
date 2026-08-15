"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Download, ChevronRight, Sparkles } from "lucide-react";
import { downloadVictoryCertificate } from "@/lib/generateCertificate";

type Phase = "reveal" | "name" | "certificate";

interface VictoryCeremonyProps {
  isHumanWinner: boolean;
  winnerDisplayName: string;
  defaultName: string;
  finalIp: number;
  onClose: () => void;
}

export const VictoryCeremony = ({
  isHumanWinner,
  winnerDisplayName,
  defaultName,
  finalIp,
  onClose,
}: VictoryCeremonyProps) => {
  const [phase, setPhase] = useState<Phase>("reveal");
  const [nameInput, setNameInput] = useState(
    defaultName === "SOLO OPERATOR" ? "" : defaultName
  );
  const [isDownloading, setIsDownloading] = useState(false);

  const certifiedName = (nameInput.trim() || defaultName || "OPERATIVE").toUpperCase();

  useEffect(() => {
    if (phase !== "reveal") return;
    const t = setTimeout(() => setPhase("name"), 2800);
    return () => clearTimeout(t);
  }, [phase]);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await downloadVictoryCertificate(certifiedName, finalIp);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[6000] flex items-center justify-center p-6 pointer-events-auto"
      style={{
        background:
          "radial-gradient(ellipse at center, rgba(6,182,212,0.12) 0%, rgba(2,4,10,0.97) 55%, #000 100%)",
      }}
    >
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        aria-hidden
      >
        {Array.from({ length: 24 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-cyan-400"
            style={{
              left: `${(i * 17) % 100}%`,
              top: `${(i * 23) % 100}%`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [1, 2.5, 1],
              y: [0, -40 - (i % 5) * 20],
            }}
            transition={{
              duration: 2 + (i % 4),
              repeat: Infinity,
              delay: i * 0.12,
            }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {phase === "reveal" && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05, y: -30 }}
            transition={{ type: "spring", stiffness: 120, damping: 14 }}
            className="relative flex flex-col items-center text-center max-w-2xl"
          >
            <motion.div
              animate={{
                rotate: [0, -8, 8, 0],
                scale: [1, 1.12, 1],
              }}
              transition={{ duration: 1.2, repeat: 2 }}
              className="mb-8 relative"
            >
              <div className="absolute inset-0 blur-3xl bg-yellow-400/40 rounded-full scale-150" />
              <Trophy className="w-28 h-28 text-yellow-400 relative drop-shadow-[0_0_40px_rgba(250,204,21,0.9)]" />
              <Sparkles className="absolute -top-2 -right-2 w-10 h-10 text-cyan-300 animate-pulse" />
            </motion.div>

            <p className="text-cyan-400 font-mono text-sm tracking-[0.5em] uppercase mb-4">
              {isHumanWinner ? "Mission Complete" : "System Override"}
            </p>

            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-br from-white via-cyan-200 to-cyan-500 drop-shadow-[0_0_60px_rgba(34,211,238,0.5)] mb-6 leading-tight">
              {isHumanWinner ? "You Win!" : "Defeated"}
            </h1>

            <p className="text-2xl md:text-3xl font-bold text-white tracking-wide">
              {isHumanWinner ? (
                <>
                  <span className="text-yellow-400">{winnerDisplayName}</span>
                  <span className="text-white/80"> secured victory</span>
                </>
              ) : (
                <>
                  <span className="text-red-400">{winnerDisplayName}</span>
                  <span className="text-white/70"> won with the highest IP after Deployment</span>
                </>
              )}
            </p>

            <p className="mt-6 text-cyan-300/80 font-mono text-sm tracking-widest uppercase">
              {finalIp} Intelligence Points · Highest IP wins
            </p>
          </motion.div>
        )}

        {(phase === "name" || phase === "certificate") && isHumanWinner && (
          <motion.div
            key="name-form"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative w-full max-w-lg rounded-2xl border border-cyan-500/40 bg-[#050a14]/95 backdrop-blur-2xl p-8 shadow-[0_0_80px_rgba(6,182,212,0.25)]"
          >
            <div className="flex justify-center mb-6">
              <img
                src="/ai_quest_logo_clean.png"
                alt="AI Quest"
                className="h-16 object-contain drop-shadow-[0_0_20px_rgba(34,211,238,0.6)]"
              />
            </div>

            <h2 className="text-center text-xl font-black tracking-[0.25em] text-cyan-400 uppercase mb-2">
              Victory Certificate
            </h2>
            <p className="text-center text-white/60 text-sm mb-8 font-mono">
              Enter your name for the official mission record
            </p>

            <label className="block text-[10px] font-mono tracking-[0.3em] text-cyan-500/80 uppercase mb-2">
              Operative Name
            </label>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Your name"
              maxLength={40}
              className="w-full px-5 py-4 rounded-xl bg-black/50 border border-cyan-500/30 text-white text-lg font-bold tracking-wide text-center uppercase placeholder:text-white/25 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_25px_rgba(34,211,238,0.3)] mb-8"
              autoFocus
            />

            <div className="rounded-xl border border-yellow-500/30 bg-yellow-950/20 p-5 mb-8 text-center">
              <p className="text-[10px] font-mono text-yellow-500/70 tracking-widest uppercase mb-2">
                Preview
              </p>
              <p className="text-white/70 text-sm leading-relaxed">
                This certifies that{" "}
                <span className="text-cyan-300 font-black">{certifiedName}</span>{" "}
                is the victorious operative for gathering{" "}
                <span className="text-yellow-400 font-bold">
                  {finalIp} Intelligence Points
                </span>{" "}
                and completing the AI QUEST mission.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={handleDownload}
                disabled={isDownloading}
                className="w-full flex items-center justify-center gap-3 py-4 rounded-xl border border-cyan-400/60 bg-cyan-950/50 text-cyan-200 font-bold tracking-[0.2em] uppercase hover:bg-cyan-600/30 hover:text-white hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] transition-all disabled:opacity-50"
              >
                <Download className="w-5 h-5" />
                {isDownloading ? "Generating…" : "Download Certificate"}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-white/10 text-white/50 font-mono text-xs tracking-[0.2em] uppercase hover:text-white hover:border-white/30 transition-all"
              >
                Return to Base <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {(phase === "name" || phase === "certificate") && !isHumanWinner && (
          <motion.div
            key="defeat"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md"
          >
            <p className="text-white/60 font-mono text-sm tracking-widest mb-8 uppercase">
              The pipeline continues without you.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="px-12 py-4 rounded-xl border border-red-500/40 text-red-300 font-bold tracking-[0.25em] uppercase hover:bg-red-950/40 transition-all"
            >
              Abort Mission
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
