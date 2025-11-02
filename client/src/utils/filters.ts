import { Activity, SprintSet } from "../types";
import { FilterState } from "../types";
import { isActivitySprintSets, isActivityShortSprint, isActivityTempoRun } from "./helper";

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

  const inDateRange = (dayStr: string) => {
    const d = (dayStr || "").slice(0, 10);
    if (startDate && d < startDate) return false;
    if (endDate && d > endDate) return false;
    return true;
  };

  return data.filter((trainingDay) =>
    inDateRange(trainingDay.Date) &&
    trainingDay.Activities.some((activity: Activity) => {
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
          }

          return timeOK && splitOK;
        });
      }

      return true;
    })
  );
}
