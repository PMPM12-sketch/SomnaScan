import { CheckCircle2, AlertTriangle, Activity } from "lucide-react";

const STATUS = {
  None: {
    label: "No Disorder Detected",
    sub: "Patient profile aligns with healthy sleep patterns",
    bg: "bg-emerald-500",
    ring: "ring-emerald-200",
    Icon: CheckCircle2,
    textOnBanner: "text-white",
  },
  Insomnia: {
    label: "Insomnia Detected",
    sub: "Indicators suggest difficulty achieving restorative sleep",
    bg: "bg-amber-500",
    ring: "ring-amber-200",
    Icon: AlertTriangle,
    textOnBanner: "text-amber-950",
  },
  "Sleep Apnea": {
    label: "Sleep Apnea Risk Detected",
    sub: "Profile shows elevated risk of obstructive sleep apnea",
    bg: "bg-rose-600",
    ring: "ring-rose-200",
    Icon: Activity,
    textOnBanner: "text-white",
  },
};

export const DiagnosisBanner = ({ primary, confidence }) => {
  const cfg = STATUS[primary] || STATUS.None;
  const { Icon } = cfg;
  const pct = confidence[primary]?.toFixed(0) ?? "0";

  return (
    <div
      data-testid="primary-diagnosis-banner"
      className={`${cfg.bg} ${cfg.textOnBanner} rounded-2xl p-6 sm:p-7 shadow-lg ring-4 ${cfg.ring} transition-colors duration-500`}
    >
      <div className="flex items-start gap-4">
        <div className="shrink-0 rounded-xl bg-white/20 p-3 backdrop-blur-sm">
          <Icon className="h-8 w-8" strokeWidth={2.2} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-80">
            Primary Screening Result
          </p>
          <h2 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight leading-tight">
            {cfg.label}
          </h2>
          <p className="mt-1.5 text-sm font-medium opacity-90">{cfg.sub}</p>
        </div>
        <div className="shrink-0 text-right">
          <div className="text-3xl sm:text-4xl font-bold tabular-nums leading-none">{pct}%</div>
          <div className="mt-1 text-xs font-medium uppercase tracking-wider opacity-80">
            Confidence
          </div>
        </div>
      </div>
    </div>
  );
};
