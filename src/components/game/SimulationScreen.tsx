"use client";

import { useEffect, useState } from "react";

const STEPS = [
  "Calculating chemistry…",
  "Building tactical profile…",
  "Seeding the bracket…",
  "Entering the group stage…",
  "Simulating the tournament…",
];

export function SimulationScreen({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (step >= STEPS.length) {
      const t = setTimeout(onDone, 250);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStep((s) => s + 1), 360);
    return () => clearTimeout(t);
  }, [step, onDone]);

  return (
    <div className="grid min-h-[60vh] place-items-center">
      <div className="panel w-full max-w-md p-8 text-center">
        <div className="mx-auto mb-6 h-14 w-14 animate-spin rounded-full border-4 border-ink-600 border-t-gold" />
        <div className="space-y-2 text-left">
          {STEPS.map((s, i) => (
            <div
              key={s}
              className={
                "flex items-center gap-2 text-sm transition " +
                (i < step ? "text-emerald-300" : i === step ? "text-white" : "text-slate-600")
              }
            >
              <span className="w-4">{i < step ? "✓" : i === step ? "›" : "·"}</span>
              {s}
            </div>
          ))}
        </div>
        <button type="button" className="btn-ghost mt-6 w-full" onClick={onDone}>
          Skip to results
        </button>
      </div>
    </div>
  );
}
