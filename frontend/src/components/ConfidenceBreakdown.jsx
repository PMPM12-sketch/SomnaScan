import { TREE_COUNT } from "@/lib/model";

const META = {
  None: { label: "None", color: "bg-emerald-500", text: "text-emerald-700", testid: "confidence-percentage-none" },
  Insomnia: { label: "Insomnia", color: "bg-amber-500", text: "text-amber-700", testid: "confidence-percentage-insomnia" },
  "Sleep Apnea": { label: "Sleep Apnea", color: "bg-rose-600", text: "text-rose-700", testid: "confidence-percentage-sleep-apnea" },
};

const ORDER = ["None", "Insomnia", "Sleep Apnea"];

export const ConfidenceBreakdown = ({ confidence, votes, primary }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5 space-y-4" data-testid="confidence-breakdown-card">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">Confidence Breakdown</h3>
          <p className="text-xs text-slate-500">
            Votes tallied across {TREE_COUNT} decision trees
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {ORDER.map((cls) => {
          const m = META[cls];
          const pct = confidence[cls] ?? 0;
          const count = votes[cls] ?? 0;
          const isPrimary = cls === primary;
          return (
            <div key={cls} data-testid={m.testid}>
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-sm font-semibold ${isPrimary ? m.text : "text-slate-700"}`}>
                  {m.label}
                  {isPrimary && (
                    <span className="ml-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Primary
                    </span>
                  )}
                </span>
                <span className="text-sm font-bold tabular-nums text-slate-900">
                  {pct.toFixed(1)}%
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full ${m.color} transition-all duration-700 ease-out`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="mt-1 text-[11px] text-slate-400 tabular-nums">
                {count} / {TREE_COUNT} trees
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
