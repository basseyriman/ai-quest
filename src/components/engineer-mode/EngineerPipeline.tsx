"use client";

import { EngineerPipeline as PipelineType } from "@/types/engineer-mode";
import { EngineerCard } from "./EngineerCard";
import { PIPELINE_STAGES } from "@/lib/engineer-mode/rules";

interface EngineerPipelineProps {
    pipeline: PipelineType;
    isCurrentPlayer: boolean;
}

export const EngineerPipeline = ({ pipeline, isCurrentPlayer }: EngineerPipelineProps) => {
    const stages = [
        { key: "objective" as const, label: "SYSTEM OBJECTIVE", placeholder: "Shared Objective" },
        ...PIPELINE_STAGES.map((s) => ({
            key: s.slotKey,
            label: s.category,
            placeholder: `Play ${s.label}`,
        })),
    ];

    return (
        <div className="w-full relative px-4 sm:px-8 mt-12 mb-8 flex justify-center">
            <div className="absolute -top-6 left-8 text-[10px] font-mono text-white/40 tracking-[0.3em] uppercase">
                {isCurrentPlayer ? "YOUR PIPELINE" : "OPPONENT PIPELINE"}
            </div>

            <div className="flex items-center gap-6 overflow-visible py-4">
                {stages.map((stage, index) => {
                    const rawVal = pipeline[stage.key as keyof PipelineType];
                    const card = Array.isArray(rawVal)
                        ? (rawVal.length > 0 ? rawVal[rawVal.length - 1] : null)
                        : rawVal;

                    const prevVal = index === 0 ? null : pipeline[stages[index - 1].key as keyof PipelineType];
                    const hasPrev = index === 0
                        ? true
                        : (Array.isArray(prevVal) ? prevVal.length > 0 : !!prevVal);

                    const isNextPlayable = !card && hasPrev && isCurrentPlayer;

                    return (
                        <div key={stage.key} className="flex flex-col items-center">
                            <div className="relative group">
                                <EngineerCard
                                    card={card}
                                    placeholder={stage.label}
                                    isPlayable={false}
                                    className={!card ? "border-dashed border-white/20 bg-white/5 opacity-50" : ""}
                                />
                                {isNextPlayable && (
                                    <div className="absolute -inset-1 rounded-2xl bg-white/10 blur-md pointer-events-none animate-pulse" />
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
