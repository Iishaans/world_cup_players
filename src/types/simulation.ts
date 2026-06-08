import type { NationId, WorldCupDecade } from "./player";

export interface TeamVector {
  finishing: number;
  creation: number;
  ballRetention: number;
  transitionThreat: number;
  pressing: number;
  defensiveSecurity: number;
  goalkeeping: number;
  tournamentAura: number;
  chemistry: number;
  balance: number;
  overall: number;
}

export interface ChemistryBreakdown {
  sameNation: number;
  sameDecade: number;
  sameWorldCup: number;
  winnerAura: number;
  knownPartnerships: number;
  tacticalSynergy: number;
  penalties: number;
  total: number;
}

export type OpponentStyle =
  | "possession"
  | "counter_attack"
  | "low_block"
  | "high_press"
  | "physical"
  | "balanced"
  | "chaos";

export type OpponentTrait =
  | "iconic_attack"
  | "aura_monster"
  | "press_resistant"
  | "death_by_passing"
  | "low_block_wall"
  | "penalty_ready"
  | "counter_kings"
  | "physical_unit"
  | "chaos_engine"
  | "set_piece_threat"
  | "relentless_press"
  | "clinical_finishing";

export interface OpponentTeam {
  id: string;
  name: string;
  nation: NationId;
  decade: WorldCupDecade;
  style: OpponentStyle;
  vector: TeamVector;
  traits: OpponentTrait[];
  difficulty: number;
}

export type TournamentStage =
  | "group_1"
  | "group_2"
  | "group_3"
  | "round_of_16"
  | "quarter_final"
  | "semi_final"
  | "final";

export const STAGE_LABELS: Record<TournamentStage, string> = {
  group_1: "Group 1",
  group_2: "Group 2",
  group_3: "Group 3",
  round_of_16: "Round of 16",
  quarter_final: "Quarter-final",
  semi_final: "Semi-final",
  final: "Final",
};

export const STAGE_SHORT: Record<TournamentStage, string> = {
  group_1: "G1",
  group_2: "G2",
  group_3: "G3",
  round_of_16: "R16",
  quarter_final: "QF",
  semi_final: "SF",
  final: "Final",
};

export interface MatchResult {
  stage: TournamentStage;
  opponentId: string;
  opponentName: string;
  userGoals: number;
  opponentGoals: number;
  wentToExtraTime: boolean;
  wentToPenalties: boolean;
  penaltyResult?: {
    userPenalties: number;
    opponentPenalties: number;
  };
  outcome: "win" | "loss";
  xgFor: number;
  xgAgainst: number;
  notes: string[];
}

export interface TournamentResult {
  record: {
    wins: number;
    losses: number;
  };
  champion: boolean;
  eliminatedStage?: TournamentStage;
  matches: MatchResult[];
  teamVector: TeamVector;
  chemistryBreakdown: ChemistryBreakdown;
  strengths: string[];
  weaknesses: string[];
  mvpPlayerCardId?: string;
  shareText: string;
  score: number;
}
