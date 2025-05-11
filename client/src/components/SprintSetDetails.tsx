import React from "react";
import { Activity, SprintSet } from "../types";
import { useTranslation } from "react-i18next";

interface SprintSetProps {
  activity: Activity;
}

const SprintSetDetails: React.FC<SprintSetProps> = ({ activity }) => {
  const { t } = useTranslation();

  return (
    <div>
      <h4>{activity.Activity}</h4>
      <p><strong>{t("shoes")}:</strong> {activity.Shoes}</p>

      {activity.Sets && (
        <>
          <ul>
            {(activity.Sets as SprintSet[]).map((set, index) => (
              <li key={index}>
                <strong>Set {set.Set}</strong>
                <ul>
                  <li>{t("time")}: {set.Time}{t("unitSeconds")}</li>
                  <li>{t("steps")}: {set.Steps}{t("unitSteps")}</li>
                  {set.Splits && (
                    <>
                      <li><strong>{t("splits")}:</strong></li>
                      <ul>
                        {set.Splits.map((split, i) => {
                          const [key, val] = Object.entries(split)[0];
                          return (
                            <li key={i}>
                              {t(key)}: {val.Time}{t("unitSeconds")}, {val.Steps}{t("unitSteps")}
                            </li>
                          );
                        })}

                        {set.Splits.length === 2 && (() => {
                          const firstHalf = Object.values(set.Splits[0])[0];
                          const secondHalf = Object.values(set.Splits[1])[0];
                          const diff = secondHalf.Time - firstHalf.Time;
                          const sign = diff > 0 ? "+" : diff < 0 ? "-" : "";
                          const formattedDiff = `${sign}${Math.abs(diff).toFixed(1)}${t("unitSeconds")}`;

                          let color = "gray";
                          if (diff > 0) color = "red";
                          else if (diff < 0) color = "green";

                          return (
                            <li>
                              {t("splitDifference")}:{" "}
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
