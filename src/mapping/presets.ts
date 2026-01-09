import type { Row } from "./types";

export type PresetId = "pca_basic" | "energy_gate" | "cluster_rhythm";

export type MappingPreset = {
  id: PresetId;
  name: string;
  description: string;
  map: (
    rows: Row[],
    stepCount: number
  ) => {
    kickSteps: boolean[];
    chordSteps: boolean[];
  };
};

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

function normToIndex(v: number, stepCount: number) {
  // Accepts roughly -1..1 or 0..1, clamp and map
  // If input is already 0..1 it still works.
  const n = clamp01((v + 1) / 2);
  return Math.min(stepCount - 1, Math.max(0, Math.floor(n * stepCount)));
}

function hashInt(n: number) {
  // deterministic-ish small hash for cluster rhythm variety
  let x = n | 0;
  x = x ^ 61 ^ (x >>> 16);
  x = x + (x << 3);
  x = x ^ (x >>> 4);
  x = x * 0x27d4eb2d;
  x = x ^ (x >>> 15);
  return x >>> 0;
}

export const PRESETS: MappingPreset[] = [
  {
    id: "pca_basic",
    name: "PCA Basic",
    description:
      "Kick from x buckets, chord from y buckets. Energy adds extra hits.",
    map: (rows, stepCount) => {
      const kickSteps = Array(stepCount).fill(false) as boolean[];
      const chordSteps = Array(stepCount).fill(false) as boolean[];

      for (const r of rows) {
        const k = normToIndex(r.x, stepCount);
        const c = normToIndex(r.y, stepCount);

        // base mapping
        kickSteps[k] = true;
        chordSteps[c] = true;

        // energy “sparkle”: if high energy, add a second chord hit
        const e = clamp01(r.energy);
        if (e > 0.75) {
          chordSteps[(c + 1) % stepCount] = true;
        }
      }

      return { kickSteps, chordSteps };
    },
  },
  {
    id: "energy_gate",
    name: "Energy Gate",
    description:
      "Kick hits where energy crosses a threshold, chords on downbeats when energy is high.",
    map: (rows, stepCount) => {
      const kickSteps = Array(stepCount).fill(false) as boolean[];
      const chordSteps = Array(stepCount).fill(false) as boolean[];

      // Reduce dataset to stepCount buckets by t or index
      const buckets = bucketize(rows, stepCount);

      for (let i = 0; i < stepCount; i++) {
        const e = clamp01(buckets[i]?.energy ?? 0);

        // Kick when energy is above threshold
        if (e > 0.55) kickSteps[i] = true;

        // Chords: emphasize downbeats, but only if energy is high
        const isDownbeat = i % 4 === 0;
        if (isDownbeat && e > 0.65) chordSteps[i] = true;

        // Add a little syncopation at very high energy
        if (e > 0.85) chordSteps[(i + 2) % stepCount] = true;
      }

      return { kickSteps, chordSteps };
    },
  },
  {
    id: "cluster_rhythm",
    name: "Cluster Rhythm",
    description:
      "Clusters pick a rhythmic mask, x/y decide rotation and density.",
    map: (rows, stepCount) => {
      const kickSteps = Array(stepCount).fill(false) as boolean[];
      const chordSteps = Array(stepCount).fill(false) as boolean[];

      // Pick a “dominant” cluster by simple count
      const counts = new Map<number, number>();
      for (const r of rows)
        counts.set(r.cluster, (counts.get(r.cluster) ?? 0) + 1);

      let domCluster = 0;
      let best = -1;
      for (const [c, n] of counts.entries()) {
        if (n > best) {
          best = n;
          domCluster = c;
        }
      }

      const h = hashInt(domCluster);
      const rotate = h % stepCount;

      // masks (length 16 assumed, but we’ll adapt by modulo)
      const kickMask16 = [1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0];
      const chordMask16 = [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0];

      // density based on mean energy
      const meanEnergy = rows.length
        ? clamp01(rows.reduce((a, r) => a + clamp01(r.energy), 0) / rows.length)
        : 0;

      const density = meanEnergy > 0.7 ? 1.0 : meanEnergy > 0.45 ? 0.8 : 0.6;

      // x/y shift pattern a bit
      const meanX = rows.length
        ? rows.reduce((a, r) => a + r.x, 0) / rows.length
        : 0;
      const meanY = rows.length
        ? rows.reduce((a, r) => a + r.y, 0) / rows.length
        : 0;
      const chordRotate = (rotate + normToIndex(meanY, stepCount)) % stepCount;
      const kickRotate = (rotate + normToIndex(meanX, stepCount)) % stepCount;

      for (let i = 0; i < stepCount; i++) {
        const km = kickMask16[i % 16] === 1;
        const cm = chordMask16[i % 16] === 1;

        // Apply density by dropping some hits deterministically
        const dropKick = ((i + kickRotate) % 5) / 5 > density;
        const dropChord = ((i + chordRotate) % 7) / 7 > density;

        kickSteps[(i + kickRotate) % stepCount] = km && !dropKick;
        chordSteps[(i + chordRotate) % stepCount] = cm && !dropChord;
      }

      return { kickSteps, chordSteps };
    },
  },
];

function bucketize(rows: Row[], stepCount: number) {
  if (rows.length === 0) return Array(stepCount).fill(null) as (Row | null)[];

  // If rows have time t, sort by it, else keep order
  const sorted = [...rows].sort((a, b) => (a.t ?? 0) - (b.t ?? 0));

  const out: Row[] = [];
  for (let i = 0; i < stepCount; i++) {
    const idx = Math.floor((i / stepCount) * sorted.length);
    out.push(sorted[Math.min(sorted.length - 1, idx)]);
  }
  return out;
}
