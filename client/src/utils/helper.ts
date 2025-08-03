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
  if(activity.Activity.includes("(100m + 300m jog + 400m walk)")) return true;
  if(activity.Activity.includes("(200m + 600m jog + 400m walk)")) return true;
  if(activity.Activity.includes("(300m + 900m jog + 400m walk)")) return true;
  if(activity.Activity.includes("(400m + 1200m jog + 400m walk)")) return true;
  if(activity.Activity.includes("(500m + 1500m jog + 400m walk)")) return true;
  return false;
}