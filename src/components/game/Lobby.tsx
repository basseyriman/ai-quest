"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';

interface LobbyProps {
    onJoin: (name: string, roomId: string) => void;
}

export const Lobby = ({ onJoin }: LobbyProps) => {
    const [name, setName] = useState('');
    const [roomId, setRoomId] = useState('');
    const [mode, setMode] = useState<'choose' | 'multiplayer'>('choose');
    const [isFocused, setIsFocused] = useState<'name' | 'room' | null>(null);

    const handleJoin = () => {
        if (name && roomId) {
            const prefix = 'ENG-';
            let finalRoomId = roomId.toUpperCase();
            if (!finalRoomId.startsWith('ENG-')) {
                finalRoomId = `${prefix}${finalRoomId}`;
            }
            onJoin(name, finalRoomId);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', minHeight: '100vh', zIndex: 20, position: 'relative', fontFamily: 'sans-serif', color: 'white', overflow: 'hidden', padding: '24px', boxSizing: 'border-box' }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9, filter: 'blur(20px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                style={{ width: '100%', maxWidth: '650px', zIndex: 10, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}
            >
                {/* Premium Glass Terminal */}
                <div style={{ width: '100%', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', backgroundColor: 'rgba(2,2,5,0.95)', border: '1px solid rgba(6,182,212,0.4)', borderRadius: '24px', padding: '48px', boxShadow: '0 0 100px rgba(0,0,0,0.8), inset 0 0 40px rgba(6,182,212,0.1)', position: 'relative', display: 'flex', flexDirection: 'column', flexShrink: 0, zIndex: 20 }}>

                    {/* Corner accents */}
                    <div style={{ position: 'absolute', top: '-2px', left: '-2px', width: '48px', height: '48px', borderTop: '2px solid #06b6d4', borderLeft: '2px solid #06b6d4', borderTopLeftRadius: '24px', boxShadow: '0 0 15px rgba(6,182,212,0.5)', pointerEvents: 'none' }} />
                    <div style={{ position: 'absolute', top: '-2px', right: '-2px', width: '48px', height: '48px', borderTop: '2px solid #06b6d4', borderRight: '2px solid #06b6d4', borderTopRightRadius: '24px', boxShadow: '0 0 15px rgba(6,182,212,0.5)', pointerEvents: 'none' }} />
                    <div style={{ position: 'absolute', bottom: '-2px', left: '-2px', width: '48px', height: '48px', borderBottom: '2px solid #06b6d4', borderLeft: '2px solid #06b6d4', borderBottomLeftRadius: '24px', boxShadow: '0 0 15px rgba(6,182,212,0.5)', pointerEvents: 'none' }} />
                    <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', width: '48px', height: '48px', borderBottom: '2px solid #06b6d4', borderRight: '2px solid #06b6d4', borderBottomRightRadius: '24px', boxShadow: '0 0 15px rgba(6,182,212,0.5)', pointerEvents: 'none' }} />

                    {/* Header Area */}
                    <div style={{ textAlign: 'center', marginBottom: '40px', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, zIndex: 30, pointerEvents: 'none', userSelect: 'none' }}>
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3, duration: 1 }}
                            style={{ position: 'relative', display: 'flex', justifyContent: 'center', width: '300px' }}
                        >
                            <img
                                src="/ai_quest_logo_clean.png"
                                alt="AI QUEST"
                                style={{ width: '100%', height: 'auto', filter: 'drop-shadow(0 0 30px rgba(6,182,212,0.8))', zIndex: 10, display: 'block' }}
                            />
                            {/* Logo Backglow */}
                            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%', height: '80px', backgroundColor: 'rgba(8,145,178,0.3)', filter: 'blur(50px)', borderRadius: '50%' }} />
                        </motion.div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginTop: '32px' }}>
                            <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, #06b6d4)', width: '48px' }} />
                            <p style={{ color: '#22d3ee', fontSize: '14px', letterSpacing: '0.4em', textTransform: 'uppercase', fontWeight: 'bold', textShadow: '0 0 10px rgba(34,211,238,0.5)' }}>BUILD. TRAIN. DEPLOY.</p>
                            <div style={{ height: '1px', background: 'linear-gradient(to left, transparent, #06b6d4)', width: '48px' }} />
                        </div>
                    </div>

                    {/* Input Area */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative', zIndex: 40, width: '100%', flexShrink: 0, minHeight: '200px' }}>
                        {mode === 'choose' ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', position: 'relative', zIndex: 50 }}>
                                <button
                                    onClick={() => {
                                        const prefix = 'SP-ENG-';
                                        onJoin(name || "SOLO OPERATOR", `${prefix}${Math.floor(Math.random() * 10000)}`);
                                    }}
                                    style={{ position: 'relative', width: '100%', borderRadius: '12px', border: '1px solid rgba(6,182,212,0.5)', boxShadow: '0 0 20px rgba(34,211,238,0.1)', cursor: 'pointer', overflow: 'hidden', padding: '0', backgroundColor: 'transparent' }}
                                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(34,211,238,1)'; (e.currentTarget.children[0] as HTMLElement).style.backgroundColor = 'rgba(8,145,178,0.6)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(6,182,212,0.5)'; (e.currentTarget.children[0] as HTMLElement).style.backgroundColor = 'rgba(8,145,178,0.4)'; }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(8,145,178,0.4)', padding: '24px', transition: 'background-color 0.3s ease' }}>
                                        <span style={{ color: 'white', letterSpacing: '0.3em', textTransform: 'uppercase', fontWeight: 'bold', fontSize: '18px' }}>Single Player (vs AI)</span>
                                    </div>
                                </button>

                                <button
                                    onClick={() => setMode('multiplayer')}
                                    style={{ position: 'relative', width: '100%', borderRadius: '12px', border: '1px solid rgba(168,85,247,0.5)', boxShadow: '0 0 20px rgba(168,85,247,0.1)', cursor: 'pointer', overflow: 'hidden', padding: '0', backgroundColor: 'transparent' }}
                                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(192,132,252,1)'; (e.currentTarget.children[0] as HTMLElement).style.backgroundColor = 'rgba(88,28,135,0.6)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(168,85,247,0.5)'; (e.currentTarget.children[0] as HTMLElement).style.backgroundColor = 'rgba(88,28,135,0.4)'; }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(88,28,135,0.4)', padding: '24px', transition: 'background-color 0.3s ease' }}>
                                        <span style={{ color: 'white', letterSpacing: '0.3em', textTransform: 'uppercase', fontWeight: 'bold', fontSize: '18px' }}>Multiplayer Match</span>
                                    </div>
                                </button>

                                <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                                    <label style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace', textAlign: 'center', marginBottom: '8px' }}>Operative ID (Optional)</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value.toUpperCase())}
                                        style={{ width: '100%', backgroundColor: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px', textAlign: 'center', color: 'white', outline: 'none', fontFamily: 'monospace', letterSpacing: '0.2em', fontSize: '16px', boxSizing: 'border-box' }}
                                        onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(6,182,212,0.5)'; e.currentTarget.style.backgroundColor = 'rgba(8,145,178,0.3)'; }}
                                        onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.4)'; }}
                                        placeholder="ENTER ALIAS"
                                        maxLength={16}
                                        spellCheck={false}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
                                {/* Name Input */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', flexShrink: 0, position: 'relative', zIndex: 50 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '0 4px' }}>
                                        <label style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#22d3ee', fontFamily: 'monospace', fontWeight: 'bold' }}>1. Operative ID</label>
                                        {isFocused === 'name' && <span style={{ fontSize: '10px', color: '#67e8f9', fontFamily: 'monospace', fontWeight: 'bold', animation: 'pulse 2s infinite' }}>AWAITING INPUT...</span>}
                                    </div>
                                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', transition: 'all 0.3s ease', borderRadius: '12px', overflow: 'hidden', border: isFocused === 'name' ? '1px solid #22d3ee' : '1px solid rgba(255,255,255,0.2)', backgroundColor: isFocused === 'name' ? 'rgba(8,145,178,0.6)' : 'black', boxShadow: isFocused === 'name' ? '0 0 30px rgba(6,182,212,0.3)' : 'none' }}>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value.toUpperCase())}
                                            onFocus={() => setIsFocused('name')}
                                            onBlur={() => setIsFocused(null)}
                                            style={{ width: '100%', backgroundColor: 'transparent', padding: '24px', color: 'white', outline: 'none', border: 'none', fontFamily: 'monospace', letterSpacing: '0.2em', fontSize: '20px', position: 'relative', zIndex: 20, minHeight: '60px', boxSizing: 'border-box', textAlign: 'center' }}
                                            placeholder="ENTER ALIAS"
                                            maxLength={16}
                                        />
                                        <div style={{ position: 'absolute', bottom: '0', left: '0', height: '2px', backgroundColor: '#22d3ee', transition: 'all 0.5s ease', pointerEvents: 'none', zIndex: 30, width: isFocused === 'name' ? '100%' : '0', opacity: isFocused === 'name' ? 1 : 0 }} />
                                    </div>
                                </div>

                                {/* Room Input */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', flexShrink: 0, position: 'relative', zIndex: 50 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '0 4px' }}>
                                        <label style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#c084fc', fontFamily: 'monospace', fontWeight: 'bold' }}>2. Target Server</label>
                                        {isFocused === 'room' && <span style={{ fontSize: '10px', color: '#d8b4fe', fontFamily: 'monospace', fontWeight: 'bold', animation: 'pulse 2s infinite' }}>LOCATING NODE...</span>}
                                    </div>
                                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', transition: 'all 0.3s ease', borderRadius: '12px', overflow: 'hidden', border: isFocused === 'room' ? '1px solid #c084fc' : '1px solid rgba(255,255,255,0.2)', backgroundColor: isFocused === 'room' ? 'rgba(88,28,135,0.6)' : 'black', boxShadow: isFocused === 'room' ? '0 0 30px rgba(168,85,247,0.3)' : 'none' }}>
                                        <input
                                            type="text"
                                            value={roomId}
                                            onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                                            onFocus={() => setIsFocused('room')}
                                            onBlur={() => setIsFocused(null)}
                                            style={{ width: '100%', backgroundColor: 'transparent', padding: '24px', color: 'white', outline: 'none', border: 'none', fontFamily: 'monospace', letterSpacing: '0.2em', fontSize: '20px', position: 'relative', zIndex: 20, minHeight: '60px', boxSizing: 'border-box', textAlign: 'center' }}
                                            placeholder="ENTER ROOM CODE"
                                            maxLength={12}
                                        />
                                        <div style={{ position: 'absolute', bottom: '0', left: '0', height: '2px', backgroundColor: '#c084fc', transition: 'all 0.5s ease', pointerEvents: 'none', zIndex: 30, width: isFocused === 'room' ? '100%' : '0', opacity: isFocused === 'room' ? 1 : 0 }} />
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '16px', width: '100%', paddingTop: '16px' }}>
                                    <button
                                        onClick={() => setMode('choose')}
                                        style={{ width: '33%', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', backgroundColor: 'transparent', color: 'rgba(255,255,255,0.5)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 'bold', padding: '16px', cursor: 'pointer', transition: 'all 0.3s ease' }}
                                        onMouseEnter={(e) => { e.currentTarget.style.color = 'white'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleJoin}
                                        disabled={!name || !roomId}
                                        style={{ flex: 1, position: 'relative', overflow: 'hidden', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', cursor: (!name || !roomId) ? 'not-allowed' : 'pointer', opacity: (!name || !roomId) ? 0.4 : 1, padding: '0', backgroundColor: 'transparent' }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.8)', padding: '16px', width: '100%', height: '100%', boxSizing: 'border-box' }}
                                             onMouseEnter={(e) => { if (name && roomId) e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.4)'; }}
                                             onMouseLeave={(e) => { if (name && roomId) e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.8)'; }}
                                        >
                                            <span style={{ color: 'white', letterSpacing: '0.4em', textTransform: 'uppercase', fontWeight: 'bold', fontSize: '18px' }}>DEPLOY PROTOCOL</span>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Decorative Bottom Elements */}
                <div style={{ position: 'absolute', bottom: '-64px', left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: '48px', opacity: 0.8, pointerEvents: 'none', userSelect: 'none', zIndex: 0 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                        <div style={{ width: '4px', height: '16px', backgroundColor: 'rgba(255,255,255,0.3)' }} />
                        <span style={{ fontSize: '10px', fontFamily: 'monospace', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.5)' }}>SYS.01</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                        <div style={{ width: '6px', height: '24px', backgroundColor: '#22d3ee', boxShadow: '0 0 10px rgba(34,211,238,0.8)', animation: 'pulse 2s infinite' }} />
                        <span style={{ fontSize: '10px', fontFamily: 'monospace', letterSpacing: '0.2em', color: '#22d3ee', fontWeight: 'bold' }}>NET.ON</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                        <div style={{ width: '4px', height: '16px', backgroundColor: 'rgba(255,255,255,0.3)' }} />
                        <span style={{ fontSize: '10px', fontFamily: 'monospace', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.5)' }}>SEC.OK</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
