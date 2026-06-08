import type { Rarity, Role, TeamVector } from "@/types";

export function cn(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(" ");
}

export const ROLE_META: Record<
  Role,
  { label: string; short: string; abbr: string; accent: string; blurb: string }
> = {
  keeper: { label: "Keeper", short: "GK", abbr: "GK", accent: "#f5c542", blurb: "Last line & distribution" },
  stopper: { label: "Stopper", short: "Stopper", abbr: "STP", accent: "#60a5fa", blurb: "Defensive anchor" },
  controller: { label: "Controller", short: "Control", abbr: "CTR", accent: "#a78bfa", blurb: "Tempo & retention" },
  carrier: { label: "Carrier", short: "Carrier", abbr: "CAR", accent: "#34d399", blurb: "Creation & dribbling" },
  finisher: { label: "Finisher", short: "Finish", abbr: "FIN", accent: "#fb7185", blurb: "Goals" },
};

export const RARITY_META: Record<Rarity, { label: string; className: string }> = {
  common: { label: "Common", className: "border-slate-500/50 text-slate-200" },
  uncommon: { label: "Uncommon", className: "border-emerald-400/60 text-emerald-200" },
  rare: { label: "Rare", className: "border-sky-400/60 text-sky-200" },
  challenge: { label: "Challenge", className: "border-rose-400/60 text-rose-200" },
};

export function ratingColor(value: number): string {
  if (value >= 90) return "#34d399";
  if (value >= 80) return "#86efac";
  if (value >= 70) return "#facc15";
  if (value >= 55) return "#fb923c";
  return "#f87171";
}

export function overallTier(value: number): string {
  if (value >= 92) return "Elite";
  if (value >= 85) return "World class";
  if (value >= 78) return "Very good";
  if (value >= 70) return "Solid";
  return "Squad";
}

export const VECTOR_FIELDS: { key: keyof TeamVector; label: string }[] = [
  { key: "finishing", label: "Finishing" },
  { key: "creation", label: "Creation" },
  { key: "ballRetention", label: "Ball Retention" },
  { key: "transitionThreat", label: "Transition" },
  { key: "pressing", label: "Pressing" },
  { key: "defensiveSecurity", label: "Defensive Security" },
  { key: "goalkeeping", label: "Goalkeeping" },
  { key: "tournamentAura", label: "Aura" },
  { key: "chemistry", label: "Chemistry" },
  { key: "balance", label: "Balance" },
];
