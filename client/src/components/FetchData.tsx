import React, { useState, useEffect } from "react";
import { fetchTrainingData } from "../utils/api";
import TrainingList from "./TrainingList";
import TrainingDetails from "./TrainingDetails";

const FetchData: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [selectedDay, setSelectedDay] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const trainingData = await fetchTrainingData();
        setData(trainingData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Training Data Viewer</h1>
      <TrainingList trainingDays={data} onSelect={setSelectedDay} />
      {selectedDay && <TrainingDetails trainingDay={selectedDay} />}
    </div>
  );
};

export default FetchData;
