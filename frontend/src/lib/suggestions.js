// Generates clinician-facing lifestyle improvement suggestions from patient metrics + diagnosis
export function generateSuggestions(patient, primary) {
  const s = [];
  const num = (k) => Number(patient[k]);

  if (num("sleep_duration") < 7) {
    s.push({
      title: "Increase Sleep Duration",
      detail: "Patient sleeps below the recommended 7-9 hours. Encourage an earlier, consistent bedtime to extend total sleep time.",
    });
  }
  if (num("quality_of_sleep") <= 5) {
    s.push({
      title: "Improve Sleep Hygiene",
      detail: "Low reported sleep quality. Advise a dark, cool bedroom, limiting screens and caffeine before bed, and a wind-down routine.",
    });
  }
  if (num("stress_level") >= 7) {
    s.push({
      title: "Stress Management",
      detail: "Elevated stress can disrupt sleep architecture. Recommend relaxation techniques, mindfulness, or professional counselling.",
    });
  }
  if (num("physical_activity_level") < 45) {
    s.push({
      title: "Increase Physical Activity",
      detail: "Activity below 45 min/day. Suggest building toward 150 minutes of moderate exercise per week to support sleep and cardiovascular health.",
    });
  }
  if (num("daily_steps") < 7000) {
    s.push({
      title: "Raise Daily Step Count",
      detail: "Daily steps are below the 7,000 baseline. Encourage light walking sessions to gradually reach an active target of 8,000-10,000 steps.",
    });
  }
  if (num("heart_rate") > 80) {
    s.push({
      title: "Monitor Resting Heart Rate",
      detail: "Resting heart rate is elevated. Regular aerobic conditioning and stress reduction can help lower it over time.",
    });
  }
  if (num("systolic_blood_pressure") >= 130 || num("diastolic_blood_pressure") >= 85) {
    s.push({
      title: "Blood Pressure Review",
      detail: "Blood pressure is above the normal range. Recommend reduced sodium intake, regular monitoring, and clinical follow-up.",
    });
  }
  if (num("bmi_category") >= 1) {
    s.push({
      title: "Weight Management",
      detail: "BMI category is above normal. Weight reduction through diet and activity is strongly associated with reduced sleep-disorder risk.",
    });
  }

  // Diagnosis-specific guidance
  if (primary === "Sleep Apnea") {
    s.unshift({
      title: "Evaluate for Obstructive Sleep Apnea",
      detail: "Model indicates elevated apnea risk. Recommend referral for a formal sleep study (polysomnography) and discuss weight, positional therapy, and CPAP options.",
    });
  } else if (primary === "Insomnia") {
    s.unshift({
      title: "Address Insomnia Patterns",
      detail: "Model indicates insomnia indicators. Consider Cognitive Behavioural Therapy for Insomnia (CBT-I) and a consistent sleep-wake schedule.",
    });
  } else {
    s.unshift({
      title: "Maintain Healthy Sleep Habits",
      detail: "No disorder detected. Encourage the patient to maintain their current sleep, activity, and stress-management routines.",
    });
  }

  return s;
}
