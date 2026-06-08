# World Cup 5s ⚽🏆

A daily, historical **5-a-side draft game**. Each round spins a random
**nation + World Cup decade**. You pick one eligible player, assign them to one
of five roles, then simulate a seven-match World Cup 5s tournament. Go **7-0** to
lift the trophy.

The game rewards World Cup knowledge, **role balance**, chemistry, tournament
aura and tactical fit — **not** simply picking the five highest-rated players. A
team of five attackers with no keeper gets dismantled.

Built with **Next.js (App Router) · React · TypeScript · Tailwind CSS · Zustand**.
The full game engine is deterministic and unit-tested with **Vitest**.

---

## Quick start

```bash
npm install
npm run dev      # http://localhost:3000
```

Other scripts:

```bash
npm run build    # production build (also pre-renders every card page)
npm run start    # run the production build
npm run lint     # eslint
npm test         # run the engine test suite (Vitest)
```

No database is required — the MVP runs entirely client-side
(Zustand + `localStorage`) and the API uses an in-memory store.

---

## How it plays

1. **Spin & draft** — five rounds, each a random nation + World Cup decade.
2. **Pick & assign** — choose one eligible legend and lock them into a unique
   role: `Keeper · Stopper · Controller · Carrier · Finisher`.
3. **Simulate** — a 7-match bracket (3 group games → R16 → QF → SF → Final)
   against historical opponent archetypes of rising difficulty.
4. **Results** — match log, team vector, strengths/weaknesses, a player of the
   tournament and a shareable result card (copy text or download PNG).

### Modes

| Mode | Ratings | Duplicates | Rerolls |
| --- | --- | --- | --- |
| **Classic** | visible | nations/decades allowed | 3 / 3 / 2 |
| **Knowledge** | hidden until full time | allowed | 2 / 2 / 1 |
| **Hardcore** | hidden | no repeat nation/decade | 1 total |
| **Daily** | visible | allowed | 3 / 3 / 2 |

Daily mode uses a stable `daily-YYYY-MM-DD` seed, so everyone gets the same five
spins on a given day.

---

## Project structure

```
src/
  app/                     Next.js routes
    page.tsx               Landing
    play/                  Active game (draft → simulate → results)
    daily/                 Daily seed launcher
    cards/                 Card database + [cardId] detail
    results/[gameId]/      Stored result viewer
    leaderboard/           Local best runs
    api/                   REST API (in-memory store)
  components/              UI: game/, cards/, results/, layout/
  lib/
    data/                  seedCards · nationDecadePools · opponents · nations
    game/                  rng · draft · teamVector · chemistry · penalties ·
                           simulation · scoring · explanations · state
    server/store.ts        In-memory persistence (swap for Prisma)
    ui.ts                  UI helpers
  store/gameStore.ts       Zustand store (+ persistence)
  types/                   player · game · simulation types
prisma/schema.prisma       Reference schema for a Postgres deployment
```

### Engine overview (`src/lib/game`)

- **`rng.ts`** — deterministic `cyrb128 + sfc32` PRNG, plus Poisson/normal
  sampling. Same seed ⇒ same game.
- **`draft.ts`** — rarity-weighted spin generation respecting mode constraints
  and reroll logic.
- **`teamVector.ts`** — per-role contributions with a role-fit multiplier, plus
  balance and minimum-threshold penalties.
- **`chemistry.ts`** — same nation/decade/World Cup bonuses, known partnerships,
  tactical synergy and structural penalties (no keeper = −20, etc.).
- **`simulation.ts`** — xG-based match engine with matchup + knockout-aura
  modifiers, extra time and the full tournament loop.
- **`penalties.ts`** — five-a-side shootout using your players as takers/keeper.
- **`scoring.ts` / `explanations.ts`** — leaderboard score and human-readable
  strengths, weaknesses and match notes.

---

## Content

- **287** curated player cards (each a *World Cup-era* version of a player).
- **68** nation-decade pools across 27 nations.
- **16** historical opponent archetypes.

> Ratings are **game ratings** tuned for balance and fun, not official stats.

### Extending the data

Add cards in `src/lib/data/seedCards.ts` using the `mk(...)` factory, add pools
in `nationDecadePools.ts`, and opponents in `opponents.ts`. The draft only offers
pools that have at least `minEligiblePlayers` cards, so the game degrades
gracefully as you add content.

---

## API

All routes are backed by `src/lib/server/store.ts` (in-memory):

```
POST /api/games                  Create a game ({ mode, seed? })
GET  /api/games/:id              Get game state
POST /api/games/:id/select       { cardId, role }
POST /api/games/:id/reroll       { kind: nation|decade|fullSpin }
POST /api/games/:id/simulate     Run the tournament
GET  /api/daily                  Get/create the daily game
GET  /api/cards?nation=&decade=  List player cards
GET  /api/cards/:id              Card detail
GET  /api/pools                  List nation-decade pools
GET  /api/leaderboard/daily?date= Daily leaderboard
```

### Going to a real database

`prisma/schema.prisma` documents `PlayerCard`, `NationDecadePool`, `Game` and
`DailyResult` models. To use it: install Prisma, set `DATABASE_URL`, run a
migration, and replace the functions in `src/lib/server/store.ts` with
Prisma-backed implementations. The route handlers won't need to change.

---

## Tests

```bash
npm test
```

Covers: deterministic RNG, role-fit multipliers, team vector outputs, chemistry
bonuses, draft constraint enforcement (incl. hardcore no-repeat), bounded &
deterministic penalty shootouts, deterministic 7-match tournaments, and a stable
daily seed.
