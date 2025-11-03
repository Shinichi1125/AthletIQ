import React from "react";
import { Activity, TempoRunSplits } from "../types";
import { useTranslation } from "react-i18next";

interface TempoRunProps {
  activity: Activity;
  highlightFlag: boolean;
}

const TempoRunDetails: React.FC<TempoRunProps> = ({ activity, highlightFlag }) => {
  const { t } = useTranslation();

  return (
    <div>
      <h4><span className={highlightFlag ? "highlight-activity" : undefined}>{t(activity.Activity)}</span></h4>
      <p><strong>{t("Time")}:</strong> {activity.Time}{t("Seconds")}</p>
      {activity.Splits && (
        <>
          <ul>
            {Object.entries(activity.Splits as TempoRunSplits).map(([key, value]) => (
              <li key={key}>
                {t(key)}: {value}{t("Seconds")}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default TempoRunDetails;
