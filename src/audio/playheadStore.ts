type Listener = (stepIndex: number) => void;

let currentStep = 0;
const listeners = new Set<Listener>();

export function setPlayhead(stepIndex: number) {
  currentStep = stepIndex;
  for (const l of listeners) l(currentStep);
}

export function getPlayhead() {
  return currentStep;
}

export function subscribePlayhead(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
