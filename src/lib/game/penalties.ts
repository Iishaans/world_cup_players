import type { PlayerWorldCupCard, Roster } from "@/types";
import { ROLES } from "@/types";
import { clamp, type RNG } from "./rng";
import type { CardLookup } from "./chemistry";

export interface PenaltyShootoutResult {
  userPenalties: number;
  opponentPenalties: number;
  userWins: boolean;
}

interface Taker {
  penaltyTaking: number;
  composure: number;
  tournamentAura: number;
}

function takerOrder(roster: Roster, getCard: CardLookup): Taker[] {
  const takers: { taker: Taker; score: number }[] = [];
  for (const role of ROLES) {
    const sel = roster[role];
    if (!sel) continue;
    const card = getCard(sel.playerCardId);
    if (!card) continue;
    const taker: Taker = {
      penaltyTaking: card.ratings.penaltyTaking ?? card.ratings.shooting * 0.8,
      composure: card.ratings.composure,
      tournamentAura: card.ratings.tournamentAura,
    };
    takers.push({
      taker,
      score: taker.penaltyTaking * 0.6 + taker.composure * 0.4,
    });
  }
  return takers.sort((a, b) => b.score - a.score).map((t) => t.taker);
}

function keeperSaveScore(card: PlayerWorldCupCard | undefined): number {
  if (!card) return 55;
  const gk = card.ratings.goalkeeping ?? card.ratings.defending;
  const pensave = card.ratings.penaltySaving ?? gk * 0.8;
  return (
    gk * 0.5 + pensave * 0.25 + card.ratings.composure * 0.1 + card.ratings.tournamentAura * 0.15
  );
}

function scoreProbability(takerScore: number, keeperScore: number): number {
  return clamp(0.72 + (takerScore - keeperScore) / 300, 0.52, 0.92);
}

/** Simulate a five-a-side penalty shootout (best of 5, then sudden death). */
export function simulatePenalties(
  userRoster: Roster,
  getCard: CardLookup,
  opponentKeeperSave: number,
  opponentTakerScore: number,
  rng: RNG,
): PenaltyShootoutResult {
  const userTakers = takerOrder(userRoster, getCard);
  const userKeeper = userRoster.keeper
    ? getCard(userRoster.keeper.playerCardId)
    : undefined;
  const userKeeperScore = keeperSaveScore(userKeeper);

  let user = 0;
  let opp = 0;

  const takeUser = (round: number) => {
    const taker = userTakers[round % Math.max(1, userTakers.length)];
    const takerScore =
      taker.penaltyTaking * 0.45 +
      taker.composure * 0.25 +
      taker.tournamentAura * 0.2 +
      rng() * 100 * 0.1;
    if (rng() < scoreProbability(takerScore, opponentKeeperSave)) user++;
  };
  const takeOpp = () => {
    const takerScore = opponentTakerScore + rng() * 100 * 0.1;
    if (rng() < scoreProbability(takerScore, userKeeperScore)) opp++;
  };

  for (let i = 0; i < 5; i++) {
    takeUser(i);
    takeOpp();
  }

  let round = 5;
  while (user === opp && round < 20) {
    takeUser(round);
    takeOpp();
    round++;
  }

  if (user === opp) user++; // guarantee a result in the unlikely tie

  return { userPenalties: user, opponentPenalties: opp, userWins: user > opp };
}

export { keeperSaveScore };
