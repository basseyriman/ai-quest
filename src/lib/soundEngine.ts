"use client";

/**
 * AI QUEST — Neural Command Audio Engine
 * Studio-grade Web Audio API Synthesizer for:
 * 1. "NEURAL COMMAND" Ambient Sci-Fi Strategy Soundtrack (Cyber-Orchestral Pads + Arpeggiator + Deep Sub)
 * 2. Tactical Card & Pipeline Sound Effects (SFX)
 */

class AiQuestSoundEngine {
  private ctx: AudioContext | null = null;
  private isMusicPlaying = false;
  private musicTimer: ReturnType<typeof setInterval> | null = null;
  private stepIndex = 0;

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
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  /**
   * Starts the "Neural Command" ambient sci-fi strategy soundtrack.
   * D-Minor / Bb-Major7 / Gm9 / A7sus4 progression inspired by Tron: Legacy & Stellaris.
   */
  public startMusic() {
    if (this.isMusicPlaying) return;
    const ctx = this.getContext();
    if (!ctx) return;

    this.isMusicPlaying = true;
    this.stepIndex = 0;

    // 4-chord progression (each chord lasts 8 steps of 450ms = 3.6s per bar)
    const chords = [
      // Dm9: D2 sub, A3, C4, E4, F4
      { bass: 73.42, pad: [220.0, 261.63, 329.63, 349.23], arp: [293.66, 349.23, 440.0, 523.25, 659.25, 523.25, 440.0, 349.23] },
      // Bbmaj7(#11): Bb1 sub, A3, C4, D4, F4
      { bass: 58.27, pad: [220.0, 261.63, 293.66, 349.23], arp: [233.08, 349.23, 440.0, 523.25, 587.33, 523.25, 440.0, 349.23] },
      // Gm9: G1 sub, Bb3, D4, F4, A4
      { bass: 49.0, pad: [233.08, 293.66, 349.23, 440.0], arp: [196.0, 293.66, 349.23, 440.0, 587.33, 440.0, 349.23, 293.66] },
      // Asus4 -> A7: A1 sub, A3, D4, E4, G4
      { bass: 55.0, pad: [220.0, 293.66, 329.63, 392.0], arp: [220.0, 329.63, 392.0, 440.0, 659.25, 587.33, 440.0, 329.63] },
    ];

    const triggerStep = () => {
      if (!this.isMusicPlaying) return;
      const audio = this.getContext();
      if (!audio) return;

      const chordIdx = Math.floor(this.stepIndex / 8) % chords.length;
      const beatInBar = this.stepIndex % 8;
      const currentChord = chords[chordIdx];
      const now = audio.currentTime;

      // 1. On Beat 0 of each bar: Warm lush analog pad + deep sub bass swell
      if (beatInBar === 0) {
        this.playAmbientPad(audio, currentChord.pad, 3.8, now);
        this.playDeepSubBass(audio, currentChord.bass, 3.6, now);
      }

      // 2. Subtle crystalline neural pulse arpeggio on every step
      const arpFreq = currentChord.arp[beatInBar];
      if (arpFreq) {
        this.playNeuralArpNote(audio, arpFreq, now, beatInBar % 2 === 0 ? 0.022 : 0.014);
      }

      this.stepIndex++;
    };

    triggerStep();
    this.musicTimer = setInterval(triggerStep, 450);
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
    filter.frequency.setValueAtTime(650, startTime);
    filter.frequency.linearRampToValueAtTime(1100, startTime + duration * 0.5);
    filter.frequency.linearRampToValueAtTime(550, startTime + duration);

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.001, startTime);
    masterGain.gain.linearRampToValueAtTime(0.028, startTime + 1.1);
    masterGain.gain.setValueAtTime(0.028, startTime + duration - 1.2);
    masterGain.gain.linearRampToValueAtTime(0.0001, startTime + duration);

    filter.connect(masterGain);
    masterGain.connect(ctx.destination);

    freqs.forEach((f, idx) => {
      const osc = ctx.createOscillator();
      osc.type = idx % 2 === 0 ? "sine" : "triangle";
      // Slight detune for lush stereo-like chorus warmth
      osc.detune.setValueAtTime(idx % 2 === 0 ? -4 : 4, startTime);
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
    filter.frequency.setValueAtTime(160, startTime);

    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.linearRampToValueAtTime(0.045, startTime + 0.4);
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

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.linearRampToValueAtTime(peakGain, startTime + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.42);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + 0.44);
  }

  /**
   * Rich Tactical Sound Effects (SFX)
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
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    switch (type) {
      case "click": {
        this.triggerNote(ctx, 660, "sine", now, 0.08, 0.04);
        break;
      }
      case "draw": {
        // Crisp futuristic card draw shimmer
        this.triggerNote(ctx, 440, "triangle", now, 0.1, 0.045);
        this.triggerNote(ctx, 659.25, "sine", now + 0.05, 0.14, 0.045);
        break;
      }
      case "deal": {
        // Cascade of 3 quick cyber-cards dealing
        [392.0, 523.25, 659.25].forEach((f, i) => {
          this.triggerNote(ctx, f, "triangle", now + i * 0.055, 0.12, 0.045);
        });
        break;
      }
      case "valid_play": {
        // Harmonious cyan pipeline node lock-in (D-minor add9 upward chime)
        this.triggerNote(ctx, 523.25, "sine", now, 0.18, 0.06);
        this.triggerNote(ctx, 659.25, "sine", now + 0.06, 0.22, 0.06);
        this.triggerNote(ctx, 783.99, "triangle", now + 0.12, 0.28, 0.05);
        break;
      }
      case "stage_advance": {
        // Rising 4-note stage unlock power-up chord
        [440.0, 554.37, 659.25, 880.0].forEach((f, i) => {
          this.triggerNote(ctx, f, "triangle", now + i * 0.06, 0.28, 0.065);
        });
        break;
      }
      case "challenge_alert": {
        // Two-tone tactical peer-audit sonar warning
        this.triggerNote(ctx, 587.33, "sawtooth", now, 0.12, 0.045);
        this.triggerNote(ctx, 440.0, "sawtooth", now + 0.13, 0.18, 0.045);
        break;
      }
      case "challenge_win": {
        // High-energy audit catch triumph chord
        [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
          this.triggerNote(ctx, f, "triangle", now + i * 0.05, 0.26, 0.07);
        });
        break;
      }
      case "challenge_fail": {
        // Rejected card / penalty power-down buzz
        this.triggerNote(ctx, 220.0, "sawtooth", now, 0.18, 0.06);
        this.triggerNote(ctx, 146.83, "sawtooth", now + 0.14, 0.28, 0.06);
        break;
      }
      case "victory": {
        // Grand Stage 7 Deployment + Milestone Unlocked Fanfare
        const fanfare = [
          { f: 523.25, t: 0.0, d: 0.2 },
          { f: 659.25, t: 0.12, d: 0.2 },
          { f: 783.99, t: 0.24, d: 0.25 },
          { f: 1046.5, t: 0.38, d: 0.65 },
          { f: 783.99, t: 0.38, d: 0.65 },
          { f: 523.25, t: 0.38, d: 0.65 },
        ];
        fanfare.forEach((n) => {
          this.triggerNote(ctx, n.f, "triangle", now + n.t, n.d, 0.07);
        });
        break;
      }
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
