/**
 * Utilitário de Áudio Synth para Hackers do Bem
 * Gera sons eletrônicos sem necessidade de arquivos externos.
 */

const ctx = new (window.AudioContext || window.webkitAudioContext)();

const playTone = (freq, type, duration, volume = 0.1) => {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime);

  gain.gain.setValueAtTime(volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + duration);
};

export const playSuccess = () => {
  playTone(440, 'sine', 0.2);
  setTimeout(() => playTone(880, 'sine', 0.3), 100);
};

export const playError = () => {
  playTone(220, 'square', 0.3, 0.05);
  setTimeout(() => playTone(110, 'square', 0.4, 0.05), 150);
};

export const playTick = () => {
  playTone(1200, 'sine', 0.05, 0.02);
};

export const playBadge = () => {
  [523.25, 659.25, 783.99, 1046.50].forEach((f, i) => {
    setTimeout(() => playTone(f, 'sine', 0.4), i * 150);
  });
};
