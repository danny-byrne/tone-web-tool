import { useState, useCallback } from "react";
import {
  initAudio,
  startTransport,
  stopTransport,
  setBpm,
  isTransportStarted,
} from "../audio/engine";

export function useTransport() {
  const [started, setStarted] = useState(isTransportStarted());

  const start = useCallback(async () => {
    await initAudio();
    startTransport();
    setStarted(true);
  }, []);

  const stop = useCallback(() => {
    stopTransport();
    setStarted(false);
  }, []);

  const setTempo = useCallback((bpm: number) => {
    setBpm(bpm);
  }, []);

  return {
    started,
    start,
    stop,
    setTempo,
  };
}
