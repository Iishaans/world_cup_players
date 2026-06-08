# World Cup 5s ⚽🏆

A daily, historical **5-a-side draft game**. Each round spins a random
**nation + World Cup decade**. You pick one eligible player, assign them to one
of five roles, then simulate a seven-match World Cup 5s tournament. Go **7-0** to
lift the trophy.

**Live demo:** [world-cup-5s.vercel.app](https://world-cup-5s.vercel.app) *(set
`NEXT_PUBLIC_SITE_URL` in Vercel to your production domain for correct OG links)*

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

No database is required to play — the MVP runs client-side (Zustand +
`localStorage`). The API uses in-memory storage by default; set `DATABASE_URL` to
enable the global daily leaderboard via PostgreSQL (Neon / Vercel Postgres).

---

## How it plays

1. **Spin & draft** — five rounds, each a random nation + World Cup decade.
2. **Pick & assign** — choose one eligible legend and lock them into a unique
   role: `Keeper · Stopper · Controller · Carrier · Finisher`.
3. **Simulate** — a 7-match bracket (3 group games → R16 → QF → SF → Final)
   against historical opponent archetypes of rising difficulty. Lose a knockout
   match or two group games and you're out early.
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
  modifiers, extra time, early elimination (knockout loss or 2 group losses),
  and the tournament loop.
- **`penalties.ts`** — five-a-side shootout using your players as takers/keeper.
- **`scoring.ts` / `explanations.ts`** — leaderboard score and human-readable
  strengths, weaknesses and match notes.

---

## Content

- **511+** curated player cards (each a *World Cup-era* version of a player).
- **68** nation-decade pools across 27 nations (10 cards minimum for major
  nations; 5 for smaller pools).
- **16** historical opponent archetypes.

> Ratings are **game ratings** tuned for balance and fun, not official stats.

### Extending the data

Add cards in `src/lib/data/seedCards.ts` or `seedCardsExpansion.ts` using the
`mk(...)` factory, add pools in `nationDecadePools.ts`, and opponents in
`opponents.ts`. The draft only offers pools that have at least
`minEligiblePlayers` cards, so the game degrades gracefully as you add content.

---

## API

Routes are backed by `src/lib/server/store.ts` (in-memory by default, PostgreSQL
when `DATABASE_URL` is set):

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
GET  /api/leaderboard/daily?date= Daily leaderboard (global when DB configured)
POST /api/leaderboard/daily      Submit a daily score
```

### Global daily leaderboard (PostgreSQL)

1. Create a Postgres database (Neon or Vercel Postgres).
2. Set `DATABASE_URL` in Vercel / `.env`.
3. Run `npx prisma migrate dev --name init` locally (or deploy migrations in CI).
4. Daily runs auto-submit scores; the `/leaderboard` page shows today's global top 50.

Optional: set `NEXT_PUBLIC_SITE_URL=https://your-domain.com` for Open Graph links.

---

## Tests

```bash
npm test
```

Covers: deterministic RNG, role-fit multipliers, team vector outputs, chemistry
bonuses, draft constraint enforcement (incl. hardcore no-repeat), bounded &
deterministic penalty shootouts, tournament elimination rules, pool depth
minimums, and a stable daily seed.

CI runs on every push via GitHub Actions (`.github/workflows/ci.yml`): `npm test`,
`npm run lint`, and `npm run build`.
