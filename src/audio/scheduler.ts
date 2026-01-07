import { getTransport } from "tone";
import { triggerKick, triggerChord } from "./instruments";

const transport = getTransport();

type Step = {
  kick: boolean;
  chord: boolean;
};

const pattern: Step[] = [
  { kick: true, chord: true },
  { kick: false, chord: false },
  { kick: false, chord: true },
  { kick: false, chord: false },
  { kick: true, chord: false },
  { kick: false, chord: false },
  { kick: false, chord: true },
  { kick: false, chord: false },
  { kick: true, chord: true },
  { kick: false, chord: false },
  { kick: false, chord: true },
  { kick: false, chord: false },
  { kick: true, chord: false },
  { kick: false, chord: false },
  { kick: false, chord: true },
  { kick: false, chord: false },
];

let eventId: number | null = null;

export function startScheduler() {
  if (eventId !== null) return;

  let stepIndex = 0;

  // 16th-note step sequencer
  eventId = transport.scheduleRepeat((time) => {
    const step = pattern[stepIndex % pattern.length];

    if (step.kick) triggerKick(time);
    if (step.chord) triggerChord(time);

    stepIndex += 1;
  }, "16n");
}

export function stopScheduler() {
  if (eventId === null) return;
  transport.clear(eventId);
  eventId = null;
}
