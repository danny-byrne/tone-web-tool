export type Step = {
  kick: boolean;
  chord: boolean;
};

const DEFAULT_PATTERN: Step[] = [
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

let pattern: Step[] = DEFAULT_PATTERN.map((s) => ({ ...s }));

export function getPattern() {
  return pattern;
}

export function setPattern(next: Step[]) {
  pattern = next.map((s) => ({ ...s }));
}

export function toggleStep(index: number, key: keyof Step) {
  pattern = pattern.map((s, i) => (i === index ? { ...s, [key]: !s[key] } : s));
}

export function resetPattern() {
  pattern = DEFAULT_PATTERN.map((s) => ({ ...s }));
}
