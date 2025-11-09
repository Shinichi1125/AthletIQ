import i18n from "../i18n";
import { Activity } from "../types";

export const formatDate = (isoDateString: string): string => {
  try {
    const date = new Date(isoDateString);
    return new Intl.DateTimeFormat(i18n.language, {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "short",
    }).format(date);
  } catch (error) {
    console.warn("Invalid date format:", isoDateString);
    return isoDateString;
  }
};

export const isActivitySprintSets = (activity: Activity): boolean => {
  if(activity.Activity.includes("(100m run + 300m jog + 400m walk)")) return true;
  if(activity.Activity.includes("(200m run + 600m jog + 400m walk)")) return true;
  if(activity.Activity.includes("(300m run + 900m jog + 400m walk)")) return true;
  if(activity.Activity.includes("(400m run + 1200m jog + 400m walk)")) return true;
  if(activity.Activity.includes("(500m run + 1500m jog + 400m walk)")) return true;
  if(activity.Activity.includes("50m_Dash")) return true;
  if(activity.Activity.includes("Time_Trial")) return true;
  if(activity.Activity.includes("High_Knees_And")) return true;
  return false;
}

export const isActivityShortSprint = (activity: Activity) => {
  if(activity.Activity.includes("100m")) return true;
  if(activity.Activity.includes("50m")) return true;
  return false;
}

export const isActivityTempoRun = (activity: Activity): boolean => {
  if(activity.Activity.includes("Tempo_Run")) return true;
  return false;
}

export const isWeightTraining = (activity: { Activity: string }) => {
  const a = activity.Activity;
  return (
    a === "Power_Clean" ||
    a === "Power_Clean_and_Jerk" ||
    a === "Hang_Power_Clean" ||
    a === "Hang_Power_Clean_and_Jerk"
  );
};

export const isRepsBasedCalisthenics = (activity: { Activity: string }) => {
  const a = activity.Activity;
  return (
    a === "Muscle_Ups" ||
    a === "Archer_Pullups"
  );
};

export const isTimeBasedCalisthenics = (activity: { Activity: string }) => {
  const a = activity.Activity;
  return (
    a === "Plank"
  );
};

export const asSeconds = (time: any): number | undefined => {
  if (!time) return undefined;
  if (typeof time === "number") return time;
  const val = typeof time.Value === "number" ? time.Value : undefined;
  const unit = (time.Unit || "").toLowerCase();
  if (val === undefined) return undefined;

  if (unit.startsWith("sec")) return val;
  if (unit.startsWith("min")) return val * 60;
  return val;
};
