import React from "react";
import { Activity } from "../types";
import { useTranslation } from "react-i18next";

interface WeightTrainingProps {
  activity: Activity;
  highlightFlag: boolean;
}

const WeightTrainingDetails: React.FC<WeightTrainingProps> = ({ activity, highlightFlag }) => {
  const { t } = useTranslation();
  const weight = activity.Weight ? ` ${activity.Weight.Value}${activity.Weight.Unit}` : "";
  const condition = activity.Condition ? ` (${activity.Condition})` : "";

  return (
    <div>
      <h4><span className={highlightFlag ? "highlight-activity" : undefined}>{t(activity.Activity)}{weight}{condition}</span></h4>

      {activity.Reps && (
        <p><strong>{t("Reps")}:</strong> {activity.Reps}</p>
      )}

      {activity.Sets && (
        <>
          <ul>
            {activity.Sets.map((set: any, index: number) => (
              <li key={index}>
                <strong>Set {set.Set}</strong>
                <ul>
                  {typeof set.Reps === "number" && (
                    <li>{t("Reps")}: {set.Reps}</li>
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

export default WeightTrainingDetails;
