import React, { useState, useEffect } from "react";
import "../i18n";
import { useTranslation } from "react-i18next";
import { fetchTrainingData } from "../utils/api";
import TrainingList from "./TrainingList";
import TrainingDetails from "./TrainingDetails";
import Pagination from "./Pagination";
import { Activity } from "../types";
import FilterBar from "./FilterBar";
import { isActivitySprintSets, isActivityShortSprint, isActivityTempoRun } from "../utils/helper";
import { SprintSet } from "../types";

interface Props {
  idToken?: string | null;
}

const FetchData: React.FC<Props> = ({ idToken }) => {
  const { t } = useTranslation();
  const [data, setData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [selectedDay, setSelectedDay] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [activityNameInput, setActivityNameInput] = useState<string>("");
  const [activityConditionInput, setActivityConditionInput] = useState("");
  const [splitDiffMinInput, setSplitDiffMinInput] = useState<string>("");
  const [splitDiffMaxInput, setSplitDiffMaxInput] = useState<string>("");
  const [timeMinInput, setTimeMinInput] = useState<string>("");
  const [timeMaxInput, setTimeMaxInput] = useState<string>("");
  const [shoesInput, setShoesInput] = useState("");

  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    if (!idToken) return;
    setLoading(true);
    const run = async () => {
      try {
        const trainingData = await fetchTrainingData(idToken);
        setData(trainingData);
        setFilteredData(trainingData);
      } catch (err: any) {
        setError(err.message ?? String(err));
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [idToken]);

  const handleFilter = () => {
    const minDiff = parseFloat(splitDiffMinInput);
    const maxDiff = parseFloat(splitDiffMaxInput);
    const minTime = parseFloat(timeMinInput);
    const maxTime = parseFloat(timeMaxInput);

    const filtered = data.filter((trainingDay) =>
      trainingDay.Activities.some((activity: Activity) => {
        if (activityNameInput !== activity.Activity) return false;

        if (activity.Activity === "One_Hand_Pullups" && activityConditionInput) {
          if (activity.Condition !== activityConditionInput) return false;
        }

        if ((isActivityShortSprint(activity) && activity.Sets)) {
          if (shoesInput && activity.Shoes !== shoesInput) return false;
          return (activity.Sets as SprintSet[]).some((set) => {
            const t = set.Time;
            return (!isNaN(minTime) ? t >= minTime : true) &&
                   (!isNaN(maxTime) ? t <= maxTime : true);
          });
        }

        if (isActivityTempoRun(activity)) {
          const t = activity.Time ?? 0;
          return (!isNaN(minTime) ? t >= minTime : true) &&
                 (!isNaN(maxTime) ? t <= maxTime : true);
        }

        if (isActivitySprintSets(activity) && !isActivityShortSprint(activity) && activity.Sets) {
          if (shoesInput && activity.Shoes !== shoesInput) return false;
          return (activity.Sets as SprintSet[]).some((set) => {
            const t = set.Time;

            const timeInRange =
              (!isNaN(minTime) ? t >= minTime : true) &&
              (!isNaN(maxTime) ? t <= maxTime : true);

            let splitInRange = true;
            if (set.Splits && set.Splits.length === 2 && !isNaN(minDiff) && !isNaN(maxDiff)) {
              const firstSplit = set.Splits[0];
              const secondSplit = set.Splits[1];

              if (firstSplit.First_Half && secondSplit.Second_Half) {
                const diff = (secondSplit.Second_Half.Time ?? 0) - (firstSplit.First_Half.Time ?? 0);
                splitInRange = diff >= minDiff && diff <= maxDiff;
              }
            }

            return timeInRange && splitInRange;
          });
        }

        return true;
      })
    );

    setFilteredData(filtered);
    setSelectedDay(null);
    setCurrentPage(1);
  };

  if (!idToken) return <p>{t("Please_Sign_In")}</p>;
  if (loading) return <p>{t("Loading")}</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>{t("Title")}</h1>

      <FilterBar
        activityName={activityNameInput}
        activityCondition={activityConditionInput}
        splitDiffMin={splitDiffMinInput}
        splitDiffMax={splitDiffMaxInput}
        timeMin={timeMinInput}
        timeMax={timeMaxInput}
        shoes={shoesInput}
        onActivityNameChange={setActivityNameInput}
        onActivityConditionChange={setActivityConditionInput}
        onSplitDiffMinChange={setSplitDiffMinInput}
        onSplitDiffMaxChange={setSplitDiffMaxInput}
        onTimeMinChange={setTimeMinInput}
        onTimeMaxChange={setTimeMaxInput}
        onShoesChange={setShoesInput}
        onFilter={handleFilter}
        onClear={() => {
          setActivityNameInput("");
          setActivityConditionInput("");
          setSplitDiffMinInput("");
          setSplitDiffMaxInput("");
          setTimeMinInput("");
          setTimeMaxInput("");
          setFilteredData(data);
          setCurrentPage(1);
          setSelectedDay(null);
        }}
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
          <button onClick={() => setSelectedDay(null)} style={{ marginTop: "20px" }}>{t("hideDetails")}</button>
          <TrainingDetails trainingDay={selectedDay} />
        </>
      )}
    </div>
  );
};

export default FetchData;
