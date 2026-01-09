import { useState } from "react";
import {
  getFxParams,
  setMaster,
  setFilterCutoff,
  setFilterQ,
  setDelayTime,
  setDelayFeedback,
  setDelayWet,
  setReverbWet,
} from "../audio/fx";

function Row({
  label,
  valueLabel,
  children,
}: {
  label: string;
  valueLabel: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "grid", gap: 6 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          opacity: 0.9,
        }}
      >
        <div style={{ fontWeight: 600 }}>{label}</div>
        <div style={{ fontFamily: "monospace", fontSize: 12, opacity: 0.8 }}>
          {valueLabel}
        </div>
      </div>
      {children}
    </div>
  );
}

export function FxPanel({ disabled }: { disabled: boolean }) {
  const initial = getFxParams();

  const [master, setMasterUi] = useState(initial.master);
  const [cutoff, setCutoffUi] = useState(initial.filterCutoff);
  const [q, setQUi] = useState(initial.filterQ);
  const [delayTime, setDelayTimeUi] = useState(initial.delayTime);
  const [delayFb, setDelayFbUi] = useState(initial.delayFeedback);
  const [revWet, setRevWetUi] = useState(initial.reverbWet);
  const [delayWet, setDelayWetUi] = useState(initial.delayWet);

  return (
    <div
      style={{
        display: "grid",
        gap: 12,
        padding: 12,
        borderRadius: 12,
        border: "1px solid rgba(255,255,255,0.15)",
      }}
    >
      <div style={{ fontWeight: 700 }}>FX</div>

      <Row label="Master" valueLabel={master.toFixed(2)}>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={master}
          disabled={disabled}
          onChange={(e) => {
            const v = Number(e.target.value);
            setMasterUi(v);
            setMaster(v);
          }}
        />
      </Row>

      <Row label="Filter Cutoff" valueLabel={`${Math.round(cutoff)} Hz`}>
        <input
          type="range"
          min={40}
          max={20000}
          step={1}
          value={cutoff}
          disabled={disabled}
          onChange={(e) => {
            const v = Number(e.target.value);
            setCutoffUi(v);
            setFilterCutoff(v);
          }}
        />
      </Row>

      <Row label="Filter Q" valueLabel={q.toFixed(2)}>
        <input
          type="range"
          min={0.1}
          max={20}
          step={0.1}
          value={q}
          disabled={disabled}
          onChange={(e) => {
            const v = Number(e.target.value);
            setQUi(v);
            setFilterQ(v);
          }}
        />
      </Row>

      <Row label="Delay Time" valueLabel={`${delayTime.toFixed(2)} s`}>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={delayTime}
          disabled={disabled}
          onChange={(e) => {
            const v = Number(e.target.value);
            setDelayTimeUi(v);
            setDelayTime(v);
          }}
        />
      </Row>

      <Row label="Delay Feedback" valueLabel={delayFb.toFixed(2)}>
        <input
          type="range"
          min={0}
          max={0.95}
          step={0.01}
          value={delayFb}
          disabled={disabled}
          onChange={(e) => {
            const v = Number(e.target.value);
            setDelayFbUi(v);
            setDelayFeedback(v);
          }}
        />
      </Row>

      <Row label="Delay Wet" valueLabel={delayWet.toFixed(2)}>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={delayWet}
          disabled={disabled}
          onChange={(e) => {
            const v = Number(e.target.value);
            setDelayWetUi(v);
            setDelayWet(v);
          }}
        />
      </Row>

      <Row label="Reverb Wet" valueLabel={revWet.toFixed(2)}>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={revWet}
          disabled={disabled}
          onChange={(e) => {
            const v = Number(e.target.value);
            setRevWetUi(v);
            setReverbWet(v);
          }}
        />
      </Row>
    </div>
  );
}
