"use client";

import { useState, useEffect, useRef } from 'react';
import { EngineerCard, EngineerGameState, EngineerPipeline } from '@/types';
import {
    PIPELINE_STAGES,
    PIPELINE_SLOT_KEYS,
    isValidPipelinePlay,
    getPipelineHeadStageIndex,
    PIPELINE_CATEGORIES,
    isDeploymentComplete,
} from '@/lib/engineer-mode/rules';
import { RETAIL_ENGINEER_DECK_SIZE, FULL_GAME_SET_SIZE } from '@/lib/engineer-mode/cards';
import { OBJECTIVE_DECK_SIZE, MILESTONE_DECK_SIZE } from '@/lib/engineer-mode/deckCopies';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, FastForward, Disc, Activity, ShieldAlert, Cpu, Trophy, Lock, Unlock, ChevronDown, ChevronUp, GripVertical, Move } from 'lucide-react';
import { Card } from './Card';
import { CARD_BACK_LOGO_SRC } from '@/components/print/PrintCardBack';
import { VictoryCeremony } from './VictoryCeremony';
import { Socket } from "socket.io-client";

interface GameBoardProps {
    socket: Socket | null;
    roomId: string;
    playerName: string;
}

export const GameBoard = ({ socket, roomId, playerName }: GameBoardProps) => {
    const [gameState, setGameState] = useState<EngineerGameState | null>(null);
    const [inspectingCard, setInspectingCard] = useState<EngineerCard | null>(null);
    const [timeLeft, setTimeLeft] = useState(60);
    const [isDealing, setIsDealing] = useState(true);
    const [isPlayerHandVisible, setIsPlayerHandVisible] = useState(true);
    const [isOpponentHandVisible, setIsOpponentHandVisible] = useState(true);
    const [dealPhase, setDealPhase] = useState<'shuffling' | 'dealing' | 'done'>('shuffling');
    const [isDeckShuffling, setIsDeckShuffling] = useState(false);
    const [isObjectiveShuffling, setIsObjectiveShuffling] = useState(false);
    const [aiChallengeMessage, setAiChallengeMessage] = useState<string | null>(null);
    const [purgesRemaining, setPurgesRemaining] = useState(3);
    const [isGuideOpen, setIsGuideOpen] = useState(false);
    const [victoryDismissed, setVictoryDismissed] = useState(false);

    const processedLogsCountRef = useRef<number>(0);
    const victorySoundPlayedRef = useRef(false);

    useEffect(() => {
        if (!socket) return;
        const onGameStateUpdated = (state: EngineerGameState) => {
            setGameState(prev => {
                if ((!prev || prev.activePlayerId !== state.activePlayerId) && state.activePlayerId === socket.id) {
                    setPurgesRemaining(3);
                }
                return state;
            });
            setTimeLeft(60);
            
            // Robust log differencing that survives component re-mounts and resets
            const logsLength = state.logs ? state.logs.length : 0;
            const isFirstLoad = processedLogsCountRef.current === 0;
            if (isFirstLoad) {
                processedLogsCountRef.current = logsLength;
            }
            if (logsLength < processedLogsCountRef.current) {
                processedLogsCountRef.current = 0;
            }
            const prevCount = processedLogsCountRef.current;
            const newLogs = isFirstLoad ? [] : (state.logs ? state.logs.slice(prevCount) : []);
            processedLogsCountRef.current = logsLength;
            
            // Trigger solitaire card sounds for AI / Opponent actions
            newLogs.forEach((log, idx) => {
                const isAiPlay = log.includes("VANGUARD AI integrated") || log.includes("VANGUARD AI played");
                const isAiDraw = log.includes("VANGUARD AI drew") || 
                                 log.includes("auto-replenished VANGUARD AI") || 
                                 log.includes("replenished VANGUARD AI") || 
                                 (log.includes("drew a card") && (log.includes("VANGUARD AI") || log.includes("bot")));

                if (isAiPlay) {
                    setTimeout(() => {
                        playCardSound('place');
                    }, idx * 180); // Stagger sounds for realistic physical pacing
                } else if (isAiDraw) {
                    setTimeout(() => {
                        playCardSound('flip');
                    }, idx * 180);
                }
            });
            
            // Check latest log for challenge resolution sounds
            if (state.logs && state.logs.length > 0) {
                const latestLog = state.logs[state.logs.length - 1];
                if (latestLog.includes("CHALLENGE SUCCESSFUL")) {
                    playSound(100, "sawtooth", 0.5); // Deep error buzz
                } else if (latestLog.includes("FAILED CHALLENGE")) {
                    playSound(800, "square", 0.3); // High pitched penalty
                } else if (latestLog.includes("successfully integrated")) {
                    playSound(500, "sine", 0.2); // Success chime
                }
            }
        };
        
        const onAiChallenge = (data: { message: string }) => {
            playSound(150, "sawtooth", 0.3); // Angry buzz
            setAiChallengeMessage(data.message);
            setTimeout(() => setAiChallengeMessage(null), 4000);
        };

        socket.on("gameState-updated", onGameStateUpdated);
        socket.on("ai-challenge", onAiChallenge);

        socket.emit("request-state", roomId);

        return () => { 
            socket.off("gameState-updated", onGameStateUpdated); 
            socket.off("ai-challenge", onAiChallenge);
        };
    }, [socket, roomId]);

    useEffect(() => {
        if (!gameState?.winner || victorySoundPlayedRef.current) return;
        victorySoundPlayedRef.current = true;
        try {
            const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
            const notes = [523.25, 659.25, 783.99, 1046.5];
            notes.forEach((freq, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = "sine";
                osc.frequency.value = freq;
                gain.gain.setValueAtTime(0.0001, ctx.currentTime + i * 0.12);
                gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + i * 0.12 + 0.05);
                gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.12 + 0.45);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(ctx.currentTime + i * 0.12);
                osc.stop(ctx.currentTime + i * 0.12 + 0.5);
            });
        } catch { /* audio optional */ }
    }, [gameState?.winner]);

    useEffect(() => {
        if (!gameState) return;
        const timer = setInterval(() => {
            setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, [gameState?.activePlayerId]);

    // Handle Shuffling & Dealing Animation Sequence
    useEffect(() => {
        if (gameState && isDealing) {
            // Sequence: Shuffle for 2s, then Deal for 1s (Sounds removed as per request)
            const dealTimeout = setTimeout(() => {
                setDealPhase('dealing');
                
                setTimeout(() => {
                    setDealPhase('done');
                    setIsDealing(false);
                }, 1200);
            }, 2000);

            return () => clearTimeout(dealTimeout);
        }
    }, [gameState, isDealing]);

    if (!gameState || !socket?.id) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-black text-white font-sans">
                <Disc className="w-12 h-12 text-cyan-500 animate-[spin_3s_linear_infinite] mb-4" />
                <p className="tracking-[0.3em] font-light text-sm text-cyan-500/80 uppercase animate-pulse">Establishing Connection to Sector {roomId}...</p>
            </div>
        );
    }

    const deckCount = gameState ? gameState.deck.length : RETAIL_ENGINEER_DECK_SIZE;
    const objectiveDeckCount = gameState?.objectiveDeck?.length ?? OBJECTIVE_DECK_SIZE;
    const milestoneDeckCount = gameState?.milestoneDeck?.length ?? MILESTONE_DECK_SIZE;
    const activeObjective = gameState?.sharedObjective ?? null;
    const pairedMilestone = gameState?.pairedMilestone ?? null;
    const milestoneUnlocked = gameState?.milestoneUnlocked ?? false;
    const isObjectiveLocked = gameState ? (gameState.phase !== 'SETUP' && Object.values(gameState.players).some(p => p.hand.length > 0)) : false;
    const me = gameState.players[socket.id];
    const opponentId = Object.keys(gameState.players).find(id => id !== socket.id);
    const opponent = opponentId ? gameState.players[opponentId] : null;

    const pool = gameState.communityPool || [];
    const hand = me ? me.hand : [];
    const ip = me ? me.ip : 0;
    const sharedPipeline = gameState.sharedPipeline;
    const isActivePlayer = gameState.activePlayerId === socket.id;
    const isHumanWinner = gameState.winner === socket.id;
    const isGameOver = !!gameState.winner;
    const winnerPlayer = gameState.winner ? gameState.players[gameState.winner] : null;
    const showVictoryCeremony = isGameOver && !victoryDismissed;

    const getNextRequiredCategory = () => {
        if (!sharedPipeline) return PIPELINE_CATEGORIES[0];
        const head = getPipelineHeadStageIndex(sharedPipeline);
        if (head === -1) return PIPELINE_CATEGORIES[0];
        if (isDeploymentComplete(sharedPipeline)) return null;
        return PIPELINE_CATEGORIES[Math.min(head + 1, PIPELINE_CATEGORIES.length - 1)];
    };
    const nextCategory = getNextRequiredCategory();

    const isValidToPlay = (card: EngineerCard) => {
        if (!isActivePlayer || gameState.phase !== 'PLAY') return false;
        if (['EVENTS', 'CHALLENGE', 'CHALLENGES'].includes(card.category)) return true;
        if (!sharedPipeline) return card.category === PIPELINE_CATEGORIES[0];
        return isValidPipelinePlay(card, sharedPipeline);
    };

    // Helper to play sound using native audio
    const playSound = (freq: number, type: OscillatorType, dur: number) => {
        try {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gainNode = ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(freq * 0.5, ctx.currentTime + dur);
            gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
            osc.connect(gainNode);
            gainNode.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + dur);
        } catch (e) {}
    };

    const playSyntheticFallback = (soundType: 'flip' | 'place') => {
        try {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            const ctx = new AudioContext();
            const dur = 0.12;
            const osc = ctx.createOscillator();
            const gainNode = ctx.createGain();
            
            if (soundType === 'place') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(400, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + dur);
                gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
            } else {
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(600, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + dur);
                gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
            }
            
            gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
            osc.connect(gainNode);
            gainNode.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + dur);
        } catch (e) {}
    };

    const playCardSound = (soundType: 'flip' | 'place' = 'flip') => {
        try {
            const audioPath = soundType === 'place' ? '/card_place.mp3' : '/card_flip.mp3';
            const audio = new Audio(audioPath);
            audio.volume = 0.6;
            audio.play().catch((e) => {
                console.warn("HTML5 Audio play blocked or failed, using synthetic fallback:", e);
                playSyntheticFallback(soundType);
            });
        } catch (e) {
            console.error("HTML5 Audio error, using synthetic fallback:", e);
            playSyntheticFallback(soundType);
        }
    };

    const playShuffleSound = () => {
        try {
            const audio = new Audio('/card_shuffle.mp3');
            audio.volume = 0.6;
            audio.play().catch(() => {});
        } catch (e) {}
    };

    const drawCard = (source: 'deck' | number) => {
        if (isGameOver) return;
        if (!isActivePlayer || (gameState.phase !== 'DRAW' && gameState.phase !== 'SETUP')) {
            // playSound(150, "sawtooth", 0.1); // Error sound
            return;
        }
        playCardSound('flip');
        socket.emit("draw-card", { roomId, source });
    };

    const playCardAction = (cardId: string, slotKey?: string) => {
        if (isGameOver) return;
        if (!isActivePlayer) {
            playSound(150, "sawtooth", 0.1);
            return;
        }
        playCardSound('place');
        socket.emit("play-card", { roomId, cardId, slotKey });
    };

    const endTurn = () => {
        if (isGameOver || !isActivePlayer || isDealing) return;
        playSound(200, "sine", 0.2);
        socket.emit("end-turn", roomId);
    };

    return (
        <div className="fixed inset-0 overflow-hidden bg-transparent text-white font-sans selection:bg-cyan-500/30">
            
            {/* --- LEFT VERTICAL HUD SIDEBAR (SOLITAIRE STYLE) --- */}
            {/* --- DRAGGABLE FLOATING HUD CONSOLE (CYBERPUNK OS STYLE) --- */}
            <motion.div 
                drag 
                dragMomentum={false}
                className="fixed left-6 top-[calc(50%-270px)] w-[170px] h-[540px] bg-[#02040a]/95 border border-cyan-500/25 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] z-50 flex flex-col items-center justify-between pb-4 pointer-events-auto cursor-grab active:cursor-grabbing hover:border-cyan-500/40 transition-colors select-none overflow-hidden"
            >
                {/* SYSTEM DRAG HANDLE HEADER */}
                <div className="w-full flex items-center justify-center gap-1.5 py-2.5 text-cyan-400/40 select-none border-b border-cyan-500/10 bg-[#050A14] rounded-t-2xl shrink-0">
                    <Move size={11} className="animate-pulse text-cyan-400" />
                    <span className="text-[7.5px] font-mono tracking-[0.3em] uppercase">HUD CONSOLE</span>
                </div>

                {/* TOP HEADER CONTAINER (GROUPS HOW TO PLAY & TIMER TO RESTORE HUD POSITIONING) */}
                <div className="flex flex-col items-center w-full shrink-0 pt-3 animate-fadeIn">
                    {/* HOW TO PLAY BUTTON AT THE VERY TOP */}
                    <button 
                        onClick={() => setIsGuideOpen(true)}
                        className="text-[11px] font-black tracking-[0.18em] uppercase text-black bg-[#e2e8f0] border border-black/30 rounded-none py-3 hover:bg-cyan-400 hover:text-black hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.6)] transition-all duration-300 cursor-pointer select-none text-center leading-normal shrink-0 w-[85%] flex flex-col items-center justify-center font-sans"
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        <span>HOW TO</span>
                        <span>PLAY</span>
                    </button>

                    {/* SPACER BETWEEN HOW TO PLAY AND TIMER */}
                    <div style={{ height: '16px', minHeight: '16px', width: '100%', flexShrink: 0 }} />

                    {/* TOP: TURN & TIME */}
                    <div className="flex flex-col items-center gap-4 w-full shrink-0">
                        <div className="flex flex-col items-center gap-1.5">
                            <span className="text-[11px] font-bold tracking-[0.3em] text-white/40 uppercase">TIME</span>
                            <span className={`text-4xl font-display tracking-widest drop-shadow-lg ${timeLeft < 15 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
                                {Math.floor(timeLeft / 60).toString().padStart(2, '0')}:{ (timeLeft % 60).toString().padStart(2, '0') }
                            </span>
                        </div>

                        <div className="flex flex-col items-center gap-2 mt-1">
                            <div className={`w-3 h-3 rounded-full shadow-[0_0_10px_currentColor] ${isActivePlayer ? "bg-cyan-400 text-cyan-400 shadow-[0_0_12_rgba(34,211,238,0.8)]" : "bg-white/20 text-white/20"}`} />
                            <span className="text-[10px] font-bold tracking-[0.2em] text-white/60 uppercase text-center leading-relaxed">
                                {isActivePlayer ? "YOUR TURN" : "WAITING"}<br/>
                                <span className="text-cyan-400 font-extrabold">{gameState.phase}</span>
                            </span>
                        </div>

                        {/* UN-COLLAPSABLE SPACER */}
                        <div style={{ height: '12px', minHeight: '12px', width: '100%', flexShrink: 0 }} />

                        {/* END CYCLE BUTTON - PERFECTLY SHARP RETRO RECTANGLE */}
                        <button 
                            onClick={endTurn} 
                            disabled={!isActivePlayer} 
                            className={`text-[11px] font-black tracking-[0.25em] uppercase w-[85%] py-3.5 rounded-none border-2 transition-all duration-300 flex flex-col items-center justify-center gap-1 select-none ${
                                isActivePlayer 
                                ? 'bg-transparent border-white text-white shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:bg-white hover:text-black hover:shadow-[0_0_25px_rgba(255,255,255,0.65)] hover:scale-[1.03] active:scale-95 cursor-pointer' 
                                : 'bg-[#08080c] border-[#2c2c30] text-[#71717a] cursor-not-allowed'
                            }`}
                        >
                            <span>END</span>
                            <span>CYCLE</span>
                        </button>
                    </div>
                </div>

                {/* MIDDLE: IP SCORECARD HUD PANEL */}
                <div className="w-[85%] bg-gradient-to-b from-[#0a1124]/40 to-[#030712]/80 border border-cyan-500/15 rounded-none p-3 shadow-[0_0_15px_rgba(6,182,212,0.05)] flex flex-col items-center shrink-0 my-2.5">
                    <div className="flex flex-col items-center w-full">
                        <span className="text-[10px] tracking-[0.25em] text-cyan-400/80 font-bold uppercase mb-1">OPERATIVE</span>
                        <span className="text-4xl font-display text-white font-black leading-none drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">{ip} <span className="text-sm text-cyan-500 font-bold">IP</span></span>
                    </div>
                    
                    {opponent && (
                        <div className="w-full flex flex-col items-center mt-2.5 pt-2.5 border-t border-cyan-500/15">
                            <span className="text-[9px] tracking-[0.2em] text-red-400/60 font-bold uppercase mb-1 truncate max-w-full">{opponent.name}</span>
                            <span className="text-3xl font-display text-slate-300 font-bold leading-none">{opponent.ip} <span className="text-xs text-red-500/70 font-bold">IP</span></span>
                        </div>
                    )}
                </div>

                {/* BOTTOM: WIN TROPHY */}
                <div className="flex flex-col items-center shrink-0 mt-1">
                    <motion.div
                        animate={isHumanWinner ? { scale: [1, 1.08, 1], rotate: [0, -4, 4, 0] } : {}}
                        transition={{ duration: 2, repeat: isHumanWinner ? Infinity : 0, repeatDelay: 1.5 }}
                        className={`relative mb-2 w-[70px] h-[70px] flex items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-500/20 via-yellow-900/20 to-[#02040a] border transition-all duration-500 ${
                            isHumanWinner
                                ? 'border-yellow-400 shadow-[0_0_40px_rgba(234,179,8,0.65)]'
                                : 'border-yellow-500/40 shadow-[0_0_30px_rgba(234,179,8,0.3)]'
                        }`}
                    >
                        <img
                            src="/trophy.png"
                            alt="Victory trophy"
                            className={`w-[100%] h-[100%] object-cover rounded-2xl mix-blend-screen drop-shadow-[0_0_15px_rgba(234,179,8,0.5)] transition-opacity duration-500 ${
                                isHumanWinner ? 'opacity-100' : 'opacity-90'
                            }`}
                        />
                        <div className="absolute -bottom-2 -right-2 bg-[#02040a] rounded-full p-1.5 border border-white/20 shadow-[0_0_10px_rgba(0,0,0,0.8)] z-10">
                            {isHumanWinner ? (
                                <Unlock className="w-4 h-4 text-yellow-300 drop-shadow-[0_0_8px_rgba(250,204,21,0.9)]" />
                            ) : (
                                <Lock className="w-4 h-4 text-yellow-500" />
                            )}
                        </div>
                    </motion.div>
                    <span className={`text-[11px] font-bold tracking-[0.2em] uppercase text-center leading-relaxed transition-colors ${
                        isHumanWinner ? 'text-yellow-300' : 'text-yellow-500/60'
                    }`}>
                        {isHumanWinner ? (
                            <>Trophy<br/>Unlocked</>
                        ) : (
                            <>Deploy<br/>to Win</>
                        )}
                    </span>
                </div>
            </motion.div>

            {/* --- CARD INSPECTOR MODAL --- */}
            <div className="fixed top-0 left-0 w-full h-1 bg-white/5 z-[100]">
                <motion.div
                    className={`h-full ${timeLeft < 15 ? 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,1)]' : 'bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,1)]'}`}
                    animate={{ width: `${(timeLeft / 60) * 100}%` }}
                    transition={{ ease: "linear", duration: 1 }}
                />
            </div>

            {/* --- GLOBAL PENDING PLAY CHALLENGE BAR (TOP CENTER) --- */}
            <AnimatePresence>
                {gameState?.pendingPlay && gameState.pendingPlay.playerId !== socket?.id && (
                    <motion.div
                        initial={{ opacity: 0, y: -50, x: "-50%" }}
                        animate={{ opacity: 1, y: 0, x: "-50%" }}
                        exit={{ opacity: 0, y: -50, x: "-50%" }}
                        className="fixed top-8 left-1/2 -translate-x-1/2 w-[460px] bg-gradient-to-r from-red-950/95 via-[#0b0505]/95 to-red-950/95 border-2 border-red-500/60 rounded-2xl p-5 shadow-[0_0_60px_rgba(239,68,68,0.5)] z-[5000] flex flex-col items-center gap-3 backdrop-blur-2xl pointer-events-auto"
                    >
                        <div className="flex items-center gap-2 text-red-500 font-extrabold tracking-widest text-[10px] uppercase animate-pulse">
                            <ShieldAlert size={15} />
                            <span>System Alert: Threat Detected</span>
                        </div>
                        
                        <div className="text-center text-[12px] font-mono leading-relaxed">
                            <span className="text-white/60">VANGUARD AI played </span>
                            <span className="text-red-400 font-black drop-shadow-[0_0_10px_rgba(239,68,68,0.3)]">{gameState.pendingPlay.card.name}</span>
                            <span className="text-white/60"> into </span>
                            <span className="text-cyan-400 font-bold uppercase tracking-wider">{gameState.pendingPlay.card.category}</span>
                        </div>

                        <div className="w-full flex items-center justify-center gap-3 mt-1">
                            <button
                                onClick={() => {
                                    // Play physical feedback chimes
                                    try {
                                        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
                                        const osc = ctx.createOscillator();
                                        const gain = ctx.createGain();
                                        osc.connect(gain);
                                        gain.connect(ctx.destination);
                                        osc.type = "sawtooth";
                                        osc.frequency.setValueAtTime(120, ctx.currentTime);
                                        gain.gain.setValueAtTime(0.2, ctx.currentTime);
                                        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
                                        osc.start();
                                        osc.stop(ctx.currentTime + 0.3);
                                    } catch (e) {}
                                    socket?.emit('challenge-play', roomId);
                                }}
                                className="px-8 py-3 bg-red-600 hover:bg-red-500 hover:scale-105 active:scale-95 text-white font-black tracking-widest rounded-xl border border-red-400 hover:shadow-[0_0_30px_rgba(239,68,68,0.9)] transition-all flex items-center gap-2 cursor-pointer shadow-[0_6px_20px_rgba(0,0,0,0.6)] uppercase text-[10px]"
                            >
                                <ShieldAlert size={15} className="animate-bounce" />
                                <span>🚨 Raise Hand / Challenge!</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- EVENT LOGS (BOTTOM LEFT) --- */}
            <div className="fixed left-8 bottom-8 w-[320px] max-h-[30vh] overflow-y-auto pointer-events-auto z-40 bg-[#02040a]/60 backdrop-blur-3xl border border-cyan-500/20 rounded-3xl p-6 flex flex-col-reverse gap-4 custom-scrollbar hidden lg:flex shadow-[0_0_40px_rgba(0,0,0,0.5)]">
                <div className="sticky top-0 bg-[#02040a]/90 backdrop-blur-xl border-b border-cyan-500/30 pb-3 mb-2 z-10">
                    <span className="text-[10px] font-bold tracking-[0.3em] text-cyan-400/80 uppercase">System Logs</span>
                </div>
                {gameState.logs.slice(-15).reverse().map((log, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-[10px] font-mono text-white/60 leading-relaxed border-l-2 border-cyan-500/30 pl-3">
                        {log}
                    </motion.div>
                ))}
            </div>

            {/* --- CENTER TABLE GAMEPLAY AREA --- */}
            <div
                className="fixed top-1/2 left-1/2 flex items-start justify-center gap-6 max-w-[98vw] pointer-events-none z-20 origin-center"
                style={{ transform: "translate(-50%, -50%) scale(clamp(0.88, calc(100vw / 1680), 1.12))" }}
            >

                {/* SETUP: draw objective first */}
                {!activeObjective && gameState.phase === 'SETUP' && (
                    <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-full max-w-xl pointer-events-none z-30">
                        <div className="mx-auto text-center rounded-xl border border-cyan-500/40 bg-cyan-950/90 px-6 py-3 shadow-[0_0_30px_rgba(34,211,238,0.25)]">
                            <p className="text-cyan-300 text-[11px] font-bold tracking-[0.2em] uppercase">
                                Setup — Step 1
                            </p>
                            <p className="text-white/90 text-sm mt-1">
                                Click the <span className="text-cyan-400 font-bold">System Objective</span> deck (far left) to reveal your mission.
                            </p>
                        </div>
                    </div>
                )}
                
                {/* 1. ACTIVE OBJECTIVE DECK (LEFT) */}
                <motion.div 
                    drag 
                    dragMomentum={false}
                    className="relative w-[310px] h-[560px] pointer-events-auto transition-all duration-500 cursor-grab active:cursor-grabbing"
                >
                    {/* Title cleanly above (Hardcoded position) */}
                    <div className="absolute top-0 left-0 w-full flex items-center justify-center gap-2 select-none">
                        <GripVertical size={14} className="text-cyan-400/50" />
                        <span className="text-[12px] font-bold tracking-[0.5em] text-cyan-400/80 uppercase drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                            System Objective
                        </span>
                    </div>
                    
                    {/* The Stack container (Hardcoded position to completely isolate it) */}
                    <div className="absolute top-[40px] left-1/2 -translate-x-1/2 w-[280px] h-[392px]">
                        <div className="relative w-[280px] h-[392px]">
                            {/* Render 5 layers to guarantee a visible 3D diagonal stack thickness for 15 cards */}
                            {objectiveDeckCount > 0 ? (
                            [...Array(Math.min(objectiveDeckCount, 5))].map((_, i) => (
                                <motion.div 
                                    key={i}
                                    className={`absolute top-0 left-0 w-[280px] h-[392px] rounded-2xl border border-slate-600/50 bg-[#050A14] flex items-center justify-center ${isObjectiveLocked ? 'opacity-50 cursor-not-allowed grayscale' : 'cursor-pointer group hover:border-cyan-500/50'}`}
                                    onClick={() => {
                                        if (isObjectiveShuffling || isObjectiveLocked) return;
                                        playCardSound('flip');
                                        socket.emit("draw-objective", roomId);
                                    }}
                                    animate={isObjectiveShuffling 
                                        ? {
                                            x: [
                                                -i * 1.5,
                                                (i % 2 === 0 ? 1 : -1) * 35, 
                                                (i % 2 === 0 ? -1 : 1) * 20, 
                                                (i % 2 === 0 ? 1 : -1) * 30, 
                                                (i % 2 === 0 ? -1 : 1) * 10,
                                                (i % 2 === 0 ? 1 : -1) * 25,
                                                -i * 1.5
                                            ],
                                            y: [
                                                -i * 1.5,
                                                (i % 2 === 0 ? -1 : 1) * 10, 
                                                (i % 2 === 0 ? 1 : -1) * 5, 
                                                (i % 2 === 0 ? -1 : 1) * 8, 
                                                -i * 1.5
                                            ],
                                            rotateZ: [
                                                0,
                                                (i % 2 === 0 ? 1 : -1) * 6,
                                                (i % 2 === 0 ? -1 : 1) * 4,
                                                (i % 2 === 0 ? 1 : -1) * 5,
                                                0
                                            ]
                                        }
                                        : {
                                            x: -i * 1.5,
                                            y: -i * 1.5,
                                            rotateZ: 0
                                        }
                                    }
                                    transition={isObjectiveShuffling 
                                        ? {
                                            duration: 0.8,
                                            ease: "easeInOut",
                                            times: [0, 0.15, 0.35, 0.55, 0.75, 0.9, 1]
                                        }
                                        : {
                                            type: "spring",
                                            stiffness: 300,
                                            damping: 25
                                        }
                                    }
                                    style={{ 
                                        zIndex: i,
                                        boxShadow: i === 0 ? '5px 5px 20px rgba(0,0,0,0.6)' : 'none'
                                    }}
                                >
                                    {/* Only render the logo and inner border on the top card to keep it clean */}
                                    {i === Math.min(objectiveDeckCount, 5) - 1 && (
                                        <>
                                            <div className="absolute inset-2 border border-white/10 rounded-xl transition-all duration-300 group-hover:border-cyan-400/50"></div>
                                            <img src={CARD_BACK_LOGO_SRC} alt="Objective Card Back" className="w-[70%] h-auto object-contain opacity-90 drop-shadow-[0_0_10px_rgba(34,211,238,0.2)]" draggable={false} />
                                        </>
                                    )}
                                </motion.div>
                            ))
                            ) : (
                                <div className="absolute inset-0 rounded-2xl border border-dashed border-cyan-500/30 flex items-center justify-center bg-black/30">
                                    <span className="text-[9px] tracking-[0.3em] uppercase text-cyan-400/60 text-center px-4">
                                        Objective in play
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Number of Cards Tracker (Hardcoded Position to match main deck exactly) */}
                    <div className="absolute top-[450px] left-0 w-full flex justify-center">
                        <div className="w-fit min-w-[280px] max-w-[298px] text-[10px] font-bold tracking-[0.08em] text-white/50 uppercase bg-[#050A14] px-6 py-2.5 rounded-2xl border border-white/10 shadow-[0_4px_10px_rgba(0,0,0,0.5)] text-center leading-snug">
                            {objectiveDeckCount} / {OBJECTIVE_DECK_SIZE} in deck
                            {activeObjective && (
                                <span className="block text-[9px] tracking-[0.06em] text-cyan-400/70 mt-1 normal-case leading-tight px-1">
                                    Active: {activeObjective.name}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Shuffle Objective Button (Hardcoded Position identically matching main deck) */}
                    <div className="absolute top-[478px] left-0 w-full flex justify-center">
                        <div 
                            role="button"
                            onClick={() => {
                                if (isObjectiveShuffling || isObjectiveLocked) return;
                                playShuffleSound();
                                setIsObjectiveShuffling(true);
                                socket.emit("shuffle-objective-deck", roomId);
                                setTimeout(() => setIsObjectiveShuffling(false), 800);
                            }} 
                            className={`flex items-center justify-center w-[180px] h-[44px] bg-[#0a101f] border border-cyan-500 rounded-xl transition-all shadow-[0_0_15px_rgba(34,211,238,0.2)] group ${isObjectiveShuffling || isObjectiveLocked ? 'opacity-50 cursor-not-allowed grayscale' : 'hover:bg-cyan-900/60 hover:border-cyan-400 hover:text-cyan-300 active:scale-95 cursor-pointer'}`}
                        >
                            <span className="text-[9px] font-bold tracking-[0.5em] uppercase text-white group-hover:drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
                                {isObjectiveLocked ? 'Objective Locked' : (isObjectiveShuffling ? 'Shuffling...' : 'Shuffle Objective')}
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* 2. MILESTONE DECK (LEFT-CENTER) — locked until Deployment */}
                <motion.div
                    drag
                    dragMomentum={false}
                    className="relative w-[310px] h-[560px] pointer-events-auto cursor-grab active:cursor-grabbing"
                >
                    <div className="absolute top-0 left-0 w-full flex items-center justify-center gap-2 select-none">
                        <GripVertical size={14} className="text-yellow-500/50" />
                        <span className="text-[12px] font-bold tracking-[0.45em] text-yellow-400/90 uppercase drop-shadow-[0_0_10px_rgba(234,179,8,0.4)]">
                            Milestone
                        </span>
                    </div>

                    <div className="absolute top-[40px] left-1/2 -translate-x-1/2 w-[280px] h-[392px]">
                        <div className="relative w-[280px] h-[392px]">
                            {pairedMilestone ? (
                                <div className="relative w-full h-full">
                                    <Card
                                        card={pairedMilestone}
                                        className={`w-[280px] h-[392px] ${!milestoneUnlocked ? "opacity-80" : ""}`}
                                    />
                                    {milestoneUnlocked && (
                                        <div className="absolute -bottom-2 -right-2 bg-[#02040a] rounded-full p-1.5 border border-yellow-400/50 z-20">
                                            <Unlock className="w-4 h-4 text-yellow-300" />
                                        </div>
                                    )}
                                </div>
                            ) : milestoneDeckCount > 0 ? (
                                [...Array(Math.min(milestoneDeckCount, 5))].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="absolute top-0 left-0 w-[280px] h-[392px] rounded-2xl border border-yellow-700/40 bg-[#0a0805] flex items-center justify-center opacity-90"
                                        style={{ x: -i * 1.5, y: -i * 1.5, zIndex: i }}
                                    >
                                        {i === Math.min(milestoneDeckCount, 5) - 1 && (
                                            <>
                                                <div className="absolute inset-2 border border-yellow-500/20 rounded-xl" />
                                                <Trophy className="w-12 h-12 text-yellow-600/40" />
                                            </>
                                        )}
                                    </motion.div>
                                ))
                            ) : (
                                <div className="absolute inset-0 rounded-2xl border border-dashed border-yellow-500/20 flex items-center justify-center bg-black/30">
                                    <span className="text-[9px] tracking-[0.25em] uppercase text-yellow-500/50 text-center px-4">
                                        Draw objective first
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="absolute top-[450px] left-0 w-full flex justify-center">
                        <div className="w-fit min-w-[280px] max-w-[298px] text-[10px] font-bold tracking-[0.08em] text-white/50 uppercase bg-[#050A14] px-6 py-2.5 rounded-2xl border border-yellow-500/20 shadow-[0_4px_10px_rgba(0,0,0,0.5)] text-center leading-snug">
                            {pairedMilestone ? (
                                <>
                                    <span className="text-yellow-400/90">Paired · {milestoneUnlocked ? "Unlocked" : "Locked"}</span>
                                    <span className="block text-[9px] tracking-[0.06em] text-white/40 mt-1 normal-case leading-tight">
                                        {milestoneDeckCount} / {MILESTONE_DECK_SIZE} others in deck
                                    </span>
                                </>
                            ) : (
                                <>{milestoneDeckCount} / {MILESTONE_DECK_SIZE} in deck</>
                            )}
                        </div>
                    </div>

                    {pairedMilestone && !milestoneUnlocked && (
                        <div className="absolute top-[478px] left-0 w-full flex justify-center">
                            <div className="flex items-center justify-center gap-2 w-[180px] h-[44px] bg-[#0a101f] border border-yellow-500/50 rounded-xl shadow-[0_0_15px_rgba(234,179,8,0.15)]">
                                <Lock className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                                <span className="text-[8px] font-bold tracking-[0.12em] uppercase text-yellow-400/90 text-center leading-tight">
                                    Locked until Deployment
                                </span>
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* 3. CENTER TABLEAU (SHARED PIPELINE CASCADE) */}
                <motion.div 
                    drag 
                    dragMomentum={false}
                    className="relative w-[280px] h-[392px] pointer-events-auto cursor-grab active:cursor-grabbing" 
                    style={{ marginTop: '56px' }}
                >
                    {(() => {
                        const ENGINEER_ORDER_SLOTS: (keyof EngineerPipeline)[] = [
                            'objective',
                            ...PIPELINE_SLOT_KEYS,
                        ];
                        const pipelineCards: EngineerCard[] = [];
                        if (sharedPipeline) {
                            ENGINEER_ORDER_SLOTS.forEach(slot => {
                                const val = (sharedPipeline as any)[slot];
                                if (Array.isArray(val)) {
                                    pipelineCards.push(...val);
                                } else if (val) {
                                    pipelineCards.push(val as unknown as EngineerCard);
                                }
                            });
                        }
                        const N_pipeline = pipelineCards.length;
                        // Squeeze vertical spacing step dynamically from 60px down to 32px
                        const yOffsetStep = N_pipeline > 6 ? 32 : (N_pipeline > 4 ? 44 : 60);
                        // Scale cards down slightly to 85% as the pipeline grows beyond 5 cards
                        const cardScale = N_pipeline > 5 ? 0.85 : 1.0;
                        
                        return (
                            <>
                                <AnimatePresence>
                                    {pipelineCards.map((card: any, idx: number) => (
                                        <motion.div 
                                            key={`shared-${card.id}`}
                                            initial={{ opacity: 0, y: -50, x: "-50%", scale: 0.9 }}
                                            animate={{ opacity: 1, y: idx * yOffsetStep, x: "-50%", scale: cardScale }}
                                            whileHover={{ x: "-60%", zIndex: 50, scale: cardScale * 1.05 }}
                                            className="absolute top-0 left-1/2 cursor-pointer drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)]"
                                            style={{ zIndex: 10 + idx }}
                                        >
                                            <Card card={card} onInspect={() => setInspectingCard(card)} className="w-[280px] h-[392px]" />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>

                                {/* --- PENDING PLAY (CHALLENGE WINDOW) --- */}
                                <AnimatePresence>
                                    {gameState?.pendingPlay && (
                                        <motion.div
                                            key={`pending-${gameState.pendingPlay.card.id}`}
                                            initial={{ opacity: 0, scale: 1.5 * cardScale, y: -200, x: "-50%", rotate: 10 }}
                                            animate={{ 
                                                opacity: 1, 
                                                scale: cardScale, 
                                                y: N_pipeline * yOffsetStep, 
                                                x: "-50%", 
                                                rotate: 0 
                                            }}
                                            exit={{ opacity: 0, scale: 0.5 * cardScale, y: 200, x: "-50%", rotate: -20, transition: { duration: 0.3 } }}
                                            className="absolute top-0 left-1/2 z-[100] drop-shadow-[0_0_40px_rgba(239,68,68,0.6)]"
                                        >
                                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap bg-red-600/90 text-white font-bold px-4 py-1.5 rounded-full border border-red-400 shadow-[0_0_20px_rgba(220,38,38,0.8)] animate-pulse flex items-center gap-2">
                                                <ShieldAlert size={14} />
                                                <span>PENDING...</span>
                                            </div>
                                            <Card card={gameState.pendingPlay.card} className="w-[280px] h-[392px] ring-4 ring-red-500/80 ring-offset-4 ring-offset-black" />
                                            
                                            {gameState.pendingPlay.playerId !== socket?.id && (
                                                <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-[240px]">
                                                    <button 
                                                        onClick={() => socket?.emit('challenge-play', roomId)}
                                                        className="w-full bg-red-600 hover:bg-red-500 text-white font-black py-3 px-6 rounded-xl border-b-4 border-red-800 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2 drop-shadow-xl"
                                                    >
                                                        <ShieldAlert size={20} />
                                                        RAISE HAND / CHALLENGE!
                                                    </button>
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {N_pipeline === 0 && !gameState?.pendingPlay && (
                                    <div className="absolute inset-0 rounded-2xl border-2 border-dashed border-cyan-500/40 flex flex-col items-center justify-center bg-black/40 backdrop-blur-md shadow-[0_0_30px_rgba(34,211,238,0.1)] z-0">
                                        <GripVertical size={18} className="text-cyan-400/50 mb-3 animate-pulse" />
                                        <span className="text-[10px] font-bold tracking-[0.4em] text-cyan-400/80 uppercase text-center leading-relaxed">
                                            Shared Pipeline<br/><span className="text-[8px] text-white/30">Draw Objective to Start</span>
                                        </span>
                                    </div>
                                )}
                            </>
                        );
                    })()}
                </motion.div>

                    {/* --- OPPONENT HAND (TOP CENTERED) --- */}
                    {opponent && (
                        <div 
                            className="absolute pointer-events-none"
                            style={{ top: '-220px', left: '50%', transform: 'translateX(-50%)', width: 'max-content', zIndex: 50 }}
                        >
                            <motion.div 
                                drag
                                dragMomentum={false}
                                className="flex items-center gap-6 pointer-events-auto cursor-grab active:cursor-grabbing"
                            >
                                <div className="flex flex-col gap-2 shrink-0 select-none items-center">
                                    {/* Grip Icon & Label */}
                                    <div className="flex items-center gap-1 text-cyan-400/60 drop-shadow-[0_0_8px_rgba(34,211,238,0.3)] bg-[#02040a]/60 px-3 py-1.5 rounded-full border border-cyan-500/25">
                                        <GripVertical size={12} />
                                        <span className="text-[8px] font-bold tracking-widest uppercase">AI Hand</span>
                                    </div>
                                    {/* Premium Toggle Button for Opponent Hand */}
                                    <button
                                        onClick={() => setIsOpponentHandVisible(!isOpponentHandVisible)}
                                        className="bg-black/60 hover:bg-cyan-900/60 border border-cyan-500/30 rounded-full p-2.5 text-cyan-400 hover:text-white hover:scale-110 hover:shadow-[0_0_15px_rgba(34,211,238,0.5)] transition-all cursor-pointer"
                                        title={isOpponentHandVisible ? "Hide Hand" : "Show Hand"}
                                    >
                                        {isOpponentHandVisible ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                    </button>
                                </div>

                                <motion.div 
                                    className="flex items-center justify-center gap-4"
                                    initial={{ y: 0, scale: 0.85 }}
                                    animate={{ y: isOpponentHandVisible ? 0 : -240, scale: 0.85 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                >
                                    {opponent.hand.map((card, i) => (
                                        <motion.div 
                                            key={card.id + i}
                                            initial={{ y: -100, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            className="w-[200px] h-[280px] rounded-[20px] border border-slate-600/50 bg-[#050A14] flex items-center justify-center drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] shrink-0"
                                            style={{ zIndex: i }}
                                        >
                                            <img src={CARD_BACK_LOGO_SRC} alt="Card Back" className="w-[70%] h-auto object-contain opacity-70" draggable={false} />
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </motion.div>
                        </div>
                    )}

                    {/* --- PLAYER HAND (BOTTOM CENTERED) --- */}
                    <div 
                        className="absolute pointer-events-none"
                        style={{ bottom: '-210px', left: '50%', transform: 'translateX(-50%)', width: 'max-content', zIndex: 40 }}
                    >
                        <motion.div 
                            drag
                            dragMomentum={false}
                            className="flex items-center gap-6 pointer-events-auto cursor-grab active:cursor-grabbing"
                        >
                            <div className="flex flex-col gap-2 shrink-0 select-none items-center">
                                {/* Grip Icon & Label */}
                                <div className="flex items-center gap-1 text-cyan-400/60 drop-shadow-[0_0_8px_rgba(34,211,238,0.3)] bg-[#02040a]/60 px-3 py-1.5 rounded-full border border-cyan-500/25">
                                    <GripVertical size={12} />
                                    <span className="text-[8px] font-bold tracking-widest uppercase">Hand</span>
                                </div>
                                {/* Premium Toggle Button for Player Hand */}
                                <button
                                    onClick={() => setIsPlayerHandVisible(!isPlayerHandVisible)}
                                    className="bg-black/60 hover:bg-cyan-900/60 border border-cyan-500/30 rounded-full p-2.5 text-cyan-400 hover:text-white hover:scale-110 hover:shadow-[0_0_15px_rgba(34,211,238,0.5)] transition-all cursor-pointer"
                                    title={isPlayerHandVisible ? "Hide Hand" : "Show Hand"}
                                >
                                    {isPlayerHandVisible ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
                                </button>
                            </div>
                            <div className="flex items-center justify-center">
                            {hand.map((card, i) => {
                                const N = hand.length;
                                const centerIndex = (N - 1) / 2;
                                const offset = i - centerIndex;
                                
                                // Rotate: edge cards rotate up to +- 12 degrees
                                const rot = isPlayerHandVisible ? offset * 3.5 : 0;
                                // Dip: edge cards dip down on Y-axis by up to ~25px
                                const yDip = isPlayerHandVisible ? Math.pow(Math.abs(offset), 1.6) * 3 : 0;
                                // Overlap: negative marginRight dynamic to prevent overflow
                                const overlapAmount = N > 5 ? Math.min((N - 5) * 8, 65) : 0;
                                
                                return (
                                    <motion.div 
                                        key={card.id}
                                        initial={{ y: 150, rotate: 0, scale: 1, opacity: 0 }}
                                        animate={{ 
                                            y: isPlayerHandVisible ? yDip : 400, 
                                            rotate: rot, 
                                            scale: 1,
                                            opacity: 1
                                        }}
                                        whileHover={{ 
                                            y: isPlayerHandVisible ? -60 : 400, 
                                            rotate: 0, 
                                            scale: 1.06, 
                                            zIndex: 100 
                                        }}
                                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                        className="drop-shadow-[0_10px_25px_rgba(0,0,0,0.9)] shrink-0 select-none pointer-events-auto"
                                        style={{ 
                                            zIndex: i,
                                            marginRight: i < N - 1 ? `-${overlapAmount}px` : '0px',
                                            transformOrigin: 'bottom center'
                                        }}
                                    >
                                        <Card card={card} onClick={() => playCardAction(card.id)} onInspect={() => setInspectingCard(card)} className="w-[250px] h-[350px]" />
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                </div>

                {/* 3. MAIN DECK (RIGHT) */}
                <motion.div 
                    drag 
                    dragMomentum={false}
                    className="relative w-[310px] h-[560px] pointer-events-auto transition-all duration-500 cursor-grab active:cursor-grabbing"
                >
                    {/* Title cleanly above (Hardcoded position) */}
                    <div className="absolute top-0 left-0 w-full flex items-center justify-center gap-2 select-none">
                        <GripVertical size={14} className="text-cyan-400/50" />
                        <span className="text-[12px] font-bold tracking-[0.5em] text-cyan-400/80 uppercase drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                            Main Deck
                        </span>
                    </div>
                    
                    {/* The Stack container (Hardcoded position to completely isolate it) */}
                    <div className="absolute top-[40px] left-1/2 -translate-x-1/2 w-[280px] h-[392px]">
                        {/* Render up to 15 layers to simulate physical deck thickness */}
                        {[...Array(Math.min(Math.ceil(deckCount / 8), 15))].map((_, i) => (
                            <motion.div 
                                key={i}
                                className={`absolute top-0 left-0 w-[280px] h-[392px] rounded-2xl border border-slate-600/50 bg-[#050A14] flex items-center justify-center ${(gameState.phase === 'DRAW' || gameState.phase === 'SETUP') && isActivePlayer ? 'cursor-pointer group hover:border-cyan-500' : 'cursor-not-allowed opacity-60'}`}
                                onClick={() => {
                                    console.log("Deck click! State:", { isActivePlayer, phase: gameState.phase, activePlayerId: gameState.activePlayerId, socketId: socket.id });
                                    if (isDeckShuffling) return;
                                    
                                    // Block drawing if no objective is selected
                                    if (gameState.sharedPipeline && !gameState.sharedPipeline.objective) {
                                        // playSound(150, "sawtooth", 0.1);
                                        return;
                                    }

                                    drawCard('deck');
                                }}
                                animate={isDeckShuffling 
                                    ? {
                                        x: [
                                            -i * 1.5,
                                            (i % 2 === 0 ? 1 : -1) * 35, 
                                            (i % 2 === 0 ? -1 : 1) * 20, 
                                            (i % 2 === 0 ? 1 : -1) * 30, 
                                            (i % 2 === 0 ? -1 : 1) * 10,
                                            (i % 2 === 0 ? 1 : -1) * 25,
                                            -i * 1.5
                                        ],
                                        y: [
                                            -i * 1.5,
                                            (i % 2 === 0 ? -1 : 1) * 10, 
                                            (i % 2 === 0 ? 1 : -1) * 5, 
                                            (i % 2 === 0 ? -1 : 1) * 8, 
                                            -i * 1.5
                                        ],
                                        rotateZ: [
                                            0,
                                            (i % 2 === 0 ? 1 : -1) * 6,
                                            (i % 2 === 0 ? -1 : 1) * 4,
                                            (i % 2 === 0 ? 1 : -1) * 5,
                                            0
                                        ]
                                    }
                                    : {
                                        x: -i * 1.5,
                                        y: -i * 1.5,
                                        rotateZ: 0
                                    }
                                }
                                transition={isDeckShuffling 
                                    ? {
                                        duration: 0.8,
                                        ease: "easeInOut",
                                        times: [0, 0.15, 0.35, 0.55, 0.75, 0.9, 1]
                                    }
                                    : {
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 25
                                    }
                                }
                                style={{ 
                                    zIndex: i,
                                    boxShadow: i === 0 ? '5px 5px 20px rgba(0,0,0,0.6)' : 'none'
                                }}
                            >
                                {/* Only render the logo and inner border on the top card to keep it clean */}
                                {i === Math.min(Math.ceil(deckCount / 8), 15) - 1 && (
                                    <>
                                        <div className={`absolute inset-2 border border-white/10 rounded-xl transition-all duration-300 ${(gameState.phase === 'DRAW' || gameState.phase === 'SETUP') && isActivePlayer && !isDeckShuffling ? 'group-hover:border-cyan-400/50' : ''}`}></div>
                                        <img src={CARD_BACK_LOGO_SRC} alt="Card Back" className="w-[70%] h-auto object-contain opacity-90 drop-shadow-[0_0_10px_rgba(34,211,238,0.2)]" draggable={false} />
                                    </>
                                )}
                            </motion.div>
                        ))}
                        {deckCount === 0 && (
                            <div className="absolute inset-0 rounded-2xl border-2 border-dashed border-white/20 bg-black/40 flex items-center justify-center backdrop-blur-md">
                                <span className="text-[12px] text-white/30 tracking-[0.4em] font-bold uppercase">Empty</span>
                            </div>
                        )}
                    </div>

                    {/* Number of Cards Tracker (Hardcoded Position to guarantee 18px gap from deck) */}
                    <div className="absolute top-[450px] left-0 w-full flex justify-center">
                        <div className="w-fit min-w-[280px] max-w-[298px] text-[9px] font-bold tracking-[0.06em] text-white/50 uppercase bg-[#050A14] px-6 py-2.5 rounded-2xl border border-white/10 shadow-[0_4px_10px_rgba(0,0,0,0.5)] text-center leading-snug">
                            {deckCount} / {RETAIL_ENGINEER_DECK_SIZE} engineer · {FULL_GAME_SET_SIZE} set
                        </div>
                    </div>

                    {/* Shuffle Button (Hardcoded Position to guarantee tight gap from numbers) */}
                    <div className="absolute top-[478px] left-0 w-full flex justify-center">
                        <div 
                            role="button"
                            onClick={() => {
                                if (isDeckShuffling || deckCount < 2) return;
                                playShuffleSound();
                                socket.emit("shuffle-deck", roomId);
                                setIsDeckShuffling(true);
                                setTimeout(() => setIsDeckShuffling(false), 800);
                            }} 
                            className={`flex items-center justify-center w-[180px] h-[44px] bg-[#0a101f] border border-cyan-500 rounded-xl transition-all shadow-[0_0_15px_rgba(34,211,238,0.2)] group ${isDeckShuffling || deckCount < 2 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-cyan-900/60 hover:border-cyan-400 hover:text-cyan-300 active:scale-95 cursor-pointer'}`}
                        >
                            <span className="text-[9px] font-bold tracking-[0.5em] uppercase text-white group-hover:drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">{isDeckShuffling ? 'Shuffling...' : 'Shuffle Deck'}</span>
                        </div>
                    </div>
                </motion.div>

                {/* 4. SCIENCE THREAD TIMELINE (RIGHT COLUMN) */}
                <motion.div 
                    drag 
                    dragMomentum={false}
                    className="relative w-[310px] h-[560px] bg-[#02040a]/75 backdrop-blur-3xl border border-cyan-500/25 rounded-2xl flex flex-col pointer-events-auto z-30 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden transition-all duration-500 cursor-grab active:cursor-grabbing"
                    style={{ padding: '24px' }}
                >
                    <div className="border-b border-cyan-500/30 pb-4 mb-4 flex items-center justify-between shrink-0 gap-2 select-none">
                        <div className="flex items-center gap-1.5 truncate">
                            <GripVertical size={13} className="text-cyan-400/60 shrink-0" />
                            <span className="text-[11px] font-bold tracking-[0.1em] text-cyan-400 uppercase drop-shadow-[0_0_8px_rgba(34,211,238,0.4)] truncate">
                                Science Timeline
                            </span>
                        </div>
                        <span className="text-[8px] font-mono text-cyan-500/60 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/25 shrink-0">
                            REAL-TIME
                        </span>
                    </div>

                    <div className="relative flex-1 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-cyan-500/20 scrollbar-track-transparent custom-scrollbar">
                        {/* The track line */}
                        {gameState.history && gameState.history.length > 0 && (
                            <div 
                                className="absolute bottom-4 w-[1.5px] bg-gradient-to-b from-cyan-500/20 via-cyan-500/40 to-cyan-500/10 pointer-events-none" 
                                style={{ left: '8px', top: '20px' }}
                            />
                        )}

                        <div 
                            className="flex flex-col gap-6 relative"
                            style={{ paddingTop: '16px', paddingLeft: '32px', paddingRight: '16px' }}
                        >
                            <AnimatePresence initial={false}>
                                {(!gameState.history || gameState.history.length === 0) ? (
                                    <div className="text-[10px] text-white/30 tracking-wider font-mono text-center pt-20">
                                        NO TRANSACTIONS<br/>RECORDED YET
                                    </div>
                                ) : (
                                    gameState.history.map((move: any, idx: number) => {
                                        const isOk = move.isValid;
                                        return (
                                            <motion.div 
                                                key={move.id || idx}
                                                initial={{ opacity: 0, x: 20, y: -10 }}
                                                animate={{ opacity: 1, x: 0, y: 0 }}
                                                className="relative flex flex-col gap-1 text-left"
                                            >
                                                {/* Node Bullet on the track line */}
                                                <div className="absolute right-full mr-4 top-2 -translate-y-1/2 flex items-center justify-center">
                                                    {isOk ? (
                                                        <span className="flex h-[16px] w-[16px] items-center justify-center rounded-full bg-green-500/20 border border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)] text-[9px] text-green-400 font-bold">
                                                            ✓
                                                        </span>
                                                    ) : (
                                                        <span className="flex h-[16px] w-[16px] items-center justify-center rounded-full bg-red-500/20 border border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.6)] text-[9px] text-red-400 font-bold">
                                                            🛑
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Content */}
                                                <div className="flex items-baseline justify-between gap-2">
                                                    <span className={`text-[10px] font-bold tracking-wide truncate ${isOk ? 'text-white drop-shadow-[0_0_4px_rgba(255,255,255,0.15)]' : 'text-red-400/90 line-through'}`} title={move.cardName}>
                                                        {move.cardName}
                                                    </span>
                                                </div>
                                                <span className="text-[8px] font-mono tracking-widest text-cyan-400/70 uppercase">
                                                    {move.category}
                                                </span>
                                                <div className="flex items-center justify-between text-[8px] font-mono text-white/40 mt-0.5">
                                                    <span>BY {move.playerName?.toUpperCase()}</span>
                                                    <span className="text-[7px]">
                                                        {isOk ? (
                                                            <span className="text-green-500/80 font-bold">VALID</span>
                                                        ) : (
                                                            <span className="text-red-500/80 font-bold">BLUFF</span>
                                                        )}
                                                    </span>
                                                </div>
                                            </motion.div>
                                        );
                                    })
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* --- HAND REMOVED AS PER SOLITAIRE LAYOUT --- */}

            {/* --- DEALING OVERLAY REMOVED AS REQUESTED --- */}

            {/* --- VICTORY CEREMONY --- */}
            <AnimatePresence>
                {showVictoryCeremony && winnerPlayer && (
                    <VictoryCeremony
                        isHumanWinner={isHumanWinner}
                        winnerDisplayName={winnerPlayer.name}
                        defaultName={playerName || winnerPlayer.name}
                        finalIp={isHumanWinner ? ip : winnerPlayer.ip}
                        onClose={() => {
                            setVictoryDismissed(true);
                            window.location.reload();
                        }}
                    />
                )}
            </AnimatePresence>



            {/* --- INSPECT MODAL --- */}
            <AnimatePresence>
                {inspectingCard && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[3000] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-10" onClick={() => setInspectingCard(null)}>
                        <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }} onClick={(e) => e.stopPropagation()} className="bg-[#050A14] border-2 border-cyan-500/50 rounded-[40px] p-12 shadow-[0_0_100px_rgba(34,211,238,0.3)] flex gap-16 items-center">
                            <Card card={inspectingCard as any} className="!w-[360px] !h-[504px] shadow-[0_0_50px_rgba(0,0,0,1)] border border-white/20" />
                            <div className="flex flex-col justify-center max-w-lg">
                                <span className="text-cyan-400 font-bold tracking-[0.4em] uppercase mb-4 text-sm bg-cyan-900/30 w-fit px-4 py-2 rounded-full border border-cyan-500/30">{inspectingCard.category}</span>
                                <h2 className="text-5xl font-display font-bold text-white mb-8 leading-tight drop-shadow-lg">{inspectingCard.name}</h2>
                                <p className="text-white/80 text-xl leading-relaxed border-l-4 border-cyan-500/60 pl-6 mb-10 font-sans">{inspectingCard.description}</p>
                                <div className="text-cyan-400 text-3xl font-bold tracking-widest drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">+{inspectingCard.ipValue || 0} IP</div>

                                {isActivePlayer && hand.some(c => c.id === inspectingCard.id) && (
                                    <div className="mt-8 pt-6 border-t border-white/10 flex flex-col gap-3">
                                        <button
                                            onClick={() => {
                                                if (purgesRemaining <= 0) return;
                                                playCardSound('flip');
                                                socket.emit("purge-card", { roomId, cardId: inspectingCard.id });
                                                setPurgesRemaining(prev => Math.max(0, prev - 1));
                                                setInspectingCard(null);
                                            }}
                                            disabled={purgesRemaining <= 0}
                                            className={`w-full py-4 rounded-2xl font-bold text-sm tracking-[0.2em] uppercase border transition-all flex items-center justify-center gap-3 ${
                                                purgesRemaining > 0 
                                                ? 'bg-red-950/40 border-red-500/50 text-red-400 hover:bg-red-900/60 hover:border-red-400 hover:text-white hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] active:scale-95 cursor-pointer' 
                                                : 'bg-black/40 border-white/10 text-white/20 cursor-not-allowed'
                                            }`}
                                        >
                                            <Layers className="w-5 h-5 animate-pulse" />
                                            <span>PURGE ASSET ({purgesRemaining} LEFT)</span>
                                        </button>
                                        <span className="text-[10px] text-white/40 tracking-wider text-center font-mono">
                                            RECYCLES REDUNDANT CARD FOR NEW DRAW. MAX 3/CYCLE.
                                        </span>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- HOW TO PLAY GUIDE MODAL (FULL SCREEN HUD CONSOLE) --- */}
            <AnimatePresence>
                {isGuideOpen && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 1.02 }} 
                        animate={{ opacity: 1, scale: 1 }} 
                        exit={{ opacity: 0, scale: 1.02 }} 
                        className="fixed inset-0 z-[4000] bg-[#02050d]/98 backdrop-blur-3xl flex flex-col w-screen h-screen overflow-hidden text-left pt-24 pb-8 px-8 md:px-12 lg:px-20 pointer-events-auto border-0"
                    >
                        {/* HEADER (FIXED TOP - PUSHED DOWN FOR SAFE AREA) */}
                        <div className="shrink-0 pb-6 border-b border-cyan-500/25 mb-8 flex items-center justify-between select-none" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div className="flex items-center gap-3.5" style={{ display: 'flex', alignItems: 'center' }}>
                                <span className="w-3.5 h-3.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_12px_rgba(34,211,238,0.9)] shrink-0" />
                                <span className="text-cyan-400 font-display font-black tracking-[0.3em] uppercase text-xl lg:text-3xl drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                                    System Operations Manual
                                </span>
                            </div>
                            
                            {/* CLOSE EXIT BUTTON - PREMIUM WHITE SQUARE SHIFTED LEFT */}
                            <button 
                                onClick={() => setIsGuideOpen(false)} 
                                className="text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 hover:border-cyan-400/50 w-11 h-11 rounded-xl flex items-center justify-center transition-all hover:rotate-90 hover:scale-105 active:scale-95 cursor-pointer border border-white/10 select-none shadow-md shrink-0"
                                style={{ marginRight: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                title="Close Operations Manual"
                            >
                                <span className="text-base font-bold">✕</span>
                            </button>
                        </div>
                        
                        {/* TWO-COLUMN CONTENT GRID (SCROLLABLE SPLIT-PANEL) */}
                        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 overflow-y-auto custom-scrollbar pr-3 pb-4">
                            
                            {/* LEFT SIDE: INSTRUCTIONS & GOALS (5 COLUMNS) */}
                            <div className="lg:col-span-5 flex flex-col gap-12 text-left font-sans">
                                {/* STEP 1 */}
                                <div>
                                    <div className="flex items-center gap-4 mb-4 select-none" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <span className="text-xs font-bold font-mono tracking-widest text-cyan-400 bg-cyan-950/60 px-3.5 py-1.5 rounded border border-cyan-500/30" style={{ marginRight: '8px' }}>PHASE 01</span>
                                        <h3 className="text-cyan-400 font-bold text-xl lg:text-2xl uppercase tracking-wider drop-shadow-[0_0_5px_rgba(34,211,238,0.25)]">
                                            Start the Project Setup
                                        </h3>
                                    </div>
                                    <p className="text-slate-200 leading-relaxed text-base lg:text-lg">
                                        Look at the HUD control panel on the far left—it will say <span className="text-cyan-400 font-extrabold uppercase">YOUR TURN / SETUP</span>. You are in the initial setup phase.
                                    </p>
                                    <ul className="mt-5 text-slate-300 text-sm lg:text-base leading-relaxed flex flex-col gap-4">
                                        <li className="flex gap-3 items-start">
                                            <span className="text-cyan-400 font-bold select-none shrink-0 mt-0.5">❯</span>
                                            <span>Click on the <span className="text-white font-bold underline decoration-cyan-500/40 underline-offset-4">SYSTEM OBJECTIVE</span> card deck on the left to draw and reveal the target AI system you are both building (e.g., <span className="text-cyan-400 italic font-bold">Fraud Detection System</span>).</span>
                                        </li>
                                        <li className="flex gap-3 items-start">
                                            <span className="text-cyan-400 font-bold select-none shrink-0 mt-0.5">❯</span>
                                            <span>Once the objective is revealed, draw cards from the <span className="text-white font-bold underline decoration-cyan-500/40 underline-offset-4">MAIN DECK</span> until your starting hand is full. (You can click the round chevron button at the bottom center of the screen to expand your Hand tray!).</span>
                                        </li>
                                    </ul>
                                </div>

                                {/* STEP 2 */}
                                <div className="border-t border-white/5 pt-10">
                                    <div className="flex items-center gap-4 mb-4 select-none" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <span className="text-xs font-bold font-mono tracking-widest text-red-500 bg-red-950/40 px-3.5 py-1.5 rounded border border-red-500/30" style={{ marginRight: '8px' }}>PHASE 02</span>
                                        <h3 className="text-cyan-400 font-bold text-xl lg:text-2xl uppercase tracking-wider drop-shadow-[0_0_5px_rgba(34,211,238,0.25)]">
                                            Spotting & Challenging the AI
                                        </h3>
                                    </div>
                                    <p className="text-slate-200 leading-relaxed text-base lg:text-lg">
                                        Once setup is complete and normal operations resume, the Vanguard AI will take its turn.
                                    </p>
                                    <ul className="mt-5 text-slate-300 text-sm lg:text-base leading-relaxed flex flex-col gap-4">
                                        <li className="flex gap-3 items-start">
                                            <span className="text-cyan-400 font-bold select-none shrink-0 mt-0.5">❯</span>
                                            <span>If the AI plays a card (like <span className="text-red-400 italic font-bold">Feedback Loop</span> out of sequence or without a matching objective), <span className="text-red-400 font-bold">a giant, glowing red alert banner will drop down at the top center of your screen</span>!</span>
                                        </li>
                                        <li className="flex gap-3 items-start">
                                            <span className="text-cyan-400 font-bold select-none shrink-0 mt-0.5">❯</span>
                                            <span>You will have a <span className="text-red-400 font-bold">5-second window</span> while that banner is flashing to click the big <span className="text-red-400 font-black">🚨 Raise Hand / Challenge!</span> button inside it.</span>
                                        </li>
                                        <li className="flex gap-3 items-start">
                                            <span className="text-cyan-400 font-bold select-none shrink-0 mt-0.5">❯</span>
                                            <span>If you click it in time, you will catch the AI's bluff, discard its card, and record a successful <span className="text-red-400 font-bold">🛑 BLUFF CATCH</span> on your Science Timeline!</span>
                                        </li>
                                    </ul>
                                </div>

                                {/* WINNING CONDITION */}
                                <div className="border-t border-white/5 pt-10">
                                    <h3 className="text-cyan-400 font-bold text-xl lg:text-2xl tracking-wider mb-4 uppercase drop-shadow-[0_0_5px_rgba(34,211,238,0.25)] select-none">
                                        Winning Condition
                                    </h3>
                                    <p className="text-slate-200 leading-relaxed text-base lg:text-lg">
                                        Earn Innovation Points (IP) by integrating valid pipeline cards. Once Deployment completes, the player with the <span className="text-yellow-400 font-bold">highest IP</span> wins — including Milestone +30 for the deployer.
                                    </p>
                                </div>
                            </div>
                            
                            {/* RIGHT SIDE: PIPELINE CATEGORIES (7 COLUMNS) */}
                            <div className="lg:col-span-7 flex flex-col text-left font-sans">
                                <h3 className="text-cyan-400 font-bold text-xl lg:text-2xl tracking-wider mb-4 uppercase drop-shadow-[0_0_5px_rgba(34,211,238,0.25)] select-none">
                                    ML Pipeline Stages
                                </h3>
                                <p className="text-slate-200 leading-relaxed text-base lg:text-lg mb-8">
                                    To build the AI system, you must play cards matching the sequential stages of the ML Pipeline:
                                </p>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 text-sm lg:text-base font-mono text-slate-300">
                                    {PIPELINE_STAGES.map((stage, i) => (
                                        <div key={stage.slotKey} className="flex gap-5 bg-cyan-950/25 border border-cyan-500/20 rounded-[24px] p-6 lg:p-7 hover:border-cyan-500/40 hover:bg-cyan-900/15 transition-all duration-300 shadow-xl" style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                                            <span className="flex items-center justify-center w-9 h-9 rounded-2xl bg-cyan-500/20 text-cyan-400 font-mono font-bold text-base shrink-0 border border-cyan-500/40" style={{ minWidth: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px' }}>{i + 1}</span>
                                            <div style={{ flex: 1 }}>
                                                <div className="text-[14px] lg:text-[16px] font-extrabold tracking-widest text-cyan-400 uppercase">{stage.category}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* FOOTER (FIXED BOTTOM) */}
                        <div className="shrink-0 pt-6 border-t border-cyan-500/20 mt-8 w-full select-none">
                            <button 
                                onClick={() => setIsGuideOpen(false)}
                                className="w-full py-5 bg-[#0a1226] border-2 border-cyan-500/50 hover:bg-cyan-900/40 hover:border-cyan-400 active:scale-99 text-cyan-300 hover:text-white font-bold tracking-[0.4em] rounded-[20px] transition-all cursor-pointer uppercase text-sm shadow-lg shadow-cyan-950/50"
                            >
                                CLOSE OPERATIONS MANUAL
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
 
         </div>
     );
 };
