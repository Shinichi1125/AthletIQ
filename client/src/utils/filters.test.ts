import { filterTrainingDays } from "./filters";
import { trainingDays } from "./__fixtures__/trainingDays";
import { FilterState } from "../types";

const makeFilters = (overrides: Partial<FilterState> = {}): FilterState => ({
  activityName: "",
  activityCondition: "",
  timeMin: "",
  timeMax: "",
  splitDiffMin: "",
  splitDiffMax: "",
  shoes: "",
  startDate: "",
  endDate: "",
  weightMin: "",
  weightMax: "",
  repsMin: "",
  repsMax: "",
  setCount: "",
  noteQuery: "",
  ...overrides,
});

describe("filterTrainingDays", () => {
  it("no filters returns the input data unchanged", () => {
    const filters = makeFilters();
    const result = filterTrainingDays(trainingDays, filters);

    expect(result).toEqual(trainingDays);
    expect(result[0]).toBe(trainingDays[0]);
  });

  it("activityName filter returns only matching days", () => {
    const filters = makeFilters({ activityName: "Plank" });
    const result = filterTrainingDays(trainingDays, filters);

    expect(result).toHaveLength(4);
    expect(result.map((day) => day.Date)).toEqual(["2024-01-01", "2024-01-03"]);
  });

  it("date range filter includes/excludes correctly", () => {
    const filters = makeFilters({ startDate: "2024-01-02", endDate: "2024-01-04" });
    const result = filterTrainingDays(trainingDays, filters);

    expect(result.map((day) => day.Date)).toEqual(["2024-01-02", "2024-01-03", "2024-01-04"]);
  });

  it("weight training + weight range + reps range behaves correctly", () => {
    const filters = makeFilters({
      activityName: "Power_Clean",
      weightMin: "90",
      weightMax: "110",
      repsMin: "2",
      repsMax: "4",
    });
    const result = filterTrainingDays(trainingDays, filters);

    expect(result.map((day) => day.Date)).toEqual(["2024-01-02"]);
  });

  it("guest data without Notes doesn't crash noteQuery logic", () => {
    const filters = makeFilters({ noteQuery: "anything" });
    const result = filterTrainingDays(trainingDays, filters);

    expect(result).toHaveLength(0);
  });
});
