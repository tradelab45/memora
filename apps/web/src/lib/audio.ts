"use client";

/**
 * Procedural Web Audio API sound synthesizer for MEMORA.
 * Uses no external assets or network calls. Sounds remain off until requested.
 */

let audioCtx: AudioContext | null = null;
// Audio is an explicit, session-only choice. Visiting or scrolling never enables it.
let soundEnabled = false;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    void audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function isSoundEnabled(): boolean {
  return soundEnabled;
}

export function setSoundEnabled(enabled: boolean): void {
  soundEnabled = enabled;
}

export function toggleSound(): boolean {
  soundEnabled = !soundEnabled;
  return soundEnabled;
}

/**
 * Synthesizes the delicate, tactile whisper of turning fine book paper.
 * Uses shaped white noise with a bandpass filter and smooth exponential decay.
 */
export function playPaperRustle(): void {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const sampleRate = ctx.sampleRate;
    const duration = 0.22; // 220ms
    const bufferSize = Math.floor(sampleRate * duration);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, sampleRate);
    const output = noiseBuffer.getChannelData(0);

    // Generate white noise with soft organic variation
    for (let i = 0; i < bufferSize; i++) {
      output[i] =
        (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    // Resonant bandpass filter to mimic paper friction
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(1400, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(
      750,
      ctx.currentTime + duration,
    );
    filter.Q.setValueAtTime(1.8, ctx.currentTime);

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.001, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.09, ctx.currentTime + 0.04);
    gainNode.gain.exponentialRampToValueAtTime(
      0.0001,
      ctx.currentTime + duration,
    );

    whiteNoise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);
    whiteNoise.onended = () => {
      whiteNoise.disconnect();
      filter.disconnect();
      gainNode.disconnect();
    };

    whiteNoise.start();
  } catch {
    // Gracefully ignore audio errors (e.g. autoplay policies)
  }
}

/**
 * Synthesizes a soft, warm wooden/leather click for tactile UI interactions.
 */
export function playSubtleClick(): void {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(420, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.035);

    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.onended = () => {
      osc.disconnect();
      gain.disconnect();
    };

    osc.start();
    osc.stop(ctx.currentTime + 0.045);
  } catch {
    // Graceful fallback
  }
}

/**
 * Synthesizes a delicate, harmonic ambient chime when opening the book.
 */
export function playAmbientChime(): void {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const freqs = [528, 792, 1056]; // Harmonics in key of C/G
    const now = ctx.currentTime;

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);

      const delay = idx * 0.04;
      gain.gain.setValueAtTime(0.0001, now + delay);
      gain.gain.linearRampToValueAtTime(0.03 / (idx + 1), now + delay + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.00001, now + delay + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.onended = () => {
        osc.disconnect();
        gain.disconnect();
      };

      osc.start(now + delay);
      osc.stop(now + delay + 0.85);
    });
  } catch {
    // Graceful fallback
  }
}

/**
 * Synthesizes the tactile, warm drop of a phonograph needle landing in a vinyl groove.
 */
export function playVinylNeedleDrop(): void {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // 1. Gentle low thud of needle contact
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(110, now);
    osc.frequency.exponentialRampToValueAtTime(35, now + 0.05);

    oscGain.gain.setValueAtTime(0.08, now);
    oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.07);

    // 2. Micro-burst of surface groove friction
    const sampleRate = ctx.sampleRate;
    const duration = 0.12;
    const bufferSize = Math.floor(sampleRate * duration);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(800, now + 0.02);
    filter.Q.setValueAtTime(1.2, now + 0.02);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.04, now + 0.02);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + duration + 0.02);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    noise.start(now + 0.02);
  } catch {
    // Graceful fallback
  }
}

/**
 * Synthesizes a warm, nostalgic acoustic snippet simulating an audio keepsake note.
 */
export function playVoiceMemoKeep(): void {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    // A sequence of warm, nostalgic Kalimba-like notes: A3, C#4, E4, A4
    const notes = [220, 277.18, 329.63, 440];
    const now = ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + idx * 0.16);

      const start = now + idx * 0.16;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.linearRampToValueAtTime(0.05, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.00001, start + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + 0.65);
    });
  } catch {
    // Graceful fallback
  }
}

