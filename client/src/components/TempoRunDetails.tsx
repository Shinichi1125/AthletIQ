import React from "react";
import { Activity, TempoRunSplits } from "../types";

interface TempoRunProps {
  activity: Activity;
}

const TempoRunDetails: React.FC<TempoRunProps> = ({ activity }) => {
  return (
    <div>
      <h4>{activity.Activity}</h4>
      <p><strong>Time:</strong> {activity.Time}秒</p>
      {activity.Splits && (
        <>
          <h5>Splits:</h5>
          <ul>
            {Object.entries(activity.Splits as TempoRunSplits).map(([key, value]) => (
              <li key={key}>
                {`${key}: ${value}秒`}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default TempoRunDetails;
