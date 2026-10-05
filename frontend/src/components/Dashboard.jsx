import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Moon, RotateCcw, Users, ShieldAlert, Activity, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PatientForm } from "@/components/PatientForm";
import { DiagnosisBanner } from "@/components/DiagnosisBanner";
import { ConfidenceBreakdown } from "@/components/ConfidenceBreakdown";
import { ComparisonCards } from "@/components/ComparisonCards";
import { ProjectDetails } from "@/components/ProjectDetails";
import { runModel, DEFAULT_PATIENT, DEMO_PATIENTS } from "@/lib/model";
import { generateReport } from "@/lib/pdfReport";

const PATIENT_ID = "PT-" + Math.floor(1000 + Math.random() * 9000);

export default function Dashboard() {
  const [patient, setPatient] = useState(DEFAULT_PATIENT);

  const result = useMemo(() => runModel(patient), [patient]);

  const handleChange = (field, value) => {
    setPatient((prev) => ({ ...prev, [field]: value }));
  };

  const loadDemo = (demo) => {
    setPatient(demo.values);
    toast.success(`Loaded profile: ${demo.name}`, { description: demo.description });
  };

  const reset = () => {
    setPatient(DEFAULT_PATIENT);
    toast.info("Inputs reset to default values");
  };

  const exportPdf = () => {
    try {
      generateReport(patient, result);
      toast.success("PDF report generated", { description: "Check your downloads folder" });
    } catch (e) {
      toast.error("Could not generate PDF", { description: String(e?.message || e) });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-body">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-sky-600 p-2 text-white shadow-sm">
              <Moon className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-heading text-lg sm:text-xl font-bold tracking-tight leading-none">
                SomnaScan <span className="text-sky-600">AI</span>
              </h1>
              <p className="text-[11px] text-slate-500 mt-0.5">Sleep Disorder Screening Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden md:flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
              <Activity className="h-3.5 w-3.5 text-sky-600" /> {PATIENT_ID}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button data-testid="load-example-patient-button" className="bg-sky-600 hover:bg-sky-700 text-white gap-2">
                  <Users className="h-4 w-4" />
                  <span className="hidden sm:inline">Load Example</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>Example Patient Profiles</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {DEMO_PATIENTS.map((d) => (
                  <DropdownMenuItem
                    key={d.id}
                    data-testid={`demo-patient-${d.id}`}
                    onClick={() => loadDemo(d)}
                    className="flex flex-col items-start gap-0.5 py-2 cursor-pointer"
                  >
                    <span className="font-semibold text-slate-800">{d.name}</span>
                    <span className="text-xs text-slate-500">{d.description}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              data-testid="export-pdf-button"
              variant="outline"
              onClick={exportPdf}
              className="gap-2 border-sky-300 text-sky-700 hover:bg-sky-50 hover:text-sky-800"
            >
              <FileDown className="h-4 w-4" />
              <span className="hidden sm:inline">Export PDF</span>
            </Button>
            <Button
              data-testid="reset-inputs-button"
              variant="outline"
              onClick={reset}
              className="gap-2 border-slate-300"
            >
              <RotateCcw className="h-4 w-4" />
              <span className="hidden sm:inline">Reset</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Input column */}
          <div className="lg:col-span-5 space-y-6">
            <PatientForm patient={patient} onChange={handleChange} />
            <ProjectDetails />
          </div>

          {/* Results column */}
          <div className="lg:col-span-7 space-y-6">
            <DiagnosisBanner primary={result.primary} confidence={result.confidence} />
            <ConfidenceBreakdown
              confidence={result.confidence}
              votes={result.votes}
              primary={result.primary}
            />
            <ComparisonCards patient={patient} />
          </div>
        </div>

        {/* Disclaimer */}
        <footer
          data-testid="medical-disclaimer-footer"
          className="mt-8 rounded-xl border border-slate-200 bg-slate-100/70 p-5"
        >
          <div className="flex items-start gap-3">
            <ShieldAlert className="h-5 w-5 shrink-0 text-slate-500 mt-0.5" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Medical Liability Disclaimer
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
                This software is an exploratory machine-learning screening demonstrator and is{" "}
                <span className="font-semibold text-slate-700">NOT</span> intended for primary
                clinical diagnosis, treatment decisions, or as a substitute for professional medical
                advice. Results are generated from a statistical model and may be inaccurate. Always
                consult a qualified sleep specialist or licensed healthcare professional for formal
                diagnosis and care.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
