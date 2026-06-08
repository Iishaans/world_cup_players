import type {
  GameMode,
  MatchResult,
  OpponentTeam,
  Roster,
  TeamVector,
  TournamentResult,
  TournamentStage,
} from "@/types";
import { ROLES } from "@/types";
import {
  clamp,
  createSeededRandom,
  normalSample,
  poissonSample,
  weightedIndex,
  type RNG,
} from "./rng";
import type { CardLookup } from "./chemistry";
import { computeChemistry } from "./chemistry";
import { computeTeamVector } from "./teamVector";
import { simulatePenalties } from "./penalties";
import {
  generateMatchNotes,
  generateStrengths,
  generateWeaknesses,
} from "./explanations";
import { computeScore } from "./scoring";

const STAGES: TournamentStage[] = [
  "group_1",
  "group_2",
  "group_3",
  "round_of_16",
  "quarter_final",
  "semi_final",
  "final",
];

const KNOCKOUT_STAGES: TournamentStage[] = [
  "round_of_16",
  "quarter_final",
  "semi_final",
  "final",
];

const BASE_XG = 2.2;

function attackRating(v: TeamVector): number {
  return (
    v.finishing * 0.3 +
    v.creation * 0.25 +
    v.transitionThreat * 0.18 +
    v.ballRetention * 0.15 +
    v.chemistry * 0.07 +
    v.tournamentAura * 0.05
  );
}

function defenceRating(v: TeamVector): number {
  return (
    v.defensiveSecurity * 0.32 +
    v.pressing * 0.16 +
    v.goalkeeping * 0.25 +
    v.ballRetention * 0.1 +
    v.chemistry * 0.07 +
    v.tournamentAura * 0.1
  );
}

export function getMatchupModifier(
  user: TeamVector,
  opponent: OpponentTeam,
): number {
  switch (opponent.style) {
    case "possession":
      return (user.pressing + user.ballRetention - 180) / 80;
    case "counter_attack":
      return (user.defensiveSecurity + user.goalkeeping - 175) / 85;
    case "low_block":
      return (user.creation + user.finishing - 180) / 80;
    case "high_press":
      return (user.ballRetention + user.chemistry - 175) / 80;
    case "physical":
      return (user.defensiveSecurity + user.pressing - 170) / 90;
    default:
      return 0;
  }
}

export function getKnockoutAuraModifier(
  userAura: number,
  opponentAura: number,
  stage: TournamentStage,
  rng: RNG,
): number {
  if (!KNOCKOUT_STAGES.includes(stage)) return 0;
  const stageMultiplier =
    stage === "final"
      ? 1.3
      : stage === "semi_final"
        ? 1.15
        : stage === "quarter_final"
          ? 1.05
          : 1.0;
  const auraDelta = (userAura - opponentAura) / 100;
  const noise = normalSample(0, 0.12, rng);
  return (auraDelta * 0.35 + noise) * stageMultiplier;
}

