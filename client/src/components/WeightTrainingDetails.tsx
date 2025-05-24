import React from "react";
import { Activity, SingleLimbReps } from "../types";
import { useTranslation } from "react-i18next";

interface WeightTrainingProps {
  activity: Activity;
}

const WeightTrainingDetails: React.FC<WeightTrainingProps> = ({ activity }) => {
  const { t } = useTranslation();
  const weight = activity.Weight ? ` ${activity.Weight.Value}${activity.Weight.Unit}` : "";
  const distance = activity.Distance ? ` ${activity.Distance.Value}${activity.Distance.Unit}` : "";
  const condition = activity.Condition ? ` (${activity.Condition})` : "";

  return (
    <div>
      <h4>{activity.Activity}{weight}{distance}{condition}</h4>

      {activity.Reps && (
        <p><strong>{t("reps")}:</strong> {activity.Reps}</p>
      )}

      {activity.Sets && (
        <>
          <ul>
            {activity.Sets.map((set: any, index: number) => (
              <li key={index}>
                <strong>Set {set.Set}</strong>
                <ul>
                  {typeof set.Reps === "object" && set.Reps && (
                    <>
                      {Object.entries(set.Reps as SingleLimbReps).map(([side, reps]) => (
                        <li key={side}>{side}: {reps} reps</li>
                      ))}
                    </>
                  )}
                  {typeof set.Reps === "number" && (
                    <li>{t("reps")}: {set.Reps}</li>
                  )}
                  {set.Time && (
                    <li>{t("time")}: {set.Time.Value} {set.Time.Unit}</li>
                  )}
                  {set.Hops && (
                    <li>{t("hops")}: {set.Hops}</li>
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
