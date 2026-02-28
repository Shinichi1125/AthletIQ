import { Activity, SprintSet, StrengthSet, SingleLimbReps, SingleLimbTime } from "../types";
import { FilterState, UnitValue } from "../types";
import {
  isWeightTraining,
  isActivitySprintSets,
  isActivityShortSprint,
  isActivityTempoRun,
  isRepsBasedCalisthenics,
  isTimeBasedCalisthenics,
  asSeconds,
  isRepsBasedSingleLimbExercise,
  isTimeBasedSingleLimbExercise
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
    setCount,
  } = filters;

  const minTime = parseFloat(timeMin);
  const maxTime = parseFloat(timeMax);
  const minDiff = parseFloat(splitDiffMin);
  const maxDiff = parseFloat(splitDiffMax);
  const minWeight = parseFloat(filters.weightMin);
  const maxWeight = parseFloat(filters.weightMax);
  const minReps   = parseFloat(filters.repsMin);
  const maxReps   = parseFloat(filters.repsMax);
  const targetSetCount = parseInt(setCount, 10);
  const requiresSetCount = !Number.isNaN(targetSetCount) && targetSetCount > 0;

  const inDateRange = (dayStr: string) => {
    const d = (dayStr || "").slice(0, 10);
    if (startDate && d < startDate) return false;
    if (endDate && d > endDate) return false;
    return true;
  };

  const q = (filters.noteQuery || "").trim().toLowerCase();

  const hasMatchingSets = <T,>(sets: T[] | undefined, predicate: (set: T) => boolean) => {
    if (!sets || sets.length === 0) return false;
    let matches = 0;
    for (const set of sets) {
      if (predicate(set)) matches += 1;
    }
    if (matches === 0) return false;
    if (requiresSetCount) return matches >= targetSetCount;
    return true;
  };

  return data.filter((trainingDay) => {
    if (!inDateRange(trainingDay.Date)) return false;
    if (q) {
      const blob = notesText(trainingDay).toLowerCase();
      if (!blob.includes(q)) return false;
    }
    return trainingDay.Activities.some((activity: Activity) => {
      if (activityName === '') return true;
      if (activityName !== activity.Activity) return false;

      if ((activity.Activity === "One_Hand_Pullups" || activity.Activity === "One_Hand_Hold") && activityCondition) {
        if (activity.Condition !== activityCondition) return false;
      }

      if (isActivityShortSprint(activity) && activity.Sets) {
        if (shoes && activity.Shoes !== shoes) return false;
        return hasMatchingSets(activity.Sets as SprintSet[], (set) => {
          const t = set.Time;
          return (isNaN(minTime) || t >= minTime) && (isNaN(maxTime) || t <= maxTime);
        });
      }

      if (isActivityTempoRun(activity)) {
        if (requiresSetCount) return false;
        const t = activity.Time ?? 0;
        return (isNaN(minTime) || t >= minTime) && (isNaN(maxTime) || t <= maxTime);
      }

      if (isActivitySprintSets(activity) && !isActivityShortSprint(activity) && activity.Sets) {
        if (shoes && activity.Shoes !== shoes) return false;

        return hasMatchingSets(activity.Sets as SprintSet[], (set) => {
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
          return hasMatchingSets(activity.Sets as StrengthSet[], (set) => {
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

        if (requiresSetCount) return false;
      }

      if (isRepsBasedSingleLimbExercise(activity)) {
        const hasWeight = !Number.isNaN(minWeight) || !Number.isNaN(maxWeight);
        const hasReps   = !Number.isNaN(minReps)   || !Number.isNaN(maxReps);

        if (!hasWeight && !hasReps && !requiresSetCount) return true;

        if (activity.Sets && (activity.Sets as StrengthSet[]).length > 0) {
          return hasMatchingSets(activity.Sets as StrengthSet[], (set) => {
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

        return requiresSetCount ? false : !hasWeight && !hasReps;
      }

      if (isTimeBasedSingleLimbExercise(activity)) {
        const hasWeight = !Number.isNaN(minWeight) || !Number.isNaN(maxWeight);
        const hasTime = !Number.isNaN(minTime) || !Number.isNaN(maxTime);

        if (!hasWeight && !hasTime && !requiresSetCount) return true;

        if (activity.Sets && (activity.Sets as StrengthSet[]).length > 0) {
          return hasMatchingSets(activity.Sets as StrengthSet[], (set) => {
            const weightUnitValue = activity.Weight as UnitValue | undefined;
            const weight = weightUnitValue?.Value;

            const timeValues = (() => {
              if (!set.Time || typeof set.Time !== "object") return [] as number[];
              if ("Value" in set.Time && typeof set.Time.Value === "number") {
                const secs = asSeconds(set.Time);
                return typeof secs === "number" ? [secs] : [];
              }

              return Object.values(set.Time as SingleLimbTime)
                .map((unitValue) => asSeconds(unitValue))
                .filter((secs): secs is number => typeof secs === "number");
            })();

            const weightOK =
              !hasWeight ||
              ((weight ?? Number.NEGATIVE_INFINITY) >= (Number.isNaN(minWeight) ? -Infinity : minWeight) &&
               (weight ?? Number.POSITIVE_INFINITY) <= (Number.isNaN(maxWeight) ? +Infinity : maxWeight));

            const timeOK =
              !hasTime ||
              timeValues.some((secs) =>
                (Number.isNaN(minTime) || secs >= minTime) &&
                (Number.isNaN(maxTime) || secs <= maxTime)
              );

            if (hasWeight && hasTime) return weightOK && timeOK;
            if (hasWeight) return weightOK;
            return timeOK;
          });
        }

        return requiresSetCount ? false : !hasWeight && !hasTime;
      }

      if (isRepsBasedCalisthenics(activity)) {
        const hasReps = !Number.isNaN(minReps) || !Number.isNaN(maxReps);
        const shouldCheckSets = hasReps || requiresSetCount;
        if (!shouldCheckSets) return true;
        if (activity.Sets && (activity.Sets as any[]).length > 0) {
          return hasMatchingSets(activity.Sets as any[], (set) => {
            if (!hasReps) return true;
            const reps = typeof set.Reps === "number" ? set.Reps : undefined;
            const repsOK =
              ((reps ?? Number.NEGATIVE_INFINITY) >= (Number.isNaN(minReps) ? -Infinity : minReps) &&
               (reps ?? Number.POSITIVE_INFINITY) <= (Number.isNaN(maxReps) ? +Infinity : maxReps));
            return repsOK;
          });
        }

        return false;
      }

      if (isTimeBasedCalisthenics(activity)) {
        const hasTime = !Number.isNaN(minTime) || !Number.isNaN(maxTime);
        const shouldCheckSets = hasTime || requiresSetCount;
        if (!shouldCheckSets) return true;
        if (activity.Sets && (activity.Sets as any[]).length > 0) {
          return hasMatchingSets(activity.Sets as any[], (set) => {
            if (!hasTime) return true;
            const secs = asSeconds(set.Time);
            const timeOK =
              ((secs ?? Number.NEGATIVE_INFINITY) >= (Number.isNaN(minTime) ? -Infinity : minTime) &&
               (secs ?? Number.POSITIVE_INFINITY) <= (Number.isNaN(maxTime) ? +Infinity : maxTime));
            return timeOK;
          });
        }

        return false;
      }

      if (requiresSetCount) {
        const sets = activity.Sets as any[] | undefined;
        if (!sets || sets.length < targetSetCount) return false;
      }

      return true;
    })
  });
}
