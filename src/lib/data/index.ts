import type { PlayerWorldCupCard } from "@/types";
import { seedCards as baseSeedCards } from "./seedCards";
import { seedCardsExpansion } from "./seedCardsExpansion";

export { seedCardsExpansion } from "./seedCardsExpansion";
export { nationDecadePools, getPool } from "./nationDecadePools";
export { opponents, getOpponent } from "./opponents";
export * from "./nations";

export const seedCards: PlayerWorldCupCard[] = [
  ...baseSeedCards,
  ...seedCardsExpansion,
];

const cardMap = new Map<string, PlayerWorldCupCard>(
  seedCards.map((c) => [c.id, c]),
);

export function getCard(id: string): PlayerWorldCupCard | undefined {
  return cardMap.get(id);
}

export function getCards(ids: string[]): PlayerWorldCupCard[] {
  return ids
    .map((id) => cardMap.get(id))
    .filter((c): c is PlayerWorldCupCard => Boolean(c));
}

export function allCards(): PlayerWorldCupCard[] {
  return seedCards;
}
