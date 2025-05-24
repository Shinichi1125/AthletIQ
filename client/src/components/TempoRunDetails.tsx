import React from "react";
import { Activity, TempoRunSplits } from "../types";
import { useTranslation } from "react-i18next";

interface TempoRunProps {
  activity: Activity;
}

const TempoRunDetails: React.FC<TempoRunProps> = ({ activity }) => {
  const { t } = useTranslation();

  return (
    <div>
      <h4>{activity.Activity}</h4>
      <p><strong>{t("time")}:</strong> {activity.Time}{t("seconds")}</p>
      {activity.Splits && (
        <>
          <ul>
            {Object.entries(activity.Splits as TempoRunSplits).map(([key, value]) => (
              <li key={key}>
                {t(key)}: {value}{t("seconds")}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default TempoRunDetails;
