import type { NationDecadePool, Rarity } from "@/types";
import { DECADE_TO_WORLD_CUPS } from "./nations";
import type { WorldCupDecade, NationId } from "@/types";

const BIG_NATIONS = new Set<NationId>([
  "brazil",
  "argentina",
  "germany",
  "france",
  "italy",
  "england",
  "spain",
  "netherlands",
  "portugal",
]);

function pool(
  nation: NationId,
  decade: WorldCupDecade,
  rarity: Rarity,
  starDepth: number,
  eligibleWorldCups?: number[],
): NationDecadePool {
  const minEligiblePlayers = BIG_NATIONS.has(nation) ? 10 : 5;
  return {
    id: `${nation}-${decade}`,
    nation,
    decade,
    eligibleWorldCups: eligibleWorldCups ?? DECADE_TO_WORLD_CUPS[decade],
    minEligiblePlayers,
    starDepth,
    rarity,
    enabled: true,
  };
}

export const nationDecadePools: NationDecadePool[] = [
  // Brazil
  pool("brazil", "1970s", "uncommon", 9, [1970, 1974, 1978]),
  pool("brazil", "1980s", "uncommon", 7, [1982, 1986]),
  pool("brazil", "1990s", "common", 10, [1990, 1994, 1998]),
  pool("brazil", "2000s", "common", 10, [2002, 2006]),
  pool("brazil", "2010s", "common", 9, [2014, 2018]),
  pool("brazil", "2020s", "common", 8, [2022]),
  // Argentina
  pool("argentina", "1980s", "uncommon", 8, [1982, 1986]),
  pool("argentina", "1990s", "common", 7, [1994, 1998]),
  pool("argentina", "2000s", "common", 7, [2002, 2006]),
  pool("argentina", "2010s", "common", 9, [2010, 2014, 2018]),
  pool("argentina", "2020s", "common", 10, [2022]),
  // Germany / West Germany
  pool("germany", "1990s", "common", 8, [1990, 1994, 1998]),
  pool("germany", "2000s", "common", 8, [2002, 2006]),
  pool("germany", "2010s", "common", 9, [2010, 2014, 2018]),
  pool("germany", "2020s", "uncommon", 6, [2022]),
  // France
  pool("france", "1980s", "uncommon", 7, [1982, 1986]),
  pool("france", "1990s", "common", 9, [1998]),
  pool("france", "2000s", "common", 8, [2002, 2006]),
  pool("france", "2010s", "common", 10, [2014, 2018]),
  pool("france", "2020s", "common", 8, [2022]),
  // Italy
  pool("italy", "1990s", "common", 8, [1990, 1994, 1998]),
  pool("italy", "2000s", "common", 10, [2002, 2006]),
  pool("italy", "2010s", "uncommon", 6, [2010, 2014]),
  // Spain
  pool("spain", "2000s", "uncommon", 7, [2002, 2006]),
  pool("spain", "2010s", "common", 9, [2010, 2014]),
  // Netherlands
  pool("netherlands", "1990s", "uncommon", 7, [1994, 1998]),
  pool("netherlands", "2010s", "common", 8, [2010, 2014]),
  // England
  pool("england", "1990s", "uncommon", 7, [1998]),
  pool("england", "2010s", "common", 7, [2018]),
  pool("england", "2020s", "common", 7, [2022]),
  // Portugal
  pool("portugal", "2000s", "uncommon", 7, [2006]),
  pool("portugal", "2010s", "common", 8, [2010, 2014, 2018]),
  pool("portugal", "2020s", "common", 8, [2022]),
  // Croatia
  pool("croatia", "1990s", "rare", 5, [1998]),
  pool("croatia", "2010s", "common", 8, [2014, 2018]),
  pool("croatia", "2020s", "uncommon", 6, [2022]),
  // Uruguay
  pool("uruguay", "2010s", "uncommon", 6, [2010, 2014, 2018]),
  pool("uruguay", "2020s", "uncommon", 6, [2022]),
  // Colombia
  pool("colombia", "1990s", "rare", 5, [1990, 1994, 1998]),
  pool("colombia", "2010s", "uncommon", 6, [2014, 2018]),
  // Mexico
  pool("mexico", "1990s", "challenge", 3, [1994, 1998]),
  pool("mexico", "2000s", "rare", 4, [2002, 2006]),
  pool("mexico", "2010s", "uncommon", 5, [2010, 2014, 2018]),
  // Morocco
  pool("morocco", "2020s", "uncommon", 6, [2022]),
  // Nigeria
  pool("nigeria", "1990s", "rare", 4, [1994, 1998]),
  // Cameroon
  pool("cameroon", "1990s", "challenge", 3, [1990, 1994]),
  pool("cameroon", "2000s", "challenge", 3, [2002]),
  // Denmark
  pool("denmark", "1980s", "challenge", 4, [1986]),
  pool("denmark", "1990s", "rare", 4, [1998]),
  pool("denmark", "2020s", "rare", 4, [2022]),
  // Romania
  pool("romania", "1990s", "rare", 5, [1990, 1994, 1998]),
  // Bulgaria
  pool("bulgaria", "1990s", "rare", 5, [1994, 1998]),
  // Sweden
  pool("sweden", "1990s", "rare", 4, [1990, 1994]),
  pool("sweden", "2000s", "challenge", 3, [2002, 2006]),
  // Poland
  pool("poland", "1970s", "challenge", 3, [1974, 1978]),
  pool("poland", "2020s", "rare", 4, [2022]),
  // USA
  pool("usa", "2000s", "rare", 4, [2002, 2006]),
  pool("usa", "2010s", "challenge", 3, [2010, 2014]),
  pool("usa", "2020s", "uncommon", 4, [2022]),
  // Japan
  pool("japan", "2000s", "rare", 4, [2002, 2006]),
  pool("japan", "2010s", "rare", 4, [2010, 2014, 2018]),
  pool("japan", "2020s", "uncommon", 5, [2022]),
  // South Korea
  pool("south-korea", "2000s", "rare", 4, [2002, 2006]),
  pool("south-korea", "2010s", "rare", 4, [2010, 2014, 2018]),
  pool("south-korea", "2020s", "uncommon", 5, [2022]),
  // Ghana
  pool("ghana", "2000s", "challenge", 3, [2006]),
  pool("ghana", "2010s", "rare", 4, [2010, 2014]),
  // Senegal
  pool("senegal", "2000s", "challenge", 3, [2002]),
  pool("senegal", "2020s", "uncommon", 5, [2022]),
];

export function getPool(id: string): NationDecadePool | undefined {
  return nationDecadePools.find((p) => p.id === id);
}
