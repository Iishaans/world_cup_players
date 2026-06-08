import Link from "next/link";
import { notFound } from "next/navigation";
import { allCards, getCard, nationFlag, nationName } from "@/lib/data";
import { ROLES, ROLE_LABELS } from "@/types";
import { PlayerRatingBars } from "@/components/cards/PlayerRatingBars";
import { TraitPills } from "@/components/cards/TraitPills";
import { ratingColor } from "@/lib/ui";

export function generateStaticParams() {
  return allCards().map((c) => ({ cardId: c.id }));
}

const PROFILE_FIELDS: { key: string; label: string }[] = [
  { key: "winner", label: "World Cup winner" },
  { key: "finalist", label: "Finalist" },
  { key: "semiFinalist", label: "Semi-finalist" },
  { key: "goldenBall", label: "Golden Ball" },
  { key: "goldenBoot", label: "Golden Boot" },
  { key: "goldenGlove", label: "Golden Glove" },
  { key: "captain", label: "Captain" },
  { key: "iconicMoment", label: "Iconic moment" },
];

export default async function CardDetailPage({
  params,
}: {
  params: Promise<{ cardId: string }>;
}) {
  const { cardId } = await params;
  const card = getCard(cardId);
  if (!card) notFound();

  const profileBadges = PROFILE_FIELDS.filter(
    (f) => (card.worldCupProfile as Record<string, unknown>)[f.key],
  );

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <Link href="/cards" className="text-sm text-slate-400 hover:text-white">
        ← Back to cards
      </Link>

      <div className="panel overflow-hidden">
        <div className="flex items-center justify-between gap-4 border-b border-ink-700/70 bg-gradient-to-b from-gold/10 to-transparent px-6 py-5">
          <div>
            <h1 className="font-display text-3xl font-black text-white">{card.name}</h1>
            <div className="mt-1 text-sm text-slate-300">
              <span aria-hidden>{nationFlag(card.nation)}</span>{" "}
              {nationName(card.nation)} · {card.decade} ·{" "}
              {[card.primaryPosition, ...card.secondaryPositions].join(" / ")}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              World Cups: {card.worldCups.join(", ")} · Data confidence:{" "}
              {card.metadata.dataConfidence}
            </div>
          </div>
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-xl bg-gold font-display text-3xl font-black text-ink-950">
            {card.ratings.overall}
          </div>
        </div>

        <div className="grid gap-6 p-6 sm:grid-cols-2">
          <div>
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-300">
              Attributes
            </h2>
            <PlayerRatingBars card={card} />
            <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-300">
              <div className="flex justify-between"><span className="text-slate-500">Composure</span> {card.ratings.composure}</div>
              <div className="flex justify-between"><span className="text-slate-500">Stamina</span> {card.ratings.stamina}</div>
              <div className="flex justify-between"><span className="text-slate-500">Weak foot</span> {card.ratings.weakFoot}★</div>
              <div className="flex justify-between"><span className="text-slate-500">Skill moves</span> {card.ratings.skillMoves}★</div>
              <div className="flex justify-between"><span className="text-slate-500">Aura</span> {card.ratings.tournamentAura}</div>
              {card.ratings.penaltyTaking !== undefined && (
                <div className="flex justify-between"><span className="text-slate-500">Penalties</span> {card.ratings.penaltyTaking}</div>
              )}
              {card.ratings.penaltySaving !== undefined && (
                <div className="flex justify-between"><span className="text-slate-500">Pen saving</span> {card.ratings.penaltySaving}</div>
              )}
            </div>
          </div>

          <div>
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-300">
              Role fit
            </h2>
            <div className="space-y-2">
              {ROLES.map((role) => {
                const v = card.roleFit[role];
                return (
                  <div key={role} className="flex items-center gap-2">
                    <span className="w-20 shrink-0 text-xs text-slate-400">
                      {ROLE_LABELS[role]}
                    </span>
                    <div className="rating-track h-2 flex-1 overflow-hidden rounded-full">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${v}%`, backgroundColor: ratingColor(v) }}
                      />
                    </div>
                    <span className="w-7 text-right text-xs font-semibold tabular-nums">{v}</span>
                  </div>
                );
              })}
            </div>

            <h2 className="mb-2 mt-5 text-sm font-bold uppercase tracking-wide text-slate-300">
              Traits
            </h2>
            <TraitPills traits={card.traits} />

            {profileBadges.length > 0 && (
              <>
                <h2 className="mb-2 mt-5 text-sm font-bold uppercase tracking-wide text-slate-300">
                  World Cup profile
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {profileBadges.map((b) => (
                    <span key={b.key} className="pill border-gold/40 text-gold-soft">
                      {b.label}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
