import { getTransport } from "tone";
import { triggerKick, triggerChord } from "./instruments";
import { getPattern } from "./patternStore";
import { setPlayhead } from "./playheadStore";

const transport = getTransport();

let eventId: number | null = null;

export function startScheduler() {
  if (eventId !== null) return;

  let stepIndex = 0;

  eventId = transport.scheduleRepeat((time) => {
    const pattern = getPattern();
    const idx = stepIndex % pattern.length;
    const step = pattern[idx];

    // publish playhead for UI
    setPlayhead(idx);

    if (step.kick) triggerKick(time);
    if (step.chord) triggerChord(time);

    stepIndex += 1;
  }, "16n");
}

export function stopScheduler() {
  if (eventId === null) return;
  transport.clear(eventId);
  eventId = null;
  setPlayhead(0);
}
