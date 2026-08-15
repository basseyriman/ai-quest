"use client";

import { useEffect, useRef } from "react";
import { useEngineerGame } from "@/hooks/useEngineerGame";
import { EngineerPipeline } from "./EngineerPipeline";
import { EngineerHand } from "./EngineerHand";

export const EngineerBoard = () => {
    const { gameState, initGame, drawCard, playCard, endTurn, aiPlayTurn } = useEngineerGame();
    const logsEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        initGame();
    }, [initGame]);

    useEffect(() => {
        if (gameState?.players[gameState.activePlayerId]?.isBot) {
            aiPlayTurn();
        }
    }, [gameState?.activePlayerId, gameState?.phase, aiPlayTurn]);

    useEffect(() => {
        logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [gameState?.logs]);

    if (!gameState) {
        return <div className="text-white flex items-center justify-center h-screen">Initializing System...</div>;
    }

    const currentPlayer = gameState.players[gameState.activePlayerId];
    const isPlayerTurn = !currentPlayer.isBot;
    const isPlayPhase = isPlayerTurn && gameState.phase === "PLAY";
    const isDrawPhase = isPlayerTurn && gameState.phase === "DRAW";

    return (
        <div className="w-full min-h-screen flex flex-col p-4 sm:p-8 font-sans gap-8">
            
            {/* Top HUD */}
            <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-8 py-2">
                
                <div className="flex flex-col">
                    <h1 className="text-2xl font-bold tracking-widest text-white uppercase">ENGINEER MODE</h1>
                    <span className="text-cyan-400 font-mono text-sm">MISSION: {gameState.sharedObjective?.name || "AWAITING MISSION"}</span>
                </div>

                <div className="flex gap-8">
                    {Object.values(gameState.players).map((p, idx) => {
                        const isCurrent = p.id === gameState.activePlayerId;
                        return (
                            <div key={p.id} className={`flex flex-col items-center ${isCurrent ? 'scale-110 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]' : 'opacity-50'} transition-all`}>
                                <span className="text-xs font-mono text-white/50">{p.name}</span>
                                <span className="text-xl font-bold text-cyan-300">{p.ip} IP</span>
                            </div>
                        );
                    })}
                </div>

                <div className="flex flex-col items-end">
                    <span className="text-white/50 text-xs font-mono uppercase">PHASE</span>
                    <span className={`text-lg font-bold tracking-widest ${isPlayerTurn ? 'text-green-400' : 'text-orange-400'}`}>
                        {isPlayerTurn ? gameState.phase : "AI PROCESSING..."}
                    </span>
                    {isPlayPhase && (
                        <span className="text-[10px] text-white/40 font-mono">
                            ACTIONS LEFT: {2 - gameState.turnActionCount}
                        </span>
                    )}
                </div>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row gap-8">
                
                {/* Main Play Area */}
                <div className="flex-1 flex flex-col gap-8">
                    
                    {/* Opponent Pipeline */}
                    <div className="opacity-70 scale-95 origin-top">
                        <EngineerPipeline 
                            pipeline={Object.values(gameState.players).find(p => p.isBot)?.pipeline || gameState.players["p2"]?.pipeline} 
                            isCurrentPlayer={false} 
                        />
                    </div>

                    {/* Divider - subtle space instead of a line */}
                    <div className="w-full h-8" />

                    {/* Player Pipeline */}
                    <div className="">
                        <EngineerPipeline 
                            pipeline={Object.values(gameState.players).find(p => !p.isBot)?.pipeline || gameState.players["p1"]?.pipeline} 
                            isCurrentPlayer={true} 
                        />
                    </div>

                    {/* Player Hand & Controls */}
                    <div className="mt-auto relative w-full pt-12 pb-8">
                        <div className="absolute top-4 right-4 flex gap-4 z-50">
                            {isDrawPhase && (
                                <button 
                                    onClick={drawCard}
                                    className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg border border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.5)] transition-all uppercase tracking-widest text-sm"
                                >
                                    Draw Card
                                </button>
                            )}
                            {isPlayPhase && (
                                <button 
                                    onClick={endTurn}
                                    className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg border border-slate-600 transition-all uppercase tracking-widest text-sm"
                                >
                                    End Turn
                                </button>
                            )}
                        </div>

                        <EngineerHand 
                            hand={Object.values(gameState.players).find(p => !p.isBot)?.hand || []} 
                            onPlayCard={playCard}
                            isPlayPhase={isPlayPhase}
                        />
                    </div>

                </div>

                {/* Sidebar (Logs) */}
                <div className="w-full lg:w-[300px] flex flex-col gap-4 pl-4 border-l border-white/10 opacity-60 hover:opacity-100 transition-opacity">
                    <div className="flex-1 flex flex-col relative overflow-hidden">
                        <h3 className="text-white/50 font-sans text-xs tracking-[0.2em] uppercase mb-4">SYSTEM LOGS</h3>
                        
                        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-2 text-xs font-mono text-white/70">
                            {gameState.logs.map((log, i) => (
                                <div key={i} className="border-l-2 border-cyan-500/30 pl-2">
                                    <span className="text-white/30 mr-2">[{new Date().toLocaleTimeString([], {hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit'})}]</span>
                                    {log}
                                </div>
                            ))}
                            <div ref={logsEndRef} />
                        </div>
                    </div>
                </div>

            </div>

        </div>
    );
};
