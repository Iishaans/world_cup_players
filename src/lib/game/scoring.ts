import type { GameMode, TeamVector } from "@/types";

export const MODE_MULTIPLIER: Record<GameMode, number> = {
  classic: 1.0,
  knowledge: 1.15,
  hardcore: 1.35,
  daily: 1.0,
};

export interface ScoreInput {
  mode: GameMode;
  wins: number;
  champion: boolean;
  goalDifference: number;
  teamVector: TeamVector;
}

export function computeScore({
  mode,
  wins,
  champion,
  goalDifference,
  teamVector,
}: ScoreInput): number {
  const championBonus = champion ? 3000 : 0;
  const chemistryBonus = Math.round(teamVector.chemistry * 5);
  const base =
    wins * 1000 +
    championBonus +
    goalDifference * 25 +
    teamVector.overall * 10 +
    chemistryBonus;
  return Math.round(base * MODE_MULTIPLIER[mode]);
}
