import { Activity, SprintSet, StrengthSet, SingleLimbReps } from "../types";
import { FilterState, UnitValue } from "../types";
import {
  isWeightTraining,
  isActivitySprintSets,
  isActivityShortSprint,
  isActivityTempoRun,
  isRepsBasedCalisthenics,
  isTimeBasedCalisthenics,
  asSeconds,
  isSingleLimbExercise
} from "./helper";

function notesText(day: any): string {
  if (!day?.Notes) return "";
  const parts: string[] = [];
  for (const entry of day.Notes) {
    const n = entry?.note;
    if (!n) continue;
    if (Array.isArray(n)) {
      for (const piece of n) {
        if (typeof piece?.text === "string") parts.push(piece.text);
      }
    } else if (typeof n?.text === "string") {
      parts.push(n.text);
    }
  }
  return parts.join(" ");
}

export function filterTrainingDays(data: any[], filters: FilterState): any[] {
  const {
    activityName,
    activityCondition,
    timeMin, timeMax,
    splitDiffMin, splitDiffMax,
    shoes,
    startDate, endDate,
  } = filters;

  const minTime = parseFloat(timeMin);
  const maxTime = parseFloat(timeMax);
  const minDiff = parseFloat(splitDiffMin);
  const maxDiff = parseFloat(splitDiffMax);
  const minWeight = parseFloat(filters.weightMin);
  const maxWeight = parseFloat(filters.weightMax);
  const minReps   = parseFloat(filters.repsMin);
  const maxReps   = parseFloat(filters.repsMax);

  const inDateRange = (dayStr: string) => {
    const d = (dayStr || "").slice(0, 10);
    if (startDate && d < startDate) return false;
    if (endDate && d > endDate) return false;
    return true;
  };

  const q = (filters.noteQuery || "").trim().toLowerCase();
  let searchWordIncluded = false;

  return data.filter((trainingDay) => {
    if (!inDateRange(trainingDay.Date)) return false;
    if (q) {
      const blob = notesText(trainingDay).toLowerCase();
      searchWordIncluded = blob.includes(q);
      if (!blob.includes(q)) return false;
    }
    return trainingDay.Activities.some((activity: Activity) => {
      if (activityName === '') return searchWordIncluded;
      if (activityName !== activity.Activity) return false;

      if (activity.Activity === "One_Hand_Pullups" && activityCondition) {
        if (activity.Condition !== activityCondition) return false;
      }

      if (isActivityShortSprint(activity) && activity.Sets) {
        if (shoes && activity.Shoes !== shoes) return false;
        return (activity.Sets as SprintSet[]).some((set) => {
          const t = set.Time;
          return (isNaN(minTime) || t >= minTime) && (isNaN(maxTime) || t <= maxTime);
        });
      }

      if (isActivityTempoRun(activity)) {
        const t = activity.Time ?? 0;
        return (isNaN(minTime) || t >= minTime) && (isNaN(maxTime) || t <= maxTime);
      }

      if (isActivitySprintSets(activity) && !isActivityShortSprint(activity) && activity.Sets) {
        if (shoes && activity.Shoes !== shoes) return false;

        return (activity.Sets as SprintSet[]).some((set) => {
          const t = set.Time;
          const timeOK = (isNaN(minTime) || t >= minTime) && (isNaN(maxTime) || t <= maxTime);

          let splitOK = true;
          if (set.Splits && set.Splits.length === 2 && !isNaN(minDiff) && !isNaN(maxDiff)) {
            const firstSplit = set.Splits[0];
            const secondSplit = set.Splits[1];
            if (firstSplit.First_Half && secondSplit.Second_Half) {
              const diff = (secondSplit.Second_Half.Time ?? 0) - (firstSplit.First_Half.Time ?? 0);
              splitOK = diff >= minDiff && diff <= maxDiff;
            }
          } else if(!set.Splits && !isNaN(minDiff) && !isNaN(maxDiff)) {
            splitOK = false;
          }

          return timeOK && splitOK;
        });
      }

      if (isWeightTraining(activity)) {
        if (activity.Sets && (activity.Sets as StrengthSet[]).length > 0) {
          return (activity.Sets as StrengthSet[]).some((set) => {
            const weightUnitValue = activity.Weight as UnitValue | undefined;
            const weight = weightUnitValue?.Value;
            const reps = (set as any).Reps as number | undefined;

            const weightOK =
              (isNaN(minWeight) || (weight ?? Number.NEGATIVE_INFINITY) >= minWeight) &&
              (isNaN(maxWeight) || (weight ?? Number.POSITIVE_INFINITY) <= maxWeight);

            const repsOK =
              (isNaN(minReps) || (reps ?? Number.NEGATIVE_INFINITY) >= minReps) &&
              (isNaN(maxReps) || (reps ?? Number.POSITIVE_INFINITY) <= maxReps);

            const hasWeightFilter = !isNaN(minWeight) || !isNaN(maxWeight);
            const hasRepsFilter = !isNaN(minReps) || !isNaN(maxReps);

            if (hasWeightFilter && hasRepsFilter) return weightOK && repsOK;
            if (hasWeightFilter) return weightOK;
            if (hasRepsFilter) return repsOK;
            return true;
          });
        }
      }

      if (isSingleLimbExercise(activity)) {
        if (activity.Activity === "One_Hand_Pullups" && activityCondition) {
          if (activity.Condition !== activityCondition) return false;
        }

        const hasWeight = !Number.isNaN(minWeight) || !Number.isNaN(maxWeight);
        const hasReps   = !Number.isNaN(minReps)   || !Number.isNaN(maxReps);

        if (!hasWeight && !hasReps) return true;

        if (activity.Sets && (activity.Sets as StrengthSet[]).length > 0) {
          return (activity.Sets as StrengthSet[]).some((set) => {
            const weightUnitValue = activity.Weight as UnitValue | undefined;
            const weight = weightUnitValue?.Value;

            const r = set.Reps;
            const repsValues: number[] =
              typeof r === "number"
                ? [r]
                : r && typeof r === "object"
                ? Object.values(r as SingleLimbReps).filter((v): v is number => typeof v === "number")
                : [];

            const weightOK =
              !hasWeight ||
              ((weight ?? Number.NEGATIVE_INFINITY) >= (Number.isNaN(minWeight) ? -Infinity : minWeight) &&
               (weight ?? Number.POSITIVE_INFINITY) <= (Number.isNaN(maxWeight) ? +Infinity : maxWeight));

            const repsOK =
              !hasReps ||
              repsValues.some((val) =>
                (Number.isNaN(minReps) || val >= minReps) &&
                (Number.isNaN(maxReps) || val <= maxReps)
              );

            if (hasWeight && hasReps) return weightOK && repsOK;
            if (hasWeight) return weightOK;
            return repsOK;
          });
        }
      }

      if (isRepsBasedCalisthenics(activity)) {
        const hasReps = !Number.isNaN(minReps) || !Number.isNaN(maxReps);
        if (!hasReps) return true;
        if (activity.Sets && (activity.Sets as any[]).length > 0) {
          return (activity.Sets as any[]).some((set) => {
            const reps = typeof set.Reps === "number" ? set.Reps : undefined;
            const repsOK =
              !hasReps ||
              ((reps ?? Number.NEGATIVE_INFINITY) >= (Number.isNaN(minReps) ? -Infinity : minReps) &&
               (reps ?? Number.POSITIVE_INFINITY) <= (Number.isNaN(maxReps) ? +Infinity : maxReps));
            return repsOK;
          });
        }
      }

      if (isTimeBasedCalisthenics(activity)) {
        const hasTime = !Number.isNaN(minTime) || !Number.isNaN(maxTime);
        if (!hasTime) return true;
        if (activity.Sets && (activity.Sets as any[]).length > 0) {
          return (activity.Sets as any[]).some((set) => {
            const secs = asSeconds(set.Time);
            const timeOK =
              !hasTime ||
              ((secs ?? Number.NEGATIVE_INFINITY) >= (Number.isNaN(minTime) ? -Infinity : minTime) &&
               (secs ?? Number.POSITIVE_INFINITY) <= (Number.isNaN(maxTime) ? +Infinity : maxTime));
            return timeOK;
          });
        }
      }

      return true;
    })
  });
}
