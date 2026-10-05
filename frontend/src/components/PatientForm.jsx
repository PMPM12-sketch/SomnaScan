import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NUMERIC_FIELDS, CATEGORICAL_FIELDS } from "@/lib/model";

const SLIDER_TESTIDS = {
  age: "patient-input-age-slider",
  sleep_duration: "patient-input-sleep-duration-slider",
  quality_of_sleep: "patient-input-quality-sleep-slider",
  physical_activity_level: "patient-input-activity-slider",
  stress_level: "patient-input-stress-slider",
  heart_rate: "patient-input-heart-rate-slider",
  daily_steps: "patient-input-steps-slider",
  systolic_blood_pressure: "patient-input-systolic-slider",
  diastolic_blood_pressure: "patient-input-diastolic-slider",
};

const SELECT_TESTIDS = {
  gender: "patient-input-gender-select",
  occupation: "patient-input-occupation-select",
  bmi_category: "patient-input-bmi-select",
};

const fmt = (v) => (Number.isInteger(v) ? v : Number(v).toFixed(1));

export const PatientForm = ({ patient, onChange }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-800">Patient Metrics</h3>
        <p className="text-xs text-slate-500">Adjust values to run the screening model in real time</p>
      </div>

      {/* Categorical dropdowns */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {CATEGORICAL_FIELDS.map((field) => (
          <div key={field.id} className="space-y-1.5">
            <label className="text-xs font-medium uppercase tracking-wider text-slate-500">
              {field.label}
            </label>
            <Select
              value={String(patient[field.id])}
              onValueChange={(val) => onChange(field.id, Number(val))}
            >
              <SelectTrigger data-testid={SELECT_TESTIDS[field.id]} className="h-10 bg-slate-50 border-slate-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {field.options.map((opt) => (
                  <SelectItem key={opt.value} value={String(opt.value)}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>

      <div className="h-px bg-slate-100" />

      {/* Numeric sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
        {NUMERIC_FIELDS.map((field) => (
          <div key={field.id} className="space-y-2">
            <div className="flex items-baseline justify-between">
              <label className="text-xs font-medium uppercase tracking-wider text-slate-500">
                {field.label}
              </label>
              <span className="text-sm font-bold tabular-nums text-sky-700">
                {fmt(patient[field.id])}
                <span className="ml-1 text-[11px] font-medium text-slate-400">{field.unit}</span>
              </span>
            </div>
            <Slider
              data-testid={SLIDER_TESTIDS[field.id]}
              min={field.min}
              max={field.max}
              step={field.step}
              value={[Number(patient[field.id])]}
              onValueChange={(val) => onChange(field.id, val[0])}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
