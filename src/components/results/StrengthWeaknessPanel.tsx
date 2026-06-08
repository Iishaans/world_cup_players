export function StrengthWeaknessPanel({
  strengths,
  weaknesses,
}: {
  strengths: string[];
  weaknesses: string[];
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="panel p-4">
        <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-emerald-300">
          Strengths
        </h3>
        <ul className="space-y-1.5 text-sm text-slate-200">
          {strengths.map((s, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-emerald-400">▲</span>
              {s}
            </li>
          ))}
        </ul>
      </div>
      <div className="panel p-4">
        <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-rose-300">
          Weaknesses
        </h3>
        <ul className="space-y-1.5 text-sm text-slate-200">
          {weaknesses.map((s, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-rose-400">▼</span>
              {s}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
