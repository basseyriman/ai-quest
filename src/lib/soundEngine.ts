"use client";

/**
 * AI QUEST — Neural Command Audio Engine (Mobile + Desktop Optimized)
 * - Uses HTML5 <audio> silent WAV prime + WebAudio buffer unlock so iOS Safari
 *   (even with the physical Ringer/Silent switch muted) and Android Chrome
 *   play audio reliably.
 * - Tuned mid-range harmonics and gain levels so phone speakers project
 *   both the "Neural Command" soundtrack and tactical card SFX clearly.
 */

// 40ms silent PCM WAV data URI used to switch iOS AudioSession from "ambient" to "playback"
const SILENT_WAV_DATA_URI =
  "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA";

class AiQuestSoundEngine {
  private ctx: AudioContext | null = null;
  private isMusicPlaying = false;
  private musicTimer: ReturnType<typeof setInterval> | null = null;
  private stepIndex = 0;
  private unlocked = false;
  private htmlAudioPrimer: HTMLAudioElement | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      const unlockHandler = () => {
        this.unlockMobileAudio();
      };
      window.addEventListener("touchstart", unlockHandler, { passive: true, once: true });
      window.addEventListener("touchend", unlockHandler, { passive: true, once: true });
      window.addEventListener("click", unlockHandler, { passive: true, once: true });
    }
  }

  private getContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    return this.ctx;
  }

  /**
   * Unlocks Web Audio on iOS Safari & Android Chrome inside a direct user tap/click gesture.
   */
  public unlockMobileAudio(): AudioContext | null {
    const ctx = this.getContext();
    if (!ctx) return null;

    // 1. iOS 17+ AudioSession API (bypasses hardware silent switch when supported)
    try {
      const nav = navigator as unknown as {
        audioSession?: { type: string };
      };
      if (nav.audioSession) {
        nav.audioSession.type = "playback";
      }
    } catch {
      // Ignore if unsupported
    }

    // 2. Play tiny silent HTML5 <audio> element to force mobile media playback channel
    try {
      if (!this.htmlAudioPrimer) {
        this.htmlAudioPrimer = new Audio(SILENT_WAV_DATA_URI);
        this.htmlAudioPrimer.volume = 0.01;
      }
      this.htmlAudioPrimer.play().catch(() => {});
    } catch {
      // Ignore
    }

    // 3. Resume AudioContext and play a 1-frame buffer to unlock iOS WebKit
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    if (!this.unlocked) {
      try {
        const buffer = ctx.createBuffer(1, 1, 22050);
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        source.start(0);
        this.unlocked = true;
      } catch {
        // Ignore
      }
    }

    return ctx;
  }

  /**
   * Starts the "Neural Command" ambient sci-fi strategy soundtrack.
   * Voiced with rich mid-range harmonics so both phone speakers and desktop speakers sound full.
   */
  public startMusic() {
    if (this.isMusicPlaying) return;
    const ctx = this.unlockMobileAudio();
    if (!ctx) return;

    this.isMusicPlaying = true;
    this.stepIndex = 0;

    // 4-chord progression (Dm9 -> Bbmaj7 -> Gm9 -> Asus4/A7)
    // Bass notes include 2nd harmonic (110Hz-220Hz range) so phone speakers reproduce the bassline clearly
    const chords = [
      {
        bass: 146.83, // D3
        pad: [293.66, 349.23, 440.0, 523.25],
        arp: [293.66, 349.23, 440.0, 523.25, 659.25, 523.25, 440.0, 349.23],
      },
      {
        bass: 116.54, // Bb2
        pad: [233.08, 293.66, 349.23, 440.0],
        arp: [233.08, 349.23, 440.0, 523.25, 587.33, 523.25, 440.0, 349.23],
      },
      {
        bass: 196.0, // G3
        pad: [233.08, 293.66, 392.0, 440.0],
        arp: [196.0, 293.66, 349.23, 440.0, 587.33, 440.0, 349.23, 293.66],
      },
      {
        bass: 110.0, // A2
        pad: [220.0, 293.66, 329.63, 392.0],
        arp: [220.0, 329.63, 392.0, 440.0, 659.25, 587.33, 440.0, 329.63],
      },
    ];

    const triggerStep = () => {
      if (!this.isMusicPlaying) return;
      const audio = this.getContext();
      if (!audio) return;

      if (audio.state === "suspended") {
        audio.resume().catch(() => {});
      }

      const chordIdx = Math.floor(this.stepIndex / 8) % chords.length;
      const beatInBar = this.stepIndex % 8;
      const currentChord = chords[chordIdx];
      const now = audio.currentTime + 0.02;

      // 1. On Beat 0 of each bar: Warm analog synth pad + audible mid-bass pulse
      if (beatInBar === 0) {
        this.playAmbientPad(audio, currentChord.pad, 3.6, now);
        this.playDeepSubBass(audio, currentChord.bass, 3.4, now);
      }

      // 2. Crystalline neural pulse arpeggio on every step (audibly balanced for phone speakers)
      const arpFreq = currentChord.arp[beatInBar];
      if (arpFreq) {
        this.playNeuralArpNote(
          audio,
          arpFreq,
          now,
          beatInBar % 2 === 0 ? 0.09 : 0.06
        );
      }

      this.stepIndex++;
    };

    // Play an immediate confirmation chord + start loop after context resumes
    if (ctx.state === "suspended") {
      ctx
        .resume()
        .then(() => {
          triggerStep();
        })
        .catch(() => {
          triggerStep();
        });
    } else {
      triggerStep();
    }

    this.musicTimer = setInterval(triggerStep, 430);
  }

  public stopMusic() {
    this.isMusicPlaying = false;
    if (this.musicTimer) {
      clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
  }

  public getMusicState(): boolean {
    return this.isMusicPlaying;
  }

  private playAmbientPad(
    ctx: AudioContext,
    freqs: number[],
    duration: number,
    startTime: number
  ) {
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(900, startTime);
    filter.frequency.linearRampToValueAtTime(1600, startTime + duration * 0.5);
    filter.frequency.linearRampToValueAtTime(800, startTime + duration);

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.001, startTime);
    masterGain.gain.linearRampToValueAtTime(0.075, startTime + 0.8);
    masterGain.gain.setValueAtTime(0.075, startTime + duration - 0.9);
    masterGain.gain.linearRampToValueAtTime(0.0001, startTime + duration);

    filter.connect(masterGain);
    masterGain.connect(ctx.destination);

    freqs.forEach((f, idx) => {
      const osc = ctx.createOscillator();
      osc.type = idx % 2 === 0 ? "triangle" : "sine";
      osc.detune.setValueAtTime(idx % 2 === 0 ? -5 : 5, startTime);
      osc.frequency.setValueAtTime(f, startTime);
      osc.connect(filter);
      osc.start(startTime);
      osc.stop(startTime + duration + 0.05);
    });
  }

  private playDeepSubBass(
    ctx: AudioContext,
    freq: number,
    duration: number,
    startTime: number
  ) {
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(freq, startTime);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(420, startTime);

    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.linearRampToValueAtTime(0.095, startTime + 0.25);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.05);
  }

  private playNeuralArpNote(
    ctx: AudioContext,
    freq: number,
    startTime: number,
    peakGain: number
  ) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.linearRampToValueAtTime(peakGain, startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.38);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + 0.4);
  }

  /**
   * Rich Tactical Sound Effects (SFX) — Boosted for mobile speaker clarity
   */
  public playSfx(
    type:
      | "deal"
      | "draw"
      | "valid_play"
      | "stage_advance"
      | "challenge_alert"
      | "challenge_win"
      | "challenge_fail"
      | "victory"
      | "click"
  ) {
    const ctx = this.unlockMobileAudio();
    if (!ctx) return;

    const executeSfx = () => {
      const now = ctx.currentTime + 0.01;

      switch (type) {
        case "click": {
          this.triggerNote(ctx, 660, "triangle", now, 0.09, 0.14);
          break;
        }
        case "draw": {
          this.triggerNote(ctx, 440, "triangle", now, 0.12, 0.16);
          this.triggerNote(ctx, 659.25, "triangle", now + 0.055, 0.16, 0.16);
          break;
        }
        case "deal": {
          [392.0, 523.25, 659.25].forEach((f, i) => {
            this.triggerNote(ctx, f, "triangle", now + i * 0.06, 0.14, 0.15);
          });
          break;
        }
        case "valid_play": {
          this.triggerNote(ctx, 523.25, "triangle", now, 0.18, 0.18);
          this.triggerNote(ctx, 659.25, "triangle", now + 0.06, 0.22, 0.18);
          this.triggerNote(ctx, 783.99, "triangle", now + 0.12, 0.3, 0.16);
          break;
        }
        case "stage_advance": {
          [440.0, 554.37, 659.25, 880.0].forEach((f, i) => {
            this.triggerNote(ctx, f, "triangle", now + i * 0.06, 0.3, 0.18);
          });
          break;
        }
        case "challenge_alert": {
          this.triggerNote(ctx, 587.33, "sawtooth", now, 0.14, 0.15);
          this.triggerNote(ctx, 440.0, "sawtooth", now + 0.14, 0.2, 0.15);
          break;
        }
        case "challenge_win": {
          [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
            this.triggerNote(ctx, f, "triangle", now + i * 0.055, 0.28, 0.2);
          });
          break;
        }
        case "challenge_fail": {
          this.triggerNote(ctx, 246.94, "sawtooth", now, 0.18, 0.18);
          this.triggerNote(ctx, 174.61, "sawtooth", now + 0.15, 0.3, 0.18);
          break;
        }
        case "victory": {
          const fanfare = [
            { f: 523.25, t: 0.0, d: 0.2 },
            { f: 659.25, t: 0.12, d: 0.2 },
            { f: 783.99, t: 0.24, d: 0.25 },
            { f: 1046.5, t: 0.38, d: 0.65 },
            { f: 783.99, t: 0.38, d: 0.65 },
            { f: 523.25, t: 0.38, d: 0.65 },
          ];
          fanfare.forEach((n) => {
            this.triggerNote(ctx, n.f, "triangle", now + n.t, n.d, 0.18);
          });
          break;
        }
      }
    };

    if (ctx.state === "suspended") {
      ctx
        .resume()
        .then(executeSfx)
        .catch(executeSfx);
    } else {
      executeSfx();
    }
  }

  private triggerNote(
    ctx: AudioContext,
    freq: number,
    type: OscillatorType,
    startTime: number,
    duration: number,
    peakGain: number
  ) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.linearRampToValueAtTime(peakGain, startTime + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.02);
  }
}

export const soundEngine = new AiQuestSoundEngine();
