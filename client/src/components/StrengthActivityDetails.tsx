import React from "react";
import { Activity, StrengthSet } from "../types";

interface StrengthActivityProps {
  activity: Activity;
}

const StrengthActivityDetails: React.FC<StrengthActivityProps> = ({ activity }) => {
  return (
    <div>
      <h4>{activity.Activity}</h4>
      {activity.Weight && (
        <p><strong>Weight:</strong> {activity.Weight.Value} {activity.Weight.Unit}</p>
      )}
      {activity.Sets && (
        <>
          <h5>Sets:</h5>
          <ul>
            {(activity.Sets as StrengthSet[]).map((set) => (
              <li key={set.Set}>
                <strong>Set {set.Set}:</strong>
                {set.Reps && typeof set.Reps === "object"
                  ? Object.entries(set.Reps).map(([side, reps]) => (
                      <span key={side}>{side}: {reps} reps </span>
                    ))
                  : <span>{set.Reps} reps</span>}
                {set.Hops && <span> - {set.Hops} hops</span>}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default StrengthActivityDetails;
