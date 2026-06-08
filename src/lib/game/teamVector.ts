import type {
  PlayerWorldCupCard,
  Role,
  Roster,
  TeamVector,
  Trait,
} from "@/types";
import { ROLES } from "@/types";
import { clamp } from "./rng";
import { computeChemistry, type CardLookup } from "./chemistry";

export function getRoleFitMultiplier(roleFitScore: number): number {
  if (roleFitScore >= 95) return 1.08;
  if (roleFitScore >= 90) return 1.04;
  if (roleFitScore >= 80) return 1.0;
  if (roleFitScore >= 70) return 0.94;
  if (roleFitScore >= 60) return 0.86;
  if (roleFitScore >= 50) return 0.76;
  return 0.62;
}

const AURA_TRAIT_BONUS: Partial<Record<Trait, number>> = {
  big_game_player: 2,
  golden_ball_aura: 3,
  golden_boot_aura: 2,
  world_cup_winner: 2,
  captain: 1,
};

function fit(card: PlayerWorldCupCard, role: Role): number {
  return getRoleFitMultiplier(card.roleFit[role]);
}

function std(values: number[]): number {
  if (values.length === 0) return 0;
  const mean = values.reduce((s, v) => s + v, 0) / values.length;
  const variance =
    values.reduce((s, v) => s + (v - mean) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

export interface TeamVectorResult {
  vector: TeamVector;
  chemistryTotal: number;
}

/**
 * Compute the team vector for a roster. Works on partial rosters too
 * (empty roles simply contribute nothing to their dimension), so it can
 * power the live preview during drafting.
 */
export function computeTeamVector(
  roster: Roster,
  getCard: CardLookup,
): TeamVector {
  const cards: Record<Role, PlayerWorldCupCard | undefined> = {
    keeper: undefined,
    stopper: undefined,
    controller: undefined,
    carrier: undefined,
    finisher: undefined,
  };
  for (const role of ROLES) {
    const sel = roster[role];
    if (sel) cards[role] = getCard(sel.playerCardId);
  }

  const gk = cards.keeper;
  const stopper = cards.stopper;
  const controller = cards.controller;
  const carrier = cards.carrier;
  const finisher = cards.finisher;

  const goalkeeping = gk
    ? ((gk.ratings.goalkeeping ?? gk.ratings.defending) * 0.55 +
        gk.ratings.composure * 0.15 +
        gk.ratings.passing * 0.15 +
        gk.ratings.tournamentAura * 0.1 +
        gk.ratings.pace * 0.05) *
      fit(gk, "keeper")
    : 0;

  const defensiveSecurity = stopper
    ? (stopper.ratings.defending * 0.45 +
        stopper.ratings.physical * 0.18 +
        stopper.ratings.pace * 0.15 +
        stopper.ratings.composure * 0.12 +
        stopper.ratings.tournamentAura * 0.1) *
      fit(stopper, "stopper")
    : 0;

  const ballRetention = controller
    ? (controller.ratings.passing * 0.3 +
        controller.ratings.dribbling * 0.2 +
        controller.ratings.composure * 0.2 +
        controller.ratings.stamina * 0.1 +
        controller.ratings.defending * 0.1 +
        controller.ratings.tournamentAura * 0.1) *
      fit(controller, "controller")
    : 0;

  const creation = carrier
    ? (carrier.ratings.dribbling * 0.3 +
        carrier.ratings.passing * 0.2 +
        carrier.ratings.pace * 0.18 +
        carrier.ratings.shooting * 0.12 +
        carrier.ratings.composure * 0.1 +
        carrier.ratings.tournamentAura * 0.1) *
      fit(carrier, "carrier")
    : 0;

  const finishing = finisher
    ? (finisher.ratings.shooting * 0.4 +
        finisher.ratings.composure * 0.2 +
        finisher.ratings.pace * 0.12 +
        finisher.ratings.physical * 0.1 +
        finisher.ratings.weakFoot * 3 +
        finisher.ratings.tournamentAura * 0.1) *
      fit(finisher, "finisher")
    : 0;

  // Aura: average of selected players' tournamentAura + trait bonuses.
  const selected = ROLES.map((r) => cards[r]).filter(
    (c): c is PlayerWorldCupCard => Boolean(c),
  );
  let auraBonus = 0;
  for (const c of selected) {
    for (const t of c.traits) auraBonus += AURA_TRAIT_BONUS[t] ?? 0;
  }
  const auraBase =
    selected.length > 0
      ? selected.reduce((s, c) => s + c.ratings.tournamentAura, 0) /
        selected.length
      : 0;
  const tournamentAura = clamp(auraBase + auraBonus, 0, 100);

  const transitionThreat =
    (carrier ? carrier.ratings.pace * 0.25 + carrier.ratings.dribbling * 0.2 : 0) +
    (finisher
      ? finisher.ratings.pace * 0.2 + finisher.ratings.shooting * 0.15
      : 0) +
    (controller ? controller.ratings.passing * 0.12 : 0) +
    tournamentAura * 0.08;

  const pressing =
    (stopper
      ? stopper.ratings.stamina * 0.2 + stopper.ratings.defending * 0.2
      : 0) +
    (controller
      ? controller.ratings.stamina * 0.2 + controller.ratings.defending * 0.15
      : 0) +
    (carrier ? carrier.ratings.stamina * 0.15 : 0) +
    (finisher ? finisher.ratings.stamina * 0.1 : 0);

  const chemistry = computeChemistry(roster, getCard).total;

  const balanceDims = [
    finishing,
    creation,
    ballRetention,
    defensiveSecurity,
    goalkeeping,
  ];
  const balance = clamp(100 - std(balanceDims), 0, 100);

  let overall =
    finishing * 0.16 +
    creation * 0.15 +
    ballRetention * 0.14 +
    defensiveSecurity * 0.16 +
    goalkeeping * 0.16 +
    transitionThreat * 0.06 +
    pressing * 0.05 +
    tournamentAura * 0.06 +
    chemistry * 0.06;

  // Apply balance influence and minimum-threshold penalties.
  overall += (balance - 75) * 0.05;
  if (selected.length === 5) {
    if (goalkeeping < 70) overall -= 10;
    if (defensiveSecurity < 70) overall -= 8;
    if (ballRetention < 70) overall -= 6;
    if (finishing < 70) overall -= 6;
  }

  const round = (n: number) => Math.round(clamp(n, 0, 100));

  return {
    finishing: round(finishing),
    creation: round(creation),
    ballRetention: round(ballRetention),
    transitionThreat: round(transitionThreat),
    pressing: round(pressing),
    defensiveSecurity: round(defensiveSecurity),
    goalkeeping: round(goalkeeping),
    tournamentAura: round(tournamentAura),
    chemistry: round(chemistry),
    balance: round(balance),
    overall: round(overall),
  };
}
