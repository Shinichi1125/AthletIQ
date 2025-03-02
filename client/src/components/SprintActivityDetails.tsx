import React from "react";
import { Activity, SprintSet } from "../types";

interface SprintActivityProps {
  activity: Activity;
}

const SprintActivityDetails: React.FC<SprintActivityProps> = ({ activity }) => {
  return (
    <div>
      <h4>{activity.Activity}</h4>
      {activity.Shoes && <p><strong>Shoes:</strong> {activity.Shoes}</p>}
      {activity.Sets && (
        <>
          <h5>Sets:</h5>
          <ul>
            {(activity.Sets as SprintSet[]).map((set) => (
              <li key={set.Set}>
                <strong>Set {set.Set}:</strong> {set.Time} sec, {set.Steps} steps
                {set.Splits && (
                  <ul>
                    {set.Splits.map((split, i) => (
                      <li key={i}>
                        {split.First_Half && (
                          <>
                            <strong>First Half:</strong> {split.First_Half.Time} sec
                            {split.First_Half.Steps && `, ${split.First_Half.Steps} steps`}
                          </>
                        )}
                        {split.Second_Half && (
                          <>
                            <strong>Second Half:</strong> {split.Second_Half.Time} sec
                            {split.Second_Half.Steps && `, ${split.Second_Half.Steps} steps`}
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default SprintActivityDetails;
