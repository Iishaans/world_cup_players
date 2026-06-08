import type {
  ChemistryBreakdown,
  PlayerWorldCupCard,
  Roster,
  Role,
} from "@/types";
import { ROLES } from "@/types";
import { clamp } from "./rng";

export type CardLookup = (id: string) => PlayerWorldCupCard | undefined;

/** Pairs of card ids that have a recognised on-pitch partnership. */
export const knownPartnerships: [string, string][] = [
  ["xavi-spain-2010s", "iniesta-spain-2010s"],
  ["xavi-spain-2010s", "casillas-spain-2010s"],
  ["iniesta-spain-2010s", "busquets-spain-2010s"],
  ["xavi-spain-2010s", "busquets-spain-2010s"],
  ["messi-argentina-2020s", "di-maria-argentina-2020s"],
  ["messi-argentina-2020s", "dibu-martinez-argentina-2020s"],
  ["messi-argentina-2020s", "julian-alvarez-argentina-2020s"],
  ["messi-argentina-2020s", "de-paul-argentina-2020s"],
  ["ronaldo-brazil-2000s", "rivaldo-brazil-2000s"],
  ["ronaldo-brazil-2000s", "ronaldinho-brazil-2000s"],
  ["ronaldinho-brazil-2000s", "kaka-brazil-2000s"],
  ["zidane-france-1990s", "thuram-france-1990s"],
  ["zidane-france-1990s", "deschamps-france-1990s"],
  ["henry-france-2000s", "zidane-france-2000s"],
  ["mbappe-france-2010s", "griezmann-france-2010s"],
  ["mbappe-france-2010s", "kante-france-2010s"],
  ["modric-croatia-2010s", "perisic-croatia-2010s"],
  ["modric-croatia-2010s", "rakitic-croatia-2010s"],
  ["modric-croatia-2010s", "mandzukic-croatia-2010s"],
  ["cannavaro-italy-2000s", "buffon-italy-2000s"],
  ["pirlo-italy-2000s", "totti-italy-2000s"],
  ["ronaldo-brazil-1990s", "romario-brazil-1990s"],
  ["ronaldo-brazil-1990s", "cafu-brazil-1990s"],
  ["maradona-argentina-1980s", "burruchaga-argentina-1980s"],
  ["neuer-germany-2010s", "hummels-germany-2010s"],
  ["kroos-germany-2010s", "muller-germany-2010s"],
  ["xavi-spain-2000s", "casillas-spain-2000s"],
];

const partnershipSet = new Set(
  knownPartnerships.map(([a, b]) => [a, b].sort().join("|")),
);

function isPartnership(a: string, b: string): boolean {
  return partnershipSet.has([a, b].sort().join("|"));
}

function filledCards(roster: Roster, getCard: CardLookup): PlayerWorldCupCard[] {
  const cards: PlayerWorldCupCard[] = [];
  for (const role of ROLES) {
    const sel = roster[role];
    if (!sel) continue;
    const card = getCard(sel.playerCardId);
    if (card) cards.push(card);
  }
  return cards;
}

export function computeChemistry(
  roster: Roster,
  getCard: CardLookup,
): ChemistryBreakdown {
  const cards = filledCards(roster, getCard);

  let sameNation = 0;
  let sameDecade = 0;
  let sameWorldCup = 0;
  let winnerAura = 0;
  let knownPartnershipsScore = 0;
  let tacticalSynergy = 0;
  let penalties = 0;

  for (let i = 0; i < cards.length; i++) {
    for (let j = i + 1; j < cards.length; j++) {
      const a = cards[i];
      const b = cards[j];
      if (a.nation === b.nation) sameNation += 5;
      if (a.decade === b.decade) sameDecade += 2;
      const sharedWc = a.worldCups.some((w) => b.worldCups.includes(w));
      if (sharedWc) sameWorldCup += 3;
      const bothWon =
        a.worldCupProfile.winner &&
        b.worldCupProfile.winner &&
        a.worldCups.some(
          (w) => b.worldCups.includes(w) && b.worldCupProfile.winner,
        );
      if (bothWon) winnerAura += 4;
      if (isPartnership(a.id, b.id)) knownPartnershipsScore += 5;
    }
  }

  // Tactical synergy: complementary defensive / creative balance.
  const hasAnchor = cards.some(
    (c) => c.roleFit.stopper >= 80 || c.traits.includes("lockdown_defender"),
  );
  const hasCreator = cards.some(
    (c) =>
      c.roleFit.controller >= 85 ||
      c.traits.includes("tempo_setter") ||
      c.traits.includes("final_ball_specialist"),
  );
  const hasFinisher = cards.some(
    (c) => c.roleFit.finisher >= 85 || c.traits.includes("clutch_finisher"),
  );
  if (hasAnchor && hasCreator) tacticalSynergy += 3;
  if (hasCreator && hasFinisher) tacticalSynergy += 3;

  // Structural penalties (only meaningful once the roster is filling out).
  const liabilities = cards.filter((c) =>
    c.traits.includes("defensive_liability"),
  ).length;
  if (liabilities >= 2) penalties -= 6;

  const naturalDefender = cards.some((c) => c.roleFit.stopper >= 75);
  const naturalKeeper = roster.keeper
    ? (getCard(roster.keeper.playerCardId)?.roleFit.keeper ?? 0) >= 75
    : false;
  const naturalCreator = cards.some((c) => c.roleFit.controller >= 80);
  const naturalFinisher = cards.some((c) => c.roleFit.finisher >= 80);

  const complete = cards.length === 5;
  if (complete) {
    if (!naturalDefender) penalties -= 10;
    if (!naturalKeeper) penalties -= 20;
    if (!naturalCreator) penalties -= 6;
    if (!naturalFinisher) penalties -= 6;
  }

  const raw =
    50 +
    sameNation +
    sameDecade +
    sameWorldCup +
    winnerAura +
    knownPartnershipsScore +
    tacticalSynergy +
    penalties;

  const total = clamp(raw, 35, 100);

  return {
    sameNation,
    sameDecade,
    sameWorldCup,
    winnerAura,
    knownPartnerships: knownPartnershipsScore,
    tacticalSynergy,
    penalties,
    total,
  };
}

export function partnershipsInRoster(
  roster: Roster,
): [Role, Role][] {
  const result: [Role, Role][] = [];
  for (let i = 0; i < ROLES.length; i++) {
    for (let j = i + 1; j < ROLES.length; j++) {
      const a = roster[ROLES[i]];
      const b = roster[ROLES[j]];
      if (a && b && isPartnership(a.playerCardId, b.playerCardId)) {
        result.push([ROLES[i], ROLES[j]]);
      }
    }
  }
  return result;
}
