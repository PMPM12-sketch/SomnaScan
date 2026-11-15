import {
  runModel,
  DEFAULT_PATIENT,
  DEMO_PATIENTS,
  CLASSES,
  TREE_COUNT,
  NUMERIC_FIELDS,
  CATEGORICAL_FIELDS,
} from "@/lib/model";

const demo = (id) => DEMO_PATIENTS.find((d) => d.id === id).values;

describe("runModel: results", () => {
  test("returns votes that add up to the number of trees", () => {
    const r = runModel(DEFAULT_PATIENT);
    const sum = Object.values(r.votes).reduce((a, b) => a + b, 0);
    expect(sum).toBeLessThanOrEqual(TREE_COUNT);
    expect(r.total).toBe(TREE_COUNT);
  });

  test("confidence percentages are between 0 and 100 and use known classes", () => {
    const r = runModel(DEFAULT_PATIENT);
    expect(Object.keys(r.confidence).sort()).toEqual([...CLASSES].sort());
    Object.values(r.confidence).forEach((c) => {
      expect(c).toBeGreaterThanOrEqual(0);
      expect(c).toBeLessThanOrEqual(100);
    });
    expect(CLASSES).toContain(r.primary);
  });

  test("healthy demo profile screens as None", () => {
    expect(runModel(demo("healthy")).primary).toBe("None");
  });

  test("high-stress demo profile screens as Insomnia", () => {
    expect(runModel(demo("insomnia")).primary).toBe("Insomnia");
  });

  test("apnea-risk demo profile screens as Sleep Apnea", () => {
    expect(runModel(demo("apnea")).primary).toBe("Sleep Apnea");
  });

  test("same input always gives the same answer", () => {
    expect(runModel(demo("apnea"))).toEqual(runModel(demo("apnea")));
  });

  test("every slider minimum and maximum is accepted", () => {
    NUMERIC_FIELDS.forEach((f) => {
      expect(() => runModel({ ...DEFAULT_PATIENT, [f.id]: f.min })).not.toThrow();
      expect(() => runModel({ ...DEFAULT_PATIENT, [f.id]: f.max })).not.toThrow();
    });
  });

  test("every dropdown option is accepted", () => {
    CATEGORICAL_FIELDS.forEach((f) =>
      f.options.forEach((o) => {
        expect(() => runModel({ ...DEFAULT_PATIENT, [f.id]: o.value })).not.toThrow();
      })
    );
  });
});

describe("runModel: bad input is rejected, not guessed", () => {
  test("missing field", () => {
    const { age, ...rest } = DEFAULT_PATIENT;
    expect(() => runModel(rest)).toThrow(/age/i);
  });

  test("empty string", () => {
    expect(() => runModel({ ...DEFAULT_PATIENT, heart_rate: "" })).toThrow();
  });

  test("NaN and text", () => {
    expect(() => runModel({ ...DEFAULT_PATIENT, heart_rate: NaN })).toThrow();
    expect(() => runModel({ ...DEFAULT_PATIENT, heart_rate: "abc" })).toThrow();
  });

  test("null and undefined", () => {
    expect(() => runModel({ ...DEFAULT_PATIENT, age: null })).toThrow();
    expect(() => runModel({ ...DEFAULT_PATIENT, age: undefined })).toThrow();
  });

  test("out-of-range numbers", () => {
    expect(() => runModel({ ...DEFAULT_PATIENT, age: 5 })).toThrow(/between/);
    expect(() => runModel({ ...DEFAULT_PATIENT, age: 500 })).toThrow(/between/);
    expect(() => runModel({ ...DEFAULT_PATIENT, sleep_duration: -1 })).toThrow();
  });

  test("unknown dropdown value", () => {
    expect(() => runModel({ ...DEFAULT_PATIENT, gender: 7 })).toThrow();
  });

  test("no patient at all", () => {
    expect(() => runModel(null)).toThrow();
    expect(() => runModel(undefined)).toThrow();
  });
});
