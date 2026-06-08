"use client";

import type { RerollState } from "@/types";
import type { RerollKind } from "@/lib/game";

export function RerollControls({
  rerolls,
  onReroll,
  disabled,
}: {
  rerolls: RerollState;
  onReroll: (kind: RerollKind) => void;
  disabled?: boolean;
}) {
  const buttons: { kind: RerollKind; label: string; count: number }[] = [
    { kind: "nation", label: "Reroll Nation", count: rerolls.nation },
    { kind: "decade", label: "Reroll Decade", count: rerolls.decade },
    { kind: "fullSpin", label: "Full Reroll", count: rerolls.fullSpin },
  ];
  return (
    <div className="grid grid-cols-3 gap-2">
      {buttons.map((b) => (
        <button
          key={b.kind}
          type="button"
          className="btn-ghost flex-col gap-0.5 py-2 text-xs"
          disabled={disabled || b.count <= 0}
          onClick={() => onReroll(b.kind)}
        >
          <span>{b.label}</span>
          <span className="text-[10px] text-slate-400">{b.count} left</span>
        </button>
      ))}
    </div>
  );
}
