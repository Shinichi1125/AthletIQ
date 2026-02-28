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

  it("time-based single-limb exercise (One_Hand_Hold) filters by condition and per-side time", () => {
    const oneHandHoldDays = [
      {
        Date: "2024-02-01",
        Activities: [
          {
            Activity: "One_Hand_Hold",
            Condition: "With_1_Finger_Support",
            Sets: [
              {
                Set: 1,
                Time: {
                  Left_Arm: { Value: 8, Unit: "seconds" },
                  Right_Arm: { Value: 12, Unit: "seconds" },
                },
              },
            ],
          },
        ],
      },
      {
        Date: "2024-02-02",
        Activities: [
          {
            Activity: "One_Hand_Hold",
            Condition: "With_2_Finger_Support",
            Sets: [
              {
                Set: 1,
                Time: {
                  Left_Arm: { Value: 7, Unit: "seconds" },
                  Right_Arm: { Value: 9, Unit: "seconds" },
                },
              },
            ],
          },
        ],
      },
    ];

    const filters = makeFilters({
      activityName: "One_Hand_Hold",
      activityCondition: "With_1_Finger_Support",
      timeMin: "10",
      timeMax: "13",
    });

    const result = filterTrainingDays(oneHandHoldDays as any[], filters);
    expect(result.map((day) => day.Date)).toEqual(["2024-02-01"]);
  });
});
