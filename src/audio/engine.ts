import { start, getTransport } from "tone";
import { initFxChain } from "./fx";

let initialized = false;
const transport = getTransport();

export async function initAudio() {
  if (initialized) return;
  await start(); // unlock AudioContext (must be called from a user gesture)
  initFxChain();

  transport.bpm.value = 90;
  transport.loop = true;
  transport.loopStart = "0:0:0";
  transport.loopEnd = "1:0:0"; // 1 bar loop

  initialized = true;
}

export function play() {
  transport.start();
}

export function stop() {
  transport.stop();
  transport.position = "0:0:0";
}

export function setBpm(bpm: number) {
  transport.bpm.rampTo(bpm, 0.1);
}

export function getTransportState() {
  return transport.state;
}
