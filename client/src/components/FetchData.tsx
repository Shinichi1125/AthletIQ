import React, { useState, useEffect } from "react";
import "../i18n";
import { useTranslation } from "react-i18next";
import { fetchTrainingData } from "../utils/api";
import TrainingList from "./TrainingList";
import TrainingDetails from "./TrainingDetails";

interface Props {
  idToken?: string | null;
}

const FetchData: React.FC<Props> = ({ idToken }) => {
  const { t } = useTranslation();
  const [data, setData] = useState<any[]>([]);
  const [selectedDay, setSelectedDay] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = data.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    if (!idToken) return;
    setLoading(true);
    const run = async () => {
      try {
        const trainingData = await fetchTrainingData(idToken);
        setData(trainingData);
      } catch (err: any) {
        setError(err.message ?? String(err));
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [idToken]);

  if (!idToken) return <p>{t("Please_Sign_In")}</p>;
  if (loading) return <p>{t("Loading")}</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>{t("Title")}</h1>
      <TrainingList
        trainingDays={currentData}
        onSelect={(day) => setSelectedDay(selectedDay === day ? null : day)}
      />

      <div style={{ marginTop: "20px" }}>
        <button
            onClick={() => setCurrentPage((1))}
            disabled={currentPage === 1}
            style={{ margin: "0 10px" }}
          >
          |←
        </button>
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          ←
        </button>

        <span style={{ margin: "0 10px" }}>Page {currentPage} / {(data.length / itemsPerPage)}</span>

        <button
          onClick={() =>
            setCurrentPage((prev) =>
              prev < Math.ceil(data.length / itemsPerPage) ? prev + 1 : prev
            )
          }
          disabled={currentPage >= Math.ceil(data.length / itemsPerPage)}
        >
          →
        </button>
        <button
            onClick={() => setCurrentPage((data.length / itemsPerPage))}
            disabled={currentPage === (data.length / itemsPerPage)}
            style={{ margin: "0 10px" }}
          >
          →|
        </button>
      </div>

      {selectedDay && (
        <>
          <button onClick={() => setSelectedDay(null)} style={{ marginTop: "20px" }}>{t("hideDetails")}</button>
          <TrainingDetails trainingDay={selectedDay} />
        </>
      )}
    </div>
  );
};

export default FetchData;
