import type { DraftRound, GameMode, GameState, Role } from "@/types";
import {
  allCards,
  getCard,
  nationDecadePools,
  opponents,
} from "@/lib/data";
import {
  generateDraftSpin,
  getInitialRerolls,
  getModeConstraints,
  rerollDecade,
  rerollFullSpin,
  rerollNation,
} from "./draft";
import { simulateTournament } from "./simulation";

export function dailySeed(date = new Date()): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function generateSeed(): string {
  return (
    Date.now().toString(36) + Math.random().toString(36).slice(2, 10)
  );
}

function newId(): string {
  return (
    "g_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
  );
}

export function createGame(mode: GameMode, seed?: string): GameState {
  const resolvedSeed =
    mode === "daily" ? `daily-${dailySeed()}` : (seed ?? generateSeed());
  const now = new Date().toISOString();
  const base: GameState = {
    id: newId(),
    seed: resolvedSeed,
    mode,
    status: "drafting",
    round: 1,
    totalRounds: 5,
    currentSpin: undefined,
    draftHistory: [],
    roster: {},
    usedPlayerCardIds: [],
    usedNations: [],
    usedDecades: [],
    rerolls: getInitialRerolls(mode),
    constraints: getModeConstraints(mode),
    createdAt: now,
    updatedAt: now,
  };
  base.currentSpin = generateDraftSpin(base, nationDecadePools, allCards());
  return base;
}

export function selectPlayer(
  state: GameState,
  cardId: string,
  role: Role,
): GameState {
  if (state.status !== "drafting") return state;
  if (state.roster[role]) return state; // role already filled
  const spin = state.currentSpin;
  if (!spin) return state;
  if (!spin.eligiblePlayerCardIds.includes(cardId)) return state;
  const card = getCard(cardId);
  if (!card) return state;

  const round: DraftRound = {
    roundNumber: state.round,
    spin,
    selectedCardId: cardId,
    assignedRole: role,
    rerollsUsed: [],
  };

  const next: GameState = {
    ...state,
    roster: {
      ...state.roster,
      [role]: {
        role,
        playerCardId: cardId,
        nation: card.nation,
        decade: card.decade,
      },
    },
    draftHistory: [...state.draftHistory, round],
    usedPlayerCardIds: [...state.usedPlayerCardIds, cardId],
    usedNations: [...state.usedNations, card.nation],
    usedDecades: [...state.usedDecades, card.decade],
    round: state.round + 1,
    currentSpin: undefined,
    updatedAt: new Date().toISOString(),
  };

  if (next.round > next.totalRounds) {
    next.status = "simulating";
  } else {
    next.currentSpin = generateDraftSpin(next, nationDecadePools, allCards());
  }
  return next;
}

export type RerollKind = "nation" | "decade" | "fullSpin";

export function applyReroll(state: GameState, kind: RerollKind): GameState {
  if (state.status !== "drafting" || !state.currentSpin) return state;
  if (state.rerolls[kind] <= 0) return state;

  let nextSpin = state.currentSpin;

  if (kind === "nation") {
    const r = rerollNation(state, nationDecadePools, allCards());
    if (!r) return state;
    nextSpin = r.spin;
  } else if (kind === "decade") {
    const r = rerollDecade(state, nationDecadePools, allCards());
    if (!r) return state;
    nextSpin = r.spin;
  } else {
    const r = rerollFullSpin(state, nationDecadePools, allCards());
    if (!r) return state;
    nextSpin = r.spin;
  }

  return {
    ...state,
    currentSpin: nextSpin,
    rerolls: { ...state.rerolls, [kind]: state.rerolls[kind] - 1 },
    updatedAt: new Date().toISOString(),
  };
}

export function runSimulation(state: GameState): GameState {
  if (state.status === "complete" && state.result) return state;
  const result = simulateTournament({
    roster: state.roster,
    getCard,
    seed: state.seed,
    mode: state.mode,
    opponents,
  });
  return {
    ...state,
    status: "complete",
    result,
    updatedAt: new Date().toISOString(),
  };
}
