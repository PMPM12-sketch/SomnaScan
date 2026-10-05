import { jsPDF } from "jspdf";
import {
  NUMERIC_FIELDS,
  CATEGORICAL_FIELDS,
  CLASSES,
  TREE_COUNT,
  FEATURE_ORDER,
} from "@/lib/model";
import { generateSuggestions } from "@/lib/suggestions";

const COLORS = {
  slate900: [15, 23, 42],
  slate700: [51, 65, 85],
  slate500: [100, 116, 139],
  slate300: [203, 213, 225],
  slate100: [241, 245, 249],
  sky: [2, 132, 199],
  emerald: [16, 185, 129],
  amber: [245, 158, 11],
  rose: [225, 29, 72],
  white: [255, 255, 255],
};

const STATUS_COLOR = {
  None: COLORS.emerald,
  Insomnia: COLORS.amber,
  "Sleep Apnea": COLORS.rose,
};

const STATUS_LABEL = {
  None: "No Disorder Detected",
  Insomnia: "Insomnia Detected",
  "Sleep Apnea": "Sleep Apnea Risk Detected",
};

function catLabel(fieldId, value) {
  const field = CATEGORICAL_FIELDS.find((f) => f.id === fieldId);
  const opt = field?.options.find((o) => o.value === Number(value));
  return opt ? opt.label : String(value);
}

