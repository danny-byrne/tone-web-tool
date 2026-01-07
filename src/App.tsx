import { useState } from "react";
import { initAudio, play, stop, setBpm } from "./audio/engine";
import { startScheduler, stopScheduler } from "./audio/scheduler";
import { playTestChord } from "./audio/instruments";

export default function App() {
  const [started, setStarted] = useState(false);
  const [bpm, setBpmState] = useState(90);

  const handleStart = async () => {
    await initAudio();
    startScheduler();
    play();
    setStarted(true);
  };

  const handleStop = () => {
    stopScheduler();
    stop();
    setStarted(false);
  };

  const handleBpm = (next: number) => {
    setBpmState(next);
    setBpm(next);
  };

  return (
    <div style={{ padding: 24, display: "grid", gap: 12, maxWidth: 520 }}>
      <h1>Tone.js WebAudio Tool</h1>

      {!started ? (
        <button onClick={handleStart}>Start</button>
      ) : (
        <button onClick={handleStop}>Stop</button>
      )}

      <button onClick={playTestChord} disabled={!started}>
        Test chord
      </button>

      <label style={{ display: "grid", gap: 6 }}>
        BPM: {bpm}
        <input
          type="range"
          min={60}
          max={160}
          value={bpm}
          onChange={(e) => handleBpm(Number(e.target.value))}
          disabled={!started}
        />
      </label>

      <p style={{ opacity: 0.8, marginTop: 8 }}>
        Sequencer runs on Tone&#39;s Transport clock, not React timing.
      </p>
    </div>
  );
}
