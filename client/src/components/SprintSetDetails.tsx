import React from "react";
import { Activity, SprintSet } from "../types";

interface SprintSetProps {
  activity: Activity;
}

const SprintSetDetails: React.FC<SprintSetProps> = ({ activity }) => {
  return (
    <div>
      <h4>{activity.Activity}</h4>
      <p><strong>Shoes:</strong> {activity.Shoes}</p>

      {activity.Sets && (
        <>
          <h5>Sets:</h5>
          <ul>
            {(activity.Sets as SprintSet[]).map((set, index) => (
              <li key={index}>
                <strong>Set {set.Set}</strong>
                <ul>
                  <li>Time: {set.Time}秒</li>
                  <li>Steps: {set.Steps}歩</li>
                  {set.Splits && (
                    <>
                      <li><strong>Splits:</strong></li>
                      <ul>
                        {set.Splits.map((split, i) => {
                          const [key, val] = Object.entries(split)[0];
                          return (
                            <li key={i}>
                              {key}: {val.Time}秒, Steps: {val.Steps}歩
                            </li>
                          );
                        })}

                        {set.Splits.length === 2 && (() => {
                          const firstHalf = Object.values(set.Splits[0])[0];
                          const secondHalf = Object.values(set.Splits[1])[0];
                          const diff = secondHalf.Time - firstHalf.Time;
                          const sign = diff > 0 ? "+" : diff < 0 ? "-" : "";
                          const formattedDiff = `${sign}${Math.abs(diff).toFixed(1)}s`;

                          let color = "gray";
                          if (diff > 0) color = "red";
                          else if (diff < 0) color = "green";

                          return (
                            <li>
                              Split difference:{" "}
                              <span style={{ color }}>{formattedDiff}</span>
                            </li>
                          );
                        })()}
                      </ul>
                    </>
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

export default SprintSetDetails;
