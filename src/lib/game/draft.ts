import type {
  DraftSpin,
  GameConstraints,
  GameMode,
  GameState,
  NationDecadePool,
  NationId,
  PlayerWorldCupCard,
  RerollState,
  WorldCupDecade,
} from "@/types";
import { createSeededRandom, weightedIndex, type RNG } from "./rng";

export const RARITY_WEIGHT: Record<NationDecadePool["rarity"], number> = {
  common: 100,
  uncommon: 55,
  rare: 25,
  challenge: 10,
};

export function getModeConstraints(mode: GameMode): GameConstraints {
  switch (mode) {
    case "hardcore":
      return {
        allowDuplicateNation: false,
        allowDuplicateDecade: false,
        allowDuplicatePlayer: false,
        ratingsVisible: false,
      };
    case "knowledge":
      return {
        allowDuplicateNation: true,
        allowDuplicateDecade: true,
        allowDuplicatePlayer: false,
        ratingsVisible: false,
      };
    case "classic":
    case "daily":
    default:
      return {
        allowDuplicateNation: true,
        allowDuplicateDecade: true,
        allowDuplicatePlayer: false,
        ratingsVisible: true,
      };
  }
}

export function getInitialRerolls(mode: GameMode): RerollState {
  if (mode === "hardcore") return { nation: 0, decade: 0, fullSpin: 1 };
  if (mode === "knowledge") return { nation: 2, decade: 2, fullSpin: 1 };
  return { nation: 3, decade: 3, fullSpin: 2 };
}

export function eligibleCardsForPool(
  pool: NationDecadePool,
  cards: PlayerWorldCupCard[],
): PlayerWorldCupCard[] {
  return cards.filter(
    (c) => c.nation === pool.nation && c.decade === pool.decade,
  );
}

function poolAvailable(
  pool: NationDecadePool,
  gameState: GameState,
  cards: PlayerWorldCupCard[],
): boolean {
  if (!pool.enabled) return false;
  const { constraints } = gameState;
  if (!constraints.allowDuplicateNation && gameState.usedNations.includes(pool.nation))
    return false;
  if (!constraints.allowDuplicateDecade && gameState.usedDecades.includes(pool.decade))
    return false;

  const eligible = eligibleCardsForPool(pool, cards);
  const usable = constraints.allowDuplicatePlayer
    ? eligible
    : eligible.filter((c) => !gameState.usedPlayerCardIds.includes(c.id));
  return usable.length >= 1 && eligible.length >= pool.minEligiblePlayers;
}

function buildSpin(
  pool: NationDecadePool,
  gameState: GameState,
  cards: PlayerWorldCupCard[],
  salt: string,
): DraftSpin {
  const eligible = eligibleCardsForPool(pool, cards);
  const usable = gameState.constraints.allowDuplicatePlayer
    ? eligible
    : eligible.filter((c) => !gameState.usedPlayerCardIds.includes(c.id));
  return {
    id: `${pool.id}:${salt}`,
    nation: pool.nation,
    decade: pool.decade,
    eligibleWorldCups: pool.eligibleWorldCups,
    eligiblePlayerCardIds: usable.map((c) => c.id),
  };
}

function rngForRound(seed: string, round: number, salt: string): RNG {
  return createSeededRandom(`${seed}::round=${round}::${salt}`);
}

/**
 * Generate a draft spin for the current round, respecting mode constraints
 * and weighting pools by rarity. Deterministic for a given seed + salt.
 */
export function generateDraftSpin(
  gameState: GameState,
  pools: NationDecadePool[],
  cards: PlayerWorldCupCard[],
  salt = "base",
): DraftSpin {
  const available = pools.filter((p) => poolAvailable(p, gameState, cards));
  const fallback = available.length > 0 ? available : pools.filter((p) => p.enabled);
  const rng = rngForRound(gameState.seed, gameState.round, salt);
  const weights = fallback.map((p) => RARITY_WEIGHT[p.rarity]);
  const idx = weightedIndex(rng, weights);
  const pool = fallback[idx];
  return buildSpin(pool, gameState, cards, salt);
}

export function rerollNation(
  gameState: GameState,
  pools: NationDecadePool[],
  cards: PlayerWorldCupCard[],
): { spin: DraftSpin; previousNation: NationId; nextNation: NationId } | null {
  const current = gameState.currentSpin;
  if (!current) return null;
  const rng = rngForRound(gameState.seed, gameState.round, `nation:${gameState.rerolls.nation}`);
  // Prefer pools that keep the same decade but change nation.
  const sameDecade = pools.filter(
    (p) =>
      p.decade === current.decade &&
      p.nation !== current.nation &&
      poolAvailable(p, gameState, cards),
  );
  const candidates = sameDecade.length
    ? sameDecade
    : pools.filter((p) => p.nation !== current.nation && poolAvailable(p, gameState, cards));
  if (!candidates.length) return null;
  const idx = weightedIndex(rng, candidates.map((p) => RARITY_WEIGHT[p.rarity]));
  const pool = candidates[idx];
  return {
    spin: buildSpin(pool, gameState, cards, `nation:${gameState.rerolls.nation}`),
    previousNation: current.nation,
    nextNation: pool.nation,
  };
}

export function rerollDecade(
  gameState: GameState,
  pools: NationDecadePool[],
  cards: PlayerWorldCupCard[],
): { spin: DraftSpin; previousDecade: WorldCupDecade; nextDecade: WorldCupDecade } | null {
  const current = gameState.currentSpin;
  if (!current) return null;
  const rng = rngForRound(gameState.seed, gameState.round, `decade:${gameState.rerolls.decade}`);
  const sameNation = pools.filter(
    (p) =>
      p.nation === current.nation &&
      p.decade !== current.decade &&
      poolAvailable(p, gameState, cards),
  );
  const candidates = sameNation.length
    ? sameNation
    : pools.filter((p) => p.decade !== current.decade && poolAvailable(p, gameState, cards));
  if (!candidates.length) return null;
  const idx = weightedIndex(rng, candidates.map((p) => RARITY_WEIGHT[p.rarity]));
  const pool = candidates[idx];
  return {
    spin: buildSpin(pool, gameState, cards, `decade:${gameState.rerolls.decade}`),
    previousDecade: current.decade,
    nextDecade: pool.decade,
  };
}

export function rerollFullSpin(
  gameState: GameState,
  pools: NationDecadePool[],
  cards: PlayerWorldCupCard[],
): { spin: DraftSpin; previousSpinId: string; nextSpinId: string } | null {
  const current = gameState.currentSpin;
  if (!current) return null;
  const spin = generateDraftSpin(
    gameState,
    pools,
    cards,
    `full:${gameState.rerolls.fullSpin}`,
  );
  return { spin, previousSpinId: current.id, nextSpinId: spin.id };
}
