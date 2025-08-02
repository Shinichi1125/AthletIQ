import React from "react";
import { useTranslation } from "react-i18next";
import { formatDate } from "../utils/helper";

interface TrainingListProps {
  trainingDays: any[];
  onSelect: (day: any) => void;
}

const TrainingList: React.FC<TrainingListProps> = ({ trainingDays, onSelect }) => {
  const { t } = useTranslation();

  return (
    <div>
      <h2>{t("Training_Timeline_Header")}</h2>
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
            <strong>{formatDate(day.Date)}</strong> - {t(day.Location)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TrainingList;
