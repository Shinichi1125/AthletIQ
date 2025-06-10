import React from "react";
import { Activity } from "../types";
import { useTranslation } from "react-i18next";

interface CalisthenicsProps {
  activity: Activity;
}

const CalisthenicsDetails: React.FC<CalisthenicsProps> = ({ activity }) => {
  const { t } = useTranslation();

  return (
    <div>
      <h4>{t(activity.Activity)}</h4>

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
