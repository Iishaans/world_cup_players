import type { NationId, WorldCupDecade } from "@/types";

export interface NationMeta {
  id: NationId;
  name: string;
  flag: string;
  colors: [string, string];
}

export const NATIONS: Record<NationId, NationMeta> = {
  brazil: { id: "brazil", name: "Brazil", flag: "\u{1F1E7}\u{1F1F7}", colors: ["#009c3b", "#ffdf00"] },
  argentina: { id: "argentina", name: "Argentina", flag: "\u{1F1E6}\u{1F1F7}", colors: ["#74acdf", "#ffffff"] },
  germany: { id: "germany", name: "Germany", flag: "\u{1F1E9}\u{1F1EA}", colors: ["#000000", "#dd0000"] },
  france: { id: "france", name: "France", flag: "\u{1F1EB}\u{1F1F7}", colors: ["#0055a4", "#ef4135"] },
  italy: { id: "italy", name: "Italy", flag: "\u{1F1EE}\u{1F1F9}", colors: ["#0066cc", "#ffffff"] },
  spain: { id: "spain", name: "Spain", flag: "\u{1F1EA}\u{1F1F8}", colors: ["#aa151b", "#f1bf00"] },
  netherlands: { id: "netherlands", name: "Netherlands", flag: "\u{1F1F3}\u{1F1F1}", colors: ["#ae4900", "#21468b"] },
  england: { id: "england", name: "England", flag: "\u{1F3F4}\u{E0067}\u{E0062}\u{E0065}\u{E006E}\u{E0067}\u{E007F}", colors: ["#ffffff", "#ce1124"] },
  portugal: { id: "portugal", name: "Portugal", flag: "\u{1F1F5}\u{1F1F9}", colors: ["#006600", "#ff0000"] },
  croatia: { id: "croatia", name: "Croatia", flag: "\u{1F1ED}\u{1F1F7}", colors: ["#ff0000", "#ffffff"] },
  belgium: { id: "belgium", name: "Belgium", flag: "\u{1F1E7}\u{1F1EA}", colors: ["#000000", "#fdda24"] },
  uruguay: { id: "uruguay", name: "Uruguay", flag: "\u{1F1FA}\u{1F1FE}", colors: ["#0038a8", "#ffffff"] },
  colombia: { id: "colombia", name: "Colombia", flag: "\u{1F1E8}\u{1F1F4}", colors: ["#fcd116", "#003893"] },
  mexico: { id: "mexico", name: "Mexico", flag: "\u{1F1F2}\u{1F1FD}", colors: ["#006847", "#ce1126"] },
  morocco: { id: "morocco", name: "Morocco", flag: "\u{1F1F2}\u{1F1E6}", colors: ["#c1272d", "#006233"] },
  nigeria: { id: "nigeria", name: "Nigeria", flag: "\u{1F1F3}\u{1F1EC}", colors: ["#008751", "#ffffff"] },
  cameroon: { id: "cameroon", name: "Cameroon", flag: "\u{1F1E8}\u{1F1F2}", colors: ["#007a5e", "#ce1126"] },
  denmark: { id: "denmark", name: "Denmark", flag: "\u{1F1E9}\u{1F1F0}", colors: ["#c60c30", "#ffffff"] },
  romania: { id: "romania", name: "Romania", flag: "\u{1F1F7}\u{1F1F4}", colors: ["#002b7f", "#fcd116"] },
  bulgaria: { id: "bulgaria", name: "Bulgaria", flag: "\u{1F1E7}\u{1F1EC}", colors: ["#00966e", "#d62612"] },
  sweden: { id: "sweden", name: "Sweden", flag: "\u{1F1F8}\u{1F1EA}", colors: ["#006aa7", "#fecc00"] },
  poland: { id: "poland", name: "Poland", flag: "\u{1F1F5}\u{1F1F1}", colors: ["#dc143c", "#ffffff"] },
  usa: { id: "usa", name: "USA", flag: "\u{1F1FA}\u{1F1F8}", colors: ["#3c3b6e", "#b22234"] },
  japan: { id: "japan", name: "Japan", flag: "\u{1F1EF}\u{1F1F5}", colors: ["#bc002d", "#ffffff"] },
  "south-korea": { id: "south-korea", name: "South Korea", flag: "\u{1F1F0}\u{1F1F7}", colors: ["#003478", "#c60c30"] },
  ghana: { id: "ghana", name: "Ghana", flag: "\u{1F1EC}\u{1F1ED}", colors: ["#006b3f", "#fcd116"] },
  senegal: { id: "senegal", name: "Senegal", flag: "\u{1F1F8}\u{1F1F3}", colors: ["#00853f", "#fdef42"] },
};

export function nationName(id: NationId): string {
  return NATIONS[id]?.name ?? id;
}

export function nationFlag(id: NationId): string {
  return NATIONS[id]?.flag ?? "\u{1F3F3}\u{FE0F}";
}

export const DECADE_TO_WORLD_CUPS: Record<WorldCupDecade, number[]> = {
  "1960s": [1962, 1966],
  "1970s": [1970, 1974, 1978],
  "1980s": [1982, 1986],
  "1990s": [1990, 1994, 1998],
  "2000s": [2002, 2006],
  "2010s": [2010, 2014, 2018],
  "2020s": [2022, 2026],
};

export const ALL_DECADES: WorldCupDecade[] = [
  "1960s",
  "1970s",
  "1980s",
  "1990s",
  "2000s",
  "2010s",
  "2020s",
];

/** Feature flag: include the (stubbed) 2026 World Cup pool in the 2020s. */
export const ENABLE_2026 = false;
