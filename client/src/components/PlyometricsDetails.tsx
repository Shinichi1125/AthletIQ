import React from "react";
import { Activity } from "../types";
import { useTranslation } from "react-i18next";

interface PlyometricsProps {
  activity: Activity;
}

const PlyometricsDetails: React.FC<PlyometricsProps> = ({ activity }) => {
  const { t } = useTranslation();
  const distance = activity.Distance ? ` ${activity.Distance.Value}${activity.Distance.Unit}` : "";

  return (
    <div>
      <h4>{t(activity.Activity)}{distance}</h4>

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
                  {set.Hops && (
                    <li>{t("Hops")}: {set.Hops}</li>
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

export default PlyometricsDetails;
