import React from "react";
import { useTranslation } from "react-i18next";
import { formatDate } from "../utils/helper";

interface TrainingListProps {
  trainingDays: any[];
  selectedDay: any | null;
  onSelect: (day: any) => void;
  guestMode?: boolean;
}

const TrainingList: React.FC<TrainingListProps> = ({
  trainingDays,
  selectedDay,
  onSelect,
  guestMode = false,
}) => {
  const { t } = useTranslation();
  const lightBlueRgbValue = "#6699ff";

  return (
    <div>
      <h2>{t("Training_Timeline_Header")}</h2>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {trainingDays.map((day, index) => {
          const isSelected = selectedDay?.Date === day.Date;

          return (
            <li
              key={index}
              style={{
                cursor: "pointer",
                padding: "10px",
                borderBottom: "1px solid #ddd",
                backgroundColor: isSelected ? lightBlueRgbValue : "transparent",
              }}
              onClick={() => onSelect(day)}
            >
              <strong>{formatDate(day.Date)}</strong>
              {!guestMode && <> - {t(day.Location)}</>}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default TrainingList;