export function simulateMatch(
  userVector: TeamVector,
  opponent: OpponentTeam,
  stage: TournamentStage,
  seed: string,
  userRoster: Roster,
  getCard: CardLookup,
): MatchResult {
  const rng = createSeededRandom(`${seed}::${stage}::${opponent.id}`);

  const userAttack = attackRating(userVector);
  const userDefence = defenceRating(userVector);
  const oppAttack = attackRating(opponent.vector);
  const oppDefence = defenceRating(opponent.vector);

  const matchupModifier = getMatchupModifier(userVector, opponent);
  const auraModifier = getKnockoutAuraModifier(
    userVector.tournamentAura,
    opponent.vector.tournamentAura,
    stage,
    rng,
  );

  let xgFor = BASE_XG + (userAttack - oppDefence) / 18 + matchupModifier + auraModifier;
  let xgAgainst = BASE_XG + (oppAttack - userDefence) / 18 - matchupModifier - auraModifier;
  xgFor = clamp(xgFor, 0.4, 6.5);
  xgAgainst = clamp(xgAgainst, 0.4, 6.5);

  let userGoals = poissonSample(xgFor, rng);
  let opponentGoals = poissonSample(xgAgainst, rng);

  const isKnockout = KNOCKOUT_STAGES.includes(stage);
  let wentToExtraTime = false;
  let wentToPenalties = false;
  let penaltyResult: MatchResult["penaltyResult"];

  if (isKnockout && userGoals === opponentGoals) {
    wentToExtraTime = true;
    // Extra time: a short, lower-scoring period.
    const etFor = poissonSample(xgFor * 0.3, rng);
    const etAgainst = poissonSample(xgAgainst * 0.3, rng);
    userGoals += etFor;
    opponentGoals += etAgainst;

    if (userGoals === opponentGoals) {
      wentToPenalties = true;
      const oppKeeperSave = opponent.vector.goalkeeping;
      const oppTakerScore =
        opponent.vector.finishing * 0.5 + opponent.vector.tournamentAura * 0.5;
      const shootout = simulatePenalties(
        userRoster,
        getCard,
        oppKeeperSave,
        oppTakerScore,
        rng,
      );
      penaltyResult = {
        userPenalties: shootout.userPenalties,
        opponentPenalties: shootout.opponentPenalties,
      };
    }
  }

  let outcome: "win" | "loss";
  if (wentToPenalties && penaltyResult) {
    outcome =
      penaltyResult.userPenalties > penaltyResult.opponentPenalties
        ? "win"
        : "loss";
  } else if (userGoals > opponentGoals) {
    outcome = "win";
  } else if (userGoals < opponentGoals) {
    outcome = "loss";
  } else {
    // Group stage draw: decide by xG edge so the 7-0 objective stays binary.
    outcome = xgFor >= xgAgainst ? "win" : "loss";
    if (outcome === "win") userGoals = opponentGoals + 1;
    else opponentGoals = userGoals + 1;
  }

  const result: MatchResult = {
    stage,
    opponentId: opponent.id,
    opponentName: opponent.name,
    userGoals,
    opponentGoals,
    wentToExtraTime,
    wentToPenalties,
    penaltyResult,
    outcome,
    xgFor: Math.round(xgFor * 100) / 100,
    xgAgainst: Math.round(xgAgainst * 100) / 100,
    notes: [],
  };
  result.notes = generateMatchNotes(result, userVector, opponent);
  return result;
}

/** Choose 7 opponents of increasing difficulty for the bracket. */
export function selectTournamentOpponents(
  seed: string,
  pool: OpponentTeam[],
): OpponentTeam[] {
  const sorted = [...pool].sort((a, b) => a.difficulty - b.difficulty);
  const rng = createSeededRandom(`${seed}::bracket`);
  const n = sorted.length;

  // Window centres rise across the seven stages.
  const centres = [0.12, 0.25, 0.38, 0.55, 0.7, 0.85, 0.97];
  const used = new Set<string>();
  const chosen: OpponentTeam[] = [];

  for (const centre of centres) {
    const centreIdx = Math.round(centre * (n - 1));
    const lo = Math.max(0, centreIdx - 2);
    const hi = Math.min(n - 1, centreIdx + 2);
    const candidates: OpponentTeam[] = [];
    for (let i = lo; i <= hi; i++) {
      if (!used.has(sorted[i].id)) candidates.push(sorted[i]);
    }
    let pickList = candidates.length ? candidates : sorted.filter((o) => !used.has(o.id));
    if (!pickList.length) pickList = sorted;
    const idx = weightedIndex(
      rng,
      pickList.map((_, i) => pickList.length - i),
    );
    const opp = pickList[idx];
    used.add(opp.id);
    chosen.push(opp);
  }
  return chosen;
}

export interface SimulateTournamentArgs {
  roster: Roster;
  getCard: CardLookup;
  seed: string;
  mode: GameMode;
  opponents: OpponentTeam[];
}

