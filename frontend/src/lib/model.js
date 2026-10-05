import modelLogic from "@/data/model_logic.json";

// Feature order expected by the trees (indices map to model_logic.json "features")
export const FEATURE_ORDER = modelLogic.features;
export const CLASSES = modelLogic.classes;
export const TREES = modelLogic.trees;
export const TREE_COUNT = TREES.length;

// Numerical slider definitions
export const NUMERIC_FIELDS = [
  { id: "age", label: "Age", min: 18, max: 80, step: 1, unit: "years", baseline: 42 },
  { id: "sleep_duration", label: "Sleep Duration", min: 4.0, max: 10.0, step: 0.1, unit: "hrs/day", baseline: 7.2 },
  { id: "quality_of_sleep", label: "Quality of Sleep", min: 1, max: 10, step: 1, unit: "/ 10", baseline: 7 },
  { id: "physical_activity_level", label: "Physical Activity", min: 0, max: 120, step: 5, unit: "min/day", baseline: 60 },
  { id: "stress_level", label: "Stress Level", min: 1, max: 10, step: 1, unit: "/ 10", baseline: 5 },
  { id: "heart_rate", label: "Heart Rate", min: 50, max: 110, step: 1, unit: "bpm", baseline: 70 },
  { id: "daily_steps", label: "Daily Steps", min: 1000, max: 15000, step: 250, unit: "steps", baseline: 7000 },
  { id: "systolic_blood_pressure", label: "Systolic BP", min: 90, max: 180, step: 1, unit: "mmHg", baseline: 120 },
  { id: "diastolic_blood_pressure", label: "Diastolic BP", min: 60, max: 120, step: 1, unit: "mmHg", baseline: 80 },
];

// Categorical dropdown definitions (values are label-encoded for the model)
export const CATEGORICAL_FIELDS = [
  {
    id: "gender",
    label: "Gender",
    options: [
      { label: "Male", value: 0 },
      { label: "Female", value: 1 },
    ],
  },
  {
    id: "occupation",
    label: "Occupation",
    options: [
      { label: "Software Engineer / Office", value: 1 },
      { label: "Doctor / Healthcare", value: 2 },
      { label: "Teacher / Educator", value: 3 },
      { label: "Nurse / Shift Worker", value: 4 },
      { label: "Sales / Executive", value: 5 },
      { label: "Lawyer / Financial", value: 6 },
      { label: "Accountant / Admin", value: 7 },
      { label: "Scientist / Researcher", value: 8 },
      { label: "Other Professional", value: 9 },
    ],
  },
  {
    id: "bmi_category",
    label: "BMI Category",
    options: [
      { label: "Normal Weight", value: 0 },
      { label: "Overweight", value: 1 },
      { label: "Obese", value: 2 },
    ],
  },
];

export const MODEL_NAME = "SlackingAI";

export const AI_DESCRIPTION =
  "SlackingAI is the sleep-disorder screening model powering this dashboard. It is a Random Forest classifier defined in model_logic.json. Each patient profile is passed through every decision tree; each tree casts a vote for a class, and the proportion of votes determines the confidence shown. The model was trained on sleep health and lifestyle data.";

export const AI_FACTS = [
  { label: "Model Name", value: MODEL_NAME },
  { label: "Algorithm", value: "Random Forest (ensemble of decision trees)" },
  { label: "Estimators", value: `${TREE_COUNT} decision trees` },
  { label: "Input Features", value: `${FEATURE_ORDER.length}` },
  { label: "Output Classes", value: CLASSES.join(", ") },
  { label: "Train / Test Split", value: "80% Train / 20% Test" },
  { label: "Reported Accuracy", value: "88.00%" },
];

export const DEFAULT_PATIENT = {  gender: 0,
  age: 38,
  occupation: 1,
  sleep_duration: 7.2,
  quality_of_sleep: 7,
  physical_activity_level: 60,
  stress_level: 4,
  bmi_category: 0,
  heart_rate: 70,
  daily_steps: 7000,
  systolic_blood_pressure: 122,
  diastolic_blood_pressure: 80,
};

export const DEMO_PATIENTS = [
  {
    id: "healthy",
    name: "Healthy Adult",
    description: "Well-rested, active, normal vitals",
    values: {
      gender: 0, age: 32, occupation: 1, sleep_duration: 7.6, quality_of_sleep: 8,
      physical_activity_level: 75, stress_level: 3, bmi_category: 0, heart_rate: 66,
      daily_steps: 9000, systolic_blood_pressure: 116, diastolic_blood_pressure: 75,
    },
  },
  {
    id: "insomnia",
    name: "High-Stress Worker",
    description: "Low sleep quality, elevated stress",
    values: {
      gender: 1, age: 44, occupation: 5, sleep_duration: 6.3, quality_of_sleep: 5,
      physical_activity_level: 50, stress_level: 9, bmi_category: 1, heart_rate: 80,
      daily_steps: 6000, systolic_blood_pressure: 135, diastolic_blood_pressure: 88,
    },
  },
  {
    id: "apnea",
    name: "Apnea Risk Senior",
    description: "Obese, sedentary, hypertensive",
    values: {
      gender: 0, age: 50, occupation: 4, sleep_duration: 5.5, quality_of_sleep: 4,
      physical_activity_level: 30, stress_level: 8, bmi_category: 2, heart_rate: 85,
      daily_steps: 3000, systolic_blood_pressure: 140, diastolic_blood_pressure: 95,
    },
  },
];

// Traverse one decision tree and return its leaf diagnosis
function evaluateTree(node, inputVector) {
  let current = node;
  while (current && current.diagnosis === undefined) {
    current = inputVector[current.feature] <= current.threshold ? current.left : current.right;
  }
  return current ? current.diagnosis : null;
}

// Run the Random Forest over patient input: returns votes + confidence percentages
export function runModel(patient) {
  const inputVector = FEATURE_ORDER.map((f) => Number(patient[f]));

  const votes = {};
  CLASSES.forEach((c) => (votes[c] = 0));

  TREES.forEach((tree) => {
    const diagnosis = evaluateTree(tree, inputVector);
    if (diagnosis in votes) votes[diagnosis] += 1;
  });

  const total = TREE_COUNT || 1;
  const confidence = {};
  CLASSES.forEach((c) => (confidence[c] = (votes[c] / total) * 100));

  // Primary diagnosis = class with most votes
  let primary = CLASSES[0];
  CLASSES.forEach((c) => {
    if (votes[c] > votes[primary]) primary = c;
  });

  return { votes, confidence, primary, total };
}
