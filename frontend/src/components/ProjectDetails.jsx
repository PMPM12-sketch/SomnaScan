import { Cpu, GitBranch, Target, TreePine } from "lucide-react";
import { TREE_COUNT, FEATURE_ORDER } from "@/lib/model";

const specs = [
  { Icon: Cpu, label: "Model", value: "Random Forest" },
  { Icon: GitBranch, label: "Split", value: "80% Train / 20% Test" },
  { Icon: Target, label: "Accuracy", value: "88.00%" },
  { Icon: TreePine, label: "Estimators", value: `${TREE_COUNT} trees` },
];

export const ProjectDetails = () => {
  return (
    <div
      data-testid="project-details-card"
      className="rounded-xl border border-slate-800 bg-slate-900 p-5 text-slate-100 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold tracking-tight">Model & Project Details</h3>
        <span className="rounded-full bg-sky-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-sky-300 ring-1 ring-sky-500/30">
          {FEATURE_ORDER.length} features
        </span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {specs.map((s) => {
          const { Icon } = s;
          return (
            <div key={s.label} className="rounded-lg bg-slate-800/60 p-3 ring-1 ring-slate-700/60">
              <div className="flex items-center gap-2 text-slate-400">
                <Icon className="h-3.5 w-3.5" />
                <span className="text-[10px] font-semibold uppercase tracking-wider">{s.label}</span>
              </div>
              <p className="mt-1 text-sm font-bold text-white tabular-nums">{s.value}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
