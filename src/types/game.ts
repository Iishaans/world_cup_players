import type { NationId, Role, WorldCupDecade } from "./player";
import type { TournamentResult } from "./simulation";

export type GameMode = "classic" | "knowledge" | "hardcore" | "daily";

export interface DraftSpin {
  id: string;
  nation: NationId;
  decade: WorldCupDecade;
  eligibleWorldCups: number[];
  eligiblePlayerCardIds: string[];
}

export type RerollAction =
  | { type: "nation"; previousNation: NationId; nextNation: NationId }
  | {
      type: "decade";
      previousDecade: WorldCupDecade;
      nextDecade: WorldCupDecade;
    }
  | { type: "fullSpin"; previousSpinId: string; nextSpinId: string };

export interface DraftRound {
  roundNumber: number;
  spin: DraftSpin;
  selectedCardId?: string;
  assignedRole?: Role;
  skipped?: boolean;
  rerollsUsed: RerollAction[];
}

export interface Selection {
  role: Role;
  playerCardId: string;
  nation: NationId;
  decade: WorldCupDecade;
}

export type Roster = Partial<Record<Role, Selection>>;

export interface RerollState {
  nation: number;
  decade: number;
  fullSpin: number;
}

export interface GameConstraints {
  allowDuplicateNation: boolean;
  allowDuplicateDecade: boolean;
  allowDuplicatePlayer: boolean;
  ratingsVisible: boolean;
}

export interface GameState {
  id: string;
  seed: string;
  mode: GameMode;
  status: "drafting" | "simulating" | "complete";

  round: number;
  totalRounds: 5;

  currentSpin?: DraftSpin;
  draftHistory: DraftRound[];

  roster: Roster;

  usedPlayerCardIds: string[];
  usedNations: NationId[];
  usedDecades: WorldCupDecade[];

  rerolls: RerollState;

  constraints: GameConstraints;

  result?: TournamentResult;

  createdAt: string;
  updatedAt: string;
}
