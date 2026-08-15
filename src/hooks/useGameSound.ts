"use client";

// Simple Web Audio API Synthesizer for Cyberpunk UI Sounds
export const useGameSound = () => {

    const playTone = (freq: number, type: OscillatorType, duration: number, volume = 0.1) => {
        if (typeof window === 'undefined') return;
        try {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = type;
            osc.frequency.setValueAtTime(freq, ctx.currentTime);

            gain.gain.setValueAtTime(volume, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + duration);
        } catch (e) {
            // Ignore if audio context is blocked before user interaction
        }
    };

    const playHover = () => playTone(800, 'square', 0.05, 0.02);
    const playClick = () => playTone(1200, 'sine', 0.1, 0.05);
    const playCard = () => {
        playTone(300, 'triangle', 0.2, 0.1);
        setTimeout(() => playTone(200, 'square', 0.3, 0.1), 50);
    };
    const playAlert = () => {
        playTone(150, 'sawtooth', 0.3, 0.1);
        setTimeout(() => playTone(150, 'sawtooth', 0.3, 0.1), 150);
    };

    return { playHover, playClick, playCard, playAlert };
};
