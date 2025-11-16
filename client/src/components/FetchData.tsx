import React, { useState, useEffect } from "react";
import "../i18n";
import { useTranslation } from "react-i18next";
import { fetchTrainingData } from "../utils/api";
import TrainingList from "./TrainingList";
import TrainingDetails from "./TrainingDetails";
import Pagination from "./Pagination";
import FilterBar from "./FilterBar";
import { FilterState } from "../types";
import { filterTrainingDays } from "../utils/filters";

interface Props { idToken?: string | null; }

const initialFilters: FilterState = {
  activityName: "",
  activityCondition: "",
  timeMin: "",
  timeMax: "",
  splitDiffMin: "",
  splitDiffMax: "",
  shoes: "",
  startDate: "",
  endDate: "",
  weightMin: "",
  weightMax: "",
  repsMin: "",
  repsMax: "",
  noteQuery: "",
};

const FetchData: React.FC<Props> = ({ idToken }) => {
  const { t, i18n } = useTranslation();
  const isJapanese = i18n.language === "ja";
  const [data, setData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [selectedDay, setSelectedDay] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const updateFilters = (patch: Partial<FilterState>) =>
    setFilters((prev) => ({ ...prev, ...patch }));

  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    if (!idToken) return;
    setLoading(true);
    (async () => {
      try {
        const trainingData = await fetchTrainingData(idToken);
        setData(trainingData);
        setFilteredData(trainingData);
      } catch (err: any) {
        setError(err.message ?? String(err));
      } finally {
        setLoading(false);
      }
    })();
  }, [idToken]);

  const handleFilter = () => {
    const next = filterTrainingDays(data, filters);
    setFilteredData(next);
    setSelectedDay(null);
    setCurrentPage(1);
  };

  const handleClear = () => {
    setFilters(initialFilters);
    setFilteredData(data);
    setCurrentPage(1);
    setSelectedDay(null);
  };

  if (!idToken) return <p>{t("Please_Sign_In")}</p>;
  if (loading) return <p>{t("Loading")}</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="content-container">
      <h1>{t("Title")}</h1>

      <FilterBar
        filters={filters}
        onChange={updateFilters}
        onFilter={handleFilter}
        onClear={handleClear}
        isJapanese={isJapanese}
        t={t}
      />

      <TrainingList
        trainingDays={currentData}
        selectedDay={selectedDay}
        onSelect={(day) => setSelectedDay(selectedDay === day ? null : day)}
      />

      <Pagination
        currentPage={currentPage}
        totalItems={filteredData.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />

      {selectedDay && (
        <>
          <button onClick={() => setSelectedDay(null)} style={{ marginTop: "20px" }}>
            {t("hideDetails")}
          </button>
          <TrainingDetails
            trainingDay={selectedDay}
            highlight={{
              activityName: filters.activityName || undefined,
              noteQuery: filters.noteQuery || undefined,
            }}
          />
        </>
      )}
    </div>
  );
};

export default FetchData;
