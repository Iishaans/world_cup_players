"use client";

import type { TeamVector } from "@/types";
import { ratingColor } from "@/lib/ui";

const PREVIEW: { key: keyof TeamVector; label: string }[] = [
  { key: "finishing", label: "Finishing" },
  { key: "creation", label: "Creation" },
  { key: "ballRetention", label: "Control" },
  { key: "defensiveSecurity", label: "Defence" },
  { key: "goalkeeping", label: "Keeper" },
  { key: "chemistry", label: "Chemistry" },
];

export function TeamVectorPreview({
  vector,
  fuzzy = false,
}: {
  vector: TeamVector;
  fuzzy?: boolean;
}) {
  const show = (n: number) => {
    if (!fuzzy) return String(n);
    const band = Math.round(n / 10) * 10;
    return `~${band}`;
  };
  return (
    <div className="space-y-2">
      {PREVIEW.map(({ key, label }) => {
        const v = vector[key];
        return (
          <div key={key} className="flex items-center gap-2">
            <span className="w-20 shrink-0 text-[11px] font-medium text-slate-400">
              {label}
            </span>
            <div className="rating-track h-2 flex-1 overflow-hidden rounded-full">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${v}%`, backgroundColor: ratingColor(v) }}
              />
            </div>
            <span className="w-9 shrink-0 text-right text-xs font-semibold tabular-nums text-slate-100">
              {show(v)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
