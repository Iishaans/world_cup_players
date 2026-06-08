import type { PlayerWorldCupCard } from "@/types";
import { seedCards } from "./seedCards";

export { seedCards } from "./seedCards";
export { nationDecadePools, getPool } from "./nationDecadePools";
export { opponents, getOpponent } from "./opponents";
export * from "./nations";

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
