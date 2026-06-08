import type { Trait } from "@/types";
import { TRAIT_LABELS } from "@/types";

const STRONG: Trait[] = [
  "golden_ball_aura",
  "golden_boot_aura",
  "world_cup_winner",
  "big_game_player",
  "clutch_finisher",
];
const NEGATIVE: Trait[] = ["defensive_liability", "volatile_genius"];

export function TraitPills({ traits, max }: { traits: Trait[]; max?: number }) {
  const shown = typeof max === "number" ? traits.slice(0, max) : traits;
  return (
    <div className="flex flex-wrap gap-1.5">
      {shown.map((t) => {
        const strong = STRONG.includes(t);
        const negative = NEGATIVE.includes(t);
        return (
          <span
            key={t}
            className={
              "rounded-md border px-2 py-0.5 text-[10px] font-semibold " +
              (negative
                ? "border-rose-500/50 bg-rose-500/10 text-rose-200"
                : strong
                  ? "border-gold/50 bg-gold/10 text-gold-soft"
                  : "border-ink-600 bg-ink-800/70 text-slate-300")
            }
          >
            {TRAIT_LABELS[t]}
          </span>
        );
      })}
    </div>
  );
}
