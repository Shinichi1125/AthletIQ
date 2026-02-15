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

    expect(result).toHaveLength(2);
    expect(result.map((day) => day.Date)).toEqual(["2024-01-01", "2024-01-03"]);
  });
});
