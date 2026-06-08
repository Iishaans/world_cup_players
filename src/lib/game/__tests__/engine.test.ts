import { describe, it, expect } from "vitest";
import {
  createSeededRandom,
  poissonSample,
  getRoleFitMultiplier,
  computeTeamVector,
  computeChemistry,
  generateDraftSpin,
  simulatePenalties,
  simulateTournament,
  createGame,
  selectPlayer,
  dailySeed,
  getModeConstraints,
} from "@/lib/game";
import { allCards, getCard, nationDecadePools, opponents } from "@/lib/data";
import type { GameState, Roster } from "@/types";

// A fixed, balanced reference roster used across several tests.
const referenceRoster: Roster = {
  keeper: { role: "keeper", playerCardId: "neuer-germany-2010s", nation: "germany", decade: "2010s" },
  stopper: { role: "stopper", playerCardId: "cannavaro-italy-2000s", nation: "italy", decade: "2000s" },
  controller: { role: "controller", playerCardId: "modric-croatia-2010s", nation: "croatia", decade: "2010s" },
  carrier: { role: "carrier", playerCardId: "maradona-argentina-1980s", nation: "argentina", decade: "1980s" },
  finisher: { role: "finisher", playerCardId: "ronaldo-brazil-1990s", nation: "brazil", decade: "1990s" },
};

