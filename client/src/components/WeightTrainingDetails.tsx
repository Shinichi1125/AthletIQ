import React from "react";
import { Activity, SingleLimbReps } from "../types";

interface WeightTrainingProps {
  activity: Activity;
}

const WeightTrainingDetails: React.FC<WeightTrainingProps> = ({ activity }) => {
  return (
    <div>
      <h4>{activity.Activity}</h4>

      {activity.Condition && (
        <p><strong>Condition:</strong> {activity.Condition}</p>
      )}

      {activity.Weight && (
        <p>
          <strong>Weight:</strong> {activity.Weight.Value} {activity.Weight.Unit}
        </p>
      )}

      {activity.Distance && (
        <p>
          <strong>Distance:</strong> {activity.Distance.Value} {activity.Distance.Unit}
        </p>
      )}

      {activity.Reps && (
        <p><strong>Reps:</strong> {activity.Reps}</p>
      )}

      {activity.Sets && (
        <>
          <h5>Sets:</h5>
          <ul>
            {activity.Sets.map((set: any, index: number) => (
              <li key={index}>
                <strong>Set {set.Set}</strong>
                <ul>
                  {typeof set.Reps === "object" && set.Reps && (
                    <>
                      {Object.entries(set.Reps as SingleLimbReps).map(([side, reps]) => (
                        <li key={side}>{side}: {reps} reps</li>
                      ))}
                    </>
                  )}
                  {typeof set.Reps === "number" && (
                    <li>Reps: {set.Reps}</li>
                  )}
                  {set.Time && (
                    <li>Time: {set.Time.Value} {set.Time.Unit}</li>
                  )}
                  {set.Hops && (
                    <li>Hops: {set.Hops}</li>
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

export default WeightTrainingDetails;
