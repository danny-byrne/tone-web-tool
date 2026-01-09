import type { Step } from "../audio/patternStore";

type Props = {
  pattern: Step[];
  onToggle: (index: number, key: keyof Step) => void;
};

export function StepGrid({ pattern, onToggle }: Props) {
  return (
    <div style={{ display: "grid", gap: 10 }}>
      <div style={{ fontWeight: 600 }}>Kick</div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(16, 1fr)",
          gap: 6,
        }}
      >
        {pattern.map((step, i) => (
          <button
            key={`kick-${i}`}
            onClick={() => onToggle(i, "kick")}
            style={{
              height: 34,
              borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.2)",
              background: step.kick
                ? "rgba(255,255,255,0.25)"
                : "rgba(255,255,255,0.05)",
              cursor: "pointer",
            }}
            aria-label={`Kick step ${i + 1}`}
          />
        ))}
      </div>

      <div style={{ fontWeight: 600 }}>Chord</div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(16, 1fr)",
          gap: 6,
        }}
      >
        {pattern.map((step, i) => (
          <button
            key={`chord-${i}`}
            onClick={() => onToggle(i, "chord")}
            style={{
              height: 34,
              borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.2)",
              background: step.chord
                ? "rgba(255,255,255,0.25)"
                : "rgba(255,255,255,0.05)",
              cursor: "pointer",
            }}
            aria-label={`Chord step ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
