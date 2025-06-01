import React from "react";
import SingleLimbExerciseDetails from "./SingleLimbExerciseDetails";
import WeightTrainingDetails from "./WeightTrainingDetails";
import TempoRunDetails from "./TempoRunDetails";
import SprintSetDetails from "./SprintSetDetails";
import { useTranslation } from "react-i18next";
import CalisthenicsDetails from "./CalisthenicsDetails";
import PlyometricsDetails from "./PlyometricsDetails";

interface TrainingDetailsProps {
  trainingDay: any;
}

const TrainingDetails: React.FC<TrainingDetailsProps> = ({ trainingDay }) => {
  const { t } = useTranslation();

  return (
    <div style={{ marginTop: "20px", padding: "15px", border: "1px solid #ddd" }}>
      <h2><strong>{t("Date")}:</strong> {trainingDay.Date}</h2>
      <p><strong>{t("Weather")}:</strong> {t(trainingDay.Weather)}</p>
      <p><strong>{t("Location")}:</strong> {t(trainingDay.Location)}</p>
      <p><strong>{t("Training_Time")}:</strong> {trainingDay.Time?.Start} - {trainingDay.Time?.End}</p>

      <h3>{t("Activities")}:</h3>
      <ul>
        {trainingDay.Activities.map((activity: any, index: number) => (
          <li key={index} style={{ marginBottom: "10px" }}>
            {(() => {
              switch (activity.Tag) {
                case "Plank":
                case "Muscle_Ups":
                  return <CalisthenicsDetails activity={activity} />;

                case "One_Hand_Pushups":
                case "Single_Leg_Squats":
                case "One_Hand_Pullups":
                  return <SingleLimbExerciseDetails activity={activity} />;

                case "Power_Clean":
                case "Clean_and_Jerk":
                case "Hang_Clean":
                  return <WeightTrainingDetails activity={activity} />;

                case "Pogo_Skips":
                case "Scissors_Hop_Skips":
                  return <PlyometricsDetails activity={activity} />;

                case "400m_Tempo_Run":
                  return <TempoRunDetails activity={activity} />;
                
                case "Sprint_Sets":
                  return <SprintSetDetails activity={activity} />;

                case "Stretching":
                  return <h4>{t(activity.Activity)}</h4>;

                default:
                  return <pre>{JSON.stringify(activity, null, 2)}</pre>;
              }
            })()}
          </li>
        ))}
      </ul>

      {trainingDay.Notes && (
        <>
          <h3>Notes</h3>
          {trainingDay.Notes.map((noteObj: any, index: number) => {
            const noteData = noteObj.note;
            if (Array.isArray(noteData)) {
              return (
                <p key={index}>
                  {noteData.map((note: any, i: number) => (
                    <span key={i}>
                      {note.link ? (
                        <a href={note.link} target="_blank" rel="noopener noreferrer">
                          {note.text}
                        </a>
                      ) : note.text}
                    </span>
                  ))}
                </p>
              );
            } else {
              return <p key={index}>{noteData.text}</p>;
            }
          })}
        </>
      )}
    </div>
  );
};

export default TrainingDetails;
