import React from "react";

interface TrainingListProps {
  trainingDays: any[];
  onSelect: (day: any) => void;
}

const TrainingList: React.FC<TrainingListProps> = ({ trainingDays, onSelect }) => {
  return (
    <div>
      <h2>Training Timeline</h2>
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
            <strong>{day.Date}</strong> - {day.Location}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TrainingList;
