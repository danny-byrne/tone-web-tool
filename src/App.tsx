import { useState } from "react";
import * as Tone from "tone";

let synth: Tone.PolySynth | null = null;

async function startAudio() {
  await Tone.start();
  Tone.Transport.bpm.value = 90;

  if (!synth) {
    synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "sawtooth" },
      envelope: {
        attack: 0.01,
        release: 0.8,
      },
    }).toDestination();
  }

  Tone.Transport.start();
}

export default function App() {
  const [started, setStarted] = useState(false);

  const handleStart = async () => {
    await startAudio();
    setStarted(true);
  };

  const playChord = () => {
    if (!synth) return;
    synth.triggerAttackRelease(["C4", "E4", "G4"], "2n");
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>Tone.js WebAudio Tool</h1>

      {!started && <button onClick={handleStart}>Start Audio</button>}

      {started && (
        <>
          <button onClick={playChord}>Play Chord</button>
        </>
      )}
    </div>
  );
}
