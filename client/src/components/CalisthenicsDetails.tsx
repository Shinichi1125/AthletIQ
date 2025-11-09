import React from "react";
import { Activity } from "../types";
import { useTranslation } from "react-i18next";

interface CalisthenicsProps {
  activity: Activity;
  highlightFlag: boolean;
}

const CalisthenicsDetails: React.FC<CalisthenicsProps> = ({ activity, highlightFlag }) => {
  const { t } = useTranslation();

  return (
    <div>
      <h4><span className={highlightFlag ? "highlight-activity" : undefined}>{t(activity.Activity)}</span></h4>

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
                  {set.Time && (
                    <li>{t("Time")}: {set.Time.Value}{t(set.Time.Unit)}</li>
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

export default CalisthenicsDetails;
