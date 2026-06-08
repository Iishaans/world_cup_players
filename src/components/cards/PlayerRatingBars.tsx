import type { PlayerWorldCupCard } from "@/types";
import { ratingColor } from "@/lib/ui";

const OUTFIELD: { key: keyof PlayerWorldCupCard["ratings"]; label: string }[] = [
  { key: "pace", label: "PAC" },
  { key: "shooting", label: "SHO" },
  { key: "passing", label: "PAS" },
  { key: "dribbling", label: "DRI" },
  { key: "defending", label: "DEF" },
  { key: "physical", label: "PHY" },
];

export function PlayerRatingBars({
  card,
  compact = false,
}: {
  card: PlayerWorldCupCard;
  compact?: boolean;
}) {
  const isKeeper = card.primaryPosition === "GK";
  const rows = isKeeper
    ? [
        { key: "goalkeeping" as const, label: "GK" },
        { key: "passing" as const, label: "PAS" },
        { key: "physical" as const, label: "PHY" },
        { key: "composure" as const, label: "COM" },
        { key: "pace" as const, label: "PAC" },
        { key: "penaltySaving" as const, label: "PSV" },
      ]
    : OUTFIELD;

  return (
    <div className={compact ? "grid grid-cols-2 gap-x-3 gap-y-1.5" : "grid grid-cols-2 gap-x-4 gap-y-2"}>
      {rows.map(({ key, label }) => {
        const value = (card.ratings[key] as number | undefined) ?? 0;
        return (
          <div key={label} className="flex items-center gap-2">
            <span className="w-8 shrink-0 text-[10px] font-bold uppercase tracking-wide text-slate-400">
              {label}
            </span>
            <div className="rating-track h-1.5 flex-1 overflow-hidden rounded-full">
              <div
                className="h-full rounded-full"
                style={{ width: `${value}%`, backgroundColor: ratingColor(value) }}
              />
            </div>
            <span className="w-6 shrink-0 text-right text-xs font-semibold tabular-nums text-slate-100">
              {value}
            </span>
          </div>
        );
      })}
    </div>
  );
}
