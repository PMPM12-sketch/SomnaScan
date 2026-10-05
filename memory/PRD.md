# SomnaScan AI — Sleep Disorder Screening Dashboard

## Original Problem Statement
Build a React + Tailwind medical diagnostic dashboard that reads features/classes/tree logic from `model_logic.json` (Random Forest sleep disorder screener). Sliders for numerical metrics, dropdowns for categorical metrics. Implement tree-matching evaluation: parse patient input through trees, tally results, show confidence % for None/Insomnia/Sleep Apnea. Prominent status banner (green None / yellow Insomnia / red Sleep Apnea). Comparison cards vs baseline averages. Project-details card (Random Forest, 80/20 split, 88% accuracy). Medical disclaimer footer. Ultra-clean, modern, high-contrast UI.

## Architecture
- Frontend-only (no backend). All model inference runs in-browser.
- `model_logic.json` (100 trees) imported at `/app/frontend/src/data/model_logic.json`.
- `/app/frontend/src/lib/model.js`: field configs, encodings, demo patients, `runModel()` tree-traversal + vote tally.
- Components: `Dashboard`, `PatientForm`, `DiagnosisBanner`, `ConfidenceBreakdown`, `ComparisonCards`, `ProjectDetails`.
- Theme: clinical light (slate/white + sky-blue accents), fonts Work Sans / IBM Plex Sans. Sonner toasts.

## User Personas
- Clinician / researcher demoing an ML sleep-screening model with adjustable patient inputs.

## Core Requirements (static)
- Read feature names from model_logic.json; 9 numeric sliders + 3 categorical dropdowns (gender, occupation, bmi).
- Real-time Random Forest tree evaluation across 100 trees; confidence % per class.
- Color-coded primary diagnosis banner; baseline comparison cards; model-details card; disclaimer.

## Implemented (2026-06)
- Full dashboard with real-time in-browser inference over all 100 trees.
- Primary diagnosis banner (green/amber/red), confidence breakdown with per-class tree vote counts.
- Comparison cards (sleep, BP, steps, activity) vs baselines with optimal/watch/alert status.
- Project details card, medical liability disclaimer footer.
- Load Example (3 tuned demo profiles: Healthy → None, High-Stress → Insomnia, Apnea Risk → Sleep Apnea) + Reset.
- Verified via screenshots: all three diagnosis states render correctly.

## Backlog / Remaining
- P2: Export/print result as PDF report.
- P2: Decision-path visualization for a single tree.
- P2: Persist/log evaluations (would require backend).
