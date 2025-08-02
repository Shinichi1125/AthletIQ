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
