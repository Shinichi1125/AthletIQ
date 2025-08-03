import i18n from "../i18n";

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

export const isActivitySprintSets = (activity: any): boolean => {
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