import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { Buffer } from 'node:buffer';

const RATE = 22050;
const TAU = Math.PI * 2;
const OUT = new URL('../assets/sounds/', import.meta.url);
mkdirSync(OUT, { recursive: true });

// All tones are original additive sine synthesis, gently enveloped and peak limited.
function tone(t, start, duration, fromHz, toHz = fromHz, gain = 1, harmonics = [1, 0.18, 0.07]) {
  const local = t - start;
  if (local < 0 || local >= duration) return 0;
  const attack = Math.min(1, local / Math.min(0.018, duration * 0.22));
  const decay = Math.pow(1 - local / duration, 1.7);
  const phase = TAU * (fromHz * local + (toHz - fromHz) * local * local / (2 * duration));
  return gain * attack * decay * harmonics.reduce((sum, weight, index) => sum + weight * Math.sin(phase * (index + 1)), 0) / harmonics.reduce((a, b) => a + b, 0);
}

function wav(name, duration, sample) {
  const frames = Math.round(duration * RATE);
  const dataSize = frames * 2;
  const buffer = Buffer.alloc(44 + dataSize);
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVEfmt ', 8);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(RATE, 24);
  buffer.writeUInt32LE(RATE * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);
  const raw = Array.from({ length: frames }, (_, i) => sample(i / RATE));
  const peak = Math.max(1e-9, ...raw.map(Math.abs));
  const scale = Math.min(1, 0.25 / peak); // At most -12 dBFS; never clips.
  raw.forEach((value, i) => buffer.writeInt16LE(Math.round(value * scale * 32767), 44 + i * 2));
  writeFileSync(join(OUT.pathname, `${name}.wav`), buffer);
}

wav('correct', 0.25, t => tone(t, 0, 0.15, 660) + tone(t, 0.105, 0.145, 880));
wav('try', 0.18, t => tone(t, 0, 0.18, 330, 290, 0.7, [1, 0.08]));
wav('reward', 0.9, t => [523, 659, 784, 1047].reduce((sum, hz, i) => sum + tone(t, i * 0.16, 0.36, hz, hz, 0.7), 0));
wav('flip', 0.08, t => tone(t, 0, 0.08, 470, 350, 0.55, [1, 0.12]));
wav('tap', 0.04, t => tone(t, 0, 0.04, 720, 560, 0.28, [1, 0.08]));
wav('star', 0.4, t => tone(t, 0, 0.36, 900, 1480, 0.65) + tone(t, 0.09, 0.30, 1350, 1950, 0.18));
