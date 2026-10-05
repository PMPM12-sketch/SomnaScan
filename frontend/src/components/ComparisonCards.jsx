import { Moon, HeartPulse, Footprints, Activity } from "lucide-react";

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

function buildCards(patient) {
  const sleep = Number(patient.sleep_duration);
  const sys = Number(patient.systolic_blood_pressure);
  const dia = Number(patient.diastolic_blood_pressure);
  const steps = Number(patient.daily_steps);
  const activity = Number(patient.physical_activity_level);

  // Sleep duration vs 7-9 hr healthy range (baseline 7.2)
  const sleepDev = sleep - 7.2;
  const sleepStatus = sleep >= 7 && sleep <= 9 ? "optimal" : sleep < 6 ? "alert" : "watch";

  // Blood pressure vs 120/80
  let bpStatus = "optimal";
  if (sys >= 140 || dia >= 90) bpStatus = "alert";
  else if (sys >= 130 || dia >= 85) bpStatus = "watch";
  const bpPct = clamp(((sys - 90) / (180 - 90)) * 100, 0, 100);

  // Daily steps vs 7000 baseline (goal 8000)
  const stepsStatus = steps >= 7000 ? "optimal" : steps >= 4500 ? "watch" : "alert";
  const stepsPct = clamp((steps / 10000) * 100, 0, 100);

  // Activity vs 60 min baseline
  const activityStatus = activity >= 45 ? "optimal" : activity >= 25 ? "watch" : "alert";
  const activityPct = clamp((activity / 120) * 100, 0, 100);

  return [
    {
      id: "sleep",
      Icon: Moon,
      title: "Sleep Duration",
      value: `${sleep.toFixed(1)} hrs`,
      baseline: "Baseline 7.2 hrs",
      status: sleepStatus,
      detail: `${sleepDev >= 0 ? "+" : ""}${sleepDev.toFixed(1)} hrs vs baseline`,
      pct: clamp((sleep / 10) * 100, 0, 100),
    },
    {
      id: "bp",
      Icon: HeartPulse,
      title: "Blood Pressure",
      value: `${sys}/${dia}`,
      baseline: "Baseline 120/80 mmHg",
      status: bpStatus,
      detail: bpStatus === "alert" ? "Hypertensive range" : bpStatus === "watch" ? "Elevated" : "Within range",
      pct: bpPct,
    },
    {
      id: "steps",
      Icon: Footprints,
      title: "Daily Steps",
      value: steps.toLocaleString(),
      baseline: "Baseline 7,000 steps",
      status: stepsStatus,
      detail: stepsStatus === "optimal" ? "Meets activity goal" : "Below recommended",
      pct: stepsPct,
    },
    {
      id: "activity",
      Icon: Activity,
      title: "Physical Activity",
      value: `${activity} min`,
      baseline: "Baseline 60 min/day",
      status: activityStatus,
      detail: activityStatus === "optimal" ? "Active lifestyle" : "Low activity",
      pct: activityPct,
    },
  ];
}

const STATUS_STYLE = {
  optimal: { badge: "bg-emerald-100 text-emerald-700", bar: "bg-emerald-500", dot: "bg-emerald-500", label: "Optimal" },
  watch: { badge: "bg-amber-100 text-amber-700", bar: "bg-amber-500", dot: "bg-amber-500", label: "Watch" },
  alert: { badge: "bg-rose-100 text-rose-700", bar: "bg-rose-500", dot: "bg-rose-500", label: "Alert" },
};

export const ComparisonCards = ({ patient }) => {
  const cards = buildCards(patient);
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5 space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-slate-800">Patient vs Baseline Averages</h3>
        <p className="text-xs text-slate-500">Key metrics compared to healthy population norms</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" data-testid="comparison-cards-container">
        {cards.map((c) => {
          const s = STATUS_STYLE[c.status];
          const { Icon } = c;
          return (
            <div
              key={c.id}
              data-testid={`comparison-card-${c.id}`}
              className="group rounded-xl border border-slate-200/80 bg-slate-50/60 p-4 transition-all duration-300 hover:bg-white hover:shadow-md hover:border-slate-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="rounded-lg bg-white p-2 shadow-sm ring-1 ring-slate-200 text-sky-600">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-semibold text-slate-700">{c.title}</span>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${s.badge}`}>
                  {s.label}
                </span>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-2xl font-bold tabular-nums text-slate-900">{c.value}</span>
                <span className="text-[11px] text-slate-400">{c.baseline}</span>
              </div>
              <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-200/70">
                <div className={`h-full rounded-full ${s.bar} transition-all duration-700 ease-out`} style={{ width: `${c.pct}%` }} />
              </div>
              <p className="mt-2 text-xs font-medium text-slate-500">{c.detail}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
