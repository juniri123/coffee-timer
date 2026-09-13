let audioContext: AudioContext | null = null;

export async function enableAudio(): Promise<void> {
  audioContext ??= new AudioContext();
  if (audioContext.state === "suspended") {
    await audioContext.resume();
  }
}

function tone(frequency: number, duration: number, delay = 0): void {
  if (!audioContext) return;

  const start = audioContext.currentTime + delay;
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.type = "sine";
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(0.24, start + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  oscillator.connect(gain).connect(audioContext.destination);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.02);
}

export function playPrepareSound(): void {
  tone(660, 0.09);
}

export function playTransitionSound(): void {
  tone(880, 0.12);
  tone(1175, 0.18, 0.14);
}

export function playFinishSound(): void {
  tone(784, 0.14);
  tone(988, 0.14, 0.17);
  tone(1318, 0.3, 0.34);
}
