"use client";

import { useState } from "react";
import type { GameState } from "@/types";
import { ROLES, ROLE_LABELS } from "@/types";
import { getCard, nationFlag, nationName } from "@/lib/data";

function drawShareImage(game: GameState): string | null {
  const result = game.result;
  if (!result) return null;
  const W = 1080;
  const H = 1350;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, "#08121f");
  grad.addColorStop(1, "#04070d");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = "#f5c542";
  ctx.fillRect(0, 0, W, 14);

  ctx.fillStyle = "#ffffff";
  ctx.font = "900 64px 'Trebuchet MS', sans-serif";
  ctx.fillText("WORLD CUP 5s", 64, 130);
  ctx.fillStyle = "#9fb0c9";
  ctx.font = "500 30px 'Trebuchet MS', sans-serif";
  const modeLabel = game.mode.toUpperCase();
  ctx.fillText(`${modeLabel} · seed ${game.seed}`, 64, 178);

  // Result banner
  ctx.fillStyle = result.champion ? "#f5c542" : "#1b263f";
  ctx.fillRect(64, 220, W - 128, 120);
  ctx.fillStyle = result.champion ? "#04070d" : "#ffffff";
  ctx.font = "900 80px 'Trebuchet MS', sans-serif";
  ctx.fillText(
    `${result.record.wins}-${result.record.losses}${result.champion ? "  CHAMPIONS" : ""}`,
    96,
    305,
  );

  // Roster
  let y = 430;
  ctx.font = "700 38px 'Trebuchet MS', sans-serif";
  for (const role of ROLES) {
    const sel = game.roster[role];
    const card = sel ? getCard(sel.playerCardId) : undefined;
    ctx.fillStyle = "#7c8aa5";
    ctx.font = "700 26px 'Trebuchet MS', sans-serif";
    ctx.fillText(ROLE_LABELS[role].toUpperCase(), 64, y);
    if (card) {
      ctx.fillStyle = "#ffffff";
      ctx.font = "700 40px 'Trebuchet MS', sans-serif";
      ctx.fillText(card.shortName ?? card.name, 64, y + 44);
      ctx.fillStyle = "#9fb0c9";
      ctx.font = "500 28px 'Trebuchet MS', sans-serif";
      ctx.fillText(`${nationName(card.nation)} · ${card.decade}`, 64, y + 80);
    }
    y += 130;
  }

  // Footer stats
  const v = result.teamVector;
  ctx.fillStyle = "#f5c542";
  ctx.font = "800 32px 'Trebuchet MS', sans-serif";
  ctx.fillText(
    `Overall ${v.overall}   Aura ${v.tournamentAura}   Chem ${v.chemistry}`,
    64,
    H - 90,
  );
  if (result.weaknesses[0]) {
    ctx.fillStyle = "#9fb0c9";
    ctx.font = "500 26px 'Trebuchet MS', sans-serif";
    ctx.fillText(`Weakness: ${result.weaknesses[0]}`, 64, H - 48);
  }

  return canvas.toDataURL("image/png");
}

export function ShareCard({ game }: { game: GameState }) {
  const [copied, setCopied] = useState(false);
  const result = game.result;
  if (!result) return null;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(result.shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const download = () => {
    const url = drawShareImage(game);
    if (!url) return;
    const a = document.createElement("a");
    a.href = url;
    a.download = `world-cup-5s-${game.seed}.png`;
    a.click();
  };

  return (
    <div className="panel p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-wide text-gold-soft">
          Share card
        </h3>
        {result.champion && <span className="pill border-gold/50 text-gold-soft">🏆 Champions</span>}
      </div>

      <div className="rounded-xl border border-ink-700 bg-ink-950/60 p-4">
        <div className="mb-3 space-y-1.5">
          {ROLES.map((role) => {
            const sel = game.roster[role];
            const card = sel ? getCard(sel.playerCardId) : undefined;
            if (!card) return null;
            return (
              <div key={role} className="flex items-center justify-between text-sm">
                <span className="text-slate-100">
                  <span aria-hidden>{nationFlag(card.nation)}</span>{" "}
                  {card.shortName ?? card.name}{" "}
                  <span className="text-slate-500">{card.decade}</span>
                </span>
                <span className="text-xs text-slate-400">{ROLE_LABELS[role]}</span>
              </div>
            );
          })}
        </div>
        <div className="flex flex-wrap items-center gap-2 border-t border-white/5 pt-3 text-xs text-slate-300">
          <span className="pill">
            {result.record.wins}-{result.record.losses}
            {result.champion ? " 🏆" : ""}
          </span>
          <span className="pill">Aura {result.teamVector.tournamentAura}</span>
          <span className="pill">Chem {result.teamVector.chemistry}</span>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button type="button" className="btn-primary flex-1" onClick={copy}>
          {copied ? "Copied!" : "Copy result"}
        </button>
        <button type="button" className="btn-ghost flex-1" onClick={download}>
          Download PNG
        </button>
      </div>
    </div>
  );
}
