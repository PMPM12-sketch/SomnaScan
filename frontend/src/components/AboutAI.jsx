import { BrainCircuit } from "lucide-react";
import { MODEL_NAME, AI_DESCRIPTION, AI_FACTS, FEATURE_ORDER } from "@/lib/model";

export const AboutAI = () => {
  return (
    <div
      data-testid="about-ai-card"
      className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5 space-y-4"
    >
      <div className="flex items-center gap-2.5">
        <span className="rounded-lg bg-sky-50 p-2 text-sky-600 ring-1 ring-sky-100">
          <BrainCircuit className="h-4 w-4" />
        </span>
        <div>
          <h3 className="text-lg font-semibold text-slate-800">
            About the AI <span className="text-sky-600">·</span> {MODEL_NAME}
          </h3>
          <p className="text-xs text-slate-500">How this screening result is produced</p>
        </div>
      </div>

      <p className="text-sm leading-relaxed text-slate-600">{AI_DESCRIPTION}</p>

      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
        {AI_FACTS.map((f) => (
          <div
            key={f.label}
            data-testid={`ai-fact-${f.label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`}
            className="flex items-start justify-between gap-3 border-b border-slate-100 pb-2"
          >
            <dt className="text-xs font-medium uppercase tracking-wider text-slate-500 shrink-0">
              {f.label}
            </dt>
            <dd className="text-sm font-semibold text-slate-800 text-right">{f.value}</dd>
          </div>
        ))}
      </dl>

      <div className="rounded-lg bg-slate-50 p-3 ring-1 ring-slate-100">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
          Features used
        </p>
        <p className="text-xs text-slate-600 leading-relaxed">{FEATURE_ORDER.join(" · ")}</p>
      </div>
    </div>
  );
};
