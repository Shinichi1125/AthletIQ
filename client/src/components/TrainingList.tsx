import React from "react";
import "../i18n";
import { useTranslation } from "react-i18next";

interface TrainingListProps {
  trainingDays: any[];
  onSelect: (day: any) => void;
}

const TrainingList: React.FC<TrainingListProps> = ({ trainingDays, onSelect }) => {
  const { t } = useTranslation();

  return (
    <div>
      <h2>{t("trainingTimelineHeader")}</h2>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {trainingDays.map((day, index) => (
          <li
            key={index}
            style={{
              cursor: "pointer",
              padding: "10px",
              borderBottom: "1px solid #ddd",
            }}
            onClick={() => onSelect(day)}
          >
            <strong>{day.Date}</strong> - {t(day.Location)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TrainingList;
