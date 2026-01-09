import type { Row } from "./types";
import type { Step } from "../audio/patternStore";
import type { MappingPreset } from "./presets";

export function applyPresetToSteps(
  rows: Row[],
  stepCount: number,
  preset: MappingPreset
): Step[] {
  const { kickSteps, chordSteps } = preset.map(rows, stepCount);

  const steps: Step[] = Array.from({ length: stepCount }, (_, i) => ({
    kick: Boolean(kickSteps[i]),
    chord: Boolean(chordSteps[i]),
  }));

  return steps;
}
