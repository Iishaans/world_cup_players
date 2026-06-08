import type {
  MatchResult,
  OpponentTeam,
  Roster,
  TeamVector,
} from "@/types";

export function generateStrengths(vector: TeamVector, roster: Roster): string[] {
  const out: string[] = [];
  if (vector.finishing >= 90) out.push("Elite, ruthless finishing");
  else if (vector.finishing >= 82) out.push("Strong goal threat up front");
  if (vector.goalkeeping >= 92) out.push("World-class goalkeeper");
  else if (vector.goalkeeping >= 84) out.push("Reliable keeper and distribution");
  if (vector.defensiveSecurity >= 90) out.push("Lockdown defensive anchor");
  else if (vector.defensiveSecurity >= 82) out.push("Solid defensive spine");
  if (vector.ballRetention >= 90) out.push("Dominant ball retention");
  if (vector.creation >= 90) out.push("Outstanding creativity");
  if (vector.tournamentAura >= 92) out.push("Huge tournament aura");
  if (vector.transitionThreat >= 88) out.push("Devastating in transition");
  if (vector.pressing >= 86) out.push("Relentless pressing engine");
  if (vector.chemistry >= 85) out.push("Excellent team chemistry");
  if (vector.balance >= 90) out.push("Beautifully balanced profile");
  if (out.length === 0) out.push("A scrappy, fight-for-everything side");
  return out.slice(0, 5);
}

export function generateWeaknesses(vector: TeamVector, roster: Roster): string[] {
  const out: string[] = [];
  if (vector.goalkeeping < 70) out.push("Shaky goalkeeping");
  if (vector.defensiveSecurity < 70) out.push("Vulnerable at the back");
  else if (vector.defensiveSecurity < 80) out.push("Defence can be exposed");
  if (vector.ballRetention < 72) out.push("Struggles to keep the ball");
  if (vector.finishing < 72) out.push("Lacks a clinical finisher");
  if (vector.creation < 74) out.push("Limited creative spark");
  if (vector.chemistry < 60) out.push("Low chemistry between the players");
  else if (vector.chemistry < 75) out.push("Chemistry is only moderate");
  if (vector.pressing < 72) out.push("Pressing is below elite level");
  if (vector.balance < 78) out.push("Unbalanced — easy to game-plan against");
  if (vector.tournamentAura < 78) out.push("Lacks big-tournament pedigree");
  if (out.length === 0) out.push("Very few weaknesses to exploit");
  return out.slice(0, 5);
}

export function generateMatchNotes(
  match: MatchResult,
  userVector: TeamVector,
  opponent: OpponentTeam,
): string[] {
  const notes: string[] = [];
  const gd = match.userGoals - match.opponentGoals;

  switch (opponent.style) {
    case "low_block":
      if (userVector.creation + userVector.finishing >= 180)
        notes.push(`You picked the lock against ${opponent.name}'s compact low block.`);
      else
        notes.push(`You struggled to break down ${opponent.name}'s stubborn low block.`);
      break;
    case "possession":
      if (userVector.pressing + userVector.ballRetention >= 180)
        notes.push(`You matched ${opponent.name} for the ball and pressed them off it.`);
      else
        notes.push(`${opponent.name} dominated possession and made you chase the game.`);
      break;
    case "counter_attack":
      if (userVector.defensiveSecurity + userVector.goalkeeping >= 175)
        notes.push(`Your back line shut down ${opponent.name}'s counter-attacks.`);
      else
        notes.push(`${opponent.name} hurt you on the counter every time you committed.`);
      break;
    case "high_press":
      if (userVector.ballRetention + userVector.chemistry >= 175)
        notes.push(`You played through ${opponent.name}'s high press with ease.`);
      else
        notes.push(`${opponent.name}'s high press forced turnovers in dangerous areas.`);
      break;
    case "physical":
      if (userVector.defensiveSecurity + userVector.pressing >= 170)
        notes.push(`You stood up to ${opponent.name} in a physical battle.`);
      else
        notes.push(`${opponent.name} bullied you physically.`);
      break;
    default:
      notes.push(`A wide-open game against ${opponent.name}.`);
  }

  if (match.wentToPenalties) {
    if (match.outcome === "win")
      notes.push("Your keeper's penalty profile saved you in the shootout.");
    else notes.push("You lost your nerve in the shootout.");
  } else if (match.wentToExtraTime) {
    notes.push("It took extra time to settle it.");
  }

  if (gd >= 3) notes.push("A statement, commanding performance.");
  else if (gd <= -2) notes.push("You were comprehensively outplayed.");

  if (userVector.tournamentAura >= 92 && match.outcome === "win")
    notes.push("Big-game aura carried you through the tense moments.");

  return notes;
}
