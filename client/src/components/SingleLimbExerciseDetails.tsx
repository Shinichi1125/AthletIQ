import React from "react";
import { Activity, SingleLimbReps, StrengthSet } from "../types";
import { useTranslation } from "react-i18next";

interface SingleLimbProps {
  activity: Activity;
}

const SingleLimbExerciseDetails: React.FC<SingleLimbProps> = ({ activity }) => {
  const { t } = useTranslation();
  const strengthSets = activity.Sets as StrengthSet[];
  const weight = activity.Weight ? ` ${activity.Weight.Value}${activity.Weight.Unit}` : "";
  const condition = activity.Condition ? ` (${t(activity.Condition)})` : "";

  return (
    <div>
      <h4>{t(activity.Activity)}{weight}{condition}</h4>
      {strengthSets && (
        <>
          <ul>
            {strengthSets.map((set, index) => (
              <li key={index}>
                <strong>Set: {set.Set}</strong>
                <ul>
                  {set.Time && (
                    <li>
                      {t("Time")}: {set.Time.Value}{t((set.Time.Unit))}
                    </li>
                  )}
                  {typeof set.Reps === "object" && set.Reps && (
                    <>
                      {Object.entries(set.Reps as SingleLimbReps).map(([side, reps]) => (
                        <li key={side}>
                          {t(side)} {(t("Reps"))}: {reps}
                        </li>
                      ))}
                    </>
                  )}
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

export default SingleLimbExerciseDetails;