describe("seeded RNG", () => {
  it("returns deterministic results for the same seed", () => {
    const a = createSeededRandom("hello");
    const b = createSeededRandom("hello");
    const seqA = Array.from({ length: 5 }, () => a());
    const seqB = Array.from({ length: 5 }, () => b());
    expect(seqA).toEqual(seqB);
  });

  it("returns different streams for different seeds", () => {
    const a = createSeededRandom("seed-1");
    const b = createSeededRandom("seed-2");
    expect(a()).not.toBe(b());
  });

  it("produces values in [0,1)", () => {
    const rng = createSeededRandom("range");
    for (let i = 0; i < 1000; i++) {
      const v = rng();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });

  it("poissonSample is non-negative and deterministic", () => {
    const r1 = createSeededRandom("p");
    const r2 = createSeededRandom("p");
    const s1 = Array.from({ length: 10 }, () => poissonSample(2.2, r1));
    const s2 = Array.from({ length: 10 }, () => poissonSample(2.2, r2));
    expect(s1).toEqual(s2);
    expect(s1.every((n) => n >= 0)).toBe(true);
  });
});

describe("getRoleFitMultiplier", () => {
  it("rewards great fits and punishes poor ones", () => {
    expect(getRoleFitMultiplier(99)).toBe(1.08);
    expect(getRoleFitMultiplier(80)).toBe(1.0);
    expect(getRoleFitMultiplier(40)).toBe(0.62);
  });

  it("is monotonic non-decreasing", () => {
    let prev = 0;
    for (let s = 0; s <= 100; s++) {
      const m = getRoleFitMultiplier(s);
      expect(m).toBeGreaterThanOrEqual(prev);
      prev = m;
    }
  });
});

describe("computeTeamVector", () => {
  it("produces bounded outputs for a strong roster", () => {
    const v = computeTeamVector(referenceRoster, getCard);
    for (const key of Object.keys(v) as (keyof typeof v)[]) {
      expect(v[key]).toBeGreaterThanOrEqual(0);
      expect(v[key]).toBeLessThanOrEqual(100);
    }
    expect(v.goalkeeping).toBeGreaterThan(85);
    expect(v.finishing).toBeGreaterThan(85);
    expect(v.defensiveSecurity).toBeGreaterThan(85);
  });

  it("penalises a five-attacker team's defensive dimensions", () => {
    const attackers: Roster = {
      keeper: { role: "keeper", playerCardId: "ronaldo-brazil-1990s", nation: "brazil", decade: "1990s" },
      stopper: { role: "stopper", playerCardId: "messi-argentina-2020s", nation: "argentina", decade: "2020s" },
      controller: { role: "controller", playerCardId: "mbappe-france-2020s", nation: "france", decade: "2020s" },
      carrier: { role: "carrier", playerCardId: "neymar-brazil-2010s", nation: "brazil", decade: "2010s" },
      finisher: { role: "finisher", playerCardId: "vinicius-brazil-2020s", nation: "brazil", decade: "2020s" },
    };
    const balanced = computeTeamVector(referenceRoster, getCard);
    const allAttack = computeTeamVector(attackers, getCard);
    expect(allAttack.goalkeeping).toBeLessThan(balanced.goalkeeping);
    expect(allAttack.overall).toBeLessThan(balanced.overall + 5);
  });
});

describe("computeChemistry", () => {
  it("detects same-nation bonuses", () => {
    const sameNation: Roster = {
      keeper: { role: "keeper", playerCardId: "alisson-brazil-2020s", nation: "brazil", decade: "2020s" },
      stopper: { role: "stopper", playerCardId: "marquinhos-brazil-2020s", nation: "brazil", decade: "2020s" },
      controller: { role: "controller", playerCardId: "casemiro-brazil-2020s", nation: "brazil", decade: "2020s" },
      carrier: { role: "carrier", playerCardId: "neymar-brazil-2020s", nation: "brazil", decade: "2020s" },
      finisher: { role: "finisher", playerCardId: "richarlison-brazil-2020s", nation: "brazil", decade: "2020s" },
    };
    const chem = computeChemistry(sameNation, getCard);
    expect(chem.sameNation).toBeGreaterThan(0);
    expect(chem.sameDecade).toBeGreaterThan(0);
    expect(chem.total).toBeGreaterThan(60);
  });

  it("caps chemistry between 35 and 100", () => {
    const chem = computeChemistry(referenceRoster, getCard);
    expect(chem.total).toBeGreaterThanOrEqual(35);
    expect(chem.total).toBeLessThanOrEqual(100);
  });
});

describe("draft generation", () => {
  function stateWith(partial: Partial<GameState>): GameState {
    return {
      ...createGame("classic", "test-seed"),
      ...partial,
    };
  }

  it("respects duplicate nation constraints in hardcore mode", () => {
    const base = createGame("hardcore", "hc-seed");
    const used: GameState = {
      ...base,
      usedNations: ["brazil"],
      constraints: getModeConstraints("hardcore"),
    };
    for (let r = 1; r <= 5; r++) {
      const spin = generateDraftSpin(
        { ...used, round: r },
        nationDecadePools,
        allCards(),
      );
      expect(spin.nation).not.toBe("brazil");
    }
  });

  it("respects duplicate decade constraints in hardcore mode", () => {
    const base = createGame("hardcore", "hc-seed-2");
    const used: GameState = {
      ...base,
      usedDecades: ["2020s"],
      constraints: getModeConstraints("hardcore"),
    };
    for (let r = 1; r <= 5; r++) {
      const spin = generateDraftSpin(
        { ...used, round: r },
        nationDecadePools,
        allCards(),
      );
      expect(spin.decade).not.toBe("2020s");
    }
  });

  it("only offers eligible (unused) players when duplicates are disallowed", () => {
    const base = stateWith({ usedPlayerCardIds: ["messi-argentina-2020s"] });
    const spin = generateDraftSpin(base, nationDecadePools, allCards());
    expect(spin.eligiblePlayerCardIds).not.toContain("messi-argentina-2020s");
  });

  it("is deterministic for the same seed", () => {
    const a = generateDraftSpin(stateWith({}), nationDecadePools, allCards());
    const b = generateDraftSpin(stateWith({}), nationDecadePools, allCards());
    expect(a).toEqual(b);
  });
});

describe("hardcore mode constraints", () => {
  it("enforces unique nations and decades through a full draft", () => {
    let game = createGame("hardcore", "hardcore-full");
    const nations = new Set<string>();
    const decades = new Set<string>();
    for (let i = 0; i < 5; i++) {
      const spin = game.currentSpin!;
      expect(nations.has(spin.nation)).toBe(false);
      expect(decades.has(spin.decade)).toBe(false);
      nations.add(spin.nation);
      decades.add(spin.decade);
      const cardId = spin.eligiblePlayerCardIds[0];
      const roles = ["keeper", "stopper", "controller", "carrier", "finisher"] as const;
      game = selectPlayer(game, cardId, roles[i]);
    }
    expect(game.status).toBe("simulating");
  });
});

describe("penalty simulation", () => {
  it("is bounded and deterministic for the same seed", () => {
    const r1 = createSeededRandom("pens");
    const r2 = createSeededRandom("pens");
    const a = simulatePenalties(referenceRoster, getCard, 85, 88, r1);
    const b = simulatePenalties(referenceRoster, getCard, 85, 88, r2);
    expect(a).toEqual(b);
    expect(a.userPenalties).toBeGreaterThanOrEqual(0);
    expect(a.opponentPenalties).toBeGreaterThanOrEqual(0);
    expect(a.userWins).toBe(a.userPenalties > a.opponentPenalties);
  });
});

describe("tournament simulation", () => {
  it("is deterministic for the same seed", () => {
    const a = simulateTournament({ roster: referenceRoster, getCard, seed: "sim-seed", mode: "classic", opponents });
    const b = simulateTournament({ roster: referenceRoster, getCard, seed: "sim-seed", mode: "classic", opponents });
    expect(a.record).toEqual(b.record);
    expect(a.score).toBe(b.score);
    expect(a.matches.map((m) => m.userGoals)).toEqual(b.matches.map((m) => m.userGoals));
  });

  it("stops after a knockout loss", () => {
    const res = simulateTournament({ roster: referenceRoster, getCard, seed: "seven", mode: "classic", opponents });
    const played = res.matches.length;
    expect(played).toBeGreaterThanOrEqual(1);
    expect(played).toBeLessThanOrEqual(7);
    expect(res.record.wins + res.record.losses).toBe(played);
    expect(res.champion).toBe(res.record.wins === 7 && played === 7);
    if (res.eliminatedStage && res.matches[res.matches.length - 1]?.outcome === "loss") {
      const last = res.matches[res.matches.length - 1];
      const knockoutLoss =
        last && ["round_of_16", "quarter_final", "semi_final", "final"].includes(last.stage);
      const twoGroupLosses =
        res.matches.filter(
          (m) =>
            ["group_1", "group_2", "group_3"].includes(m.stage) && m.outcome === "loss",
        ).length >= 2;
      expect(knockoutLoss || twoGroupLosses).toBe(true);
    }
  });

  it("eliminates after two group-stage losses without playing knockouts", () => {
    const weakRoster = {
      keeper: { playerCardId: "taffarel-brazil-1990s", role: "keeper" as const },
      stopper: { playerCardId: "taffarel-brazil-1990s", role: "stopper" as const },
      controller: { playerCardId: "taffarel-brazil-1990s", role: "controller" as const },
      carrier: { playerCardId: "taffarel-brazil-1990s", role: "carrier" as const },
      finisher: { playerCardId: "taffarel-brazil-1990s", role: "finisher" as const },
    };
    let foundEarlyExit = false;
    for (let i = 0; i < 40; i++) {
      const res = simulateTournament({
        roster: weakRoster,
        getCard,
        seed: `weak-group-${i}`,
        mode: "classic",
        opponents,
      });
      const groupLosses = res.matches.filter(
        (m) => ["group_1", "group_2", "group_3"].includes(m.stage) && m.outcome === "loss",
      ).length;
      if (groupLosses >= 2 && res.matches.length <= 3) {
        foundEarlyExit = true;
        expect(res.champion).toBe(false);
        break;
      }
    }
    expect(foundEarlyExit).toBe(true);
  });

  it("produces strengths, weaknesses and a share text", () => {
    const res = simulateTournament({ roster: referenceRoster, getCard, seed: "explain", mode: "classic", opponents });
    expect(res.strengths.length).toBeGreaterThan(0);
    expect(res.weaknesses.length).toBeGreaterThan(0);
    expect(res.shareText).toContain("WORLD CUP 5S");
  });
});

describe("daily seed", () => {
  it("is stable for a given date", () => {
    const d = new Date(Date.UTC(2026, 5, 8));
    expect(dailySeed(d)).toBe("2026-06-08");
    expect(dailySeed(d)).toBe(dailySeed(d));
  });
});

describe("player pool depth", () => {
  it("meets minimum card counts per enabled pool", () => {
    const counts = new Map<string, number>();
    for (const card of allCards()) {
      const key = `${card.nation}-${card.decade}`;
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    for (const pool of nationDecadePools) {
      if (!pool.enabled) continue;
      const have = counts.get(pool.id) ?? 0;
      expect(have).toBeGreaterThanOrEqual(pool.minEligiblePlayers);
    }
  });
});