export function simulateTournament({
  roster,
  getCard,
  seed,
  mode,
  opponents,
}: SimulateTournamentArgs): TournamentResult {
  const teamVector = computeTeamVector(roster, getCard);
  const chemistryBreakdown = computeChemistry(roster, getCard);
  const bracket = selectTournamentOpponents(seed, opponents);

  const matches: MatchResult[] = [];
  let wins = 0;
  let losses = 0;
  let eliminatedStage: TournamentStage | undefined;
  let goalsFor = 0;
  let goalsAgainst = 0;

  for (let i = 0; i < STAGES.length; i++) {
    const stage = STAGES[i];
    const opponent = bracket[i] ?? bracket[bracket.length - 1];
    const match = simulateMatch(teamVector, opponent, stage, seed, roster, getCard);
    matches.push(match);
    goalsFor += match.userGoals;
    goalsAgainst += match.opponentGoals;
    if (match.outcome === "win") {
      wins++;
    } else {
      losses++;
      if (!eliminatedStage) eliminatedStage = stage;
    }
  }

  const champion = wins === 7;
  const goalDifference = goalsFor - goalsAgainst;

  const strengths = generateStrengths(teamVector, roster);
  const weaknesses = generateWeaknesses(teamVector, roster);
  const mvpPlayerCardId = pickMvp(roster, teamVector);
  const score = computeScore({
    mode,
    wins,
    champion,
    goalDifference,
    teamVector,
  });

  const shareText = buildShareText({
    roster,
    getCard,
    wins,
    losses,
    champion,
    matches,
    teamVector,
    weaknesses,
  });

  return {
    record: { wins, losses },
    champion,
    eliminatedStage,
    matches,
    teamVector,
    chemistryBreakdown,
    strengths,
    weaknesses,
    mvpPlayerCardId,
    shareText,
    score,
  };
}

function pickMvp(roster: Roster, vector: TeamVector): string | undefined {
  // Reward the role tied to the team's strongest dimension.
  const dims: [string, number, string][] = [
    ["finisher", vector.finishing, "finisher"],
    ["carrier", vector.creation, "carrier"],
    ["controller", vector.ballRetention, "controller"],
    ["stopper", vector.defensiveSecurity, "stopper"],
    ["keeper", vector.goalkeeping, "keeper"],
  ];
  dims.sort((a, b) => b[1] - a[1]);
  for (const [, , role] of dims) {
    const sel = roster[role as keyof Roster];
    if (sel) return sel.playerCardId;
  }
  return undefined;
}

interface ShareArgs {
  roster: Roster;
  getCard: CardLookup;
  wins: number;
  losses: number;
  champion: boolean;
  matches: MatchResult[];
  teamVector: TeamVector;
  weaknesses: string[];
}

function buildShareText({
  roster,
  getCard,
  wins,
  losses,
  champion,
  matches,
  teamVector,
  weaknesses,
}: ShareArgs): string {
  const lines: string[] = [];
  lines.push("WORLD CUP 5S");
  lines.push("");
  for (const role of ROLES) {
    const sel = roster[role];
    if (!sel) continue;
    const card = getCard(sel.playerCardId);
    if (!card) continue;
    const label = role.charAt(0).toUpperCase() + role.slice(1);
    lines.push(`${card.shortName ?? card.name} ${card.decade} — ${label}`);
  }
  lines.push("");
  lines.push(`Result: ${wins}-${losses}${champion ? " \u{1F3C6}" : ""}`);
  const final = matches[matches.length - 1];
  if (final) {
    lines.push(
      `Final: ${final.outcome === "win" ? "Beat" : "Lost to"} ${final.opponentName} ${final.userGoals}-${final.opponentGoals}`,
    );
  }
  lines.push(`Aura: ${teamVector.tournamentAura}`);
  lines.push(`Chemistry: ${teamVector.chemistry}`);
  if (weaknesses[0]) lines.push(`Weakness: ${weaknesses[0]}`);
  return lines.join("\n");
}

export { STAGES, KNOCKOUT_STAGES };