export function generateReport(patient, result) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 40;
  const contentW = pageW - margin * 2;
  let y = 0;

  const primaryColor = STATUS_COLOR[result.primary] || COLORS.emerald;
  const now = new Date();
  const patientId = "PT-" + Math.floor(1000 + Math.random() * 9000);

  const ensureSpace = (needed) => {
    if (y + needed > pageH - 50) {
      doc.addPage();
      y = margin;
    }
  };

  const sectionHeading = (text) => {
    ensureSpace(34);
    y += 10;
    doc.setFillColor(...COLORS.sky);
    doc.rect(margin, y - 9, 3, 12, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...COLORS.slate900);
    doc.text(text, margin + 10, y);
    y += 14;
  };

  // ---------- Header band ----------
  doc.setFillColor(...COLORS.slate900);
  doc.rect(0, 0, pageW, 70, "F");
  doc.setTextColor(...COLORS.white);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("SlackingAI", margin, 32);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(203, 213, 225);
  doc.text("Sleep Disorder Screening Report", margin, 50);
  doc.setFontSize(9);
  doc.text(`Patient ID: ${patientId}`, pageW - margin, 32, { align: "right" });
  doc.text(now.toLocaleString(), pageW - margin, 48, { align: "right" });
  y = 95;

  // ---------- Primary diagnosis banner ----------
  doc.setFillColor(...primaryColor);
  doc.roundedRect(margin, y, contentW, 60, 6, 6, "F");
  doc.setTextColor(...COLORS.white);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("PRIMARY SCREENING RESULT", margin + 16, y + 20);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(STATUS_LABEL[result.primary] || result.primary, margin + 16, y + 42);
  doc.setFontSize(22);
  const conf = `${result.confidence[result.primary].toFixed(0)}%`;
  doc.text(conf, pageW - margin - 16, y + 34, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("CONFIDENCE", pageW - margin - 16, y + 48, { align: "right" });
  y += 60;

  // ---------- Confidence breakdown ----------
  sectionHeading("Confidence Breakdown");
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.slate500);
  doc.setFont("helvetica", "normal");
  doc.text(`Votes tallied across ${TREE_COUNT} decision trees (Random Forest)`, margin, y);
  y += 16;

  const order = ["None", "Insomnia", "Sleep Apnea"];
  order.forEach((cls) => {
    if (!CLASSES.includes(cls)) return;
    const pct = result.confidence[cls] ?? 0;
    const votes = result.votes[cls] ?? 0;
    ensureSpace(30);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...COLORS.slate700);
    doc.text(cls, margin, y);
    doc.text(`${pct.toFixed(1)}%  (${votes}/${TREE_COUNT})`, pageW - margin, y, { align: "right" });
    y += 6;
    // track
    doc.setFillColor(...COLORS.slate100);
    doc.roundedRect(margin, y, contentW, 7, 3, 3, "F");
    // fill
    doc.setFillColor(...(STATUS_COLOR[cls] || COLORS.sky));
    const w = Math.max(0, (pct / 100) * contentW);
    if (w > 0) doc.roundedRect(margin, y, w, 7, 3, 3, "F");
    y += 20;
  });

  // ---------- Patient inputs ----------
  sectionHeading("Patient Input Metrics");
  const rows = [];
  CATEGORICAL_FIELDS.forEach((f) =>
    rows.push([f.label, catLabel(f.id, patient[f.id]), ""])
  );
  NUMERIC_FIELDS.forEach((f) => {
    const v = patient[f.id];
    rows.push([f.label, Number.isInteger(v) ? String(v) : Number(v).toFixed(1), f.unit]);
  });

  const colW = contentW / 2;
  const rowH = 20;
  const perCol = Math.ceil(rows.length / 2);
  doc.setFontSize(9);
  const startY = y;
  rows.forEach((r, i) => {
    const col = Math.floor(i / perCol);
    const rowIdx = i % perCol;
    const x = margin + col * colW;
    const ry = startY + rowIdx * rowH;
    if (rowIdx % 2 === 0) {
      doc.setFillColor(...COLORS.slate100);
      doc.rect(x, ry - 12, colW - 8, rowH, "F");
    }
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...COLORS.slate500);
    doc.text(r[0], x + 6, ry);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...COLORS.slate900);
    const val = r[2] ? `${r[1]} ${r[2]}` : r[1];
    doc.text(val, x + colW - 14, ry, { align: "right" });
  });
  y = startY + perCol * rowH + 6;

  // ---------- Suggestions ----------
  sectionHeading("Suggestions for Improvement");
  const suggestions = generateSuggestions(patient, result.primary);
  suggestions.forEach((item) => {
    const detailLines = doc.splitTextToSize(item.detail, contentW - 16);
    ensureSpace(18 + detailLines.length * 12);
    doc.setFillColor(...COLORS.sky);
    doc.circle(margin + 3, y - 3, 2, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...COLORS.slate900);
    doc.text(item.title, margin + 12, y);
    y += 13;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...COLORS.slate700);
    doc.text(detailLines, margin + 12, y);
    y += detailLines.length * 12 + 6;
  });

  // ---------- About the AI ----------
  sectionHeading("About the AI Model");
  const aiFacts = [
    ["Model Name", "SlackingAI"],
    ["Algorithm", "Random Forest classifier (ensemble of decision trees)"],
    ["Estimators", `${TREE_COUNT} decision trees`],
    ["Input Features", `${FEATURE_ORDER.length} (${FEATURE_ORDER.join(", ")})`],
    ["Output Classes", CLASSES.join(", ")],
    ["Train / Test Split", "80% Train / 20% Test"],
    ["Reported Accuracy", "88.00%"],
  ];
  const aiIntro = doc.splitTextToSize(
    "This screening result is produced by SlackingAI, a Random Forest model defined in model_logic.json. Each patient profile is passed through every decision tree; each tree casts a vote for a class, and the proportion of votes determines the confidence shown above. The model was trained on sleep health and lifestyle data.",
    contentW
  );
  ensureSpace(aiIntro.length * 12 + 10);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.slate700);
  doc.text(aiIntro, margin, y);
  y += aiIntro.length * 12 + 8;

  aiFacts.forEach(([k, v]) => {
    const vLines = doc.splitTextToSize(v, contentW - 130);
    ensureSpace(vLines.length * 12 + 4);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...COLORS.slate900);
    doc.text(k, margin, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...COLORS.slate700);
    doc.text(vLines, margin + 125, y);
    y += vLines.length * 12 + 4;
  });

  // ---------- Disclaimer + footer on every page ----------
  sectionHeading("Medical Liability Disclaimer");
  const disc = doc.splitTextToSize(
    "This software is an exploratory machine-learning screening demonstrator and is NOT intended for primary clinical diagnosis, treatment decisions, or as a substitute for professional medical advice. Results are generated from a statistical model and may be inaccurate. Always consult a qualified sleep specialist or licensed healthcare professional for formal diagnosis and care.",
    contentW
  );
  ensureSpace(disc.length * 11 + 10);
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.slate500);
  doc.text(disc, margin, y);

  // Page footers
  const total = doc.getNumberOfPages();
  for (let p = 1; p <= total; p++) {
    doc.setPage(p);
    doc.setDrawColor(...COLORS.slate300);
    doc.setLineWidth(0.5);
    doc.line(margin, pageH - 32, pageW - margin, pageH - 32);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...COLORS.slate500);
    doc.text("SlackingAI - Confidential Screening Report", margin, pageH - 20);
    doc.text(`Page ${p} of ${total}`, pageW - margin, pageH - 20, { align: "right" });
  }

  const stamp = now.toISOString().slice(0, 19).replace(/[:T]/g, "-");
  doc.save(`SlackingAI-Report-${stamp}.pdf`);
}
