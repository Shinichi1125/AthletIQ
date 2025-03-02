import React from "react";
import { Activity, SingleLimbReps, StrengthSet } from "../types";

interface SingleLimbProps {
  activity: Activity;
}

const SingleLimbExerciseDetails: React.FC<SingleLimbProps> = ({ activity }) => {
  const strengthSets = activity.Sets as StrengthSet[];

  return (
    <div>
      <h4>{activity.Activity}</h4>
      {strengthSets && (
        <>
          <h5>Sets:</h5>
          <ul>
            {strengthSets.map((set, index) => (
              <li key={index}>
                <strong>Set: {set.Set}</strong>
                <ul>
                  {set.Time && (
                    <li>
                      Time: {set.Time.Value} {set.Time.Unit}
                    </li>
                  )}
                  {typeof set.Reps === "object" && set.Reps && (
                    <>
                      {Object.entries(set.Reps as SingleLimbReps).map(([side, reps]) => (
                        <li key={side}>
                          {side}: {reps} reps
                        </li>
                      ))}
                    </>
                  )}
                  {typeof set.Reps === "number" && (
                    <li>Reps: {set.Reps}</li>
                  )}
                  {set.Weight && (
                    <li>
                      Weight: {set.Weight.Value} {set.Weight.Unit}
                    </li>
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

export default SingleLimbExerciseDetails;
