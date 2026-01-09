import { getDestination } from "tone";
import * as Tone from "tone";

let initialized = false;

// Nodes
let inputGain: Tone.Gain;
let filter: Tone.Filter;
let delay: Tone.FeedbackDelay;
let reverb: Tone.Reverb;
let limiter: Tone.Limiter;
let outputGain: Tone.Gain;

export type FxParams = {
  master: number; // 0..1
  filterCutoff: number; // Hz
  filterQ: number; // 0.1..20
  delayTime: number; // seconds
  delayWet: number; // 0..1
  delayFeedback: number; // 0..0.95
  reverbWet: number; // 0..1
};

const params: FxParams = {
  master: 0.9,
  filterCutoff: 12000,
  filterQ: 0.8,
  delayTime: 0.2,
  delayFeedback: 0.25,
  delayWet: 0.25,
  reverbWet: 0.15,
};

export function initFxChain() {
  if (initialized) return;

  inputGain = new Tone.Gain(1);
  filter = new Tone.Filter(params.filterCutoff, "lowpass");
  filter.Q.value = params.filterQ;

  delay = new Tone.FeedbackDelay({
    delayTime: params.delayTime,
    feedback: params.delayFeedback,
    wet: params.delayWet,
  });

  reverb = new Tone.Reverb({
    decay: 2.2,
    preDelay: 0.01,
    wet: params.reverbWet,
  });

  limiter = new Tone.Limiter(-1);
  outputGain = new Tone.Gain(params.master);

  // Chain: input → filter → delay → reverb → limiter → output → destination
  inputGain.chain(filter, delay, reverb, limiter, outputGain, getDestination());

  initialized = true;
}

export function getFxInput() {
  initFxChain();
  return inputGain;
}

export function getFxParams(): FxParams {
  return { ...params };
}

export function setMaster(value: number) {
  params.master = clamp01(value);
  initFxChain();
  outputGain.gain.rampTo(params.master, 0.05);
}

export function setFilterCutoff(hz: number) {
  params.filterCutoff = clamp(hz, 40, 20000);
  initFxChain();
  filter.frequency.rampTo(params.filterCutoff, 0.05);
}

export function setFilterQ(q: number) {
  params.filterQ = clamp(q, 0.1, 20);
  initFxChain();
  filter.Q.rampTo(params.filterQ, 0.05);
}

export function setDelayTime(seconds: number) {
  params.delayTime = clamp(seconds, 0, 1);
  initFxChain();
  delay.delayTime.rampTo(params.delayTime, 0.05);
}

export function setDelayFeedback(value: number) {
  params.delayFeedback = clamp(value, 0, 0.95);
  initFxChain();
  delay.feedback.rampTo(params.delayFeedback, 0.05);
}

export function setDelayWet(value: number) {
  params.delayWet = clamp01(value);
  initFxChain();
  delay.wet.rampTo(params.delayWet, 0.05);
}

export function setReverbWet(value: number) {
  params.reverbWet = clamp01(value);
  initFxChain();
  reverb.wet.rampTo(params.reverbWet, 0.05);
}

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}
