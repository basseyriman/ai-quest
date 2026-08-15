"use client";

import { useState } from "react";
import { GameBoard } from "@/components/game/GameBoard";
import { Lobby } from "@/components/game/Lobby";
import { useSocket } from "@/hooks/useSocket";
import { motion, AnimatePresence } from "framer-motion";
import { IntroSequence } from "@/components/game/IntroSequence";

let soundtrack: HTMLAudioElement | null = null;
if (typeof window !== 'undefined') {
  soundtrack = new Audio('/soundtrack.mp3');
  soundtrack.volume = 0.4;
  soundtrack.loop = true;
  soundtrack.preload = 'auto';
}

const playInitializeSound = () => {
  if (!soundtrack) return;
  soundtrack.currentTime = 0.5;
  soundtrack.play().catch(e => console.log("Audio play failed:", e));
};

export default function Home() {
  const { socket, isConnected } = useSocket();
  const [inGame, setInGame] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [introLeadsToLobby, setIntroLeadsToLobby] = useState(false);
  const [showLobby, setShowLobby] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [roomId, setRoomId] = useState("");

  const handleJoin = (name: string, room: string) => {
    if (socket) {
      socket.emit("join-room", { roomId: room, playerName: name });
      setPlayerName(name);
      setRoomId(room);
      setInGame(true);
      setShowLobby(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-0 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] overflow-hidden relative font-sans text-white">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none mix-blend-overlay"></div>
      
      <AnimatePresence mode="wait">
        {!inGame && !showLobby && !showIntro && (
          <motion.div
            key="home-menu"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="z-20 w-full h-full min-h-screen flex flex-col items-center justify-center relative px-6"
          >
            <div className="relative mb-16 flex flex-col items-center group w-full">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10 w-[85vw] max-w-[900px] flex justify-center"
              >
                <img
                  src="/ai_quest_logo_clean.png"
                  alt="AI QUEST"
                  className="w-full h-auto drop-shadow-[0_0_60px_rgba(6,182,212,0.5)]"
                />
              </motion.div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-48 bg-cyan-600/20 blur-[100px] rounded-[100%] pointer-events-none transition-all duration-1000 group-hover:bg-cyan-500/40 group-hover:blur-[140px]" />
            </div>

            <div className="flex flex-row items-center justify-between w-full max-w-[700px] px-4 relative z-20 mt-8">
              <button 
                onClick={() => window.close()} 
                className="group flex items-center gap-4 text-slate-400 hover:text-cyan-400 transition-colors font-mono tracking-[0.4em] uppercase text-sm sm:text-xl"
              >
                <span className="opacity-0 group-hover:opacity-100 transition-all transform -translate-x-6 group-hover:translate-x-0 duration-500 text-cyan-500">
                  ←
                </span>
                <span className="relative py-2">
                  DISCONNECT
                  <span className="absolute bottom-0 right-0 w-0 group-hover:w-full h-[1px] bg-cyan-500/50 transition-all duration-500"></span>
                </span>
              </button>

              <button 
                onClick={() => {
                  setIntroLeadsToLobby(true);
                  setShowIntro(true);
                  playInitializeSound();
                }} 
                className="group flex items-center gap-4 text-cyan-100 hover:text-white transition-colors font-mono font-bold tracking-[0.4em] uppercase text-sm sm:text-xl drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]"
              >
                <span className="relative py-2">
                  INITIALIZE
                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-cyan-500/50 group-hover:bg-cyan-300 group-hover:shadow-[0_0_15px_rgba(34,211,238,1)] transition-all duration-500"></span>
                </span>
                <span className="opacity-50 group-hover:opacity-100 transition-all transform translate-x-0 group-hover:translate-x-6 duration-500 text-cyan-300">
                  →
                </span>
              </button>
            </div>
          </motion.div>
        )}

        {showIntro && (
          <IntroSequence 
            key={introLeadsToLobby ? 'lobby-intro' : 'splash'}
            onComplete={() => {
              setShowIntro(false);
              if (introLeadsToLobby) {
                setShowLobby(true);
                setIntroLeadsToLobby(false);
              }
            }}
            onAbort={() => {
              setShowIntro(false);
              setIntroLeadsToLobby(false);
            }}
          />
        )}

        {showLobby && !inGame && (
          <motion.div
            key="lobby-screen"
            initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0 }}
            className="w-full z-20 flex-1 flex flex-col items-center justify-center relative"
          >
            <button
              onClick={() => setShowLobby(false)}
              style={{
                position: 'absolute', top: '32px', left: '32px', zIndex: 100, 
                color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace', fontSize: '14px', 
                letterSpacing: '0.2em', padding: '12px 24px', border: '1px solid rgba(255,255,255,0.1)', 
                borderRadius: '8px', backgroundColor: 'transparent', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase', transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <span>←</span> ABORT
            </button>
            <Lobby onJoin={handleJoin} />
          </motion.div>
        )}

        {inGame && (
          <motion.div
            key="game-board"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="z-10 w-full h-screen font-mono text-sm lg:flex border-none bg-black/20 backdrop-blur-sm overflow-hidden shadow-2xl shadow-cyan-900/20"
          >
            <GameBoard roomId={roomId} playerName={playerName} socket={socket} />
          </motion.div>
        )}
      </AnimatePresence>

      {(inGame || showLobby) && (
        <div style={{
          position: 'fixed', bottom: '24px', right: '24px', zIndex: 1000,
          display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px',
          borderRadius: '9999px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.2em',
          fontFamily: 'monospace', fontWeight: 'bold', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
          border: isConnected ? '1px solid rgba(6,182,212,0.4)' : '1px solid rgba(239,68,68,0.4)',
          backgroundColor: isConnected ? 'rgba(8,145,178,0.3)' : 'rgba(153,27,27,0.3)',
          color: isConnected ? '#67e8f9' : '#f87171',
          transition: 'all 0.5s ease',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
        }}>
          <div style={{
            width: '8px', height: '8px', borderRadius: '50%',
            backgroundColor: isConnected ? '#22d3ee' : '#ef4444',
            boxShadow: isConnected ? '0 0 10px rgba(34,211,238,1)' : '0 0 10px rgba(239,68,68,1)'
          }} />
          <span>{isConnected ? 'NODE SECURED' : 'SYSTEM OFFLINE'}</span>
        </div>
      )}
    </main>
  );
}
