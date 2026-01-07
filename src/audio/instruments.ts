import { getDestination } from "tone";
import * as Tone from "tone";

let poly: Tone.PolySynth<Tone.Synth> | null = null;
let perc: Tone.MembraneSynth | null = null;

function ensurePoly() {
  if (poly) return poly;
  poly = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: "sawtooth" },
    envelope: { attack: 0.01, release: 0.8 },
  }).connect(getDestination());
  return poly;
}

function ensurePerc() {
  if (perc) return perc;
  perc = new Tone.MembraneSynth({
    pitchDecay: 0.02,
    octaves: 6,
    envelope: { attack: 0.001, decay: 0.3, sustain: 0 },
  }).connect(getDestination());
  return perc;
}

export function playTestChord() {
  ensurePoly().triggerAttackRelease(["C4", "E4", "G4"], "2n");
}

export function triggerKick(time?: number) {
  const s = ensurePerc();
  if (typeof time === "number") {
    s.triggerAttackRelease("C1", "8n", time);
  } else {
    s.triggerAttackRelease("C1", "8n");
  }
}

export function triggerChord(time?: number) {
  const s = ensurePoly();
  const notes = ["C4", "E4", "G4"];
  if (typeof time === "number") {
    s.triggerAttackRelease(notes, "8n", time);
  } else {
    s.triggerAttackRelease(notes, "8n");
  }
}
