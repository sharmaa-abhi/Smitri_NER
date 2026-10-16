/**
 * Smitri_NER — Gentle Cognitive Game Audio Synthesizer
 * 
 * Provides soothing, harmonic auditory feedback designed specifically for elderly users:
 * - Soothing, warm frequencies (A major / E major chords, soft sine waves)
 * - Gentle attack and exponential decay to prevent startling
 * - Works offline with zero network latency via Web Audio API
 * - LocalStorage preference for sound on/off
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    if (!audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        audioCtx = new AudioCtxClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  } catch {
    return null;
  }
}

/**
 * Check if game audio is enabled (defaults to true)
 */
export function isGameAudioEnabled(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const val = localStorage.getItem('smitri_game_audio_enabled');
    return val !== 'false';
  } catch {
    return true;
  }
}

/**
 * Toggle game audio enabled state
 */
export function setGameAudioEnabled(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('smitri_game_audio_enabled', enabled ? 'true' : 'false');
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('smitri_game_audio_changed', { detail: { enabled } }));
    }
  } catch {}
}

/**
 * Play a gentle, soothing chime for correct answers or positive milestones
 */
export function playGentleSuccessSound(): void {
  if (!isGameAudioEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    // Two harmonious notes (E5 -> A5): calm, uplifting, non-startling
    const notes = [
      { freq: 659.25, start: 0, dur: 0.35, gain: 0.12 },
      { freq: 880.00, start: 0.1, dur: 0.5, gain: 0.15 },
    ];

    notes.forEach(({ freq, start, dur, gain: targetGain }) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + start);

      gainNode.gain.setValueAtTime(0.001, now + start);
      gainNode.gain.exponentialRampToValueAtTime(targetGain, now + start + 0.04);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + start + dur);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now + start);
      osc.stop(now + start + dur);
    });
  } catch {
    // Graceful fallback
  }
}

/**
 * Play a gentle, comforting cue for an incorrect tap (never harsh, buzzing, or jarring)
 */
export function playGentleRetrySound(): void {
  if (!isGameAudioEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    // Low, warm woodblock-like gentle tone (370Hz / F#4) with very soft volume
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(370, now);
    osc.frequency.exponentialRampToValueAtTime(330, now + 0.2);

    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.exponentialRampToValueAtTime(0.08, now + 0.03);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.25);
  } catch {
    // Graceful fallback
  }
}

/**
 * Play a soft tap/flip sound when interacting with cards or buttons
 */
export function playSoftTapSound(): void {
  if (!isGameAudioEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(523.25, now); // C5

    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.exponentialRampToValueAtTime(0.05, now + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.12);
  } catch {
    // Graceful fallback
  }
}

/**
 * Play celebratory completion fanfare (warm major chord arpeggio)
 */
export function playCelebrationSound(): void {
  if (!isGameAudioEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    // C major arpeggio: C5 -> E5 -> G5 -> C6
    const arpeggio = [
      { freq: 523.25, delay: 0.0 },
      { freq: 659.25, delay: 0.12 },
      { freq: 783.99, delay: 0.24 },
      { freq: 1046.50, delay: 0.36 },
    ];

    arpeggio.forEach(({ freq, delay }) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + delay);

      gainNode.gain.setValueAtTime(0.001, now + delay);
      gainNode.gain.exponentialRampToValueAtTime(0.12, now + delay + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.6);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now + delay);
      osc.stop(now + delay + 0.6);
    });
  } catch {
    // Graceful fallback
  }
}
