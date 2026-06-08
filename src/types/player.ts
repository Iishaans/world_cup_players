export type NationId = string;
export type PlayerId = string;

export type WorldCupDecade =
  | "1960s"
  | "1970s"
  | "1980s"
  | "1990s"
  | "2000s"
  | "2010s"
  | "2020s";

export type Role =
  | "keeper"
  | "stopper"
  | "controller"
  | "carrier"
  | "finisher";

export const ROLES: Role[] = [
  "keeper",
  "stopper",
  "controller",
  "carrier",
  "finisher",
];

export const ROLE_LABELS: Record<Role, string> = {
  keeper: "Keeper",
  stopper: "Stopper",
  controller: "Controller",
  carrier: "Carrier",
  finisher: "Finisher",
};

export type Trait =
  | "sweeper_keeper"
  | "penalty_specialist"
  | "penalty_saver"
  | "lockdown_defender"
  | "recovery_pace"
  | "aerial_monster"
  | "tempo_setter"
  | "press_resistant"
  | "final_ball_specialist"
  | "elite_dribbler"
  | "solo_goal_threat"
  | "two_footed"
  | "big_game_player"
  | "golden_ball_aura"
  | "golden_boot_aura"
  | "world_cup_winner"
  | "captain"
  | "volatile_genius"
  | "defensive_liability"
  | "relentless_presser"
  | "clutch_finisher"
  | "long_shot_threat";

export const TRAIT_LABELS: Record<Trait, string> = {
  sweeper_keeper: "Sweeper Keeper",
  penalty_specialist: "Penalty Specialist",
  penalty_saver: "Penalty Saver",
  lockdown_defender: "Lockdown Defender",
  recovery_pace: "Recovery Pace",
  aerial_monster: "Aerial Monster",
  tempo_setter: "Tempo Setter",
  press_resistant: "Press Resistant",
  final_ball_specialist: "Final Ball Specialist",
  elite_dribbler: "Elite Dribbler",
  solo_goal_threat: "Solo Goal Threat",
  two_footed: "Two Footed",
  big_game_player: "Big Game Player",
  golden_ball_aura: "Golden Ball Aura",
  golden_boot_aura: "Golden Boot Aura",
  world_cup_winner: "World Cup Winner",
  captain: "Captain",
  volatile_genius: "Volatile Genius",
  defensive_liability: "Defensive Liability",
  relentless_presser: "Relentless Presser",
  clutch_finisher: "Clutch Finisher",
  long_shot_threat: "Long Shot Threat",
};

export interface PlayerRatings {
  overall: number;
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
  goalkeeping?: number;

  composure: number;
  stamina: number;
  weakFoot: number;
  skillMoves: number;

  tournamentAura: number;
  penaltyTaking?: number;
  penaltySaving?: number;
}

export interface RoleFitRatings {
  keeper: number;
  stopper: number;
  controller: number;
  carrier: number;
  finisher: number;
}

export interface WorldCupProfile {
  appearances?: number;
  goals?: number;
  assists?: number;
  cleanSheets?: number;
  knockoutGoals?: number;
  goldenBall?: boolean;
  goldenBoot?: boolean;
  goldenGlove?: boolean;
  winner?: boolean;
  finalist?: boolean;
  semiFinalist?: boolean;
  iconicMoment?: boolean;
  captain?: boolean;
}

export interface PlayerWorldCupCard {
  id: string;
  playerId: PlayerId;
  name: string;
  shortName?: string;
  nation: NationId;
  decade: WorldCupDecade;
  worldCups: number[];

  primaryPosition: string;
  secondaryPositions: string[];

  ratings: PlayerRatings;
  roleFit: RoleFitRatings;
  traits: Trait[];

  worldCupProfile: WorldCupProfile;

  metadata: {
    imageUrl?: string;
    sourceNotes?: string;
    dataConfidence: "high" | "medium" | "low";
    isMvpSeeded: boolean;
  };
}

export type Rarity = "common" | "uncommon" | "rare" | "challenge";

export interface NationDecadePool {
  id: string;
  nation: NationId;
  decade: WorldCupDecade;
  eligibleWorldCups: number[];
  minEligiblePlayers: number;
  starDepth: number;
  rarity: Rarity;
  enabled: boolean;
}
