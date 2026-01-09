import { useState, useEffect } from "react";
import { initAudio, play, stop, setBpm } from "./audio/engine";
import { startScheduler, stopScheduler } from "./audio/scheduler";
import { playTestChord } from "./audio/instruments";
import { StepGrid } from "./ui/StepGrid";
import { getPattern, toggleStep, resetPattern } from "./audio/patternStore";
import { getPlayhead, subscribePlayhead } from "./audio/playheadStore";
import { FxPanel } from "./ui/FxPanel";
import { PRESETS } from "./mapping/presets";
import { applyPresetToSteps } from "./mapping/applyPreset";
import { SAMPLE_ROWS } from "./mapping/sampleData";
import { setPatternFromSteps } from "./audio/patternStore";

export default function App() {
  const [started, setStarted] = useState(false);
  const [bpm, setBpmState] = useState(90);
  const [patternVersion, setPatternVersion] = useState(0);
  const [playhead, setPlayhead] = useState(getPlayhead());
  const [presetId, setPresetId] = useState(PRESETS[0].id);

  useEffect(() => {
    return subscribePlayhead(setPlayhead);
  }, []);

  const pattern = getPattern();

  const handleApplyPreset = () => {
    const preset = PRESETS.find((p) => p.id === presetId) ?? PRESETS[0];
    const steps = applyPresetToSteps(SAMPLE_ROWS, 16, preset);
    setPatternFromSteps(steps);
    setPatternVersion((v) => v + 1);
  };

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

  const handleToggle = (index: number, key: "kick" | "chord") => {
    toggleStep(index, key);
    setPatternVersion((v) => v + 1); // force UI refresh
  };

  const handleReset = () => {
    resetPattern();
    setPatternVersion((v) => v + 1);
  };

  return (
    <div style={{ padding: 24, display: "grid", gap: 12, maxWidth: 720 }}>
      <h1>Tone.js WebAudio Tool</h1>

      <div style={{ display: "flex", gap: 8 }}>
        {!started ? (
          <button onClick={handleStart}>Start</button>
        ) : (
          <button onClick={handleStop}>Stop</button>
        )}

        <button onClick={playTestChord} disabled={!started}>
          Test chord
        </button>

        <button
          onClick={handleReset}
          disabled={!started && patternVersion === patternVersion}
        >
          Reset pattern
        </button>
      </div>

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
      <FxPanel disabled={!started} />
      <div
        style={{
          display: "grid",
          gap: 8,
          padding: 12,
          borderRadius: 12,
          border: "1px solid rgba(255,255,255,0.15)",
        }}
      >
        <div style={{ fontWeight: 700 }}>Mapping Presets</div>

        <select
          value={presetId}
          onChange={(e) => setPresetId(e.target.value as typeof presetId)}
          disabled={!started}
          style={{ padding: 8, borderRadius: 8 }}
        >
          {PRESETS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <div style={{ opacity: 0.8, fontSize: 13 }}>
          {PRESETS.find((p) => p.id === presetId)?.description}
        </div>

        <button onClick={handleApplyPreset} disabled={!started}>
          Apply preset to pattern
        </button>
      </div>

      <div style={{ opacity: 0.9 }}>
        Click steps to toggle. Scheduler reads pattern store every 16th note.
      </div>

      <StepGrid pattern={pattern} playhead={playhead} onToggle={handleToggle} />
    </div>
  );
}
