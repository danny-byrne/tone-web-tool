import type { Step } from "../audio/patternStore";

type Props = {
  pattern: Step[];
  playhead: number;
  onToggle: (index: number, key: keyof Step) => void;
};

function StepButton({
  active,
  isPlayhead,
  onClick,
  ariaLabel,
}: {
  active: boolean;
  isPlayhead: boolean;
  onClick: () => void;
  ariaLabel: string;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        height: 34,
        borderRadius: 8,
        border: isPlayhead
          ? "2px solid rgba(255,255,255,0.9)"
          : "1px solid rgba(255,255,255,0.2)",
        background: active
          ? "rgba(255,255,255,0.25)"
          : "rgba(255,255,255,0.05)",
        cursor: "pointer",
      }}
      aria-label={ariaLabel}
    />
  );
}

export function StepGrid({ pattern, playhead, onToggle }: Props) {
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
          <StepButton
            key={`kick-${i}`}
            active={step.kick}
            isPlayhead={i === playhead}
            onClick={() => onToggle(i, "kick")}
            ariaLabel={`Kick step ${i + 1}`}
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
          <StepButton
            key={`chord-${i}`}
            active={step.chord}
            isPlayhead={i === playhead}
            onClick={() => onToggle(i, "chord")}
            ariaLabel={`Chord step ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
