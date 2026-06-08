import type {
  NationId,
  PlayerWorldCupCard,
  Trait,
  WorldCupDecade,
  WorldCupProfile,
} from "@/types";

export interface CardInput {
  id: string;
  pid: string;
  name: string;
  short?: string;
  nation: NationId;
  decade: WorldCupDecade;
  wc: number[];
  pos: string;
  sec?: string[];
  /** [pace, shooting, passing, dribbling, defending, physical] */
  r: [number, number, number, number, number, number];
  gk?: number;
  com: number;
  sta: number;
  wf: number;
  sm: number;
  aura: number;
  pen?: number;
  pensave?: number;
  ovr: number;
  /** [keeper, stopper, controller, carrier, finisher] */
  rf: [number, number, number, number, number];
  traits: Trait[];
  p?: WorldCupProfile;
  conf?: "high" | "medium" | "low";
}

export function mk(input: CardInput): PlayerWorldCupCard {
  const [pace, shooting, passing, dribbling, defending, physical] = input.r;
  const [keeper, stopper, controller, carrier, finisher] = input.rf;
  return {
    id: input.id,
    playerId: input.pid,
    name: input.name,
    shortName: input.short ?? input.name,
    nation: input.nation,
    decade: input.decade,
    worldCups: input.wc,
    primaryPosition: input.pos,
    secondaryPositions: input.sec ?? [],
    ratings: {
      overall: input.ovr,
      pace,
      shooting,
      passing,
      dribbling,
      defending,
      physical,
      goalkeeping: input.gk,
      composure: input.com,
      stamina: input.sta,
      weakFoot: input.wf,
      skillMoves: input.sm,
      tournamentAura: input.aura,
      penaltyTaking: input.pen,
      penaltySaving: input.pensave,
    },
    roleFit: { keeper, stopper, controller, carrier, finisher },
    traits: input.traits,
    worldCupProfile: input.p ?? {},
    metadata: {
      dataConfidence: input.conf ?? "medium",
      isMvpSeeded: true,
    },
  };
}
