import React from "react";
import { Activity, SprintSet } from "../types";
import { useTranslation } from "react-i18next";
import { isActivityShortSprint } from "../utils/helper";

interface SprintSetProps {
  activity: Activity;
}

const SprintSetDetails: React.FC<SprintSetProps> = ({ activity }) => {
  const { t } = useTranslation();
  const shoes = activity.Shoes ? ` ${t(activity.Shoes)}` : "";
  const lightGreenRgbValue = "#72E972";

  const decimalPlace: number = isActivityShortSprint(activity) ? 2 : 1;

  return (
    <div>
      <h4>{t(activity.Activity)}</h4>
      {activity.Shoes && <p><strong>{t("Shoes")}:</strong> {shoes}</p>}

      {activity.Sets && (
        <>
          <ul>
            {(activity.Sets as SprintSet[]).map((set, index) => (
              <li key={index}>
                <strong>Set {set.Set}</strong>
                <ul>
                  <li>{t("Time")}: {set.Time.toFixed(decimalPlace)}{t("Seconds")}</li>
                  {set.Steps && <li>{t("Steps")}: {set.Steps}{t("Unit_Steps")}</li>}
                  {set.Splits && (
                    <>
                      <li>{t("Splits")}:</li>
                      <ul>
                        {set.Splits.map((split, i) => {
                          const [key, val] = Object.entries(split)[0];
                          const steps = val.Steps ? `, ${val.Steps}${t("Unit_Steps")}` : "";
                          return (
                            <li key={i}>
                              {t(key)}: {val.Time.toFixed(decimalPlace)}{t("Seconds")}{steps}
                            </li>
                          );
                        })}

                        {set.Splits.length === 2 && (() => {
                          const firstHalf = Object.values(set.Splits[0])[0];
                          const secondHalf = Object.values(set.Splits[1])[0];
                          const diff = secondHalf.Time - firstHalf.Time;
                          const sign = diff > 0 ? "+" : diff < 0 ? "-" : "";
                          const formattedDiff = `${sign}${Math.abs(diff).toFixed(decimalPlace)}${t("Seconds")}`;

                          let color = "yellow";
                          if (diff > 0) color = "red";
                          else if (diff < 0) color = lightGreenRgbValue;

                          return (
                            <li>
                              {t("Split_Difference")}:{" "}
                              <span style={{ color }}>{formattedDiff}</span>
                            </li>
                          );
                        })()}
                      </ul>
                    </>
                  )}
                </ul>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default SprintSetDetails;
